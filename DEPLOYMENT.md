# Shotty - Production Deployment Guide

This guide covers deploying Shotty in a production environment.

## Prerequisites

- Docker and Docker Compose
- At least 4GB RAM
- 20GB+ storage space
- Domain name (optional, for SSL)

## Required API Keys

Before deployment, you'll need to obtain the following API keys:

1. **OpenAI API Key** - For AI text generation
   - Get from: https://platform.openai.com/api-keys
   
2. **Fireworks AI API Key** - For additional AI capabilities
   - Get from: https://fireworks.ai/
   
3. **ElevenLabs API Key** - For text-to-speech (optional)
   - Get from: https://elevenlabs.io/
   
4. **Pexels API Key** - For stock images/videos
   - Get from: https://www.pexels.com/api/

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/n4ze3m/shotty-fun.git
   cd shotty-fun
   ```

2. **Set up environment variables**
   ```bash
   cp .env.production .env
   ```
   
   Edit `.env` and fill in your API keys:
   ```env
   FIREWORKS_API_KEY="your_fireworks_key"
   OPENAI_API_KEY="your_openai_key"
   ELEVEN_LABS_API="your_elevenlabs_key"
   PEXELS_API="your_pexels_key"
   DATABASE_URL="postgresql://shotty:your_secure_password@db:5432/shotty_production"
   POSTGRES_PASSWORD="your_secure_password"
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
   ```

5. **Access the application**
   - Open http://localhost:3000 in your browser
   - Health check: http://localhost:3000/health

## Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `FIREWORKS_API_KEY` | Fireworks AI API key | `fw_xxx` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-xxx` |
| `ELEVEN_LABS_API` | ElevenLabs API key | `xxx` |
| `PEXELS_API` | Pexels API key | `xxx` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_PASSWORD` | Redis password | (none) |
| `MAX_WORKERS` | Number of worker processes | `4` |
| `QUEUE_CONCURRENCY` | Queue processing concurrency | `2` |
| `USE_TTS` | Enable text-to-speech | `false` |

## Production Deployment Options

### Option 1: Docker Compose (Recommended)

This is the simplest way to deploy Shotty with all services included.

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Option 2: Kubernetes

For Kubernetes deployment, create the following manifests:

```yaml
# shotty-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shotty
spec:
  replicas: 2
  selector:
    matchLabels:
      app: shotty
  template:
    metadata:
      labels:
        app: shotty
    spec:
      containers:
      - name: shotty
        image: your-registry/shotty:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: shotty-secrets
              key: database-url
        # Add other environment variables
        livenessProbe:
          httpGet:
            path: /live
            port: 3000
          initialDelaySeconds: 30
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
```

### Option 3: Cloud Platforms

#### Heroku
1. Create a new Heroku app
2. Add PostgreSQL and Redis add-ons
3. Set environment variables in Heroku dashboard
4. Deploy using Git or Docker

#### Railway
1. Connect your GitHub repository
2. Add PostgreSQL and Redis services
3. Configure environment variables
4. Deploy automatically

#### DigitalOcean App Platform
1. Create a new app from GitHub
2. Configure build and run commands
3. Add managed database
4. Set environment variables

## SSL/HTTPS Setup

### Using Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Using Traefik

```yaml
version: '3.9'
services:
  traefik:
    image: traefik:v2.9
    command:
      - --api.dashboard=true
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --providers.docker=true
      - --certificatesresolvers.letsencrypt.acme.email=your-email@domain.com
      - --certificatesresolvers.letsencrypt.acme.storage=/acme.json
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./acme.json:/acme.json

  shotty:
    # ... your shotty service config
    labels:
      - traefik.enable=true
      - traefik.http.routers.shotty.rule=Host(`your-domain.com`)
      - traefik.http.routers.shotty.entrypoints=websecure
      - traefik.http.routers.shotty.tls.certresolver=letsencrypt
```

## Monitoring and Maintenance

### Health Checks

The application provides several health check endpoints:

- `/health` - Basic health check
- `/health/detailed` - Detailed system status
- `/ready` - Readiness probe
- `/live` - Liveness probe

### Logging

Configure log levels using the `FASTIFY_LOG_LEVEL` environment variable:
- `error` - Only errors
- `warn` - Warnings and errors
- `info` - General information (recommended for production)
- `debug` - Detailed debugging information

### Backup Strategy

1. **Database Backups**
   ```bash
   # Create backup
   docker-compose exec db pg_dump -U shotty shotty_production > backup.sql
   
   # Restore backup
   docker-compose exec -T db psql -U shotty shotty_production < backup.sql
   ```

2. **File Backups**
   ```bash
   # Backup generated videos
   tar -czf videos-backup.tar.gz ./out/
   ```

### Scaling

#### Horizontal Scaling
- Run multiple app instances behind a load balancer
- Use shared Redis and PostgreSQL instances
- Configure session affinity if needed

#### Vertical Scaling
- Increase container memory limits
- Adjust `MAX_WORKERS` environment variable
- Monitor CPU and memory usage

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify network connectivity

2. **Redis Connection Failed**
   - Check Redis service status
   - Verify REDIS_HOST and REDIS_PORT
   - Check firewall rules

3. **Video Generation Fails**
   - Check Chromium installation
   - Verify ffmpeg availability
   - Check disk space for output directory

4. **API Rate Limits**
   - Monitor API usage
   - Implement request queuing
   - Consider upgrading API plans

### Performance Optimization

1. **Database Optimization**
   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_video_status ON "Video"(status);
   CREATE INDEX idx_video_created_at ON "Video"(created_at);
   ```

2. **Caching Strategy**
   - Enable Redis caching
   - Cache API responses
   - Use CDN for static assets

3. **Resource Limits**
   ```yaml
   # docker-compose.prod.yml
   services:
     app:
       deploy:
         resources:
           limits:
             memory: 2G
             cpus: '1.0'
           reservations:
             memory: 1G
             cpus: '0.5'
   ```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use secrets management in production
   - Rotate API keys regularly

2. **Network Security**
   - Use HTTPS in production
   - Configure firewall rules
   - Limit database access

3. **Container Security**
   - Run as non-root user (already configured)
   - Keep base images updated
   - Scan for vulnerabilities

## Support

For issues and questions:
- GitHub Issues: https://github.com/n4ze3m/shotty-fun/issues
- Documentation: https://github.com/n4ze3m/shotty-fun/wiki

## License

This project is licensed under the MIT License - see the LICENSE file for details.