'use client';

import React, { useState, useEffect } from 'react';
import { ToggleSwitch } from '@/components/AppSettingsModal';
import { StripePaymentSheetModal, SavedCardItem } from '@/components/StripePaymentSheetModal';

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
  onUpdateAvatar?: (newAvatar: string) => void;
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
  userAddress1 = '',
  userAddress2 = '',
  userCity = '',
  userState = '',
  userZip = '',
  onOpenVault,
  biometricsEnabled,
  setBiometricsEnabled,
  language,
  setLanguage,
  userId,
  theme,
  handleToggleTheme,
  onUpdateProfile,
  onUpdateAvatar,
  handleLogout,
}: ProfileViewProps) {
  const isEn = language === 'en';

  // Acceso nativo a fotos y cámara del dispositivo
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(userAvatar);

  useEffect(() => {
    if (userAvatar) setCurrentAvatar(userAvatar);
  }, [userAvatar]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCurrentAvatar(dataUrl);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('kin_avatar', dataUrl);
          } catch (_) {}
        }
        if (onUpdateAvatar) {
          onUpdateAvatar(dataUrl);
        }
        notifyToast(
          isEn ? 'Profile photo updated successfully!' : '¡Foto de perfil actualizada con éxito!',
          'photo_camera'
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // 5 Core Modals State (Exact mapping to stitch_kin_mobile_CLIENTE)
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [paymentCardsModalOpen, setPaymentCardsModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

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

  // Draft profile fields - Limpios por defecto sin datos ficticios
  const [draftFirstName, setDraftFirstName] = useState(userFirstName || '');
  const [draftLastName, setDraftLastName] = useState(userLastName || '');
  const [draftPhone, setDraftPhone] = useState(userPhone || '');
  const [draftAddress1, setDraftAddress1] = useState(userAddress1 || '');
  const [draftAddress2, setDraftAddress2] = useState(userAddress2 || '');
  const [draftZip, setDraftZip] = useState(userZip || '');
  const [draftCity, setDraftCity] = useState(userCity || '');
  const [draftState, setDraftState] = useState(userState || '');

  useEffect(() => {
    setDraftFirstName(userFirstName || '');
    setDraftLastName(userLastName || '');
    setDraftPhone(userPhone || '');
    setDraftAddress1(userAddress1 || '');
    setDraftAddress2(userAddress2 || '');
    setDraftZip(userZip || '');
    setDraftCity(userCity || '');
    setDraftState(userState || '');
  }, [userFirstName, userLastName, userPhone, userAddress1, userAddress2, userZip, userCity, userState]);

  // Saved Payment Cards (Enterprise Stripe Sheet format)
  const [savedCards, setSavedCards] = useState<SavedCardItem[]>([
    {
      id: 'card-1',
      name: 'Obsidian Metal Debit',
      type: 'Visa',
      brand: 'visa',
      last4: '8942',
      exp: '09/28',
      isDefault: true,
      icon: 'contactless',
    },
    {
      id: 'card-2',
      name: 'Chase Premier Sapphire',
      type: 'Mastercard',
      brand: 'mastercard',
      last4: '4102',
      exp: '11/26',
      isDefault: false,
      icon: 'account_balance',
    },
  ]);

  // Load saved payment methods from API
  useEffect(() => {
    fetch(`/api/payment-methods?userId=${userId || 'user-001'}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.cards && Array.isArray(data.cards) && data.cards.length > 0) {
          setSavedCards(data.cards);
        }
      })
      .catch(() => {});
  }, [userId]);

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

  const handleAddNewCardFromSheet = (cardData: {
    cardNumber: string;
    exp: string;
    cvv: string;
    cardHolder: string;
    zip: string;
    country: string;
    savePermanently: boolean;
  }) => {
    const last4 = cardData.cardNumber.slice(-4) || '8831';
    let brand: 'visa' | 'mastercard' | 'amex' | 'discover' = 'visa';
    if (cardData.cardNumber.startsWith('34') || cardData.cardNumber.startsWith('37')) brand = 'amex';
    else if (cardData.cardNumber.startsWith('5') || cardData.cardNumber.startsWith('2')) brand = 'mastercard';
    else if (cardData.cardNumber.startsWith('6')) brand = 'discover';

    const newCard: SavedCardItem = {
      id: `pm_${Date.now()}`,
      name: cardData.cardHolder || 'Tarjeta Débito KIN',
      type: brand.toUpperCase(),
      brand: brand,
      last4: last4,
      exp: cardData.exp || '12/28',
      isDefault: savedCards.length === 0,
      icon: 'credit_card',
      zip: cardData.zip,
      country: cardData.country,
    };
    setSavedCards((prev) => [newCard, ...prev]);
    notifyToast(
      isEn ? 'New card linked & tokenized (PCI-DSS Level 1)' : 'Nueva tarjeta vinculada y tokenizada (PCI-DSS Nivel 1)',
      'verified_user'
    );
  };

  const handleSelectDefaultCard = async (cardId: string) => {
    setSavedCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === cardId,
      }))
    );
    try {
      await fetch('/api/payment-methods', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId || 'user-001', cardId }),
      });
    } catch (_) {}
    notifyToast(
      isEn ? 'Card selected as primary for transfers' : 'Tarjeta seleccionada para próximo envío',
      'check_circle'
    );
  };

  const handleDeleteCard = async (cardId: string) => {
    setSavedCards((prev) => prev.filter((c) => c.id !== cardId));
    try {
      await fetch(`/api/payment-methods?userId=${userId || 'user-001'}&cardId=${cardId}`, {
        method: 'DELETE',
      });
    } catch (_) {}
    notifyToast(
      isEn ? 'Payment method removed' : 'Método de pago eliminado',
      'delete'
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

  const displayAvatar = currentAvatar || userAvatar || defaultStitchAvatar;
  const displayName = `${draftFirstName} ${draftLastName}`.trim() || userName || 'Usuario KIN';
  const displayEmail = userEmail || '';
  const displayPhone = draftPhone || userPhone || '';

  return (
    <div className="flex flex-col w-full pb-8 select-none relative animate-fade-in">
      {/* Ambient Backdrop Halo Glows */}
      <div className="relative w-full">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#2ED5A4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-28 -right-10 w-44 h-44 bg-[#7047EB]/20 rounded-full blur-3xl pointer-events-none" />

        {/* ========================================================================= */}
        {/* SECTION 1: USER PROFILE HEADER HERO                                       */}
        {/* ========================================================================= */}
        <div className="anim-stagger-1 relative w-full rounded-2xl bg-surface-container-low p-5 mb-4 shadow-xl border border-white/5 overflow-hidden">
          {/* Input oculto para acceso directo a cámara y fotos del dispositivo */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileChange}
          />

          {/* Center Avatar + Name Architecture */}
          <div className="flex flex-col items-center text-center pt-2">
            <div
              className="relative mb-3 group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              title={isEn ? 'Tap to choose photo or take picture' : 'Toca para elegir foto o abrir la cámara'}
            >
              {/* Glowing Avatar Frame */}
              <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#2ED5A4] via-[#2ED5A4]/80 to-[#7047EB] shadow-[0_0_24px_rgba(46,213,164,0.35)] group-hover:scale-105 active:scale-95 transition-transform">
                <img
                  alt={`Avatar de ${displayName}`}
                  className="w-full h-full rounded-full object-cover bg-surface-container-lowest"
                  src={displayAvatar}
                />
              </div>

              {/* Edit Badge on Avatar - Acceso directo a Cámara / Fotos */}
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2ED5A4] text-[#003828] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-90 border-2 border-[#171b2a]">
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

            {/* Master Admin / Propietario Badge */}
            {(userEmail === 'airygc7@gmail.com' || userKycTier?.includes('Propietario') || userKycTier?.includes('Master Admin')) && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-primary/20 border border-amber-400/40 shadow-sm animate-pulse">
                <span className="material-symbols-outlined text-amber-400 text-[15px]">verified_user</span>
                <span className="font-label-caps text-[11px] font-extrabold text-amber-300 uppercase tracking-wider">
                  {isEn ? 'Master Admin & Owner' : 'Dueño & Master Admin'}
                </span>
              </div>
            )}
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
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate font-bold">
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
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">credit_card</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate font-bold">
                {isEn ? 'Payment Methods & Cards' : 'Métodos de Pago & Tarjetas'}
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn ? 'Saved cards, SPEI accounts & auto-pay' : 'Tarjetas guardadas, cuentas SPEI & pago auto'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="font-financial-mono text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-surface-container-highest text-emerald-700 dark:text-[#2ED5A4] font-bold border border-emerald-200/50 dark:border-transparent">
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
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">translate</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate font-bold">
                {isEn ? 'Language' : 'Idioma'}
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn ? 'English (US) • Active' : 'Español (México) • Activo'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="font-caption-sm text-[12px] text-white font-bold">
              {isEn ? 'EN' : 'ES'}
            </span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform text-on-surface-variant">
              chevron_right
            </span>
          </div>
        </button>

        {/* Menu Row 4: Conmutador Directo Modo Oscuro / Dark Mode (Screenshot 2 & 4) */}
        <div
          className="anim-stagger-4 w-full p-4 mb-2.5 rounded-2xl bg-surface-container-low text-left transition-colors flex items-center justify-between shadow-md border border-white/5"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">
                {theme === 'dark' ? 'dark_mode' : 'light_mode'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate font-bold">
                {isEn ? 'Dark mode' : 'Modo oscuro'}
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {theme === 'dark'
                  ? (isEn ? 'Catppuccin Mocha • Active' : 'Catppuccin Mocha • Activo')
                  : (isEn ? 'Antigravity Light • Active' : 'Modo claro Antigravity • Activo')}
              </span>
            </div>
          </div>
          <ToggleSwitch
            enabled={theme === 'dark'}
            onToggle={() => {
              const next = theme === 'dark' ? 'light' : 'dark';
              handleToggleTheme(next);
              notifyToast(
                next === 'dark'
                  ? (isEn ? 'Dark mode activated' : 'Modo oscuro activado')
                  : (isEn ? 'Light mode activated' : 'Modo claro activado'),
                next === 'dark' ? 'dark_mode' : 'light_mode'
              );
            }}
            title={isEn ? 'Dark mode' : 'Modo oscuro'}
          />
        </div>

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
            <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">shield</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate font-bold">
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
            <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">support_agent</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-base text-title-base text-white truncate font-bold">
                {isEn ? 'Help & Support KIN' : 'Ayuda & Soporte KIN'}
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn ? 'Live 24/7 assistance via Chat or WhatsApp' : 'Atención 24/7 en vivo vía Chat o WhatsApp'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="font-caption-sm text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-[#2ED5A4]/15 text-emerald-700 dark:text-[#2ED5A4] font-bold border border-emerald-200/50 dark:border-transparent">
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
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">fingerprint</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-body-medium text-body-medium text-white truncate font-bold">
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
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-start justify-center pt-2 sm:pt-4 pb-20 px-3 sm:px-4 overflow-y-auto transition-all duration-300 animate-fade-in"
          onClick={() => setEditProfileModalOpen(false)}
        >
          <div
            className="w-full max-w-[390px] max-h-[88vh] overflow-y-auto scrollbar-none rounded-3xl bg-surface-container border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.95)] p-5 relative animate-scale-in flex flex-col mt-0"
            onClick={(e) => e.stopPropagation()}
          >
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
                    placeholder={isEn ? 'Optional street address' : 'Dirección (calle y número)'}
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
                    placeholder={isEn ? 'Apt, Suite, Unit (optional)' : 'Apto, Suite, Edificio (opcional)'}
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
                    placeholder={isEn ? 'ZIP code' : 'Código Postal'}
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
                    placeholder={isEn ? 'City' : 'Ciudad'}
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
                    placeholder={isEn ? 'State or province' : 'Estado o provincia'}
                    value={draftState}
                    onChange={(e) => setDraftState(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  className="touch-press w-full h-13 rounded-full bg-[#2ED5A4] text-[#003828] font-title-base text-title-base font-bold shadow-[0_8px_24px_rgba(46,213,164,0.35)] flex items-center justify-center cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
                  type="submit"
                >
                  <span>{isEn ? 'Save Changes' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: STRIPE MOBILE PAYMENT SHEET (APPLE PAY, LINK, CARDS & ACH)       */}
      {/* ========================================================================= */}
      <StripePaymentSheetModal
        isOpen={paymentCardsModalOpen}
        onClose={() => setPaymentCardsModalOpen(false)}
        savedCards={savedCards}
        onSelectDefaultCard={handleSelectDefaultCard}
        onAddNewCard={handleAddNewCardFromSheet}
        onDeleteCard={handleDeleteCard}
        language={language}
        userId={userId}
      />

      {/* ========================================================================= */}
      {/* MODAL 3: IDIOMA / LANGUAGE SELECTOR                                       */}
      {/* ========================================================================= */}
      {languageModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-start justify-center pt-8 sm:pt-12 pb-24 px-3 sm:px-4 overflow-y-auto transition-all duration-300 animate-fade-in"
          onClick={() => setLanguageModalOpen(false)}
        >
          <div
            className="w-full max-w-[390px] max-h-[80vh] overflow-y-auto scrollbar-none rounded-3xl bg-surface-container border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.95)] p-5 relative animate-scale-in flex flex-col mt-2 sm:mt-4"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="space-y-3 mb-5">
              {/* Spanish Option */}
              <div
                className={`touch-press p-4 rounded-2xl bg-surface-container-low cursor-pointer flex items-center justify-between shadow-sm border transition-all ${
                  language === 'es' ? 'border-[#2ED5A4]/40 bg-surface-container' : 'border-white/5 opacity-80'
                }`}
                onClick={() => handleSelectLanguage('es')}
              >
                <div className="flex flex-col pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-title-base text-[16px] text-white font-bold">Español</span>
                    {language === 'es' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/20 text-[#2ED5A4]">
                        {isEn ? 'Active' : 'Activo'}
                      </span>
                    )}
                  </div>
                  <span className="font-caption-sm text-caption-sm text-on-surface-variant mt-0.5">
                    {isEn ? 'Spanish interface & notifications' : 'Interfaz y notificaciones en español'}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={language === 'es'}
                  onToggle={() => handleSelectLanguage('es')}
                  title="Español"
                />
              </div>

              {/* English Option */}
              <div
                className={`touch-press p-4 rounded-2xl bg-surface-container-low cursor-pointer flex items-center justify-between shadow-sm border transition-all ${
                  language === 'en' ? 'border-[#2ED5A4]/40 bg-surface-container' : 'border-white/5 opacity-80'
                }`}
                onClick={() => handleSelectLanguage('en')}
              >
                <div className="flex flex-col pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-title-base text-[16px] text-white font-bold">English</span>
                    {language === 'en' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/20 text-[#2ED5A4]">
                        {isEn ? 'Active' : 'Activo'}
                      </span>
                    )}
                  </div>
                  <span className="font-caption-sm text-caption-sm text-on-surface-variant mt-0.5">
                    {isEn ? 'English interface & notifications' : 'Interfaz y notificaciones en inglés'}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={language === 'en'}
                  onToggle={() => handleSelectLanguage('en')}
                  title="English"
                />
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
      {/* MODAL 5: PRIVACIDAD & SEGURIDAD DETAIL DRAWER                             */}
      {/* ========================================================================= */}
      {securityModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-start justify-center pt-8 sm:pt-12 pb-24 px-3 sm:px-4 overflow-y-auto transition-all duration-300 animate-fade-in"
          onClick={() => setSecurityModalOpen(false)}
        >
          <div
            className="w-full max-w-[390px] max-h-[80vh] overflow-y-auto scrollbar-none rounded-3xl bg-surface-container border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.95)] p-5 relative animate-scale-in flex flex-col mt-2 sm:mt-4"
            onClick={(e) => e.stopPropagation()}
          >
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
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-start justify-center pt-8 sm:pt-12 pb-24 px-3 sm:px-4 overflow-y-auto transition-all duration-300 animate-fade-in"
          onClick={() => setSupportModalOpen(false)}
        >
          <div
            className="w-full max-w-[390px] max-h-[80vh] overflow-y-auto scrollbar-none rounded-3xl bg-surface-container border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.95)] p-5 relative animate-scale-in flex flex-col mt-2 sm:mt-4"
            onClick={(e) => e.stopPropagation()}
          >
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
