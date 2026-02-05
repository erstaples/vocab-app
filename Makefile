.PHONY: help up down restart logs ps db-shell db-seed db-migrate db-reset db-backup db-restore clean

# Default target - show help
help:
	@echo "Vocabulary Builder - Make Commands"
	@echo "=================================="
	@echo ""
	@echo "Docker Commands:"
	@echo "  make up           - Start all services with docker-compose"
	@echo "  make down         - Stop all services (preserves data)"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - Follow container logs"
	@echo "  make ps           - Show running containers"
	@echo "  make clean        - Stop services and remove volumes (WARNING: deletes all data)"
	@echo ""
	@echo "Database Commands:"
	@echo "  make db-shell     - Open PostgreSQL shell"
	@echo "  make db-migrate   - Run database migrations"
	@echo "  make db-seed      - Run database seeds"
	@echo "  make db-reset     - Drop and recreate database, run migrations and seeds"
	@echo "  make db-backup    - Create a database backup"
	@echo "  make db-restore   - Restore from latest backup"
	@echo "  make db-status    - Show database table counts"
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev          - Start services and follow logs"
	@echo "  make fresh        - Clean start: reset database and seed"

# Docker compose commands
up:
	@echo "Starting services..."
	@docker-compose up -d
	@echo "Waiting for database to be ready..."
	@sleep 3
	@docker exec vocab-builder-db pg_isready -U vocab_user -d vocab_builder > /dev/null 2>&1 || (echo "Database not ready yet, waiting..." && sleep 2)
	@echo "Services started successfully!"
	@docker-compose ps

down:
	@echo "Stopping services..."
	@docker-compose down
	@echo "Services stopped. Data is preserved in Docker volumes."

restart:
	@echo "Restarting services..."
	@docker-compose restart
	@echo "Services restarted."

logs:
	@docker-compose logs -f

ps:
	@docker-compose ps

clean:
	@echo "WARNING: This will delete all data!"
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		echo "All services stopped and data removed."; \
	else \
		echo "Cancelled."; \
	fi

# Database commands
db-shell:
	@docker exec -it vocab-builder-db psql -U vocab_user -d vocab_builder

db-migrate:
	@echo "Running database migrations..."
	@for file in db/migrations/*.sql; do \
		echo "Running $$file..."; \
		docker exec -i vocab-builder-db psql -U vocab_user -d vocab_builder < "$$file" || true; \
	done
	@echo "Migrations completed."

db-seed:
	@echo "Running database seeds..."
	@for file in db/seeds/*.sql; do \
		echo "Running $$file..."; \
		docker exec -i vocab-builder-db psql -U vocab_user -d vocab_builder < "$$file" 2>/dev/null || true; \
	done
	@echo "Seeds completed."
	@make db-status

db-reset:
	@echo "Resetting database..."
	@docker exec vocab-builder-db psql -U vocab_user -d postgres -c "DROP DATABASE IF EXISTS vocab_builder;"
	@docker exec vocab-builder-db psql -U vocab_user -d postgres -c "CREATE DATABASE vocab_builder;"
	@echo "Database recreated."
	@echo "Running schema..."
	@docker exec -i vocab-builder-db psql -U vocab_user -d vocab_builder < db/schema.sql
	@make db-migrate
	@make db-seed

db-backup:
	@echo "Creating database backup..."
	@./scripts/backup-db.sh

db-restore:
	@echo "Available backups:"
	@ls -lh db/backups/*.sql 2>/dev/null || echo "No backups found."
	@echo ""
	@echo "To restore a specific backup, run:"
	@echo "  ./scripts/restore-db.sh db/backups/vocab_builder_backup_YYYYMMDD_HHMMSS.sql"

db-status:
	@echo "Database status:"
	@docker exec vocab-builder-db psql -U vocab_user -d vocab_builder -t -c \
		"SELECT 'Morphemes: ' || COUNT(*) FROM morphemes \
		UNION ALL SELECT 'Words: ' || COUNT(*) FROM words \
		UNION ALL SELECT 'Definitions: ' || COUNT(*) FROM definitions \
		UNION ALL SELECT 'Word-Morphemes: ' || COUNT(*) FROM word_morphemes;"

# Development shortcuts
dev: up logs

fresh:
	@echo "Starting fresh development environment..."
	@make up
	@sleep 3
	@make db-reset
	@echo "Fresh environment ready!"

# Quick database content check
check:
	@echo "Quick database check:"
	@docker exec vocab-builder-db psql -U vocab_user -d vocab_builder -c \
		"SELECT word, array_agg(m.morpheme ORDER BY wm.position) as morphemes \
		FROM words w \
		LEFT JOIN word_morphemes wm ON w.id = wm.word_id \
		LEFT JOIN morphemes m ON wm.morpheme_id = m.id \
		GROUP BY word \
		ORDER BY RANDOM() \
		LIMIT 5;"