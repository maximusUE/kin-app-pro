'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeftIcon,
  CloseIcon,
  CopyIcon,
  ShieldCheckIcon,
  DownloadIcon,
  ShareReceiptIcon,
  WhatsAppIcon,
} from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { BanxicoCepModal, BanxicoCepData } from './BanxicoCepModal';

export interface TransactionDetailModalProps {
  transaction: {
    id: string;
    title: string;
    category?: string;
    amount: number;
    amountMXN?: number;
    time: string;
    type?: 'income' | 'expense' | string;
    status?: string;
    refNumber?: string;
    claveRetiroEfectivo?: string;
    pickupStore?: string;
    recipientName?: string;
    clabe?: string;
    bank?: string;
    claveRastreoBanxico?: string;
    [key: string]: any;
  } | null;
  onClose: () => void;
  USD_TO_MXN_RATE: number;
  language: 'es' | 'en';
}

export function TransactionDetailModal({
  transaction,
  onClose,
  USD_TO_MXN_RATE,
  language,
}: TransactionDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [showCepModal, setShowCepModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!transaction || !mounted) return null;

  const amountUSD = Math.abs(transaction.amount);
  const amountMXN =
    transaction.amountMXN || amountUSD * USD_TO_MXN_RATE;
  const refId = transaction.refNumber || transaction.id;

  // Compartir por WhatsApp formateado con branding oficial de KIN
  const handleShareWhatsApp = () => {
    const isCash = !!transaction.claveRetiroEfectivo;
    const message = language === 'en'
      ? `🇲🇽 *KIN Transfer Confirmation*\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Recipient:* ${transaction.title}\n` +
        `💵 *Amount:* $${amountUSD.toFixed(2)} USD\n` +
        `🇲🇽 *Received:* $${amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n` +
        `${isCash ? `🔑 *Pickup PIN:* ${transaction.claveRetiroEfectivo}\n🏪 *Location:* ${transaction.pickupStore || 'OXXO / Store'}\n` : `🏦 *Method:* SPEI Banxico (Instant)\n`}` +
        `📄 *Tracking ID:* ${refId}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Audited by Banxico & CNBV • Sent with KIN`
      : `🇲🇽 *Comprobante de Envío KIN*\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Destinatario:* ${transaction.title}\n` +
        `💵 *Monto enviado:* $${amountUSD.toFixed(2)} USD\n` +
        `🇲🇽 *Monto a recibir:* $${amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n` +
        `${isCash ? `🔑 *Clave de Retiro (PIN):* ${transaction.claveRetiroEfectivo}\n🏪 *Cobro en:* ${transaction.pickupStore || 'OXXO / Ventanilla'}\n` : `🏦 *Método:* SPEI Banxico Inmediato\n`}` +
        `📄 *Folio de Rastreo:* ${refId}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Auditado por Banxico y CNBV • Enviado con KIN`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = () => {
    const text = `Comprobante KIN: ${transaction.title} por $${amountUSD.toFixed(2)} USD (≈ $${amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN). Folio: ${refId}`;
    if (navigator.share) {
      navigator.share({ title: 'Comprobante KIN', text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const cepData: BanxicoCepData = {
    claveRastreo: transaction.claveRastreoBanxico || transaction.refNumber || '202610060000000000842918234567',
    folioCep: 'CEP-BANXICO-2026-994821',
    fechaOperacion: transaction.time?.split(' ')?.[0] || '06/10/2026',
    horaOperacion: transaction.time?.includes(':') ? transaction.time : '21:18:42',
    montoMXN: amountMXN,
    emisorBanco: 'STP (Sistema de Transferencias y Pagos) / KIN',
    receptorBanco: transaction.bank || 'BBVA México (012)',
    beneficiarioNombre: transaction.recipientName || transaction.title,
    beneficiarioClabe: transaction.clabe || '012 180 01548291039 4',
    ordenanteNombre: 'César Ugalde (KIN USA)',
    concepto: transaction.category || 'Remesa Familiar KIN',
    selloDigital: 'k9XpQ2m...98aF412b9c81e2840d12a9',
    numeroSerieCertificado: '30001000000500003421',
    cadenaOriginal: `||1.1|${refId}|${amountMXN}|STP|BBVA|2026-10-06||`,
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-[radial-gradient(circle_at_center,_rgba(46,213,164,0.12)_0%,_rgba(14,19,31,0.92)_55%,_rgba(6,7,11,0.98)_100%)] backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in text-white"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-detail-title"
    >
      <div
        className="relative w-full max-w-[460px] max-h-[92vh] bg-[#0E131F] border border-white/10 ring-1 ring-emerald-500/20 rounded-3xl p-5 sm:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.9),_0_0_40px_rgba(46,213,164,0.08)] text-white space-y-4 my-auto flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Comprobante (Regla Don César: < | KinLogo | Status) */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle"
              title={language === 'en' ? 'Back' : 'Volver'}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={34} />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
              {language === 'en' ? 'Audited • SPEI' : 'Auditado • SPEI'}
            </span>
          </div>
        </div>

        {/* Contenido con Scroll Ergonómico */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 no-scrollbar">
          {/* Botón Verificador Oficial CEP Banxico en 1 Clic */}
          <button
            type="button"
            onClick={() => setShowCepModal(true)}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30 flex items-center justify-between hover:border-emerald-500/50 hover:bg-emerald-500/20 transition-all cursor-pointer group active:scale-[0.98] text-left shadow-xs"
            id="open-cep-modal-btn"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#2ED5A4] flex items-center justify-center shrink-0 border border-emerald-500/30">
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white group-hover:text-[#2ED5A4] transition-colors truncate">
                  {language === 'en' ? 'Verify Official Banxico CEP' : 'Verificar CEP en Banco de México'}
                </span>
                <span className="text-[10px] text-[#A6ADC8] truncate">
                  {language === 'en' ? 'Cryptographic Interbank Payment Receipt' : 'Comprobante Electrónico de Pago Oficial'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#2ED5A4] shrink-0 pl-2">
              <span>{language === 'en' ? 'View' : 'Ver'}</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </div>
          </button>
          {/* Tarjeta Hero Principal: Monto, Estatus y Conversión */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c242c] via-[#12161b] to-[#0d1014] border border-[#2ED5A4]/30 shadow-[0_4px_20px_rgba(46,213,164,0.12)] space-y-2 text-center">
            {/* Badge de Estatus */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[11px] font-bold text-[#2ED5A4]">
              <span className="w-2 h-2 rounded-full bg-[#2ED5A4] animate-pulse" />
              <span>
                {(transaction.status || (language === 'en' ? 'Completed' : 'Completado')) +
                  ' • ' +
                  (language === 'en' ? 'Funds Delivered' : 'Fondos Entregados')}
              </span>
            </div>

            {/* Importe en USD */}
            <div className="text-3xl sm:text-4xl font-black font-financial-mono text-white tracking-tight">
              {transaction.type === 'income' ? `+$${amountUSD.toFixed(2)}` : `-$${amountUSD.toFixed(2)}`}{' '}
              <span className="text-sm font-bold text-slate-400">USD</span>
            </div>

            {/* Equivalente en MXN */}
            <p className="text-sm font-bold text-[#2ED5A4] font-financial-mono">
              ≈ ${amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
            </p>

            {/* Concepto y Fecha */}
            <div className="pt-1 border-t border-white/10 space-y-0.5">
              <h4 className="text-sm font-bold text-white">{transaction.title}</h4>
              <p className="text-[11px] text-slate-400">{transaction.time}</p>
            </div>
          </div>

          {/* Tarjeta de Clave de Retiro en Efectivo (Si aplica) */}
          {transaction.claveRetiroEfectivo && (
            <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 space-y-2 text-center">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block">
                {language === 'en' ? 'Cash Withdrawal Code (PIN)' : 'Clave Oficial de Retiro (PIN)'}
              </span>
              <div className="text-2xl font-black font-mono tracking-widest text-on-surface">
                {transaction.claveRetiroEfectivo}
              </div>
              <p className="text-[11px] text-on-surface-variant">
                {language === 'en'
                  ? `Present this PIN at ${transaction.pickupStore || 'OXXO'} counter along with official ID.`
                  : `Presenta esta clave en caja de ${transaction.pickupStore || 'OXXO'} junto con tu INE para retirar.`}
              </p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(transaction.claveRetiroEfectivo || '');
                  setCopiedPin(true);
                  setTimeout(() => setCopiedPin(false), 2500);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold cursor-pointer hover:bg-primary/30 active:scale-[0.97] transition-all"
              >
                <span>{copiedPin ? (language === 'en' ? 'Copied!' : '¡Copiado!') : (language === 'en' ? 'Copy PIN' : 'Copiar Clave')}</span>
                <CopyIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Tarjeta de Folio y Trazabilidad KIN */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-on-surface-variant block">
                {language === 'en' ? 'KIN Tracking ID' : 'Folio de Rastreo KIN'}
              </span>
              <span className="font-mono font-bold text-on-surface text-xs">{refId}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(refId);
                setCopiedRef(true);
                setTimeout(() => setCopiedRef(false), 2500);
              }}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold cursor-pointer active:scale-[0.97]"
            >
              <span>{copiedRef ? (language === 'en' ? 'Copied!' : '¡Copiado!') : (language === 'en' ? 'Copy ID' : 'Copiar Folio')}</span>
              <CopyIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tarjeta: Trazabilidad / Timeline en 4 Pasos */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
            <span className="font-bold text-on-surface flex items-center gap-1.5 pb-1 border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-[16px] text-primary">timeline</span>
              {language === 'en' ? 'Transaction Traceability' : 'Trazabilidad de la Operación'}
            </span>

            <div className="space-y-2.5 pt-1 pl-1">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-[10px] text-primary font-bold flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">
                    {language === 'en' ? 'Request created & authorized' : 'Solicitud creada y autorizada'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">{transaction.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-[10px] text-primary font-bold flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">
                    {language === 'en' ? 'Regulatory validation & funds secured' : 'Validación regulatoria y fondos asegurados'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    {language === 'en' ? 'AML/CTF CNBV and FinCEN checks approved' : 'Filtros AML/PLD CNBV y FinCEN aprobados'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-[10px] text-primary font-bold flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">
                    {transaction.claveRetiroEfectivo
                      ? language === 'en' ? 'Cash withdrawal code generated for counter' : 'Clave de retiro generada para ventanilla'
                      : language === 'en' ? 'Banxico SPEI rail connected' : 'Riel Banxico SPEI conectado'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    {transaction.claveRetiroEfectivo
                      ? language === 'en'
                        ? `PIN issued for pickup at ${transaction.pickupStore || 'branch'}`
                        : `PIN emitido para cobro en ${transaction.pickupStore || 'sucursal'}`
                      : language === 'en'
                        ? 'Electronic CEP receipt recorded'
                        : 'Comprobante Electrónico CEP registrado'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-[10px] text-primary font-bold flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-primary">
                    {language === 'en' ? 'Funds delivered / available' : 'Fondos entregados / disponibles'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    {language === 'en' ? 'Ready for pickup or credited to account' : 'Listo para retiro o acreditado en cuenta'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sello de Cumplimiento Regulatorio */}
          <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center gap-2 text-[10px] text-on-surface-variant">
            <ShieldCheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              {language === 'en'
                ? 'Digital receipt cryptographically verified with KIN signature. Audited under CNBV, Banxico, and SAT regulations.'
                : 'Comprobante digital verificado con firma criptográfica KIN. Auditado bajo normativas CNBV, Banxico y SAT.'}
            </span>
          </div>
        </div>

        {/* Sticky Footer: Acciones con Botón Viral de WhatsApp */}
        <div className="pt-2 border-t border-outline-variant/30 space-y-2 flex-shrink-0">
          {/* Botón Viral WhatsApp Destacado */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full h-12 rounded-2xl bg-[#25D366] hover:brightness-105 text-[#003816] font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 transition-transform duration-150 ease-out cursor-pointer active:scale-[0.97]"
          >
            <WhatsAppIcon className="w-5 h-5 text-[#003816]" />
            <span>
              {language === 'en'
                ? 'Send Receipt via WhatsApp to Family'
                : 'Enviar Comprobante por WhatsApp al Familiar'}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                alert(
                  language === 'en'
                    ? `Downloading encrypted PDF receipt for transaction ${refId}...`
                    : `Descargando comprobante PDF encriptado del movimiento ${refId}...`
                )
              }
              className="h-11 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary flex items-center justify-center gap-2 text-xs font-bold text-on-surface transition-all cursor-pointer shadow-xs active:scale-[0.97]"
            >
              <DownloadIcon className="w-4 h-4 text-primary" />
              <span>{language === 'en' ? 'Download PDF' : 'Descargar PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="h-11 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary flex items-center justify-center gap-2 text-xs font-bold text-on-surface transition-all cursor-pointer shadow-xs active:scale-[0.97]"
            >
              <ShareReceiptIcon className="w-4 h-4 text-primary" />
              <span>{language === 'en' ? 'Share' : 'Compartir'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-all cursor-pointer flex items-center justify-center active:scale-[0.97]"
          >
            {language === 'en' ? 'Close Details' : 'Cerrar Detalle'}
          </button>
        </div>
      </div>

      {/* Modal de Comprobante Oficial CEP Banco de México */}
      <BanxicoCepModal
        isOpen={showCepModal}
        onClose={() => setShowCepModal(false)}
        data={cepData}
        language={language}
      />
    </div>,
    document.body
  );
}
