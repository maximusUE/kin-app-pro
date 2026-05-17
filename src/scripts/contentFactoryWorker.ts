import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { google } from 'googleapis';
import { Telegraf, Markup } from 'telegraf';

/**
 * 🚀 FÁBRICA DE CONTENIDOS — MOTOR PRINCIPAL
 *
 * Flujo completo:
 * 1. Lee temas "Pendiente" de Google Sheets
 * 2. Gemini genera GUION + QUERIES para Pexels
 * 3. Envía guion a Telegram para aprobación humana
 * 4. (Tras aprobación — ver telegramBot.ts) se llama a processApprovedRow()
 *    → Descarga audio de ElevenLabs  → carpeta output/<fecha_tema>/audio/
 *    → Descarga videos de Pexels     → carpeta output/<fecha_tema>/videos/
 *    → Sube ambas carpetas a Google Drive
 *    → Actualiza Sheets con los links de Drive
 */

// ─── Clientes ──────────────────────────────────────────────────────────────

const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
let finalKey = rawKey.replace(/\\n/g, '\n');
if (finalKey.startsWith('"')) finalKey = finalKey.substring(1);
finalKey = finalKey.replace(/["',]+$/, '').trim();

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: finalKey,
  },
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
  ],
});

const sheets = google.sheets({ version: 'v4', auth });
const drive  = google.drive({ version: 'v3', auth });
const bot    = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

/** Genera contenido usando Groq API (gratis, rápido, sin restricciones regionales) */
async function geminiGenerate(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || '';
  if (!apiKey) throw new Error('GROQ_API_KEY no configurada en .env');

  for (let attempt = 0; attempt <= 3; attempt++) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens: 8192,
      }),
    });

    if (res.ok) {
      const data: any = await res.json();
      return data?.choices?.[0]?.message?.content || '';
    }

    const errText = await res.text();

    if (res.status === 429 && attempt < 3) {
      // Extrae el tiempo exacto de espera del mensaje de error ("try again in Xs")
      const match = errText.match(/try again in (\d+\.?\d*)s/i);
      const waitSec = match ? Math.ceil(parseFloat(match[1])) + 2 : 35;
      console.log(`⏳ Rate limit Groq — esperando ${waitSec}s (intento ${attempt + 1}/3)...`);
      await new Promise(r => setTimeout(r, waitSec * 1000));
      continue;
    }

    throw new Error(`Groq API error ${res.status}: ${errText.slice(0, 300)}`);
  }
  throw new Error('Groq: máximo de reintentos alcanzado.');
}

const SPREADSHEET_ID       = process.env.SPREADSHEET_ID!;
const TELEGRAM_CHAT_ID     = process.env.TELEGRAM_CHAT_ID!;
const DRIVE_ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;
const ELEVENLABS_API_KEY   = process.env.ELEVENLABS_API_KEY!;
const ELEVENLABS_VOICE_ID  = process.env.ELEVENLABS_VOICE_ID!;
const PEXELS_API_KEY       = process.env.PEXELS_API_KEY!;

// ─── Tipos ─────────────────────────────────────────────────────────────────

interface GeminiOutput {
  guion: string;
  pexels_queries: string[]; // 15 queries en inglés, cinematográficas
}

// ─── Utilidades de descarga ────────────────────────────────────────────────

/** Descarga una URL (http o https) a un archivo local. */
function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file  = fs.createWriteStream(destPath);
    proto.get(url, (res) => {
      // Seguir redirecciones (Pexels redirige a CDN)
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(res.headers.location!, destPath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

/** Sube un archivo local a una carpeta de Google Drive y devuelve el link. */
async function uploadToDrive(localPath: string, fileName: string, folderId: string): Promise<string> {
  const mimeType = localPath.endsWith('.mp3') ? 'audio/mpeg' : 'video/mp4';
  const res = await drive.files.create({
    requestBody: { name: fileName, parents: [folderId] },
    media: { mimeType, body: fs.createReadStream(localPath) },
    fields: 'id, webViewLink',
  });
  return res.data.webViewLink || `https://drive.google.com/file/d/${res.data.id}/view`;
}

/** Crea una carpeta en Drive dentro de un padre y devuelve su ID. */
async function createDriveFolder(name: string, parentId: string): Promise<string> {
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  });
  return res.data.id!;
}

// ─── PASO 1: Leer y generar guión ─────────────────────────────────────────

export async function runContentFactory() {
  console.log('🛠️  Arrancando Fábrica de Contenidos...');

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Matriz!A:H',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) { console.log('No hay datos en el Sheets.'); return; }

    const pendingRows = rows.filter(row => row[0] === 'Pendiente');
    console.log(`Encontrados ${pendingRows.length} temas pendientes.`);

    const batch = pendingRows.slice(0, 3);

    for (const row of batch) {
      const rowIndex = rows.indexOf(row) + 1;
      const pilar = row[4] || 'General';
      const tema  = row[5] || 'Sin Tema';

      console.log(`🤖 Generando guion para: [${pilar}] ${tema}`);

      // ── Llamada a Gemini (REST API v1) ────────────────────────────────
      const prompt = `Eres un guionista experto de YouTube para el canal "Código Propio".
El canal habla de negocios, mentalidad, dinero y sistemas. Estilo: mentor directo, sin humo.

Tu tarea es generar DOS cosas para el pilar "${pilar}" y el tema "${tema}":

1. GUION: Un guion directo y accionable de 12-14 minutos.
   - Empieza con un hook disruptivo (sin saludos)
   - Incluye 3 pasos accionables al final
   - Cada 30 segundos debe haber un mini-hook para retener

2. PEXELS_QUERIES: 15 búsquedas en inglés para encontrar B-roll cinematográfico oscuro.
   - Deben ser específicas y visuales (ej: "focused man typing dark office cinematic")
   - Relacionadas con el contenido del guion
   - Estilo: oscuro, profesional, cinematográfico

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin markdown, sin backticks.
Formato exacto:
{
  "guion": "texto completo del guion aquí",
  "pexels_queries": ["query 1", "query 2", ..., "query 15"]
}`;

      const rawText = (await geminiGenerate(prompt)).trim();

      // Parsear JSON de Gemini (limpiar backticks si los puso igual)
      let parsed: GeminiOutput;
      try {
        const clean = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        parsed = JSON.parse(clean);
      } catch {
        console.error('⚠️ Gemini no devolvió JSON válido, guardando como texto plano.');
        parsed = { guion: rawText, pexels_queries: [] };
      }

      // Guardar guion + queries en Sheets (G = guion, H = queries JSON)
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          data: [
            { range: `Matriz!G${rowIndex}`, values: [[parsed.guion]] },
            { range: `Matriz!H${rowIndex}`, values: [[JSON.stringify(parsed.pexels_queries)]] },
          ],
          valueInputOption: 'USER_ENTERED',
        },
      });

      // ── Enviar a Telegram para aprobación ────────────────────────────
      const preview = parsed.guion.length > 3500
        ? parsed.guion.substring(0, 3500) + '\n\n...[Guion truncado para previsualización]'
        : parsed.guion;

      const msg = `📝 *NUEVO GUION LISTO*\n\n*Pilar:* ${pilar}\n*Tema:* ${tema}\n\n*Queries Pexels (${parsed.pexels_queries.length}):*\n${parsed.pexels_queries.slice(0, 5).map(q => `• ${q}`).join('\n')}\n_...y ${Math.max(0, parsed.pexels_queries.length - 5)} más_\n\n\`\`\`\n${preview}\n\`\`\``;

      await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, msg, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('✅ Aprobar guion', `APPROVE_${rowIndex}`)],
          [Markup.button.callback('🔄 Rechazar y regenerar', `REJECT_${rowIndex}`)],
        ]),
      });

      // Actualizar estado
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Matriz!A${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [['En revision']] },
      });

      console.log(`✅ Guion [${tema}] enviado a Telegram.`);
    }
  } catch (error) {
    console.error('❌ Error en runContentFactory:', error);
  }
}

// ─── PASO 2: Producir assets (audio + videos) tras aprobación ──────────────

export type ProductionMode = 'full' | 'videos_only' | 'preview';

/**
 * Produce los assets del video según el modo elegido en Telegram.
 * @param rowIndex  Fila del Sheets (1-indexed)
 * @param mode      'full' = audio completo + videos
 *                  'videos_only' = solo videos de Pexels (sin gastar créditos)
 *                  'preview' = solo primeros ~400 chars de audio (test de voz)
 */
export async function processApprovedRow(rowIndex: number, mode: ProductionMode = 'full') {
  console.log(`🎬 Produciendo assets para fila ${rowIndex}...`);

  try {
    // Leer datos de la fila aprobada
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `Matriz!A${rowIndex}:H${rowIndex}`,
    });
    const row = res.data.values?.[0];
    if (!row) throw new Error(`Fila ${rowIndex} no encontrada.`);

    const tema   = row[5] || 'video';
    const guion  = row[6] || '';
    const queriesRaw = row[7] || '[]';
    const queries: string[] = JSON.parse(queriesRaw);

    // Nombre de carpeta: YYYY-MM-DD_tema (sin espacios)
    const fecha    = new Date().toISOString().slice(0, 10);
    const slug     = tema.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const baseDir  = path.join(process.cwd(), 'output', `${fecha}_${slug}`);
    const audioDir = path.join(baseDir, 'audio');
    const videoDir = path.join(baseDir, 'videos');

    fs.mkdirSync(audioDir, { recursive: true });
    fs.mkdirSync(videoDir, { recursive: true });

    console.log(`📁 Carpetas creadas: ${baseDir}`);

    // ── A) Audio — según el modo elegido ─────────────────────────────
    let audioPath: string | null = null;

    // Limpiar el guion: eliminar timestamps tipo [0:00] o (0:00)
    const cleanScript = guion
      .replace(/\[?\d{1,2}:\d{2}\]?/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (mode === 'videos_only') {
      console.log('⏭️  Modo "Solo Videos" — ElevenLabs omitido.');

    } else {
      // 'full' → guion completo | 'preview' → primeros 400 chars (≈30 seg)
      const textToSend = mode === 'preview'
        ? cleanScript.slice(0, 400)
        : cleanScript;

      const charCount = textToSend.length;
      const estimatedCost = ((charCount / 1000) * 0.18).toFixed(4); // ~$0.18/1k chars
      console.log(`🔊 Enviando ${charCount} chars a ElevenLabs (modo: ${mode}, ~$${estimatedCost})...`);

      const elevenRes = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: textToSend,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        }
      );

      if (!elevenRes.ok) {
        throw new Error(`ElevenLabs error: ${elevenRes.status} ${await elevenRes.text()}`);
      }

      const filename = mode === 'preview' ? 'preview_hook.mp3' : 'narration.mp3';
      audioPath = path.join(audioDir, filename);
      const audioBuffer = await elevenRes.arrayBuffer();
      fs.writeFileSync(audioPath, Buffer.from(audioBuffer));
      console.log(`✅ Audio guardado: ${audioPath}`);
    }

    // ── B) Descargar videos de Pexels (siempre, en todos los modos) ──
    console.log(`🎥 Descargando ${queries.length} videos de Pexels...`);

    let clipIndex = 1;
    for (const query of queries.slice(0, 15)) {
      try {
        // Buscar video en Pexels
        const searchRes = await fetch(
          `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
          { headers: { Authorization: PEXELS_API_KEY } }
        );
        const searchData: any = await searchRes.json();
        const video = searchData?.videos?.[0];
        if (!video) { console.warn(`⚠️ Sin resultado para: "${query}"`); continue; }

        // Preferir calidad HD (1280) o la más alta disponible
        const files: any[] = video.video_files || [];
        const hdFile = files.find((f: any) => f.width === 1280)
          || files.find((f: any) => f.width === 1920)
          || files[0];

        if (!hdFile?.link) { console.warn(`⚠️ Sin link de video para: "${query}"`); continue; }

        const videoPath = path.join(videoDir, `clip_${String(clipIndex).padStart(2, '0')}.mp4`);
        await downloadFile(hdFile.link, videoPath);
        console.log(`  ✅ clip_${String(clipIndex).padStart(2, '0')}.mp4 ← "${query}"`);
        clipIndex++;

        // Pausa de 300ms para respetar rate limits de Pexels
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.warn(`  ⚠️ Error descargando clip para "${query}":`, err);
      }
    }

    // ── C) Subir a Google Drive ───────────────────────────────────────
    console.log('☁️  Subiendo a Google Drive...');
    let audioLink = '';
    let rootFolderLink = '';
    let driveUploadFailed = false;
    let driveErrorMsg = '';

    const clipFiles = fs.existsSync(videoDir)
      ? fs.readdirSync(videoDir).filter(f => f.endsWith('.mp4')).sort()
      : [];

    try {
      const videoFolderDrive = await createDriveFolder(`${fecha}_${slug}`, DRIVE_ROOT_FOLDER_ID);
      const videoDriveFolderId = await createDriveFolder('videos', videoFolderDrive);

      // Subir audio (si existe)
      if (audioPath && fs.existsSync(audioPath)) {
        const audioDriveFolderId = await createDriveFolder('audio', videoFolderDrive);
        audioLink = await uploadToDrive(audioPath, path.basename(audioPath), audioDriveFolderId);
        console.log(`  ✅ Audio subido: ${audioLink}`);
      }

      // Subir cada clip de video
      for (const clipFile of clipFiles) {
        await uploadToDrive(path.join(videoDir, clipFile), clipFile, videoDriveFolderId);
        console.log(`  ✅ ${clipFile} subido.`);
      }

      rootFolderLink = `https://drive.google.com/drive/folders/${videoFolderDrive}`;
    } catch (driveErr: any) {
      driveUploadFailed = true;
      driveErrorMsg = driveErr.message || String(driveErr);
      console.warn('⚠️ Falló la subida a Google Drive, pero los archivos locales están listos:', driveErrorMsg);
    }

    // ── D) Actualizar Sheets ──────────────────────────────────────────
    const nuevoEstado = mode === 'preview'
      ? 'Preview escuchado 🟡'
      : mode === 'videos_only'
        ? 'Videos listos (sin audio) 🟡'
        : 'Listo para editar 🟢';

    try {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          data: [
            { range: `Matriz!A${rowIndex}`, values: [[nuevoEstado]] },
            ...(audioLink ? [{ range: `Matriz!I${rowIndex}`, values: [[audioLink]] }] : []),
            ...(rootFolderLink ? [{ range: `Matriz!J${rowIndex}`, values: [[rootFolderLink]] }] : []),
          ],
          valueInputOption: 'USER_ENTERED',
        },
      });
    } catch (sheetErr: any) {
      console.warn('⚠️ No se pudo actualizar el estado en Google Sheets:', sheetErr.message);
    }

    // ── E) Notificar por Telegram ─────────────────────────────────────
    const modeLabel = mode === 'full' ? '🔊 Audio completo' : mode === 'preview' ? '🔊 Preview (30 seg)' : '🎥 Solo videos';

    // Si fue preview, ofrecer botones para continuar
    const extraButtons = mode === 'preview'
      ? Markup.inlineKeyboard([
          [Markup.button.callback('🔊 Audio completo (confirmar)', `PRODUCE_FULL_${rowIndex}`)],
          [Markup.button.callback('🎥 Solo descargar videos', `PRODUCE_VIDEOS_${rowIndex}`)],
        ])
      : {};

    let driveText = '';
    if (driveUploadFailed) {
      driveText = `⚠️ *Subida a Drive omitida* (API no activa en tu cuenta de Google).\n` +
                  `📍 *Archivos locales guardados en tu Mac:* \n` +
                  `\`output/${fecha}_${slug}/\` \n\n` +
                  `💡 _Para activar la subida automática a Drive en el futuro, haz clic aquí:_ \n` +
                  `[Activar Google Drive API](https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=438038869850) (¡y presiona Habilitar!)`;
    } else {
      driveText = `📁 *Drive:* [Abrir Carpeta](${rootFolderLink})`;
    }

    await bot.telegram.sendMessage(
      TELEGRAM_CHAT_ID,
      `✅ *${nuevoEstado.toUpperCase()}*\n\n` +
      `*Video:* ${tema}\n` +
      `*Modo:* ${modeLabel}\n` +
      `🎥 Clips descargados: ${clipFiles.length}\n` +
      (audioLink ? `🔊 Audio: [abrir](${audioLink})\n` : '') +
      `\n${driveText}\n` +
      (mode === 'preview' ? `\n_¿La voz suena bien? Elige cómo continuar:_` : `\n_¡Producción exitosa!_`),
      { parse_mode: 'Markdown', ...extraButtons }
    );

    console.log(`🎉 Producción completa para: ${tema} [modo: ${mode}]`);

  } catch (error) {
    console.error(`❌ Error en processApprovedRow(${rowIndex}):`, error);
    await bot.telegram.sendMessage(
      TELEGRAM_CHAT_ID,
      `❌ *Error produciendo fila ${rowIndex}*\n\`\`\`${String(error).slice(0, 500)}\`\`\``,
      { parse_mode: 'Markdown' }
    );
  }
}
