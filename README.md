# SnailPlay Betting App

Aplicación de apuestas de carreras de caracoles con recarga de saldo mediante **SnailPay**, una pasarela de pagos simulada (mock).

Es un monorepo gestionado con **pnpm workspaces**:

| Paquete | Ruta | Descripción |
|---------|------|-------------|
| Backend | `backend/` | API REST con Express + TypeScript |
| Frontend | `frontend/` | SPA con React + TypeScript + Vite |
| DTOs | `dtos/` | Tipos TypeScript compartidos (`@oswaldo/dtos`) |

## Acceso En Línea
Este proyecto se encuentra desplegado en un VPS propio gestionado con [Dokploy](https://dokploy.com). Accesible en [oswaldo.20040521.xyz](https://oswaldo.20040521.xyz)

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- [pnpm](https://pnpm.io/) 10.19 (`npm install -g pnpm`)

## Instalación

Desde la raíz del repositorio:

```bash
pnpm install
```

El backend y el frontend consumen `@oswaldo/dtos` desde `dtos/dist`, que no está versionado. Compila el paquete antes de arrancar:

```bash
pnpm --dir dtos install
pnpm --dir dtos build
```

## Ejecución en desarrollo

Levanta backend y frontend en paralelo con un solo comando:

```bash
pnpm dev
```

| Servicio | URL |
|----------|-----|
| Frontend (abre esta en el navegador) | http://localhost:5173 |
| Backend (API) | http://localhost:3000/api |
| Health check | http://localhost:3000/health |

También puedes levantarlos por separado:

```bash
pnpm --filter oswaldo-backend dev
pnpm --filter oswaldo-frontend dev
```

## Variables de entorno

| Variable | Dónde | Valor por defecto | Descripción |
|----------|-------|-------------------|-------------|
| `VITE_API_BASE_URL` | `frontend/.env` | `http://localhost:3000/api` | URL base de la API |
| `PORT` | Backend | `3000` | Puerto del servidor |
| `JWT_SECRET` | Backend | `your-secret-key` | Secreto para firmar los JWT |

> El valor por defecto de `JWT_SECRET` es solo para desarrollo. Define uno propio fuera de local, por ejemplo: `JWT_SECRET=un-secreto-largo pnpm --filter oswaldo-backend dev`.

## Datos y persistencia

- **Backend:** archivos JSON en `backend/src/data/` (`users.json`, `transactions.json`, `snails.json`). Los datos iniciales, incluidos los 6 caracoles, vienen en el repositorio.
- **Frontend:** `localStorage` del navegador (sesión, saldo y transacciones). Si algo se ve inconsistente, borra los datos del sitio en el navegador.

## SnailPay (pasarela simulada)

No se conecta a ningún servicio real. Su comportamiento depende de los datos enviados:

| Escenario | Condición |
|-----------|-----------|
| Cobro exitoso | Tarjeta `1234123412341234`, vencimiento `12/26`, CVV `543` |
| Error de transacción | Cualquier otro dato de tarjeta, nombre vacío o monto menor o igual a 0 |
| Error del sistema | Enviar la bandera `errorIntended` en la petición de cobro |

## Pruebas

Las pruebas unitarias están en el backend (Jest):

```bash
pnpm --filter oswaldo-backend test
pnpm --filter oswaldo-backend test:coverage
```

## Build de producción

```bash
pnpm --filter oswaldo-backend build && pnpm --filter oswaldo-backend start
pnpm --filter oswaldo-frontend build
```

## Documentación adicional

- [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md): arquitectura general y decisiones técnicas
- [`backend/ARCHITECTURE.md`](backend/ARCHITECTURE.md): arquitectura del backend
- [`frontend/ARCHITECTURE.md`](frontend/ARCHITECTURE.md): arquitectura del frontend
- [`AI_USAGE_LOG.md`](AI_USAGE_LOG.md): registro del uso de herramientas de IA
- `BRUNO-WORKSPACE/`: colección de peticiones de la API para [Bruno](https://www.usebruno.com/)
