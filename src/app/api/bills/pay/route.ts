import { NextResponse } from 'next/server';
import { executeBillPayment, findUserById, USD_TO_MXN_RATE } from '@/lib/server/db';
import { billPaySchema, formatZodError } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // 1. Validación estricta con esquema Zod
    const validationResult = billPaySchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'VALIDATION_ERROR',
          error: formatZodError(validationResult.error),
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 2. Consulta de Usuario y Verificación Atómica de Fondos
    const user = findUserById(data.userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'USER_NOT_FOUND',
          error: 'Usuario pagador no encontrado en los registros de KIN',
        },
        { status: 404 }
      );
    }

    // 3. Conversión de Divisa y Verificación de Límites Regulatorios Diarios
    const amountUSD = +(data.amountMXN / USD_TO_MXN_RATE).toFixed(2);
    const dailyLimit = user.dailyLimitUSD || 1000;
    if (amountUSD > dailyLimit) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'EXCEEDS_TIER_LIMIT',
          error: `El pago del servicio ($${amountUSD.toFixed(2)} USD) excede tu límite diario de $${dailyLimit.toFixed(2)} USD para ${user.kycTier || 'Tier 1'}`,
          currentTier: user.kycTier || 'Tier 1',
          dailyLimitUSD: dailyLimit,
          requestedAmountUSD: amountUSD,
        },
        { status: 403 }
      );
    }

    // 4. Comprobación de Fondos Disponibles
    if (user.balanceUSD < amountUSD) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'INSUFFICIENT_FUNDS',
          error: `Saldo insuficiente para pagar la factura. Requiere $${amountUSD.toFixed(2)} USD, disponible: $${user.balanceUSD.toFixed(2)} USD`,
          availableBalanceUSD: user.balanceUSD,
          requiredAmountUSD: amountUSD,
          amountMXN: data.amountMXN,
        },
        { status: 400 }
      );
    }

    // 5. Ejecución del Pago de Servicio con Timbrado SAT CFDI 4.0
    const result = executeBillPayment({
      userId: user.id,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      referenceNumber: data.referenceNumber,
      amountMXN: data.amountMXN,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'EXECUTION_FAILED',
          error: result.error || 'Error al procesar el pago del servicio',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Factura pagada exitosamente con timbrado SAT CFDI 4.0',
      transaction: result.transaction,
    });
  } catch (error: any) {
    console.error('[API /bills/pay] Error:', error);
    return NextResponse.json(
      {
        success: false,
        errorCode: 'INTERNAL_SERVER_ERROR',
        error: error.message || 'Error interno al pagar servicio mexicano',
      },
      { status: 500 }
    );
  }
}
