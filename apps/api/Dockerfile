FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

# Workspace skeleton so pnpm can resolve the lockfile without the full source.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

FROM base AS dev
RUN pnpm install --frozen-lockfile
COPY apps/api apps/api
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["pnpm", "start:dev"]

FROM base AS build
RUN pnpm install --frozen-lockfile
COPY apps/api apps/api
WORKDIR /app/apps/api
RUN pnpm build

FROM base AS production
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/apps/api/dist apps/api/dist
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "dist/main"]
