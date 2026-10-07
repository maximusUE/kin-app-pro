'use client';

import React, { useState } from 'react';
import { ChevronLeftIcon, SettingsGearIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { AppleWalletPassModal } from '@/components/modals/AppleWalletPassModal';
import { KinPinRevealModal } from '@/components/modals/KinPinRevealModal';
import { KinCardLimitsModal } from '@/components/modals/KinCardLimitsModal';

interface WalletViewProps {
  onBack: () => void;
  onOpenSettings: () => void;
  userName: string;
  netBalance: number;
  currencyPref: 'USD' | 'MXN';
  language: 'es' | 'en';
  USD_TO_MXN_RATE: number;
  cardFrozen: boolean;
  setCardFrozen: (frozen: boolean) => void;
  showCardDetails: boolean;
  setShowCardDetails: (show: boolean) => void;
}

export function WalletView({
  onBack,
  onOpenSettings,
  userName,
  netBalance,
  currencyPref,
  language,
  USD_TO_MXN_RATE,
  cardFrozen,
  setCardFrozen,
  showCardDetails,
  setShowCardDetails,
}: WalletViewProps) {
  const isEn = language === 'en';

  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [showLimitsModal, setShowLimitsModal] = useState<boolean>(false);
  const [showAppleWalletModal, setShowAppleWalletModal] = useState<boolean>(false);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header: < | KinLogo | My Wallet | Settings */}
      <header className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="btn-circle"
            title={isEn ? "Back to Home" : "Volver a Home"}
          >
            <ChevronLeftIcon className="w-5 h-5 text-white" />
          </button>
          <KinLogo size={34} />
        </div>
        <div className="text-center">
          <h1 className="text-base font-bold text-white tracking-wide">
            {isEn ? 'My Wallet' : 'Mi Billetera'}
          </h1>
          <span className="text-[10px] text-[#2ED5A4] font-medium flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
            KIN Digital Vault
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

      {/* KIN Platinum Debit Card */}
      <div
        className={`kin-vault-card relative p-5 rounded-3xl bg-gradient-to-br from-[#1C1D2F] via-[#141524] to-[#0A0B12] border transition-all duration-300 shadow-2xl overflow-hidden ${
          cardFrozen ? 'border-[#FF5555]/40 opacity-75 grayscale-[50%]' : 'border-[#2ED5A4]/30'
        }`}
      >
        {/* Card Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#2ED5A4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#7047EB]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Top: KIN Logo & Chip */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2ED5A4] text-[#06070B] font-black flex items-center justify-center text-sm shadow-md">
              K
            </div>
            <div>
              <span className="text-xs font-extrabold text-white tracking-wider block">KIN CARD</span>
              <span className="text-[9px] text-[#8E91A5] font-semibold">VISA PLATINUM</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cardFrozen && (
              <span className="px-2 py-0.5 rounded-full bg-[#FF5555]/20 border border-[#FF5555]/40 text-[#FF5555] text-[10px] font-bold">
                ❄️ {isEn ? 'Frozen' : 'Congelada'}
              </span>
            )}
            {/* Contactless Waves */}
            <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M8.5 16.5a6 6 0 010-9M12 19a10 10 0 010-14M15.5 21.5a14 14 0 010-19" />
            </svg>
          </div>
        </div>

        {/* Card Chip & Balance */}
        <div className="my-5 relative z-10 flex items-center justify-between">
          {/* EMV Chip */}
          <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] border border-[#8C6D1F] relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="w-full h-0.5 bg-[#8C6D1F]/50 absolute" />
            <div className="h-full w-0.5 bg-[#8C6D1F]/50 absolute" />
          </div>

          {/* Card Balance */}
          <div className="text-right">
            <span className="text-[10px] text-[#8E91A5] block">
              {isEn ? 'Card Balance' : 'Saldo en Tarjeta'}
            </span>
            <span className="text-lg font-black text-white tracking-tight">
              {currencyPref === 'USD' ? (
                <>
                  ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                  <span className="text-[10px] font-bold text-[#2ED5A4]">USD</span>
                </>
              ) : (
                <>
                  ${(netBalance * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                  <span className="text-[10px] font-bold text-[#2ED5A4]">MXN</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Card Number & Details */}
        <div className="relative z-10 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono font-bold text-white tracking-widest">
              {showCardDetails ? '4892  3100  8824  4892' : '••••  ••••  ••••  4892'}
            </span>
            <button
              type="button"
              onClick={() => setShowCardDetails(!showCardDetails)}
              className="text-[10px] text-[#2ED5A4] hover:underline font-semibold cursor-pointer"
            >
              {showCardDetails ? (isEn ? 'Hide' : 'Ocultar') : (isEn ? 'Reveal' : 'Revelar')}
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 text-[10px]">
            <div>
              <span className="text-[#8E91A5] block uppercase text-[8px] font-bold">
                {isEn ? 'Cardholder' : 'Titular'}
              </span>
              <span className="text-white font-bold tracking-wide">{userName.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-[#8E91A5] block uppercase text-[8px] font-bold">
                {isEn ? 'Expires' : 'Expira'}
              </span>
              <span className="text-white font-mono font-bold">08/29</span>
            </div>
            <div>
              <span className="text-[#8E91A5] block uppercase text-[8px] font-bold">CVV</span>
              <span className="text-white font-mono font-bold">{showCardDetails ? '481' : '•••'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Card Controls (3 Botones Ergonómicos estilo Apple) */}
      <div className="grid grid-cols-3 gap-2">
        {/* Congelar */}
        <button
          type="button"
          onClick={() => setCardFrozen(!cardFrozen)}
          className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer shadow-sm ${
            cardFrozen
              ? 'bg-rose-50 dark:bg-[#FF5555]/15 border-rose-300 dark:border-[#FF5555]/40 text-rose-600 dark:text-[#FF5555]'
              : 'bg-white dark:bg-[#181928] border-slate-200/80 dark:border-white/5 text-slate-700 dark:text-[#8E91A5] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/15'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#202236] flex items-center justify-center text-current text-sm">
            {cardFrozen ? '❄️' : '🔒'}
          </div>
          <span className="text-[11px] font-bold leading-tight">
            {cardFrozen ? (isEn ? 'Unfreeze' : 'Descongelar') : (isEn ? 'Freeze' : 'Congelar')}
          </span>
        </button>

        {/* Ver PIN (Abre Modal Biométrico) */}
        <button
          type="button"
          onClick={() => setShowPinModal(true)}
          className="p-3 rounded-2xl bg-white dark:bg-[#181928] border border-slate-200/80 dark:border-white/5 text-slate-700 dark:text-[#8E91A5] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/15 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#202236] flex items-center justify-center text-slate-800 dark:text-white text-sm">
            🔑
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">
            {isEn ? 'View PIN' : 'Ver PIN'}
          </span>
        </button>

        {/* Límites (Abre Modal de Control de Gastos) */}
        <button
          type="button"
          onClick={() => setShowLimitsModal(true)}
          className="p-3 rounded-2xl bg-white dark:bg-[#181928] border border-slate-200/80 dark:border-white/5 text-slate-700 dark:text-[#8E91A5] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/15 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#202236] flex items-center justify-center text-slate-800 dark:text-white text-sm">
            ⚙️
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">
            {isEn ? 'Limits' : 'Límites'}
          </span>
        </button>
      </div>

      {/* Apple & Google Wallet Digital Pass Trigger (2026 Mobile Flagship Standard) */}
      <button
        type="button"
        onClick={() => setShowAppleWalletModal(true)}
        className="w-full p-3.5 rounded-2xl bg-black hover:bg-zinc-900 border border-white/15 flex items-center justify-between text-left transition-all group shadow-md cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 170 170" fill="currentColor">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.42-9.82-11.37-21.2-14.86-34.12-3.48-12.93-5.23-24.96-5.23-36.1 0-16.74 4.54-30.43 13.62-41.07 9.08-10.63 20.31-16.08 33.68-16.34 5.37 0 11.05 1.34 17.06 4.02 6.01 2.68 9.97 4.07 11.89 4.17 1.48 0 5.63-1.47 12.45-4.41 6.82-2.94 12.4-4.22 16.73-3.84 13.06 1.07 23.36 6.08 30.89 15.02-11.45 6.94-17.06 16.59-16.84 28.94.22 9.69 3.99 17.75 11.32 24.18 7.33 6.43 15.84 10.15 25.53 11.16-2.39 7.08-5.48 14.67-9.28 22.77zM119.22 33.15c0-7.39 2.67-14.4 8.01-21.03 5.34-6.63 11.99-10.99 19.95-13.08.33 1.09.49 2.07.49 2.94 0 7.39-2.78 14.51-8.34 21.36-5.56 6.85-12.3 11.16-20.22 12.93a19.7 19.7 0 0 1 .11-3.12z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {isEn ? 'Add to Apple Wallet' : 'Agregar a Apple Wallet'}
            </span>
            <span className="text-[10px] text-slate-400">
              {isEn ? 'Compatible with Apple Pay & Google Pay' : 'Compatible con Apple Pay & Google Pay'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#2ED5A4] text-xs font-bold">
          <span>{isEn ? 'Add' : 'Agregar'}</span>
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
            chevron_right
          </span>
        </div>
      </button>

      {/* Desglose de Balances (USD & MXN) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#181928] border border-slate-200/80 dark:border-white/5 space-y-3 shadow-sm">
        <span className="text-xs font-bold text-slate-500 dark:text-[#8E91A5] uppercase tracking-wider block">
          {isEn ? 'Currency Vaults' : 'Bóvedas de Divisas'}
        </span>

        <div className="space-y-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0E0F1A] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white dark:bg-[#202236] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs shadow-xs">
                🇺🇸
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{isEn ? 'USD Wallet' : 'Billetera USD'}</p>
                <p className="text-[10px] text-slate-500 dark:text-[#8E91A5]">{isEn ? 'Primary KIN Account' : 'Cuenta principal KIN'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-900 dark:text-white">
                ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-[#2ED5A4] font-semibold">{isEn ? 'USD Active' : 'USD Activo'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0E0F1A] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white dark:bg-[#202236] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs shadow-xs">
                🇲🇽
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{isEn ? 'SPEI MXN Vault' : 'Bóveda SPEI MXN'}</p>
                <p className="text-[10px] text-slate-500 dark:text-[#8E91A5]">
                  {isEn ? `Exchange rate $${USD_TO_MXN_RATE.toFixed(2)} MXN/USD` : `Tipo de cambio $${USD_TO_MXN_RATE.toFixed(2)} MXN/USD`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-900 dark:text-white">
                ${(netBalance * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-[#8E91A5] font-semibold">{isEn ? 'MXN Equivalent' : 'MXN Equivalente'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modales Interactivos de Step 6 */}
      <AppleWalletPassModal
        isOpen={showAppleWalletModal}
        onClose={() => setShowAppleWalletModal(false)}
        userName={userName}
        language={language}
      />

      <KinPinRevealModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        language={language}
      />

      <KinCardLimitsModal
        isOpen={showLimitsModal}
        onClose={() => setShowLimitsModal(false)}
        language={language}
      />
    </div>
  );
}
