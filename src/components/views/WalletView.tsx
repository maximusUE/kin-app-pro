'use client';

import React from 'react';
import { ChevronLeftIcon, SettingsGearIcon } from '@/components/Icons';

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

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header: < | My Wallet | Settings */}
      <header className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onBack}
          className="btn-circle"
          title={isEn ? "Back to Home" : "Volver a Home"}
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>
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
        className={`relative p-5 rounded-3xl bg-gradient-to-br from-[#1C1D2F] via-[#141524] to-[#0A0B12] border transition-all duration-300 shadow-2xl overflow-hidden ${
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

      {/* Quick Card Controls (3 Botones Ergonómicos) */}
      <div className="grid grid-cols-3 gap-2">
        {/* Congelar */}
        <button
          type="button"
          onClick={() => setCardFrozen(!cardFrozen)}
          className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
            cardFrozen
              ? 'bg-[#FF5555]/15 border-[#FF5555]/40 text-[#FF5555]'
              : 'bg-[#181928] border-white/5 text-[#8E91A5] hover:text-white hover:border-white/15'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-[#202236] flex items-center justify-center text-current text-sm">
            {cardFrozen ? '❄️' : '🔒'}
          </div>
          <span className="text-[11px] font-bold leading-tight">
            {cardFrozen ? (isEn ? 'Unfreeze' : 'Descongelar') : (isEn ? 'Freeze' : 'Congelar')}
          </span>
        </button>

        {/* Ver PIN */}
        <button
          type="button"
          onClick={() => alert(isEn ? 'Your ATM PIN is: 4892 (Encrypted with FaceID)' : 'Tu PIN de cajero es: 4892 (Encriptado con FaceID)')}
          className="p-3 rounded-2xl bg-[#181928] border border-white/5 text-[#8E91A5] hover:text-white hover:border-white/15 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#202236] flex items-center justify-center text-white text-sm">
            🔑
          </div>
          <span className="text-[11px] font-bold text-white leading-tight">
            {isEn ? 'View PIN' : 'Ver PIN'}
          </span>
        </button>

        {/* Límite */}
        <button
          type="button"
          onClick={() => alert(isEn ? 'Current daily limit: $5,000.00 USD' : 'Límite diario actual: $5,000.00 USD')}
          className="p-3 rounded-2xl bg-[#181928] border border-white/5 text-[#8E91A5] hover:text-white hover:border-white/15 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#202236] flex items-center justify-center text-white text-sm">
            ⚙️
          </div>
          <span className="text-[11px] font-bold text-white leading-tight">
            {isEn ? 'Limits' : 'Límites'}
          </span>
        </button>
      </div>

      {/* Desglose de Balances (USD & MXN) */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3">
        <span className="text-xs font-bold text-[#8E91A5] uppercase tracking-wider block">
          {isEn ? 'Currency Vaults' : 'Bóvedas de Divisas'}
        </span>

        <div className="space-y-2">
          <div className="p-3 rounded-2xl bg-[#0E0F1A] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white font-bold text-xs">
                🇺🇸
              </div>
              <div>
                <p className="text-xs font-bold text-white">{isEn ? 'USD Wallet' : 'Billetera USD'}</p>
                <p className="text-[10px] text-[#8E91A5]">{isEn ? 'Primary KIN Account' : 'Cuenta principal KIN'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-white">
                ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-[#2ED5A4] font-semibold">{isEn ? 'USD Active' : 'USD Activo'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0E0F1A] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white font-bold text-xs">
                🇲🇽
              </div>
              <div>
                <p className="text-xs font-bold text-white">{isEn ? 'SPEI MXN Vault' : 'Bóveda SPEI MXN'}</p>
                <p className="text-[10px] text-[#8E91A5]">
                  {isEn ? `Exchange rate $${USD_TO_MXN_RATE.toFixed(2)} MXN/USD` : `Tipo de cambio $${USD_TO_MXN_RATE.toFixed(2)} MXN/USD`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-white">
                ${(netBalance * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-[#8E91A5] font-semibold">{isEn ? 'MXN Equivalent' : 'MXN Equivalente'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
