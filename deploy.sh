#!/bin/bash

# ===========================================
# Shotty Production Deployment Script
# ===========================================

set -e

echo "🚀 Starting Shotty deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_warning "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

print_status "Building application..."

# Build the application
docker-compose build --no-cache

print_status "Starting services..."

# Start services
docker-compose up -d

print_status "Waiting for services to be ready..."

# Wait for the application to be healthy
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_status "Application is healthy and ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Application failed to start within expected time."
        print_warning "Check logs with: docker-compose logs -f"
        exit 1
    fi
    
    print_status "Waiting for application... (attempt $attempt/$max_attempts)"
    sleep 10
    ((attempt++))
done

print_status "Deployment completed successfully!"
print_status "Application is available at: http://localhost:3000"
print_status "Health check: http://localhost:3000/health"

echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo "  View service status: docker-compose ps"