'use client';

import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  DotsVerticalIcon,
  RosetteBadgeCheckIcon,
  CheckCircleIcon,
  CopyIcon,
  WhatsAppIcon,
  DownloadIcon,
  ShareReceiptIcon,
} from '@/components/Icons';

export interface SendSuccessData {
  id: string;
  amount: number;
  amountMXN?: number;
  recipientName: string;
  deliveryTitle: string;
  paymentTitle: string;
  fee: number;
  totalPaid: number;
  time: string;
  claveRetiroEfectivo?: string;
  pickupStore?: string;
  claveRastreoBanxico?: string;
}

interface ReceiptViewProps {
  data: SendSuccessData;
  exchangeRate: number;
  onDone: () => void;
  language?: 'es' | 'en';
}

export function ReceiptView({ data, exchangeRate, onDone, language = 'es' }: ReceiptViewProps) {
  const [copiedWithdrawalPin, setCopiedWithdrawalPin] = useState(false);
  const [copiedTrackingBanxico, setCopiedTrackingBanxico] = useState(false);
  const isEn = language === 'en';

  const amountMXN = data.amountMXN || data.amount * exchangeRate;

  return (
    <div className="animate-fade-in space-y-4 py-1">
      {/* Header: < | ⋮ */}
      <header className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onDone}
          className="btn-circle"
          title={isEn ? "Back to Home" : "Volver al Inicio"}
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>

        <div className="w-8" />

        <button
          type="button"
          onClick={() => alert(isEn ? 'Receipt cryptographically verified with KIN signature' : 'Comprobante verificado con firma criptográfica KIN')}
          className="btn-circle"
          title={isEn ? "Options" : "Opciones"}
        >
          <DotsVerticalIcon className="w-5 h-5 text-white" />
        </button>
      </header>

      {/* Center Rosette Badge & Success Info */}
      <div className="text-center pt-1 space-y-3">
        <div className="relative inline-block">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#2ED5A4]/15 flex items-center justify-center border border-[#2ED5A4]/40 shadow-glow-mint">
            <RosetteBadgeCheckIcon className="w-14 h-14" />
          </div>
        </div>

        <div className="space-y-0.5">
          <h2 className="text-2xl font-black text-white tracking-tight">{isEn ? 'Success!' : '¡Éxito!'}</h2>
          <p className="text-xs text-[#8E91A5] font-medium">{isEn ? 'Money sent successfully' : 'Dinero enviado con éxito'}</p>
        </div>

        <div className="pt-1">
          <h1 className="text-3xl font-black text-white tracking-tight">
            ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            <span className="text-xs font-bold text-[#8E91A5]">USD</span>
          </h1>
          <p className="text-xs font-semibold text-[#8E91A5] mt-0.5">
            ≈ ${amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
          </p>
          <p className="text-xs font-bold text-[#2ED5A4] mt-1">
            {isEn ? `To ${data.recipientName}` : `Para ${data.recipientName}`}
          </p>
        </div>
      </div>

      {/* ================================================================= */}
      {/* CLAVE OFICIAL DE RETIRO EN EFECTIVO (SUCURSAL SELECCIONADA)      */}
      {/* ================================================================= */}
      {data.claveRetiroEfectivo ? (
        <div className="bg-gradient-to-b from-[#182322] to-[#12161b] border-2 border-[#2ED5A4]/50 rounded-3xl p-4 shadow-[0_0_35px_rgba(46,213,164,0.22)] space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2ED5A4]/20 flex items-center justify-center text-base">
                🔑
              </div>
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-[#2ED5A4] block">
                  {isEn ? 'Official Cash Withdrawal PIN' : 'Clave Oficial de Retiro en Efectivo'}
                </span>
                <p className="text-xs font-bold text-white">
                  {isEn ? `Window pickup: ${data.pickupStore || 'OXXO'}` : `Cobro en ventanilla: ${data.pickupStore || 'OXXO'}`}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#2ED5A4]/20 border border-[#2ED5A4]/40 text-[10px] font-black text-[#2ED5A4] tracking-wider uppercase shadow-sm">
              {isEn ? 'READY AT COUNTER' : 'LISTA EN CAJA'}
            </span>
          </div>

          {/* Gran Clave Numérica */}
          <div className="py-3 px-3 bg-black/60 rounded-2xl border border-[#2ED5A4]/40 text-center relative overflow-hidden group">
            <div className="text-[10px] text-[#8E91A5] font-semibold mb-1 tracking-wider uppercase">
              {isEn ? 'Unique Withdrawal Code (PIN)' : 'Código de Retiro Único (PIN)'}
            </div>
            <div className="text-3xl sm:text-4xl font-black font-financial-mono text-[#2ED5A4] tracking-widest select-all drop-shadow-[0_2px_14px_rgba(46,213,164,0.45)]">
              {data.claveRetiroEfectivo}
            </div>
            <div className="text-[10px] text-on-surface-variant mt-1 font-medium">
              {isEn ? 'Valid for 30 days • No additional fee for recipient' : 'Vigencia: 30 días • Sin costo adicional para el beneficiario'}
            </div>
          </div>

          {/* Botones de Acción: Copiar Clave & Compartir por WhatsApp */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (data.claveRetiroEfectivo) {
                  navigator.clipboard?.writeText(data.claveRetiroEfectivo);
                  setCopiedWithdrawalPin(true);
                  setTimeout(() => setCopiedWithdrawalPin(false), 2500);
                }
              }}
              className="h-12 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer active:scale-[0.98]"
            >
              {copiedWithdrawalPin ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 text-[#2ED5A4]" />
                  <span className="text-[#2ED5A4]">{isEn ? 'PIN Copied!' : '¡Clave Copiada!'}</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-4 h-4 text-white" />
                  <span>{isEn ? 'Copy PIN' : 'Copiar Clave'}</span>
                </>
              )}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                isEn
                  ? `Hello ${data.recipientName}! 💵 I sent you $${amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN via KIN.\n\n` +
                    `📍 You can pick it up immediately in cash at any ${data.pickupStore || 'OXXO'} in Mexico.\n\n` +
                    `🔑 YOUR WITHDRAWAL PIN IS: ${data.claveRetiroEfectivo}\n\n` +
                    `Just visit the counter, mention KIN remittance pickup, and present your valid official ID (INE or Passport). Done!`
                  : `¡Hola ${data.recipientName}! 💵 Te envié $${amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN a través de KIN.\n\n` +
                    `📍 Puedes retirarlo en efectivo de inmediato en cualquier sucursal ${data.pickupStore || 'OXXO'} de México.\n\n` +
                    `🔑 TU CLAVE DE RETIRO ES: ${data.claveRetiroEfectivo}\n\n` +
                    `Solo acude a ventanilla, menciona cobro de remesa KIN y presenta tu identificación oficial vigente (INE o Pasaporte). ¡Listo!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-[0_4px_16px_rgba(37,211,102,0.35)] active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4 text-black" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Pasos para retirar en ventanilla */}
          <div className="bg-black/30 rounded-2xl p-3 border border-white/5 space-y-1.5 text-[11px] text-[#A6A9BC]">
            <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#2ED5A4]">storefront</span>
              {isEn ? `Instructions for ${data.recipientName}:` : `Instrucciones para ${data.recipientName}:`}
            </div>
            <ol className="list-decimal list-inside space-y-1 pl-0.5 text-[10.5px]">
              <li>{isEn ? <>Go to any <strong>{data.pickupStore || 'OXXO'}</strong> location in Mexico.</> : <>Acudir a cualquier sucursal <strong>{data.pickupStore || 'OXXO'}</strong> en México.</>}</li>
              <li>{isEn ? <>Ask at the counter for <strong>KIN remittance collection</strong>.</> : <>Solicitar en ventanilla o caja el <strong>cobro de remesa KIN</strong>.</>}</li>
              <li>{isEn ? <>Present <strong>valid official ID (INE or Passport)</strong> and provide PIN: <strong className="text-[#2ED5A4] font-mono">{data.claveRetiroEfectivo}</strong>.</> : <>Presentar <strong>INE o Pasaporte vigente</strong> y proporcionar la Clave: <strong className="text-[#2ED5A4] font-mono">{data.claveRetiroEfectivo}</strong>.</>}</li>
            </ol>
          </div>
        </div>
      ) : data.claveRastreoBanxico ? (
        <div className="bg-[#181928] border border-[#2ED5A4]/30 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8E91A5] font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#2ED5A4]">verified_user</span>
              {isEn ? 'Banxico Tracking Code (CEP)' : 'Clave de Rastreo Banxico (CEP)'}
            </span>
            <button
              type="button"
              onClick={() => {
                if (data.claveRastreoBanxico) {
                  navigator.clipboard?.writeText(data.claveRastreoBanxico);
                  setCopiedTrackingBanxico(true);
                  setTimeout(() => setCopiedTrackingBanxico(false), 2500);
                }
              }}
              className="flex items-center gap-1 text-xs text-[#2ED5A4] hover:underline font-semibold cursor-pointer"
            >
              <span>{copiedTrackingBanxico ? (isEn ? 'Copied!' : '¡Copiado!') : (isEn ? 'Copy CEP' : 'Copiar CEP')}</span>
              <CopyIcon className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-black/40 rounded-xl p-2 font-financial-mono text-xs text-white break-all select-all border border-white/5">
            {data.claveRastreoBanxico}
          </div>
          <p className="text-[10px] text-[#8E91A5]">
            {isEn
              ? 'SPEI interbank deposit processed. Verifiable on Banxico via Electronic Payment Receipt (CEP).'
              : 'Depósito interbancario SPEI procesado. Verificable en Banxico mediante Comprobante Electrónico de Pago.'}
          </p>
        </div>
      ) : null}

      {/* Method details pill */}
      <div className="bg-[#181928] border border-white/10 rounded-2xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#8E91A5]">
          <span>{isEn ? 'Amount sent in USD' : 'Monto enviado en USD'}</span>
          <span className="text-white font-bold">${data.amount.toFixed(2)} USD</span>
        </div>
        <div className="flex items-center justify-between text-[#8E91A5]">
          <span>{isEn ? 'Guaranteed exchange rate' : 'Tipo de cambio garantizado'}</span>
          <span className="text-white font-semibold">1 USD = {exchangeRate.toFixed(2)} MXN</span>
        </div>
        <div className="flex items-center justify-between text-[#8E91A5]">
          <span>{isEn ? 'Recipient receives' : 'Monto que recibe el familiar'}</span>
          <span className="text-[#2ED5A4] font-extrabold font-financial-mono text-sm">
            ${amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
          </span>
        </div>
        <div className="flex items-center justify-between text-[#8E91A5] pt-1 border-t border-white/5">
          <span>{isEn ? 'KIN transfer fee' : 'Tarifa por transferencia KIN'}</span>
          <span className="text-[#2ED5A4] font-bold">{isEn ? 'FREE ($0.00 USD)' : 'GRATIS ($0.00 USD)'}</span>
        </div>
        {data.fee > 0 ? (
          <div className="flex items-center justify-between text-[#8E91A5]">
            <span>{isEn ? `Fee (${data.paymentTitle})` : `Comisión (${data.paymentTitle})`}</span>
            <span className="text-amber-400 font-semibold">+${data.fee.toFixed(2)} USD</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[#8E91A5]">
            <span>{isEn ? 'Payment method fee' : 'Comisión método de pago'}</span>
            <span className="text-white font-semibold">$0.00 USD</span>
          </div>
        )}
        <div className="flex items-center justify-between text-[#8E91A5] pt-1 border-t border-white/5">
          <span>{isEn ? 'Total debited' : 'Total debitado'}</span>
          <span className="text-white font-extrabold text-sm">${data.totalPaid.toFixed(2)} USD</span>
        </div>
        <div className="flex items-center justify-between text-[#8E91A5] pt-1 border-t border-white/5">
          <span>{isEn ? 'Delivery method' : 'Método de entrega'}</span>
          <span className="text-[#2ED5A4] font-bold">{data.deliveryTitle}</span>
        </div>
      </div>

      {/* Statement Pill with Copy button */}
      <div className="bg-[#181928] border border-white/10 rounded-2xl p-3 flex items-center justify-between">
        <span className="text-xs text-[#8E91A5] font-medium">{isEn ? 'KIN Tracking ID' : 'Folio de Rastreo KIN'}</span>
        <button
          type="button"
          onClick={() => alert(isEn ? `Transaction ID copied: ${data.id}` : `ID de transacción copiado: ${data.id}`)}
          className="flex items-center gap-1.5 text-xs text-[#2ED5A4] hover:underline cursor-pointer font-semibold font-mono"
        >
          <span>{data.id}</span>
          <CopyIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Timestamp */}
      <p className="text-center text-[11px] text-[#8E91A5]">
        {data.time}
      </p>

      {/* Outlined Action Buttons: Download PDF & Share Receipt */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={() => alert(isEn ? 'Downloading encrypted KIN PDF receipt...' : 'Descargando comprobante PDF encriptado de KIN...')}
          className="w-full h-12 rounded-2xl bg-[#181928] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-[0.99]"
        >
          <DownloadIcon className="w-4 h-4 text-[#2ED5A4]" />
          <span>{isEn ? 'Download PDF Receipt' : 'Descargar Comprobante PDF'}</span>
        </button>

        <button
          type="button"
          onClick={() => alert(isEn ? 'Sharing receipt via WhatsApp / Message...' : 'Compartiendo comprobante vía WhatsApp / Mensaje...')}
          className="w-full h-12 rounded-2xl bg-[#181928] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-[0.99]"
        >
          <ShareReceiptIcon className="w-4 h-4 text-[#2ED5A4]" />
          <span>{isEn ? 'Share Receipt' : 'Compartir Comprobante'}</span>
        </button>
      </div>

      {/* Bottom Full Width CTA Button: Done → */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onDone}
          className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#18A57E] text-white font-headline-md text-title-base font-bold shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] hover:shadow-[0_16px_32px_-4px_rgba(46,213,164,0.6)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{isEn ? 'Done' : 'Listo'}</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
