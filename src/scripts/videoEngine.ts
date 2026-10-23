import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const DEFAULT_TTS_VOICE = process.env.TTS_VOICE || 'es-MX-JorgeNeural';

/**
 * 🎙️ Genera locución neuronal en alta fidelidad y 100% GRATIS usando Microsoft Edge TTS.
 * Cero suscripciones, duración ilimitada y sin consumo de créditos de tokens.
 */
export async function generateNeuralSpeech(
  text: string,
  outputPath: string,
  voice: string = DEFAULT_TTS_VOICE,
  subtitlesPath?: string
): Promise<string> {
  const tempScriptPath = outputPath.replace(/\.mp3$/, '_temp_script.txt');
  fs.writeFileSync(tempScriptPath, text, 'utf-8');

  try {
    console.log(`🎙️ [Edge-TTS] Generando locución neuronal gratuita (Voz: ${voice})...`);
    const subOption = subtitlesPath ? `--write-subtitles "${subtitlesPath}"` : '';
    // Usamos python3 -m edge_tts con --file para evitar limitaciones de longitud de línea en la shell
    const cmd = `python3 -m edge_tts --voice "${voice}" --file "${tempScriptPath}" --write-media "${outputPath}" ${subOption}`;
    execSync(cmd, { stdio: 'inherit' });

    if (fs.existsSync(outputPath)) {
      console.log(`✅ [Edge-TTS] Locución generada con éxito: ${outputPath}`);
      return outputPath;
    } else {
      throw new Error(`El archivo de audio no fue generado en: ${outputPath}`);
    }
  } finally {
    if (fs.existsSync(tempScriptPath)) {
      try { fs.unlinkSync(tempScriptPath); } catch {}
    }
  }
}

/**
 * 🎬 [FFmpeg Engine] Ensambla automáticamente los clips de video descargados con la locución en un archivo MP4 final.
 * - Normaliza cada clip a 1080p (1920x1080, 16:9, 30fps, formato yuv420p compatible con YouTube).
 * - Enlaza y genera un bucle de los clips para cubrir la duración exacta del audio.
 * - Mezcla la pista de audio con el video ensamblado sin desfases.
 */
export async function assembleFinalVideo(
  audioFilePath: string,
  videoClipsDir: string,
  outputVideoPath: string
): Promise<string> {
  console.log(`🎬 [FFmpeg Engine] Iniciando ensamblado automático de video...`);

  if (!fs.existsSync(audioFilePath)) {
    throw new Error(`Archivo de audio no encontrado: ${audioFilePath}`);
  }

  // 1. Obtener duración del audio con ffprobe
  const probeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioFilePath}"`;
  const rawDuration = execSync(probeCmd, { encoding: 'utf-8' }).trim();
  const audioDurationSec = parseFloat(rawDuration);
  console.log(`⏱️ Duración de locución: ${audioDurationSec.toFixed(2)}s (~${(audioDurationSec / 60).toFixed(1)} min).`);

  // 2. Obtener lista de clips descargados
  const clips = fs.existsSync(videoClipsDir)
    ? fs.readdirSync(videoClipsDir).filter(f => f.endsWith('.mp4')).sort()
    : [];

  if (clips.length === 0) {
    throw new Error(`No se encontraron clips MP4 en la carpeta: ${videoClipsDir}`);
  }

  console.log(`📹 Encontrados ${clips.length} clips descargados para el ensamblado.`);

  // 3. Normalizar clips a una carpeta temporal para asegurar 1920x1080, 30fps y yuv420p uniforme
  const tempNormalizedDir = path.join(videoClipsDir, 'normalized');
  fs.mkdirSync(tempNormalizedDir, { recursive: true });

  const normalizedClips: string[] = [];
  for (let i = 0; i < clips.length; i++) {
    const rawClip = path.join(videoClipsDir, clips[i]);
    const normClip = path.join(tempNormalizedDir, `norm_${String(i).padStart(2, '0')}.mp4`);

    if (!fs.existsSync(normClip)) {
      console.log(`  🔧 Normalizando clip ${i + 1}/${clips.length} a 1080p 30fps...`);
      const normCmd = `ffmpeg -y -i "${rawClip}" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30" -c:v libx264 -preset ultrafast -crf 23 -an "${normClip}"`;
      try {
        execSync(normCmd, { stdio: 'pipe' });
      } catch (normErr) {
        console.warn(`  ⚠️ Clip ${clips[i]} falló al normalizar, omitiendo:`, normErr);
        continue;
      }
    }
    normalizedClips.push(normClip);
  }

  if (normalizedClips.length === 0) {
    throw new Error('No se pudo normalizar ningún clip de video.');
  }

  // 4. Crear concat_list.txt repitiendo clips para cubrir la duración total del audio
  const avgClipDuration = 5;
  const clipsNeeded = Math.ceil((audioDurationSec + 10) / avgClipDuration);
  const concatListPath = path.join(tempNormalizedDir, 'concat_list.txt');

  let concatLines = '';
  for (let c = 0; c < clipsNeeded; c++) {
    const clipToUse = path.resolve(normalizedClips[c % normalizedClips.length]);
    concatLines += `file '${clipToUse}'\n`;
  }
  fs.writeFileSync(concatListPath, concatLines, 'utf-8');

  // 5. Ensamblar video final
  console.log(`🚀 Renderizando video final en: ${outputVideoPath}...`);
  const finalCmd = `ffmpeg -y -f concat -safe 0 -i "${path.resolve(concatListPath)}" -i "${path.resolve(audioFilePath)}" -map 0:v -map 1:a -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest "${path.resolve(outputVideoPath)}"`;

  execSync(finalCmd, { stdio: 'inherit' });

  // 6. Limpieza de temporales
  try {
    fs.rmSync(tempNormalizedDir, { recursive: true, force: true });
  } catch {}

  console.log(`🎉 ¡Video final ensamblado con éxito! -> ${outputVideoPath}`);
  return outputVideoPath;
}
