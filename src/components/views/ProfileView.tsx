'use client';

import React, { useState, useEffect } from 'react';
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
  userAddress1?: string;
  userAddress2?: string;
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
  onUpdateProfile?: (updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    email?: string;
  }) => void;
  handleLogout: () => void;
}

interface SavedCard {
  id: string;
  name: string;
  type: string;
  last4: string;
  exp: string;
  isDefault: boolean;
  icon: string;
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
  userAddress1 = '482 Grand Concourse',
  userAddress2 = 'Apt 4B',
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
  onUpdateProfile,
  handleLogout,
}: ProfileViewProps) {
  const isEn = language === 'en';

  // Modals state
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [paymentCardsModalOpen, setPaymentCardsModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [appearanceModalOpen, setAppearanceModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState('check_circle');

  const notifyToast = (msg: string, icon = 'check_circle') => {
    setToastMessage(msg);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Draft profile editing fields
  const [draftFirstName, setDraftFirstName] = useState(userFirstName || 'Mateo');
  const [draftLastName, setDraftLastName] = useState(userLastName || 'Morales');
  const [draftPhone, setDraftPhone] = useState(userPhone || '+1 (555) 349-2910');
  const [draftAddress1, setDraftAddress1] = useState(userAddress1 || '482 Grand Concourse');
  const [draftAddress2, setDraftAddress2] = useState(userAddress2 || 'Apt 4B');
  const [draftZip, setDraftZip] = useState(userZip || '10451');
  const [draftCity, setDraftCity] = useState(userCity || 'Bronx');
  const [draftState, setDraftState] = useState(userState || 'New York');

  // Keep draft in sync if external props change
  useEffect(() => {
    if (userFirstName) setDraftFirstName(userFirstName);
    if (userLastName) setDraftLastName(userLastName);
    if (userPhone) setDraftPhone(userPhone);
    if (userAddress1) setDraftAddress1(userAddress1);
    if (userAddress2) setDraftAddress2(userAddress2);
    if (userZip) setDraftZip(userZip);
    if (userCity) setDraftCity(userCity);
    if (userState) setDraftState(userState);
  }, [userFirstName, userLastName, userPhone, userAddress1, userAddress2, userZip, userCity, userState]);

  // Saved payment cards
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    {
      id: 'card-1',
      name: 'Obsidian Metal Debit',
      type: 'Visa',
      last4: '8942',
      exp: '09/28',
      isDefault: true,
      icon: 'contactless',
    },
    {
      id: 'card-2',
      name: 'Chase Premier Sapphire',
      type: 'MC',
      last4: '4102',
      exp: '11/26',
      isDefault: false,
      icon: 'account_balance',
    },
  ]);

  // Add new card form state
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');

  const handleSaveProfileForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        firstName: draftFirstName,
        lastName: draftLastName,
        phone: draftPhone,
        address1: draftAddress1,
        address2: draftAddress2,
        city: draftCity,
        state: draftState,
        zip: draftZip,
      });
    }
    setEditProfileModalOpen(false);
    notifyToast(
      isEn ? 'Personal profile updated and verified' : 'Perfil actualizado y verificado con éxito',
      'verified'
    );
  };

  const handleAddNewCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const last4Digits = newCardNumber.replace(/\s/g, '').slice(-4) || '7721';
    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      name: newCardHolder ? `${newCardHolder}'s Card` : 'Tarjeta KIN Débito',
      type: 'Visa',
      last4: last4Digits,
      exp: newCardExp || '12/28',
      isDefault: false,
      icon: 'credit_card',
    };
    setSavedCards((prev) => [...prev, newCard]);
    setShowNewCardForm(false);
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardCvv('');
    setNewCardHolder('');
    setPaymentCardsModalOpen(false);
    notifyToast(
      isEn ? 'New card linked & approved for SPEI' : 'Nueva tarjeta vinculada y autorizada para SPEI',
      'credit_card'
    );
  };

  const handleSelectDefaultCard = (cardId: string) => {
    setSavedCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === cardId,
      }))
    );
    notifyToast(
      isEn ? 'Card selected as primary for transfers' : 'Tarjeta seleccionada para próximo envío',
      'check_circle'
    );
  };

  return (
    <div className="animate-fade-in space-y-4 pb-12 relative select-none">
      {/* Glow Difuminado Ambiental Bicolor */}
      <div className="bicolor-atmosphere-glow" />

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION HEADER                                                 */}
      {/* ========================================================================= */}
      <header className="relative z-10 flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onBack}
          className="btn-circle touch-press"
          title={isEn ? 'Back to Home' : 'Volver al Inicio'}
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-bold text-white tracking-wide">
            {isEn ? 'Client Profile' : 'Perfil del Cliente'}
          </h1>
          <p className="text-[10px] text-[#2ED5A4] font-medium flex items-center justify-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
            {userKycTier ? userKycTier.split(' (')[0] : 'TIER 2'} • {isEn ? 'Verified Account' : 'Cuenta Verificada'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="btn-circle touch-press"
          title={isEn ? 'Settings' : 'Configuración'}
        >
          <SettingsGearIcon className="w-5 h-5 text-white" />
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 2. SECTION 1: USER PROFILE HEADER HERO (STITCH ARCHITECTURE)             */}
      {/* ========================================================================= */}
      <div className="anim-stagger-1 relative w-full rounded-3xl bg-[#181928] p-5 shadow-xl border border-white/10 overflow-hidden">
        {/* Ambient Halo Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#2ED5A4]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-28 -right-10 w-44 h-44 bg-[#7047EB]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Tier & Quick Edit Pill */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202236] text-[#2ED5A4] border border-[#2ED5A4]/30 shadow-sm">
            <span className="material-symbols-outlined text-[14px] text-[#2ED5A4]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="font-label-caps text-[10px] tracking-wider font-bold uppercase text-[#2ED5A4]">
              {userKycTier ? userKycTier.split(' (')[0] : 'TIER 2 VERIFICADO'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setEditProfileModalOpen(true)}
            className="touch-press inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#202236] hover:bg-[#2B2C42] text-white border border-white/10 hover:border-[#2ED5A4]/40 transition-all cursor-pointer shadow-sm"
            title={isEn ? 'Edit personal information' : 'Editar información personal'}
          >
            <span className="material-symbols-outlined text-[13px] text-[#2ED5A4]">edit</span>
            <span className="font-caption-sm text-xs font-semibold text-white">{isEn ? 'Edit' : 'Editar'}</span>
          </button>
        </div>

        {/* Center Avatar + Name Architecture */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative mb-3 group cursor-pointer" onClick={handleOpenAvatarPicker}>
            {/* Glowing Avatar Frame */}
            <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#2ED5A4] via-[#2ED5A4]/70 to-[#7047EB] shadow-[0_0_24px_rgba(46,213,164,0.35)] flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#181928] flex items-center justify-center">
                {userAvatar ? (
                  <img
                    alt={userName || 'Perfil'}
                    className="w-full h-full object-cover"
                    src={userAvatar}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#202236] text-[#8E91A5]">
                    <span className="material-symbols-outlined text-[42px] text-[#8E91A5]">person</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Badge on Avatar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAvatarPicker();
              }}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2ED5A4] text-[#003828] flex items-center justify-center shadow-lg transition-transform active:scale-90 border-2 border-[#181928] cursor-pointer"
              title={isEn ? 'Change photo' : 'Actualizar foto de perfil'}
            >
              <span className="material-symbols-outlined text-[16px] font-bold text-[#003828]">photo_camera</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <h1 className="font-headline-md text-xl font-bold text-white tracking-tight">
              {draftFirstName} {draftLastName}
            </h1>
            <span
              className="material-symbols-outlined text-[#2ED5A4] text-[19px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
              title={isEn ? 'Verified Account' : 'Cuenta Verificada'}
            >
              check_circle
            </span>
          </div>

          <p className="font-caption-sm text-xs text-[#8E91A5] mt-0.5">{userEmail || 'cesar.urrutia@gmail.com'}</p>
          <p className="font-financial-mono text-xs text-[#8E91A5]/90 tracking-tight mt-0.5">{draftPhone}</p>

          {/* Client ID Pill with Copy Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCopyClientId}
              className="touch-press inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202236] border border-white/10 text-xs font-bold text-white hover:border-[#2ED5A4]/60 active:scale-95 transition-all cursor-pointer shadow-sm"
              title={isEn ? 'Click to copy Client ID' : 'Copiar Folio de Cliente'}
            >
              <span className="text-[#8E91A5] font-normal text-[11px]">ID:</span>
              <span className="font-financial-mono text-[11px] text-[#2ED5A4] font-semibold">{userClientId || 'KIN-US-892401'}</span>
              <CopyIcon className="w-3 h-3 text-[#8E91A5]" />
              {copiedClientId && (
                <span className="text-[10px] text-[#2ED5A4] font-bold animate-fade-in">✓</span>
              )}
            </button>
          </div>
        </div>

        {/* 3 Metric KPI Cards (Dribbble Signature Integration) */}
        <div className="grid grid-cols-3 gap-2.5 pt-4 mt-3 border-t border-white/10 relative z-10">
          <div className="p-2.5 rounded-2xl bg-[#202236]/80 border border-white/5 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[#2ED5A4]">
              <span className="material-symbols-outlined text-[15px]">send_money</span>
              <span className="text-base font-black text-white tracking-tight">128</span>
            </div>
            <span className="text-[10px] font-semibold text-[#8E91A5] uppercase tracking-wider mt-0.5">
              {isEn ? 'SPEI Sent' : 'Envíos SPEI'}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#202236]/80 border border-white/5 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[#7047EB]">
              <span className="material-symbols-outlined text-[15px]">group</span>
              <span className="text-base font-black text-white tracking-tight">45</span>
            </div>
            <span className="text-[10px] font-semibold text-[#8E91A5] uppercase tracking-wider mt-0.5">
              {isEn ? 'Contacts' : 'Contactos MX'}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#202236]/80 border border-white/5 flex flex-col items-center justify-center">
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
      {/* 3. SECTION 2: CONFIGURACIÓN GENERAL (INTERACTIVE MENU ROWS)              */}
      {/* ========================================================================= */}
      <div className="anim-stagger-3 space-y-2">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="font-label-caps text-[11px] uppercase tracking-wider text-[#8E91A5] font-bold">
            {isEn ? 'General Settings' : 'Configuración General'}
          </span>
          <span className="font-caption-sm text-[11px] text-[#2ED5A4] font-semibold">
            {isEn ? '256-bit Secure Banking' : 'Banca Segura 256-bit'}
          </span>
        </div>

        {/* Menu Row 1: Información Personal (Editable Modal) */}
        <button
          type="button"
          onClick={() => setEditProfileModalOpen(true)}
          className="touch-press w-full p-4 rounded-2xl bg-[#181928] hover:bg-[#202236] border border-white/5 text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#202236] border border-white/10 flex items-center justify-center text-[#2ED5A4] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-sm font-bold text-white truncate">
                {isEn ? 'Personal Information' : 'Información Personal'}
              </span>
              <span className="font-caption-sm text-xs text-[#8E91A5] truncate">
                {draftAddress1 ? `${draftAddress1}, ${draftCity}` : (isEn ? 'Name, phone, address & legal residence' : 'Nombre, teléfono, dirección y residencia')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#8E91A5]">
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </button>

        {/* Menu Row 2: Métodos de Pago & Tarjetas */}
        <button
          type="button"
          onClick={() => setPaymentCardsModalOpen(true)}
          className="touch-press w-full p-4 rounded-2xl bg-[#181928] hover:bg-[#202236] border border-white/5 text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#202236] border border-white/10 flex items-center justify-center text-[#2ED5A4] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">credit_card</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-sm font-bold text-white truncate">
                {isEn ? 'Payment Methods & Cards' : 'Métodos de Pago & Tarjetas'}
              </span>
              <span className="font-caption-sm text-xs text-[#8E91A5] truncate">
                {isEn ? 'Saved cards, SPEI accounts & auto-pay' : 'Tarjetas guardadas, cuentas SPEI & pago auto'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#8E91A5]">
            <span className="font-financial-mono text-[11px] px-2 py-0.5 rounded-md bg-[#202236] border border-white/10 text-[#2ED5A4] font-bold">
              {savedCards.length} {isEn ? 'active' : 'activas'}
            </span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </button>

        {/* Menu Row 3: Idioma / Language */}
        <button
          type="button"
          onClick={() => setLanguageModalOpen(true)}
          className="touch-press w-full p-4 rounded-2xl bg-[#181928] hover:bg-[#202236] border border-white/5 text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#202236] border border-white/10 flex items-center justify-center text-[#7047EB] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">translate</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-sm font-bold text-white truncate">
                {isEn ? 'App Language' : 'Idioma / Language'}
              </span>
              <span className="font-caption-sm text-xs text-[#8E91A5] truncate">
                {isEn ? 'English (US) • 🇺🇸 Active' : 'Español (México) • 🇲🇽 Seleccionado'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#8E91A5]">
            <span className="font-caption-sm text-xs font-bold text-white px-2 py-0.5 rounded-md bg-[#202236] border border-white/10">
              {isEn ? '🇺🇸 EN' : '🇲🇽 ES'}
            </span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </button>

        {/* Menu Row 4: Apariencia & Modo Oscuro / Claro */}
        <button
          type="button"
          onClick={() => setAppearanceModalOpen(true)}
          className="touch-press w-full p-4 rounded-2xl bg-[#181928] hover:bg-[#202236] border border-white/5 text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#202236] border border-white/10 flex items-center justify-center text-[#2ED5A4] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">
                {theme === 'light' ? 'light_mode' : 'dark_mode'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-sm font-bold text-white truncate">
                {isEn ? 'Appearance & Theme' : 'Apariencia / Tema'}
              </span>
              <span className="font-caption-sm text-xs text-[#8E91A5] truncate">
                {theme === 'light'
                  ? (isEn ? 'High-Contrast Light Mode (Active)' : 'Modo Claro Alta Claridad (Activado)')
                  : (isEn ? 'OLED Obsidian Black (Active)' : 'OLED Obsidian Black (Activado)')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#8E91A5]">
            <span className="material-symbols-outlined text-[#2ED5A4] text-[18px]">
              {theme === 'light' ? 'light_mode' : 'nights_stay'}
            </span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. SECTION 3: SEGURIDAD Y RESPALDO                                       */}
      {/* ========================================================================= */}
      <div className="anim-stagger-5 space-y-2 pt-1">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="font-label-caps text-[11px] uppercase tracking-wider text-[#8E91A5] font-bold">
            {isEn ? 'Security & Compliance' : 'Seguridad y Respaldo'}
          </span>
          <span className="font-caption-sm text-[11px] text-[#2ED5A4] font-semibold">
            Zero-Knowledge
          </span>
        </div>

        {/* Menu Row 5: Privacidad y Seguridad */}
        <button
          type="button"
          onClick={() => setSecurityModalOpen(true)}
          className="touch-press w-full p-4 rounded-2xl bg-[#181928] hover:bg-[#202236] border border-white/5 text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#202236] border border-white/10 flex items-center justify-center text-[#2ED5A4] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">shield</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-sm font-bold text-white truncate">
                {isEn ? 'Privacy & Security Vault' : 'Privacidad & Seguridad'}
              </span>
              <span className="font-caption-sm text-xs text-[#8E91A5] truncate">
                {isEn ? 'Face ID, SPEI PIN & 256-bit ClientVault' : 'Face ID, PIN SPEI & Bóveda AES-256'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#8E91A5]">
            <span className="w-2 h-2 rounded-full bg-[#2ED5A4] shadow-[0_0_8px_#2ED5A4]" />
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </button>

        {/* Menu Row 6: Ayuda y Soporte KIN */}
        <button
          type="button"
          onClick={() => setSupportModalOpen(true)}
          className="touch-press w-full p-4 rounded-2xl bg-[#181928] hover:bg-[#202236] border border-white/5 text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#202236] border border-white/10 flex items-center justify-center text-[#7047EB] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">support_agent</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-sm font-bold text-white truncate">
                {isEn ? 'KIN Help & Support 24/7' : 'Ayuda & Soporte KIN'}
              </span>
              <span className="font-caption-sm text-xs text-[#8E91A5] truncate">
                {isEn ? 'Live 24/7 bilingual support via Chat or WhatsApp' : 'Atención 24/7 en vivo vía Chat o WhatsApp'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#8E91A5]">
            <span className="font-caption-sm text-[11px] px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] font-bold">
              {isEn ? 'Online' : 'En línea'}
            </span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </button>

        {/* Quick Biometric Toggle Card */}
        <div className="anim-stagger-6 p-4 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#202236] border border-white/10 flex items-center justify-center text-[#2ED5A4]">
              <span className="material-symbols-outlined text-[22px]">fingerprint</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-body-medium text-xs font-bold text-white truncate">
                {isEn ? 'Fast Biometric Authorization' : 'Autorización Biométrica Rápida'}
              </span>
              <span className="font-caption-sm text-[11px] text-[#8E91A5] truncate">
                {isEn ? 'Face ID / Touch ID for Mexican SPEI transfers' : 'Face ID / Touch ID para envíos a México'}
              </span>
            </div>
          </div>
          <ToggleSwitch
            enabled={biometricsEnabled}
            onToggle={() => {
              const newState = !biometricsEnabled;
              setBiometricsEnabled(newState);
              notifyToast(
                newState
                  ? (isEn ? 'Biometrics for transfers activated' : 'Biometría para transferencias activada')
                  : (isEn ? 'Biometrics for transfers deactivated' : 'Biometría para transferencias desactivada'),
                'fingerprint'
              );
            }}
            title={isEn ? 'Biometrics' : 'Biometría'}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SECTION 4: CERRAR SESIÓN & REGULATORY FOOTER                          */}
      {/* ========================================================================= */}
      <div className="anim-stagger-7 flex flex-col items-center text-center mt-3 pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="touch-press w-full py-3.5 px-4 rounded-full bg-[#181928] border border-[#FF5555]/30 hover:border-[#FF5555]/70 hover:bg-[#FF5555]/10 text-[#FF5555] flex items-center justify-center gap-2 transition-colors mb-3 shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">lock</span>
          <span className="font-title-base text-[14px] font-bold">{isEn ? 'Secure Log Out' : 'Cerrar Sesión Segura'}</span>
        </button>

        <div className="flex items-center gap-2 text-[#8E91A5]/70 text-[11px] font-caption-sm mb-1">
          <span>KIN Mobile v4.8.2</span>
          <span>•</span>
          <span>FinCEN Reg. #31000214829</span>
          <span>•</span>
          <span>CNBV Lic.</span>
        </div>
        <p className="font-caption-sm text-[10px] text-[#8E91A5]/60 max-w-[320px] leading-relaxed">
          {isEn
            ? 'Funds insured by authorized banking partners. SPEI operated under the supervision of Banco de México and Federal Reserve Bank.'
            : 'Fondos asegurados por socios bancarios autorizados. SPEI operado bajo supervisión de Banco de México y Federal Reserve Bank.'}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING TOAST NOTIFICATION BAR                                          */}
      {/* ========================================================================= */}
      <div
        className={`fixed top-16 left-1/2 -translate-x-1/2 max-w-[360px] w-[90%] z-[70] transition-all duration-300 pointer-events-none ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="px-4 py-2.5 rounded-full bg-[#202236]/95 border border-white/10 text-white backdrop-blur-xl flex items-center gap-2.5 shadow-2xl">
          <span className="material-symbols-outlined text-[#2ED5A4] text-[18px]">{toastIcon}</span>
          <span className="font-body-medium text-[13px] font-medium text-white">{toastMessage}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EDITAR INFORMACIÓN PERSONAL DEL CLIENTE                          */}
      {/* ========================================================================= */}
      {editProfileModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-[400px] mx-auto bg-[#181928] border-t border-white/10 rounded-t-3xl p-5 pb-safe max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-lg font-bold text-white">
                  {isEn ? 'Personal Information' : 'Información Personal'}
                </h2>
                <p className="font-caption-sm text-xs text-[#8E91A5]">
                  {isEn ? 'Update your personal details & registered address' : 'Actualiza tus datos personales y dirección registrada'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditProfileModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white hover:bg-[#2B2C42] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfileForm} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase tracking-wider font-bold">
                    {isEn ? 'First Name' : 'Nombre'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#8E91A5] text-[18px]">person</span>
                    <input
                      type="text"
                      required
                      value={draftFirstName}
                      onChange={(e) => setDraftFirstName(e.target.value)}
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#202236] border border-white/10 text-white font-body-base text-xs focus:outline-none focus:border-[#2ED5A4] shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase tracking-wider font-bold">
                    {isEn ? 'Last Name' : 'Apellido'}
                  </label>
                  <input
                    type="text"
                    required
                    value={draftLastName}
                    onChange={(e) => setDraftLastName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#202236] border border-white/10 text-white font-body-base text-xs focus:outline-none focus:border-[#2ED5A4] shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase tracking-wider font-bold">
                  {isEn ? 'Mobile Phone' : 'Número Telefónico'}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#8E91A5] text-[18px]">call</span>
                  <input
                    type="tel"
                    required
                    value={draftPhone}
                    onChange={(e) => setDraftPhone(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#202236] border border-white/10 text-white font-financial-mono text-xs focus:outline-none focus:border-[#2ED5A4] shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase tracking-wider font-bold">
                  {isEn ? 'Address 1' : 'Dirección 1'}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#8E91A5] text-[18px]">home</span>
                  <input
                    type="text"
                    required
                    value={draftAddress1}
                    onChange={(e) => setDraftAddress1(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#202236] border border-white/10 text-white font-body-base text-xs focus:outline-none focus:border-[#2ED5A4] shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase tracking-wider font-bold">
                  {isEn ? 'Address 2 (Optional)' : 'Dirección 2 (Opcional)'}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#8E91A5] text-[18px]">apartment</span>
                  <input
                    type="text"
                    value={draftAddress2}
                    onChange={(e) => setDraftAddress2(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#202236] border border-white/10 text-white font-body-base text-xs focus:outline-none focus:border-[#2ED5A4] shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase tracking-wider font-bold">
                    {isEn ? 'ZIP Code' : 'Código Postal'}
                  </label>
                  <input
                    type="text"
                    required
                    value={draftZip}
                    onChange={(e) => setDraftZip(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#202236] border border-white/10 text-white font-financial-mono text-xs focus:outline-none focus:border-[#2ED5A4] shadow-inner"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase tracking-wider font-bold">
                    {isEn ? 'City' : 'Ciudad'}
                  </label>
                  <input
                    type="text"
                    required
                    value={draftCity}
                    onChange={(e) => setDraftCity(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#202236] border border-white/10 text-white font-body-base text-xs focus:outline-none focus:border-[#2ED5A4] shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase tracking-wider font-bold">
                  {isEn ? 'State' : 'Estado'}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#8E91A5] text-[18px]">map</span>
                  <input
                    type="text"
                    required
                    value={draftState}
                    onChange={(e) => setDraftState(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#202236] border border-white/10 text-white font-body-base text-xs focus:outline-none focus:border-[#2ED5A4] shadow-inner"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="touch-press w-full h-12 rounded-full bg-[#2ED5A4] hover:bg-[#26BC90] text-[#003828] font-title-base text-sm font-black shadow-[0_8px_24px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-[20px] font-bold text-[#003828]">save</span>
                  <span>{isEn ? 'Save Changes' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MÉTODOS DE PAGO & TARJETAS                                       */}
      {/* ========================================================================= */}
      {paymentCardsModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-[400px] mx-auto bg-[#181928] border-t border-white/10 rounded-t-3xl p-5 pb-safe max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-headline-md text-lg font-bold text-white">
                  {isEn ? 'Payment Methods' : 'Métodos de Pago'}
                </h2>
                <p className="font-caption-sm text-xs text-[#8E91A5]">
                  {isEn ? 'Funds for instant SPEI transfers' : 'Fondos para envíos SPEI inmediatos'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentCardsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white hover:bg-[#2B2C42] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* List of saved cards */}
            <div className="space-y-2.5 mb-3">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleSelectDefaultCard(card.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-md ${
                    card.isDefault
                      ? 'bg-gradient-to-br from-[#202236] to-[#181928] border-[#2ED5A4]/40'
                      : 'bg-[#202236] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#181928] border border-white/10 flex items-center justify-center text-[#2ED5A4] shadow-inner">
                      <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-title-base text-xs font-bold text-white">{card.name}</span>
                        {card.isDefault && (
                          <span className="font-label-caps text-[9px] px-1.5 py-0.5 rounded bg-[#2ED5A4]/20 text-[#2ED5A4] font-bold">
                            {isEn ? 'Default' : 'Predeterminada'}
                          </span>
                        )}
                      </div>
                      <span className="font-financial-mono text-xs text-[#8E91A5]">
                        {card.type} •••• {card.last4} • Exp {card.exp}
                      </span>
                    </div>
                  </div>
                  {card.isDefault ? (
                    <span
                      className="material-symbols-outlined text-[#2ED5A4] text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="font-caption-sm text-xs text-[#2ED5A4] font-bold hover:underline"
                    >
                      {isEn ? 'Select' : 'Usar'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Card Accordion Toggle */}
            <button
              type="button"
              onClick={() => setShowNewCardForm(!showNewCardForm)}
              className="touch-press w-full py-3 px-3 rounded-xl bg-[#202236] hover:bg-[#2B2C42] border border-white/10 text-[#2ED5A4] font-caption-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-colors mb-3 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showNewCardForm ? 'expand_less' : 'add_circle'}
              </span>
              <span>
                {showNewCardForm
                  ? (isEn ? 'Close Form' : 'Cerrar Formulario')
                  : (isEn ? '+ Add New Debit Card / Bank' : '+ Agregar Nueva Tarjeta / Cuenta Bancaria')}
              </span>
            </button>

            {/* New Card Form */}
            {showNewCardForm && (
              <form onSubmit={handleAddNewCardSubmit} className="space-y-3 p-4 rounded-2xl bg-[#202236] border border-white/10 mb-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-xs uppercase text-white font-bold">
                    {isEn ? 'New Card Details' : 'Nueva Tarjeta o SPEI'}
                  </span>
                  <span className="font-financial-mono text-[10px] text-[#2ED5A4] font-bold">
                    {isEn ? 'AES-256 Vault' : 'Cifrado AES-256'}
                  </span>
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase font-bold">
                    {isEn ? 'Card Number' : 'Número de Tarjeta'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-[#181928] border border-white/10 text-white font-financial-mono text-xs focus:outline-none focus:border-[#2ED5A4]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase font-bold">
                      {isEn ? 'Expires (MM/YY)' : 'Expira (MM/AA)'}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="12/28"
                      value={newCardExp}
                      onChange={(e) => setNewCardExp(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg bg-[#181928] border border-white/10 text-white font-financial-mono text-xs focus:outline-none focus:border-[#2ED5A4]"
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase font-bold">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={newCardCvv}
                      onChange={(e) => setNewCardCvv(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg bg-[#181928] border border-white/10 text-white font-financial-mono text-xs focus:outline-none focus:border-[#2ED5A4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] text-[#8E91A5] mb-1 uppercase font-bold">
                    {isEn ? 'Cardholder Name' : 'Nombre del Titular'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Como aparece en la tarjeta"
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-[#181928] border border-white/10 text-white font-body-base text-xs focus:outline-none focus:border-[#2ED5A4]"
                  />
                </div>

                <button
                  type="submit"
                  className="touch-press w-full h-11 rounded-lg bg-[#2ED5A4] text-[#003828] font-caption-sm font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <span className="material-symbols-outlined text-[18px] font-bold">verified_user</span>
                  <span>{isEn ? 'Link Card Successfully' : 'Vincular Tarjeta con Éxito'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: IDIOMA / LANGUAGE SELECTOR                                       */}
      {/* ========================================================================= */}
      {languageModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-[400px] mx-auto bg-[#181928] border-t border-white/10 rounded-t-3xl p-5 pb-safe shadow-2xl flex flex-col">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-lg font-bold text-white">
                  {isEn ? 'App Language' : 'Idioma de la Aplicación'}
                </h2>
                <p className="font-caption-sm text-xs text-[#8E91A5]">
                  {isEn ? 'Select your preferred interface language' : 'Selecciona el idioma preferido de la app'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLanguageModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white hover:bg-[#2B2C42] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2 mb-5">
              {/* Spanish Option */}
              <div
                onClick={() => {
                  setLanguage('es');
                  if (typeof window !== 'undefined') localStorage.setItem('kin_language', 'es');
                  if (userId) {
                    fetch('/api/account/data', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId, updates: { language: 'es' } }),
                    }).catch(() => {});
                  }
                  notifyToast('Idioma cambiado a Español', 'translate');
                }}
                className={`touch-press p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
                  language === 'es' ? 'bg-[#202236] border-[#2ED5A4]/40' : 'bg-[#181928] border-white/5 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇲🇽</span>
                  <div>
                    <span className="font-title-base text-sm text-white font-bold block">Español</span>
                    <span className="font-caption-sm text-xs text-[#8E91A5]">México y Latinoamérica • Notificaciones SPEI</span>
                  </div>
                </div>
                {language === 'es' ? (
                  <span className="material-symbols-outlined text-[#2ED5A4] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[#8E91A5] text-[22px]">radio_button_unchecked</span>
                )}
              </div>

              {/* English Option */}
              <div
                onClick={() => {
                  setLanguage('en');
                  if (typeof window !== 'undefined') localStorage.getItem('kin_language', 'en');
                  if (userId) {
                    fetch('/api/account/data', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId, updates: { language: 'en' } }),
                    }).catch(() => {});
                  }
                  notifyToast('Language switched to English', 'translate');
                }}
                className={`touch-press p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
                  language === 'en' ? 'bg-[#202236] border-[#2ED5A4]/40' : 'bg-[#181928] border-white/5 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇺🇸</span>
                  <div>
                    <span className="font-title-base text-sm text-white font-bold block">English</span>
                    <span className="font-caption-sm text-xs text-[#8E91A5]">United States • USD wire & ACH status</span>
                  </div>
                </div>
                {language === 'en' ? (
                  <span className="material-symbols-outlined text-[#2ED5A4] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[#8E91A5] text-[22px]">radio_button_unchecked</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLanguageModalOpen(false)}
              className="touch-press w-full h-12 rounded-full bg-[#202236] hover:bg-[#2B2C42] border border-white/10 text-white font-title-base text-sm font-bold cursor-pointer"
            >
              {isEn ? 'Confirm Selection' : 'Confirmar Selección'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: APARIENCIA / MODO CLARO & OSCURO                                 */}
      {/* ========================================================================= */}
      {appearanceModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-[400px] mx-auto bg-[#181928] border-t border-white/10 rounded-t-3xl p-5 pb-safe shadow-2xl flex flex-col">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-lg font-bold text-white">
                  {isEn ? 'Appearance & Theme' : 'Apariencia'}
                </h2>
                <p className="font-caption-sm text-xs text-[#8E91A5]">
                  {isEn ? 'Switch between OLED Obsidian and High-Contrast Light Mode' : 'Paleta Obsidian y Modo Claro de alta claridad'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAppearanceModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white hover:bg-[#2B2C42] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {/* OLED Obsidian Dark Mode */}
              <div
                onClick={() => {
                  handleToggleTheme('dark');
                  notifyToast(isEn ? 'OLED Obsidian Dark theme active' : 'Tema OLED Obsidian Black activado', 'nights_stay');
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between shadow-sm transition-all ${
                  theme === 'dark' ? 'bg-[#202236] border-[#2ED5A4]/40' : 'bg-[#181928] border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#06070B] border border-white/10 flex items-center justify-center text-[#2ED5A4] shadow-inner">
                    <span className="material-symbols-outlined text-[22px]">nights_stay</span>
                  </div>
                  <div>
                    <span className="font-title-base text-sm text-white font-bold block">
                      {isEn ? 'Obsidian Deep (OLED Dark)' : 'Obsidian Deep (OLED Oscuro)'}
                    </span>
                    <span className="font-caption-sm text-xs text-[#8E91A5]">
                      {isEn ? 'Pure black #06070B with emerald accents' : 'Negro puro #06070B con toques esmeralda'}
                    </span>
                  </div>
                </div>
                {theme === 'dark' ? (
                  <span className="material-symbols-outlined text-[#2ED5A4] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[#8E91A5] text-[22px]">radio_button_unchecked</span>
                )}
              </div>

              {/* High-Contrast Light Mode */}
              <div
                onClick={() => {
                  handleToggleTheme('light');
                  notifyToast(isEn ? 'Clean Light theme active' : 'Modo Claro institucional activado', 'light_mode');
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between shadow-sm transition-all ${
                  theme === 'light' ? 'bg-[#202236] border-[#2ED5A4]/40' : 'bg-[#181928] border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center text-[#06070B] shadow-inner">
                    <span className="material-symbols-outlined text-[22px]">light_mode</span>
                  </div>
                  <div>
                    <span className="font-title-base text-sm text-white font-bold block">
                      {isEn ? 'Light Mode (Modern Fintech)' : 'Modo Claro (Fintech Luminoso)'}
                    </span>
                    <span className="font-caption-sm text-xs text-[#8E91A5]">
                      {isEn ? 'Crisp off-white canvas with dark obsidian contrast' : 'Blanco níveo con contraste obsidiana nítido'}
                    </span>
                  </div>
                </div>
                {theme === 'light' ? (
                  <span className="material-symbols-outlined text-[#2ED5A4] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[#8E91A5] text-[22px]">radio_button_unchecked</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAppearanceModalOpen(false)}
              className="touch-press w-full h-12 rounded-full bg-[#2ED5A4] text-[#003828] font-title-base text-sm font-bold shadow-md cursor-pointer"
            >
              {isEn ? 'Apply Theme' : 'Aplicar Tema'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: PRIVACIDAD & SEGURIDAD DETAIL DRAWER                             */}
      {/* ========================================================================= */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-[400px] mx-auto bg-[#181928] border-t border-white/10 rounded-t-3xl p-5 pb-safe max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-lg font-bold text-white">
                  {isEn ? 'Privacy & Security' : 'Privacidad & Seguridad'}
                </h2>
                <p className="font-caption-sm text-xs text-[#8E91A5]">
                  {isEn ? 'Zero-Knowledge Vault & Biometrics' : 'Bóveda Zero-Knowledge y Biometría'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSecurityModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white hover:bg-[#2B2C42] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {/* Item 1: PIN de Transferencia SPEI */}
              <div className="p-3.5 rounded-2xl bg-[#202236] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#2ED5A4] text-[22px]">pin</span>
                  <div>
                    <span className="font-title-base text-xs font-bold text-white block">
                      {isEn ? 'SPEI Transfer PIN' : 'PIN Transaccional SPEI'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-[#8E91A5]">
                      {isEn ? '6 digits required for withdrawals > $1,000 USD' : '6 dígitos requeridos para retiros > $1,000 USD'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => notifyToast(isEn ? 'PIN reset link sent to your registered email' : 'Solicitud para cambiar PIN enviada al correo', 'pin')}
                  className="px-2.5 py-1 rounded-lg bg-[#181928] border border-white/10 text-[#2ED5A4] font-caption-sm text-xs font-bold cursor-pointer"
                >
                  {isEn ? 'Change' : 'Cambiar'}
                </button>
              </div>

              {/* Item 2: Documentos KYC */}
              <div className="p-3.5 rounded-2xl bg-[#202236] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#7047EB] text-[22px]">badge</span>
                  <div>
                    <span className="font-title-base text-xs font-bold text-white block">
                      {isEn ? 'Official ID (INE / Passport)' : 'Identidad Oficial (INE / Pasaporte)'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-[#2ED5A4]">
                      {isEn ? 'Validated by CNBV & FinCEN (Gemini OCR)' : 'Validado con éxito por CNBV & FinCEN'}
                    </span>
                  </div>
                </div>
                <span
                  className="material-symbols-outlined text-[#2ED5A4] text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>

              {/* Item 3: ClientVault AES-256 */}
              <div className="p-3.5 rounded-2xl bg-[#202236] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#2ED5A4] text-[22px]">lock</span>
                  <div>
                    <span className="font-title-base text-xs font-bold text-white block">
                      ClientVault AES-GCM-256
                    </span>
                    <span className="font-caption-sm text-[11px] text-[#8E91A5]">
                      {isEn ? 'Zero-knowledge encrypted offline keys' : 'Bóveda Cero Conocimiento cifrada'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSecurityModalOpen(false);
                    onOpenVault();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[#2ED5A4] font-caption-sm text-xs font-bold cursor-pointer"
                >
                  {isEn ? 'Open' : 'Abrir'}
                </button>
              </div>

              {/* Item 4: Sesiones Activas */}
              <div className="p-3.5 rounded-2xl bg-[#202236] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#8E91A5] text-[22px]">devices</span>
                  <div>
                    <span className="font-title-base text-xs font-bold text-white block">
                      {isEn ? 'Linked Devices' : 'Dispositivos Vinculados'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-[#8E91A5]">
                      iPhone 15 Pro • {isEn ? 'Current' : 'Actual'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => notifyToast(isEn ? 'All other remote sessions closed' : 'Otras sesiones remotas cerradas', 'devices')}
                  className="px-2 py-1 rounded-lg bg-[#FF5555]/15 border border-[#FF5555]/30 text-[#FF5555] font-caption-sm text-[10px] font-bold cursor-pointer"
                >
                  {isEn ? 'Revoke others' : 'Cerrar otras'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSecurityModalOpen(false)}
              className="touch-press w-full h-12 rounded-full bg-[#2ED5A4] text-[#003828] font-title-base text-sm font-bold shadow-md cursor-pointer"
            >
              {isEn ? 'Understood & Protected' : 'Entendido y Protegido'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: AYUDA & SOPORTE KIN 24/7                                        */}
      {/* ========================================================================= */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-[400px] mx-auto bg-[#181928] border-t border-white/10 rounded-t-3xl p-5 pb-safe shadow-2xl flex flex-col">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-lg font-bold text-white">
                  {isEn ? 'KIN Help Center' : 'Centro de Ayuda KIN'}
                </h2>
                <p className="font-caption-sm text-xs text-[#8E91A5]">
                  {isEn ? '24/7 live bilingual assistance via Chat or WhatsApp' : 'Asistencia en vivo en inglés y español 24/7'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white hover:bg-[#2B2C42] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 mb-5">
              {/* Live Chat */}
              <button
                type="button"
                onClick={() => {
                  setSupportModalOpen(false);
                  notifyToast(isEn ? 'Connecting with KIN Concierge in Live Chat...' : 'Conectando con agente KIN en Chat...', 'chat');
                }}
                className="touch-press w-full p-3.5 rounded-2xl bg-[#202236] hover:bg-[#2B2C42] border border-white/5 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2ED5A4]/20 border border-[#2ED5A4]/30 text-[#2ED5A4] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">chat</span>
                  </div>
                  <div>
                    <span className="font-title-base text-sm font-bold text-white block">
                      {isEn ? 'Live Chat' : 'Chat en Vivo'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-[#8E91A5]">
                      {isEn ? 'Average wait time: < 45 sec' : 'Tiempo de espera promedio: < 45 seg'}
                    </span>
                  </div>
                </div>
                <span className="font-caption-sm text-[11px] px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] font-bold">
                  {isEn ? 'Available' : 'Disponible'}
                </span>
              </button>

              {/* WhatsApp Oficial */}
              <button
                type="button"
                onClick={() => {
                  setSupportModalOpen(false);
                  const msg = encodeURIComponent(`Hola soporte KIN, requiero asistencia con mi cuenta ID ${userClientId || 'KIN-US-892401'}`);
                  window.open(`https://wa.me/18005466624?text=${msg}`, '_blank');
                }}
                className="touch-press w-full p-3.5 rounded-2xl bg-[#202236] hover:bg-[#2B2C42] border border-white/5 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">forum</span>
                  </div>
                  <div>
                    <span className="font-title-base text-sm font-bold text-white block">
                      {isEn ? 'Verified Official WhatsApp' : 'WhatsApp Oficial Verificado'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-[#8E91A5]">+1 (800) 546-6624 (Banxico / KIN)</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-[#8E91A5]">open_in_new</span>
              </button>

              {/* FAQ Base de Conocimiento */}
              <button
                type="button"
                onClick={() => {
                  setSupportModalOpen(false);
                  notifyToast(isEn ? 'Opening SPEI knowledge base' : 'Abriendo preguntas frecuentes SPEI', 'help_outline');
                }}
                className="touch-press w-full p-3.5 rounded-2xl bg-[#202236] hover:bg-[#2B2C42] border border-white/5 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7047EB]/20 border border-[#7047EB]/30 text-[#7047EB] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">help_outline</span>
                  </div>
                  <div>
                    <span className="font-title-base text-sm font-bold text-white block">
                      {isEn ? 'SPEI FAQ & Help Docs' : 'Preguntas Frecuentes SPEI'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-[#8E91A5]">
                      {isEn ? 'CEP receipt tracking, daily limits & FX' : 'Rastreo de folio CEP, límites y tipo de cambio'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-[#8E91A5]">chevron_right</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSupportModalOpen(false)}
              className="touch-press w-full h-12 rounded-full bg-[#202236] hover:bg-[#2B2C42] border border-white/10 text-white font-title-base text-sm font-bold cursor-pointer"
            >
              {isEn ? 'Close' : 'Cerrar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
