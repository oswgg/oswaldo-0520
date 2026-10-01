# Despliegue con Dokploy

Dos contenedores independientes: `backend` (Express, puerto 3000) y `frontend` (nginx, puerto 80).
Ambos Dockerfiles usan como **contexto de build la raíz del repositorio** (por la dependencia `file:../dtos`).

## Variables

| Variable | Dónde | Descripción |
|---|---|---|
| `JWT_SECRET` | backend (runtime) | Secreto de los JWT. Obligatorio, usa `openssl rand -hex 32` |
| `CORS_ORIGIN` | backend (runtime) | URL del frontend, p. ej. `https://app.ejemplo.com`. Vacío = cualquier origen |
| `VITE_API_BASE_URL` | frontend (**build arg**) | URL pública de la API con `/api`, p. ej. `https://api.ejemplo.com/api`. Vite la incrusta al compilar: si cambia, hay que reconstruir |

## Opción A: una aplicación Compose (más simple)

1. En Dokploy: **Create Service → Compose**, origen Git, archivo `docker-compose.yml`.
2. En *Environment* define `JWT_SECRET`, `CORS_ORIGIN` y `VITE_API_BASE_URL`.
3. En *Domains*: `frontend` → puerto 80, `backend` → puerto 3000.
4. Deploy.

## Opción B: dos aplicaciones

Crea dos servicios **Application** con el mismo repositorio, build type **Dockerfile**:

| | Dockerfile Path | Docker Context Path | Puerto |
|---|---|---|---|
| backend | `backend/Dockerfile` | `.` | 3000 |
| frontend | `frontend/Dockerfile` | `.` | 80 |

Variables del backend en *Environment*; `VITE_API_BASE_URL` del frontend en *Build Args*.

## Datos

No hay volumen: los JSON semilla (`backend/src/data`) se copian a la imagen (`dist/data`) y
**se reinician en cada redespliegue**. Deben estar commiteados en el repositorio, incluyendo
`transactions.json`.

## Prueba local

```bash
cp .env.example .env   # ajusta valores (VITE_API_BASE_URL=http://localhost:3000/api)
docker compose up --build
```
