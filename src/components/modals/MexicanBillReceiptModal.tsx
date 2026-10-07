'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, CopyIcon, WhatsAppIcon, DownloadIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface MexicanBillReceiptData {
  serviceName: string;
  serviceCategory: string;
  companyName: string;
  accountHolder: string;
  location: string;
  contractNumber: string;
  billingCycle: string;
  amountMXN: number;
  amountUSD: number;
  feeUSD: number;
  totalUSD: number;
  exchangeRate: number;
  satUuid: string;
  banxicoTracking: string;
  timestamp: string;
  cardBrand?: string;
  cardLast4?: string;
  iconName?: string;
}

export interface MexicanBillReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MexicanBillReceiptData;
  language?: 'es' | 'en';
}

export function MexicanBillReceiptModal({
  isOpen,
  onClose,
  data,
  language = 'es',
}: MexicanBillReceiptModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const isEn = language === 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !data) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(isEn ? `${label} copied to clipboard!` : `¡${label} copiado al portapapeles!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleShareWhatsApp = () => {
    const formattedDate = new Date().toLocaleString(isEn ? 'en-US' : 'es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const msg = isEn
      ? `⚡ *OFFICIAL KIN BILL PAYMENT RECEIPT* 🇲🇽\n\n` +
        `✅ *Service:* ${data.serviceName} (${data.companyName})\n` +
        `🏠 *Account Holder:* ${data.accountHolder} (${data.location})\n` +
        `📄 *Account / Contract #:* ${data.contractNumber}\n` +
        `💰 *Amount Paid:* $${data.amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN ($${data.totalUSD.toFixed(2)} USD)\n` +
        `🏛️ *SAT CFDI UUID:* ${data.satUuid}\n` +
        `🏦 *Banxico SPEI Tracking:* ${data.banxicoTracking}\n` +
        `⏱️ *Settlement Date:* ${formattedDate}\n` +
        `✨ *Status:* Settled in Real Time via Banxico SPEI\n\n` +
        `_Receipt officially paid from USA with KIN. Zero hidden fees._\n` +
        `https://kin-app-pro.vercel.app`
      : `⚡ *COMPROBANTE OFICIAL DE PAGO KIN* 🇲🇽\n\n` +
        `✅ *Servicio:* ${data.serviceName} (${data.companyName})\n` +
        `🏠 *Titular:* ${data.accountHolder} (${data.location})\n` +
        `📄 *Contrato / No. Servicio:* ${data.contractNumber}\n` +
        `💰 *Monto Liquidado:* $${data.amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN ($${data.totalUSD.toFixed(2)} USD)\n` +
        `🏛️ *Folio Fiscal SAT:* ${data.satUuid}\n` +
        `🏦 *Clave de Rastreo Banxico:* ${data.banxicoTracking}\n` +
        `⏱️ *Fecha de Liquidación:* ${formattedDate}\n` +
        `✨ *Estatus:* Liquidado en Tiempo Real vía SPEI Banxico ✓\n\n` +
        `_Tu recibo ha sido pagado y timbrado con éxito desde USA con KIN._\n` +
        `https://kin-app-pro.vercel.app`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] bg-[#0E131F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.9)] text-white space-y-4 my-auto">
        {/* Universal Don César Header: < | KinLogo | Fiscal Badge */}
        <header className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle"
              title={isEn ? "Back" : "Volver"}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={34} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-bold">
              {isEn ? 'Official SAT Receipt' : 'Timbrado Oficial SAT'}
            </span>
          </div>
        </header>

        {/* Success Rosette Hero */}
        <div className="text-center pt-1 space-y-1.5">
          <div className="relative inline-block">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#2ED5A4]/15 flex items-center justify-center border border-[#2ED5A4]/40 shadow-[0_0_24px_rgba(46,213,164,0.35)]">
              <span className="material-symbols-outlined text-[36px] text-[#2ED5A4]">check_circle</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {isEn ? 'Utility Bill Settled!' : '¡Servicio Liquidado con Éxito!'}
          </h2>
          <p className="text-xs text-[#A6ADC8]">
            {isEn
              ? `Real-time SPEI settlement confirmed with ${data.companyName}.`
              : `Liquidación SPEI confirmada en tiempo real con ${data.companyName}.`}
          </p>

          <div className="pt-2">
            <div className="font-financial-mono text-3xl font-black text-white tracking-tight">
              ${data.amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span className="text-sm font-bold text-[#A6ADC8]">MXN</span>
            </div>
            <p className="text-xs font-semibold text-[#2ED5A4] mt-0.5">
              ≈ ${data.totalUSD.toFixed(2)} USD {isEn ? 'charged (includes $1.99 KIN fee)' : 'cobrados (tarifa KIN $1.99 incluida)'}
            </p>
          </div>
        </div>

        {/* SAT Official Stamp Voucher Card (Watermarked Paper Texture) */}
        <div className="relative overflow-hidden rounded-2xl bg-[#14141F] border border-white/10 p-4 space-y-3 shadow-inner">
          {/* Official Fiscal Ribbon */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇲🇽</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                  SAT • CFDI 4.0 FISCAL
                </span>
                <span className="text-[9px] text-[#A6ADC8]">
                  Servicio de Administración Tributaria
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#2ED5A4] text-[9px] font-mono font-bold">
              VALIDADO ✓
            </span>
          </div>

          {/* Service Particulars */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#A6ADC8]">{isEn ? 'Service / Entity' : 'Servicio / Empresa'}</span>
              <span className="font-bold text-white truncate">{data.serviceName}</span>
              <span className="text-[10px] text-slate-400 truncate">{data.companyName}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#A6ADC8]">{isEn ? 'Account Holder' : 'Titular Registrado'}</span>
              <span className="font-bold text-white truncate">{data.accountHolder}</span>
              <span className="text-[10px] text-slate-400 truncate">{data.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#A6ADC8]">{isEn ? 'Contract / Service #' : 'No. Servicio / Contrato'}</span>
              <span className="font-mono font-bold text-[#2ED5A4] truncate">{data.contractNumber}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#A6ADC8]">{isEn ? 'Billing Cycle' : 'Ciclo de Facturación'}</span>
              <span className="font-mono text-slate-300 truncate">{data.billingCycle}</span>
            </div>
          </div>

          {/* Folio Fiscal UUID with Copy */}
          <div className="p-2.5 rounded-xl bg-[#181825] border border-white/10 flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[9px] uppercase tracking-wider text-[#A6ADC8] font-bold">
                {isEn ? 'SAT Fiscal Folio (UUID)' : 'Folio Fiscal SAT (UUID)'}
              </span>
              <span className="font-mono text-[11px] text-white truncate select-all">
                {data.satUuid}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(data.satUuid, 'Folio Fiscal')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A6ADC8] hover:text-white transition-colors cursor-pointer shrink-0"
              title={isEn ? "Copy UUID" : "Copiar Folio Fiscal"}
            >
              <CopyIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Banxico SPEI Tracking with Copy */}
          <div className="p-2.5 rounded-xl bg-[#181825] border border-white/10 flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[9px] uppercase tracking-wider text-[#A6ADC8] font-bold">
                {isEn ? 'Banxico SPEI Tracking Key' : 'Clave de Rastreo Banxico SPEI'}
              </span>
              <span className="font-mono text-[11px] text-white truncate select-all">
                {data.banxicoTracking}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(data.banxicoTracking, 'Clave Banxico')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A6ADC8] hover:text-white transition-colors cursor-pointer shrink-0"
              title={isEn ? "Copy Banxico Tracking" : "Copiar Clave de Rastreo"}
            >
              <CopyIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vectorial SAT QR Code Representation */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white text-black">
            <svg
              className="w-12 h-12 shrink-0"
              viewBox="0 0 100 100"
              fill="black"
            >
              {/* Outer border & position markers */}
              <rect x="0" y="0" width="30" height="30" fill="black" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" fill="black" />

              <rect x="70" y="0" width="30" height="30" fill="black" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" fill="black" />

              <rect x="0" y="70" width="30" height="30" fill="black" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" fill="black" />

              {/* Data pattern simulation */}
              <rect x="36" y="8" width="6" height="6" />
              <rect x="48" y="14" width="8" height="6" />
              <rect x="36" y="24" width="6" height="8" />
              <rect x="12" y="40" width="6" height="12" />
              <rect x="24" y="44" width="10" height="6" />
              <rect x="40" y="40" width="20" height="20" />
              <rect x="44" y="44" width="12" height="12" fill="white" />
              <rect x="48" y="48" width="4" height="4" fill="black" />
              <rect x="68" y="38" width="8" height="12" />
              <rect x="82" y="42" width="10" height="6" />
              <rect x="38" y="68" width="12" height="6" />
              <rect x="56" y="72" width="8" height="14" />
              <rect x="72" y="68" width="14" height="8" />
              <rect x="82" y="82" width="10" height="10" />
            </svg>

            <div className="flex flex-col text-[10px] leading-tight">
              <span className="font-bold text-slate-900">
                {isEn ? 'Official Fiscal CFDI Verification' : 'Verificación Fiscal CFDI en Línea'}
              </span>
              <span className="text-slate-600 mt-0.5">
                {isEn ? 'Scan to verify authenticity directly at sat.gob.mx' : 'Escanea para verificar autenticidad directamente en sat.gob.mx'}
              </span>
              <span className="font-mono text-[9px] text-emerald-800 mt-1 font-semibold truncate">
                https://verificacfdi.facturaelectronica.sat.gob.mx
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: 1-Tap WhatsApp Share & Print / Done */}
        <div className="space-y-2.5 pt-1">
          {/* Primary Action: 1-Tap WhatsApp Share */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-headline-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(37,211,102,0.4)] transition-all cursor-pointer active:scale-95 px-4 whitespace-nowrap"
            id="share-whatsapp-receipt-btn"
          >
            <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
            <span>
              {isEn ? 'Share via WhatsApp' : 'Compartir por WhatsApp'}
            </span>
          </button>

          {/* Secondary Action: Print / PDF and Done */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>{isEn ? 'Print / PDF' : 'Imprimir / PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-full bg-[#2ED5A4] hover:bg-[#28b88e] text-neutral-950 font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <span>{isEn ? 'Done' : 'Listo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
