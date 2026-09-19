import { NextResponse } from 'next/server';
import { executeBillPayment } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, serviceId, serviceName, referenceNumber, amountMXN } = body;

    if (!serviceName && !serviceId) {
      return NextResponse.json(
        { success: false, error: 'Identificador del servicio es requerido' },
        { status: 400 }
      );
    }

    const parsedMXN = parseFloat(amountMXN);
    if (isNaN(parsedMXN) || parsedMXN <= 0) {
      return NextResponse.json(
        { success: false, error: 'Monto de factura inválido' },
        { status: 400 }
      );
    }

    const result = executeBillPayment({
      userId: userId || 'user-001',
      serviceId: serviceId || 'cfe',
      serviceName: serviceName || 'Servicio Mexicano',
      referenceNumber: referenceNumber || 'REF-123456',
      amountMXN: parsedMXN,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Error al procesar el pago del servicio' },
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
      { success: false, error: error.message || 'Error interno al pagar servicio' },
      { status: 500 }
    );
  }
}
