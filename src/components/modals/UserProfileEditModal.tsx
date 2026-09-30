'use client';

import React from 'react';
import { CameraIcon, CloseIcon, CheckCircleIcon, LanguageIcon } from '@/components/Icons';
import { capitalizeWords } from '@/lib/utils/capitalize';

export const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
];

export interface UserProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftLanguage: 'es' | 'en';
  setDraftLanguage: (lang: 'es' | 'en') => void;
  draftCurrencyPref: 'USD' | 'MXN';
  setDraftCurrencyPref: (pref: 'USD' | 'MXN') => void;
  draftFirstName: string;
  setDraftFirstName: (val: string) => void;
  draftLastName: string;
  setDraftLastName: (val: string) => void;
  draftEmail: string;
  setDraftEmail: (val: string) => void;
  draftPhone: string;
  setDraftPhone: (val: string) => void;
  draftCity: string;
  setDraftCity: (val: string) => void;
  draftState: string;
  setDraftState: (val: string) => void;
  draftAvatar: string;
  setDraftAvatar: (val: string) => void;
  customAvatarInput: string;
  setCustomAvatarInput: (val: string) => void;
  onSave: () => void;
}

export function UserProfileEditModal({
  isOpen,
  onClose,
  draftLanguage,
  setDraftLanguage,
  draftCurrencyPref,
  setDraftCurrencyPref,
  draftFirstName,
  setDraftFirstName,
  draftLastName,
  setDraftLastName,
  draftEmail,
  setDraftEmail,
  draftPhone,
  setDraftPhone,
  draftCity,
  setDraftCity,
  draftState,
  setDraftState,
  draftAvatar,
  setDraftAvatar,
  customAvatarInput,
  setCustomAvatarInput,
  onSave,
}: UserProfileEditModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-title"
    >
      <div
        className="modal-card space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 rounded-full bg-outline-variant/40 mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header del modal */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <CameraIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 id="user-profile-title" className="text-sm font-bold text-on-surface">
                {draftLanguage === 'en' ? 'Edit Profile & Settings' : 'Editar Perfil & Datos'}
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                {draftLanguage === 'en'
                  ? 'Update contact info, photo & app language'
                  : 'Actualiza tu información de contacto, foto e idioma'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer active:scale-[0.95] transition-all"
            title={draftLanguage === 'en' ? 'Close without saving' : 'Cerrar sin guardar'}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* SECCIÓN PREMIER: SELECTOR DE IDIOMA DEL CLIENTE (BILINGÜE ES / EN) */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low border border-primary/25 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                <LanguageIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block">
                  {draftLanguage === 'en' ? 'App Language' : 'Idioma de la Aplicación'}
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  {draftLanguage === 'en' ? 'Interface & notifications language' : 'Idioma para interfaz y avisos'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
              {draftLanguage === 'en' ? 'EN Active' : 'ES Activo'}
            </span>
          </div>

          {/* Segmented Touch Targets (min 48-52px de altura para ergonomía móvil HIG) */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => setDraftLanguage('es')}
              className={`h-12 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-transform duration-150 ease-out cursor-pointer active:scale-[0.97] ${
                draftLanguage === 'es'
                  ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20 font-black'
                  : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:border-outline-variant hover:text-on-surface font-semibold'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
              <span>Español</span>
              {draftLanguage === 'es' && <span className="text-sm font-black">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => setDraftLanguage('en')}
              className={`h-12 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-transform duration-150 ease-out cursor-pointer active:scale-[0.97] ${
                draftLanguage === 'en'
                  ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20 font-black'
                  : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:border-outline-variant hover:text-on-surface font-semibold'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
              <span>English</span>
              {draftLanguage === 'en' && <span className="text-sm font-black">✓</span>}
            </button>
          </div>

          <p className="text-[10px] text-on-surface-variant text-center">
            {draftLanguage === 'en'
              ? 'The application, notifications and SPEI receipts will display in English.'
              : 'Toda la interfaz, notificaciones y comprobantes SPEI se mostrarán en español.'}
          </p>
        </div>

        {/* SECCIÓN PREMIER 2: BILLETERA & MONEDA BASE (USA USD 🇺🇸 / MÉXICO MXN 🇲🇽) */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low border border-primary/25 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block">
                  {draftLanguage === 'en' ? 'Default Account Currency' : 'Moneda Base de la Cuenta'}
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  {draftLanguage === 'en' ? 'Select primary balance & region mode' : 'Selecciona tu moneda principal y región'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
              {draftCurrencyPref === 'USD' ? '🇺🇸 USD Activo' : '🇲🇽 MXN Activo'}
            </span>
          </div>

          {/* Segmented Control 2 Opciones */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => setDraftCurrencyPref('USD')}
              className={`h-12 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-transform duration-150 ease-out cursor-pointer active:scale-[0.97] ${
                draftCurrencyPref === 'USD'
                  ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20 font-black'
                  : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:border-outline-variant hover:text-on-surface font-semibold'
              }`}
            >
              <span className="text-base">🇺🇸</span>
              <span>{draftLanguage === 'en' ? 'US Dollars (USD)' : 'Dólares (USD)'}</span>
              {draftCurrencyPref === 'USD' && <span className="text-sm font-black">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => setDraftCurrencyPref('MXN')}
              className={`h-12 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-transform duration-150 ease-out cursor-pointer active:scale-[0.97] ${
                draftCurrencyPref === 'MXN'
                  ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20 font-black'
                  : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:border-outline-variant hover:text-on-surface font-semibold'
              }`}
            >
              <span className="text-base">🇲🇽</span>
              <span>{draftLanguage === 'en' ? 'Mexican Pesos (MXN)' : 'Pesos (MXN)'}</span>
              {draftCurrencyPref === 'MXN' && <span className="text-sm font-black">✓</span>}
            </button>
          </div>

          <p className="text-[10px] text-on-surface-variant text-center">
            {draftCurrencyPref === 'USD'
              ? draftLanguage === 'en'
                ? 'Configured for US residents: Send money to Mexico and domestic USD transfers.'
                : 'Configurado para residentes en EE. UU.: Envíos a México y transferencias en dólares.'
              : draftLanguage === 'en'
                ? 'Configured for Mexico residents & travelers: KIN CASH in pesos and local SPEI withdrawals.'
                : 'Configurado para residentes en México y viajeros: KIN CASH en pesos y retiros locales SPEI.'}
          </p>
        </div>

        {/* Nombre y Apellido (2 Columnas) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1 px-0.5">
              {draftLanguage === 'en' ? 'First Name(s):' : 'Nombre(s):'}
            </label>
            <div className="auth-input-group">
              <input
                type="text"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                value={draftFirstName}
                onChange={(e) => setDraftFirstName(capitalizeWords(e.target.value))}
                placeholder={draftLanguage === 'en' ? 'First Name' : 'Nombre'}
                className="auth-input-field capitalize"
                style={{ paddingLeft: '14px' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1 px-0.5">
              {draftLanguage === 'en' ? 'Last Name(s):' : 'Apellido(s):'}
            </label>
            <div className="auth-input-group">
              <input
                type="text"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                value={draftLastName}
                onChange={(e) => setDraftLastName(capitalizeWords(e.target.value))}
                placeholder={draftLanguage === 'en' ? 'Last Name' : 'Apellido'}
                className="auth-input-field capitalize"
                style={{ paddingLeft: '14px' }}
              />
            </div>
          </div>
        </div>

        {/* Correo Electrónico Registrado */}
        <div>
          <label className="text-xs font-semibold text-on-surface-variant block mb-1 px-0.5">
            {draftLanguage === 'en' ? 'Registered Email:' : 'Correo Electrónico Registrado:'}
          </label>
          <div className="auth-input-group">
            <input
              type="email"
              value={draftEmail}
              onChange={(e) => setDraftEmail(e.target.value)}
              placeholder={draftLanguage === 'en' ? 'your@email.com' : 'tu@correo.com'}
              className="auth-input-field"
              style={{ paddingLeft: '14px' }}
            />
          </div>
        </div>

        {/* Teléfono Móvil */}
        <div>
          <label className="text-xs font-semibold text-on-surface-variant block mb-1 px-0.5">
            {draftLanguage === 'en' ? 'Mobile Phone (with country code):' : 'Teléfono Móvil (con lada):'}
          </label>
          <div className="auth-input-group">
            <input
              type="tel"
              value={draftPhone}
              onChange={(e) => setDraftPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="auth-input-field"
              style={{ paddingLeft: '14px' }}
            />
          </div>
        </div>

        {/* Ciudad y Estado (2 Columnas) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1 px-0.5">
              {draftLanguage === 'en' ? 'City:' : 'Ciudad:'}
            </label>
            <div className="auth-input-group">
              <input
                type="text"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                value={draftCity}
                onChange={(e) => setDraftCity(capitalizeWords(e.target.value))}
                placeholder={draftLanguage === 'en' ? 'City' : 'Ciudad'}
                className="auth-input-field capitalize"
                style={{ paddingLeft: '14px' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1 px-0.5">
              {draftLanguage === 'en' ? 'State:' : 'Estado:'}
            </label>
            <div className="auth-input-group">
              <input
                type="text"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                value={draftState}
                onChange={(e) => setDraftState(capitalizeWords(e.target.value))}
                placeholder={draftLanguage === 'en' ? 'State' : 'Estado'}
                className="auth-input-field capitalize"
                style={{ paddingLeft: '14px' }}
              />
            </div>
          </div>
        </div>

        {/* Opción Sin Foto / Dejar Recuadro Vacío */}
        <div>
          <label className="text-xs font-semibold text-on-surface-variant block mb-1.5 px-0.5">
            {draftLanguage === 'en' ? 'Profile photo options:' : 'Opciones de foto de perfil:'}
          </label>
          <button
            type="button"
            onClick={() => {
              setDraftAvatar('');
              setCustomAvatarInput('');
            }}
            className={`w-full py-2.5 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-transform duration-150 ease-out cursor-pointer active:scale-[0.97] ${
              !draftAvatar
                ? 'border-primary bg-primary/15 text-primary shadow-xs'
                : 'border-outline-variant/40 bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">no_accounts</span>
            <span>{draftLanguage === 'en' ? 'No profile photo (Empty frame)' : 'Sin foto de perfil (Recuadro vacío)'}</span>
          </button>
        </div>

        {/* Subir foto de la galería / dispositivo del cliente */}
        <div>
          <label className="text-xs font-semibold text-on-surface-variant block mb-1.5 px-0.5">
            {draftLanguage === 'en' ? 'Or upload from your device gallery:' : 'O subir desde la galería de tu dispositivo:'}
          </label>
          <label className="w-full h-11 rounded-2xl bg-surface-container border border-outline-variant/40 hover:border-primary flex items-center justify-center gap-2 text-xs font-bold text-on-surface cursor-pointer transition-colors shadow-xs active:scale-[0.98]">
            <CameraIcon className="w-4 h-4 text-primary" />
            <span>{draftLanguage === 'en' ? 'Choose photo from gallery' : 'Elegir foto de mi galería'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      setDraftAvatar(event.target.result as string);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>

        {/* Galería de Avatares Predefinidos */}
        <div>
          <label className="text-xs font-semibold text-on-surface-variant block mb-2 px-0.5">
            {draftLanguage === 'en' ? 'Or select a predefined avatar:' : 'O selecciona uno de los avatares predefinidos:'}
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {DEFAULT_AVATARS.map((url, idx) => {
              const isSelected = draftAvatar === url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDraftAvatar(url)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer active:scale-[0.95] ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-xs'
                      : 'border-outline-variant/30 bg-surface-container hover:border-outline-variant'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border border-outline-variant/40">
                    <img
                      src={url}
                      alt={`Avatar ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface font-medium">
                    {draftLanguage === 'en' ? `Option ${idx + 1}` : `Opción ${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* O ingresar URL personalizada */}
        <div>
          <label className="text-xs font-semibold text-on-surface-variant block mb-1 px-0.5">
            {draftLanguage === 'en' ? 'Or enter custom image URL:' : 'O ingresa la URL de tu imagen:'}
          </label>
          <div className="flex gap-2">
            <div className="auth-input-group flex-1">
              <input
                type="url"
                placeholder="https://..."
                value={customAvatarInput}
                onChange={(e) => setCustomAvatarInput(e.target.value)}
                className="auth-input-field"
                style={{ paddingLeft: '14px' }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (customAvatarInput.trim()) {
                  setDraftAvatar(customAvatarInput.trim());
                  setCustomAvatarInput('');
                }
              }}
              className="px-4 rounded-2xl bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-container-highest border border-outline-variant/40 cursor-pointer active:scale-[0.97]"
            >
              {draftLanguage === 'en' ? 'Apply' : 'Usar'}
            </button>
          </div>
        </div>

        {/* Botón Guardar */}
        <button
          type="button"
          onClick={onSave}
          className="auth-btn-cta active mt-3 active:scale-[0.98] transition-transform"
        >
          {draftLanguage === 'en' ? 'Save Changes' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
