import fs from 'fs';
import path from 'path';
import { validarCLABE } from '@/domain/spei/clabeValidator';
import {
  saveUserToFirestore,
  saveContactToFirestore,
  deleteContactFromFirestore,
  saveTransactionToFirestore,
} from './firebase';

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

// Default initial seed data (Clean Slate: 0 contactos ficticios, 0 transacciones ficticias)
const DEFAULT_CONTACTS: ContactRecord[] = [];

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
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    clientId: 'KIN-US-892401',
    memberSince: '19 Sep 2026',
    docType: 'Pasaporte Oficial USA',
    docNumber: '••••••••8492',
    kycTier: 'Tier 2 (Identidad Oficial Verificada)',
    dailyLimit: '$3,000.00 USD / día',
    dailyLimitUSD: 3000,
    monthlyLimitUSD: 5000,
    balanceUSD: 1000.00,
    passwordHash: 'KinVault2025$Secure',
    biometricsEnabled: true,
    pushNotificationsEnabled: true,
  },
];

const DEFAULT_TRANSACTIONS: TransactionRecord[] = [];

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
          transactions: [],
          contacts: [],
        };
        saveDatabase(inMemoryDb);
      }
      return inMemoryDb!;
    }
  } catch (err) {
    console.warn('[DB] Failed to read db file, falling back to clean data', err);
  }

  inMemoryDb = {
    users: DEFAULT_USERS,
    transactions: [],
    contacts: [],
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
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    clientId,
    memberSince: nowStr,
    docType: 'INE / Pasaporte en Trámite',
    docNumber: '••••••••0000',
    kycTier: 'Tier 1 (Básico - Onboarding)',
    dailyLimit: '$300.00 USD / día',
    dailyLimitUSD: 300,
    monthlyLimitUSD: 750,
    balanceUSD: 1000.00, // Saldo de bienvenida para pruebas inmediatas
    passwordHash: params.password || 'KinVault2025$Secure',
    biometricsEnabled: true,
    pushNotificationsEnabled: true,
  };

  db.users.push(newUser);
  saveDatabase(db);
  saveUserToFirestore(newUser).catch((e) => console.warn('[Firebase Sync User Error]', e));
  return newUser;
}

export function getUserTransactions(userId: string): TransactionRecord[] {
  const db = loadDatabase();
  return db.transactions.filter((t) => t.userId === userId);
}

export function getUserContacts(userId: string): ContactRecord[] {
  const db = loadDatabase();
  return db.contacts.filter((c) => c.userId === userId);
}

export function createContact(params: {
  userId: string;
  name: string;
  fullName?: string;
  phone?: string;
  clabe?: string;
  bank?: string;
  role?: string;
  avatar?: string;
  photoUrl?: string;
}): ContactRecord {
  const db = loadDatabase();
  const newContact: ContactRecord = {
    id: `c-${Date.now()}`,
    userId: params.userId,
    name: params.name.trim(),
    fullName: params.fullName?.trim() || params.name.trim(),
    avatar: params.avatar || '👤',
    role: params.role?.trim() || 'Beneficiario',
    country: 'Mexico',
    bank: params.bank?.trim() || 'Banco en México',
    photoUrl: params.photoUrl || '',
    clabe: params.clabe?.trim() || '',
    phone: params.phone?.trim() || '',
  };

  db.contacts.unshift(newContact);
  saveDatabase(db);
  saveContactToFirestore(params.userId, newContact).catch((e) => console.warn('[Firebase Sync Contact Error]', e));
  return newContact;
}

export function deleteContact(userId: string, contactId: string): boolean {
  const db = loadDatabase();
  const initialLength = db.contacts.length;
  db.contacts = db.contacts.filter((c) => !(c.userId === userId && c.id === contactId));
  if (db.contacts.length !== initialLength) {
    saveDatabase(db);
    deleteContactFromFirestore(userId, contactId).catch((e) => console.warn('[Firebase Sync Delete Contact Error]', e));
    return true;
  }
  return false;
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
  saveTransactionToFirestore(params.userId, tx).catch((e) => console.warn('[Firebase Sync Tx Error]', e));

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
  saveTransactionToFirestore(params.userId, tx).catch((e) => console.warn('[Firebase Sync Tx Error]', e));

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
  saveTransactionToFirestore(params.userId, tx).catch((e) => console.warn('[Firebase Sync Tx Error]', e));

  return { success: true, transaction: tx };
}
