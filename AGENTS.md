# Instrucciones para Herramientas de IA 

**Fecha de creación:** 2026-09-28

---

## Instrucciones Obligatorias para Cualquier Herramienta de IA

Cuando trabajes en este proyecto, DEBES seguir estas reglas:

### 0. Leer Contexto del Sistema (OBLIGATORIO)

**ANTES DE CUALQUIER OTRA ACCIÓN**, lee el archivo `SYSTEM_CONTEXT.md` ubicado en la raíz del proyecto.

Este archivo contiene:
- Arquitectura cliente-servidor tradicional
- Estructura de capas en frontend y backend
- Paquete dtos/ para tipos compartidos
- Estrategia de persistencia
- Tecnologías obligatorias
- Decisiones técnicas y de negocio tomadas
- Reglas específicas para herramientas de IA

**NO procedas sin leer primero SYSTEM_CONTEXT.md.**

### 1. Registrar Todo en AI_USAGE_LOG.md

Antes de realizar cualquier acción (crear archivo, modificar código, ejecutar comando, etc.), DEBES registrar la intención en el archivo `AI_USAGE_LOG.md` ubicado en la raíz del proyecto.

Formato de registro:

```markdown
### [Fecha y hora] - [Descripción breve de la acción]

**Tipo:** [Creación/Modificación/Ejecución/Análisis/Investigación]
**Solicitado por:** [Usuario o IA como sugerencia]
**Estado:** [Pendiente/En progreso/Completado/Rechazado]

**Descripción:**
[Detalle de qué se va a hacer]

**Resultado:**
[Qué se hizo realmente - llenar después de ejecutar]

**Archivos afectados:**
- [Lista de archivos creados/modificados]

**Código generado por IA:**
[Especificar qué líneas o bloques fueron generados por IA]

**Justificación del uso de IA:**
[Por qué se necesitó IA para esta tarea]
```

### 2. Cuestionar Antes de Implementar

Para cualquier solicitud de implementación (crear código, modificar archivos, ejecutar comandos con efectos permanentes), DEBES:

1. Preguntar al usuario: "¿Deseas que implemente [X]?"
2. Explicar brevemente qué hará la implementación
3. Ofrecer alternativas si existen
4. Esperar confirmación explícita del usuario

**EXCEPCIÓN:** Puedes ejecutar comandos de solo lectura (ls, cat, grep, read) sin confirmación.

### 3. Actualizar Estadísticas

Al final de cada sesión, actualiza la sección de estadísticas en `AI_USAGE_LOG.md`:

- Total de acciones registradas
- Acciones completadas vs rechazadas
- Archivos creados/modificados
- Líneas de código generadas (estimación)

### 4. Contexto del Proyecto

Este es un proyecto con las siguientes características:

**Stack obligatorio:**
- Frontend: React + TypeScript
- Backend: Express + TypeScript
- Persistencia: LocalStorage (frontend - backend (json no BBDD)) + JSON files (backend)
- Integración: SnailPay (mock de pasarela de pagos)

**Arquitectura acordada:**
- Monolito con separación frontend-backend
- Directorio `dtos/` compartido para tipos TypeScript
- SnailPay como servicio interno del backend (mock)
- JSON como "base de datos" (users.json, transactions.json)

**Objetivo del registro:**
El archivo `AI_USAGE_LOG.md` servirá como fuente de verdad para generar el reporte de uso de IA requerido en el PDF de entregables.

---

## Prohibiciones

- NO implementes nada sin cuestionar primero (excepto comandos de solo lectura)
- NO omitas el registro en AI_USAGE_LOG.md
- NO generes código sin explicar qué hace
- NO uses librerías no mencionadas en la arquitectura acordada sin consultar

---

## Checklist Antes de Cualquier Acción

- [ ] Registré la intención en AI_USAGE_LOG.md
- [ ] Cuestioné al usuario sobre la implementación (si aplica)
- [ ] Esperé confirmación explícita (si aplica)
- [ ] Actualizaré estadísticas al finalizar

---

*Este archivo es el punto de entrada para cualquier herramienta de IA que trabaje en este proyecto.*
