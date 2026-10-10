'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeftIcon,
  CloseIcon,
  SearchIcon,
  ChevronRightIcon,
  getBankLogoUrl,
  StatusCellularIcon,
  StatusBatteryIcon,
} from './Icons';
import { KinLogo } from './KinLogo';
import { capitalizeWords } from '@/lib/utils/capitalize';
import { ContactAvatar } from './ContactAvatar';
import { WhatsAppContactsModal } from './WhatsAppContactsModal';
import { KinAirDropWaveModal } from './animations/KinAirDropWaveModal';
import { KinQrModal } from './modals/KinQrModal';
import { LegalDisclaimersCard } from './LegalDisclaimersCard';

export interface ContactItem {
  id: string;
  name: string;
  fullName: string;
  avatar: string;
  role: string;
  country: string;
  bank: string;
  photoUrl: string;
  phone?: string;
  street?: string;
  clabe?: string;
  houseNumber?: string;
  state?: string;
  zipCode?: string;
  isFamily?: boolean;
}

export const KIN_FAMILY_MEMBERS: ContactItem[] = [];

// Helper para exportar y agregar a los contactos reales del celular
export function exportContactVCard(name: string, phone: string) {
  if (typeof window === 'undefined') return;
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `N:${name};;;;`,
    `TEL;TYPE=CELL:${cleanPhone}`,
    'NOTE:Contacto KIN Global Ecosystem',
    'END:VCARD',
  ].join('\n');
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/\s+/g, '_')}_kin.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const DEFAULT_CONTACTS: ContactItem[] = [];

export interface KinCashP2PModalProps {
  isOpen?: boolean;
  isScreen?: boolean;
  onClose?: () => void;
  onP2PSuccess?: (recipient: string, amountMXN: number, contact?: ContactItem | null) => void;
  contacts?: ContactItem[];
  familyNetwork?: ContactItem[];
  onViewHistory?: () => void;
  exchangeRate?: number;
  userBalanceUSD?: number;
  userId?: string;
  onContactCreated?: (contact: ContactItem) => void;
  // Propiedades para Borrador Persistente
  draftContact?: ContactItem | null;
  onDraftContactChange?: (contact: ContactItem | null) => void;
  draftAmount?: string;
  onDraftAmountChange?: (amount: string) => void;
  draftNote?: string;
  onDraftNoteChange?: (note: string) => void;
  onClearDraft?: () => void;
  language?: 'es' | 'en';
}

export function KinCashP2PModal({
  isOpen = true,
  isScreen = false,
  onClose,
  onP2PSuccess,
  contacts = DEFAULT_CONTACTS,
  familyNetwork,
  onViewHistory,
  exchangeRate = 20.45,
  userBalanceUSD = 1000.00,
  userId = 'user-001',
  onContactCreated,
  draftContact,
  onDraftContactChange,
  draftAmount,
  onDraftAmountChange,
  draftNote,
  onDraftNoteChange,
  onClearDraft,
  language = 'es',
}: KinCashP2PModalProps) {
  const isEn = language === 'en';
  // Inicialización resiliente con persistencia en localStorage y props controladas
  const [currentAmount, setCurrentAmount] = useState<string>(() => {
    if (draftAmount !== undefined && draftAmount !== '') return draftAmount;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kin_draft_kincash_amount');
        if (saved) return saved;
      } catch (_) {}
    }
    return '0';
  });

  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(() => {
    if (draftContact !== undefined) return draftContact;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kin_draft_kincash_contact');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return null;
  });

  const [conceptNote, setConceptNote] = useState<string>(() => {
    if (draftNote !== undefined && draftNote !== '') return draftNote;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kin_draft_kincash_note');
        if (saved) return saved;
      } catch (_) {}
    }
    return '';
  });

  const [showContactPicker, setShowContactPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAirDropModal, setShowAirDropModal] = useState(false);
  const [destinationCorridor, setDestinationCorridor] = useState<'us' | 'mx'>('us');
  const [pendingSuccessData, setPendingSuccessData] = useState<{
    recipient: string;
    amountMXN: number;
    amountUSD?: number;
    corridor?: 'us' | 'mx';
    contact?: ContactItem | null;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detección inteligente del corredor según el contacto seleccionado
  useEffect(() => {
    if (selectedContact) {
      const phone = selectedContact.phone || '';
      const country = (selectedContact.country || '').toLowerCase();
      const isMex =
        phone.startsWith('+52') ||
        phone.startsWith('52') ||
        country.includes('mex') ||
        (selectedContact.clabe && selectedContact.clabe.length === 18);
      setDestinationCorridor(isMex ? 'mx' : 'us');
    }
  }, [selectedContact]);

  // Sincronizar hacia abajo si el padre actualiza props controladas
  useEffect(() => {
    if (draftContact !== undefined) {
      setSelectedContact(draftContact);
    }
  }, [draftContact]);

  useEffect(() => {
    if (draftAmount !== undefined) {
      setCurrentAmount(draftAmount);
    }
  }, [draftAmount]);

  useEffect(() => {
    if (draftNote !== undefined) {
      setConceptNote(draftNote);
    }
  }, [draftNote]);

  // Persistir en localStorage y notificar al padre en tiempo real
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedContact) {
      localStorage.setItem('kin_draft_kincash_contact', JSON.stringify(selectedContact));
    } else {
      localStorage.removeItem('kin_draft_kincash_contact');
    }
    onDraftContactChange?.(selectedContact);
  }, [selectedContact]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (currentAmount && currentAmount !== '0') {
      localStorage.setItem('kin_draft_kincash_amount', currentAmount);
    } else {
      localStorage.removeItem('kin_draft_kincash_amount');
    }
    onDraftAmountChange?.(currentAmount);
  }, [currentAmount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (conceptNote) {
      localStorage.setItem('kin_draft_kincash_note', conceptNote);
    }
    onDraftNoteChange?.(conceptNote);
  }, [conceptNote]);

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

  // Lista reactiva de la red familiar KIN
  const familyList = useMemo(() => {
    const base = familyNetwork && familyNetwork.length > 0 ? familyNetwork : KIN_FAMILY_MEMBERS;
    const cleanUser = (userId || '').toLowerCase().replace(/^user_/, '').replace(/^user-/, '');
    return base.filter((f) => {
      const fClean = f.id.toLowerCase().replace(/^fam-/, '').replace(/^user_/, '').replace(/^user-/, '');
      return fClean !== cleanUser && !f.id.toLowerCase().includes(cleanUser);
    });
  }, [familyNetwork, userId]);

  // Sincronizar contacto inicial: Clean Slate (NO auto-asignar ningún contacto a usuarios nuevos)
  const initialContactAssignedRef = useRef(false);
  useEffect(() => {
    if (initialContactAssignedRef.current) return;
    initialContactAssignedRef.current = true;
  }, []);

  // Función para limpiar borrador manualmente (Botón ✕ Limpiar / Nuevo envío)
  const handleClearDraft = () => {
    setSelectedContact(null);
    setCurrentAmount('0');
    setConceptNote('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kin_draft_kincash_contact');
      localStorage.removeItem('kin_draft_kincash_amount');
      localStorage.removeItem('kin_draft_kincash_note');
    }
    onDraftContactChange?.(null);
    onDraftAmountChange?.('0');
    onDraftNoteChange?.('');
    onClearDraft?.();
  };

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

  // Manejo del Teclado Numérico Táctil Reactivo
  const pressKey = (key: string) => {
    if (isDispatched) return;
    setCurrentAmount((prev) => {
      // Si el valor actual es 0, reemplazar directamente excepto si es punto decimal
      if (prev === '0' || prev === '0.00' || prev === '') {
        if (key === '.') return '0.';
        return key;
      }

      // Evitar múltiples puntos decimales
      if (key === '.' && prev.includes('.')) return prev;

      // Limitar a máximo 2 decimales después del punto
      if (prev.includes('.')) {
        const [, decimals] = prev.split('.');
        if (decimals && decimals.length >= 2) return prev;
      }

      // Limitar a 6 cifras enteras ($999,999 máximo)
      const intPart = prev.split('.')[0];
      if (key !== '.' && !prev.includes('.') && intPart.length >= 6) return prev;

      return prev + key;
    });
  };

  const pressBackspace = () => {
    if (isDispatched) return;
    setCurrentAmount((prev) => {
      if (prev.length <= 1 || prev === '0.00') return '0';
      const next = prev.slice(0, -1);
      return next === '' ? '0' : next;
    });
  };

  const clearAmount = () => {
    if (isDispatched) return;
    setCurrentAmount('0');
  };

  // Escuchar teclado físico para pruebas en computadora
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(e.key)) {
        e.preventDefault();
        pressKey(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        pressBackspace();
      } else if (e.key === 'Escape') {
        clearAmount();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDispatched]);

  // Slider Drag Interactions (Mouse & Touch)
  const handleDragStart = (clientX: number) => {
    if (isDispatched || numAmount <= 0) return;
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || isDispatched || !trackRef.current) return;
    const maxDist = Math.max(0, trackRef.current.clientWidth - 54);
    let delta = clientX - startXRef.current;
    if (delta < 0) delta = 0;
    if (delta > maxDist) delta = maxDist;
    setSlideX(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging || isDispatched || !trackRef.current) return;
    setIsDragging(false);
    const maxDist = Math.max(0, trackRef.current.clientWidth - 54);

    if (slideX >= maxDist * 0.82) {
      // 1. Validar monto mayor a 0
      if (numAmount <= 0) {
        setSlideX(0);
        setStatusMessage('⚠️ Ingresa un monto mayor a $0');
        setTimeout(() => setStatusMessage(null), 2500);
        return;
      }

      // 2. Validar requisitos obligatorios de KIN Cash: Nombre y Teléfono
      const contactName = selectedContact?.name?.trim() || selectedContact?.fullName?.trim() || '';
      const contactPhone = selectedContact?.phone?.trim() || '';

      if (!contactName || !contactPhone) {
        setSlideX(0);
        setStatusMessage('⚠️ Selecciona un destinatario con teléfono celular');
        setTimeout(() => setStatusMessage(null), 3000);
        setShowContactPicker(true);
        return;
      }

      // Éxito: Snap al final y disparo KIN Cash P2P con Onda Ultrasónica AirDrop
      setSlideX(maxDist);
      setIsDispatched(true);
      setStatusMessage(
        destinationCorridor === 'us'
          ? (isEn ? `Sending $${numAmount.toFixed(2)} USD via KIN Cash USA... 🚀` : `Enviando $${numAmount.toFixed(2)} USD vía KIN Cash USA... 🚀`)
          : (isEn ? 'Ultrasonic Transfer via SPEI Banxico... 🚀' : '¡Transferencia a México vía SPEI Banxico! 🚀')
      );

      const recipientLabel = selectedContact
        ? (selectedContact.fullName || selectedContact.name)
        : searchQuery.trim() || 'Destinatario KIN Cash';

      setPendingSuccessData({
        recipient: recipientLabel,
        amountMXN: destinationCorridor === 'mx' ? numAmount * exchangeRate : numAmount,
        amountUSD: numAmount,
        corridor: destinationCorridor,
        contact: selectedContact,
      });

      // Activar animación cinemática estilo Apple AirDrop NameDrop
      setShowAirDropModal(true);
    } else {
      // Regreso suave elástico
      setSlideX(0);
    }
  };

  const handleAirDropComplete = () => {
    setShowAirDropModal(false);
    if (pendingSuccessData && onP2PSuccess) {
      onP2PSuccess(
        pendingSuccessData.recipient,
        pendingSuccessData.amountMXN,
        pendingSuccessData.contact
      );
    }

    // Purgar borrador de forma automática tras envío confirmado
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kin_draft_kincash_contact');
      localStorage.removeItem('kin_draft_kincash_amount');
      localStorage.removeItem('kin_draft_kincash_note');
    }
    setCurrentAmount('0');
    onDraftAmountChange?.('0');
    setIsDispatched(false);
    setSlideX(0);
    setStatusMessage(null);
    if (!isScreen && onClose) {
      onClose();
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
    <div className="flex flex-col w-full gap-3.5 animate-fade-in pb-3">
      {/* 1. Sub-header & Value Prop Banner */}
      <div className="flex items-start justify-between gap-3 bg-surface-container-high/60 backdrop-blur-md p-4 rounded-xl shadow-lg relative overflow-hidden border border-white/5">
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 text-primary shadow-[0_0_16px_rgba(87,242,191,0.25)]">
            <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-title-base text-title-base text-white">KIN Cash Express</span>
              <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-caps text-[10px] tracking-wider uppercase font-bold">
                {isEn ? 'Zero-Fee' : 'Sin Comisión'}
              </span>
            </div>
            <p className="font-caption-sm text-caption-sm text-on-surface-variant mt-0.5 leading-snug">
              {isEn
                ? 'Instant Zero-Fee P2P Transits across USA & Mexico via KIN Phone or Handle ($kinhandle)'
                : 'Envíos P2P inmediatos y sin comisiones entre USA y México con teléfono o usuario ($kinhandle)'}
            </p>
          </div>
        </div>

        {/* Botón QR Dinámico 2026 */}
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="shrink-0 px-3 py-1.5 rounded-full bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          title={isEn ? 'Open QR Code Pay & Scanner' : 'Abrir Código QR y Escáner'}
        >
          <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
          <span className="font-title-base text-[11px] font-bold">{isEn ? 'QR' : 'QR'}</span>
        </button>
      </div>

      {/* 2. Recipient Picker Module */}
      <div className="flex flex-col gap-3 bg-surface-container p-4 rounded-xl shadow-xl relative border border-white/5">
        {/* Active Draft Auto-Save Banner */}
        {(selectedContact || numAmount > 0) && (
          <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl px-3 py-2 text-xs animate-fade-in shadow-inner">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 animate-pulse">
                save
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-white font-semibold text-[11px] truncate">
                  {isEn ? 'Draft saved automatically' : 'Borrador guardado automáticamente'}
                </span>
                <span className="text-primary text-[10px] font-medium truncate">
                  {selectedContact
                    ? (isEn ? `Transfer for ${selectedContact.name || selectedContact.fullName}` : `Envío para ${selectedContact.name || selectedContact.fullName}`)
                    : (isEn ? 'Pending recipient' : 'Destinatario pendiente')} {numAmount > 0 ? `• $${numAmount} USD` : ''}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-white hover:text-red-300 px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-red-500/20 text-[11px] font-bold shrink-0 ml-2 cursor-pointer transition-all border border-white/10 flex items-center gap-1 active:scale-95"
              title={isEn ? 'Discard draft and start over' : 'Descartar borrador y empezar de nuevo'}
            >
              <span>{isEn ? '✕ Clear' : '✕ Limpiar'}</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            {isEn ? 'Recipient' : 'Destinatario'}
          </span>
          <button
            type="button"
            onClick={() => setShowContactPicker(true)}
            className="flex items-center gap-1 text-primary font-caption-sm text-caption-sm active:opacity-75 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">contacts</span>
            <span>{isEn ? `Recent (${contacts.length})` : `Recientes (${contacts.length})`}</span>
          </button>
        </div>

        {/* Contact Search Input (Acceso directo a la Agenda de Contactos WhatsApp iOS) */}
        <div
          onClick={() => setShowContactPicker(true)}
          className="relative flex items-center cursor-pointer group"
        >
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant group-hover:text-primary transition-colors text-[20px]">
            search
          </span>
          <input
            className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-container-lowest text-white font-body-base text-body-medium placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-all border border-white/5 cursor-pointer"
            id="recipientSearch"
            placeholder={isEn ? 'Search by name or phone in contacts...' : 'Buscar por nombre o teléfono en tu agenda...'}
            type="text"
            readOnly
            value={selectedContact ? (selectedContact.fullName || selectedContact.name) : searchQuery}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowContactPicker(true);
            }}
            className="material-symbols-outlined absolute right-3 text-primary text-[20px] hover:scale-110 transition-transform cursor-pointer"
            title={isEn ? 'Open contacts address book' : 'Abrir agenda de contactos'}
          >
            contacts
          </button>
        </div>

        {/* Selected Recipient Hero Pill */}
        <div
          onClick={() => setShowContactPicker(true)}
          className="flex items-center justify-between bg-surface-container-high p-3 rounded-xl shadow-inner group cursor-pointer border border-white/5 hover:border-primary/30 transition-all"
        >
          {selectedContact ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <ContactAvatar
                  photoUrl={selectedContact.photoUrl}
                  name={selectedContact.name}
                  className="w-12 h-12 rounded-full border border-white/10"
                  iconSize="text-[26px]"
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
                  {selectedContact.fullName} {selectedContact.phone ? `• ${selectedContact.phone}` : ''}
                </span>
                {!selectedContact.phone && (
                  <span className="text-[10px] text-red-400 font-bold bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded-full mt-0.5 w-fit flex items-center gap-1">
                    <span>{isEn ? '⚠️ Phone number missing for KIN Cash' : '⚠️ Falta teléfono para KIN Cash'}</span>
                  </span>
                )}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-label-caps text-label-caps text-primary-fixed-dim">
                    {selectedContact.bank}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0 border border-white/10">
                <span className="material-symbols-outlined text-[24px]">person_search</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-base text-title-base text-white font-semibold">
                  {searchQuery.trim() ? searchQuery.trim() : (isEn ? 'Select recipient' : 'Seleccionar destinatario')}
                </span>
                <span className="font-caption-sm text-caption-sm text-on-surface-variant">
                  {searchQuery.trim()
                    ? (isEn ? 'Direct KIN Cash recipient' : 'Destinatario directo KIN Cash')
                    : (isEn ? 'Tap to choose from contacts or type above' : 'Toca para elegir de tus contactos o escribe arriba')}
                </span>
              </div>
            </div>
          )}
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
            {isEn ? 'USD Transit Balance:' : 'Saldo de Tránsito USD:'} ${Number(userBalanceUSD).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Amount Hero Input - Regla Don César: Cápsula Fija en Forma de Óvalo con Estilo Bandera USA */}
        <div className="flex flex-col items-center justify-center my-2 w-full px-2">
          <div className="w-full max-w-[340px] h-14 rounded-full bg-white dark:bg-surface-container-high border border-slate-200/90 dark:border-white/10 shadow-sm px-4 flex items-center justify-between focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <span className="font-financial-mono text-2xl sm:text-3xl text-emerald-600 dark:text-primary font-black select-none shrink-0 mr-1.5">$</span>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={currentAmount === '0' ? '' : currentAmount}
              placeholder="0"
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                const parts = val.split('.');
                if (parts.length > 2) return;
                if (parts[1] && parts[1].length > 2) return;
                setCurrentAmount(val === '' ? '0' : val);
              }}
              className="w-full bg-transparent border-none border-0 outline-none focus:outline-none focus:ring-0 text-center font-financial-mono text-2xl sm:text-3xl text-slate-900 dark:text-white font-black placeholder:text-slate-400 dark:placeholder:text-white/20 py-0 cursor-text shadow-none"
            />
            {currentAmount !== '0' && (
              <button
                type="button"
                onClick={clearAmount}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white text-xs shrink-0 cursor-pointer active:scale-90 transition-all mr-1.5"
                title={isEn ? 'Clear amount to zero' : 'Borrar monto a cero'}
              >
                ✕
              </button>
            )}
            <div className="h-10 px-3.5 rounded-full bg-slate-100 dark:bg-surface-container border border-slate-200/80 dark:border-white/10 flex items-center gap-1.5 shrink-0 select-none shadow-xs">
              <span className="text-base">🇺🇸</span>
              <span className="font-title-base text-xs font-black text-slate-900 dark:text-white">USD</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-[#8E91A5] font-medium text-center mt-2">
            {isEn ? 'Tap amount to type with phone keyboard' : 'Toca la cantidad para escribir con el teclado de tu teléfono'}
          </p>
        </div>

        {/* Selector de Destino de Entrega: USA a USA (USD) vs USA a México (Pesos) */}
        <div className="flex items-center justify-center p-1 rounded-full bg-slate-100 dark:bg-surface-container border border-slate-200/80 dark:border-white/10 my-1.5 max-w-[340px] w-full shadow-xs">
          <button
            type="button"
            onClick={() => setDestinationCorridor('us')}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              destinationCorridor === 'us'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🇺🇸</span>
            <span>{isEn ? 'USA to USA (USD)' : 'USA a USA (Dólares)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setDestinationCorridor('mx')}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              destinationCorridor === 'mx'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🇲🇽</span>
            <span>{isEn ? 'USA to MX (Pesos)' : 'USA a México (Pesos)'}</span>
          </button>
        </div>

        {/* Dynamic Delivery Breakdown Guarantee */}
        {destinationCorridor === 'us' ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 backdrop-blur-sm border border-emerald-500/30 text-emerald-800 dark:text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[15px] animate-pulse">bolt</span>
            <span className="font-financial-mono text-caption-sm font-bold">
              {isEn ? 'Recipient gets:' : 'Destinatario recibe:'} ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
            <span className="opacity-40 text-[12px]">•</span>
            <span className="font-caption-sm text-[11px] font-semibold">
              {isEn ? 'Direct USD • Zero Fees' : 'Dólares Directos • Sin Comisión'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-surface-container-high/80 backdrop-blur-sm border border-slate-200/80 dark:border-white/5">
            <span className="material-symbols-outlined text-emerald-600 dark:text-primary text-[15px] animate-pulse">currency_exchange</span>
            <span className="font-financial-mono text-caption-sm text-emerald-600 dark:text-primary font-bold">
              ≈ ${Number(mxnEquivalent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
            </span>
            <span className="text-slate-300 dark:text-outline text-[12px]">•</span>
            <span className="font-caption-sm text-caption-sm text-slate-700 dark:text-white font-medium">
              {isEn ? 'SPEI Banxico • Zero Fees' : 'SPEI Banxico • Sin Comisión'}
            </span>
          </div>
        )}

        {/* Transfer Concept Note Chip (Editable & Explicitly Optional) */}
        <div className="mt-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-surface-container text-slate-800 dark:text-on-surface hover:bg-slate-50 dark:hover:bg-surface-container-high transition-all cursor-pointer shadow-xs border border-slate-200/80 dark:border-white/5">
          <span className="text-[14px]">🛒</span>
          <input
            className="bg-transparent border-none border-0 outline-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white font-caption-sm text-caption-sm w-48 text-center truncate placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-none"
            placeholder={isEn ? 'Payment note (Optional)...' : 'Concepto de pago (Opcional)...'}
            type="text"
            value={conceptNote}
            onChange={(e) => setConceptNote(e.target.value)}
          />
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-[9px] font-bold text-slate-600 dark:text-on-surface-variant uppercase tracking-wider shrink-0 select-none border border-slate-200/60 dark:border-transparent">
            {isEn ? 'Optional' : 'Opcional'}
          </span>
          <span className="material-symbols-outlined text-slate-400 dark:text-on-surface-variant text-[14px]">edit</span>
        </div>

        {/* Quick Amount Chips */}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          {['20', '50', '100', '200'].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setCurrentAmount(amt)}
              className={`h-9 px-4 rounded-full text-xs font-financial-mono font-bold transition-all cursor-pointer border active:scale-95 flex items-center justify-center ${
                currentAmount === amt
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105'
                  : 'bg-white dark:bg-surface-container text-slate-800 dark:text-on-surface border-slate-200/80 dark:border-white/10 hover:border-emerald-500/40 shadow-xs'
              }`}
            >
              ${amt}
            </button>
          ))}
          <button
            type="button"
            onClick={clearAmount}
            className="h-9 w-9 rounded-full text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-on-surface-variant dark:hover:text-white bg-slate-100 dark:bg-surface-container-high border border-slate-200/80 dark:border-white/10 cursor-pointer active:scale-95 flex items-center justify-center shadow-xs"
            title={isEn ? 'Clear to zero' : 'Borrar a cero'}
          >
            C
          </button>
        </div>
      </div>

      {/* 5. Biometric Slide-to-Confirm Interactive Module */}
      <div className="flex flex-col gap-2 mt-1">
        <div
          ref={trackRef}
          className="relative w-full h-[56px] rounded-full bg-[#131522] border border-white/10 shadow-inner flex items-center overflow-hidden select-none"
        >
          {/* Symmetrical illuminated glow trail - active only when sliding */}
          <div
            className={`absolute left-[5px] top-[5px] bottom-[5px] bg-gradient-to-r from-primary/30 via-primary/50 to-primary/80 rounded-full transition-opacity pointer-events-none ${
              slideX > 2 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ width: `${Math.max(0, slideX + 44)}px` }}
          />

          {/* Slide Instruction Label */}
          <div
            className="w-full flex items-center justify-center gap-1.5 text-on-surface-variant font-title-base text-body-medium pl-12 pr-4 pointer-events-none transition-opacity select-none"
            style={{
              opacity: trackRef.current
                ? Math.max(0, 1 - (slideX / ((trackRef.current.clientWidth - 54) || 1)) * 1.5)
                : 1,
            }}
          >
            {numAmount <= 0 ? (
              <span className="text-white/60 text-xs font-semibold">
                {isEn ? 'Type an amount to send' : 'Teclea un monto para enviar'}
              </span>
            ) : (
              <>
                <span className="text-white font-semibold">
                  {isEn ? 'Slide to send' : 'Desliza para enviar'}
                </span>
                <span className="text-primary font-financial-mono font-bold">
                  ${Number(numAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="material-symbols-outlined text-[18px] text-white">chevron_right</span>
              </>
            )}
          </div>

          {/* Transfer status overlay message */}
          {statusMessage && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary text-on-primary font-black text-xs tracking-wide animate-fade-in z-20">
              {statusMessage}
            </div>
          )}

          {/* Interactive Slider Thumb Knob - Geométricamente concéntrico y simétrico */}
          <div
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            style={{ transform: `translateX(${slideX}px)` }}
            className={`absolute left-[5px] top-[5px] w-[44px] h-[44px] rounded-full bg-gradient-to-tr from-[#2ED5A4] to-[#1CD39B] flex items-center justify-center text-[#002116] cursor-grab active:cursor-grabbing shadow-[0_4px_16px_rgba(46,213,164,0.4)] z-10 select-none ${
              isDragging ? 'duration-0 transition-none' : 'duration-200 transition-transform'
            }`}
          >
            {isDispatched ? (
              <span className="material-symbols-outlined text-[22px] text-[#002116] font-bold animate-scale-in">
                task_alt
              </span>
            ) : (
              <span className="material-symbols-outlined text-[22px] text-[#002116] font-bold select-none">
                {slideX > 120 ? 'arrow_forward' : 'fingerprint'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 6. Trust, Speed & Compliance Badging */}
      <div className="flex items-center justify-center gap-2 py-1 px-3">
        <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
        <p className="font-caption-sm text-[11px] text-on-surface-variant text-center font-medium">
          {isEn
            ? 'Secured by Banxico SPEI • Direct Settlement • FDIC-insured partner bank'
            : 'Protegido por Banxico SPEI • Liquidación Directa • Banco asegurado por FDIC'}
        </p>
      </div>

      {/* CUMPLIMIENTO REGULATORIO Y AVISOS LEGALES KIN CASH P2P / FDIC / REGLA E */}
      <div className="pt-1">
        <LegalDisclaimersCard language={language} variant="wallet" defaultExpanded={false} />
      </div>

      {/* Agenda Telefónica y Búsqueda de Contactos estilo WhatsApp iOS */}
      <WhatsAppContactsModal
        isOpen={showContactPicker}
        onClose={() => setShowContactPicker(false)}
        contacts={contacts}
        familyNetwork={familyNetwork}
        userId={userId}
        language={language}
        onSelectContact={(contact) => {
          setSelectedContact(contact);
          setShowContactPicker(false);
          onDraftContactChange?.(contact);
          if (onContactCreated) {
            onContactCreated(contact);
          }
        }}
        onImportBatch={(newBatch) => {
          if (onContactCreated) {
            newBatch.forEach((c) => onContactCreated(c));
          }
        }}
      />

      {/* 2026 ULTRASONIC AIRDROP WAVE TRANSFER OVERLAY */}
      <KinAirDropWaveModal
        isOpen={showAirDropModal}
        senderName="César Ugalde"
        recipientName={selectedContact ? (selectedContact.fullName || selectedContact.name) : 'Destinatario'}
        recipientAvatar={selectedContact?.avatar}
        recipientPhotoUrl={selectedContact?.photoUrl}
        amountUSD={numAmount}
        amountMXN={Number(mxnEquivalent)}
        onComplete={handleAirDropComplete}
        language={language}
      />

      {/* 2026 DYNAMIC KIN QR GENERATOR & SCANNER MODAL */}
      <KinQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        userId={userId}
        userName="César Ugalde"
        onQrScanned={(data) => {
          const match = contacts.find(
            (c) => c.name.toLowerCase().includes(data.recipientName.toLowerCase())
          ) || {
            id: `qr-${Date.now()}`,
            name: data.recipientName,
            fullName: data.recipientName,
            role: 'Familiar KIN',
            avatar: '⚡',
            bank: 'KIN Cash P2P',
            country: 'Mexico',
            photoUrl: '',
            phone: '55 1234 5678',
          };
          setSelectedContact(match);
          if (data.amount) {
            setCurrentAmount(data.amount.toString());
          }
        }}
        language={language}
      />
    </div>
  );

  // Si se usa como pantalla integrada dentro del dashboard (activeTab === 'kin-cash')
  if (isScreen) {
    return content;
  }

  if (!mounted) return null;

  // Si se usa como modal de pantalla completa tradicional
  return createPortal(
    <div className="fixed inset-0 z-[200] bg-[#06070B] text-white flex justify-center selection:bg-[#2ED5A4]/30 selection:text-[#2ED5A4] overflow-y-auto animate-fade-in">
      <div className="w-full max-w-[400px] flex flex-col relative min-h-screen pb-24 px-4">
        {/* Glow de fondo atmosférico */}
        <div className="bicolor-atmosphere-glow" />

        {/* Modal Top Header with Universal Don César Standard */}
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
              <span className="material-symbols-outlined text-[13px]">bolt</span>
              <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
                {isEn ? 'Instant P2P' : 'P2P Instantáneo'}
              </span>
            </div>
          </div>
        </header>

        {content}
      </div>
    </div>,
    document.body
  );
}
