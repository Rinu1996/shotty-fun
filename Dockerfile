# Build Remotion bundle
FROM node:21-slim as video
WORKDIR /app
COPY ./remotion/package*.json ./
RUN npm ci --only=production
COPY ./remotion/ .
RUN npm run bundle

# Build server applications
FROM node:21-slim as server
WORKDIR /app

# Install pnpm
RUN npm --no-update-notifier --no-fund --global install pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/ui/package.json ./apps/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy source code
COPY . .

# Build applications
RUN pnpm build

# Production image
FROM node:21-slim
WORKDIR /app

# Create non-root user
RUN groupadd -r shotty && useradd -r -g shotty shotty

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    chromium \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install production dependencies only
COPY --from=server /app/apps/api/package.json ./package.json
RUN npm ci --only=production && npm cache clean --force

# Copy built applications
COPY --from=server /app/apps/api/dist/ ./
COPY --from=server /app/apps/api/prisma/ ./prisma/
COPY --from=server /app/apps/ui/dist/ ./public/
COPY --from=video /app/dist/ ./video/

# Create output directory
RUN mkdir -p /app/out && chown -R shotty:shotty /app

# Set environment variables
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Switch to non-root user
USER shotty

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "app.js"]