#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /rails/tmp/pids/server.pid

echo "🔧 Setting up database..."

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 3  # Give MongoDB a moment to fully start

# Create database if it doesn't exist
echo "📦 Creating database (if needed)..."
bin/rails db:create 2>/dev/null || true

# Run database seeds
echo "🌱 Running seeds..."
bin/rails db:seed

echo "🚀 Starting Rails server..."

# Then exec the container's main process (what's in CMD or docker-compose command)
exec "$@"

