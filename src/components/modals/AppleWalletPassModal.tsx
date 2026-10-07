'use client';

import React, { useState } from 'react';
import { ChevronLeftIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface AppleWalletPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  language?: 'es' | 'en';
}

export function AppleWalletPassModal({
  isOpen,
  onClose,
  userName,
  language = 'es',
}: AppleWalletPassModalProps) {
  const [status, setStatus] = useState<'idle' | 'adding' | 'added'>('idle');
  const isEn = language === 'en';

  if (!isOpen) return null;

  const handleAddToAppleWallet = () => {
    if (status === 'added') {
      toast.info(isEn ? 'Card is already added to Apple Wallet' : 'La tarjeta ya está agregada a tu Apple Wallet');
      return;
    }

    setStatus('adding');
    setTimeout(() => {
      setStatus('added');
      toast.success(
        isEn
          ? 'KIN Card added to Apple Wallet successfully!'
          : '¡Tarjeta KIN agregada a Apple Wallet con éxito!'
      );
    }, 1800);
  };

  const handleAddToGoogleWallet = () => {
    toast.success(
      isEn
        ? 'Pass ready for Google Wallet (NFC Active)'
        : 'Pase listo para Google Wallet (NFC Activo)'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] bg-[#0E131F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.95)] text-white space-y-4 my-auto">
        {/* Universal Don César Header: < | KinLogo | Apple Wallet Badge */}
        <header className="flex items-center justify-between pb-1">
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

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-white">
            <span className="material-symbols-outlined text-[13px] text-[#2ED5A4]">account_balance_wallet</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
              Apple & Google Wallet
            </span>
          </div>
        </header>

        {/* Title & Subtitle */}
        <div className="text-center pt-1">
          <h2 className="text-xl font-black text-white tracking-tight">
            {isEn ? 'Apple Wallet Pass' : 'Pase para Apple Wallet'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isEn
              ? 'Pay in stores with iPhone or Apple Watch using Face ID'
              : 'Paga sin contacto en tiendas con tu iPhone o Apple Watch'}
          </p>
        </div>

        {/* Apple Wallet Pass Card Container */}
        <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#1F2338] via-[#141624] to-[#0A0C14] border border-[#2ED5A4]/30 shadow-2xl overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#2ED5A4]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7047EB]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Card Top */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2ED5A4] text-[#06070B] font-black flex items-center justify-center text-xs shadow-md">
                K
              </div>
              <div>
                <span className="text-xs font-black text-white tracking-wider block">KIN CARD</span>
                <span className="text-[9px] text-slate-400 font-semibold tracking-wide">VISA PLATINUM</span>
              </div>
            </div>

            {/* Apple Pay Glyph */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-semibold text-white/90">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 170 170" fill="currentColor">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.42-9.82-11.37-21.2-14.86-34.12-3.48-12.93-5.23-24.96-5.23-36.1 0-16.74 4.54-30.43 13.62-41.07 9.08-10.63 20.31-16.08 33.68-16.34 5.37 0 11.05 1.34 17.06 4.02 6.01 2.68 9.97 4.07 11.89 4.17 1.48 0 5.63-1.47 12.45-4.41 6.82-2.94 12.4-4.22 16.73-3.84 13.06 1.07 23.36 6.08 30.89 15.02-11.45 6.94-17.06 16.59-16.84 28.94.22 9.69 3.99 17.75 11.32 24.18 7.33 6.43 15.84 10.15 25.53 11.16-2.39 7.08-5.48 14.67-9.28 22.77zM119.22 33.15c0-7.39 2.67-14.4 8.01-21.03 5.34-6.63 11.99-10.99 19.95-13.08.33 1.09.49 2.07.49 2.94 0 7.39-2.78 14.51-8.34 21.36-5.56 6.85-12.3 11.16-20.22 12.93a19.7 19.7 0 0 1 .11-3.12z" />
              </svg>
              <span>Pay</span>
            </div>
          </div>

          {/* EMV Chip & Contactless Waves */}
          <div className="my-4 relative z-10 flex items-center justify-between">
            <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] border border-[#8C6D1F] flex items-center justify-center shadow-inner">
              <div className="w-full h-0.5 bg-[#8C6D1F]/50" />
            </div>
            {/* NFC Contactless Wave */}
            <div className="flex items-center gap-1.5 text-xs text-[#2ED5A4] font-semibold bg-[#2ED5A4]/10 px-2.5 py-1 rounded-full border border-[#2ED5A4]/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M8.5 16.5a6 6 0 010-9M12 19a10 10 0 010-14M15.5 21.5a14 14 0 010-19" />
              </svg>
              <span>NFC Ready</span>
            </div>
          </div>

          {/* Card Number & Holder */}
          <div className="relative z-10 space-y-2">
            <span className="text-base font-mono font-bold text-white tracking-widest block">
              ••••  ••••  ••••  4892
            </span>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase font-bold">
                  {isEn ? 'Cardholder' : 'Titular'}
                </span>
                <span className="font-bold text-white tracking-wider">{userName.toUpperCase()}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">
                  {isEn ? 'Expires' : 'Expira'}
                </span>
                <span className="font-mono font-bold text-white">08/29</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & NFC Explanation */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[17px]">lock</span>
            <span className="font-bold">
              {isEn ? 'Apple Secure Enclave Protected' : 'Protegido por Apple Secure Enclave'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {isEn
              ? 'Your real card number is never stored on the device or shared with merchants. Every purchase uses a unique device account number.'
              : 'Tu número de tarjeta real nunca se guarda en el dispositivo ni se comparte con tiendas. Cada pago utiliza un token criptográfico único.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Add to Apple Wallet Button (Official Apple Style) */}
          <button
            type="button"
            onClick={handleAddToAppleWallet}
            disabled={status === 'adding'}
            className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm transition-all shadow-xl cursor-pointer ${
              status === 'added'
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-[#2ED5A4]'
                : 'bg-black hover:bg-zinc-900 border border-white/20 text-white hover:border-white/40'
            }`}
          >
            {status === 'adding' ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isEn ? 'Adding to Apple Wallet...' : 'Agregando a Apple Wallet...'}</span>
              </div>
            ) : status === 'added' ? (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{isEn ? 'Added to Apple Wallet ✓' : 'Añadida a Apple Wallet ✓'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-white" viewBox="0 0 170 170" fill="currentColor">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.42-9.82-11.37-21.2-14.86-34.12-3.48-12.93-5.23-24.96-5.23-36.1 0-16.74 4.54-30.43 13.62-41.07 9.08-10.63 20.31-16.08 33.68-16.34 5.37 0 11.05 1.34 17.06 4.02 6.01 2.68 9.97 4.07 11.89 4.17 1.48 0 5.63-1.47 12.45-4.41 6.82-2.94 12.4-4.22 16.73-3.84 13.06 1.07 23.36 6.08 30.89 15.02-11.45 6.94-17.06 16.59-16.84 28.94.22 9.69 3.99 17.75 11.32 24.18 7.33 6.43 15.84 10.15 25.53 11.16-2.39 7.08-5.48 14.67-9.28 22.77zM119.22 33.15c0-7.39 2.67-14.4 8.01-21.03 5.34-6.63 11.99-10.99 19.95-13.08.33 1.09.49 2.07.49 2.94 0 7.39-2.78 14.51-8.34 21.36-5.56 6.85-12.3 11.16-20.22 12.93a19.7 19.7 0 0 1 .11-3.12z" />
                </svg>
                <span>{isEn ? 'Add to Apple Wallet' : 'Agregar a Apple Wallet'}</span>
              </div>
            )}
          </button>

          {/* Add to Google Wallet Button */}
          <button
            type="button"
            onClick={handleAddToGoogleWallet}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-400">wallet</span>
            <span>{isEn ? 'Save to Google Wallet' : 'Guardar en Google Wallet'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
