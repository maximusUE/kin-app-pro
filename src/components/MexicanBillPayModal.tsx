'use client';

import React, { useState, useEffect } from 'react';
import { CloseIcon, ZapIcon, CheckCircleIcon } from './Icons';

interface MexicanBillPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (service: string, amountMXN: number) => void;
  selectedServiceId?: string;
}

const SERVICIOS_MEXICO = [
  { id: 'electricidad', nombre: 'CFE (Electricidad)', icono: '⚡', placeholder: 'Número de servicio (30 dígitos)' },
  { id: 'telefono', nombre: 'Telmex (Teléfono)', icono: '☎️', placeholder: 'Teléfono a 10 dígitos o Referencia' },
  { id: 'internet', nombre: 'Totalplay (Internet)', icono: '🌐', placeholder: 'Número de cuenta Totalplay' },
  { id: 'television', nombre: 'Izzi (Televisión)', icono: '📺', placeholder: 'Número de referencia Izzi' },
  { id: 'agua', nombre: 'Agua SACMEX', icono: '💧', placeholder: 'Número de cuenta o medidor' },
  { id: 'gas', nombre: 'Naturgy (Gas)', icono: '🔥', placeholder: 'Número de cliente o cuenta' },
];

export function MexicanBillPayModal({ isOpen, onClose, onPaymentSuccess, selectedServiceId }: MexicanBillPayModalProps) {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(SERVICIOS_MEXICO[0]);

  useEffect(() => {
    if (selectedServiceId) {
      const found = SERVICIOS_MEXICO.find((s) => s.id === selectedServiceId);
      if (found) {
        setServicioSeleccionado(found);
      }
    }
  }, [selectedServiceId, isOpen]);
  const [referencia, setReferencia] = useState('');
  const [montoMXN, setMontoMXN] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePagar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referencia || !montoMXN) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(servicioSeleccionado.nombre, parseFloat(montoMXN));
      }
    }, 900);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setReferencia('');
    setMontoMXN('');
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleReset}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#7047EB]/20 border border-[#7047EB]/40 flex items-center justify-center text-[#7047EB]">
              <ZapIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Pago de Facturas en México</h2>
              <p className="text-[10px] text-[#8E91A5]">Sin comisiones abusivas • Directo SPEI</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="btn-circle w-8 h-8"
          >
            <CloseIcon className="w-4 h-4 text-[#8E91A5]" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#2ED5A4]/20 text-[#2ED5A4] flex items-center justify-center border border-[#2ED5A4]/30">
              <CheckCircleIcon className="w-9 h-9" />
            </div>
            <h3 className="text-base font-bold text-white">¡Pago Aplicado con Éxito!</h3>
            <p className="text-xs text-[#8E91A5] max-w-[280px] mx-auto">
              Se ha procesado el pago de <span className="text-white font-semibold">${montoMXN} MXN</span> para <span className="text-[#2ED5A4] font-semibold">{servicioSeleccionado.nombre}</span>. Recibo guardado en ClientVault.
            </p>
            <div className="pt-3">
              <button
                onClick={handleReset}
                className="w-full h-12 rounded-2xl bg-[#2ED5A4] text-[#0D0E15] font-bold text-sm hover:bg-[#26BC90] transition-colors"
              >
                Listo / Volver
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePagar} className="mt-4 space-y-3.5">
            {/* Selector de servicio */}
            <div>
              <label className="block text-[10px] font-bold text-[#8E91A5] uppercase tracking-wider mb-2">
                Selecciona la Empresa / Servicio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SERVICIOS_MEXICO.map((serv) => (
                  <button
                    key={serv.id}
                    type="button"
                    onClick={() => setServicioSeleccionado(serv)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                      servicioSeleccionado.id === serv.id
                        ? 'bg-[#2B2C42] border-[#2ED5A4] text-white shadow-sm'
                        : 'bg-[#0D0E15] border-white/5 text-[#8E91A5] hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg">{serv.icono}</span>
                    <span className="text-[10px] font-medium truncate w-full">{serv.nombre}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Referencia */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8E91A5] mb-1">
                Referencia de Pago ({servicioSeleccionado.nombre})
              </label>
              <input
                type="text"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                placeholder={servicioSeleccionado.placeholder}
                className="w-full h-11 bg-[#0D0E15] border border-white/10 rounded-2xl px-3.5 text-white text-xs focus:outline-none focus:border-[#7047EB] transition-colors"
                required
              />
            </div>

            {/* Monto */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8E91A5] mb-1">
                Monto a Pagar ($ MXN)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8E91A5] font-bold text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={montoMXN}
                  onChange={(e) => setMontoMXN(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 bg-[#0D0E15] border border-white/10 rounded-2xl pl-7 pr-12 text-white font-bold text-sm focus:outline-none focus:border-[#7047EB] transition-colors"
                  required
                />
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[10px] text-[#8E91A5] font-semibold">MXN</span>
              </div>
            </div>

            {/* Botón Pagar */}
            <button
              type="submit"
              disabled={isLoading || !referencia || !montoMXN}
              className={`w-full h-12 mt-2 rounded-2xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 ${
                referencia && montoMXN
                  ? 'bg-[#7047EB] text-white hover:bg-[#6035DA] shadow-glow-purple cursor-pointer'
                  : 'bg-[#0D0E15] text-[#8E91A5] border border-white/5 cursor-not-allowed opacity-80'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                `Confirmar y Pagar Factura`
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
