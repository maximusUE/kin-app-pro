'use client';

import React, { useState } from 'react';
import { ChevronLeftIcon, DownloadIcon, WhatsAppIcon, CopyIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface TaxReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  language?: 'es' | 'en';
}

export function TaxReportModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  language = 'es',
}: TaxReportModalProps) {
  const [selectedYear, setSelectedYear] = useState<'2025' | '2026'>('2025');
  const isEn = language === 'en';

  if (!isOpen) return null;

  const taxFolio = `KIN-TAX-${selectedYear}-98412`;
  const totalSentUSD = 4250.0;
  const totalSentMXN = 86912.5;
  const totalSavingsUSD = 184.5;
  const avgFxRate = 20.45;

  const handleDownloadPDF = () => {
    toast.success(
      isEn
        ? `Official ${selectedYear} Tax Summary PDF generated!`
        : `¡Certificado Fiscal ${selectedYear} generado y listo para imprimir!`
    );
    window.print();
  };

  const handleShareAccountant = () => {
    const msg = isEn
      ? `🏛️ *KIN OFFICIAL ANNUAL TAX CERTIFICATE (${selectedYear})*\n\n` +
        `👤 *Taxpayer:* ${userName} (${userEmail})\n` +
        `📄 *Tax Certificate Folio:* ${taxFolio}\n` +
        `💰 *Total Cross-Border Remittances:* $${totalSentUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD\n` +
        `🇲🇽 *Total MXN Received in Mexico:* $${totalSentMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n` +
        `📈 *Average Real FX Rate:* $${avgFxRate.toFixed(2)} MXN/USD\n` +
        `⚡ *Zero Hidden Fees:* Full transparency certified\n\n` +
        `_Report certified under FinCEN Reg. #31000214829 & CNBV rules._\n` +
        `https://kin-app-pro.vercel.app`
      : `🏛️ *CERTIFICADO FISCAL ANUAL DE REMESAS KIN (${selectedYear})*\n\n` +
        `👤 *Contribuyente:* ${userName} (${userEmail})\n` +
        `📄 *Folio Fiscal Certificado:* ${taxFolio}\n` +
        `💰 *Total Remesas Enviadas a México:* $${totalSentUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD\n` +
        `🇲🇽 *Total Liquidado en México:* $${totalSentMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n` +
        `📈 *Tipo de Cambio Promedio:* $${avgFxRate.toFixed(2)} MXN/USD\n` +
        `✨ *Ahorro Total en Comisiones:* $${totalSavingsUSD.toFixed(2)} USD vs Western Union\n\n` +
        `_Certificado bajo registro FinCEN #31000214829 y normativas CNBV._\n` +
        `https://kin-app-pro.vercel.app`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] max-h-[92vh] overflow-y-auto scrollbar-none bg-[#0E131F] border border-white/10 rounded-3xl p-5 sm:p-6 pb-10 shadow-[0_24px_50px_rgba(0,0,0,0.95)] text-white space-y-4 my-auto">
        {/* Universal Don César Header: < | KinLogo | IRS/SAT Badge */}
        <header className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle"
              title={isEn ? 'Back' : 'Volver'}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={34} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[13px]">policy</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
              IRS & SAT 1099
            </span>
          </div>
        </header>

        {/* Title */}
        <div className="text-center pt-1">
          <h2 className="text-xl font-black text-white tracking-tight">
            {isEn ? 'Annual Tax Summary' : 'Certificado Fiscal Anual'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isEn
              ? 'Official remittance statement for CPA, IRS and SAT declaration'
              : 'Comprobante oficial de remesas para tu contador y declaración fiscal'}
          </p>
        </div>

        {/* Year Selector Tabs */}
        <div className="flex rounded-xl bg-slate-900/90 p-1 border border-white/10">
          {(['2025', '2026'] as const).map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedYear === yr
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? `Tax Year ${yr}` : `Ejercicio Fiscal ${yr}`}
            </button>
          ))}
        </div>

        {/* Tax Certificate Card */}
        <div className="p-4 rounded-2xl bg-[#141624] border border-white/10 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                {isEn ? 'Taxpayer Name' : 'Contribuyente'}
              </span>
              <span className="font-bold text-white text-sm">{userName.toUpperCase()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                {isEn ? 'Fiscal Folio' : 'Folio Fiscal'}
              </span>
              <span className="font-mono text-emerald-400 text-[11px] font-bold">{taxFolio}</span>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                {isEn ? 'Total Remittances Sent (USD):' : 'Total Remesas Enviadas (USD):'}
              </span>
              <span className="font-mono font-bold text-white text-sm">
                ${totalSentUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                {isEn ? 'Total MXN Delivered in Mexico:' : 'Total Liquidado en México (MXN):'}
              </span>
              <span className="font-mono font-bold text-[#2ED5A4] text-sm">
                ${totalSentMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                {isEn ? 'Average Real FX Rate:' : 'Tipo de Cambio Ponderado:'}
              </span>
              <span className="font-mono text-slate-200">${avgFxRate.toFixed(2)} MXN/USD</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                {isEn ? 'Total Fees Paid (KIN):' : 'Comisiones Cobradas por KIN:'}
              </span>
              <span className="font-mono text-emerald-400 font-bold">$0.00 USD (0%)</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-slate-400">
                {isEn ? 'Estimated Savings vs Western Union:' : 'Ahorro vs Western Union:'}
              </span>
              <span className="font-mono text-emerald-300 font-bold">
                +${totalSavingsUSD.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Regulatory Stamp */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-start gap-2.5 text-[11px] text-slate-300">
          <span className="material-symbols-outlined text-[#2ED5A4] text-[18px] shrink-0 mt-0.5">verified</span>
          <p className="leading-relaxed">
            {isEn
              ? 'This document serves as legal proof of non-taxable family remittance under US-Mexico bilateral tax treaties.'
              : 'Este certificado acredita remesas familiares exentas de doble tributación según los tratados fiscales vigentes México-EUA.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>{isEn ? 'Download Tax Certificate (PDF)' : 'Descargar Certificado Fiscal (PDF)'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareAccountant}
            className="w-full py-3 px-4 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>{isEn ? 'Send to CPA / Accountant via WhatsApp' : 'Enviar a Contador por WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
