import { NextResponse } from 'next/server';
import { getScriptsInReview } from '../../../scripts/contentFactoryWorker';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scripts = await getScriptsInReview();
    return NextResponse.json(scripts, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error: any) {
    console.error('Error fetching scripts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
