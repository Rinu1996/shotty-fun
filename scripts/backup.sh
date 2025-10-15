#!/bin/bash

# Shotty Backup Script
# Creates backups of database and generated files

set -e

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup in $BACKUP_DIR..."

# Backup database
echo "🗄️ Backing up database..."
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U shotty shotty_production > "$BACKUP_DIR/database.sql"

# Backup generated files
echo "📁 Backing up generated files..."
if [ -d "./out" ]; then
    tar -czf "$BACKUP_DIR/generated_files.tar.gz" ./out/
fi

# Create backup info
cat > "$BACKUP_DIR/backup_info.txt" << EOF
Backup created: $(date)
Database: shotty_production
Files: ./out/
Docker Compose: docker-compose.prod.yml
EOF

echo "✅ Backup completed: $BACKUP_DIR"
echo "📋 Backup contents:"
ls -la "$BACKUP_DIR"