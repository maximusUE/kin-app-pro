'use client';

import React, { useState } from 'react';
import { ChevronLeftIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface KinCardLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'es' | 'en';
}

export function KinCardLimitsModal({
  isOpen,
  onClose,
  language = 'es',
}: KinCardLimitsModalProps) {
  const [purchaseLimit, setPurchaseLimit] = useState<number>(2500);
  const [atmLimit, setAtmLimit] = useState<number>(500);
  const [intlEnabled, setIntlEnabled] = useState<boolean>(true);
  const [onlineEnabled, setOnlineEnabled] = useState<boolean>(true);
  const [nfcEnabled, setNfcEnabled] = useState<boolean>(true);
  const [atmEnabled, setAtmEnabled] = useState<boolean>(true);

  const isEn = language === 'en';

  if (!isOpen) return null;

  const handleSave = () => {
    toast.success(
      isEn
        ? 'Card limits and security toggles updated successfully!'
        : '¡Límites de tarjeta y switches de seguridad actualizados con éxito!'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto scrollbar-none bg-[#0E131F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.95)] text-white space-y-4 my-auto">
        {/* Universal Don César Header: < | KinLogo | Limits Badge */}
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

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[13px]">tune</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
              {isEn ? 'Spending Controls' : 'Control de Límites'}
            </span>
          </div>
        </header>

        {/* Title */}
        <div className="text-center pt-1">
          <h2 className="text-xl font-black text-white tracking-tight">
            {isEn ? 'Card Limits & Controls' : 'Límites de Tarjeta KIN'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isEn
              ? 'Adjust your daily spending and ATM withdrawal thresholds'
              : 'Configura tus topes diarios de compras y retiros de efectivo'}
          </p>
        </div>

        {/* Section 1: Daily Purchase Limit */}
        <div className="p-4 rounded-2xl bg-[#141624] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2ED5A4] text-[18px]">shopping_bag</span>
              <span className="text-xs font-bold text-white">
                {isEn ? 'Daily Purchases Limit' : 'Límite Diario de Compras'}
              </span>
            </div>
            <span className="text-sm font-mono font-black text-[#2ED5A4]">
              ${purchaseLimit.toLocaleString('en-US')} USD
            </span>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={purchaseLimit}
            onChange={(e) => setPurchaseLimit(Number(e.target.value))}
            className="w-full accent-[#2ED5A4] h-2 bg-slate-700 rounded-lg cursor-pointer"
          />

          {/* Preset Buttons */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {[1000, 2500, 5000, 10000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPurchaseLimit(val)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  purchaseLimit === val
                    ? 'bg-[#2ED5A4]/20 border-[#2ED5A4] text-[#2ED5A4]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                ${val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: ATM Withdrawal Limit */}
        <div className="p-4 rounded-2xl bg-[#141624] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2ED5A4] text-[18px]">local_atm</span>
              <span className="text-xs font-bold text-white">
                {isEn ? 'Daily ATM Withdrawal' : 'Retiro Diario en Cajeros'}
              </span>
            </div>
            <span className="text-sm font-mono font-black text-[#2ED5A4]">
              ${atmLimit.toLocaleString('en-US')} USD
            </span>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={atmLimit}
            onChange={(e) => setAtmLimit(Number(e.target.value))}
            className="w-full accent-[#2ED5A4] h-2 bg-slate-700 rounded-lg cursor-pointer"
          />

          {/* Preset Buttons */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {[200, 500, 1000, 2000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAtmLimit(val)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  atmLimit === val
                    ? 'bg-[#2ED5A4]/20 border-[#2ED5A4] text-[#2ED5A4]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                ${val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Security & Operational Toggles */}
        <div className="p-4 rounded-2xl bg-[#141624] border border-white/5 space-y-3 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            {isEn ? 'Security Switches' : 'Canales de Operación'}
          </span>

          {/* Toggle: International */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-300 text-[18px]">public</span>
              <div>
                <p className="font-semibold text-white">{isEn ? 'International Usage' : 'Uso Internacional'}</p>
                <p className="text-[10px] text-slate-400">{isEn ? 'POS purchases in Mexico & abroad' : 'Compras en México y el resto del mundo'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIntlEnabled(!intlEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                intlEnabled ? 'bg-[#2ED5A4]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  intlEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle: Online E-Commerce */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-300 text-[18px]">storefront</span>
              <div>
                <p className="font-semibold text-white">{isEn ? 'Online Purchases' : 'Compras por Internet'}</p>
                <p className="text-[10px] text-slate-400">{isEn ? 'Web, apps & subscriptions' : 'Sitios web, apps y suscripciones'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOnlineEnabled(!onlineEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                onlineEnabled ? 'bg-[#2ED5A4]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  onlineEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle: Contactless NFC */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-300 text-[18px]">contactless</span>
              <div>
                <p className="font-semibold text-white">{isEn ? 'Contactless NFC' : 'Pagos Sin Contacto'}</p>
                <p className="text-[10px] text-slate-400">{isEn ? 'Tap to pay POS terminals' : 'Pagos acercando la tarjeta o móvil'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNfcEnabled(!nfcEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                nfcEnabled ? 'bg-[#2ED5A4]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  nfcEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle: ATM Cash Withdrawals */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-300 text-[18px]">atm</span>
              <div>
                <p className="font-semibold text-white">{isEn ? 'ATM Cash Withdrawals' : 'Retiro en Cajeros ATM'}</p>
                <p className="text-[10px] text-slate-400">{isEn ? 'Cash dispenses at ATMs' : 'Disposición de efectivo en cajeros'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAtmEnabled(!atmEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                atmEnabled ? 'bg-[#2ED5A4]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  atmEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{isEn ? 'Save Limit Preferences' : 'Guardar Nuevos Límites'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
