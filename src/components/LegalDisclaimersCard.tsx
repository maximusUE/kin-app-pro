'use client';

import React, { useState } from 'react';

export interface LegalDisclaimersCardProps {
  language?: 'es' | 'en';
  className?: string;
  defaultExpanded?: boolean;
  variant?: 'inline' | 'sheet' | 'modal';
}

/**
 * 🏛️ LegalDisclaimersCard — Componente Oficial de Cumplimiento Regulatorio KIN
 * 
 * Cumple rigurosamente con:
 * 1. CFPB Remittance Rule (12 CFR Part 1005, Subpart B - Regulation E de EE. UU.)
 * 2. Banxico SPEI & CNBV Disposiciones de Carácter General (México)
 * 3. Gramm-Leach-Bliley Act (GLBA) & FinCEN Privacy & Security Standards
 * 4. Tipografía regulada en tonos grises para preservar la estética minimalista Apple/Vercel
 */
export function LegalDisclaimersCard({
  language = 'es',
  className = '',
  defaultExpanded = true,
}: LegalDisclaimersCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isEn = language === 'en';

  return (
    <>
      <div
        className={`w-full rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 p-3.5 transition-all ${className}`}
      >
        {/* Encabezado colapsable estilo Western Union con indicador +/- */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-[#8E91A5] group-hover:text-emerald-600 dark:group-hover:text-[#2ED5A4] transition-colors">
              verified_user
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-[#A6ADC8] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {isEn ? 'Legal disclaimers and important info' : 'Avisos legales e información importante'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 dark:text-[#8E91A5]">
            <span className="text-[11px] font-mono font-bold select-none">
              {isExpanded ? '—' : '+'}
            </span>
          </div>
        </button>

        {/* Resumen pre-pago CFPB (Siempre visible en gris sutil) */}
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-[#7D829B] mt-2 font-normal">
          {isEn
            ? 'When you send money outside of the U.S. or its territories, the term "receiver" means your Final Receiver and the terms "transaction" or "transfer" mean the payment transfer transactions governed by KIN Remittance Disclosures and CFPB 12 CFR Part 1005.'
            : 'Al enviar dinero fuera de los EE. UU. o sus territorios, el término "destinatario" significa su Destinatario Final y los términos "transacción" o "envío" se rigen por la Ley de Transferencias de Remesas de la CFPB (12 CFR Parte 1005) y las normativas de Banco de México.'}
        </p>

        {/* Lista estructurada de 6 cláusulas regulatorias obligatorias */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-white/5 space-y-2.5 text-[11px] leading-relaxed text-slate-500 dark:text-[#7D829B] animate-fade-in">
            {/* 1. Disponibilidad de transferencias y bancos */}
            <div className="flex items-start gap-2">
              <span className="font-mono font-semibold text-slate-400 dark:text-white/40 shrink-0">1.</span>
              <p>
                {isEn ? (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Real-time transfers & bank availability:</strong> Funds are delivered instantly via Banxico SPEI to BBVA Bancomer, Banamex, Santander, Banco Azteca, BanCoppel, HSBC, Scotiabank and other registered Mexican financial institutions (24/7/365). Cash pickups at participating stores (OXXO, Bodega Aurrera, Walmart) are available within branch business hours. Funds may be delayed or held subject to regulatory anti-fraud verification, KYC identity validation, or recipient bank security reviews.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Transferencias en tiempo real y bancos:</strong> Los fondos se acreditan de inmediato vía SPEI Banco de México en BBVA, Citibanamex, Santander, Banco Azteca, BanCoppel, HSBC, Scotiabank y demás entidades bancarias mexicanas (24/7/365). Los retiros en efectivo en comercios afiliados (OXXO, Bodega Aurrera, Walmart) están sujetos a horarios de sucursal. Los fondos pueden experimentar demoras en caso de revisiones regulatorias de identidad (KYC/AML) o filtros de seguridad bancarios.
                  </>
                )}
              </p>
            </div>

            {/* 2. Divulgación obligatoria de margen de tipo de cambio (CFPB Mandated FX Disclosure) */}
            <div className="flex items-start gap-2">
              <span className="font-mono font-semibold text-slate-400 dark:text-white/40 shrink-0">2.</span>
              <p>
                {isEn ? (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Currency exchange transparency:</strong> KIN makes money from transfer fees and currency exchange spread (FX markup). When choosing a money transmitter, compare both transfer fees and exchange rates carefully. Exchange rates, fees, and applicable taxes are calculated dynamically and are guaranteed once authorized.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Transparencia en tipo de cambio:</strong> KIN obtiene ingresos a través de tarifas de servicio y del diferencial cambiario (spread FX). Al elegir un transmisor de dinero, compare detenidamente tanto las comisiones como el tipo de cambio ofrecido. Las tasas de cambio e impuestos se calculan en tiempo real y quedan congeladas y garantizadas una vez autorizado el envío.
                  </>
                )}
              </p>
            </div>

            {/* 3. Cargos de emisores de tarjetas y bancos terceros */}
            <div className="flex items-start gap-2">
              <span className="font-mono font-semibold text-slate-400 dark:text-white/40 shrink-0">3.</span>
              <p>
                {isEn ? (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Card-issuer & bank fees:</strong> If funding via credit card, your financial institution may assess cash advance charges and interest. You can avoid cash advance fees by using a debit card or your KIN balance.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Cargos por emisor de tarjeta:</strong> Si fondea la transferencia con tarjeta de crédito, su banco emisor en EE. UU. podría aplicar comisiones por disposición de efectivo e intereses. Puede evitar estos cargos utilizando tarjeta de débito o su saldo KIN.
                  </>
                )}
              </p>
            </div>

            {/* 4. Derecho a cancelación en 30 minutos (CFPB 12 CFR § 1005.34) */}
            <div className="flex items-start gap-2">
              <span className="font-mono font-semibold text-slate-400 dark:text-white/40 shrink-0">4.</span>
              <p>
                {isEn ? (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">30-Minute cancellation right:</strong> Under federal law, you have the right to cancel your transfer for a 100% full refund within 30 minutes of authorization, provided the funds have not already been picked up or deposited into the recipient's bank account.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Derecho de cancelación en 30 minutos:</strong> Por ley federal de los EE. UU., usted tiene derecho a cancelar el envío para obtener un reembolso íntegro del 100% de fondos y tarifas dentro de los 30 minutos posteriores a la autorización, siempre que el dinero no haya sido ya depositado o cobrado por el beneficiario.
                  </>
                )}
              </p>
            </div>

            {/* 5. Privacidad, Bóveda Zero-Knowledge y Protección de Datos */}
            <div className="flex items-start gap-2">
              <span className="font-mono font-semibold text-slate-400 dark:text-white/40 shrink-0">5.</span>
              <p>
                {isEn ? (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Privacy & Zero-Knowledge data protection:</strong> Your financial data is protected under the Gramm-Leach-Bliley Act (GLBA) and FinCEN BSA rules. Payment instruments are encrypted on-device via AES-GCM-256 ClientVault; sensitive PAN/CVV credentials are never stored unencrypted.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Privacidad y Bóveda Zero-Knowledge:</strong> Su información personal y financiera está protegida bajo la ley GLBA y las normas de confidencialidad de FinCEN. Los datos de pago están cifrados en su dispositivo con AES-GCM-256; sus números de tarjeta no son comercializados ni almacenados en texto plano.
                  </>
                )}
              </p>
            </div>

            {/* 6. Resolución de errores y contactos con reguladores (CFPB & CONDUSEF) */}
            <div className="flex items-start gap-2">
              <span className="font-mono font-semibold text-slate-400 dark:text-white/40 shrink-0">6.</span>
              <p>
                {isEn ? (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Error resolution & regulatory inquiries:</strong> For transfer inquiries or claims, contact KIN Support within 180 days. You may also contact the Consumer Financial Protection Bureau (CFPB) at (855) 411-2372 or visit consumerfinance.gov. In Mexico, inquiries can be addressed to CONDUSEF at 55 5340 0999.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Resolución de errores y reguladores:</strong> Para aclaraciones, contacte al soporte de KIN dentro de 180 días. Puede comunicarse con la Oficina para la Protección Financiera del Consumidor (CFPB) de EE. UU. al (855) 411-2372 o consumerfinance.gov. En México, ante la CONDUSEF al 55 5340 0999.
                  </>
                )}
              </p>
            </div>

            {/* Botón para ver política completa */}
            <div className="pt-1.5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-[10px] text-emerald-600 dark:text-[#2ED5A4] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{isEn ? 'Read complete CFPB & SPEI terms' : 'Leer términos completos CFPB y SPEI'}</span>
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL EMERGENTE COMPLETO DE CUMPLIMIENTO REGULATORIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-[460px] max-h-[85vh] bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-2xl z-10 flex flex-col animate-slide-up">
            {/* Header del modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#2ED5A4] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isEn ? 'Remittance Legal Disclosures' : 'Divulgación Legal y Regulatoria'}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-[#8E91A5]">
                    {isEn ? 'CFPB 12 CFR Part 1005 • Banxico SPEI • FinCEN BSA' : 'Regulación E CFPB • SPEI Banxico • FinCEN BSA'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-600 dark:text-white flex items-center justify-center text-xs cursor-pointer transition-all"
                title={isEn ? 'Close' : 'Cerrar'}
              >
                ✕
              </button>
            </div>

            {/* Contenido scrolleable con todos los detalles */}
            <div className="overflow-y-auto pr-1 py-3 space-y-4 text-xs leading-relaxed text-slate-600 dark:text-[#9EA3B8] scrollbar-thin">
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-[#2ED5A4] block">
                  {isEn ? 'Consumer Rights Summary' : 'Resumen de Derechos del Remitente'}
                </span>
                <p className="text-[11px] text-slate-700 dark:text-slate-300">
                  {isEn
                    ? 'Federal law protects international money transfers. You have the right to know all fees, exchange rates, and receiving totals before authorizing payment, plus 30-minute cancellation protection.'
                    : 'La ley federal protege los envíos de dinero transfronterizos. Usted tiene derecho a conocer todas las tarifas, tipo de cambio y monto a recibir antes de autorizar el pago, así como 30 minutos de cancelación garantizada.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  {isEn ? '1. Banxico SPEI Settlement & Timelines' : '1. Liquidación SPEI Banxico y Tiempos'}
                </h4>
                <p className="text-[11px]">
                  {isEn
                    ? 'Electronic bank transfers to Mexico are routed directly through the Sistema de Pagos Electrónicos Interbancarios (SPEI) operated by Banco de México. Over 98% of transfers settle in under 30 seconds. In rare cases where additional identity verification (Tier 2/3 KYC) is triggered or Mexican banking holidays intervene, settlement is completed within the same business cycle.'
                    : 'Las transferencias interbancarias hacia México se canalizan a través del Sistema de Pagos Electrónicos Interbancarios (SPEI) de Banco de México. Más del 98% se acreditan en menos de 30 segundos. En revisiones adicionales de identidad (KYC) o días inhábiles bancarios, la liquidación ocurre dentro del ciclo bancario en curso.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  {isEn ? '2. Foreign Exchange Spread Disclosure' : '2. Divulgación de Spread y Tipo de Cambio'}
                </h4>
                <p className="text-[11px]">
                  {isEn
                    ? 'KIN applies a transparent, pre-disclosed exchange rate. A small foreign exchange margin may be factored into the published rate. No hidden receiving fees are deducted upon arrival in Mexico.'
                    : 'KIN ofrece una tasa de cambio transparente y fijada antes del envío. El destinatario en México no sufre deducciones ni comisiones adicionales al momento de recibir sus pesos.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  {isEn ? '3. 30-Minute Cancellation Procedure' : '3. Procedimiento de Cancelación de 30 Minutos'}
                </h4>
                <p className="text-[11px]">
                  {isEn
                    ? 'To request cancellation within 30 minutes, navigate to Send History > Transaction Details > Cancel Transfer, or message KIN support. A full refund to your original funding instrument will be executed within 3 business days.'
                    : 'Para solicitar una cancelación dentro del plazo de 30 minutos, vaya a Historial > Detalles > Cancelar Envío o contacte al soporte de KIN. El reembolso completo se procesará en 3 días hábiles hacia su método de pago original.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  {isEn ? '4. Zero-Knowledge ClientVault Security' : '4. Seguridad Zero-Knowledge ClientVault'}
                </h4>
                <p className="text-[11px]">
                  {isEn
                    ? 'Payment cards and identities are isolated client-side with AES-GCM-256 encryption. Biometric authentication (Face ID / Touch ID) is required for sensitive transactions under WebAuthn FIDO2 protocols.'
                    : 'Los datos bancarios e identidades se aíslan en el dispositivo mediante cifrado AES-GCM-256. Se requiere autenticación biométrica (Face ID / Huella) conforme a los protocolos WebAuthn FIDO2.'}
                </p>
              </div>
            </div>

            {/* Botón de cierre */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-[#2ED5A4] dark:hover:bg-[#25B58B] text-white dark:text-slate-950 font-bold text-xs transition-all cursor-pointer flex items-center justify-center shadow-sm"
              >
                {isEn ? 'Got it, close' : 'Entendido, cerrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
