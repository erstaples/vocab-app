#!/bin/bash

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore-db.sh <backup-file>"
    echo ""
    echo "Available backups:"
    ls -lh ./db/backups/vocab_builder_backup_*.sql 2>/dev/null
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will replace all current data in the database!"
read -p "Are you sure you want to restore from $BACKUP_FILE? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Restoring database from backup..."

    # Drop and recreate database to ensure clean state
    docker exec vocab-builder-db psql -U vocab_user -d postgres -c "DROP DATABASE IF EXISTS vocab_builder;"
    docker exec vocab-builder-db psql -U vocab_user -d postgres -c "CREATE DATABASE vocab_builder;"

    # Restore from backup
    docker exec -i vocab-builder-db psql -U vocab_user -d vocab_builder < "$BACKUP_FILE"

    if [ $? -eq 0 ]; then
        echo "✅ Database restored successfully from $BACKUP_FILE"
    else
        echo "❌ Restore failed!"
        exit 1
    fi
else
    echo "Restore cancelled."
fi