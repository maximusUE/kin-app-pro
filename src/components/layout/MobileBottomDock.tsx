'use client';

import React from 'react';

export type KinAppTab =
  | 'home'
  | 'send'
  | 'bills'
  | 'transactions'
  | 'wallet'
  | 'send-quick'
  | 'profile'
  | 'kin-cash'
  | 'bill-pay'
  | 'vault'
  | '';

export interface MobileBottomDockProps {
  activeTab: KinAppTab;
  onSelectTab: (tab: KinAppTab) => void;
  language: 'es' | 'en';
  theme: 'dark' | 'light';
  isVisible?: boolean;
}

/**
 * MobileBottomDock - Navegación táctil inferior ergonómica de 5 pestañas
 * Diseñada para cumplir con Apple HIG y Google Material 3
 * Provee retroalimentación visual, áreas táctiles > 48px y soporte safe-area para iPhone.
 */
export function MobileBottomDock({
  activeTab,
  onSelectTab,
  language,
  theme,
  isVisible = true,
}: MobileBottomDockProps) {
  if (!isVisible) return null;

  const isEn = language === 'en';
  const isLight = theme === 'light';

  const DOCK_ITEMS: Array<{
    id: KinAppTab;
    icon: string;
    label: { es: string; en: string };
  }> = [
    { id: 'home', icon: 'home', label: { es: 'Inicio', en: 'Home' } },
    { id: 'send', icon: 'send', label: { es: 'Enviar', en: 'Send' } },
    { id: 'kin-cash', icon: 'account_balance_wallet', label: { es: 'Kin Cash', en: 'Kin Cash' } },
    { id: 'bill-pay', icon: 'receipt_long', label: { es: 'Servicios', en: 'Bill Pay' } },
    { id: 'profile', icon: 'person', label: { es: 'Perfil', en: 'Profile' } },
  ];

  const handleTabClick = (tabId: KinAppTab) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (_) {}
    }
    onSelectTab(tabId);
  };

  return (
    <nav
      className="stitch-bottom-dock"
      style={{
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(24, 24, 37, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: isLight ? '0 -4px 20px rgba(15, 23, 42, 0.06)' : '0 -4px 20px rgba(0, 0, 0, 0.35)',
        opacity: 1,
      }}
      data-active-classes="text-primary font-bold scale-105"
      aria-label="Navegación principal de la aplicación"
    >
      <div className="h-16 w-full flex items-center justify-around px-2">
        {DOCK_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer select-none ${
                isActive
                  ? isLight
                    ? 'bg-emerald-50 text-primary font-bold scale-105 shadow-xs'
                    : 'bg-emerald-500/15 text-primary font-bold scale-105 shadow-[0_0_12px_rgba(46,213,164,0.25)]'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5'
              }`}
              title={isEn ? item.label.en : item.label.es}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`material-symbols-outlined text-[24px] w-6 h-6 flex items-center justify-center shrink-0 transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-label-caps text-[10px] tracking-tight whitespace-nowrap truncate max-w-[52px] text-center">
                {isEn ? item.label.en : item.label.es}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomDock;
