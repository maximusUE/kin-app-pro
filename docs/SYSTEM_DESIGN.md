# SYSTEM DESIGN — CÓDIGO PROPIO

> Arquitectura técnica del sistema de producción de contenido automatizado.
> Para identidad de marca y diseño del canal, ver `CHANNEL_DESIGN.md`.

---

## 1. Visión General

Sistema de automatización que genera, aprueba y publica 3 videos semanales de forma semi-autónoma. El humano solo interviene en el paso de aprobación de guion vía Telegram.

```
[Gemini AI] → [Aprobación Telegram] → [ElevenLabs Audio] + [Pexels B-Roll] → [Google Drive] → [Google Sheets]
```

---

## 2. Stack Técnico

| Capa              | Tecnología                         | Versión    |
|-------------------|------------------------------------|------------|
| **Runtime**       | Node.js + TypeScript               | TS ^5      |
| **Framework Web** | Next.js                            | 14.2.3     |
| **IA / Guionista**| Google Gemini (`generative-ai`)    | ^0.11.1    |
| **Mensajería**    | Telegraf (Telegram Bot)            | ^4.16.3    |
| **Storage API**   | Google Drive (`googleapis`)        | ^137.1.0   |
| **Audio**         | ElevenLabs REST API                | —          |
| **Video B-Roll**  | Pexels API                         | —          |
| **Automatización**| n8n (self-hosted, EasyPanel)       | —          |
| **Base de Datos** | Supabase (PostgreSQL)              | —          |

---

## 3. Estructura de Carpetas

```
src/
├── domain/
│   └── bible/          # Dominio bíblico (devotionals, versículos, temas)
├── api/
│   └── webhooks/       # Endpoints para n8n y servicios externos
├── web/                # Frontend Next.js (UI de control)
└── scripts/
    ├── contentFactoryWorker.ts   # Worker principal: genera guion + activos
    ├── telegramBot.ts            # Bot de aprobación humana
    ├── listModels.ts             # Utilidad: listar modelos disponibles de Gemini
    └── testRunner.ts             # Runner de pruebas locales
```

---

## 4. Arquitectura del Flujo (n8n)

### Paso a Paso

1. **Trigger (Manual / Schedule):** Inicia el flujo con los 3 temas de la semana.
2. **Agente Guionista (Gemini):** Genera guion completo + 15 queries de Pexels por video.
3. **Aprobación Humana (Telegram):** El bot envía el guion para revisión. Sin aprobación, el flujo se detiene.
4. **Audio (ElevenLabs):** Limpia timestamps del guion → envía texto puro → recibe MP3.
5. **Visuales (Pexels):** Nodo Code separa queries → HTTP GET búsqueda → HTTP GET descarga binaria.
6. **Almacenamiento (Google Drive):** Sube MP3 + MP4s con nomenclatura: `YYYY-MM-DD_titulo-video/`.
7. **Registro (Google Sheets):** Actualiza el semáforo de estado: 🔴 Pendiente → 🟡 En proceso → 🟢 Publicado.

### Anti-Pattern 429 (ElevenLabs Rate Limit)
- Usa **Split In Batches** con delay configurado entre cada video.
- Nunca procesar más de 1 audio en paralelo.
- Log de errores en Google Sheets si falla algún nodo.

---

## 5. Variables de Entorno

Ver `.env.example` para la lista completa. Variables críticas:

```env
GEMINI_API_KEY=           # Google AI Studio
ELEVENLABS_API_KEY=       # ElevenLabs
ELEVENLABS_VOICE_ID=      # ID de voz (Adam / Marcus)
TELEGRAM_BOT_TOKEN=       # BotFather token
TELEGRAM_CHAT_ID=         # ID del chat de aprobación
PEXELS_API_KEY=           # Pexels
GOOGLE_CLIENT_ID=         # Google OAuth
GOOGLE_CLIENT_SECRET=     # Google OAuth
GOOGLE_DRIVE_FOLDER_ID=   # Carpeta destino en Drive
```

---

## 6. Integraciones Externas (Webhooks)

| Endpoint                        | Método | Trigger            | Descripción                              |
|---------------------------------|--------|--------------------|------------------------------------------|
| `/api/webhooks/approve`         | POST   | Telegram callback  | Aprueba o rechaza guion                  |
| `/api/webhooks/content-ready`   | POST   | n8n               | Notifica que el video está listo         |
| `/api/webhooks/sheets-update`   | POST   | n8n               | Actualiza estado en Google Sheets        |

---

## 7. Deploy

Ver `docs/DEPLOY.md` para instrucciones completas.

| Servicio        | Plataforma                  |
|-----------------|-----------------------------|
| Frontend        | Vercel                      |
| Backend / n8n   | EasyPanel + Docker          |
| Base de datos   | Supabase                    |
| CI/CD           | GitHub Actions (lint + test)|

---

## 8. Interfaz de Usuario (Dashboard)

El dashboard web (`src/app/page.tsx`) sirve como la consola central de control y edición para el creador.

### Características del Layout
- **Barra Lateral Colapsable:** La barra lateral se puede colapsar/expandir usando el botón de toggle `[|]` en el navbar superior. Esto permite maximizar el espacio de lectura y edición de guiones a pantalla completa.
- **Grabador de Voz Integrado en Barra Lateral:** El grabador por secciones se ubica de forma compacta en la barra lateral para evitar la necesidad de desplazarse verticalmente mientras se lee el guion en el editor principal.
  - Se muestra únicamente cuando hay un guion seleccionado en edición.
  - Permite grabación por slots individuales (`Sección 01`, `Sección 02`, etc.) con guardado directo en la Mac.

