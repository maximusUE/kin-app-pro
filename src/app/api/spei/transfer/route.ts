import { NextResponse } from 'next/server';
import { executeSpeiTransfer, findUserById } from '@/lib/server/db';
import { speiTransferSchema, formatZodError } from '@/lib/validation/schemas';
import { capitalizeWords } from '@/lib/utils/capitalize';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // 1. Validación estricta con esquema Zod (CNBV/Banxico/AML)
    const validationResult = speiTransferSchema.safeParse(rawBody);
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

    // 3. Verificación Estricta de Límites Diarios por Nivel Regulatorio KYC/AML (Tier 1 vs Tier 2)
    const dailyLimit = user.dailyLimitUSD || 1000;
    if (data.amountUSD > dailyLimit) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'EXCEEDS_TIER_LIMIT',
          error: `El monto solicitado ($${data.amountUSD.toFixed(2)} USD) excede el límite diario permitido ($${dailyLimit.toFixed(2)} USD) para tu nivel ${user.kycTier || 'Tier 1'}. Por favor sube de nivel KYC o reduce el importe.`,
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
          error: `Saldo insuficiente para completar la transferencia. Saldo disponible: $${user.balanceUSD.toFixed(2)} USD`,
          availableBalanceUSD: user.balanceUSD,
          requiredAmountUSD: data.amountUSD,
        },
        { status: 400 }
      );
    }

    // 5. Ejecución en Motor SPEI Banxico / Red de Corresponsales
    const result = executeSpeiTransfer({
      userId: user.id,
      clabe: data.clabe || '',
      recipientName: cleanRecipientName,
      amountUSD: data.amountUSD,
      deliveryMethod: data.deliveryMethod,
      pickupStore: data.pickupStore || 'oxxo',
      concept: data.concept,
      recipientId: data.recipientId,
      recipientPhone: data.recipientPhone,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'EXECUTION_FAILED',
          error: result.error || 'No se pudo procesar la transferencia SPEI',
        },
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
      {
        success: false,
        errorCode: 'INTERNAL_SERVER_ERROR',
        error: error.message || 'Error interno al procesar transferencia SPEI',
      },
      { status: 500 }
    );
  }
}
