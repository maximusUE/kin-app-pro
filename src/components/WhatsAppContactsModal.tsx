'use client';

import React, { useState, useMemo, useRef } from 'react';
import { CloseIcon, SearchIcon, PlusIcon, CheckCircleIcon } from './Icons';
import { ContactAvatar } from './ContactAvatar';
import { capitalizeWords } from '@/lib/utils/capitalize';
import type { ContactItem } from './KinCashP2PModal';

// Contactos predeterminados enriquecidos con la libreta del cliente mostrada en WhatsApp
export const INITIAL_PHONE_DIRECTORY: ContactItem[] = [
  {
    id: 'phone-mom-eligio',
    name: 'Mom Eligio',
    fullName: 'Mom Eligio',
    avatar: '',
    role: 'Familia',
    country: 'Mexico',
    bank: 'BBVA Bancomer',
    photoUrl: '',
    phone: '+52 55 1524 5954',
    isFamily: true,
  },
  {
    id: 'phone-maricela-ugalde',
    name: 'Maricela Ugalde',
    fullName: 'Maricela Ugalde',
    avatar: '',
    role: 'Familia',
    country: 'Mexico',
    bank: 'Banorte',
    photoUrl: '',
    phone: '+52 55 8765 4321',
    isFamily: true,
  },
  {
    id: 'phone-los-inglaterros',
    name: 'Los Inglaterros Vergara',
    fullName: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Los Inglaterros 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Vergara',
    avatar: '',
    role: 'Amigos / Familia',
    country: 'Mexico',
    bank: 'Santander México',
    photoUrl: '',
    phone: '+52 55 9876 5432',
  },
  {
    id: 'phone-reyli-vergara',
    name: 'Reyli Vergara',
    fullName: 'Reyli Vergara',
    avatar: '',
    role: 'Contacto Telefónico',
    country: 'Mexico',
    bank: 'Banco Azteca',
    photoUrl: '',
    phone: '+52 55 4321 8765',
  },
  {
    id: 'phone-shatik-first-student',
    name: 'Shatik First Student',
    fullName: 'Shatik First Student',
    avatar: '',
    role: 'Estudiante / Contacto',
    country: 'Estados Unidos',
    bank: 'Chase Bank',
    photoUrl: '',
    phone: '+1 (347) 555-0192',
  },
  {
    id: 'phone-nacho-lopez',
    name: 'Nacho Lopez',
    fullName: 'Nacho Lopez',
    avatar: '',
    role: 'Amigo',
    country: 'Mexico',
    bank: 'Banamex Citibanamex',
    photoUrl: '',
    phone: '+52 55 1234 5678',
  },
  {
    id: 'phone-amarilys-matron',
    name: 'Amarilys Matron',
    fullName: 'Amarilys Matron',
    avatar: '',
    role: 'Contacto Telefónico',
    country: 'Estados Unidos',
    bank: 'Bank of America',
    photoUrl: '',
    phone: '+1 (718) 555-3821',
  },
  {
    id: 'phone-fermin-chucho',
    name: 'Fermin Amigo Chucho',
    fullName: 'Fermin Amigo Chucho',
    avatar: '',
    role: 'Amigo',
    country: 'Mexico',
    bank: 'Scotiabank Inverlat',
    photoUrl: '',
    phone: '+52 55 3344 5566',
  },
  {
    id: 'phone-jaime-gutierrez',
    name: 'Jaime Gutierrez',
    fullName: 'Jaime Gutierrez',
    avatar: '',
    role: 'Familiar KIN',
    country: 'Mexico',
    bank: 'Santander México',
    photoUrl: '',
    phone: '+1 347 987 6543',
    isFamily: true,
  },
  {
    id: 'phone-manuel-gomez',
    name: 'Manuel Gomez',
    fullName: 'Manuel Gomez',
    avatar: '',
    role: 'Familiar KIN',
    country: 'Mexico',
    bank: 'Banorte',
    photoUrl: '',
    phone: '+1 234 567 8910',
    isFamily: true,
  },
  {
    id: 'phone-vicente-eligio',
    name: 'Vicente Eligio',
    fullName: 'Vicente Eligio',
    avatar: '',
    role: 'Familia',
    country: 'Mexico',
    bank: 'Red Banxico SPEI',
    photoUrl: '',
    phone: '+52 10 9876 5432',
    isFamily: true,
  },
];

const ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'
];

interface WhatsAppContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: ContactItem) => void;
  contacts: ContactItem[];
  familyNetwork?: ContactItem[];
  userId: string;
}

export function WhatsAppContactsModal({
  isOpen,
  onClose,
  onSelectContact,
  contacts = [],
  familyNetwork = [],
  userId,
}: WhatsAppContactsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPickingFromPhone, setIsPickingFromPhone] = useState(false);
  const [showDirectPhoneInput, setShowDirectPhoneInput] = useState(false);
  const [directName, setDirectName] = useState('');
  const [directPhone, setDirectPhone] = useState('');
  const [directBank, setDirectBank] = useState('BBVA Bancomer');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Unificar contactos evitando duplicados
  const allMergedContacts = useMemo(() => {
    const map = new Map<string, ContactItem>();

    // 1. Contactos guardados del usuario (máxima prioridad)
    contacts.forEach((c) => {
      if (c && c.name) {
        const key = (c.phone ? c.phone.replace(/\D/g, '') : '') || c.name.toLowerCase().trim();
        map.set(key, c);
      }
    });

    // 2. Red Familiar
    familyNetwork.forEach((f) => {
      if (f && f.name && !f.id.includes(userId)) {
        const key = (f.phone ? f.phone.replace(/\D/g, '') : '') || f.name.toLowerCase().trim();
        if (!map.has(key)) map.set(key, f);
      }
    });

    // 3. Directorio telefónico predeterminado (estilo WhatsApp)
    INITIAL_PHONE_DIRECTORY.forEach((p) => {
      const key = (p.phone ? p.phone.replace(/\D/g, '') : '') || p.name.toLowerCase().trim();
      if (!map.has(key)) map.set(key, p);
    });

    return Array.from(map.values());
  }, [contacts, familyNetwork, userId]);

  // Filtrado reactivo en tiempo real con 0ms de retraso
  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allMergedContacts;

    const cleanNum = q.replace(/\D/g, '');
    return allMergedContacts.filter((c) => {
      const nameMatch = c.name?.toLowerCase().includes(q) || c.fullName?.toLowerCase().includes(q);
      const roleMatch = c.role?.toLowerCase().includes(q) || c.bank?.toLowerCase().includes(q);
      const phoneDigits = (c.phone || '').replace(/\D/g, '');
      const phoneMatch = cleanNum.length > 0 && phoneDigits.includes(cleanNum);
      return nameMatch || roleMatch || phoneMatch;
    });
  }, [allMergedContacts, searchQuery]);

  // Agrupación alfabética para cuando no hay búsqueda activa
  const alphabeticalGroups = useMemo(() => {
    const groups: Record<string, ContactItem[]> = {};

    filteredContacts.forEach((contact) => {
      const firstChar = (contact.name || contact.fullName || '#').trim().charAt(0).toUpperCase();
      const letter = /^[A-Z]$/.test(firstChar) ? firstChar : '#';
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(contact);
    });

    // Ordenar contactos dentro de cada grupo
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [filteredContacts]);

  // Contactos frecuentes / recientes (primeros 4)
  const recentContacts = useMemo(() => {
    return allMergedContacts.slice(0, 4);
  }, [allMergedContacts]);

  // Desplazamiento suave al pulsar una letra del abecedario
  const scrollToLetter = (letter: string) => {
    const targetEl = document.getElementById(`letter-anchor-${letter}`);
    if (targetEl && scrollContainerRef.current) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Acceso a la agenda nativa del celular mediante la API oficial Web Contacts
  const handleOpenNativePhoneBook = async () => {
    setIsPickingFromPhone(true);
    try {
      if (typeof window !== 'undefined' && 'contacts' in navigator && 'ContactsManager' in window) {
        const props = ['name', 'tel'];
        const selected = await (navigator as any).contacts.select(props, { multiple: false });
        if (selected && selected.length > 0) {
          const item = selected[0];
          const rawName = item.name?.[0] || 'Contacto Telefónico';
          const tel = item.tel?.[0] || '';
          const newContact: ContactItem = {
            id: `phone-native-${Date.now()}`,
            name: capitalizeWords(rawName.split(' ')[0]),
            fullName: capitalizeWords(rawName),
            avatar: '',
            role: tel || 'Contacto Telefónico',
            country: 'Mexico',
            bank: 'SPEI Banxico',
            photoUrl: '',
            phone: tel,
          };
          onSelectContact(newContact);
          onClose();
          return;
        }
      } else {
        // En iOS Safari la API requiere flag o cae en este asistente rápido
        setFeedback('Introduce el nombre o número en el buscador para ubicarlo de inmediato.');
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (e: any) {
      console.warn('[Contact Picker Cancelled/Error]', e);
    } finally {
      setIsPickingFromPhone(false);
    }
  };

  // Guardar y enviar directo a un número nuevo
  const handleDirectPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName.trim()) {
      setFeedback('Ingresa el nombre del destinatario');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    const cleanName = capitalizeWords(directName.trim());
    const newEntry: ContactItem = {
      id: `manual-${Date.now()}`,
      name: cleanName.split(' ')[0],
      fullName: cleanName,
      avatar: '',
      role: directPhone || 'Directo',
      country: 'Mexico',
      bank: directBank,
      photoUrl: '',
      phone: directPhone,
    };

    onSelectContact(newEntry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0D0F18] border border-white/10 sm:rounded-[32px] rounded-t-[32px] h-[92vh] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===================================================================== */}
        {/* 1. HEADER NATIVO WHATSAPP iOS                                         */}
        {/* ===================================================================== */}
        <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 border-b border-white/5 flex-shrink-0 bg-[#0D0F18]">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer active:scale-90"
            title="Cerrar"
          >
            <CloseIcon className="w-4 h-4" />
          </button>

          <div className="text-center">
            <h2 className="text-base font-bold text-white leading-tight font-title-base">
              Nuevo Envío
            </h2>
            <p className="text-[11px] text-[#8E91A5] font-medium">
              {filteredContacts.length} contactos disponibles
            </p>
          </div>

          <div className="w-8" />
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="mx-4 mt-2 p-2.5 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-2 animate-fade-in flex-shrink-0">
            <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 truncate">{feedback}</span>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 2. BARRA DE BÚSQUEDA SUPERIOR (ESTILO WHATSAPP iOS)                   */}
        {/* ===================================================================== */}
        <div className="px-4 py-2.5 flex-shrink-0 bg-[#0D0F18]">
          <div className="relative flex items-center w-full h-[44px] rounded-full bg-[#1C1F2E] border border-white/10 px-3.5 focus-within:border-primary transition-all">
            <SearchIcon className="w-4 h-4 text-[#8E91A5] mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, número o @usuario..."
              className="w-full bg-transparent text-sm text-white placeholder-[#8E91A5]/60 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-[10px] cursor-pointer ml-1"
                title="Limpiar"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. CONTENIDO PRINCIPAL: ACCIONES RÁPIDAS + DIRECTORIO CON SCRUBBER    */}
        {/* ===================================================================== */}
        <div className="relative flex-1 overflow-hidden flex">
          {/* Scrollable Contacts Container */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 pb-12 space-y-4 scrollbar-thin pr-7"
          >
            {/* Modal para ingresar nuevo número manualmente */}
            {showDirectPhoneInput && (
              <form
                onSubmit={handleDirectPhoneSubmit}
                className="p-3.5 rounded-2xl bg-[#161828] border border-primary/40 space-y-3 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">add_call</span>
                    <span>Enviar a Nuevo Destinatario</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowDirectPhoneInput(false)}
                    className="text-[#8E91A5] hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Nombre y Apellido (ej. Roberto Pérez)"
                  value={directName}
                  onChange={(e) => setDirectName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0D0F18] border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  autoFocus
                />
                <input
                  type="tel"
                  placeholder="Teléfono móvil o CLABE (10-18 dígitos)"
                  value={directPhone}
                  onChange={(e) => setDirectPhone(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0D0F18] border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <span>Continuar y Enviar</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </form>
            )}

            {/* TARJETA DE ACCIONES RÁPIDAS (EXACTA A WHATSAPP SCREENSHOT 2) */}
            {!searchQuery && !showDirectPhoneInput && (
              <div className="rounded-2xl bg-[#141624] border border-white/5 divide-y divide-white/5 overflow-hidden shadow-sm">
                {/* 1. Acceso a contactos del teléfono */}
                <button
                  type="button"
                  onClick={handleOpenNativePhoneBook}
                  disabled={isPickingFromPhone}
                  className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer group active:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined text-[20px]">contacts</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                        Acceder a contactos del teléfono
                      </p>
                      <p className="text-[10px] text-[#8E91A5]">
                        Abre la libreta de contactos de tu celular
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                    Abrir
                  </span>
                </button>

                {/* 2. Marcar número de teléfono directo */}
                <button
                  type="button"
                  onClick={() => setShowDirectPhoneInput(true)}
                  className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer group active:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 text-[#8E91A5] flex items-center justify-center group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-[20px]">dialpad</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                        Enviar por número o CLABE
                      </p>
                      <p className="text-[10px] text-[#8E91A5]">
                        Escribe el teléfono o cuenta SPEI directamente
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#8E91A5] text-[18px]">
                    chevron_right
                  </span>
                </button>

                {/* 3. Nuevo contacto */}
                <button
                  type="button"
                  onClick={() => setShowDirectPhoneInput(true)}
                  className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer group active:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 text-[#8E91A5] flex items-center justify-center group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-[20px]">person_add</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                        Nuevo contacto
                      </p>
                      <p className="text-[10px] text-[#8E91A5]">
                        Registrar un nuevo beneficiario
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#8E91A5] text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            )}

            {/* ================================================================= */}
            {/* OPCIÓN INTERACTIVA CUANDO BUSCA Y NO ENCUENTRA EXACTO             */}
            {/* ================================================================= */}
            {searchQuery.trim() && (
              <div
                onClick={() => {
                  const query = searchQuery.trim();
                  const isNum = /^\d+$/.test(query.replace(/\D/g, ''));
                  const newEntry: ContactItem = {
                    id: `search-add-${Date.now()}`,
                    name: capitalizeWords(query.split(' ')[0]),
                    fullName: capitalizeWords(query),
                    avatar: '',
                    role: isNum ? query : 'Contacto Rápido',
                    country: 'Mexico',
                    bank: 'Red Banxico SPEI',
                    photoUrl: '',
                    phone: isNum ? query : '',
                  };
                  onSelectContact(newEntry);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 flex items-center justify-between cursor-pointer hover:border-primary transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                    <PlusIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                      Enviar a "{searchQuery}"
                    </p>
                    <p className="text-[10px] text-[#8E91A5]">
                      Toca para seleccionar y enviar directamente
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px]">
                  arrow_forward
                </span>
              </div>
            )}

            {/* ================================================================= */}
            {/* SECCIÓN 1: CONTACTOS RECIENTES / FRECUENTES                       */}
            {/* ================================================================= */}
            {!searchQuery && recentContacts.length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-[#8E91A5] uppercase tracking-wider px-1">
                  Contactados Recientemente
                </p>
                <div className="rounded-2xl bg-[#141624] border border-white/5 divide-y divide-white/5 overflow-hidden">
                  {recentContacts.map((contact) => (
                    <div
                      key={`recent-${contact.id}`}
                      onClick={() => {
                        onSelectContact(contact);
                        onClose();
                      }}
                      className="px-3 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ContactAvatar
                          photoUrl={contact.photoUrl}
                          name={contact.name}
                          className="w-10 h-10 border border-white/10"
                          iconSize="text-[20px]"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                            {contact.fullName || contact.name}
                          </p>
                          <p className="text-[10px] text-[#8E91A5] truncate font-mono">
                            {contact.phone || contact.bank}
                          </p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-[#525672] group-hover:border-primary group-hover:bg-primary/20 flex items-center justify-center transition-all flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SECCIÓN 2: DIRECTORIO COMPLETO O RESULTADOS DE BÚSQUEDA           */}
            {/* ================================================================= */}
            {searchQuery.trim() ? (
              // Vista plana de resultados de búsqueda
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-[#8E91A5] uppercase tracking-wider px-1">
                  Resultados ({filteredContacts.length})
                </p>
                {filteredContacts.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-[#141624] border border-dashed border-white/10 space-y-1">
                    <p className="text-xs font-bold text-white">
                      No hay contactos que coincidan con "{searchQuery}"
                    </p>
                    <p className="text-[10px] text-[#8E91A5]">
                      Usa el botón superior para agregar a esta persona al instante.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#141624] border border-white/5 divide-y divide-white/5 overflow-hidden">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => {
                          onSelectContact(contact);
                          onClose();
                        }}
                        className="px-3.5 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ContactAvatar
                            photoUrl={contact.photoUrl}
                            name={contact.name}
                            className="w-10 h-10 border border-white/10"
                            iconSize="text-[20px]"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                              {contact.fullName || contact.name}
                            </p>
                            <p className="text-[10px] text-[#8E91A5] truncate font-mono">
                              {contact.phone || contact.role} {contact.bank ? `• ${contact.bank}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-[#525672] group-hover:border-primary group-hover:bg-primary/20 flex items-center justify-center transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Vista agrupada alfabéticamente (A-Z) con anclajes para el scrubber
              <div className="space-y-4">
                {Object.keys(alphabeticalGroups)
                  .sort()
                  .map((letter) => {
                    const list = alphabeticalGroups[letter];
                    if (!list || list.length === 0) return null;

                    return (
                      <div
                        key={`group-${letter}`}
                        id={`letter-anchor-${letter}`}
                        className="space-y-1 scroll-mt-2"
                      >
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-xs font-black text-primary">
                            {letter}
                          </span>
                          <div className="flex-1 h-[1px] bg-white/5" />
                        </div>

                        <div className="rounded-2xl bg-[#141624] border border-white/5 divide-y divide-white/5 overflow-hidden">
                          {list.map((contact) => (
                            <div
                              key={contact.id}
                              onClick={() => {
                                onSelectContact(contact);
                                onClose();
                              }}
                              className="px-3.5 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <ContactAvatar
                                  photoUrl={contact.photoUrl}
                                  name={contact.name}
                                  className="w-10 h-10 border border-white/10"
                                  iconSize="text-[20px]"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                                    {contact.fullName || contact.name}
                                  </p>
                                  <p className="text-[10px] text-[#8E91A5] truncate font-mono">
                                    {contact.phone || contact.bank || contact.role}
                                  </p>
                                </div>
                              </div>
                              <div className="w-5 h-5 rounded-full border-2 border-[#525672] group-hover:border-primary group-hover:bg-primary/20 flex items-center justify-center transition-all flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* =================================================================== */}
          {/* BANDA LATERAL ALFABÉTICA (SCRUBBER A-Z EN VERDE KIN)               */}
          {/* =================================================================== */}
          {!searchQuery && (
            <div className="absolute right-1 top-2 bottom-4 flex flex-col justify-between items-center text-[9px] font-black text-primary/80 select-none z-20 w-5 py-1">
              {ALPHABET.map((letter) => {
                const hasContacts = !!alphabeticalGroups[letter]?.length;
                return (
                  <button
                    key={`scrub-${letter}`}
                    type="button"
                    onClick={() => scrollToLetter(letter)}
                    className={`leading-none p-0.5 rounded transition-all cursor-pointer ${
                      hasContacts
                        ? 'text-primary hover:scale-125 font-bold hover:text-white'
                        : 'text-white/20 hover:text-white/40'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
