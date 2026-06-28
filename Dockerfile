# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN npm install -g bun && bun install --frozen-lockfile || bun install

# Copy source code
COPY . .

# Public Vite variables are baked into the frontend during build.
ARG VITE_API_URL
ARG VITE_API_BASE_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build application
RUN bun run build && echo "Build completed" && ls -la .output/ && ls -la .output/server/ || echo "Build failed or folder not found"

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built server from builder
COPY --from=builder /app/.output ./.output

# Expose port
EXPOSE 3000

# Environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Debug: list files
RUN echo "=== Production image ===" && ls -la /app/.output/ || echo ".output not found"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start Nitro server
CMD ["node", ".output/server/index.mjs"]
