import { NextResponse } from 'next/server';
import { registerNewUser, findUserByEmailOrPhone, updateUserProfile } from '@/lib/server/db';
import { capitalizeWords } from '@/lib/utils/capitalize';
import { firebaseAuthSignUp, saveUserToFirestore } from '@/lib/server/firebase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password } = body;

    if (!firstName || !email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y correo electrónico son requeridos' },
        { status: 400 }
      );
    }

    const cleanFirstName = capitalizeWords(firstName.trim());
    const cleanLastName = capitalizeWords((lastName || '').trim());
    const cleanEmail = email.trim().toLowerCase();

    // 1) Sincronizar / crear en Firebase Authentication (Email/Password)
    const firebaseResult = await firebaseAuthSignUp(
      cleanEmail,
      password || 'KinVault2025$Secure',
      `${cleanFirstName} ${cleanLastName}`.trim()
    );

    const existing = findUserByEmailOrPhone(cleanEmail);
    if (existing) {
      const updatedExisting = updateUserProfile(existing.id, {
        firstName: cleanFirstName || existing.firstName,
        lastName: cleanLastName || existing.lastName,
        ...(firebaseResult.localId && { firebaseUid: firebaseResult.localId }),
      }) || existing;

      saveUserToFirestore(updatedExisting).catch((e) => console.warn('[Firestore Sync Existing]', e));

      return NextResponse.json({
        success: true,
        message: 'Usuario existente recuperado con éxito en Firebase y KIN',
        user: updatedExisting,
        firebaseUid: firebaseResult.localId,
        token: `kin-jwt-${existing.id}-${Date.now()}`,
      });
    }

    const newUser = registerNewUser({
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      phone: phone || '+1 (555) 000-0000',
      password: password || 'KinVault2025$Secure',
    });

    if (firebaseResult.localId) {
      (newUser as any).firebaseUid = firebaseResult.localId;
      updateUserProfile(newUser.id, { firebaseUid: firebaseResult.localId } as any);
    }

    saveUserToFirestore(newUser).catch((e) => console.warn('[Firestore Sync New User]', e));

    return NextResponse.json({
      success: true,
      message: 'Cuenta KIN creada con éxito y sincronizada con Firebase',
      user: newUser,
      firebaseUid: firebaseResult.localId,
      token: `kin-jwt-${newUser.id}-${Date.now()}`,
    });
  } catch (error: any) {
    console.error('[API /auth/register] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al registrar usuario' },
      { status: 500 }
    );
  }
}
