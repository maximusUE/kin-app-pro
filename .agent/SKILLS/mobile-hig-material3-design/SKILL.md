---
name: mobile-hig-material3-design
description: Estándares maestros de diseño ergonómico móvil basados en Apple iOS 18 HIG y Android 15 Material You 3 para evitar interfaces comprimidas o desalineadas.
---

# Mobile HIG & Material 3 Design System

Este skill es la guía mandatoria para `mobile_ui_designer` y define los estándares de ergonomía, espaciado y ritmo visual para pantallas móviles nativas.

## 1. Ergonomía Táctil y Dimensiones Obligatorias
- **Touch Target Mínimo:** 52px a 56px de altura en botones de acción principal, inputs y tarjetas seleccionables.
- **Tipografía Base:** `16px` (`text-base` o `1rem`) en todo campo `<input>` y `<textarea>`. Esto previene el comportamiento intrusivo de zoom automático en iOS Safari.
- **Radio de Bordes (Border Radius):**
  - Inputs y Tarjetas de Contenido: `16px` a `20px` (`rounded-2xl` o `rounded-3xl`).
  - Botones de Acción (CTAs): `rounded-full` (píldoras completas) o `rounded-2xl`.
- **Márgenes Perimetrales:** `20px` a `24px` (`px-5` a `px-6`) para dar aire natural y evitar que el contenido toque el marco del celular.

## 2. Prevención de Interfaces Comprimidas
- **Prohibición de Apilamiento Masivo:** Nunca apilar verticalmente más de 4 campos seguidos en una sola columna si pueden organizarse en pares relacionados.
- **Grids de 2 Columnas:** Campos complementarios (ej. *Nombre* y *Apellido*, o *Contraseña* y *Confirmar*) deben organizarse en `grid grid-cols-2 gap-3` para reducir el scroll vertical un 40%.
- **Altura de Pantalla:** Usar siempre `min-h-[100dvh]` (Dynamic Viewport Height) en lugar de `100vh` fijo para adaptarse con precisión a la barra de direcciones flotante de iOS y Android.
- **Safe Areas:** Utilizar clases que respeten `env(safe-area-inset-top)` y `env(safe-area-inset-bottom)`.

## 3. Paleta de Color Oficial KIN (Modo Oscuro)
- **Fondo Primario:** `#121622` o `#090D16` con degradado radial sutil `#152E2B` en el cabezal.
- **Superficie de Tarjetas e Inputs:** `#182030` con borde `1px solid rgba(255, 255, 255, 0.08)`.
- **Acento Primario (Mint/Turquesa):** `#2ED5A4` (hover: `#26BC90`, active: `#1EA77F`).
- **Texto Principal (Títulos):** `#FFFFFF` (Blanco puro, font-semibold / font-bold).
- **Texto Secundario (Etiquetas/Subtítulos):** `#8E9AA8` (Gris frío con contraste legible).
- **Acentos de Alerta:** `#E06C75` (Error), `#E5C07B` (Advertencia/Pendiente).

## 4. Anatomía de Campos de Formulario
Todo `<input>` debe incluir:
1. Icono representativo a la izquierda en color `#8E9AA8` (ej. Correo, Candado, Teléfono, Documento).
2. Padding izquierdo compensado `pl-12` para dejar respirar el texto.
3. Botón de visibilidad interactivo a la derecha para campos sensibles (`pr-12`).
