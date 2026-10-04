import { NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/server/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = 'usd', customerEmail, description, metadata } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Monto inválido para procesar el pago' }, { status: 400 });
    }

    const stripe = getStripeClient();

    // Monto en centavos (ej. 100.50 USD = 10050 centavos)
    const amountInCents = Math.round(Number(amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      description: description || 'Envío de dinero KIN (Remesa)',
      receipt_email: customerEmail || undefined,
      metadata: {
        platform: 'kin-app-pro',
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
  } catch (error: any) {
    console.error('[Stripe create-payment-intent Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al crear intento de pago con Stripe' },
      { status: 500 }
    );
  }
}
