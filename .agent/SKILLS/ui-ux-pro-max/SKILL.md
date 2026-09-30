---
name: ui-ux-pro-max
description: "Inteligencia de diseño UI/UX para interfaces web y móviles. Incluye arquitectura de tokens (primitivos, semánticos, componentes), escala tipográfica, accesibilidad WCAG 2.1 AA/AAA, ergonomía móvil táctil y matriz de razonamiento visual. Diseñado para el UI/UX Design Engineer."
license: MIT
---

# UI/UX Pro Max — Design Intelligence System

Inspirado en el estándar de `ui-ux-pro-max`, este skill proporciona la matriz de reglas y directrices de diseño estructurado para el `UI_UX_Design_Engineer`.

---

## 🎯 1. Jerarquía de Reglas por Prioridad

| Prioridad | Categoría | Impacto | Criterios Obligatorios | Anti-Patrones Prohibidos |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Accesibilidad** | CRÍTICO | Contraste $\ge 4.5:1$, soporte de lectores de pantalla (`aria-label`), navegación por teclado fluida. | Quitar anillos de foco sin reemplazo, botones con solo icono sin texto alternativo. |
| **2** | **Táctil e Interacción** | CRÍTICO | Touch target mínimo de $48\times 48\text{px}$ a $56\text{px}$, separación $\ge 8\text{px}$, feedback visual en $<100\text{ms}$. | Dependencia exclusiva de hover, cambios de estado instantáneos a 0ms sin feedback. |
| **3** | **Rendimiento Visual** | ALTO | Cero salto de maquetación (CLS $< 0.1$), imágenes WebP/SVG, reserva de espacio para skeletons. | Repintados forzados, imágenes sin dimensiones explícitas que empujan el layout. |
| **4** | **Consistencia y Estilo** | ALTO | Paleta semántica estricta, iconografía coherente de una sola librería SVG. | Mezclar estilos planos con esqueuomórficos al azar, usar emojis como iconos de sistema. |
| **5** | **Layout y Responsive** | ALTO | Mobile-first, uso de `100dvh` para viewports dinámicos, respeto de `env(safe-area-inset-*)`. | Scroll horizontal involuntario, anchos fijos en píxeles que desbordan pantallas pequeñas. |
| **6** | **Tipografía y Color** | MEDIO | Texto base $16\text{px}$ en inputs (previene zoom forzado en iOS), line-height $\ge 1.5$ en texto largo. | Textos $< 12\text{px}$ en párrafos, gris claro sobre fondo gris, colores hex crudos sin tokens. |
| **7** | **Animación con Sentido** | MEDIO | Duraciones entre $150\text{ms}$ y $300\text{ms}$, respeto a `prefers-reduced-motion`. | Animar ancho/alto provocando reflows, transiciones eternas que bloquean la agilidad. |
| **8** | **Formularios y Feedback** | MEDIO | Labels siempre visibles, errores inline junto al campo infractor, guardado de borrador. | Usar el placeholder como único label, mostrar errores genéricos solo en la cabecera. |
| **9** | **Navegación Móvil** | ALTO | Dock inferior de máximo 5 destinos, botón atrás con comportamiento predecible. | Sobrecargar la navegación con más de 5 pestañas, romper el historial de navegación. |
| **10** | **Datos y Métricas** | MEDIO | Etiquetas claras, leyendas accesibles, formato numérico local (`toLocaleString`). | Confiar únicamente en el color para diferenciar estados positivos de negativos. |

---

## 🏛️ 2. Arquitectura de Tokens de Diseño

El diseño debe organizarse en 3 capas de abstracción para garantizar escalabilidad y adaptabilidad a temas claro/oscuro:

1. **Tokens Primitivos (Valores Crudos):**
   - Colores base de la marca: `kin-emerald-500: #2ED5A4`, `slate-950: #090D16`, `slate-900: #121622`.
   - Espaciado: `space-1: 4px`, `space-2: 8px`, `space-4: 16px`, `space-6: 24px`.
2. **Tokens Semánticos (Propósito y Contexto):**
   - `bg-surface-primary`: `#090D16` (en dark) / `#FFFFFF` (en light).
   - `bg-surface-card`: `#182030` con borde sutil `rgba(255,255,255,0.08)`.
   - `text-primary`: `#FFFFFF` / `text-muted`: `#8E9AA8`.
   - `accent-action`: `#2ED5A4` (hover: `#26BC90`).
3. **Tokens de Componente:**
   - Botón Principal: Altura $52\text{px}$, borde redondeado `rounded-2xl`, fuente `font-semibold`.
   - Input de Texto: Altura $52\text{px}$, padding `pl-12 pr-4`, fondo oscuro contrastado.

---

## 📱 3. Ergonomía en Pantallas Móviles

- **Zona del Pulgar (Thumb Zone):** Los botones de acción primaria (`Enviar`, `Pagar`, `Confirmar`) deben ubicarse en el tercio inferior de la pantalla o fijados en un dock inferior accesible.
- **Formularios Ágiles:** Agrupar campos cortos en parejas de 2 columnas (`Nombre` y `Apellido`, `Fecha de Expiración` y `CVV`) para reducir la fatiga de scroll vertical un 40%.
- **Separación de Zonas de Destrucción:** Botones de acción peligrosa (`Eliminar cuenta`, `Cancelar transacción`) deben estar separados de los botones primarios y requerir confirmación explícita.
