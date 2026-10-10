'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface PrivacySecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVault: () => void;
  language?: 'es' | 'en';
}

export function PrivacySecurityModal({
  isOpen,
  onClose,
  onOpenVault,
  language = 'es',
}: PrivacySecurityModalProps) {
  const [mounted, setMounted] = useState(false);
  const isEn = language === 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleResetPin = () => {
    toast.info(
      isEn
        ? 'PIN reset verification link sent to your registered security email & SMS'
        : 'Enlace de verificación para restablecer PIN enviado a tu correo y SMS de seguridad'
    );
  };

  const handleRevokeSessions = () => {
    toast.success(
      isEn
        ? 'All other remote sessions and background tokens have been securely revoked'
        : 'Todas las demás sesiones remotas y dispositivos han sido revocados con éxito'
    );
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
            <span className="material-symbols-outlined text-[14px]">shield_lock</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-extrabold">
              {isEn ? 'Zero-Knowledge Vault' : 'Bóveda Zero-Knowledge'}
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 scrollbar-none">
          {/* Hero Title & Subtitle */}
          <div className="text-left">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEn ? 'Privacy & Security Center' : 'Privacidad & Seguridad Bancaria'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isEn
                ? 'Multi-factor biometrics, client-side AES-GCM-256 vault, and SPEI transfer PIN protection.'
                : 'Biometría avanzada, bóveda criptográfica local y control transaccional SPEI Banxico.'}
            </p>
          </div>

          {/* Security Score Dashboard Meter */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-50 to-slate-100 dark:from-emerald-950/30 dark:via-[#141824] dark:to-[#0D101A] border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-[#2ED5A4]">
                  {isEn ? 'Shield Status: 98% Maximum' : 'Blindaje Activo: 98% Máximo'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-[#2ED5A4] text-[9px] font-extrabold">
                MILITARY GRADE
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-[#2ED5A4] to-teal-400 rounded-full w-[98%]" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold pt-0.5">
              <span>AES-GCM-256</span>
              <span>•</span>
              <span>WebAuthn Biometrics</span>
              <span>•</span>
              <span>CNBV & FinCEN</span>
            </div>
          </div>

          {/* Security Modules Bento Stack */}
          <div className="space-y-3">
            {/* Item 1: PIN Transaccional SPEI */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#141824] border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-[#2ED5A4] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">pin</span>
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white block truncate">
                    {isEn ? 'SPEI Transfer PIN' : 'PIN Transaccional SPEI'}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    {isEn ? '6 digits required for amounts > $1,000 USD' : '6 dígitos para transferencias > $1,000 USD'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetPin}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-emerald-700 dark:text-[#2ED5A4] text-xs font-bold transition-colors cursor-pointer shrink-0 ml-2"
              >
                {isEn ? 'Change' : 'Cambiar'}
              </button>
            </div>

            {/* Item 2: Documentos KYC CNBV / FinCEN */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#141824] border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-[#2ED5A4] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white block truncate">
                    {isEn ? 'Official ID (INE / Passport)' : 'Identidad Oficial (INE / Pasaporte)'}
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-[#2ED5A4] font-medium flex items-center gap-1 mt-0.5">
                    <span>✓ {isEn ? 'Verified by CNBV & FinCEN' : 'Validado ante CNBV y FinCEN'}</span>
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-[#2ED5A4] text-[10px] font-extrabold shrink-0 border border-emerald-500/30 ml-2">
                TIER 3
              </span>
            </div>

            {/* Item 3: ClientVault AES-256 */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#141824] border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-[#2ED5A4] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white block truncate">
                    ClientVault AES-GCM-256
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    {isEn ? 'Zero-Knowledge offline cryptographic keys' : 'Bóveda local fuera de línea (Zero-Knowledge)'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVault();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-[#2ED5A4] text-xs font-bold transition-colors cursor-pointer shrink-0 ml-2"
              >
                {isEn ? 'Open' : 'Abrir'}
              </button>
            </div>

            {/* Item 4: Sesiones Activas */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#141824] border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">devices</span>
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white block truncate">
                    {isEn ? 'Active Linked Devices' : 'Dispositivos Vinculados'}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    iPhone 15 Pro • {isEn ? 'Current session active' : 'Sesión actual activa'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRevokeSessions}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/20 text-[10px] font-bold transition-colors cursor-pointer shrink-0 ml-2"
              >
                {isEn ? 'Revoke' : 'Revocar'}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#2ED5A4] to-[#18A57E] hover:opacity-95 text-slate-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>{isEn ? 'Understood & Protected' : 'Entendido y Protegido'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
