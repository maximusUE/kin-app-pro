/**
 * KIN Fintech Platform — Comparador de Tarifas y Rieles de Remesas
 * Compara el envío de USD a México entre KIN, Western Union y Remitly.
 * 
 * Uso:
 *   npm run rates
 *   o: node --experimental-strip-types src/scripts/compareRates.ts [montoUSD]
 */

export interface RemittanceProvider {
  name: string;
  badge: string;
  fxRate: number;        // Tipo de cambio ofrecido (MXN por USD)
  transferFeeUSD: number; // Comisión fija de envío
  deliverySpeed: string; // Tiempo de entrega
  deliveryMethod: string;// Método de dispersión
}

// Configuración de mercado actual (Envío $300 USD USA -> México)
export const DEFAULT_SEND_AMOUNT_USD = 300;

export const PROVIDERS: RemittanceProvider[] = [
  {
    name: 'KIN App Pro',
    badge: '👑 RECOMENDADO (CERO COMISIÓN)',
    fxRate: 20.45,
    transferFeeUSD: 0.00,
    deliverySpeed: '< 60 segundos',
    deliveryMethod: 'SPEI Banxico Directo',
  },
  {
    name: 'Remitly (Express)',
    badge: '⚠️ Margen Oculto FX (2.44%)',
    fxRate: 19.95,
    transferFeeUSD: 3.99,
    deliverySpeed: 'Minutos a Horas',
    deliveryMethod: 'Depósito Bancario / Ventanilla',
  },
  {
    name: 'Western Union',
    badge: '❌ Comisión Alta + Spread (3.18%)',
    fxRate: 19.80,
    transferFeeUSD: 4.99,
    deliverySpeed: 'Minutos a 1 Día',
    deliveryMethod: 'Ventanilla / Cuenta Bancaria',
  },
];

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
}

export function formatMXN(amount: number): string {
  return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
}

export function calculateComparison(sendAmountUSD: number = DEFAULT_SEND_AMOUNT_USD) {
  const kin = PROVIDERS[0];
  const kinReceivedMXN = sendAmountUSD * kin.fxRate;
  const kinTotalCostUSD = sendAmountUSD + kin.transferFeeUSD;

  return PROVIDERS.map((provider) => {
    const receivedMXN = sendAmountUSD * provider.fxRate;
    const totalCostUSD = sendAmountUSD + provider.transferFeeUSD;
    const diffMXN = receivedMXN - kinReceivedMXN; // Negativo significa que entrega menos pesos que KIN
    const feeSavedUSD = provider.transferFeeUSD - kin.transferFeeUSD;
    
    // Ahorro total estimado con KIN (lo que el remitente y destinatario ganan juntos)
    // = Diferencia en pesos recibidos + valor en MXN de la comisión ahorrada
    const netSavingsMXN = (kinReceivedMXN - receivedMXN) + (feeSavedUSD * kin.fxRate);
    const netSavingsUSD = netSavingsMXN / kin.fxRate;

    return {
      provider,
      sendAmountUSD,
      totalCostUSD,
      receivedMXN,
      diffMXN,
      feeSavedUSD,
      netSavingsMXN,
      netSavingsUSD,
    };
  });
}

export function printRatesComparison(sendAmountUSD: number = DEFAULT_SEND_AMOUNT_USD) {
  const results = calculateComparison(sendAmountUSD);
  const kinResult = results[0];
  const wuResult = results.find(r => r.provider.name.includes('Western Union'))!;
  const remitlyResult = results.find(r => r.provider.name.includes('Remitly'))!;

  const ANSI_RESET = '\x1b[0m';
  const ANSI_BOLD = '\x1b[1m';
  const ANSI_GREEN = '\x1b[32m';
  const ANSI_BRIGHT_GREEN = '\x1b[92m';
  const ANSI_CYAN = '\x1b[36m';
  const ANSI_YELLOW = '\x1b[33m';
  const ANSI_RED = '\x1b[31m';
  const ANSI_GRAY = '\x1b[90m';
  const ANSI_WHITE = '\x1b[97m';

  console.log('\n' + ANSI_BOLD + ANSI_CYAN + '═'.repeat(78) + ANSI_RESET);
  console.log(
    ANSI_BOLD + ANSI_BRIGHT_GREEN + 
    '  🏛️  KIN FINTECH — COMPARADOR MAESTRO DE REMESAS USA ➔ MÉXICO' + 
    ANSI_RESET
  );
  console.log(
    ANSI_GRAY + 
    `  Envío simulado: ${ANSI_BOLD + ANSI_WHITE}$${sendAmountUSD}.00 USD${ANSI_RESET}${ANSI_GRAY} | Riel: SPEI Banxico Interbancario vs Remesadoras Tradicionales` + 
    ANSI_RESET
  );
  console.log(ANSI_CYAN + '═'.repeat(78) + ANSI_RESET);

  console.log('\n' + ANSI_BOLD + '┌─────────────────────────┬────────────┬─────────────┬──────────────┬──────────────────┬──────────────┐' + ANSI_RESET);
  console.log(
    ANSI_BOLD + 
    '│ Proveedor               │ Comisión   │ Tipo Cambio │ Total Pagado │ Reciben en MEX   │ Ventaja KIN  │' + 
    ANSI_RESET
  );
  console.log('├─────────────────────────┼────────────┼─────────────┼──────────────┼──────────────────┼──────────────┤');

  results.forEach((r, idx) => {
    const isKin = idx === 0;
    const nameColor = isKin ? ANSI_BOLD + ANSI_BRIGHT_GREEN : ANSI_WHITE;
    const feeColor = r.provider.transferFeeUSD === 0 ? ANSI_BRIGHT_GREEN : ANSI_YELLOW;
    const fxColor = isKin ? ANSI_BRIGHT_GREEN : ANSI_WHITE;
    const receivedColor = isKin ? ANSI_BOLD + ANSI_BRIGHT_GREEN : ANSI_WHITE;

    const paddedName = r.provider.name.padEnd(23);
    const paddedFee = formatUSD(r.provider.transferFeeUSD).padEnd(10);
    const paddedRate = `$${r.provider.fxRate.toFixed(2)}`.padEnd(11);
    const paddedTotal = formatUSD(r.totalCostUSD).padEnd(12);
    const paddedReceived = formatMXN(r.receivedMXN).padEnd(16);

    let advantageCol = '';
    if (isKin) {
      advantageCol = (ANSI_BOLD + ANSI_BRIGHT_GREEN + '★ BASE (100%)' + ANSI_RESET).padEnd(21);
    } else {
      const diffStr = `-${formatMXN(Math.abs(r.diffMXN))}`;
      advantageCol = (ANSI_RED + diffStr + ANSI_RESET).padEnd(21);
    }

    console.log(
      `│ ${nameColor}${paddedName}${ANSI_RESET} │ ${feeColor}${paddedFee}${ANSI_RESET} │ ${fxColor}${paddedRate}${ANSI_RESET} │ ${paddedTotal} │ ${receivedColor}${paddedReceived}${ANSI_RESET} │ ${advantageCol}│`
    );
  });

  console.log('└─────────────────────────┴────────────┴─────────────┴──────────────┴──────────────────┴──────────────┘\n');

  // Resumen Ejecutivo de Ahorro Neto
  console.log(ANSI_BOLD + ANSI_WHITE + '📊 RESUMEN EJECUTIVO DE AHORRO NETO CON KIN:' + ANSI_RESET);
  console.log(ANSI_GRAY + '─'.repeat(78) + ANSI_RESET);

  console.log(
    `  ${ANSI_BOLD}1. Frente a Western Union:${ANSI_RESET}\n` +
    `     • Tu familiar en México recibe:  ${ANSI_BRIGHT_GREEN}+${formatMXN(kinResult.receivedMXN - wuResult.receivedMXN)} más en su cuenta${ANSI_RESET}\n` +
    `     • Ahorro en comisión de envío:   ${ANSI_BRIGHT_GREEN}+${formatUSD(wuResult.provider.transferFeeUSD)} ahorrados${ANSI_RESET}\n` +
    `     • ${ANSI_BOLD}Ahorro Neto Total con KIN:     ${ANSI_BRIGHT_GREEN}${ANSI_BOLD}+${formatMXN(wuResult.netSavingsMXN)} (${formatUSD(wuResult.netSavingsUSD)})${ANSI_RESET}\n`
  );

  console.log(
    `  ${ANSI_BOLD}2. Frente a Remitly (Express):${ANSI_RESET}\n` +
    `     • Tu familiar en México recibe:  ${ANSI_BRIGHT_GREEN}+${formatMXN(kinResult.receivedMXN - remitlyResult.receivedMXN)} más en su cuenta${ANSI_RESET}\n` +
    `     • Ahorro en comisión de envío:   ${ANSI_BRIGHT_GREEN}+${formatUSD(remitlyResult.provider.transferFeeUSD)} ahorrados${ANSI_RESET}\n` +
    `     • ${ANSI_BOLD}Ahorro Neto Total con KIN:     ${ANSI_BRIGHT_GREEN}${ANSI_BOLD}+${formatMXN(remitlyResult.netSavingsMXN)} (${formatUSD(remitlyResult.netSavingsUSD)})${ANSI_RESET}\n`
  );

  console.log(ANSI_CYAN + '═'.repeat(78) + ANSI_RESET);
  console.log(
    `  ${ANSI_BOLD + ANSI_BRIGHT_GREEN}✓ VEREDICTO:${ANSI_RESET} Al enviar ${formatUSD(sendAmountUSD)} por KIN, tu familia en México recibe`
  );
  console.log(
    `    ${ANSI_BOLD + ANSI_BRIGHT_GREEN}${formatMXN(kinResult.receivedMXN)} íntegros${ANSI_RESET} en menos de 60 segundos por SPEI Banxico directo.`
  );
  console.log(ANSI_CYAN + '═'.repeat(78) + ANSI_RESET + '\n');
}

// Si se ejecuta directamente desde consola
const argAmount = process.argv[2] ? parseFloat(process.argv[2]) : DEFAULT_SEND_AMOUNT_USD;
const finalAmount = isNaN(argAmount) || argAmount <= 0 ? DEFAULT_SEND_AMOUNT_USD : argAmount;

printRatesComparison(finalAmount);
