'use client';

import React from 'react';
import { ChevronLeftIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { KinAppTab } from '@/components/layout/MobileBottomDock';

export interface MobileHeaderProps {
  theme: 'dark' | 'light';
  activeTab: KinAppTab;
  sendSuccessData: any;
  language: 'es' | 'en';
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
  onBackToHome,
  onLoginClick,
}: MobileHeaderProps) {
  const isLight = theme === 'light';
  const isEn = language === 'en';

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
            <div className="flex flex-col leading-none">
              <span
                className={`font-headline-md text-[17px] font-bold tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                KIN
              </span>
              <span className="font-label-caps text-[9px] uppercase tracking-widest text-[#2ED5A4]">
                Global
              </span>
            </div>
          </div>

          {/* Quick Direct Access: Login / Enterprise Auth Screen */}
          <div className="flex items-center gap-1.5">
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
