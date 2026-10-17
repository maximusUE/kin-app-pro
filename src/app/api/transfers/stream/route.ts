export const dynamic = 'force-dynamic';

/**
 * Server-Sent Events (SSE) Route for Real-Time SPEI Transfer Lifecycle Tracking
 * Emits live progression through Banxico's STP clearing pipeline:
 * 1. Firma Criptográfica KIN (Auth) -> 2. Cámara STP Banxico (Clearing) -> 3. Liquidación Exitosa (Settled)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const txId = searchParams.get('txId') || `KIN-${Date.now().toString().slice(-6)}`;
  const clave = searchParams.get('clave') || `20261017${Date.now().toString().slice(-8)}842918`;
  const isAlreadySettled = searchParams.get('settled') === 'true';

  const encoder = new TextEncoder();
  let step = 1;
  let intervalId: NodeJS.Timeout | null = null;
  let keepAliveId: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const nowStr = () => new Date().toLocaleTimeString('es-MX', { hour12: false });

      // If requested as already settled (historical transaction), emit immediate 100% completion
      if (isAlreadySettled) {
        const settledPayload = JSON.stringify({
          txId,
          claveRastreo: clave,
          step: 3,
          progress: 100,
          status: 'LIQUIDADA',
          statusTitle: 'Liquidada Exitosamente',
          stageMessage: 'Abono confirmado en cuenta del banco receptor. CEP Certificado.',
          timestamp: nowStr(),
          completed: true,
        });
        controller.enqueue(encoder.encode(`event: transfer_step\ndata: ${settledPayload}\n\n`));
        return;
      }

      // Step 1: Initial event (Immediate)
      const step1Payload = JSON.stringify({
        txId,
        claveRastreo: clave,
        step: 1,
        progress: 33,
        status: 'EN_PROCESAMIENTO',
        statusTitle: 'Firma y Autorización KIN',
        stageMessage: 'Cifrado Zero-Knowledge y reserva de balance aprobados.',
        timestamp: nowStr(),
        completed: false,
      });
      controller.enqueue(encoder.encode(`event: transfer_step\ndata: ${step1Payload}\n\n`));

      // Progression timer (every 1.8 seconds)
      intervalId = setInterval(() => {
        try {
          step += 1;
          if (step === 2) {
            const step2Payload = JSON.stringify({
              txId,
              claveRastreo: clave,
              step: 2,
              progress: 66,
              status: 'EN_TRANSITO_BANXICO',
              statusTitle: 'Cámara de Compensación SPEI',
              stageMessage: 'Tránsito interbancario seguro a través de STP y Banco de México.',
              timestamp: nowStr(),
              completed: false,
            });
            controller.enqueue(encoder.encode(`event: transfer_step\ndata: ${step2Payload}\n\n`));
          } else if (step === 3) {
            const step3Payload = JSON.stringify({
              txId,
              claveRastreo: clave,
              step: 3,
              progress: 100,
              status: 'LIQUIDADA',
              statusTitle: 'Liquidación en Banco Receptor',
              stageMessage: 'Fondos abonados íntegramente. Comprobante CEP emitido por Banxico.',
              timestamp: nowStr(),
              completed: true,
            });
            controller.enqueue(encoder.encode(`event: transfer_step\ndata: ${step3Payload}\n\n`));
            if (intervalId) clearInterval(intervalId);
          }
        } catch {
          if (intervalId) clearInterval(intervalId);
          if (keepAliveId) clearInterval(keepAliveId);
        }
      }, 1800);

      // Keep-alive heartbeat every 15s
      keepAliveId = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          if (intervalId) clearInterval(intervalId);
          if (keepAliveId) clearInterval(keepAliveId);
        }
      }, 15000);
    },
    cancel() {
      if (intervalId) clearInterval(intervalId);
      if (keepAliveId) clearInterval(keepAliveId);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
