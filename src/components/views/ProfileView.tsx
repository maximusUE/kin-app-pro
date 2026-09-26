'use client';

import React from 'react';
import {
  ChevronLeftIcon,
  SettingsGearIcon,
  CameraIcon,
  CopyIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  HouseRentIcon,
  RosetteBadgeCheckIcon,
  ShieldCheckIcon,
  CardOutlineIcon,
  LockIcon,
  BankBuildingIcon,
  ChevronRightIcon,
} from '@/components/Icons';
import { ToggleSwitch } from '@/components/AppSettingsModal';

export interface ProfileViewProps {
  onBack: () => void;
  onOpenSettings: () => void;
  userKycTier: string;
  userAvatar: string | null;
  userName: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  handleOpenAvatarPicker: () => void;
  handleCopyClientId: () => void;
  userClientId: string;
  copiedClientId: boolean;
  userPhone: string;
  userCity: string;
  userState: string;
  userZip: string;
  userMemberSince: string;
  userDailyLimit: string;
  userDocType: string;
  userDocNumber: string;
  onOpenVault: () => void;
  biometricsEnabled: boolean;
  setBiometricsEnabled: (enabled: boolean) => void;
  pushNotificationsEnabled: boolean;
  setPushNotificationsEnabled: (enabled: boolean) => void;
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  userId: string | null;
  currencyPref: 'USD' | 'MXN';
  handleToggleCurrency: (curr: 'USD' | 'MXN') => void;
  theme: 'dark' | 'light';
  handleToggleTheme: (theme: 'dark' | 'light') => void;
  handleLogout: () => void;
}

export function ProfileView({
  onBack,
  onOpenSettings,
  userKycTier,
  userAvatar,
  userName,
  userFirstName,
  userLastName,
  userEmail,
  handleOpenAvatarPicker,
  handleCopyClientId,
  userClientId,
  copiedClientId,
  userPhone,
  userCity,
  userState,
  userZip,
  userMemberSince,
  userDailyLimit,
  userDocType,
  userDocNumber,
  onOpenVault,
  biometricsEnabled,
  setBiometricsEnabled,
  pushNotificationsEnabled,
  setPushNotificationsEnabled,
  language,
  setLanguage,
  userId,
  currencyPref,
  handleToggleCurrency,
  theme,
  handleToggleTheme,
  handleLogout,
}: ProfileViewProps) {
  const isEn = language === 'en';

  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent(
      isEn
        ? `Hello KIN Concierge, I need assistance with my account ID ${userClientId || 'KIN-US-892401'}`
        : `Hola Concierge KIN, necesito asistencia con mi cuenta ID ${userClientId || 'KIN-US-892401'}`
    );
    window.open(`https://wa.me/15550192834?text=${message}`, '_blank');
  };

  return (
    <div className="animate-fade-in space-y-4 pb-8 relative">
      {/* Glow Difuminado Ambiental Bicolor (Dribbble Signature Glow) */}
      <div className="bicolor-atmosphere-glow" />

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION HEADER                                                 */}
      {/* ========================================================================= */}
      <header className="relative z-10 flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onBack}
          className="btn-circle"
          title={isEn ? 'Back to Home' : 'Volver al Inicio'}
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-bold text-white tracking-wide">
            {isEn ? 'My Profile' : 'Mi Perfil'}
          </h1>
          <p className="text-[10px] text-[#2ED5A4] font-medium flex items-center justify-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
            {userKycTier ? userKycTier.split(' (')[0] : 'Tier 2'} • {isEn ? 'Active Account' : 'Cuenta Verificada'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="btn-circle"
          title={isEn ? 'Settings' : 'Configuración'}
        >
          <SettingsGearIcon className="w-5 h-5 text-white" />
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO IDENTITY & METRIC KPI CARD (DRIBBLE MASTER FUSION)                */}
      {/* ========================================================================= */}
      <div className="relative z-10 p-5 rounded-3xl bg-gradient-to-b from-[#181928]/95 to-[#121320]/95 border border-white/10 text-center shadow-2xl backdrop-blur-xl space-y-3.5 overflow-hidden">
        {/* Radial highlight interno */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-br from-[#2ED5A4]/20 to-[#7047EB]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Avatar 76px con borde gradiente y micro-badge de cámara */}
        <div className="relative inline-block mx-auto">
          <div className="w-[76px] h-[76px] rounded-full p-[2.5px] bg-gradient-to-br from-[#2ED5A4] via-[#2ED5A4]/70 to-[#7047EB] shadow-[0_0_24px_rgba(46,213,164,0.3)] flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#181928] flex items-center justify-center">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName || 'Perfil'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#202236] text-[#8E91A5]">
                  <span className="material-symbols-outlined text-[36px] text-[#8E91A5]">person</span>
                </div>
              )}
            </div>
          </div>

          {/* Micro-badge de cámara interactivo */}
          <button
            type="button"
            onClick={handleOpenAvatarPicker}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#181928] border-2 border-[#2ED5A4] flex items-center justify-center text-[#2ED5A4] shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title={isEn ? 'Change profile photo' : 'Cambiar foto de perfil'}
          >
            <CameraIcon className="w-3.5 h-3.5 text-[#2ED5A4]" />
          </button>
        </div>

        {/* Nombre y Correo */}
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>{userFirstName || 'César'} {userLastName || 'Uceda'}</span>
            <span className="material-symbols-outlined text-[19px] text-[#2ED5A4]">verified</span>
          </h2>
          <p className="text-xs text-[#8E91A5] font-medium mt-0.5">{userEmail || 'cesar@kin.app'}</p>
        </div>

        {/* Badges de Folio ID de Cliente & KYC */}
        <div className="flex items-center justify-center gap-2 pt-0.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopyClientId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#202236]/90 border border-white/10 text-xs font-bold text-white hover:border-[#2ED5A4]/60 active:scale-95 transition-all cursor-pointer shadow-sm"
            title={isEn ? 'Click to copy Client ID' : 'Copiar Folio de Cliente'}
          >
            <span className="text-[#8E91A5] font-medium text-[11px]">ID:</span>
            <span className="font-mono text-[11px] text-[#2ED5A4] font-semibold">{userClientId || 'KIN-US-892401'}</span>
            <CopyIcon className="w-3 h-3 text-[#8E91A5]" />
            {copiedClientId && (
              <span className="text-[10px] text-[#2ED5A4] font-bold animate-fade-in">✓</span>
            )}
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-xs font-bold text-[#2ED5A4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4]" />
            <span>{isEn ? 'KYC Tier 2' : 'KYC Tier 2'}</span>
          </div>
        </div>

        {/* 3 Metric KPI Cards (Dribbble Master Inspiration) */}
        <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10">
          {/* Card 1: Envíos SPEI */}
          <div className="p-2.5 rounded-2xl bg-[#202236]/70 border border-white/5 flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-1 text-[#2ED5A4]">
              <span className="material-symbols-outlined text-[15px]">send_money</span>
              <span className="text-base font-black text-white tracking-tight">128</span>
            </div>
            <span className="text-[10px] font-semibold text-[#8E91A5] uppercase tracking-wider mt-0.5">
              {isEn ? 'SPEI Sent' : 'Envíos SPEI'}
            </span>
          </div>

          {/* Card 2: Beneficiarios */}
          <div className="p-2.5 rounded-2xl bg-[#202236]/70 border border-white/5 flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-1 text-[#7047EB]">
              <span className="material-symbols-outlined text-[15px]">group</span>
              <span className="text-base font-black text-white tracking-tight">45</span>
            </div>
            <span className="text-[10px] font-semibold text-[#8E91A5] uppercase tracking-wider mt-0.5">
              {isEn ? 'Contacts' : 'Contactos MX'}
            </span>
          </div>

          {/* Card 3: Límite Diario */}
          <div className="p-2.5 rounded-2xl bg-[#202236]/70 border border-white/5 flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-1 text-[#2ED5A4]">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span className="text-base font-black text-[#2ED5A4] tracking-tight">
                {userDailyLimit ? userDailyLimit.replace('/día', '').replace('/day', '').trim() : '$3,000'}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#8E91A5] uppercase tracking-wider mt-0.5">
              {isEn ? 'Daily Limit' : 'Límite Diario'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. GRUPO: DATOS PERSONALES & CONTACTO                                    */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#2ED5A4]">badge</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5]">
              {isEn ? 'Account & Personal Details' : 'Mi Cuenta & Registro Legal'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleOpenAvatarPicker}
            className="text-xs font-bold text-[#2ED5A4] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{isEn ? 'Edit' : 'Editar'}</span>
            <span>✎</span>
          </button>
        </div>

        {/* Nombre Legal */}
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <UserIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">
                {isEn ? 'Legal Name' : 'Nombre Legal'}
              </span>
              <span className="text-xs font-bold text-white">
                {userFirstName} {userLastName}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-[#8E91A5]">
            {isEn ? 'Account Owner' : 'Titular'}
          </span>
        </div>

        {/* Correo Electrónico */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <MailIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">
                {isEn ? 'Email Address' : 'Correo Electrónico'}
              </span>
              <span className="text-xs font-bold text-white truncate max-w-[190px] block">
                {userEmail}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
            {isEn ? 'Verified ✓' : 'Verificado ✓'}
          </span>
        </div>

        {/* Teléfono Móvil */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <PhoneIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">
                {isEn ? 'Mobile Phone' : 'Teléfono Móvil'}
              </span>
              <span className="text-xs font-bold text-white">{userPhone || '+1 (555) 234-5678'}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
            2FA Activo
          </span>
        </div>

        {/* Residencia USA */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <HouseRentIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">
                {isEn ? 'Official Residence' : 'Residencia Oficial'}
              </span>
              <span className="text-xs font-bold text-white">
                {userCity || 'Austin'}, {userState || 'TX'} ({userZip || '78701'})
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#8E91A5]">USA 🇺🇸</span>
        </div>

        {/* Fecha de Registro */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <RosetteBadgeCheckIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">
                {isEn ? 'Member Since' : 'Fecha de Registro'}
              </span>
              <span className="text-xs font-bold text-white">{userMemberSince || 'Septiembre 2024'}</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#2ED5A4]">
            {isEn ? 'Active' : 'Activo'}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. GRUPO: SEGURIDAD, CUMPLIMIENTO & BÓVEDA CLIENTVAULT                    */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
        <div className="flex items-center gap-2 pb-1">
          <span className="material-symbols-outlined text-[16px] text-[#7047EB]">security</span>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5]">
            {isEn ? 'Security, Compliance & Vault' : 'Seguridad, Cumplimiento & Bóveda'}
          </span>
        </div>

        {/* Nivel de Cuenta & Límite Transaccional */}
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/20 flex items-center justify-center text-[#2ED5A4]">
              <ShieldCheckIcon className="w-4 h-4 text-[#2ED5A4]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">
                {isEn ? 'KYC Tier Level' : 'Nivel de Cuenta KYC'}
              </span>
              <span className="text-xs font-bold text-white">{userKycTier || 'Tier 2 (Identidad Oficial + Residencia)'}</span>
            </div>
          </div>
          <span className="text-xs font-black text-[#2ED5A4]">{userDailyLimit || '$3,000/día'}</span>
        </div>

        {/* Documento Oficial Validado */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <CardOutlineIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">
                {isEn ? 'Validated Identity Document' : 'Documento Oficial Validado'}
              </span>
              <span className="text-xs font-bold text-white">{userDocType || 'Pasaporte / INE'}</span>
              <span className="text-[9px] text-[#8E91A5] block">
                Folio {userDocNumber || 'MEX98765432'} • OCR Forense Gemini
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
            {isEn ? 'Verified ✓' : 'Verificado ✓'}
          </span>
        </div>

        {/* ClientVault Bóveda Cero Conocimiento */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#2ED5A4]">
              <LockIcon className="w-4 h-4 text-[#2ED5A4]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">
                {isEn ? 'Zero-Knowledge Security' : 'Bóveda Cero Conocimiento'}
              </span>
              <span className="text-xs font-bold text-white">ClientVault AES-GCM-256</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenVault}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#202236] border border-[#2ED5A4]/30 text-xs font-bold text-[#2ED5A4] hover:bg-[#2B2C42] active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <span>{isEn ? 'Open Vault' : 'Abrir Bóveda'}</span>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#2ED5A4]" />
          </button>
        </div>

        {/* Tarjeta de Débito Visa KIN */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-white">
              <CardOutlineIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">
                {isEn ? 'Primary Debit Card' : 'Tarjeta de Débito KIN'}
              </span>
              <span className="text-xs font-bold text-white">Visa KIN •••• 4242</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white border border-white/10">
            {isEn ? 'Default' : 'Predeterminada'}
          </span>
        </div>

        {/* Switch Biometría FaceID */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div>
            <span className="text-xs font-bold text-white block">
              {isEn ? 'Biometric Authentication (Face ID)' : 'Autenticación Biométrica (Face ID)'}
            </span>
            <span className="text-[10px] text-[#8E91A5]">
              {isEn
                ? 'Instant login & SPEI transfer approvals'
                : 'Acceso seguro y confirmación de envíos SPEI'}
            </span>
          </div>
          <ToggleSwitch
            enabled={biometricsEnabled}
            onToggle={() => setBiometricsEnabled(!biometricsEnabled)}
            title={isEn ? 'Face ID' : 'Biometría'}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. GRUPO: PREFERENCIAS & REGIONALIZACIÓN                                 */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
        <div className="flex items-center gap-2 pb-1">
          <span className="material-symbols-outlined text-[16px] text-[#2ED5A4]">tune</span>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5]">
            {isEn ? 'Preferences & Regional Settings' : 'Preferencias & Regionalización'}
          </span>
        </div>

        {/* Switch Notificaciones de Envíos */}
        <div className="flex items-center justify-between py-1.5">
          <div>
            <span className="text-xs font-bold text-white block">
              {isEn ? 'Push Notifications' : 'Notificaciones en Tiempo Real'}
            </span>
            <span className="text-[10px] text-[#8E91A5]">
              {isEn
                ? 'Delivery alerts & FX quotes'
                : 'Alertas de entrega SPEI y cotizaciones FX'}
            </span>
          </div>
          <ToggleSwitch
            enabled={pushNotificationsEnabled}
            onToggle={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
            title={isEn ? 'Notifications' : 'Notificaciones'}
          />
        </div>

        {/* Selector de Idioma / Language */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div>
            <span className="text-xs font-bold text-white block">
              {isEn ? 'App Language' : 'Idioma de la Aplicación'}
            </span>
            <span className="text-[10px] text-[#8E91A5]">
              {isEn ? 'Active language preference' : 'Preferencia de idioma activa'}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#202236] p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setLanguage('es');
                if (typeof window !== 'undefined') localStorage.setItem('kin_language', 'es');
                if (userId)
                  fetch('/api/account/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, updates: { language: 'es' } }),
                  }).catch(() => {});
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                language === 'es'
                  ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm'
                  : 'text-[#8E91A5] hover:text-white'
              }`}
            >
              🇲🇽 ES
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                if (typeof window !== 'undefined') localStorage.setItem('kin_language', 'en');
                if (userId)
                  fetch('/api/account/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, updates: { language: 'en' } }),
                  }).catch(() => {});
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm'
                  : 'text-[#8E91A5] hover:text-white'
              }`}
            >
              🇺🇸 EN
            </button>
          </div>
        </div>

        {/* Selector de Moneda Base / Currency */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div>
            <span className="text-xs font-bold text-white block">
              {isEn ? 'Base Currency / Region' : 'Moneda Base / Saldo Principal'}
            </span>
            <span className="text-[10px] text-[#8E91A5]">
              {isEn ? 'Primary account balance mode' : 'Modo de saldo predeterminado'}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#202236] p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => handleToggleCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                currencyPref === 'USD'
                  ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm'
                  : 'text-[#8E91A5] hover:text-white'
              }`}
            >
              🇺🇸 USD
            </button>
            <button
              type="button"
              onClick={() => handleToggleCurrency('MXN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                currencyPref === 'MXN'
                  ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm'
                  : 'text-[#8E91A5] hover:text-white'
              }`}
            >
              🇲🇽 MXN
            </button>
          </div>
        </div>

        {/* Selector de Modo de Pantalla (Claro / Oscuro) */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div>
            <span className="text-xs font-bold text-white block">
              {isEn ? 'Appearance & Theme' : 'Tema de la Aplicación'}
            </span>
            <span className="text-[10px] text-[#8E91A5]">
              {isEn
                ? 'Switch between Light and Dark mode'
                : 'Cambiar entre Modo Claro y Oscuro'}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#202236] p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => handleToggleTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm font-black'
                  : 'text-[#8E91A5] hover:text-white'
              }`}
              title={isEn ? 'Light Mode' : 'Modo Claro'}
            >
              <span className="material-symbols-outlined text-[15px]">light_mode</span>
              <span>{isEn ? 'Light' : 'Claro'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm font-black'
                  : 'text-[#8E91A5] hover:text-white'
              }`}
              title={isEn ? 'Dark Mode' : 'Modo Oscuro'}
            >
              <span className="material-symbols-outlined text-[15px]">dark_mode</span>
              <span>{isEn ? 'Dark' : 'Oscuro'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. GRUPO: ASISTENCIA 24/7 & CUMPLIMIENTO LEGAL                           */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
        <div className="flex items-center gap-2 pb-1">
          <span className="material-symbols-outlined text-[16px] text-[#2ED5A4]">support_agent</span>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5]">
            {isEn ? 'Support & Regulatory Framework' : 'Asistencia & Marco Legal'}
          </span>
        </div>

        {/* Soporte WhatsApp Directo */}
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="w-full flex items-center justify-between py-1.5 text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/25 flex items-center justify-center text-[#2ED5A4] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px] text-[#2ED5A4]">chat</span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {isEn ? 'KIN WhatsApp Concierge 24/7' : 'Concierge KIN WhatsApp 24/7'}
              </span>
              <span className="text-[10px] text-[#8E91A5]">
                {isEn ? 'Bilingual dedicated human support' : 'Atención humana bilingüe inmediata'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4]">
              {isEn ? 'Online' : 'En línea'}
            </span>
            <ChevronRightIcon className="w-4 h-4 text-[#8E91A5] group-hover:text-white transition-colors" />
          </div>
        </button>

        {/* Marco Regulatorio */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <BankBuildingIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                FinCEN MSB & SPEI Banxico
              </span>
              <span className="text-[10px] text-[#8E91A5]">
                Regulación bancaria USA-MX con cifrado grado militar
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#8E91A5]">Compliant</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. DANGER ZONE / CERRAR SESIÓN SEGURA                                    */}
      {/* ========================================================================= */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-13 rounded-2xl bg-[#181928] border border-[#FF5555]/30 hover:border-[#FF5555]/60 hover:bg-[#FF5555]/10 flex items-center justify-center gap-2 text-xs font-bold text-[#FF5555] active:scale-95 transition-all cursor-pointer shadow-lg"
        >
          <span className="material-symbols-outlined text-[18px] text-[#FF5555]">logout</span>
          <span>{isEn ? 'Secure Log Out' : 'Cerrar Sesión Segura'}</span>
        </button>
      </div>
    </div>
  );
}
