import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  console.warn('[Stripe Warning] STRIPE_SECRET_KEY no está configurada.');
}

export const stripe = new Stripe(stripeSecretKey);
