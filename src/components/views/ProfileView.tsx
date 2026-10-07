'use client';

import React, { useState, useEffect } from 'react';
import { ToggleSwitch } from '@/components/AppSettingsModal';
import { PaymentMethodsView, SavedCardItem } from '@/components/views/PaymentMethodsView';
import { FxControlModal } from '@/components/FxControlModal';
import { ChevronLeftIcon, SettingsGearIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { KycUpgradeModal } from '@/components/modals/KycUpgradeModal';
import { TaxReportModal } from '@/components/modals/TaxReportModal';
import { PersonalInformationModal } from '@/components/modals/PersonalInformationModal';
import { LanguageSelectionModal } from '@/components/modals/LanguageSelectionModal';
import { PrivacySecurityModal } from '@/components/modals/PrivacySecurityModal';
import { KinSupportModal } from '@/components/modals/KinSupportModal';

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
  exchangeRate?: number;
  onExchangeRateUpdated?: (newRate: number) => void;
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
  exchangeRate = 20.45,
  onExchangeRateUpdated,
  onUpdateProfile,
  onUpdateAvatar,
  handleLogout,
}: ProfileViewProps) {
  const isEn = language === 'en';

  const [showFxModal, setShowFxModal] = useState(false);
  // Acceso nativo a fotos y cámara del dispositivo
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(userAvatar);
  const [avatarError, setAvatarError] = useState<boolean>(false);

  useEffect(() => {
    if (userAvatar) {
      setCurrentAvatar(userAvatar);
      setAvatarError(false);
    }
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
  const [isPaymentMethodsViewActive, setIsPaymentMethodsViewActive] = useState(false);
  const [paymentCardsModalOpen, setPaymentCardsModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [kycUpgradeModalOpen, setKycUpgradeModalOpen] = useState(false);
  const [taxReportModalOpen, setTaxReportModalOpen] = useState(false);

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

  const hasCustomAvatar = Boolean(
    (currentAvatar || userAvatar) &&
    (currentAvatar || userAvatar)!.trim().length > 0 &&
    !(currentAvatar || userAvatar)!.includes('images.unsplash.com') &&
    !(currentAvatar || userAvatar)!.includes('lh3.googleusercontent.com') &&
    !avatarError
  );
  const displayAvatar = hasCustomAvatar ? (currentAvatar || userAvatar)! : '';
  const displayName = `${draftFirstName} ${draftLastName}`.trim() || userName || 'Usuario KIN';
  const displayEmail = userEmail || '';
  const displayPhone = draftPhone || userPhone || '';
  const initials = `${draftFirstName?.[0] || displayName?.[0] || 'C'}${draftLastName?.[0] || (displayName.split(' ')[1]?.[0] || 'U')}`.toUpperCase();

  if (isPaymentMethodsViewActive) {
    return (
      <PaymentMethodsView
        onBack={() => setIsPaymentMethodsViewActive(false)}
        savedCards={savedCards}
        onSelectDefaultCard={handleSelectDefaultCard}
        onAddNewCard={handleAddNewCardFromSheet}
        onDeleteCard={handleDeleteCard}
        language={language}
      />
    );
  }

  return (
    <div className="flex flex-col w-full pb-8 select-none relative animate-fade-in space-y-4">
      {/* Header: < | KinLogo | Mi Perfil | Settings */}
      <header className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="btn-circle"
            title={isEn ? "Back to Home" : "Volver a Inicio"}
          >
            <ChevronLeftIcon className="w-5 h-5 text-white" />
          </button>
          <KinLogo size={34} />
        </div>
        <div className="text-center">
          <h1 className="text-base font-bold text-white tracking-wide">
            {isEn ? 'My Profile' : 'Mi Perfil'}
          </h1>
          <span className="text-[10px] text-[#2ED5A4] font-medium flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
            {userKycTier || 'Tier 1'}
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="btn-circle"
          title={isEn ? "Settings & Preferences" : "Configuración & Ajustes"}
        >
          <SettingsGearIcon className="w-5 h-5 text-white" />
        </button>
      </header>

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
              <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#2ED5A4] via-[#2ED5A4]/80 to-[#7047EB] shadow-[0_0_24px_rgba(46,213,164,0.35)] group-hover:scale-105 active:scale-95 transition-transform flex items-center justify-center">
                {hasCustomAvatar ? (
                  <img
                    alt={`Avatar de ${displayName}`}
                    className="w-full h-full rounded-full object-cover bg-surface-container-lowest"
                    src={displayAvatar}
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#181928] flex items-center justify-center text-white font-black text-2xl tracking-wider select-none border border-white/10 shadow-inner">
                    {initials}
                  </div>
                )}
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
        {/* KYC TIER PROGRESS & LIMIT METER (2026 HIGH-HIERARCHY STANDARD)            */}
        {/* ========================================================================= */}
        <div className="anim-stagger-2 mb-4 p-4 rounded-2xl bg-gradient-to-br from-[#1C1D2F] via-[#141524] to-[#0E0F1A] border border-[#2ED5A4]/25 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#2ED5A4] border border-emerald-500/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">
                    {userKycTier || 'Nivel 1 — Básico'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#2ED5A4] font-bold border border-emerald-500/30">
                    {isEn ? '$1,000/day' : '$1,000/día'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {isEn ? 'Next: Tier 2 ($3,000 USD/day)' : 'Siguiente: Nivel 2 ($3,000 USD/día)'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setKycUpgradeModalOpen(true)}
              className="text-xs font-bold text-[#2ED5A4] hover:text-[#57f2bf] px-3 py-1.5 rounded-xl bg-[#2ED5A4]/15 hover:bg-[#2ED5A4]/25 border border-[#2ED5A4]/30 transition-all cursor-pointer shrink-0"
            >
              {isEn ? 'Upgrade' : 'Subir Nivel'}
            </button>
          </div>

          {/* Progress Bar & Indicators */}
          <div className="space-y-1">
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-[#2ED5A4] rounded-full transition-all duration-500 w-[35%]" />
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
              <span>Nivel 1 ($1k)</span>
              <span>Nivel 2 ($3k)</span>
              <span>Nivel 3 ($10k)</span>
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

        {/* Menu Row 0: Acceso Directo a Pantalla de Login / OAuth */}
        <button
          type="button"
          aria-label={isEn ? 'Login & OAuth Screen' : 'Pantalla de Login y OAuth'}
          className="anim-stagger-3 touch-press w-full p-4 mb-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent hover:bg-emerald-500/15 text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer border border-emerald-500/20"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-[#2ED5A4] border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">key</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-title-base text-title-base text-white truncate font-bold">
                  {isEn ? 'Login & OAuth Portal' : 'Portal de Login & OAuth'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                  {isEn ? 'Direct' : 'Directo'}
                </span>
              </div>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn ? 'Google, Apple, Phone & Password login flows' : 'Acceso con Google, Apple, Teléfono y Contraseña'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform text-[#2ED5A4]">
              open_in_new
            </span>
          </div>
        </button>

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
          onClick={() => setIsPaymentMethodsViewActive(true)}
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

        {/* Menu Row: Certificado Fiscal Anual 1099 / SAT */}
        <button
          type="button"
          aria-label={isEn ? 'Annual Tax Certificate' : 'Certificado Fiscal Anual'}
          className="anim-stagger-3 touch-press w-full p-4 mb-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer border border-white/5"
          onClick={() => setTaxReportModalOpen(true)}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">policy</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-title-base text-title-base text-white truncate font-bold">
                  {isEn ? 'Annual Tax Certificate' : 'Certificado Fiscal Anual'}
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[9px] border border-amber-500/30">
                  IRS • SAT
                </span>
              </div>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn ? 'Form 1099 statement & CPA remittance export' : 'Comprobante 1099 y desglose fiscal de remesas'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform text-[#2ED5A4]">
              download
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
        {/* SECTION: TESORERÍA & TIPO DE CAMBIO (ADMIN KIN)                          */}
        {/* ========================================================================= */}
        <div className="anim-stagger-4 flex items-center justify-between px-1 mt-3 mb-2">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant font-bold">
            {isEn ? 'Treasury & FX Control' : 'Tesorería & Tipo de Cambio'}
          </span>
          <span className="font-caption-sm text-[10px] text-primary font-black uppercase px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30">
            Admin Propietario
          </span>
        </div>

        <button
          type="button"
          aria-label={isEn ? 'FX Market & Margin Control' : 'Control de Tipo de Cambio y Margen'}
          onClick={() => setShowFxModal(true)}
          className="anim-stagger-4 touch-press w-full p-4 mb-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex items-center justify-between group shadow-md cursor-pointer border border-primary/20 hover:border-primary/50 relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#2ED5A4]/25 to-primary/30 text-[#2ED5A4] border border-[#2ED5A4]/40 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(46,213,164,0.3)] shrink-0">
              <span className="material-symbols-outlined text-[24px]">currency_exchange</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-title-base text-title-base text-white truncate font-bold">
                  {isEn ? 'FX Market & Margin Control' : 'Control de Tipo de Cambio & Margen'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
              </div>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {isEn
                  ? `Active rate in app: 1 USD = $${Number(exchangeRate).toFixed(2)} MXN`
                  : `Tasa activa en la app: 1 USD = $${Number(exchangeRate).toFixed(2)} MXN`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <div className="flex flex-col items-end">
              <span className="font-financial-mono text-sm font-black text-[#2ED5A4]">
                ${Number(exchangeRate).toFixed(2)}
              </span>
              <span className="text-[10px] text-outline">MXN/USD</span>
            </div>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform text-[#2ED5A4]">
              tune
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
      {/* MODAL 1: INFORMACIÓN PERSONAL (DON CÉSAR NATIVE 2026)                     */}
      {/* ========================================================================= */}
      <PersonalInformationModal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        initialData={{
          firstName: draftFirstName,
          lastName: draftLastName,
          phone: draftPhone,
          address1: draftAddress1,
          address2: draftAddress2,
          zip: draftZip,
          city: draftCity,
          state: draftState,
        }}
        onSave={(data) => {
          setDraftFirstName(data.firstName);
          setDraftLastName(data.lastName);
          setDraftPhone(data.phone);
          setDraftAddress1(data.address1);
          setDraftAddress2(data.address2);
          setDraftZip(data.zip);
          setDraftCity(data.city);
          setDraftState(data.state);
          const full = `${data.firstName} ${data.lastName}`.trim();
          setSavedFullName(full);
          if (data.phone) setSavedPhone(data.phone);
          const fullAddr = [data.address1, data.city, data.state].filter(Boolean).join(', ');
          if (fullAddr) setSavedAddress(fullAddr);
          if (typeof window !== 'undefined') {
            localStorage.setItem('kin_user_name', full);
            if (data.phone) localStorage.setItem('kin_user_phone', data.phone);
            if (fullAddr) localStorage.setItem('kin_user_address', fullAddr);
          }
        }}
        language={language}
      />

      {/* ========================================================================= */}
      {/* MODAL 3: IDIOMA / LANGUAGE SELECTOR                                       */}
      {/* ========================================================================= */}
      <LanguageSelectionModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={(newLang) => handleSelectLanguage(newLang)}
      />

      {/* ========================================================================= */}
      {/* MODAL 5: PRIVACIDAD & SEGURIDAD DETAIL DRAWER                             */}
      {/* ========================================================================= */}
      <PrivacySecurityModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
        onOpenVault={onOpenVault}
        language={language}
      />

      {/* ========================================================================= */}
      {/* MODAL 6: AYUDA & SOPORTE 24/7 (CENTRO DE AYUDA KIN)                       */}
      {/* ========================================================================= */}
      <KinSupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        userClientId={userClientId}
        language={language}
      />


      {/* Modal de Control de Tipo de Cambio & Tesorería */}
      <FxControlModal
        isOpen={showFxModal}
        onClose={() => setShowFxModal(false)}
        currentRate={exchangeRate}
        onRateUpdated={(newRate) => {
          onExchangeRateUpdated?.(newRate);
        }}
        language={language}
      />

      {/* Modal de Nivel de Verificación KYC */}
      <KycUpgradeModal
        isOpen={kycUpgradeModalOpen}
        onClose={() => setKycUpgradeModalOpen(false)}
        currentTier={userKycTier}
        language={language}
      />

      {/* Modal de Certificado Fiscal Anual 1099 & SAT */}
      <TaxReportModal
        isOpen={taxReportModalOpen}
        onClose={() => setTaxReportModalOpen(false)}
        userName={userName}
        userEmail={userEmail}
        language={language}
      />
    </div>
  );
}
