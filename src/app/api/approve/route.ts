import { NextResponse } from 'next/server';
import { updateScriptInSheet, processApprovedRow } from '../../../scripts/contentFactoryWorker';

export async function POST(req: Request) {
  try {
    const { rowIndex, guion, mode = 'full' } = await req.json();
    
    if (!rowIndex || !guion) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // 1. Guardar guion editado en sheets
    await updateScriptInSheet(rowIndex, guion);

    // 2. Procesar (ElevenLabs + Pexels)
    const result = await processApprovedRow(rowIndex, mode);

    if (!result.success) {
      throw new Error(result.error);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error approving script:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
