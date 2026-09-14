import { NextResponse } from 'next/server';
import { updateScriptInSheet, updateScriptStateInSheet } from '../../../scripts/contentFactoryWorker.ts';

export async function POST(request: Request) {
  try {
    const { rowIndex, guion } = await request.json();

    if (!rowIndex || !guion) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    // 1. Guardar guion editado en sheets
    await updateScriptInSheet(rowIndex, guion);

    // 2. Actualizar estado a Guardado Temporal
    await updateScriptStateInSheet(rowIndex, 'Guardado Temporal ⏸️');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in save-temporal API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
