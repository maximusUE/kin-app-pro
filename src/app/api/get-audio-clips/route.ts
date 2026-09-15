import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sheets, SPREADSHEET_ID } from '../../../scripts/contentFactoryWorker';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rowIndex = searchParams.get('rowIndex');

    if (!rowIndex) {
      return NextResponse.json({ error: 'Falta rowIndex' }, { status: 400 });
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

    const clipsMap: Record<number, { slotId: number; fileName: string; url: string }> = {};

    if (fs.existsSync(audioDir)) {
      const files = fs.readdirSync(audioDir).filter(f => f.startsWith('clip_') && (f.endsWith('.webm') || f.endsWith('.mp3')));
      files.forEach(f => {
        const match = f.match(/clip_(\d+)\.(webm|mp3)/);
        if (match) {
          const slotId = parseInt(match[1], 10);
          const isMp3 = f.endsWith('.mp3');
          
          // Preferimos .mp3 sobre .webm si existen ambos para el mismo slotId
          if (!clipsMap[slotId] || isMp3) {
            clipsMap[slotId] = {
              slotId,
              fileName: f,
              url: `/api/media/${fecha}_${slug}/audio/${f}`,
            };
          }
        }
      });
    }

    const clips = Object.values(clipsMap).sort((a, b) => a.slotId - b.slotId);

    return NextResponse.json(clips);
  } catch (error: any) {
    console.error('Error getting audio clips:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
