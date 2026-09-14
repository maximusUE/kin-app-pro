import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePathArray = params.path;
    if (!filePathArray || filePathArray.length === 0) {
      return new Response('Not Found', { status: 404 });
    }

    const outputDir = '/Users/cesarue/Desktop/Proyecto YouTube/output';
    const resolvedPath = path.resolve(outputDir, ...filePathArray);

    // Prevent directory traversal
    if (!resolvedPath.startsWith(outputDir)) {
      return new Response('Access Denied', { status: 403 });
    }

    if (!fs.existsSync(resolvedPath) || fs.statSync(resolvedPath).isDirectory()) {
      return new Response('File Not Found', { status: 404 });
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.mp3') contentType = 'audio/mpeg';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.webm') contentType = 'audio/webm';
    else if (ext === '.txt') contentType = 'text/plain; charset=utf-8';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

    const stat = fs.statSync(resolvedPath);
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      
      if (start >= stat.size || end >= stat.size) {
        return new Response('Range Not Satisfiable', {
          status: 416,
          headers: { 'Content-Range': `bytes */${stat.size}` }
        });
      }

      const chunksize = (end - start) + 1;
      const fileStream = fs.createReadStream(resolvedPath, { start, end });
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': contentType,
      };

      return new Response(Readable.toWeb(fileStream) as any, {
        status: 206,
        headers: head
      });
    } else {
      const fileStream = fs.createReadStream(resolvedPath);
      const head = {
        'Content-Length': stat.size.toString(),
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      };
      
      return new Response(Readable.toWeb(fileStream) as any, {
        status: 200,
        headers: head
      });
    }
  } catch (error: any) {
    console.error('Error serving media file:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
