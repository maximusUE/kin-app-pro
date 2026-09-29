import { NextResponse } from 'next/server';

export interface FxConfig {
  spotRate: number; // Tasa interbancaria mayorista real
  marginPercent: number; // Porcentaje de margen de ganancia KIN (ej: 1.6%)
  isPromotionalActive: boolean;
  promotionalRate: number;
  customerRate: number; // Tasa que ve el usuario final
  updatedAt: string;
  source: string;
}

// Estado en memoria de la tasa de cambio global de KIN (con fallback seguro)
let globalFxConfig: FxConfig = {
  spotRate: 20.45,
  marginPercent: 1.6,
  isPromotionalActive: false,
  promotionalRate: 20.20,
  customerRate: 20.12,
  updatedAt: new Date().toISOString(),
  source: 'Mercado Interbancario Banxico / Forex Spot',
};

// Función auxiliar para recalcular tasa de cliente
function calculateCustomerRate(config: FxConfig): number {
  if (config.isPromotionalActive && config.promotionalRate > 0) {
    return Number(config.promotionalRate.toFixed(2));
  }
  const spread = config.spotRate * (config.marginPercent / 100);
  return Number((config.spotRate - spread).toFixed(2));
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: globalFxConfig,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener configuración FX' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { spotRate, marginPercent, isPromotionalActive, promotionalRate } = body;

    if (spotRate !== undefined && spotRate > 0) {
      globalFxConfig.spotRate = Number(spotRate);
    }
    if (marginPercent !== undefined && marginPercent >= 0) {
      globalFxConfig.marginPercent = Number(marginPercent);
    }
    if (isPromotionalActive !== undefined) {
      globalFxConfig.isPromotionalActive = Boolean(isPromotionalActive);
    }
    if (promotionalRate !== undefined && promotionalRate > 0) {
      globalFxConfig.promotionalRate = Number(promotionalRate);
    }

    globalFxConfig.customerRate = calculateCustomerRate(globalFxConfig);
    globalFxConfig.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'Tipo de cambio actualizado con éxito',
      data: globalFxConfig,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar tipo de cambio' },
      { status: 500 }
    );
  }
}
