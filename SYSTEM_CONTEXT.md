# Contexto del Sistema - SnailPay Betting App

**Fecha de creación:** 2026-09-28
**Última actualización:** 2026-09-28
**Propósito:** Documento de referencia para herramientas de IA. Define la arquitectura, decisiones técnicas y consideraciones de negocio del sistema.

---

## Arquitectura General

### Patrón Arquitectónico
**Cliente-Servidor Tradicional** con separación clara entre frontend y backend.
**Características:**

- Frontend y backend son proyectos separados e independientes
- Comunicación vía HTTP/REST (JSON)
- Sin consideraciones de escalabilidad ni alta concurrencia
- Diseñado para resolver el alcance actual sin complejidad innecesaria

### Topología del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Navegador (Cliente)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Frontend (React + TypeScript)            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │  │
│  │  │ Components  │  │  Contexts   │  │     Data      │  │  │
│  │  └─────────────┘  └─────────────┘  └───────────────┘  │  │
│  │           │              │               │            │  │
│  │           └──────────────┴───────────────┘            │  │
│  │                      LocalStorage                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Backend (Express + TypeScript)              │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐        │
│  │   Routes    │  │ Controllers │  │   Services    │        │
│  └─────────────┘  └─────────────┘  └───────────────┘        │
│         │              │               │                    │
│         └──────────────┴───────────────┘                    │
│                        Data Layer                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           JSON Files (Persistencia)                 │    │
│  │  - users.json                                       │    │
│  │  - transactions.json                                │    │
│  │  - snails.json (6 caracoles iniciales)              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         SnailPay Service (Mock)                     │    │
│  │  Interfaz intercambiable por pasarela real          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend - Arquitectura en Capas

### Estructura de Directorios

```
frontend/
├── src/
│   ├── components/          # Componentes UI reutilizables
│   │   ├── auth/            # Login, Register, Logout
│   │   ├── dashboard/       # Dashboard, Charts, Cards
│   │   └── common/          # Buttons, Inputs, Layouts
│   ├── contexts/            # Contextos de React para estado global
│   │   └── AuthContext.tsx  # Manejo de sesión y usuario
│   ├── data/                # Servicios de datos y API client
│   │   ├── api.ts           # Cliente HTTP (Axios)
│   │   └── localStorage.ts  # Wrapper de LocalStorage
│   ├── types/               # Tipos TypeScript específicos del frontend
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Punto de entrada
├── package.json
└── vite.config.ts
```

### Responsabilidades por Capa

**Components:**
- Presentación UI
- Manejo de eventos locales
- Consumo de contexts y servicios de datos
- Sin lógica de negocio compleja

**Contexts:**
- Estado global (autenticación, usuario)
- Proveedores de datos a componentes
- Lógica de coordinación entre componentes

**Data:**
- Comunicación con backend (API client)
- Persistencia en LocalStorage
- Transformación de datos si es necesario

---

## Backend - Arquitectura Híbrida

### Patrones Arquitectónicos

El backend utiliza una arquitectura híbrida combinando:
- **Dependency Injection (DI) Simplificada:** Inyección de dependencias manual
- **Repository Pattern:** Abstracción del data layer
- **Strategy Pattern:** Intercambio de algoritmos (encriptación, pagos)
- **Service Locator Simple:** Centralización de dependencias

**Justificación:** Flexibilidad para cambiar providers (data layer, encriptación) sin refactorización masiva, preparado para Tarea Adicional 2 (base de datos real). Documentado en `backend/ARCHITECTURE.md`.

### Estructura de Directorios

```
backend/
├── src/
│   ├── interfaces/                    # Interfaces de providers
│   │   ├── IPasswordHasher.ts
│   │   ├── IUserRepository.ts
│   │   └── ISnailPayService.ts
│   ├── repositories/                  # Implementaciones de data layer
│   │   └── JsonUserRepository.ts
│   ├── services/                      # Lógica de negocio
│   │   ├── PasswordHasher/            # Implementaciones de hashing
│   │   │   ├── Argon2Hasher.ts
│   │   │   └── index.ts
│   │   └── SnailPayService.ts
│   ├── controllers/                   # Usan interfaces via DI
│   │   └── AuthController.ts
│   ├── middleware/                    # Middleware Express
│   │   └── auth.middleware.ts
│   ├── routes/                        # Definición de rutas
│   │   └── auth.routes.ts
│   ├── container.ts                   # Service locator simple
│   ├── types/                         # Tipos TypeScript específicos
│   ├── data/                          # Archivos JSON (persistencia)
│   │   ├── users.json
│   │   ├── transactions.json
│   │   └── snails.json
│   └── server.ts                      # Punto de entrada
├── ARCHITECTURE.md                    # Documentación de arquitectura
├── package.json
└── tsconfig.json
```

### Responsabilidades por Capa

**Interfaces:**
- Definición de contratos para providers
- Abstracción de implementaciones concretas
- Permiten cambio de implementaciones sin modificar código cliente

**Repositories:**
- Implementaciones de data layer (JsonUserRepository)
- Operaciones CRUD sobre datos
- Implementan interfaces de repositorios

**Services:**
- Lógica de negocio
- Implementaciones de estrategias (Argon2Hasher, SnailPayService)
- Implementan interfaces de servicios

**Controllers:**
- Manejo de request/response
- Validación de inputs
- Coordinación via DI (inyectan interfaces)
- Respuestas HTTP apropiadas

**Container:**
- Service Locator simple
- Registro y resolución de dependencias
- Configuración centralizada de providers

**Routes:**
- Definición de endpoints HTTP
- Enlace entre URL y controllers
- Aplicación de middleware

**Middleware:**
- Validación de sesión (JWT + contador)
- Interceptación de requests

**Data:**
- Archivos JSON para persistencia
- Datos iniciales (6 caracoles en snails.json)

---

## Paquete de Tipos Compartidos - dtos/

### Estructura de Directorios

```
dtos/
├── src/
│   ├── auth/
│   │   ├── req/            # Request DTOs para auth
│   │   │   ├── register.request.ts
│   │   │   └── login.request.ts
│   │   └── res/            # Response DTOs para auth
│   │       └── auth.response.ts
│   ├── snailpay/
│   │   ├── req/            # Request DTOs para SnailPay
│   │   │   └── charge.request.ts
│   │   └── res/            # Response DTOs para SnailPay
│   │       └── charge.response.ts
│   ├── common/
│   │   ├── api.response.ts # Response wrapper genérico
│   │   └── error.dto.ts    # Error estándar
│   └── index.ts            # Exportaciones públicas
├── package.json
└── tsconfig.json
```

### Propósito
- **Single Source of Truth** para contratos de API
- Type safety entre frontend y backend
- Documentación viva de la comunicación cliente-servidor
- Facilita refactor seguro

### Uso
Frontend y backend instalan este paquete como dependencia local:
```json
{
  "dependencies": {
    "@oswaldo/dtos": "file:../dtos"
  }
}
```

---

## SnailPay - Servicio Mockeado

### Diseño
SnailPay se implementa como un servicio interno del backend con una interfaz que podría ser intercambiable por cualquier proveedor de pasarela de pagos real (Stripe, PayPal, etc.).

### Características
- **Sin conexión a servicios reales**
- **Determinístico por inputs**
- **Escenarios simulados:**
  - Cobro exitoso (tarjeta específica)
  - Error de transacción (datos inválidos)
  - Error del sistema (toggle documentado)

### Estructura
```typescript
interface ISnailPayService {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  setSystemError(enabled: boolean): void;
}
```

### Escalabilidad Futura
La interfaz `ISnailPayService` permite reemplazar la implementación mock por una integración real sin modificar controllers ni routes.

---

## Estrategia de Persistencia

### Frontend - LocalStorage
**Propósito:** Persistencia de sesión y estado del usuario en el navegador.

**Datos almacenados:**
- `sessionToken`: Token de sesión
- `user`: Información del usuario (id, name, email, balance)

**Consideraciones:**
- No persistencia segura (solo para simulación)
- Máximo ~5MB (suficiente para este scope)
- Síncrono (puede bloquear UI)

### Backend - JSON Files
**Propósito:** Persistencia "real" de registros en el servidor.

**Archivos:**
- `users.json`: Usuarios registrados con passwords hasheados
- `transactions.json`: Historial de transacciones de SnailPay
- `snails.json`: 6 caracoles iniciales (datos semilla)

**Consideraciones:**
- Modificado por el usuario: decisión trasladada del frontend al backend para confidencialidad
- Sin ACID transactions (aceptable para este scope)
- Escalabilidad limitada (suficiente para prueba técnica)

**Importante:** Todos los archivos de `backend/data/` están en el repositorio para que los datos iniciales (incluyendo los 6 caracoles) estén disponibles al clonar.

---

## Tecnologías

### Stack Obligatorio (Sin Excepciones)
- **Frontend:** React + TypeScript
- **Backend:** Express + TypeScript
- **Build Tool:** Vite (para React)
- **Persistencia:** LocalStorage (frontend) + JSON files (backend)
- **Package Manager:** pnpm (decisión de implementación)

### Librerías Adicionales (Por Definir)
Aún no se definen librerías adicionales. Se evaluarán según necesidad durante implementación.

---

## Consideraciones de Escalabilidad

### Tarea Adicional 2 - Base de Datos Real
La arquitectura actual está diseñada pensando en la posibilidad de migrar a una base de datos real:

**Preparación para migración:**
- Capa `services` abstrae lógica de negocio de persistencia
- Interfaz `ISnailPayService` permite intercambiar implementación
- DTOs compartidos facilitan transición a ORM

**Cambios necesarios (futuros):**
- Reemplazar `json-db.service.ts` por ORM (Prisma, TypeORM, etc.)
- Agregar conexión a base de datos
- Migrar esquemas de JSON a tablas
- Ajustar controllers para usar nuevos repositories

**Por ahora:** No se implementa base de datos real. Esta decisión se tomará más adelante si se aborda la tarea adicional 2.

### Tarea Adicional 1 - Despliegue
El despliegue se considera como tarea adicional atractiva pero depende del tiempo disponible.

**Plataformas a evaluar:**
- VPS propio (ya lo tengo)
- Cloudflare

---

## Decisiones Técnicas y de Negocio

### Decisiones Tomadas
1. **Arquitectura cliente-servidor tradicional** - Por simplicidad y adecuación al scope
2. **Frontend y backend separados** - Para claridad de responsabilidades
3. **LocalStorage en frontend + JSON en backend** - Decisión del usuario para confidencialidad de registros
4. **SnailPay como mock con interfaz intercambiable** - Para simulación realista y escalabilidad futura
5. **Paquete dtos/ compartido** - Para type safety y contratos de API claros
6. **Arquitectura en capas** - Para separación de responsabilidades y mantenibilidad
7. **Tecnologías sin excepciones** - Por requerimiento del PDF de prueba técnica

### Decisiones Pendientes
- Librerías adicionales (gráficas, formularios, UI)
- Estrategia de testing
- Estrategia de despliegue (si se aborda tarea adicional 1)
- Migración a base de datos real (si se aborda tarea adicional 2)

---

## Reglas para Herramientas de IA

### Antes de Cualquier Acción
1. **Leer este archivo completo** - SYSTEM_CONTEXT.md es la fuente de verdad del contexto del sistema
2. **Respetar las decisiones tomadas** - No cambiar arquitectura sin aprobación explícita
3. **No agregar tecnologías no mencionadas** - Sin excepciones al stack obligatorio
4. **Mantener estructura de capas** - Frontend: components/contexts/data, Backend: routes/controllers/services/data
5. **Usar dtos/ para comunicación** - No definir tipos duplicados en frontend o backend

### Al Implementar
1. **Seguir estructura de directorios definida**
2. **Mantener separación de responsabilidades por capa**
3. **Documentar nuevas decisiones en este archivo**
4. **Actualizar AI_USAGE_LOG.md** según instrucciones en AGENTS.md

---

*Este archivo es vivo y se modificará conforme se tomen más decisiones técnicas y de negocio.*
