'use client';

import React from 'react';
import { CardCheckoutView } from '@/components/views/CardCheckoutView';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export interface KinCardCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  conceptTitle: string;
  conceptSubtitle: string;
  amountBaseUSD: number;
  amountMXN?: number;
  feeUSD?: number;
  exchangeRate?: number;
  metadata?: Record<string, string>;
  language?: 'es' | 'en';
  onPaymentSuccess?: (result: {
    paymentIntentId: string;
    totalUSD: number;
    amountBaseUSD: number;
    feeUSD: number;
    cardLast4: string;
    cardBrand: string;
    satUuid: string;
    banxicoTracking: string;
  }) => void;
}

/**
 * KinCardCheckoutModal (Alias hacia CardCheckoutView)
 * Erradica por completo los modales flotantes tipo popup y delega
 * la experiencia a la vista inmersiva de pantalla completa moderna.
 */
export function KinCardCheckoutModal({
  isOpen,
  onClose,
  title,
  conceptTitle,
  conceptSubtitle,
  amountBaseUSD,
  amountMXN,
  feeUSD = 1.99,
  exchangeRate = 20.12,
  metadata = {},
  language = 'es',
  onPaymentSuccess,
}: KinCardCheckoutModalProps) {
  if (!isOpen) return null;

  return (
    <ErrorBoundary fallbackTitle={title} onReset={onClose}>
      <CardCheckoutView
        onBack={onClose}
        title={title}
        conceptTitle={conceptTitle}
        conceptSubtitle={conceptSubtitle}
        amountBaseUSD={amountBaseUSD}
        amountMXN={amountMXN}
        feeUSD={feeUSD}
        exchangeRate={exchangeRate}
        metadata={metadata}
        language={language}
        onPaymentSuccess={onPaymentSuccess}
      />
    </ErrorBoundary>
  );
}
