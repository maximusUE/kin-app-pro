'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, getBankLogoUrl } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { ContactAvatar } from '@/components/ContactAvatar';

export interface SendQuickContactItem {
  id: string;
  name: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  bank?: string;
  photoUrl?: string;
  avatar?: string;
  clabe?: string;
  phone?: string;
  relation?: string;
  role?: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  zipCode?: string;
  transferCount?: number;
  lastSentDate?: string;
  lastAmountUSD?: number;
  isFrequent?: boolean;
  isRecent?: boolean;
  isFamily?: boolean;
  [key: string]: any;
}

// Destinatarios predeterminados de alta frecuencia y verificación SPEI Banxico
export const DEFAULT_FREQUENT_RECIPIENTS: SendQuickContactItem[] = [
  {
    id: 'recip-01',
    name: 'María González',
    fullName: 'María Elena González Ugalde',
    firstName: 'María Elena',
    lastName: 'González Ugalde',
    relation: 'Mamá',
    role: 'Mamá • Familiar Directo',
    bank: 'BBVA Bancomer',
    clabe: '012180004567891234',
    phone: '+52 (33) 1234-5678',
    country: 'Mexico',
    state: 'Jalisco',
    city: 'Guadalajara',
    street: 'Av. Vallarta',
    houseNumber: '1420',
    zipCode: '44100',
    transferCount: 6,
    lastSentDate: 'Ayer',
    lastAmountUSD: 50,
    isFrequent: true,
    isRecent: true,
    isFamily: true,
    avatar: '',
  },
  {
    id: 'recip-02',
    name: 'Carlos Mendoza',
    fullName: 'Carlos Mendoza Ugalde',
    firstName: 'Carlos',
    lastName: 'Mendoza Ugalde',
    relation: 'Hermano',
    role: 'Hermano • Familiar Directo',
    bank: 'Banco Azteca',
    clabe: '127180001234567890',
    phone: '+52 (55) 9876-5432',
    country: 'Mexico',
    state: 'Ciudad de México',
    city: 'CDMX',
    street: 'Calzada de Tlalpan',
    houseNumber: '890',
    zipCode: '03300',
    transferCount: 4,
    lastSentDate: 'Hace 3 días',
    lastAmountUSD: 100,
    isFrequent: true,
    isRecent: true,
    isFamily: true,
    avatar: '',
  },
  {
    id: 'recip-03',
    name: 'Rosa Sánchez',
    fullName: 'Rosa Isela Sánchez',
    firstName: 'Rosa Isela',
    lastName: 'Sánchez',
    relation: 'Tía',
    role: 'Tía • Apoyo Familiar',
    bank: 'Banorte',
    clabe: '072180003456789012',
    phone: '+52 (81) 2345-6789',
    country: 'Mexico',
    state: 'Nuevo León',
    city: 'Monterrey',
    street: 'Av. Constitución',
    houseNumber: '405',
    zipCode: '64000',
    transferCount: 3,
    lastSentDate: 'Hace 1 semana',
    lastAmountUSD: 50,
    isFrequent: true,
    isRecent: true,
    isFamily: true,
    avatar: '',
  },
  {
    id: 'recip-04',
    name: 'Alejandro Torres',
    fullName: 'Alejandro Torres Ugalde',
    firstName: 'Alejandro',
    lastName: 'Torres Ugalde',
    relation: 'Primo',
    role: 'Primo • Emergencias SPEI',
    bank: 'Citibanamex',
    clabe: '002180005678901234',
    phone: '+52 (477) 123-4567',
    country: 'Mexico',
    state: 'Guanajuato',
    city: 'León',
    street: 'Blvd. Adolfo López Mateos',
    houseNumber: '210',
    zipCode: '37000',
    transferCount: 2,
    lastSentDate: 'Hace 2 semanas',
    lastAmountUSD: 25,
    isFrequent: false,
    isRecent: true,
    isFamily: true,
    avatar: '',
  },
];

export interface SendQuickViewProps {
  onBack: () => void;
  contactsList: SendQuickContactItem[];
  sendQuickSelectedRecipient: number;
  setSendQuickSelectedRecipient: (idx: number) => void;
  onAddContact: () => void;
  sendQuickAmount: string;
  setSendQuickAmount: (val: string) => void;
  USD_TO_MXN_RATE: number;
  netBalance: number;
  onSendQuick: () => void;
  language: 'es' | 'en';
  currencyPref: 'USD' | 'MXN';
  transactions?: any[];
  onSelectRecipient?: (contact: SendQuickContactItem) => void;
}

export function SendQuickView({
  onBack,
  contactsList,
  sendQuickSelectedRecipient,
  setSendQuickSelectedRecipient,
  onAddContact,
  sendQuickAmount,
  setSendQuickAmount,
  USD_TO_MXN_RATE,
  netBalance,
  onSendQuick,
  language,
  currencyPref,
  transactions = [],
  onSelectRecipient,
}: SendQuickViewProps) {
  const isEn = language === 'en';

  // Filtro de pestañas: Frecuentes | Recientes | Todos
  const [filterTab, setFilterTab] = useState<'frequent' | 'recent' | 'all'>('frequent');

  // 1. Unificar y extraer destinatarios de transacciones previas y lista de contactos
  const allAvailableRecipients: SendQuickContactItem[] = useMemo(() => {
    const map = new Map<string, SendQuickContactItem>();

    // A) Destinatarios de contactos guardados
    if (contactsList && contactsList.length > 0) {
      contactsList.forEach((c) => {
        if (!c || !c.name) return;
        const key = (c.phone ? c.phone.replace(/\D/g, '') : '') || c.name.toLowerCase().trim();
        map.set(key, {
          ...c,
          isFrequent: c.transferCount ? c.transferCount > 2 : true,
          isRecent: !!c.lastSentDate || true,
        });
      });
    }

    // B) Destinatarios extraídos de transacciones de envío recientes
    if (transactions && transactions.length > 0) {
      transactions.forEach((tx: any) => {
        const recipName = tx.nombreBeneficiario || tx.recipientName;
        if (!recipName || recipName === 'César Urrutia') return;
        const key = (tx.recipientPhone ? tx.recipientPhone.replace(/\D/g, '') : '') || recipName.toLowerCase().trim();
        if (map.has(key)) {
          const existing = map.get(key)!;
          existing.transferCount = (existing.transferCount || 1) + 1;
          existing.lastSentDate = tx.time || 'Reciente';
          existing.lastAmountUSD = Math.abs(tx.amount) || existing.lastAmountUSD;
          existing.isRecent = true;
        } else {
          map.set(key, {
            id: tx.id || `tx-${Date.now()}`,
            name: recipName.split(' ')[0],
            fullName: recipName,
            bank: tx.bancoDestino || 'BBVA Bancomer',
            clabe: tx.cuentaBeneficiario || '012180••••••••1234',
            phone: tx.recipientPhone || '+52 55 1234 5678',
            country: 'Mexico',
            state: tx.pickupState || 'Jalisco',
            city: tx.pickupCity || 'Guadalajara',
            transferCount: 1,
            lastSentDate: tx.time || 'Reciente',
            lastAmountUSD: Math.abs(tx.amount) || 50,
            isRecent: true,
            isFrequent: false,
            avatar: tx.recipientAvatar || '',
            photoUrl: tx.recipientPhotoUrl || '',
          });
        }
      });
    }

    // C) Si aún no hay contactos, asegurar los destinatarios frecuentes de confianza
    if (map.size === 0) {
      DEFAULT_FREQUENT_RECIPIENTS.forEach((item) => {
        const key = item.phone?.replace(/\D/g, '') || item.name.toLowerCase().trim();
        map.set(key, item);
      });
    }

    return Array.from(map.values());
  }, [contactsList, transactions]);

  // 2. Filtrar según la pestaña activa
  const displayedRecipients: SendQuickContactItem[] = useMemo(() => {
    if (filterTab === 'frequent') {
      const list = allAvailableRecipients.filter((r) => r.isFrequent || (r.transferCount && r.transferCount > 1));
      return list.length > 0 ? list : allAvailableRecipients;
    }
    if (filterTab === 'recent') {
      const list = allAvailableRecipients.filter((r) => r.isRecent || r.lastSentDate);
      return list.length > 0 ? list : allAvailableRecipients;
    }
    return allAvailableRecipients;
  }, [allAvailableRecipients, filterTab]);

  // Destinatario activo seleccionado
  const activeRecipientIndex = Math.min(
    Math.max(0, sendQuickSelectedRecipient),
    Math.max(0, displayedRecipients.length - 1)
  );
  const currentRecipient: SendQuickContactItem =
    displayedRecipients[activeRecipientIndex] || displayedRecipients[0] || DEFAULT_FREQUENT_RECIPIENTS[0];

  const handleSelectIndex = (idx: number) => {
    setSendQuickSelectedRecipient(idx);
    if (onSelectRecipient && displayedRecipients[idx]) {
      onSelectRecipient(displayedRecipients[idx]);
    }
  };

  return (
    <div className="animate-fade-in space-y-4 pb-28">
      {/* Native Mobile Header: < | KinLogo | Send Quick | Info */}
      <header className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="btn-circle"
            title={isEn ? 'Back to home' : 'Volver a Home'}
          >
            <ChevronLeftIcon className="w-5 h-5 text-white" />
          </button>
          <KinLogo size={34} />
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm font-bold text-white tracking-wide">
              {isEn ? 'Send Quick' : 'Envío Rápido'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[#2ED5A4] text-[10px] font-black tracking-wider">
              ⚡ 1-TAP
            </span>
          </div>
          <span className="text-[10px] text-[#8E91A5] block">
            {isEn ? 'Ultra-fast SPEI transfer with zero unnecessary steps' : 'Envío SPEI ultrarrápido sin pasos innecesarios'}
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            alert(
              isEn
                ? 'Send Quick gives instant 1-tap access to your most frequent and recent recipients with real-time Banxico SPEI delivery.'
                : 'Send Quick te da acceso instantáneo en 1 toque a tus remitentes y destinatarios más frecuentes y recientes con acreditación inmediata Banxico SPEI.'
            )
          }
          className="btn-circle"
          title={isEn ? 'Information' : 'Información'}
        >
          <span className="text-xs font-bold text-white">ℹ️</span>
        </button>
      </header>

      {/* 1. SECCIÓN DE REMITENTES / DESTINATARIOS FRECUENTES Y RECIENTES */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3.5 shadow-lg">
        {/* Cabecera con selector de Filtros: Frecuentes | Recientes | Todos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#8E91A5] uppercase tracking-wider">
              {isEn ? 'Frequent & Recent Recipients' : 'Destinatarios y Remitentes'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/10 text-[#2ED5A4] text-[9px] font-extrabold border border-[#2ED5A4]/25">
              {displayedRecipients.length}
            </span>
          </div>
          <span className="text-[10px] text-[#2ED5A4] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
            {isEn ? 'SPEI Active' : 'SPEI Activo'}
          </span>
        </div>

        {/* Pestañas ergonómicas de acceso rápido */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#0E0F1A] border border-white/5">
          <button
            type="button"
            onClick={() => setFilterTab('frequent')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              filterTab === 'frequent'
                ? 'bg-[#2ED5A4] text-slate-950 shadow-sm font-black'
                : 'text-[#8E91A5] hover:text-white'
            }`}
          >
            <span>⭐</span>
            <span>{isEn ? 'Frequent' : 'Frecuentes'}</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('recent')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              filterTab === 'recent'
                ? 'bg-[#2ED5A4] text-slate-950 shadow-sm font-black'
                : 'text-[#8E91A5] hover:text-white'
            }`}
          >
            <span>🕒</span>
            <span>{isEn ? 'Recent' : 'Recientes'}</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              filterTab === 'all'
                ? 'bg-[#2ED5A4] text-slate-950 shadow-sm font-black'
                : 'text-[#8E91A5] hover:text-white'
            }`}
          >
            <span>👥</span>
            <span>{isEn ? 'All' : 'Todos'}</span>
          </button>
        </div>

        {/* Carrusel Horizontal Ergonómico de Selección Rápida */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
          {displayedRecipients.map((c, idx) => {
            const isSelected = activeRecipientIndex === idx;
            const bankLogo = getBankLogoUrl(c.bank);
            return (
              <button
                key={c.id || `recip-${idx}`}
                type="button"
                onClick={() => handleSelectIndex(idx)}
                className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2ED5A4]/15 border-[#2ED5A4] text-white shadow-md shadow-[#2ED5A4]/15 scale-[1.02]'
                    : 'bg-[#202236] border-white/5 text-[#8E91A5] hover:text-white hover:border-white/15'
                }`}
                style={{ minWidth: '82px' }}
              >
                {/* Avatar con mini-badge del banco */}
                <div className="relative">
                  <ContactAvatar
                    photoUrl={c.photoUrl}
                    name={c.name}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      isSelected ? 'border-[#2ED5A4]' : 'border-white/10'
                    }`}
                    iconSize="text-[26px]"
                  />
                  {/* Badge del banco */}
                  {bankLogo && (
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden shadow-sm border border-black/10">
                      <img src={bankLogo} alt={c.bank} className="w-full h-full object-contain" />
                    </div>
                  )}
                  {/* Checkmark verde si está seleccionado */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2ED5A4] flex items-center justify-center text-slate-950 text-[10px] font-black shadow-sm">
                      ✓
                    </div>
                  )}
                </div>

                {/* Nombre */}
                <span className="text-xs font-bold truncate max-w-[76px] text-center">
                  {c.name.split(' ')[0]}
                </span>

                {/* Frecuencia o Badge sutil */}
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/5 text-[#8E91A5] font-semibold truncate max-w-[76px]">
                  {c.transferCount ? `${c.transferCount} ${isEn ? 'sends' : 'envíos'}` : c.lastSentDate || (isEn ? 'Verified' : 'Verificado')}
                </span>
              </button>
            );
          })}

          {/* Botón para registrar o importar nuevo remitente/destinatario */}
          <button
            type="button"
            onClick={onAddContact}
            className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border border-dashed border-white/15 text-[#8E91A5] hover:text-white hover:border-[#2ED5A4]/40 transition-all flex-shrink-0 cursor-pointer"
            style={{ minWidth: '82px', height: '94px' }}
          >
            <div className="w-10 h-10 rounded-full bg-[#202236] flex items-center justify-center text-[#2ED5A4] border border-white/5">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <span className="text-[10px] font-bold">{isEn ? '+ New' : '+ Nuevo'}</span>
          </button>
        </div>

        {/* Tarjeta de Detalle del Destinatario Seleccionado (Stitch Obsidian 2026) */}
        {currentRecipient && (
          <div className="p-3.5 rounded-2xl bg-[#0E0F1A] border border-white/10 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2ED5A4]/20 to-[#202236] border border-[#2ED5A4]/30 flex items-center justify-center font-black text-sm text-[#2ED5A4] flex-shrink-0 shadow-sm">
                {currentRecipient.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-white truncate">
                    {currentRecipient.fullName || currentRecipient.name}
                  </p>
                  {currentRecipient.relation && (
                    <span className="px-1.5 py-0.2 rounded-md bg-[#2ED5A4]/15 text-[#2ED5A4] text-[9px] font-extrabold shrink-0">
                      {currentRecipient.relation}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {getBankLogoUrl(currentRecipient.bank) && (
                    <div className="w-3.5 h-3.5 rounded bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                      <img
                        src={getBankLogoUrl(currentRecipient.bank)!}
                        alt={currentRecipient.bank}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <p className="text-[10px] text-white/80 truncate">
                    {currentRecipient.bank || 'SPEI Banxico'} • {currentRecipient.clabe ? `CLABE •••• ${currentRecipient.clabe.slice(-4)}` : (isEn ? 'Verified Account' : 'Cuenta Verificada')}
                  </p>
                </div>
                {currentRecipient.phone && (
                  <p className="text-[9px] text-[#8E91A5] truncate mt-0.5">
                    📱 {currentRecipient.phone} • {currentRecipient.state ? `${currentRecipient.state}, MX` : 'México'}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onAddContact}
              className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-[10px] font-bold border border-white/10 flex-shrink-0 active:scale-95 transition-all cursor-pointer"
            >
              {isEn ? 'Directory' : 'Agenda'}
            </button>
          </div>
        )}
      </div>

      {/* 2. Hero Amount Card (Gran Tipografía Móvil & Chips) */}
      <div className="p-5 rounded-3xl bg-[#181928] border border-white/5 space-y-4 shadow-lg text-center">
        <span className="text-[11px] font-bold text-[#8E91A5] uppercase tracking-wider block">
          {isEn ? 'Quick Send Amount' : 'Monto del Envío Rápido'}
        </span>

        {/* Display Gigante del Monto (Acceso directo al teclado numérico nativo del celular) */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-1.5 relative">
            <span className="text-3xl sm:text-4xl font-black text-[#2ED5A4] select-none">$</span>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={sendQuickAmount === '0' || !sendQuickAmount ? '' : sendQuickAmount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                const parts = val.split('.');
                if (parts.length > 2) return;
                if (parts[1] && parts[1].length > 2) return;
                setSendQuickAmount(val === '' ? '0' : val);
              }}
              className="text-4xl sm:text-5xl font-black text-white bg-transparent text-center focus:outline-none min-w-[120px] max-w-[220px] tracking-tight border-b-2 border-[#2ED5A4]/40 focus:border-[#2ED5A4] transition-all py-1 font-financial-mono cursor-text"
              placeholder="0"
            />
            <span className="text-sm font-bold text-[#2ED5A4] tracking-wide shrink-0">USD</span>
            {sendQuickAmount !== '0' && sendQuickAmount !== '' && (
              <button
                type="button"
                onClick={() => setSendQuickAmount('0')}
                className="ml-1 text-on-surface-variant hover:text-white text-xs px-2.5 py-1.5 rounded-full bg-surface-container-high border border-white/10 shrink-0 cursor-pointer active:scale-95 transition-all"
                title={isEn ? 'Clear to zero' : 'Borrar a cero'}
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#8E91A5] font-medium text-center mt-1">
            {isEn ? 'Tap the amount to type with your phone keyboard' : 'Toca la cantidad para escribir con el teclado de tu teléfono'}
          </p>
        </div>

        {/* Conversión en Vivo con Tasa SPEI */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#202236] border border-white/5 text-center">
          <span className="text-xs font-bold text-white">
            ≈ ${((parseFloat(sendQuickAmount) || 0) * USD_TO_MXN_RATE).toLocaleString('es-MX', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            MXN
          </span>
          <span className="text-[10px] text-white/60">|</span>
          <span className="text-[10px] text-[#2ED5A4] font-semibold">1 USD = ${USD_TO_MXN_RATE.toFixed(2)} MXN</span>
        </div>

        {/* 4 Chips de Monto Ergonómicos - Regla Don César: Estilo Píldora Bandera USA */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {['25', '50', '100', '200'].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setSendQuickAmount(val)}
              className={`h-11 rounded-full text-xs font-bold font-financial-mono transition-all cursor-pointer flex items-center justify-center active:scale-95 border ${
                sendQuickAmount === val
                  ? 'bg-primary text-slate-950 font-black border-primary shadow-sm scale-105'
                  : 'bg-surface-container border-white/10 text-white hover:bg-surface-bright shadow-xs'
              }`}
            >
              ${val}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Beneficios SPEI / Fuente de Fondos */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-[#8E91A5]">
          <span>{isEn ? 'Funding source:' : 'Origen de fondos:'}</span>
          <span className="font-bold text-white flex items-center gap-1">
            <span>🟢</span> KIN Digital Wallet (${netBalance.toFixed(2)} USD)
          </span>
        </div>
        <div className="flex items-center justify-between text-[#8E91A5]">
          <span>{isEn ? 'Transfer fee:' : 'Comisión de transferencia:'}</span>
          <span className="font-bold text-[#2ED5A4]">{isEn ? 'FREE ($0.00 USD)' : 'GRATIS ($0.00 USD)'}</span>
        </div>
        <div className="flex items-center justify-between text-[#8E91A5]">
          <span>{isEn ? 'Estimated delivery time:' : 'Tiempo de acreditación:'}</span>
          <span className="font-bold text-white">{isEn ? '⚡ Less than 30 seconds' : '⚡ Menos de 30 segundos'}</span>
        </div>
      </div>

      {/* FLOATING ACTION CTA: SEND QUICK (STITCH MINT GRADIENT CTA) */}
      <div className="send-floating-cta-container">
        <button
          type="button"
          onClick={onSendQuick}
          className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#18A57E] text-white px-5 shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer font-bold border border-white/10"
        >
          <span className="text-sm font-bold tracking-wide flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>
              {currentRecipient
                ? `${isEn ? 'Send to' : 'Enviar a'} ${currentRecipient.name.split(' ')[0]}`
                : isEn
                  ? 'Add Recipient'
                  : 'Agregar Destinatario'}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <span className="h-9 px-3.5 rounded-full bg-[#003828] text-primary text-xs font-financial-mono font-bold flex items-center justify-center gap-1.5 shadow-sm">
              <span>
                {currencyPref === 'USD'
                  ? `$${(parseFloat(sendQuickAmount) || 50).toFixed(2)} USD`
                  : `$${((parseFloat(sendQuickAmount) || 50) * USD_TO_MXN_RATE).toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} MXN`}
              </span>
              <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
