import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  saveUserToFirestore,
  deleteUserFromFirestore,
  saveContactToFirestore,
  deleteContactFromFirestore,
  saveTransactionToFirestore,
  deleteTransactionFromFirestore,
} from '@/lib/server/firebase';

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'kin_db.json');

const ID_MAP: Record<string, string> = {
  'user-1789863039309': 'user_jose_eligio',
  'user-1789925173232': 'user_maricela_fernandez',
  'user-1789928316890': 'user_jaime_gutierrez',
  'user-1789928551412': 'user_manuel_gomez',
};

export async function POST() {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      return NextResponse.json({ success: false, error: 'kin_db.json not found' }, { status: 404 });
    }

    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const db = JSON.parse(raw);

    const migratedUsers: any[] = [];
    const deleteOldIds = ['user-1789863039309', 'user-1789925173232', 'user-1789928316890', 'user-1789928551412', 'user-1789926000353'];

    // 1. Actualizar usuarios en memoria
    for (const u of db.users) {
      if (ID_MAP[u.id]) {
        const oldId = u.id;
        const newId = ID_MAP[oldId];
        u.id = newId;
        migratedUsers.push({ oldId, newId, name: `${u.firstName} ${u.lastName}` });
      }
    }

    // Remover usuario de prueba Carlos
    db.users = db.users.filter((u: any) => u.id !== 'user-1789926000353');

    // 2. Actualizar foreign keys en transactions y contacts
    for (const tx of db.transactions || []) {
      if (ID_MAP[tx.userId]) {
        tx.userId = ID_MAP[tx.userId];
      }
    }

    for (const c of db.contacts || []) {
      if (ID_MAP[c.userId]) {
        c.userId = ID_MAP[c.userId];
      }
    }

    // 3. Persistir cambios en data/kin_db.json
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');

    // 4. Sincronizar y renombrar en Cloud Firestore
    const firestoreResults: any[] = [];

    // Subir cada usuario con su nuevo ID con nombre
    for (const u of db.users) {
      if (u.id.startsWith('user_')) {
        const ok = await saveUserToFirestore(u);
        firestoreResults.push({ action: 'create', id: u.id, success: ok });
      }
    }

    // Subir contactos y transacciones asociados al nuevo ID de José Eligio
    const joseContacts = (db.contacts || []).filter((c: any) => c.userId === 'user_jose_eligio');
    for (const c of joseContacts) {
      await saveContactToFirestore('user_jose_eligio', c);
      await deleteContactFromFirestore('user-1789863039309', c.id);
    }

    const joseTransactions = (db.transactions || []).filter((t: any) => t.userId === 'user_jose_eligio');
    for (const t of joseTransactions) {
      await saveTransactionToFirestore('user_jose_eligio', t);
      await deleteTransactionFromFirestore('user-1789863039309', t.id);
    }

    // Eliminar documentos con IDs viejos numéricos en Firestore
    for (const oldId of deleteOldIds) {
      const delOk = await deleteUserFromFirestore(oldId);
      firestoreResults.push({ action: 'delete_old', id: oldId, success: delOk });
    }

    return NextResponse.json({
      success: true,
      message: 'Migración completada exitosamente a formato de nombres en Firestore y kin_db.json',
      migratedUsers,
      firestoreResults,
    });
  } catch (error: any) {
    console.error('[API /admin/migrate Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
