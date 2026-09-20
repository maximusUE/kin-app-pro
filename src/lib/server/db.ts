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
  // Campos de domicilio estructurado (Regulación AML/CNBV & Banxico para remesas)
  street?: string;       // calle
  houseNumber?: string;  // número de casa/exterior
  state?: string;        // estado
  zipCode?: string;      // código postal
  isFamily?: boolean;    // red familiar KIN
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

export const LEGACY_ID_MAP: Record<string, string> = {
  'user-1789863039309': 'user_jose_eligio',
  'user-1789925173232': 'user_maricela_fernandez',
  'user-1789928316890': 'user_jaime_gutierrez',
  'user-1789928551412': 'user_manuel_gomez',
};
export const USER_FALLBACK_MAP = LEGACY_ID_MAP;

export function findUserById(id: string): UserProfile | undefined {
  const db = loadDatabase();
  const effectiveId = LEGACY_ID_MAP[id] || id;
  return db.users.find((u) => u.id === effectiveId || u.id === id);
}

/**
 * Resolver un usuario destinatario dentro de la red KIN por ID, teléfono o nombre
 */
export function findRecipientUser(identifier?: string, phone?: string): UserProfile | undefined {
  if (!identifier && !phone) return undefined;
  const db = loadDatabase();

  const cleanId = (identifier || '')
    .trim()
    .replace(/^fam-/, '')
    .toLowerCase();

  const effectiveId = LEGACY_ID_MAP[cleanId] || cleanId;

  // 1. Buscar por ID directo o mapeado
  const byId = db.users.find(
    (u) =>
      u.id.toLowerCase() === effectiveId ||
      u.id.toLowerCase() === cleanId ||
      (LEGACY_ID_MAP[u.id] && LEGACY_ID_MAP[u.id].toLowerCase() === cleanId)
  );
  if (byId) return byId;

  // 2. Buscar por teléfono (comparando los últimos 8-10 dígitos limpios)
  const cleanPhoneInput = (phone || identifier || '').replace(/\D/g, '');
  if (cleanPhoneInput.length >= 7) {
    const byPhone = db.users.find((u) => {
      const userPhoneDigits = u.phone.replace(/\D/g, '');
      return (
        userPhoneDigits.endsWith(cleanPhoneInput) ||
        cleanPhoneInput.endsWith(userPhoneDigits)
      );
    });
    if (byPhone) return byPhone;
  }

  // 3. Buscar por Nombre Completo (removiendo sufijos como " (Familiar KIN)", " (Beneficiario)", etc.)
  if (identifier) {
    const cleanName = identifier
      .replace(/\s*\([^)]*\)/g, '')
      .trim()
      .toLowerCase();

    if (cleanName.length >= 3) {
      const byName = db.users.find((u) => {
        const uFullName = `${u.firstName} ${u.lastName}`.trim().toLowerCase();
        const uName = u.name.trim().toLowerCase();
        return (
          uFullName === cleanName ||
          uName === cleanName ||
          cleanName.includes(uFullName) ||
          uFullName.includes(cleanName)
        );
      });
      if (byName) return byName;
    }
  }

  return undefined;
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
  
  // Generar ID con el nombre del cliente (ej: user_sofia_mendoza, user_jose_eligio)
  const sanitize = (val: string) =>
    val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

  const firstSlug = sanitize(params.firstName.trim());
  const lastSlug = sanitize(params.lastName.trim());
  const baseId = lastSlug ? `user_${firstSlug}_${lastSlug}` : `user_${firstSlug}`;

  let newId = baseId || `user_${Date.now()}`;
  let counter = 2;
  while (db.users.some((u) => u.id === newId)) {
    newId = `${baseId}_${counter}`;
    counter++;
  }

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
    avatar: '', // Nuevo cliente inicia sin foto de perfil (recuadro vacío)
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

export function updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
  const db = loadDatabase();
  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  db.users[idx] = {
    ...db.users[idx],
    ...updates,
  };
  saveDatabase(db);
  saveUserToFirestore(db.users[idx]).catch((e) => console.warn('[Firebase Sync User Error]', e));
  return db.users[idx];
}

export function getUserTransactions(userId: string): TransactionRecord[] {
  const db = loadDatabase();
  return db.transactions.filter((t) => t.userId === userId);
}

export function getUserContacts(userId: string): ContactRecord[] {
  const db = loadDatabase();
  const canonicalId = USER_FALLBACK_MAP[userId] || userId;
  return db.contacts.filter((c) => c.userId === canonicalId || c.userId === userId);
}

/**
 * Red de Familiares KIN registrados en el ecosistema
 */
export function getFamilyNetwork(excludeUserId?: string): ContactRecord[] {
  const db = loadDatabase();
  const canonicalExclude = excludeUserId ? (USER_FALLBACK_MAP[excludeUserId] || excludeUserId) : '';

  return db.users
    .filter((u) => u.id !== canonicalExclude && (USER_FALLBACK_MAP[u.id] || u.id) !== canonicalExclude)
    .map((u) => {
      const isMex = u.country.toLowerCase().includes('mex') || u.phone.startsWith('+52') || u.phone.startsWith('01152');
      return {
        id: `fam-${u.id}`,
        userId: canonicalExclude || 'user-001',
        name: `${u.firstName} ${u.lastName}`.trim(),
        fullName: `${u.firstName} ${u.lastName}`.trim(),
        avatar: u.avatar ? '' : '👨‍👩‍👧‍👦',
        role: 'Familiar KIN',
        country: isMex ? 'Mexico' : 'Estados Unidos',
        bank: isMex ? 'BBVA México' : 'Red Banxico SPEI',
        photoUrl: u.avatar || '',
        phone: u.phone || '',
        street: u.city ? `Av. Juárez, ${u.city}` : 'Av. Reforma',
        houseNumber: '104',
        state: u.state || 'San Antonio',
        zipCode: u.zip || '78201',
        isFamily: true,
      };
    });
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
  street?: string;
  houseNumber?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}): ContactRecord {
  const db = loadDatabase();
  const canonicalUserId = USER_FALLBACK_MAP[params.userId] || params.userId;
  const newContact: ContactRecord = {
    id: `c-${Date.now()}`,
    userId: canonicalUserId,
    name: params.name.trim(),
    fullName: params.fullName?.trim() || params.name.trim(),
    avatar: params.avatar || '👤',
    role: params.role?.trim() || 'Beneficiario directo',
    country: params.country?.trim() || 'Mexico',
    bank: params.bank?.trim() || 'Banco en México',
    photoUrl: params.photoUrl || '',
    clabe: params.clabe?.trim() || '',
    phone: params.phone?.trim() || '',
    street: params.street?.trim() || '',
    houseNumber: params.houseNumber?.trim() || '',
    state: params.state?.trim() || '',
    zipCode: params.zipCode?.trim() || '',
  };

  db.contacts.unshift(newContact);
  saveDatabase(db);
  saveContactToFirestore(canonicalUserId, newContact).catch((e) => console.warn('[Firebase Sync Contact Error]', e));
  return newContact;
}

/**
 * Validador estricto para Envíos USA -> México (Cumplimiento Regulatorio CNBV / Banxico)
 */
export function validateRemittanceRecipient(data: {
  name?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}): { valid: boolean; missingFields: string[]; errors: Record<string, string> } {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    missingFields.push('name');
    errors.name = 'El nombre del beneficiario es obligatorio';
  }
  if (!data.phone || !data.phone.trim()) {
    missingFields.push('phone');
    errors.phone = 'El número de teléfono es obligatorio';
  }
  if (!data.street || !data.street.trim()) {
    missingFields.push('street');
    errors.street = 'La calle es obligatoria para envíos a México';
  }
  if (!data.houseNumber || !data.houseNumber.trim()) {
    missingFields.push('houseNumber');
    errors.houseNumber = 'El número de casa o exterior es obligatorio';
  }
  if (!data.state || !data.state.trim()) {
    missingFields.push('state');
    errors.state = 'El estado o entidad federativa es obligatorio';
  }
  if (!data.country || !data.country.trim()) {
    missingFields.push('country');
    errors.country = 'El país destino es obligatorio';
  }
  if (!data.zipCode || !data.zipCode.trim()) {
    missingFields.push('zipCode');
    errors.zipCode = 'El código postal es obligatorio';
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
    errors,
  };
}

/**
 * Validador para KIN Cash P2P (Nombre y Teléfono requeridos)
 */
export function validateKinCashRecipient(data: {
  name?: string;
  phone?: string;
}): { valid: boolean; missingFields: string[]; errors: Record<string, string> } {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    missingFields.push('name');
    errors.name = 'El nombre del destinatario es obligatorio';
  }
  if (!data.phone || !data.phone.trim()) {
    missingFields.push('phone');
    errors.phone = 'El teléfono celular es obligatorio';
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
    errors,
  };
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
  recipientId?: string;
  recipientPhone?: string;
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

  // Descontar saldo al emisor
  user.balanceUSD = +(user.balanceUSD - params.amountUSD).toFixed(2);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Transacción de egreso para el emisor
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

  // DOBLE PARTIDA: Buscar si el beneficiario es un cliente / familiar registrado en la red KIN
  const recipientUser = findRecipientUser(params.recipientId || params.recipientName, params.recipientPhone);
  if (recipientUser && recipientUser.id !== user.id) {
    // 1. Acreditar saldo en la cuenta del destinatario
    recipientUser.balanceUSD = +(recipientUser.balanceUSD + params.amountUSD).toFixed(2);

    // 2. Registrar transacción de ingreso (income) para el destinatario
    const recipientTx: TransactionRecord = {
      id: `tx-in-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: recipientUser.id,
      title: `Remesa SPEI de ${user.firstName} ${user.lastName}`.trim(),
      category: 'SPEI Banxico Inmediato',
      time: `Hoy, ${timeStr}`,
      dateGroup: 'Hoy',
      amount: params.amountUSD, // Positivo para ingreso
      amountMXN,
      type: 'income',
      iconType: 'send',
      status: 'Completado',
      refNumber: txId,
      claveRastreoBanxico,
      bancoDestino: recipientUser.country.toLowerCase().includes('mex') ? 'BBVA México' : 'Red Banxico SPEI',
      cuentaBeneficiario: params.clabe,
      nombreBeneficiario: `${recipientUser.firstName} ${recipientUser.lastName}`.trim(),
      createdAt: now.toISOString(),
    };

    db.transactions.unshift(recipientTx);

    // 3. Sincronizar usuario y transacción del destinatario a Firestore
    saveTransactionToFirestore(recipientUser.id, recipientTx).catch((e) => console.warn('[Firebase Sync Rx Tx Error]', e));
    saveUserToFirestore(recipientUser).catch((e) => console.warn('[Firebase Sync Rx User Error]', e));
  }

  saveDatabase(db);
  saveTransactionToFirestore(params.userId, tx).catch((e) => console.warn('[Firebase Sync Tx Error]', e));
  saveUserToFirestore(user).catch((e) => console.warn('[Firebase Sync User Error]', e));

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
      error: `Saldo insuficiente. Requiere $${amountUSD} USD, saldo disponible: $${user.balanceUSD.toFixed(2)} USD`,
    };
  }

  user.balanceUSD = +(user.balanceUSD - amountUSD).toFixed(2);

  const uuid = `SAT-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  let iconType: TransactionRecord['iconType'] = 'bill';
  const lower = params.serviceName.toLowerCase();
  if (lower.includes('cfe') || lower.includes('luz')) iconType = 'luz';
  else if (lower.includes('internet') || lower.includes('telmex') || lower.includes('totalplay')) iconType = 'internet';
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
  saveUserToFirestore(user).catch((e) => console.warn('[Firebase Sync User Error]', e));

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
  recipientId?: string;
  recipientPhone?: string;
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
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const txId = `KIN-${Math.floor(100000 + Math.random() * 900000)}`;

  const tx: TransactionRecord = {
    id: `tx-kin-${Date.now()}`,
    userId: user.id,
    title: `KIN Cash para ${params.recipientName}`,
    category: 'Recarga / SPEI P2P Inmediato',
    time: `Hoy, ${timeStr}`,
    dateGroup: 'Hoy',
    amount: -params.amountUSD,
    amountMXN,
    type: 'expense',
    iconType: 'wallet',
    status: 'Completado',
    refNumber: txId,
    createdAt: now.toISOString(),
  };

  db.transactions.unshift(tx);

  // DOBLE PARTIDA: Si el destinatario es un cliente / familiar KIN registrado, acreditar saldo y registrar transacción de ingreso
  const recipientUser = findRecipientUser(params.recipientId || params.recipientName, params.recipientPhone);
  if (recipientUser && recipientUser.id !== user.id) {
    // 1. Acreditar saldo en la cuenta del destinatario
    recipientUser.balanceUSD = +(recipientUser.balanceUSD + params.amountUSD).toFixed(2);

    // 2. Registrar transacción de ingreso (income) para el destinatario
    const recipientTx: TransactionRecord = {
      id: `tx-kin-in-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: recipientUser.id,
      title: `KIN Cash de ${user.firstName} ${user.lastName}`.trim(),
      category: 'Recarga / SPEI P2P Inmediato',
      time: `Hoy, ${timeStr}`,
      dateGroup: 'Hoy',
      amount: params.amountUSD, // Positivo para ingreso
      amountMXN,
      type: 'income',
      iconType: 'wallet',
      status: 'Completado',
      refNumber: txId,
      createdAt: now.toISOString(),
    };

    db.transactions.unshift(recipientTx);

    // 3. Sincronizar usuario y transacción del destinatario a Firestore
    saveTransactionToFirestore(recipientUser.id, recipientTx).catch((e) => console.warn('[Firebase Sync Rx Tx Error]', e));
    saveUserToFirestore(recipientUser).catch((e) => console.warn('[Firebase Sync Rx User Error]', e));
  }

  saveDatabase(db);
  saveTransactionToFirestore(params.userId, tx).catch((e) => console.warn('[Firebase Sync Tx Error]', e));
  saveUserToFirestore(user).catch((e) => console.warn('[Firebase Sync User Error]', e));

  return { success: true, transaction: tx };
}
