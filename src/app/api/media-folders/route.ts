import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const outputDir = '/Users/cesarue/Desktop/Proyecto YouTube/output';
    if (!fs.existsSync(outputDir)) {
      return NextResponse.json([]);
    }

    const items = fs.readdirSync(outputDir);
    const foldersData = [];

    for (const item of items) {
      const itemPath = path.join(outputDir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        const audioDir = path.join(itemPath, 'audio');
        const videosDir = path.join(itemPath, 'videos');
        
        let audios: string[] = [];
        let videos: string[] = [];
        let slidesContent = '';

        if (fs.existsSync(audioDir)) {
          audios = fs.readdirSync(audioDir)
            .filter(file => file.endsWith('.mp3') || file.endsWith('.webm'));
        }

        if (fs.existsSync(videosDir)) {
          const videoFiles = fs.readdirSync(videosDir);
          videos = videoFiles.filter(file => file.endsWith('.mp4'));

          const slidesPath = path.join(videosDir, '00_diapositivas.txt');
          if (fs.existsSync(slidesPath)) {
            slidesContent = fs.readFileSync(slidesPath, 'utf-8');
          }
        }

        // Parse folder name for date and clean title
        // Format is YYYY-MM-DD_title
        const match = item.match(/^(\d{4}-\d{2}-\d{2})_(.*)$/);
        const date = match ? match[1] : '';
        const title = match ? match[2].replace(/-/g, ' ') : item.replace(/-/g, ' ');

        foldersData.push({
          folderName: item,
          date,
          title,
          audios,
          videos,
          slidesContent,
        });
      }
    }

    // Sort by folder name descending (newest first)
    foldersData.sort((a, b) => b.folderName.localeCompare(a.folderName));

    return NextResponse.json(foldersData);
  } catch (error: any) {
    console.error('Error listing media folders:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
