'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, WhatsAppIcon, CopyIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface KinSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userClientId?: string;
  language?: 'es' | 'en';
}

export function KinSupportModal({
  isOpen,
  onClose,
  userClientId = 'KIN-US-892401',
  language = 'es',
}: KinSupportModalProps) {
  const [mounted, setMounted] = useState(false);
  const isEn = language === 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleStartChat = () => {
    onClose();
    toast.success(
      isEn
        ? 'Connecting with KIN bilingual concierge (wait time < 30s)...'
        : 'Conectando con asesor bilingüe KIN (tiempo estimado < 30s)...'
    );
  };

  const handleOpenWhatsApp = () => {
    onClose();
    const msg = encodeURIComponent(
      `Hola concierge KIN, requiero asistencia especializada con mi cuenta registrada ID ${userClientId}.`
    );
    window.open(`https://wa.me/18005466624?text=${msg}`, '_blank');
  };

  const handleCallPhone = () => {
    window.open('tel:+18005466624');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(userClientId);
    toast.success(
      isEn ? 'Client ID copied for concierge identification' : 'ID de cliente copiado para atención inmediata'
    );
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
            <span className="material-symbols-outlined text-[14px]">support_agent</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-extrabold">
              {isEn ? '24/7 VIP Concierge' : 'Concierge 24/7'}
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 scrollbar-none">
          {/* Hero Title & Subtitle */}
          <div className="text-left">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEn ? 'KIN Help Center & Concierge' : 'Centro de Asistencia VIP KIN 24/7'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isEn
                ? 'Direct bilingual assistance for Banxico SPEI remittances, bill pay, and card management.'
                : 'Asistencia prioritaria bilingüe para transferencias SPEI Banxico, tarjetas y pagos de servicios.'}
            </p>
          </div>

          {/* Quick Client ID Bar */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px]">badge</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                {isEn ? 'Your Client Folio:' : 'Tu Folio de Cliente:'}
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{userClientId}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-[11px] font-bold text-emerald-600 dark:text-[#2ED5A4] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CopyIcon className="w-3.5 h-3.5" />
              <span>{isEn ? 'Copy' : 'Copiar'}</span>
            </button>
          </div>

          {/* Support Channels Bento Stack */}
          <div className="space-y-3">
            {/* Channel 1: Live Chat */}
            <button
              type="button"
              onClick={handleStartChat}
              className="w-full p-4 rounded-2xl bg-slate-50/90 dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-[#181E2E] border border-slate-200/80 dark:border-white/10 flex items-center justify-between transition-all cursor-pointer text-left shadow-xs group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-[#2ED5A4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">chat</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {isEn ? 'Live In-App Chat' : 'Chat en Vivo en la App'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-[#2ED5A4] text-[9px] font-extrabold">
                      EN LÍNEA
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block truncate">
                    {isEn ? 'Average wait time: < 30 seconds' : 'Tiempo de espera estimado: < 30 segundos'}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                arrow_forward
              </span>
            </button>

            {/* Channel 2: WhatsApp Concierge */}
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full p-4 rounded-2xl bg-slate-50/90 dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-[#181E2E] border border-slate-200/80 dark:border-white/10 flex items-center justify-between transition-all cursor-pointer text-left shadow-xs group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {isEn ? 'Official WhatsApp Concierge' : 'WhatsApp Oficial Verificado'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block truncate">
                    +1 (800) 546-6624 • Atención 1 a 1 en tu teléfono
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                open_in_new
              </span>
            </button>

            {/* Channel 3: Telephone Line */}
            <button
              type="button"
              onClick={handleCallPhone}
              className="w-full p-4 rounded-2xl bg-slate-50/90 dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-[#181E2E] border border-slate-200/80 dark:border-white/10 flex items-center justify-between transition-all cursor-pointer text-left shadow-xs group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">call</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {isEn ? 'Priority Toll-Free Phone' : 'Línea Gratuita Directa'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block font-mono truncate">
                    1-800-KIN-SEND (USA y México sin costo)
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                phone_forwarded
              </span>
            </button>
          </div>

          {/* Action Button */}
          <div className="pt-2 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#2ED5A4] to-[#18A57E] hover:opacity-95 text-slate-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{isEn ? 'Close Support' : 'Listo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
