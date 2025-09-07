FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS dev-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY package.json pnpm-lock.yaml ./
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM node:20-alpine AS runtime
RUN npm install -g pnpm

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001


WORKDIR /app

RUN mkdir /app/books && chmod 777 /app/books

COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/build ./build

USER nextjs

EXPOSE 3000

CMD ["pnpm", "run", "start"]