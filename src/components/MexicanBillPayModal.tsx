'use client';

import React from 'react';
import { BillPayView, SERVICIOS_MEXICO, ServiceDefinition, getCategoryIconTheme } from './views/BillPayView';
import { CloseIcon } from './Icons';

export { SERVICIOS_MEXICO, getCategoryIconTheme };
export type { ServiceDefinition };

export interface MexicanBillPayModalProps {
  isOpen?: boolean;
  isScreen?: boolean;
  onClose?: () => void;
  onPaymentSuccess?: (service: string, amountMXN: number) => void;
  selectedServiceId?: string;
  exchangeRate?: number;
  language?: 'es' | 'en';
}

export function MexicanBillPayModal({
  isOpen = true,
  isScreen = false,
  onClose,
  onPaymentSuccess,
  selectedServiceId,
  exchangeRate = 20.45,
  language = 'es',
}: MexicanBillPayModalProps) {
  if (!isOpen && !isScreen) return null;

  const content = (
    <BillPayView
      onBack={onClose}
      onPaymentSuccess={onPaymentSuccess}
      selectedServiceId={selectedServiceId}
      exchangeRate={exchangeRate}
      language={language}
    />
  );

  if (isScreen) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#06070B] text-white flex justify-center selection:bg-[#2ED5A4]/30 selection:text-[#2ED5A4] overflow-y-auto">
      <div className="w-full max-w-[412px] flex flex-col relative min-h-screen pb-24 px-4 bg-[#06070B]">
        {/* Modal Top Header with Close */}
        <header className="sticky top-0 z-40 bg-[#06070B]/95 backdrop-blur-xl pt-2 pb-2.5 -mx-4 px-4 border-b border-white/10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#2ED5A4]">receipt_long</span>
            <span className="font-headline-md text-base font-bold text-white tracking-tight">KIN Bill Pay</span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#181825] border border-white/10 flex items-center justify-center text-[#A6ADC8] hover:text-white cursor-pointer"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </header>

        {content}
      </div>
    </div>
  );
}
