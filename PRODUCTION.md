# 🚀 Production Deployment Guide

This guide covers everything you need to deploy Shotty to production.

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] All required API keys configured
- [ ] Database connection string valid
- [ ] Redis instance accessible
- [ ] Whisper service running
- [ ] SSL certificates ready (if using HTTPS)

### ✅ Security Checklist
- [ ] Strong passwords for all services
- [ ] Environment variables secured
- [ ] Firewall rules configured
- [ ] Rate limiting enabled
- [ ] Security headers configured

### ✅ Monitoring Setup
- [ ] Health check endpoints accessible
- [ ] Log aggregation configured
- [ ] Metrics collection enabled
- [ ] Alerting rules defined

## 🐳 Docker Deployment

### Quick Start
```bash
# 1. Clone and configure
git clone https://github.com/n4ze3m/shotty-fun.git
cd shotty-fun
cp .env.example .env
# Edit .env with your configuration

# 2. Deploy
./deploy.sh
```

### Manual Deployment
```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### With Nginx (Recommended for Production)
```bash
# Deploy with Nginx reverse proxy
docker-compose -f docker-compose.prod.yml --profile with-nginx up -d
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `FIREWORKS_API_KEY` | ✅ | Fireworks AI API key | `fw-...` |
| `OPENAI_API_KEY` | ✅ | OpenAI API key | `sk-...` |
| `ELEVEN_LABS_API` | ✅ | ElevenLabs API key | `...` |
| `PEXELS_API` | ✅ | Pexels API key | `...` |
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://...` |
| `REDIS_HOST` | ✅ | Redis hostname | `cache` |
| `REDIS_PORT` | ✅ | Redis port | `6379` |
| `REDIS_PASSWORD` | ❌ | Redis password | `...` |
| `WHISPER_URL` | ✅ | Whisper service URL | `http://whisper/v1/...` |
| `MODEL_ID` | ✅ | Whisper model | `openai/whisper-tiny` |
| `USE_TTS` | ❌ | Enable TTS | `false` |
| `TTS_URL` | ❌ | TTS service URL | `http://whisper/v1/...` |
| `OPENAI_BASE_PATH` | ❌ | OpenAI proxy URL | `https://openrouter.ai/api/v1` |
| `QUEUE_NAME` | ❌ | Job queue name | `shotty-prod` |
| `APP_MODE` | ❌ | Application mode | `production` |
| `RETURN_TIMESTAMPS` | ❌ | Timestamp format | `word` |

### Database Setup

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE shotty;
   CREATE USER shotty_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE shotty TO shotty_user;
   ```

2. **Run Migrations**
   ```bash
   docker exec -it shotty npx prisma migrate deploy
   ```

### Redis Setup

1. **Basic Configuration**
   ```bash
   # Start Redis with password
   redis-server --requirepass your_secure_password
   ```

2. **Production Configuration**
   ```conf
   # redis.conf
   requirepass your_secure_password
   maxmemory 512mb
   maxmemory-policy allkeys-lru
   save 900 1
   save 300 10
   save 60 10000
   ```

## 📊 Monitoring

### Health Checks

- **Application Health**: `GET /health`
- **Readiness Check**: `GET /ready`

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f cache
docker-compose logs -f whisper
```

### Metrics

The application exposes health metrics that can be consumed by monitoring systems:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

## 🔒 Security

### SSL/TLS Configuration

1. **Obtain SSL Certificates**
   ```bash
   # Using Let's Encrypt
   certbot certonly --standalone -d your-domain.com
   ```

2. **Configure Nginx**
   ```bash
   # Copy certificates to ssl directory
   cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
   cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
   ```

3. **Update nginx.conf**
   - Uncomment HTTPS server block
   - Update server_name to your domain
   - Restart nginx service

### Firewall Configuration

```bash
# Allow only necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### Environment Security

- Store sensitive data in environment variables
- Use Docker secrets for production
- Regularly rotate API keys
- Monitor access logs

## 🚨 Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   # Check logs
   docker-compose logs app
   
   # Check environment variables
   docker-compose exec app env | grep -E "(API_KEY|DATABASE|REDIS)"
   ```

2. **Database connection failed**
   ```bash
   # Test database connectivity
   docker-compose exec app npx prisma db pull
   
   # Check database logs
   docker-compose logs postgres
   ```

3. **Redis connection failed**
   ```bash
   # Test Redis connectivity
   docker-compose exec cache redis-cli ping
   
   # Check Redis logs
   docker-compose logs cache
   ```

4. **Whisper service not responding**
   ```bash
   # Test Whisper endpoint
   curl http://localhost:6391/health
   
   # Check Whisper logs
   docker-compose logs whisper
   ```

### Performance Optimization

1. **Resource Limits**
   - Adjust memory and CPU limits in docker-compose.prod.yml
   - Monitor resource usage with `docker stats`

2. **Database Optimization**
   - Add database indexes for frequently queried fields
   - Configure connection pooling

3. **Caching Strategy**
   - Enable Redis caching for frequently accessed data
   - Implement CDN for static assets

## 📈 Scaling

### Horizontal Scaling

1. **Load Balancer Configuration**
   ```yaml
   # docker-compose.scale.yml
   services:
     app:
       deploy:
         replicas: 3
   ```

2. **Database Scaling**
   - Use read replicas for read-heavy workloads
   - Implement connection pooling

3. **Queue Scaling**
   - Scale Redis instances
   - Implement queue partitioning

### Vertical Scaling

- Increase container resource limits
- Optimize application code
- Use faster storage (SSD)

## 🔄 Updates

### Rolling Updates

```bash
# Update application
git pull origin main
docker-compose build
docker-compose up -d

# Rollback if needed
docker-compose down
docker-compose up -d
```

### Database Migrations

```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Check migration status
docker-compose exec app npx prisma migrate status
```

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/n4ze3m/shotty-fun/wiki)
- **Issues**: [GitHub Issues](https://github.com/n4ze3m/shotty-fun/issues)
- **Discussions**: [GitHub Discussions](https://github.com/n4ze3m/shotty-fun/discussions)

---

**Happy Deploying! 🚀**