---
name: grill-me-architecture
description: "Metodología de interrogatorio implacable en rondas y árbol de diseño para validar propuestas técnicas, arquitectura y requerimientos sin suposiciones no verificadas. Diseñado para el Senior Lead Engineer y Directores Técnicos."
license: MIT
---

# Grill-Me Architecture & Design Tree Protocol

Inspirado en la metodología de Matt Pocock (`grilling`), este skill es el protocolo mandatorio del `Senior_Lead_Engineer` para interrogar, blindar y poner a prueba cualquier plan, decisión de arquitectura o requerimiento antes de escribir una sola línea de código.

---

## 🌳 1. El Concepto del Árbol de Diseño (Design Tree)

Toda decisión técnica importante tiene ramas de decisiones secundarias que dependen directamente de ella.
- **La Frontera (Frontier):** Es el conjunto de decisiones cuyos prerrequisitos ya están resueltos; son las preguntas que se pueden hacer **ahora mismo** sin adivinar respuestas futuras.
- **Prohibición de Suposiciones Silenciosas:** Jamás asumir una respuesta clave sobre infraestructura, modelo de negocio, presupuesto o seguridad. Si la respuesta cambia la arquitectura, pertenece a la frontera.

---

## 🔄 2. Estructura de Rondas de Interrogatorio (Rounds)

El Senior Lead Engineer presenta la frontera completa en rondas estructuradas. Cada pregunta incluye el contexto, las opciones y la **respuesta recomendada** por el arquitecto:

```markdown
❓ **Q1 — [Título de la Decisión Clave]**
Contexto breve y qué ramificaciones técnicas tiene esta elección.
- Opción A: ...
- Opción B: ...
➡️ **Respuesta Recomendada:** Opción A (Razón técnica/costo).

---

❓ **Q2 — [Título de la Siguiente Decisión]**
...
➡️ **Respuesta Recomendada:** ...
```

---

## ⚙️ 3. Reglas de Ejecución Mandatorias

1. **La investigación de hechos es trabajo del Ingeniero, no del cliente:** Si una pregunta depende de un dato del código, base de datos o APIs existentes, el Ingeniero inspecciona el repositorio directamente. Nunca pedirle al cliente que investigue lo que el agente puede verificar con sus herramientas.
2. **Las decisiones son del cliente; las recomendaciones son del Ingeniero:** Cada pregunta expone los pros y contras sin rodeos y recomienda el camino más sensato para un operador individual (menor costo, menor deuda técnica, máxima seguridad).
3. **Avance por Rondas:** Una respuesta del cliente desbloquea el siguiente nivel del árbol. Se recalcula la frontera y se presenta la siguiente ronda.
4. **Cierre de Sesión:** La sesión concluye cuando la frontera está vacía y todas las ramas del diseño están acordadas explícitamente.
5. **Veredicto Final Obligatorio:** Al concluir el interrogatorio, se emite formalmente el veredicto:
   - **`GO`**: Aprobado tal como fue acordado.
   - **`GO WITH CHANGES`**: Viable únicamente con ajustes específicos.
   - **`NO-GO`**: Rechazado técnicamente o financieramente con propuesta alternativa.
