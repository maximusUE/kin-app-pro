import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { sheets, SPREADSHEET_ID } from '../../../scripts/contentFactoryWorker';

const execPromise = promisify(exec);

// Resolver la ruta de ffmpeg de manera manual usando process.cwd() para evitar que
// Webpack lo reubique dentro de la carpeta .next/server/vendor-chunks/
const ffmpegPath = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const rowIndex = formData.get('rowIndex') as string;
    const slotId = formData.get('slotId') as string;
    const audioFile = formData.get('audio') as File;

    if (!rowIndex || !slotId || !audioFile) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // 1. Obtener la fila del Sheets para construir la ruta del proyecto
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `Matriz!A${rowIndex}:F${rowIndex}`,
    });
    const row = res.data.values?.[0];
    if (!row) throw new Error('Fila no encontrada.');

    const tema = row[5] || 'video';
    const fecha = new Date().toISOString().slice(0, 10);
    const slug = tema.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const audioDir = path.join(process.cwd(), 'output', `${fecha}_${slug}`, 'audio');

    // Asegurar que la carpeta exista
    fs.mkdirSync(audioDir, { recursive: true });

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const tempWebmPath = path.join(audioDir, `temp_clip_${slotId.padStart(2, '0')}.webm`);
    
    // Guardar el webm temporal
    fs.writeFileSync(tempWebmPath, buffer);

    const fileName = `clip_${slotId.padStart(2, '0')}.mp3`;
    const destPath = path.join(audioDir, fileName);

    try {
      if (!ffmpegPath) {
        throw new Error('Ffmpeg binary path not found');
      }
      // Convertir WebM a MP3
      await execPromise(`"${ffmpegPath}" -i "${tempWebmPath}" -vn -ab 128k -ar 44100 -y "${destPath}"`);
      console.log(`✅ Convertido a MP3 con éxito: ${destPath}`);
      
      // Borrar temp webm
      if (fs.existsSync(tempWebmPath)) {
        fs.unlinkSync(tempWebmPath);
      }
      
      return NextResponse.json({ success: true, fileName });
    } catch (ffmpegErr) {
      console.error('⚠️ Error al convertir a MP3 con ffmpeg, guardando archivo webm original:', ffmpegErr);
      
      const fallbackFileName = `clip_${slotId.padStart(2, '0')}.webm`;
      const fallbackPath = path.join(audioDir, fallbackFileName);
      fs.writeFileSync(fallbackPath, buffer);
      
      if (fs.existsSync(tempWebmPath)) {
        fs.unlinkSync(tempWebmPath);
      }
      
      return NextResponse.json({ success: true, fileName: fallbackFileName });
    }
  } catch (error: any) {
    console.error('Error saving audio:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
