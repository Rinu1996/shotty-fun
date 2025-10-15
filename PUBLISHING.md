# Publish Guide

This repository is a pnpm monorepo with:
- apps/ui (Vite + React)
- apps/api (Fastify + Prisma + Remotion rendering)
- remotion (Remotion bundle project)

## Prerequisites
- Docker 24+
- docker compose v2
- Create a `.env` (copy `.env.example`) with required keys:
  - DATABASE_URL (PostgreSQL)
  - REDIS_HOST (default: cache)
  - PEXELS_API
  - SUPABASE_URL, SUPABASE_KEY (optional if used)
  - USE_TTS=true|false
  - WHISPER_MODEL (optional)

## Build locally
```bash
pnpm install
# Generate Prisma client
(cd apps/api && pnpm prisma generate)
# Build all
pnpm -r run build
```

The UI build will be available at `apps/ui/dist`. The API build at `apps/api/dist`.

## Docker build & run
A multi-stage Dockerfile is provided.

```bash
# Build image
DOCKER_BUILDKIT=1 docker build -t shotty:latest .

# Run with compose (recommended)
docker compose up --build
```

- App serves UI on port 3000
- APIs under `/api/v1/*`
- Generated videos written to `/app/out` (mapped to local `.out` by compose)

## Environment
Set `.env` file with:
```
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_HOST=cache
PEXELS_API=...
USE_TTS=false
SUPABASE_URL=...
SUPABASE_KEY=...
```

## Notes
- The Docker image installs Chromium and sets `PUPPETEER_EXECUTABLE_PATH` for Remotion renderer.
- UI can call API without extra config because it defaults to `/api/v1`.
- To point UI to a remote API during dev, set `VITE_API_URL`.
