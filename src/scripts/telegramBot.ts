import 'dotenv/config';


import { Telegraf, Markup } from 'telegraf';
import { google } from 'googleapis';
import { processApprovedRow } from './contentFactoryWorker.ts';
import type { ProductionMode } from './contentFactoryWorker.ts';

console.log("🤖 Iniciando Oyente de Telegram...");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Configurar Google Sheets
let finalKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
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

// Escuchar todos los clics de botones que empiecen con APPROVE_
// Este handler SOLO aprueba el guion y muestra los 3 botones de producción
bot.action(/APPROVE_(.+)/, async (ctx) => {
  const rowIndex = parseInt(ctx.match[1], 10);

  try {
    await ctx.answerCbQuery('✅ Guion aprobado');
    await ctx.editMessageReplyMarkup(undefined);

    // Actualizar estado en Sheets (no bloqueante — si falla DNS, continúa igual)
    sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Matriz!A${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [['Aprobado — esperando producción']] },
    }).catch((e: any) => console.warn('⚠️ No se pudo actualizar Sheets:', e.message));

    // Mostrar los 3 botones de producción
    await ctx.reply(
      `✅ *Guion aprobado.* ¿Cómo quieres producirlo?\n\n` +
      `🔊 *Audio completo* — genera la locución entera (gasta créditos)\n` +
      `👂 *Preview 30 seg* — escucha solo el hook (poco crédito)\n` +
      `🎥 *Solo videos* — clips de B-Roll (Pexels/Pixabay) sin tocar ElevenLabs ($0)`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🔊 Audio completo', `PRODUCE_FULL_${rowIndex}`)],
          [Markup.button.callback('👂 Preview 30 seg (barato)', `PRODUCE_PREVIEW_${rowIndex}`)],
          [Markup.button.callback('🎥 Solo videos (gratis)', `PRODUCE_VIDEOS_${rowIndex}`)],
        ]),
      }
    );

  } catch (error) {
    console.error('Error al aprobar:', error);
    await ctx.reply('❌ Hubo un error al procesar la aprobación.');
  }
});

// Helper: delega al worker y avisa si falla
async function startProduction(ctx: any, rowIndex: number, mode: ProductionMode) {
  const labels: Record<ProductionMode, string> = {
    full:        '🔊 Audio completo + videos',
    preview:     '🔊 Preview de 30 seg + videos',
    videos_only: '🎥 Solo videos',
    user_voice:  '🎙️ Voz de César + videos',
  };

  await ctx.answerCbQuery(`Iniciando: ${labels[mode]}`);
  await ctx.editMessageReplyMarkup(undefined);
  await ctx.reply(
    `🎬 *Producción iniciada — ${labels[mode]}*\n_Aviso cuando esté listo (2-5 min)..._`,
    { parse_mode: 'Markdown' }
  );

  processApprovedRow(rowIndex, mode).catch(async (err) => {
    console.error('Error en producción:', err);
    await ctx.reply(`❌ Error fila ${rowIndex}: ${String(err).slice(0, 300)}`);
  });
}

// 🔊 Audio completo
bot.action(/PRODUCE_FULL_(.+)/, async (ctx) => {
  await startProduction(ctx, parseInt(ctx.match[1], 10), 'full');
});

// 🔊 Preview (solo hook, barato)
bot.action(/PRODUCE_PREVIEW_(.+)/, async (ctx) => {
  await startProduction(ctx, parseInt(ctx.match[1], 10), 'preview');
});

// 🎥 Solo videos (sin ElevenLabs)
bot.action(/PRODUCE_VIDEOS_(.+)/, async (ctx) => {
  await startProduction(ctx, parseInt(ctx.match[1], 10), 'videos_only');
});

// Escuchar todos los clics de botones que empiecen con REJECT_
bot.action(/REJECT_(.+)/, async (ctx) => {
  const rowIndex = ctx.match[1];

  try {
    await ctx.answerCbQuery('Guion Rechazado. Volviendo a Pendiente... 🔄');
    await ctx.editMessageReplyMarkup(undefined);
    await ctx.reply(`🔴 Fila ${rowIndex} devuelta a Pendiente. Volverá a generarse en la siguiente ronda.`);

    // Actualizar Excel a Pendiente
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Matriz!A${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [['Pendiente']] }
    });

    console.log(`🔄 Fila ${rowIndex} rechazada y devuelta a Pendiente.`);

  } catch (error) {
    console.error("Error al rechazar:", error);
    await ctx.reply("❌ Hubo un error al actualizar el Google Sheet.");
  }
});

// Iniciar el bot con reintento resiliente para fallos de DNS/red sin bloquear
async function launchResilientBot() {
  const retryDelay = 5000;
  let connected = false;

  while (!connected) {
    try {
      console.log("🔌 Intentando conectar con los servidores de Telegram...");
      
      // bot.launch() inicia el polling. Lo envolvemos para verificar que no falle al arrancar
      await bot.launch();
      
      connected = true;
      console.log("🎧 Oyente de Telegram activo. Esperando que presiones los botones...");
    } catch (err: any) {
      console.error(`⚠️ Error al conectar con Telegram (${err.code || err.message}). Reintentando en ${retryDelay/1000}s...`);
      await new Promise(r => setTimeout(r, retryDelay));
    }
  }
}

// Para evitar que el await de bot.launch bloquee el inicio del log, corremos la inicialización asíncrona
console.log("🤖 Iniciando Oyente de Telegram...");
bot.launch()
  .then(() => {
    console.log("🔌 Bot detenido de forma segura.");
  })
  .catch((err) => {
    console.error("⚠️ Error crítico en el bot:", err.message);
    // Si falla al inicio por red, intentamos la reconexión resiliente
    launchResilientBot();
  });

console.log("🎧 Oyente de Telegram activo. Esperando que presiones los botones...");

// Manejar apagado seguro
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
