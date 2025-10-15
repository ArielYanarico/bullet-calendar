# Multi-stage Dockerfile for Bullet Calendar Monorepo
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN npx prisma generate

# Build backend
WORKDIR /app/apps/backend
RUN npm run build

# Build frontend
WORKDIR /app/apps/frontend
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Install netcat for health checks and waiting for postgres
RUN apk add --no-cache netcat-openbsd

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=builder /app/apps/frontend/package*.json ./apps/frontend/
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

# Copy root package.json and node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy startup script
COPY docker/start.sh ./
RUN chmod +x start.sh 

# Create necessary directories and set permissions
RUN mkdir -p /app/apps/frontend/.next
RUN chown -R nextjs:nodejs /app/apps/frontend
RUN chown -R nextjs:nodejs /app/apps/backend

EXPOSE 3000 3001

USER nextjs

CMD ["./start.sh"]