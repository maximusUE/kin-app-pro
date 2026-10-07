'use client';

import React from 'react';
import { BillPayView, SERVICIOS_MEXICO, ServiceDefinition, getCategoryIconTheme } from './views/BillPayView';

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
      <div className="w-full max-w-[412px] flex flex-col relative min-h-screen pb-24 px-4 bg-[#06070B] pt-2">
        {content}
      </div>
    </div>
  );
}
