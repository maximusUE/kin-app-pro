'use client';

import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StatusCellularIcon,
  StatusWifiIcon,
  StatusBatteryIcon,
} from './Icons';

interface KinCashP2PModalProps {
  isOpen: boolean;
  onClose: () => void;
  onP2PSuccess?: (recipient: string, amountMXN: number) => void;
}

export function KinCashP2PModal({ isOpen, onClose, onP2PSuccess }: KinCashP2PModalProps) {
  const [recipient, setRecipient] = useState('Mi Billetera KIN (César U.)');
  const [amount, setAmount] = useState('250.00');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendP2P = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      if (onP2PSuccess) {
        onP2PSuccess(recipient, parseFloat(amount));
      }
    }, 800);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setRecipient('Mi Billetera KIN (César U.)');
    setAmount('250.00');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06070B] flex justify-center animate-fade-in overflow-y-auto">
      {/* Flagship Device Viewport (Desplegado en toda la pantalla del display) */}
      <div className="phone-viewport w-full max-w-[400px] min-h-[100dvh] bg-[#0E0F1A] flex flex-col justify-between px-5 pt-3 pb-8 relative">
        
        {/* Signature Ambient Bicolor Glow */}
        <div className="bicolor-atmosphere-glow" />

        {/* Top Status Bar & Header */}
        <div>
          <div className="flex items-center justify-between text-xs text-white/90 font-semibold mb-2 pt-1 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <StatusCellularIcon className="w-3.5 h-2.5 text-white" />
              <StatusWifiIcon className="w-3.5 h-2.5 text-white" />
              <StatusBatteryIcon className="w-5 h-2.5 text-white" />
            </div>
          </div>

          {/* Header con icono de Pesos ($) y únicamente 'KIN Cash' */}
          <header className="flex items-center justify-between py-2">
            <button
              type="button"
              onClick={handleReset}
              className="btn-circle"
              title="Volver"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>

            {/* Icono de pesos y título limpio KIN Cash */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                $
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">KIN Cash</h2>
            </div>

            <div className="w-10" />
          </header>
        </div>

        {/* Contenido Principal */}
        {isSuccess ? (
          <div className="my-auto py-8 text-center space-y-4 animate-fade-in">
            <div className="w-18 h-18 mx-auto rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] flex items-center justify-center border border-[#2ED5A4]/30 shadow-lg">
              <CheckCircleIcon className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">¡Envío Exitoso!</h3>
              <p className="text-xs text-[#8E91A5] max-w-[280px] mx-auto">
                Se transfirieron <span className="text-white font-bold">${amount} MXN</span> a <span className="text-[#2ED5A4] font-bold">{recipient}</span> al instante.
              </p>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="w-full h-13 rounded-full bg-[#2ED5A4] text-[#0E0F1A] font-bold text-sm hover:bg-[#26BC90] active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendP2P} className="flex-1 flex flex-col justify-between py-2">
            <div className="space-y-4">
              {/* Amount Display */}
              <div className="text-center py-6 space-y-1 bg-[#181928] rounded-3xl border border-white/5">
                <span className="text-[11px] font-bold text-[#8E91A5] uppercase tracking-wider block">
                  Monto a Transferir
                </span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-black text-[#2ED5A4]">$</span>
                  <input
                    type="number"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-40 text-center text-4xl font-black bg-transparent text-white focus:outline-none tracking-tight"
                    required
                  />
                  <span className="text-xs font-bold text-[#8E91A5]">MXN</span>
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div className="grid grid-cols-4 gap-2">
                {['100', '250', '500', '1000'].map((chip) => {
                  const isSelected = amount === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setAmount(chip)}
                      className={`py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[#0E0F1A] shadow-md scale-105'
                          : 'bg-[#181928] text-[#8E91A5] border border-white/10 hover:text-white'
                      }`}
                    >
                      ${chip}
                    </button>
                  );
                })}
              </div>

              {/* Destinatario */}
              <div>
                <label className="block text-xs font-semibold text-[#8E91A5] mb-1.5 px-0.5">
                  Destinatario (Celular a 10 dígitos o @usuario):
                </label>
                <div className="auth-input-group">
                  <div className="auth-input-icon">
                    <PhoneIcon className="w-4 h-4 text-[#8E91A5]" />
                  </div>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="ej. 55 1234 5678 o @carlos_mx"
                    className="auth-input-field"
                    required
                  />
                </div>
              </div>

              {/* Concepto / Nota */}
              <div>
                <label className="block text-xs font-semibold text-[#8E91A5] mb-1.5 px-0.5">
                  Concepto (Opcional):
                </label>
                <div className="auth-input-group">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="ej. Apoyo familiar / Despensa"
                    className="auth-input-field"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !recipient || !amount}
                className={`w-full h-13 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  recipient && amount
                    ? 'bg-white text-[#0E0F1A] hover:bg-gray-100 shadow-lg cursor-pointer active:scale-95'
                    : 'bg-[#222338] text-white/60 border border-white/10 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Transferir KIN Cash</span>
                    <ArrowRightIcon className={`w-4 h-4 ${recipient && amount ? 'text-[#0E0F1A]' : 'text-white/60'}`} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
