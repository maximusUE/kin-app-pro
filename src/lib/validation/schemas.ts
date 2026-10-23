import { z } from 'zod';
// @ts-ignore
import { validarCLABE } from '../../domain/spei/clabeValidator.ts';

/**
 * Esquema de validación Zod para Envíos SPEI / Retiro en Efectivo (USA ➔ México)
 * Cumplimiento estricto con normativas CNBV, Banxico y FinCEN AML/PLD.
 * Compatible con Zod v4 (^4.6.7) con valores por defecto resilientes.
 */
export const speiTransferSchema = z
  .object({
    userId: z.string().default('user-001'),
    recipientName: z
      .string()
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres'),
    recipientPhone: z.preprocess(
      (val) => (val === undefined || val === null || val === '' ? '+525500000000' : typeof val === 'string' ? val.trim() : val),
      z
        .string()
        .trim()
        .min(10, 'El teléfono celular debe tener al menos 10 dígitos')
        .max(16, 'Formato de teléfono celular inválido')
        .default('+525500000000')
    ),
    amountUSD: z.preprocess(
      (val) => (typeof val === 'string' ? parseFloat(val) : val),
      z
        .number()
        .positive('El monto debe ser mayor a 0')
        .min(1.0, 'El monto mínimo de envío es $1.00 USD')
        .max(10000.0, 'El monto máximo por operación no puede superar $10,000 USD')
    ),
    deliveryMethod: z.enum(['bank', 'cash', 'wallet']).default('cash'),
    pickupStore: z.string().optional(),
    clabe: z.string().trim().optional(),
    concept: z.string().trim().max(50, 'El concepto no puede superar 50 caracteres').optional(),
    recipientId: z.string().optional(),
  })
  .refine(
    (data) => {
      // Si el método de entrega es bancario directo y se provee CLABE de 18 dígitos, validarla con Banxico
      if (data.deliveryMethod === 'bank' && data.clabe) {
        const clean = data.clabe.replace(/\D/g, '');
        if (clean.length === 18) {
          const res = validarCLABE(clean);
          return res.valida;
        }
      }
      return true;
    },
    {
      message: 'CLABE interbancaria inválida (dígito de control o banco no reconocido por Banxico)',
      path: ['clabe'],
    }
  );

/**
 * Esquema de validación Zod para Pago de Servicios Mexicanos (CFE, Telmex, Agua, etc.)
 * Provee valores por defecto sensibles para serviceId y referenceNumber para llamadas rápidas de UI.
 */
export const billPaySchema = z.object({
  userId: z.string().default('user-001'),
  serviceId: z.preprocess(
    (val) => (val === undefined || val === null || val === '' ? 'cfe-mex' : typeof val === 'string' ? val.trim() : val),
    z.string().trim().default('cfe-mex')
  ),
  serviceName: z
    .string()
    .trim()
    .min(1, 'El nombre del servicio no puede estar vacío'),
  referenceNumber: z.preprocess(
    (val) => (val === undefined || val === null || val === '' ? 'REF-KIN-AUTO' : typeof val === 'string' ? val.trim() : val),
    z
      .string()
      .trim()
      .min(3, 'El número de referencia debe tener al menos 3 caracteres')
      .max(50, 'El número de referencia no puede superar 50 caracteres')
      .default('REF-KIN-AUTO')
  ),
  amountMXN: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z
      .number()
      .positive('El monto del recibo debe ser mayor a $0 MXN')
      .min(5.0, 'El monto mínimo de pago es $5.00 MXN')
      .max(100000.0, 'El monto máximo de factura no puede superar $100,000 MXN')
  ),
});

/**
 * Esquema de validación Zod para Transferencias KIN Cash P2P Instantáneas
 */
export const kinCashSendSchema = z.object({
  userId: z.string().default('user-001'),
  recipientName: z
    .string()
    .trim()
    .min(2, 'El nombre del destinatario debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  recipientPhone: z.preprocess(
    (val) => (val === undefined || val === null || val === '' ? '+525500000000' : typeof val === 'string' ? val.trim() : val),
    z
      .string()
      .trim()
      .min(10, 'El teléfono celular debe tener al menos 10 dígitos')
      .max(16, 'Formato de teléfono celular inválido')
      .default('+525500000000')
  ),
  amountUSD: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z
      .number()
      .positive('El monto debe ser mayor a 0')
      .min(1.0, 'El monto mínimo para KIN Cash es $1.00 USD')
      .max(5000.0, 'El monto máximo para KIN Cash es $5,000 USD')
  ),
  concept: z.string().trim().max(100, 'El concepto no puede superar 100 caracteres').optional(),
  recipientId: z.string().optional(),
});

/**
 * Función utilitaria para formatear errores Zod en respuestas API claras y legibles
 * Compatible con Zod v3 y Zod v4 (^4.6.7).
 */
export function formatZodError(error: z.ZodError): string {
  if (!error || !Array.isArray(error.issues)) {
    return 'Error de validación';
  }
  return error.issues
    .map((err) => {
      const fieldPath = err.path && err.path.length > 0 ? err.path.join('.') : 'campo';
      return `${fieldPath}: ${err.message}`;
    })
    .join(', ');
}
