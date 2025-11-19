# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy all necessary files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src

# Copy package.json to ensure correct entry point
COPY --from=build /app/package.json ./package.json

# Copy .env file if it exists (for production it will be overridden by Render env vars)
# COPY --from=build /app/.env ./.env

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of files
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "src/server.js"]