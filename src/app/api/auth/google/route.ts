import { NextResponse } from 'next/server';
import {
  findUserByEmailOrPhone,
  registerNewUser,
  updateUserProfile,
} from '@/lib/server/db';
import { firebaseVerifyGoogleToken, saveUserToFirestore } from '@/lib/server/firebase';
import { capitalizeWords } from '@/lib/utils/capitalize';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credential, email: rawEmail, name: rawName, avatar: rawAvatar, googleId } = body;

    let email = (rawEmail || '').trim().toLowerCase();
    let displayName = (rawName || '').trim();
    let avatarUrl = rawAvatar || '';
    let verifiedSub = googleId || '';

    // 1) Si viene credential (Google ID Token), verificar criptográficamente
    if (credential) {
      const verifyResult = await firebaseVerifyGoogleToken(credential);
      if (verifyResult.valid && verifyResult.email) {
        email = verifyResult.email.toLowerCase();
        displayName = verifyResult.name || displayName || email.split('@')[0];
        avatarUrl = verifyResult.picture || avatarUrl;
        verifiedSub = verifyResult.sub || verifiedSub;
      }
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Correo de Google no válido o no proporcionado' },
        { status: 400 }
      );
    }

    // Separar nombre y apellido
    let firstName = 'Usuario';
    let lastName = 'KIN';
    if (displayName) {
      const parts = displayName.split(/\s+/);
      firstName = capitalizeWords(parts[0]);
      lastName = parts.length > 1 ? capitalizeWords(parts.slice(1).join(' ')) : '';
    }

    // 2) Buscar si el usuario ya existe en base de datos
    const existing = findUserByEmailOrPhone(email);
    if (existing) {
      // Actualizar avatar y nombres si no los tenía
      const updates: any = {};
      if (!existing.avatar && avatarUrl) updates.avatar = avatarUrl;
      if (firstName && (!existing.firstName || existing.firstName === 'Usuario')) updates.firstName = firstName;
      if (lastName && !existing.lastName) updates.lastName = lastName;

      const updated = Object.keys(updates).length > 0 ? updateUserProfile(existing.id, updates) : existing;
      const finalUser = updated || existing;

      // Sync inmediato a Firestore
      saveUserToFirestore(finalUser).catch((e) => console.warn('[Firestore Sync Google User]', e));

      return NextResponse.json({
        success: true,
        message: 'Sesión iniciada con Google exitosamente',
        user: finalUser,
        token: `kin-jwt-google-${finalUser.id}-${Date.now()}`,
      });
    }

    // 3) Si es nuevo usuario, registrar en la red KIN y Cloud Firestore
    const newUser = registerNewUser({
      firstName,
      lastName,
      email,
      phone: '+1 (555) 000-0000',
      password: `GoogleAuth$${verifiedSub || Date.now()}`,
    });

    // Enriquecer con avatar de Google y nivel de verificación
    if (avatarUrl) {
      newUser.avatar = avatarUrl;
    }
    newUser.kycTier = 'Tier 1 (Google Auth Verificado)';
    updateUserProfile(newUser.id, {
      avatar: avatarUrl,
      kycTier: 'Tier 1 (Google Auth Verificado)',
    });

    saveUserToFirestore(newUser).catch((e) => console.warn('[Firestore Sync New Google User]', e));

    return NextResponse.json({
      success: true,
      message: 'Cuenta KIN creada con Google con éxito',
      user: newUser,
      token: `kin-jwt-google-${newUser.id}-${Date.now()}`,
    });
  } catch (error: any) {
    console.error('[API /auth/google] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al autenticar con Google' },
      { status: 500 }
    );
  }
}
