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
  handleLogout,
}: ProfileViewProps) {
  return (
    <div className="animate-fade-in space-y-4 pb-4">
      {/* Header: < | My Profile | SettingsGearIcon */}
      <header className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onBack}
          className="btn-circle"
          title="Volver al Home"
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold text-white tracking-wide">My Profile</h1>
          <p className="text-[10px] text-[#2ED5A4] font-medium flex items-center justify-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
            {userKycTier ? userKycTier.split(' (')[0] : 'Tier 1'} • Cuenta Activa
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="btn-circle"
          title="Configuración & Ajustes"
        >
          <SettingsGearIcon className="w-5 h-5 text-white" />
        </button>
      </header>

      {/* 1. Hero Card: Avatar Proporcional Estándar Móvil (56px), Nombre, Email, Folio & Badge */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/10 text-center relative overflow-hidden shadow-xl space-y-2.5">
        {/* Brillo ambiental sutil en cabecera */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-36 bg-[#2ED5A4]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Avatar Estándar Móvil (56px) con micro-badge de cámara ergonómico */}
        <div className="relative inline-block mx-auto">
          <div className="w-14 h-14 rounded-full p-0.5 border-2 border-[#2ED5A4]/40 shadow-md shadow-[#2ED5A4]/15 overflow-hidden bg-[#202236] flex items-center justify-center">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || 'Perfil'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-white/5 text-[#8E91A5]">
                <span className="material-symbols-outlined text-[28px] text-[#8E91A5]">person</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleOpenAvatarPicker}
            className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-[#202236] border border-white/20 flex items-center justify-center text-[#2ED5A4] shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title={userAvatar ? 'Cambiar foto de perfil' : 'Agregar foto de perfil'}
          >
            <CameraIcon className="w-3 h-3" />
          </button>
          {userAvatar && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#2ED5A4] border-2 border-[#181928]" />
          )}
        </div>

        {/* Nombre y Correo en Escala Proporcional Estándar */}
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            {userFirstName} {userLastName}
          </h2>
          <p className="text-[11px] text-[#8E91A5] font-medium mt-0.5">{userEmail}</p>
        </div>

        {/* Badges de Estatus & Folio de Cliente con función de copiado */}
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
          <button
            type="button"
            onClick={handleCopyClientId}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202236] border border-white/10 text-xs font-bold text-white hover:border-[#2ED5A4] transition-all cursor-pointer shadow-sm active:scale-95"
            title="Copiar Folio de Cliente"
          >
            <span className="text-[#8E91A5] font-normal">ID:</span>
            <span className="font-mono text-[11px] text-[#2ED5A4]">{userClientId}</span>
            <CopyIcon className="w-3 h-3 text-[#8E91A5]" />
            {copiedClientId && (
              <span className="text-[10px] text-[#2ED5A4] font-semibold animate-fade-in">✓</span>
            )}
          </button>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[10px] font-bold text-[#2ED5A4]">
            <span>✓</span>
            <span>KYC Verificado</span>
          </div>
        </div>
      </div>

      {/* 2. Sección: Datos Personales & Contacto de Registro */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5]">
            Datos de Registro & Contacto
          </span>
          <button
            type="button"
            onClick={handleOpenAvatarPicker}
            className="text-xs font-bold text-[#2ED5A4] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Editar</span>
            <span>✎</span>
          </button>
        </div>

        {/* Fila 1: Nombre Legal */}
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <UserIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">Nombre Legal</span>
              <span className="text-xs font-bold text-white">
                {userFirstName} {userLastName}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-[#8E91A5]">
            Titular
          </span>
        </div>

        {/* Fila 2: Correo Registrado */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <MailIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">Correo Electrónico</span>
              <span className="text-xs font-bold text-white truncate max-w-[190px] block">
                {userEmail}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
            Verificado
          </span>
        </div>

        {/* Fila 3: Teléfono Móvil con 2FA */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <PhoneIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">Teléfono Móvil</span>
              <span className="text-xs font-bold text-white">{userPhone}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
            2FA Activo
          </span>
        </div>

        {/* Fila 4: Domicilio / Residencia en USA */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <HouseRentIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">Residencia Oficial</span>
              <span className="text-xs font-bold text-white">
                {userCity}, {userState} ({userZip})
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#8E91A5]">USA 🇺🇸</span>
        </div>

        {/* Fila 5: Fecha de Alta */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <RosetteBadgeCheckIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">Fecha de Registro</span>
              <span className="text-xs font-bold text-white">{userMemberSince}</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#2ED5A4]">Cuenta Activa</span>
        </div>
      </div>

      {/* 3. Sección: Cumplimiento Regulatorio, KYC & Bóveda */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5] block pb-1">
          Cumplimiento Regulatorio (Fintech KYC/AML)
        </span>

        {/* Nivel de Cuenta & Límite Transaccional */}
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/20 flex items-center justify-center text-[#2ED5A4]">
              <ShieldCheckIcon className="w-4 h-4 text-[#2ED5A4]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">Nivel de Cuenta</span>
              <span className="text-xs font-bold text-white">{userKycTier}</span>
            </div>
          </div>
          <span className="text-xs font-black text-[#2ED5A4]">{userDailyLimit}</span>
        </div>

        {/* Documento Oficial Validado */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <CardOutlineIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">Documento Validado</span>
              <span className="text-xs font-bold text-white">{userDocType}</span>
              <span className="text-[9px] text-[#8E91A5] block">
                Folio {userDocNumber} • OCR Forense Gemini
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
            Verificado ✓
          </span>
        </div>

        {/* ClientVault Bóveda Cero Conocimiento */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
              <LockIcon className="w-4 h-4 text-[#8E91A5]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">Bóveda Cero Conocimiento</span>
              <span className="text-xs font-bold text-white">ClientVault AES-GCM-256</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenVault}
            className="text-xs font-bold text-[#2ED5A4] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Abrir Bóveda</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* 4. Sección: Métodos de Pago Vinculados */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5] block pb-1">
          Métodos de Pago Registrados
        </span>

        {/* Tarjeta de Débito Visa */}
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-white">
              <CardOutlineIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">Tarjeta de Débito Principal</span>
              <span className="text-xs font-bold text-white">Visa KIN •••• 4242</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white border border-white/10">
            Predeterminada
          </span>
        </div>

        {/* Cuenta Bancaria ACH Chase */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-white">
              <BankBuildingIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] text-[#8E91A5] block">Cuenta Bancaria USA (ACH)</span>
              <span className="text-xs font-bold text-white">Chase Bank •••• 8910</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
            Conectada
          </span>
        </div>
      </div>

      {/* 5. Sección: Seguridad & Preferencias Táctiles */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5] block pb-1">
          Seguridad & Preferencias
        </span>

        {/* Switch Biometría FaceID */}
        <div className="flex items-center justify-between py-1.5">
          <div>
            <span className="text-xs font-bold text-white block">
              {language === 'en'
                ? 'Biometric Authentication (Face ID)'
                : 'Autenticación Biométrica (Face ID)'}
            </span>
            <span className="text-[10px] text-[#8E91A5]">
              {language === 'en'
                ? 'Quick access & SPEI authorizations'
                : 'Acceso rápido y confirmación de envíos SPEI'}
            </span>
          </div>
          <ToggleSwitch
            enabled={biometricsEnabled}
            onToggle={() => setBiometricsEnabled(!biometricsEnabled)}
            title={language === 'en' ? 'Face ID' : 'Biometría'}
          />
        </div>

        {/* Switch Notificaciones de Envíos */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div>
            <span className="text-xs font-bold text-white block">
              {language === 'en' ? 'Real-Time Notifications' : 'Notificaciones en Tiempo Real'}
            </span>
            <span className="text-[10px] text-[#8E91A5]">
              {language === 'en'
                ? 'Delivery confirmations & FX quotes'
                : 'Confirmaciones de entrega y cotizaciones FX'}
            </span>
          </div>
          <ToggleSwitch
            enabled={pushNotificationsEnabled}
            onToggle={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
            title={language === 'en' ? 'Notifications' : 'Notificaciones'}
          />
        </div>

        {/* Selector de Idioma / Language */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/5">
          <div>
            <span className="text-xs font-bold text-white block">
              {language === 'en' ? 'App Language' : 'Idioma de la Aplicación'}
            </span>
            <span className="text-[10px] text-[#8E91A5]">
              {language === 'en' ? 'Active language preference' : 'Preferencia de idioma activa'}
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
              {language === 'en' ? 'Base Currency / Region' : 'Moneda Base / Región'}
            </span>
            <span className="text-[10px] text-[#8E91A5]">
              {language === 'en' ? 'Primary account balance mode' : 'Modo de saldo principal'}
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
      </div>

      {/* 6. Botones de Acción: Editar Perfil & Cerrar Sesión */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={handleOpenAvatarPicker}
          className="w-full h-13 rounded-2xl bg-[#202236] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-black text-white hover:bg-[#2B2C42] transition-all cursor-pointer shadow-md"
        >
          <span>✎</span>
          <span>
            {language === 'en'
              ? 'Edit Profile, Language & Currency'
              : 'Editar Información, Idioma y Moneda'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-12 rounded-2xl bg-[#181928] border border-[#FF5555]/20 hover:border-[#FF5555]/50 hover:bg-[#FF5555]/10 flex items-center justify-center gap-2 text-xs font-bold text-[#FF5555] transition-all cursor-pointer shadow-sm"
        >
          <span>{language === 'en' ? 'Secure Log Out' : 'Cerrar Sesión Segura'}</span>
        </button>
      </div>
    </div>
  );
}
