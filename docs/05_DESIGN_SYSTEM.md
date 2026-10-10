# 🎨 Sistema de Diseño, Ergonomía y Modo Claro/Oscuro (05_DESIGN_SYSTEM)

> **Documento:** 05_DESIGN_SYSTEM.md  
> **Estándar:** Apple iOS 18 Human Interface Guidelines (HIG) & Google Material 3  
> **Firma Visual:** Cápsulas Ovaladas Fijas (Regla Don César)  
> **Archivos Clave:** [`globals.css`](file:///Users/cesarue/Desktop/Proyecto%20YouTube/src/app/globals.css), [`SendView.tsx`](file:///Users/cesarue/Desktop/Proyecto%20YouTube/src/components/views/SendView.tsx), [`KinCashP2PModal.tsx`](file:///Users/cesarue/Desktop/Proyecto%20YouTube/src/components/KinCashP2PModal.tsx)  

---

## 1. 💎 Filosofía de Diseño: Fintech de Alta Gama

KIN no utiliza interfaces genéricas ni plantillas prefabricadas. La experiencia visual sigue principios estrictos:
1. **Claridad Inmediata:** Los números de dinero y los tipos de cambio deben leerse de un solo vistazo.
2. **Confianza y Solidez Bancaria:** Tonos esmeralda institucionales combinados con superficies limpias y sombras de elevación orgánica.
3. **Ergonomía Táctil Móvil:** Ningún elemento interactivo tiene un área de toque menor a 48px, facilitando el uso con una sola mano en pantallas táctiles de cualquier tamaño.

---

## 2. 🇺🇸 La Firma Visual: "Regla Estilo Píldora Bandera USA"

Uno de los mayores sellos de identidad de KIN es la **cápsula fija en forma de óvalo (`rounded-full`)**, inspirada en la simetría y solidez del botón de divisa estadounidense `[ 🇺🇸 USD ]`.

### Anatomía de la Cápsula Gemela de Monto y Divisa:
En todas las pantallas principales de transferencia (`SendView`, `SendQuickView`, `KinCashP2PModal`):

```tsx
/* Contenedor del Monto (Cápsula Ovalada Fija) */
<div className="flex items-center gap-2 min-w-0 flex-1 h-14 px-4.5 rounded-full bg-slate-50 dark:bg-surface-container border border-slate-200/90 dark:border-white/10 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
  <span className="font-financial-mono text-2xl sm:text-3xl text-emerald-600 dark:text-primary font-black select-none shrink-0">$</span>
  <input
    type="text"
    inputMode="decimal"
    className="w-full bg-transparent border-none border-0 outline-none focus:outline-none focus:ring-0 font-financial-mono text-2xl sm:text-3xl text-slate-900 dark:text-white font-black placeholder:text-slate-400 py-0 cursor-text shadow-none"
  />
</div>

/* Botón Gemelo de la Bandera (Mismo alto, mismo radio, mismo acabado) */
<div className="h-14 px-4.5 rounded-full bg-white dark:bg-surface-container border border-slate-200/90 dark:border-white/10 shadow-sm flex items-center gap-2 shrink-0 select-none">
  <span className="text-xl">🇺🇸</span>
  <span className="font-title-base text-xs sm:text-sm text-slate-900 dark:text-white font-black tracking-wide">USD</span>
</div>
```

### Reglas de Implementación Obligatorias:
- **Altura Universal:** `h-14` (56px) para campos principales de entrada y botones de moneda; `h-9` a `h-10` (36px-40px) para chips de montos predeterminados (`+$50`, `+$100`, etc.).
- **Borde de Contorno:** `rounded-full` al 100% (cero esquinas cuadradas o rectángulos rígidos de 90°).
- **Entrada Numérica Inerte:** El `<input>` HTML interior es 100% transparente (`bg-transparent border-0 outline-none`) para que la cápsula ovalada sea el único contenedor visible.

---

## 3. 🌓 Armonía de Modo Claro y Modo Oscuro (Light & Dark Mode)

### Blindaje de Estilos Globales en `src/app/globals.css`:
Para evitar que los navegadores móviles dibujen bordes rectangulares por defecto en Modo Claro, existe una regla de exención prioritaria:

```css
/* Exenciones para inputs dentro de cápsulas ovaladas en Modo Claro */
html.light input.bg-transparent,
html.light input.border-0,
html.light input.border-none,
html.light .rounded-full input,
html.light input#send-amount-input {
  background-color: transparent !important;
  border: none !important;
  border-width: 0 !important;
  box-shadow: none !important;
  outline: none !important;
}
```

### Matriz de Tokens de Color:

| Elemento | Modo Claro (`Light`) | Modo Oscuro (`Dark`) |
| :--- | :--- | :--- |
| **Fondo General** | `#F8FAFC` (Slate 50 / Nieve) | `#0B0C15` (Obsidiana) |
| **Tarjetas Principales** | `bg-white border-slate-200/80 shadow-sm` | `bg-surface-container border-white/5` |
| **Cápsula de Monto** | `bg-slate-50 border-slate-200/90` | `bg-surface-container-high border-white/10` |
| **Texto de Encabezados** | `text-slate-900` (#0F172A) | `text-white` (#FFFFFF) |
| **Texto Secundario** | `text-slate-500` (#64748B) | `text-[#8E91A5]` |
| **Color Primario (Acento)** | `text-emerald-600` / `bg-emerald-600` | `text-primary` / `bg-primary` (#2ED5A4) |

---

## 4. 🔤 Tipografía y Jerarquía Visual

- **Display & Moneda:** `font-financial-mono` con variantes `font-bold` y `font-black`. Garantiza que los números de saldos y tipos de cambio no salten ni vibren al cambiar de dígitos.
- **Títulos y Acciones:** `font-title-base` con `tracking-wide`.
- **Micro-textos y Badges:** `font-caption-sm` y `font-label-caps` (mayúsculas espaciadas con `tracking-wider`).
