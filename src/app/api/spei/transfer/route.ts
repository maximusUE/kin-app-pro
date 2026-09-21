import { NextResponse } from 'next/server';
import { executeSpeiTransfer } from '@/lib/server/db';
import { capitalizeWords } from '@/lib/utils/capitalize';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, clabe, recipientName, amountUSD, deliveryMethod, pickupStore, concept, recipientId, recipientPhone } = body;

    const cleanRecipientName = capitalizeWords(recipientName?.trim());

    if (!cleanRecipientName) {
      return NextResponse.json(
        { success: false, error: 'Regulación CNBV: El nombre del beneficiario es obligatorio' },
        { status: 400 }
      );
    }

    if (!recipientPhone || !recipientPhone.trim()) {
      return NextResponse.json(
        { success: false, error: 'Regulación CNBV: El teléfono celular del beneficiario es obligatorio' },
        { status: 400 }
      );
    }

    const parsedAmount = parseFloat(amountUSD);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Monto de transferencia inválido' },
        { status: 400 }
      );
    }

    const result = executeSpeiTransfer({
      userId: userId || 'user-001',
      clabe: clabe || '',
      recipientName: cleanRecipientName,
      amountUSD: parsedAmount,
      deliveryMethod: deliveryMethod || 'cash',
      pickupStore: pickupStore || 'oxxo',
      concept,
      recipientId,
      recipientPhone,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'No se pudo procesar la transferencia' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transferencia procesada con éxito a través de KIN / Banxico',
      transaction: result.transaction,
      claveRetiroEfectivo: result.transaction?.claveRetiroEfectivo,
      claveRastreoBanxico: result.transaction?.claveRastreoBanxico,
    });
  } catch (error: any) {
    console.error('[API /spei/transfer] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al procesar SPEI' },
      { status: 500 }
    );
  }
}
