import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Cache the access token to prevent redundant OAuth requests
let cachedToken: { token: string; expiresAt: number } | null = null;

function getServiceAccount() {
  const serviceAccountPath = path.resolve(
    process.cwd(),
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || './config/firebase-service-account.json'
  );

  if (!fs.existsSync(serviceAccountPath)) {
    console.warn('⚠️ [Firebase] No se encontró el archivo de credenciales en:', serviceAccountPath);
    return null;
  }

  return JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
}

/**
 * Obtiene un token de acceso OAuth2 para la API REST de Google Cloud Firestore
 */
async function getAccessToken(): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.token;
  }

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) return null;

  try {
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const b64 = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url');
    const unsignedToken = `${b64(header)}.${b64(claimSet)}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(unsignedToken);
    const signature = signer.sign(serviceAccount.private_key, 'base64url');

    const jwt = `${unsignedToken}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const data = await res.json();
    if (!data.access_token) {
      console.error('❌ [Firebase OAuth Error]:', data);
      return null;
    }

    cachedToken = {
      token: data.access_token,
      expiresAt: now + (data.expires_in || 3600),
    };

    return cachedToken.token;
  } catch (err) {
    console.error('❌ [Firebase Auth Error]:', err);
    return null;
  }
}

/**
 * Convierte un objeto JavaScript estándar a formato de campos de Firestore REST
 */
function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined || val === null) continue;
    if (val instanceof Date) {
      fields[key] = { timestampValue: val.toISOString() };
    } else if (typeof val === 'string') {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
        fields[key] = { timestampValue: val.endsWith('Z') ? val : `${val}Z` };
      } else {
        fields[key] = { stringValue: val };
      }
    } else if (typeof val === 'number') {
      fields[key] = Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
    } else if (typeof val === 'boolean') {
      fields[key] = { booleanValue: val };
    } else if (Array.isArray(val)) {
      fields[key] = {
        arrayValue: {
          values: val.map((item) =>
            typeof item === 'object' ? { mapValue: { fields: toFirestoreFields(item) } } : { stringValue: String(item) }
          ),
        },
      };
    } else if (typeof val === 'object') {
      fields[key] = { mapValue: { fields: toFirestoreFields(val) } };
    }
  }
  return fields;
}

/**
 * Guarda o actualiza un usuario en la colección "users" de Cloud Firestore
 */
export async function saveUserToFirestore(user: any): Promise<boolean> {
  try {
    const serviceAccount = getServiceAccount();
    const token = await getAccessToken();
    if (!serviceAccount || !token) return false;

    const userId = user.id || `user-${Date.now()}`;
    const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/users/${userId}`;

    const fields = toFirestoreFields({
      ...user,
      updatedAt: new Date().toISOString(),
    });

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (res.ok) {
      console.log(`✅ [Firebase Cloud Firestore] Usuario guardado en tiempo real: ${user.name || user.firstName} (${userId})`);
      return true;
    } else {
      const err = await res.json();
      console.warn(`⚠️ [Firebase Firestore Warning] HTTP ${res.status}:`, err);
      return false;
    }
  } catch (error) {
    console.error('❌ [Firebase saveUser Error]:', error);
    return false;
  }
}

/**
 * Guarda un contacto en la subcolección "users/{userId}/contacts/{contactId}"
 */
export async function saveContactToFirestore(userId: string, contact: any): Promise<boolean> {
  try {
    const serviceAccount = getServiceAccount();
    const token = await getAccessToken();
    if (!serviceAccount || !token) return false;

    const contactId = contact.id || `c-${Date.now()}`;
    const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/users/${userId}/contacts/${contactId}`;

    const fields = toFirestoreFields({
      ...contact,
      updatedAt: new Date().toISOString(),
    });

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (res.ok) {
      console.log(`✅ [Firebase Cloud Firestore] Contacto guardado: ${contact.name} (${contactId})`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ [Firebase saveContact Error]:', error);
    return false;
  }
}

/**
 * Elimina un contacto de Firestore
 */
export async function deleteContactFromFirestore(userId: string, contactId: string): Promise<boolean> {
  try {
    const serviceAccount = getServiceAccount();
    const token = await getAccessToken();
    if (!serviceAccount || !token) return false;

    const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/users/${userId}/contacts/${contactId}`;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (error) {
    console.error('❌ [Firebase deleteContact Error]:', error);
    return false;
  }
}

/**
 * Guarda una transacción en la subcolección "users/{userId}/transactions/{txId}"
 */
export async function saveTransactionToFirestore(userId: string, tx: any): Promise<boolean> {
  try {
    const serviceAccount = getServiceAccount();
    const token = await getAccessToken();
    if (!serviceAccount || !token) return false;

    const txId = tx.id || `tx-${Date.now()}`;
    const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/users/${userId}/transactions/${txId}`;

    const fields = toFirestoreFields({
      ...tx,
      createdAt: new Date().toISOString(),
    });

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (res.ok) {
      console.log(`✅ [Firebase Cloud Firestore] Transacción guardada: ${txId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ [Firebase saveTransaction Error]:', error);
    return false;
  }
}

/**
 * Elimina un usuario de la colección "users" de Cloud Firestore
 */
export async function deleteUserFromFirestore(userId: string): Promise<boolean> {
  try {
    const serviceAccount = getServiceAccount();
    const token = await getAccessToken();
    if (!serviceAccount || !token) return false;

    const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/users/${userId}`;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      console.log(`🗑️ [Firebase Cloud Firestore] Usuario eliminado: ${userId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ [Firebase deleteUser Error]:', error);
    return false;
  }
}

/**
 * Elimina una transacción de la subcolección de Firestore
 */
export async function deleteTransactionFromFirestore(userId: string, txId: string): Promise<boolean> {
  try {
    const serviceAccount = getServiceAccount();
    const token = await getAccessToken();
    if (!serviceAccount || !token) return false;

    const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/users/${userId}/transactions/${txId}`;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.ok;
  } catch (error) {
    console.error('❌ [Firebase deleteTransaction Error]:', error);
    return false;
  }
}

export interface FirestoreTransferRecord {
  id?: string;
  amountMxn: number;
  amountUsd: number;
  createdAt?: string | Date;
  exchangeRate: number;
  feeUsd: number;
  recipientBank: string;
  recipientCity: string;
  recipientName: string;
  senderName: string;
  senderId?: string;
  recipientId?: string;
  recipientPhone?: string;
  status: string; // e.g. "SPEI_LIQUIDADO", "COMPLETADO"
  trackingNumber: string;
  updatedAt?: string | Date;
  type?: string; // e.g. "REMESAS_SPEI", "KIN_CASH_P2P", "BILL_PAYMENT"
  deliveryMethod?: string;
  concept?: string;
  pickupStore?: string;
  claveRetiroEfectivo?: string;
}

/**
 * Guarda una transferencia en la colección raíz "transfers" de Cloud Firestore
 * Corresponde a la vista principal del Administrador mostrada en Firebase Console
 */
export async function saveTransferToFirestore(transfer: FirestoreTransferRecord): Promise<boolean> {
  try {
    const serviceAccount = getServiceAccount();
    const token = await getAccessToken();
    if (!serviceAccount || !token) return false;

    const docId = transfer.id || `TX-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/transfers/${docId}`;

    const nowIso = new Date().toISOString();
    const payload = {
      amountMxn: Number(transfer.amountMxn) || 0,
      amountUsd: Number(transfer.amountUsd) || 0,
      createdAt: transfer.createdAt || nowIso,
      exchangeRate: Number(transfer.exchangeRate) || 20.45,
      feeUsd: Number(transfer.feeUsd) || 0,
      recipientBank: transfer.recipientBank || 'Red Banxico SPEI',
      recipientCity: transfer.recipientCity || 'México',
      recipientName: transfer.recipientName || 'Beneficiario',
      senderName: transfer.senderName || 'Usuario KIN',
      status: transfer.status || 'SPEI_LIQUIDADO',
      trackingNumber: transfer.trackingNumber || `KIN-${Date.now()}`,
      updatedAt: transfer.updatedAt || nowIso,
      ...(transfer.type && { type: transfer.type }),
      ...(transfer.senderId && { senderId: transfer.senderId }),
      ...(transfer.recipientId && { recipientId: transfer.recipientId }),
      ...(transfer.recipientPhone && { recipientPhone: transfer.recipientPhone }),
      ...(transfer.deliveryMethod && { deliveryMethod: transfer.deliveryMethod }),
      ...(transfer.concept && { concept: transfer.concept }),
    };

    const fields = toFirestoreFields(payload);

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (res.ok) {
      console.log(`✅ [Firebase Cloud Firestore] Transferencia guardada en transfers/${docId}: ${payload.senderName} ➔ ${payload.recipientName} ($${payload.amountUsd} USD)`);
      return true;
    } else {
      const err = await res.json();
      console.warn(`⚠️ [Firebase Firestore Warning transfers] HTTP ${res.status}:`, err);
      return false;
    }
  } catch (error) {
    console.error('❌ [Firebase saveTransfer Error]:', error);
    return false;
  }
}

export interface FirestoreAuditRecord {
  action: string;
  details: Record<string, any>;
  userEmailOrPhone?: string;
  createdAt?: string | Date;
  timestampIso?: string;
}

/**
 * Guarda un registro de auditoría en la colección "audit_logs" de Cloud Firestore
 */
export async function saveAuditLogToFirestore(audit: FirestoreAuditRecord): Promise<boolean> {
  try {
    const serviceAccount = getServiceAccount();
    const token = await getAccessToken();
    if (!serviceAccount || !token) return false;

    const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/audit_logs`;

    const nowIso = new Date().toISOString();
    const payload = {
      action: audit.action,
      details: audit.details,
      createdAt: audit.createdAt || nowIso,
      userEmailOrPhone: audit.userEmailOrPhone || 'app@kin-app.com',
      timestampIso: audit.timestampIso || nowIso,
    };

    const fields = toFirestoreFields(payload);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    return res.ok;
  } catch (error) {
    console.error('❌ [Firebase saveAuditLog Error]:', error);
    return false;
  }
}

