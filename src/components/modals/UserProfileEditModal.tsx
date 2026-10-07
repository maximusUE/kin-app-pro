'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CameraIcon, ChevronLeftIcon, CheckCircleIcon, LanguageIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
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
  const [mounted, setMounted] = useState(false);
  const isEn = draftLanguage === 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in text-white"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-title"
    >
      <div
        className="relative w-full max-w-[440px] max-h-[90vh] overflow-y-auto scrollbar-none bg-[#0E131F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.95)] flex flex-col space-y-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Universal Don César Header: < | KinLogo | Profile Badge */}
        <header className="flex items-center justify-between pb-1 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle"
              title={isEn ? 'Back' : 'Volver'}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={34} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[13px]">badge</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
              {isEn ? 'Official Profile' : 'Perfil Oficial'}
            </span>
          </div>
        </header>

        {/* Title */}
        <div className="text-center pt-1">
          <h3 id="user-profile-title" className="text-lg font-bold text-white tracking-tight">
            {isEn ? 'Edit Profile & Settings' : 'Editar Perfil & Datos'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEn
              ? 'Update contact info, photo & app language'
              : 'Actualiza tu información de contacto, foto e idioma'}
          </p>
        </div>

        {/* SECCIÓN PREMIER: SELECTOR DE IDIOMA (BILINGÜE ES / EN) */}
        <div className="p-3.5 rounded-2xl bg-[#141624] border border-emerald-500/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#2ED5A4]">
                <LanguageIcon className="w-4 h-4 text-[#2ED5A4]" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {isEn ? 'App Language' : 'Idioma de la Aplicación'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isEn ? 'Interface & notifications language' : 'Idioma para interfaz y avisos'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-[#2ED5A4] border border-emerald-500/30">
              {isEn ? 'EN Active' : 'ES Activo'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => setDraftLanguage('es')}
              className={`h-11 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-transform duration-150 ease-out cursor-pointer active:scale-[0.97] ${
                draftLanguage === 'es'
                  ? 'bg-[#2ED5A4] text-[#06070B] border-[#2ED5A4] shadow-md shadow-[#2ED5A4]/20 font-black'
                  : 'bg-[#0E131F] text-slate-400 border-white/10 hover:border-white/20 hover:text-white font-semibold'
              }`}
            >
              <span>Español</span>
              {draftLanguage === 'es' && <span className="text-sm font-black">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => setDraftLanguage('en')}
              className={`h-11 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-transform duration-150 ease-out cursor-pointer active:scale-[0.97] ${
                draftLanguage === 'en'
                  ? 'bg-[#2ED5A4] text-[#06070B] border-[#2ED5A4] shadow-md shadow-[#2ED5A4]/20 font-black'
                  : 'bg-[#0E131F] text-slate-400 border-white/10 hover:border-white/20 hover:text-white font-semibold'
              }`}
            >
              <span>English</span>
              {draftLanguage === 'en' && <span className="text-sm font-black">✓</span>}
            </button>
          </div>
        </div>

        {/* SECCIÓN PREMIER 2: MONEDA BASE (USA USD / MÉXICO MXN) */}
        <div className="p-3.5 rounded-2xl bg-[#141624] border border-white/5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#2ED5A4]">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {isEn ? 'Default Account Currency' : 'Moneda Base de la Cuenta'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isEn ? 'Primary balance & region mode' : 'Selecciona tu moneda principal y región'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-[#2ED5A4] border border-emerald-500/30">
              {draftCurrencyPref === 'USD' ? '🇺🇸 USD Activo' : '🇲🇽 MXN Activo'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => setDraftCurrencyPref('USD')}
              className={`h-11 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-transform duration-150 ease-out cursor-pointer active:scale-[0.97] ${
                draftCurrencyPref === 'USD'
                  ? 'bg-[#2ED5A4] text-[#06070B] border-[#2ED5A4] shadow-md shadow-[#2ED5A4]/20 font-black'
                  : 'bg-[#0E131F] text-slate-400 border-white/10 hover:border-white/20 hover:text-white font-semibold'
              }`}
            >
              <span className="text-base">🇺🇸</span>
              <span>USD</span>
              {draftCurrencyPref === 'USD' && <span className="text-sm font-black">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => setDraftCurrencyPref('MXN')}
              className={`h-11 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-transform duration-150 ease-out cursor-pointer active:scale-[0.97] ${
                draftCurrencyPref === 'MXN'
                  ? 'bg-[#2ED5A4] text-[#06070B] border-[#2ED5A4] shadow-md shadow-[#2ED5A4]/20 font-black'
                  : 'bg-[#0E131F] text-slate-400 border-white/10 hover:border-white/20 hover:text-white font-semibold'
              }`}
            >
              <span className="text-base">🇲🇽</span>
              <span>MXN</span>
              {draftCurrencyPref === 'MXN' && <span className="text-sm font-black">✓</span>}
            </button>
          </div>
        </div>

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 px-0.5">
              {isEn ? 'First Name(s):' : 'Nombre(s):'}
            </label>
            <input
              type="text"
              autoCapitalize="words"
              value={draftFirstName}
              onChange={(e) => setDraftFirstName(capitalizeWords(e.target.value))}
              placeholder={isEn ? 'First Name' : 'Nombre'}
              className="w-full h-11 px-3 rounded-xl bg-[#141624] text-xs text-white placeholder:text-slate-500 border border-white/10 focus:border-[#2ED5A4] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 px-0.5">
              {isEn ? 'Last Name(s):' : 'Apellido(s):'}
            </label>
            <input
              type="text"
              autoCapitalize="words"
              value={draftLastName}
              onChange={(e) => setDraftLastName(capitalizeWords(e.target.value))}
              placeholder={isEn ? 'Last Name' : 'Apellido'}
              className="w-full h-11 px-3 rounded-xl bg-[#141624] text-xs text-white placeholder:text-slate-500 border border-white/10 focus:border-[#2ED5A4] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Correo Electrónico Registrado */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1 px-0.5">
            {isEn ? 'Registered Email:' : 'Correo Electrónico:'}
          </label>
          <input
            type="email"
            value={draftEmail}
            onChange={(e) => setDraftEmail(e.target.value)}
            placeholder={isEn ? 'your@email.com' : 'tu@correo.com'}
            className="w-full h-11 px-3 rounded-xl bg-[#141624] text-xs text-white placeholder:text-slate-500 border border-white/10 focus:border-[#2ED5A4] focus:outline-none transition-all"
          />
        </div>

        {/* Teléfono Móvil */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1 px-0.5">
            {isEn ? 'Mobile Phone:' : 'Teléfono Móvil:'}
          </label>
          <input
            type="tel"
            value={draftPhone}
            onChange={(e) => setDraftPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full h-11 px-3 rounded-xl bg-[#141624] text-xs text-white placeholder:text-slate-500 border border-white/10 focus:border-[#2ED5A4] focus:outline-none transition-all"
          />
        </div>

        {/* Ciudad y Estado */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 px-0.5">
              {isEn ? 'City:' : 'Ciudad:'}
            </label>
            <input
              type="text"
              autoCapitalize="words"
              value={draftCity}
              onChange={(e) => setDraftCity(capitalizeWords(e.target.value))}
              placeholder={isEn ? 'City' : 'Ciudad'}
              className="w-full h-11 px-3 rounded-xl bg-[#141624] text-xs text-white placeholder:text-slate-500 border border-white/10 focus:border-[#2ED5A4] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 px-0.5">
              {isEn ? 'State:' : 'Estado:'}
            </label>
            <input
              type="text"
              autoCapitalize="words"
              value={draftState}
              onChange={(e) => setDraftState(capitalizeWords(e.target.value))}
              placeholder={isEn ? 'State' : 'Estado'}
              className="w-full h-11 px-3 rounded-xl bg-[#141624] text-xs text-white placeholder:text-slate-500 border border-white/10 focus:border-[#2ED5A4] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Galería de Avatares Predefinidos */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 block px-0.5">
            {isEn ? 'Choose Avatar:' : 'Selecciona un Avatar:'}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {DEFAULT_AVATARS.map((url, idx) => {
              const isSelected = draftAvatar === url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDraftAvatar(url)}
                  className={`flex flex-col items-center p-1 rounded-2xl border transition-all cursor-pointer active:scale-[0.95] ${
                    isSelected
                      ? 'border-[#2ED5A4] bg-[#2ED5A4]/15 shadow-sm shadow-[#2ED5A4]/20'
                      : 'border-white/10 bg-[#141624] hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden relative">
                    <img
                      src={url}
                      alt={`Avatar ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#2ED5A4]/30 flex items-center justify-center">
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subir foto de la galería */}
        <div>
          <label className="w-full h-11 rounded-2xl bg-[#141624] border border-dashed border-white/20 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition-colors active:scale-[0.98]">
            <CameraIcon className="w-4 h-4 text-[#2ED5A4]" />
            <span>{isEn ? 'Upload custom picture from gallery' : 'Subir foto desde galería'}</span>
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

        {/* Botón Guardar Cambios */}
        <button
          type="button"
          onClick={onSave}
          className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-[#2ED5A4] to-[#26BC90] hover:brightness-110 text-[#06070B] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2ED5A4]/20 cursor-pointer active:scale-[0.98] transition-transform duration-150 ease-out mt-2"
        >
          <span>{isEn ? 'Save Changes' : 'Guardar Cambios'}</span>
          <span className="material-symbols-outlined text-[18px]">check</span>
        </button>
      </div>
    </div>,
    document.body
  );
}
