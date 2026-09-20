import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveTransferToFirestore, saveAuditLogToFirestore } from '@/lib/server/firebase';

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'kin_db.json');

export async function POST() {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      return NextResponse.json({ success: false, error: 'kin_db.json no encontrado' }, { status: 404 });
    }

    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const db = JSON.parse(raw);

    const usersMap: Record<string, string> = {};
    for (const u of db.users || []) {
      usersMap[u.id] = `${u.firstName} ${u.lastName}`.trim();
    }

    const expenseTxs = (db.transactions || []).filter((t: any) => t.type === 'expense');
    let synced = 0;
    const errors: any[] = [];

    for (const tx of expenseTxs) {
      const rawRef = (tx.refNumber || '').replace(/\D/g, '') || String(Math.floor(100000 + Math.random() * 900000));
      const docId = `TX-2026-${rawRef.slice(0, 6)}`;

      let recipient = tx.nombreBeneficiario || '';
      if (!recipient) {
        const match = tx.title.match(/para (.+?)( \(|$)/) || tx.title.match(/^(.+?) \(/) || [null, tx.title];
        recipient = match[1] || tx.title;
      }

      const senderName = usersMap[tx.userId] || 'Usuario KIN';
      const amountUsd = Math.abs(Number(tx.amount)) || 0;
      const amountMxn = Number(tx.amountMXN) || +(amountUsd * 20.45).toFixed(2);
      const createdAt = tx.createdAt ? (tx.createdAt.endsWith('Z') ? tx.createdAt : `${tx.createdAt}Z`) : new Date().toISOString();

      let recipientBank = tx.bancoDestino || '';
      if (!recipientBank) {
        if (tx.category && tx.category.toLowerCase().includes('oxxo')) recipientBank = 'OXXO Cash Pickup';
        else if ((tx.category && tx.category.toLowerCase().includes('p2p')) || tx.id.includes('kin')) recipientBank = 'Red KIN Cash P2P';
        else recipientBank = 'Red Banxico SPEI';
      }

      const ok = await saveTransferToFirestore({
        id: docId,
        amountMxn,
        amountUsd,
        createdAt,
        exchangeRate: 20.45,
        feeUsd: 0,
        recipientBank,
        recipientCity: 'México',
        recipientName: recipient,
        senderName,
        senderId: tx.userId,
        status: 'SPEI_LIQUIDADO',
        trackingNumber: tx.claveRastreoBanxico || tx.refNumber || `KIN-${rawRef}`,
        updatedAt: createdAt,
        type: tx.id.includes('kin') ? 'KIN_CASH_P2P' : 'REMESAS_SPEI',
      });

      if (ok) {
        synced++;
      } else {
        errors.push(docId);
      }
    }

    // Registrar en audit_logs de Firestore
    await saveAuditLogToFirestore({
      action: 'ADMIN_TRANSFERS_SYNCED',
      details: {
        totalSynced: synced,
        totalChecked: expenseTxs.length,
        timestamp: new Date().toISOString(),
      },
      userEmailOrPhone: 'admin@kin-app.com',
    });

    return NextResponse.json({
      success: true,
      message: `Sincronización a Firebase Firestore transfers completada: ${synced}/${expenseTxs.length} transferencias activas`,
      totalSynced: synced,
      errors,
    });
  } catch (error: any) {
    console.error('[API /admin/sync-transfers Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
