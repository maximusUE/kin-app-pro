/**
 * spei.ts - Motor Oficial de Validación SPEI Banxico & Algoritmo CLABE
 * Cumplimiento con Circular 14/2017 de Banco de México (Banxico) y CNBV.
 */

export interface BanxicoBankInfo {
  code: string;
  name: string;
  shortName: string;
  logoUrl?: string;
}

export const BANXICO_BANKS: Record<string, BanxicoBankInfo> = {
  '002': { code: '002', name: 'Banco Nacional de México (Citibanamex)', shortName: 'Citibanamex', logoUrl: '/logos/banamex.png' },
  '012': { code: '012', name: 'BBVA México', shortName: 'BBVA', logoUrl: '/logos/bbva_bancomer.png' },
  '014': { code: '014', name: 'Banco Santander México', shortName: 'Santander' },
  '021': { code: '021', name: 'HSBC México', shortName: 'HSBC' },
  '030': { code: '030', name: 'Banco del Bajío (BanBajío)', shortName: 'BanBajío' },
  '036': { code: '036', name: 'Banco Inbursa', shortName: 'Inbursa' },
  '042': { code: '042', name: 'Banca Mifel', shortName: 'Mifel' },
  '044': { code: '044', name: 'Scotiabank Inverlat', shortName: 'Scotiabank' },
  '058': { code: '058', name: 'Banco Regional (Banregio)', shortName: 'Banregio' },
  '062': { code: '062', name: 'Banca Afirme', shortName: 'Afirme' },
  '072': { code: '072', name: 'Banco Mercantil del Norte (Banorte)', shortName: 'Banorte', logoUrl: '/logos/banorte.png' },
  '127': { code: '127', name: 'Sistema de Transferencias y Pagos (STP)', shortName: 'STP' },
  '137': { code: '137', name: 'BanCoppel', shortName: 'BanCoppel', logoUrl: '/logos/bancoppel.png' },
  '138': { code: '138', name: 'Nu México Financiera', shortName: 'Nu México' },
  '140': { code: '140', name: 'Banco Compartamos', shortName: 'Compartamos' },
  '166': { code: '166', name: 'Banco del Bienestar (antes Bansefi)', shortName: 'Bienestar', logoUrl: '/logos/bansefi.png' },
  '646': { code: '646', name: 'Mercado Pago (STP / IFPE)', shortName: 'Mercado Pago' },
};

/**
 * Detecta el banco oficial según los primeros 3 dígitos de la CLABE
 */
export function detectarBancoPorCLABE(clabeDigits: string): BanxicoBankInfo | null {
  const clean = clabeDigits.replace(/\D/g, '');
  if (clean.length < 3) return null;
  const prefix = clean.slice(0, 3);
  return BANXICO_BANKS[prefix] || null;
}

/**
 * Algoritmo matemático oficial de validación de CLABE Interbancaria (18 dígitos)
 * Ponderación 3-7-1 módulo 10 según la norma técnica de Banco de México (Banxico).
 */
export function validarCLABE(clabe: string): {
  valida: boolean;
  banco?: BanxicoBankInfo;
  error?: string;
} {
  const clean = clabe.replace(/\D/g, '');

  if (clean.length === 0) {
    return { valida: false, error: 'Ingresa la CLABE de 18 dígitos' };
  }

  if (clean.length !== 18) {
    return {
      valida: false,
      error: `La CLABE debe tener exactamente 18 dígitos (actualmente tiene ${clean.length})`,
    };
  }

  const banco = detectarBancoPorCLABE(clean);

  // Ponderación oficial Banxico: 3, 7, 1 repetido para los primeros 17 dígitos
  const factores = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  let suma = 0;

  for (let i = 0; i < 17; i++) {
    const digito = parseInt(clean[i], 10);
    const producto = (digito * factores[i]) % 10;
    suma += producto;
  }

  const digitoCalculado = (10 - (suma % 10)) % 10;
  const digitoReal = parseInt(clean[17], 10);

  if (digitoCalculado !== digitoReal) {
    return {
      valida: false,
      banco: banco || undefined,
      error: 'Dígito verificador inválido (revisa si algún número está mal tecleado)',
    };
  }

  return {
    valida: true,
    banco: banco || undefined,
  };
}

/**
 * Formatea una CLABE con espacios para mejorar legibilidad ergonómica (3-3-11-1 o 4-4-4-4-2)
 */
export function formatearCLABE(raw: string): string {
  const clean = raw.replace(/\D/g, '').slice(0, 18);
  if (clean.length <= 4) return clean;
  if (clean.length <= 8) return `${clean.slice(0, 4)} ${clean.slice(4)}`;
  if (clean.length <= 12) return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8)}`;
  if (clean.length <= 16) return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)} ${clean.slice(12)}`;
  return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)} ${clean.slice(12, 16)} ${clean.slice(16, 18)}`;
}
