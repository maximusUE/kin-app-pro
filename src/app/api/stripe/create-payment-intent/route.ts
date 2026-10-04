import { NextRequest, NextResponse } from 'next/server';
import { createRemittancePaymentIntent } from '@/lib/server/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amountUsd, userId, userEmail, remittanceId, recipientName, deliveryMethod } = body;

    if (!amountUsd || amountUsd <= 0) {
      return NextResponse.json(
        { error: 'Monto inválido para procesar el pago.' },
        { status: 400 }
      );
    }

    const intent = await createRemittancePaymentIntent({
      amountUsd: Number(amountUsd),
      userId: userId || 'anonymous',
      userEmail,
      remittanceId: remittanceId || `kin_${Date.now()}`,
      recipientName: recipientName || 'Destinatario KIN',
      deliveryMethod: deliveryMethod || 'cash',
    });

    return NextResponse.json({
      success: true,
      clientSecret: intent.clientSecret,
      paymentIntentId: intent.paymentIntentId,
    });
  } catch (error: any) {
    console.error('[Stripe API Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al comunicarse con la pasarela de pagos de Stripe.' },
      { status: 500 }
    );
  }
}
