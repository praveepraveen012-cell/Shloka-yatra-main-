# Multi-stage production Dockerfile for Shloka Yatra Express API Server
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root system user for container security
RUN addgroup -S shloka && adduser -S shloka -G shloka

COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

# Create schema directory for Prisma runtime
COPY --chown=shloka:shloka . .

USER shloka

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "src/index.js"]
