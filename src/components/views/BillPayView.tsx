'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CardCheckoutView } from './CardCheckoutView';
import { BillCameraScannerModal, ScannedBillResult } from '../BillCameraScannerModal';
import { ErrorBoundary } from '../ErrorBoundary';

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
    nombre: 'Electricidad (CFE)',
    subtitulo: 'CFE Suministrador Básico',
    icono: 'bolt',
    badge: 'Popular',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 font-label-caps text-[9px] uppercase font-bold border border-emerald-500/30',
    empresa: 'CFE Suministrador Básico',
    placeholder: 'Número de servicio (30 dígitos)',
    sampleTitular: 'Casa Mamá',
    sampleLocation: 'Jalisco',
    sampleContrato: '0182 9384 7162',
    sampleMXN: 842.00,
    sampleDueDate: 'Vence en 5 días',
    logoBg: 'bg-emerald-600',
    logoText: 'CFE',
    logoColor: 'text-white',
    billingCycle: 'Oct 01 • Oct 28',
  },
  {
    id: 'telefono',
    nombre: 'Telefonía',
    subtitulo: 'Telmex • Telcel • AT&T',
    icono: 'phone_iphone',
    badge: 'SPEI 10s',
    badgeClass: 'bg-blue-500/20 text-blue-300 font-label-caps text-[9px] uppercase font-bold border border-blue-500/30',
    empresa: 'Telmex Telecomunicaciones',
    placeholder: 'Teléfono a 10 dígitos o Referencia',
    sampleTitular: 'Rosa Elena Morales',
    sampleLocation: 'Guadalajara',
    sampleContrato: '33 1948 2019',
    sampleMXN: 389.00,
    sampleDueDate: 'Vence en 8 días',
    logoBg: 'bg-blue-600',
    logoText: 'TELMEX',
    logoColor: 'text-white',
    billingCycle: 'Oct 05 • Nov 05',
  },
  {
    id: 'internet',
    nombre: 'Internet',
    subtitulo: 'Totalplay • Izzi • Megacable',
    icono: 'wifi',
    badge: 'Fibra',
    badgeClass: 'bg-purple-500/20 text-purple-300 font-label-caps text-[9px] uppercase font-bold border border-purple-500/30',
    empresa: 'Totalplay Telecomunicaciones',
    placeholder: 'Número de cuenta Totalplay',
    sampleTitular: 'Familia Ugalde',
    sampleLocation: 'Zapopan',
    sampleContrato: 'TP-8841920',
    sampleMXN: 629.00,
    sampleDueDate: 'Vence en 12 días',
    logoBg: 'bg-purple-600',
    logoText: 'TOTAL',
    logoColor: 'text-white',
    billingCycle: 'Oct 10 • Nov 10',
  },
  {
    id: 'television',
    nombre: 'TV de Paga',
    subtitulo: 'Sky México • Dish',
    icono: 'tv',
    empresa: 'Sky México Satelital',
    placeholder: 'Número de contrato Sky / Dish',
    sampleTitular: 'Rosa Elena Morales',
    sampleLocation: 'Jalisco',
    sampleContrato: 'SKY-40912-MX',
    sampleMXN: 450.00,
    sampleDueDate: 'Vence en 14 días',
    logoBg: 'bg-indigo-600',
    logoText: 'SKY',
    logoColor: 'text-white',
    billingCycle: 'Oct 12 • Nov 12',
  },
  {
    id: 'agua',
    nombre: 'Agua Potable',
    subtitulo: 'SIAPA • SACMEX • AyD',
    icono: 'water_drop',
    empresa: 'SIAPA Agua Potable Jalisco',
    placeholder: 'Número de cuenta o medidor',
    sampleTitular: 'Casa Mamá',
    sampleLocation: 'Guadalajara',
    sampleContrato: 'SIAPA-993201',
    sampleMXN: 285.00,
    sampleDueDate: 'Vence en 20 días',
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
    sampleDueDate: 'Vence en 15 días',
    logoBg: 'bg-amber-600',
    logoText: 'GAS',
    logoColor: 'text-white',
    billingCycle: 'Oct 02 • Nov 02',
  },
];

export const getCategoryIconTheme = (id: string, isSelected: boolean) => {
  if (isSelected) {
    return 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30';
  }
  switch (id) {
    case 'electricidad':
      return 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-500/20';
    case 'telefono':
      return 'bg-blue-100 dark:bg-blue-500/15 text-blue-800 dark:text-blue-400 border border-blue-200/70 dark:border-blue-500/20';
    case 'internet':
      return 'bg-purple-100 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-200/70 dark:border-purple-500/20';
    case 'television':
      return 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-800 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-500/20';
    case 'agua':
      return 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-400 border border-cyan-200/70 dark:border-cyan-500/20';
    case 'gas':
      return 'bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-200/70 dark:border-amber-500/20';
    default:
      return 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10';
  }
};

export interface BillPayViewProps {
  onBack?: () => void;
  onPaymentSuccess?: (service: string, amountMXN: number) => void;
  selectedServiceId?: string;
  exchangeRate?: number;
  language?: 'es' | 'en';
}

export function BillPayView({
  onBack,
  onPaymentSuccess,
  selectedServiceId,
  exchangeRate = 20.45,
  language = 'es',
}: BillPayViewProps) {
  const isEn = language === 'en';
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServiceDefinition>(SERVICIOS_MEXICO[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [isCardCheckoutOpen, setIsCardCheckoutOpen] = useState(false);

  // Tarifa transparente del servicio KIN (Ganancia de plataforma por liquidación)
  const KIN_SERVICE_FEE = 1.99;

  // Sincronizar servicio si viene por props
  useEffect(() => {
    if (selectedServiceId) {
      const found = SERVICIOS_MEXICO.find((s) => s.id === selectedServiceId);
      if (found) {
        setServicioSeleccionado(found);
      }
    }
  }, [selectedServiceId]);

  const showToast = (title: string, subtitle: string) => {
    toast.success(title, {
      description: subtitle,
    });
  };

  const activeService = servicioSeleccionado || SERVICIOS_MEXICO[0];
  const safeExchangeRate = exchangeRate > 0 ? exchangeRate : 20.45;

  // Cálculos financieros precisos
  const currentMXN = activeService.sampleMXN || 842.00;
  const currentUSD = +(currentMXN / safeExchangeRate).toFixed(2);
  const totalUSDToCharge = +(currentUSD + KIN_SERVICE_FEE).toFixed(2);

  // Flujo Dedicado de Pago con Tarjeta (Pantalla Completa Nativa, Cero Modales)
  if (isCardCheckoutOpen) {
    return (
      <ErrorBoundary fallbackTitle={isEn ? 'Bill Pay Card Checkout' : 'Pago de Factura con Tarjeta'} onReset={() => setIsCardCheckoutOpen(false)}>
        <CardCheckoutView
          onBack={() => setIsCardCheckoutOpen(false)}
          title={isEn ? 'Bill Pay Card Checkout' : 'Pago de Factura con Tarjeta'}
          conceptTitle={activeService.nombre}
          conceptSubtitle={`${activeService.sampleTitular} • ${activeService.sampleLocation} (${activeService.sampleContrato})`}
          amountBaseUSD={currentUSD}
          amountMXN={currentMXN}
          feeUSD={KIN_SERVICE_FEE}
          exchangeRate={safeExchangeRate}
          language={language}
          metadata={{
            serviceId: activeService.id,
            empresa: activeService.empresa,
            contrato: activeService.sampleContrato,
            titular: activeService.sampleTitular,
          }}
          onPaymentSuccess={() => {
            setIsCardCheckoutOpen(false);
            setIsSuccess(true);
            if (onPaymentSuccess) {
              onPaymentSuccess(activeService.nombre, currentMXN);
            }
          }}
        />
      </ErrorBoundary>
    );
  }

  // Filtrado de servicios
  const filteredServices = SERVICIOS_MEXICO.filter((s) =>
    s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subtitulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.empresa.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="flex flex-col w-full min-h-[700px] space-y-5 text-slate-900 dark:text-white select-none pb-28 relative">
      {/* Dynamic Atmospheric Glow */}
      <div className="relative w-full">
        <div className="absolute -top-6 -left-10 w-44 h-44 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-4 -right-10 w-48 h-48 bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Context Header */}
        <div className="relative flex flex-col space-y-1.5 z-10 pt-1">
          <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded-full bg-white dark:bg-[#181825] text-emerald-700 dark:text-[#2ED5A4] border border-slate-200/80 dark:border-white/10 shadow-sm">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
              {isEn ? 'Zero Fees • Instant SPEI Receipt' : 'Sin Comisiones • Comprobante SPEI Inmediato'}
            </span>
          </div>
          <h1 className="font-headline-md text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {isEn ? (
              <>Pay Utilities in Mexico <span className="text-emerald-700 dark:text-[#2ED5A4] font-bold">Direct from USA</span></>
            ) : (
              <>Paga Servicios en México <span className="text-emerald-700 dark:text-[#2ED5A4] font-bold">Directo desde USA</span></>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#A6ADC8] leading-relaxed max-w-[360px]">
            {isEn
              ? 'Support family back home. Direct settlement with official SAT fiscal vouchers.'
              : 'Apoya a tu familia. Liquidación directa con comprobante fiscal oficial del SAT.'}
          </p>
        </div>
      </div>

      {/* Search & Barcode Quick-Action Strip */}
      <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-white dark:bg-[#181825] shadow-sm border border-slate-200/80 dark:border-white/10">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3.5 text-slate-400 dark:text-[#9399B2] text-[20px]">search</span>
          <input
            className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-[#14141F] rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9399B2] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-[#2ED5A4] shadow-inner transition-all border border-slate-200/80 dark:border-white/10"
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
          onClick={() => setShowCameraScanner(true)}
          className="group relative overflow-hidden flex items-center justify-between px-4 py-3.5 rounded-xl bg-slate-50/90 hover:bg-slate-100/80 dark:bg-[#1E1E2E] dark:hover:bg-[#252538] shadow-sm transition-transform active:scale-[0.98] border border-slate-200/80 dark:border-white/10 cursor-pointer text-left"
          id="scan-btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[#2ED5A4] transition-colors">
                {isEn ? 'Scan Barcode / QR with Camera' : 'Escanear Código de Barras / QR con la Cámara'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-[#A6ADC8]">
                {isEn ? 'Auto-detects account & amount due' : 'Detecta contrato y monto a pagar automáticamente'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-[#2ED5A4]/15 text-emerald-700 dark:text-[#2ED5A4] group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          </div>
        </button>
      </div>

      {/* 6 Essential Mexican Service Categories Grid (2x3) */}
      <div className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-caps text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#A6ADC8] font-bold">
            {isEn ? 'Essential Categories' : 'Categorías Principales'}
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-emerald-700 dark:text-[#2ED5A4] flex items-center gap-1 cursor-pointer hover:underline bg-transparent border-0 font-semibold"
          >
            {isEn ? 'View all (120+)' : 'Ver todos (120+)'} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {filteredServices.map((serv) => {
            const isSelected = activeService.id === serv.id;
            return (
              <button
                key={serv.id}
                type="button"
                onClick={() => setServicioSeleccionado(serv)}
                className={`flex flex-col items-start p-3.5 rounded-2xl transition-all text-left group relative overflow-hidden shadow-sm active:scale-[0.98] cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-50/90 dark:bg-[#242638] border-emerald-500 dark:border-[#2ED5A4] shadow-[0_2px_12px_rgba(5,150,105,0.15)] dark:shadow-[0_0_15px_rgba(46,213,164,0.25)]'
                    : 'bg-white dark:bg-[#181825] hover:bg-slate-50 dark:hover:bg-[#1E1E2E] border-slate-200/80 dark:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 overflow-hidden ${getCategoryIconTheme(
                        serv.id,
                        isSelected
                      )}`}
                    >
                      <span className="material-symbols-outlined text-[24px]">{serv.icono}</span>
                    </div>
                    {/* Badge distintivo de la compañía */}
                    <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md ${serv.logoBg} text-white text-[8px] font-black leading-none shadow-sm border border-white/20 uppercase tracking-tighter`}>
                      {serv.logoText}
                    </div>
                  </div>
                  {serv.badge && (
                    <span className={`px-2 py-0.5 rounded-full font-label-caps text-[9px] uppercase font-bold tracking-tight shrink-0 whitespace-nowrap ${serv.badgeClass || 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#2ED5A4]'}`}>
                      {serv.badge}
                    </span>
                  )}
                </div>
                <span className={`text-sm font-bold transition-colors truncate w-full ${isSelected ? 'text-emerald-800 dark:text-[#2ED5A4]' : 'text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[#2ED5A4]'}`}>
                  {isEn ? serv.nombre : serv.nombre}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#A6ADC8] truncate w-full mt-0.5">
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
          <span className="font-label-caps text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#A6ADC8] font-bold">
            {isEn ? 'Pending Service Invoice' : 'Factura de Servicio Pendiente'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-[#2ED5A4] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-[#2ED5A4] animate-pulse" /> {isEn ? 'Verified Link' : 'Vínculo Verificado'}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#181825] p-4 shadow-sm flex flex-col space-y-4 border border-slate-200/80 dark:border-white/10">
          {/* Ambient Glow Behind Due Date */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Card Top: Service & Beneficiary */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Institutional Logo Capsule */}
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 p-1 flex items-center justify-center shadow-sm shrink-0 border border-slate-200/60 dark:border-white/10">
                <div className={`w-full h-full rounded-xl ${activeService.logoBg} flex items-center justify-center ${activeService.logoColor} px-1 overflow-hidden shadow-sm`}>
                  <span className="text-[10px] font-black leading-none tracking-wider text-center uppercase truncate">
                    {activeService.logoText}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeService.sampleTitular}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#242638] text-slate-600 dark:text-[#A6ADC8] text-[9px] font-bold border border-slate-200/60 dark:border-white/10">
                    {activeService.sampleLocation}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-[#A6ADC8]">
                  {activeService.empresa}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-[#242638] text-emerald-800 dark:text-[#2ED5A4] text-xs font-semibold border border-emerald-200/60 dark:border-white/10">
              {activeService.sampleDueDate}
            </span>
          </div>

          {/* Card Middle: Key Financial Data */}
          <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#14141F] flex flex-col space-y-2.5 border border-slate-200/80 dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-[#A6ADC8] font-medium">{isEn ? 'Service Identifier' : 'Número de Servicio'}</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white font-bold">
                {activeService.sampleContrato}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-[#A6ADC8] font-medium">{isEn ? 'Billing Cycle' : 'Ciclo de Facturación'}</span>
              <span className="text-xs text-slate-800 dark:text-white font-medium">
                {activeService.billingCycle}
              </span>
            </div>
            <div className="h-px w-full bg-slate-200/80 dark:bg-white/10" />
            <div className="flex flex-col space-y-1.5 pt-1 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-[#A6ADC8]">
                <span>{isEn ? 'Official Invoice Amount' : 'Monto Oficial del Recibo'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${currentMXN.toLocaleString('en-US', { minimumFractionDigits: 2 })} MXN (${currentUSD.toFixed(2)} USD)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-[#A6ADC8]">
                <span className="flex items-center gap-1">
                  <span>{isEn ? 'KIN Service & Delivery Fee' : 'Cargo por Envío / Tarifa del Servicio KIN'}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#2ED5A4] text-[9px] font-bold">
                    {isEn ? 'FEE' : 'TARIFA'}
                  </span>
                </span>
                <span className="font-mono font-bold text-emerald-700 dark:text-[#2ED5A4]">+${KIN_SERVICE_FEE.toFixed(2)} USD</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-900 dark:text-white font-bold block">
                    {isEn ? 'Total to Charge Card' : 'Total a Cobrar en Tarjeta'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-[#A6ADC8]">
                    {isEn ? 'Processed via Stripe Sandbox' : 'Procesado vía Stripe Sandbox'}
                  </span>
                </div>
                <span className="font-mono text-base font-black text-emerald-700 dark:text-[#2ED5A4]">
                  ${totalUSDToCharge.toFixed(2)} <span className="text-xs text-slate-700 dark:text-white">USD</span>
                </span>
              </div>
            </div>
          </div>

          {/* Trust Badge & SAT Stamp */}
          <div className="flex items-center justify-between pt-0.5 px-0.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700 dark:text-[#2ED5A4] text-[18px]">verified</span>
              <span className="text-xs text-slate-500 dark:text-[#A6ADC8]">
                {isEn ? 'Official SAT CFDI tax receipt guaranteed' : 'Comprobante fiscal SAT CFDI garantizado'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => showToast(isEn ? 'SAT CFDI Preview' : 'Vista Previa CFDI SAT', isEn ? 'CFDI 4.0 XML & PDF stored in ClientVault' : 'CFDI 4.0 XML y PDF almacenado en ClientVault')}
              className="material-symbols-outlined text-slate-400 hover:text-slate-700 dark:text-[#9399B2] dark:hover:text-white text-[18px] cursor-pointer bg-transparent border-0"
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
          onClick={() => setIsCardCheckoutOpen(true)}
          className="w-full h-14 rounded-full bg-gradient-to-r from-[#2ED5A4] to-[#18A57E] text-slate-950 text-base font-bold flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(46,213,164,0.3)] transition-all active:scale-[0.98] cursor-pointer hover:brightness-110"
          id="pay-trigger-btn"
        >
          <span className="material-symbols-outlined text-[20px] font-bold">credit_card</span>
          <span>{isEn ? `Pay Bill with Card ($${totalUSDToCharge.toFixed(2)} USD)` : `Pagar Servicio con Tarjeta ($${totalUSDToCharge.toFixed(2)} USD)`}</span>
          <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
        </button>
        <div className="flex items-center justify-center gap-1.5 text-center">
          <span className="material-symbols-outlined text-[14px] text-[#9399B2]">lock</span>
          <span className="font-label-caps text-[10px] text-[#9399B2] uppercase tracking-wider font-semibold">
            {isEn ? 'Secured with Stripe Sandbox & KIN SPEI Node • Protected by Banxico' : 'Asegurado con Stripe Sandbox y Nodo SPEI KIN • Protegido por Banxico'}
          </span>
        </div>
      </div>

      {/* Success Modal Dialogue */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-[360px] bg-[#181825] rounded-3xl p-6 shadow-2xl border border-white/10 text-center space-y-4 relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-[#2ED5A4] flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(46,213,164,0.3)]">
              <span className="material-symbols-outlined text-[36px] font-bold">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {isEn ? 'Bill Paid Successfully!' : '¡Factura Liquidada!'}
            </h3>
            <p className="text-xs text-[#A6ADC8]">
              {isEn
                ? `Payment sent via SPEI Banxico to ${activeService.empresa}.`
                : `Pago enviado vía SPEI Banxico a ${activeService.empresa}.`}
            </p>

            <div className="p-3.5 rounded-2xl bg-[#14141F] border border-white/10 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A6ADC8]">{isEn ? 'Service:' : 'Servicio:'}</span>
                <span className="font-bold text-white">{activeService.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6ADC8]">{isEn ? 'Reference:' : 'Referencia:'}</span>
                <span className="font-mono font-bold text-white">{activeService.sampleContrato}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6ADC8]">{isEn ? 'Amount Settled:' : 'Monto Liquidado:'}</span>
                <span className="font-bold text-[#2ED5A4]">${currentMXN.toFixed(2)} MXN (${currentUSD.toFixed(2)} USD)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6ADC8]">{isEn ? 'SAT Fiscal ID:' : 'Folio Fiscal SAT:'}</span>
                <span className="font-mono text-white/90">SAT-CFDI-892419</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6ADC8]">{isEn ? 'SPEI Status:' : 'Estatus SPEI:'}</span>
                <span className="font-bold text-[#2ED5A4]">{isEn ? 'Settled in Real Time ✓' : 'Liquidado en Tiempo Real ✓'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="w-full h-12 rounded-full bg-[#2ED5A4] text-black font-bold text-sm hover:brightness-110 transition-all shadow-md cursor-pointer active:scale-95"
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
        targetServiceName={activeService.nombre}
      />
    </div>
  );
}
