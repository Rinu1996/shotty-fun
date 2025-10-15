# ===========================================
# Multi-stage Dockerfile for Shotty
# ===========================================

# Stage 1: Build Remotion video engine
FROM node:21-slim as remotion-builder

WORKDIR /app

# Install system dependencies for Remotion
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy Remotion package files
COPY ./remotion/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy Remotion source code
COPY ./remotion/ .

# Build Remotion bundle
RUN npm run bundle

# Stage 2: Build API and UI
FROM node:21-slim as builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/ui/package.json ./apps/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Stage 3: Production image
FROM node:21-slim as production

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    git \
    git-lfs \
    openssh-client \
    curl \
    jq \
    cmake \
    sqlite3 \
    openssl \
    psmisc \
    python3 \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy API files
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/dist/ ./
COPY --from=builder /app/apps/api/prisma/ ./prisma/

# Copy UI files
COPY --from=builder /app/apps/ui/dist/ ./public/

# Copy Remotion bundle
COPY --from=remotion-builder /app/dist/ ./video/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma client
RUN npx prisma generate

# Create output directory
RUN mkdir -p /app/out && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["pnpm", "start"]