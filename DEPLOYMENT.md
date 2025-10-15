# Shotty Deployment Guide

This guide covers deploying Shotty to production environments.

## Prerequisites

- Docker and Docker Compose installed
- API keys for required services
- At least 4GB RAM and 2 CPU cores available
- 20GB+ free disk space

## Quick Deployment

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/n4ze3m/shotty-fun.git
cd shotty-fun

# Create environment file
cp .env.example .env
# Edit .env with your API keys
```

### 2. Deploy with Script

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy application
./scripts/deploy.sh deploy
```

### 3. Manual Deployment

```bash
# Install dependencies
pnpm install

# Build application
pnpm build

# Deploy with Docker Compose
docker compose -f docker-compose.prod.yml up -d
```

## Environment Configuration

### Required API Keys

| Service | Environment Variable | Required | Description |
|---------|---------------------|----------|-------------|
| OpenAI | `OPENAI_API_KEY` | Yes | For AI text generation |
| Fireworks | `FIREWORKS_API_KEY` | Yes | For AI model inference |
| ElevenLabs | `ELEVEN_LABS_API` | Yes | For text-to-speech |
| Pexels | `PEXELS_API` | No | For stock images |
| Database | `DATABASE_URL` | Yes | PostgreSQL connection string |

### Database Setup

The application uses PostgreSQL. You can either:

1. **Use included PostgreSQL** (recommended for development):
   ```bash
   # Already included in docker-compose.prod.yml
   docker compose -f docker-compose.prod.yml up postgres -d
   ```

2. **Use external PostgreSQL**:
   ```bash
   # Update DATABASE_URL in .env
   DATABASE_URL="postgresql://user:password@host:5432/shotty"
   ```

### Redis Configuration

Redis is used for job queuing. The default configuration works for most deployments:

```bash
REDIS_HOST=cache
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Production Considerations

### Resource Requirements

- **Minimum**: 4GB RAM, 2 CPU cores
- **Recommended**: 8GB RAM, 4 CPU cores
- **Storage**: 20GB+ for video processing

### Security

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Rotate keys regularly
3. **Network**: Use reverse proxy (nginx) for production
4. **SSL**: Enable HTTPS in production

### Monitoring

- Health checks: `GET /health`
- Detailed health: `GET /health/detailed`
- Logs: `docker compose logs -f`

### Scaling

For high-traffic deployments:

1. **Horizontal Scaling**: Run multiple app instances
2. **Load Balancer**: Use nginx or similar
3. **Database**: Use managed PostgreSQL
4. **Redis**: Use managed Redis service
5. **Storage**: Use cloud storage for video files

## Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Clean and rebuild
   docker system prune -f
   docker compose down
   docker compose up --build
   ```

2. **Database Connection**:
   ```bash
   # Check database status
   docker compose logs postgres
   ```

3. **Memory Issues**:
   ```bash
   # Check resource usage
   docker stats
   ```

4. **API Key Issues**:
   ```bash
   # Verify environment variables
   docker compose exec app env | grep API
   ```

### Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f cache
```

### Health Checks

```bash
# Basic health check
curl http://localhost:3000/health

# Detailed health check
curl http://localhost:3000/health/detailed
```

## Maintenance

### Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
./scripts/deploy.sh restart
```

### Backups

```bash
# Backup database
docker compose exec postgres pg_dump -U postgres shotty > backup.sql

# Backup volumes
docker run --rm -v shotty_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

### Cleanup

```bash
# Remove unused containers and images
docker system prune -f

# Remove unused volumes
docker volume prune -f
```

## Performance Optimization

### Docker Configuration

- Use multi-stage builds (already implemented)
- Enable build cache
- Use .dockerignore (already configured)

### Application Configuration

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor memory usage

### Database Optimization

- Create appropriate indexes
- Regular VACUUM operations
- Connection pooling
- Query optimization

## Support

For issues and support:

1. Check the logs first
2. Verify environment configuration
3. Check resource usage
4. Open an issue on GitHub

## Security Checklist

- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] HTTPS enabled
- [ ] Firewall configured
- [ ] Regular updates applied
- [ ] Monitoring in place
- [ ] Backups configured
- [ ] Access controls implemented