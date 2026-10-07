'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: 'es' | 'en';
  onSelectLanguage: (lang: 'es' | 'en') => void;
}

export function LanguageSelectionModal({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}: LanguageSelectionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'es' | 'en'>(currentLanguage);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedLang(currentLanguage);
    }
  }, [isOpen, currentLanguage]);

  if (!isOpen || !mounted) return null;

  const isEn = selectedLang === 'en';

  const handleConfirm = () => {
    onSelectLanguage(selectedLang);
    toast.success(
      selectedLang === 'en'
        ? 'App language switched to English (US)'
        : 'Idioma de la aplicación cambiado a Español (MX)'
    );
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-[radial-gradient(circle_at_center,_rgba(46,213,164,0.12)_0%,_rgba(14,19,31,0.92)_55%,_rgba(6,7,11,0.98)_100%)] backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] bg-[#0E131F] border border-white/10 ring-1 ring-emerald-500/20 rounded-3xl p-5 sm:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.9),_0_0_40px_rgba(46,213,164,0.08)] text-white space-y-4 my-auto">
        {/* Universal Don César Header: < | KinLogo | Badge */}
        <header className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle"
              title={isEn ? "Back" : "Volver"}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={34} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[13px]">translate</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-bold">
              {isEn ? 'Language & Region' : 'Idioma y Región'}
            </span>
          </div>
        </header>

        {/* Hero Title & Subtitle */}
        <div className="text-left pt-1">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {isEn ? 'Select App Language' : 'Idioma de la Aplicación'}
          </h2>
          <p className="text-xs text-[#A6ADC8] mt-0.5">
            {isEn
              ? 'Choose your preferred language for interfaces, receipts & alerts'
              : 'Selecciona tu idioma para la interfaz, recibos SAT y notificaciones'}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-1">
          {/* Spanish Option */}
          <button
            type="button"
            onClick={() => setSelectedLang('es')}
            className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer border ${
              selectedLang === 'es'
                ? 'bg-[#141E28] border-[#2ED5A4] shadow-[0_0_20px_rgba(46,213,164,0.15)]'
                : 'bg-[#141824] hover:bg-[#181E2E] border-white/10'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">🇲🇽</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Español</span>
                  {selectedLang === 'es' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/20 text-[#2ED5A4] text-[9px] font-bold">
                      ACTIVO
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#A6ADC8] mt-0.5">
                  Interfaz, recibos Banxico SPEI y CFDI en español
                </span>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                selectedLang === 'es'
                  ? 'bg-[#2ED5A4] border-[#2ED5A4] text-neutral-950'
                  : 'border-white/20 text-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] font-bold">check</span>
            </div>
          </button>

          {/* English Option */}
          <button
            type="button"
            onClick={() => setSelectedLang('en')}
            className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer border ${
              selectedLang === 'en'
                ? 'bg-[#141E28] border-[#2ED5A4] shadow-[0_0_20px_rgba(46,213,164,0.15)]'
                : 'bg-[#141824] hover:bg-[#181E2E] border-white/10'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">🇺🇸</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">English</span>
                  {selectedLang === 'en' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/20 text-[#2ED5A4] text-[9px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#A6ADC8] mt-0.5">
                  Bilingual interface, IRS statements & USD rails
                </span>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                selectedLang === 'en'
                  ? 'bg-[#2ED5A4] border-[#2ED5A4] text-neutral-950'
                  : 'border-white/20 text-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] font-bold">check</span>
            </div>
          </button>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full h-12 rounded-full bg-[#2ED5A4] hover:bg-[#28b88e] text-neutral-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>{isEn ? 'Confirm Selection' : 'Confirmar Selección'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
