# Contexto de build: raíz del repositorio (necesario por la dependencia file:../dtos)
#   docker build -f backend/Dockerfile .

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate
WORKDIR /app

# ---- Build: compila dtos y luego el backend ----
FROM base AS build
COPY dtos/package.json dtos/pnpm-lock.yaml dtos/tsconfig.json ./dtos/
COPY dtos/src ./dtos/src
RUN cd dtos && pnpm install --frozen-lockfile && pnpm build

COPY backend/package.json backend/pnpm-lock.yaml backend/pnpm-workspace.yaml backend/tsconfig.json ./backend/
RUN cd backend && pnpm install --frozen-lockfile
COPY backend/src ./backend/src
RUN cd backend && pnpm build

# ---- Dependencias de producción ----
FROM base AS prod-deps
COPY --from=build /app/dtos ./dtos
COPY backend/package.json backend/pnpm-lock.yaml backend/pnpm-workspace.yaml ./backend/
RUN cd backend && pnpm install --frozen-lockfile --prod

# ---- Imagen final ----
FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=3000
WORKDIR /app/backend

COPY --from=prod-deps --chown=node:node /app/backend/node_modules ./node_modules
COPY --from=build --chown=node:node /app/backend/dist ./dist
COPY --from=build --chown=node:node /app/backend/package.json ./package.json
# Datos semilla: tsc no copia los JSON, el código los lee desde dist/data
COPY --chown=node:node backend/src/data ./dist/data

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "dist/server.js"]
