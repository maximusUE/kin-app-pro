'use client';

import React, { useState } from 'react';
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
  const [upgrading, setUpgrading] = useState<boolean>(false);
  const [upgraded, setUpgraded] = useState<boolean>(false);
  const isEn = language === 'en';

  if (!isOpen) return null;

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
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto scrollbar-none bg-[#0E131F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.95)] text-white space-y-4 my-auto">
        {/* Universal Don César Header: < | KinLogo | Tier Badge */}
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
            <span className="material-symbols-outlined text-[13px]">military_tech</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
              {upgraded ? 'Tier 2 Verificado' : currentTier}
            </span>
          </div>
        </header>

        {/* Title */}
        <div className="text-center pt-1">
          <h2 className="text-xl font-black text-white tracking-tight">
            {isEn ? 'Verification Levels' : 'Niveles de Verificación KYC'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isEn
              ? 'Increase your daily transfer and remittance limits securely'
              : 'Aumenta tus límites de envío y retiro conforme a normas CNBV y FinCEN'}
          </p>
        </div>

        {/* Tier Cards Stack */}
        <div className="space-y-3">
          {/* Tier 1 Card */}
          <div className="p-4 rounded-2xl bg-[#141624] border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-[#2ED5A4] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <span className="font-bold text-white block">
                    {isEn ? 'Tier 1 — Basic' : 'Nivel 1 — Básico'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isEn ? 'Phone & Email verified' : 'Teléfono y Correo verificados'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#2ED5A4] text-[10px] font-bold">
                {isEn ? 'Active ✓' : 'Activo ✓'}
              </span>
            </div>
            <div className="pt-1 text-[11px] text-slate-300 flex items-center justify-between">
              <span>{isEn ? 'Daily limit:' : 'Límite diario:'}</span>
              <span className="font-mono font-bold text-white">$1,000.00 USD</span>
            </div>
          </div>

          {/* Tier 2 Card */}
          <div
            className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
              upgraded
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-[#141624] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <span className="font-bold text-white block">
                    {isEn ? 'Tier 2 — Advanced' : 'Nivel 2 — Avanzado'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isEn ? 'Official Photo ID (INE or Passport)' : 'Identificación oficial (INE o Pasaporte)'}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  upgraded
                    ? 'bg-emerald-500/20 text-[#2ED5A4]'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {upgraded ? (isEn ? 'Unlocked ✓' : 'Desbloqueado ✓') : (isEn ? 'Recommended' : 'Recomendado')}
              </span>
            </div>
            <div className="pt-1 text-[11px] text-slate-300 flex items-center justify-between">
              <span>{isEn ? 'Daily limit:' : 'Límite diario:'}</span>
              <span className="font-mono font-bold text-[#2ED5A4]">$3,000.00 USD</span>
            </div>
          </div>

          {/* Tier 3 Card */}
          <div className="p-4 rounded-2xl bg-[#141624] border border-white/5 space-y-2 text-xs opacity-75">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <span className="font-bold text-white block">
                    {isEn ? 'Tier 3 — Premier VIP' : 'Nivel 3 — Premier VIP'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isEn ? 'Proof of Income (W-2, ITIN, Paystub)' : 'Comprobante de ingresos (W-2, ITIN, Nómina)'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 text-[10px] font-bold">
                {isEn ? 'Available' : 'Disponible'}
              </span>
            </div>
            <div className="pt-1 text-[11px] text-slate-300 flex items-center justify-between">
              <span>{isEn ? 'Daily limit:' : 'Límite diario:'}</span>
              <span className="font-mono font-bold text-purple-400">$10,000.00 USD</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {!upgraded ? (
            <button
              type="button"
              onClick={handleSimulateUpgrade}
              disabled={upgrading}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {upgrading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
              className="w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#2ED5A4]">check_circle</span>
              <span>{isEn ? 'Done' : 'Entendido'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
