import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const LOGS_DIR = '/Users/cesarue/Desktop/Proyecto YouTube/scratch/logs';

export async function POST(request: Request) {
  try {
    const { script } = await request.json();
    const validScripts = ['trends', 'documentary', 'factory', 'bot'];
    
    if (!script || !validScripts.includes(script)) {
      return NextResponse.json({ error: 'Invalid script name' }, { status: 400 });
    }

    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }

    const logFile = path.join(LOGS_DIR, `${script}.log`);
    fs.writeFileSync(logFile, `=== CONSOLA LIMPIA: ${new Date().toLocaleString()} ===\n`, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error clearing logs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
