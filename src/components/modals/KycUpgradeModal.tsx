'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface KycUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: string;
  language?: 'es' | 'en';
}

export function KycUpgradeModal({
  isOpen,
  onClose,
  currentTier = 'Tier 1',
  language = 'es',
}: KycUpgradeModalProps) {
  const [mounted, setMounted] = useState(false);
  const [upgrading, setUpgrading] = useState<boolean>(false);
  const [upgraded, setUpgraded] = useState<boolean>(false);
  const isEn = language === 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSimulateUpgrade = () => {
    setUpgrading(true);
    setTimeout(() => {
      setUpgrading(false);
      setUpgraded(true);
      toast.success(
        isEn
          ? 'KYC Tier 2 verified! Daily limit increased to $3,000 USD'
          : '¡Nivel 2 KYC verificado! Límite diario incrementado a $3,000 USD'
      );
    }, 1800);
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
            <span className="material-symbols-outlined text-[14px]">military_tech</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-extrabold">
              {upgraded ? 'Tier 2 Verificado' : currentTier}
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 scrollbar-none">
          {/* Hero Section */}
          <div className="text-left">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEn ? 'Verification Levels (KYC)' : 'Niveles de Verificación KYC'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isEn
                ? 'Increase your daily transfer and remittance limits securely under CNBV & FinCEN compliance.'
                : 'Aumenta tus límites de envío y retiro conforme a normas oficiales de CNBV y FinCEN.'}
            </p>
          </div>

          {/* Tier Cards Stack */}
          <div className="space-y-3">
            {/* Tier 1 Card */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-[#141824] border border-slate-200/80 dark:border-white/10 space-y-2 text-xs shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-[#2ED5A4] flex items-center justify-center font-extrabold text-xs">
                    1
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                      {isEn ? 'Tier 1 — Basic' : 'Nivel 1 — Básico'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn ? 'Phone & Email verified' : 'Teléfono y Correo verificados'}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-[#2ED5A4] text-[10px] font-extrabold">
                  {isEn ? 'Active ✓' : 'Activo ✓'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>{isEn ? 'Daily limit:' : 'Límite diario:'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">$1,000.00 USD</span>
              </div>
            </div>

            {/* Tier 2 Card */}
            <div
              className={`p-4 rounded-2xl border transition-all text-xs space-y-2 shadow-xs ${
                upgraded
                  ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-500/30'
                  : 'bg-slate-50/90 dark:bg-[#141824] border-slate-200/80 dark:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-xs">
                    2
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                      {isEn ? 'Tier 2 — Advanced' : 'Nivel 2 — Avanzado'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn ? 'Official Photo ID (INE or Passport)' : 'Identificación oficial (INE o Pasaporte)'}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    upgraded
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-[#2ED5A4]'
                      : 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {upgraded ? (isEn ? 'Unlocked ✓' : 'Desbloqueado ✓') : (isEn ? 'Recommended' : 'Recomendado')}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>{isEn ? 'Daily limit:' : 'Límite diario:'}</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-[#2ED5A4]">$3,000.00 USD</span>
              </div>
            </div>

            {/* Tier 3 Card */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-[#141824] border border-slate-200/80 dark:border-white/10 space-y-2 text-xs opacity-85 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-extrabold text-xs">
                    3
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                      {isEn ? 'Tier 3 — Premier VIP' : 'Nivel 3 — Premier VIP'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn ? 'Proof of Income (W-2, ITIN, Paystub)' : 'Comprobante de ingresos (W-2, ITIN, Nómina)'}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold">
                  {isEn ? 'Available' : 'Disponible'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>{isEn ? 'Daily limit:' : 'Límite diario:'}</span>
                <span className="font-mono font-bold text-purple-700 dark:text-purple-400">$10,000.00 USD</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 pb-4">
            {!upgraded ? (
              <button
                type="button"
                onClick={handleSimulateUpgrade}
                disabled={upgrading}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#2ED5A4] to-[#18A57E] hover:opacity-95 text-slate-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
              >
                {upgrading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    <span>{isEn ? 'Verifying with AI Vision...' : 'Verificando documento con IA...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                    <span>{isEn ? 'Scan ID & Unlock Tier 2 ($3,000)' : 'Escanear INE y Desbloquear Nivel 2 ($3,000)'}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600 dark:text-[#2ED5A4]">check_circle</span>
                <span>{isEn ? 'Done' : 'Entendido'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
