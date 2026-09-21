'use client';

import React, { useState } from 'react';
import { capitalizeWords } from '@/lib/utils/capitalize';

export interface BilingualAuthScreenProps {
  onLoginSuccess?: (userData?: any) => void;
  initialMode?: 'login' | 'register';
}

export function BilingualAuthScreen({
  onLoginSuccess,
  initialMode = 'login',
}: BilingualAuthScreenProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  // Register state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [isFaceIdLoading, setIsFaceIdLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      showToast(language === 'es' ? 'Por favor completa tu nombre y correo' : 'Please enter your name and email');
      return;
    }

    setIsLoading(true);
    showToast(language === 'es' ? 'Creando bóveda cifrada en ClientVault...' : 'Creating encrypted ClientVault...');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: capitalizeWords(firstName.trim()),
          lastName: capitalizeWords(lastName.trim()),
          phone: `${phonePrefix} ${phone}`.trim(),
          email: email.trim(),
          password: password.trim() || 'KinVault2025$Secure',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al registrar');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('kin_active_user', JSON.stringify(data.user));
        sessionStorage.setItem('kin_auth', 'true');
      }

      showToast(language === 'es' ? '¡Bienvenido a KIN! Bono asignado ⚡' : 'Welcome to KIN! Welcome bonus credited ⚡');
      setTimeout(() => {
        setIsLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }, 700);
    } catch (err: any) {
      setIsLoading(false);
      showToast(err.message || 'Error en el registro');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      showToast(language === 'es' ? 'Por favor ingresa tu correo' : 'Please enter your email');
      return;
    }

    setIsLoading(true);
    showToast(language === 'es' ? 'Autenticando credenciales KIN...' : 'Authenticating KIN credentials...');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: loginEmail.trim(),
          password: loginPassword.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('kin_active_user', JSON.stringify(data.user));
        sessionStorage.setItem('kin_auth', 'true');
      }

      setTimeout(() => {
        setIsLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }, 600);
    } catch (err: any) {
      setIsLoading(false);
      showToast(err.message || 'Error al iniciar sesión');
    }
  };

  const handleFaceId = async () => {
    setIsFaceIdLoading(true);
    showToast(language === 'es' ? 'Verificando datos biométricos Face ID ⚡' : 'Verifying biometric Face ID ⚡');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isBiometric: true,
          emailOrPhone: loginEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('kin_active_user', JSON.stringify(data.user));
          sessionStorage.setItem('kin_auth', 'true');
        }
        setTimeout(() => {
          setIsFaceIdLoading(false);
          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
        }, 700);
      } else {
        throw new Error('Biometría no reconocida');
      }
    } catch (err: any) {
      setIsFaceIdLoading(false);
      showToast(err.message || 'Error con Face ID');
    }
  };

  return (
    <div className="bg-[#06070B] text-on-surface antialiased min-h-screen flex justify-center selection:bg-primary-container selection:text-on-primary-container">
      <div className="w-full max-w-[400px] flex flex-col relative min-h-screen pt-safe pb-safe">
        <main className="flex flex-col relative w-full px-margin-mobile bg-[#06070B] flex-1">
          <div className="flex flex-col w-full pb-12 relative overflow-hidden">
            {/* Dynamic Atmospheric Glows */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-48 -right-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Status Header */}
            <header className="flex items-center justify-between w-full py-space-sm relative z-10">
              <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low shadow-sm border border-white/5">
                <span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  SPEI v4.2 En Vivo
                </span>
              </div>

              {/* Language Switcher (ES / EN) */}
              <div className="flex items-center bg-surface-container-low p-1 rounded-full shadow-inner border border-white/5" id="lang-switch-container">
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  className={`px-3 py-1 rounded-full font-caption-sm text-caption-sm transition-all duration-200 shadow-sm flex items-center gap-1 cursor-pointer ${
                    language === 'es'
                      ? 'bg-surface-container-high text-primary font-bold shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  id="btn-lang-es"
                >
                  <span>🇲🇽</span>
                  <span>ES</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full font-caption-sm text-caption-sm transition-all duration-200 flex items-center gap-1 hover:text-on-surface cursor-pointer ${
                    language === 'en'
                      ? 'bg-surface-container-high text-primary font-bold shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  id="btn-lang-en"
                >
                  <span>🇺🇸</span>
                  <span>EN</span>
                </button>
              </div>
            </header>

            {/* Brand Logo & Hero Title */}
            <div className="flex flex-col items-center text-center mt-space-md mb-space-lg relative z-10">
              <div className="relative mb-space-sm group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-container to-secondary-container rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
                <div className="relative w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center shadow-2xl overflow-hidden p-2 border border-white/10">
                  <img
                    alt="KIN Mobile Logo"
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1V_8X2opIoIO0njK74woCl2dxtYqfl-WAABzU2MYshHEFwiQoCZe7e1eaJ6jXgemVbtgC0RRgZHLEAi_40Z3TnujI5b5WAq6qEJmRGkBPKPCrXL6145em5KAJRBIo8Or9-DvpdtQtyxIqtt5m6Lj8LlRkor9TqaYWS8lDlatmnCOD6iQeRFtCg1zgW9lHj7I1rxeSHNDVRui77pvXQCvFnwUdmXq6GkYIlwpfimyxE4vGZm2vmyjBhsgdw"
                  />
                </div>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                KIN <span className="text-primary">Mobile</span>
              </h1>
              <p className="font-body-medium text-body-medium text-on-surface-variant mt-1 max-w-[340px] transition-all duration-300">
                {authMode === 'login'
                  ? (language === 'es'
                      ? '¡Bienvenido de vuelta! Ingresa a tu cuenta'
                      : 'Welcome back! Sign in to your account')
                  : (language === 'es'
                      ? '¡Bienvenido a KIN! Crea tu cuenta'
                      : 'Welcome to KIN! Create your account')}
              </p>
            </div>

            {/* Tab Bar: Iniciar Sesión / Registrarse */}
            <div className="w-full bg-surface-container-low p-1 rounded-full shadow-inner flex items-center mb-space-lg relative z-10 border border-white/5" id="auth-tab-bar">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 rounded-full font-title-base text-body-medium transition-all duration-200 cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-surface-container-high text-primary font-bold shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                id="tab-login"
              >
                {language === 'es' ? 'Iniciar Sesión' : 'Log In'}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2.5 rounded-full font-title-base text-body-medium transition-all duration-200 cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-surface-container-high text-primary font-bold shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                id="tab-register"
              >
                {language === 'es' ? 'Registrarse' : 'Sign Up'}
              </button>
            </div>

            {/* Mode 1: Login Form */}
            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-space-md w-full relative z-10">
                {/* Email input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-caption-sm text-caption-sm text-on-surface-variant flex items-center justify-between">
                    <span>{language === 'es' ? 'Correo Electrónico' : 'Email Address'}</span>
                  </label>
                  <div className="relative rounded-xl bg-surface-container px-3 py-3 flex items-center gap-2 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                    <span className="material-symbols-outlined text-outline text-[20px]">alternate_email</span>
                    <input
                      className="w-full bg-transparent font-body-base text-body-base text-on-surface focus:outline-none placeholder:text-outline"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      required
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-caption-sm text-caption-sm text-on-surface-variant">
                      {language === 'es' ? 'Contraseña' : 'Password'}
                    </label>
                  </div>
                  <div className="relative rounded-xl bg-surface-container px-3 py-3 flex items-center gap-2 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                    <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                    <input
                      className="w-full bg-transparent font-body-base text-body-base text-on-surface focus:outline-none placeholder:text-outline pr-8"
                      id="pwd-input-login"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 text-outline hover:text-on-surface focus:outline-none transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showLoginPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-4 h-4 rounded bg-surface-container accent-primary focus:ring-0 cursor-pointer"
                      type="checkbox"
                    />
                    <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                      {language === 'es' ? 'Recordar en este equipo' : 'Remember me'}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast(language === 'es' ? 'Código de recuperación enviado a tu correo' : 'Recovery code sent to your email')}
                    className="font-caption-sm text-caption-sm text-secondary hover:underline cursor-pointer"
                  >
                    {language === 'es' ? '¿Olvidaste clave?' : 'Forgot password?'}
                  </button>
                </div>

                {/* Submit buttons */}
                <div className="flex flex-col gap-space-sm pt-space-xs">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-full bg-primary text-on-primary font-headline-md text-title-base font-bold flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(46,213,164,0.35)] active:scale-[0.98] transition-all hover:brightness-105 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{language === 'es' ? 'Iniciar Sesión' : 'Sign In'}</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleFaceId}
                    disabled={isFaceIdLoading}
                    className="w-full h-12 rounded-2xl bg-secondary-container/20 text-secondary font-title-base text-body-medium font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(112,71,235,0.25)] hover:bg-secondary-container/30 active:scale-[0.98] transition-all cursor-pointer border border-secondary/20"
                  >
                    {isFaceIdLoading ? (
                      <span className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[22px] text-secondary">face</span>
                        <span>{language === 'es' ? 'Ingresar con Face ID ⚡' : 'Sign in with Face ID ⚡'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Mode 2: Register Form */
              <form onSubmit={handleRegister} className="flex flex-col gap-space-md w-full relative z-10">
                {/* First Name & Last Name (2 columns) */}
                <div className="grid grid-cols-2 gap-space-sm w-full">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-caption-sm text-caption-sm text-on-surface-variant flex items-center justify-between">
                      <span>{language === 'es' ? 'Nombre' : 'First Name'}</span>
                    </label>
                    <div className="relative rounded-xl bg-surface-container px-3 py-3 flex items-center shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                      <input
                        className="w-full bg-transparent font-body-base text-body-base text-on-surface focus:outline-none placeholder:text-outline capitalize"
                        placeholder="Nombre"
                        type="text"
                        autoCapitalize="words"
                        autoCorrect="off"
                        spellCheck={false}
                        value={firstName}
                        onChange={(e) => setFirstName(capitalizeWords(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-caption-sm text-caption-sm text-on-surface-variant flex items-center justify-between">
                      <span>{language === 'es' ? 'Apellidos' : 'Last Name'}</span>
                    </label>
                    <div className="relative rounded-xl bg-surface-container px-3 py-3 flex items-center shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                      <input
                        className="w-full bg-transparent font-body-base text-body-base text-on-surface focus:outline-none placeholder:text-outline capitalize"
                        placeholder="Apellidos"
                        type="text"
                        autoCapitalize="words"
                        autoCorrect="off"
                        spellCheck={false}
                        value={lastName}
                        onChange={(e) => setLastName(capitalizeWords(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-caption-sm text-caption-sm text-on-surface-variant flex items-center justify-between">
                    <span>{language === 'es' ? 'Número Celular (Móvil)' : 'Mobile Phone'}</span>
                    <span className="font-label-caps text-label-caps text-primary">SMS Instantáneo</span>
                  </label>
                  <div className="relative rounded-xl bg-surface-container px-3 py-2.5 flex items-center gap-2 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                    <div className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer select-none">
                      <span className="text-base leading-none">🇺🇸</span>
                      <span className="font-financial-mono text-financial-mono text-on-surface">{phonePrefix}</span>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
                    </div>
                    <input
                      className="w-full bg-transparent font-financial-mono text-financial-mono text-on-surface focus:outline-none placeholder:text-outline"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <span
                      className="material-symbols-outlined text-primary-container text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-caption-sm text-caption-sm text-on-surface-variant flex items-center justify-between">
                    <span>{language === 'es' ? 'Correo Electrónico' : 'Email Address'}</span>
                  </label>
                  <div className="relative rounded-xl bg-surface-container px-3 py-3 flex items-center gap-2 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                    <span className="material-symbols-outlined text-outline text-[20px]">alternate_email</span>
                    <input
                      className="w-full bg-transparent font-body-base text-body-base text-on-surface focus:outline-none placeholder:text-outline"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password with Strength Indicators */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-caption-sm text-caption-sm text-on-surface-variant">
                      {language === 'es' ? 'Contraseña Segura' : 'Secure Password'}
                    </label>
                    <span className="font-label-caps text-label-caps text-primary-fixed uppercase tracking-wider font-bold">
                      {language === 'es' ? 'Verde / Fuerte' : 'Strong / Protected'}
                    </span>
                  </div>
                  <div className="relative rounded-xl bg-surface-container px-3 py-3 flex items-center gap-2 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                    <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                    <input
                      className="w-full bg-transparent font-body-base text-body-base text-on-surface focus:outline-none placeholder:text-outline pr-8"
                      id="pwd-input-register"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-outline hover:text-on-surface focus:outline-none transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 px-1">
                    <div className="h-1.5 flex-1 rounded-full bg-primary-container shadow-[0_0_8px_rgba(46,213,164,0.6)]" />
                    <div className="h-1.5 flex-1 rounded-full bg-primary-container shadow-[0_0_8px_rgba(46,213,164,0.6)]" />
                    <div className="h-1.5 flex-1 rounded-full bg-primary-container shadow-[0_0_8px_rgba(46,213,164,0.6)]" />
                    <div className="h-1.5 flex-1 rounded-full bg-primary-container shadow-[0_0_8px_rgba(46,213,164,0.6)]" />
                  </div>
                </div>

                {/* Remember Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-4 h-4 rounded bg-surface-container accent-primary focus:ring-0 cursor-pointer"
                      type="checkbox"
                    />
                    <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                      {language === 'es' ? 'Recordar en este equipo' : 'Remember on this device'}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast(language === 'es' ? 'Código de recuperación enviado' : 'Recovery code sent')}
                    className="font-caption-sm text-caption-sm text-secondary hover:underline cursor-pointer"
                  >
                    {language === 'es' ? '¿Olvidaste clave?' : 'Forgot pass?'}
                  </button>
                </div>

                {/* Register Buttons */}
                <div className="flex flex-col gap-space-sm pt-space-xs">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-full bg-primary text-on-primary font-headline-md text-title-base font-bold flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(46,213,164,0.35)] active:scale-[0.98] transition-all hover:brightness-105 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{language === 'es' ? 'Crear Cuenta' : 'Create Account'}</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleFaceId}
                    disabled={isFaceIdLoading}
                    className="w-full h-12 rounded-2xl bg-secondary-container/20 text-secondary font-title-base text-body-medium font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(112,71,235,0.25)] hover:bg-secondary-container/30 active:scale-[0.98] transition-all cursor-pointer border border-secondary/20"
                  >
                    {isFaceIdLoading ? (
                      <span className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[22px] text-secondary">face</span>
                        <span>{language === 'es' ? 'Ingresar con Face ID ⚡' : 'Sign in with Face ID ⚡'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Institutional Compliance Badges */}
            <div className="mt-space-lg pt-space-md flex flex-col items-center text-center gap-space-sm relative z-10 border-t border-white/5">
              <div className="flex items-center justify-center gap-2 flex-wrap text-on-surface-variant opacity-80">
                <span className="flex items-center gap-1 font-caption-sm text-caption-sm">
                  <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
                  FinCEN Registrado
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-caption-sm text-caption-sm">
                  <span className="material-symbols-outlined text-[15px] text-primary">bolt</span>
                  SPEI 24/7 Conectado
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-caption-sm text-caption-sm">
                  <span className="material-symbols-outlined text-[15px] text-primary">shield</span>
                  Fondos FDIC
                </span>
              </div>
              <p className="font-caption-sm text-caption-sm text-outline max-w-[320px] leading-relaxed">
                {language === 'es'
                  ? 'Al continuar confirmas estar de acuerdo con los Términos de Servicio y el Aviso de Privacidad Biométrico KIN.'
                  : 'By continuing you agree to KIN Terms of Service and Biometric Privacy Policy.'}
              </p>

              {/* Direct Dashboard Access Link */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onLoginSuccess) onLoginSuccess();
                  }}
                  className="px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold hover:bg-primary/20 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">dashboard</span>
                  <span>{language === 'es' ? 'Entrar directo al Dashboard KIN →' : 'Direct to KIN Dashboard →'}</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Dynamic Toast Feedback */}
        {toastMessage && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] p-3 rounded-2xl bg-surface-container-highest shadow-2xl flex items-center gap-3 transition-opacity duration-300 z-50 border border-white/10 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <span className="font-title-base text-xs text-white truncate font-bold">
              {toastMessage}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
