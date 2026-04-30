# Dockerfile (prod)

# Builder stage
FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx tsup

# Production stage
FROM node:latest AS production

RUN addgroup -g 1001 -S app && adduser -u 1001 -S app -G app

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

USER app
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]