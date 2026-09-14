---
name: qa-mobile-visual-auditor
description: Auditoría visual automatizada y verificación heurística para garantizar acabados móviles de nivel de producción, espaciado generoso y cero defectos de diseño.
---

# QA Mobile Visual Auditor Skill

Este skill instruye a `qa_visual_inspector` en la validación estricta de interfaces antes de cualquier entrega al usuario.

## 1. Criterios de Rechazo Inmediato (Veto QA)
Una pantalla será **inmediatamente rechazada para rediseño** si presenta cualquiera de los siguientes defectos:
1. **Sensación de Amontonamiento:** Elementos apretados sin margen de respiración superior o lateral.
2. **Scroll Vertical Innecesario:** Formularios donde se apilan más de 4 campos en una sola columna en vez de usar distribuciones de 2 columnas para pares relacionados.
3. **Falta de Iconos Líderes:** Inputs de texto sin el icono semántico correspondiente a la izquierda.
4. **Zoom Forzado en iOS:** Campos de formulario con tamaño de fuente menor a `16px`.
5. **Colisión de Botones:** Botones principales pegados a otros elementos sin un mínimo de 14px de separación.

## 2. Checklist de Aprobación
- [ ] ¿El fondo utiliza la paleta oscura elegante (`#121622`) con alto contraste?
- [ ] ¿Los botones e inputs tienen mínimo 52px de altura?
- [ ] ¿Los bordes tienen el sutil toque de `1px solid rgba(255,255,255,0.08)`?
- [ ] ¿El acento de acción (`#2ED5A4`) es claro, nítido y consistente?
