import { NextResponse } from 'next/server';
import { executeKinCashSend } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, recipientName, amountUSD, concept } = body;

    if (!recipientName) {
      return NextResponse.json(
        { success: false, error: 'Nombre del destinatario requerido' },
        { status: 400 }
      );
    }

    const parsedUSD = parseFloat(amountUSD);
    if (isNaN(parsedUSD) || parsedUSD <= 0) {
      return NextResponse.json(
        { success: false, error: 'Monto de envío KIN Cash inválido' },
        { status: 400 }
      );
    }

    const result = executeKinCashSend({
      userId: userId || 'user-001',
      recipientName,
      amountUSD: parsedUSD,
      concept,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Error al procesar KIN Cash' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transferencia KIN Cash instantánea completada',
      transaction: result.transaction,
    });
  } catch (error: any) {
    console.error('[API /kin-cash/send] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al enviar KIN Cash' },
      { status: 500 }
    );
  }
}
