#!/bin/sh
set -e

# Run Prisma migrations on startup
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
exec "$@"