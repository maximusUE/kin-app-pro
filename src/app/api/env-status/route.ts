import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requiredKeys = [
    'GEMINI_API_KEY',
    'ELEVENLABS_API_KEY',
    'ELEVENLABS_VOICE_ID',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
    'PEXELS_API_KEY',
    'PIXABAY_API_KEY',
    'SPREADSHEET_ID',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_DRIVE_FOLDER_ID'
  ];

  const status: Record<string, boolean> = {};

  for (const key of requiredKeys) {
    status[key] = !!process.env[key];
  }

  return NextResponse.json(status);
}
