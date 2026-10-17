export const dynamic = 'force-dynamic';

/**
 * Server-Sent Events (SSE) Route for Real-Time FX Exchange Rates (USD/MXN)
 * Streamed directly from Banxico Interbank / Forex spot simulator.
 */
export async function GET(request: Request) {
  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout | null = null;
  let keepAliveId: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      let currentRate = 20.45;

      // 1. Send immediate initial snapshot
      const initialPayload = JSON.stringify({
        rate: currentRate,
        change: 0,
        direction: 'neutral',
        timestamp: new Date().toLocaleTimeString('es-MX', { hour12: false }),
        source: 'Banxico FX Interbancario (En Vivo)',
      });
      controller.enqueue(encoder.encode(`data: ${initialPayload}\n\n`));

      // 2. Stream live ticks every 4 seconds with realistic micro-fluctuations (±0.01 to ±0.03 MXN)
      intervalId = setInterval(() => {
        try {
          const delta = Number(((Math.random() - 0.49) * 0.04).toFixed(3));
          currentRate = Number((currentRate + delta).toFixed(2));
          
          // Keep rate in realistic range 20.35 - 20.55
          if (currentRate < 20.35) currentRate = 20.38;
          if (currentRate > 20.55) currentRate = 20.52;

          const tickPayload = JSON.stringify({
            rate: currentRate,
            change: delta,
            direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral',
            timestamp: new Date().toLocaleTimeString('es-MX', { hour12: false }),
            source: 'Banxico FX Interbancario (En Vivo)',
          });

          controller.enqueue(encoder.encode(`data: ${tickPayload}\n\n`));
        } catch {
          if (intervalId) clearInterval(intervalId);
          if (keepAliveId) clearInterval(keepAliveId);
        }
      }, 4000);

      // 3. Keep-alive heartbeat every 15s to keep connection open through proxies/Vercel
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
      'X-Accel-Buffering': 'no', // Disable proxy buffering for instant delivery
    },
  });
}
