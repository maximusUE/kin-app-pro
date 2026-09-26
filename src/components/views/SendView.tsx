'use client';

import React from 'react';
import {
  ChevronLeftIcon,
  DockAnalyticsIcon,
  getBankLogoUrl,
  OxxoLogo,
  BodegaAurreraLogo,
  WalmartLogo,
  ElektraLogo,
  BancoppelLogo,
  BancoAztecaLogo,
  BbvaBancomerLogo,
  BanorteLogo,
  BanamexLogo,
  SorianaLogo,
  FarmaciasGuadalajaraLogo,
  BansefiLogo,
  AnyAgentLogo,
} from '@/components/Icons';
import { ContactAvatar } from '@/components/ContactAvatar';

export const CASH_PICKUP_STORES = [
  {
    id: 'oxxo',
    name: 'OXXO',
    subtitle: 'Más de 21,000 tiendas 24/7 en todo México',
    badge: 'Popular 24/7',
    Logo: OxxoLogo,
  },
  {
    id: 'aurrera',
    name: 'Bodega Aurrera',
    subtitle: 'Más de 2,400 sucursales en México',
    badge: 'Sin comisión',
    Logo: BodegaAurreraLogo,
  },
  {
    id: 'walmart',
    name: 'Walmart',
    subtitle: 'Supercenter y Walmart Express en México',
    badge: 'Nacional',
    Logo: WalmartLogo,
  },
  {
    id: 'elektra',
    name: 'Elektra',
    subtitle: 'Tiendas Elektra en todo el país',
    badge: 'Inmediato',
    Logo: ElektraLogo,
  },
  {
    id: 'bancoppel',
    name: 'BanCoppel',
    subtitle: 'En tiendas Coppel y sucursales bancarias',
    badge: 'Horario extendido',
    Logo: BancoppelLogo,
  },
  {
    id: 'azteca',
    name: 'Banco Azteca',
    subtitle: 'Abierto los 365 días de 9am a 9pm',
    badge: '365 días',
    Logo: BancoAztecaLogo,
  },
  {
    id: 'bbva',
    name: 'BBVA México',
    subtitle: 'Cajeros y ventanillas BBVA en todo el país',
    badge: 'Líder SPEI',
    Logo: BbvaBancomerLogo,
  },
  {
    id: 'banorte',
    name: 'Banorte',
    subtitle: 'Red nacional de sucursales Banorte',
    badge: 'Cobertura',
    Logo: BanorteLogo,
  },
  {
    id: 'banamex',
    name: 'Citibanamex',
    subtitle: 'Sucursales Citi en todo México',
    badge: 'Red Tradicional',
    Logo: BanamexLogo,
  },
  {
    id: 'soriana',
    name: 'Soriana',
    subtitle: 'Hiper, Súper y City Club en México',
    badge: 'Cajas Soriana',
    Logo: SorianaLogo,
  },
  {
    id: 'guadalajara',
    name: 'Farmacias Guadalajara',
    subtitle: 'Más de 2,500 sucursales con farmacia y súper',
    badge: '24 Horas',
    Logo: FarmaciasGuadalajaraLogo,
  },
  {
    id: 'bienestar',
    name: 'Banco del Bienestar / Telecomm',
    subtitle: 'Presencia en zonas rurales y cabeceras municipales',
    badge: 'Comunidades',
    Logo: BansefiLogo,
  },
  {
    id: 'any',
    name: 'Cualquier Sucursal / Agente Autorizado',
    subtitle: 'El familiar cobra en cualquier punto con su clave y documento',
    badge: 'Red Completa 40k+',
    Logo: AnyAgentLogo,
  },
];

export interface SendContactItem {
  id: string;
  name: string;
  fullName?: string;
  avatar?: string;
  role?: string;
  country?: string;
  bank?: string;
  photoUrl?: string;
  clabe?: string;
  phone?: string;
  [key: string]: any;
}

export interface SendViewProps {
  onBack: () => void;
  onViewHistory: () => void;
  amountValue: string;
  setAmountValue: React.Dispatch<React.SetStateAction<string>>;
  USD_TO_MXN_RATE: number;
  language: 'es' | 'en';
  deliveryMethod: 'bank' | 'cash' | 'wallet';
  setDeliveryMethod: (method: 'bank' | 'cash' | 'wallet') => void;
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  selectedAvatar: SendContactItem | null;
  onSelectAvatarClick: () => void;
  handleClearSendDraft: () => void;
  handleStartSendReview: () => void;
}

export function SendView({
  onBack,
  onViewHistory,
  amountValue,
  setAmountValue,
  USD_TO_MXN_RATE,
  language,
  deliveryMethod,
  setDeliveryMethod,
  selectedStore,
  setSelectedStore,
  selectedAvatar,
  onSelectAvatarClick,
  handleClearSendDraft,
  handleStartSendReview,
}: SendViewProps) {
  return (
    <div className="animate-fade-in space-y-4">
      {/* Header: < | Send money | Historial */}
      <header className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onBack}
          className="btn-circle"
          title="Volver al inicio"
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-black text-white tracking-wide">Send money</h1>
          <span className="text-[10px] font-semibold text-[#2ED5A4] flex items-center justify-center gap-1">
            <span>USA</span>
            <span>⇄</span>
            <span>México</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onViewHistory}
          className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-xs font-bold text-[#8E91A5] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Ver historial de envíos"
        >
          <DockAnalyticsIcon className="w-3.5 h-3.5" />
          <span>Historial</span>
        </button>
      </header>

      {/* Corridor Routing & Lock Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container border border-white/10 p-3.5 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center -space-x-1.5 shrink-0">
              <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs shadow-sm">🇺🇸</span>
              <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs shadow-sm">🇲🇽</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-title-base text-xs text-white font-bold truncate">USA ➔ México</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] font-label-caps text-[9px] uppercase font-bold border border-[#2ED5A4]/30">SPEI</span>
              </div>
              <span className="font-caption-sm text-[10px] text-on-surface-variant">Instant Direct Remittance</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest border border-white/10 shrink-0">
            <span className="material-symbols-outlined text-[#2ED5A4] text-[13px] animate-spin" style={{ animationDuration: '6s' }}>timer</span>
            <span className="font-financial-mono text-xs text-[#2ED5A4] font-bold">14:59</span>
          </div>
        </div>
      </div>

      {/* STITCH DUAL LIVE EXCHANGE CALCULATOR */}
      <div className="relative flex flex-col space-y-2">
        {/* You Send Card */}
        <div className="rounded-2xl bg-surface-container-high p-4 shadow-md flex flex-col space-y-3 border border-white/5">
          <div className="flex items-center justify-between">
            <label className="font-caption-sm text-xs uppercase text-on-surface-variant font-semibold" htmlFor="send-amount-input">
              You Send
            </label>
            <span className="font-caption-sm text-xs text-primary flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[13px]">check_circle</span> No markup rate
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0 flex-1 relative">
              <span className="font-financial-mono text-3xl text-primary font-bold tracking-tight select-none">$</span>
              <input
                aria-label="Send amount in USD"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                className="w-full bg-transparent font-financial-mono text-3xl text-on-surface font-bold focus:outline-none placeholder:text-outline/40 border-b border-primary/30 focus:border-primary transition-colors py-1 cursor-text"
                id="send-amount-input"
                placeholder="0"
                value={amountValue === '0' || !amountValue ? '' : amountValue}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  const parts = val.split('.');
                  if (parts.length > 2) return;
                  if (parts[1] && parts[1].length > 2) return;
                  setAmountValue(val === '' ? '0' : val);
                }}
              />
              {amountValue !== '0' && amountValue !== '' && (
                <button
                  type="button"
                  onClick={() => setAmountValue('0')}
                  className="text-on-surface-variant hover:text-white text-xs px-2 py-1 rounded-full bg-surface-container-highest border border-white/10 shrink-0 cursor-pointer active:scale-95"
                  title="Borrar a cero"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container shrink-0 shadow-inner border border-white/5">
              <span className="text-base">🇺🇸</span>
              <span className="font-title-base text-xs text-on-surface font-bold">USD</span>
            </div>
          </div>
          <p className="text-[11px] text-[#8E91A5] font-medium pt-0.5">
            Toca la cantidad para escribir con el teclado de tu teléfono
          </p>
          {/* Quick Amount Increment Pills */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none">
            <button
              className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright cursor-pointer border border-white/5"
              onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 50).toFixed(0))}
              type="button"
            >
              +$50
            </button>
            <button
              className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright cursor-pointer border border-white/5"
              onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 100).toFixed(0))}
              type="button"
            >
              +$100
            </button>
            <button
              className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright cursor-pointer border border-white/5"
              onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 200).toFixed(0))}
              type="button"
            >
              +$200
            </button>
            <button
              className="px-2.5 py-1 rounded-lg bg-surface-container text-primary font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright font-bold cursor-pointer border border-primary/20"
              onClick={() => setAmountValue('500')}
              type="button"
            >
              $500 Max
            </button>
          </div>
        </div>

        {/* Animated Swap / Ticker Node */}
        <div className="relative z-10 flex items-center justify-center -my-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1F2133] shadow-lg border border-white/10">
            <span className="material-symbols-outlined text-primary text-[15px]">swap_vert</span>
            <span className="font-financial-mono text-xs text-on-surface">
              1 USD = <span className="text-primary font-bold">{USD_TO_MXN_RATE.toFixed(2)} MXN</span>
            </span>
            <span className="text-on-surface-variant font-caption-sm">•</span>
            <span className="font-label-caps text-[10px] text-primary font-bold uppercase tracking-wider">$0 Fee</span>
          </div>
        </div>

        {/* Receiver Gets Card */}
        <div className="rounded-2xl bg-surface-container p-4 shadow-md flex flex-col space-y-2 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="font-caption-sm text-xs uppercase text-on-surface-variant font-semibold">
              Receiver Gets (Guaranteed)
            </span>
            <span className="font-caption-sm text-xs text-on-surface-variant font-medium">Instant pickup</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline min-w-0 flex-1 overflow-hidden">
              <span className="font-financial-mono text-2xl text-primary font-bold tracking-tight">$</span>
              <span className="font-financial-mono text-2xl text-primary font-bold tracking-tight truncate">
                {((parseFloat(amountValue) || 0) * USD_TO_MXN_RATE).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high shrink-0 shadow-inner border border-white/5">
              <span className="text-base">🇲🇽</span>
              <span className="font-title-base text-xs text-on-surface font-bold">MXN</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
            <span className="font-caption-sm text-[11px] text-on-surface-variant">
              Zero hidden FX spread • Complete amount delivered
            </span>
          </div>
        </div>
      </div>

      {/* DELIVERY METHOD SELECTOR */}
      <div className="flex flex-col space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="font-title-base text-xs text-on-surface font-bold">How will your receiver get it?</span>
          <span className="font-caption-sm text-xs text-primary font-bold">Free</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-container-lowest border border-white/5">
          <button
            className={`py-2.5 px-1.5 rounded-lg font-caption-sm text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
              deliveryMethod === 'cash'
                ? 'bg-surface-container-high text-primary shadow-sm border border-primary/20'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setDeliveryMethod('cash')}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span className="truncate">Cash Pickup</span>
          </button>
          <button
            className={`py-2.5 px-1.5 rounded-lg font-caption-sm text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
              deliveryMethod === 'bank'
                ? 'bg-surface-container-high text-primary shadow-sm border border-primary/20'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setDeliveryMethod('bank')}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span className="truncate">Bank (SPEI)</span>
          </button>
          <button
            className={`py-2.5 px-1.5 rounded-lg font-caption-sm text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
              deliveryMethod === 'wallet'
                ? 'bg-surface-container-high text-primary shadow-sm border border-primary/20'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setDeliveryMethod('wallet')}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">smartphone</span>
            <span className="truncate">Mobile Wallet</span>
          </button>
        </div>
      </div>

      {/* PICKUP PARTNER NETWORK */}
      {deliveryMethod === 'cash' && (
        <div className="flex flex-col space-y-3 pt-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-title-base text-xs text-on-surface font-bold">Pickup Partner Network</span>
              <span className="font-caption-sm text-[11px] text-on-surface-variant">
                40,000+ branch and retail locations in Mexico
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-primary text-[18px]">storefront</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {CASH_PICKUP_STORES.filter((s) => s.id !== 'any').map((store) => {
              const isSelected = selectedStore === store.id;
              const StoreLogo = store.Logo;
              return (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => setSelectedStore(store.id)}
                  className={`network-btn relative h-14 rounded-xl bg-white text-slate-900 shadow-md p-1.5 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-primary shadow-[0_0_16px_rgba(46,213,164,0.45)]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-full h-7 flex items-center justify-center">
                    <StoreLogo className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-700 leading-tight truncate w-full">
                    {store.badge}
                  </span>
                  {isSelected && (
                    <span className="selected-pill absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[11px] font-bold">check</span>
                    </span>
                  )}
                </button>
              );
            })}

            {/* 13. Any Available Network Partner */}
            <button
              type="button"
              onClick={() => setSelectedStore('any')}
              className={`network-btn col-span-3 h-12 rounded-xl bg-white text-slate-900 shadow-sm px-3 flex items-center justify-between text-left transition-all cursor-pointer ${
                selectedStore === 'any' ? 'ring-2 ring-primary shadow-[0_0_16px_rgba(46,213,164,0.45)]' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[20px]">hub</span>
                <div className="flex flex-col leading-tight">
                  <span className="font-title-base text-xs font-bold text-slate-900">
                    Any Available Network Partner
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Receiver picks up at any of 40,000+ locations
                  </span>
                </div>
              </div>
              {selectedStore === 'any' && (
                <span className="selected-pill w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[11px] font-bold">check</span>
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* CASH PICKUP BENEFICIARY SELECTION */}
      {deliveryMethod === 'cash' && (
        <div className="flex flex-col space-y-2.5 pt-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-title-base text-xs text-on-surface font-bold">
              Persona que Retira en México
            </span>
            <span className="font-caption-sm text-[11px] text-primary font-bold">INE / Pasaporte Requerido</span>
          </div>

          {selectedAvatar && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl px-3 py-2 text-xs animate-fade-in shadow-inner">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 animate-pulse">
                  save
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-semibold text-[11px] truncate">
                    Borrador guardado automáticamente
                  </span>
                  <span className="text-primary text-[10px] font-medium truncate">
                    Beneficiario: {selectedAvatar.fullName || selectedAvatar.name} • ${parseFloat(amountValue) || 50} USD
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSendDraft();
                }}
                className="text-white hover:text-red-300 px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-red-500/20 text-[11px] font-bold shrink-0 ml-2 cursor-pointer transition-all border border-white/10 flex items-center gap-1 active:scale-95"
                title="Descartar borrador y seleccionar otro destinatario"
              >
                <span>✕ Limpiar</span>
              </button>
            </div>
          )}

          <div
            onClick={onSelectAvatarClick}
            className="p-3.5 rounded-2xl bg-surface-container border border-white/10 space-y-2 cursor-pointer hover:border-primary/40 transition-colors shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {selectedAvatar ? (
                  <>
                    <ContactAvatar
                      photoUrl={selectedAvatar.photoUrl}
                      name={selectedAvatar.name}
                      className="w-10 h-10 rounded-xl"
                      iconSize="text-[22px]"
                    />
                    <div className="min-w-0">
                      <p className="font-title-base text-xs font-bold text-white truncate">
                        {selectedAvatar.fullName || selectedAvatar.name}
                      </p>
                      <p className="font-financial-mono text-[11px] text-on-surface-variant truncate">
                        {selectedAvatar.phone ? `Tel: ${selectedAvatar.phone}` : 'Retiro con Clave KIN y Cédula/INE'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-dashed border-primary/30 flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">person_add</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-title-base text-xs font-bold text-white truncate">Selecciona quién retira en sucursal</p>
                      <p className="text-[11px] text-on-surface-variant truncate">Toca para elegir familiar o agregar uno nuevo</p>
                    </div>
                  </>
                )}
              </div>
              {selectedAvatar ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] text-primary font-semibold">Cambiar</span>
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                </div>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-bold flex-shrink-0">
                  Elegir
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BANK (SPEI) SELECTION */}
      {deliveryMethod === 'bank' && (
        <div className="flex flex-col space-y-2.5 pt-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-title-base text-xs text-on-surface font-bold">Bank SPEI Beneficiary</span>
            <span className="font-caption-sm text-[11px] text-primary font-bold">24/7 Instant</span>
          </div>

          {selectedAvatar && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl px-3 py-2 text-xs animate-fade-in shadow-inner">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 animate-pulse">
                  save
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-semibold text-[11px] truncate">
                    Borrador guardado automáticamente
                  </span>
                  <span className="text-primary text-[10px] font-medium truncate">
                    Beneficiario: {selectedAvatar.fullName || selectedAvatar.name} • ${parseFloat(amountValue) || 50} USD
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSendDraft();
                }}
                className="text-white hover:text-red-300 px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-red-500/20 text-[11px] font-bold shrink-0 ml-2 cursor-pointer transition-all border border-white/10 flex items-center gap-1 active:scale-95"
                title="Descartar borrador y seleccionar otro destinatario"
              >
                <span>✕ Limpiar</span>
              </button>
            </div>
          )}

          <div
            onClick={onSelectAvatarClick}
            className="p-3.5 rounded-2xl bg-surface-container border border-white/10 space-y-2 cursor-pointer hover:border-primary/40 transition-colors shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {selectedAvatar ? (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                      {getBankLogoUrl(selectedAvatar.bank) ? (
                        <img src={getBankLogoUrl(selectedAvatar.bank)!} alt={selectedAvatar.bank} className="w-full h-full object-contain" />
                      ) : (
                        <span className="font-financial-mono text-xs font-black text-[#004481]">
                          {(selectedAvatar.bank || 'SPEI').slice(0, 4).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-title-base text-xs font-bold text-white truncate">
                        {selectedAvatar.fullName || selectedAvatar.name}
                      </p>
                      <p className="font-financial-mono text-[11px] text-on-surface-variant truncate">
                        CLABE: {selectedAvatar.clabe || 'SPEI Interbancario'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-dashed border-primary/30 flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">person_add</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-title-base text-xs font-bold text-white truncate">Selecciona un beneficiario</p>
                      <p className="text-[11px] text-on-surface-variant truncate">Toca para elegir de tu lista o agregar uno</p>
                    </div>
                  </>
                )}
              </div>
              {selectedAvatar ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] text-primary font-semibold">Cambiar</span>
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                </div>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-bold flex-shrink-0">
                  Elegir
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE WALLET SELECTION */}
      {deliveryMethod === 'wallet' && (
        <div className="flex flex-col space-y-2.5 pt-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-title-base text-xs text-on-surface font-bold">Mobile Wallet Destination</span>
            <span className="font-caption-sm text-[11px] text-primary font-bold">Zero Fee</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="p-3 rounded-xl bg-surface-container border border-primary text-left transition-all shadow-[0_0_16px_rgba(46,213,164,0.3)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
              <p className="font-title-base text-xs font-bold text-white mt-1">KIN Cash</p>
              <p className="text-[10px] text-primary">Direct P2P Transit</p>
            </button>
            <button
              type="button"
              className="p-3 rounded-xl bg-surface-container border border-white/10 text-left transition-all hover:border-white/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-secondary text-[22px]">smartphone</span>
              <p className="font-title-base text-xs font-bold text-white mt-1">Mercado Pago</p>
              <p className="text-[10px] text-on-surface-variant">Instant Transfer</p>
            </button>
          </div>
        </div>
      )}

      {/* TRANSPARENT FEE BREAKDOWN CARD */}
      <div className="rounded-2xl bg-surface-container p-4 shadow-md space-y-2.5 border border-white/5">
        <div className="flex items-center justify-between">
          <span className="font-caption-sm text-xs text-on-surface-variant">Transfer Fee</span>
          <div className="flex items-center gap-1.5">
            <span className="font-financial-mono text-xs text-on-surface-variant line-through">$4.99</span>
            <span className="font-financial-mono text-xs text-primary font-bold">$0.00 Free</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-caption-sm text-xs text-on-surface-variant">Exchange Rate Guaranteed</span>
          <span className="font-financial-mono text-xs text-on-surface font-semibold">1 USD = {USD_TO_MXN_RATE.toFixed(2)} MXN</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-caption-sm text-xs text-on-surface-variant">Estimated Delivery Time</span>
          <span className="font-caption-sm text-xs text-primary font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">bolt</span> Within 5 minutes
          </span>
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-white/5">
          <span className="font-title-base text-xs text-on-surface font-bold">Total to Charge</span>
          <span className="font-financial-mono text-sm text-primary font-bold">
            ${(parseFloat(amountValue) || 300).toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* PERSISTENT STICKY PRIMARY CTA */}
      <div className="sticky bottom-20 z-30 pt-2 pb-1">
        <button
          type="button"
          onClick={handleStartSendReview}
          className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#18A57E] text-white font-headline-md text-title-base font-bold shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
        >
          <span>
            {!selectedAvatar
              ? (language === 'en' ? 'Select Beneficiary in Mexico' : 'Seleccionar Beneficiario en México')
              : (language === 'en'
                  ? `Review Breakdown & Send • $${(parseFloat(amountValue) || 50).toFixed(2)} USD`
                  : `Revisar Desglose y Enviar • $${(parseFloat(amountValue) || 50).toFixed(2)} USD`)}
          </span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>

      {/* Spacer */}
      <div className="h-14 w-full pointer-events-none" aria-hidden="true" />
    </div>
  );
}
