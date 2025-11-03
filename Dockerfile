# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root files only
COPY package.json package-lock.json nx.json tsconfig.base.json eslint.config.mjs ./

# Copy all apps and libs
COPY apps ./apps
COPY libs ./libs

# Install dependencies
RUN npm ci

# Build the gateway app
RUN npx nx build gateway

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy root files for prod dependencies
COPY package.json package-lock.json nx.json eslint.config.mjs ./
RUN npm ci --only=production

# Copy built gateway app and libs
COPY --from=builder /app/dist/apps/gateway ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/libs ./libs

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
