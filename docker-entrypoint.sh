#!/bin/sh
set -e

# Führe Prisma-Migrationen beim Start aus
echo "Führe Datenbankmigrationen durch..."
npx prisma migrate deploy

# Führe Server aus
echo "Starte die Anwendung..."
exec "$@"