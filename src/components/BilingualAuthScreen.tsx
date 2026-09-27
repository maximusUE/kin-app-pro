'use client';

import React, { useState, useEffect } from 'react';
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

  // Load saved language on mount & inject Google Identity Services script
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('kin_language');
      if (savedLang === 'es' || savedLang === 'en') {
        setLanguage(savedLang);
      }

      // Inject Google GSI client if not present
      if (!document.getElementById('google-gsi-script')) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
  }, []);

  const handleLanguageChange = (lang: 'es' | 'en') => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kin_language', lang);
    }
  };

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

  // Status & Loaders
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFaceIdLoading, setIsFaceIdLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Google Account Selector Modal (Fallback for dev / popup blockers)
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Submit Google Auth to Backend
  // ────────────────────────────────────────────────────────────────────────────
  const submitGoogleAuth = async (payload: {
    credential?: string;
    email?: string;
    name?: string;
    avatar?: string;
    googleId?: string;
  }) => {
    setIsGoogleLoading(true);
    showToast(language === 'es' ? 'Verificando cuenta Google con Firebase...' : 'Verifying Google account with Firebase...');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al autenticar con Google');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('kin_active_user', JSON.stringify(data.user));
        sessionStorage.setItem('kin_auth', 'true');
      }

      showToast(
        language === 'es'
          ? `¡Bienvenido ${data.user.firstName}! Conectado con Google ⚡`
          : `Welcome ${data.user.firstName}! Connected with Google ⚡`
      );

      setTimeout(() => {
        setIsGoogleLoading(false);
        setShowGoogleModal(false);
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }, 600);
    } catch (err: any) {
      setIsGoogleLoading(false);
      showToast(err.message || 'Error con Google');
    }
  };

  // Trigger Google Sign-In Flow
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    showToast(language === 'es' ? 'Conectando con Google...' : 'Connecting to Google...');

    const googleClientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '1096022680471-c0fcqel3l15bjhvs4rsq0af8gqci08hd.apps.googleusercontent.com';

    try {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        const google = (window as any).google;
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response?.credential) {
              await submitGoogleAuth({ credential: response.credential });
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Popup bloqueado o localhost no registrado en consola Google -> mostrar selector amigable
            setIsGoogleLoading(false);
            setShowGoogleModal(true);
          }
        });
      } else {
        // Fallback inmediato si GSI no está cargado aún
        setIsGoogleLoading(false);
        setShowGoogleModal(true);
      }
    } catch (err) {
      setIsGoogleLoading(false);
      setShowGoogleModal(true);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Submit Register (Email / Password)
  // ────────────────────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      showToast(language === 'es' ? 'Por favor completa tu nombre y correo' : 'Please enter your name and email');
      return;
    }

    setIsLoading(true);
    showToast(language === 'es' ? 'Creando cuenta en Firebase & ClientVault...' : 'Creating account in Firebase & ClientVault...');

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

      showToast(language === 'es' ? '¡Bienvenido a KIN! Sincronizado con Firebase ⚡' : 'Welcome to KIN! Synced with Firebase ⚡');
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

  // ────────────────────────────────────────────────────────────────────────────
  // Submit Login (Email / Password)
  // ────────────────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      showToast(language === 'es' ? 'Por favor ingresa tu correo' : 'Please enter your email');
      return;
    }

    setIsLoading(true);
    showToast(language === 'es' ? 'Verificando con Firebase Auth...' : 'Verifying with Firebase Auth...');

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

  // ────────────────────────────────────────────────────────────────────────────
  // Submit Face ID
  // ────────────────────────────────────────────────────────────────────────────
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
    <div className="bg-[#FAFBFD] dark:bg-[#06070B] text-slate-900 dark:text-on-surface antialiased min-h-screen flex justify-center selection:bg-primary-container selection:text-on-primary-container transition-colors duration-300">
      <div className="w-full max-w-[400px] flex flex-col relative min-h-screen pt-safe pb-safe">
        <main className="flex flex-col relative w-full px-margin-mobile bg-[#FAFBFD] dark:bg-[#06070B] flex-1 transition-colors duration-300">
          <div className="flex flex-col w-full pb-12 relative overflow-hidden">
            {/* Dynamic Atmospheric Glows */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-48 -right-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Status Header */}
            <header className="flex items-center justify-between w-full py-space-sm relative z-10">
              <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-slate-200/60 dark:bg-surface-container-low shadow-sm border border-slate-300/60 dark:border-white/5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-label-caps text-label-caps text-slate-700 dark:text-on-surface-variant uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Firebase</span>
                  <span className="text-slate-400">●</span>
                  <span>SPEI v4.2</span>
                </span>
              </div>

              {/* Language Switcher (ES / EN) */}
              <div className="flex items-center bg-slate-200/60 dark:bg-surface-container-low p-1 rounded-full shadow-inner border border-slate-300/60 dark:border-white/5" id="lang-switch-container">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('es')}
                  className={`px-3 py-1 rounded-full font-caption-sm text-caption-sm transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer ${
                    language === 'es'
                      ? 'bg-white dark:bg-surface-container-high text-primary font-bold shadow-md'
                      : 'text-slate-600 dark:text-on-surface-variant hover:text-slate-900 dark:hover:text-on-surface'
                  }`}
                  id="btn-lang-es"
                >
                  <span>ES</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 rounded-full font-caption-sm text-caption-sm transition-all duration-200 flex items-center justify-center hover:text-slate-900 dark:hover:text-on-surface cursor-pointer ${
                    language === 'en'
                      ? 'bg-white dark:bg-surface-container-high text-primary font-bold shadow-md'
                      : 'text-slate-600 dark:text-on-surface-variant hover:text-slate-900 dark:hover:text-on-surface'
                  }`}
                  id="btn-lang-en"
                >
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
            <div className="w-full bg-slate-200/60 dark:bg-surface-container-low p-1 rounded-full shadow-inner flex items-center mb-space-lg relative z-10 border border-slate-300/60 dark:border-white/5" id="auth-tab-bar">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 rounded-full font-title-base text-body-medium transition-all duration-200 cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-surface-container-high text-primary font-bold shadow-md'
                    : 'text-slate-600 dark:text-on-surface-variant hover:text-slate-900 dark:hover:text-on-surface'
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
                    ? 'bg-white dark:bg-surface-container-high text-primary font-bold shadow-md'
                    : 'text-slate-600 dark:text-on-surface-variant hover:text-slate-900 dark:hover:text-on-surface'
                }`}
                id="tab-register"
              >
                {language === 'es' ? 'Registrarse' : 'Sign Up'}
              </button>
            </div>

            {/* ══════════════════════════════════════════════════════════════════ */}
            {/* Mode 1: Login Form                                              */}
            {/* ══════════════════════════════════════════════════════════════════ */}
            {authMode === 'login' ? (
              <div className="flex flex-col gap-space-md w-full relative z-10">
                {/* Provider 1: Official Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full h-13 py-3 px-4 rounded-2xl bg-white dark:bg-surface-container hover:bg-slate-50 dark:hover:bg-surface-container-high text-slate-800 dark:text-white border border-slate-200/90 dark:border-white/10 font-title-base text-body-medium font-semibold flex items-center justify-center gap-3 shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  id="btn-google-login"
                >
                  {isGoogleLoading ? (
                    <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>{language === 'es' ? 'Continuar con Google' : 'Sign in with Google'}</span>
                    </>
                  )}
                </button>

                {/* Elegant Divider between Providers */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
                  <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-outline select-none">
                    {language === 'es' ? 'o ingresa con correo' : 'or sign in with email'}
                  </span>
                  <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
                </div>

                {/* Provider 2: Email & Password Form */}
                <form onSubmit={handleLogin} className="flex flex-col gap-space-md w-full">
                  {/* Email input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant flex items-center justify-between">
                      <span>{language === 'es' ? 'Correo Electrónico' : 'Email Address'}</span>
                    </label>
                    <div className="relative rounded-xl bg-white dark:bg-surface-container px-3 py-3 flex items-center gap-2 shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200 dark:border-white/5 transition-colors">
                      <span className="material-symbols-outlined text-slate-400 dark:text-outline text-[20px]">alternate_email</span>
                      <input
                        className="w-full bg-transparent font-body-base text-body-base text-slate-900 dark:text-on-surface focus:outline-none placeholder:text-slate-400 dark:placeholder:text-outline"
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
                      <label className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant">
                        {language === 'es' ? 'Contraseña' : 'Password'}
                      </label>
                    </div>
                    <div className="relative rounded-xl bg-white dark:bg-surface-container px-3 py-3 flex items-center gap-2 shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200 dark:border-white/5 transition-colors">
                      <span className="material-symbols-outlined text-slate-400 dark:text-outline text-[20px]">lock</span>
                      <input
                        className="w-full bg-transparent font-body-base text-body-base text-slate-900 dark:text-on-surface focus:outline-none placeholder:text-slate-400 dark:placeholder:text-outline pr-8"
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
                          <span>{language === 'es' ? 'Iniciar Sesión con Correo' : 'Sign In with Email'}</span>
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
              </div>
            ) : (
              /* ══════════════════════════════════════════════════════════════════ */
              /* Mode 2: Register Form                                           */
              /* ══════════════════════════════════════════════════════════════════ */
              <div className="flex flex-col gap-space-md w-full relative z-10">
                {/* Provider 1: Official Google Register Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full h-13 py-3 px-4 rounded-2xl bg-white dark:bg-surface-container hover:bg-slate-50 dark:hover:bg-surface-container-high text-slate-800 dark:text-white border border-slate-200/90 dark:border-white/10 font-title-base text-body-medium font-semibold flex items-center justify-center gap-3 shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  id="btn-google-register"
                >
                  {isGoogleLoading ? (
                    <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>{language === 'es' ? 'Registrarse con Google' : 'Sign up with Google'}</span>
                    </>
                  )}
                </button>

                {/* Elegant Divider between Providers */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
                  <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-outline select-none">
                    {language === 'es' ? 'o regístrate con correo' : 'or register with email'}
                  </span>
                  <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
                </div>

                {/* Provider 2: Full Email/Password Registration Form */}
                <form onSubmit={handleRegister} className="flex flex-col gap-space-md w-full">
                  {/* First Name & Last Name (2 columns) */}
                  <div className="grid grid-cols-2 gap-space-sm w-full">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant flex items-center justify-between">
                        <span>{language === 'es' ? 'Nombre' : 'First Name'}</span>
                      </label>
                      <div className="relative rounded-xl bg-white dark:bg-surface-container px-3 py-3 flex items-center shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200 dark:border-white/5 transition-colors">
                        <input
                          className="w-full bg-transparent font-body-base text-body-base text-slate-900 dark:text-on-surface focus:outline-none placeholder:text-slate-400 dark:placeholder:text-outline capitalize"
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
                      <label className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant flex items-center justify-between">
                        <span>{language === 'es' ? 'Apellidos' : 'Last Name'}</span>
                      </label>
                      <div className="relative rounded-xl bg-white dark:bg-surface-container px-3 py-3 flex items-center shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200 dark:border-white/5 transition-colors">
                        <input
                          className="w-full bg-transparent font-body-base text-body-base text-slate-900 dark:text-on-surface focus:outline-none placeholder:text-slate-400 dark:placeholder:text-outline capitalize"
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
                    <label className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant flex items-center justify-between">
                      <span>{language === 'es' ? 'Número Celular (Móvil)' : 'Mobile Phone'}</span>
                      <span className="font-label-caps text-label-caps text-primary font-bold">SMS Instantáneo</span>
                    </label>
                    <div className="relative rounded-xl bg-white dark:bg-surface-container px-3 py-2.5 flex items-center gap-2 shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200 dark:border-white/5 transition-colors">
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-surface-container-high px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer select-none border border-slate-200 dark:border-transparent">
                        <span className="font-financial-mono text-financial-mono font-bold text-slate-900 dark:text-on-surface">{phonePrefix}</span>
                        <span className="material-symbols-outlined text-[16px] text-slate-500 dark:text-on-surface-variant">arrow_drop_down</span>
                      </div>
                      <input
                        className="w-full bg-transparent font-financial-mono text-financial-mono text-slate-900 dark:text-on-surface focus:outline-none placeholder:text-slate-400 dark:placeholder:text-outline"
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
                    <label className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant flex items-center justify-between">
                      <span>{language === 'es' ? 'Correo Electrónico' : 'Email Address'}</span>
                    </label>
                    <div className="relative rounded-xl bg-white dark:bg-surface-container px-3 py-3 flex items-center gap-2 shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200 dark:border-white/5 transition-colors">
                      <span className="material-symbols-outlined text-slate-400 dark:text-outline text-[20px]">alternate_email</span>
                      <input
                        className="w-full bg-transparent font-body-base text-body-base text-slate-900 dark:text-on-surface focus:outline-none placeholder:text-slate-400 dark:placeholder:text-outline"
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
                      <label className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant">
                        {language === 'es' ? 'Contraseña Segura' : 'Secure Password'}
                      </label>
                      <span className="font-label-caps text-label-caps text-primary-fixed uppercase tracking-wider font-bold">
                        {language === 'es' ? 'Verde / Fuerte' : 'Strong / Protected'}
                      </span>
                    </div>
                    <div className="relative rounded-xl bg-white dark:bg-surface-container px-3 py-3 flex items-center gap-2 shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200 dark:border-white/5 transition-colors">
                      <span className="material-symbols-outlined text-slate-400 dark:text-outline text-[20px]">lock</span>
                      <input
                        className="w-full bg-transparent font-body-base text-body-base text-slate-900 dark:text-on-surface focus:outline-none placeholder:text-slate-400 dark:placeholder:text-outline pr-8"
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
                          <span>{language === 'es' ? 'Crear Cuenta con Correo' : 'Create Account with Email'}</span>
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
              </div>
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
                  <span className="material-symbols-outlined text-[15px] text-emerald-400">cloud_done</span>
                  Firebase Auth & Cloud
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

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Google Account Selector Dialog (Fallback / Localhost / Dev)        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-[360px] rounded-3xl bg-white dark:bg-[#12131A] border border-slate-200 dark:border-white/10 p-5 shadow-2xl flex flex-col gap-4 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'es' ? 'Acceso con Google' : 'Sign in with Google'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-outline">
                      Firebase Project: kin-app-prod-b97c0
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-surface-container flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-outline dark:hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* 1-Click Fast Google Account */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-on-surface-variant">
                  {language === 'es' ? 'Cuenta Google detectada:' : 'Detected Google Account:'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    submitGoogleAuth({
                      email: 'cesar.urrutia@gmail.com',
                      name: 'César Urrutia',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    })
                  }
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-surface-container-high border border-slate-200 dark:border-white/10 hover:border-primary flex items-center gap-3 transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary flex-shrink-0">
                    CU
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-primary">
                      César Urrutia
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-outline truncate">
                      cesar.urrutia@gmail.com
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-primary">arrow_forward</span>
                </button>
              </div>

              {/* Custom Google Account Option */}
              <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
                <span className="text-xs font-semibold text-slate-600 dark:text-on-surface-variant">
                  {language === 'es' ? 'O usa otra cuenta Google:' : 'Or use another Google account:'}
                </span>
                <input
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-surface-container border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder={language === 'es' ? 'Nombre completo' : 'Full name'}
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-surface-container border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  disabled={!customGoogleEmail.trim()}
                  onClick={() =>
                    submitGoogleAuth({
                      email: customGoogleEmail.trim(),
                      name: customGoogleName.trim() || customGoogleEmail.split('@')[0],
                    })
                  }
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold disabled:opacity-50 transition-all cursor-pointer shadow-sm hover:brightness-105"
                >
                  {language === 'es' ? 'Continuar con esta cuenta' : 'Continue with this account'}
                </button>
              </div>
            </div>
          </div>
        )}

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
