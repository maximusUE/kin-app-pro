'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  StatusBatteryIcon,
  StatusWifiIcon,
  StatusCellularIcon,
  ChevronLeftIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  PhoneIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@/components/Icons';

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('login');
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  // Sign Up Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync language and query params from URL / localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('kin_language') as 'es' | 'en' | null;
      if (savedLang) setLanguage(savedLang);

      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'signup' || tabParam === 'login') {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleToggleLang = (lang: 'es' | 'en') => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kin_language', lang);
    }
  };

  const isSignUpValid =
    firstName.trim().length > 1 &&
    lastName.trim().length > 1 &&
    phone.trim().length >= 7 &&
    email.includes('@') &&
    password.length >= 6 &&
    password === confirmPassword &&
    agreeTerms;

  const isLoginValid = loginEmail.includes('@') && loginPassword.length >= 6;

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!isSignUpValid) {
      if (password !== confirmPassword) {
        setErrorMsg(language === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.');
      } else if (!agreeTerms) {
        setErrorMsg(
          language === 'es'
            ? 'Debes certificar que eres mayor de 18 años y aceptar los términos.'
            : 'You must certify you are 18+ and agree to terms.'
        );
      } else {
        setErrorMsg(
          language === 'es'
            ? 'Por favor completa todos los campos correctamente.'
            : 'Please fill all required fields correctly.'
        );
      }
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 800);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!isLoginValid) {
      setErrorMsg(
        language === 'es'
          ? 'Por favor ingresa tu correo y contraseña válida.'
          : 'Please enter your email and valid password.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 800);
  };

  return (
    <div className="min-h-[100dvh] bg-[#06070B] text-white flex justify-center selection:bg-[#7047EB]/30 selection:text-[#2ED5A4]">
      {/* Smartphone Frame Silhouette (Centered Flagship Mobile Device Viewport) */}
      <main className="phone-viewport w-full max-w-[400px] flex flex-col justify-between px-5 pt-3 pb-6 overflow-hidden relative">
        {/* Signature Bicolor Ambient Diffuse Glow */}
        <div className="bicolor-atmosphere-glow" />

        <div>
          {/* ========================================================================= */}
          {/* TOP STATUS BAR (9:41, Cellular, Wifi, Battery)                            */}
          {/* ========================================================================= */}
          <div className="flex items-center justify-between text-xs text-white/90 font-semibold mb-3 pt-1 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <StatusCellularIcon className="w-3.5 h-2.5 text-white" />
              <StatusWifiIcon className="w-3.5 h-2.5 text-white" />
              <StatusBatteryIcon className="w-5 h-2.5 text-white" />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TOP NAVIGATION / HEADER (Back Button + KIN Branding + Lang + Badge)        */}
          {/* ========================================================================= */}
          <header className="flex items-center justify-between py-1 mb-3">
            <Link
              href="/"
              className="btn-circle"
              title={language === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard'}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2ED5A4] to-[#1EA77F] flex items-center justify-center font-black text-white text-lg shadow-glow-mint">
                K
              </div>
              <span className="text-xl font-bold tracking-tight text-white">KIN</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="flex items-center bg-[#181928] p-0.5 rounded-full border border-white/10 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleToggleLang('es')}
                  className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                    language === 'es' ? 'bg-[#2ED5A4] text-white' : 'text-[#8E91A5] hover:text-white'
                  }`}
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleLang('en')}
                  className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                    language === 'en' ? 'bg-[#2ED5A4] text-white' : 'text-[#8E91A5] hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* 256-bit Security Badge */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#181928] border border-white/10 text-[11px] text-[#8E91A5]">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-[#2ED5A4]" />
                <span className="font-semibold text-white">256-bit</span>
              </div>
            </div>
          </header>

          {/* Title & Greeting */}
          <div className="text-center mt-2 mb-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {activeTab === 'signup'
                ? language === 'es'
                  ? '¡Crea tu Cuenta KIN!'
                  : "Let's Create Account!"
                : language === 'es'
                ? '¡Bienvenido de Nuevo!'
                : 'Hello, Welcome Back!'}
            </h1>
            <p className="text-xs text-[#8E91A5] mt-1 font-normal max-w-[320px] mx-auto leading-relaxed">
              {activeTab === 'signup'
                ? language === 'es'
                  ? 'Comienza a enviar dinero a México al mejor tipo de cambio garantizado.'
                  : "Welcome! Let's get started by creating your fresh KIN account."
                : language === 'es'
                ? 'Ingresa tus credenciales seguras para acceder a tu billetera y cotizador.'
                : 'Please enter your email and password details to access your account.'}
            </p>
          </div>

          {/* Pill Tab Switcher */}
          <div className="auth-pill-bar mb-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
              className={`auth-tab-button ${activeTab === 'login' ? 'active' : ''}`}
            >
              {language === 'es' ? 'Iniciar Sesión' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg(null);
              }}
              className={`auth-tab-button ${activeTab === 'signup' ? 'active' : ''}`}
            >
              {language === 'es' ? 'Crear Cuenta' : 'Sign Up'}
            </button>
          </div>

          {/* Error notification if any */}
          {errorMsg && (
            <div className="mb-3 px-4 py-2.5 rounded-2xl bg-[#E06C75]/10 border border-[#E06C75]/30 text-[#E06C75] text-xs text-center animate-fade-in">
              {errorMsg}
            </div>
          )}

          {/* Form Container */}
          {activeTab === 'signup' ? (
            /* ========================================================================= */
            /* SIGN UP FORM                                                              */
            /* ========================================================================= */
            <form onSubmit={handleSignUpSubmit} className="space-y-3 animate-fade-in">
              {/* First Name & Last Name (2 columns) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="auth-input-group">
                  <div className="auth-input-icon">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder={language === 'es' ? 'Nombre(s)' : 'First Name'}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="auth-input-field text-white"
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <div className="auth-input-icon">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder={language === 'es' ? 'Apellidos' : 'Last Name'}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="auth-input-field text-white"
                    required
                  />
                </div>
              </div>

              {/* Phone Number with Country Selector */}
              <div className="auth-input-group">
                <div className="auth-phone-prefix">
                  <PhoneIcon className="w-3.5 h-3.5 mr-1 text-[#2ED5A4]" />
                  <select
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    aria-label="Código de país telefónico"
                    className="auth-phone-select text-white font-bold"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+52">🇲🇽 +52</option>
                  </select>
                </div>
                <input
                  type="tel"
                  placeholder={language === 'es' ? 'Número Celular' : 'Phone Number'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="auth-input-field text-white"
                  style={{ paddingLeft: '12px' }}
                  required
                />
              </div>

              {/* Email Address */}
              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <MailIcon className="w-4 h-4 text-white" />
                </div>
                <input
                  type="email"
                  placeholder={language === 'es' ? 'Correo Electrónico' : 'Email Address'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input-field text-white"
                  required
                />
              </div>

              {/* Password & Confirm Password (2 columns) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="auth-input-group">
                  <div className="auth-input-icon">
                    <LockIcon className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={language === 'es' ? 'Contraseña' : 'Create Pass'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input-field has-right-action text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-right-toggle text-white hover:text-[#2ED5A4]"
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>

                <div className="auth-input-group">
                  <div className="auth-input-icon">
                    <LockIcon className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={language === 'es' ? 'Confirmar' : 'Confirm Pass'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input-field has-right-action text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-right-toggle text-white hover:text-[#2ED5A4]"
                    aria-label="Mostrar u ocultar confirmación de contraseña"
                  >
                    {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox 18+ and Terms */}
              <div className="flex items-start gap-2 pt-1 px-1">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#2ED5A4', cursor: 'pointer' }}
                />
                <label htmlFor="terms-checkbox" className="text-[11px] text-[#8E91A5] leading-tight cursor-pointer">
                  {language === 'es' ? (
                    <>
                      Certifico que soy mayor de 18 años y acepto los{' '}
                      <span className="text-white hover:underline font-semibold">Términos de Servicio</span> y la{' '}
                      <span className="text-white hover:underline font-semibold">Política de Privacidad</span>.
                    </>
                  ) : (
                    <>
                      I certify that I am 18 years or older, and agree to the{' '}
                      <span className="text-white hover:underline font-semibold">User Agreement</span> and{' '}
                      <span className="text-white hover:underline font-semibold">Privacy Policy</span>.
                    </>
                  )}
                </label>
              </div>

              {/* Primary CTA: Sign Up */}
              <button
                type="submit"
                disabled={isLoading}
                className={`auth-btn-cta mt-2 ${isSignUpValid ? 'active' : 'disabled'}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-white font-black tracking-wide">
                    {language === 'es' ? 'Crear Cuenta Segura' : 'Sign Up'}
                  </span>
                )}
              </button>
            </form>
          ) : (
            /* ========================================================================= */
            /* LOGIN FORM                                                                */
            /* ========================================================================= */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 animate-fade-in">
              {/* Email Address */}
              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <MailIcon className="w-4 h-4 text-white" />
                </div>
                <input
                  type="email"
                  placeholder={language === 'es' ? 'Correo Electrónico' : 'Email Address'}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="auth-input-field text-white"
                  required
                />
              </div>

              {/* Password */}
              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <LockIcon className="w-4 h-4 text-white" />
                </div>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder={language === 'es' ? 'Contraseña' : 'Password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="auth-input-field has-right-action text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="auth-right-toggle text-white hover:text-[#2ED5A4]"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showLoginPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end pr-1">
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      language === 'es'
                        ? 'Se ha enviado un enlace seguro de recuperación a tu correo registrado.'
                        : 'A secure recovery link has been sent to your registered email.'
                    )
                  }
                  className="text-xs text-[#8E91A5] hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot Password?'}
                </button>
              </div>

              {/* Primary CTA: Log In */}
              <button
                type="submit"
                disabled={isLoading}
                className={`auth-btn-cta mt-2 ${isLoginValid ? 'active' : 'disabled'}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-white font-black tracking-wide">
                    {language === 'es' ? 'Iniciar Sesión Segura' : 'Log In'}
                  </span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer / Terms summary & Quick Link to Dashboard */}
        <footer className="text-center pt-4 pb-2 text-[11px] text-[#8E91A5]">
          <p>
            {language === 'es'
              ? 'Protegido por Cifrado Bancario Zero-Knowledge & Rieles SPEI Banxico.'
              : 'Protected by KIN Zero-Knowledge Security & SPEI Banxico Rails.'}
          </p>
          <div className="mt-2">
            <Link
              href="/"
              className="text-[#2ED5A4] hover:underline inline-flex items-center gap-1 font-semibold"
            >
              {language === 'es'
                ? 'Entrar directo al Cotizador Dashboard'
                : 'Enter directly to Quote Dashboard'}{' '}
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
