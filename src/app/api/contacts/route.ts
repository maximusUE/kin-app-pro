import { NextResponse } from 'next/server';
import { getUserContacts, createContact, deleteContact } from '@/lib/server/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-001';
    const contacts = getUserContacts(userId);
    return NextResponse.json({ success: true, contacts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, fullName, phone, clabe, bank, role, avatar } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'El nombre del contacto es requerido' },
        { status: 400 }
      );
    }

    const contact = createContact({
      userId: userId || 'user-001',
      name,
      fullName: fullName || name,
      phone,
      clabe,
      bank: bank || 'Banco en México',
      role: role || 'Familiar',
      avatar: avatar || '👤',
    });

    return NextResponse.json({
      success: true,
      message: 'Contacto guardado exitosamente',
      contact,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-001';
    const contactId = searchParams.get('contactId') || searchParams.get('id');

    if (!contactId) {
      return NextResponse.json(
        { success: false, error: 'ID de contacto requerido' },
        { status: 400 }
      );
    }

    const deleted = deleteContact(userId, contactId);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
