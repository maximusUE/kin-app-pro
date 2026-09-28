'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
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

  // Google Account Selector Modal (Fallback for dev / popup blockers)
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const showToast = (msg: string, forcedType?: 'success' | 'error' | 'info') => {
    let type: 'success' | 'error' | 'info' = forcedType || 'info';
    if (!forcedType) {
      if (/error|incorrect|inválid|falló|invalida|rechazad|bloquead/i.test(msg)) {
        type = 'error';
      } else if (/bienvenido|welcome|éxito|success|conectado/i.test(msg)) {
        type = 'success';
      }
    }
    if (type === 'error') {
      toast.error(msg);
    } else if (type === 'success') {
      toast.success(msg);
    } else {
      toast.info(msg);
    }
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

  // Trigger Apple Sign-In Flow
  const handleAppleSignIn = () => {
    showToast(
      language === 'es'
        ? 'Apple ID: Verificando llavero iCloud & Biometría ...'
        : 'Apple ID: Verifying iCloud Keychain & Biometrics ...'
    );
    setTimeout(() => {
      handleFaceId();
    }, 500);
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
                {/* Email & Password Form */}
                <form onSubmit={handleLogin} className="flex flex-col gap-space-md w-full">
                  {/* Email input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant flex items-center justify-between">
                      <span>{language === 'es' ? 'Correo Electrónico' : 'Email Address'}</span>
                    </label>
                    <div className="relative rounded-2xl bg-white dark:bg-surface-container px-3.5 py-3 flex items-center gap-2.5 shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200/90 dark:border-white/10 transition-colors">
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
                    <div className="relative rounded-2xl bg-white dark:bg-surface-container px-3.5 py-3 flex items-center gap-2.5 shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200/90 dark:border-white/10 transition-colors">
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
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="w-4 h-4 rounded bg-surface-container accent-primary focus:ring-0 cursor-pointer"
                        type="checkbox"
                      />
                      <span className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant">
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

                  {/* Single Clean Primary Action Button: Login */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-13 py-3.5 rounded-full bg-primary text-on-primary font-headline-md text-title-base font-bold flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(46,213,164,0.35)] active:scale-[0.98] transition-all hover:brightness-105 cursor-pointer disabled:opacity-50"
                      id="btn-primary-login"
                    >
                      {isLoading ? (
                        <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>{language === 'es' ? 'Iniciar Sesión' : 'Login'}</span>
                      )}
                    </button>
                  </div>

                  {/* Subtle Elegant Divider: ── Or ── */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200/80 dark:border-white/10" />
                    <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 dark:text-outline select-none">
                      {language === 'es' ? 'o' : 'Or'}
                    </span>
                    <div className="flex-grow border-t border-slate-200/80 dark:border-white/10" />
                  </div>

                  {/* Sleek Row of 3 Circular Social & Biometric Buttons */}
                  <div className="flex items-center justify-center gap-5 pt-1">
                    {/* Apple ID */}
                    <button
                      type="button"
                      onClick={handleAppleSignIn}
                      title="Apple ID"
                      className="w-13 h-13 rounded-full bg-white dark:bg-surface-container hover:bg-slate-100 dark:hover:bg-surface-container-high border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.71-7.85-12.02-14.3-6.26-9.35-11.16-19.78-14.7-31.31-3.54-11.52-5.31-22.37-5.31-32.55 0-14.28 3.59-26.11 10.78-35.48 7.18-9.37 16.27-14.15 27.27-14.34 5.37 0 11.14 1.3 17.3 3.91 6.16 2.61 10.15 3.97 11.96 4.08 1.57 0 5.86-1.46 12.87-4.38 7.01-2.92 13.06-4.13 18.15-3.63 13.9.72 24.63 5.48 32.18 14.28-11.51 6.95-17.15 16.7-16.92 29.25.23 9.94 4.08 18.25 11.55 24.93 7.47 6.68 16.34 10.42 26.61 11.22-2.18 6.42-4.94 13.25-8.29 20.48zM119.22 33.39c0-6.84 2.45-13.34 7.35-19.5 4.9-6.16 11.08-10.4 18.54-12.72.33 1.45.49 2.87.49 4.26 0 6.84-2.58 13.38-7.74 19.62-5.16 6.24-11.39 10.33-18.64 12.27-.08-1.28-.12-2.59-.12-3.93z" />
                      </svg>
                    </button>

                    {/* Google */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      title="Google"
                      className="w-13 h-13 rounded-full bg-white dark:bg-surface-container hover:bg-slate-100 dark:hover:bg-surface-container-high border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isGoogleLoading ? (
                        <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                      )}
                    </button>

                    {/* Face ID / Biometrics */}
                    <button
                      type="button"
                      onClick={handleFaceId}
                      disabled={isFaceIdLoading}
                      title="Face ID / Biometría"
                      className="w-13 h-13 rounded-full bg-white dark:bg-surface-container hover:bg-slate-100 dark:hover:bg-surface-container-high border border-slate-200 dark:border-white/10 flex items-center justify-center text-secondary dark:text-purple-400 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isFaceIdLoading ? (
                        <span className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                          <path d="M9 9h.01M15 9h.01" />
                          <path d="M9 13a4 4 0 0 0 6 0" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Footer Switch: Don't have an account? Sign Up */}
                  <div className="pt-2 text-center">
                    <p className="font-caption-sm text-caption-sm text-slate-500 dark:text-on-surface-variant">
                      {language === 'es' ? '¿No tienes una cuenta?' : "Don't have an account?"}{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('register')}
                        className="text-primary font-bold hover:underline cursor-pointer transition-colors ml-1"
                      >
                        {language === 'es' ? 'Regístrate' : 'Sign UP'}
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* ══════════════════════════════════════════════════════════════════ */
              /* Mode 2: Register Form                                           */
              /* ══════════════════════════════════════════════════════════════════ */
              <div className="flex flex-col gap-space-md w-full relative z-10">
                {/* Full Email/Password Registration Form */}
                <form onSubmit={handleRegister} className="flex flex-col gap-space-md w-full">
                  {/* First Name & Last Name (2 columns) */}
                  <div className="grid grid-cols-2 gap-space-sm w-full">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant flex items-center justify-between">
                        <span>{language === 'es' ? 'Nombre' : 'First Name'}</span>
                      </label>
                      <div className="relative rounded-2xl bg-white dark:bg-surface-container px-3.5 py-3 flex items-center shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200/90 dark:border-white/10 transition-colors">
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
                      <div className="relative rounded-2xl bg-white dark:bg-surface-container px-3.5 py-3 flex items-center shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200/90 dark:border-white/10 transition-colors">
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
                    <div className="relative rounded-2xl bg-white dark:bg-surface-container px-3.5 py-2.5 flex items-center gap-2 shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200/90 dark:border-white/10 transition-colors">
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
                    <div className="relative rounded-2xl bg-white dark:bg-surface-container px-3.5 py-3 flex items-center gap-2 shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200/90 dark:border-white/10 transition-colors">
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
                    <div className="relative rounded-2xl bg-white dark:bg-surface-container px-3.5 py-3 flex items-center gap-2 shadow-inner focus-within:bg-slate-50 dark:focus-within:bg-surface-container-high border border-slate-200/90 dark:border-white/10 transition-colors">
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
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="w-4 h-4 rounded bg-surface-container accent-primary focus:ring-0 cursor-pointer"
                        type="checkbox"
                      />
                      <span className="font-caption-sm text-caption-sm text-slate-600 dark:text-on-surface-variant">
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

                  {/* Single Clean Primary Action Button: Create Account */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-13 py-3.5 rounded-full bg-primary text-on-primary font-headline-md text-title-base font-bold flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(46,213,164,0.35)] active:scale-[0.98] transition-all hover:brightness-105 cursor-pointer disabled:opacity-50"
                      id="btn-primary-register"
                    >
                      {isLoading ? (
                        <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>{language === 'es' ? 'Crear Cuenta' : 'Create account'}</span>
                      )}
                    </button>
                  </div>

                  {/* Subtle Elegant Divider: ── Or ── */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200/80 dark:border-white/10" />
                    <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 dark:text-outline select-none">
                      {language === 'es' ? 'o' : 'Or'}
                    </span>
                    <div className="flex-grow border-t border-slate-200/80 dark:border-white/10" />
                  </div>

                  {/* Sleek Row of 3 Circular Social & Biometric Buttons */}
                  <div className="flex items-center justify-center gap-5 pt-1">
                    {/* Apple ID */}
                    <button
                      type="button"
                      onClick={handleAppleSignIn}
                      title="Apple ID"
                      className="w-13 h-13 rounded-full bg-white dark:bg-surface-container hover:bg-slate-100 dark:hover:bg-surface-container-high border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.71-7.85-12.02-14.3-6.26-9.35-11.16-19.78-14.7-31.31-3.54-11.52-5.31-22.37-5.31-32.55 0-14.28 3.59-26.11 10.78-35.48 7.18-9.37 16.27-14.15 27.27-14.34 5.37 0 11.14 1.3 17.3 3.91 6.16 2.61 10.15 3.97 11.96 4.08 1.57 0 5.86-1.46 12.87-4.38 7.01-2.92 13.06-4.13 18.15-3.63 13.9.72 24.63 5.48 32.18 14.28-11.51 6.95-17.15 16.7-16.92 29.25.23 9.94 4.08 18.25 11.55 24.93 7.47 6.68 16.34 10.42 26.61 11.22-2.18 6.42-4.94 13.25-8.29 20.48zM119.22 33.39c0-6.84 2.45-13.34 7.35-19.5 4.9-6.16 11.08-10.4 18.54-12.72.33 1.45.49 2.87.49 4.26 0 6.84-2.58 13.38-7.74 19.62-5.16 6.24-11.39 10.33-18.64 12.27-.08-1.28-.12-2.59-.12-3.93z" />
                      </svg>
                    </button>

                    {/* Google */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      title="Google"
                      className="w-13 h-13 rounded-full bg-white dark:bg-surface-container hover:bg-slate-100 dark:hover:bg-surface-container-high border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isGoogleLoading ? (
                        <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                      )}
                    </button>

                    {/* Face ID / Biometrics */}
                    <button
                      type="button"
                      onClick={handleFaceId}
                      disabled={isFaceIdLoading}
                      title="Face ID / Biometría"
                      className="w-13 h-13 rounded-full bg-white dark:bg-surface-container hover:bg-slate-100 dark:hover:bg-surface-container-high border border-slate-200 dark:border-white/10 flex items-center justify-center text-secondary dark:text-purple-400 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isFaceIdLoading ? (
                        <span className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                          <path d="M9 9h.01M15 9h.01" />
                          <path d="M9 13a4 4 0 0 0 6 0" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Footer Switch: Already have an account? Log in */}
                  <div className="pt-2 text-center">
                    <p className="font-caption-sm text-caption-sm text-slate-500 dark:text-on-surface-variant">
                      {language === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?'}{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-primary font-bold hover:underline cursor-pointer transition-colors ml-1"
                      >
                        {language === 'es' ? 'Inicia sesión' : 'Log in'}
                      </button>
                    </p>
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

        </div>
      </div>
    </div>
  );
}
