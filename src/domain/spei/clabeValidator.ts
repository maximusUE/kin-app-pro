/**
 * SPEI Banxico CLABE Validator & Bank Directory
 * Implements standard Banxico 18-digit CLABE with weighted modulo-10 algorithm.
 */

export const BANCOS_MEXICO: Record<string, { nombre: string; corto: string; logo?: string }> = {
  '002': { nombre: 'Banco Nacional de México, S.A. (Banamex)', corto: 'Banamex' },
  '012': { nombre: 'BBVA México, S.A.', corto: 'BBVA' },
  '014': { nombre: 'Banco Santander México, S.A.', corto: 'Santander' },
  '021': { nombre: 'HSBC México, S.A.', corto: 'HSBC' },
  '036': { nombre: 'Banco Inbursa, S.A.', corto: 'Inbursa' },
  '044': { nombre: 'Scotiabank Inverlat, S.A.', corto: 'Scotiabank' },
  '058': { nombre: 'Banco Regional, S.A. (Banregio)', corto: 'Banregio' },
  '072': { nombre: 'Banco Mercantil del Norte, S.A. (Banorte)', corto: 'Banorte' },
  '127': { nombre: 'Sistema de Transferencias y Pagos (STP)', corto: 'STP' },
  '137': { nombre: 'Bancoppel, S.A.', corto: 'BanCoppel' },
  '128': { nombre: 'Banco Autofin México, S.A.', corto: 'Autofin' },
  '138': { nombre: 'Nu México Financiera', corto: 'Nu México' },
  '166': { nombre: 'Banco del Bienestar, S.N.C.', corto: 'Banco del Bienestar' },
  '168': { nombre: 'Sociedad Hipotecaria Federal', corto: 'SHF' },
  '646': { nombre: 'Sistema de Transferencias y Pagos STP', corto: 'STP' },
  '659': { nombre: 'OXXO Pay / Spin by OXXO', corto: 'Spin by OXXO' },
  '670': { nombre: 'Mercado Pago Wallet México', corto: 'Mercado Pago' },
  '706': { nombre: 'Albo / Inteligencia en Finanzas', corto: 'Albo' },
  '710': { nombre: 'Klar FinTech', corto: 'Klar' },
  '130': { nombre: 'Banco Azteca, S.A.', corto: 'Banco Azteca' },
};

export interface ClabeValidationResult {
  valida: boolean;
  bancoCodigo?: string;
  bancoNombre?: string;
  bancoCorto?: string;
  error?: string;
}

export function validarCLABE(clabe: string): ClabeValidationResult {
  const cleanClabe = clabe.replace(/\s+/g, '');

  if (!/^\d{18}$/.test(cleanClabe)) {
    return {
      valida: false,
      error: 'La CLABE debe tener exactamente 18 dígitos numéricos',
    };
  }

  const bancoCodigo = cleanClabe.substring(0, 3);
  const bancoInfo = BANCOS_MEXICO[bancoCodigo];

  const factores = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  let suma = 0;

  for (let i = 0; i < 17; i++) {
    const producto = (parseInt(cleanClabe[i], 10) * factores[i]) % 10;
    suma += producto;
  }

  const digitoCalculado = (10 - (suma % 10)) % 10;
  const digitoReal = parseInt(cleanClabe[17], 10);

  if (digitoCalculado !== digitoReal) {
    return {
      valida: false,
      bancoCodigo,
      bancoNombre: bancoInfo ? bancoInfo.nombre : 'Desconocido',
      bancoCorto: bancoInfo ? bancoInfo.corto : 'Desconocido',
      error: 'El dígito de control de la CLABE no coincide (error en la captura)',
    };
  }

  return {
    valida: true,
    bancoCodigo,
    bancoNombre: bancoInfo ? bancoInfo.nombre : 'Banco Registrado en Banxico',
    bancoCorto: bancoInfo ? bancoInfo.corto : `Banco #${bancoCodigo}`,
  };
}
