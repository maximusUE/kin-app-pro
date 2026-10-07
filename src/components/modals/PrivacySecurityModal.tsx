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
        ? 'PIN reset verification link sent to your registered email'
        : 'Enlace de verificación para restablecer PIN enviado a tu correo'
    );
  };

  const handleRevokeSessions = () => {
    toast.success(
      isEn
        ? 'All other remote sessions and devices revoked'
        : 'Todas las demás sesiones remotas han sido revocadas'
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-[radial-gradient(circle_at_center,_rgba(46,213,164,0.12)_0%,_rgba(14,19,31,0.92)_55%,_rgba(6,7,11,0.98)_100%)] backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] max-h-[92vh] overflow-y-auto scrollbar-none rounded-3xl bg-[#0E131F] border border-white/10 ring-1 ring-emerald-500/20 p-5 sm:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.9),_0_0_40px_rgba(46,213,164,0.08)] text-white space-y-4 my-auto">
        {/* Universal Don César Header: < | KinLogo | Badge */}
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
            <span className="material-symbols-outlined text-[13px]">shield_lock</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-bold">
              {isEn ? 'Zero-Knowledge' : 'Bóveda Cifrada'}
            </span>
          </div>
        </header>

        {/* Hero Title & Subtitle */}
        <div className="text-left pt-1">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {isEn ? 'Privacy & Security Center' : 'Privacidad y Seguridad Bancaria'}
          </h2>
          <p className="text-xs text-[#A6ADC8] mt-0.5">
            {isEn
              ? 'Multi-factor biometrics, cryptographic vaults & session controls'
              : 'Biometría avanzada, bóvedas criptográficas locales y control de sesiones'}
          </p>
        </div>

        {/* Security Modules */}
        <div className="space-y-3 pt-1">
          {/* Item 1: PIN Transaccional SPEI */}
          <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/10 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-[#2ED5A4] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">pin</span>
              </div>
              <div>
                <span className="font-bold text-sm text-white block">
                  {isEn ? 'SPEI Transfer PIN' : 'PIN Transaccional SPEI'}
                </span>
                <span className="text-[11px] text-[#A6ADC8]">
                  {isEn ? '6 digits required for amounts > $1,000 USD' : '6 dígitos para transferencias > $1,000 USD'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetPin}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#2ED5A4] text-xs font-bold transition-colors cursor-pointer"
            >
              {isEn ? 'Change' : 'Cambiar'}
            </button>
          </div>

          {/* Item 2: Documentos KYC CNBV / FinCEN */}
          <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/10 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-[#2ED5A4] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">badge</span>
              </div>
              <div>
                <span className="font-bold text-sm text-white block">
                  {isEn ? 'Official ID (INE / Passport)' : 'Identidad Oficial (INE / Pasaporte)'}
                </span>
                <span className="text-[11px] text-[#2ED5A4] font-medium flex items-center gap-1">
                  <span>✓ {isEn ? 'Verified by CNBV & FinCEN' : 'Validado ante CNBV y FinCEN'}</span>
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-[#2ED5A4] text-[10px] font-bold">
              TIER 3
            </span>
          </div>

          {/* Item 3: ClientVault AES-256 */}
          <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/10 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-[#2ED5A4] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <div>
                <span className="font-bold text-sm text-white block">
                  ClientVault AES-GCM-256
                </span>
                <span className="text-[11px] text-[#A6ADC8]">
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
              className="px-3 py-1.5 rounded-xl bg-[#2ED5A4]/20 hover:bg-[#2ED5A4]/30 border border-[#2ED5A4]/40 text-[#2ED5A4] text-xs font-bold transition-colors cursor-pointer"
            >
              {isEn ? 'Open' : 'Abrir'}
            </button>
          </div>

          {/* Item 4: Sesiones Activas */}
          <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/10 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">devices</span>
              </div>
              <div>
                <span className="font-bold text-sm text-white block">
                  {isEn ? 'Active Linked Devices' : 'Dispositivos Vinculados'}
                </span>
                <span className="text-[11px] text-[#A6ADC8]">
                  iPhone 15 Pro • {isEn ? 'Current session' : 'Sesión actual activa'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRevokeSessions}
              className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold transition-colors cursor-pointer"
            >
              {isEn ? 'Revoke' : 'Revocar'}
            </button>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 rounded-full bg-[#2ED5A4] hover:bg-[#28b88e] text-neutral-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>{isEn ? 'Understood & Protected' : 'Entendido y Protegido'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
