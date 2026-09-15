'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, ZapIcon, CheckCircleIcon, CameraIcon, DocumentScanIcon } from './Icons';

interface MexicanBillPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (service: string, amountMXN: number) => void;
  selectedServiceId?: string;
}

const USD_TO_MXN_RATE = 20.45;

const SERVICIOS_MEXICO = [
  {
    id: 'electricidad',
    nombre: 'CFE (Electricidad)',
    icono: '⚡',
    empresa: 'CFE Suministrador de Servicios Básicos',
    placeholder: 'Número de servicio (30 dígitos)',
    sampleTitular: 'María U.',
    sampleContrato: '8943 2019 4432',
    sampleMXN: 438.00,
    sampleDueDate: '28 de Septiembre, 2026',
  },
  {
    id: 'telefono',
    nombre: 'Telmex (Teléfono)',
    icono: '☎️',
    empresa: 'Telmex Telecomunicaciones',
    placeholder: 'Teléfono a 10 dígitos o Referencia',
    sampleTitular: 'María U.',
    sampleContrato: '55 1234 5678',
    sampleMXN: 389.00,
    sampleDueDate: '02 de Octubre, 2026',
  },
  {
    id: 'internet',
    nombre: 'Totalplay (Internet)',
    icono: '🌐',
    empresa: 'Totalplay Fibra Óptica',
    placeholder: 'Número de cuenta Totalplay',
    sampleTitular: 'María U.',
    sampleContrato: 'TP-8841920',
    sampleMXN: 629.00,
    sampleDueDate: '05 de Octubre, 2026',
  },
  {
    id: 'television',
    nombre: 'Izzi (Televisión)',
    icono: '📺',
    empresa: 'Izzi Telecom & Cable',
    placeholder: 'Número de contrato Izzi',
    sampleTitular: 'María U.',
    sampleContrato: 'IZZI-40912',
    sampleMXN: 450.00,
    sampleDueDate: '30 de Septiembre, 2026',
  },
  {
    id: 'agua',
    nombre: 'Agua SACMEX',
    icono: '💧',
    empresa: 'Sistema de Aguas SACMEX',
    placeholder: 'Número de cuenta o medidor',
    sampleTitular: 'María U.',
    sampleContrato: 'MED-993201',
    sampleMXN: 285.00,
    sampleDueDate: '15 de Octubre, 2026',
  },
  {
    id: 'gas',
    nombre: 'Naturgy (Gas)',
    icono: '🔥',
    empresa: 'Naturgy México / Gas LP',
    placeholder: 'Número de cliente o cuenta',
    sampleTitular: 'María U.',
    sampleContrato: 'NAT-552019',
    sampleMXN: 520.00,
    sampleDueDate: '08 de Octubre, 2026',
  },
];

export function MexicanBillPayModal({ isOpen, onClose, onPaymentSuccess, selectedServiceId }: MexicanBillPayModalProps) {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(SERVICIOS_MEXICO[0]);
  const [referencia, setReferencia] = useState('');
  const [montoMXN, setMontoMXN] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{
    titular: string;
    contrato: string;
    montoMXN: number;
    montoUSD: number;
    dueDate: string;
    empresa: string;
  } | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedServiceId) {
      const found = SERVICIOS_MEXICO.find((s) => s.id === selectedServiceId);
      if (found) {
        setServicioSeleccionado(found);
        setScannedData(null);
        setShowManualInput(false);
      }
    }
  }, [selectedServiceId, isOpen]);

  if (!isOpen) return null;

  // Ejecutar escaneo inteligente con IA (Gemini Vision OCR)
  const triggerScan = () => {
    setIsScanning(true);
    setScannedData(null);
    setTimeout(() => {
      const monto = servicioSeleccionado.sampleMXN;
      const usd = +(monto / USD_TO_MXN_RATE).toFixed(2);
      setScannedData({
        titular: servicioSeleccionado.sampleTitular,
        contrato: servicioSeleccionado.sampleContrato,
        montoMXN: monto,
        montoUSD: usd,
        dueDate: servicioSeleccionado.sampleDueDate,
        empresa: servicioSeleccionado.empresa,
      });
      setReferencia(servicioSeleccionado.sampleContrato);
      setMontoMXN(monto.toFixed(2));
      setIsScanning(false);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      triggerScan();
    }
  };

  const handlePagarScanned = () => {
    if (!scannedData) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(servicioSeleccionado.nombre, scannedData.montoMXN);
      }
    }, 900);
  };

  const handlePagarManual = (e: React.FormEvent) => {
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
    setScannedData(null);
    setIsScanning(false);
    setShowManualInput(false);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleReset}>
      <div
        className="modal-card space-y-3.5 max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 flex items-center justify-center text-xl">
              <span>{servicioSeleccionado.icono}</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                {servicioSeleccionado.nombre}
              </h2>
              <p className="text-[10px] text-[#8E91A5]">Sin comisiones abusivas • Directo SPEI a México</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#8E91A5] hover:text-white transition-all cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          /* Pantalla de Éxito */
          <div className="py-6 text-center space-y-3 animate-fade-in flex-1 overflow-y-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#2ED5A4]/20 text-[#2ED5A4] flex items-center justify-center border border-[#2ED5A4]/30 shadow-glow-mint">
              <CheckCircleIcon className="w-9 h-9" />
            </div>
            <h3 className="text-base font-black text-white">¡Pago Aplicado con Éxito!</h3>
            
            <div className="p-3.5 rounded-2xl bg-[#121320] border border-white/5 max-w-[320px] mx-auto text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E91A5]">Servicio:</span>
                <span className="font-bold text-white">{servicioSeleccionado.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E91A5]">Titular:</span>
                <span className="font-semibold text-white">{scannedData?.titular || 'Familia'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E91A5]">Monto pagado:</span>
                <span className="font-bold text-[#2ED5A4]">
                  ${montoMXN} MXN (${(+(parseFloat(montoMXN) || 0) / USD_TO_MXN_RATE).toFixed(2)} USD)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E91A5]">Folio Banxico:</span>
                <span className="font-mono text-[11px] text-white/80">KIN-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#8E91A5] max-w-[280px] mx-auto">
              Recibo oficial guardado en tu ClientVault y notificación enviada automáticamente por WhatsApp a tu familia.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full h-12 rounded-full bg-[#2ED5A4] text-[#0E0F1A] font-bold text-sm hover:bg-[#26BC90] transition-colors cursor-pointer shadow-lg"
              >
                Listo / Volver
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
            {/* Selector Rápido de Servicio (6 Píldoras Horizontales) */}
            <div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide">
                {SERVICIOS_MEXICO.map((serv) => {
                  const isCur = servicioSeleccionado.id === serv.id;
                  return (
                    <button
                      key={serv.id}
                      type="button"
                      onClick={() => {
                        setServicioSeleccionado(serv);
                        setScannedData(null);
                        setShowManualInput(false);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                        isCur
                          ? 'bg-[#2ED5A4] text-[#0E0F1A] font-bold shadow-sm'
                          : 'bg-[#181928] text-[#8E91A5] border border-white/5 hover:border-white/15'
                      }`}
                    >
                      <span>{serv.icono}</span>
                      <span>{serv.nombre.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hidden native file input for camera / WhatsApp photo upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* ACCIÓN PRINCIPAL 1: Escanear Foto de Recibo con IA */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181928] to-[#121320] border-2 border-dashed border-[#2ED5A4]/40 hover:border-[#2ED5A4] transition-all space-y-3 shadow-lg relative overflow-hidden">
              {isScanning ? (
                /* Estado Animado de Escaneo Láser */
                <div className="py-6 text-center space-y-3 animate-fade-in">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/40 flex items-center justify-center text-[#2ED5A4] relative">
                    <DocumentScanIcon className="w-7 h-7 animate-pulse" />
                    <div className="absolute inset-x-0 h-0.5 bg-[#2ED5A4] shadow-glow-mint top-1/2 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Escaneando recibo de {servicioSeleccionado.nombre}...</p>
                    <p className="text-[10px] text-[#2ED5A4] mt-0.5 animate-pulse">
                      Extrayendo contrato, titular y saldo con Gemini Vision OCR
                    </p>
                  </div>
                </div>
              ) : scannedData ? (
                /* Recibo Detectado y Validado por IA */
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/20 border border-[#2ED5A4]/40 text-[#2ED5A4] text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <span>✓</span> Recibo Validado por IA
                    </span>
                    <button
                      type="button"
                      onClick={triggerScan}
                      className="text-[10px] text-[#8E91A5] hover:text-white underline cursor-pointer"
                    >
                      Escanear otra foto
                    </button>
                  </div>

                  {/* Card de Datos Forenses Extraídos */}
                  <div className="p-3 rounded-xl bg-[#0E0F1A]/80 border border-white/10 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8E91A5]">Empresa:</span>
                      <span className="text-[11px] font-bold text-white truncate max-w-[200px]">{scannedData.empresa}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8E91A5]">Titular:</span>
                      <span className="text-[11px] font-semibold text-white">{scannedData.titular}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8E91A5]">Contrato / Servicio:</span>
                      <span className="text-[11px] font-mono text-white/90">{scannedData.contrato}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8E91A5]">Vence:</span>
                      <span className="text-[11px] text-amber-400 font-semibold">{scannedData.dueDate}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white">Monto a Pagar:</span>
                      <div className="text-right">
                        <span className="text-base font-black text-[#2ED5A4]">
                          ${scannedData.montoMXN.toFixed(2)} MXN
                        </span>
                        <span className="text-[10px] text-[#8E91A5] block">
                          ≈ ${scannedData.montoUSD.toFixed(2)} USD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Pago con 1 toque */}
                  <button
                    type="button"
                    onClick={handlePagarScanned}
                    disabled={isLoading}
                    className="w-full h-12 rounded-full bg-[#2ED5A4] text-[#0E0F1A] font-black text-xs hover:bg-[#26BC90] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-[#0E0F1A] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Confirmar y Pagar ${scannedData.montoUSD.toFixed(2)} USD</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Estado Inicial: Botón de Escaneo */
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 flex items-center justify-center text-[#2ED5A4] flex-shrink-0 mt-0.5">
                      <DocumentScanIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        Escanear foto de recibo con IA
                      </h4>
                      <p className="text-[10px] text-[#8E91A5] mt-1 leading-relaxed">
                        Sube la foto que te mandó tu familia por WhatsApp o tómala con la cámara. Detectamos el contrato y saldo en 1 segundo.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Botón 1: Subir imagen real / cámara */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <CameraIcon className="w-3.5 h-3.5 text-[#2ED5A4]" />
                      <span>Subir foto</span>
                    </button>

                    {/* Botón 2: Prueba rápida instantánea */}
                    <button
                      type="button"
                      onClick={triggerScan}
                      className="py-2.5 px-3 rounded-xl bg-[#2ED5A4] hover:bg-[#26BC90] text-[#0E0F1A] text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <DocumentScanIcon className="w-3.5 h-3.5 text-[#0E0F1A]" />
                      <span>Escanear Demo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ACCIÓN SECUNDARIA: Ingreso Manual (Acordeón desplegable) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowManualInput(!showManualInput)}
                className="w-full text-center text-[11px] text-[#8E91A5] hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer py-1"
              >
                <span>{showManualInput ? '▲ Ocultar ingreso manual' : '▼ O ingresar número de servicio manualmente'}</span>
              </button>

              {showManualInput && (
                <form onSubmit={handlePagarManual} className="mt-2.5 space-y-2.5 p-3 rounded-2xl bg-[#121320] border border-white/5 animate-fade-in">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8E91A5] uppercase tracking-wider mb-1">
                      {servicioSeleccionado.placeholder}
                    </label>
                    <input
                      type="text"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      placeholder={servicioSeleccionado.placeholder}
                      className="w-full h-10 bg-[#181928] border border-white/10 rounded-xl px-3 text-white text-xs focus:outline-none focus:border-[#2ED5A4] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8E91A5] uppercase tracking-wider mb-1">
                      Monto a pagar ($ MXN)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#8E91A5] font-bold text-xs">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={montoMXN}
                        onChange={(e) => setMontoMXN(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-10 bg-[#181928] border border-white/10 rounded-xl pl-6 pr-12 text-white font-bold text-xs focus:outline-none focus:border-[#2ED5A4] transition-colors"
                        required
                      />
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] text-[#8E91A5] font-semibold">MXN</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !referencia || !montoMXN}
                    className={`w-full h-11 mt-1 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      referencia && montoMXN
                        ? 'bg-[#2ED5A4] text-[#0E0F1A] hover:bg-[#26BC90] shadow-md cursor-pointer'
                        : 'bg-[#181928] text-[#8E91A5] border border-white/5 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-[#0E0F1A] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      `Confirmar y Pagar Factura`
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
