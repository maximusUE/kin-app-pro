---
name: impeccable-frontend-craft
description: "Estándares de artesanía frontend out-of-distribution (Craft Floor) para erradicar interfaces genéricas de IA (vibe-coding slop), optimizar tipografía, ritmo visual, micro-interacciones, superficies del navegador y accesibilidad profunda. Diseñado para el Frontend Engineer."
license: Apache-2.0
---

# Impeccable Frontend Craft — The Quality Floor

Inspirado en el proyecto `impeccable` de Paul Bakaus, este skill define el **piso de calidad obligatorio (Craft Floor)** para el `Frontend_Engineer`. Prohíbe los vicios visuales genéricos de las IAs y exige acabados de nivel de estudio de diseño de élite.

---

## 🚫 1. Refuse (Vicios y Malos Hábitos de IA Prohibidos)

### Estructura de Página
- ❌ **Prohibición de Grids Idénticos de Tarjetas:** Jamás estructurar una página completa usando tarjetas idénticas de [icono + título + párrafo]. Las tarjetas son el contenedor perezoso; los grids monótonos destruyen la jerarquía visual.
- ❌ **Prohibición de Eyebrows/Kickers Forzados:** Prohibido poner una mini-etiqueta en mayúsculas ("kicker" o "eyebrow") arriba de cada título de sección. El encabezado debe hablar por sí mismo.
- ❌ **Prohibición de Números de Sección Decorativos:** Eliminar "01 / 02 / 03" a menos que la secuencia sea un paso a paso estricto que el usuario deba seguir.
- ❌ **Prohibición de Modales por Reflejo:** Nunca abrir un modal para tareas que no requieran interrupción crítica o enfoque protegido.

### Superficies y Estilos
- ❌ **Prohibición de Texto con Degradado (Gradient Text):** El énfasis visual se logra con peso tipográfico, tamaño o escala de contraste, no con degradados arcoíris.
- ❌ **Prohibición de Glassmorphism Genérico:** El efecto `backdrop-blur` es una herramienta funcional para capas superpuestas (headers flotantes, bottom sheets), nunca una decoración arbitraria de fondo.
- ❌ **Prohibición de Sombras Duras sin Desenfoque:** Sombras como `box-shadow: 4px 4px 0` están prohibidas salvo en identidades puramente neobrutalistas. En apps modernas, las sombras deben tener `offset-y` suave y desenfoque difuso natural.
- ❌ **Prohibición de Emojis como Iconos:** Prohibido usar glifos unicode o emojis (`💸`, `⚡`, `⚙️`) como reemplazo de iconos de sistema. Los iconos deben ser SVGs vectoriales precisos con un grosor de trazo consistente.
- ❌ **Prohibición de Ilustraciones SVG "Boceto/Doodle":** SVGs imitando dibujos a mano amateur (`loose-sketch`) denotan baja calidad. Se exige geometría vectorial nítida, diagramas limpios o iconografía profesional.

---

## ✅ 2. Verify (El Estándar de Artesanía Obligatorio)

### Contraste y Legibilidad
- **Ratio de Contraste WCAG:** Texto de cuerpo y placeholders $\ge 4.5:1$. Texto grande $\ge 3:1$.
- **Tintado Armónico:** En superficies con color, el texto secundario no debe ser gris neutro deslavado; debe llevar un tinte sutil del matiz de fondo para integrarse armónicamente.

### Tipografía y Espaciado
- **Medida de Lectura (Measure):** El texto de párrafo debe tener un ancho óptimo de 60 a 75 caracteres (`max-w-prose` o `65ch`).
- **Tracking Compensado:** Títulos grandes en negrita deben usar tracking ligeramente ajustado (`-0.02em` a `-0.03em`) para mayor impacto y cohesión visual.
- **Ritmo Vertical:** Siempre debe haber significativamente más espacio libre **arriba** de un encabezado que **abajo** del mismo (`mt-8 mb-2`), agrupando el título con su contenido correspondiente.

### Movimiento y Micro-interacciones
- **Curva de Aceleración:** Curvas de salida exponencial (`cubic-bezier(0.16, 1, 0.3, 1)` o `ease-out`) que inicien desde estados ya visibles.
- **Un Momento con Propósito:** Evitar animar absolutamente cada elemento de la pantalla; concentrar la fluidez en el elemento focal o en las transiciones de pantalla.
- **Feedback Táctil:** Todo botón interactivo debe responder a `:active` con compresión sutil (`scale-[0.98]` o `touch-press`).

### Superficies Nativas del Navegador (Browser Surfaces)
Las partes que no se dibujan explícitamente deben armonizarse con la identidad:
1. **Selección de Texto:** `::selection` estilizado con el color de acento de la app.
2. **Scrollbars Personalizadas:** Delgadas, discretas y con radio redondeado, nunca la barra gris tosca por defecto del sistema operativo.
3. **Anillos de Enfoque:** `focus-visible:ring-2` elegante, sin contornos agresivos.
4. **Números Tabulares:** En tablas de precios, saldos o tasas, usar `font-mono tabular-nums` para que las cifras no salten ni vibren al cambiar.

### Cobertura de Estados
Todo componente interactivo debe tener implementados sus 5 estados:
1. **Default** (Normal)
2. **Hover / Focus-visible** (Interacción)
3. **Active / Pressed** (Pulsado táctil)
4. **Loading / Skeleton** (Carga con placeholder)
5. **Error / Empty State** (Manejo claro del fallo con botón de recuperación)
