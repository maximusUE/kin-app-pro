import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { folderName } = await request.json();
    if (!folderName) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const outputDir = '/Users/cesarue/Desktop/Proyecto YouTube/output';
    const targetPath = path.resolve(outputDir, folderName);

    // Security check to avoid directory traversal
    if (!targetPath.startsWith(outputDir) || targetPath === outputDir) {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
    }

    if (!fs.existsSync(targetPath)) {
      return NextResponse.json({ error: 'Folder does not exist' }, { status: 404 });
    }

    // Delete folder recursively
    fs.rmSync(targetPath, { recursive: true, force: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
