'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface FxControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
  onRateUpdated: (newRate: number) => void;
  language?: 'es' | 'en';
}

export function FxControlModal({
  isOpen,
  onClose,
  currentRate,
  onRateUpdated,
  language = 'es',
}: FxControlModalProps) {
  const isEn = language === 'en';

  // Estados del Mercado y Configuración de Margen
  const [spotRate, setSpotRate] = useState<number>(20.45);
  const [marginPercent, setMarginPercent] = useState<number>(1.6);
  const [isPromotionalActive, setIsPromotionalActive] = useState<boolean>(false);
  const [promotionalRate, setPromotionalRate] = useState<string>('20.20');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRefreshingSpot, setIsRefreshingSpot] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Hace 2 minutos');

  // Simulador de volumen para cálculo de ganancias
  const [simulatedAmount, setSimulatedAmount] = useState<number>(350);

  // Cargar configuración guardada al abrir
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined') {
        const savedSpot = localStorage.getItem('kin_fx_spot');
        const savedMargin = localStorage.getItem('kin_fx_margin');
        const savedPromoActive = localStorage.getItem('kin_fx_promo_active');
        const savedPromoRate = localStorage.getItem('kin_fx_promo_rate');

        if (savedSpot) setSpotRate(parseFloat(savedSpot));
        if (savedMargin) setMarginPercent(parseFloat(savedMargin));
        if (savedPromoActive) setIsPromotionalActive(savedPromoActive === 'true');
        if (savedPromoRate) setPromotionalRate(savedPromoRate);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Cálculos matemáticos en tiempo real
  const spreadPerDollar = spotRate * (marginPercent / 100);
  const calculatedClientRate = isPromotionalActive && parseFloat(promotionalRate) > 0
    ? parseFloat(promotionalRate)
    : Number((spotRate - spreadPerDollar).toFixed(2));

  // Simulación de Ganancias del Negocio
  const pesosSent = simulatedAmount * calculatedClientRate;
  const costInUSDToBuyPesos = pesosSent / spotRate;
  const netProfitUSD = Number((simulatedAmount - costInUSDToBuyPesos).toFixed(2));
  const netProfitMXN = Number((netProfitUSD * spotRate).toFixed(2));

  // Comparativa de Mercado en Vivo
  const westernUnionRate = Number((spotRate - 0.95).toFixed(2));
  const remitlyRate = Number((spotRate - 0.45).toFixed(2));
  const elektraRate = Number((spotRate - 1.15).toFixed(2));
  const kinAdvantageVsWU = Number((calculatedClientRate - westernUnionRate).toFixed(2));

  // Refrescar cotización del mercado Forex / Banxico
  const handleRefreshSpot = () => {
    setIsRefreshingSpot(true);
    setTimeout(() => {
      // Simula ligera fluctuación natural del mercado interbancario (+/- 0.05)
      const variation = (Math.random() - 0.48) * 0.08;
      const newSpot = Number((spotRate + variation).toFixed(4));
      setSpotRate(newSpot);
      setIsRefreshingSpot(false);
      setLastUpdated('Justo ahora');
      toast.info(
        isEn
          ? `Live market updated: 1 USD = $${newSpot} MXN`
          : `Mercado en vivo actualizado: 1 USD = $${newSpot} MXN`
      );
    }, 600);
  };

  // Guardar y Aplicar Tasa a Toda la App
  const handleSaveAndApply = async () => {
    setIsSaving(true);

    try {
      // 1. Guardar en Backend API
      await fetch('/api/fx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spotRate,
          marginPercent,
          isPromotionalActive,
          promotionalRate: parseFloat(promotionalRate) || calculatedClientRate,
        }),
      });

      // 2. Persistir localmente
      if (typeof window !== 'undefined') {
        localStorage.setItem('kin_fx_spot', spotRate.toString());
        localStorage.setItem('kin_fx_margin', marginPercent.toString());
        localStorage.setItem('kin_fx_promo_active', isPromotionalActive.toString());
        localStorage.setItem('kin_fx_promo_rate', promotionalRate);
        localStorage.setItem('kin_active_exchange_rate', calculatedClientRate.toString());
      }

      // 3. Notificar al sistema global
      onRateUpdated(calculatedClientRate);

      toast.success(
        isEn
          ? `Exchange rate applied: 1 USD = $${calculatedClientRate.toFixed(2)} MXN`
          : `¡Tipo de cambio aplicado! 1 USD = $${calculatedClientRate.toFixed(2)} MXN`,
        {
          description: isEn
            ? `Your margin is ${marginPercent}% (+$${spreadPerDollar.toFixed(2)} MXN per USD).`
            : `Tu margen es de ${marginPercent}% (+$${spreadPerDollar.toFixed(2)} MXN por dólar).`,
        }
      );

      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 500);
    } catch (err: any) {
      setIsSaving(false);
      toast.error('Error al guardar configuración');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-start justify-center pt-2 sm:pt-6 pb-20 px-3 sm:px-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-[460px] rounded-3xl bg-[#10121D] border border-white/10 p-5 shadow-2xl flex flex-col gap-5 text-white my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2ED5A4]/20 to-primary/30 border border-[#2ED5A4]/40 flex items-center justify-center text-[#2ED5A4] shadow-[0_0_15px_rgba(46,213,164,0.3)]">
              <span className="material-symbols-outlined text-[22px]">currency_exchange</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {isEn ? 'FX Market & Margin Control' : 'Tesorería & Tipo de Cambio'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-primary/20 text-primary border border-primary/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                {isEn ? 'Configure your profit spread & live rates' : 'Configura tu margen de ganancia y tasa en vivo'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-outline hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* 1. Mercado en Vivo (Interbank Spot Rate) */}
        <div className="p-4 rounded-2xl bg-[#161828] border border-white/10 flex flex-col gap-2 relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {isEn ? 'Interbank Market Spot' : 'Mercado Interbancario Spot'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRefreshSpot}
              disabled={isRefreshingSpot}
              className="text-[11px] font-medium text-primary hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[14px] ${isRefreshingSpot ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{isRefreshingSpot ? (isEn ? 'Updating...' : 'Actualizando...') : lastUpdated}</span>
            </button>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-financial-mono text-white tracking-tight">
                ${spotRate.toFixed(4)}
              </span>
              <span className="text-xs font-semibold text-outline">MXN / USD</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Forex Oficial Banxico
            </span>
          </div>
        </div>

        {/* 2. Control de Margen de Ganancia (Spread Slider) */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-low border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#2ED5A4]">tune</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {isEn ? 'Profit Margin (Spread)' : 'Margen de Ganancia KIN'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black font-financial-mono text-[#2ED5A4]">
                {marginPercent.toFixed(2)}%
              </span>
              <span className="text-[11px] text-outline">
                (+${spreadPerDollar.toFixed(2)} MXN / USD)
              </span>
            </div>
          </div>

          {/* Slider */}
          <div className="flex flex-col gap-1.5 pt-1">
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.05"
              value={marginPercent}
              onChange={(e) => setMarginPercent(parseFloat(e.target.value))}
              disabled={isPromotionalActive}
              className="w-full h-2 rounded-lg bg-surface-container-high appearance-none cursor-pointer accent-[#2ED5A4] disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] font-semibold text-outline px-0.5">
              <span>0.5% (Agresivo)</span>
              <span>1.6% (Equilibrado)</span>
              <span>2.5% (Conservador)</span>
              <span>4.0% (Alto)</span>
            </div>
          </div>

          {/* Toggle de Tasa Promocional de Campaña */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">
                {isEn ? 'Fixed Promotional Rate' : 'Tasa Fija Promocional'}
              </span>
              <span className="text-[10px] text-outline">
                {isEn ? 'Override margin for marketing campaigns' : 'Fija una tasa manual para campañas de marketing'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPromotionalActive(!isPromotionalActive)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isPromotionalActive ? 'bg-[#2ED5A4]' : 'bg-surface-container-high'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isPromotionalActive ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {isPromotionalActive && (
            <div className="flex items-center gap-2 pt-1 animate-fade-in">
              <span className="text-xs text-outline font-semibold">Tasa Fija:</span>
              <input
                type="number"
                step="0.01"
                value={promotionalRate}
                onChange={(e) => setPromotionalRate(e.target.value)}
                placeholder="20.20"
                className="w-28 px-2.5 py-1 text-xs rounded-lg bg-[#161828] border border-[#2ED5A4]/40 text-white font-bold font-financial-mono focus:outline-none focus:border-[#2ED5A4]"
              />
              <span className="text-[11px] text-[#2ED5A4] font-medium">MXN por USD</span>
            </div>
          )}
        </div>

        {/* 3. Tasa Final Entregada al Cliente KIN */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#12221D] to-[#161828] border border-[#2ED5A4]/30 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#2ED5A4] uppercase tracking-wider block">
              {isEn ? 'Customer Exchange Rate' : 'Tasa Entregada al Cliente KIN'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xs text-outline">1 USD =</span>
              <span className="text-3xl font-black font-financial-mono text-white tracking-tight">
                ${calculatedClientRate.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-[#2ED5A4]">MXN</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-outline block">Tu Margen Neto:</span>
            <span className="text-sm font-extrabold text-[#2ED5A4] font-financial-mono">
              +${spreadPerDollar.toFixed(2)} MXN
            </span>
            <span className="text-[10px] text-outline block">por cada \$1 USD</span>
          </div>
        </div>

        {/* 4. Simulador de Ganancias en Vivo */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {isEn ? 'Profit Calculator' : 'Simulador de Ganancia Neta'}
            </span>
            <span className="text-[10px] text-outline">Por transacción</span>
          </div>

          {/* Quick Selectors */}
          <div className="grid grid-cols-4 gap-1.5">
            {[100, 350, 500, 1000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSimulatedAmount(amt)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  simulatedAmount === amt
                    ? 'bg-[#2ED5A4] text-[#002116] shadow-sm'
                    : 'bg-surface-container-high text-outline hover:text-white'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Breakdown Card */}
          <div className="p-3 rounded-xl bg-[#0D0F18] border border-white/5 flex flex-col gap-2 text-xs">
            <div className="flex justify-between text-outline">
              <span>Cliente envía:</span>
              <span className="font-semibold text-white">${simulatedAmount}.00 USD</span>
            </div>
            <div className="flex justify-between text-outline">
              <span>Familiar recibe en México:</span>
              <span className="font-semibold text-emerald-400 font-financial-mono">
                ${pesosSent.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </span>
            </div>
            <div className="pt-1.5 border-t border-white/10 flex justify-between items-center">
              <span className="font-bold text-white">Tu Ganancia Bruta (Spread):</span>
              <div className="text-right">
                <span className="text-sm font-black text-[#2ED5A4] font-financial-mono">
                  +${netProfitUSD.toFixed(2)} USD
                </span>
                <span className="text-[10px] text-outline block">
                  (~${netProfitMXN.toFixed(2)} MXN)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Comparativa con la Competencia */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low border border-white/10 flex flex-col gap-2">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            {isEn ? 'Market Benchmark (Today)' : 'Comparativa de Mercado (Hoy)'}
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-[#161828] border border-white/5">
              <span className="text-[10px] text-outline block">Western Union</span>
              <span className="font-bold text-white font-financial-mono">${westernUnionRate}</span>
              <span className="text-[9px] text-[#2ED5A4] block mt-0.5">
                KIN +${kinAdvantageVsWU}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-[#161828] border border-white/5">
              <span className="text-[10px] text-outline block">Remitly</span>
              <span className="font-bold text-white font-financial-mono">${remitlyRate}</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">Competitivo</span>
            </div>
            <div className="p-2 rounded-xl bg-[#161828] border border-white/5">
              <span className="text-[10px] text-outline block">Elektra</span>
              <span className="font-bold text-white font-financial-mono">${elektraRate}</span>
              <span className="text-[9px] text-[#2ED5A4] block mt-0.5">KIN mejor</span>
            </div>
          </div>
        </div>

        {/* Botón Principal de Guardar y Aplicar */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAndApply}
            className="w-full h-13 rounded-full bg-gradient-to-r from-primary to-[#18A57E] text-[#002116] font-headline-md text-sm font-black shadow-[0_10px_25px_rgba(46,213,164,0.4)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-[#002116] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">bolt</span>
                <span>
                  {isEn ? 'Apply Exchange Rate to App' : 'Aplicar Tipo de Cambio a Toda la App'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
