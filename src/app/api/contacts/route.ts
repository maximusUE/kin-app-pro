import { NextResponse } from 'next/server';
import {
  getUserContacts,
  getFamilyNetwork,
  createContact,
  updateContact,
  updateContactsOrder,
  deleteContact,
  validateRemittanceRecipient,
  validateKinCashRecipient,
} from '@/lib/server/db';
import { capitalizeWords } from '@/lib/utils/capitalize';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-001';
    const contacts = getUserContacts(userId);
    const familyNetwork = getFamilyNetwork(userId);
    return NextResponse.json({ success: true, contacts, familyNetwork });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      name,
      fullName,
      phone,
      clabe,
      bank,
      role,
      avatar,
      photoUrl,
      street,
      houseNumber,
      state,
      country,
      zipCode,
      validateFor, // 'remittance' | 'kincash'
    } = body;

    const cleanName = capitalizeWords(name);
    const cleanFullName = capitalizeWords(fullName || name);
    const cleanStreet = capitalizeWords(street);
    const cleanState = capitalizeWords(state);
    const cleanCountry = capitalizeWords(country || 'Mexico');

    // Validación estricta según el tipo de operación
    if (validateFor === 'remittance') {
      const val = validateRemittanceRecipient({
        name: cleanName,
        phone,
        street: cleanStreet,
        houseNumber,
        state: cleanState,
        country: cleanCountry,
        zipCode,
      });
      if (!val.valid) {
        return NextResponse.json(
          {
            success: false,
            error: 'Faltan campos obligatorios para envíos transfronterizos a México (CNBV/Banxico)',
            missingFields: val.missingFields,
            errors: val.errors,
          },
          { status: 400 }
        );
      }
    } else if (validateFor === 'kincash') {
      const val = validateKinCashRecipient({ name: cleanName, phone });
      if (!val.valid) {
        return NextResponse.json(
          {
            success: false,
            error: 'Nombre y teléfono son obligatorios para KIN Cash',
            missingFields: val.missingFields,
            errors: val.errors,
          },
          { status: 400 }
        );
      }
    } else if (!cleanName) {
      return NextResponse.json(
        { success: false, error: 'El nombre del contacto es requerido' },
        { status: 400 }
      );
    }

    const contact = createContact({
      userId: userId || 'user-001',
      name: cleanName,
      fullName: cleanFullName,
      phone,
      clabe,
      bank: bank || 'Banco en México',
      role: role || 'Beneficiario directo',
      avatar: avatar || '',
      photoUrl: photoUrl || '',
      street: cleanStreet,
      houseNumber,
      state: cleanState,
      country: cleanCountry,
      zipCode,
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, contactId, updates, reorderList } = body;

    const user = userId || 'user-001';

    // Manejo de reordenamiento de lista completa
    if (Array.isArray(reorderList)) {
      updateContactsOrder(user, reorderList);
      return NextResponse.json({ success: true, message: 'Orden de contactos actualizado' });
    }

    if (!contactId) {
      return NextResponse.json(
        { success: false, error: 'contactId es requerido para actualizar' },
        { status: 400 }
      );
    }

    const updated = updateContact({
      userId: user,
      contactId,
      updates: updates || {},
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contacto actualizado exitosamente',
      contact: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
