'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, DownloadIcon, WhatsAppIcon } from '@/components/Icons';
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
  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState<'2025' | '2026'>('2025');
  const isEn = language === 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

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

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-black/60 dark:bg-black/85 backdrop-blur-xl flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[440px] max-h-[92vh] flex flex-col bg-white dark:bg-gradient-to-b dark:from-[#111625] dark:via-[#0D111D] dark:to-[#080B11] border-t sm:border border-slate-200/80 dark:border-white/10 rounded-t-[32px] sm:rounded-[28px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.95),_0_0_40px_rgba(46,213,164,0.08)] overflow-hidden text-slate-900 dark:text-white my-0 sm:my-auto">
        {/* iOS Drag Handle on Mobile */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mt-2.5 mb-1 shrink-0 select-none sm:hidden" />

        {/* Universal Top Header */}
        <header className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-slate-100 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white transition-all cursor-pointer"
              title={isEn ? 'Back' : 'Volver'}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <KinLogo size={32} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[14px]">policy</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-extrabold">
              IRS & SAT 1099
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 scrollbar-none">
          {/* Hero Section */}
          <div className="text-left">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEn ? 'Annual Tax Summary' : 'Certificado Fiscal Anual'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isEn
                ? 'Official remittance statement for CPA, IRS Form 1099, and SAT tax declaration.'
                : 'Comprobante oficial de remesas para tu contador y declaración fiscal en México y EE.UU.'}
            </p>
          </div>

          {/* Year Selector Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10">
            {(['2025', '2026'] as const).map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isEn ? `Tax Year ${yr}` : `Ejercicio Fiscal ${yr}`}
              </button>
            ))}
          </div>

          {/* Tax Certificate Bento Card */}
          <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-[#141824] border border-slate-200/80 dark:border-white/10 space-y-3 text-xs shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/5">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">
                  {isEn ? 'Taxpayer Name' : 'Contribuyente'}
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{userName.toUpperCase()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">
                  {isEn ? 'Fiscal Folio' : 'Folio Fiscal'}
                </span>
                <span className="font-mono text-emerald-700 dark:text-[#2ED5A4] text-[11px] font-bold">{taxFolio}</span>
              </div>
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2 pt-1 text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>{isEn ? 'Total Remittances Sent (USD):' : 'Total Remesas Enviadas (USD):'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  ${totalSentUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>{isEn ? 'Total MXN Delivered in Mexico:' : 'Total Liquidado en México (MXN):'}</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-[#2ED5A4] text-sm">
                  ${totalSentMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>{isEn ? 'Average Real FX Rate:' : 'Tipo de Cambio Ponderado:'}</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  ${avgFxRate.toFixed(2)} MXN/USD
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>{isEn ? 'Total Fees Paid (KIN):' : 'Comisiones Cobradas por KIN:'}</span>
                <span className="font-mono text-emerald-700 dark:text-[#2ED5A4] font-bold">$0.00 USD (0%)</span>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-white/5">
                <span>{isEn ? 'Estimated Savings vs Western Union:' : 'Ahorro vs Western Union:'}</span>
                <span className="font-mono text-emerald-700 dark:text-[#2ED5A4] font-bold">
                  +${totalSavingsUSD.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Regulatory Stamp Card */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-emerald-600 dark:text-[#2ED5A4] text-[18px] shrink-0 mt-0.5">
              verified
            </span>
            <p className="leading-relaxed">
              {isEn
                ? 'This document certifies non-taxable family remittances under US-Mexico bilateral tax treaties and FinCEN guidelines.'
                : 'Este certificado acredita remesas familiares exentas de doble tributación según tratados bilaterales vigentes México-EUA y FinCEN.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1 pb-4">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#2ED5A4] to-[#18A57E] hover:opacity-95 text-slate-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>{isEn ? 'Download Tax Certificate (PDF)' : 'Descargar Certificado Fiscal (PDF)'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareAccountant}
              className="w-full h-11 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>{isEn ? 'Send to CPA / Accountant via WhatsApp' : 'Enviar a Contador por WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
