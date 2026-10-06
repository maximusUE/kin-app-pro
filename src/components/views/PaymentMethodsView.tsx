'use client';

import React, { useState } from 'react';
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

export interface PaymentMethodsViewProps {
  onBack: () => void;
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
}

export function PaymentMethodsView({
  onBack,
  savedCards,
  onSelectDefaultCard,
  onAddNewCard,
  onDeleteCard,
  language = 'es',
}: PaymentMethodsViewProps) {
  const isEn = language === 'en';
  const [currentScreen, setCurrentScreen] = useState<'list' | 'add-card' | 'add-bank'>('list');

  // Formulario de Nueva Tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [billingCountry, setBillingCountry] = useState<'US' | 'MX'>('US');
  const [billingZip, setBillingZip] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Formateo de número de tarjeta en bloques de 4
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Formateo de fecha de expiración MM/AA
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExp(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExp(raw);
    }
  };

  // Detección automática de marca de tarjeta
  const detectBrand = (num: string): 'visa' | 'mastercard' | 'amex' | 'generic' => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    return 'generic';
  };

  const detectedBrand = detectBrand(cardNumber);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCard = cardNumber.replace(/\D/g, '');
    if (cleanCard.length < 15) {
      setFormError(isEn ? 'Please enter a valid 15-16 digit card number' : 'Ingresa un número de tarjeta válido (15 o 16 dígitos)');
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
      setCurrentScreen('list');
      setCardNumber('');
      setCardExp('');
      setCardCvv('');
      setCardHolder('');
    }, 600);
  };

  // =========================================================================
  // PANTALLA 1: LISTADO COMPLETO DE MÉTODOS DE PAGO (PANTALLA COMPLETA)
  // =========================================================================
  if (currentScreen === 'list') {
    const defaultCard = savedCards.find((c) => c.isDefault) || savedCards[0];
    const otherCards = savedCards.filter((c) => c.id !== defaultCard?.id);

    return (
      <div className="flex flex-col w-full min-h-[90vh] pb-32 select-none relative animate-fade-in text-slate-100">
        {/* Barra Superior de Navegación de Pantalla: < | KinLogo */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="btn-circle"
              title={isEn ? 'Back to Profile' : 'Volver al Perfil'}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={34} />
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#2ED5A4] font-bold uppercase tracking-wider block">
              {isEn ? 'Encrypted Vault' : 'Bóveda Cifrada'}
            </span>
            <span className="font-title-base text-sm font-bold text-white">
              {isEn ? 'Payment Methods' : 'Métodos de Pago'}
            </span>
          </div>
        </div>

        {/* Tarjeta Principal Destacada (Estilo Tarjeta Física Digital) */}
        {defaultCard && (
          <div className="mb-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
              {isEn ? 'Primary Payment Card' : 'Tarjeta Principal de Cobro'}
            </span>

            <div className="w-full aspect-[1.586/1] rounded-3xl p-6 relative overflow-hidden bg-gradient-to-tr from-[#0F172A] via-[#141E33] to-[#0A0F1D] border border-[#2ED5A4]/40 shadow-[0_16px_40px_rgba(46,213,164,0.12)] flex flex-col justify-between group">
              {/* Halos decorativos de fondo */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#2ED5A4]/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

              {/* Fila 1: Chip EMV + Ondas Contactless + Marca */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  {/* Microchip EMV */}
                  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200/60 p-1 flex items-center justify-center shadow-inner">
                    <div className="w-full h-full border border-amber-800/30 rounded-xs flex items-center justify-center">
                      <div className="w-3 h-2 border-r border-amber-800/30" />
                    </div>
                  </div>
                  {/* Símbolo Contactless */}
                  <span className="material-symbols-outlined text-white/50 text-[18px]">contactless</span>
                </div>

                {/* Logo de la Franquicia */}
                <div className="text-right">
                  {defaultCard.type.toLowerCase().includes('mc') || defaultCard.brand === 'mastercard' ? (
                    <div className="flex -space-x-2 items-center">
                      <span className="w-6 h-6 rounded-full bg-[#EB001B] opacity-95 inline-block shadow-sm" />
                      <span className="w-6 h-6 rounded-full bg-[#F79E1B] opacity-95 inline-block shadow-sm" />
                    </div>
                  ) : defaultCard.brand === 'amex' ? (
                    <span className="font-financial-mono text-xs font-black text-[#006FCF] bg-white px-2 py-0.5 rounded">
                      AMEX
                    </span>
                  ) : (
                    <span className="font-financial-mono text-base font-black italic text-white tracking-wider">
                      VISA
                    </span>
                  )}
                </div>
              </div>

              {/* Fila 2: Número de Tarjeta Monospace */}
              <div className="my-auto py-2 relative z-10">
                <p className="font-financial-mono text-lg sm:text-xl font-bold tracking-[0.25em] text-white">
                  •••• •••• •••• {defaultCard.last4}
                </p>
              </div>

              {/* Fila 3: Nombre del Titular + Expiración + Badge */}
              <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                    {isEn ? 'Cardholder' : 'Titular'}
                  </span>
                  <span className="font-title-base text-xs font-bold text-white uppercase tracking-wider">
                    {defaultCard.name}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                    {isEn ? 'Expires' : 'Vence'}
                  </span>
                  <span className="font-financial-mono text-xs font-bold text-white">
                    {defaultCard.exp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Otras Tarjetas Guardadas en la Bóveda */}
        {otherCards.length > 0 && (
          <div className="space-y-3 mb-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
              {isEn ? 'Other Saved Cards' : 'Otras Tarjetas Guardadas'}
            </span>

            <div className="space-y-2">
              {otherCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => onSelectDefaultCard(card.id)}
                  className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                      <span className="font-financial-mono text-[10px] font-bold text-white">
                        {card.brand.toUpperCase()}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="font-financial-mono text-sm font-bold text-white">
                        •••• {card.last4}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {card.name} • {card.exp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDefaultCard(card.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#2ED5A4]/20 text-xs font-bold text-[#2ED5A4] border border-[#2ED5A4]/30 cursor-pointer transition-colors"
                    >
                      {isEn ? 'Set Primary' : 'Usar Principal'}
                    </button>

                    {onDeleteCard && savedCards.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(isEn ? 'Delete this card?' : '¿Eliminar esta tarjeta?')) {
                            onDeleteCard(card.id);
                          }
                        }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones Principales de Acción para Nuevos Métodos */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentScreen('add-card')}
            className="w-full h-14 rounded-2xl bg-[#2ED5A4] hover:bg-[#28c094] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(46,213,164,0.25)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_card</span>
            <span>{isEn ? 'Add New Debit or Credit Card' : 'Agregar Nueva Tarjeta de Débito o Crédito'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentScreen('add-bank')}
            className="w-full h-12 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-blue-400">account_balance</span>
            <span>{isEn ? 'Link Bank Account (ACH / SPEI - 0% Fee)' : 'Vincular Cuenta Bancaria (ACH / SPEI - Sin Comisión)'}</span>
          </button>
        </div>

        {/* Sello de Garantía Bancaria */}
        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[14px] text-[#2ED5A4]">verified_user</span>
            Bóveda Cifrada AES-256 • Cumplimiento PCI-DSS Nivel 1 • Procesamiento Seguro Stripe
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PANTALLA 2: FORMULARIO COMPLETO PARA AGREGAR TARJETA (PANTALLA COMPLETA)
  // =========================================================================
  if (currentScreen === 'add-card') {
    return (
      <div className="flex flex-col w-full min-h-[90vh] pb-32 select-none relative animate-fade-in text-slate-100">
        {/* Barra Superior de Navegación: < | KinLogo */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrentScreen('list');
                setFormError(null);
              }}
              className="btn-circle"
              title={isEn ? 'Back to Cards' : 'Volver a Tarjetas'}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={34} />
          </div>

          <span className="font-title-base text-sm font-bold text-white">
            {isEn ? 'Add Card' : 'Nueva Tarjeta'}
          </span>
        </div>

        {formError && (
          <div className="p-3.5 mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{formError}</span>
          </div>
        )}

        {/* Vista Previa Interactiva de la Tarjeta */}
        <div className="w-full aspect-[1.8/1] rounded-3xl p-5 mb-5 bg-gradient-to-tr from-[#1E293B] via-[#0F172A] to-[#1E1B4B] border border-white/15 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-9 h-6 rounded bg-amber-400/40 border border-amber-300/60 shadow-inner" />
            <span className="font-financial-mono text-xs font-black uppercase text-white tracking-wider">
              {detectedBrand.toUpperCase()}
            </span>
          </div>

          <p className="font-financial-mono text-base sm:text-lg font-bold tracking-[0.2em] text-white">
            {cardNumber || '•••• •••• •••• ••••'}
          </p>

          <div className="flex items-end justify-between border-t border-white/10 pt-2 text-[10px] text-slate-400">
            <div>
              <span className="block text-[8px] uppercase">{isEn ? 'Cardholder' : 'Titular'}</span>
              <span className="font-bold text-white uppercase truncate max-w-[190px] block">
                {cardHolder || (isEn ? 'YOUR NAME' : 'NOMBRE DEL TITULAR')}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] uppercase">{isEn ? 'Expires' : 'Vence'}</span>
              <span className="font-financial-mono font-bold text-white">
                {cardExp || 'MM/AA'}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario Estructurado con Inputs Espaciosos */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Número de Tarjeta */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
              {isEn ? 'Card Number' : 'Número de Tarjeta'}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full h-12 pl-4 pr-11 rounded-2xl bg-white/[0.04] border border-white/15 text-white font-financial-mono text-sm tracking-wider focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4] transition-all"
              />
              <span className="material-symbols-outlined text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 text-[20px]">
                credit_card
              </span>
            </div>
          </div>

          {/* Expiración y CVC en 2 Columnas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
                {isEn ? 'Expiration' : 'Expiración (MM/AA)'}
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="12/28"
                value={cardExp}
                onChange={handleExpChange}
                className="w-full h-12 px-4 rounded-2xl bg-white/[0.04] border border-white/15 text-white font-financial-mono text-sm focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4] transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
                {isEn ? 'Security Code (CVC)' : 'Código de Seguridad (CVC)'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  required
                  maxLength={4}
                  placeholder="123"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-12 pl-4 pr-10 rounded-2xl bg-white/[0.04] border border-white/15 text-white font-financial-mono text-sm focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4] transition-all"
                />
                <span className="material-symbols-outlined text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 text-[18px]">
                  lock
                </span>
              </div>
            </div>
          </div>

          {/* Nombre del Titular */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
              {isEn ? 'Cardholder Name' : 'Nombre Completo del Titular'}
            </label>
            <input
              type="text"
              required
              placeholder={isEn ? 'As appears on card' : 'Tal como aparece en la tarjeta'}
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-white/[0.04] border border-white/15 text-white text-sm focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4] transition-all"
            />
          </div>

          {/* País y Código Postal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
                {isEn ? 'Country' : 'País de Emisión'}
              </label>
              <select
                value={billingCountry}
                onChange={(e) => setBillingCountry(e.target.value as 'US' | 'MX')}
                className="w-full h-12 px-3 rounded-2xl bg-[#0F172A] border border-white/15 text-white text-xs focus:outline-none focus:border-[#2ED5A4] cursor-pointer"
              >
                <option value="US">United States (USA)</option>
                <option value="MX">México (MX)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
                {isEn ? 'Billing ZIP' : 'Código Postal (ZIP)'}
              </label>
              <input
                type="text"
                required
                placeholder="10451"
                value={billingZip}
                onChange={(e) => setBillingZip(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-white/[0.04] border border-white/15 text-white font-financial-mono text-sm focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4]"
              />
            </div>
          </div>

          {/* Checkbox Guardar */}
          <label className="flex items-center gap-3 py-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={saveForFuture}
              onChange={(e) => setSaveForFuture(e.target.checked)}
              className="w-5 h-5 rounded-lg text-[#2ED5A4] focus:ring-[#2ED5A4] border-white/20 bg-white/5 cursor-pointer"
            />
            <span className="text-xs text-slate-300 font-medium">
              {isEn ? 'Save this card for future 1-tap remittances' : 'Guardar esta tarjeta para envíos rápidos en 1 toque'}
            </span>
          </label>

          {/* Botón CTA Grande Estilo Píldora (Regla Don César) */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full h-14 rounded-full bg-[#2ED5A4] hover:bg-[#28c094] text-slate-950 font-bold text-sm shadow-[0_8px_24px_rgba(46,213,164,0.25)] border border-[#2ED5A4]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
            <span>
              {isProcessing
                ? (isEn ? 'Tokenizing with Stripe...' : 'Tokenizando con Stripe...')
                : (isEn ? 'Save Card in Secure Vault' : 'Guardar Tarjeta en Bóveda')}
            </span>
          </button>
        </form>
      </div>
    );
  }

  // =========================================================================
  // PANTALLA 3: VINCULAR CUENTA BANCARIA ACH (PANTALLA COMPLETA)
  // =========================================================================
  return (
    <div className="flex flex-col w-full min-h-[90vh] pb-32 select-none relative animate-fade-in text-slate-100">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentScreen('list')}
            className="btn-circle"
            title={isEn ? 'Back' : 'Volver'}
          >
            <ChevronLeftIcon className="w-5 h-5 text-white" />
          </button>
          <KinLogo size={34} />
        </div>

        <span className="font-title-base text-sm font-bold text-white">
          {isEn ? 'Bank Account' : 'Cuenta Bancaria'}
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-3 mb-5">
        <span className="material-symbols-outlined text-[24px] text-blue-400 shrink-0">account_balance</span>
        <div>
          <span className="font-bold block">{isEn ? 'Direct ACH & SPEI' : 'Rieles Directos (0% Comisión)'}</span>
          <span className="text-[11px] text-slate-400">
            {isEn ? 'Connect your US checking or savings account with zero processing fees.' : 'Conecta tu cuenta de cheques o ahorros de EE.UU. sin cargos por tarjeta.'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
            {isEn ? 'Routing Number (ABA 9 digits)' : 'Número de Ruta (Routing 9 dígitos)'}
          </label>
          <input
            type="text"
            placeholder="021000021"
            className="w-full h-12 px-4 rounded-2xl bg-white/[0.04] border border-white/15 text-white font-financial-mono text-sm focus:outline-none focus:border-[#2ED5A4]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
            {isEn ? 'Account Number' : 'Número de Cuenta'}
          </label>
          <input
            type="text"
            placeholder="1234567890"
            className="w-full h-12 px-4 rounded-2xl bg-white/[0.04] border border-white/15 text-white font-financial-mono text-sm focus:outline-none focus:border-[#2ED5A4]"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            alert(isEn ? 'Bank linked successfully.' : 'Cuenta bancaria vinculada con éxito.');
            setCurrentScreen('list');
          }}
          className="w-full h-14 rounded-2xl bg-[#2ED5A4] hover:bg-[#28c094] text-slate-950 font-bold text-sm shadow-[0_8px_24px_rgba(46,213,164,0.25)] active:scale-[0.98] transition-all cursor-pointer mt-4"
        >
          {isEn ? 'Connect Bank Account' : 'Conectar Cuenta Bancaria'}
        </button>
      </div>
    </div>
  );
}
