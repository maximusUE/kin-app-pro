'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, CopyIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface KinPinRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'es' | 'en';
}

export function KinPinRevealModal({
  isOpen,
  onClose,
  language = 'es',
}: KinPinRevealModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isPinVisible, setIsPinVisible] = useState<boolean>(false);
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');
  const [currentPin, setCurrentPin] = useState<string>('4892');
  const isEn = language === 'en';

  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(false);
      setIsAuthenticating(true);
      const timer = setTimeout(() => {
        setIsAuthenticating(false);
        setIsAuthenticated(true);
        setIsPinVisible(true);
        toast.success(
          isEn ? 'Biometric Face ID verification successful' : 'Verificación biométrica Face ID exitosa'
        );
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isEn]);

  if (!isOpen) return null;

  const handleCopyPin = () => {
    navigator.clipboard.writeText(currentPin);
    toast.success(isEn ? 'ATM PIN copied to clipboard' : 'PIN de cajero copiado al portapapeles');
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast.error(isEn ? 'PIN must be exactly 4 digits' : 'El PIN debe ser exactamente de 4 dígitos');
      return;
    }
    setCurrentPin(newPin);
    setIsChangingPin(false);
    setNewPin('');
    toast.success(
      isEn
        ? 'ATM PIN updated and synchronized across Visa RED networks'
        : 'PIN de cajero actualizado y sincronizado en la red Visa RED'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] bg-[#0E131F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.95)] text-white space-y-4 my-auto">
        {/* Universal Don César Header: < | KinLogo | Security Badge */}
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
            <span className="material-symbols-outlined text-[13px]">fingerprint</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
              Face ID Enclave
            </span>
          </div>
        </header>

        {/* Title */}
        <div className="text-center pt-1">
          <h2 className="text-xl font-black text-white tracking-tight">
            {isChangingPin
              ? (isEn ? 'Change ATM PIN' : 'Cambiar PIN de Cajero')
              : (isEn ? 'Your Security PIN' : 'Tu PIN de Seguridad')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isEn
              ? 'Required for ATM cash withdrawals and physical POS terminals'
              : 'Requerido para retiros en cajeros automáticos y terminales físicas'}
          </p>
        </div>

        {isAuthenticating ? (
          /* Biometric Face ID Scanning Animation */
          <div className="py-10 flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="relative w-20 h-20 rounded-full border-2 border-[#2ED5A4]/40 flex items-center justify-center animate-pulse">
              <div className="absolute inset-0 rounded-full border-2 border-t-[#2ED5A4] animate-spin" />
              <span className="material-symbols-outlined text-4xl text-[#2ED5A4]">face</span>
            </div>
            <p className="text-xs font-semibold text-slate-300">
              {isEn ? 'Authenticating with Face ID...' : 'Autenticando con Face ID...'}
            </p>
          </div>
        ) : !isChangingPin ? (
          /* Main PIN Display View */
          <div className="space-y-4 animate-fade-in">
            {/* 4 Digit Boxes */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141624] to-[#0A0B14] border border-[#2ED5A4]/20 shadow-inner">
              <div className="flex items-center justify-center gap-3">
                {currentPin.split('').map((digit, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-16 rounded-2xl bg-[#1C1E30] border border-white/10 flex items-center justify-center text-2xl font-mono font-black text-white shadow-md transition-all"
                  >
                    {isPinVisible ? digit : '•'}
                  </div>
                ))}
              </div>

              {/* Toggle Visibility and Copy Action Row */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-white/5 text-xs">
                <button
                  type="button"
                  onClick={() => setIsPinVisible(!isPinVisible)}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isPinVisible ? 'visibility_off' : 'visibility'}
                  </span>
                  <span>
                    {isPinVisible ? (isEn ? 'Hide PIN' : 'Ocultar PIN') : (isEn ? 'Reveal PIN' : 'Mostrar PIN')}
                  </span>
                </button>

                <span className="text-slate-600">•</span>

                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="flex items-center gap-1.5 text-[#2ED5A4] hover:text-[#57f2bf] font-semibold transition-colors cursor-pointer"
                >
                  <CopyIcon className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Copy' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-start gap-3 text-xs">
              <span className="material-symbols-outlined text-[#2ED5A4] text-[18px] shrink-0 mt-0.5">verified_user</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isEn
                  ? 'Valid at all RED and Visa Plus ATMs in Mexico and the United States. KIN employees will never ask for your PIN.'
                  : 'Válido en cualquier cajero de la red RED en México y red Visa Plus en USA. Ningún asesor de KIN te pedirá jamás tu PIN.'}
              </p>
            </div>

            {/* Change PIN Button */}
            <button
              type="button"
              onClick={() => setIsChangingPin(true)}
              className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>{isEn ? 'Change PIN' : 'Cambiar PIN'}</span>
            </button>
          </div>
        ) : (
          /* Change PIN Form View */
          <form onSubmit={handleSaveNewPin} className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                {isEn ? 'Enter new 4-digit PIN:' : 'Ingresa nuevo PIN de 4 dígitos:'}
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center text-3xl font-mono tracking-[0.5em] py-3.5 px-4 rounded-2xl bg-[#141624] border border-emerald-500/40 text-white focus:outline-none focus:border-[#2ED5A4] shadow-inner"
              />
              <span className="text-[10px] text-slate-400 block text-center">
                {isEn ? 'Must be 4 numbers' : 'Debe componerse de 4 números'}
              </span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(false);
                  setNewPin('');
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Cancelar'}
              </button>
              <button
                type="submit"
                disabled={newPin.length !== 4}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isEn ? 'Confirm & Save' : 'Confirmar & Guardar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
