import fs from 'fs';
import path from 'path';
import { validarCLABE } from '@/domain/spei/clabeValidator';

export const USD_TO_MXN_RATE = 20.45;

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  avatar: string;
  clientId: string;
  memberSince: string;
  docType: string;
  docNumber: string;
  kycTier: string;
  dailyLimit: string;
  dailyLimitUSD: number;
  monthlyLimitUSD: number;
  balanceUSD: number;
  passwordHash?: string;
  biometricsEnabled: boolean;
  pushNotificationsEnabled: boolean;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  title: string;
  category: string;
  time: string;
  dateGroup: 'Hoy' | 'Ayer' | 'Esta semana' | 'Anterior';
  amount: number; // Negative for expense, positive for income
  amountMXN: number;
  type: 'expense' | 'income';
  iconType: 'send' | 'luz' | 'internet' | 'phone' | 'bill' | 'wallet' | 'bank';
  status: 'Completado' | 'En Proceso' | 'Pendiente' | 'Fallido';
  refNumber: string;
  claveRastreoBanxico?: string;
  bancoDestino?: string;
  cuentaBeneficiario?: string;
  nombreBeneficiario?: string;
  satFolioFiscalUuid?: string;
  createdAt: string;
}

export interface ContactRecord {
  id: string;
  userId: string;
  name: string;
  fullName: string;
  avatar: string;
  role: string;
  country: string;
  bank: string;
  photoUrl: string;
  clabe?: string;
  phone?: string;
}

interface DatabaseSchema {
  users: UserProfile[];
  transactions: TransactionRecord[];
  contacts: ContactRecord[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'kin_db.json');

// Default initial seed data
const DEFAULT_CONTACTS: ContactRecord[] = [
  {
    id: 'c-1',
    userId: 'user-001',
    name: 'Mamá Rosa',
    fullName: 'Rosa Urrutia Eligio',
    avatar: '👵🏼',
    role: 'Madre',
    country: 'Mexico',
    bank: 'BBVA Bancomer',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfWoyqADTVEY7wzVYvA5Am2cRLe9UqqlxItL5rRfyOfGOgaZvRD_Vy83WhbHwKpWcy9_NfrGKHsxjFy9Kwj6hC63A19nmfzA5uAUSVR77E85NpgSYMWb0BHfU2lK8kjhl2n4SMty-l71mKGgBP0PoDX7Qjsvhx16YJABIAQIKqPf3YBwRG9U3aE-4C7wVebP_s2LOjcyoPJzBF-vCsf77mTiwvVcp9ge47WoxxWEE-sGtM1L-9vcwy',
    clabe: '012180004455829104',
    phone: '+52 33 1948 2019',
  },
  {
    id: 'c-2',
    userId: 'user-001',
    name: 'Carlos M.',
    fullName: 'Carlos Mendoza Ramos',
    avatar: '👨🏻',
    role: 'Hermano',
    country: 'Mexico',
    bank: 'BanCoppel',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnEWVM8pkwawuEjRXXK5AIPh_yinAPMMpV9kIcTdgToBOlYJ5pCjU2IQ9cHNzvE4kjoWKI3i-cV4g34FSXVCXpj1EoS885IuMRkpcH88TwbmG_1gCLAesV9s96VY_Y079DOXS2uaqfD2kBhZk-y699KkIIYLAECB9ps8V0vsWEyIvAJndsa4OQ245xdq7VM8Fk83ZrWrmmZkCKvyskZcefEHq1SKiefseEFfZ1iI3okObu0mDOVPOO',
    clabe: '137180102948201923',
    phone: '+52 81 8392 0192',
  },
  {
    id: 'c-3',
    userId: 'user-001',
    name: 'Sofia R.',
    fullName: 'Sofia Ramos Eligio',
    avatar: '👩🏻',
    role: 'Hermana',
    country: 'Mexico',
    bank: 'Banco Azteca',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4Z_rr1KAC4c0PCx9Rbflq6njX2wPQpJMsH9rFm7-kA9EgJzmJL4zNUr3nCPLHqoYoYE_vdejqgmYHmS58f121a_y3AlNJ9jhq1hhVNxWEZvJk4H6wBY-OYf4uufwjqs79uEPh_8sUe_IBdww7sX4BZkFEuUTg5Qh1eaz_93J_Uh3kzZ0-IH8EKAk7eU_E1c20U3A79oJ-DBQq7j_4jKqSWJ39DmDB0hi2bI3PYjTpQaFtXKHW1fsW',
    clabe: '127180001092837482',
    phone: '+52 55 4920 1823',
  },
];

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-001',
    firstName: 'César',
    lastName: 'Urrutia',
    name: 'César U.',
    email: 'cesar.urrutia@gmail.com',
    phone: '+1 (555) 349-2810',
    city: 'Los Ángeles',
    state: 'California',
    zip: '90210',
    country: 'Estados Unidos 🇺🇸',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnEWVM8pkwawuEjRXXK5AIPh_yinAPMMpV9kIcTdgToBOlYJ5pCjU2IQ9cHNzvE4kjoWKI3i-cV4g34FSXVCXpj1EoS885IuMRkpcH88TwbmG_1gCLAesV9s96VY_Y079DOXS2uaqfD2kBhZk-y699KkIIYLAECB9ps8V0vsWEyIvAJndsa4OQ245xdq7VM8Fk83ZrWrmmZkCKvyskZcefEHq1SKiefseEFfZ1iI3okObu0mDOVPOO',
    clientId: 'KIN-US-892401',
    memberSince: '14 Sep 2024',
    docType: 'Pasaporte Oficial USA',
    docNumber: '••••••••8492',
    kycTier: 'Tier 2 (Identidad Oficial Verificada)',
    dailyLimit: '$3,000.00 USD / día',
    dailyLimitUSD: 3000,
    monthlyLimitUSD: 5000,
    balanceUSD: 2450.00,
    passwordHash: 'KinVault2025$Secure',
    biometricsEnabled: true,
    pushNotificationsEnabled: true,
  },
];

const DEFAULT_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-001',
    userId: 'user-001',
    title: 'Mamá Rosa (Guadalajara)',
    category: 'OXXO Cash Pickup',
    time: 'Hace 12 mins',
    dateGroup: 'Hoy',
    amount: -250.00,
    amountMXN: 5112.50,
    type: 'expense',
    iconType: 'send',
    status: 'Completado',
    refNumber: 'OXXO-948210',
    claveRastreoBanxico: 'KIN2026091919100094821000',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx-002',
    userId: 'user-001',
    title: 'CFE Electric (Monterrey)',
    category: 'Pago de Servicio',
    time: 'Hoy 8:15 AM',
    dateGroup: 'Hoy',
    amount: -48.20,
    amountMXN: 985.69,
    type: 'expense',
    iconType: 'luz',
    status: 'Completado',
    refNumber: 'CFE-382910',
    satFolioFiscalUuid: '8F9B2C4D-E5A1-42C9-8F7B-9E3A1D0F8C2E',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tx-003',
    userId: 'user-001',
    title: 'Kin Cash from Javier Ruiz',
    category: 'Instant P2P',
    time: 'Ayer',
    dateGroup: 'Ayer',
    amount: 75.00,
    amountMXN: 1533.75,
    type: 'income',
    iconType: 'wallet',
    status: 'Completado',
    refNumber: 'KIN-552194',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tx-004',
    userId: 'user-001',
    title: 'Payroll Deposit (Austin Tech)',
    category: 'ACH Direct Deposit',
    time: 'Hace 3 días',
    dateGroup: 'Esta semana',
    amount: 1850.00,
    amountMXN: 37832.50,
    type: 'income',
    iconType: 'bank',
    status: 'Completado',
    refNumber: 'ACH-881023',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
];

// In-Memory cache
let inMemoryDb: DatabaseSchema | null = null;

function loadDatabase(): DatabaseSchema {
  if (inMemoryDb) return inMemoryDb;

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      inMemoryDb = JSON.parse(raw);
      if (!inMemoryDb?.users) {
        inMemoryDb = {
          users: DEFAULT_USERS,
          transactions: DEFAULT_TRANSACTIONS,
          contacts: DEFAULT_CONTACTS,
        };
        saveDatabase(inMemoryDb);
      }
      return inMemoryDb!;
    }
  } catch (err) {
    console.warn('[DB] Failed to read db file, falling back to initial data', err);
  }

  inMemoryDb = {
    users: DEFAULT_USERS,
    transactions: DEFAULT_TRANSACTIONS,
    contacts: DEFAULT_CONTACTS,
  };
  saveDatabase(inMemoryDb);
  return inMemoryDb;
}

function saveDatabase(db: DatabaseSchema) {
  inMemoryDb = db;
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to persist db file', err);
  }
}

// ----------------------------------------------------------------------------
// Public Core Banking & Auth Operations
// ----------------------------------------------------------------------------

export function findUserByEmailOrPhone(identifier: string): UserProfile | undefined {
  const db = loadDatabase();
  const clean = identifier.trim().toLowerCase();
  return db.users.find(
    (u) => u.email.toLowerCase() === clean || u.phone.replace(/\D/g, '') === clean.replace(/\D/g, '')
  );
}

export function findUserById(id: string): UserProfile | undefined {
  const db = loadDatabase();
  return db.users.find((u) => u.id === id);
}

export function registerNewUser(params: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
}): UserProfile {
  const db = loadDatabase();
  const existing = findUserByEmailOrPhone(params.email) || findUserByEmailOrPhone(params.phone);
  if (existing) {
    return existing;
  }

  const shortName = `${params.firstName.trim()} ${params.lastName.trim() ? params.lastName.trim()[0] + '.' : ''}`.trim();
  const newId = `user-${Date.now()}`;
  const clientId = `KIN-US-${Math.floor(100000 + Math.random() * 900000)}`;
  const nowStr = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

  const newUser: UserProfile = {
    id: newId,
    firstName: params.firstName.trim(),
    lastName: params.lastName.trim(),
    name: shortName,
    email: params.email.trim().toLowerCase(),
    phone: params.phone.trim(),
    city: 'San Antonio',
    state: 'Texas',
    zip: '78201',
    country: 'Estados Unidos 🇺🇸',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnEWVM8pkwawuEjRXXK5AIPh_yinAPMMpV9kIcTdgToBOlYJ5pCjU2IQ9cHNzvE4kjoWKI3i-cV4g34FSXVCXpj1EoS885IuMRkpcH88TwbmG_1gCLAesV9s96VY_Y079DOXS2uaqfD2kBhZk-y699KkIIYLAECB9ps8V0vsWEyIvAJndsa4OQ245xdq7VM8Fk83ZrWrmmZkCKvyskZcefEHq1SKiefseEFfZ1iI3okObu0mDOVPOO',
    clientId,
    memberSince: nowStr,
    docType: 'INE / Pasaporte en Trámite',
    docNumber: '••••••••0000',
    kycTier: 'Tier 1 (Básico - Onboarding)',
    dailyLimit: '$300.00 USD / día',
    dailyLimitUSD: 300,
    monthlyLimitUSD: 750,
    balanceUSD: 1000.00, // Bono de bienvenida para pruebas inmediatas del usuario
    passwordHash: params.password || 'KinVault2025$Secure',
    biometricsEnabled: true,
    pushNotificationsEnabled: true,
  };

  db.users.push(newUser);

  // Bienvenida en ledger
  const welcomeTx: TransactionRecord = {
    id: `tx-wel-${Date.now()}`,
    userId: newId,
    title: 'Bono de Bienvenida KIN',
    category: 'Depósito Inicial de Prueba',
    time: 'Hoy',
    dateGroup: 'Hoy',
    amount: 1000.00,
    amountMXN: 20450.00,
    type: 'income',
    iconType: 'wallet',
    status: 'Completado',
    refNumber: 'WEL-KIN-001',
    createdAt: new Date().toISOString(),
  };

  db.transactions.unshift(welcomeTx);

  // Contactos base para el nuevo usuario
  const userContacts: ContactRecord[] = DEFAULT_CONTACTS.map((c, idx) => ({
    ...c,
    id: `c-${newId}-${idx}`,
    userId: newId,
  }));
  db.contacts.push(...userContacts);

  saveDatabase(db);
  return newUser;
}

export function getUserTransactions(userId: string): TransactionRecord[] {
  const db = loadDatabase();
  return db.transactions.filter((t) => t.userId === userId || t.userId === 'user-001');
}

export function getUserContacts(userId: string): ContactRecord[] {
  const db = loadDatabase();
  const contacts = db.contacts.filter((c) => c.userId === userId);
  return contacts.length > 0 ? contacts : DEFAULT_CONTACTS;
}

/**
 * Banxico SPEI Transfer Engine
 */
export function executeSpeiTransfer(params: {
  userId: string;
  clabe: string;
  recipientName: string;
  amountUSD: number;
  deliveryMethod?: 'cash' | 'bank' | 'wallet';
  pickupStore?: string;
  concept?: string;
}): { success: boolean; transaction?: TransactionRecord; error?: string } {
  const db = loadDatabase();
  const user = findUserById(params.userId) || db.users[0];

  if (!user) {
    return { success: false, error: 'Usuario no encontrado' };
  }

  // Verificar Fondos
  if (user.balanceUSD < params.amountUSD) {
    return {
      success: false,
      error: `Saldo insuficiente. Saldo disponible: $${user.balanceUSD.toFixed(2)} USD`,
    };
  }

  // Verificar Límites AML Tier
  if (params.amountUSD > user.dailyLimitUSD) {
    return {
      success: false,
      error: `El monto excede el límite diario permitido (${user.dailyLimit}) para tu nivel ${user.kycTier}`,
    };
  }

  // Si es transferencia bancaria directa, validar CLABE Banxico
  let bancoNombre = 'Red Banxico SPEI';
  if (params.deliveryMethod === 'bank' || !params.deliveryMethod) {
    if (params.clabe && params.clabe.length === 18) {
      const validation = validarCLABE(params.clabe);
      if (!validation.valida) {
        return { success: false, error: validation.error || 'CLABE inválida según estándar Banxico' };
      }
      bancoNombre = validation.bancoNombre || 'Banco Registrado en Banxico';
    }
  }

  // Generar Clave de Rastreo Banxico oficial de 24 caracteres alfanuméricos
  const timestampIso = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const claveRastreoBanxico = `KIN${timestampIso}${randomSuffix}`.padEnd(24, '0').slice(0, 24);

  const amountMXN = +(params.amountUSD * USD_TO_MXN_RATE).toFixed(2);
  const txId = `SPEI-${Math.floor(100000 + Math.random() * 900000)}`;

  // Descontar saldo
  user.balanceUSD = +(user.balanceUSD - params.amountUSD).toFixed(2);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const tx: TransactionRecord = {
    id: `tx-${Date.now()}`,
    userId: user.id,
    title: `${params.recipientName} (${params.pickupStore ? params.pickupStore.toUpperCase() : bancoNombre})`,
    category: params.pickupStore ? `${params.pickupStore} Cash Pickup` : 'SPEI Banxico Inmediato',
    time: `Hoy, ${timeStr}`,
    dateGroup: 'Hoy',
    amount: -params.amountUSD,
    amountMXN,
    type: 'expense',
    iconType: 'send',
    status: 'Completado',
    refNumber: txId,
    claveRastreoBanxico,
    bancoDestino: bancoNombre,
    cuentaBeneficiario: params.clabe,
    nombreBeneficiario: params.recipientName,
    createdAt: now.toISOString(),
  };

  db.transactions.unshift(tx);
  saveDatabase(db);

  return { success: true, transaction: tx };
}

/**
 * Mexican Bill Pay Engine (CFE, Telmex, Naturgy, etc.)
 */
export function executeBillPayment(params: {
  userId: string;
  serviceId: string;
  serviceName: string;
  referenceNumber: string;
  amountMXN: number;
}): { success: boolean; transaction?: TransactionRecord; error?: string } {
  const db = loadDatabase();
  const user = findUserById(params.userId) || db.users[0];

  if (!user) {
    return { success: false, error: 'Usuario no encontrado' };
  }

  const amountUSD = +(params.amountMXN / USD_TO_MXN_RATE).toFixed(2);

  if (user.balanceUSD < amountUSD) {
    return {
      success: false,
      error: `Saldo insuficiente para pagar factura. Requiere $${amountUSD} USD. Saldo disponible: $${user.balanceUSD.toFixed(2)} USD`,
    };
  }

  // Generar Folio Fiscal SAT CFDI 4.0 UUID simulado oficial
  const uuid = 'CFDI-' + [
    Math.random().toString(16).substring(2, 10),
    Math.random().toString(16).substring(2, 6),
    '4' + Math.random().toString(16).substring(2, 5),
    Math.random().toString(16).substring(2, 6),
    Math.random().toString(16).substring(2, 14),
  ].join('-').toUpperCase();

  user.balanceUSD = +(user.balanceUSD - amountUSD).toFixed(2);

  let iconType: 'luz' | 'internet' | 'phone' | 'bill' = 'bill';
  const lower = (params.serviceName || params.serviceId).toLowerCase();
  if (lower.includes('luz') || lower.includes('cfe') || lower.includes('electric')) iconType = 'luz';
  else if (lower.includes('internet') || lower.includes('totalplay') || lower.includes('telmex')) iconType = 'internet';
  else if (lower.includes('celular') || lower.includes('recarga') || lower.includes('telcel')) iconType = 'phone';

  const tx: TransactionRecord = {
    id: `tx-bill-${Date.now()}`,
    userId: user.id,
    title: `Pago de ${params.serviceName}`,
    category: 'Servicio en México (CFDI 4.0)',
    time: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dateGroup: 'Hoy',
    amount: -amountUSD,
    amountMXN: params.amountMXN,
    type: 'expense',
    iconType,
    status: 'Completado',
    refNumber: params.referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    satFolioFiscalUuid: uuid,
    createdAt: new Date().toISOString(),
  };

  db.transactions.unshift(tx);
  saveDatabase(db);

  return { success: true, transaction: tx };
}

/**
 * KIN Cash Instant P2P Engine
 */
export function executeKinCashSend(params: {
  userId: string;
  recipientName: string;
  amountUSD: number;
  concept?: string;
}): { success: boolean; transaction?: TransactionRecord; error?: string } {
  const db = loadDatabase();
  const user = findUserById(params.userId) || db.users[0];

  if (!user) {
    return { success: false, error: 'Usuario no encontrado' };
  }

  if (user.balanceUSD < params.amountUSD) {
    return {
      success: false,
      error: `Saldo insuficiente. Saldo disponible: $${user.balanceUSD.toFixed(2)} USD`,
    };
  }

  user.balanceUSD = +(user.balanceUSD - params.amountUSD).toFixed(2);

  const amountMXN = +(params.amountUSD * USD_TO_MXN_RATE).toFixed(2);
  const tx: TransactionRecord = {
    id: `tx-kin-${Date.now()}`,
    userId: user.id,
    title: `KIN Cash para ${params.recipientName}`,
    category: 'Recarga / SPEI P2P Inmediato',
    time: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dateGroup: 'Hoy',
    amount: -params.amountUSD,
    amountMXN,
    type: 'expense',
    iconType: 'wallet',
    status: 'Completado',
    refNumber: `KIN-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
  };

  db.transactions.unshift(tx);
  saveDatabase(db);

  return { success: true, transaction: tx };
}
