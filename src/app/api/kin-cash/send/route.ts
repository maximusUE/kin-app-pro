import { NextResponse } from 'next/server';
import { executeKinCashSend, findUserById } from '@/lib/server/db';
import { kinCashSendSchema, formatZodError } from '@/lib/validation/schemas';
import { capitalizeWords } from '@/lib/utils/capitalize';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // 1. Validación estricta con esquema Zod
    const validationResult = kinCashSendSchema.safeParse(rawBody);
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
    const cleanRecipientName = capitalizeWords(data.recipientName);

    // 2. Consulta de Usuario y Verificación Atómica de Fondos
    const user = findUserById(data.userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'USER_NOT_FOUND',
          error: 'Usuario emisor no encontrado en los registros de KIN',
        },
        { status: 404 }
      );
    }

    // 3. Verificación de Límites Diarios por Nivel Regulatorio KYC/AML (Tier 1 vs Tier 2)
    const dailyLimit = user.dailyLimitUSD || 1000;
    if (data.amountUSD > dailyLimit) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'EXCEEDS_TIER_LIMIT',
          error: `El monto solicitado ($${data.amountUSD.toFixed(2)} USD) excede tu límite diario de $${dailyLimit.toFixed(2)} USD para ${user.kycTier || 'Tier 1'}`,
          currentTier: user.kycTier || 'Tier 1',
          dailyLimitUSD: dailyLimit,
          requestedAmountUSD: data.amountUSD,
        },
        { status: 403 }
      );
    }

    // 4. Comprobación de Fondos Disponibles
    if (user.balanceUSD < data.amountUSD) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'INSUFFICIENT_FUNDS',
          error: `Saldo insuficiente para enviar KIN Cash. Saldo disponible: $${user.balanceUSD.toFixed(2)} USD`,
          availableBalanceUSD: user.balanceUSD,
          requiredAmountUSD: data.amountUSD,
        },
        { status: 400 }
      );
    }

    // 5. Ejecución de la transferencia P2P KIN Cash
    const result = executeKinCashSend({
      userId: user.id,
      recipientName: cleanRecipientName,
      amountUSD: data.amountUSD,
      concept: data.concept,
      recipientId: data.recipientId,
      recipientPhone: data.recipientPhone,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'EXECUTION_FAILED',
          error: result.error || 'Error al procesar el envío de KIN Cash',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transferencia KIN Cash instantánea completada con éxito',
      transaction: result.transaction,
    });
  } catch (error: any) {
    console.error('[API /kin-cash/send] Error:', error);
    return NextResponse.json(
      {
        success: false,
        errorCode: 'INTERNAL_SERVER_ERROR',
        error: error.message || 'Error interno al enviar KIN Cash',
      },
      { status: 500 }
    );
  }
}
