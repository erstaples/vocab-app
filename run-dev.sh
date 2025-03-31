#!/bin/bash

set -e

# Start development environment with Docker and frontend

# Start the PostgreSQL database and API server in Docker
echo "Starting PostgreSQL and API server with Docker Compose..."
docker compose up -d

# Wait for services to be fully ready
echo "Waiting for services to start..."
sleep 5

# Check if the API server is running
echo "Checking API server status..."
curl -s http://localhost:3001/api/health || {
  echo "API server is not responding. Check Docker logs for details."
  echo "You can run 'docker compose logs api' to see logs."
  echo "Starting just the frontend..."
}

# Start the React frontend app
echo "Starting React frontend..."
npm start
