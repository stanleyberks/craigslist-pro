#!/bin/bash

# Configuration
BACKUP_DIR="/backups/craigslist-pro"
RETENTION_DAYS=30
DB_NAME="postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup database
echo "Starting database backup..."
pg_dump "$DB_NAME" > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Compress backup
echo "Compressing backup..."
gzip "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Upload to cloud storage (example with AWS S3)
echo "Uploading to cloud storage..."
aws s3 cp "$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz" "s3://your-bucket/backups/"

# Clean up old backups
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Verify backup integrity
echo "Verifying backup..."
gunzip -t "$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"

if [ $? -eq 0 ]; then
    echo "Backup completed successfully"
    # Send success notification
    curl -X POST -H "Content-Type: application/json" \
         -d "{\"text\":\"Database backup completed successfully\"}" \
         "https://your-notification-webhook"
else
    echo "Backup verification failed"
    # Send failure notification
    curl -X POST -H "Content-Type: application/json" \
         -d "{\"text\":\"Database backup failed\"}" \
         "https://your-notification-webhook"
fi
