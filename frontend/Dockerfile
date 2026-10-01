# Contexto de build: raíz del repositorio (necesario por la dependencia file:../dtos)
#   docker build -f frontend/Dockerfile --build-arg VITE_API_BASE_URL=https://api.ejemplo.com/api .

FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate
WORKDIR /app

COPY dtos/package.json dtos/pnpm-lock.yaml dtos/tsconfig.json ./dtos/
COPY dtos/src ./dtos/src
RUN cd dtos && pnpm install --frozen-lockfile && pnpm build

COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
RUN cd frontend && pnpm install --frozen-lockfile
COPY frontend ./frontend

# Vite incrusta esta variable en el bundle durante el build (no se puede cambiar en runtime)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN cd frontend && pnpm build

# ---- Imagen final: nginx sirviendo el SPA ----
FROM nginx:1.27-alpine
# Fallback del SPA (React Router): cualquier ruta desconocida sirve index.html
RUN <<'EOF' cat > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
