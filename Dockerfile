FROM node:20-alpine AS base

# Installiere Abhängigkeiten für Prisma
RUN apk add --no-cache libc6-compat openssl wget

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere package.json und package-lock.json
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Build-Stufe
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generiere Prisma Client
RUN npx prisma generate

# Baue die Next.js-Anwendung
RUN npm run build

# Produktions-Stufe
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Erstelle einen nicht-root Benutzer
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiere die gebaute Anwendung
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Kopiere Prisma-Dateien
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src/generated ./src/generated

# Kopiere Entrypoint-Skript
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Erstelle Verzeichnis für SQLite-Datenbank
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data
VOLUME /app/data

# Exponiere den Port für Next.js
EXPOSE 3000

USER nextjs

# Verwende das Entrypoint-Script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]