'use client';

import React, { useState, useEffect } from 'react';
import { getBankLogoUrl } from '@/components/Icons';
import { ContactAvatar } from '@/components/ContactAvatar';

export interface HomeContact {
  id?: string;
  name: string;
  relation?: string;
  bank?: string;
  photoUrl?: string;
  clabe?: string;
  phone?: string;
  [key: string]: any;
}

export interface HomeTransaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  amountMXN?: number;
  time: string;
  type?: 'income' | 'expense' | string;
  iconType?: string;
  [key: string]: any;
}

export interface HomeViewProps {
  userFirstName?: string;
  userName?: string;
  userKycTier?: string;
  currencyPref?: 'USD' | 'MXN';
  handleToggleCurrency?: (pref: 'USD' | 'MXN') => void;
  hideBalance?: boolean;
  setHideBalance?: (hide: boolean) => void;
  executiveBalance?: number;
  USD_TO_MXN_RATE: number;
  language: 'es' | 'en';
  onNavigateTab: (tab: 'send' | 'kin-cash' | 'send-quick' | 'bill-pay') => void;
  contactsList: HomeContact[];
  setShowContactModal: (show: boolean) => void;
  isContactEditMode: boolean;
  setIsContactEditMode: (editing: boolean) => void;
  setQuickContactActionTarget: (target: { contact: HomeContact; index: number } | null) => void;
  handleDeleteContact: (id?: string) => void;
  setEditingContactAvatarTarget: (contact: HomeContact | null) => void;
  setEditingContactPhotoInput: (url: string) => void;
  dashboardFilter: 'all' | 'sent' | 'bills';
  setDashboardFilter: (filter: 'all' | 'sent' | 'bills') => void;
  filteredDashboardTransactions: HomeTransaction[];
  setSelectedTransactionDetail: (tx: HomeTransaction | null) => void;
}

// Destinatarios familiares predeterminados para garantizar que el Círculo Familiar siempre cobre vida
const DEFAULT_FAMILY_MEMBERS: HomeContact[] = [
  {
    id: 'fam-mama',
    name: 'María Elena (Mamá)',
    relation: 'Mamá',
    bank: 'BBVA Bancomer',
    clabe: '012180004567891234',
    photoUrl: '',
  },
  {
    id: 'fam-carlos',
    name: 'Carlos Mendoza',
    relation: 'Hermano',
    bank: 'Banco Azteca',
    clabe: '127180001234567890',
    photoUrl: '',
  },
  {
    id: 'fam-rosa',
    name: 'Rosa Sánchez',
    relation: 'Tía',
    bank: 'Banorte',
    clabe: '072180003456789012',
    photoUrl: '',
  },
  {
    id: 'fam-alex',
    name: 'Alejandro Torres',
    relation: 'Primo',
    bank: 'Citibanamex',
    clabe: '002180005678901234',
    photoUrl: '',
  },
];

export function HomeView({
  userFirstName,
  userName,
  userKycTier,
  currencyPref = 'USD',
  handleToggleCurrency,
  USD_TO_MXN_RATE,
  language,
  onNavigateTab,
  contactsList,
  setShowContactModal,
  isContactEditMode,
  setIsContactEditMode,
  setQuickContactActionTarget,
  handleDeleteContact,
  setEditingContactAvatarTarget,
  setEditingContactPhotoInput,
  dashboardFilter,
  setDashboardFilter,
  filteredDashboardTransactions,
  setSelectedTransactionDetail,
}: HomeViewProps) {
  const isEn = language === 'en';

  // Estado del carrusel de historias y promociones VIP
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // Estado para el efecto de pila (STACK) estilo notificaciones de Apple
  const [isStackExpanded, setIsStackExpanded] = useState<boolean>(false);

  // Auto-rotación sutil de historias cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStoryIndex((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const visibleTransactions = filteredDashboardTransactions.slice(0, 5);
  const primaryTx = visibleTransactions[0];
  const secondaryTx = visibleTransactions[1];
  const tertiaryTx = visibleTransactions[2];

  // Lista enriquecida de familia
  const displayFamilyContacts =
    contactsList && contactsList.length > 0 ? contactsList : DEFAULT_FAMILY_MEMBERS;

  // Promociones e Historias del Bento Billboard
  const stories = [
    {
      badge: isEn ? 'WELCOME PROMO' : 'BIENVENIDA FAMILIAR',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-[#2ED5A4] border-emerald-500/25',
      title: isEn ? 'Send to Family with $0 Service Fee' : 'Tu 1er Envío a México con $0 Comisión',
      description: isEn
        ? 'First transfer to Mexico has zero KIN service charge. Direct SPEI delivery in under 30 seconds.'
        : 'Tu primera transferencia a México no paga comisión KIN. Liquidación SPEI en menos de 30 segundos.',
      cta: isEn ? 'Send Money Now' : 'Enviar a Mi Familia',
      action: () => onNavigateTab('send'),
      icon: 'redeem',
      gradient: 'from-emerald-600/15 via-teal-600/10 to-transparent dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-transparent',
    },
    {
      badge: isEn ? 'MEXICAN UTILITIES' : 'PAGO DE RECIBOS',
      badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
      title: isEn ? 'Pay Mom’s CFE Light Bill Instantly' : 'Paga la Luz de Casa (CFE) en Segundos',
      description: isEn
        ? 'Protect your family from service cut-offs. Settle electricity, water, and Telmex directly from the USA.'
        : 'Evita cortes de luz en México. Paga CFE, agua o Telmex de tu familia directamente desde tu celular.',
      cta: isEn ? 'Pay Utility Bill' : 'Pagar Recibo CFE',
      action: () => onNavigateTab('bill-pay'),
      icon: 'bolt',
      gradient: 'from-amber-600/15 via-orange-600/10 to-transparent dark:from-amber-500/20 dark:via-orange-500/10 dark:to-transparent',
    },
    {
      badge: isEn ? 'CASH PICKUP' : 'RETIRO EN EFECTIVO',
      badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/25',
      title: isEn ? '21,000+ Stores: OXXO, Bodega Aurrera' : 'Más de 21,000 Tiendas: OXXO y Aurrera',
      description: isEn
        ? 'Your relatives can pick up cash without a bank account in OXXO, Walmart, or Bodega Aurrera branches.'
        : 'Tu familia puede cobrar en ventanilla sin cuenta bancaria en cualquier OXXO, Walmart o Bodega Aurrera.',
      cta: isEn ? 'View Store Network' : 'Ver Puntos de Retiro',
      action: () => onNavigateTab('send'),
      icon: 'storefront',
      gradient: 'from-purple-600/15 via-indigo-600/10 to-transparent dark:from-purple-500/20 dark:via-indigo-500/10 dark:to-transparent',
    },
  ];

  const currentStory = stories[activeStoryIndex];

  return (
    <div className="animate-fade-in flex flex-col space-y-5 pb-24">
      {/* ========================================================================= */}
      {/* 1. SECCIÓN SUPERIOR: CABECERA EJECUTIVA & TOGGLE DE DIVISA EU / MX        */}
      {/* ========================================================================= */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-[#8E91A5]">
            {isEn ? 'Executive Overview' : 'Resumen Ejecutivo'}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5 tracking-tight">
            {isEn
              ? `Hello, ${userFirstName || (userName ? userName.split(' ')[0] : 'Welcome')}`
              : `Hola, ${userFirstName || (userName ? userName.split(' ')[0] : 'Bienvenido')}`}
          </h1>
        </div>

        {/* Conmutador de Ubicación / Divisa EU / MX */}
        <button
          type="button"
          role="switch"
          aria-checked={currencyPref === 'MXN'}
          aria-label={isEn ? 'Currency mode: US Dollar or Mexican Peso' : 'Modo de divisa: Dólar EU o Peso MX'}
          onClick={() => handleToggleCurrency?.(currencyPref === 'USD' ? 'MXN' : 'USD')}
          className="touch-press flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-surface-container-high hover:bg-slate-50 dark:hover:bg-surface-container-highest border border-slate-200/90 dark:border-white/10 shadow-sm cursor-pointer transition-all select-none group"
          title={
            currencyPref === 'USD'
              ? (isEn ? 'Switch to Mexican Pesos (MX)' : 'Cambiar a Pesos Mexicanos (MX)')
              : (isEn ? 'Switch to US Dollars (EU)' : 'Cambiar a Dólares (EU)')
          }
        >
          <span
            className={`font-financial-mono text-[11px] font-black tracking-tight transition-all duration-200 ${
              currencyPref === 'USD'
                ? 'text-emerald-600 dark:text-[#2ED5A4] drop-shadow-xs scale-105'
                : 'text-slate-400 dark:text-on-surface-variant opacity-60'
            }`}
          >
            EU
          </span>

          <div
            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-300 flex items-center flex-shrink-0 ${
              currencyPref === 'MXN'
                ? 'bg-emerald-600 dark:bg-[#2ED5A4]'
                : 'bg-slate-300 dark:bg-[#313244]'
            }`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-out ${
                currencyPref === 'MXN' ? 'translate-x-4.5' : 'translate-x-0'
              }`}
            />
          </div>

          <span
            className={`font-financial-mono text-[11px] font-black tracking-tight transition-all duration-200 ${
              currencyPref === 'MXN'
                ? 'text-emerald-600 dark:text-[#2ED5A4] drop-shadow-xs scale-105'
                : 'text-slate-400 dark:text-on-surface-variant opacity-60'
            }`}
          >
            MX
          </span>
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 2. LOS 4 BOTONES DE ACCIÓN RÁPIDA (ACCIONES PRINCIPALES)                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* 1. SEND */}
        <button
          type="button"
          onClick={() => onNavigateTab('send')}
          className="group flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 dark:from-[#2ED5A4] dark:to-[#18A57E] flex items-center justify-center text-white dark:text-[#06070B] shadow-[0_8px_20px_-4px_rgba(46,213,164,0.45)] transition-transform group-hover:scale-105 active:scale-95">
            <span className="material-symbols-outlined text-[28px] font-bold">send</span>
          </div>
          <span className="text-[11px] text-slate-800 dark:text-white font-extrabold tracking-tight">
            {isEn ? 'SEND' : 'ENVIAR'}
          </span>
        </button>

        {/* 2. KINCASH */}
        <button
          type="button"
          onClick={() => onNavigateTab('kin-cash')}
          className="group flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-surface-container-high flex items-center justify-center text-emerald-600 dark:text-primary transition-transform group-hover:scale-105 active:scale-95 shadow-sm border border-slate-200/90 dark:border-white/10">
            <span className="material-symbols-outlined text-[26px]">bolt</span>
          </div>
          <span className="text-[11px] text-slate-700 dark:text-white font-bold tracking-tight">
            KINCASH
          </span>
        </button>

        {/* 3. QUICK SEND */}
        <button
          type="button"
          onClick={() => onNavigateTab('send-quick')}
          className="group flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-surface-container-high flex items-center justify-center text-purple-600 dark:text-purple-400 transition-transform group-hover:scale-105 active:scale-95 shadow-sm border border-slate-200/90 dark:border-white/10">
            <span className="material-symbols-outlined text-[26px]">touch_app</span>
          </div>
          <span className="text-[11px] text-slate-700 dark:text-on-surface font-semibold tracking-tight">
            {isEn ? 'QUICK SEND' : 'ENVÍO RÁPIDO'}
          </span>
        </button>

        {/* 4. BILL PAY */}
        <button
          type="button"
          onClick={() => onNavigateTab('bill-pay')}
          className="group flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-surface-container-high flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-105 active:scale-95 shadow-sm border border-slate-200/90 dark:border-white/10">
            <span className="material-symbols-outlined text-[26px]">receipt_long</span>
          </div>
          <span className="text-[11px] text-slate-700 dark:text-on-surface font-semibold tracking-tight">
            {isEn ? 'BILL PAY' : 'PAGO SERVICIOS'}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. MONITOR EN VIVO DEL TIPO DE CAMBIO (LIVE FX PULSE TRACKER)             */}
      {/* ========================================================================= */}
      <div className="rounded-3xl p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-50 dark:from-[#111A22] dark:via-[#0F1420] dark:to-[#141525] border border-emerald-500/20 dark:border-white/10 shadow-sm relative overflow-hidden">
        {/* Glow de fondo decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-[#A6ADC8]">
              {isEn ? 'Live Exchange Rate' : 'Tipo de Cambio en Vivo'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-[#2ED5A4] text-[10px] font-mono font-bold">
            Banxico SPEI • 24/7
          </span>
        </div>

        <div className="pt-2.5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-financial-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              1 USD = ${USD_TO_MXN_RATE.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-[#2ED5A4]">MXN</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 dark:text-[#2ED5A4] bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {isEn ? 'Audited Rate' : 'Tasa Oficial'}
          </span>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-[#8E91A5] font-medium mt-1 leading-snug">
          {isEn
            ? `Send $100 USD today and your family receives $${(100 * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN guaranteed.`
            : `Manda $100 USD hoy y tu familia recibe $${(100 * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN íntegros.`}
        </p>

        {/* Chips de cálculo y envío en 1 toque */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200/60 dark:border-white/5">
          {[50, 100, 200].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => onNavigateTab('send')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-center transition-all cursor-pointer group active:scale-95 shadow-2xs"
            >
              <span className="font-financial-mono text-[11px] font-bold text-slate-800 dark:text-white block group-hover:text-emerald-700 dark:group-hover:text-[#2ED5A4]">
                ${amt} USD
              </span>
              <span className="font-financial-mono text-[9px] text-slate-500 dark:text-[#8E91A5] block">
                ≈ ${(amt * USD_TO_MXN_RATE).toFixed(0)} MXN
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CÍRCULO FAMILIAR KIN (FAMILY CIRCLE DOCK — PROTAGONISTA AFECTIVO)      */}
      {/* ========================================================================= */}
      <section aria-label={isEn ? 'My Family Circle' : 'Mi Círculo Familiar'} className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-base">❤️</span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                {isEn ? 'My Family in Mexico' : 'Mi Familia en México'}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-[#8E91A5]">
                {isEn ? '1-Tap Instant SPEI Transfer' : 'Envío Inmediato SPEI en 1 Toque'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="text-xs font-bold text-emerald-600 dark:text-[#2ED5A4] hover:underline flex items-center gap-0.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
          >
            <span>+</span>
            <span>{isEn ? 'Add Member' : 'Agregar'}</span>
          </button>
        </div>

        {/* Carrusel Horizontal de Familiares */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 px-0.5">
          {displayFamilyContacts.map((contact, idx) => {
            const shortName = contact.name.split(' ')[0];
            const relation = contact.relation || (idx === 0 ? 'Mamá' : idx === 1 ? 'Hermano' : idx === 2 ? 'Tía' : 'Familiar');
            const bankName = contact.bank || 'SPEI';

            return (
              <button
                key={contact.id || idx}
                type="button"
                onClick={() => onNavigateTab('send-quick')}
                className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-[#181928] hover:bg-slate-50 dark:hover:bg-[#202236] border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-emerald-500/40 transition-all cursor-pointer group active:scale-95 shrink-0 min-w-[110px]"
              >
                {/* Avatar con silueta ergonómica Apple HIG */}
                <div className="relative mb-1.5">
                  <ContactAvatar
                    photoUrl={contact.photoUrl}
                    name={contact.name}
                    className="w-12 h-12 shadow-sm ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/50 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                    ⚡
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[95px] group-hover:text-emerald-600 dark:group-hover:text-[#2ED5A4] transition-colors">
                  {shortName}
                </span>

                <span className="text-[10px] text-slate-500 dark:text-[#8E91A5] font-medium truncate max-w-[95px]">
                  {relation}
                </span>

                <div className="mt-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-[9px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[95px]">
                  {bankName}
                </div>
              </button>
            );
          })}

          {/* Tarjeta de Agregar Nuevo Familiar */}
          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.07] border border-dashed border-slate-300 dark:border-white/20 transition-all cursor-pointer group active:scale-95 shrink-0 min-w-[100px] h-[134px]"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#2ED5A4] flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform mb-1.5">
              +
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center">
              {isEn ? 'Add' : 'Agregar'}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-[#8E91A5]">
              {isEn ? 'Recipient' : 'Familiar'}
            </span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CARRUSEL DINÁMICO DE BENEFICIOS Y SERVICIOS (BENTO BILLBOARD)          */}
      {/* ========================================================================= */}
      <section aria-label={isEn ? 'Featured Benefits' : 'Beneficios Destacados'} className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8E91A5]">
            {isEn ? 'Featured for You' : 'Destacados para Ti'}
          </span>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStoryIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  activeStoryIndex === idx
                    ? 'w-5 bg-emerald-600 dark:bg-[#2ED5A4]'
                    : 'bg-slate-300 dark:bg-white/20'
                }`}
                title={`Story ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Tarjeta Activa de Historia con Animación Suave */}
        <div
          className={`p-4 rounded-3xl bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/10 shadow-sm relative overflow-hidden bg-gradient-to-br ${currentStory.gradient} transition-all`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0 flex-1">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${currentStory.badgeClass}`}>
                {currentStory.badge}
              </span>

              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                {currentStory.title}
              </h3>

              <p className="text-[11px] text-slate-600 dark:text-[#A6ADC8] leading-relaxed">
                {currentStory.description}
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-600 dark:text-[#2ED5A4] shrink-0 border border-slate-200/60 dark:border-white/10 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">{currentStory.icon}</span>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={currentStory.action}
              className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-[#2ED5A4] dark:hover:bg-[#25B58B] text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <span>{currentStory.cta}</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>

            <span className="text-[10px] text-slate-400 dark:text-[#8E91A5] font-mono">
              KIN Global 2026
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ACTIVIDAD RECIENTE: EFECTO STACK DE NOTIFICACIONES APPLE ELEVADO       */}
      {/* ========================================================================= */}
      <section aria-label={isEn ? 'Recent Activity' : 'Actividad Reciente'} className="flex flex-col space-y-3 pt-1">
        {/* Cabecera con selector / toggle Stack */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              {isEn ? 'Recent Activity' : 'Actividad Reciente'}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1A1C2C] border border-slate-200/80 dark:border-white/10 text-[10px] font-bold text-slate-700 dark:text-[#8E91A5] flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-emerald-600 dark:text-[#2ED5A4]">layers</span>
              <span>{visibleTransactions.length}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsStackExpanded(!isStackExpanded)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-surface-container-high dark:hover:bg-surface-container-highest text-xs font-bold text-slate-800 dark:text-primary transition-all border border-slate-200/80 dark:border-white/10 active:scale-95 cursor-pointer shadow-2xs"
              title={isEn ? (isStackExpanded ? 'Group in stack' : 'Expand full list') : (isStackExpanded ? 'Agrupar en pila (Stack)' : 'Expandir lista completa')}
            >
              <span>{isEn ? (isStackExpanded ? 'Stack' : 'View List') : (isStackExpanded ? 'Pila (Stack)' : 'Ver Lista')}</span>
              <span className="material-symbols-outlined text-[16px] transition-transform duration-200" style={{ transform: isStackExpanded ? 'rotate(180deg)' : 'none' }}>
                expand_more
              </span>
            </button>
          </div>
        </div>

        {/* Sin transacciones */}
        {filteredDashboardTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-surface-container-low border border-dashed border-slate-200 dark:border-white/10 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-surface-container-high flex items-center justify-center text-emerald-600 dark:text-[#2ED5A4]">
              <span className="material-symbols-outlined text-[24px]">send</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isEn ? 'Ready for your first transfer?' : '¿Listo para tu primer envío?'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-on-surface-variant max-w-[240px] mx-auto mt-0.5">
                {isEn
                  ? 'Your SPEI transfers and bill payments will appear stacked here.'
                  : 'Tus transferencias SPEI y recibos pagados se apilarán aquí.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('send')}
              className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-[#2ED5A4] dark:hover:bg-[#25B58B] text-white dark:text-slate-950 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              {isEn ? 'Make First Transfer' : 'Hacer Mi Primer Envío'}
            </button>
          </div>
        ) : isStackExpanded ? (
          /* MODO LISTA EXPANDIDA */
          <div className="flex flex-col space-y-2 animate-fade-in">
            <div className="flex items-center justify-end gap-1 pb-1">
              {(['all', 'sent', 'bills'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setDashboardFilter(filter)}
                  className={`px-2.5 py-0.5 rounded-full font-label-caps text-[10px] font-bold transition-all cursor-pointer ${
                    dashboardFilter === filter
                      ? 'bg-emerald-600 dark:bg-[#2ED5A4] text-white dark:text-[#06070B] shadow-xs'
                      : 'bg-slate-100 dark:bg-surface-container-high text-slate-600 dark:text-[#8E91A5] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {filter === 'all' ? (isEn ? 'All' : 'Todos') : filter === 'sent' ? (isEn ? 'Sent' : 'Enviados') : (isEn ? 'Bills' : 'Servicios')}
                </button>
              ))}
            </div>

            {visibleTransactions.map((tx) =>
              renderTransactionRow(tx, setSelectedTransactionDetail, USD_TO_MXN_RATE, currencyPref)
            )}
          </div>
        ) : (
          /* MODO STACK NATIVO APPLE (TARJETAS APILADAS SUPERPUESTAS) */
          <div
            onClick={() => setIsStackExpanded(true)}
            className="relative cursor-pointer group pb-3 pt-1 select-none"
            title={isEn ? 'Tap to expand stacked notifications' : 'Toca para desplegar las notificaciones agrupadas en pila'}
          >
            {tertiaryTx && (
              <div
                className="absolute inset-x-6 top-5 h-14 rounded-2xl bg-slate-200/50 dark:bg-[#0E0F1A] border border-slate-200/60 dark:border-white/5 opacity-40 shadow-xs pointer-events-none transition-all duration-300 group-hover:top-6"
                style={{ transform: 'scale(0.92)' }}
              />
            )}

            {secondaryTx && (
              <div
                className="absolute inset-x-3 top-2.5 h-16 rounded-2xl bg-slate-100 dark:bg-[#141525] border border-slate-200/80 dark:border-white/10 opacity-70 shadow-sm pointer-events-none transition-all duration-300 group-hover:top-3.5"
                style={{ transform: 'scale(0.96)' }}
              />
            )}

            {primaryTx && (
              <div className="relative z-10 rounded-2xl bg-white dark:bg-[#181928] border border-slate-200/80 dark:border-white/15 p-3.5 shadow-md transition-all duration-300 group-hover:border-emerald-500/40 group-active:scale-[0.99]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`relative w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs shrink-0 ${
                        primaryTx.iconType === 'bank'
                          ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
                          : primaryTx.iconType === 'wallet'
                          ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-primary border border-emerald-100 dark:border-emerald-500/20'
                          : primaryTx.iconType === 'luz'
                          ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'
                          : 'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-secondary border border-purple-100 dark:border-purple-500/20'
                      }`}
                    >
                      {primaryTx.iconType === 'luz' ? (
                        <span className="material-symbols-outlined text-[22px]">electric_meter</span>
                      ) : primaryTx.iconType === 'wallet' ? (
                        <span className="material-symbols-outlined text-[22px]">bolt</span>
                      ) : primaryTx.iconType === 'bank' ? (
                        <span className="material-symbols-outlined text-[22px]">account_balance</span>
                      ) : (
                        <span className="material-symbols-outlined text-[22px]">outgoing_mail</span>
                      )}
                      {getBankLogoUrl(primaryTx.title) && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded bg-white flex items-center justify-center shadow-xs p-0.5">
                          <img src={getBankLogoUrl(primaryTx.title)!} alt="Bank" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {primaryTx.title}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-[#2ED5A4] text-[9px] font-black tracking-wider uppercase">
                          {isEn ? 'NEW' : 'Nuevo'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-on-surface-variant truncate">
                        {primaryTx.category} • {primaryTx.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    <div className="flex flex-col items-end">
                      {currencyPref === 'MXN' ? (
                        <>
                          <span className="font-financial-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {primaryTx.type === 'income'
                              ? `+$${(primaryTx.amountMXN || Math.abs(primaryTx.amount) * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`
                              : `-$${(primaryTx.amountMXN || Math.abs(primaryTx.amount) * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-primary">
                            ≈ ${Math.abs(primaryTx.amount).toFixed(2)} USD
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-financial-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {primaryTx.type === 'income'
                              ? `+$${Math.abs(primaryTx.amount).toFixed(2)}`
                              : `-$${Math.abs(primaryTx.amount).toFixed(2)}`}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-primary">
                            ${(primaryTx.amountMXN || Math.abs(primaryTx.amount) * USD_TO_MXN_RATE).toLocaleString('es-MX', {
                              minimumFractionDigits: 2,
                            })}{' '}
                            MXN ✓
                          </span>
                        </>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-on-surface-variant">
                      layers
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8E91A5]">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-[#2ED5A4] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#2ED5A4]" />
                    {visibleTransactions.length > 1
                      ? (isEn ? `+${visibleTransactions.length - 1} movements stacked below` : `+${visibleTransactions.length - 1} movimientos apilados debajo`)
                      : (isEn ? 'Latest recorded transaction' : 'Último movimiento registrado')}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-primary font-bold flex items-center gap-0.5">
                    <span>{isEn ? 'Tap to expand' : 'Toca para expandir'}</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/**
 * Renderizador de fila de transacción individual
 */
function renderTransactionRow(
  tx: HomeTransaction,
  onSelect: (tx: HomeTransaction) => void,
  rate: number,
  currencyPref: 'USD' | 'MXN' = 'USD'
) {
  const isIncome = tx.type === 'income';
  const bankLogo = getBankLogoUrl(tx.title) || getBankLogoUrl(tx.category);

  return (
    <button
      key={tx.id}
      type="button"
      onClick={() => onSelect(tx)}
      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#181928] hover:bg-slate-50 dark:hover:bg-surface-container transition-all shadow-xs border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/40 cursor-pointer text-left group active:scale-[0.99]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`relative w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs shrink-0 ${
            tx.iconType === 'bank'
              ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
              : tx.iconType === 'wallet'
              ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-primary border border-emerald-100 dark:border-emerald-500/20'
              : tx.iconType === 'luz'
              ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'
              : 'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-secondary border border-purple-100 dark:border-purple-500/20'
          }`}
        >
          {tx.iconType === 'luz' ? (
            <span className="material-symbols-outlined text-[22px]">electric_meter</span>
          ) : tx.iconType === 'wallet' ? (
            <span className="material-symbols-outlined text-[22px]">bolt</span>
          ) : tx.iconType === 'bank' ? (
            <span className="material-symbols-outlined text-[22px]">account_balance</span>
          ) : (
            <span className="material-symbols-outlined text-[22px]">outgoing_mail</span>
          )}
          {bankLogo && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded bg-white flex items-center justify-center shadow-xs p-0.5">
              <img src={bankLogo} alt="Bank" className="w-full h-full object-contain" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {tx.title}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-on-surface-variant truncate">
            {tx.category} • {tx.time}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 pl-2">
        {currencyPref === 'MXN' ? (
          <>
            <span className="font-financial-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {isIncome
                ? `+$${(tx.amountMXN || Math.abs(tx.amount) * rate).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`
                : `-$${(tx.amountMXN || Math.abs(tx.amount) * rate).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-primary">
              ≈ ${Math.abs(tx.amount).toFixed(2)} USD
            </span>
          </>
        ) : (
          <>
            <span className="font-financial-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {isIncome ? `+$${Math.abs(tx.amount).toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-primary">
              ${(tx.amountMXN || Math.abs(tx.amount) * rate).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
          </>
        )}
      </div>
    </button>
  );
}
