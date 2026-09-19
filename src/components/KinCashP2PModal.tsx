'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeftIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StatusCellularIcon,
  StatusWifiIcon,
  StatusBatteryIcon,
  SearchIcon,
  CloseIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  getBankLogoUrl,
  FingerprintIcon,
  QrCodeScannerIcon,
  SwapHorizIcon,
  BackspaceIcon,
} from './Icons';

export interface ContactItem {
  id: string;
  name: string;
  fullName: string;
  avatar: string;
  role: string;
  country: string;
  bank: string;
  photoUrl: string;
}

const DEFAULT_CONTACTS: ContactItem[] = [
  {
    id: '0',
    name: 'Mamá Rosa',
    fullName: 'Rosa Elena Morales',
    avatar: '👩🏻',
    role: 'Mother ❤️',
    country: 'Mexico',
    bank: 'BBVA México • SPEI Instant',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '1',
    name: 'Manuel',
    fullName: 'Manuel Ugalde Eligio',
    avatar: '👨🏻',
    role: 'Hermano',
    country: 'Mexico',
    bank: 'BanCoppel SPEI',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '2',
    name: 'Sophia',
    fullName: 'Sophia Ramos Eligio',
    avatar: '👩🏻',
    role: 'Hermana',
    country: 'Mexico',
    bank: 'BBVA Bancomer',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '3',
    name: 'David',
    fullName: 'David Ortiz Ramos',
    avatar: '👨🏽',
    role: 'Primo',
    country: 'Mexico',
    bank: 'Banco Azteca',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '4',
    name: 'Maria',
    fullName: 'María Elena Ugalde',
    avatar: '👩🏽',
    role: 'Madre',
    country: 'Mexico',
    bank: 'Santander México',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '5',
    name: 'Mike',
    fullName: 'Mike Chen González',
    avatar: '👨🏻',
    role: 'Amigo',
    country: 'Mexico',
    bank: 'Banorte',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  },
];

interface KinCashP2PModalProps {
  isOpen: boolean;
  onClose: () => void;
  onP2PSuccess?: (recipient: string, amountMXN: number) => void;
  contacts?: ContactItem[];
  onViewHistory?: () => void;
}

export function KinCashP2PModal({
  isOpen,
  onClose,
  onP2PSuccess,
  contacts = DEFAULT_CONTACTS,
  onViewHistory,
}: KinCashP2PModalProps) {
  const exchangeRate = 20.45;
  const [currentAmount, setCurrentAmount] = useState('120.00');
  const [selectedContact, setSelectedContact] = useState<ContactItem>(contacts[0] || DEFAULT_CONTACTS[0]);
  const [conceptNote, setConceptNote] = useState('Groceries & medicine for the week');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Slider Touch & Mouse drag state
  const trackRef = useRef<HTMLDivElement>(null);
  const [slideX, setSlideX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const [isDispatched, setIsDispatched] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Recalcular montos en MXN
  const numAmount = parseFloat(currentAmount) || 0;
  const mxnEquivalent = (numAmount * exchangeRate).toFixed(2);

  // Filtrado reactivo de contactos
  const filteredContacts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.bank.toLowerCase().includes(q)
    );
  }, [contacts, searchQuery]);

  // Manejo del Teclado Numérico Táctil
  const pressKey = (key: string) => {
    if (isDispatched) return;
    if (currentAmount === '0' || currentAmount === '0.00') {
      setCurrentAmount(key === '.' ? '0.' : key);
    } else {
      if (key === '.' && currentAmount.includes('.')) return;
      const parts = currentAmount.split('.');
      if (parts.length > 1 && parts[1].length >= 2) return;
      setCurrentAmount((prev) => prev + key);
    }
  };

  const pressBackspace = () => {
    if (isDispatched) return;
    if (currentAmount.length > 1) {
      setCurrentAmount((prev) => prev.slice(0, -1));
    } else {
      setCurrentAmount('0');
    }
  };

  // Slider Drag Interactions (Mouse & Touch)
  const handleDragStart = (clientX: number) => {
    if (isDispatched || numAmount <= 0) return;
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || isDispatched || !trackRef.current) return;
    const maxDist = trackRef.current.clientWidth - 46 - 12;
    let delta = clientX - startXRef.current;
    if (delta < 0) delta = 0;
    if (delta > maxDist) delta = maxDist;
    setSlideX(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging || isDispatched || !trackRef.current) return;
    setIsDragging(false);
    const maxDist = trackRef.current.clientWidth - 46 - 12;

    if (slideX >= maxDist * 0.82) {
      // Éxito: Snap al final y disparo SPEI
      setSlideX(maxDist);
      setIsDispatched(true);
      setStatusMessage('Transfer Dispatched via SPEI! 🚀');

      if (onP2PSuccess) {
        onP2PSuccess(`${selectedContact.fullName} (${selectedContact.role})`, numAmount * exchangeRate);
      }

      setTimeout(() => {
        setIsDispatched(false);
        setSlideX(0);
        setStatusMessage(null);
        onClose();
      }, 2000);
    } else {
      // Regreso con resorte
      setSlideX(0);
    }
  };

  // Global mouse up / move listeners for smooth dragging outside knob
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleDragMove(e.clientX);
    };
    const onMouseUp = () => {
      if (isDragging) handleDragEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, slideX]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#06070B] text-white flex justify-center selection:bg-[#2ED5A4]/30 selection:text-[#2ED5A4] overflow-y-auto animate-fade-in">
      {/* Smartphone Frame Container */}
      <div className="w-full max-w-[400px] flex flex-col relative min-h-screen pb-6 px-4">
        {/* Glow de fondo atmosférico difuso KIN */}
        <div className="bicolor-atmosphere-glow" />

        {/* ===================================================================== */}
        {/* 1. TOP HEADER & DYNAMIC ISLAND STATUS BAR                            */}
        {/* ===================================================================== */}
        <header className="sticky top-0 z-40 bg-[#06070B]/90 backdrop-blur-xl pt-2 pb-2.5 -mx-4 px-4 border-b border-white/5">
          {/* Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#8E91A5] mb-2 px-1">
            <span className="font-mono text-white">9:41</span>
            <div className="h-3 w-16 bg-[#121320] rounded-full mx-auto shadow-inner" />
            <div className="flex items-center gap-1.5 text-white">
              <StatusCellularIcon className="w-3.5 h-2.5" />
              <span className="font-mono text-[10px]">5G</span>
              <StatusBatteryIcon className="w-4 h-2.5" />
            </div>
          </div>

          {/* Nav Header */}
          <div className="flex items-center justify-between gap-2">
            {/* Botón Atrás / Cerrar */}
            <button
              type="button"
              onClick={onClose}
              className="btn-circle flex-shrink-0"
              title="Volver al Dashboard"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>

            {/* KIN Global Branding */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2ED5A4] to-[#1EA77F] flex items-center justify-center font-black text-white text-sm shadow-glow-mint">
                K
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-sm tracking-tight text-white">KIN</span>
                <span className="text-[8px] uppercase tracking-widest text-[#2ED5A4] font-bold">Global</span>
              </div>
            </div>

            {/* Píldora de Cotización FX en vivo */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181928] border border-white/10 text-xs shadow-inner">
              <span className="font-mono text-[11px] font-bold text-white">1 USD = 20.45 MXN</span>
              <span className="text-[#2ED5A4] text-xs animate-pulse">⚡</span>
            </div>

            {/* Avatar Verificado */}
            <div className="relative w-8 h-8 rounded-full p-0.5 bg-[#181928] border border-white/15 flex-shrink-0">
              <img
                src={selectedContact.photoUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2ED5A4] flex items-center justify-center text-[8px] font-black text-[#0E0F1A] shadow-sm">
                ✓
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================================== */}
        {/* 2. VALUE PROP BANNER: KIN CASH EXPRESS                                */}
        {/* ===================================================================== */}
        <div className="mt-3 flex items-center justify-between gap-3 bg-[#181928]/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-[#2ED5A4]/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 flex items-center justify-center shrink-0 text-[#2ED5A4] shadow-glow-mint">
              <SwapHorizIcon className="w-5 h-5 text-[#2ED5A4]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white tracking-tight">KIN Cash Express</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#2ED5A4] text-[#06070B] font-black text-[9px] tracking-wider uppercase">
                  Zero-Fee
                </span>
              </div>
              <p className="text-[11px] text-[#8E91A5] mt-0.5 leading-snug">
                Envíos P2P instantáneos sin comisiones USA ➔ México vía SPEI Banxico
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. RECIPIENT PICKER MODULE (SEARCH + HERO CARD)                       */}
        {/* ===================================================================== */}
        <div className="mt-3 flex flex-col gap-2.5 bg-[#121320] p-3.5 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] font-extrabold text-[#8E91A5] uppercase tracking-wider">
              Destinatario
            </span>
            <button
              type="button"
              onClick={() => setShowContactPicker(true)}
              className="flex items-center gap-1 text-[#2ED5A4] text-xs font-bold hover:underline cursor-pointer"
            >
              <span>Contactos ({contacts.length})</span>
              <span className="text-[11px]">👥</span>
            </button>
          </div>

          {/* Quick Search Bar with QR Scanner */}
          <div className="relative flex items-center">
            <SearchIcon className="w-4 h-4 absolute left-3 text-[#8E91A5]" />
            <input
              type="text"
              placeholder="Buscar nombre, $kinhandle, teléfono, CLABE..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!showContactPicker && e.target.value.trim().length > 0) {
                  setShowContactPicker(true);
                }
              }}
              className="w-full h-10 pl-9 pr-9 rounded-xl bg-[#06070B] border border-white/10 text-white text-xs placeholder:text-[#5F6175] focus:outline-none focus:border-[#2ED5A4] transition-all"
            />
            <button
              type="button"
              onClick={() => alert('Escáner QR listo para leer CLABE o Handle')}
              className="absolute right-2.5 text-[#8E91A5] hover:text-white cursor-pointer"
              title="Escanear Código QR"
            >
              <QrCodeScannerIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Recipient Hero Card */}
          <div
            onClick={() => setShowContactPicker(true)}
            className="flex items-center justify-between bg-[#181928] hover:bg-[#1E2034] p-3 rounded-xl border border-white/5 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar con aro gradiente y mini-logo del banco */}
              <div className="relative shrink-0 w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#2ED5A4] to-[#7047EB]">
                <img
                  src={selectedContact.photoUrl}
                  alt={selectedContact.name}
                  className="w-full h-full rounded-full object-cover"
                />
                {getBankLogoUrl(selectedContact.bank) && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center p-0.5 shadow-md">
                    <img
                      src={getBankLogoUrl(selectedContact.bank)!}
                      alt={selectedContact.bank}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Nombre, Rol y Banco */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-white truncate group-hover:text-[#2ED5A4] transition-colors">
                    {selectedContact.fullName}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#7047EB]/20 text-[#CCBDFF] text-[9px] font-bold shrink-0 border border-[#7047EB]/30">
                    {selectedContact.role}
                  </span>
                </div>
                <span className="text-[10px] text-[#8E91A5] truncate mt-0.5">
                  {selectedContact.name} • {selectedContact.country}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-bold text-[#2ED5A4] truncate">
                    {selectedContact.bank}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse shrink-0" />
                </div>
              </div>
            </div>

            <ChevronDownIcon className="w-4 h-4 text-[#8E91A5] group-hover:text-white shrink-0 ml-2 transition-colors" />
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4. GIANT CENTERED AMOUNT DISPLAY                                      */}
        {/* ===================================================================== */}
        <div className="mt-4 flex flex-col items-center justify-center text-center">
          {/* Balance Chip */}
          <div className="px-3 py-1 rounded-full bg-[#2ED5A4]/10 border border-[#2ED5A4]/25 text-[#2ED5A4] text-[11px] font-semibold shadow-sm mb-1.5">
            USD Transit Balance: $1,450.80
          </div>

          {/* Amount Display */}
          <div className="flex items-baseline justify-center gap-1.5 select-none tracking-tight">
            <span className="text-2xl sm:text-3xl text-[#2ED5A4] font-black leading-none">$</span>
            <span className="text-4xl sm:text-5xl text-white font-extrabold leading-none tracking-tight font-mono">
              {currentAmount}
            </span>
          </div>

          {/* Live FX Equivalent Pill */}
          <div className="flex items-center gap-2 mt-2 px-3.5 py-1 rounded-full bg-[#181928] border border-white/10 shadow-sm">
            <span className="text-[#2ED5A4] text-xs">⚡</span>
            <span className="font-mono text-xs text-[#2ED5A4] font-bold">
              ≈ ${Number(mxnEquivalent).toLocaleString('en-US', { minimumFractionDigits: 2 })} MXN
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-xs text-white font-medium">Zero Fees</span>
          </div>

          {/* Concept Note Chip (Editable) */}
          <div className="mt-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181928] border border-white/10 hover:border-white/20 transition-all shadow-sm">
            <span className="text-xs">🛒</span>
            {isEditingNote ? (
              <input
                type="text"
                value={conceptNote}
                onChange={(e) => setConceptNote(e.target.value)}
                onBlur={() => setIsEditingNote(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingNote(false)}
                autoFocus
                className="bg-transparent border-none text-white text-xs focus:outline-none w-52 text-center"
              />
            ) : (
              <span
                onClick={() => setIsEditingNote(true)}
                className="text-xs text-[#8E91A5] hover:text-white cursor-pointer truncate max-w-[200px]"
              >
                {conceptNote || 'Agregar concepto...'}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsEditingNote(!isEditingNote)}
              className="text-[#8E91A5] hover:text-white text-[11px] cursor-pointer"
            >
              ✏️
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 5. TACTILE NUMERIC KEYPAD (3X4 GRID)                                  */}
        {/* ===================================================================== */}
        <div className="mt-4 grid grid-cols-3 gap-2 px-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => pressKey(key)}
              className="h-12 rounded-2xl bg-[#181928]/80 hover:bg-[#202236] active:scale-95 transition-all flex items-center justify-center text-white font-mono text-xl font-bold border border-white/5 shadow-sm cursor-pointer"
            >
              {key}
            </button>
          ))}

          {/* Punto decimal */}
          <button
            type="button"
            onClick={() => pressKey('.')}
            className="h-12 rounded-2xl bg-[#181928]/50 hover:bg-[#202236] active:scale-95 transition-all flex items-center justify-center text-white font-mono text-2xl font-bold border border-white/5 shadow-sm cursor-pointer"
          >
            •
          </button>

          {/* Cero */}
          <button
            type="button"
            onClick={() => pressKey('0')}
            className="h-12 rounded-2xl bg-[#181928]/80 hover:bg-[#202236] active:scale-95 transition-all flex items-center justify-center text-white font-mono text-xl font-bold border border-white/5 shadow-sm cursor-pointer"
          >
            0
          </button>

          {/* Borrar */}
          <button
            type="button"
            onClick={pressBackspace}
            className="h-12 rounded-2xl bg-[#181928]/50 hover:bg-[#202236] active:scale-95 transition-all flex items-center justify-center text-[#8E91A5] hover:text-white border border-white/5 shadow-sm cursor-pointer"
            aria-label="Borrar número"
          >
            <BackspaceIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ===================================================================== */}
        {/* 6. BIOMETRIC SLIDE-TO-CONFIRM INTERACTIVE MODULE                      */}
        {/* ===================================================================== */}
        <div className="mt-4">
          <div
            ref={trackRef}
            className="relative w-full h-[56px] rounded-full bg-[#181928] border border-white/10 p-1 flex items-center shadow-2xl overflow-hidden select-none"
          >
            {/* Rastro luminoso tras la perilla */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#2ED5A4]/30 to-[#2ED5A4]/60 rounded-full transition-all duration-75"
              style={{ width: `${slideX + 46}px` }}
            />

            {/* Texto de instrucción en la barra */}
            <div
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold pl-12 pr-4 pointer-events-none transition-opacity"
              style={{
                opacity: trackRef.current
                  ? 1 - (slideX / (trackRef.current.clientWidth - 58)) * 1.5
                  : 1,
              }}
            >
              <span className="text-white">Slide to send</span>
              <span className="text-[#2ED5A4] font-mono font-black">${currentAmount}</span>
              <span className="text-white text-xs">›</span>
            </div>

            {/* Mensaje de confirmación al disparar */}
            {statusMessage && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#2ED5A4] text-[#06070B] font-black text-xs tracking-wide animate-fade-in z-20">
                {statusMessage}
              </div>
            )}

            {/* Perilla deslizante con icono de Huella Dactilar */}
            <div
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
              style={{ transform: `translateX(${slideX}px)` }}
              className={`absolute left-1 top-1 w-[48px] h-[48px] rounded-full bg-gradient-to-tr from-[#2ED5A4] to-[#1EA77F] flex items-center justify-center text-[#06070B] cursor-grab active:cursor-grabbing shadow-[0_4px_20px_rgba(46,213,164,0.45)] z-10 transition-transform ${
                isDragging ? 'duration-0' : 'duration-200'
              }`}
            >
              {isDispatched ? (
                <CheckCircleIcon className="w-6 h-6 text-[#06070B] animate-scale-in" />
              ) : (
                <FingerprintIcon className="w-6 h-6 text-[#06070B]" />
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 7. TRUST, SPEED & COMPLIANCE BADGE                                    */}
        {/* ===================================================================== */}
        <div className="mt-3 flex items-center justify-center gap-1.5 px-3 text-center">
          <span className="text-[#2ED5A4] text-xs">🛡️</span>
          <p className="text-[10px] text-[#8E91A5] font-medium leading-tight">
            Secured by Banxico SPEI • Direct Settlement • FDIC-insured partner bank
          </p>
        </div>

        {/* ===================================================================== */}
        {/* MODAL BOTTOM SHEET: AGENDA DE CONTACTOS KIN                           */}
        {/* ===================================================================== */}
        {showContactPicker && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center animate-fade-in">
            <div className="w-full max-w-[400px] bg-[#121320] border-t border-white/10 rounded-t-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
              {/* Grab handle */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-black text-white">Seleccionar Destinatario</h3>
                  <p className="text-xs text-[#8E91A5]">Agenda de transferencias frecuentes KIN</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowContactPicker(false)}
                  className="btn-circle"
                >
                  <CloseIcon className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Buscador interno */}
              <div className="relative mb-3">
                <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-[#8E91A5]" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, banco o parentesco..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#181928] border border-white/10 text-white text-xs placeholder:text-[#5F6175] focus:outline-none focus:border-[#2ED5A4]"
                />
              </div>

              {/* Lista de Contactos con Logos Oficiales */}
              <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin">
                {filteredContacts.map((c) => {
                  const isSelected = selectedContact.id === c.id;
                  const bankLogo = getBankLogoUrl(c.bank);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedContact(c);
                        setShowContactPicker(false);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#181928] border-[#2ED5A4] shadow-glow-mint'
                          : 'bg-[#181928]/60 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                          <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white leading-tight">{c.fullName}</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-[#7047EB]/20 text-[#CCBDFF] text-[9px] font-bold">
                              {c.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {bankLogo && (
                              <div className="w-4 h-4 rounded bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                                <img src={bankLogo} alt={c.bank} className="w-full h-full object-contain" />
                              </div>
                            )}
                            <span className="text-[10px] text-[#2ED5A4] font-semibold">{c.bank}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="text-xs font-black text-[#2ED5A4]">✓</span>
                      ) : (
                        <ChevronRightIcon className="w-4 h-4 text-[#8E91A5]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
