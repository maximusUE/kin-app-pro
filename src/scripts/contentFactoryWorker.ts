import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import * as https from 'https';
import * as http from 'http';
import { google } from 'googleapis';
import { Telegraf, Markup } from 'telegraf';
import * as cheerio from 'cheerio';

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

/** Divide texto en fragmentos que no excedan maxLength, respetando oraciones */
function chunkText(text: string, maxLength: number = 2500): string[] {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [text];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

/**
 * Lee la fila, obtiene el guion, pide audio a ElevenLabs y descarga videos de Pexels/Pixabay.     → carpeta output/<fecha_tema>/videos/
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
    'https://www.googleapis.com/auth/documents',
  ],
});

export const sheets = google.sheets({ version: 'v4', auth });
const drive  = google.drive({ version: 'v3', auth });
const docs   = google.docs({ version: 'v1', auth });
const bot    = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

/** Genera contenido usando Groq API (gratis, rápido, sin restricciones regionales) */
export async function geminiGenerate(prompt: string): Promise<string> {
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

export const SPREADSHEET_ID       = process.env.SPREADSHEET_ID!;
const TELEGRAM_CHAT_ID     = process.env.TELEGRAM_CHAT_ID!;
const DRIVE_ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;
const ELEVENLABS_API_KEY   = process.env.ELEVENLABS_API_KEY!;
const ELEVENLABS_VOICE_ID  = process.env.ELEVENLABS_VOICE_ID!;
const PEXELS_API_KEY       = process.env.PEXELS_API_KEY!;
const PIXABAY_API_KEY      = process.env.PIXABAY_API_KEY!;

// Parámetros de voz ajustables para mejorar la entonación dramática, brillo y fidelidad de la narración de YouTube
const ELEVENLABS_STABILITY  = parseFloat(process.env.ELEVENLABS_STABILITY || '0.40');
const ELEVENLABS_SIMILARITY = parseFloat(process.env.ELEVENLABS_SIMILARITY || '0.80');
const ELEVENLABS_STYLE      = parseFloat(process.env.ELEVENLABS_STYLE || '0.20');

// ─── Tipos ─────────────────────────────────────────────────────────────────

interface GeminiOutput {
  guion: string;
  visual_queries: string[]; // 15 queries en inglés, cinematográficas
  diapositivas_texto?: string; // Texto breve con datos estadísticos reales
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

/** Crea un Google Doc interactivo usando Google Docs API nativa */
async function createGoogleDoc(title: string, content: string): Promise<{ id: string; link: string }> {
  try {
    // 1. Crear documento vacío nativo
    const docRes = await docs.documents.create({
      requestBody: { title: title },
    });
    
    const docId = docRes.data.documentId!;
    const docLink = `https://docs.google.com/document/d/${docId}/edit`;

    // 2. Inyectar el texto del guion en el documento
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [{
          insertText: {
            location: { index: 1 },
            text: content
          }
        }]
      }
    });

    // Intentar dar permisos de edición pública para máxima comodidad (sin iniciar sesión)
    try {
      await drive.permissions.create({
        fileId: docId,
        requestBody: {
          role: 'writer',
          type: 'anyone',
        },
      });
      console.log('✅ Permisos de edición pública otorgados al Google Doc.');
    } catch (permError: any) {
      console.warn('⚠️ No se pudo otorgar permisos públicos (posible política de dominio). Intentando compartir directamente con tu correo...', permError.message || permError);
      
      // Fallback: Compartir directamente con el dueño de la carpeta compartida (César)
      try {
        const folderInfo = await drive.files.get({
          fileId: DRIVE_ROOT_FOLDER_ID,
          fields: 'owners',
        });
        const ownerEmail = folderInfo.data.owners?.[0]?.emailAddress;
        if (ownerEmail) {
          await drive.permissions.create({
            fileId: docId,
            requestBody: {
              role: 'writer',
              type: 'user',
              emailAddress: ownerEmail,
            },
          });
          console.log(`✅ Google Doc compartido directamente con tu correo: ${ownerEmail}`);
        } else {
          console.warn('⚠️ No se encontró el correo del dueño de la carpeta para compartir el Doc.');
        }
      } catch (fallbackError: any) {
        console.error('❌ Error en el fallback de permisos directos:', fallbackError.message || fallbackError);
      }
    }

    return { id: docId, link: docLink };
  } catch (error) {
    console.error('❌ Error creando Google Doc nativo:', error);
    throw error;
  }
}

/** Lee el contenido del Google Doc y lo exporta a texto plano para ElevenLabs */
async function readGoogleDoc(docId: string): Promise<string> {
  try {
    const res = await drive.files.export({
      fileId: docId,
      mimeType: 'text/plain',
    }, {
      responseType: 'text',
    });
    return res.data as string;
  } catch (error) {
    console.error(`❌ Error leyendo Google Doc (${docId}):`, error);
    throw error;
  }
}

// ─── UTILIDADES PARA EL DASHBOARD NEXT.JS ─────────────────────────────

export async function getScriptsInReview() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Matriz!A:K',
  });
  const rows = response.data.values || [];
  return rows.map((row, idx) => ({
    rowIndex: idx + 1,
    estado: row[0],
    pilar: row[4],
    tema: row[5],
    guion: row[6],
    visual_queries: row[7] ? JSON.parse(row[7]) : [],
    doc_link: row[8] || '',
    diapositivas: row[9] || '',
    contexto: row[10] || '',
  })).filter(r => r.estado === 'En revision' || r.estado === 'Pendiente' || r.estado === 'Videos listos (sin audio) 🟡' || r.estado === 'Guardado Temporal ⏸️');
}

export async function updateScriptInSheet(rowIndex: number, newGuion: string) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Matriz!G${rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[newGuion]] },
  });
}

export async function updateScriptStateInSheet(rowIndex: number, newState: string) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Matriz!A${rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[newState]] },
  });
}

// ─── PASO 1: Leer y generar guión ─────────────────────────────────────────

export async function runContentFactory() {
  console.log('🛠️  Arrancando Fábrica de Contenidos...');

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Matriz!A:I', // Ampliado a I para leer el link de Google Docs
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) { console.log('No hay datos en el Sheets.'); return; }

    const pendingRows = rows.filter(row => {
      const status = row[0] ? row[0].toString().trim().toLowerCase() : '';
      return status === 'pendiente';
    });
    console.log(`Encontrados ${pendingRows.length} temas pendientes.`);

    const batch = pendingRows.slice(0, 3);

    for (const row of batch) {
      const rowIndex = rows.indexOf(row) + 1;
      const pilar = row[4] || 'General';
      const tema  = row[5] || 'Sin Tema';
      const colKRaw = row[10] || '';

      let contextoExterno = '';
      if (colKRaw) {
        if (colKRaw.startsWith('http')) {
          console.log(`🌐 Extrayendo contexto web desde: ${colKRaw}`);
          try {
            const htmlRes = await fetch(colKRaw);
            const htmlText = await htmlRes.text();
            const $ = cheerio.load(htmlText);
            const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
            contextoExterno = bodyText.substring(0, 3000); // Limitar a 3000 chars
            console.log('✅ Contexto web extraído con éxito.');
          } catch (err) {
            console.error('⚠️ Falló la extracción web, se ignorará la URL.', err);
          }
        } else {
          contextoExterno = colKRaw;
        }
      }

      console.log(`🤖 Generando guion para: [${pilar}] ${tema}`);

      // ── Llamada a Groq/Gemini ────────────────────────────────
      let prompt = `Role: Eres un guionista experto, mentor, director implacable y estratega de creación de contenido para el canal "Código Propio". Tienes más de 15 años de experiencia, habiendo desarrollado tu mayor experiencia en canales de YouTube de alto impacto, por lo que eres un experto absoluto en crear guiones auténticos y de alta retención. Eres directo, pragmático y "no-nonsense". Hablas como una persona real con autoridad y franqueza, sin sonar jamás como una inteligencia artificial.

Target Audience: Tu público objetivo son personas emprendedoras, dueños de pequeños negocios y personas con deseos de seguir creciendo en todas las áreas tratadas en el canal (estoicismo, finanzas y negocios). Te diriges a un público adulto con un rango de edad de entre 25 y más de 45 años.

Objective: Generar un guion profundo y accionable, junto con consultas visuales para B-roll, para el pilar "${pilar}" y el tema "${tema}".\n`;

      if (contextoExterno) {
        prompt += `\nCONTEXTO DE INVESTIGACIÓN REAL:\n"${contextoExterno}"\nUsa este contexto para extraer estadísticas o citas 100% reales para el guion y las diapositivas.\n`;
      }

      prompt += `
Instructions (Constraints & Narrowing):
- REGLAS DE ESTRUCTURA:
  * Hook inicial disruptivo (CERO saludos, prohibido decir "Hola").
  * Longitud máxima: 150 palabras (guion corto de prueba, aprox 1 min).
  * Retención: Un mini-hook o cambio de ritmo narrativo cada 70-80 palabras.
  * Cierre: 3 pasos accionables brutalmente detallados.
- REGLAS DE TONO:
  * Escribe para ser hablado (oralidad). Usa oraciones cortas, secas y contundentes. Alterna ritmos.
  * OBLIGATORIO - PAUSAS Y ENTONACIÓN HUMANA (Optimizado para TTS/CapCut):
    - Usa puntos suspensivos ("...") frecuentemente (de 3 a 5 veces por guion) para forzar silencios dramáticos e inyectar intriga y misterio.
    - Alterna oraciones cortas con preguntas directas e incómodas (ej: "¿Por qué sigues ahí?", "¿Tiene sentido?") y exclamaciones contundentes (ej: "¡Cero!", "¡Es una trampa!"). Esto obliga al motor de CapCut a elevar y variar la entonación, eliminando la voz plana artificial.
    - Utiliza comas (,) y puntos y comas (;) de forma constante para estructurar pausas medias y micro-variaciones de ritmo.
  * CERO viñetas o lenguaje corporativo.
  * PALABRAS ESTRICTAMENTE PROHIBIDAS: "adentrémonos", "crucial", "fundamental", "fascinante", "en resumen", "sin duda", "acompáñame".
- MARCADORES DE EXPERIENCIA:
  * Inserta exactamente de 2 a 3 marcadores entre llaves {} en clímax emocionales para que el presentador añada sus anécdotas. (Ej: {César: Inserta aquí una experiencia de cuando estabas endeudado...}).

Steps (Chain of Thought):
1. Analiza el tema "${tema}" bajo la óptica del pilar "${pilar}".
2. Desarrolla la narrativa usando el enfoque Qué, Por Qué y Cómo sin resúmenes rápidos.
3. Inserta los marcadores {} de forma orgánica.
4. Diseña 3 "visual_queries" en inglés para B-roll.
   - OBLIGATORIO: Al menos 1 de estas queries DEBE ser un fondo abstracto de retención (estilo CapCut, ej: "dark abstract neon loop", "retro grid background looping", "cinematic geometric lines motion", "slow smoke dark background").
   - Las otras queries deben relacionarse directamente con el pilar "${pilar}" y el tema "${tema}":
     * Si es "Estoicismo": Usa videos de ruinas clásicas, templos, estatuas de mármol o paisajes antiguos de Grecia/Roma (ej: "ancient ruins", "greek temple", "roman statue", "marble bust", "ancient athens cliff").
     * Si es "Finanzas": Usa videos de dinero, monedas, gráficos financieros, pantallas de bolsa o planeación financiera (ej: "counting paper money", "golden coins stack", "stock market chart screen", "financial graph").
     * Si es "Negocios": Usa videos de pequeños negocios locales, restaurantes, cafeterías, delis y emprendedores trabajando (ej: "coffee shop owner", "restaurant chef busy", "deli store counter", "entrepreneur laptop", "local business").
     * Si el guion mezcla temas (ej. estoicismo aplicado a finanzas), es totalmente válido y recomendado mezclar estos conceptos en las queries para que coincidan con la narrativa.

Output Format:
Responde ÚNICAMENTE con un objeto JSON válido, sin bloques de código Markdown ni explicaciones.
{
  "guion": "texto del guion aquí",
  "visual_queries": ["query 1", "query 2", "query 3"],
  "diapositivas_texto": "EJEMPLO: 'Estadística Real: El 80% de los negocios fallan en su primer año por falta de flujo de caja.' (Escribe aquí el texto que el usuario pondrá en pantalla basándote en el contexto real, si aplica)."
}

Examples (Master Tone Reference):
"Llegas al número que te prometiste... Y un martes cualquiera te despiertas con la misma ansiedad de cuando tenías cero... 
{César: Cuando cerré mi primer contrato grande, esperaba sentir alivio... Inserta aquí tu anécdota} 
La tranquilidad no se compra. Se entrena... La salida no es un hack. Es un sistema."`;

      const rawText = (await geminiGenerate(prompt)).trim();

      // Parsear JSON de Gemini (limpiar backticks si los puso igual)
      let parsed: GeminiOutput;
      try {
        const clean = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        parsed = JSON.parse(clean);
        if ((parsed as any).pexels_queries) parsed.visual_queries = (parsed as any).pexels_queries;
      } catch {
        console.error('⚠️ Gemini no devolvió JSON válido, guardando como texto plano.');
        parsed = { guion: rawText, visual_queries: [] };
      }

      // Crear Google Doc para que César lo edite y humanice
      console.log('📝 Creando Google Doc interactivo para edición interactiva...');
      let docData = { id: '', link: '' };
      try {
        docData = await createGoogleDoc(`📝 Guion: [${pilar}] ${tema}`, parsed.guion);
        console.log(`✅ Google Doc creado con éxito: ${docData.link}`);
      } catch (err) {
        console.warn('⚠️ No se pudo crear el Google Doc, continuando sin él.', err);
      }

      // Guardar guion + queries + link del Doc en Sheets (G = guion, H = queries JSON, I = Link de Google Doc)
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          data: [
            { range: `Matriz!G${rowIndex}`, values: [[parsed.guion]] },
            { range: `Matriz!H${rowIndex}`, values: [[JSON.stringify(parsed.visual_queries || [])]] },
            { range: `Matriz!I${rowIndex}`, values: [[docData.link || '']] },
            { range: `Matriz!J${rowIndex}`, values: [[parsed.diapositivas_texto || '']] },
          ],
          valueInputOption: 'USER_ENTERED',
        },
      });

      // ── Enviar a Telegram para aprobación ────────────────────────────
      const preview = parsed.guion.length > 3000
        ? parsed.guion.substring(0, 3000) + '\n\n...[Guion truncado para previsualización]'
        : parsed.guion;

      const docLinkSection = docData.link
        ? `\n✍️ *EDITAR Y HUMANIZAR EN GOOGLE DOCS:*\n👉 [Abrir Google Doc de Edición](${docData.link})\n_Nota: Haz tus cambios en el documento arriba y luego presiona "Aprobar guion" para usar tu versión._\n`
        : '\n✍️ *EDITAR Y HUMANIZAR EN GOOGLE SHEETS:*\n👉 _Edita el guion directamente en la columna G (Celda de Borrador) de tu hoja de Google Sheets, y presiona "Aprobar guion" para usar tu versión humanizada._\n';

      const msg = `📝 *NUEVO GUION LISTO*\n\n*Pilar:* ${pilar}\n*Tema:* ${tema}\n${docLinkSection}\n*Queries Visuales (${parsed.visual_queries?.length || 0}):*\n${parsed.visual_queries?.slice(0, 5).map(q => `• ${q}`).join('\n')}\n_...y ${Math.max(0, (parsed.visual_queries?.length || 0) - 5)} más_\n\n\`\`\`\n${preview}\n\`\`\``;

      const buttons = [];
      if (docData.link) {
        buttons.push([Markup.button.url('📝 Abrir en Google Docs', docData.link)]);
      }
      buttons.push([Markup.button.callback('✅ Aprobar guion', `APPROVE_${rowIndex}`)]);
      buttons.push([Markup.button.callback('🔄 Rechazar y regenerar', `REJECT_${rowIndex}`)]);

      await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, msg, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons),
      });

      // Actualizar estado a "En revision"
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Matriz!A${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [['En revision']] },
      });

      console.log(`✅ Guion [${tema}] enviado a Telegram.`);

      // Descarga automática de videos en segundo plano
      console.log(`🎬 Iniciando descarga automática de B-Roll en segundo plano para fila ${rowIndex}...`);
      processApprovedRow(rowIndex, 'videos_only').catch(err => {
        console.error('⚠️ Error en descarga automática de videos:', err);
      });
    }
  } catch (error) {
    console.error('❌ Error en runContentFactory:', error);
  }
}

// ─── PASO 2: Producir assets (audio + videos) tras aprobación ──────────────

export type ProductionMode = 'full' | 'videos_only' | 'preview' | 'user_voice';

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
      range: `Matriz!A${rowIndex}:J${rowIndex}`, // Ampliado a J para leer el JSON del chart
    });
    const row = res.data.values?.[0];
    if (!row) throw new Error(`Fila ${rowIndex} no encontrada.`);

    const tema   = row[5] || 'video';
    const guionOriginal = row[6] || '';
    let queriesRaw = row[7] || '[]';
    // Si la IA fallo y no generó un JSON válido para queries, intentar limpiar
    if (queriesRaw && !queriesRaw.startsWith('[')) {
      queriesRaw = '["' + queriesRaw.replace(/\n/g, '", "') + '"]';
    }
    
    let queries: string[];
    try {
      queries = JSON.parse(queriesRaw);
    } catch {
      queries = ["dark abstract geometric looping", "cinematic neon light slow motion"];
    }

    const googleDocLink = row[8] || '';
    const diapositivasTexto = row[9] || '';

    let guionFinal = guionOriginal;

    // ── POST-PROCESADOR: Escudo Anti-Errores Humanos ──
    // Bloquea la producción solo si detecta explícitamente las instrucciones de la IA, 
    // en caso de que el usuario haya dejado sus llaves con la anécdota adentro.
    const hasUneditedPlaceholders = /\{(?:César|Cesar|Inserta|Anécdota).*?\}/i.test(guionFinal);
    if (hasUneditedPlaceholders && mode !== 'videos_only') {
      console.log('🛡️ Escudo Anti-Errores: Instrucciones de IA detectadas en el guion.');
      return { success: false, error: '⚠️ ERROR: Detecté una instrucción de la IA como "{César: ...}". Por favor borra esa instrucción y escribe tu anécdota.' };
    }
    
    // Si el usuario dejó las llaves {} pero ya escribió su historia, simplemente se las borramos silenciosamente para que ElevenLabs no las lea.
    guionFinal = guionFinal.replace(/[\{\}]/g, '');

    // ── POST-PROCESADOR: Humanizer (Inyector de Pausas Automático) ──
    const countPausas = (guionFinal.match(/\.\.\./g) || []).length;
    const countPalabras = guionFinal.split(' ').length;
    
    // Si hay menos de 1 pausa por cada 50 palabras, la IA olvidó poner pausas
    if (countPausas < (countPalabras / 50)) {
      console.log('🤖 Post-Procesando guion: Inyectando pausas humanas dramáticas...');
      // Reemplazar aleatoriamente ~30% de los puntos y ~15% de las comas con "..."
      guionFinal = guionFinal.replace(/\. /g, () => Math.random() > 0.70 ? '... ' : '. ');
      guionFinal = guionFinal.replace(/, /g, () => Math.random() > 0.85 ? '... ' : ', ');
    }

    // Si hay un enlace a Google Doc, intentar extraer el contenido actualizado y humanizado por César
    if (googleDocLink) {
      try {
        const docIdMatch = googleDocLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (docIdMatch && docIdMatch[1]) {
          const docId = docIdMatch[1];
          console.log(`📖 Leyendo versión humanizada y editada de Google Doc (${docId})...`);
          const docText = await readGoogleDoc(docId);
          if (docText && docText.trim().length > 0) {
            guionFinal = docText.trim();
            console.log('✅ Versión humanizada leída con éxito de Google Doc.');
          }
        }
      } catch (err) {
        console.warn('⚠️ Error al leer del Google Doc, usando guion original de Sheets como fallback:', err);
      }
    }

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
    const cleanScript = guionFinal
      .replace(/\[?\d{1,2}:\d{2}\]?/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (mode === 'videos_only' || mode === 'user_voice') {
      console.log('⏭️  Modo sin ElevenLabs — audio de IA omitido.');

    } else {
      // 'full' → guion completo | 'preview' → primeros 400 chars (≈30 seg)
      const textToSend = mode === 'preview'
        ? cleanScript.slice(0, 400)
        : cleanScript;

      const chunks = chunkText(textToSend, 2500);
      console.log(`🔊 Guion dividido en ${chunks.length} bloques para ElevenLabs.`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const charCount = chunk.length;
        const estimatedCost = ((charCount / 1000) * 0.18).toFixed(4); // ~$0.18/1k chars
        console.log(`   -> Enviando bloque ${i+1}/${chunks.length} (${charCount} chars, ~$${estimatedCost})...`);

        const elevenRes = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': ELEVENLABS_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: chunk,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: ELEVENLABS_STABILITY,
                similarity_boost: ELEVENLABS_SIMILARITY,
                style: ELEVENLABS_STYLE,
                use_speaker_boost: true
              },
            }),
          }
        );

        if (!elevenRes.ok) {
          throw new Error(`ElevenLabs error en bloque ${i+1}: ${elevenRes.status} ${await elevenRes.text()}`);
        }

        const prefix = (i + 1).toString().padStart(2, '0');
        const filename = mode === 'preview' ? 'preview_hook.mp3' : `${prefix}_narration.mp3`;
        const audioPath = path.join(audioDir, filename);
        const audioBuffer = await elevenRes.arrayBuffer();
        fs.writeFileSync(audioPath, Buffer.from(audioBuffer));
        console.log(`✅ Audio guardado: ${audioPath}`);
        
        if (mode === 'preview') break; // Solo generar un bloque si es preview
      }
    }

    // ── B) Descargar videos de B-Roll (Pixabay -> Fallback Pexels) ──
    // POST-PROCESADOR: Paginación Profunda para Mega-Documentales
    let paginatedQueries: {text: string, page: number}[] = [];
    if (queries.length > 0) {
      console.log('🔄 Multiplicando B-Roll: Paginando queries para cubrir 18 minutos...');
      let page = 1;
      while (paginatedQueries.length < 80) {
        for (const q of queries) {
          paginatedQueries.push({ text: q, page: page });
          if (paginatedQueries.length >= 80) break;
        }
        page++;
      }
    }
    const finalQueries = paginatedQueries.length > 0 ? paginatedQueries : [{text: "abstract", page: 1}];

    console.log(`🎥 Descargando ${finalQueries.length} videos de B-Roll únicos...`);

    let clipIndex = 1;
    for (const queryObj of finalQueries) {
      const query = queryObj.text;
      const page = queryObj.page;
      try {
        let downloadLink = '';
        let source = 'Pixabay';

        // 1. Buscar en Pixabay
        if (PIXABAY_API_KEY) {
          const pixabayRes = await fetch(
            `https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&page=${page}&per_page=3`
          );
          const pixabayData: any = await pixabayRes.json();
          const pixabayVideo = pixabayData?.hits?.[0];
          
          if (pixabayVideo && pixabayVideo.videos) {
            // Pixabay retorna resoluciones en videos.medium, videos.large, etc.
            const vidObj = pixabayVideo.videos.medium || pixabayVideo.videos.large || pixabayVideo.videos.small;
            if (vidObj?.url) {
              downloadLink = vidObj.url;
            }
          }
        }

        // 2. Fallback a Pexels si Pixabay falló
        if (!downloadLink) {
          const pexelsRes = await fetch(
            `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&page=${page}&per_page=1&orientation=landscape`,
            { headers: { Authorization: PEXELS_API_KEY } }
          );
          const pexelsData: any = await pexelsRes.json();
          const pexelsVideo = pexelsData?.videos?.[0];
          
          if (pexelsVideo && pexelsVideo.video_files) {
            const files: any[] = pexelsVideo.video_files || [];
            const hdFile = files.find((f: any) => f.width === 1280) || files.find((f: any) => f.width === 1920) || files[0];
            if (hdFile?.link) {
              downloadLink = hdFile.link;
              source = 'Pexels';
            }
          }
        }

        if (!downloadLink) {
          console.warn(`⚠️ Sin resultado HD para: "${query}" (probado en Pexels y Pixabay)`);
          continue;
        }

        const videoPath = path.join(videoDir, `clip_${String(clipIndex).padStart(2, '0')}.mp4`);
        if (fs.existsSync(videoPath)) {
          console.log(`  ⏭️  clip_${String(clipIndex).padStart(2, '0')}.mp4 ya existe, omitiendo descarga.`);
          clipIndex++;
          continue;
        }
        await downloadFile(downloadLink, videoPath);
        console.log(`  ✅ clip_${String(clipIndex).padStart(2, '0')}.mp4 ← "${query}" [${source}]`);
        clipIndex++;

        // Pausa de 500ms para respetar rate limits de ambas APIs
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error(`⚠️ Falló B-Roll "${query}":`, err);
      }
    }

    // ── C) Guardar Diapositivas de Texto ──
    if (diapositivasTexto && mode !== 'preview') {
      try {
        console.log('📝 Generando archivo de diapositivas estadísticas...');
        const slidesPath = path.join(videoDir, '00_diapositivas.txt');
        const contenido = `=== TEXTO PARA DIAPOSITIVAS EN CAPCUT ===\n\n${diapositivasTexto}\n\n=========================================`;
        fs.writeFileSync(slidesPath, contenido);
        console.log(`✅ Diapositivas guardadas: ${slidesPath}`);
      } catch (err) {
        console.error('⚠️ Error generando archivo de diapositivas:', err);
      }
    }

    // ── D) Subir a Google Drive ───────────────────────────────────────
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
    const modeLabel = mode === 'full' ? '🔊 Audio completo' : mode === 'preview' ? '🔊 Preview (30 seg)' : mode === 'user_voice' ? '🎙️ Voz de César (B-Roll listo)' : '🎥 Solo videos';

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

    return { success: true };

  } catch (error: any) {
    console.error(`❌ Error en processApprovedRow(${rowIndex}):`, error);
    await bot.telegram.sendMessage(
      TELEGRAM_CHAT_ID,
      `❌ *Error produciendo fila ${rowIndex}*\n\`\`\`${String(error).slice(0, 500)}\`\`\``,
      { parse_mode: 'Markdown' }
    );
    return { success: false, error: error.message || String(error) };
  }
}
