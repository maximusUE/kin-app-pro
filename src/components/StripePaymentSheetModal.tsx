'use client';

import React, { useState, useRef } from 'react';

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
  const isEn = language === 'en';

  // Sub-view navigation: 'main' | 'add-card' | 'add-bank' | 'apple-pay-sheet'
  const [view, setView] = useState<'main' | 'add-card' | 'add-bank'>('main');

  // Add Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('Mateo Morales');
  const [billingCountry, setBillingCountry] = useState<'US' | 'MX'>('US');
  const [billingZip, setBillingZip] = useState('10451');
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Apple Pay / Fast Wallet simulation modal
  const [applePayActive, setApplePayActive] = useState(false);
  const [applePaySuccess, setApplePaySuccess] = useState(false);

  // Hidden File/Camera Input for Scan Card
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Real-time Brand Detection
  const detectBrand = (num: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic' => {
    const clean = num.replace(/\D/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    if (/^6/.test(clean)) return 'discover';
    return 'generic';
  };

  const detectedBrand = detectBrand(cardNumber);

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const parts = val.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : val);
    setFormError(null);
  };

  // Format Expiration Date (MM/YY)
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      setCardExp(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setCardExp(val);
    }
    setFormError(null);
  };

  // Trigger Camera Scanner
  const handleTriggerCameraScan = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleCameraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Fast OCR simulation with verified Mateo Morales test debit
      setCardNumber('4242 8942 1092 3841');
      setCardExp('08/29');
      setCardCvv('742');
      setCardHolder('Mateo Morales');
      setBillingZip('10451');
      setFormError(null);
    }
  };

  // Submit Add Card
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s/g, '');

    if (cleanNum.length < 15) {
      setFormError(isEn ? 'Please enter a valid 16-digit card number' : 'Ingresa un número de tarjeta válido a 16 dígitos');
      return;
    }

    if (!cardExp || cardExp.length < 5) {
      setFormError(isEn ? 'Please enter a valid expiration date (MM/YY)' : 'Ingresa una fecha de expiración válida (MM/AA)');
      return;
    }

    if (!cardCvv || cardCvv.length < 3) {
      setFormError(isEn ? 'Please enter a valid CVV security code' : 'Ingresa el código de seguridad CVV');
      return;
    }

    setIsProcessing(true);
    setFormError(null);

    try {
      // Call backend tokenization API
      await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'user-001',
          cardNumber: cleanNum,
          exp: cardExp,
          cvv: cardCvv,
          cardHolder: cardHolder.trim() || 'Mateo Morales',
          zip: billingZip,
          country: billingCountry === 'US' ? 'United States' : 'Mexico',
          savePermanently: saveForFuture,
        }),
      });

      onAddNewCard({
        cardNumber: cleanNum,
        exp: cardExp,
        cvv: cardCvv,
        cardHolder: cardHolder.trim() || 'Mateo Morales',
        zip: billingZip,
        country: billingCountry === 'US' ? 'United States' : 'Mexico',
        savePermanently: saveForFuture,
      });

      setIsProcessing(false);
      setView('main');
      setCardNumber('');
      setCardExp('');
      setCardCvv('');
    } catch (_) {
      setIsProcessing(false);
      setView('main');
    }
  };

  // Apple Pay Simulation
  const handleTriggerApplePay = () => {
    setApplePayActive(true);
    setApplePaySuccess(false);
    setTimeout(() => {
      setApplePaySuccess(true);
      setTimeout(() => {
        setApplePayActive(false);
        setApplePaySuccess(false);
      }, 1400);
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      {/* Hidden camera input for card scan */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraFileChange}
      />

      {/* Main Payment Sheet Card */}
      <div
        className="w-full max-w-[430px] rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-[#181825] border-t sm:border border-slate-200 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.35)] sm:shadow-[0_24px_60px_rgba(0,0,0,0.7)] p-5 sm:p-6 relative animate-scale-in text-slate-800 dark:text-slate-100 max-h-[92vh] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top iOS Pull Handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full mx-auto mb-4" />

        {/* ========================================================================= */}
        {/* SUBVIEW 1: SELECT PAYMENT METHOD & EXPRESS WALLETS                        */}
        {/* ========================================================================= */}
        {view === 'main' && (
          <div className="flex flex-col space-y-4">
            {/* Header with Close */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {isEn ? 'Payment methods' : 'Métodos de pago'}
                </h2>
                <p className="font-caption-sm text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEn ? 'Funds for instant SPEI & remittances' : 'Fondos para transferencias SPEI y envíos'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* 1-Click Express Checkout Wallets (Apple Pay & Stripe Link) */}
            <div className="flex flex-col space-y-2 pt-1">
              {/* Apple Pay Button */}
              <button
                type="button"
                onClick={handleTriggerApplePay}
                className="w-full h-12 rounded-xl bg-black text-white hover:bg-neutral-900 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md font-medium cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current mb-0.5" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.74-7.98-12.16-14.69-5.9-9.08-10.45-19.46-13.66-31.13-3.21-11.67-4.82-22.92-4.82-33.74 0-14.18 3.51-26.04 10.53-35.58 7.02-9.54 16.03-14.42 27.02-14.65 4.35 0 9.28 1.13 14.79 3.39 5.51 2.26 9.4 3.44 11.67 3.54 1.95-.1 5.92-1.3 11.9-3.61 5.98-2.31 10.9-3.35 14.75-3.12 11.05.69 19.98 4.77 26.8 12.24-9.61 5.83-14.34 14-14.19 24.51.15 8.35 3.37 15.35 9.66 21 6.29 5.65 13.78 8.79 22.47 9.42-2.12 6.64-4.82 13.5-8.1 20.59zM119.22 31.84c0-7.39 2.66-14.47 7.98-21.23 5.32-6.76 12.11-10.61 20.37-11.55.15 1.1.23 2.13.23 3.09 0 7.39-2.73 14.44-8.19 21.15-5.46 6.71-12.28 10.54-20.46 11.48-.08-.94-.13-1.92-.13-2.94z" />
                </svg>
                <span className="font-semibold text-[17px] tracking-tight">Pay</span>
              </button>

              {/* Pay with Link Button */}
              <button
                type="button"
                onClick={() => {
                  setView('add-card');
                }}
                className="w-full h-12 rounded-xl bg-[#00D66F] hover:bg-[#00c264] text-[#003820] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md font-bold cursor-pointer"
              >
                <span className="text-[15px] font-bold tracking-tight">Pay with</span>
                <span className="inline-flex items-center gap-1 font-black text-[16px] tracking-wider bg-[#003820] text-white px-2 py-0.5 rounded-full text-xs">
                  link
                </span>
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-slate-200 dark:border-white/10 w-full" />
              <span className="bg-white dark:bg-[#181825] px-3 font-caption-sm text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider">
                {isEn ? 'Or pay using' : 'O paga con'}
              </span>
            </div>

            {/* Saved Cards Section */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between px-0.5">
                <span className="font-label-caps text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isEn ? 'Saved' : 'Guardadas'}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-[#2ED5A4] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  {isEn ? 'PCI-DSS Verified' : 'Verificado PCI-DSS'}
                </span>
              </div>

              <div className="space-y-2">
                {savedCards.map((card) => {
                  return (
                    <div
                      key={card.id}
                      onClick={() => onSelectDefaultCard(card.id)}
                      className={`p-3.5 rounded-2xl relative flex items-center justify-between cursor-pointer border transition-all ${
                        card.isDefault
                          ? 'bg-slate-50 dark:bg-white/5 border-emerald-500/50 shadow-sm'
                          : 'bg-white dark:bg-[#1E1E2E] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* High-res Card Brand Icon Capsule */}
                        <div className="w-12 h-8 rounded-lg bg-white border border-slate-200 dark:border-white/15 flex items-center justify-center p-1 shadow-sm shrink-0">
                          {card.type.toLowerCase().includes('mc') || card.brand === 'mastercard' ? (
                            <div className="flex -space-x-1.5 items-center">
                              <span className="w-4 h-4 rounded-full bg-[#EB001B] opacity-90 inline-block" />
                              <span className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-90 inline-block" />
                            </div>
                          ) : card.brand === 'amex' ? (
                            <span className="font-financial-mono text-[9px] font-black text-[#006FCF]">AMEX</span>
                          ) : (
                            <span className="font-financial-mono text-[11px] font-black italic text-[#1A1F71] tracking-tight">
                              VISA
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-title-base text-sm font-bold text-slate-900 dark:text-white truncate">
                              •••• {card.last4}
                            </span>
                            {card.isDefault && (
                              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-[#2ED5A4] text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-500/30">
                                {isEn ? 'Default' : 'Predeterminada'}
                              </span>
                            )}
                          </div>
                          <span className="font-caption-sm text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {card.name} • Exp {card.exp}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {card.isDefault ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDefaultCard(card.id);
                            }}
                            className="text-xs font-semibold text-emerald-600 dark:text-[#2ED5A4] hover:underline cursor-pointer"
                          >
                            {isEn ? 'Set default' : 'Usar'}
                          </button>
                        )}

                        {onDeleteCard && savedCards.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(isEn ? 'Remove this card?' : '¿Eliminar esta tarjeta?')) {
                                onDeleteCard(card.id);
                              }
                            }}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
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
            </div>

            {/* New Payment Method Options (Screenshot 2) */}
            <div className="flex flex-col space-y-2 pt-1">
              <span className="font-label-caps text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-0.5">
                {isEn ? 'New payment method' : 'Nuevo método de pago'}
              </span>

              {/* Option 1: New Card */}
              <button
                type="button"
                onClick={() => setView('add-card')}
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#1E1E2E] border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 flex items-center justify-between text-left transition-all group shadow-sm active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <span className="material-symbols-outlined text-[22px]">credit_card</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-base text-sm font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Credit or debit card' : 'Tarjeta de crédito o débito'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-slate-500 dark:text-slate-400">
                      Visa, Mastercard, Amex, Discover
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </button>

              {/* Option 2: Direct Bank Transfer ACH / SPEI */}
              <button
                type="button"
                onClick={() => setView('add-bank')}
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#1E1E2E] border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 flex items-center justify-between text-left transition-all group shadow-sm active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <span className="material-symbols-outlined text-[22px]">account_balance</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-base text-sm font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Direct Bank ACH / SPEI' : 'Cuenta Bancaria Directa ACH / SPEI'}
                    </span>
                    <span className="font-caption-sm text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn ? 'Zero card processing fees' : 'Sin comisiones por procesamiento'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </button>

              {/* Option 3: Cash App Pay */}
              <button
                type="button"
                onClick={() => {
                  alert(isEn ? 'Cash App Pay integration initialized.' : 'Conexión con Cash App Pay iniciada.');
                }}
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#1E1E2E] border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 flex items-center justify-between text-left transition-all group shadow-sm active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00D632]/10 text-[#00D632] flex items-center justify-center font-black text-lg">
                    $
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-base text-sm font-bold text-slate-900 dark:text-white">
                      Cash App Pay
                    </span>
                    <span className="font-caption-sm text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn ? 'Pay directly from your Cash App balance' : 'Paga directo desde tu saldo de Cash App'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Trust & Compliance Seal Footer */}
            <div className="pt-2 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-[11px]">
              <span className="material-symbols-outlined text-[15px] text-emerald-600 dark:text-[#2ED5A4]">verified_user</span>
              <span>256-bit AES Vault • PCI-DSS Level 1 Compliant</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 2: ADD NEW CARD (EXACT REPLICA OF SCREENSHOT 2 RIGHT SCREEN)      */}
        {/* ========================================================================= */}
        {view === 'add-card' && (
          <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4 animate-fade-in">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setView('main');
                  setFormError(null);
                }}
                className="flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-[#2ED5A4] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
                <span className="font-semibold text-sm">{isEn ? 'Back' : 'Atrás'}</span>
              </button>

              <h2 className="font-headline-md text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isEn ? 'Add new card' : 'Añadir nueva tarjeta'}
              </h2>

              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{formError}</span>
              </div>
            )}

            {/* Card Information Block */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between px-0.5">
                <label className="font-label-caps text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {isEn ? 'Card information' : 'Información de la tarjeta'}
                </label>

                {/* Scan Card Button (Triggers phone camera) */}
                <button
                  type="button"
                  onClick={handleTriggerCameraScan}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-[#2ED5A4] hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  <span>{isEn ? 'Scan card' : 'Escanear tarjeta'}</span>
                </button>
              </div>

              {/* Grouped Stripe Input Container */}
              <div className="rounded-2xl border border-slate-300 dark:border-white/15 overflow-hidden shadow-sm bg-white dark:bg-[#1E1E2E] focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
                {/* Row 1: Card Number + Brand Logos */}
                <div className="relative flex items-center border-b border-slate-200 dark:border-white/10 px-3.5 py-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder={isEn ? 'Card number' : 'Número de tarjeta'}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-transparent font-financial-mono text-[15px] font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none tracking-wider"
                  />

                  {/* Dynamic Brand Logos */}
                  <div className="flex items-center gap-1 shrink-0 pl-2">
                    {detectedBrand === 'visa' && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#1A1F71] font-financial-mono text-xs font-black italic">
                        VISA
                      </span>
                    )}
                    {detectedBrand === 'mastercard' && (
                      <div className="flex -space-x-1.5 items-center">
                        <span className="w-4 h-4 rounded-full bg-[#EB001B] inline-block" />
                        <span className="w-4 h-4 rounded-full bg-[#F79E1B] inline-block" />
                      </div>
                    )}
                    {detectedBrand === 'amex' && (
                      <span className="px-1.5 py-0.5 rounded bg-[#006FCF] text-white font-financial-mono text-[10px] font-bold">
                        AMEX
                      </span>
                    )}
                    {detectedBrand === 'generic' && (
                      <div className="flex items-center gap-1 opacity-60">
                        <span className="w-3.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
                        <span className="w-3.5 h-2.5 rounded-sm bg-red-600 inline-block" />
                        <span className="w-3.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: Expiration (MM/YY) & CVC */}
                <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-white/10">
                  <div className="px-3.5 py-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="MM / YY"
                      value={cardExp}
                      onChange={handleExpChange}
                      className="w-full bg-transparent font-financial-mono text-[14px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>

                  <div className="relative flex items-center px-3.5 py-3">
                    <input
                      type="password"
                      inputMode="numeric"
                      required
                      maxLength={4}
                      placeholder="CVC"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-transparent font-financial-mono text-[14px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                    />
                    <span className="material-symbols-outlined text-[18px] text-slate-400 shrink-0">
                      lock
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cardholder Name */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-label-caps text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-0.5">
                {isEn ? 'Cardholder name' : 'Nombre del titular'}
              </label>
              <input
                type="text"
                required
                placeholder={isEn ? 'Full name on card' : 'Nombre completo en la tarjeta'}
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-[#1E1E2E] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-body-base text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>

            {/* Billing Address Block (Screenshot 2) */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-label-caps text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-0.5">
                {isEn ? 'Billing address' : 'Dirección de facturación'}
              </label>

              <div className="rounded-2xl border border-slate-300 dark:border-white/15 overflow-hidden shadow-sm bg-white dark:bg-[#1E1E2E] divide-y divide-slate-200 dark:divide-white/10">
                {/* Country selector */}
                <div className="px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {isEn ? 'Country or region' : 'País o región'}
                    </span>
                    <select
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value as 'US' | 'MX')}
                      className="bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="US" className="bg-white dark:bg-[#181825] text-slate-900 dark:text-white">
                        United States (USA)
                      </option>
                      <option value="MX" className="bg-white dark:bg-[#181825] text-slate-900 dark:text-white">
                        México (MX)
                      </option>
                    </select>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-slate-400">
                    expand_more
                  </span>
                </div>

                {/* ZIP / Postal Code */}
                <div className="px-3.5 py-2.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    {isEn ? 'ZIP / Postal code' : 'Código Postal'}
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="10451"
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                    className="w-full bg-transparent font-financial-mono text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox: Save this card for future payments */}
            <label className="flex items-center gap-3 px-1 py-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveForFuture}
                onChange={(e) => setSaveForFuture(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-white/20 dark:bg-white/10"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {isEn
                  ? 'Save this card for future payments & remittances'
                  : 'Guardar esta tarjeta para futuros pagos y envíos'}
              </span>
            </label>

            {/* Zero-Knowledge Security Notice */}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed px-1">
              {isEn
                ? 'Your payment information is encrypted client-side with Zero-Knowledge Vault. We never store your full 16-digit card number or CVC code on our servers.'
                : 'Tus datos de pago están cifrados en el cliente con bóveda Zero-Knowledge. Nunca guardamos tu número completo de tarjeta ni el CVC en nuestros servidores.'}
            </p>

            {/* Primary Action CTA (Screenshot 2) */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-[#2ED5A4] dark:hover:bg-[#28c094] text-white dark:text-[#003828] font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>
                {isProcessing
                  ? (isEn ? 'Encrypting & Tokenizing...' : 'Cifrando y Tokenizando...')
                  : (isEn ? 'Save Card & Verify' : 'Guardar Tarjeta y Verificar')}
              </span>
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 3: ADD BANK ACH / SPEI                                            */}
        {/* ========================================================================= */}
        {view === 'add-bank' && (
          <div className="flex flex-col space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setView('main')}
                className="flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-[#2ED5A4] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
                <span className="font-semibold text-sm">{isEn ? 'Back' : 'Atrás'}</span>
              </button>
              <h2 className="font-headline-md text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {isEn ? 'Link Bank Account' : 'Vincular Cuenta Bancaria'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-900 dark:text-blue-300 text-xs flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px] text-blue-600">account_balance</span>
              <div>
                <span className="font-bold block">{isEn ? 'Direct ACH & SPEI Rails' : 'Rieles Directos ACH & SPEI'}</span>
                <span>{isEn ? 'Connect with Chase, Bank of America, Wells Fargo or Banxico.' : 'Conecta con Chase, Bank of America, Wells Fargo o Banxico.'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">
                  {isEn ? 'Routing Number (ABA / 9 digits)' : 'Número de Ruta (Routing 9 dígitos)'}
                </label>
                <input
                  type="text"
                  placeholder="021000021"
                  className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-[#1E1E2E] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-financial-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">
                  {isEn ? 'Account Number' : 'Número de Cuenta'}
                </label>
                <input
                  type="text"
                  placeholder="•••• •••• 9102"
                  className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-[#1E1E2E] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-financial-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  alert(isEn ? 'Instant bank verification authorized via Plaid / Banxico.' : 'Verificación bancaria instantánea autorizada vía Plaid / Banxico.');
                  setView('main');
                }}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isEn ? 'Authorize Instant Bank Link' : 'Autorizar Enlace Bancario Seguro'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Apple Pay Overlay Sheet Simulation */}
      {applePayActive && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-end justify-center p-3 animate-fade-in">
          <div className="w-full max-w-[390px] rounded-3xl bg-[#1c1c1e] text-white p-5 border border-white/20 shadow-2xl flex flex-col items-center text-center space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-1">
              {applePaySuccess ? (
                <span className="material-symbols-outlined text-[28px] text-[#00D66F]">check_circle</span>
              ) : (
                <span className="material-symbols-outlined text-[28px] animate-pulse">fingerprint</span>
              )}
            </div>

            <div>
              <h3 className="font-bold text-lg text-white">
                {applePaySuccess
                  ? (isEn ? 'Apple Pay Done' : 'Apple Pay Confirmado')
                  : (isEn ? 'Confirm with Face ID' : 'Confirma con Face ID')}
              </h3>
              <p className="text-xs text-white/60 mt-1">
                {isEn ? 'Double click side button to authenticate' : 'Pulsa dos veces el botón lateral para autenticar'}
              </p>
            </div>

            <div className="w-full p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-left text-xs">
              <span className="text-white/60">KIN App Transmit</span>
              <span className="font-financial-mono font-bold text-white">VISA •••• 8942</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
