# Multi-stage build for Remotion video processing
FROM node:21-slim as remotion-builder

WORKDIR /app

# Install system dependencies for Remotion
RUN apt-get update && apt-get install -y \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Set Chromium path for Remotion
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY ./remotion/package*.json ./
RUN npm ci --only=production

COPY ./remotion/ .
RUN npm run bundle

# Multi-stage build for the main application
FROM node:21-slim as builder

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
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/ui/package.json ./apps/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:21-slim as production

WORKDIR /app

# Install runtime dependencies
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

# Set Chromium path for Remotion
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy built application
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/dist/ ./
COPY --from=builder /app/apps/api/prisma/ ./prisma/

# Copy UI static files
COPY --from=builder /app/apps/ui/dist/ ./public/

# Copy Remotion bundle
COPY --from=remotion-builder /app/dist/ ./video/

# Copy workspace files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["pnpm", "start"]