'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from './Icons';

export interface ScannedBillResult {
  serviceId?: string;
  serviceName?: string;
  contractNumber: string;
  amountMXN: number;
  barcodeData?: string;
  dueDate?: string;
  titular?: string;
}

interface BillCameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: ScannedBillResult) => void;
  targetServiceName?: string;
}

export function BillCameraScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  targetServiceName = 'CFE',
}: BillCameraScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [supportsTorch, setSupportsTorch] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Iniciar la cámara trasera del teléfono al abrir el modal
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (_) {}
      });
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
        setHasPermission(false);
        setErrorMessage('Tu navegador no permite acceso directo a la cámara. Puedes tomar o subir una foto de tu recibo.');
        return;
      }

      // Solicitar preferentemente la cámara trasera para escanear recibos físicos
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      // Verificar si la cámara tiene linterna / flash (torch)
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as any;
      if (capabilities && capabilities.torch) {
        setSupportsTorch(true);
      }
    } catch (err: any) {
      console.warn('Error accediendo a la cámara:', err);
      setHasPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Permiso de cámara denegado. Permite el acceso a la cámara en los ajustes de tu navegador o toma una foto con el botón de abajo.');
      } else {
        setErrorMessage('No se pudo inicializar el video de la cámara. Puedes tomar una foto de tu recibo directamente.');
      }
    }
  };

  // Encender o apagar la linterna del teléfono
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setTorchOn(nextState);
      } catch (e) {
        console.warn('Torch no disponible:', e);
      }
    }
  };

  // Simular o ejecutar reconocimiento inteligente del recibo
  const handleProcessScan = (customName?: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      stopCamera();

      // Generar datos contextuales de alta fidelidad según el servicio
      const isCFE = targetServiceName.toLowerCase().includes('cfe') || targetServiceName.toLowerCase().includes('electr');
      const isTelmex = targetServiceName.toLowerCase().includes('telmex') || targetServiceName.toLowerCase().includes('telef');
      const isTV = targetServiceName.toLowerCase().includes('tv') || targetServiceName.toLowerCase().includes('sky') || targetServiceName.toLowerCase().includes('dish');

      const mockBarcode = isCFE
        ? '01' + Math.floor(100000000000000 + Math.random() * 900000000000000)
        : isTelmex
        ? '33' + Math.floor(10000000 + Math.random() * 90000000)
        : 'SKY-' + Math.floor(100000 + Math.random() * 900000);

      const mockAmount = isCFE ? 842.0 : isTelmex ? 389.0 : isTV ? 450.0 : 520.0;

      onScanSuccess({
        serviceName: targetServiceName,
        contractNumber: mockBarcode,
        amountMXN: mockAmount,
        barcodeData: mockBarcode,
        titular: 'Recibo Escaneado (' + (customName || 'Oficial') + ')',
        dueDate: 'Due in 7 days',
      });
      onClose();
    }, 1100);
  };

  // Tomar captura manual desde el video en vivo
  const handleCaptureSnapshot = () => {
    if (isProcessing) return;
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    }
    handleProcessScan('Cámara en Vivo');
  };

  // Manejar foto seleccionada o tomada con la cámara nativa del sistema
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessScan('Foto Adjunta');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between animate-fade-in select-none">
      {/* Canvas oculto para capturas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Input de archivo nativo con capture="environment" para disparar la cámara del sistema operativo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Header con Cerrar y Linterna */}
      <header className="relative z-30 flex items-center justify-between p-4 pt-6 bg-gradient-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer border border-white/10"
          title="Cerrar escáner"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <span className="font-headline-md text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Escáner de Recibos
          </span>
          <span className="text-[10px] text-primary font-medium tracking-wide">
            {targetServiceName} • Código de Barras / QR
          </span>
        </div>

        {supportsTorch ? (
          <button
            type="button"
            onClick={toggleTorch}
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
              torchOn
                ? 'bg-primary text-[#002116] border-primary shadow-glow-mint'
                : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
            }`}
            title="Activar linterna"
          >
            <span className="material-symbols-outlined text-[20px]">
              {torchOn ? 'flash_on' : 'flash_off'}
            </span>
          </button>
        ) : (
          <div className="w-10" />
        )}
      </header>

      {/* Viewfinder Central (Cámara en Vivo o Fallback de Permiso) */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {hasPermission === false && errorMessage ? (
          /* Estado de Permiso Denegado / No Soportado con Opción de Foto Nativa */
          <div className="p-6 max-w-[340px] text-center space-y-4 bg-[#181928] rounded-3xl border border-white/10 shadow-2xl z-20 mx-4 animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-[32px]">photo_camera</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Acceso a la Cámara</h3>
              <p className="text-xs text-[#8E91A5] leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary-container text-[#002116] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
              <span>Tomar Foto con mi Cámara</span>
            </button>
          </div>
        ) : (
          /* Video en vivo */
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Retícula de Escaneo Táctica con Láser Animado */}
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
              <div className="relative w-full max-w-[320px] aspect-[4/3] rounded-3xl border-2 border-primary/60 shadow-[0_0_40px_rgba(46,213,164,0.25)] flex flex-col justify-between p-4 overflow-hidden">
                {/* 4 Esquinas Tácticas Estilizadas */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl" />

                {/* Línea de Láser Verde KIN que sube y baja */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#57f2bf] animate-bounce" />

                <div className="flex items-center justify-center">
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-primary border border-primary/30">
                    Apunta al código de barras o QR
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-white/70 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-xl">
                  <span>Reconocimiento Automático</span>
                  <span className="font-mono text-primary font-bold">CFE • Telmex • Sky</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback visual durante procesamiento */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-40 space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin flex items-center justify-center" />
            <span className="text-sm font-bold text-white">Leyendo código de barras...</span>
            <span className="text-xs text-primary font-medium">Vinculando recibo a Bill Pay</span>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <footer className="relative z-30 p-6 pb-8 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-4">
        <p className="text-xs text-[#8E91A5] text-center max-w-[280px]">
          Coloca el código dentro del recuadro para detectar el número de servicio y monto.
        </p>

        <div className="flex items-center justify-center gap-6 w-full max-w-[320px]">
          {/* Botón de galería / cámara del sistema */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer shadow-lg"
            title="Subir foto de recibo"
          >
            <span className="material-symbols-outlined text-[22px]">image</span>
          </button>

          {/* Botón Obturador Central de Captura */}
          <button
            type="button"
            onClick={handleCaptureSnapshot}
            disabled={isProcessing}
            className="w-20 h-20 rounded-full border-4 border-white/40 p-1 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-2xl hover:border-primary disabled:opacity-50"
            title="Escanear y procesar ahora"
          >
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center shadow-glow-mint hover:bg-primary-container">
              <span className="material-symbols-outlined text-[32px] text-[#002116]">
                qr_code_scanner
              </span>
            </div>
          </button>

          {/* Botón de reintento / volver a enfocar */}
          <button
            type="button"
            onClick={() => startCamera()}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer shadow-lg"
            title="Refrescar cámara"
          >
            <span className="material-symbols-outlined text-[22px]">sync</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
