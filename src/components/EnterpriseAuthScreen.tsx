'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { capitalizeWords } from '@/lib/utils/capitalize';

export interface KinAuthUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  avatar?: string;
  clientId?: string;
  memberSince?: string;
  docType?: string;
  docNumber?: string;
  kycTier?: string;
  dailyLimit?: string;
  dailyLimitUSD?: number;
  monthlyLimitUSD?: number;
  balanceUSD?: number;
  role?: string;
  isMasterAdmin?: boolean;
}

export interface EnterpriseAuthScreenProps {
  onLoginSuccess?: (userData: KinAuthUser) => void;
  initialMode?: 'login' | 'register';
}

// Pre-seeded Master Account for Don César
const DON_CESAR_ACCOUNT: KinAuthUser = {
  id: 'user_cesar_ugalde',
  firstName: 'Cesar',
  lastName: 'Ugalde',
  name: 'Cesar Ugalde',
  email: 'airygc7@gmail.com',
  phone: '+1 (347) 248-3668',
  address1: 'San Antonio, Texas',
  city: 'San Antonio',
  state: 'Texas',
  zip: '78201',
  country: 'Estados Unidos 🇺🇸',
  avatar: '',
  clientId: 'KIN-MASTER-001',
  memberSince: '27 Sep 2026',
  docType: 'Credencial Maestro de Operador KIN',
  docNumber: 'KIN-CEO-0001',
  kycTier: 'Tier 3 — Propietario / Master Admin',
  dailyLimit: '$100,000.00 USD / día',
  dailyLimitUSD: 100000,
  monthlyLimitUSD: 500000,
  balanceUSD: 10000.00,
  role: 'MASTER_ADMIN',
  isMasterAdmin: true,
};

// Supported Country Codes for Immigrant Remittances
const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'USA', mask: '(XXX) XXX-XXXX', len: 10 },
  { code: '+52', flag: '🇲🇽', name: 'México', mask: 'XX XXXX-XXXX', len: 10 },
  { code: '+1', flag: '🇨🇦', name: 'Canadá', mask: '(XXX) XXX-XXXX', len: 10 },
  { code: '+57', flag: '🇨🇴', name: 'Colombia', mask: 'XXX XXX-XXXX', len: 10 },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala', mask: 'XXXX-XXXX', len: 8 },
];

export function EnterpriseAuthScreen({
  onLoginSuccess,
  initialMode = 'login',
}: EnterpriseAuthScreenProps) {
  // Mode & Language
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  // Phone Stream State
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [rawPhone, setRawPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Email Stream State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);

  // Loaders
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'apple' | 'google' | 'faceid' | null>(null);

  // Refs for OTP input traversal
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Hydrate language preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('kin_language');
      if (savedLang === 'es' || savedLang === 'en') {
        setLanguage(savedLang);
      }
    }
  }, []);

  const handleLanguageToggle = (newLang: 'es' | 'en') => {
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kin_language', newLang);
    }
  };

  // Resend OTP Countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Phone input formatting mask
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, selectedCountry.len);
    setRawPhone(cleaned);

    // Apply clean visual formatting
    if (selectedCountry.code === '+1') {
      if (cleaned.length === 0) setFormattedPhone('');
      else if (cleaned.length <= 3) setFormattedPhone(`(${cleaned}`);
      else if (cleaned.length <= 6) setFormattedPhone(`(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`);
      else setFormattedPhone(`(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`);
    } else if (selectedCountry.code === '+52') {
      if (cleaned.length === 0) setFormattedPhone('');
      else if (cleaned.length <= 2) setFormattedPhone(cleaned);
      else if (cleaned.length <= 6) setFormattedPhone(`${cleaned.slice(0, 2)} ${cleaned.slice(2)}`);
      else setFormattedPhone(`${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`);
    } else {
      setFormattedPhone(cleaned);
    }
  };

  // OTP Digit change handler
  const handleOtpDigitChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    // Auto-advance
    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 filled
    if (newDigits.every((d) => d !== '')) {
      handleVerifyOtp(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < paste.length; i++) {
      newDigits[i] = paste[i];
    }
    setOtpDigits(newDigits);
    if (paste.length === 6) {
      handleVerifyOtp(paste);
    } else {
      otpInputRefs.current[Math.min(paste.length, 5)]?.focus();
    }
  };

  // Trigger Send OTP
  const handleSendOtp = () => {
    if (rawPhone.length < selectedCountry.len) {
      toast.error(
        language === 'es'
          ? `Por favor ingresa un número válido de ${selectedCountry.len} dígitos`
          : `Please enter a valid ${selectedCountry.len}-digit phone number`
      );
      return;
    }

    setIsLoading(true);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([15]);
    }

    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setResendCooldown(45);
      toast.success(
        language === 'es'
          ? `Código de seguridad enviado a ${selectedCountry.code} ${formattedPhone}`
          : `Security code sent to ${selectedCountry.code} ${formattedPhone}`
      );
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    }, 700);
  };

  // Verify OTP
  const handleVerifyOtp = (code: string) => {
    setIsLoading(true);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([20, 40, 20]);
    }

    setTimeout(() => {
      setIsLoading(false);
      // If Don César's phone
      const fullPhone = `${selectedCountry.code} ${rawPhone}`;
      const isDonCesar = rawPhone.includes('3472483668') || fullPhone.includes('347');
      const userToLogin = isDonCesar
        ? DON_CESAR_ACCOUNT
        : {
            id: `user_${Date.now()}`,
            firstName: firstName || 'Usuario',
            lastName: lastName || 'KIN',
            name: `${firstName || 'Usuario'} ${lastName || 'KIN'}`.trim(),
            email: email || `${rawPhone}@kin.user`,
            phone: `${selectedCountry.code} ${formattedPhone}`,
            city: 'Los Ángeles',
            state: 'California',
            country: selectedCountry.name,
            kycTier: 'Tier 1 — Básico',
            dailyLimitUSD: 750,
            monthlyLimitUSD: 2500,
            balanceUSD: 150.00,
          };

      persistSessionAndNotify(userToLogin);
    }, 850);
  };

  // Handle Email Login / Register
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error(language === 'es' ? 'Ingresa un correo electrónico válido' : 'Enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      toast.error(
        language === 'es' ? 'La contraseña debe tener al menos 6 caracteres' : 'Password must be at least 6 characters'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const isDonCesar = email.toLowerCase().trim() === 'airygc7@gmail.com';
      const userToLogin = isDonCesar
        ? DON_CESAR_ACCOUNT
        : {
            id: `user_${Date.now()}`,
            firstName: firstName || capitalizeWords(email.split('@')[0]),
            lastName: lastName || '',
            name: firstName ? `${firstName} ${lastName}`.trim() : capitalizeWords(email.split('@')[0]),
            email: email,
            phone: '+1 (555) 000-0000',
            city: 'Dallas',
            state: 'Texas',
            country: 'Estados Unidos 🇺🇸',
            kycTier: 'Tier 1 — Básico',
            dailyLimitUSD: 750,
            monthlyLimitUSD: 2500,
            balanceUSD: 250.00,
          };

      persistSessionAndNotify(userToLogin);
    }, 750);
  };

  // Social OAuth Simulation & WebAuthn Biometrics
  const handleSocialOAuth = (provider: 'apple' | 'google' | 'faceid') => {
    setOauthLoading(provider);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([provider === 'faceid' ? 30 : 15]);
    }

    const providerNames = {
      apple: 'Apple ID',
      google: 'Google Account',
      faceid: 'Face ID / Passkey',
    };

    toast.info(
      language === 'es'
        ? `Autenticando de forma segura con ${providerNames[provider]}...`
        : `Authenticating securely with ${providerNames[provider]}...`
    );

    setTimeout(() => {
      setOauthLoading(null);
      // Auto-authenticates as Don César in executive sandbox
      persistSessionAndNotify(DON_CESAR_ACCOUNT);
    }, 1100);
  };

  // Save session & dispatch callback
  const persistSessionAndNotify = (user: KinAuthUser) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kin_active_user', JSON.stringify(user));
      sessionStorage.setItem('kin_auth', 'true');
    }
    toast.success(
      language === 'es'
        ? `¡Bienvenido de nuevo, ${user.firstName || user.name}!`
        : `Welcome back, ${user.firstName || user.name}!`
    );
    onLoginSuccess?.(user);
  };

  // Translations dictionary
  const t = {
    tagline: language === 'es' ? 'Finanzas Familiares Sin Fronteras' : 'Border-Free Family Finance',
    welcomeBack: language === 'es' ? 'Bienvenido a KIN' : 'Welcome to KIN',
    createAccount: language === 'es' ? 'Crea tu Cuenta Segura' : 'Create Secure Account',
    heroSubLogin:
      language === 'es'
        ? 'El puente financiero de tu familia. Envía remesas a México, transfiere con KINCash y paga facturas al instante.'
        : 'The financial bridge for your family. Send remittances to Mexico, transfer via KINCash, and pay bills instantly.',
    heroSubRegister:
      language === 'es'
        ? 'Únete a la plataforma financiera más justa y transparente para la comunidad latina en EE.UU.'
        : 'Join the most fair and transparent financial platform for the Latino community in the US.',
    appleBtn: language === 'es' ? 'Continuar con Apple' : 'Continue with Apple',
    googleBtn: language === 'es' ? 'Continuar con Google' : 'Continue with Google',
    faceIdBtn: language === 'es' ? 'Acceder con Face ID / Huella' : 'Sign in with Face ID / Touch ID',
    orDivider: language === 'es' ? 'O CON TU TELÉFONO O CORREO' : 'OR WITH YOUR PHONE OR EMAIL',
    tabPhone: language === 'es' ? '📱 Teléfono (SMS)' : '📱 Phone (SMS)',
    tabEmail: language === 'es' ? '✉️ Correo' : '✉️ Email',
    phoneLabel: language === 'es' ? 'Número de Teléfono Móvil' : 'Mobile Phone Number',
    sendCodeBtn: language === 'es' ? 'Enviar Código de Seguridad' : 'Send Security Code',
    otpSubtitle: (phoneStr: string) =>
      language === 'es'
        ? `Ingresa el código de 6 dígitos enviado al ${phoneStr}`
        : `Enter the 6-digit code sent to ${phoneStr}`,
    resendIn: (sec: number) =>
      language === 'es' ? `Reenviar código en ${sec}s` : `Resend code in ${sec}s`,
    resendNow: language === 'es' ? 'Reenviar código ahora' : 'Resend code now',
    changePhone: language === 'es' ? 'Cambiar número' : 'Change number',
    verifyBtn: language === 'es' ? 'Verificar y Continuar' : 'Verify & Continue',
    firstNameLabel: language === 'es' ? 'Nombre(s)' : 'First Name',
    lastNameLabel: language === 'es' ? 'Apellido(s)' : 'Last Name',
    emailLabel: language === 'es' ? 'Correo Electrónico' : 'Email Address',
    passwordLabel: language === 'es' ? 'Contraseña' : 'Password',
    rememberMe: language === 'es' ? 'Recordar este dispositivo' : 'Remember this device',
    forgotPassword: language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?',
    submitLogin: language === 'es' ? 'Iniciar Sesión Segura' : 'Sign In Securely',
    submitRegister: language === 'es' ? 'Crear Cuenta en KIN' : 'Create KIN Account',
    noAccount: language === 'es' ? '¿No tienes cuenta?' : "Don't have an account?",
    hasAccount: language === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?',
    signUpLink: language === 'es' ? 'Regístrate aquí' : 'Sign up here',
    signInLink: language === 'es' ? 'Inicia sesión' : 'Sign in',
    fastPass: language === 'es' ? '⚡ Acceso Rápido Ejecutivo (Don César - Master Admin)' : '⚡ Executive Fast-Pass (Don César - Master Admin)',
    securityTitle: language === 'es' ? 'Cifrado de Grado Bancario AES-256' : 'Bank-Grade AES-256 Encryption',
    securitySub:
      language === 'es'
        ? 'Regulado por FinCEN (USA) • Conexión Directa SPEI Banco de México'
        : 'FinCEN Registered MSB (USA) • Direct Banxico SPEI Connection',
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#06070B] text-white flex justify-center selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
      {/* Background Ambient Glows (Tier-1 Depth) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-b from-emerald-600/15 via-emerald-800/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[450px] h-[300px] bg-gradient-to-t from-emerald-950/20 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Main Container */}
      <div className="w-full max-w-[420px] min-h-[100dvh] flex flex-col justify-between px-5 py-6 sm:py-8 relative z-10">
        {/* ========================================================================= */}
        {/* TOP BRAND BAR & BILINGUAL LANGUAGE PILL                                   */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between pt-1 pb-4">
          {/* Official KIN Logomark */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-950 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)] border border-emerald-400/40">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[20px] tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  KIN
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium tracking-wide">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Bilingual Glassmorphic Switch */}
          <div className="bg-[#12131D]/90 backdrop-blur-md p-1 rounded-full border border-white/10 flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => handleLanguageToggle('es')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                language === 'es'
                  ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(5,150,105,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                language === 'en'
                  ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(5,150,105,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO TITLE & SUBTITLE                                                     */}
        {/* ========================================================================= */}
        <div className="my-3">
          <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-white">
            {authMode === 'login' ? t.welcomeBack : t.createAccount}
          </h1>
          <p className="text-xs sm:text-[13px] text-zinc-400 mt-1.5 leading-relaxed">
            {authMode === 'login' ? t.heroSubLogin : t.heroSubRegister}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* TIER-1 FEDERATED SOCIAL IDENTITY (APPLE & GOOGLE OAUTH)                   */}
        {/* ========================================================================= */}
        <div className="space-y-2.5 my-3">
          {/* Apple ID Button */}
          <button
            type="button"
            disabled={oauthLoading !== null}
            onClick={() => handleSocialOAuth('apple')}
            className="w-full h-[52px] rounded-2xl bg-black hover:bg-zinc-900 border border-white/20 hover:border-white/35 text-white font-semibold text-[15px] flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.5)] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
          >
            {oauthLoading === 'apple' ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.98-5.64-8.7-10.1-18.7-13.37-30.01-3.26-11.31-4.9-22.18-4.9-32.61 0-14.13 3.69-26.08 11.08-35.85 7.39-9.77 16.54-14.75 27.45-14.95 4.8 0 10.3 1.25 16.52 3.75 6.22 2.5 10.37 3.82 12.45 3.97 1.83-.15 6.07-1.47 12.74-3.97 6.66-2.5 12.02-3.66 16.08-3.48 12.19.64 21.94 4.84 29.25 12.61-10.66 6.44-15.88 15.22-15.66 26.33.22 8.7 3.63 16.09 10.23 22.18 6.6 6.09 14.59 9.68 23.97 10.77-2.17 6.3-4.67 12.44-7.5 18.42m-33.8-109.84c.1-4.56-1.52-9.13-4.87-13.7-3.35-4.57-7.66-7.88-12.93-9.93-.11 4.56 1.48 9.07 4.77 13.53 3.29 4.46 7.63 7.82 13.03 10.1" />
                </svg>
                <span>{t.appleBtn}</span>
              </>
            )}
          </button>

          {/* Google Button */}
          <button
            type="button"
            disabled={oauthLoading !== null}
            onClick={() => handleSocialOAuth('google')}
            className="w-full h-[52px] rounded-2xl bg-[#12131F] hover:bg-[#181A2A] border border-white/10 hover:border-white/25 text-white font-semibold text-[15px] flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
          >
            {oauthLoading === 'google' ? (
              <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{t.googleBtn}</span>
              </>
            )}
          </button>

          {/* Biometric Face ID Trigger */}
          <button
            type="button"
            disabled={oauthLoading !== null}
            onClick={() => handleSocialOAuth('faceid')}
            className="w-full h-[50px] rounded-2xl bg-gradient-to-r from-emerald-950/60 via-emerald-900/40 to-emerald-950/60 border border-emerald-500/35 hover:border-emerald-400/60 text-emerald-300 font-semibold text-[14px] flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.12)] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
          >
            {oauthLoading === 'faceid' ? (
              <div className="w-5 h-5 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 3H5a2 2 0 0 0-2 2v2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M3 17v2a2 2 0 0 0 2 2h2" />
                  <path d="M9 9h.01" />
                  <path d="M15 9h.01" />
                  <path d="M10 13c.5 1 1.5 1.5 2 1.5s1.5-.5 2-1.5" />
                </svg>
                <span>{t.faceIdBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* DELICATE DIVIDER                                                          */}
        {/* ========================================================================= */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
            <span className="bg-[#06070B] px-3 text-zinc-400">
              {t.orDivider}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* AUTH METHOD SELECTOR (PHONE SMS VS EMAIL)                                 */}
        {/* ========================================================================= */}
        <div className="bg-[#12131D]/80 backdrop-blur-md p-1 rounded-2xl border border-white/10 flex items-center mb-4">
          <button
            type="button"
            onClick={() => {
              setMethod('phone');
              setIsOtpSent(false);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 ${
              method === 'phone'
                ? 'bg-emerald-600 text-white shadow-[0_2px_12px_rgba(5,150,105,0.35)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.tabPhone}
          </button>
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 ${
              method === 'email'
                ? 'bg-emerald-600 text-white shadow-[0_2px_12px_rgba(5,150,105,0.35)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.tabEmail}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* METHOD 1: PHONE-FIRST STREAM WITH ANIMATED 6-DIGIT OTP                    */}
        {/* ========================================================================= */}
        {method === 'phone' && (
          <div className="space-y-4">
            {!isOtpSent ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    {t.phoneLabel}
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Country Code Picker */}
                    <div className="relative">
                      <select
                        value={selectedCountry.name}
                        onChange={(e) => {
                          const found = COUNTRY_CODES.find((c) => c.name === e.target.value);
                          if (found) {
                            setSelectedCountry(found);
                            setRawPhone('');
                            setFormattedPhone('');
                          }
                        }}
                        className="h-[52px] px-3 pr-7 rounded-2xl bg-[#12131D] border border-white/10 text-white text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.name} value={c.name} className="bg-[#12131D] text-white">
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <input
                      type="tel"
                      value={formattedPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder={selectedCountry.mask}
                      className="flex-1 h-[52px] px-4 rounded-2xl bg-[#12131D] border border-white/10 text-white text-[16px] font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoading || rawPhone.length < selectedCountry.len}
                  onClick={handleSendOtp}
                  className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(16,185,129,0.35)] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>{t.sendCodeBtn}</span>
                  )}
                </button>
              </>
            ) : (
              /* OTP 6-Digit Screen */
              <div className="space-y-4 pt-1">
                <div className="text-center">
                  <p className="text-xs text-zinc-400">
                    {t.otpSubtitle(`${selectedCountry.code} ${formattedPhone}`)}
                  </p>
                </div>

                {/* 6 Individual Digit Boxes */}
                <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-12 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-xl bg-[#141523] border border-white/15 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 text-emerald-400 focus:outline-none transition-all"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  disabled={isLoading || otpDigits.some((d) => !d)}
                  onClick={() => handleVerifyOtp(otpDigits.join(''))}
                  className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(16,185,129,0.35)] active:scale-[0.98] transition-all duration-150 disabled:opacity-40"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>{t.verifyBtn}</span>
                  )}
                </button>

                {/* Countdown / Resend / Back */}
                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false);
                      setOtpDigits(['', '', '', '', '', '']);
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    ← {t.changePhone}
                  </button>

                  {resendCooldown > 0 ? (
                    <span className="text-zinc-400">{t.resendIn(resendCooldown)}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                    >
                      {t.resendNow}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* METHOD 2: EMAIL & PASSWORD STREAM                                         */}
        {/* ========================================================================= */}
        {method === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            {authMode === 'register' && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    {t.firstNameLabel}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Ej. Juan"
                    className="w-full h-[48px] px-3.5 rounded-2xl bg-[#12131D] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    {t.lastNameLabel}
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Ej. Pérez"
                    className="w-full h-[48px] px-3.5 rounded-2xl bg-[#12131D] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                {t.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu.correo@ejemplo.com"
                className="w-full h-[50px] px-4 rounded-2xl bg-[#12131D] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-400">
                  {t.passwordLabel}
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() =>
                      toast.info(
                        language === 'es'
                          ? 'Enlace de restablecimiento enviado a tu correo'
                          : 'Reset link sent to your email'
                      )
                    }
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {t.forgotPassword}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-[50px] px-4 pr-11 rounded-2xl bg-[#12131D] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <input
                id="remember"
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-[#12131D] text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="remember" className="text-xs text-zinc-400 cursor-pointer">
                {t.rememberMe}
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(16,185,129,0.35)] active:scale-[0.98] transition-all duration-150 disabled:opacity-40"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{authMode === 'login' ? t.submitLogin : t.submitRegister}</span>
              )}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TOGGLE LOGIN / REGISTER MODES                                             */}
        {/* ========================================================================= */}
        <div className="text-center my-3">
          <p className="text-xs text-zinc-400">
            {authMode === 'login' ? t.noAccount : t.hasAccount}{' '}
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setIsOtpSent(false);
              }}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors ml-1"
            >
              {authMode === 'login' ? t.signUpLink : t.signInLink}
            </button>
          </p>
        </div>

        {/* ========================================================================= */}
        {/* EXECUTIVE SANDBOX FAST-PASS (DON CÉSAR DIRECT ACCESS)                     */}
        {/* ========================================================================= */}
        <div className="my-2">
          <button
            type="button"
            onClick={() => persistSessionAndNotify(DON_CESAR_ACCOUNT)}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>{t.fastPass}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* INSTITUTIONAL TRUST & REGULATORY BADGES                                   */}
        {/* ========================================================================= */}
        <div className="pt-3 border-t border-white/5 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-zinc-400">
            <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>{t.securityTitle}</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-tight">
            {t.securitySub}
          </p>
        </div>
      </div>
    </div>
  );
}
