import { NextResponse } from 'next/server';
import {
  findUserById,
  findUserByEmailOrPhone,
  updateUserProfile,
  getUserTransactions,
  getUserContacts,
  USD_TO_MXN_RATE,
} from '@/lib/server/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    let user: any = null;
    if (userId) {
      user = findUserById(userId) || null;
    } else if (email) {
      user = findUserByEmailOrPhone(email) || null;
    } else {
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
    console.error('[API /account/data GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener datos de cuenta' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId es requerido' }, { status: 400 });
    }

    const updated = updateUserProfile(userId, updates || {});
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil de usuario actualizado y sincronizado en tiempo real',
      user: updated,
    });
  } catch (error: any) {
    console.error('[API /account/data POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar perfil' },
      { status: 500 }
    );
  }
}
