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
        backgroundColor: isLight ? '#FFFFFF' : '#181825',
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
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer select-none ${
                isActive
                  ? 'text-primary font-bold scale-105 drop-shadow-[0_0_8px_rgba(46,213,164,0.35)]'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-on-surface-variant hover:text-white'
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
