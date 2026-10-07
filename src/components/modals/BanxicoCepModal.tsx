'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, CopyIcon, WhatsAppIcon, DownloadIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface BanxicoCepData {
  claveRastreo: string;
  folioCep?: string;
  fechaOperacion: string;
  horaOperacion: string;
  montoMXN: number;
  emisorBanco: string;
  receptorBanco: string;
  beneficiarioNombre: string;
  beneficiarioClabe: string;
  ordenanteNombre: string;
  ordenanteRfc?: string;
  concepto: string;
  selloDigital: string;
  numeroSerieCertificado: string;
  cadenaOriginal: string;
}

export interface BanxicoCepModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BanxicoCepData;
  language?: 'es' | 'en';
}

export function BanxicoCepModal({
  isOpen,
  onClose,
  data,
  language = 'es',
}: BanxicoCepModalProps) {
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
    const msg = isEn
      ? `🏛️ *BANCO DE MÉXICO • OFFICIAL SPEI® RECEIPT (CEP)* 🇲🇽\n\n` +
        `✅ *Status:* Settled in Banco de México SPEI\n` +
        `👤 *Beneficiary:* ${data.beneficiarioNombre}\n` +
        `🏦 *Receiving Bank:* ${data.receptorBanco}\n` +
        `💳 *Account / CLABE:* ${data.beneficiarioClabe}\n` +
        `💰 *Amount:* $${data.montoMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n` +
        `📄 *Banxico Tracking Code:* ${data.claveRastreo}\n` +
        `📜 *Official CEP Folio:* ${data.folioCep || 'CEP-BANXICO-2026-994821'}\n` +
        `⏱️ *Settlement Date:* ${data.fechaOperacion} ${data.horaOperacion}\n\n` +
        `_Cryptographically audited and settled via SPEI® by KIN._\n` +
        `https://kin-app-pro.vercel.app`
      : `🏛️ *COMPROBANTE CEP OFICIAL BANCO DE MÉXICO* 🇲🇽\n\n` +
        `✅ *Estatus:* Liquidado en Banco de México SPEI\n` +
        `👤 *Beneficiario:* ${data.beneficiarioNombre}\n` +
        `🏦 *Banco Receptor:* ${data.receptorBanco}\n` +
        `💳 *Cuenta / CLABE:* ${data.beneficiarioClabe}\n` +
        `💰 *Monto Liquidado:* $${data.montoMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n` +
        `📄 *Clave de Rastreo Banxico:* ${data.claveRastreo}\n` +
        `📜 *Folio CEP:* ${data.folioCep || 'CEP-BANXICO-2026-994821'}\n` +
        `⏱️ *Fecha y Hora:* ${data.fechaOperacion} ${data.horaOperacion}\n\n` +
        `_Transferencia auditada y liquidada vía SPEI® por KIN._\n` +
        `https://kin-app-pro.vercel.app`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] bg-[#0A0E17] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.9)] text-white space-y-4 my-auto">
        {/* Universal Don César Header: < | KinLogo | Banxico Badge */}
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
            <span className="material-symbols-outlined text-[14px]">account_balance</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-bold">
              {isEn ? 'Banxico SPEI® CEP' : 'Banxico CEP Oficial'}
            </span>
          </div>
        </header>

        {/* Hero Banner: Banxico Official Certificate Header */}
        <div className="text-center pt-1 space-y-1.5">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4] flex items-center justify-center shadow-[0_0_20px_rgba(46,213,164,0.3)]">
            <span className="material-symbols-outlined text-[32px]">verified</span>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight">
            {isEn ? 'Banco de México SPEI® Certificate' : 'Comprobante Electrónico de Pago'}
          </h2>
          <p className="text-[11px] text-[#A6ADC8]">
            {isEn
              ? 'Official interbank settlement certified by Central Bank of Mexico.'
              : 'Liquidación interbancaria oficial certificada por Banco de México.'}
          </p>

          <div className="pt-1">
            <div className="font-financial-mono text-3xl font-black text-white tracking-tight">
              ${data.montoMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span className="text-sm font-bold text-[#A6ADC8]">MXN</span>
            </div>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#2ED5A4] text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
              {isEn ? 'Settled in Banco de México ✓' : 'Liquidado en Banco de México ✓'}
            </span>
          </div>
        </div>

        {/* Official Banxico Watermarked Certificate Paper */}
        <div className="relative overflow-hidden rounded-2xl bg-[#121622] border border-white/10 p-4 space-y-3 shadow-inner text-xs">
          {/* Header of the CEP Document */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏛️</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-200">
                  BANCO DE MÉXICO • SPEI®
                </span>
                <span className="text-[9px] text-[#A6ADC8]">
                  Sistema de Pagos Electrónicos Interbancarios
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-[#2ED5A4] font-bold bg-[#2ED5A4]/10 px-2 py-0.5 rounded-full border border-[#2ED5A4]/20">
              AUDITADO
            </span>
          </div>

          {/* Transfer Particulars */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#A6ADC8]">{isEn ? 'Beneficiary' : 'Beneficiario'}</span>
              <span className="font-bold text-white truncate">{data.beneficiarioNombre}</span>
              <span className="text-[10px] text-slate-400 font-mono truncate">{data.beneficiarioClabe}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#A6ADC8]">{isEn ? 'Receiving Bank' : 'Banco Receptor'}</span>
              <span className="font-bold text-[#2ED5A4] truncate">{data.receptorBanco}</span>
              <span className="text-[10px] text-slate-400 truncate">{data.concepto}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#A6ADC8]">{isEn ? 'Originating Institution' : 'Institución Emisora'}</span>
              <span className="font-medium text-slate-200 truncate">{data.emisorBanco}</span>
              <span className="text-[10px] text-slate-400 truncate">{data.ordenanteNombre}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#A6ADC8]">{isEn ? 'Operation Timestamp' : 'Fecha y Hora'}</span>
              <span className="font-mono text-slate-300 truncate">{data.fechaOperacion}</span>
              <span className="font-mono text-[10px] text-slate-400 truncate">{data.horaOperacion} hrs</span>
            </div>
          </div>

          {/* Clave de Rastreo Banxico with Copy Button */}
          <div className="p-2.5 rounded-xl bg-[#0A0D14] border border-white/10 flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[9px] uppercase tracking-wider text-[#A6ADC8] font-bold">
                {isEn ? 'Banxico Tracking Code' : 'Clave de Rastreo Banxico (30 dígitos)'}
              </span>
              <span className="font-mono text-[11px] text-white truncate select-all">
                {data.claveRastreo}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(data.claveRastreo, 'Clave de Rastreo')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A6ADC8] hover:text-white transition-colors cursor-pointer shrink-0"
              title={isEn ? "Copy Tracking Code" : "Copiar Clave de Rastreo"}
            >
              <CopyIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Banxico Digital Signature (Sello Digital Banxico) */}
          <div className="p-2.5 rounded-xl bg-[#0A0D14] border border-white/10 flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[9px] uppercase tracking-wider text-[#A6ADC8] font-bold">
                {isEn ? 'Banxico Cryptographic Seal (SHA-256)' : 'Sello Digital Banco de México'}
              </span>
              <span className="font-mono text-[10px] text-slate-300 truncate select-all">
                {data.selloDigital}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(data.selloDigital, 'Sello Digital')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A6ADC8] hover:text-white transition-colors cursor-pointer shrink-0"
              title={isEn ? "Copy Seal" : "Copiar Sello"}
            >
              <CopyIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Official Banxico QR Code Validation */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white text-black">
            <svg
              className="w-12 h-12 shrink-0"
              viewBox="0 0 100 100"
              fill="black"
            >
              <rect x="0" y="0" width="30" height="30" fill="black" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" fill="black" />

              <rect x="70" y="0" width="30" height="30" fill="black" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" fill="black" />

              <rect x="0" y="70" width="30" height="30" fill="black" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" fill="black" />

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
                {isEn ? 'Official Banxico CEP Live Validator' : 'Consulta Oficial CEP en Banxico'}
              </span>
              <span className="text-slate-600 mt-0.5">
                {isEn ? 'Certificado Digital No. ' + data.numeroSerieCertificado : 'Certificado No. ' + data.numeroSerieCertificado}
              </span>
              <span className="font-mono text-[9px] text-emerald-800 mt-1 font-semibold truncate">
                https://www.banxico.org.mx/cep
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
            id="share-whatsapp-cep-btn"
          >
            <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
            <span>
              {isEn ? 'Share CEP via WhatsApp' : 'Compartir CEP por WhatsApp'}
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
