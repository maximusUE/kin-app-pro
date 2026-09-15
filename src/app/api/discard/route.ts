import { NextResponse } from 'next/server';
import { updateScriptStateInSheet } from '../../../scripts/contentFactoryWorker';

export async function POST(req: Request) {
  try {
    const { rowIndex } = await req.json();
    if (!rowIndex) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Update state to Discarded
    await updateScriptStateInSheet(rowIndex, 'Descartado 🗑️');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error discarding script:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
