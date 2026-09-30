# Arquitectura del Backend - SnailPay Betting App

**Fecha de creación:** 2026-09-28
**Arquitectura:** DI Simplificada + Repository Pattern + Strategy Pattern

---

## Justificación de la Decisión Arquitectónica

Se opta por usar una estructura de Dependency Injection (DI) simplificada combinada con el patrón Repository y Strategy Pattern para otorgar flexibilidad al sistema permitiendo cambiar los "providers" de los servicios de manera sencilla.

**Objetivo Principal:**
Facilitar la implementación de una base de datos real (Tarea Adicional 2) sin la necesidad de modificar toda la base del código, evitando retrabajo, bugs previamente resueltos y permitiendo centrarse únicamente en la implementación del nuevo provider.

**Criterios de Selección:**

- Flexibilidad para cambiar implementaciones (data layer, encriptación, pagos)
- Sin boilerplate excesivo
- Sin complejidad de clean code o hexagonal architecture
- Equilibrio entre simplicidad y capacidad de evolución
- Mantenibilidad y testabilidad

---



## Patrones Arquitectónicos UtilizadosG

### 1. Dependency Injection (DI) Simplificada

**Concepto:** Inyectar dependencias en lugar de crearlas dentro de las clases.

**Implementación:**

- Interfaces para todos los providers
- DI manual en constructors (sin frameworks)
- Service Locator simple para instanciación centralizada

**Ventajas:**

- Fácil de testear (mock de dependencias)
- Fácil de cambiar implementaciones
- Cero boilerplate de frameworks DI

**Ejemplo:**

```typescript
class AuthController {
  constructor(
    private passwordHasher: IPasswordHasher,
    private userRepo: IUserRepository
  ) {}
  
  async register() {
    const hash = await this.passwordHasher.hash(password);
    const user = await this.userRepo.create(user);
  }
}
```

---



### 2. Repository Pattern

**Concepto:** Abstracción del data layer. Los controllers no saben si es JSON, SQL, MongoDB, etc.

**Implementación:**

- Interfaces para repositorios
- Implementaciones específicas (JsonUserRepository, SqlUserRepository futuro)
- Controllers dependen de interfaces, no de implementaciones

**Ventajas:**

- Cambiar JSON por SQL es solo cambiar la implementación
- Controllers no cambian
- Testable con repositorios mock

**Ejemplo:**

```typescript
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
}

class JsonUserRepository implements IUserRepository {
  async findByEmail(email: string) {
    const users = await fs.readFile('users.json');
    return users.find(u => u.email === email);
  }
}
```

---



### 3. Strategy Pattern

**Concepto:** Intercambiar algoritmos (encriptación, pagos, etc.) sin cambiar el código que los usa.

**Implementación:**

- Interfaces para estrategias (IPasswordHasher, ISnailPayService)
- Implementaciones específicas (Argon2Hasher, BcryptHasher futuro)
- Configuración centralizada en container

**Ventajas:**

- Cambiar Argon2 por bcrypt es cambiar una línea
- Testable con hasher mock
- Sigue principio abierto/cerrado

**Ejemplo:**

```typescript
interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(hash: string, password: string): Promise<boolean>;
}

class Argon2Hasher implements IPasswordHasher {
  async hash(password: string) {
    return argon2.hash(password);
  }
}
```

---



### 4. Service Locator Simple

**Concepto:** Un objeto central que instancia y provee las dependencias.

**Implementación:**

- Clase Container centralizada
- Registro de factories para cada dependencia
- Resolución de dependencias en server.ts

**Ventajas:**

- Centraliza la configuración de dependencias
- Fácil de cambiar implementaciones
- Más simple que frameworks DI

**Ejemplo:**

```typescript
class Container {
  private instances = new Map();
  
  register<T>(key: string, factory: () => T) {
    this.instances.set(key, factory);
  }
  
  get<T>(key: string): T {
    return this.instances.get(key);
  }
}
```

---



## Estructura de Directorios

```
backend/src/
├── interfaces/                    # Interfaces de providers
│   ├── IPasswordHasher.ts
│   ├── IUserRepository.ts
│   └── ISnailPayService.ts
├── repositories/                  # Implementaciones de data layer
│   └── JsonUserRepository.ts
├── services/                      # Lógica de negocio
│   ├── PasswordHasher/            # Implementaciones de hashing
│   │   ├── Argon2Hasher.ts
│   │   └── index.ts
│   └── SnailPayService.ts
├── controllers/                   # Usan interfaces via DI
│   └── AuthController.ts
├── middleware/                    # Middleware Express
│   └── auth.middleware.ts
├── routes/                        # Definición de rutas
│   └── auth.routes.ts
├── container.ts                   # Service locator simple
├── types/                        # Tipos TypeScript específicos
├── data/                         # Archivos JSON (persistencia)
│   ├── users.json
│   ├── transactions.json
│   └── snails.json
└── server.ts                      # Punto de entrada
```

---



## Flujo de Dependencias

```
Server.ts
  ↓
Container (configura dependencias)
  ↓
Routes → Controllers → Services/Repositories
  ↓
Interfaces (abstracción)
  ↓
Implementaciones concretas (JsonUserRepository, Argon2Hasher)
```

---



## Cambio de Implementaciones



### Ejemplo: Cambiar JSON por Base de Datos Real

**Paso 1:** Crear nueva implementación

```typescript
class SqlUserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return db.users.findOne({ where: { email } });
  }
}
```

**Paso 2:** Actualizar container

```typescript
// Antes
container.register('userRepo', () => new JsonUserRepository());

// Después
container.register('userRepo', () => new SqlUserRepository());
```

**Paso 3:** No requiere cambios en:

- Controllers
- Routes
- Services
- Tests

---



### Ejemplo: Cambiar Argon2 por Bcrypt

**Paso 1:** Crear nueva implementación

```typescript
class BcryptHasher implements IPasswordHasher {
  async hash(password: string) {
    return bcrypt.hash(password, 10);
  }
}
```

**Paso 2:** Actualizar container

```typescript
// Antes
container.register('passwordHasher', () => new Argon2Hasher());

// Después
container.register('passwordHasher', () => new BcryptHasher());
```

**Paso 3:** No requiere cambios en:

- Controllers
- Services
- Tests

---



## Costo de la Arquitectura

**Complejidad Adicional:**

- ~5 interfaces
- ~5 clases de implementación
- 1 archivo de container
- **Sin boilerplate de frameworks**
- **Sin complejidad de hexagonal**

**Beneficios:**

- Flexibilidad para cambiar providers
- Testabilidad mejorada
- Separación de responsabilidades
- Bajo acoplamiento
- Preparado para Tarea Adicional 2

---



## Objetivos Alcanzados

✅ **Separación de responsabilidades:** Cada capa tiene una responsabilidad clara
✅ **Bajo acoplamiento:** Controllers dependen de interfaces, no de implementaciones
✅ **Flexibilidad:** Cambiar providers es actualizar una línea en el container
✅ **Sin boilerplate excesivo:** DI manual sin frameworks complejos
✅ **Testabilidad:** Fácil mock de dependencias
✅ **Escalabilidad:** Preparado para migración a base de datos real
✅ **Mantenibilidad:** Código organizado y predecible

---

*Esta arquitectura es un equilibrio entre simplicidad y flexibilidad, diseñada específicamente para permitir la evolución del sistema hacia una base de datos real sin refactorización masiva.*