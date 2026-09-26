'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
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

export const KIN_FAMILY_MEMBERS: ContactItem[] = [
  {
    id: 'fam-user_jose_eligio',
    name: 'Jose Eligio',
    fullName: 'Jose Eligio',
    avatar: '',
    role: 'Familiar KIN',
    country: 'Mexico',
    bank: 'Banxico SPEI Directo',
    photoUrl: '',
    phone: '+1 3472486386',
  },
  {
    id: 'fam-user_maricela_fernandez',
    name: 'Maricela Fernandez',
    fullName: 'Maricela Fernandez',
    avatar: '',
    role: 'Familiar KIN',
    country: 'Mexico',
    bank: 'BBVA Bancomer',
    photoUrl: '',
    phone: '+1 0115212345678',
  },
  {
    id: 'fam-user_jaime_gutierrez',
    name: 'Jaime Gutierrez',
    fullName: 'Jaime Gutierrez',
    avatar: '',
    role: 'Familiar KIN',
    country: 'Mexico',
    bank: 'Santander México',
    photoUrl: '',
    phone: '+1 3479876543',
  },
  {
    id: 'fam-user_manuel_gomez',
    name: 'Manuel Gomez',
    fullName: 'Manuel Gomez',
    avatar: '',
    role: 'Familiar KIN',
    country: 'Mexico',
    bank: 'Banorte',
    photoUrl: '',
    phone: '+1 2345678910',
  },
  {
    id: 'fam-user-001',
    name: 'César Urrutia',
    fullName: 'César Urrutia',
    avatar: '',
    role: 'Familiar KIN',
    country: 'Estados Unidos',
    bank: 'KIN Global Network',
    photoUrl: '',
    phone: '+1 (555) 349-2810',
  },
];

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
    return 'Groceries & medicine for the week';
  });

  const [showContactPicker, setShowContactPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Sincronizar contacto inicial de forma segura solo si NO hay ningún contacto seleccionado ni borrador existente
  const initialContactAssignedRef = useRef(false);
  useEffect(() => {
    if (initialContactAssignedRef.current) return;
    if (!selectedContact) {
      let saved: string | null = null;
      if (typeof window !== 'undefined') {
        try {
          saved = localStorage.getItem('kin_draft_kincash_contact');
        } catch (_) {}
      }
      if (!saved) {
        if (contacts.length > 0) {
          setSelectedContact(contacts[0]);
          initialContactAssignedRef.current = true;
        } else if (familyList.length > 0) {
          setSelectedContact(familyList[0]);
          initialContactAssignedRef.current = true;
        }
      } else {
        initialContactAssignedRef.current = true;
      }
    } else {
      initialContactAssignedRef.current = true;
    }
  }, [contacts, familyList, selectedContact]);

  // Función para limpiar borrador manualmente (Botón ✕ Limpiar / Nuevo envío)
  const handleClearDraft = () => {
    setSelectedContact(null);
    setCurrentAmount('0');
    setConceptNote('Groceries & medicine for the week');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kin_draft_kincash_contact');
      localStorage.removeItem('kin_draft_kincash_amount');
      localStorage.removeItem('kin_draft_kincash_note');
    }
    onDraftContactChange?.(null);
    onDraftAmountChange?.('0');
    onDraftNoteChange?.('Groceries & medicine for the week');
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

      // Éxito: Snap al final y disparo KIN Cash P2P
      setSlideX(maxDist);
      setIsDispatched(true);
      setStatusMessage('¡Envío KIN Cash Exitoso! 🚀');

      const recipientLabel = selectedContact
        ? (selectedContact.fullName || selectedContact.name)
        : searchQuery.trim() || 'Destinatario KIN Cash';

      if (onP2PSuccess) {
        onP2PSuccess(recipientLabel, numAmount * exchangeRate, selectedContact);
      }

      // Purgar borrador de forma automática tras envío confirmado
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kin_draft_kincash_contact');
        localStorage.removeItem('kin_draft_kincash_amount');
        localStorage.removeItem('kin_draft_kincash_note');
      }
      setCurrentAmount('0');
      onDraftAmountChange?.('0');

      setTimeout(() => {
        setIsDispatched(false);
        setSlideX(0);
        setStatusMessage(null);
        if (!isScreen && onClose) {
          onClose();
        }
      }, 500);
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
    <div className="flex flex-col w-full gap-3.5 animate-fade-in pb-3">
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

        {/* Amount Hero Input (Acceso directo al teclado numérico nativo del celular) */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="flex items-center justify-center gap-1.5 relative">
            <span className="font-display-hero text-headline-lg text-primary font-bold leading-none select-none">$</span>
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
              className="font-headline-lg text-[48px] sm:text-[54px] text-white font-bold leading-none tracking-tight bg-transparent text-center focus:outline-none min-w-[130px] max-w-[240px] border-b-2 border-primary/40 focus:border-primary transition-all placeholder:text-white/20 font-financial-mono py-1 cursor-text"
            />
            {currentAmount !== '0' && (
              <button
                type="button"
                onClick={clearAmount}
                className="ml-1 text-on-surface-variant hover:text-white text-xs px-2.5 py-1.5 rounded-full bg-surface-container-high border border-white/10 cursor-pointer active:scale-90 transition-all"
                title={isEn ? 'Clear amount to zero' : 'Borrar monto a cero'}
              >
                {isEn ? 'Clear' : 'Borrar'}
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#8E91A5] font-medium text-center mt-1">
            {isEn ? 'Tap amount to type with phone keyboard' : 'Toca la cantidad para escribir con el teclado de tu teléfono'}
          </p>
        </div>

        {/* Live FX & Fee Guarantee */}
        <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-surface-container-high/80 backdrop-blur-sm border border-white/5">
          <span className="material-symbols-outlined text-primary text-[15px] animate-pulse">bolt</span>
          <span className="font-financial-mono text-caption-sm text-primary font-bold">
            ≈ ${Number(mxnEquivalent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
          </span>
          <span className="text-outline text-[12px]">•</span>
          <span className="font-caption-sm text-caption-sm text-white font-medium">
            {isEn ? 'Zero Fees' : 'Sin Comisión'}
          </span>
        </div>

        {/* Transfer Concept Note Chip (Editable) */}
        <div className="mt-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-all cursor-pointer shadow-sm border border-white/5">
          <span className="text-[14px]">🛒</span>
          <input
            className="bg-transparent border-none text-white font-caption-sm text-caption-sm focus:outline-none w-56 text-center truncate"
            placeholder={isEn ? 'Payment note...' : 'Concepto de pago...'}
            type="text"
            value={conceptNote}
            onChange={(e) => setConceptNote(e.target.value)}
          />
          <span className="material-symbols-outlined text-on-surface-variant text-[14px]">edit</span>
        </div>

        {/* Quick Amount Chips */}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          {['20', '50', '100', '200'].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setCurrentAmount(amt)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border active:scale-95 ${
                currentAmount === amt
                  ? 'bg-primary text-[#002116] border-primary shadow-sm scale-105'
                  : 'bg-surface-container text-white/80 border-white/10 hover:border-primary/40'
              }`}
            >
              ${amt}
            </button>
          ))}
          <button
            type="button"
            onClick={clearAmount}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-on-surface-variant hover:text-white bg-white/5 border border-white/10 cursor-pointer active:scale-95"
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
          className="relative w-full h-[58px] rounded-full bg-surface-container-high p-1.5 flex items-center shadow-2xl overflow-hidden select-none border border-white/10"
        >
          {/* Glow trail behind thumb - perfectamente sincronizado a 0ms con la huella */}
          <div
            className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary/30 via-primary/55 to-primary/85 rounded-full ${
              isDragging ? 'duration-0 transition-none' : 'duration-200 transition-all'
            }`}
            style={{ width: `${Math.max(52, slideX + 52)}px` }}
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

          {/* Interactive Slider Thumb Knob */}
          <div
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            style={{ transform: `translateX(${slideX}px)` }}
            className={`absolute left-1.5 top-1.5 w-[46px] h-[46px] rounded-full bg-gradient-to-tr from-primary-container to-primary flex items-center justify-center text-on-primary-container cursor-grab active:cursor-grabbing shadow-[0_4px_20px_rgba(46,213,164,0.45)] z-10 ${
              isDragging ? 'duration-0 transition-none' : 'duration-200 transition-transform'
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
          {isEn
            ? 'Secured by Banxico SPEI • Direct Settlement • FDIC-insured partner bank'
            : 'Protegido por Banxico SPEI • Liquidación Directa • Banco asegurado por FDIC'}
        </p>
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
