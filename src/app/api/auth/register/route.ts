import { NextResponse } from 'next/server';
import { registerNewUser, findUserByEmailOrPhone } from '@/lib/server/db';

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

    const existing = findUserByEmailOrPhone(email);
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Usuario existente recuperado con éxito',
        user: existing,
        token: `kin-jwt-${existing.id}-${Date.now()}`,
      });
    }

    const newUser = registerNewUser({
      firstName,
      lastName: lastName || '',
      email,
      phone: phone || '+1 (555) 000-0000',
      password: password || 'KinVault2025$Secure',
    });

    return NextResponse.json({
      success: true,
      message: 'Cuenta KIN creada con éxito',
      user: newUser,
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
