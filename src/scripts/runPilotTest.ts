import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import * as https from 'https';
import * as http from 'http';
import { generateNeuralSpeech, assembleFinalVideo } from './videoEngine';

/**
 * 🚀 PILOTO DE PRUEBA: VIDEO CORTO DE ALTA RETENCIÓN (60 SEGUNDOS)
 * - Locución Neuronal 100% Gratis (es-MX-JorgeNeural)
 * - 4-5 Clips HD Cinemáticos descargados de Pexels
 * - Auto-Ensamblado con FFmpeg a 1080p Full HD
 * - Cero edición manual
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';

function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        try { fs.unlinkSync(destPath); } catch {}
        return downloadFile(res.headers.location!, destPath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      try { fs.unlinkSync(destPath); } catch {}
      reject(err);
    });
  });
}

async function fetchPexelsVideo(query: string, destPath: string): Promise<boolean> {
  if (!PEXELS_API_KEY) {
    console.warn('⚠️ No se encontró PEXELS_API_KEY en .env');
    return false;
  }
  try {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
    if (!res.ok) return false;
    const data: any = await res.json();
    const video = data?.videos?.[0];
    if (!video || !video.video_files) return false;

    const files: any[] = video.video_files;
    const hdFile = files.find((f: any) => f.width === 1920) || files.find((f: any) => f.width === 1280) || files[0];
    if (!hdFile?.link) return false;

    await downloadFile(hdFile.link, destPath);
    return true;
  } catch (err) {
    console.warn(`⚠️ Error descargando clip para "${query}":`, err);
    return false;
  }
}

async function runPilot() {
  console.log('========================================================');
  console.log('🎬 INICIANDO PRUEBA PILOTO DE VIDEO CORTO (SIN EDICIÓN)');
  console.log('========================================================');

  const fecha = new Date().toISOString().slice(0, 10);
  const baseDir = path.join(process.cwd(), 'output', `${fecha}_piloto_finanzas`);
  const audioDir = path.join(baseDir, 'audio');
  const videoDir = path.join(baseDir, 'videos');

  fs.mkdirSync(audioDir, { recursive: true });
  fs.mkdirSync(videoDir, { recursive: true });

  // 1. Guion de 60 segundos con técnica de retención de 3 segundos
  const guionPiloto = 
    `El noventa por ciento de las personas que envían dinero a México están perdiendo hasta treinta dólares en cada transferencia... y el banco nunca te lo dice. ` +
    `No es por la comisión que ves en el recibo. Es por la trampa del tipo de cambio oculto. ` +
    `Mientras el tipo de cambio oficial está en veinte pesos, ellos te lo pagan a dieciocho cincuenta. ` +
    `En un envío de quinientos dólares, esa diferencia se queda en la bolsa del intermediario. ` +
    `La regla de oro en dos mil veintiséis es simple: nunca mires la tarifa del envío... compara siempre el tipo de cambio neto antes de presionar enviar. ` +
    `Tu dinero te costó semanas de trabajo; no permitas que un banco se quede con tu esfuerzo.`;

  console.log(`📝 Guion preparado (${guionPiloto.split(' ').length} palabras, aprox 45-55 seg).`);

  // 2. Generación de audio con voz neuronal gratuita
  const audioPath = path.join(audioDir, 'locucion_piloto.mp3');
  const subtitlesPath = path.join(audioDir, 'subtitulos_piloto.vtt');
  console.log('\n🎙️ PASO 1: Generando locución con motor neuronal gratuito (es-MX-JorgeNeural)...');
  await generateNeuralSpeech(guionPiloto, audioPath, 'es-MX-JorgeNeural', subtitlesPath);

  // 3. Descarga de 4 clips cinemáticos de B-Roll en Pexels
  console.log('\n📹 PASO 2: Descargando B-Roll cinemático en Full HD desde Pexels...');
  const visualQueries = [
    'counting money cash',
    'smartphone banking payment',
    'stock market financial charts',
    'businessman handshake deal',
    'golden coins wealth concept'
  ];

  let downloadedCount = 0;
  for (let i = 0; i < visualQueries.length; i++) {
    const query = visualQueries[i];
    const clipPath = path.join(videoDir, `clip_${String(i + 1).padStart(2, '0')}.mp4`);
    console.log(`   -> Buscando clip ${i + 1}: "${query}"...`);
    const ok = await fetchPexelsVideo(query, clipPath);
    if (ok) {
      console.log(`      ✅ Descargado: clip_${String(i + 1).padStart(2, '0')}.mp4`);
      downloadedCount++;
    }
    await new Promise(r => setTimeout(r, 400));
  }

  if (downloadedCount === 0) {
    throw new Error('No se pudo descargar ningún clip de Pexels.');
  }

  // 4. Auto-Ensamblado con FFmpeg
  console.log('\n🎬 PASO 3: Ensamblado automático con FFmpeg (Normalización a 1080p + Sincronización)...');
  const finalVideoPath = path.join(baseDir, 'video_final.mp4');
  await assembleFinalVideo(audioPath, videoDir, finalVideoPath);

  console.log('\n========================================================');
  console.log('🎉 ¡PRUEBA PILOTO COMPLETADA CON ÉXITO!');
  console.log(`📍 Archivo de video final listo en tu Mac:`);
  console.log(`   ${finalVideoPath}`);
  console.log('========================================================\n');
}

runPilot().catch(err => {
  console.error('❌ Error ejecutando la prueba piloto:', err);
  process.exit(1);
});
