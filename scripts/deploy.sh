#!/bin/bash

# Shotty Production Deployment Script
# This script helps deploy Shotty to production

set -e

echo "🚀 Starting Shotty deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.production to .env and configure it."
    exit 1
fi

# Check if required environment variables are set
required_vars=("FIREWORKS_API_KEY" "OPENAI_API_KEY" "DATABASE_URL")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] && ! grep -q "^${var}=" .env; then
        echo "❌ Required environment variable $var is not set in .env"
        exit 1
    fi
done

echo "✅ Environment configuration validated"

# Build the application
echo "🔨 Building application..."
pnpm install --frozen-lockfile
pnpm build

echo "✅ Application built successfully"

# Build remotion bundle
echo "🎬 Building Remotion bundle..."
cd remotion
npm install
npm run bundle
cd ..

echo "✅ Remotion bundle created"

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "✅ Docker images built"

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    echo "📋 Checking service logs..."
    docker-compose -f docker-compose.prod.yml logs app
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📱 Application is available at: http://localhost:3000"
echo "🏥 Health check: http://localhost:3000/health"
echo "📊 Detailed status: http://localhost:3000/health/detailed"