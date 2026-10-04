import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

/**
 * Cliente oficial de Stripe para operaciones del servidor (Next.js Server Actions / API Routes).
 * Protegido contra ejecución en el cliente.
 */
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-04-10' as any,
      typescript: true,
      appInfo: {
        name: 'KIN App Pro',
        version: '1.0.0',
      },
    })
  : null;

/**
 * Crea una intención de pago (PaymentIntent) para procesar el cobro de una remesa
 * en dólares (USD) mediante Tarjeta de Débito/Crédito, Apple Pay o Google Pay.
 */
export async function createRemittancePaymentIntent({
  amountUsd,
  userId,
  userEmail,
  remittanceId,
  recipientName,
  deliveryMethod,
}: {
  amountUsd: number;
  userId: string;
  userEmail?: string;
  remittanceId: string;
  recipientName: string;
  deliveryMethod: string;
}) {
  if (!stripe) {
    throw new Error('STRIPE_SECRET_KEY no está configurada en las variables de entorno.');
  }

  // Stripe procesa montos en centavos (ej: $100.00 USD = 10000 cents)
  const amountInCents = Math.round(amountUsd * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    payment_method_types: ['card'],
    receipt_email: userEmail || undefined,
    metadata: {
      remittanceId,
      userId,
      recipientName,
      deliveryMethod,
      platform: 'kin-app-pro',
    },
    description: `Envío KIN a México - Destinatario: ${recipientName}`,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
  };
}
