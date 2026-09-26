'use client';

import React, { useState, useEffect } from 'react';
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
  userMemberSince?: string;
  userDailyLimit?: string;
  userDocType?: string;
  userDocNumber?: string;
  onOpenVault: () => void;
  biometricsEnabled: boolean;
  setBiometricsEnabled: (enabled: boolean) => void;
  pushNotificationsEnabled?: boolean;
  setPushNotificationsEnabled?: (enabled: boolean) => void;
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
  onOpenVault,
  biometricsEnabled,
  setBiometricsEnabled,
  language,
  setLanguage,
  userId,
  theme,
  handleToggleTheme,
  onUpdateProfile,
  handleLogout,
}: ProfileViewProps) {
  const isEn = language === 'en';

  // 6 Core Modals State (Exact mapping to stitch_kin_mobile_CLIENTE)
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [paymentCardsModalOpen, setPaymentCardsModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [appearanceModalOpen, setAppearanceModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Subtheme variant state: 'obsidian' | 'slate' | 'light'
  const [themeVariant, setThemeVariant] = useState<'obsidian' | 'slate' | 'light'>(
    theme === 'light' ? 'light' : 'obsidian'
  );

  // Floating Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState('check_circle');

  const notifyToast = (msg: string, icon = 'check_circle') => {
    setToastMessage(msg);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Draft profile fields
  const [draftFirstName, setDraftFirstName] = useState(userFirstName || 'Mateo');
  const [draftLastName, setDraftLastName] = useState(userLastName || 'Morales');
  const [draftPhone, setDraftPhone] = useState(userPhone || '+1 (555) 349-2910');
  const [draftAddress1, setDraftAddress1] = useState(userAddress1 || '482 Grand Concourse');
  const [draftAddress2, setDraftAddress2] = useState(userAddress2 || 'Apt 4B');
  const [draftZip, setDraftZip] = useState(userZip || '10451');
  const [draftCity, setDraftCity] = useState(userCity || 'Bronx');
  const [draftState, setDraftState] = useState(userState || 'New York');

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

  // Saved Payment Cards
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

  // New Card Accordion Form State
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [savePermanently, setSavePermanently] = useState(true);

  // Handlers
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
    const last4 = newCardNumber.replace(/\s/g, '').slice(-4) || '8831';
    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      name: newCardHolder ? `${newCardHolder}'s Card` : 'Tarjeta KIN Débito',
      type: 'Visa',
      last4: last4,
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

  const handleSelectLanguage = (newLang: 'es' | 'en') => {
    setLanguage(newLang);
    if (typeof window !== 'undefined') localStorage.setItem('kin_language', newLang);
    if (userId) {
      fetch('/api/account/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates: { language: newLang } }),
      }).catch(() => {});
    }
    notifyToast(
      newLang === 'en' ? 'Language changed to English' : 'Idioma cambiado a Español',
      'translate'
    );
  };

  const handleApplyThemeVariant = (variant: 'obsidian' | 'slate' | 'light') => {
    setThemeVariant(variant);
    if (variant === 'light') {
      handleToggleTheme('light');
      notifyToast(isEn ? 'Light Mode theme applied' : 'Modo Claro activado', 'light_mode');
    } else {
      handleToggleTheme('dark');
      notifyToast(
        variant === 'slate'
          ? (isEn ? 'Slate Night theme applied' : 'Tema Slate Night activado')
          : (isEn ? 'OLED Obsidian Black theme applied' : 'Tema OLED Obsidian Black activado'),
        'nights_stay'
      );
    }
    setAppearanceModalOpen(false);
  };

  const handleConfirmLogout = () => {
    notifyToast(
      isEn ? 'Securing session and clearing cryptographic cache...' : 'Cerrando sesión segura y borrando llaves de memoria...',
      'lock'
    );
    setTimeout(() => {
      handleLogout();
    }, 1200);
  };

  // Avatar URL fallback to stitch original
  const defaultStitchAvatar =
    'https://lh3.googleusercontent.com/aida/AEtjO1XgfG4wJ22AeyGZa6zxTOh6Jyo20b27o3fM67TfAmBcD2zke2Fk2YO19J9j1d1vfNAB74v-fD8hligRjbEFIVm3iq9fy8yBO3oLJHvGUIay7BRQTN9iRekVzBNrFPzPyKvDNF6s9xjkCWj_SXvlkelM_YGOwkvZ_WOxhKe-DyaVKApVN9NtjREGVxp_9dorOv0eH-vwJVbAuWSjtjv8HOoYl9lVcWIQ0LJXWPH0aLGzV51M6lfcmRnHAyM';

  const displayAvatar = userAvatar || defaultStitchAvatar;
  const displayName = `${draftFirstName} ${draftLastName}`.trim() || 'Mateo Morales';
  const displayEmail = userEmail || 'mateo.morales@gmail.com';
  const displayPhone = draftPhone || '+1 (555) 349-2910';

  return (
    <div className="flex flex-col w-full pb-8 select-none relative animate-fade-in">
      {/* Ambient Backdrop Halo Glows */}
      <div className="relative w-full">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#2ED5A4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-28 -right-10 w-44 h-44 bg-[#7047EB]/20 rounded-full blur-3xl pointer-events-none" />

        {/* ========================================================================= */}
        {/* SECTION 1: USER PROFILE HEADER HERO (STITCH EXACT ARCHITECTURE)           */}
        {/* ========================================================================= */}
        <div className="anim-stagger-1 relative w-full rounded-2xl bg-surface-container-low p-5 mb-4 shadow-xl border border-white/5 overflow-hidden">
          {/* Top Tier & Quick Edit Pill */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-[#2ED5A4] shadow-sm">
              <span
                className="material-symbols-outlined text-[13px] text-[#2ED5A4]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="font-label-caps text-[10px] tracking-wider text-[#2ED5A4] font-bold">
                TIER 3 VERIFICADO
              </span>
            </div>

            <button
              type="button"
              aria-label={isEn ? 'Edit Profile' : 'Editar Perfil'}
              onClick={() => setEditProfileModalOpen(true)}
              className="touch-press inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px] text-[#2ED5A4]">edit</span>
              <span className="font-caption-sm text-[12px] font-semibold">{isEn ? 'Edit' : 'Editar'}</span>
            </button>
          </div>

          {/* Center Avatar + Name Architecture */}
          <div className="flex flex-col items-center text-center">
            <div
              className="relative mb-3 group cursor-pointer"
              onClick={() => {
                handleOpenAvatarPicker();
                notifyToast(
                  isEn ? 'Camera enabled to update biometric avatar' : 'Cámara activada para actualizar avatar biométrico',
                  'photo_camera'
                );
              }}
            >
              {/* Glowing Avatar Frame */}
              <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#2ED5A4] via-[#2ED5A4]/80 to-[#7047EB] shadow-[0_0_24px_rgba(46,213,164,0.35)]">
                <img
                  alt={`Avatar de ${displayName}`}
                  className="w-full h-full rounded-full object-cover bg-surface-container-lowest"
                  src={displayAvatar}
                />
              </div>

              {/* Edit Badge on Avatar */}
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2ED5A4] text-[#003828] flex items-center justify-center shadow-lg transition-transform active:scale-90 border-2 border-[#171b2a]">
                <span className="material-symbols-outlined text-[16px] font-bold text-[#003828]">photo_camera</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <h1 className="font-headline-md text-2xl font-bold text-white tracking-tight">
                {displayName}
              </h1>
              <span
                className="material-symbols-outlined text-[#2ED5A4] text-[19px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
                title={isEn ? 'Verified Account' : 'Cuenta Verificada'}
              >
                check_circle
              </span>
            </div>

            <p className="font-caption-sm text-[12px] text-on-surface-variant mt-0.5">
              {displayEmail}
            </p>
            <p className="font-financial-mono text-[12px] text-on-surface-variant/80 tracking-tight mt-0.5">
              {displayPhone}
            </p>

            {/* Client ID Folio Pill with Copy */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCopyClientId}
                className="touch-press inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-white/5 text-xs text-white hover:border-[#2ED5A4]/40 active:scale-95 transition-all cursor-pointer shadow-sm"
                title={isEn ? 'Copy Client Folio' : 'Copiar Folio de Cliente'}
              >
                <span className="text-on-surface-variant text-[11px]">ID:</span>
                <span className="font-financial-mono text-[11px] text-[#2ED5A4] font-semibold">
                  {userClientId || 'KIN-US-892401'}
                </span>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">content_copy</span>
                {copiedClientId && (
                  <span className="text-[10px] text-[#2ED5A4] font-bold">✓</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: CONFIGURACIÓN GENERAL (INTERACTIVE MENU ROWS)                  */}
        {/* ========================================================================= */}
        <div className="anim-stagger-3 flex items-center justify-between px-1 mb-2">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant font-bold">
            {isEn ? 'General Settings' : 'Configuración General'}
          </span>
          <span className="font-caption-sm text-[11px] text-[#2ED5A4] font-semibold">
            {isEn ? '256-bit Secure Banking' : 'Banca Segura 256-bit'}
          </span>
        </div>

        {/* Menu Row 1: Información Personal */}
        <button
          type="button"
          aria-label={isEn ? 'Personal Information' : 'Información Personal'}
          className="anim-stagger-3 touch-press w-full p-4 mb-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer border border-white/5"
          onClick={() => setEditProfileModalOpen(true)}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-[#2ED5A4] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate">
                {isEn ? 'Personal Information' : 'Información Personal'}
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn ? 'Name, phone, address and legal residence' : 'Nombre, teléfono, dirección y residencia'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform text-on-surface-variant">
              chevron_right
            </span>
          </div>
        </button>

        {/* Menu Row 2: Métodos de Pago & Tarjetas */}
        <button
          type="button"
          aria-label={isEn ? 'Payment Methods and Cards' : 'Métodos de Pago y Tarjetas'}
          className="anim-stagger-3 touch-press w-full p-4 mb-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer border border-white/5"
          onClick={() => setPaymentCardsModalOpen(true)}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-[#2ED5A4] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">credit_card</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate">
                {isEn ? 'Payment Methods & Cards' : 'Métodos de Pago & Tarjetas'}
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn ? 'Saved cards, SPEI accounts & auto-pay' : 'Tarjetas guardadas, cuentas SPEI & pago auto'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="font-financial-mono text-[11px] px-2 py-0.5 rounded-md bg-surface-container-highest text-[#2ED5A4] font-bold">
              {savedCards.length} {isEn ? 'active' : 'activas'}
            </span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform text-on-surface-variant">
              chevron_right
            </span>
          </div>
        </button>

        {/* Menu Row 3: Idioma / Language */}
        <button
          type="button"
          aria-label={isEn ? 'Language and Region' : 'Idioma y Región'}
          className="anim-stagger-4 touch-press w-full p-4 mb-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer border border-white/5"
          onClick={() => setLanguageModalOpen(true)}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-[#ccbdff] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">translate</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate">
                Idioma / Language
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn ? 'English (US) • 🇺🇸 Active' : 'Español (México) • 🇲🇽 Seleccionado'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="font-caption-sm text-[12px] text-white font-bold">
              {isEn ? '🇺🇸 EN' : '🇲🇽 ES'}
            </span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform text-on-surface-variant">
              chevron_right
            </span>
          </div>
        </button>

        {/* Menu Row 4: Apariencia / Tema */}
        <button
          type="button"
          aria-label={isEn ? 'Appearance and Theme' : 'Modo Oscuro y Apariencia'}
          className="anim-stagger-4 touch-press w-full p-4 mb-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer border border-white/5"
          onClick={() => setAppearanceModalOpen(true)}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-[#3edfad] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">
                {themeVariant === 'light' ? 'light_mode' : 'dark_mode'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate">
                {isEn ? 'Appearance / Theme' : 'Apariencia / Tema'}
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {themeVariant === 'light'
                  ? (isEn ? 'Light Mode (Modern Fintech)' : 'Modo Claro (Fintech Luminoso)')
                  : themeVariant === 'slate'
                  ? (isEn ? 'Slate Night (Institutional Blue)' : 'Slate Night (Activado)')
                  : (isEn ? 'OLED Obsidian Black (Active)' : 'OLED Obsidian Black (Activado)')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[#2ED5A4] text-[18px]">
              {themeVariant === 'light' ? 'light_mode' : 'nights_stay'}
            </span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform text-on-surface-variant">
              chevron_right
            </span>
          </div>
        </button>

        {/* ========================================================================= */}
        {/* SECTION 3: SEGURIDAD Y RESPALDO                                           */}
        {/* ========================================================================= */}
        <div className="anim-stagger-5 flex items-center justify-between px-1 mt-3 mb-2">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant font-bold">
            {isEn ? 'Security & Backup' : 'Seguridad y Respaldo'}
          </span>
          <span className="font-caption-sm text-[11px] text-[#2ED5A4] font-semibold">
            Zero-Knowledge
          </span>
        </div>

        {/* Menu Row 5: Privacidad y Seguridad */}
        <button
          type="button"
          aria-label={isEn ? 'Privacy and Security' : 'Privacidad y Seguridad'}
          className="anim-stagger-5 touch-press w-full p-4 mb-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer border border-white/5"
          onClick={() => setSecurityModalOpen(true)}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-[#2ED5A4] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">shield</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate">
                {isEn ? 'Privacy & Security' : 'Privacidad & Seguridad'}
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn ? 'Face ID, SPEI PIN & 256-bit Encryption' : 'Face ID, PIN SPEI & Encriptación 256-bit'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-[#2ED5A4] shadow-[0_0_8px_#57f2bf]" />
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform text-on-surface-variant">
              chevron_right
            </span>
          </div>
        </button>

        {/* Menu Row 6: Ayuda y Soporte KIN */}
        <button
          type="button"
          aria-label={isEn ? 'Help & Support 24/7' : 'Ayuda y Soporte 24/7'}
          className="anim-stagger-6 touch-press w-full p-4 mb-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer border border-white/5"
          onClick={() => setSupportModalOpen(true)}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-[#ccbdff] group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px]">support_agent</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate">
                {isEn ? 'Help & Support KIN' : 'Ayuda & Soporte KIN'}
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn ? 'Live 24/7 assistance via Chat or WhatsApp' : 'Atención 24/7 en vivo vía Chat o WhatsApp'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="font-caption-sm text-[11px] px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] font-bold">
              {isEn ? 'Online' : 'En línea'}
            </span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform text-on-surface-variant">
              chevron_right
            </span>
          </div>
        </button>

        {/* Biometric Transfer Quick Toggle Card */}
        <div className="anim-stagger-6 p-4 rounded-2xl bg-surface-container-low mb-5 flex items-center justify-between shadow-md border border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-[#2ED5A4]">
              <span className="material-symbols-outlined text-[22px]">fingerprint</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-body-medium text-body-medium text-white truncate">
                {isEn ? 'Fast Biometric Authorization' : 'Autorización Biometría Rápida'}
              </span>
              <span className="font-caption-sm text-[12px] text-on-surface-variant">
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

        {/* Section 6: Cerrar Sesión Segura & Regulatory Footer */}
        <div className="anim-stagger-7 flex flex-col items-center text-center mt-2">
          <button
            type="button"
            aria-label={isEn ? 'Secure Log Out' : 'Cerrar Sesión Segura'}
            onClick={handleConfirmLogout}
            className="touch-press w-full py-3.5 px-4 rounded-full bg-surface-container-high hover:bg-error-container/40 text-[#ffb4ab] border border-[#ffb4ab]/20 hover:border-[#ffb4ab]/60 flex items-center justify-center gap-2 transition-colors mb-3 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span className="font-title-base text-[14px] font-bold">
              {isEn ? 'Secure Log Out' : 'Cerrar Sesión Segura'}
            </span>
          </button>

          <div className="flex items-center gap-2 text-on-surface-variant/70 text-[11px] font-caption-sm mb-1">
            <span>KIN Mobile v4.8.2</span>
            <span>•</span>
            <span>FinCEN Reg. #31000214829</span>
            <span>•</span>
            <span>CNBV Lic.</span>
          </div>
          <p className="font-caption-sm text-[10px] text-on-surface-variant/60 max-w-[320px]">
            {isEn
              ? 'Funds insured by authorized banking partners. SPEI operated under supervision of Banco de México and Federal Reserve Bank.'
              : 'Fondos asegurados por socios bancarios autorizados. SPEI operado bajo supervisión de Banco de México y Federal Reserve Bank.'}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING TOAST NOTIFICATION BAR (EXACT STITCH SPECS)                      */}
      {/* ========================================================================= */}
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 max-w-[360px] w-[90%] z-[70] transition-all duration-300 pointer-events-none ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="px-4 py-2.5 rounded-full bg-surface-bright/95 text-white backdrop-blur-xl flex items-center gap-2.5 shadow-2xl border border-white/10">
          <span className="material-symbols-outlined text-[#2ED5A4] text-[18px]">{toastIcon}</span>
          <span className="font-body-medium text-[13px] font-medium">{toastMessage}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: INFORMACIÓN PERSONAL (EDIT PROFILE MODAL)                        */}
      {/* ========================================================================= */}
      {editProfileModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-[400px] mx-auto bg-surface-container rounded-t-3xl p-5 pb-safe max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col border-t border-white/10">
            <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-white">
                  {isEn ? 'Personal Information' : 'Información Personal'}
                </h2>
                <p className="font-caption-sm text-caption-sm text-on-surface-variant">
                  {isEn ? 'Update your personal details & registered address' : 'Actualiza tus datos personales y dirección registrada'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white cursor-pointer"
                onClick={() => setEditProfileModalOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form className="space-y-3.5" onSubmit={handleSaveProfileForm}>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
                    {isEn ? 'First Name' : 'Nombre'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                      person
                    </span>
                    <input
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-surface-container-low text-white font-body-base text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] shadow-inner border border-white/5"
                      type="text"
                      required
                      value={draftFirstName}
                      onChange={(e) => setDraftFirstName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
                    {isEn ? 'Last Name' : 'Apellido'}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-white font-body-base text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] shadow-inner border border-white/5"
                      type="text"
                      required
                      value={draftLastName}
                      onChange={(e) => setDraftLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
                  {isEn ? 'Phone Number' : 'Número Telefónico'}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
                    call
                  </span>
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-white font-financial-mono text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] shadow-inner border border-white/5"
                    type="tel"
                    required
                    value={draftPhone}
                    onChange={(e) => setDraftPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
                  {isEn ? 'Address 1' : 'Dirección 1'}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
                    home
                  </span>
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-white font-body-base text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] shadow-inner border border-white/5"
                    type="text"
                    required
                    value={draftAddress1}
                    onChange={(e) => setDraftAddress1(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
                  {isEn ? 'Address 2 (Optional)' : 'Dirección 2 (Opcional)'}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
                    apartment
                  </span>
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-white font-body-base text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] shadow-inner border border-white/5"
                    type="text"
                    value={draftAddress2}
                    onChange={(e) => setDraftAddress2(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
                    {isEn ? 'Postal Code / ZIP' : 'Código Postal'}
                  </label>
                  <input
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-white font-financial-mono text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] shadow-inner border border-white/5"
                    type="text"
                    required
                    value={draftZip}
                    onChange={(e) => setDraftZip(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
                    {isEn ? 'City' : 'Ciudad'}
                  </label>
                  <input
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-white font-body-base text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] shadow-inner border border-white/5"
                    type="text"
                    required
                    value={draftCity}
                    onChange={(e) => setDraftCity(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
                  {isEn ? 'State' : 'Estado'}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
                    map
                  </span>
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-white font-body-base text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] shadow-inner border border-white/5"
                    type="text"
                    required
                    value={draftState}
                    onChange={(e) => setDraftState(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  className="touch-press w-full h-12 rounded-full bg-[#2ED5A4] text-[#003828] font-title-base text-title-base font-bold shadow-[0_8px_24px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
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
          <div className="w-full max-w-[400px] mx-auto bg-surface-container rounded-t-3xl p-5 pb-safe max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col border-t border-white/10">
            <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-headline-md text-headline-md text-white">
                  {isEn ? 'Payment Methods' : 'Métodos de Pago'}
                </h2>
                <p className="font-caption-sm text-caption-sm text-on-surface-variant">
                  {isEn ? 'Funds for instant SPEI transfers' : 'Fondos para envíos SPEI inmediatos'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white cursor-pointer"
                onClick={() => setPaymentCardsModalOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Saved Cards List */}
            <div className="space-y-2.5 mb-3">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleSelectDefaultCard(card.id)}
                  className={`p-3.5 rounded-2xl relative shadow-md flex items-center justify-between cursor-pointer border transition-all ${
                    card.isDefault
                      ? 'bg-gradient-to-br from-surface-container-highest to-surface-container-low border-[#2ED5A4]/40'
                      : 'bg-surface-container-low border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-[#2ED5A4] shadow-inner">
                      <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-title-base text-[14px] text-white font-bold">{card.name}</span>
                        {card.isDefault && (
                          <span className="font-label-caps text-[9px] px-1.5 py-0.5 rounded bg-[#2ED5A4]/20 text-[#2ED5A4] font-bold">
                            {isEn ? 'Default' : 'Predeterminada'}
                          </span>
                        )}
                      </div>
                      <span className="font-financial-mono text-caption-sm text-on-surface-variant">
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
                      className="font-caption-sm text-[12px] text-[#2ED5A4] font-bold hover:underline cursor-pointer"
                    >
                      {isEn ? 'Use' : 'Usar'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Card Accordion Toggle */}
            <button
              type="button"
              className="touch-press w-full py-2.5 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-[#2ED5A4] font-caption-sm flex items-center justify-center gap-1.5 transition-colors mb-3 cursor-pointer border border-white/5 font-bold"
              onClick={() => setShowNewCardForm(!showNewCardForm)}
            >
              <span className="material-symbols-outlined text-[18px]">
                {showNewCardForm ? 'remove_circle' : 'add_circle'}
              </span>
              <span>
                {showNewCardForm
                  ? (isEn ? 'Close Form' : 'Cerrar Formulario')
                  : (isEn ? '+ Add New Debit Card / Bank' : '+ Agregar Nueva Tarjeta / Cuenta Bancaria')}
              </span>
            </button>

            {/* New Card Form */}
            {showNewCardForm && (
              <form className="space-y-3 p-3.5 rounded-2xl bg-surface-container-low mb-3 border border-white/10 animate-fade-in" onSubmit={handleAddNewCardSubmit}>
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-white font-bold">
                    {isEn ? 'New Card or SPEI' : 'Nueva Tarjeta o SPEI'}
                  </span>
                  <span className="font-financial-mono text-[10px] text-[#2ED5A4]">
                    {isEn ? 'AES-256 Vault' : 'Cifrado AES-256'}
                  </span>
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase font-bold">
                    {isEn ? 'Card Number' : 'Número de Tarjeta'}
                  </label>
                  <input
                    className="w-full h-11 px-3 rounded-lg bg-surface-container text-white font-financial-mono text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] border border-white/5"
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    required
                    type="text"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase font-bold">
                      {isEn ? 'Expires (MM/YY)' : 'Expira (MM/AA)'}
                    </label>
                    <input
                      className="w-full h-11 px-3 rounded-lg bg-surface-container text-white font-financial-mono text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] border border-white/5"
                      maxLength={5}
                      placeholder="12/28"
                      required
                      type="text"
                      value={newCardExp}
                      onChange={(e) => setNewCardExp(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase font-bold">
                      CVV / CVC
                    </label>
                    <input
                      className="w-full h-11 px-3 rounded-lg bg-surface-container text-white font-financial-mono text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] border border-white/5"
                      maxLength={4}
                      placeholder="•••"
                      required
                      type="password"
                      value={newCardCvv}
                      onChange={(e) => setNewCardCvv(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase font-bold">
                    {isEn ? 'Cardholder Name' : 'Nombre del Titular'}
                  </label>
                  <input
                    className="w-full h-11 px-3 rounded-lg bg-surface-container text-white font-body-base text-caption-sm focus:outline-none focus:ring-1 focus:ring-[#2ED5A4] border border-white/5"
                    placeholder={isEn ? 'As it appears on card' : 'Como aparece en la tarjeta'}
                    required
                    type="text"
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="font-caption-sm text-[12px] text-on-surface">
                    {isEn ? 'Save permanently for fast sending' : 'Guardar permanentemente para envíos rápidos'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={savePermanently}
                      onChange={(e) => setSavePermanently(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2ED5A4]" />
                  </label>
                </div>

                <button
                  className="touch-press w-full h-11 rounded-lg bg-[#2ED5A4] text-[#003828] font-caption-sm font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
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
          <div className="w-full max-w-[400px] mx-auto bg-surface-container rounded-t-3xl p-5 pb-safe shadow-2xl flex flex-col border-t border-white/10">
            <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-white">Idioma / Language</h2>
                <p className="font-caption-sm text-caption-sm text-on-surface-variant">
                  {isEn ? 'Select your preferred interface language' : 'Selecciona el idioma preferido de la app'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white cursor-pointer"
                onClick={() => setLanguageModalOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2 mb-5">
              {/* Spanish Option */}
              <div
                className={`touch-press p-3.5 rounded-2xl bg-surface-container-low cursor-pointer flex items-center justify-between shadow-sm border transition-all ${
                  language === 'es' ? 'border-[#2ED5A4]/40 bg-surface-container' : 'border-white/5 opacity-80'
                }`}
                onClick={() => handleSelectLanguage('es')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇲🇽</span>
                  <div>
                    <span className="font-title-base text-[15px] text-white font-bold block">Español</span>
                    <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                      México y Latinoamérica • Notificaciones SPEI
                    </span>
                  </div>
                </div>
                {language === 'es' ? (
                  <span
                    className="material-symbols-outlined text-[#2ED5A4] text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
                    radio_button_unchecked
                  </span>
                )}
              </div>

              {/* English Option */}
              <div
                className={`touch-press p-3.5 rounded-2xl bg-surface-container-low cursor-pointer flex items-center justify-between shadow-sm border transition-all ${
                  language === 'en' ? 'border-[#2ED5A4]/40 bg-surface-container' : 'border-white/5 opacity-80'
                }`}
                onClick={() => handleSelectLanguage('en')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇺🇸</span>
                  <div>
                    <span className="font-title-base text-[15px] text-white font-bold block">English</span>
                    <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                      United States • USD wire & ACH status
                    </span>
                  </div>
                </div>
                {language === 'en' ? (
                  <span
                    className="material-symbols-outlined text-[#2ED5A4] text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
                    radio_button_unchecked
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              className="touch-press w-full h-12 rounded-full bg-surface-container-highest text-white font-title-base text-[14px] font-bold cursor-pointer hover:bg-surface-bright transition-colors"
              onClick={() => setLanguageModalOpen(false)}
            >
              {isEn ? 'Confirm Selection' : 'Confirmar Selección'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: APARIENCIA / TEMA (OLED OBSIDIAN & HIGH CONTRAST)                */}
      {/* ========================================================================= */}
      {appearanceModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-[400px] mx-auto bg-surface-container rounded-t-3xl p-5 pb-safe shadow-2xl flex flex-col border-t border-white/10">
            <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-white">
                  {isEn ? 'Appearance' : 'Apariencia'}
                </h2>
                <p className="font-caption-sm text-caption-sm text-on-surface-variant">
                  {isEn ? 'Obsidian palette engineered for OLED efficiency' : 'Paleta Obsidian diseñada para ahorro OLED'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white cursor-pointer"
                onClick={() => setAppearanceModalOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {/* Option 1: OLED Obsidian */}
              <div
                className={`p-3.5 rounded-2xl bg-surface-container-low cursor-pointer flex items-center justify-between shadow-sm border transition-all ${
                  themeVariant === 'obsidian' ? 'border-[#2ED5A4]/40 bg-surface-container' : 'border-white/5 opacity-70'
                }`}
                onClick={() => handleApplyThemeVariant('obsidian')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#06070B] flex items-center justify-center text-[#2ED5A4] shadow-inner border border-white/10">
                    <span className="material-symbols-outlined text-[22px]">nights_stay</span>
                  </div>
                  <div>
                    <span className="font-title-base text-[15px] text-white font-bold block">
                      Obsidian Deep (OLED)
                    </span>
                    <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                      {isEn ? 'Pure black #06070B with mint accents' : 'Negro puro #06070B con toques esmeralda'}
                    </span>
                  </div>
                </div>
                {themeVariant === 'obsidian' ? (
                  <span
                    className="material-symbols-outlined text-[#2ED5A4] text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
                    radio_button_unchecked
                  </span>
                )}
              </div>

              {/* Option 2: Slate Night */}
              <div
                className={`p-3.5 rounded-2xl bg-surface-container-low cursor-pointer flex items-center justify-between shadow-sm border transition-all ${
                  themeVariant === 'slate' ? 'border-[#2ED5A4]/40 bg-surface-container' : 'border-white/5 opacity-70'
                }`}
                onClick={() => handleApplyThemeVariant('slate')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#171b2a] flex items-center justify-center text-[#ccbdff] shadow-inner border border-white/10">
                    <span className="material-symbols-outlined text-[22px]">dark_mode</span>
                  </div>
                  <div>
                    <span className="font-title-base text-[15px] text-white font-bold block">Slate Night</span>
                    <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                      {isEn ? 'Institutional blue slate #171B2A' : 'Gris azulado institucional #171B2A'}
                    </span>
                  </div>
                </div>
                {themeVariant === 'slate' ? (
                  <span
                    className="material-symbols-outlined text-[#2ED5A4] text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
                    radio_button_unchecked
                  </span>
                )}
              </div>

              {/* Option 3: Light Mode */}
              <div
                className={`p-3.5 rounded-2xl bg-surface-container-low cursor-pointer flex items-center justify-between shadow-sm border transition-all ${
                  themeVariant === 'light' ? 'border-[#2ED5A4]/40 bg-surface-container' : 'border-white/5 opacity-70'
                }`}
                onClick={() => handleApplyThemeVariant('light')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#06070B] shadow-inner border border-black/10">
                    <span className="material-symbols-outlined text-[22px]">light_mode</span>
                  </div>
                  <div>
                    <span className="font-title-base text-[15px] text-white font-bold block">
                      {isEn ? 'Modern Light Mode' : 'Modo Claro Fintech'}
                    </span>
                    <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                      {isEn ? 'High daylight readability' : 'Claridad diurna de alto contraste'}
                    </span>
                  </div>
                </div>
                {themeVariant === 'light' ? (
                  <span
                    className="material-symbols-outlined text-[#2ED5A4] text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
                    radio_button_unchecked
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              className="touch-press w-full h-12 rounded-full bg-[#2ED5A4] text-[#003828] font-title-base text-[14px] font-bold shadow-md cursor-pointer"
              onClick={() => setAppearanceModalOpen(false)}
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
          <div className="w-full max-w-[400px] mx-auto bg-surface-container rounded-t-3xl p-5 pb-safe max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col border-t border-white/10">
            <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-white">
                  {isEn ? 'Privacy & Security' : 'Privacidad & Seguridad'}
                </h2>
                <p className="font-caption-sm text-caption-sm text-on-surface-variant">
                  {isEn ? 'Zero-Knowledge Vault & Biometrics' : 'Bóveda Zero-Knowledge y Biometría'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white cursor-pointer"
                onClick={() => setSecurityModalOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {/* Item 1: PIN Transaccional SPEI */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#2ED5A4] text-[22px]">pin</span>
                  <div>
                    <span className="font-title-base text-[14px] text-white font-bold block">
                      {isEn ? 'SPEI Transfer PIN' : 'PIN Transaccional SPEI'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-on-surface-variant">
                      {isEn ? '6 digits required for withdrawals > $1,000 USD' : '6 dígitos requeridos para retiros > $1,000 USD'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg bg-surface-container-high text-[#2ED5A4] font-caption-sm text-[11px] font-bold cursor-pointer"
                  onClick={() => notifyToast(isEn ? 'PIN reset link sent to your registered email' : 'Solicitud para cambiar PIN enviada al correo', 'pin')}
                >
                  {isEn ? 'Change' : 'Cambiar'}
                </button>
              </div>

              {/* Item 2: Documentos KYC */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ccbdff] text-[22px]">badge</span>
                  <div>
                    <span className="font-title-base text-[14px] text-white font-bold block">
                      {isEn ? 'Official ID (INE / Passport)' : 'Identidad Oficial (INE / Pasaporte)'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-[#2ED5A4]">
                      {isEn ? 'Validated by CNBV & FinCEN (Gemini Vision)' : 'Validado con éxito por CNBV & FinCEN'}
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
              <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#2ED5A4] text-[22px]">shield_lock</span>
                  <div>
                    <span className="font-title-base text-[14px] text-white font-bold block">
                      ClientVault AES-GCM-256
                    </span>
                    <span className="font-caption-sm text-[11px] text-on-surface-variant">
                      {isEn ? 'Zero-Knowledge offline cryptographic keys' : 'Bóveda Cero Conocimiento cifrada local'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSecurityModalOpen(false);
                    onOpenVault();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[#2ED5A4] font-caption-sm text-[11px] font-bold cursor-pointer"
                >
                  {isEn ? 'Open' : 'Abrir'}
                </button>
              </div>

              {/* Item 4: Sesiones Activas */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-[22px]">devices</span>
                  <div>
                    <span className="font-title-base text-[14px] text-white font-bold block">
                      {isEn ? 'Linked Devices' : 'Dispositivos Vinculados'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-on-surface-variant">
                      iPhone 15 Pro (Nueva York, US) • {isEn ? 'Current' : 'Actual'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-2 py-1 rounded-lg bg-error-container/30 text-[#ffb4ab] font-caption-sm text-[10px] font-bold cursor-pointer"
                  onClick={() => notifyToast(isEn ? 'All remote sessions closed' : 'Otras sesiones remotas cerradas', 'devices')}
                >
                  {isEn ? 'Revoke others' : 'Cerrar otras'}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="touch-press w-full h-12 rounded-full bg-[#2ED5A4] text-[#003828] font-title-base text-[14px] font-bold shadow-md cursor-pointer"
              onClick={() => setSecurityModalOpen(false)}
            >
              {isEn ? 'Understood and Protected' : 'Entendido y Protegido'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: AYUDA & SOPORTE 24/7 (CENTRO DE AYUDA KIN)                       */}
      {/* ========================================================================= */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-[400px] mx-auto bg-surface-container rounded-t-3xl p-5 pb-safe shadow-2xl flex flex-col border-t border-white/10">
            <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-white">
                  {isEn ? 'KIN Help Center' : 'Centro de Ayuda KIN'}
                </h2>
                <p className="font-caption-sm text-caption-sm text-on-surface-variant">
                  {isEn ? 'Live bilingual assistance in English & Spanish 24/7' : 'Asistencia en vivo en inglés y español 24/7'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white cursor-pointer"
                onClick={() => setSupportModalOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 mb-5">
              {/* Live Chat */}
              <button
                type="button"
                className="touch-press w-full p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between text-left transition-colors cursor-pointer border border-white/5"
                onClick={() => {
                  setSupportModalOpen(false);
                  notifyToast(
                    isEn ? 'Connecting with KIN live concierge agent...' : 'Conectando con agente KIN 24/7 vía Chat...',
                    'chat'
                  );
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2ED5A4]/20 text-[#2ED5A4] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">chat</span>
                  </div>
                  <div>
                    <span className="font-title-base text-[14px] text-white font-bold block">
                      {isEn ? 'Live Chat' : 'Chat en Vivo'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-on-surface-variant">
                      {isEn ? 'Average wait time: < 45 sec' : 'Tiempo de espera promedio: < 45 seg'}
                    </span>
                  </div>
                </div>
                <span className="font-caption-sm text-[11px] px-2 py-0.5 rounded-full bg-[#2ED5A4]/10 text-[#2ED5A4] font-bold">
                  {isEn ? 'Available' : 'Disponible'}
                </span>
              </button>

              {/* WhatsApp Oficial */}
              <button
                type="button"
                className="touch-press w-full p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between text-left transition-colors cursor-pointer border border-white/5"
                onClick={() => {
                  setSupportModalOpen(false);
                  const msg = encodeURIComponent(`Hola soporte KIN, requiero asistencia con mi cuenta ID ${userClientId || 'KIN-US-892401'}`);
                  window.open(`https://wa.me/18005466624?text=${msg}`, '_blank');
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2ED5A4]/20 text-[#2ED5A4] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">forum</span>
                  </div>
                  <div>
                    <span className="font-title-base text-[14px] text-white font-bold block">
                      {isEn ? 'Verified Official WhatsApp' : 'WhatsApp Oficial Verificado'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-on-surface-variant">
                      +1 (800) 546-6624 (Banxico / KIN)
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">open_in_new</span>
              </button>

              {/* FAQ Base de Conocimiento */}
              <button
                type="button"
                className="touch-press w-full p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between text-left transition-colors cursor-pointer border border-white/5"
                onClick={() => {
                  setSupportModalOpen(false);
                  notifyToast(
                    isEn ? 'Opening SPEI knowledge base and CEP receipt lookup' : 'Abriendo preguntas frecuentes y rastreo CEP',
                    'help_outline'
                  );
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high text-[#ccbdff] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">help_outline</span>
                  </div>
                  <div>
                    <span className="font-title-base text-[14px] text-white font-bold block">
                      {isEn ? 'SPEI FAQ & Help Docs' : 'Preguntas Frecuentes SPEI'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-on-surface-variant">
                      {isEn ? 'CEP receipt tracking, daily limits & FX' : 'Rastreo de folio CEP, límites y tipo de cambio'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">chevron_right</span>
              </button>
            </div>

            <button
              type="button"
              className="touch-press w-full h-12 rounded-full bg-surface-container-highest text-white font-title-base text-[14px] font-bold cursor-pointer hover:bg-surface-bright transition-colors"
              onClick={() => setSupportModalOpen(false)}
            >
              {isEn ? 'Close' : 'Cerrar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
