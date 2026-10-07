'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';

export interface SavedCardItem {
  id: string;
  name: string;
  type: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'bank' | 'apple-pay' | 'cash-app';
  last4: string;
  exp: string;
  isDefault: boolean;
  icon: string;
  tokenId?: string;
  zip?: string;
  country?: string;
}

export interface StripePaymentSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCards: SavedCardItem[];
  onSelectDefaultCard: (cardId: string) => void;
  onAddNewCard: (card: {
    cardNumber: string;
    exp: string;
    cvv: string;
    cardHolder: string;
    zip: string;
    country: string;
    savePermanently: boolean;
  }) => void;
  onDeleteCard?: (cardId: string) => void;
  language: 'es' | 'en';
  userId?: string | null;
}

export function StripePaymentSheetModal({
  isOpen,
  onClose,
  savedCards,
  onSelectDefaultCard,
  onAddNewCard,
  onDeleteCard,
  language = 'es',
  userId = 'user-001',
}: StripePaymentSheetModalProps) {
  const [mounted, setMounted] = useState(false);
  const isEn = language === 'en';

  // Sub-view navigation: 'main' | 'add-card' | 'add-bank'
  const [view, setView] = useState<'main' | 'add-card' | 'add-bank'>('main');

  // Add Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [billingCountry, setBillingCountry] = useState<'US' | 'MX'>('US');
  const [billingZip, setBillingZip] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  // Detect card brand dynamically
  const detectBrand = (num: string): 'visa' | 'mastercard' | 'amex' | 'generic' => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    return 'generic';
  };

  const detectedBrand = detectBrand(cardNumber);

  // Card formatting handler (groups by 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Expiration formatting handler (MM/YY)
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExp(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExp(raw);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCard = cardNumber.replace(/\D/g, '');
    if (cleanCard.length < 15) {
      setFormError(isEn ? 'Please enter a valid card number' : 'Ingresa un número de tarjeta válido (15-16 dígitos)');
      return;
    }

    if (cardExp.length < 5) {
      setFormError(isEn ? 'Enter expiration MM/YY' : 'Ingresa una fecha de expiración válida (MM/AA)');
      return;
    }

    if (cardCvv.length < 3) {
      setFormError(isEn ? 'Enter a 3-4 digit security code' : 'Ingresa el código CVC (3 o 4 dígitos)');
      return;
    }

    if (!cardHolder.trim()) {
      setFormError(isEn ? 'Cardholder name is required' : 'Ingresa el nombre del titular');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      onAddNewCard({
        cardNumber: cleanCard,
        exp: cardExp,
        cvv: cardCvv,
        cardHolder: cardHolder.trim(),
        zip: billingZip.trim() || '10451',
        country: billingCountry,
        savePermanently: saveForFuture,
      });

      setIsProcessing(false);
      setView('main');
      setCardNumber('');
      setCardExp('');
      setCardCvv('');
      setCardHolder('');
    }, 600);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in text-white"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto scrollbar-none bg-[#0E131F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.95)] flex flex-col space-y-4 my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* SUBVIEW 1: VISTA PRINCIPAL DE MÉTODOS DE PAGO                             */}
        {/* ========================================================================= */}
        {view === 'main' && (
          <div className="flex flex-col space-y-4">
            {/* Universal Don César Header: < | KinLogo | PCI-DSS Badge */}
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
                <span className="material-symbols-outlined text-[13px]">credit_card</span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
                  {isEn ? 'PCI-DSS Vault' : 'Bóveda PCI-DSS'}
                </span>
              </div>
            </header>

            {/* Title */}
            <div className="text-center pt-1">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {isEn ? 'Payment Methods' : 'Métodos de Pago'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn
                  ? 'Encrypted funds for instant SPEI & remittance transfers'
                  : 'Fondos cifrados para envíos de remesas instantáneos'}
              </p>
            </div>

            {/* Wallets Express Checkout (Apple Pay & Stripe Link) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Apple Pay Button */}
              <button
                type="button"
                onClick={() => {
                  alert(isEn ? 'Apple Pay initialized with Stripe.' : 'Apple Pay iniciado con Stripe.');
                }}
                className="h-11 rounded-2xl bg-white text-black hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm font-semibold cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current mb-0.5" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.74-7.98-12.16-14.69-5.9-9.08-10.45-19.46-13.66-31.13-3.21-11.67-4.82-22.92-4.82-33.74 0-14.18 3.51-26.04 10.53-35.58 7.02-9.54 16.03-14.42 27.02-14.65 4.35 0 9.28 1.13 14.79 3.39 5.51 2.26 9.4 3.44 11.67 3.54 1.95-.1 5.92-1.3 11.9-3.61 5.98-2.31 10.9-3.35 14.75-3.12 11.05.69 19.98 4.77 26.8 12.24-9.61 5.83-14.34 14-14.19 24.51.15 8.35 3.37 15.35 9.66 21 6.29 5.65 13.78 8.79 22.47 9.42-2.12 6.64-4.82 13.5-8.1 20.59zM119.22 31.84c0-7.39 2.66-14.47 7.98-21.23 5.32-6.76 12.11-10.61 20.37-11.55.15 1.1.23 2.13.23 3.09 0 7.39-2.73 14.44-8.19 21.15-5.46 6.71-12.28 10.54-20.46 11.48-.08-.94-.13-1.92-.13-2.94z" />
                </svg>
                <span className="font-semibold text-sm tracking-tight">Pay</span>
              </button>

              {/* Stripe Link (Dark Glass Capsule) */}
              <button
                type="button"
                onClick={() => setView('add-card')}
                className="h-11 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 font-medium cursor-pointer"
              >
                <span className="text-xs text-slate-300">Pagar con</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#00D66F]/20 text-[#00D66F] font-bold text-[11px] tracking-wide border border-[#00D66F]/30">
                  link
                </span>
              </button>
            </div>

            {/* Separador elegante */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0B0F17] px-3 font-caption-sm text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
                {isEn ? 'Saved Cards' : 'Tarjetas Guardadas'}
              </span>
            </div>

            {/* Listado de Tarjetas Guardadas (Estilo Apple Wallet / Titanium Card) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="font-caption-sm text-[11px] text-slate-400 font-medium">
                  {isEn ? 'Your encrypted vault' : 'Tu bóveda cifrada'}
                </span>
                <span className="text-[10px] text-[#2ED5A4] font-semibold flex items-center gap-1 bg-[#2ED5A4]/10 px-2 py-0.5 rounded-full border border-[#2ED5A4]/20">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  {isEn ? 'PCI-DSS L1' : 'PCI-DSS Nivel 1'}
                </span>
              </div>

              {savedCards.map((card) => {
                const isSelected = card.isDefault;

                return (
                  <div
                    key={card.id}
                    onClick={() => onSelectDefaultCard(card.id)}
                    className={`p-3.5 rounded-2xl relative flex items-center justify-between cursor-pointer border transition-all duration-200 active:scale-[0.99] ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#141C2A] to-[#0E1520] border-[#2ED5A4]/60 shadow-[0_4px_20px_rgba(46,213,164,0.12)]'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Chip & Brand Capsule */}
                      <div className="w-12 h-9 rounded-xl bg-white/[0.07] border border-white/15 flex items-center justify-center p-1 relative shadow-inner shrink-0">
                        {/* EMV Micro Chip Icon */}
                        <div className="w-2.5 h-2 rounded-[2px] bg-amber-400/40 border border-amber-300/60 absolute left-1 top-1" />

                        {card.type.toLowerCase().includes('mc') || card.brand === 'mastercard' ? (
                          <div className="flex -space-x-1.5 items-center pl-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-95 inline-block shadow-sm" />
                            <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-95 inline-block shadow-sm" />
                          </div>
                        ) : card.brand === 'amex' ? (
                          <span className="font-financial-mono text-[9px] font-black text-[#006FCF] pl-1">AMEX</span>
                        ) : (
                          <span className="font-financial-mono text-[11px] font-black italic text-[#4B79FF] tracking-tight pl-1">
                            VISA
                          </span>
                        )}
                      </div>

                      {/* Detalles de la Tarjeta */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-financial-mono text-sm font-bold text-white tracking-wider">
                            •••• {card.last4}
                          </span>
                          {isSelected && (
                            <span className="px-1.5 py-0.2 rounded-md bg-[#2ED5A4]/15 text-[#2ED5A4] text-[9px] font-bold border border-[#2ED5A4]/30">
                              {isEn ? 'Primary' : 'Predeterminada'}
                            </span>
                          )}
                        </div>
                        <p className="font-caption-sm text-[11px] text-slate-400 truncate">
                          {card.name} <span className="text-slate-600">•</span> {isEn ? 'Exp' : 'Vence'} {card.exp}
                        </p>
                      </div>
                    </div>

                    {/* Acciones y Estado de Selección */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#2ED5A4] text-slate-950 flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDefaultCard(card.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#2ED5A4] border border-white/10 cursor-pointer active:scale-95 transition-all"
                        >
                          {isEn ? 'Use' : 'Usar'}
                        </button>
                      )}

                      {onDeleteCard && savedCards.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(isEn ? 'Remove this card?' : '¿Eliminar esta tarjeta de tu bóveda?')) {
                              onDeleteCard(card.id);
                            }
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title={isEn ? 'Delete card' : 'Eliminar tarjeta'}
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Opciones de Nuevos Métodos de Pago */}
            <div className="space-y-2 pt-1">
              <span className="font-label-caps text-[10px] font-bold text-slate-500 uppercase tracking-wider px-0.5">
                {isEn ? 'Add payment method' : 'Agregar nuevo método'}
              </span>

              {/* Opción 1: Tarjeta de Crédito / Débito */}
              <button
                type="button"
                onClick={() => setView('add-card')}
                className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#2ED5A4]/40 flex items-center justify-between text-left transition-all group active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 text-[#2ED5A4] flex items-center justify-center group-hover:bg-[#2ED5A4]/15 transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  </div>
                  <div>
                    <span className="font-title-base text-xs font-bold text-white block">
                      {isEn ? 'Debit or Credit Card' : 'Tarjeta de Débito o Crédito'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-slate-400">
                      Visa, Mastercard, Amex, Discover
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                  chevron_right
                </span>
              </button>

              {/* Opción 2: Cuenta Bancaria Directa ACH */}
              <button
                type="button"
                onClick={() => setView('add-bank')}
                className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#2ED5A4]/40 flex items-center justify-between text-left transition-all group active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/15 transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-[20px]">account_balance</span>
                  </div>
                  <div>
                    <span className="font-title-base text-xs font-bold text-white block">
                      {isEn ? 'Bank Account (ACH / SPEI)' : 'Cuenta Bancaria Directa (ACH / SPEI)'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-slate-400">
                      {isEn ? 'Direct bank debit with zero card fees' : 'Sin comisiones por procesamiento de tarjeta'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Sello de Garantía y Cifrado */}
            <div className="pt-2 text-center">
              <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[13px] text-[#2ED5A4]">verified_user</span>
                Bóveda Cifrada AES-256 • Cumplimiento PCI-DSS Nivel 1 • Procesado con Stripe
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 2: AGREGAR TARJETA (ALTA PRECISIÓN ESTILO APPLE / STRIPE)         */}
        {/* ========================================================================= */}
        {view === 'add-card' && (
          <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4 animate-fade-in">
            {/* Universal Don César Header: < | KinLogo | Nueva Tarjeta */}
            <header className="flex items-center justify-between pb-1 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('main');
                    setFormError(null);
                  }}
                  className="btn-circle"
                  title={isEn ? 'Back' : 'Volver'}
                >
                  <ChevronLeftIcon className="w-5 h-5 text-white" />
                </button>
                <KinLogo size={34} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4]">
                <span className="material-symbols-outlined text-[13px]">add_card</span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
                  {isEn ? 'Add Card' : 'Nueva Tarjeta'}
                </span>
              </div>
            </header>

            {/* Title */}
            <div className="text-center pt-1">
              <h2 className="text-base font-bold text-white tracking-tight">
                {isEn ? 'Add New Card' : 'Agregar Nueva Tarjeta'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? 'Encrypted zero-knowledge card enrollment' : 'Bóveda cifrada compatible con Visa, Mastercard y AMEX'}
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{formError}</span>
              </div>
            )}

            {/* Vista previa miniatura de la tarjeta */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#141C2A] to-[#1E293B] border border-white/15 relative overflow-hidden shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-6 rounded bg-amber-400/40 border border-amber-300/60" />
                <span className="font-financial-mono text-xs font-black uppercase text-white/80">
                  {detectedBrand.toUpperCase()}
                </span>
              </div>
              <p className="font-financial-mono text-base font-bold tracking-widest text-white mb-2">
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span className="uppercase truncate max-w-[180px]">{cardHolder || (isEn ? 'CARDHOLDER NAME' : 'NOMBRE DEL TITULAR')}</span>
                <span>{cardExp || 'MM/AA'}</span>
              </div>
            </div>

            {/* Inputs de la Tarjeta */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
                {isEn ? 'Card details' : 'Datos de la tarjeta'}
              </label>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden focus-within:border-[#2ED5A4] focus-within:ring-1 focus-within:ring-[#2ED5A4] transition-all">
                {/* Número */}
                <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder={isEn ? 'Card number' : 'Número de tarjeta'}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-transparent font-financial-mono text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none tracking-wider"
                  />
                  <span className="material-symbols-outlined text-slate-500 text-[18px]">credit_card</span>
                </div>

                {/* Expiración y CVC */}
                <div className="grid grid-cols-2 divide-x divide-white/10">
                  <div className="px-3.5 py-2.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="MM / AA"
                      value={cardExp}
                      onChange={handleExpChange}
                      className="w-full bg-transparent font-financial-mono text-xs text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>

                  <div className="px-3.5 py-2.5 flex items-center">
                    <input
                      type="password"
                      inputMode="numeric"
                      required
                      maxLength={4}
                      placeholder="CVC"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-transparent font-financial-mono text-xs text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    <span className="material-symbols-outlined text-[16px] text-slate-500">lock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nombre del Titular */}
            <div className="space-y-1">
              <label className="font-label-caps text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
                {isEn ? 'Cardholder Name' : 'Nombre del Titular'}
              </label>
              <input
                type="text"
                required
                placeholder={isEn ? 'Name as it appears on card' : 'Nombre como aparece en la tarjeta'}
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-body-base text-xs focus:outline-none focus:border-[#2ED5A4]"
              />
            </div>

            {/* Dirección de Facturación */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-label-caps text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5 block mb-1">
                  {isEn ? 'Country' : 'País'}
                </label>
                <select
                  value={billingCountry}
                  onChange={(e) => setBillingCountry(e.target.value as 'US' | 'MX')}
                  className="w-full h-10 px-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-[#2ED5A4] cursor-pointer"
                >
                  <option value="US" className="bg-[#0B0F17] text-white">United States (USA)</option>
                  <option value="MX" className="bg-[#0B0F17] text-white">México (MX)</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5 block mb-1">
                  {isEn ? 'ZIP Code' : 'Código Postal'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="10451"
                  value={billingZip}
                  onChange={(e) => setBillingZip(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-financial-mono text-xs focus:outline-none focus:border-[#2ED5A4]"
                />
              </div>
            </div>

            {/* Checkbox guardar */}
            <label className="flex items-center gap-2.5 px-0.5 py-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveForFuture}
                onChange={(e) => setSaveForFuture(e.target.checked)}
                className="w-4 h-4 rounded text-[#2ED5A4] focus:ring-[#2ED5A4] border-white/20 bg-white/5"
              />
              <span className="text-xs text-slate-300">
                {isEn ? 'Save card to encrypted vault' : 'Guardar tarjeta en bóveda cifrada'}
              </span>
            </label>

            {/* Botón de Guardar */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full h-11 rounded-2xl bg-[#2ED5A4] hover:bg-[#28c094] text-slate-950 font-bold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>
                {isProcessing
                  ? (isEn ? 'Tokenizing with Stripe...' : 'Tokenizando con Stripe...')
                  : (isEn ? 'Save Card Securely' : 'Guardar Tarjeta en Bóveda')}
              </span>
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 3: VINCULAR CUENTA BANCARIA DIRECTA (ACH / SPEI)                  */}
        {/* ========================================================================= */}
        {view === 'add-bank' && (
          <div className="flex flex-col space-y-4 animate-fade-in">
            {/* Universal Don César Header: < | KinLogo | Banco */}
            <header className="flex items-center justify-between pb-1 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView('main')}
                  className="btn-circle"
                  title={isEn ? 'Back' : 'Volver'}
                >
                  <ChevronLeftIcon className="w-5 h-5 text-white" />
                </button>
                <KinLogo size={34} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400">
                <span className="material-symbols-outlined text-[13px]">account_balance</span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
                  ACH / SPEI
                </span>
              </div>
            </header>

            {/* Title */}
            <div className="text-center pt-1">
              <h2 className="text-base font-bold text-white tracking-tight">
                {isEn ? 'Link Bank Account' : 'Vincular Cuenta Bancaria'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? 'Direct bank debit with zero processing fees' : 'Rieles directos Banxico SPEI y ACH de bajo costo'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-3">
              <span className="material-symbols-outlined text-[22px] text-blue-400 shrink-0">account_balance</span>
              <div>
                <span className="font-bold block">{isEn ? 'Direct Bank Rails (Zero Fees)' : 'Rieles Directos (0% Comisión)'}</span>
                <span className="text-[11px] text-slate-400">
                  {isEn ? 'Supports Chase, Bank of America, Wells Fargo & Banxico.' : 'Compatible con Chase, Bank of America, Wells Fargo y Banxico.'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase px-0.5">
                  {isEn ? 'Routing Number (ABA 9 digits)' : 'Número de Ruta (Routing 9 dígitos)'}
                </label>
                <input
                  type="text"
                  placeholder="021000021"
                  className="w-full h-10 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-financial-mono text-xs focus:outline-none focus:border-[#2ED5A4]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase px-0.5">
                  {isEn ? 'Account Number' : 'Número de Cuenta'}
                </label>
                <input
                  type="text"
                  placeholder="1234567890"
                  className="w-full h-10 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-financial-mono text-xs focus:outline-none focus:border-[#2ED5A4]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  alert(isEn ? 'Bank linked successfully.' : 'Cuenta bancaria vinculada.');
                  setView('main');
                }}
                className="w-full h-11 rounded-2xl bg-[#2ED5A4] hover:bg-[#28c094] text-slate-950 font-bold text-xs active:scale-[0.98] transition-all cursor-pointer mt-2"
              >
                {isEn ? 'Link Bank Account' : 'Vincular Cuenta Bancaria'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
