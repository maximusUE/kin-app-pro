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
        ? 'App language switched to English (US) • IRS & Fedwire rails active'
        : 'Idioma de la aplicación cambiado a Español (MX) • SPEI & SAT activos'
    );
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-black/60 dark:bg-black/85 backdrop-blur-xl flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[440px] max-h-[92vh] flex flex-col bg-white dark:bg-gradient-to-b dark:from-[#111625] dark:via-[#0D111D] dark:to-[#080B11] border-t sm:border border-slate-200/80 dark:border-white/10 rounded-t-[32px] sm:rounded-[28px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.95),_0_0_40px_rgba(46,213,164,0.08)] overflow-hidden text-slate-900 dark:text-white my-0 sm:my-auto">
        {/* iOS Drag Handle on Mobile */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mt-2.5 mb-1 shrink-0 select-none sm:hidden" />

        {/* Universal Top Header */}
        <header className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-slate-100 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white transition-all cursor-pointer"
              title={isEn ? 'Back' : 'Volver'}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <KinLogo size={32} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[14px]">translate</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-extrabold">
              {isEn ? 'Language & Region' : 'Idioma y Región'}
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 scrollbar-none">
          {/* Hero Title & Subtitle */}
          <div className="text-left">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEn ? 'Select App Language & Region' : 'Idioma & Región de Operación'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isEn
                ? 'Choose your preferred language for interfaces, Banxico SPEI receipts, and IRS/SAT tax certificates.'
                : 'Selecciona tu idioma para la interfaz, recibos con clave de rastreo Banxico y certificados fiscales del SAT.'}
            </p>
          </div>

          {/* Interactive Bento Options */}
          <div className="space-y-3">
            {/* Option 1: Spanish (Mexico) */}
            <div
              onClick={() => setSelectedLang('es')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden text-left ${
                selectedLang === 'es'
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/60 shadow-[0_4px_20px_rgba(46,213,164,0.2)] ring-1 ring-emerald-500/30'
                  : 'bg-slate-50/80 dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-[#181E2E] border-slate-200 dark:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl select-none" role="img" aria-label="Bandera de México">
                    🇲🇽
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Español (México)
                      </span>
                      {selectedLang === 'es' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-[#2ED5A4] text-[9px] font-extrabold">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      Optimizado para envíos transfronterizos USA-México
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    selectedLang === 'es'
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                      : 'border-slate-300 dark:border-white/20 text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
              </div>

              {/* Feature Points */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-white/5 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-[#2ED5A4] font-bold">✓</span>
                  <span>Comprobantes oficiales de Banxico con CEP y clave de rastreo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-[#2ED5A4] font-bold">✓</span>
                  <span>Facturación electrónica CFDI 4.0 ante el SAT en español</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-[#2ED5A4] font-bold">✓</span>
                  <span>Moneda de referencia predeterminada en Pesos Mexicanos (MXN)</span>
                </div>
              </div>
            </div>

            {/* Option 2: English (United States) */}
            <div
              onClick={() => setSelectedLang('en')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden text-left ${
                selectedLang === 'en'
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/60 shadow-[0_4px_20px_rgba(46,213,164,0.2)] ring-1 ring-emerald-500/30'
                  : 'bg-slate-50/80 dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-[#181E2E] border-slate-200 dark:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl select-none" role="img" aria-label="United States flag">
                    🇺🇸
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        English (United States)
                      </span>
                      {selectedLang === 'en' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-[#2ED5A4] text-[9px] font-extrabold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      Bilingual statements, tax exports & USD rails
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    selectedLang === 'en'
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                      : 'border-slate-300 dark:border-white/20 text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
              </div>

              {/* Feature Points */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-white/5 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-[#2ED5A4] font-bold">✓</span>
                  <span>Annual IRS Form 1099 remittance summary for your CPA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-[#2ED5A4] font-bold">✓</span>
                  <span>Instant ACH and Fedwire receipt notifications in USD</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-[#2ED5A4] font-bold">✓</span>
                  <span>FinCEN regulatory disclosures and US consumer protections</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Dock */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 dark:text-[#2ED5A4] text-[18px]">
                currency_exchange
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {isEn ? 'Current Live Rate:' : 'Tipo de cambio en vivo:'}
              </span>
            </div>
            <span className="font-mono font-bold text-emerald-700 dark:text-[#2ED5A4]">
              $1 USD = $20.45 MXN
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2 pb-4">
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#2ED5A4] to-[#18A57E] hover:opacity-95 text-slate-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{isEn ? 'Confirm Language Selection' : 'Confirmar Selección de Idioma'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
