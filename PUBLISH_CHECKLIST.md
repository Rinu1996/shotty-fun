# 🚀 Shotty - Production Publishing Checklist

This checklist ensures your Shotty application is completely ready for production deployment.

## ✅ Pre-Deployment Checklist

### 🔧 Environment Setup
- [ ] Copy `.env.production` to `.env`
- [ ] Configure all required API keys:
  - [ ] `FIREWORKS_API_KEY` - Fireworks AI API key
  - [ ] `OPENAI_API_KEY` - OpenAI API key  
  - [ ] `ELEVEN_LABS_API` - ElevenLabs API key
  - [ ] `PEXELS_API` - Pexels API key
- [ ] Set secure database credentials:
  - [ ] `DATABASE_URL` - PostgreSQL connection string
  - [ ] `POSTGRES_PASSWORD` - Strong database password
- [ ] Configure Redis settings (if using external Redis)
- [ ] Set production environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `APP_MODE=production`

### 🏗️ Build Verification
- [ ] Run `pnpm install` successfully
- [ ] Run `pnpm build` without errors
- [ ] Verify API build: `cd apps/api && npm run build`
- [ ] Verify UI build: `cd apps/ui && npm run build`
- [ ] Verify Remotion bundle: `cd remotion && npm run bundle`
- [ ] Check all TypeScript compilation passes
- [ ] Verify no security vulnerabilities: `npm audit`

### 🐳 Docker Configuration
- [ ] Review `Dockerfile` for production optimizations
- [ ] Review `docker-compose.prod.yml` configuration
- [ ] Verify `.dockerignore` excludes unnecessary files
- [ ] Test Docker build: `docker-compose -f docker-compose.prod.yml build`
- [ ] Verify health checks are configured
- [ ] Check resource limits are appropriate

### 🔒 Security Hardening
- [ ] Security plugin is enabled (`apps/api/src/plugins/security.ts`)
- [ ] Rate limiting is configured for production
- [ ] Security headers are set (Helmet integration)
- [ ] CORS is properly configured
- [ ] Database connection uses SSL (if required)
- [ ] Secrets are not hardcoded in source code
- [ ] Non-root user is used in Docker container

### 🏥 Health & Monitoring
- [ ] Health check endpoints are working:
  - [ ] `GET /health` - Basic health check
  - [ ] `GET /health/detailed` - Detailed system status
  - [ ] `GET /ready` - Readiness probe
  - [ ] `GET /live` - Liveness probe
- [ ] Database connectivity check works
- [ ] Redis connectivity check works (if applicable)
- [ ] Whisper service check works
- [ ] Logging is configured appropriately

### 📊 Database Setup
- [ ] Database migrations are up to date
- [ ] Database indexes are optimized
- [ ] Database backup strategy is in place
- [ ] Connection pooling is configured
- [ ] Database credentials are secure

## 🚀 Deployment Steps

### 1. Automated Deployment (Recommended)
```bash
# Use the deployment script
./scripts/deploy.sh
```

### 2. Manual Deployment
```bash
# 1. Build the application
pnpm install --frozen-lockfile
pnpm build

# 2. Build Remotion bundle
cd remotion && npm install && npm run bundle && cd ..

# 3. Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# 4. Run database migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# 5. Verify deployment
curl -f http://localhost:3000/health
```

## ✅ Post-Deployment Verification

### 🔍 Service Health
- [ ] All containers are running: `docker-compose -f docker-compose.prod.yml ps`
- [ ] Application responds: `curl http://localhost:3000/health`
- [ ] Database is accessible
- [ ] Redis is accessible
- [ ] Whisper service is accessible
- [ ] No error logs in application

### 🧪 Functionality Testing
- [ ] Frontend loads correctly
- [ ] API endpoints respond correctly
- [ ] Video generation works end-to-end
- [ ] File upload/download works
- [ ] Queue processing works
- [ ] Audio transcription works
- [ ] Text-to-speech works (if enabled)

### 📈 Performance Verification
- [ ] Response times are acceptable
- [ ] Memory usage is within limits
- [ ] CPU usage is reasonable
- [ ] Disk space is sufficient
- [ ] Queue processing is performant

### 🔐 Security Testing
- [ ] HTTPS is working (if configured)
- [ ] Security headers are present
- [ ] Rate limiting is active
- [ ] No sensitive information in logs
- [ ] Database access is restricted

## 🛠️ Production Maintenance

### 📦 Backup Strategy
- [ ] Set up automated database backups
- [ ] Set up file backups for generated content
- [ ] Test backup restoration process
- [ ] Document backup retention policy

### 📊 Monitoring Setup
- [ ] Set up application monitoring
- [ ] Configure log aggregation
- [ ] Set up alerting for critical issues
- [ ] Monitor resource usage
- [ ] Track API usage and limits

### 🔄 Update Process
- [ ] Document update procedure
- [ ] Test updates in staging environment
- [ ] Plan for zero-downtime deployments
- [ ] Set up rollback procedures

## 🆘 Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Verify database is running
   - Check network connectivity

2. **API Keys Not Working**
   - Verify API keys are correct
   - Check API key permissions
   - Monitor API usage limits

3. **Video Generation Fails**
   - Check Chromium installation
   - Verify ffmpeg availability
   - Check disk space for output

4. **High Memory Usage**
   - Adjust container memory limits
   - Optimize queue concurrency
   - Monitor for memory leaks

### 📞 Support Resources
- [GitHub Issues](https://github.com/n4ze3m/shotty-fun/issues)
- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](README.md#api-documentation)

## 🎉 Go Live!

Once all items are checked:

1. ✅ **All checklist items completed**
2. 🚀 **Application is live and accessible**
3. 📊 **Monitoring is active**
4. 📦 **Backups are configured**
5. 🔒 **Security is verified**

**Congratulations! Your Shotty application is now production-ready! 🎉**

---

**Remember**: Keep this checklist updated as your application evolves and new requirements emerge.