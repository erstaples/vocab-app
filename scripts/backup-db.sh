#!/bin/bash

# Create backups directory if it doesn't exist
mkdir -p ./db/backups

# Generate timestamp for backup file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="./db/backups/vocab_builder_backup_${TIMESTAMP}.sql"

# Create backup
echo "Creating database backup..."
docker exec vocab-builder-db pg_dump -U vocab_user vocab_builder > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully: $BACKUP_FILE"

    # Keep only the last 5 backups
    echo "Cleaning old backups (keeping last 5)..."
    ls -t ./db/backups/vocab_builder_backup_*.sql 2>/dev/null | tail -n +6 | xargs -r rm

    echo "Current backups:"
    ls -lh ./db/backups/vocab_builder_backup_*.sql 2>/dev/null | head -5
else
    echo "❌ Backup failed!"
    exit 1
fi