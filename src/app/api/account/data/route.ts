import { NextResponse } from 'next/server';
import { findUserById, findUserByEmailOrPhone, getUserTransactions, getUserContacts, USD_TO_MXN_RATE } from '@/lib/server/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    let user = userId ? findUserById(userId) : null;
    if (!user && email) {
      user = findUserByEmailOrPhone(email) || null;
    }
    if (!user) {
      user = findUserById('user-001') || null;
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    const transactions = getUserTransactions(user.id);
    const contacts = getUserContacts(user.id);

    return NextResponse.json({
      success: true,
      user,
      transactions,
      contacts,
      exchangeRate: USD_TO_MXN_RATE,
    });
  } catch (error: any) {
    console.error('[API /account/data] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener datos de cuenta' },
      { status: 500 }
    );
  }
}
