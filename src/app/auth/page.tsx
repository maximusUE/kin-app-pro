'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  // Sign Up Form State
  const [firstName, setFirstName] = useState('Mateo');
  const [lastName, setLastName] = useState('Morales');
  const [phone, setPhone] = useState('(555) 349-2910');
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [email, setEmail] = useState('mateo.morales@gmail.com');
  const [password, setPassword] = useState('KinVault2025$Secure');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('mateo.morales@gmail.com');
  const [loginPassword, setLoginPassword] = useState('KinVault2025$Secure');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [isFaceIdLoading, setIsFaceIdLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('kin_language') as 'es' | 'en' | null;
      if (savedLang) setLanguage(savedLang);

      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'signup' || tabParam === 'register') {
        setAuthMode('register');
      } else if (tabParam === 'login') {
        setAuthMode('login');
      }
    }
  }, []);

  const handleToggleLang = (lang: 'es' | 'en') => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kin_language', lang);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim() || !lastName.trim() || !email.includes('@') || password.length < 6) {
      setErrorMsg(
        language === 'es'
          ? 'Por favor completa todos los campos con información válida.'
          : 'Please complete all fields with valid information.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 900);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginEmail.includes('@') || loginPassword.length < 6) {
      setErrorMsg(
        language === 'es'
          ? 'Por favor introduce un correo y contraseña válidos.'
          : 'Please enter a valid email and password.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 900);
  };

  const handleFaceIdAuth = () => {
    setIsFaceIdLoading(true);
    setTimeout(() => {
      setIsFaceIdLoading(false);
      router.push('/');
    }, 1100);
  };

  return (
    <div className="bg-[#06070B] text-on-surface antialiased min-h-screen flex justify-center selection:bg-primary-container selection:text-on-primary-container">
      <div className="w-full max-w-[400px] flex flex-col relative min-h-screen pt-safe pb-safe px-margin-mobile">
        {/* Ambient Radiances */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 -right-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

        <main className="flex flex-col relative w-full flex-1 pb-10">
          {/* Top Status Header */}
          <header className="flex items-center justify-between w-full py-space-sm relative z-10">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-white/5 shadow-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
                SPEI v4.2 En Vivo
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-full shadow-inner border border-white/5">
              <button
                type="button"
                onClick={() => handleToggleLang('es')}
                className={`px-3 py-1 rounded-full font-caption-sm text-xs transition-all duration-200 shadow-sm flex items-center gap-1 cursor-pointer ${
                  language === 'es'
                    ? 'bg-surface-container-high text-primary font-bold shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>🇲🇽</span>
                <span>ES</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleLang('en')}
                className={`px-3 py-1 rounded-full font-caption-sm text-xs transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                  language === 'en'
                    ? 'bg-surface-container-high text-primary font-bold shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
            </div>
          </header>

          {/* Brand & Hero Title */}
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
            <h1 className="font-headline-lg text-2xl font-bold text-white tracking-tight">
              KIN <span className="text-primary">Mobile</span>
            </h1>
            <p className="font-body-medium text-xs text-on-surface-variant mt-1 max-w-[280px]">
              {language === 'es'
                ? 'El puente financiero de tu familia en México'
                : "Your family's trusted financial bridge to Mexico"}
            </p>
          </div>

          {/* Auth Tab Switcher */}
          <div className="w-full bg-surface-container-low p-1 rounded-full shadow-inner flex items-center mb- space-y-0 mb-4 relative z-10 border border-white/5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-full font-title-base text-xs font-bold transition-all duration-200 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-surface-container-high text-primary shadow-md'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {language === 'es' ? 'Iniciar Sesión' : 'Log In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-full font-title-base text-xs font-bold transition-all duration-200 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-surface-container-high text-primary shadow-md'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {language === 'es' ? 'Registrarse' : 'Sign Up'}
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-3 px-3 py-2 rounded-xl bg-error/15 border border-error/30 text-error text-xs text-center animate-fade-in relative z-10">
              {errorMsg}
            </div>
          )}

          {/* Forms */}
          {authMode === 'register' ? (
            /* ========================================================================= */
            /* REGISTER FORM                                                             */
            /* ========================================================================= */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3 w-full relative z-10">
              {/* First Name & Last Name (2 columns) */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                <div className="flex flex-col gap-1">
                  <label className="font-caption-sm text-[11px] text-on-surface-variant">
                    {language === 'es' ? 'Nombre' : 'First Name'}
                  </label>
                  <div className="relative rounded-xl bg-surface-container px-3 py-2.5 flex items-center shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                    <input
                      className="w-full bg-transparent font-body-base text-xs text-white focus:outline-none placeholder:text-outline"
                      placeholder={language === 'es' ? 'Nombre' : 'First Name'}
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-caption-sm text-[11px] text-on-surface-variant">
                    {language === 'es' ? 'Apellidos' : 'Last Name'}
                  </label>
                  <div className="relative rounded-xl bg-surface-container px-3 py-2.5 flex items-center shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                    <input
                      className="w-full bg-transparent font-body-base text-xs text-white focus:outline-none placeholder:text-outline"
                      placeholder={language === 'es' ? 'Apellidos' : 'Last Name'}
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-caption-sm text-[11px] text-on-surface-variant">
                    {language === 'es' ? 'Número Celular (Móvil)' : 'Mobile Phone'}
                  </label>
                  <span className="font-label-caps text-[10px] text-primary font-bold">
                    {language === 'es' ? 'SMS Instantáneo' : 'Instant SMS'}
                  </span>
                </div>
                <div className="relative rounded-xl bg-surface-container px-3 py-2 flex items-center gap-2 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                  <div className="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-lg shadow-sm">
                    <select
                      value={phonePrefix}
                      onChange={(e) => setPhonePrefix(e.target.value)}
                      aria-label="Código de país"
                      className="bg-transparent text-xs font-financial-mono text-white focus:outline-none cursor-pointer"
                    >
                      <option value="+1" className="bg-[#1b1f2f] text-white">🇺🇸 +1</option>
                      <option value="+52" className="bg-[#1b1f2f] text-white">🇲🇽 +52</option>
                    </select>
                  </div>
                  <input
                    className="w-full bg-transparent font-financial-mono text-xs text-white focus:outline-none placeholder:text-outline"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <span
                    className="material-symbols-outlined text-primary text-[18px] flex-shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1">
                <label className="font-caption-sm text-[11px] text-on-surface-variant">
                  {language === 'es' ? 'Correo Electrónico' : 'Email Address'}
                </label>
                <div className="relative rounded-xl bg-surface-container px-3 py-2.5 flex items-center gap-2 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                  <span className="material-symbols-outlined text-outline text-[18px]">alternate_email</span>
                  <input
                    className="w-full bg-transparent font-body-base text-xs text-white focus:outline-none placeholder:text-outline"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Secure Password */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-caption-sm text-[11px] text-on-surface-variant">
                    {language === 'es' ? 'Contraseña Segura' : 'Secure Password'}
                  </label>
                  <span className="font-label-caps text-[10px] text-primary uppercase tracking-wider font-bold">
                    {language === 'es' ? 'Verde / Fuerte' : 'Strong / Protected'}
                  </span>
                </div>
                <div className="relative rounded-xl bg-surface-container px-3 py-2.5 flex items-center gap-2 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                  <span className="material-symbols-outlined text-outline text-[18px]">lock</span>
                  <input
                    className="w-full bg-transparent font-body-base text-xs text-white focus:outline-none placeholder:text-outline pr-7"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-outline hover:text-white transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {/* Password Strength Bars */}
                <div className="flex items-center gap-1.5 mt-1 px-0.5">
                  <div className="h-1 flex-1 rounded-full bg-primary shadow-[0_0_8px_rgba(87,242,191,0.6)]" />
                  <div className="h-1 flex-1 rounded-full bg-primary shadow-[0_0_8px_rgba(87,242,191,0.6)]" />
                  <div className="h-1 flex-1 rounded-full bg-primary shadow-[0_0_8px_rgba(87,242,191,0.6)]" />
                  <div className="h-1 flex-1 rounded-full bg-primary shadow-[0_0_8px_rgba(87,242,191,0.6)]" />
                </div>
              </div>

              {/* Remember & Recovery */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-surface-container accent-primary focus:ring-0 cursor-pointer"
                  />
                  <span className="font-caption-sm text-[11px] text-on-surface-variant">
                    {language === 'es' ? 'Recordar en este equipo' : 'Remember on this device'}
                  </span>
                </label>
                <Link
                  href="/recovery"
                  className="font-caption-sm text-[11px] text-secondary hover:underline"
                >
                  {language === 'es' ? '¿Olvidaste clave?' : 'Forgot pass?'}
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 py-3.5 rounded-full bg-primary text-on-primary font-headline-md text-sm font-bold flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(46,213,164,0.35)] active:scale-[0.98] transition-all hover:brightness-105 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#003828] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{language === 'es' ? 'Crear Cuenta Segura' : 'Create Secure Account'}</span>
                      <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleFaceIdAuth}
                  disabled={isFaceIdLoading}
                  className="w-full h-11 rounded-2xl bg-secondary-container/20 text-secondary font-title-base text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(112,71,235,0.25)] hover:bg-secondary-container/30 active:scale-[0.98] transition-all cursor-pointer border border-secondary/20"
                >
                  {isFaceIdLoading ? (
                    <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px] text-secondary">face</span>
                      <span>{language === 'es' ? 'Ingresar con Face ID ⚡' : 'Sign in with Face ID ⚡'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================================= */
            /* LOGIN FORM                                                                */
            /* ========================================================================= */
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3 w-full relative z-10">
              {/* Email Address */}
              <div className="flex flex-col gap-1">
                <label className="font-caption-sm text-[11px] text-on-surface-variant">
                  {language === 'es' ? 'Correo Electrónico' : 'Email Address'}
                </label>
                <div className="relative rounded-xl bg-surface-container px-3 py-2.5 flex items-center gap-2 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                  <span className="material-symbols-outlined text-outline text-[18px]">alternate_email</span>
                  <input
                    className="w-full bg-transparent font-body-base text-xs text-white focus:outline-none placeholder:text-outline"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-caption-sm text-[11px] text-on-surface-variant">
                    {language === 'es' ? 'Contraseña' : 'Password'}
                  </label>
                </div>
                <div className="relative rounded-xl bg-surface-container px-3 py-2.5 flex items-center gap-2 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-colors">
                  <span className="material-symbols-outlined text-outline text-[18px]">lock</span>
                  <input
                    className="w-full bg-transparent font-body-base text-xs text-white focus:outline-none placeholder:text-outline pr-7"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 text-outline hover:text-white transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showLoginPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-surface-container accent-primary focus:ring-0 cursor-pointer"
                  />
                  <span className="font-caption-sm text-[11px] text-on-surface-variant">
                    {language === 'es' ? 'Recordar en este equipo' : 'Remember me'}
                  </span>
                </label>
                <Link
                  href="/recovery"
                  className="font-caption-sm text-[11px] text-secondary hover:underline"
                >
                  {language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                </Link>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 py-3.5 rounded-full bg-primary text-on-primary font-headline-md text-sm font-bold flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(46,213,164,0.35)] active:scale-[0.98] transition-all hover:brightness-105 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#003828] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{language === 'es' ? 'Iniciar Sesión Segura' : 'Log In Securely'}</span>
                      <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleFaceIdAuth}
                  disabled={isFaceIdLoading}
                  className="w-full h-11 rounded-2xl bg-secondary-container/20 text-secondary font-title-base text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(112,71,235,0.25)] hover:bg-secondary-container/30 active:scale-[0.98] transition-all cursor-pointer border border-secondary/20"
                >
                  {isFaceIdLoading ? (
                    <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px] text-secondary">face</span>
                      <span>{language === 'es' ? 'Ingresar con Face ID ⚡' : 'Sign in with Face ID ⚡'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Institutional Compliance Badges */}
          <div className="mt-6 pt-4 flex flex-col items-center text-center gap-2 relative z-10 border-t border-white/5">
            <div className="flex items-center justify-center gap-2 flex-wrap text-on-surface-variant opacity-90 text-[11px]">
              <span className="flex items-center gap-1 font-caption-sm">
                <span className="material-symbols-outlined text-[14px] text-primary">verified_user</span>
                FinCEN Registrado
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-caption-sm">
                <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
                SPEI 24/7 Conectado
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-caption-sm">
                <span className="material-symbols-outlined text-[14px] text-primary">shield</span>
                Fondos FDIC
              </span>
            </div>
            <p className="font-caption-sm text-[10px] text-outline max-w-[320px] leading-relaxed">
              {language === 'es'
                ? 'Al continuar confirmas estar de acuerdo con los Términos de Servicio y el Aviso de Privacidad Biométrico KIN.'
                : 'By continuing you agree to KIN Terms of Service and Biometric Privacy Policy.'}
            </p>

            <Link
              href="/"
              className="text-primary text-xs hover:underline inline-flex items-center gap-1 font-semibold mt-1"
            >
              <span>{language === 'es' ? '← Ir directo al Dashboard' : '← Back to Dashboard'}</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
