'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, WhatsAppIcon } from '@/components/Icons';
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
        : 'Conectando con agente bilingüe KIN (tiempo estimado < 30s)...'
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

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] max-h-[92vh] overflow-y-auto scrollbar-none rounded-3xl bg-[#0E131F] border border-white/10 p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.95)] text-white space-y-4 my-auto">
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
            <span className="material-symbols-outlined text-[13px]">support_agent</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-bold">
              {isEn ? '24/7 Concierge' : 'Concierge 24/7'}
            </span>
          </div>
        </header>

        {/* Hero Title & Subtitle */}
        <div className="text-left pt-1">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {isEn ? 'KIN Help Center & Concierge' : 'Centro de Asistencia KIN 24/7'}
          </h2>
          <p className="text-xs text-[#A6ADC8] mt-0.5">
            {isEn
              ? 'Bilingual VIP support in English and Spanish for all remittances & bills'
              : 'Asistencia prioritaria bilingüe para envíos SPEI, tarjetas y facturas'}
          </p>
        </div>

        {/* Channels List */}
        <div className="space-y-3 pt-1">
          {/* Channel 1: Live Chat */}
          <button
            type="button"
            onClick={handleStartChat}
            className="w-full p-4 rounded-2xl bg-[#141824] hover:bg-[#181E2E] border border-white/10 flex items-center justify-between transition-all cursor-pointer text-left shadow-inner group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-[#2ED5A4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">chat</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">
                    {isEn ? 'Live Concierge Chat' : 'Chat en Vivo en la App'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#2ED5A4] text-[9px] font-bold">
                    EN LÍNEA
                  </span>
                </div>
                <span className="text-[11px] text-[#A6ADC8] mt-0.5 block">
                  {isEn ? 'Average response time: < 30 sec' : 'Tiempo de respuesta estimado: < 30 seg'}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>

          {/* Channel 2: WhatsApp Oficial */}
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full p-4 rounded-2xl bg-[#141824] hover:bg-[#181E2E] border border-white/10 flex items-center justify-between transition-all cursor-pointer text-left shadow-inner group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">
                    {isEn ? 'Official WhatsApp Concierge' : 'WhatsApp Oficial Verificado'}
                  </span>
                </div>
                <span className="text-[11px] text-[#A6ADC8] mt-0.5 block">
                  +1 (800) 546-6624 • Soporte directo en tu WhatsApp
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
              open_in_new
            </span>
          </button>

          {/* Channel 3: Telephone Line */}
          <button
            type="button"
            onClick={handleCallPhone}
            className="w-full p-4 rounded-2xl bg-[#141824] hover:bg-[#181E2E] border border-white/10 flex items-center justify-between transition-all cursor-pointer text-left shadow-inner group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/5 text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">call</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">
                    {isEn ? 'Priority Toll-Free Phone' : 'Línea Telefónica Gratuita'}
                  </span>
                </div>
                <span className="text-[11px] text-[#A6ADC8] mt-0.5 block font-mono">
                  1-800-KIN-SEND (USA y México)
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
              phone_forwarded
            </span>
          </button>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 rounded-full bg-[#2ED5A4] hover:bg-[#28b88e] text-neutral-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>{isEn ? 'Close Support' : 'Listo'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
