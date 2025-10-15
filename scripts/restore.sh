#!/bin/bash

# Shotty Restore Script
# Restores database and files from backup

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_directory>"
    echo "Available backups:"
    ls -la ./backups/ 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_DIR="$1"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "🔄 Restoring from backup: $BACKUP_DIR"

# Restore database
if [ -f "$BACKUP_DIR/database.sql" ]; then
    echo "🗄️ Restoring database..."
    docker-compose -f docker-compose.prod.yml exec -T db psql -U shotty shotty_production < "$BACKUP_DIR/database.sql"
    echo "✅ Database restored"
else
    echo "⚠️ No database backup found"
fi

# Restore files
if [ -f "$BACKUP_DIR/generated_files.tar.gz" ]; then
    echo "📁 Restoring generated files..."
    tar -xzf "$BACKUP_DIR/generated_files.tar.gz"
    echo "✅ Files restored"
else
    echo "⚠️ No file backup found"
fi

echo "✅ Restore completed from: $BACKUP_DIR"