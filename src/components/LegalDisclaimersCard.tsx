'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, CloseIcon, ShieldCheckIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';

export interface LegalDisclaimersCardProps {
  language?: 'es' | 'en';
  className?: string;
  defaultExpanded?: boolean;
}

/**
 * 🏛️ LegalDisclaimersCard — Componente Oficial de Cumplimiento Regulatorio KIN
 * 
 * Diseñado con estándares de alta ingeniería y artesanía visual Apple/Vercel:
 * 1. Cumplimiento estricto de la Regla de Remesas de la CFPB (12 CFR Part 1005 / Regulation E).
 * 2. Normativa de transferencias en tiempo real de Banco de México (SPEI 24/7/365).
 * 3. Bóveda criptográfica ClientVault (AES-GCM-256) y privacidad bajo la ley GLBA.
 * 4. Presentación ergonómica nativa con createPortal z-[200], eliminando popups genéricos.
 */
export function LegalDisclaimersCard({
  language = 'es',
  className = '',
  defaultExpanded = false,
}: LegalDisclaimersCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isEn = language === 'en';

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. SECCIÓN INLINE EN EL FEED (DISEÑO FINTECH PULIDO Y NO INVASIVO) */}
      {/* ========================================================================= */}
      <section
        aria-label={isEn ? 'Legal & Regulatory Information' : 'Información Legal y Regulatoria'}
        className={`w-full rounded-3xl bg-slate-50/80 dark:bg-[#121623]/80 border border-slate-200/80 dark:border-white/10 p-4 transition-all shadow-xs ${className}`}
      >
        {/* Cabecera Interactiva */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-[#2ED5A4] flex items-center justify-center shrink-0 border border-emerald-500/20">
              <span className="material-symbols-outlined text-[17px]">gavel</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#2ED5A4] transition-colors truncate">
                {isEn ? 'Legal disclaimers and important info' : 'Avisos legales e información regulatoria'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#8E91A5] truncate font-medium">
                {isEn ? 'CFPB 12 CFR Part 1005 • Banxico SPEI • GLBA Privacy' : 'CFPB Regulación E • SPEI Banxico • Privacidad GLBA'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 dark:text-[#8E91A5] uppercase tracking-wider hidden sm:inline">
              {isExpanded ? (isEn ? 'Collapse' : 'Plegar') : (isEn ? 'Expand' : 'Ver')}
            </span>
            <div className="w-6 h-6 rounded-full bg-slate-200/70 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-white/80 group-hover:bg-slate-300 dark:group-hover:bg-white/20 transition-all">
              <span className="text-xs font-mono font-bold select-none">
                {isExpanded ? '−' : '+'}
              </span>
            </div>
          </div>
        </button>

        {/* Resumen Inmediato en Tipografía Gris Fina Regulada */}
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-[#8E91A5] mt-2.5 font-normal">
          {isEn
            ? 'When you send money outside of the U.S. or its territories, the term "receiver" means your Final Receiver and the terms "transaction" or "transfer" mean the payment transfer transactions governed by KIN Remittance Disclosures and CFPB 12 CFR Part 1005.'
            : 'Al enviar dinero fuera de los EE. UU. o sus territorios, el término "destinatario" significa su Destinatario Final y los términos "transacción" o "envío" se rigen por la Ley de Transferencias de Remesas de la CFPB (12 CFR Parte 1005) y las normativas de Banco de México.'}
        </p>

        {/* Pills de Certificación Rápida */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200/60 dark:border-white/5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {isEn ? 'SPEI Instant Rail' : 'Riel SPEI en Segundos'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
            <span>🛡️</span>
            {isEn ? '30-Min Cancellation' : 'Cancelación en 30 Min'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
            <span>🔒</span>
            {isEn ? 'AES-256 Vault' : 'Bóveda Cifrada'}
          </span>
        </div>

        {/* Acordeón Plegable con las 6 Cláusulas Regulatorias */}
        {isExpanded && (
          <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-white/10 space-y-3 animate-fade-in">
            {/* Cláusula 1: SPEI & Bancos */}
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-600 dark:text-[#8E91A5]">
              <span className="font-financial-mono font-bold text-emerald-600 dark:text-[#2ED5A4] shrink-0">01</span>
              <div>
                <strong className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  {isEn ? 'Real-time transfers & bank network' : 'Transferencias en tiempo real y red bancaria'}
                </strong>
                {isEn
                  ? 'Real-time transfers are available via Banxico SPEI to BBVA Bancomer, Banamex, Santander, Banco Azteca, BanCoppel, HSBC, Scotiabank and other registered Mexican institutions (24/7/365). Cash pickups at participating locations (OXXO, Bodega Aurrera, Walmart) are subject to store hours. Certain transfers may experience delays due to regulatory compliance or anti-fraud verification.'
                  : 'Las transferencias se acreditan en tiempo real vía SPEI Banco de México a BBVA, Citibanamex, Santander, Banco Azteca, BanCoppel, HSBC, Scotiabank y demás entidades bancarias mexicanas (24/7/365). Los retiros en efectivo en comercios afiliados (OXXO, Bodega Aurrera, Walmart) se rigen por horarios de sucursal. Los fondos pueden experimentar demoras en caso de revisiones de prevención de fraude o validación de identidad.'}
              </div>
            </div>

            {/* Cláusula 2: Transparencia Cambiaria CFPB */}
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-600 dark:text-[#8E91A5]">
              <span className="font-financial-mono font-bold text-emerald-600 dark:text-[#2ED5A4] shrink-0">02</span>
              <div>
                <strong className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  {isEn ? 'Currency exchange transparency & fees' : 'Transparencia cambiaria y comisiones'}
                </strong>
                {isEn
                  ? 'KIN generates revenue from transfer service fees and currency exchange spread (FX markup). When choosing a money transmitter, compare both transfer fees and exchange rates. Exchange rates and fees are locked and guaranteed at the moment of authorization with zero unexpected deductions upon arrival.'
                  : 'KIN obtiene ingresos de las tarifas por servicio y del diferencial de tipo de cambio (spread FX). Al elegir un transmisor de dinero, compare tanto las comisiones como el tipo de cambio. La tasa y tarifas quedan congeladas y garantizadas al momento de autorizar, garantizando que el receptor reciba el 100% íntegro.'}
              </div>
            </div>

            {/* Cláusula 3: Cargos Bancarios de Emisor de Tarjeta */}
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-600 dark:text-[#8E91A5]">
              <span className="font-financial-mono font-bold text-emerald-600 dark:text-[#2ED5A4] shrink-0">03</span>
              <div>
                <strong className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  {isEn ? 'Card issuer & banking fees' : 'Cargos de bancos emisores de tarjeta'}
                </strong>
                {isEn
                  ? 'If funding via credit card, your financial institution may assess cash advance charges and interest. You can avoid cash advance fees by using a debit card or your KIN Digital Wallet balance.'
                  : 'Si financia la transferencia con tarjeta de crédito, su institución bancaria en EE. UU. podría aplicar comisiones por disposición de efectivo e intereses. Puede evitar estos cargos adicionales utilizando tarjeta de débito o su saldo KIN Digital Wallet.'}
              </div>
            </div>

            {/* Cláusula 4: Derecho de Cancelación en 30 Minutos */}
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-600 dark:text-[#8E91A5]">
              <span className="font-financial-mono font-bold text-emerald-600 dark:text-[#2ED5A4] shrink-0">04</span>
              <div>
                <strong className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  {isEn ? '30-Minute cancellation guarantee (CFPB 12 CFR § 1005.34)' : 'Garantía de cancelación en 30 minutos (CFPB 12 CFR § 1005.34)'}
                </strong>
                {isEn
                  ? 'Under federal law, you have the right to cancel your remittance transfer for a 100% full refund of all funds and fees paid within 30 minutes of authorization, provided the funds have not already been picked up or deposited into the recipient’s bank account.'
                  : 'Por mandato de la ley federal de EE. UU., usted tiene derecho a cancelar su remesa para recibir un reembolso íntegro del 100% de fondos y tarifas pagadas dentro de los 30 minutos posteriores a la autorización, siempre y cuando el dinero no haya sido ya cobrado en efectivo o depositado en la cuenta del destinatario.'}
              </div>
            </div>

            {/* Cláusula 5: Privacidad GLBA y Bóveda Zero-Knowledge */}
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-600 dark:text-[#8E91A5]">
              <span className="font-financial-mono font-bold text-emerald-600 dark:text-[#2ED5A4] shrink-0">05</span>
              <div>
                <strong className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  {isEn ? 'ClientVault privacy & Zero-Knowledge encryption' : 'Privacidad ClientVault y cifrado Zero-Knowledge'}
                </strong>
                {isEn
                  ? 'Your financial information is protected under the Gramm-Leach-Bliley Act (GLBA) and FinCEN BSA regulations. Sensitive payment card numbers are encrypted locally with AES-GCM-256; card credentials are never sold or stored unencrypted.'
                  : 'Su información financiera y personal está blindada bajo la ley GLBA y las normativas de confidencialidad de FinCEN. Los datos de pago están cifrados en su dispositivo con AES-GCM-256; sus números de tarjeta jamás son comercializados ni almacenados en texto plano.'}
              </div>
            </div>

            {/* Cláusula 6: Aclaraciones y Organismos Reguladores */}
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-600 dark:text-[#8E91A5]">
              <span className="font-financial-mono font-bold text-emerald-600 dark:text-[#2ED5A4] shrink-0">06</span>
              <div>
                <strong className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  {isEn ? 'Error resolution & regulatory inquiries' : 'Resolución de errores y contacto con autoridades'}
                </strong>
                {isEn
                  ? 'For transfer inquiries or claims, contact KIN Support within 180 days. You may also contact the Consumer Financial Protection Bureau (CFPB) at (855) 411-2372 (consumerfinance.gov) or in Mexico, CONDUSEF at 55 5340 0999 (condusef.gob.mx).'
                  : 'Para cualquier aclaración o reclamo, contacte a soporte KIN dentro de los 180 días posteriores al envío. También puede comunicarse con la Oficina para la Protección Financiera del Consumidor (CFPB) de EE. UU. al (855) 411-2372 (consumerfinance.gov) o en México ante la CONDUSEF al 55 5340 0999 (condusef.gob.mx).'}
              </div>
            </div>

            {/* Botón de Apertura de la Hoja Oficial Detallada */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-white/40 font-mono">
                REG-E-1005 • BANXICO-SPEI-2026
              </span>
              <button
                type="button"
                onClick={() => setIsSheetOpen(true)}
                className="text-xs font-bold text-emerald-600 dark:text-[#2ED5A4] hover:underline flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
              >
                <span>{isEn ? 'Open Full Compliance Dossier' : 'Ver Dossier Regulatorio Completo'}</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. HOJA COMPLETA DE CUMPLIMIENTO REGULATORIO (ESTILO APPLE / PORTAL Z-200) */}
      {/* ========================================================================= */}
      {isMounted && isSheetOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 overflow-hidden animate-fade-in"
          onClick={() => setIsSheetOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="compliance-dossier-title"
        >
          {/* Tarjeta / Drawer Nativo Estilo Apple Sheet */}
          <div
            className="relative w-full max-w-[430px] max-h-[92vh] bg-gradient-to-b from-[#111625] via-[#0D111D] to-[#080B11] border-t sm:border border-white/15 rounded-t-[32px] sm:rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.95),_0_0_40px_rgba(46,213,164,0.08)] flex flex-col overflow-hidden text-white animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pill Grabber Ergonómico para móviles */}
            <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mt-2.5 mb-1.5 shrink-0 select-none sm:hidden" />

            {/* Header del Dossier: < | KinLogo | Status de Certificación */}
            <header className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  className="btn-circle"
                  title={isEn ? 'Close' : 'Cerrar'}
                >
                  <ChevronLeftIcon className="w-5 h-5 text-white" />
                </button>
                <KinLogo size={32} />
              </div>

              <div className="text-center">
                <h2 id="compliance-dossier-title" className="text-xs font-black uppercase tracking-wider text-white">
                  {isEn ? 'Remittance Legal Disclosures' : 'Dossier Legal y Regulatorio'}
                </h2>
                <span className="text-[9px] font-mono text-[#2ED5A4] flex items-center justify-center gap-1">
                  <span>CFPB 12 CFR 1005</span>
                  <span>•</span>
                  <span>Banxico SPEI</span>
                </span>
              </div>

              <div className="w-8 flex justify-end">
                <span className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4] flex items-center justify-center text-xs">
                  ⚖️
                </span>
              </div>
            </header>

            {/* Contenido Scrolleable con Diseño Bento y Micro-Detalles */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs leading-relaxed scrollbar-thin">
              {/* Tarjeta de Resumen Ejecutivo y Derechos del Consumidor */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-[#2ED5A4] shrink-0" />
                  <span className="text-xs font-black text-white">
                    {isEn ? 'Federal Consumer Protection Seal' : 'Sello Federal de Protección al Remitente'}
                  </span>
                </div>
                <p className="text-[11px] text-[#A6ADC8] leading-relaxed">
                  {isEn
                    ? 'Transfers originating in the United States and routed to Mexico are protected by federal statutes. You are entitled to transparent pre-payment cost disclosures, clear FX margins, and 30 minutes of guaranteed cancellation.'
                    : 'Las transferencias con origen en los Estados Unidos y destino en México están tuteladas por leyes federales. El remitente tiene derecho inalienable a desglose previo de costos, transparencia en el tipo de cambio y 30 minutos de cancelación sin costo.'}
                </p>
              </div>

              {/* Bento 1: SPEI en Tiempo Real y Red Bancaria */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#2ED5A4]">account_balance</span>
                    <span className="text-xs font-bold text-white">
                      {isEn ? '1. Banxico SPEI Settlement' : '1. Liquidación SPEI Banco de México'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#2ED5A4] text-[9px] font-mono font-bold">
                    &lt; 30s SLA
                  </span>
                </div>
                <p className="text-[11px] text-[#8E91A5]">
                  {isEn
                    ? 'Electronic bank transfers are routed directly through the Sistema de Pagos Electrónicos Interbancarios (SPEI) operated by Banco de México. Real-time availability applies to BBVA, Banamex, Azteca, Santander, BanCoppel, HSBC, and all registered banks 24 hours a day, 365 days a year.'
                    : 'Las transferencias interbancarias se dispersan por el Sistema de Pagos Electrónicos Interbancarios (SPEI) de Banco de México en tiempo real las 24 horas del día hacia BBVA, Citibanamex, Azteca, Santander, BanCoppel, HSBC y demás bancos regulados.'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">{isEn ? 'Participating banks:' : 'Bancos participantes:'}</span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold">BBVA</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold">Citibanamex</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold">Azteca</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold">BanCoppel</span>
                  </div>
                </div>
              </div>

              {/* Bento 2: Transparencia Cambiaria CFPB */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#2ED5A4]">currency_exchange</span>
                    <span className="text-xs font-bold text-white">
                      {isEn ? '2. FX Margin & Transparent Pricing' : '2. Margen FX y Tasa de Cambio Transparente'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[9px] font-mono">
                    Zero Hidden Fees
                  </span>
                </div>
                <p className="text-[11px] text-[#8E91A5]">
                  {isEn
                    ? 'KIN publishes guaranteed exchange rates before authorization. KIN derives income through service fees and the foreign exchange spread. Your beneficiary in Mexico will receive the exact displayed amount without destination bank deductions.'
                    : 'KIN muestra la tasa garantizada antes de pagar. KIN obtiene ingresos a través de la comisión de servicio y el spread cambiario. Su familiar en México recibe el monto íntegro en pesos sin comisiones imprevistas en ventanilla o sucursal.'}
                </p>
              </div>

              {/* Bento 3: Garantía de Cancelación de 30 Minutos */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#2ED5A4]">schedule</span>
                    <span className="text-xs font-bold text-white">
                      {isEn ? '3. 30-Minute Federal Cancellation' : '3. Derecho de Cancelación en 30 Minutos'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#2ED5A4] text-[9px] font-mono font-bold">
                    100% Refund
                  </span>
                </div>
                <p className="text-[11px] text-[#8E91A5]">
                  {isEn
                    ? 'Pursuant to 12 CFR § 1005.34, you have 30 minutes from payment authorization to cancel for a full refund of principal and fees, provided the funds have not been picked up or credited to the receiver.'
                    : 'Conforme a la sección 12 CFR § 1005.34 de la ley de EE. UU., usted cuenta con 30 minutos tras autorizar el pago para solicitar la cancelación y reembolso total (capital y tarifas), salvo que los fondos ya hayan sido entregados o abonados en cuenta.'}
                </p>
              </div>

              {/* Bento 4: Cifrado Zero-Knowledge y Privacidad GLBA */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#2ED5A4]">lock</span>
                    <span className="text-xs font-bold text-white">
                      {isEn ? '4. ClientVault Encryption & Privacy' : '4. Privacidad GLBA y Bóveda Criptográfica'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[9px] font-mono">
                    AES-GCM-256
                  </span>
                </div>
                <p className="text-[11px] text-[#8E91A5]">
                  {isEn
                    ? 'Payment instruments are isolated on-device via AES-GCM-256 ClientVault. Personal financial data is governed under the Gramm-Leach-Bliley Act (GLBA) and FinCEN anti-money laundering regulations.'
                    : 'Sus instrumentos de pago se resguardan de forma local mediante la Bóveda ClientVault con cifrado militar AES-GCM-256. Sus datos personales no se comercializan bajo ninguna circunstancia, cumpliendo la ley GLBA.'}
                </p>
              </div>

              {/* Bento 5: Contacto con Autoridades Reguladoras */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#2ED5A4]">help_center</span>
                  <span className="text-xs font-bold text-white">
                    {isEn ? '5. Regulatory Contact & Error Resolution' : '5. Autoridades Reguladoras y Aclaraciones'}
                  </span>
                </div>
                <p className="text-[11px] text-[#8E91A5]">
                  {isEn
                    ? 'For inquiries or claims, contact KIN Support within 180 days. You may also contact federal supervisory agencies directly:'
                    : 'Para cualquier aclaración, contacte a KIN dentro de los primeros 180 días. También puede contactar a las entidades supervisoras oficiales:'}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://www.consumerfinance.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 text-[10px] text-slate-300 hover:text-white transition-all flex flex-col group cursor-pointer"
                  >
                    <span className="font-bold text-white group-hover:text-[#2ED5A4]">CFPB (EE. UU.)</span>
                    <span className="text-slate-400 font-mono mt-0.5">(855) 411-2372</span>
                    <span className="text-[9px] text-[#2ED5A4] mt-1 flex items-center gap-0.5">
                      consumerfinance.gov ↗
                    </span>
                  </a>
                  <a
                    href="https://www.condusef.gob.mx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 text-[10px] text-slate-300 hover:text-white transition-all flex flex-col group cursor-pointer"
                  >
                    <span className="font-bold text-white group-hover:text-[#2ED5A4]">CONDUSEF (México)</span>
                    <span className="text-slate-400 font-mono mt-0.5">55 5340 0999</span>
                    <span className="text-[9px] text-[#2ED5A4] mt-1 flex items-center gap-0.5">
                      condusef.gob.mx ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer con Botón Táctil de Aprobación */}
            <footer className="p-4 border-t border-white/10 shrink-0 bg-[#0A0D14]/90 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#2ED5A4] to-[#18A57E] text-slate-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isEn ? 'I Understand and Agree' : 'Entendido y Conforme'}</span>
              </button>
            </footer>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
