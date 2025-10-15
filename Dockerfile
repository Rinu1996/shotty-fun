FROM node:21-slim as video

WORKDIR /app

COPY ./remotion/ .

RUN npm ci

RUN npm run bundle

FROM node:21-slim as server
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm --no-update-notifier --no-fund --global install pnpm

COPY . .

RUN pnpm install --frozen-lockfile=false --ignore-scripts
RUN pnpm approve-builds @ffprobe-installer/linux-x64 @prisma/client @prisma/engines @swc/core esbuild msgpackr-extract prisma protobufjs sharp

RUN pnpm -r run build
RUN pnpm -C apps/api prisma generate

FROM node:21-slim
WORKDIR /app

RUN apt-get update && apt-get -y install --no-install-recommends chromium ca-certificates sqlite3 openssl && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
WORKDIR /app
# Copy API runtime files
COPY --from=server /app/apps/api/package.json ./package.json
COPY --from=server /app/apps/api/dist/ ./dist/
COPY --from=server /app/apps/api/prisma/ ./prisma/

# Copy UI build
COPY --from=server /app/apps/ui/dist/ ./public/
# Copy Remotion bundle
COPY --from=video /app/dist/ ./video/

RUN npm ci --omit=dev || true

ENV NODE_ENV=production

CMD ["npx", "fastify", "start", "-P", "dist/app.js"]