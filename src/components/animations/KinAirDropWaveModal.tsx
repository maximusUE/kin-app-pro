'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { KinLogo } from '@/components/KinLogo';

export interface KinAirDropWaveModalProps {
  isOpen: boolean;
  senderName: string;
  senderAvatar?: string;
  recipientName: string;
  recipientAvatar?: string;
  recipientPhotoUrl?: string;
  amountUSD: number;
  amountMXN: number;
  onComplete: () => void;
  language?: 'es' | 'en';
}

/**
 * KinAirDropWaveModal - Animación de Envío en Onda Ultrasónica (Estilo Apple AirDrop / NameDrop)
 * Micro-interacción fluida con resortes físicos, pulsos hápticos y ondas concéntricas esmeralda.
 */
export function KinAirDropWaveModal({
  isOpen,
  senderName,
  senderAvatar,
  recipientName,
  recipientAvatar,
  recipientPhotoUrl,
  amountUSD,
  amountMXN,
  onComplete,
  language = 'es',
}: KinAirDropWaveModalProps) {
  const [mounted, setMounted] = useState(false);
  const isEn = language === 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Micro-vibraciones hápticas estilo NameDrop de iOS
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15, 40, 20, 60, 25, 80]);
      } catch (_) {}
    }

    // Duración de la experiencia cinemática: 2.2 segundos
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [isOpen, onComplete]);

  if (!isOpen || !mounted) return null;

  const senderInitials = (senderName || 'Cesar Ugalde')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const recipientInitials = (recipientName || 'Familia')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-[380px] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        
        {/* Signature Glowing Ultrasonic Waves */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Wave 1 */}
          <div className="absolute w-44 h-44 rounded-full border border-emerald-400/40 animate-ping opacity-60" style={{ animationDuration: '1.6s' }} />
          {/* Wave 2 */}
          <div className="absolute w-64 h-64 rounded-full border border-[#2ED5A4]/30 animate-ping opacity-40 delay-150" style={{ animationDuration: '2s' }} />
          {/* Wave 3 */}
          <div className="absolute w-80 h-80 rounded-full border border-purple-500/20 animate-ping opacity-25 delay-300" style={{ animationDuration: '2.4s' }} />
          {/* Ambient Radial Aura */}
          <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-[#2ED5A4]/20 via-primary/15 to-purple-500/10 blur-3xl animate-pulse" />
        </div>

        {/* Central Logo Stamp */}
        <div className="relative z-10 mb-6 flex flex-col items-center">
          <div className="p-3 rounded-full bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(46,213,164,0.35)] backdrop-blur-md">
            <KinLogo size={42} />
          </div>
          <span className="font-label-caps text-[10px] tracking-widest uppercase text-emerald-400 font-bold mt-2">
            {isEn ? 'Ultrasonic P2P Transit' : 'Transferencia P2P Ultrasónica'}
          </span>
        </div>

        {/* Sender & Recipient Node Visual Link (Apple NameDrop Interaction) */}
        <div className="relative z-10 w-full flex items-center justify-between px-6 py-4 my-2 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl">
          {/* Sender Node */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
              {senderAvatar ? (
                <img src={senderAvatar} alt={senderName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="font-headline-md text-sm font-black text-neutral-950">{senderInitials}</span>
              )}
            </div>
            <span className="font-title-base text-xs font-semibold text-white mt-1.5 max-w-[80px] truncate">
              {isEn ? 'You' : 'Tú'}
            </span>
          </div>

          {/* Transiting Currency Pulse */}
          <div className="flex-1 flex flex-col items-center justify-center px-2">
            <div className="flex items-center gap-1 text-primary animate-pulse">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-400 via-primary to-purple-400" />
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
            <span className="font-financial-mono text-base font-black text-white mt-1 drop-shadow-[0_0_8px_rgba(46,213,164,0.5)]">
              ${amountUSD.toFixed(2)}
            </span>
            <span className="font-financial-mono text-[10px] text-primary/80 font-bold">
              ≈ ${amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
          </div>

          {/* Recipient Node */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/30 flex items-center justify-center">
              {recipientPhotoUrl ? (
                <img src={recipientPhotoUrl} alt={recipientName} className="w-full h-full rounded-full object-cover" />
              ) : recipientAvatar && recipientAvatar.length <= 4 ? (
                <span className="text-2xl">{recipientAvatar}</span>
              ) : (
                <span className="font-headline-md text-sm font-black text-white">{recipientInitials}</span>
              )}
            </div>
            <span className="font-title-base text-xs font-semibold text-white mt-1.5 max-w-[80px] truncate">
              {recipientName}
            </span>
          </div>
        </div>

        {/* Live Feedback Status */}
        <div className="relative z-10 mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-title-base text-xs font-bold text-emerald-400">
            {isEn ? 'Transferred instantly without fee • 0% Comisión' : 'Transferido al instante sin comisiones • 0% Fee'}
          </span>
        </div>

      </div>
    </div>,
    document.body
  );
}

export default KinAirDropWaveModal;
