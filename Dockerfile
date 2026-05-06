# Dockerfile (prod)

# Base stage
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# Dependencies stage
FROM base AS deps

RUN npm ci


# Builder stage
FROM deps AS builder

COPY . .
RUN npx run db:generate
RUN npm run build


# Production stage
FROM node:latest AS production

RUN addgroup -g 1001 -S app && adduser -u 1001 -S app -G app

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force



COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma


USER app
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]



# Migrator stage
FROM deps as Migrator

COPY . .

CMD ["npm", "run", "db:deploy"]