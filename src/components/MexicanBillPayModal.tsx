'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, CheckCircleIcon } from './Icons';
import { BillCameraScannerModal, ScannedBillResult } from './BillCameraScannerModal';

export interface MexicanBillPayModalProps {
  isOpen?: boolean;
  isScreen?: boolean;
  onClose?: () => void;
  onPaymentSuccess?: (service: string, amountMXN: number) => void;
  selectedServiceId?: string;
  exchangeRate?: number;
  language?: 'es' | 'en';
}

export interface ServiceDefinition {
  id: string;
  nombre: string;
  subtitulo: string;
  icono: string;
  badge?: string;
  badgeClass?: string;
  empresa: string;
  placeholder: string;
  sampleTitular: string;
  sampleLocation: string;
  sampleContrato: string;
  sampleMXN: number;
  sampleDueDate: string;
  logoBg: string;
  logoText: string;
  logoColor: string;
  billingCycle: string;
}

export const SERVICIOS_MEXICO: ServiceDefinition[] = [
  {
    id: 'electricidad',
    nombre: 'Electricity',
    subtitulo: 'CFE (Comisión Federal)',
    icono: 'bolt',
    badge: 'Popular',
    badgeClass: 'bg-primary-container text-on-primary-container font-label-caps text-[10px] uppercase font-bold tracking-tight',
    empresa: 'CFE Suministrador Básico',
    placeholder: 'Número de servicio (30 dígitos)',
    sampleTitular: 'Casa Mamá',
    sampleLocation: 'Jalisco',
    sampleContrato: '0182 9384 7162',
    sampleMXN: 842.00,
    sampleDueDate: 'Due in 5 days',
    logoBg: 'bg-emerald-700',
    logoText: 'CFE',
    logoColor: 'text-white',
    billingCycle: 'Oct 01 • Oct 28',
  },
  {
    id: 'telefono',
    nombre: 'Telephony',
    subtitulo: 'Telmex • Telcel • AT&T',
    icono: 'phone_iphone',
    badge: 'SPEI 10s',
    badgeClass: 'bg-surface-container-lowest text-on-surface-variant font-label-caps text-[9px] uppercase',
    empresa: 'Telmex Telecomunicaciones',
    placeholder: 'Teléfono a 10 dígitos o Referencia',
    sampleTitular: 'Rosa Elena Morales',
    sampleLocation: 'Guadalajara',
    sampleContrato: '33 1948 2019',
    sampleMXN: 389.00,
    sampleDueDate: 'Due in 8 days',
    logoBg: 'bg-blue-600',
    logoText: 'TELMEX',
    logoColor: 'text-white',
    billingCycle: 'Oct 05 • Nov 05',
  },
  {
    id: 'internet',
    nombre: 'Internet',
    subtitulo: 'Izzi • Totalplay • Megacable',
    icono: 'wifi',
    empresa: 'Totalplay Telecomunicaciones',
    placeholder: 'Número de cuenta Totalplay',
    sampleTitular: 'Familia Ugalde',
    sampleLocation: 'Zapopan',
    sampleContrato: 'TP-8841920',
    sampleMXN: 629.00,
    sampleDueDate: 'Due in 12 days',
    logoBg: 'bg-[#5018cb]',
    logoText: 'TOTAL',
    logoColor: 'text-white',
    billingCycle: 'Oct 10 • Nov 10',
  },
  {
    id: 'television',
    nombre: 'Pay TV',
    subtitulo: 'Sky México • Dish',
    icono: 'tv',
    empresa: 'Sky México Satelital',
    placeholder: 'Número de contrato Sky / Dish',
    sampleTitular: 'Rosa Elena Morales',
    sampleLocation: 'Jalisco',
    sampleContrato: 'SKY-40912-MX',
    sampleMXN: 450.00,
    sampleDueDate: 'Due in 14 days',
    logoBg: 'bg-sky-600',
    logoText: 'SKY',
    logoColor: 'text-white',
    billingCycle: 'Oct 12 • Nov 12',
  },
  {
    id: 'agua',
    nombre: 'Agua Potable',
    subtitulo: 'SACMEX • SIAPA • AyD',
    icono: 'water_drop',
    empresa: 'SIAPA Agua Potable Jalisco',
    placeholder: 'Número de cuenta o medidor',
    sampleTitular: 'Casa Mamá',
    sampleLocation: 'Guadalajara',
    sampleContrato: 'SIAPA-993201',
    sampleMXN: 285.00,
    sampleDueDate: 'Due in 20 days',
    logoBg: 'bg-cyan-600',
    logoText: 'SIAPA',
    logoColor: 'text-white',
    billingCycle: 'Sep 25 • Oct 25',
  },
  {
    id: 'gas',
    nombre: 'Gas Natural',
    subtitulo: 'Naturgy • Gas del Norte',
    icono: 'local_fire_department',
    empresa: 'Naturgy México Gas Natural',
    placeholder: 'Número de cliente o cuenta',
    sampleTitular: 'Casa Mamá',
    sampleLocation: 'Jalisco',
    sampleContrato: 'NAT-552019-JAL',
    sampleMXN: 520.00,
    sampleDueDate: 'Due in 15 days',
    logoBg: 'bg-amber-600',
    logoText: 'GAS',
    logoColor: 'text-white',
    billingCycle: 'Oct 02 • Nov 02',
  },
];

export function MexicanBillPayModal({
  isOpen = true,
  isScreen = false,
  onClose,
  onPaymentSuccess,
  selectedServiceId,
  exchangeRate = 20.45,
  language = 'es',
}: MexicanBillPayModalProps) {
  const isEn = language === 'en';
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServiceDefinition>(SERVICIOS_MEXICO[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected service if changed via props
  useEffect(() => {
    if (selectedServiceId) {
      const found = SERVICIOS_MEXICO.find((s) => s.id === selectedServiceId);
      if (found) {
        setServicioSeleccionado(found);
      }
    }
  }, [selectedServiceId]);

  if (!isOpen && !isScreen) return null;

  const showToast = (title: string, subtitle: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Calculate USD amount based on selected service MXN amount and exchange rate
  const currentMXN = servicioSeleccionado.sampleMXN;
  const currentUSD = +(currentMXN / exchangeRate).toFixed(2);

  // Filter categories by search input
  const filteredServices = SERVICIOS_MEXICO.filter((s) =>
    s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subtitulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.empresa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Trigger Barcode / QR Scanner (Abre la cámara real del teléfono)
  const handleTriggerScanner = () => {
    setShowCameraScanner(true);
  };

  // Callback cuando se escanea exitosamente un recibo
  const handleScanSuccess = (scanned: ScannedBillResult) => {
    const found = SERVICIOS_MEXICO.find(
      (s) =>
        s.id === scanned.serviceId ||
        s.nombre.toLowerCase().includes((scanned.serviceName || '').toLowerCase()) ||
        s.subtitulo.toLowerCase().includes((scanned.serviceName || '').toLowerCase())
    );

    if (found) {
      setServicioSeleccionado({
        ...found,
        sampleContrato: scanned.contractNumber,
        sampleMXN: scanned.amountMXN,
        sampleTitular: scanned.titular || found.sampleTitular,
      });
    } else {
      setServicioSeleccionado((prev) => ({
        ...prev,
        sampleContrato: scanned.contractNumber,
        sampleMXN: scanned.amountMXN,
        sampleTitular: scanned.titular || prev.sampleTitular,
      }));
    }

    showToast(
      isEn ? 'Receipt Scanned Successfully! ⚡' : '¡Recibo Escaneado con Éxito! ⚡',
      `${scanned.serviceName || servicioSeleccionado.nombre} ${isEn ? 'linked:' : 'vinculado:'} ${scanned.contractNumber}`
    );
  };

  // Pay Selected Bill via SPEI
  const handlePayBill = () => {
    if (isPaying) return;
    setIsPaying(true);
    showToast(
      isEn ? 'SPEI Payment Queued ⚡' : 'Pago SPEI en Cola ⚡',
      isEn ? `$${currentUSD} USD transferred to ${servicioSeleccionado.empresa}` : `$${currentUSD} USD transferidos a ${servicioSeleccionado.empresa}`
    );

    setTimeout(() => {
      setIsPaying(false);
      setIsSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(servicioSeleccionado.nombre, currentMXN);
      }
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    if (!isScreen && onClose) {
      onClose();
    }
  };

  const content = (
    <div className="flex flex-col w-full space-y-5 animate-fade-in relative">
      {/* Dynamic Atmospheric Glow */}
      <div className="relative w-full">
        <div className="absolute -top-6 -left-10 w-44 h-44 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-4 -right-10 w-48 h-48 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none" />

        {/* Context Header */}
        <div className="relative flex flex-col space-y-1 z-10">
          <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded-full bg-surface-container-high text-primary border border-white/5 shadow-inner">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider font-bold">
              {isEn ? 'Zero Fees • Instant SPEI Receipt' : 'Sin Comisiones • Comprobante SPEI Inmediato'}
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
            {isEn ? (
              <>Pay Utilities in Mexico <span className="text-primary font-bold">Direct from USA</span></>
            ) : (
              <>Paga Servicios en México <span className="text-primary font-bold">Directo desde USA</span></>
            )}
          </h1>
          <p className="font-body-medium text-body-medium text-on-surface-variant">
            {isEn
              ? 'Support family back home. Direct settlement with official SAT fiscal vouchers.'
              : 'Apoya a tu familia. Liquidación directa con comprobante fiscal oficial del SAT.'}
          </p>
        </div>
      </div>

      {/* Search & Barcode Quick-Action Strip */}
      <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-surface-container shadow-xl border border-white/5">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">search</span>
          <input
            className="w-full h-12 pl-11 pr-4 bg-surface-container-low rounded-xl font-body-base text-body-base text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-inner transition-all border border-white/5"
            id="provider-search"
            placeholder={isEn ? 'Search over 120 Mexican providers...' : 'Buscar entre más de 120 proveedores mexicanos...'}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 1-Tap Camera Scanner CTA Banner */}
        <button
          type="button"
          onClick={handleTriggerScanner}
          className="group relative overflow-hidden flex items-center justify-between px-4 py-3.5 rounded-xl bg-surface-container-high shadow-lg transition-transform active:scale-[0.98] border border-white/5 cursor-pointer text-left"
          id="scan-btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-lowest text-primary shadow-[0_0_16px_rgba(87,242,191,0.25)] border border-primary/20">
              <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-title-base text-title-base text-on-surface group-hover:text-primary transition-colors">
                {isEn ? 'Scan Barcode / QR with Camera' : 'Escanear Código de Barras / QR con la Cámara'}
              </span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                {isEn ? 'Auto-detects account & amount due' : 'Detecta contrato y monto a pagar automáticamente'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          </div>
        </button>
      </div>

      {/* 6 Essential Mexican Service Categories Grid (2x3) */}
      <div className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            {isEn ? 'Essential Categories' : 'Categorías Principales'}
          </span>
          <span
            onClick={() => setSearchQuery('')}
            className="font-caption-sm text-caption-sm text-primary flex items-center gap-1 cursor-pointer hover:underline"
          >
            {isEn ? 'View all (120+)' : 'Ver todos (120+)'} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {filteredServices.map((serv) => {
            const isSelected = servicioSeleccionado.id === serv.id;
            return (
              <button
                key={serv.id}
                type="button"
                onClick={() => setServicioSeleccionado(serv)}
                className={`flex flex-col items-start p-3.5 rounded-2xl transition-all text-left group relative overflow-hidden shadow-md active:scale-[0.98] cursor-pointer border ${
                  isSelected
                    ? 'bg-surface-container-high border-primary shadow-glow-mint'
                    : 'bg-surface-container hover:bg-surface-container-high border-white/5'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 overflow-hidden ${
                        isSelected
                          ? 'bg-primary text-[#002116] font-bold'
                          : serv.id === 'electricidad' || serv.id === 'agua'
                          ? 'bg-primary-container/20 text-primary'
                          : serv.id === 'internet'
                          ? 'bg-secondary-container/50 text-secondary'
                          : 'bg-surface-bright text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">{serv.icono}</span>
                    </div>
                    {/* Badge distintivo de la compañía con su color institucional */}
                    <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md ${serv.logoBg} text-white text-[8px] font-black leading-none shadow-sm border border-white/20 uppercase tracking-tighter`}>
                      {serv.logoText}
                    </div>
                  </div>
                  {serv.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-label-caps text-[9px] uppercase font-bold tracking-tight shrink-0 max-w-[70px] truncate">
                      {serv.badge}
                    </span>
                  )}
                </div>
                <span className={`font-title-base text-title-base transition-colors truncate w-full font-bold ${isSelected ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                  {isEn
                    ? serv.id === 'electricidad' ? 'Electricity'
                      : serv.id === 'telefono' ? 'Telephony'
                      : serv.id === 'internet' ? 'Internet'
                      : serv.id === 'television' ? 'Pay TV'
                      : serv.id === 'agua' ? 'Water'
                      : 'Gas'
                    : serv.id === 'electricidad' ? 'Electricidad (CFE)'
                      : serv.id === 'telefono' ? 'Telefonía'
                      : serv.id === 'internet' ? 'Internet'
                      : serv.id === 'television' ? 'TV de Paga'
                      : serv.id === 'agua' ? 'Agua Potable'
                      : 'Gas Natural'}
                </span>
                <span className="font-caption-sm text-[11px] text-on-surface-variant truncate w-full mt-0.5">
                  {serv.subtitulo}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Bill Verification Demo Card */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            {isEn ? 'Pending Service Invoice' : 'Factura de Servicio Pendiente'}
          </span>
          <span className="inline-flex items-center gap-1 font-caption-sm text-caption-sm text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> {isEn ? 'Verified Link' : 'Vínculo Verificado'}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-surface-container p-4 shadow-2xl flex flex-col space-y-4 border border-white/5">
          {/* Ambient Glow Behind Due Date */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          {/* Card Top: Service & Beneficiary */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Institutional Logo Capsule */}
              <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md shrink-0">
                <div className={`w-full h-full rounded-xl ${servicioSeleccionado.logoBg} flex items-center justify-center ${servicioSeleccionado.logoColor} px-1 overflow-hidden`}>
                  <span className="font-headline-md text-[10px] font-black leading-none tracking-wider text-center uppercase truncate">
                    {servicioSeleccionado.logoText}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-title-base text-title-base text-on-surface font-semibold">
                    {servicioSeleccionado.sampleTitular}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-[9px]">
                    {servicioSeleccionado.sampleLocation}
                  </span>
                </div>
                <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                  {servicioSeleccionado.empresa}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-caption-sm text-caption-sm font-semibold border border-white/5">
              {isEn ? servicioSeleccionado.sampleDueDate : servicioSeleccionado.sampleDueDate.replace('Due in', 'Vence en').replace('days', 'días')}
            </span>
          </div>

          {/* Card Middle: Key Financial Data */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col space-y-2.5 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-caption-sm text-caption-sm text-on-surface-variant">{isEn ? 'Service Identifier' : 'Número de Servicio'}</span>
              <span className="font-financial-mono text-financial-mono text-on-surface font-bold">
                {servicioSeleccionado.sampleContrato}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-caption-sm text-caption-sm text-on-surface-variant">{isEn ? 'Billing Cycle' : 'Ciclo de Facturación'}</span>
              <span className="font-body-medium text-body-medium text-on-surface">
                {servicioSeleccionado.billingCycle}
              </span>
            </div>
            <div className="h-px w-full bg-surface-container-highest" />
            <div className="flex items-end justify-between pt-1">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-bold">
                  {isEn ? 'Amount Due (MXN)' : 'Monto a Pagar (MXN)'}
                </span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  ${currentMXN.toLocaleString('en-US', { minimumFractionDigits: 2 })} MXN
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold">
                  {isEn ? 'USD Debit (KIN Rate)' : 'Cargo USD (Tasa KIN)'}
                </span>
                <span className="font-financial-mono text-[18px] text-primary font-bold">
                  ${currentUSD.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Trust Badge & SAT Stamp */}
          <div className="flex items-center justify-between pt-0.5 px-0.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                {isEn ? 'Official SAT CFDI tax receipt guaranteed' : 'Comprobante fiscal SAT CFDI garantizado'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => showToast(isEn ? 'SAT CFDI Preview' : 'Vista Previa CFDI SAT', isEn ? 'CFDI 4.0 XML & PDF stored in ClientVault' : 'CFDI 4.0 XML y PDF almacenado en ClientVault')}
              className="material-symbols-outlined text-outline text-[18px] cursor-pointer hover:text-on-surface"
              title={isEn ? 'View SAT CFDI' : 'Ver CFDI SAT'}
            >
              receipt_long
            </button>
          </div>
        </div>
      </div>

      {/* Primary Floating Action Execution CTA */}
      <div className="flex flex-col space-y-2 pt-1 pb-4">
        <button
          type="button"
          onClick={handlePayBill}
          disabled={isPaying}
          className="w-full h-14 rounded-full bg-primary hover:bg-primary-container text-on-primary font-title-base text-title-base font-bold flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(87,242,191,0.3)] transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          id="pay-trigger-btn"
        >
          {isPaying ? (
            <>
              <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              <span>{isEn ? 'Processing via SPEI...' : 'Procesando vía SPEI...'}</span>
            </>
          ) : (
            <>
              <span>{isEn ? `Pay Selected Bill ($${currentUSD.toFixed(2)} USD)` : `Pagar Servicio ($${currentUSD.toFixed(2)} USD)`}</span>
              <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-1.5 text-center">
          <span className="material-symbols-outlined text-[14px] text-outline">lock</span>
          <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
            {isEn ? 'Secured with KIN Zero-Knowledge SPEI Node • Protected by Banxico' : 'Asegurado con Nodo SPEI Zero-Knowledge KIN • Protegido por Banxico'}
          </span>
        </div>
      </div>

      {/* Toast Feedback Simulation Container */}
      {toastMessage && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] p-3 rounded-2xl bg-surface-container-highest shadow-2xl flex items-center gap-3 transition-opacity duration-300 z-50 border border-white/10 animate-fade-in"
          id="toast"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">check</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-title-base text-[13px] text-white truncate font-bold">
              {toastMessage.title}
            </span>
            <span className="font-caption-sm text-[11px] text-on-surface-variant truncate">
              {toastMessage.subtitle}
            </span>
          </div>
        </div>
      )}

      {/* Success Modal Dialogue */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-[360px] bg-surface-container rounded-3xl p-6 shadow-2xl border border-white/10 text-center space-y-4 animate-scale-in relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/30 shadow-glow-mint">
              <span className="material-symbols-outlined text-[36px] font-bold">check_circle</span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-white tracking-tight">
              {isEn ? 'Bill Paid Successfully!' : '¡Factura Liquidada!'}
            </h3>
            <p className="font-caption-sm text-on-surface-variant">
              {isEn
                ? `Payment sent via SPEI Banxico to ${servicioSeleccionado.empresa}.`
                : `Pago enviado vía SPEI Banxico a ${servicioSeleccionado.empresa}.`}
            </p>

            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-white/5 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{isEn ? 'Service:' : 'Servicio:'}</span>
                <span className="font-bold text-white">{servicioSeleccionado.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{isEn ? 'Reference:' : 'Referencia:'}</span>
                <span className="font-financial-mono font-bold text-white">{servicioSeleccionado.sampleContrato}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{isEn ? 'Amount Settled:' : 'Monto Liquidado:'}</span>
                <span className="font-bold text-primary">${currentMXN.toFixed(2)} MXN (${currentUSD.toFixed(2)} USD)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{isEn ? 'SAT Fiscal ID:' : 'Folio Fiscal SAT:'}</span>
                <span className="font-financial-mono text-white/90">SAT-CFDI-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{isEn ? 'SPEI Status:' : 'Estatus SPEI:'}</span>
                <span className="font-bold text-primary">{isEn ? 'Settled in Real Time ✓' : 'Liquidado en Tiempo Real ✓'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full h-12 rounded-full bg-primary text-on-primary font-bold text-sm hover:bg-primary-container transition-all shadow-md cursor-pointer active:scale-95"
            >
              {isEn ? 'Done / Back to Bills' : 'Listo / Volver a Facturas'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Cámara en Vivo y Escáner de Códigos de Barras */}
      <BillCameraScannerModal
        isOpen={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onScanSuccess={handleScanSuccess}
        targetServiceName={servicioSeleccionado.nombre}
      />
    </div>
  );

  // If used directly as a Screen Tab
  if (isScreen) {
    return content;
  }

  // If used as a Modal Overlay
  return (
    <div className="fixed inset-0 z-50 bg-[#06070B] text-white flex justify-center selection:bg-primary/30 selection:text-primary overflow-y-auto animate-fade-in">
      <div className="w-full max-w-[400px] flex flex-col relative min-h-screen pb-24 px-4">
        {/* Modal Top Header with Close */}
        <header className="sticky top-0 z-40 bg-[#06070B]/90 backdrop-blur-xl pt-2 pb-2.5 -mx-4 px-4 border-b border-white/5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-primary">receipt_long</span>
            <span className="font-headline-md text-base font-bold text-white tracking-tight">KIN Bill Pay</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </header>

        {content}
      </div>
    </div>
  );
}
