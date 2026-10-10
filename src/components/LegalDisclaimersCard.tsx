'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, ShieldCheckIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';

export type LegalDisclaimersVariant = 'remittance' | 'billpay' | 'wallet';

export interface LegalDisclaimersCardProps {
  language?: 'es' | 'en';
  className?: string;
  defaultExpanded?: boolean;
  variant?: LegalDisclaimersVariant;
}

/**
 * 🏛️ LegalDisclaimersCard — Componente Oficial de Cumplimiento Regulatorio KIN
 * 
 * Soporta 3 variantes especializadas:
 * 1. 'remittance' -> Envío Transfronterizo (CFPB 12 CFR Part 1005, Banxico SPEI, 30 min cancelación, margen FX).
 * 2. 'billpay'    -> Pago de Facturas (CFE/Telmex SLA 24-48h, Irreversibilidad, Comprobante SAT CFDI 4.0).
 * 3. 'wallet'     -> KIN Cash y Billetera Digital (Seguro FDIC en banco custodio, EFTA Reg E, vigencia PIN retiro 7 días).
 */
export function LegalDisclaimersCard({
  language = 'es',
  className = '',
  defaultExpanded = false,
  variant = 'remittance',
}: LegalDisclaimersCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isEn = language === 'en';

  // Contenido dinámico según la variante
  const config = {
    remittance: {
      title: isEn ? 'Legal disclaimers and important info' : 'Avisos legales e información regulatoria',
      subtitle: isEn ? 'CFPB 12 CFR Part 1005 • Banxico SPEI • GLBA Privacy' : 'CFPB Regulación E • SPEI Banxico • Privacidad GLBA',
      summary: isEn
        ? 'When you send money outside of the U.S. or its territories, the term "receiver" means your Final Receiver and the terms "transaction" or "transfer" mean the payment transfer transactions governed by KIN Remittance Disclosures and CFPB 12 CFR Part 1005.'
        : 'Al enviar dinero fuera de los EE. UU. o sus territorios, el término "destinatario" significa su Destinatario Final y los términos "transacción" o "envío" se rigen por la Ley de Transferencias de Remesas de la CFPB (12 CFR Parte 1005) y las normativas de Banco de México.',
      pills: [
        { label: isEn ? 'SPEI Instant Rail' : 'Riel SPEI en Segundos', icon: '⚡' },
        { label: isEn ? '30-Min Cancellation' : 'Cancelación en 30 Min', icon: '🛡️' },
        { label: isEn ? 'AES-256 Vault' : 'Bóveda Cifrada', icon: '🔒' },
      ],
      tag: 'REG-E-1005 • BANXICO-SPEI-2026',
      clauses: [
        {
          num: '01',
          title: isEn ? 'Real-time transfers & bank network' : 'Transferencias en tiempo real y red bancaria',
          desc: isEn
            ? 'Real-time transfers are available via Banxico SPEI to BBVA Bancomer, Banamex, Santander, Banco Azteca, BanCoppel, HSBC, Scotiabank and other registered Mexican institutions (24/7/365). Cash pickups at participating locations (OXXO, Bodega Aurrera, Walmart) are subject to store hours. Certain transfers may experience delays due to regulatory compliance or anti-fraud verification.'
            : 'Las transferencias se acreditan en tiempo real vía SPEI Banco de México a BBVA, Citibanamex, Santander, Banco Azteca, BanCoppel, HSBC, Scotiabank y demás entidades bancarias mexicanas (24/7/365). Los retiros en efectivo en comercios afiliados (OXXO, Bodega Aurrera, Walmart) se rigen por horarios de sucursal. Los fondos pueden experimentar demoras en caso de revisiones de prevención de fraude o validación de identidad.',
        },
        {
          num: '02',
          title: isEn ? 'Currency exchange transparency & fees' : 'Transparencia cambiaria y comisiones',
          desc: isEn
            ? 'KIN generates revenue from transfer service fees and currency exchange spread (FX markup). When choosing a money transmitter, compare both transfer fees and exchange rates. Exchange rates and fees are locked and guaranteed at the moment of authorization with zero unexpected deductions upon arrival.'
            : 'KIN obtiene ingresos de las tarifas por servicio y del diferencial de tipo de cambio (spread FX). Al elegir un transmisor de dinero, compare tanto las comisiones como el tipo de cambio. La tasa y tarifas quedan congeladas y garantizadas al momento de autorizar, garantizando que el receptor reciba el 100% íntegro.',
        },
        {
          num: '03',
          title: isEn ? 'Card issuer & banking fees' : 'Cargos de bancos emisores de tarjeta',
          desc: isEn
            ? 'If funding via credit card, your financial institution may assess cash advance charges and interest. You can avoid cash advance fees by using a debit card or your KIN Digital Wallet balance.'
            : 'Si financia la transferencia con tarjeta de crédito, su institución bancaria en EE. UU. podría aplicar comisiones por disposición de efectivo e intereses. Puede evitar estos cargos adicionales utilizando tarjeta de débito o su saldo KIN Digital Wallet.',
        },
        {
          num: '04',
          title: isEn ? '30-Minute cancellation guarantee (CFPB 12 CFR § 1005.34)' : 'Garantía de cancelación en 30 minutos (CFPB 12 CFR § 1005.34)',
          desc: isEn
            ? 'Under federal law, you have the right to cancel your remittance transfer for a 100% full refund of all funds and fees paid within 30 minutes of authorization, provided the funds have not already been picked up or deposited into the recipient’s bank account.'
            : 'Por mandato de la ley federal de EE. UU., usted tiene derecho a cancelar su remesa para recibir un reembolso íntegro del 100% de fondos y tarifas pagadas dentro de los 30 minutos posteriores a la autorización, siempre y cuando el dinero no haya sido ya cobrado en efectivo o depositado en la cuenta del destinatario.',
        },
        {
          num: '05',
          title: isEn ? 'ClientVault privacy & Zero-Knowledge encryption' : 'Privacidad ClientVault y cifrado Zero-Knowledge',
          desc: isEn
            ? 'Your financial information is protected under the Gramm-Leach-Bliley Act (GLBA) and FinCEN BSA regulations. Sensitive payment card numbers are encrypted locally with AES-GCM-256; card credentials are never sold or stored unencrypted.'
            : 'Su información financiera y personal está blindada bajo la ley GLBA y las normativas de confidencialidad de FinCEN. Los datos de pago están cifrados en su dispositivo con AES-GCM-256; sus números de tarjeta jamás son comercializados ni almacenados en texto plano.',
        },
        {
          num: '06',
          title: isEn ? 'Error resolution & regulatory inquiries' : 'Resolución de errores y contacto con autoridades',
          desc: isEn
            ? 'For transfer inquiries or claims, contact KIN Support within 180 days. You may also contact the Consumer Financial Protection Bureau (CFPB) at (855) 411-2372 (consumerfinance.gov) or in Mexico, CONDUSEF at 55 5340 0999 (condusef.gob.mx).'
            : 'Para cualquier aclaración o reclamo, contacte a soporte KIN dentro de los 180 días posteriores al envío. También puede comunicarse con la Oficina para la Protección Financiera del Consumidor (CFPB) de EE. UU. al (855) 411-2372 (consumerfinance.gov) o en México ante la CONDUSEF al 55 5340 0999 (condusef.gob.mx).',
        },
      ],
    },
    billpay: {
      title: isEn ? 'Utility & bill pay regulatory disclosures' : 'Avisos legales de pago de facturas y servicios',
      subtitle: isEn ? 'SLA Reconciliation • Irreversibility • Official SAT CFDI' : 'SLA de Conciliación • Irreversibilidad • Comprobante Fiscal SAT',
      summary: isEn
        ? 'Cross-border utility bill payments (CFE, Telmex, Water, Gas) are processed through automated interbank settlement rails in Mexico. Review processing timelines, cancellation limits, and official SAT invoice guidelines.'
        : 'Los pagos transfronterizos de servicios públicos en México (CFE, Telmex, agua, gas) se procesan a través de rieles interbancarios automatizados. Conozca los tiempos de conciliación, límites de cancelación y validez del comprobante fiscal.',
      pills: [
        { label: isEn ? '24-48h Utility SLA' : 'SLA 24-48h CFE/Telmex', icon: '⏱️' },
        { label: isEn ? 'Irreversible Once Paid' : 'Pago Final Irreversible', icon: '🔒' },
        { label: isEn ? 'SAT CFDI Stamped' : 'Comprobante SAT 4.0', icon: '🧾' },
      ],
      tag: 'BILLPAY-CFE-SAT-2026',
      clauses: [
        {
          num: '01',
          title: isEn ? 'Provider reconciliation timeframe (24-48 Business Hours)' : 'Tiempo de conciliación ante la empresa proveedora (24-48 Horas Hábiles)',
          desc: isEn
            ? 'KIN executes payment settlement immediately upon authorization. However, utility providers in Mexico (such as CFE, SACMEX, or Telmex) typically take between 24 and 48 business hours to reflect the payment in their administrative systems. Payments should be scheduled at least 48 hours prior to service cut-off dates.'
            : 'KIN ejecuta la dispersión del pago de forma inmediata tras su autorización. Sin embargo, las empresas suministradoras en México (como CFE, SACMEX o Telmex) demoran de 24 a 48 horas hábiles en reflejar el abono en sus sistemas comerciales. Se recomienda pagar al menos 48 horas antes de la fecha límite para evitar cortes del suministro.',
        },
        {
          num: '02',
          title: isEn ? 'Strict non-cancellation & irreversibility policy' : 'Política de no cancelación e irreversibilidad',
          desc: isEn
            ? 'Unlike person-to-person remittance transfers, utility bill payments cannot be cancelled or reversed once submitted and acknowledged by the billing clearinghouse. Please verify the service contract number and amount carefully before confirming.'
            : 'A diferencia de las remesas familiares P2P, los pagos de servicios públicos no admiten cancelación ni reversión una vez enviados y confirmados por la cámara de compensación. Verifique detenidamente el número de servicio/contrato y el monto antes de autorizar.',
        },
        {
          num: '03',
          title: isEn ? 'Legal receipt vs. Official SAT CFDI 4.0 invoice' : 'Comprobante legal KIN vs. Factura Fiscal SAT (CFDI 4.0)',
          desc: isEn
            ? 'The electronic receipt generated by KIN certifies cross-border fund disbursement and interbank tracking. The official tax-deductible invoice (CFDI 4.0) is issued directly by the utility company (e.g. CFE) under the account holder’s Mexican RFC tax ID.'
            : 'El comprobante electrónico generado por KIN acredita la dispersión financiera transfronteriza y la clave de rastreo bancario. La factura fiscal oficial deducible (CFDI 4.0) es emitida directamente por la entidad prestadora del servicio conforme al RFC del titular del contrato.',
        },
        {
          num: '04',
          title: isEn ? 'Locked FX conversion rate (USD to MXN)' : 'Tasa de conversión garantizada (USD a MXN)',
          desc: isEn
            ? 'Bills denominated in Mexican Pesos (MXN) are converted into USD using the transparent guaranteed rate shown at checkout. Zero unexpected foreign collection surcharges will be assessed upon delivery.'
            : 'Los recibos denominados en pesos mexicanos (MXN) se convierten a dólares aplicando la tasa de cambio congelada en pantalla al momento del pago. Cero comisiones imprevistas serán cobradas al beneficiario en destino.',
        },
        {
          num: '05',
          title: isEn ? 'Inquiries, claim rights & regulatory escalation' : 'Aclaraciones, reclamos y escalamiento oficial',
          desc: isEn
            ? 'Keep your KIN transaction reference ID and tracking number for any billing dispute. Inquiries can be submitted within 90 days to KIN Support, or escalated to PROFECO / CONDUSEF in Mexico.'
            : 'Conserve su folio de transacción KIN y clave de rastreo para cualquier aclaración de saldo. Puede presentar reclamos dentro de los 90 días naturales ante soporte KIN o acudir ante PROFECO / CONDUSEF en México.',
        },
      ],
    },
    wallet: {
      title: isEn ? 'Digital wallet & KIN Cash legal disclosures' : 'Avisos legales de billetera digital y KIN Cash',
      subtitle: isEn ? 'FDIC Custody • EFTA Regulation E • WebAuthn Security' : 'Custodia FDIC • EFTA Regulación E • Seguridad WebAuthn',
      summary: isEn
        ? 'Digital wallet balances and KIN Cash peer-to-peer transfers are safeguarded under the Electronic Fund Transfer Act (EFTA / Regulation E) and federal deposit custody requirements.'
        : 'Los saldos en billetera digital y envíos P2P KIN Cash están protegidos conforme a la Ley de Transferencias Electrónicas de Fondos (EFTA / Regulación E) y las normativas federales de custodia.',
      pills: [
        { label: isEn ? 'FDIC Custodial Partner' : 'Custodia Asegurada FDIC', icon: '🏛️' },
        { label: isEn ? 'EFTA Reg E Liability' : 'Protección EFTA Reg E', icon: '🛡️' },
        { label: isEn ? '7-Day PIN Validity' : 'PIN 7 Días de Vigencia', icon: '⏱️' },
      ],
      tag: 'WALLET-FDIC-EFTA-2026',
      clauses: [
        {
          num: '01',
          title: isEn ? 'FDIC Pass-Through Deposit Insurance disclosure' : 'Aviso mandatorio de seguro de depósito FDIC (Pass-Through)',
          desc: isEn
            ? 'Funds held in your KIN Digital Wallet are held in pooled custodial accounts at our FDIC-insured partner banking institution in the United States. Your deposits are eligible for FDIC insurance coverage up to $250,000 USD per depositor against bank failure.'
            : 'Los fondos en dólares mantenidos en su KIN Digital Wallet están custodiados en cuentas bancarias de depósito en nuestro banco patrocinador regulado en EE. UU. Dichos fondos son elegibles para la cobertura del seguro de depósito de la FDIC hasta por $250,000 USD por usuario contra insolvencia bancaria.',
        },
        {
          num: '02',
          title: isEn ? 'Protection against unauthorized transfers (CFPB Reg E § 1005.11)' : 'Protección ante transferencias no autorizadas (CFPB Reg E § 1005.11)',
          desc: isEn
            ? 'If you suspect unauthorized access or lost credentials, notify KIN immediately. Under federal Regulation E, if reported within 2 business days of discovery, your maximum statutory liability is limited to $50 USD.'
            : 'Si sospecha un acceso no reconocido a su cuenta o pérdida de credenciales, notifique a KIN de inmediato. Por mandato de la Regulación E federal, si reporta dentro de los 2 días hábiles posteriores a enterarse, su responsabilidad máxima por ley se limita a $50 USD.',
        },
        {
          num: '03',
          title: isEn ? 'Instant P2P transfers & recipient verification' : 'Envíos P2P inmediatos y verificación de destinatario',
          desc: isEn
            ? 'Peer-to-peer balance transfers between KIN users settle instantaneously with zero transaction fees. Verify phone numbers or $kinhandles carefully; confirmed P2P wallet transfers cannot be cancelled once accepted by the recipient.'
            : 'Las transferencias de saldo P2P entre usuarios KIN se liquidan de forma instantánea y sin comisiones. Verifique cuidadosamente el teléfono o usuario ($handle); los envíos confirmados no pueden revertirse unilateralmente una vez acreditados.',
        },
        {
          num: '04',
          title: isEn ? '7-Day validity for cash pickup PINs' : 'Vigencia de 7 días naturales para códigos de retiro en efectivo',
          desc: isEn
            ? 'PIN codes generated for cash withdrawals at merchant partners (OXXO, Bodega Aurrera) expire after 7 calendar days. If uncollected by the recipient, 100% of the funds are automatically refunded back to your KIN Digital Wallet.'
            : 'Los códigos PIN generados para retiro en efectivo en tiendas afiliadas (OXXO, Bodega Aurrera) tienen una vigencia de 7 días naturales. Si el beneficiario no acude a ventanilla en ese plazo, el 100% del dinero se reembolsa automáticamente a su billetera KIN.',
        },
        {
          num: '05',
          title: isEn ? 'Biometric security & ClientVault hardware isolation' : 'Seguridad biométrica FIDO2 y aislamiento en dispositivo',
          desc: isEn
            ? 'Card reveal, wallet freeze actions, and high-value transfers require WebAuthn hardware biometric confirmation (Face ID / Touch ID / Device PIN) and are encrypted locally via AES-GCM-256.'
            : 'El desbloqueo de datos de tarjeta, descongelamiento y envíos de alto monto requieren autenticación biométrica WebAuthn (Face ID / Huella / PIN del dispositivo) y se procesan con cifrado local AES-GCM-256.',
        },
      ],
    },
  };

  const current = config[variant] || config.remittance;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. SECCIÓN INLINE EN EL FEED (DISEÑO FINTECH PULIDO Y NO INVASIVO) */}
      {/* ========================================================================= */}
      <section
        aria-label={current.title}
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
              <span className="material-symbols-outlined text-[17px]">
                {variant === 'billpay' ? 'receipt_long' : variant === 'wallet' ? 'account_balance_wallet' : 'gavel'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#2ED5A4] transition-colors truncate">
                {current.title}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#8E91A5] truncate font-medium">
                {current.subtitle}
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
          {current.summary}
        </p>

        {/* Pills de Certificación Rápida */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200/60 dark:border-white/5">
          {current.pills.map((pill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-medium text-slate-600 dark:text-slate-300 shadow-2xs"
            >
              <span>{pill.icon}</span>
              {pill.label}
            </span>
          ))}
        </div>

        {/* Acordeón Plegable con las Cláusulas Regulatorias */}
        {isExpanded && (
          <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-white/10 space-y-3 animate-fade-in">
            {current.clauses.map((clause, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-600 dark:text-[#8E91A5]"
              >
                <span className="font-financial-mono font-bold text-emerald-600 dark:text-[#2ED5A4] shrink-0">
                  {clause.num}
                </span>
                <div>
                  <strong className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    {clause.title}
                  </strong>
                  {clause.desc}
                </div>
              </div>
            ))}

            {/* Botón de Apertura de la Hoja Oficial Detallada */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-white/40 font-mono">
                {current.tag}
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
                  {current.title}
                </h2>
                <span className="text-[9px] font-mono text-[#2ED5A4] flex items-center justify-center gap-1">
                  <span>{current.tag}</span>
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
                    {isEn ? 'Official Regulatory Certification' : 'Certificación Regulatoria Oficial'}
                  </span>
                </div>
                <p className="text-[11px] text-[#A6ADC8] leading-relaxed">
                  {current.summary}
                </p>
              </div>

              {/* Bento Cards con los puntos clave */}
              {current.clauses.map((clause, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="font-mono text-[#2ED5A4]">{clause.num}.</span>
                      {clause.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8E91A5]">
                    {clause.desc}
                  </p>
                </div>
              ))}

              {/* Footer regulatorio de contactos */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#2ED5A4]">help_center</span>
                  <span className="text-xs font-bold text-white">
                    {isEn ? 'Supervisory Contacts & Redress' : 'Organismos de Supervisión y Quejas'}
                  </span>
                </div>
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
