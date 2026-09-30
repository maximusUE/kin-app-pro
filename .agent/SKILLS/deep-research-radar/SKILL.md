---
name: deep-research-radar
description: "Metodología de inteligencia de mercado tecnológica y validación de fuentes primarias Tier 1-3. Detección de hype vs realidad técnica, auditoría de precios reales, límites de cuotas de APIs y matriz de decisión tecnológica (Adopt/Trial/Watch/Ignore). Diseñado para el Tech Trends Researcher."
license: MIT
---

# Deep Research & Tech Radar Protocol

Este skill define el protocolo de inteligencia de mercado e investigación técnica rigurosa para el `Tech_Trends_Researcher`. Erradica la adopción de herramientas por moda publicitaria y garantiza decisiones basadas en datos empíricos.

---

## 🏛️ 1. Jerarquía de Fuentes de Verificación (Tier 1 a 3)

Toda afirmación técnica debe rastrearse hasta su fuente primaria:

1. **Tier 1 (Máxima Autoridad — Evidencia Factual):**
   - Repositorios oficiales de código abierto (código fuente, commits, tags de release, changelogs en GitHub).
   - Documentación técnica oficial y portales de desarrolladores (`docs.stripe.com`, `supabase.com/docs`, RFCs de la IETF).
   - Registros regulatorios gubernamentales y bancarios (Banxico, CNBV, FinCEN, SAT).
   - Pruebas reproducibles en terminal local o benchmarks auditados.
2. **Tier 2 (Confianza Alta — Experiencia Técnica Comprobada):**
   - Blogs de ingeniería de empresas líderes (Cloudflare Blog, Uber Engineering, Vercel Changelog).
   - Artículos técnicos de arquitectos reconocidos con casos de estudio reales.
3. **Tier 3 (Indicadores de Tendencia — Requiere Verificación Cruzada):**
   - Discusiones en Reddit (`r/webdev`, `r/nextjs`), Hacker News, hilos de X/Twitter, podcasts.
   - Estos contenidos son pistas para investigar, nunca verdades fácticas definitivas.

---

## 🧭 2. Matriz de Decisión Tecnológica (Adopt / Trial / Watch / Ignore)

Cada nueva tecnología, librería o servicio evaluado debe clasificarse formalmente en uno de estos 4 cuadrantes:

- **ADOPT (Adoptar):**
  - Madurez comprobada en producción a gran escala.
  - Documentación impecable, comunidad activa y sin riesgos de abandono a 2 años.
  - Resuelve un dolor real con menor costo y complejidad que las alternativas.
- **TRIAL (Probar en Aislamiento):**
  - Tecnología promisoria que resuelve un cuello de botella específico.
  - Se evalúa en un micro-servicio, script interno o prototipo sin comprometer el núcleo del producto.
- **WATCH (Monitorear):**
  - Proyecto interesante pero en fase experimental (versiones `0.x`, APIs inestables, documentación incompleta).
  - Mantener en el radar; no usar en producción todavía.
- **IGNORE (Ignorar / Rechazar):**
  - Hype publicitario sin sustancia técnica.
  - Herramientas que añaden capas innecesarias de complejidad, dependencias riesgosas o costos ocultos leoninos.

---

## 🔍 3. Protocolo de Auditoría de Costos y Cuotas Reales

Para cualquier servicio o API recomendada, es mandatorio extraer y auditar:
1. **Nivel Gratuito vs Escalón de Pago (Free Tier vs Paid Tiers):** ¿Qué ocurre exactamente cuando el cliente supera los 1,000 o 10,000 usuarios activos?
2. **Costos Ocultos por Uso:** Cobros por ancho de banda (Egress fees), operaciones de lectura/escritura (IOPS), llamadas a LLMs por token.
3. **Vendor Lock-In (Dependencia Forzada):** ¿Qué tan difícil y costoso sería migrar la base de datos o el frontend a otro proveedor si suben los precios un 300%?
4. **Acuerdo de Nivel de Servicio (SLA):** Disponibilidad garantizada y canales reales de soporte al cliente.
