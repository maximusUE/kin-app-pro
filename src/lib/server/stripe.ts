import Stripe from 'stripe';

/**
 * Cliente oficial de Stripe en el servidor.
 * La clave real STRIPE_SECRET_KEY se lee de las variables de entorno en tiempo de ejecución.
 * Para evitar que el build de Next.js falle durante la fase de análisis estático en Vercel,
 * se utiliza un placeholder seguro únicamente si no se encuentra configurada en el entorno.
 */
const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build_only_not_a_real_key';

export const stripe = new Stripe(stripeSecretKey);

export function getStripeClient(): Stripe {
  const key =
    process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build_only_not_a_real_key';
  return new Stripe(key);
}
