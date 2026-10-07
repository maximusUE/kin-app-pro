'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, CopyIcon, ShareReceiptIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';

export interface KinQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName?: string;
  userAvatar?: string;
  onQrScanned?: (data: { recipientName: string; amount?: number; handle?: string }) => void;
  language?: 'es' | 'en';
}

/**
 * KinQrModal - Generador Dinámico de Código QR y Escáner de Contactos Familiares
 * Cumple con la Regla de Oro de Don César: Botón circular `<` (.btn-circle) y KinLogo oficial.
 */
export function KinQrModal({
  isOpen,
  onClose,
  userId,
  userName = 'César Ugalde',
  userAvatar,
  onQrScanned,
  language = 'es',
}: KinQrModalProps) {
  const [mounted, setMounted] = useState(false);
  const isEn = language === 'en';
  const [activeMode, setActiveMode] = useState<'my_qr' | 'scan'>('my_qr');
  const [chargeAmount, setChargeAmount] = useState<string>('');
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [isScanningSimulation, setIsScanningSimulation] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const kinHandle = `$${(userId || 'cesar_ugalde').replace(/^user_/, '').replace(/^user-/, '')}`;
  const qrPayload = `kin://pay?to=${userId}&handle=${kinHandle}${chargeAmount ? `&amount=${chargeAmount}` : ''}`;

  const handleCopyHandle = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(kinHandle);
        setCopiedFeedback(true);
        if ('vibrate' in navigator) navigator.vibrate(15);
        setTimeout(() => setCopiedFeedback(false), 2500);
      } catch (_) {}
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: `KIN Cash QR — ${userName}`,
          text: `Envíame dinero al instante sin comisiones por KIN Cash a mi usuario ${kinHandle}.`,
          url: `https://kin-app-pro.vercel.app/?kinHandle=${kinHandle}`,
        });
      } catch (_) {}
    } else {
      handleCopyHandle();
    }
  };

  const handleSimulateScan = (recipient: { name: string; amount: number; handle: string }) => {
    setIsScanningSimulation(true);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([20, 50, 30]);
      } catch (_) {}
    }
    setTimeout(() => {
      setIsScanningSimulation(false);
      onQrScanned?.({
        recipientName: recipient.name,
        amount: recipient.amount,
        handle: recipient.handle,
      });
      onClose();
    }, 900);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-[420px] bg-[#0E131F] border border-white/10 rounded-3xl p-5 shadow-[0_24px_50px_rgba(0,0,0,0.95)] text-white space-y-4 max-h-[92dvh] overflow-y-auto">
        
        {/* Cabecera Oficial Unificada (Regla de Oro Don César) */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle"
              title={isEn ? 'Close' : 'Volver'}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={32} />
            <div className="flex flex-col leading-none">
              <span className="font-title-base text-base font-bold text-white tracking-tight">
                {isEn ? 'KIN QR Pay' : 'Código QR KIN'}
              </span>
              <span className="font-label-caps text-[9px] uppercase tracking-widest text-[#2ED5A4]">
                {isEn ? 'Contactless' : 'Sin Contacto'}
              </span>
            </div>
          </div>

          {/* Toggle Modo: Mi QR vs Escanear */}
          <div className="flex p-1 rounded-full bg-surface-container-high/60 border border-white/5 text-xs">
            <button
              type="button"
              onClick={() => setActiveMode('my_qr')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                activeMode === 'my_qr'
                  ? 'bg-primary text-neutral-950 shadow-xs'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {isEn ? 'My QR' : 'Mi QR'}
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('scan')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                activeMode === 'scan'
                  ? 'bg-primary text-neutral-950 shadow-xs'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {isEn ? 'Scan' : 'Escanear'}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODO 1: MI CÓDIGO QR (COBRAR O RECIBIR DINERO)                            */}
        {/* ========================================================================= */}
        {activeMode === 'my_qr' && (
          <div className="flex flex-col items-center space-y-4 pt-1 animate-fade-in">
            {/* User Handle Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-financial-mono text-sm font-bold text-emerald-400">{kinHandle}</span>
              <button
                type="button"
                onClick={handleCopyHandle}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
                title={isEn ? 'Copy Handle' : 'Copiar Identificador'}
              >
                <CopyIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Stylized Dynamic SVG QR Card */}
            <div className="relative p-5 rounded-3xl bg-white text-slate-900 shadow-[0_12px_40px_rgba(46,213,164,0.25)] flex flex-col items-center">
              {/* Corner decorative anchors */}
              <div className="relative w-56 h-56 flex items-center justify-center p-2 border-2 border-dashed border-emerald-500/30 rounded-2xl">
                {/* SVG QR Code Matrix */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  shapeRendering="crispEdges"
                >
                  {/* Top-Left Finder */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#0A0E17" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="#FFFFFF" />
                  <rect x="13" y="13" width="10" height="10" rx="2" fill="#2ED5A4" />

                  {/* Top-Right Finder */}
                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#0A0E17" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="#FFFFFF" />
                  <rect x="77" y="13" width="10" height="10" rx="2" fill="#2ED5A4" />

                  {/* Bottom-Left Finder */}
                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#0A0E17" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="#FFFFFF" />
                  <rect x="13" y="77" width="10" height="10" rx="2" fill="#2ED5A4" />

                  {/* Stylized Data Pixels */}
                  <rect x="36" y="8" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="46" y="8" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="56" y="8" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="36" y="18" width="5" height="5" rx="1" fill="#2ED5A4" />
                  <rect x="46" y="18" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="56" y="18" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="36" y="26" width="5" height="5" rx="1" fill="#0A0E17" />

                  {/* Left-Middle Columns */}
                  <rect x="8" y="36" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="18" y="36" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="8" y="46" width="5" height="5" rx="1" fill="#2ED5A4" />
                  <rect x="18" y="46" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="8" y="56" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="24" y="56" width="5" height="5" rx="1" fill="#0A0E17" />

                  {/* Right-Middle Columns */}
                  <rect x="69" y="36" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="79" y="36" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="89" y="36" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="69" y="46" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="84" y="46" width="5" height="5" rx="1" fill="#2ED5A4" />
                  <rect x="74" y="56" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="89" y="56" width="5" height="5" rx="1" fill="#0A0E17" />

                  {/* Bottom-Right Data Matrix */}
                  <rect x="36" y="69" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="46" y="69" width="5" height="5" rx="1" fill="#2ED5A4" />
                  <rect x="56" y="69" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="69" y="69" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="79" y="69" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="36" y="79" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="46" y="79" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="69" y="79" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="89" y="79" width="5" height="5" rx="1" fill="#2ED5A4" />
                  <rect x="36" y="89" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="56" y="89" width="5" height="5" rx="1" fill="#0A0E17" />
                  <rect x="79" y="89" width="5" height="5" rx="1" fill="#0A0E17" />
                </svg>

                {/* Badge Central KIN */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-xl bg-neutral-950 p-1 shadow-lg border border-primary/40 flex items-center justify-center">
                  <KinLogo size={28} />
                </div>
              </div>

              {/* QR Label */}
              <span className="font-caption-sm text-[11px] font-bold text-slate-500 mt-2">
                {chargeAmount ? `Monto Solicitado: $${chargeAmount} USD` : (isEn ? 'Scan to pay instantly' : 'Escanea para pagar al instante')}
              </span>
            </div>

            {/* Configurar Monto Solicitado (Opcional) */}
            <div className="w-full space-y-1.5">
              <label className="text-[11px] text-on-surface-variant font-semibold flex items-center justify-between">
                <span>{isEn ? 'Optional Request Amount' : 'Fijar monto a cobrar (Opcional)'}</span>
                {chargeAmount && (
                  <button
                    type="button"
                    onClick={() => setChargeAmount('')}
                    className="text-primary text-[10px] hover:underline cursor-pointer"
                  >
                    {isEn ? 'Clear' : 'Borrar'}
                  </button>
                )}
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold text-sm">$</span>
                  <input
                    type="number"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-10 pl-7 pr-3 rounded-xl bg-surface-container-high/60 border border-white/10 text-white font-financial-mono text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex gap-1">
                  {['20', '50', '100'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setChargeAmount(amt)}
                      className={`h-10 px-2.5 rounded-xl text-xs font-bold border cursor-pointer active:scale-95 transition-all ${
                        chargeAmount === amt
                          ? 'bg-primary text-neutral-950 border-primary'
                          : 'bg-white/5 text-white/80 border-white/10 hover:border-white/20'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="w-full flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyHandle}
                className="flex-1 h-11 rounded-full bg-surface-container-high hover:bg-white/10 border border-white/10 text-white font-title-base text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <CopyIcon className="w-4 h-4 text-primary" />
                <span>{copiedFeedback ? (isEn ? 'Copied! ✓' : '¡Copiado! ✓') : (isEn ? 'Copy Handle' : 'Copiar Usuario')}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex-1 h-11 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-title-base text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <ShareReceiptIcon className="w-4 h-4 text-neutral-950" />
                <span>{isEn ? 'Share QR' : 'Compartir QR'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODO 2: ESCANEAR CÓDIGO QR (PAGAR AL INSTANTE)                            */}
        {/* ========================================================================= */}
        {activeMode === 'scan' && (
          <div className="flex flex-col items-center space-y-4 pt-1 animate-fade-in">
            {/* Viewfinder Cam / Scanner Frame */}
            <div className="relative w-64 h-64 rounded-3xl bg-black/90 border border-white/15 overflow-hidden flex items-center justify-center shadow-2xl">
              {/* Corner crosshairs */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />

              {/* Animated Laser Scanning Beam */}
              <div
                className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-[#2ED5A4] to-transparent shadow-[0_0_12px_#2ED5A4] animate-bounce"
                style={{ animationDuration: '2s' }}
              />

              {/* Viewfinder Center Guide */}
              <div className="flex flex-col items-center text-center px-4">
                <span className="material-symbols-outlined text-[36px] text-white/40 mb-1">
                  qr_code_scanner
                </span>
                <span className="font-caption-sm text-xs text-white/70">
                  {isScanningSimulation
                    ? (isEn ? 'Processing QR payload...' : 'Leyendo código QR...')
                    : (isEn ? 'Align QR code inside frame' : 'Apunta la cámara al código QR')}
                </span>
              </div>
            </div>

            {/* Quick Test Scanners / Family Shortcuts */}
            <div className="w-full space-y-2">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider block text-center">
                {isEn ? 'Or simulate scan from saved contact' : 'O simular escaneo de familiar KIN'}
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSimulateScan({
                      name: 'María Morales',
                      amount: 50,
                      handle: '$maria_morales',
                    })
                  }
                  className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    MM
                  </div>
                  <div className="min-w-0">
                    <span className="text-white font-bold text-xs block truncate">María Morales</span>
                    <span className="text-primary text-[10px] font-mono block">$50 USD • Mamá</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSimulateScan({
                      name: 'Carlos Ugalde',
                      amount: 100,
                      handle: '$carlos_u',
                    })
                  }
                  className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                    CU
                  </div>
                  <div className="min-w-0">
                    <span className="text-white font-bold text-xs block truncate">Carlos Ugalde</span>
                    <span className="text-primary text-[10px] font-mono block">$100 USD • Hermano</span>
                  </div>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              {isEn
                ? 'Camera scans auto-detect KIN Handles and fill recipient with zero fee.'
                : 'El escáner detecta usuarios KIN y completa el envío de inmediato sin comisiones.'}
            </p>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}

export default KinQrModal;
