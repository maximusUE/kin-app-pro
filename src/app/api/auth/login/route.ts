import { NextResponse } from 'next/server';
import { findUserByEmailOrPhone, findUserById, registerNewUser } from '@/lib/server/db';
import { firebaseAuthSignIn, saveUserToFirestore } from '@/lib/server/firebase';
import { capitalizeWords } from '@/lib/utils/capitalize';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emailOrPhone, password, isBiometric, userId } = body;

    if (userId) {
      const user = findUserById(userId);
      if (user) {
        return NextResponse.json({
          success: true,
          user,
          token: `kin-jwt-${user.id}-${Date.now()}`,
        });
      }
    }

    if (isBiometric) {
      // Biometric Face ID authentication
      const user = emailOrPhone ? findUserByEmailOrPhone(emailOrPhone) : findUserById('user-001');
      if (user) {
        return NextResponse.json({
          success: true,
          message: 'Autenticación biométrica Face ID exitosa',
          user,
          token: `kin-jwt-bio-${user.id}-${Date.now()}`,
        });
      }
    }

    if (!emailOrPhone) {
      return NextResponse.json(
        { success: false, error: 'Correo electrónico o teléfono requerido' },
        { status: 400 }
      );
    }

    const cleanIdentifier = emailOrPhone.trim();
    let user = findUserByEmailOrPhone(cleanIdentifier);

    // 1) Si no existe localmente pero es un correo, verificar con Firebase Authentication (kin-app-prod-b97c0)
    let firebaseUid: string | undefined = undefined;
    if (cleanIdentifier.includes('@') && password) {
      const fbAuth = await firebaseAuthSignIn(cleanIdentifier.toLowerCase(), password);
      if (fbAuth.success && fbAuth.localId) {
        firebaseUid = fbAuth.localId;
        if (!user) {
          // Si el usuario existe en Firebase Auth, crearlo en la red KIN
          const namePart = (fbAuth.displayName || cleanIdentifier.split('@')[0]).trim();
          const parts = namePart.split(/\s+/);
          const firstName = capitalizeWords(parts[0]);
          const lastName = parts.length > 1 ? capitalizeWords(parts.slice(1).join(' ')) : '';

          user = registerNewUser({
            firstName,
            lastName,
            email: cleanIdentifier.toLowerCase(),
            phone: '+1 (555) 000-0000',
            password,
          });
          (user as any).firebaseUid = firebaseUid;
          saveUserToFirestore(user).catch((e) => console.warn('[Firestore Sync New FB User]', e));
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado en KIN ni en Firebase. Por favor regístrate como nuevo cliente.' },
        { status: 404 }
      );
    }

    // Validación de contraseña local (o validado por Firebase arriba)
    if (password && user.passwordHash && user.passwordHash !== password && !firebaseUid) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Sincronización en segundo plano con Firestore
    saveUserToFirestore(user).catch((e) => console.warn('[Firestore Sync Login User]', e));

    return NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user,
      firebaseUid,
      token: `kin-jwt-${user.id}-${Date.now()}`,
    });
  } catch (error: any) {
    console.error('[API /auth/login] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al autenticar usuario' },
      { status: 500 }
    );
  }
}
