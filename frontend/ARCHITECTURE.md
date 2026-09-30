# Arquitectura del Frontend - SnailPlay Betting App

**Fecha de creación:** 2026-09-29
**Propósito:** Documento de referencia para el desarrollo del frontend. Define la arquitectura, patrones y prácticas de desarrollo.

---

## Patrones Arquitectónicos

El frontend utiliza una arquitectura basada en la separación de responsabilidades con hooks reutilizables:

- **Custom Hooks Pattern:** Toda la lógica de negocio en hooks personalizados
- **Context API:** Estado global y coordinación entre componentes
- **Component Composition:** Componentes pequeños y reutilizables
- **Single Responsibility:** Cada componente/hook tiene una única responsabilidad

**Justificación:** Separación clara entre presentación (components) y lógica (hooks), facilitando testing, reutilización y mantenibilidad.

---

## Estructura de Directorios

```
frontend/src/
├── components/          # Componentes UI (solo presentación)
│   ├── auth/            # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── LogoutButton.tsx
│   ├── dashboard/       # Componentes del dashboard
│   │   ├── Dashboard.tsx
│   │   ├── UserInfoCard.tsx
│   │   ├── BalanceCard.tsx
│   │   ├── ChartsSection.tsx
│   │   ├── DonutChart.tsx
│   │   ├── BarChart.tsx
│   │   └── LoadBalanceButton.tsx
│   └── common/          # Componentes comunes reutilizables
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── LoadingSpinner.tsx
├── hooks/               # Hooks con lógica (reutilizables)
│   ├── useAuth.ts       # Lógica de autenticación
│   ├── useSnailPay.ts   # Lógica de pagos SnailPay
│   ├── useLocalStorage.ts # Lógica de localStorage
│   └── useApi.ts        # Lógica de llamadas API genérica
├── contexts/            # Contextos de React para estado global
│   └── AuthContext.tsx  # Manejo de sesión y usuario
├── data/                # Servicios de datos y API client
│   ├── api.ts           # Cliente HTTP (Axios)
│   └── localStorage.ts  # Wrapper de LocalStorage
├── pages/               # Páginas principales
│   ├── Login.tsx        # Página de login/registro
│   └── Dashboard.tsx    # Página del dashboard
├── types/               # Tipos TypeScript específicos del frontend
│   └── index.ts
├── App.tsx              # Componente principal
└── main.tsx             # Punto de entrada
```

---

## Responsabilidades por Capa

### Components (Solo Presentación)

**Responsabilidades:**
- Renderizado de UI
- Manejo de eventos locales (onClick, onChange)
- Consumo de hooks y contexts
- **NO** lógica de negocio
- **NO** llamadas directas a API
- **NO** estado complejo

**Ejemplo:**
```typescript
// ✅ CORRECTO: Componente solo presentación
const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input value={email} onChange={setEmail} />
      <Input value={password} onChange={setPassword} />
      <Button type="submit">Login</Button>
    </form>
  );
};

// ❌ INCORRECTO: Lógica de negocio en componente
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // ❌ Lógica de API no debería estar aquí
    const response = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### Hooks (Toda la Lógica)

**Responsabilidades:**
- Lógica de negocio
- Llamadas a API
- Manejo de estado complejo
- Efectos secundarios (useEffect)
- Reutilizabilidad entre componentes

**Ejemplo:**
```typescript
// ✅ CORRECTO: Hook con lógica reutilizable
export const useAuth = () => {
  const { user, setUser } = useAuthContext();
  const api = useApi();

  const login = async (credentials: LoginRequest) => {
    const response = await api.post('/api/auth/login', credentials);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return { user, login, logout };
};
```

### Contexts (Estado Global)

**Responsabilidades:**
- Estado global (usuario, sesión)
- Proveedores de datos a componentes
- Coordinación entre componentes
- Evitar prop drilling

**Ejemplo:**
```typescript
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Data (Comunicación con Backend)

**Responsabilidades:**
- Cliente HTTP (Axios)
- Configuración de base URL
- Interceptors (para token JWT)
- Transformación de datos si es necesario

**Ejemplo:**
```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Principios de Desarrollo

### 1. Separación de Responsabilidades

**Regla:** Toda la lógica debe estar en hooks, los componentes solo presentan UI.

**Por qué:**
- Facilita testing (puedes testear hooks sin UI)
- Reutilización de lógica entre componentes
- Mantenibilidad más sencilla

### 2. Hooks Reutilizables

**Regla:** Siempre que se pueda crear un hook reutilizable, se hará.

**Ejemplos de hooks reutilizables:**
- `useLocalStorage` - Para cualquier dato que se guarde en localStorage
- `useApi` - Para cualquier llamada a API
- `useForm` - Para manejo de formularios
- `useToggle` - Para booleanos (loading, modal abierto, etc.)

### 3. Single Responsibility

**Regla:** Cada componente/hook debe tener una única responsabilidad.

**Ejemplos:**
- `LoginForm` - Solo renderiza formulario de login
- `useAuth` - Solo maneja lógica de autenticación
- `DonutChart` - Solo renderiza gráfica de donut

### 4. Component Composition

**Regla:** Componentes pequeños y compuestos para construir UI compleja.

**Ejemplo:**
```typescript
const Dashboard = () => {
  return (
    <div>
      <UserInfoCard />
      <BalanceCard />
      <ChartsSection />
      <LoadBalanceButton />
    </div>
  );
};
```

---

## Flujo de Datos

### Flujo de Autenticación

```
Usuario → LoginForm (componente)
           ↓
         useAuth (hook)
           ↓
         api.post (data layer)
           ↓
         Backend API
           ↓
         setUser (AuthContext)
           ↓
         Actualización de UI
```

### Flujo de Pagos SnailPay

```
Usuario → LoadBalanceButton (componente)
           ↓
         useSnailPay (hook)
           ↓
         api.post (data layer con token en header)
           ↓
         Backend API (con middleware de autenticación)
           ↓
         SnailPayService
           ↓
         Actualización de saldo en UI
```

---

## Ejemplos de Implementación

### Hook: useAuth

```typescript
export const useAuth = () => {
  const { user, setUser } = useAuthContext();
  const api = useApi();

  useEffect(() => {
    // Verificar si hay sesión guardada
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  };

  const register = async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return { user, login, register, logout };
};
```

### Hook: useSnailPay

```typescript
export const useSnailPay = () => {
  const { user } = useAuth();
  const api = useApi();

  const charge = async (cardData: ChargeRequest) => {
    const response = await api.post<ChargeResponse>('/snailpay/charge', cardData);

    if (response.data.status === 'approved') {
      // Actualizar usuario con nuevo saldo
      const updatedUser = { ...user, balance: user.balance + response.data.transaction_amount };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return response.data;
  };

  return { charge };
};
```

### Componente: LoginForm

```typescript
const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Email" value={email} onChange={setEmail} />
      <Input label="Password" type="password" value={password} onChange={setPassword} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button type="submit">Login</Button>
    </form>
  );
};
```

---

## Hooks Reutilizables a Implementar

### useLocalStorage
- Para guardar y recuperar datos de localStorage
- Reutilizable para cualquier dato que necesite persistencia

### useApi
- Wrapper de Axios con configuración base
- Manejo automático de token JWT en headers
- Manejo centralizado de errores

### useAuth
- Lógica completa de autenticación
- login, register, logout
- Verificación de sesión al cargar

### useSnailPay
- Lógica de pagos SnailPay
- charge con actualización de saldo
- Manejo de respuestas de SnailPay

### useForm
- Manejo genérico de formularios
- Validaciones
- Manejo de errores

---

## Librerías a Evaluar

Según el PDF, se requiere:
- **React Router DOM** - Para navegación entre páginas
- **Axios** - Para llamadas API (ya instalado)
- **Librería de gráficas** - Para donut chart y bar chart

**Opciones de gráficas:**
- Recharts (popular, React-friendly)
- Chart.js (versátil)
- Victory (composición-friendly)

---

## Testing

### Estrategia de Testing

**Componentes:**
- Testing de renderizado con React Testing Library
- Testing de interacciones (clicks, inputs)
- Sin testing de implementación interna

**Hooks:**
- Testing con @testing-library/react-hooks
- Testing de lógica de negocio
- Testing de llamadas a API (mocking)

**Contexts:**
- Testing de proveedores
- Testing de actualización de estado

---

## Buenas Prácticas

### TypeScript
- Tipado estricto en todos los archivos
- Uso de tipos del paquete dtos/ para comunicación con backend
- Tipos específicos del frontend en types/

### Organización
- Componentes pequeños y enfocados
- Hooks reutilizables cuando sea posible
- Nombres descriptivos para funciones y variables

### Performance
- useMemo/useCallback cuando sea necesario
- Lazy loading de componentes grandes
- Optimización de re-renders

### Accesibilidad
- ARIA labels en inputs y botones
- Navegación por teclado
- Contraste de colores adecuado

---

*Este documento es vivo y se modificará conforme se tomen más decisiones técnicas durante el desarrollo.*
