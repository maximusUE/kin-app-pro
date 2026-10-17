'use client';

import React from 'react';
import { ChevronLeftIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { KinWordmark } from '@/components/KinWordmark';
import { KinAppTab } from '@/components/layout/MobileBottomDock';

export interface MobileHeaderProps {
  theme: 'dark' | 'light';
  activeTab: KinAppTab;
  sendSuccessData: any;
  language: 'es' | 'en';
  fxRate?: number;
  speiLatencyMs?: number;
  onBackToHome: () => void;
  onLoginClick: () => void;
}

/**
 * MobileHeader - Cabecera móvil unificada de alta jerarquía (Apple HIG & Material 3)
 * Incluye barra de estado ergonómica, KinLogo 3D oficial y botón circular `.btn-circle`
 */
export function MobileHeader({
  theme,
  activeTab,
  sendSuccessData,
  language,
  fxRate,
  speiLatencyMs,
  onBackToHome,
  onLoginClick,
}: MobileHeaderProps) {
  const isLight = theme === 'light';
  const isEn = language === 'en';
  const [wordmarkStyle, setWordmarkStyle] = React.useState<'deconstructed' | 'radical'>('deconstructed');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kin_wordmark_style') as 'deconstructed' | 'radical' | null;
      if (saved === 'deconstructed' || saved === 'radical') {
        setWordmarkStyle(saved);
      }
    }
  }, []);

  const handleToggleWordmark = () => {
    const next = wordmarkStyle === 'deconstructed' ? 'radical' : 'deconstructed';
    setWordmarkStyle(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_wordmark_style', next);
      } catch (_) {}
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch (_) {}
    }
  };

  return (
    <div
      className={`sticky top-0 z-30 ${
        isLight
          ? 'bg-white/95 border-slate-200/80 text-slate-900'
          : 'bg-[#06070B]/95 border-white/5 text-white'
      } backdrop-blur-md px-4 pt-1.5 pb-2 border-b flex-shrink-0 transition-colors`}
    >
      {/* Dynamic Status Bar */}
      <div
        className={`flex items-center justify-between text-xs ${
          isLight ? 'text-slate-500' : 'text-[#8E91A5]'
        } font-semibold mb-2 pt-1 px-1`}
      >
        <span
          className={`font-financial-mono ${
            isLight ? 'text-slate-900 font-bold' : 'text-white'
          }`}
        >
          9:41
        </span>
        <div
          className={`h-3.5 w-20 ${
            isLight ? 'bg-slate-200/80 border-slate-300/60' : 'bg-[#121320] border-white/5'
          } rounded-full mx-auto shadow-inner border`}
        />
        <div className="flex items-center gap-1.5">
          <span
            className={`material-symbols-outlined text-[13px] ${
              isLight ? 'text-slate-800' : 'text-white'
            }`}
          >
            signal_cellular_alt
          </span>
          <span
            className={`font-financial-mono text-[10px] ${
              isLight ? 'text-slate-800 font-bold' : 'text-white'
            }`}
          >
            5G
          </span>
          <span
            className={`material-symbols-outlined text-[13px] ${
              isLight ? 'text-slate-800' : 'text-white'
            }`}
          >
            battery_full
          </span>
        </div>
      </div>

      {/* Main Top Bar for Home and Kin Cash */}
      {(activeTab === 'home' || activeTab === 'kin-cash') && !sendSuccessData && (
        <header className="flex items-center justify-between gap-2 mb-1 px-0.5">
          <div className="flex items-center gap-2">
            {activeTab !== 'home' && (
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                    try {
                      navigator.vibrate(10);
                    } catch (_) {}
                  }
                  onBackToHome();
                }}
                className="btn-circle"
                title={isEn ? 'Back to home' : 'Volver al inicio'}
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            )}
            <KinLogo size={34} />
            <button
              type="button"
              onClick={handleToggleWordmark}
              className="flex flex-col justify-center ml-0.5 text-left group cursor-pointer transition-transform active:scale-95"
              title={isEn ? 'Tap to switch KIN typography style' : 'Toca para alternar estilo de tipografía KIN'}
            >
              <KinWordmark
                height={16}
                variant={isLight ? 'current' : 'emerald'}
                kStyle={wordmarkStyle}
                badge="GLOBAL"
              />
            </button>
          </div>

          {/* Quick Direct Access: Live FX SSE & Login Screen */}
          <div className="flex items-center gap-1.5">
            {fxRate && (
              <div
                className={`hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-financial-mono font-bold border transition-colors shadow-2xs ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                    : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20'
                }`}
                title={isEn ? `Live FX via SSE • Banxico STP Latency: ${speiLatencyMs || 135}ms` : `Tipo de Cambio en Vivo vía SSE • Latencia Banxico: ${speiLatencyMs || 135}ms`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>${fxRate.toFixed(2)}</span>
                {speiLatencyMs && (
                  <span className="text-[9px] opacity-75 hidden sm:inline font-mono">
                    • {speiLatencyMs}ms
                  </span>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                  try {
                    navigator.vibrate(10);
                  } catch (_) {}
                }
                onLoginClick();
              }}
              className={`h-8 px-2.5 sm:px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                  : 'bg-white/10 hover:bg-white/15 text-white/90 hover:text-white border border-white/10'
              }`}
              title={
                isEn
                  ? 'Direct Access to Login & OAuth Screen'
                  : 'Acceso Directo a Pantalla de Login y OAuth'
              }
            >
              <span className="material-symbols-outlined text-[15px] text-emerald-600 dark:text-emerald-400">
                login
              </span>
              <span className="font-title-base tracking-tight text-[11px] sm:text-xs">
                Login
              </span>
            </button>
          </div>
        </header>
      )}
    </div>
  );
}

export default MobileHeader;
