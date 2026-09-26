'use client';

import React from 'react';
import { ChevronLeftIcon, getBankLogoUrl } from '@/components/Icons';
import { ContactAvatar } from '@/components/ContactAvatar';

export interface SendQuickContactItem {
  id: string;
  name: string;
  fullName?: string;
  bank?: string;
  photoUrl?: string;
  clabe?: string;
  phone?: string;
  [key: string]: any;
}

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
}: SendQuickViewProps) {
  return (
    <div className="animate-fade-in space-y-4 pb-28">
      {/* Native Mobile Header: < | Send Quick | Info */}
      <header className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onBack}
          className="btn-circle"
          title="Volver a Home"
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm font-bold text-white tracking-wide">Send Quick</span>
            <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[#2ED5A4] text-[10px] font-black tracking-wider">
              ⚡ 1-TAP
            </span>
          </div>
          <span className="text-[10px] text-[#8E91A5] block">
            Envío SPEI ultrarrápido sin pasos innecesarios
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            alert(
              'Send Quick te permite enviar dinero a tus destinatarios frecuentes con 1 solo toque, con acreditación instantánea en México vía SPEI Banxico.'
            )
          }
          className="btn-circle"
          title="Información"
        >
          <span className="text-xs font-bold text-white">ℹ️</span>
        </button>
      </header>

      {/* 1. Recipient Selection Card (Diseño Nativo Ergonómico) */}
      <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#8E91A5] uppercase tracking-wider">
            Destinatario Frecuente
          </span>
          <span className="text-[10px] text-[#2ED5A4] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
            SPEI Activo
          </span>
        </div>

        {/* Recipient Selection or Empty State */}
        {contactsList.length === 0 ? (
          <div
            onClick={onAddContact}
            className="p-5 rounded-2xl bg-[#0E0F1A] border border-dashed border-white/15 flex items-center gap-3 cursor-pointer hover:border-[#2ED5A4]/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#202236] border border-white/10 flex items-center justify-center text-[#2ED5A4] flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">person_add</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Sin contactos registrados</p>
              <p className="text-xs text-[#8E91A5] truncate">Toca aquí para agregar a tu familia en México</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] text-xs font-bold border border-[#2ED5A4]/20 flex-shrink-0">
              + Agregar
            </span>
          </div>
        ) : (
          <>
            {/* Horizontal Contact Selector */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
              {contactsList.map((c, idx) => {
                const isSelected = sendQuickSelectedRecipient === idx;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSendQuickSelectedRecipient(idx)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2ED5A4]/15 border-[#2ED5A4] text-white shadow-md shadow-[#2ED5A4]/10'
                        : 'bg-[#202236] border-white/5 text-[#8E91A5] hover:text-white hover:border-white/15'
                    }`}
                    style={{ minWidth: '78px' }}
                  >
                    <div className="relative">
                      <ContactAvatar
                        photoUrl={c.photoUrl}
                        name={c.name}
                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                          isSelected ? 'border-[#2ED5A4]' : 'border-white/10'
                        }`}
                        iconSize="text-[26px]"
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2ED5A4] flex items-center justify-center text-white text-[9px] font-black shadow-sm">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold truncate max-w-[70px]">
                      {c.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={onAddContact}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border border-dashed border-white/15 text-[#8E91A5] hover:text-white hover:border-white/30 transition-all flex-shrink-0 cursor-pointer"
                style={{ minWidth: '78px', height: '84px' }}
              >
                <div className="w-10 h-10 rounded-full bg-[#202236] flex items-center justify-center text-[#2ED5A4]">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </div>
                <span className="text-[10px] font-bold">Nuevo</span>
              </button>
            </div>

            {/* Active Recipient Details Banner */}
            {(() => {
              const currentRecipient = contactsList[sendQuickSelectedRecipient] || contactsList[0];
              if (!currentRecipient) return null;
              return (
                <div className="p-3 rounded-2xl bg-[#0E0F1A] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center font-bold text-sm text-[#2ED5A4] flex-shrink-0">
                      {currentRecipient.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{currentRecipient.name}</p>
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
                        <p className="text-[10px] text-white/90 truncate">
                          {currentRecipient.bank || 'Cuenta Bancaria SPEI'} • CLABE verificada
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] text-[10px] font-bold border border-[#2ED5A4]/20 flex-shrink-0">
                    ✓ Listo
                  </span>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* 2. Hero Amount Card (Gran Tipografía Móvil & Chips) */}
      <div className="p-5 rounded-3xl bg-[#181928] border border-white/5 space-y-4 shadow-lg text-center">
        <span className="text-[11px] font-bold text-[#8E91A5] uppercase tracking-wider block">
          Monto del Envío Rápido
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
                title="Borrar a cero"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#8E91A5] font-medium text-center mt-1">
            Toca la cantidad para escribir con el teclado de tu teléfono
          </p>
        </div>

        {/* Conversión en Vivo con Tasa SPEI */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202236] border border-white/5 text-center">
          <span className="text-xs font-bold text-white">
            ≈ ${((parseFloat(sendQuickAmount) || 0) * USD_TO_MXN_RATE).toLocaleString('es-MX', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            MXN
          </span>
          <span className="text-[10px] text-white/60">|</span>
          <span className="text-[10px] text-[#2ED5A4] font-semibold">1 USD = $20.45 MXN</span>
        </div>

        {/* 4 Chips de Monto Ergonómicos (Touch Targets de 52px) */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {['25', '50', '100', '200'].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setSendQuickAmount(val)}
              className={`h-12 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                sendQuickAmount === val
                  ? 'bg-[#2ED5A4] text-white shadow-md shadow-[#2ED5A4]/20 scale-[1.02]'
                  : 'bg-[#202236] border border-white/5 text-white hover:bg-[#2B2C42]'
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
          <span>Origen de fondos:</span>
          <span className="font-bold text-white flex items-center gap-1">
            <span>🟢</span> KIN Digital Wallet (${netBalance.toFixed(2)} USD)
          </span>
        </div>
        <div className="flex items-center justify-between text-[#8E91A5]">
          <span>Comisión de transferencia:</span>
          <span className="font-bold text-[#2ED5A4]">GRATIS ($0.00 USD)</span>
        </div>
        <div className="flex items-center justify-between text-[#8E91A5]">
          <span>Tiempo de acreditación:</span>
          <span className="font-bold text-white">⚡ Menos de 30 segundos</span>
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
              {contactsList.length > 0
                ? `${language === 'en' ? 'Send to' : 'Enviar a'} ${(contactsList[sendQuickSelectedRecipient] || contactsList[0]).name.split(' ')[0]}`
                : language === 'en'
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
