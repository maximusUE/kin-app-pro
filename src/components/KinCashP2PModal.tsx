'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  CloseIcon,
  SearchIcon,
  ChevronRightIcon,
  getBankLogoUrl,
  StatusCellularIcon,
  StatusBatteryIcon,
} from './Icons';
import { KinLogo } from './KinLogo';

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
    photoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCR4QM3Ii7ReWis7XIvW_01srAlE5v87-taEbIXdp2CYeQ3QfX_4MyveQuVM548GxHcgyKSlQLK__CXswxVUGY6-Qug4uXot1-yKZBTJY6q10s45S297XOfkfcOpmkxo02hU8TDReJPhBLCVygk3gIdKV_qzMQgSfXchTAjRWHU4yqbsRIWFQxzYhiUg0mIRuYmPRpiVbFoE9LAf0el6wcZ9B_wfB9afCEKwnKyUBpBcIlvgp5gT3NF',
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

export interface KinCashP2PModalProps {
  isOpen?: boolean;
  isScreen?: boolean;
  onClose?: () => void;
  onP2PSuccess?: (recipient: string, amountMXN: number) => void;
  contacts?: ContactItem[];
  onViewHistory?: () => void;
  exchangeRate?: number;
}

export function KinCashP2PModal({
  isOpen = true,
  isScreen = false,
  onClose,
  onP2PSuccess,
  contacts = DEFAULT_CONTACTS,
  onViewHistory,
  exchangeRate = 20.45,
}: KinCashP2PModalProps) {
  const [currentAmount, setCurrentAmount] = useState('120.00');
  const [selectedContact, setSelectedContact] = useState<ContactItem>(contacts[0] || DEFAULT_CONTACTS[0]);
  const [conceptNote, setConceptNote] = useState('Groceries & medicine for the week');
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

  // Sincronizar contacto inicial si cambian los contactos
  useEffect(() => {
    if (contacts.length > 0 && (!selectedContact || !contacts.some((c) => c.id === selectedContact.id))) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

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
        if (!isScreen && onClose) {
          onClose();
        }
      }, 2200);
    } else {
      // Regreso suave elástico
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

  if (!isOpen && !isScreen) return null;

  // Renderizado del contenido central KIN Cash adaptado de Stitch code.html
  const content = (
    <div className="flex flex-col w-full gap-5 animate-fade-in">
      {/* 1. Sub-header & Value Prop Banner */}
      <div className="flex items-start justify-between gap-3 bg-surface-container-high/60 backdrop-blur-md p-4 rounded-xl shadow-lg relative overflow-hidden border border-white/5">
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 text-primary shadow-[0_0_16px_rgba(87,242,191,0.25)]">
            <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-title-base text-title-base text-white">KIN Cash Express</span>
              <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-caps text-[10px] tracking-wider uppercase font-bold">
                Zero-Fee
              </span>
            </div>
            <p className="font-caption-sm text-caption-sm text-on-surface-variant mt-0.5 leading-snug">
              Instant Zero-Fee P2P Transits across USA &amp; Mexico via KIN Phone or Handle ($kinhandle)
            </p>
          </div>
        </div>
      </div>

      {/* 2. Recipient Picker Module */}
      <div className="flex flex-col gap-3 bg-surface-container p-4 rounded-xl shadow-xl relative border border-white/5">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Recipient
          </span>
          <button
            type="button"
            onClick={() => setShowContactPicker(true)}
            className="flex items-center gap-1 text-primary font-caption-sm text-caption-sm active:opacity-75 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">contacts</span>
            <span>Recent ({contacts.length})</span>
          </button>
        </div>

        {/* Contact Search Input */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-container-lowest text-white font-body-base text-body-medium placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-all border border-white/5"
            id="recipientSearch"
            placeholder="Search name, $handle, phone, CLABE..."
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!showContactPicker && e.target.value.trim().length > 0) {
                setShowContactPicker(true);
              }
            }}
          />
          <button
            type="button"
            onClick={() => alert('Escáner QR listo para escanear Handle o CLABE')}
            className="material-symbols-outlined absolute right-3 text-on-surface-variant text-[18px] hover:text-white cursor-pointer"
          >
            qr_code_scanner
          </button>
        </div>

        {/* Selected Recipient Hero Pill */}
        <div
          onClick={() => setShowContactPicker(true)}
          className="flex items-center justify-between bg-surface-container-high p-3 rounded-xl shadow-inner group cursor-pointer border border-white/5 hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0 w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-primary to-secondary">
              <img
                className="w-full h-full rounded-full object-cover"
                alt={selectedContact.name}
                src={selectedContact.photoUrl}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-md">
                <span
                  className="material-symbols-outlined text-[#004481] text-[14px] font-bold"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_balance
                </span>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-title-base text-title-base text-white truncate font-semibold">
                  {selectedContact.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-caption-sm text-[11px] font-semibold shrink-0">
                  {selectedContact.role}
                </span>
              </div>
              <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                {selectedContact.fullName} • +52 33 1459 8820
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-label-caps text-label-caps text-primary-fixed-dim">
                  {selectedContact.bank}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-white shrink-0 ml-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
        </div>
      </div>

      {/* 3. Giant Centered Amount Display */}
      <div className="flex flex-col items-center justify-center pt-2 pb-1 relative">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-caption-sm text-caption-sm font-medium">
            USD Transit Balance: $1,450.80
          </span>
        </div>

        {/* Amount Hero */}
        <div className="flex items-baseline justify-center gap-1.5 select-none tracking-tight">
          <span className="font-display-hero text-headline-lg text-primary font-bold leading-none">$</span>
          <span className="font-headline-lg text-[44px] text-white font-bold leading-none tracking-tight">
            {currentAmount}
          </span>
        </div>

        {/* Live FX & Fee Guarantee */}
        <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-surface-container-high/80 backdrop-blur-sm border border-white/5">
          <span className="material-symbols-outlined text-primary text-[15px] animate-pulse">bolt</span>
          <span className="font-financial-mono text-caption-sm text-primary font-bold">
            ≈ ${Number(mxnEquivalent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
          </span>
          <span className="text-outline text-[12px]">•</span>
          <span className="font-caption-sm text-caption-sm text-white font-medium">Zero Fees</span>
        </div>

        {/* Transfer Concept Note Chip (Editable) */}
        <div className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-all cursor-pointer shadow-sm border border-white/5">
          <span className="text-[14px]">🛒</span>
          <input
            className="bg-transparent border-none text-white font-caption-sm text-caption-sm focus:outline-none w-56 text-center truncate"
            placeholder="Add payment concept note..."
            type="text"
            value={conceptNote}
            onChange={(e) => setConceptNote(e.target.value)}
          />
          <span className="material-symbols-outlined text-on-surface-variant text-[14px]">edit</span>
        </div>
      </div>

      {/* 4. Tactical Numeric Keypad */}
      <div className="grid grid-cols-3 gap-2 px-1">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => pressKey(key)}
            className="h-13 py-3 rounded-xl bg-surface-container-high/70 hover:bg-surface-container-highest active:scale-95 transition-all flex items-center justify-center text-white font-financial-mono text-[22px] font-bold shadow-md cursor-pointer border border-white/5"
          >
            {key}
          </button>
        ))}
        <button
          type="button"
          onClick={() => pressKey('.')}
          className="h-13 py-3 rounded-xl bg-surface-container-high/40 hover:bg-surface-container-highest active:scale-95 transition-all flex items-center justify-center text-white font-financial-mono text-[24px] font-bold shadow-md cursor-pointer border border-white/5"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => pressKey('0')}
          className="h-13 py-3 rounded-xl bg-surface-container-high/70 hover:bg-surface-container-highest active:scale-95 transition-all flex items-center justify-center text-white font-financial-mono text-[22px] font-bold shadow-md cursor-pointer border border-white/5"
        >
          0
        </button>
        <button
          type="button"
          onClick={pressBackspace}
          className="h-13 py-3 rounded-xl bg-surface-container-high/40 hover:bg-surface-container-highest active:scale-95 transition-all flex items-center justify-center text-on-surface-variant hover:text-white shadow-md cursor-pointer border border-white/5"
          aria-label="Borrar número"
        >
          <span className="material-symbols-outlined text-[22px]">backspace</span>
        </button>
      </div>

      {/* 5. Biometric Slide-to-Confirm Interactive Module */}
      <div className="flex flex-col gap-2 mt-1">
        <div
          ref={trackRef}
          className="relative w-full h-[58px] rounded-full bg-surface-container-high p-1.5 flex items-center shadow-2xl overflow-hidden select-none border border-white/10"
        >
          {/* Glow trail behind thumb */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary/30 to-primary/60 rounded-full transition-all duration-75"
            style={{ width: `${slideX + 46}px` }}
          />

          {/* Slide Instruction Label */}
          <div
            className="w-full flex items-center justify-center gap-1.5 text-on-surface-variant font-title-base text-body-medium pl-10 pr-4 pointer-events-none transition-opacity"
            style={{
              opacity: trackRef.current
                ? Math.max(0, 1 - (slideX / ((trackRef.current.clientWidth - 58) || 1)) * 1.5)
                : 1,
            }}
          >
            <span className="text-white font-semibold">Slide to send</span>
            <span className="text-primary font-financial-mono font-bold">
              ${Number(numAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="material-symbols-outlined text-[18px] text-white">chevron_right</span>
          </div>

          {/* Transfer status overlay message */}
          {statusMessage && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary text-on-primary font-black text-xs tracking-wide animate-fade-in z-20">
              {statusMessage}
            </div>
          )}

          {/* Interactive Slider Thumb Knob */}
          <div
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            style={{ transform: `translateX(${slideX}px)` }}
            className={`absolute left-1.5 top-1.5 w-[46px] h-[46px] rounded-full bg-gradient-to-tr from-primary-container to-primary flex items-center justify-center text-on-primary-container cursor-grab active:cursor-grabbing shadow-[0_4px_20px_rgba(46,213,164,0.45)] z-10 transition-transform ${
              isDragging ? 'duration-0' : 'duration-200'
            }`}
          >
            {isDispatched ? (
              <span className="material-symbols-outlined text-[24px] text-[#002116] font-bold animate-scale-in">
                task_alt
              </span>
            ) : (
              <span className="material-symbols-outlined text-[24px] text-[#002116] font-bold">
                {slideX > 150 ? 'check' : 'fingerprint'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 6. Trust, Speed & Compliance Badging */}
      <div className="flex items-center justify-center gap-2 py-1 px-3">
        <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
        <p className="font-caption-sm text-[11px] text-on-surface-variant text-center font-medium">
          Secured by Banxico SPEI • Direct Settlement • FDIC-insured partner bank
        </p>
      </div>

      {/* Contact Picker Bottom Sheet Modal */}
      {showContactPicker && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center animate-fade-in"
          onClick={() => setShowContactPicker(false)}
        >
          <div
            className="w-full max-w-[400px] bg-surface-container border-t border-white/10 rounded-t-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-white font-title-base">Seleccionar Destinatario</h3>
                <p className="text-xs text-on-surface-variant">Agenda de transferencias frecuentes KIN</p>
              </div>
              <button
                type="button"
                onClick={() => setShowContactPicker(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Internal Search */}
            <div className="relative mb-3">
              <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Buscar por nombre, banco o parentesco..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-lowest border border-white/10 text-white text-xs placeholder:text-outline focus:outline-none focus:border-primary"
              />
            </div>

            {/* Contacts list */}
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
                        ? 'bg-surface-container-high border-primary shadow-glow-mint'
                        : 'bg-surface-container-lowest/60 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                        <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white leading-tight font-title-base">
                            {c.fullName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded-full bg-secondary/15 text-secondary text-[9px] font-bold">
                            {c.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {bankLogo && (
                            <div className="w-4 h-4 rounded bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                              <img src={bankLogo} alt={c.bank} className="w-full h-full object-contain" />
                            </div>
                          )}
                          <span className="text-[10px] text-primary font-semibold">{c.bank}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="text-xs font-black text-primary">✓</span>
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 text-on-surface-variant" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Si se usa como pantalla integrada dentro del dashboard (activeTab === 'kin-cash')
  if (isScreen) {
    return content;
  }

  // Si se usa como modal de pantalla completa tradicional
  return (
    <div className="fixed inset-0 z-50 bg-[#06070B] text-white flex justify-center selection:bg-[#2ED5A4]/30 selection:text-[#2ED5A4] overflow-y-auto animate-fade-in">
      <div className="w-full max-w-[400px] flex flex-col relative min-h-screen pb-24 px-4">
        {/* Glow de fondo atmosférico */}
        <div className="bicolor-atmosphere-glow" />

        {/* Modal Top Header with Close */}
        <header className="sticky top-0 z-40 bg-[#06070B]/90 backdrop-blur-xl pt-2 pb-2.5 -mx-4 px-4 border-b border-white/5 mb-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#8E91A5] mb-2 px-1">
            <span className="font-mono text-white">9:41</span>
            <div className="h-3 w-16 bg-[#121320] rounded-full mx-auto shadow-inner" />
            <div className="flex items-center gap-1.5 text-white">
              <StatusCellularIcon className="w-3.5 h-2.5" />
              <span className="font-mono text-[10px]">5G</span>
              <StatusBatteryIcon className="w-4 h-2.5" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KinLogo size={28} />
              <div className="flex flex-col leading-none">
                <span className="font-headline-md text-sm font-bold tracking-tight text-white">KIN</span>
                <span className="font-label-caps text-[8px] uppercase tracking-widest text-primary">Global</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white cursor-pointer"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        {content}
      </div>
    </div>
  );
}
