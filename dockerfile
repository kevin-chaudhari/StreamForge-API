FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# ── Dependency layer (cached separately) ──────────────────────────────────────
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ── Production image ───────────────────────────────────────────────────────────
FROM base AS production

# Run as non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S watchly -u 1001
USER watchly

COPY --from=deps --chown=watchly:nodejs /app/node_modules ./node_modules
COPY --chown=watchly:nodejs . .

# Ensure temp directory exists and is writable for multer uploads
RUN mkdir -p public/temp

EXPOSE 3000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/v1/healthcheck || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]