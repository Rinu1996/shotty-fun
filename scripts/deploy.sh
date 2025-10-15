#!/bin/bash

# Shotty Deployment Script
# This script handles the deployment of the Shotty application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="shotty"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        log_error ".env file not found. Please create it from .env.example"
        exit 1
    fi
    log_info ".env file found"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    log_info "Docker is running"
}

# Build the application
build_app() {
    log_info "Building application..."
    pnpm install
    pnpm build
    log_info "Application built successfully"
}

# Build Docker image
build_docker() {
    log_info "Building Docker image..."
    docker build -t $APP_NAME:latest .
    log_info "Docker image built successfully"
}

# Deploy with Docker Compose
deploy() {
    log_info "Deploying application..."
    docker compose -f $DOCKER_COMPOSE_FILE up -d
    log_info "Application deployed successfully"
}

# Health check
health_check() {
    log_info "Performing health check..."
    sleep 30  # Wait for services to start
    
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_info "Health check passed"
    else
        log_error "Health check failed"
        exit 1
    fi
}

# Show logs
show_logs() {
    log_info "Showing application logs..."
    docker compose -f $DOCKER_COMPOSE_FILE logs -f
}

# Stop application
stop() {
    log_info "Stopping application..."
    docker compose -f $DOCKER_COMPOSE_FILE down
    log_info "Application stopped"
}

# Main script
main() {
    case "${1:-deploy}" in
        "deploy")
            check_env_file
            check_docker
            build_app
            build_docker
            deploy
            health_check
            log_info "Deployment completed successfully!"
            log_info "Application is available at: http://localhost:3000"
            ;;
        "logs")
            show_logs
            ;;
        "stop")
            stop
            ;;
        "restart")
            stop
            sleep 5
            main deploy
            ;;
        *)
            echo "Usage: $0 {deploy|logs|stop|restart}"
            echo "  deploy  - Build and deploy the application (default)"
            echo "  logs    - Show application logs"
            echo "  stop    - Stop the application"
            echo "  restart - Restart the application"
            exit 1
            ;;
    esac
}

main "$@"