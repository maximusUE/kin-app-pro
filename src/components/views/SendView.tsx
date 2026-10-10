'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeftIcon,
  DockAnalyticsIcon,
  getBankLogoUrl,
  OxxoLogo,
  BodegaAurreraLogo,
  WalmartLogo,
  ElektraLogo,
  CoppelLogo,
  BancoppelLogo,
  SorianaLogo,
  FarmaciasGuadalajaraLogo,
  FarmaciasAhorroLogo,
  SevenElevenLogo,
  ChedrauiLogo,
  BansefiLogo,
  AnyAgentLogo,
  WhatsAppIcon,
} from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { ContactAvatar } from '@/components/ContactAvatar';
import { LegalDisclaimersCard } from '@/components/LegalDisclaimersCard';
import { MEXICO_STATES, MexicoState } from '@/data/mexicoLocations';
import type { SelectedPickupLocation } from '@/components/modals/CashPickupLocationModal';
import {
  validarCLABE,
  detectarBancoPorCLABE,
  formatearCLABE,
  BanxicoBankInfo,
} from '@/lib/validation/spei';
import { requestDeviceContact } from '@/lib/native/contactsBridge';

/**
 * Desglosa un nombre completo en Nombre(s), Primer Apellido y Segundo Apellido
 */
export function parseContactName(rawName: string): { nombre: string; apellido1: string; apellido2: string } {
  const cleaned = rawName.trim().replace(/\s+/g, ' ');
  if (!cleaned) return { nombre: '', apellido1: '', apellido2: '' };
  const parts = cleaned.split(' ');
  if (parts.length === 1) {
    return { nombre: parts[0], apellido1: '', apellido2: '' };
  }
  if (parts.length === 2) {
    return { nombre: parts[0], apellido1: parts[1], apellido2: '' };
  }
  if (parts.length === 3) {
    return { nombre: parts[0], apellido1: parts[1], apellido2: parts[2] };
  }
  // 4 o más palabras: ej. "María Elena Gómez Morales" -> Nombre: "María Elena", Apellido1: "Gómez", Apellido2: "Morales"
  return {
    nombre: parts.slice(0, parts.length - 2).join(' '),
    apellido1: parts[parts.length - 2],
    apellido2: parts[parts.length - 1],
  };
}

/**
 * Limpia y formatea un teléfono al estándar de 10 dígitos (ej. 443 123 4567)
 */
export function parseCleanPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';
  let tenDigits = digits;
  if (digits.length === 12 && digits.startsWith('52')) {
    tenDigits = digits.slice(2);
  } else if (digits.length === 11 && (digits.startsWith('1') || digits.startsWith('0'))) {
    tenDigits = digits.slice(1);
  } else if (digits.length > 10) {
    tenDigits = digits.slice(-10);
  }
  if (tenDigits.length <= 3) return tenDigits;
  if (tenDigits.length <= 6) return `${tenDigits.slice(0, 3)} ${tenDigits.slice(3)}`;
  return `${tenDigits.slice(0, 3)} ${tenDigits.slice(3, 6)} ${tenDigits.slice(6, 10)}`;
}

export const CASH_PICKUP_STORES = [
  {
    id: 'oxxo',
    name: 'OXXO',
    subtitle: 'Más de 21,000 tiendas 24/7 en todo México',
    badge: 'Popular 24/7',
    Logo: OxxoLogo,
  },
  {
    id: 'aurrera',
    name: 'Bodega Aurrera',
    subtitle: 'Más de 2,400 sucursales en México',
    badge: 'Sin comisión',
    Logo: BodegaAurreraLogo,
  },
  {
    id: 'guadalajara',
    name: 'Farmacias Guadalajara',
    subtitle: 'Más de 2,500 sucursales con farmacia y súper 24/7',
    badge: 'Fcia. Guadalajara',
    Logo: FarmaciasGuadalajaraLogo,
  },
  {
    id: 'walmart',
    name: 'Walmart',
    subtitle: 'Supercenter y Walmart Express en México',
    badge: 'Nacional',
    Logo: WalmartLogo,
  },
  {
    id: 'bancoppel',
    name: 'Tiendas Coppel',
    subtitle: 'Más de 1,700 tiendas departamentales en México',
    badge: 'Tiendas Coppel',
    Logo: CoppelLogo,
  },
  {
    id: 'elektra',
    name: 'Elektra',
    subtitle: 'Más de 1,200 tiendas comerciales en todo el país',
    badge: 'Inmediato',
    Logo: ElektraLogo,
  },
  {
    id: 'ahorro',
    name: 'Farmacias del Ahorro',
    subtitle: 'Más de 1,600 sucursales en todo el país',
    badge: 'Fcia. del Ahorro',
    Logo: FarmaciasAhorroLogo,
  },
  {
    id: 'seven_eleven',
    name: '7-Eleven',
    subtitle: 'Más de 1,800 tiendas 24/7 en México',
    badge: '7-Eleven 24/7',
    Logo: SevenElevenLogo,
  },
  {
    id: 'soriana',
    name: 'Soriana',
    subtitle: 'Más de 600 tiendas Híper, Súper y City Club',
    badge: 'Cajas Soriana',
    Logo: SorianaLogo,
  },
  {
    id: 'any',
    name: 'Cualquier Sucursal Comercial de la Red',
    subtitle: 'El familiar cobra en cualquier punto de los 40,000+ con su clave',
    badge: 'Red Completa 40k+',
    Logo: AnyAgentLogo,
  },
];

export interface SendContactItem {
  id: string;
  name: string;
  fullName?: string;
  avatar?: string;
  role?: string;
  country?: string;
  bank?: string;
  photoUrl?: string;
  clabe?: string;
  phone?: string;
  [key: string]: any;
}

export interface SendViewProps {
  onBack: () => void;
  onViewHistory: () => void;
  amountValue: string;
  setAmountValue: React.Dispatch<React.SetStateAction<string>>;
  USD_TO_MXN_RATE: number;
  language: 'es' | 'en';
  deliveryMethod: 'bank' | 'cash' | 'wallet';
  setDeliveryMethod: (method: 'bank' | 'cash' | 'wallet') => void;
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  selectedAvatar: SendContactItem | null;
  onSelectAvatarClick: () => void;
  handleClearSendDraft: () => void;
  handleStartSendReview: () => void;
  pickupLocation?: SelectedPickupLocation | null;
  setPickupLocation?: React.Dispatch<React.SetStateAction<SelectedPickupLocation | null>>;
  onOpenPickupLocationModal?: () => void;
  receiverMode?: 'existing' | 'new';
  setReceiverMode?: (mode: 'existing' | 'new') => void;
  onOpenNewRecipient?: () => void;
  contactsList?: SendContactItem[];
  onSelectContact?: (contact: SendContactItem) => void;
  onAddContact?: (newContact: SendContactItem) => void;
}

export function SendView({
  onBack,
  onViewHistory,
  amountValue,
  setAmountValue,
  USD_TO_MXN_RATE,
  language,
  deliveryMethod,
  setDeliveryMethod,
  selectedStore,
  setSelectedStore,
  selectedAvatar,
  onSelectAvatarClick,
  handleClearSendDraft,
  handleStartSendReview,
  pickupLocation,
  setPickupLocation,
  onOpenPickupLocationModal,
  receiverMode = 'existing',
  setReceiverMode,
  onOpenNewRecipient,
  contactsList = [],
  onSelectContact,
  onAddContact,
}: SendViewProps) {
  const isEn = language === 'en';

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Control de la hoja emergente (Drawer/Bottom Sheet) para selección de estado y sucursal
  const [isCashPickupSheetOpen, setIsCashPickupSheetOpen] = React.useState(false);
  const [showFeeBreakdownSheet, setShowFeeBreakdownSheet] = React.useState(false);
  const [stateSearchQuery, setStateSearchQuery] = React.useState('');

  // Estado de México seleccionado para cobro en efectivo
  const [selectedStateId, setSelectedStateId] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kin_draft_send_pickup_state');
      if (saved) return saved;
    }
    if (pickupLocation?.state) {
      const found = MEXICO_STATES.find(
        (s) => s.name.toLowerCase() === pickupLocation.state.toLowerCase()
      );
      if (found) return found.id;
    }
    return 'michoacan';
  });

  // Lista de estados retenidos como opciones en pantalla (Screenshot Western Union / KIN)
  const [pinnedStates, setPinnedStates] = React.useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kin_pinned_states');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return ['michoacan', 'jalisco', 'guanajuato', 'edomex', 'cdmx'];
  });

  // Objeto del estado actual seleccionado
  const currentStateObj = React.useMemo(() => {
    return MEXICO_STATES.find((s) => s.id === selectedStateId) || MEXICO_STATES[0];
  }, [selectedStateId]);

  // Objeto de la tienda actual seleccionada
  const selectedStoreObj = React.useMemo(() => {
    return CASH_PICKUP_STORES.find((s) => s.id === selectedStore) || CASH_PICKUP_STORES[0];
  }, [selectedStore]);

  // Helper para normalizar texto sin acentos
  const normalizeText = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Nombre formateado para mostrar en pantalla (reconociendo CDMX y Distrito Federal)
  const getStateDisplayName = (state: MexicoState) => {
    if (state.id === 'cdmx') {
      return 'Ciudad de México (Distrito Federal)';
    }
    return state.name;
  };

  // Filtrado de estados con la regla estricta de Don César:
  // "tiene que esperar que el cliente ponga la primer letra para que empiecen a aparecer los estados que coincidan con esa letra"
  const matchingStates = React.useMemo(() => {
    const q = stateSearchQuery.trim();
    if (q.length === 0) {
      return [];
    }

    const qNorm = normalizeText(q);

    return MEXICO_STATES.filter((s) => {
      const nameNorm = normalizeText(s.name);
      const codeNorm = normalizeText(s.code);
      const isCdmx = s.id === 'cdmx';
      const isEdomex = s.id === 'edomex';

      const matchesCdmx =
        isCdmx &&
        ('distrito federal'.startsWith(qNorm) ||
          'df'.startsWith(qNorm) ||
          'cdmx'.startsWith(qNorm) ||
          'distrito federal'.includes(qNorm));
      const matchesEdomex =
        isEdomex &&
        ('mexico'.startsWith(qNorm) ||
          'edomex'.startsWith(qNorm) ||
          'estado de mexico'.includes(qNorm));

      return (
        nameNorm.startsWith(qNorm) ||
        codeNorm.startsWith(qNorm) ||
        matchesCdmx ||
        matchesEdomex ||
        nameNorm.includes(qNorm) ||
        s.cities.some((c) => normalizeText(c).startsWith(qNorm) || normalizeText(c).includes(qNorm))
      );
    }).sort((a, b) => {
      const aStarts =
        normalizeText(a.name).startsWith(qNorm) ||
        normalizeText(a.code).startsWith(qNorm) ||
        (a.id === 'cdmx' && ('distrito federal'.startsWith(qNorm) || 'df'.startsWith(qNorm)));
      const bStarts =
        normalizeText(b.name).startsWith(qNorm) ||
        normalizeText(b.code).startsWith(qNorm) ||
        (b.id === 'cdmx' && ('distrito federal'.startsWith(qNorm) || 'df'.startsWith(qNorm)));
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [stateSearchQuery]);

  // Seleccionar un estado y mantenerlo como opción en la pantalla
  const handleSelectState = (state: MexicoState) => {
    setSelectedStateId(state.id);
    setStateSearchQuery('');

    // Actualizar estados retenidos en pantalla y persistir en localStorage
    setPinnedStates((prev) => {
      const updated = [state.id, ...prev.filter((id) => id !== state.id)].slice(0, 6);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('kin_pinned_states', JSON.stringify(updated));
          localStorage.setItem('kin_draft_send_pickup_state', state.id);
        } catch (_) {}
      }
      return updated;
    });

    // Actualizar pickupLocation
    if (setPickupLocation) {
      const storeObj = CASH_PICKUP_STORES.find((s) => s.id === selectedStore) || CASH_PICKUP_STORES[0];
      setPickupLocation({
        state: state.name,
        city: state.cities[0] || state.name,
        branch: {
          id: `${selectedStore}-${state.code.toLowerCase()}`,
          storeName: storeObj.name,
          chain: selectedStore,
          address: `Cualquier sucursal ${storeObj.name} en ${state.name}`,
          city: state.cities[0] || state.name,
          state: state.name,
          hours: storeObj.id === 'oxxo' ? 'Abierto 24 Horas' : 'Horario comercial',
          is24Hours: storeObj.id === 'oxxo',
          badge: storeObj.badge,
        },
      });
    }
  };

  // Seleccionar una tienda o sucursal dentro del estado
  const handleSelectStore = (storeId: string) => {
    setSelectedStore(storeId);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_draft_send_store', storeId);
      } catch (_) {}
    }
    if (setPickupLocation) {
      const stateObj = currentStateObj;
      const storeObj = CASH_PICKUP_STORES.find((s) => s.id === storeId) || CASH_PICKUP_STORES[0];
      setPickupLocation({
        state: stateObj.name,
        city: stateObj.cities[0] || stateObj.name,
        branch: {
          id: `${storeId}-${stateObj.code.toLowerCase()}`,
          storeName: storeObj.name,
          chain: storeId,
          address: `Cualquier sucursal ${storeObj.name} en ${stateObj.name}`,
          city: stateObj.cities[0] || stateObj.name,
          state: stateObj.name,
          hours: storeObj.id === 'oxxo' ? 'Abierto 24 Horas' : 'Horario comercial',
          is24Hours: storeObj.id === 'oxxo',
          badge: storeObj.badge,
        },
      });
    }
  };

  // Modo de selección de destinatario (3: Destinatario Frecuente vs 4: + Nuevo Destinatario)
  const [localReceiverMode, setLocalReceiverMode] = React.useState<'existing' | 'new'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kin_draft_receiver_mode');
      if (saved === 'existing' || saved === 'new') return saved;
    }
    return receiverMode || 'existing';
  });

  const currentReceiverMode = receiverMode !== undefined ? receiverMode : localReceiverMode;

  const handleSetReceiverMode = (mode: 'existing' | 'new') => {
    setLocalReceiverMode(mode);
    setReceiverMode?.(mode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_draft_receiver_mode', mode);
      } catch (_) {}
    }
  };

  // Directorio de Destinatarios Frecuentes con persistencia en localStorage
  const DEFAULT_FREQUENT_RECIPIENTS: SendContactItem[] = [
    {
      id: 'rec_maria_gomez',
      name: 'María Elena',
      fullName: 'María Elena Gómez Morales',
      firstName: 'María Elena',
      lastName: 'Gómez Morales',
      phone: '+52 443 289 4410',
      state: 'Michoacán',
      city: 'Morelia',
      bank: 'Red Retiro en Efectivo',
      country: 'Mexico',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'rec_carlos_ramirez',
      name: 'Carlos Eduardo',
      fullName: 'Carlos Eduardo Ramírez Santos',
      firstName: 'Carlos Eduardo',
      lastName: 'Ramírez Santos',
      phone: '+52 331 450 9922',
      state: 'Jalisco',
      city: 'Guadalajara',
      bank: 'Red Retiro en Efectivo',
      country: 'Mexico',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'rec_rosa_fernandez',
      name: 'Rosa Linda',
      fullName: 'Rosa Linda Fernández Ruiz',
      firstName: 'Rosa Linda',
      lastName: 'Fernández Ruiz',
      phone: '+52 477 392 8841',
      state: 'Guanajuato',
      city: 'León',
      bank: 'Red Retiro en Efectivo',
      country: 'Mexico',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const [frequentRecipients, setFrequentRecipients] = React.useState<SendContactItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kin_frequent_cash_recipients');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return DEFAULT_FREQUENT_RECIPIENTS;
  });

  // Lista combinada de frecuentes con contactsList
  const allFrequentList = React.useMemo(() => {
    const map = new Map<string, SendContactItem>();
    frequentRecipients.forEach((c) => map.set(c.id, c));
    contactsList.forEach((c) => {
      if (!map.has(c.id)) {
        map.set(c.id, {
          ...c,
          fullName: c.fullName || c.name,
          state: c.state || 'Michoacán',
          city: (c as any).city || 'Morelia',
          phone: c.phone || '+52 443 123 4567',
        });
      }
    });
    return Array.from(map.values());
  }, [frequentRecipients, contactsList]);

  // Búsqueda y control de expansión para destinatarios frecuentes
  const [frequentSearchQuery, setFrequentSearchQuery] = React.useState('');
  const [isFrequentListExpanded, setIsFrequentListExpanded] = React.useState(false);

  const filteredFrequentRecipients = React.useMemo(() => {
    const q = frequentSearchQuery.trim();
    if (!q) return allFrequentList;
    const qNorm = normalizeText(q);
    return allFrequentList.filter((c) => {
      const nameMatch = normalizeText(c.fullName || c.name).includes(qNorm);
      const phoneDigits = (c.phone || '').replace(/\D/g, '');
      const searchDigits = q.replace(/\D/g, '');
      const phoneMatch = searchDigits ? phoneDigits.includes(searchDigits) : false;
      const stateMatch = c.state && normalizeText(c.state).includes(qNorm);
      const cityMatch = (c as any).city && normalizeText((c as any).city).includes(qNorm);
      return nameMatch || phoneMatch || stateMatch || cityMatch;
    });
  }, [allFrequentList, frequentSearchQuery]);

  // Formulario Western Union para Nuevo Destinatario
  const [formNombre, setFormNombre] = React.useState('');
  const [formApellido1, setFormApellido1] = React.useState('');
  const [formApellido2, setFormApellido2] = React.useState('');
  const [formState, setFormState] = React.useState('');
  const [formCity, setFormCity] = React.useState('');
  const [formPhone, setFormPhone] = React.useState('');
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [formSuccessFeedback, setFormSuccessFeedback] = React.useState<string | null>(null);

  // Modales Portal centrados para Selección de Estado y Ciudad
  const [isFormStateModalOpen, setIsFormStateModalOpen] = React.useState(false);
  const [isFormCityModalOpen, setIsFormCityModalOpen] = React.useState(false);
  const [formStateModalSearch, setFormStateModalSearch] = React.useState('');
  const [formCityModalSearch, setFormCityModalSearch] = React.useState('');

  // Ciudades disponibles para el estado elegido en el formulario
  const availableFormCities = React.useMemo(() => {
    if (!formState) return [];
    const stateObj = MEXICO_STATES.find(
      (s) => s.name.toLowerCase() === formState.toLowerCase() || s.id === formState.toLowerCase()
    );
    return stateObj ? stateObj.cities : [];
  }, [formState]);

  const filteredFormCities = React.useMemo(() => {
    const q = formCityModalSearch.trim();
    if (!q) return availableFormCities;
    const qNorm = normalizeText(q);
    return availableFormCities.filter((c) => normalizeText(c).includes(qNorm));
  }, [availableFormCities, formCityModalSearch]);

  const filteredFormStates = React.useMemo(() => {
    const q = formStateModalSearch.trim();
    if (!q) return MEXICO_STATES;
    const qNorm = normalizeText(q);
    return MEXICO_STATES.filter((s) => {
      const nameNorm = normalizeText(s.name);
      const codeNorm = normalizeText(s.code);
      const isCdmx = s.id === 'cdmx';
      return (
        nameNorm.includes(qNorm) ||
        codeNorm.includes(qNorm) ||
        (isCdmx && ('distrito federal'.includes(qNorm) || 'df'.includes(qNorm) || 'cdmx'.includes(qNorm))) ||
        s.cities.some((c) => normalizeText(c).includes(qNorm))
      );
    });
  }, [formStateModalSearch]);

  // Selección de Estado en formulario (desbloquea Ciudad y abre su modal)
  const handleSelectFormState = (stateObj: MexicoState) => {
    setFormState(stateObj.name);
    setFormCity(''); // Resetea ciudad anterior para consistencia
    setIsFormStateModalOpen(false);
    setFormStateModalSearch('');
    if (formErrors.state) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.state;
        return next;
      });
    }
    // Transición fluida estilo Western Union: abrir directamente el selector de ciudades de ese estado
    setTimeout(() => {
      setFormCityModalSearch('');
      setIsFormCityModalOpen(true);
    }, 150);
  };

  // Selección de Ciudad en formulario
  const handleSelectFormCity = (cityName: string) => {
    setFormCity(cityName);
    setIsFormCityModalOpen(false);
    setFormCityModalSearch('');
    if (formErrors.city) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.city;
        return next;
      });
    }
  };

  // =========================================================================
  // CONTROL DE IMPORTACIÓN INTELIGENTE DE CONTACTOS (NATIVO O AGENDA INTERNA)
  // =========================================================================
  const [isImportContactModalOpen, setIsImportContactModalOpen] = React.useState(false);
  const [importContactTarget, setImportContactTarget] = React.useState<'cash' | 'bank' | 'wallet'>('cash');
  const [importContactSearch, setImportContactSearch] = React.useState('');
  const [importPastedText, setImportPastedText] = React.useState('');

  const filteredImportContacts = React.useMemo(() => {
    const q = importContactSearch.trim();
    if (!q) return allFrequentList;
    const qNorm = normalizeText(q);
    return allFrequentList.filter((c) => {
      const nameMatch = normalizeText(c.fullName || c.name).includes(qNorm);
      const phoneDigits = (c.phone || '').replace(/\D/g, '');
      const searchDigits = q.replace(/\D/g, '');
      const phoneMatch = searchDigits ? phoneDigits.includes(searchDigits) : false;
      return nameMatch || phoneMatch;
    });
  }, [allFrequentList, importContactSearch]);

  const applyImportedContact = (
    target: 'cash' | 'bank' | 'wallet',
    rawName: string,
    rawPhone: string,
    bankName?: string,
    clabe?: string
  ) => {
    const { nombre, apellido1, apellido2 } = parseContactName(rawName);
    const formattedPhone = parseCleanPhone(rawPhone);

    if (target === 'cash') {
      if (nombre) setFormNombre(nombre);
      if (apellido1) setFormApellido1(apellido1);
      if (apellido2) setFormApellido2(apellido2);
      if (formattedPhone) setFormPhone(formattedPhone);
      setFormErrors({});
      setFormSuccessFeedback(
        isEn
          ? `✨ Imported "${rawName}" from contacts. Verify it matches their official Mexican ID (INE).`
          : `✨ Datos de "${rawName}" importados. Verifica que el nombre coincida con su credencial oficial (INE).`
      );
      setTimeout(() => setFormSuccessFeedback(null), 6000);
    } else if (target === 'bank') {
      if (nombre) setBankNombre(nombre);
      if (apellido1) setBankApellido1(apellido1);
      if (apellido2) setBankApellido2(apellido2);
      if (formattedPhone) setBankPhone(formattedPhone);
      if (clabe) setBankClabe(formatearCLABE(clabe));
      setBankErrors({});
      setBankSuccessFeedback(
        isEn
          ? `✨ Imported "${rawName}" from contacts. Verify it matches the bank account title.`
          : `✨ Datos de "${rawName}" importados. Verifica que el nombre coincida con el titular de la cuenta bancaria.`
      );
      setTimeout(() => setBankSuccessFeedback(null), 6000);
    } else if (target === 'wallet') {
      if (nombre) setWalletNombre(nombre);
      if (apellido1) setWalletApellido1(apellido1);
      if (apellido2) setWalletApellido2(apellido2);
      if (formattedPhone) {
        setWalletPhone(formattedPhone);
        setWalletIdentifier(formattedPhone);
      }
      setWalletErrors({});
      setWalletSuccessFeedback(
        isEn
          ? `✨ Imported "${rawName}" from contacts. Check wallet details.`
          : `✨ Datos de "${rawName}" importados. Revisa que el número esté registrado en la billetera.`
      );
      setTimeout(() => setWalletSuccessFeedback(null), 6000);
    }
  };

  // Control de permisos para WhatsApp
  const [hasWhatsAppPermission, setHasWhatsAppPermission] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kin_whatsapp_contacts_permission') === 'granted';
    }
    return false;
  });
  const [isWhatsAppPermissionPromptOpen, setIsWhatsAppPermissionPromptOpen] = React.useState(false);

  const handleTriggerContactImport = async (target: 'cash' | 'bank' | 'wallet') => {
    setImportContactTarget(target);

    // 1. Intento nativo directo (App Nativa iOS / Android vía Capacitor o Web API)
    try {
      const nativeResult = await requestDeviceContact();
      if (nativeResult.success && nativeResult.name) {
        applyImportedContact(target, nativeResult.name, nativeResult.phone || '');
        return;
      }
    } catch (err) {
      console.warn('[KIN Contacts Bridge] Fallback a diálogo de contactos:', err);
    }

    // 2. Si estamos en Web o no devolvió contacto nativo:
    // Preguntar al cliente si desea que la app tenga acceso a sus contactos de WhatsApp
    if (!hasWhatsAppPermission) {
      setIsWhatsAppPermissionPromptOpen(true);
    } else {
      setImportContactSearch('');
      setImportPastedText('');
      setIsImportContactModalOpen(true);
    }
  };

  const handleGrantWhatsAppPermission = () => {
    setHasWhatsAppPermission(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_whatsapp_contacts_permission', 'granted');
      } catch (_) {}
    }
    setIsWhatsAppPermissionPromptOpen(false);
    setImportContactSearch('');
    setImportPastedText('');
    setIsImportContactModalOpen(true);
  };

  const handleApplyPastedContact = () => {
    const text = importPastedText.trim();
    if (!text) return;
    const digits = text.replace(/\D/g, '');
    let phone = '';
    if (digits.length >= 10) {
      phone = digits.slice(-10);
    }
    const nameWithoutDigits = text.replace(/[\d+()-]/g, '').trim().replace(/\s+/g, ' ');
    const name = nameWithoutDigits || (phone ? `Contacto ${phone.slice(-4)}` : text);

    applyImportedContact(importContactTarget, name, phone);
    setIsImportContactModalOpen(false);
  };

  // Selección de Destinatario Frecuente
  const handleSelectFrequentContact = (contact: SendContactItem) => {
    onSelectContact?.(contact);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_draft_send_recipient', JSON.stringify(contact));
      } catch (_) {}
    }

    // Sincronizar estado y ciudad del contacto
    const contactState = contact.state || currentStateObj.name;
    const contactCity = (contact as any).city || currentStateObj.cities[0] || 'Centro';
    const foundState = MEXICO_STATES.find(
      (s) => s.name.toLowerCase() === contactState.toLowerCase()
    ) || currentStateObj;
    setSelectedStateId(foundState.id);

    if (setPickupLocation) {
      const storeObj = CASH_PICKUP_STORES.find((s) => s.id === selectedStore) || CASH_PICKUP_STORES[0];
      setPickupLocation({
        state: foundState.name,
        city: contactCity,
        branch: {
          id: `${selectedStore}-${foundState.code.toLowerCase()}`,
          storeName: storeObj.name,
          chain: selectedStore,
          address: `Cualquier sucursal ${storeObj.name} en ${contactCity}, ${foundState.name}`,
          city: contactCity,
          state: foundState.name,
          hours: storeObj.id === 'oxxo' ? 'Abierto 24 Horas' : 'Horario comercial',
          is24Hours: storeObj.id === 'oxxo',
          badge: storeObj.badge,
        },
      });
    }
  };

  // Guardar Nuevo Destinatario con validaciones rigurosas
  const handleSaveNewRecipient = () => {
    const errors: Record<string, string> = {};
    if (!formNombre.trim()) {
      errors.nombre = 'El nombre es obligatorio (según identificación oficial)';
    }
    if (!formApellido1.trim()) {
      errors.apellido1 = 'El primer apellido es obligatorio';
    }
    if (!formState.trim()) {
      errors.state = 'El Estado de retiro es obligatorio';
    }
    if (!formCity.trim()) {
      errors.city = 'La Ciudad de retiro es obligatoria';
    }
    const cleanPhone = formPhone.replace(/[^\d]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Ingresa el número celular completo de 10 dígitos';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const fullName = `${formNombre.trim()} ${formApellido1.trim()}${formApellido2.trim() ? ' ' + formApellido2.trim() : ''}`;
    const newContact: SendContactItem = {
      id: 'rec_' + Date.now(),
      name: formNombre.trim(),
      fullName: fullName,
      firstName: formNombre.trim(),
      lastName: `${formApellido1.trim()}${formApellido2.trim() ? ' ' + formApellido2.trim() : ''}`,
      phone: `+52 ${formPhone.trim()}`,
      state: formState,
      city: formCity,
      bank: 'Red Retiro en Efectivo',
      country: 'Mexico',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    };

    // 1. Guardar en lista de frecuentes
    const updatedList = [newContact, ...frequentRecipients.filter((c) => c.id !== newContact.id)];
    setFrequentRecipients(updatedList);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_frequent_cash_recipients', JSON.stringify(updatedList));
        localStorage.setItem('kin_draft_send_recipient', JSON.stringify(newContact));
      } catch (_) {}
    }

    // 2. Notificar al sistema global
    onAddContact?.(newContact);
    onSelectContact?.(newContact);

    // 3. Sincronizar pickupLocation
    const foundState = MEXICO_STATES.find(
      (s) => s.name.toLowerCase() === formState.toLowerCase()
    ) || currentStateObj;
    setSelectedStateId(foundState.id);

    if (setPickupLocation) {
      const storeObj = CASH_PICKUP_STORES.find((s) => s.id === selectedStore) || CASH_PICKUP_STORES[0];
      setPickupLocation({
        state: formState,
        city: formCity,
        branch: {
          id: `${selectedStore}-${Date.now()}`,
          storeName: storeObj.name,
          chain: selectedStore,
          address: `Cualquier sucursal ${storeObj.name} en ${formCity}, ${formState}`,
          city: formCity,
          state: formState,
          hours: storeObj.id === 'oxxo' ? 'Abierto 24 Horas' : 'Horario comercial',
          is24Hours: storeObj.id === 'oxxo',
          badge: storeObj.badge,
        },
      });
    }

    // 4. Limpiar formulario
    setFormNombre('');
    setFormApellido1('');
    setFormApellido2('');
    setFormState('');
    setFormCity('');
    setFormPhone('');
    setFormSuccessFeedback(`¡${newContact.fullName} registrado y guardado como destinatario frecuente!`);

    // 5. Conmutar a vista de Destinatario Frecuente
    handleSetReceiverMode('existing');

    setTimeout(() => {
      setFormSuccessFeedback(null);
    }, 4500);
  };

  // =========================================================================
  // ESTADO Y MANEJADORES PARA CUENTA BANCARIA (SPEI 24/7 EN MÉXICO)
  // =========================================================================
  const [bankReceiverMode, setBankReceiverMode] = React.useState<'existing' | 'new'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kin_draft_bank_receiver_mode');
      if (saved === 'existing' || saved === 'new') return saved;
    }
    return 'existing';
  });

  const [bankNombre, setBankNombre] = React.useState('');
  const [bankApellido1, setBankApellido1] = React.useState('');
  const [bankApellido2, setBankApellido2] = React.useState('');
  const [bankClabe, setBankClabe] = React.useState('');
  const [bankPhone, setBankPhone] = React.useState('');
  const [bankErrors, setBankErrors] = React.useState<Record<string, string>>({});
  const [bankSuccessFeedback, setBankSuccessFeedback] = React.useState<string | null>(null);

  // Detección automática en tiempo real de banco por los primeros 3 dígitos
  const detectedBank = React.useMemo(() => {
    return detectarBancoPorCLABE(bankClabe);
  }, [bankClabe]);

  // Validación matemática Banxico (Módulo 10 ponderado 3-7-1)
  const bankClabeValidation = React.useMemo(() => {
    const clean = bankClabe.replace(/\D/g, '');
    if (clean.length === 18) {
      return validarCLABE(clean);
    }
    return null;
  }, [bankClabe]);

  const handleSetBankReceiverMode = (mode: 'existing' | 'new') => {
    setBankReceiverMode(mode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_draft_bank_receiver_mode', mode);
      } catch (_) {}
    }
  };

  const handleSaveBankRecipient = () => {
    const errors: Record<string, string> = {};
    if (!bankNombre.trim()) {
      errors.nombre = isEn ? 'Given name is required' : 'El nombre es obligatorio (según titular de la cuenta)';
    }
    if (!bankApellido1.trim()) {
      errors.apellido1 = isEn ? 'First surname is required' : 'El primer apellido es obligatorio';
    }
    const cleanClabe = bankClabe.replace(/\D/g, '');
    if (!cleanClabe || cleanClabe.length !== 18) {
      errors.clabe = isEn ? 'CLABE must have exactly 18 digits' : 'La CLABE interbancaria debe tener exactamente 18 dígitos';
    } else {
      const val = validarCLABE(cleanClabe);
      if (!val.valida) {
        errors.clabe = val.error || (isEn ? 'Invalid CLABE checksum (Banxico Módulo 10)' : 'Dígito verificador inválido según Banxico (Módulo 10)');
      }
    }
    const cleanPhone = bankPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = isEn ? 'Enter 10-digit mobile phone for CEP tracking' : 'Ingresa el celular de 10 dígitos para comprobante CEP Banxico';
    }

    if (Object.keys(errors).length > 0) {
      setBankErrors(errors);
      return;
    }

    setBankErrors({});

    const fullName = `${bankNombre.trim()} ${bankApellido1.trim()}${bankApellido2.trim() ? ' ' + bankApellido2.trim() : ''}`;
    const bankName = detectedBank?.shortName || bankClabeValidation?.banco?.shortName || 'SPEI Banxico';
    const newBankContact: SendContactItem = {
      id: 'bank_' + Date.now(),
      name: bankNombre.trim(),
      fullName: fullName,
      firstName: bankNombre.trim(),
      lastName: `${bankApellido1.trim()}${bankApellido2.trim() ? ' ' + bankApellido2.trim() : ''}`,
      phone: `+52 ${cleanPhone.slice(-10)}`,
      clabe: cleanClabe,
      bank: bankName,
      country: 'Mexico',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    };

    onAddContact?.(newBankContact);
    onSelectContact?.(newBankContact);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_draft_send_recipient', JSON.stringify(newBankContact));
      } catch (_) {}
    }

    setBankNombre('');
    setBankApellido1('');
    setBankApellido2('');
    setBankClabe('');
    setBankPhone('');
    setBankSuccessFeedback(
      isEn
        ? `Account ${fullName} (${bankName}) saved successfully!`
        : `¡Cuenta ${bankName} de ${fullName} guardada exitosamente!`
    );
    handleSetBankReceiverMode('existing');

    setTimeout(() => {
      setBankSuccessFeedback(null);
    }, 4500);
  };

  // =========================================================================
  // ESTADO Y MANEJADORES PARA BILLETERA MÓVIL (KIN CASH / MERCADO PAGO)
  // =========================================================================
  const [walletProvider, setWalletProvider] = React.useState<'kin' | 'mercadopago'>('kin');
  const [walletReceiverMode, setWalletReceiverMode] = React.useState<'existing' | 'new'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kin_draft_wallet_receiver_mode');
      if (saved === 'existing' || saved === 'new') return saved;
    }
    return 'existing';
  });

  const [walletNombre, setWalletNombre] = React.useState('');
  const [walletApellido1, setWalletApellido1] = React.useState('');
  const [walletApellido2, setWalletApellido2] = React.useState('');
  const [walletIdentifier, setWalletIdentifier] = React.useState('');
  const [walletPhone, setWalletPhone] = React.useState('');
  const [walletErrors, setWalletErrors] = React.useState<Record<string, string>>({});
  const [walletSuccessFeedback, setWalletSuccessFeedback] = React.useState<string | null>(null);

  const handleSetWalletReceiverMode = (mode: 'existing' | 'new') => {
    setWalletReceiverMode(mode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_draft_wallet_receiver_mode', mode);
      } catch (_) {}
    }
  };

  const handleSaveWalletRecipient = () => {
    const errors: Record<string, string> = {};
    if (!walletNombre.trim()) {
      errors.nombre = isEn ? 'Name is required' : 'El nombre es obligatorio (titular de la cuenta)';
    }
    if (!walletApellido1.trim()) {
      errors.apellido1 = isEn ? 'First surname is required' : 'El primer apellido es obligatorio';
    }
    const cleanId = walletIdentifier.trim();
    if (!cleanId) {
      errors.identifier = walletProvider === 'kin'
        ? (isEn ? 'Enter KIN phone or @kinTag' : 'Ingresa el número celular KIN o @kinTag')
        : (isEn ? 'Enter phone, email or STP CLABE' : 'Ingresa celular a 10 dígitos, email o CLABE STP (646)');
    } else if (walletProvider === 'mercadopago') {
      const digits = cleanId.replace(/\D/g, '');
      const isEmail = cleanId.includes('@') && cleanId.includes('.');
      const isClabe = digits.length === 18;
      const isPhone = digits.length === 10;
      if (!isEmail && !isClabe && !isPhone) {
        errors.identifier = isEn
          ? 'Enter a valid 10-digit phone, email, or 18-digit CLABE'
          : 'Ingresa un celular válido de 10 dígitos, email o CLABE STP de 18 dígitos';
      }
    }

    if (Object.keys(errors).length > 0) {
      setWalletErrors(errors);
      return;
    }

    setWalletErrors({});

    const fullName = `${walletNombre.trim()} ${walletApellido1.trim()}${walletApellido2.trim() ? ' ' + walletApellido2.trim() : ''}`;
    const providerName = walletProvider === 'kin' ? 'KIN Cash' : 'Mercado Pago';
    const cleanDigits = (walletPhone || walletIdentifier).replace(/\D/g, '').slice(-10);
    const newWalletContact: SendContactItem = {
      id: 'wallet_' + Date.now(),
      name: walletNombre.trim(),
      fullName: fullName,
      firstName: walletNombre.trim(),
      lastName: `${walletApellido1.trim()}${walletApellido2.trim() ? ' ' + walletApellido2.trim() : ''}`,
      phone: cleanDigits ? `+52 ${cleanDigits}` : '+52 55 0000 0000',
      bank: providerName,
      country: 'Mexico',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      walletId: walletIdentifier.trim(),
    };

    onAddContact?.(newWalletContact);
    onSelectContact?.(newWalletContact);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_draft_send_recipient', JSON.stringify(newWalletContact));
      } catch (_) {}
    }

    setWalletNombre('');
    setWalletApellido1('');
    setWalletApellido2('');
    setWalletIdentifier('');
    setWalletPhone('');
    setWalletSuccessFeedback(
      isEn
        ? `${providerName} wallet for ${fullName} saved successfully!`
        : `¡Billetera ${providerName} de ${fullName} guardada exitosamente!`
    );
    handleSetWalletReceiverMode('existing');

    setTimeout(() => {
      setWalletSuccessFeedback(null);
    }, 4500);
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header: < | KinLogo | Send money | Historial */}
      <header className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="btn-circle"
            title={isEn ? 'Back to home' : 'Volver al inicio'}
          >
            <ChevronLeftIcon className="w-5 h-5 text-white" />
          </button>
          <KinLogo size={34} />
        </div>

        <div className="text-center">
          <h1 className="text-base font-black text-white tracking-wide">
            {isEn ? 'Send money' : 'Enviar dinero'}
          </h1>
          <span className="text-[10px] font-semibold text-[#2ED5A4] flex items-center justify-center gap-1">
            <span>USA</span>
            <span>⇄</span>
            <span>México</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onViewHistory}
          className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-xs font-bold text-[#8E91A5] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          title={isEn ? 'View send history' : 'Ver historial de envíos'}
        >
          <DockAnalyticsIcon className="w-3.5 h-3.5" />
          <span>{isEn ? 'History' : 'Historial'}</span>
        </button>
      </header>

      {/* STITCH DUAL LIVE EXCHANGE CALCULATOR */}
      <div className="relative flex flex-col space-y-2">
        {/* You Send Card */}
        <div className="rounded-2xl bg-white dark:bg-surface-container-high p-4 shadow-sm flex flex-col space-y-3 border border-slate-200/80 dark:border-white/5">
          <div className="flex items-center justify-between">
            <label className="font-caption-sm text-xs uppercase text-slate-500 dark:text-on-surface-variant font-semibold" htmlFor="send-amount-input">
              {isEn ? 'You Send' : 'Tú Envías'}
            </label>
            <span className="font-caption-sm text-xs text-emerald-600 dark:text-primary flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[13px]">check_circle</span> {isEn ? 'No markup rate' : 'Sin sobreprecio'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0 flex-1 h-14 px-4.5 rounded-full bg-slate-50 dark:bg-surface-container border border-slate-200/90 dark:border-white/10 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <span className="font-financial-mono text-2xl sm:text-3xl text-emerald-600 dark:text-primary font-black select-none shrink-0">$</span>
              <input
                aria-label="Send amount in USD"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                className="w-full bg-transparent border-none border-0 outline-none focus:outline-none focus:ring-0 font-financial-mono text-2xl sm:text-3xl text-slate-900 dark:text-white font-black placeholder:text-slate-400 dark:placeholder:text-white/20 py-0 cursor-text shadow-none"
                id="send-amount-input"
                placeholder="0"
                value={amountValue === '0' || !amountValue ? '' : amountValue}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  const parts = val.split('.');
                  if (parts.length > 2) return;
                  if (parts[1] && parts[1].length > 2) return;
                  setAmountValue(val === '' ? '0' : val);
                }}
              />
              {amountValue !== '0' && amountValue !== '' && (
                <button
                  type="button"
                  onClick={() => setAmountValue('0')}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white text-xs shrink-0 cursor-pointer active:scale-90 transition-all ml-1"
                  title={isEn ? 'Clear to zero' : 'Borrar a cero'}
                >
                  ✕
                </button>
              )}
            </div>
            <div className="h-14 px-4.5 rounded-full bg-white dark:bg-surface-container border border-slate-200/90 dark:border-white/10 shadow-sm flex items-center gap-2 shrink-0 select-none">
              <span className="text-xl">🇺🇸</span>
              <span className="font-title-base text-xs sm:text-sm text-slate-900 dark:text-white font-black tracking-wide">USD</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-[#8E91A5] font-medium pt-0.5">
            {isEn ? 'Tap the amount to type with your phone keyboard' : 'Toca la cantidad para escribir con el teclado de tu teléfono'}
          </p>
          {/* Quick Amount Increment Pills - Regla Don César: Estilo Píldora Bandera USA */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none py-1">
            <button
              className="h-9 px-4 rounded-full bg-white dark:bg-surface-container hover:bg-slate-50 dark:hover:bg-surface-bright text-slate-800 dark:text-on-surface font-financial-mono text-xs font-bold active:scale-95 transition-all cursor-pointer border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-center shrink-0"
              onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 50).toFixed(0))}
              type="button"
            >
              +$50
            </button>
            <button
              className="h-9 px-4 rounded-full bg-white dark:bg-surface-container hover:bg-slate-50 dark:hover:bg-surface-bright text-slate-800 dark:text-on-surface font-financial-mono text-xs font-bold active:scale-95 transition-all cursor-pointer border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-center shrink-0"
              onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 100).toFixed(0))}
              type="button"
            >
              +$100
            </button>
            <button
              className="h-9 px-4 rounded-full bg-white dark:bg-surface-container hover:bg-slate-50 dark:hover:bg-surface-bright text-slate-800 dark:text-on-surface font-financial-mono text-xs font-bold active:scale-95 transition-all cursor-pointer border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-center shrink-0"
              onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 200).toFixed(0))}
              type="button"
            >
              +$200
            </button>
            <button
              className="h-9 px-4 rounded-full bg-white dark:bg-surface-container hover:bg-slate-50 dark:hover:bg-surface-bright text-slate-800 dark:text-on-surface font-financial-mono text-xs active:scale-95 transition-all font-bold cursor-pointer border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-center shrink-0"
              onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 500).toFixed(0))}
              type="button"
            >
              +$500
            </button>
          </div>
        </div>

        {/* Animated Swap / Ticker Node */}
        <div className="relative z-10 flex items-center justify-center -my-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1F2133] shadow-md border border-slate-200/80 dark:border-primary/30 max-w-[95%]">
            <span className="material-symbols-outlined text-emerald-600 dark:text-primary text-[15px] shrink-0">swap_vert</span>
            <span className="font-financial-mono text-xs text-slate-800 dark:text-on-surface whitespace-nowrap">
              1 USD = <span className="text-emerald-600 dark:text-primary font-bold">{USD_TO_MXN_RATE.toFixed(2)} MXN</span>
            </span>
            <span className="text-slate-400 dark:text-on-surface-variant font-caption-sm">•</span>
            <span className="font-label-caps text-[10px] text-emerald-600 dark:text-primary font-black uppercase tracking-wider text-center">
              {isEn ? '$0 Fee on First Transfer' : 'Sin Comisión en tu Primer Envío'}
            </span>
          </div>
        </div>

        {/* Receiver Gets Card */}
        <div className="rounded-2xl bg-white dark:bg-surface-container p-4 shadow-sm flex flex-col space-y-3 border border-slate-200/80 dark:border-white/5">
          <div className="flex items-center justify-between">
            <span className="font-caption-sm text-xs uppercase text-slate-500 dark:text-on-surface-variant font-semibold">
              {isEn ? 'Receiver Gets (Guaranteed)' : 'El destinatario recibe (Garantizado)'}
            </span>
            <span className="font-caption-sm text-xs text-slate-500 dark:text-on-surface-variant font-medium">
              {isEn ? 'Instant pickup' : 'Disponibilidad inmediata'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0 flex-1 h-14 px-4.5 rounded-full bg-slate-50 dark:bg-surface-container-high border border-slate-200/90 dark:border-white/10 shadow-xs overflow-hidden">
              <span className="font-financial-mono text-2xl sm:text-3xl text-emerald-600 dark:text-primary font-black select-none shrink-0">$</span>
              <span className="font-financial-mono text-2xl sm:text-3xl text-slate-900 dark:text-white font-black tracking-tight truncate">
                {((parseFloat(amountValue) || 0) * USD_TO_MXN_RATE).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="h-14 px-4.5 rounded-full bg-white dark:bg-surface-container border border-slate-200/90 dark:border-white/10 shadow-sm flex items-center gap-2 shrink-0 select-none">
              <span className="text-xl">🇲🇽</span>
              <span className="font-title-base text-xs sm:text-sm text-slate-900 dark:text-white font-black tracking-wide">MXN</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="material-symbols-outlined text-emerald-600 dark:text-primary text-[14px]">verified</span>
            <span className="font-caption-sm text-[11px] text-slate-500 dark:text-on-surface-variant">
              {isEn
                ? 'Zero hidden FX spread • Complete amount delivered'
                : 'Sin comisiones ocultas • Monto completo entregado'}
            </span>
          </div>
        </div>

        {/* 2026 LIVE ETA & TRANSPARENCY CARD */}
        <div className="flex flex-col space-y-2 pt-0.5">
          {/* Dynamic Live Delivery ETA Badge */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-xs">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
              <span>{isEn ? 'Estimated Delivery:' : 'Entrega Estimada:'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>
                {deliveryMethod === 'bank'
                  ? (isEn ? 'Instant via SPEI (< 2s)' : 'Instantáneo vía SPEI (< 2s)')
                  : deliveryMethod === 'cash'
                  ? (isEn ? 'Today in store (24/7)' : 'Hoy en sucursal (24/7)')
                  : (isEn ? 'Instant P2P Transfer' : 'Instantáneo P2P')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DELIVERY METHOD SELECTOR */}
      <div className="flex flex-col space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="font-title-base text-xs text-on-surface font-bold">
            {isEn ? 'How will your receiver get it?' : '¿Cómo recibirá el dinero tu destinatario?'}
          </span>
          <span className="font-caption-sm text-xs text-primary font-bold">
            {isEn ? 'Free' : 'Gratis'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-xs">
          {/* Opción 1: Retiro en Efectivo */}
          <button
            type="button"
            onClick={() => {
              setDeliveryMethod('cash');
              setIsCashPickupSheetOpen(true);
            }}
            className={`h-[70px] px-1.5 rounded-xl transition-all duration-150 ease-out flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.96] border ${
              deliveryMethod === 'cash'
                ? 'bg-primary/15 text-primary border-primary ring-1 ring-primary/40 shadow-sm shadow-primary/20 font-black'
                : 'bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-transparent font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] mb-1 leading-none">payments</span>
            <div className="text-[11px] leading-[1.15] flex flex-col items-center justify-center">
              <span>{isEn ? 'Cash' : 'Retiro en'}</span>
              <span>{isEn ? 'Pickup' : 'Efectivo'}</span>
            </div>
          </button>

          {/* Opción 2: Cuenta Bancaria (SPEI) */}
          <button
            type="button"
            onClick={() => setDeliveryMethod('bank')}
            className={`h-[70px] px-1.5 rounded-xl transition-all duration-150 ease-out flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.96] border ${
              deliveryMethod === 'bank'
                ? 'bg-primary/15 text-primary border-primary ring-1 ring-primary/40 shadow-sm shadow-primary/20 font-black'
                : 'bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-transparent font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] mb-1 leading-none">account_balance</span>
            <div className="text-[11px] leading-[1.15] flex flex-col items-center justify-center">
              <span>{isEn ? 'Bank Account' : 'Cuenta Banco'}</span>
              <span>{isEn ? '(SPEI 24/7)' : '(SPEI 24/7)'}</span>
            </div>
          </button>

          {/* Opción 3: Billetera Móvil */}
          <button
            type="button"
            onClick={() => setDeliveryMethod('wallet')}
            className={`h-[70px] px-1.5 rounded-xl transition-all duration-150 ease-out flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.96] border ${
              deliveryMethod === 'wallet'
                ? 'bg-primary/15 text-primary border-primary ring-1 ring-primary/40 shadow-sm shadow-primary/20 font-black'
                : 'bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-transparent font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] mb-1 leading-none">smartphone</span>
            <div className="text-[11px] leading-[1.15] flex flex-col items-center justify-center">
              <span>{isEn ? 'Mobile' : 'Billetera'}</span>
              <span>{isEn ? 'Wallet' : 'Móvil'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* TARJETA RESUMEN DE RETIRO EN EFECTIVO CON DISPARADOR A LA HOJA EMERGENTE */}
      {deliveryMethod === 'cash' && (
        <div className="flex flex-col space-y-3 pt-1 animate-fade-in">
          <div
            onClick={() => setIsCashPickupSheetOpen(true)}
            className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-all cursor-pointer shadow-md active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                  {(() => {
                    const LogoComp = selectedStoreObj.Logo;
                    return <LogoComp className="w-full h-full object-contain" />;
                  })()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-title-base text-xs font-bold text-on-surface truncate">
                      {selectedStoreObj.name} • {currentStateObj.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-bold shrink-0">
                      ✓ Seleccionado
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                    {currentStateObj.totalLocations} de cobro en {currentStateObj.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCashPickupSheetOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 text-xs font-bold shrink-0 ml-2 cursor-pointer transition-colors border border-primary/30 flex items-center gap-1 active:scale-95"
              >
                <span>{isEn ? 'Change' : 'Cambiar'}</span>
                <span className="material-symbols-outlined text-[14px]">expand_less</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASH PICKUP BENEFICIARY SELECTION (WESTERN UNION STYLE) */}
      {deliveryMethod === 'cash' && (
        <div className="flex flex-col space-y-3 pt-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-title-base text-xs text-on-surface font-bold">
              {isEn ? 'Recipient in Mexico' : 'Persona que Retira en México'}
            </span>
            <span className="font-caption-sm text-[11px] text-primary font-bold">
              {isEn ? 'Official ID Required' : 'INE / Pasaporte Requerido'}
            </span>
          </div>

          {/* Conmutador de Receptor estilo Western Union: 3. Destinatario Frecuente vs 4. + Nuevo Destinatario */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            <button
              type="button"
              onClick={() => {
                handleSetReceiverMode('existing');
                onSelectAvatarClick();
              }}
              className={`h-11 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                currentReceiverMode === 'existing'
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary/50'
                  : 'bg-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">contacts</span>
              <span>{isEn ? 'Existing Receiver' : 'Destinatario Frecuente'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetReceiverMode('new')}
              className={`h-11 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                currentReceiverMode === 'new'
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary/50'
                  : 'bg-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>{isEn ? 'New Receiver' : '+ Nuevo Destinatario'}</span>
            </button>
          </div>

          {/* Banner de feedback al guardar nuevo destinatario */}
          {formSuccessFeedback && (
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/40 text-primary text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
              <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
              <span className="truncate">{formSuccessFeedback}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: DESTINATARIO FRECUENTE (TARJETA LIMPIA DEL CONTACTO SELECCIONADO)   */}
          {/* ========================================================================= */}
          {currentReceiverMode === 'existing' && (
            <div className="space-y-3 animate-fade-in">
              {/* Tarjeta del Destinatario Seleccionado Actualmente */}
              {selectedAvatar ? (
                <div className="p-3.5 rounded-2xl bg-primary/10 border-2 border-primary ring-2 ring-primary/40 shadow-[0_0_20px_rgba(46,213,164,0.35)] transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ContactAvatar
                        photoUrl={selectedAvatar.photoUrl}
                        name={selectedAvatar.name}
                        className="w-11 h-11 rounded-xl ring-2 ring-primary/40"
                        iconSize="text-[22px]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-title-base text-xs font-bold text-white truncate">
                            {selectedAvatar.fullName || selectedAvatar.name}
                          </p>
                          <span className="px-1.5 py-0.2 rounded-full bg-primary/25 text-primary text-[9px] font-bold shrink-0">
                            Elegido
                          </span>
                        </div>
                        <p className="font-financial-mono text-[11px] text-slate-300 truncate">
                          {selectedAvatar.phone ? selectedAvatar.phone : 'Tel: +52 (Sin registrar)'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Check verde sin círculo */}
                      <span className="text-primary text-[20px] font-black leading-none select-none drop-shadow-xs">
                        ✓
                      </span>
                      <button
                        type="button"
                        onClick={onSelectAvatarClick}
                        className="px-2 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-[11px] font-bold text-primary border border-white/10 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                        title={isEn ? 'Change Recipient' : 'Cambiar Destinatario'}
                      >
                        <span>{isEn ? 'Change' : 'Cambiar'}</span>
                        <span className="material-symbols-outlined text-[14px]">
                          chevron_right
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearSendDraft();
                        }}
                        className="px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[11px] font-bold text-red-400 border border-red-500/25 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                        title={isEn ? 'Remove Recipient' : 'Quitar / Eliminar Destinatario'}
                        id="btn-remove-recipient-cash"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        <span>{isEn ? 'Remove' : 'Quitar'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[14px] text-primary">pin_drop</span>
                      <span>
                        {(selectedAvatar as any).city || currentStateObj.cities[0] || 'Morelia'}, {selectedAvatar.state || currentStateObj.name}
                      </span>
                    </span>
                    <span className="text-[10px] text-primary font-bold shrink-0">
                      {selectedStoreObj.name}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: NUEVO DESTINATARIO (FORMULARIO ESTILO WESTERN UNION CON CAMPOS)     */}
          {/* ========================================================================= */}
          {currentReceiverMode === 'new' && (
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3.5 animate-fade-in shadow-md">
              <div className="pb-1 border-b border-white/10">
                <h4 className="font-title-base text-xs font-bold text-white">
                  {isEn ? 'New Cash Pickup Receiver' : 'Datos del Nuevo Destinatario'}
                </h4>
                <p className="font-caption-sm text-[11px] text-on-surface-variant">
                  {isEn
                    ? 'Enter recipient details matching their official Mexican ID (INE/Passport)'
                    : 'Ingresa los datos exactamente como aparecen en su identificación oficial (INE o Pasaporte).'}
                </p>
              </div>

              {/* BOTÓN: ACCEDER A LISTA DE CONTACTOS DE WHATSAPP */}
              <button
                type="button"
                onClick={() => handleTriggerContactImport('cash')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-xs group"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                <span>{isEn ? '💬 Access WhatsApp Contacts List' : '💬 Acceder a Lista de Contactos (WhatsApp)'}</span>
              </button>

              {/* 1. NOMBRE(S) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                  <span>{isEn ? 'Given Name(s)' : 'Nombre(s)'}</span>
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={(e) => {
                    setFormNombre(e.target.value);
                    if (formErrors.nombre) {
                      setFormErrors((prev) => ({ ...prev, nombre: '' }));
                    }
                  }}
                  placeholder={isEn ? 'e.g. Juan Carlos' : 'Ej. Juan Carlos'}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                />
                {formErrors.nombre && (
                  <p className="text-[10px] text-red-400 font-semibold">{formErrors.nombre}</p>
                )}
              </div>

              {/* 2 & 3: APELLIDOS (APELLIDO 1 & APELLIDO 2) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                    <span>{isEn ? 'First Surname' : 'Primer Apellido'}</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formApellido1}
                    onChange={(e) => {
                      setFormApellido1(e.target.value);
                      if (formErrors.apellido1) {
                        setFormErrors((prev) => ({ ...prev, apellido1: '' }));
                      }
                    }}
                    placeholder={isEn ? 'e.g. Garcia' : 'Ej. García'}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  />
                  {formErrors.apellido1 && (
                    <p className="text-[10px] text-red-400 font-semibold">{formErrors.apellido1}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                    <span>{isEn ? 'Second Surname' : 'Segundo Apellido'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={formApellido2}
                    onChange={(e) => setFormApellido2(e.target.value)}
                    placeholder={isEn ? 'e.g. Lopez' : 'Ej. López'}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  />
                </div>
              </div>

              {/* 4. CASH PICKUP STATE (CAMPO OBLIGATORIO: ABRE PÁGINA/MODAL CON 32 ESTADOS Y BUSCADOR) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>{isEn ? 'Cash Pickup State' : 'Estado de Retiro (Cash Pickup State)'}</span>
                    <span className="text-red-400">*</span>
                  </span>
                  <span className="text-[10px] text-primary font-semibold">32 Estados + CDMX</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setFormStateModalSearch('');
                    setIsFormStateModalOpen(true);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer active:scale-[0.99] ${
                    formState
                      ? 'bg-primary/10 border-primary/50 text-white'
                      : 'bg-surface-container-high border-outline-variant/30 text-slate-400 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="material-symbols-outlined text-[19px] text-primary shrink-0">public</span>
                    <span className={`text-xs truncate ${formState ? 'font-bold text-white' : 'text-slate-400'}`}>
                      {formState ? formState : (isEn ? 'Tap to select State (32 states available)...' : 'Toca para seleccionar Estado de México...')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-primary font-bold">
                      {formState ? 'Cambiar' : 'Buscar'}
                    </span>
                    <span className="material-symbols-outlined text-[17px] text-primary">chevron_right</span>
                  </div>
                </button>
                {formErrors.state && (
                  <p className="text-[10px] text-red-400 font-semibold">{formErrors.state}</p>
                )}
              </div>

              {/* 5. CASH PICKUP CITY (BLOQUEADO HASTA QUE SE LLENE EL ESTADO ARRIBA) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>{isEn ? 'Cash Pickup City' : 'Ciudad de Retiro (Cash Pickup City)'}</span>
                    <span className="text-red-400">*</span>
                  </span>
                  {formState ? (
                    <span className="text-[10px] text-primary font-semibold">
                      {availableFormCities.length} ciudades en {formState}
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400/90 font-semibold">🔒 Requiere Estado</span>
                  )}
                </label>

                {!formState ? (
                  // ESTADO DESACTIVADO / BLOQUEADO
                  <div
                    onClick={() => {
                      setFormErrors((prev) => ({
                        ...prev,
                        state: 'Selecciona primero el Estado de retiro arriba para activar las ciudades',
                      }));
                    }}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low/70 border border-dashed border-white/10 opacity-60 cursor-not-allowed flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <span className="material-symbols-outlined text-[18px] text-amber-400">lock</span>
                      <span className="text-[11px]">
                        🔒 Primero selecciona un Estado arriba para activar las ciudades
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-500">lock</span>
                  </div>
                ) : (
                  // ESTADO ACTIVO / DESBLOQUEADO
                  <button
                    type="button"
                    onClick={() => {
                      setFormCityModalSearch('');
                      setIsFormCityModalOpen(true);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer active:scale-[0.99] ${
                      formCity
                        ? 'bg-primary/10 border-primary/50 text-white'
                        : 'bg-surface-container-high border-outline-variant/30 text-slate-400 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-[19px] text-primary shrink-0">pin_drop</span>
                      <span className={`text-xs truncate ${formCity ? 'font-bold text-white' : 'text-slate-400'}`}>
                        {formCity ? formCity : (isEn ? `Select city in ${formState}...` : `Selecciona ciudad o municipio en ${formState}...`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-primary font-bold">
                        {formCity ? 'Cambiar' : 'Seleccionar'}
                      </span>
                      <span className="material-symbols-outlined text-[17px] text-primary">chevron_right</span>
                    </div>
                  </button>
                )}
                {formErrors.city && (
                  <p className="text-[10px] text-red-400 font-semibold">{formErrors.city}</p>
                )}
              </div>

              {/* 6. NÚMERO TELEFÓNICO CON PREFIJO FIJO +52 (MÉXICO) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>{isEn ? 'Mobile Phone' : 'Número Telefónico del Destinatario'}</span>
                    <span className="text-red-400">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Notificación SMS de cobro</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center gap-1.5 shrink-0 select-none shadow-xs">
                    <span className="text-xs">🇲🇽</span>
                    <span className="text-xs font-black text-primary font-mono">+52</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={14}
                    value={formPhone}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                      let formatted = raw;
                      if (raw.length > 6) {
                        formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
                      } else if (raw.length > 3) {
                        formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
                      }
                      setFormPhone(formatted);
                      if (formErrors.phone) {
                        setFormErrors((prev) => ({ ...prev, phone: '' }));
                      }
                    }}
                    placeholder="10 dígitos (ej. 443 123 4567)"
                    className="flex-1 h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-[10px] text-red-400 font-semibold">{formErrors.phone}</p>
                )}
              </div>

              {/* BOTÓN PARA GUARDAR DESTINATARIO Y CONTINUAR */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveNewRecipient}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-container to-[#18A57E] text-slate-950 font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer font-headline-md tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px]">person_check</span>
                  <span>{isEn ? 'Save Recipient and Continue' : 'Guardar Destinatario y Continuar'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CUENTA BANCARIA (SPEI 24/7 EN MÉXICO - BANXICO)                          */}
      {/* ========================================================================= */}
      {deliveryMethod === 'bank' && (
        <div className="flex flex-col space-y-3 pt-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-title-base text-xs text-on-surface font-bold">
              {isEn ? 'Bank Account Beneficiary (SPEI)' : 'Beneficiario Cuenta Bancaria SPEI'}
            </span>
            <span className="font-caption-sm text-[11px] text-primary font-bold">
              {isEn ? '24/7 Instant • Banxico' : 'Inmediato 24/7 • Banxico'}
            </span>
          </div>

          {/* Selector de modo: Destinatario Frecuente vs + Nueva Cuenta */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            <button
              type="button"
              onClick={() => {
                handleSetBankReceiverMode('existing');
                onSelectAvatarClick();
              }}
              className={`h-11 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                bankReceiverMode === 'existing'
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary/50'
                  : 'bg-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">contacts</span>
              <span>{isEn ? 'Existing Receiver' : 'Destinatario Frecuente'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetBankReceiverMode('new')}
              className={`h-11 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                bankReceiverMode === 'new'
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary/50'
                  : 'bg-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">add_card</span>
              <span>{isEn ? '+ New Bank Account' : '+ Nueva Cuenta'}</span>
            </button>
          </div>

          {/* Banner de feedback al registrar exitosamente */}
          {bankSuccessFeedback && (
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/40 text-primary text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
              <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
              <span className="truncate">{bankSuccessFeedback}</span>
            </div>
          )}

          {/* MODO 1: CUENTA FRECUENTE / SELECCIONADA */}
          {bankReceiverMode === 'existing' && (
            <div className="space-y-3 animate-fade-in">
              {selectedAvatar ? (
                <div className="p-3.5 rounded-2xl bg-primary/10 border-2 border-primary ring-2 ring-primary/40 shadow-[0_0_20px_rgba(46,213,164,0.35)] transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Logo oficial del banco */}
                      <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm overflow-hidden shrink-0 border border-slate-200">
                        {getBankLogoUrl(selectedAvatar.bank) ? (
                          <img
                            src={getBankLogoUrl(selectedAvatar.bank)!}
                            alt={selectedAvatar.bank || 'Banco'}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#004481] rounded-lg flex items-center justify-center">
                            <span className="font-financial-mono text-xs font-black text-white">
                              {(selectedAvatar.bank || 'SPEI').slice(0, 4).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-title-base text-xs font-bold text-white truncate">
                            {selectedAvatar.fullName || selectedAvatar.name}
                          </p>
                          <span className="px-1.5 py-0.2 rounded-full bg-primary/25 text-primary text-[9px] font-bold shrink-0">
                            Elegido
                          </span>
                        </div>
                        <p className="font-financial-mono text-[11px] text-slate-300 truncate">
                          {selectedAvatar.clabe
                            ? `CLABE: ${formatearCLABE(selectedAvatar.clabe)}`
                            : (selectedAvatar.phone ? selectedAvatar.phone : 'Cuenta SPEI')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-primary text-[20px] font-black leading-none select-none drop-shadow-xs">
                        ✓
                      </span>
                      <button
                        type="button"
                        onClick={onSelectAvatarClick}
                        className="px-2 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-[11px] font-bold text-primary border border-white/10 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                        title={isEn ? 'Change Recipient' : 'Cambiar Destinatario'}
                      >
                        <span>{isEn ? 'Change' : 'Cambiar'}</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearSendDraft();
                        }}
                        className="px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[11px] font-bold text-red-400 border border-red-500/25 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                        title={isEn ? 'Remove Recipient' : 'Quitar / Eliminar Destinatario'}
                        id="btn-remove-recipient-bank"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        <span>{isEn ? 'Remove' : 'Quitar'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="material-symbols-outlined text-[15px] text-primary">account_balance</span>
                      <span className="font-bold text-white">
                        {selectedAvatar.bank || 'Banco SPEI México'}
                      </span>
                    </span>
                    <span className="text-[10px] text-primary font-bold shrink-0">
                      SPEI Inmediato 24/7
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* MODO 2: NUEVA CUENTA BANCARIA (FORMULARIO SPEI OFICIAL) */}
          {bankReceiverMode === 'new' && (
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3.5 animate-fade-in shadow-md">
              <div className="pb-1 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="font-title-base text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[17px]">account_balance</span>
                    <span>{isEn ? 'New SPEI Bank Account' : 'Datos de la Cuenta Bancaria (SPEI)'}</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                    Banxico Oficial
                  </span>
                </div>
                <p className="font-caption-sm text-[11px] text-on-surface-variant mt-0.5">
                  {isEn
                    ? 'Transfer directly to any Mexican bank account in seconds.'
                    : 'Transferencia directa a cualquier cuenta bancaria en México. Acreditación en segundos.'}
                </p>
              </div>

              {/* BOTÓN: ACCEDER A LISTA DE CONTACTOS DE WHATSAPP */}
              <button
                type="button"
                onClick={() => handleTriggerContactImport('bank')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-xs group"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                <span>{isEn ? '💬 Access WhatsApp Contacts List' : '💬 Acceder a Lista de Contactos (WhatsApp)'}</span>
              </button>

              {/* 1. CLABE INTERBANCARIA DE 18 DÍGITOS CON DETECCIÓN EN VIVO */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                    <span>{isEn ? '18-digit CLABE Interbancaria' : 'CLABE Interbancaria (18 dígitos)'}</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-slate-400">
                    {bankClabe.replace(/\D/g, '').length}/18 dígitos
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={22}
                    value={bankClabe}
                    onChange={(e) => {
                      const formatted = formatearCLABE(e.target.value);
                      setBankClabe(formatted);
                      if (bankErrors.clabe) {
                        setBankErrors((prev) => ({ ...prev, clabe: '' }));
                      }
                    }}
                    placeholder="012 180 0156 7890 1234"
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 font-mono tracking-wider focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-semibold"
                  />
                  {bankClabe.replace(/\D/g, '').length === 18 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {bankClabeValidation?.valida ? (
                        <span className="text-primary text-[20px] font-black leading-none drop-shadow-xs">✓</span>
                      ) : (
                        <span className="text-red-400 material-symbols-outlined text-[18px]">error</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Badge reactivo de banco detectado automáticamente */}
                {detectedBank && (
                  <div className="p-2 rounded-xl bg-surface-container-high/80 border border-primary/30 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                        {detectedBank.logoUrl ? (
                          <img src={detectedBank.logoUrl} alt={detectedBank.shortName} className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-financial-mono text-[9px] font-black text-[#004481]">
                            {detectedBank.shortName.slice(0, 3)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-white font-bold text-[11px] block truncate">
                          {detectedBank.name}
                        </span>
                        <span className="text-[10px] text-primary font-medium block">
                          Código Banxico: {detectedBank.code} • SPEI Habilitado
                        </span>
                      </div>
                    </div>
                    {bankClabeValidation?.valida && (
                      <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black shrink-0">
                        Válida ✓
                      </span>
                    )}
                  </div>
                )}

                {bankErrors.clabe && (
                  <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">warning</span>
                    <span>{bankErrors.clabe}</span>
                  </p>
                )}
              </div>

              {/* 2. NOMBRE(S) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                  <span>{isEn ? 'Account Holder Given Name(s)' : 'Nombre(s) del Titular'}</span>
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={bankNombre}
                  onChange={(e) => {
                    setBankNombre(e.target.value);
                    if (bankErrors.nombre) {
                      setBankErrors((prev) => ({ ...prev, nombre: '' }));
                    }
                  }}
                  placeholder={isEn ? 'e.g. Sofia Mariana' : 'Ej. Sofía Mariana'}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                />
                {bankErrors.nombre && (
                  <p className="text-[10px] text-red-400 font-semibold">{bankErrors.nombre}</p>
                )}
              </div>

              {/* 3 & 4: PRIMER APELLIDO Y SEGUNDO APELLIDO */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                    <span>{isEn ? 'First Surname' : 'Primer Apellido'}</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={bankApellido1}
                    onChange={(e) => {
                      setBankApellido1(e.target.value);
                      if (bankErrors.apellido1) {
                        setBankErrors((prev) => ({ ...prev, apellido1: '' }));
                      }
                    }}
                    placeholder={isEn ? 'e.g. Hernandez' : 'Ej. Hernández'}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  />
                  {bankErrors.apellido1 && (
                    <p className="text-[10px] text-red-400 font-semibold">{bankErrors.apellido1}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                    <span>{isEn ? 'Second Surname' : 'Segundo Apellido'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={bankApellido2}
                    onChange={(e) => setBankApellido2(e.target.value)}
                    placeholder={isEn ? 'e.g. Castro' : 'Ej. Castro'}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  />
                </div>
              </div>

              {/* 5. TELÉFONO CELULAR DEL BENEFICIARIO (+52) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>{isEn ? 'Beneficiary Mobile Phone' : 'Teléfono Celular del Beneficiario'}</span>
                    <span className="text-red-400">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Comprobante CEP Banxico</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center gap-1.5 shrink-0 select-none shadow-xs">
                    <span className="text-xs">🇲🇽</span>
                    <span className="text-xs font-black text-primary font-mono">+52</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={14}
                    value={bankPhone}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                      let formatted = raw;
                      if (raw.length > 6) {
                        formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
                      } else if (raw.length > 3) {
                        formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
                      }
                      setBankPhone(formatted);
                      if (bankErrors.phone) {
                        setBankErrors((prev) => ({ ...prev, phone: '' }));
                      }
                    }}
                    placeholder="10 dígitos (ej. 55 1234 5678)"
                    className="flex-1 h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  />
                </div>
                {bankErrors.phone && (
                  <p className="text-[10px] text-red-400 font-semibold">{bankErrors.phone}</p>
                )}
              </div>

              {/* BOTÓN PARA GUARDAR CUENTA BANCARIA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveBankRecipient}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-container to-[#18A57E] text-slate-950 font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer font-headline-md tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                  <span>{isEn ? 'Save Bank Account and Continue' : 'Guardar Cuenta SPEI y Continuar'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* BILLETERA MÓVIL (KIN CASH & MERCADO PAGO MÉXICO)                         */}
      {/* ========================================================================= */}
      {deliveryMethod === 'wallet' && (
        <div className="flex flex-col space-y-3 pt-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-title-base text-xs text-on-surface font-bold">
              {isEn ? 'Mobile Wallet Destination' : 'Billetera Móvil de Destino'}
            </span>
            <span className="font-caption-sm text-[11px] text-primary font-bold">
              {isEn ? 'Zero Fee • Instant' : 'Sin Comisión • Inmediato'}
            </span>
          </div>

          {/* Selector de Proveedor: KIN Cash vs Mercado Pago */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWalletProvider('kin')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden active:scale-[0.98] ${
                walletProvider === 'kin'
                  ? 'bg-primary/10 border-primary shadow-[0_0_16px_rgba(46,213,164,0.3)] ring-1 ring-primary/40'
                  : 'bg-surface-container border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-primary text-[24px]">account_balance_wallet</span>
                {walletProvider === 'kin' && (
                  <span className="text-primary text-[16px] font-black">✓</span>
                )}
              </div>
              <p className="font-title-base text-xs font-bold text-white mt-1.5">KIN Cash</p>
              <p className="text-[10px] text-primary font-medium">
                {isEn ? 'Direct P2P • 0% Fee' : 'Transferencia P2P • 0% Comisión'}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setWalletProvider('mercadopago')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden active:scale-[0.98] ${
                walletProvider === 'mercadopago'
                  ? 'bg-[#009EE3]/15 border-[#009EE3] shadow-[0_0_16px_rgba(0,158,227,0.3)] ring-1 ring-[#009EE3]/40'
                  : 'bg-surface-container border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-lg bg-[#009EE3] flex items-center justify-center text-white text-[12px] font-black">
                  MP
                </div>
                {walletProvider === 'mercadopago' && (
                  <span className="text-[#009EE3] text-[16px] font-black">✓</span>
                )}
              </div>
              <p className="font-title-base text-xs font-bold text-white mt-1.5">Mercado Pago</p>
              <p className="text-[10px] text-sky-400 font-medium">
                {isEn ? '12M+ Accounts in Mexico' : 'Red #1 en México • 12M+ cuentas'}
              </p>
            </button>
          </div>

          {/* Selector de modo: Destinatario Frecuente vs + Nueva Billetera */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            <button
              type="button"
              onClick={() => {
                handleSetWalletReceiverMode('existing');
                onSelectAvatarClick();
              }}
              className={`h-11 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                walletReceiverMode === 'existing'
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary/50'
                  : 'bg-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">contacts</span>
              <span>{isEn ? 'Existing Receiver' : 'Destinatario Frecuente'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetWalletReceiverMode('new')}
              className={`h-11 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                walletReceiverMode === 'new'
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary/50'
                  : 'bg-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>{isEn ? '+ New Wallet' : '+ Nueva Billetera'}</span>
            </button>
          </div>

          {/* Banner de feedback al registrar exitosamente */}
          {walletSuccessFeedback && (
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/40 text-primary text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
              <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
              <span className="truncate">{walletSuccessFeedback}</span>
            </div>
          )}

          {/* MODO 1: BILLETERA FRECUENTE / SELECCIONADA */}
          {walletReceiverMode === 'existing' && (
            <div className="space-y-3 animate-fade-in">
              {selectedAvatar ? (
                <div className="p-3.5 rounded-2xl bg-primary/10 border-2 border-primary ring-2 ring-primary/40 shadow-[0_0_20px_rgba(46,213,164,0.35)] transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-white/10 ${
                        selectedAvatar.bank?.toLowerCase().includes('mercado')
                          ? 'bg-[#009EE3] text-white'
                          : 'bg-[#18A57E] text-slate-950'
                      }`}>
                        {selectedAvatar.bank?.toLowerCase().includes('mercado') ? (
                          <span className="font-financial-mono text-sm font-black">MP</span>
                        ) : (
                          <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-title-base text-xs font-bold text-white truncate">
                            {selectedAvatar.fullName || selectedAvatar.name}
                          </p>
                          <span className="px-1.5 py-0.2 rounded-full bg-primary/25 text-primary text-[9px] font-bold shrink-0">
                            Elegido
                          </span>
                        </div>
                        <p className="font-financial-mono text-[11px] text-slate-300 truncate">
                          {selectedAvatar.walletId
                            ? selectedAvatar.walletId
                            : (selectedAvatar.phone || 'Billetera Móvil')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-primary text-[20px] font-black leading-none select-none drop-shadow-xs">
                        ✓
                      </span>
                      <button
                        type="button"
                        onClick={onSelectAvatarClick}
                        className="px-2 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-[11px] font-bold text-primary border border-white/10 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                        title={isEn ? 'Change Recipient' : 'Cambiar Destinatario'}
                      >
                        <span>{isEn ? 'Change' : 'Cambiar'}</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearSendDraft();
                        }}
                        className="px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[11px] font-bold text-red-400 border border-red-500/25 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                        title={isEn ? 'Remove Recipient' : 'Quitar / Eliminar Destinatario'}
                        id="btn-remove-recipient-wallet"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        <span>{isEn ? 'Remove' : 'Quitar'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="material-symbols-outlined text-[15px] text-primary">smartphone</span>
                      <span className="font-bold text-white">
                        {selectedAvatar.bank || (walletProvider === 'kin' ? 'KIN Cash' : 'Mercado Pago')}
                      </span>
                    </span>
                    <span className="text-[10px] text-primary font-bold shrink-0">
                      Sin Comisión • Inmediato
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* MODO 2: NUEVA BILLETERA MÓVIL (FORMULARIO FINTECH OFICIAL) */}
          {walletReceiverMode === 'new' && (
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3.5 animate-fade-in shadow-md">
              <div className="pb-1 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="font-title-base text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[17px]">
                      {walletProvider === 'kin' ? 'account_balance_wallet' : 'smartphone'}
                    </span>
                    <span>
                      {walletProvider === 'kin'
                        ? (isEn ? 'KIN Cash Wallet Beneficiary' : 'Datos de Billetera KIN Cash')
                        : (isEn ? 'Mercado Pago Mexico Beneficiary' : 'Datos de Cuenta Mercado Pago México')}
                    </span>
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    walletProvider === 'kin'
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-[#009EE3]/15 text-[#009EE3] border-[#009EE3]/30'
                  }`}>
                    {walletProvider === 'kin' ? '0% Comisión P2P' : 'Fintech Regulada'}
                  </span>
                </div>
                <p className="font-caption-sm text-[11px] text-on-surface-variant mt-0.5">
                  {walletProvider === 'kin'
                    ? (isEn
                        ? 'Instant transit between KIN accounts. Zero commission fees.'
                        : 'Transferencia directa entre cuentas KIN. Sin comisión y disponible al segundo.')
                    : (isEn
                        ? 'Deposits immediately into any Mexican Mercado Pago account.'
                        : 'Acreditación inmediata 24/7 en cualquier cuenta Mercado Pago México.')}
                </p>
              </div>

              {/* BOTÓN: ACCEDER A LISTA DE CONTACTOS DE WHATSAPP */}
              <button
                type="button"
                onClick={() => handleTriggerContactImport('wallet')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-xs group"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                <span>{isEn ? '💬 Access WhatsApp Contacts List' : '💬 Acceder a Lista de Contactos (WhatsApp)'}</span>
              </button>

              {/* 1. NOMBRE(S) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                  <span>{isEn ? 'Holder Given Name(s)' : 'Nombre(s) del Titular'}</span>
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={walletNombre}
                  onChange={(e) => {
                    setWalletNombre(e.target.value);
                    if (walletErrors.nombre) {
                      setWalletErrors((prev) => ({ ...prev, nombre: '' }));
                    }
                  }}
                  placeholder={isEn ? 'e.g. Daniel Alejandro' : 'Ej. Daniel Alejandro'}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                />
                {walletErrors.nombre && (
                  <p className="text-[10px] text-red-400 font-semibold">{walletErrors.nombre}</p>
                )}
              </div>

              {/* 2 & 3: PRIMER APELLIDO Y SEGUNDO APELLIDO */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                    <span>{isEn ? 'First Surname' : 'Primer Apellido'}</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={walletApellido1}
                    onChange={(e) => {
                      setWalletApellido1(e.target.value);
                      if (walletErrors.apellido1) {
                        setWalletErrors((prev) => ({ ...prev, apellido1: '' }));
                      }
                    }}
                    placeholder={isEn ? 'e.g. Morales' : 'Ej. Morales'}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  />
                  {walletErrors.apellido1 && (
                    <p className="text-[10px] text-red-400 font-semibold">{walletErrors.apellido1}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                    <span>{isEn ? 'Second Surname' : 'Segundo Apellido'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={walletApellido2}
                    onChange={(e) => setWalletApellido2(e.target.value)}
                    placeholder={isEn ? 'e.g. Vargas' : 'Ej. Vargas'}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  />
                </div>
              </div>

              {/* 4. IDENTIFICADOR DE BILLETERA SEGÚN PROVEEDOR */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>
                      {walletProvider === 'kin'
                        ? (isEn ? 'KIN Account Identifier' : 'Identificador KIN (Celular o @kinTag)')
                        : (isEn ? 'Mercado Pago Identifier' : 'Identificador Mercado Pago')}
                    </span>
                    <span className="text-red-400">*</span>
                  </span>
                  <span className="text-[10px] text-primary font-semibold">
                    {walletProvider === 'kin' ? 'Celular / @tag' : 'Celular, Correo o CLABE STP'}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={walletIdentifier}
                    onChange={(e) => {
                      setWalletIdentifier(e.target.value);
                      if (walletErrors.identifier) {
                        setWalletErrors((prev) => ({ ...prev, identifier: '' }));
                      }
                    }}
                    placeholder={
                      walletProvider === 'kin'
                        ? '10 dígitos (ej. 443 123 4567) o @usuario'
                        : '10 dígitos, correo@gmail.com o CLABE STP (646)'
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono font-medium"
                  />
                </div>
                {walletErrors.identifier && (
                  <p className="text-[10px] text-red-400 font-semibold">{walletErrors.identifier}</p>
                )}
                <p className="text-[10px] text-slate-400">
                  {walletProvider === 'kin'
                    ? 'Identificador único del receptor en la red KIN Cash.'
                    : 'Mercado Pago permite vincular mediante número celular mexicano a 10 dígitos, email registrado o CLABE STP (646).'}
                </p>
              </div>

              {/* 5. TELÉFONO DE CONFIRMACIÓN */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>{isEn ? 'Notification Phone' : 'Teléfono Celular de Notificación'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">(Opcional)</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center gap-1.5 shrink-0 select-none shadow-xs">
                    <span className="text-xs">🇲🇽</span>
                    <span className="text-xs font-black text-primary font-mono">+52</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={14}
                    value={walletPhone}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                      let formatted = raw;
                      if (raw.length > 6) {
                        formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
                      } else if (raw.length > 3) {
                        formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
                      }
                      setWalletPhone(formatted);
                    }}
                    placeholder="10 dígitos (ej. 443 123 4567)"
                    className="flex-1 h-10 px-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  />
                </div>
              </div>

              {/* BOTÓN PARA GUARDAR BILLETERA MÓVIL */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveWalletRecipient}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-container to-[#18A57E] text-slate-950 font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer font-headline-md tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px]">person_check</span>
                  <span>
                    {isEn
                      ? `Save ${walletProvider === 'kin' ? 'KIN Cash' : 'Mercado Pago'} and Continue`
                      : `Guardar ${walletProvider === 'kin' ? 'KIN Cash' : 'Mercado Pago'} y Continuar`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CUMPLIMIENTO REGULATORIO Y AVISOS LEGALES CFPB / BANXICO SPEI (ESTILO WESTERN UNION) */}
      <div className="pt-2">
        <LegalDisclaimersCard language={language} defaultExpanded={false} />
      </div>

      {/* WESTERN UNION-STYLE COMPACT FLOATING BOTTOM ACTION BAR & OPTIONAL DISCLOSURE */}
      {(() => {
        const currentBaseUSD = parseFloat(amountValue) || 50;
        const KIN_SEND_FEE = currentBaseUSD <= 250 ? 1.99 : 2.99;
        const currentTotalUSD = +(currentBaseUSD + KIN_SEND_FEE).toFixed(2);
        const currentMXNReceives = +(currentBaseUSD * USD_TO_MXN_RATE).toFixed(2);

        return (
          <>
            {/* BARRA FLOTANTE COMPACTA A PIE DE PÁGINA (ESTILO WESTERN UNION / APPLE) */}
            {isMounted && typeof document !== 'undefined' && createPortal(
              <div className="fixed bottom-[74px] left-1/2 -translate-x-1/2 w-full max-w-[412px] px-3.5 z-40 pointer-events-none">
                <div className="w-full bg-white/95 dark:bg-[#080B11]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/15 rounded-2xl shadow-[0_12px_36px_rgba(15,23,42,0.12)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.85)] px-4 py-2.5 flex items-center justify-between pointer-events-auto">
                  {/* Lado Izquierdo: Total a pagar con trigger informativo */}
                  <button
                    type="button"
                    onClick={() => setShowFeeBreakdownSheet(true)}
                    className="flex flex-col text-left group cursor-pointer active:scale-95 transition-transform"
                    title={isEn ? "View transparent fee breakdown" : "Ver desglose transparente de comisiones"}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-primary transition-colors">
                      <span>{isEn ? 'Total you pay :' : 'Total a pagar :'}</span>
                      <span className="material-symbols-outlined text-[15px] text-emerald-600 dark:text-primary">info</span>
                    </div>
                    <div className="font-financial-mono text-[19px] font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
                      <span>${currentTotalUSD.toFixed(2)}</span>
                      <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold">USD</span>
                    </div>
                  </button>

                  {/* Lado Derecho: Botón Continuar de alto contraste Estilo Píldora (Regla Don César) */}
                  <button
                    type="button"
                    onClick={handleStartSendReview}
                    className="h-12 px-7 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-primary dark:to-[#18A57E] text-white dark:text-neutral-950 font-headline-md text-sm font-bold shadow-[0_6px_20px_rgba(5,150,105,0.3)] dark:shadow-[0_6px_20px_rgba(46,213,164,0.35)] border border-emerald-400/40 dark:border-primary/40 flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{isEn ? 'Continue' : 'Continuar'}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>,
              document.body
            )}

            {/* MINI-MODAL / BOTTOM-SHEET: DESGLOSE TRANSPARENTE SI EL CLIENTE LO DESEA */}
            {isMounted && showFeeBreakdownSheet && typeof document !== 'undefined' && createPortal(
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowFeeBreakdownSheet(false)}
                  aria-hidden="true"
                />
                <div className="relative w-full max-w-[412px] bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 space-y-4 animate-slide-up">
                  {/* Encabezado */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                    <div>
                      <h3 className="font-title-base text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{isEn ? 'Send Cost Breakdown' : 'Desglose Transparente de Envío'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-primary/20 text-emerald-800 dark:text-primary text-[10px] font-bold">
                          {isEn ? 'Audited' : 'Oficial'}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">
                        {isEn ? 'Guaranteed transparent pricing with no hidden charges' : 'Precios justos garantizados sin cargos ocultos'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFeeBreakdownSheet(false)}
                      className="btn-circle"
                      title={isEn ? 'Close' : 'Cerrar'}
                    >
                      <ChevronLeftIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Filas del desglose */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-neutral-400">{isEn ? 'Base Amount Sent' : 'Monto Base a Enviar'}</span>
                      <span className="font-financial-mono font-bold text-slate-900 dark:text-white">${currentBaseUSD.toFixed(2)} USD</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                        <span>{isEn ? 'KIN Service & Delivery Fee' : 'Cargo por Envío KIN'}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-primary/20 text-emerald-800 dark:text-primary text-[9px] font-bold">
                          {isEn ? 'FEE' : 'TARIFA'}
                        </span>
                      </span>
                      <span className="font-financial-mono font-bold text-emerald-600 dark:text-primary">+${KIN_SEND_FEE.toFixed(2)} USD</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-neutral-400">{isEn ? 'Exchange Rate Guaranteed' : 'Tipo de Cambio Garantizado'}</span>
                      <span className="font-financial-mono font-semibold text-slate-800 dark:text-white">1 USD = {USD_TO_MXN_RATE.toFixed(2)} MXN</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-neutral-400">{isEn ? 'Delivered in Mexico' : 'Monto a Entregar en México'}</span>
                      <span className="font-financial-mono font-bold text-emerald-600 dark:text-primary">
                        ${currentMXNReceives.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-neutral-400">{isEn ? 'Estimated Delivery Time' : 'Tiempo Estimado de Entrega'}</span>
                      <span className="font-bold text-emerald-600 dark:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">bolt</span> {isEn ? 'Within 5 minutes' : 'En menos de 5 minutos'}
                      </span>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-slate-200/80 dark:border-white/10">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{isEn ? 'Total to Charge Card' : 'Total a Cobrar en Tarjeta'}</span>
                        <span className="text-[10px] text-slate-500 dark:text-neutral-400">{isEn ? 'Includes transparent KIN fee' : 'Incluye cargo de envío KIN'}</span>
                      </div>
                      <span className="font-financial-mono text-base font-bold text-emerald-600 dark:text-primary">${currentTotalUSD.toFixed(2)} USD</span>
                    </div>

                    {/* Nota regulatoria CFPB / SPEI */}
                    <div className="pt-1.5 pb-1 text-[10px] text-slate-500 dark:text-[#8E91A5] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[13px] text-emerald-600 dark:text-primary shrink-0">verified_user</span>
                      <span>
                        {isEn
                          ? 'CFPB Remittance Rule compliant. 30-min full refund cancellation guarantee.'
                          : 'Cumple Regla de Remesas CFPB. Garantía de cancelación y reembolso en 30 min.'}
                      </span>
                    </div>
                  </div>

                  {/* Botón para proceder */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowFeeBreakdownSheet(false);
                      handleStartSendReview();
                    }}
                    className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-[#18A57E] text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 hover:brightness-105 active:scale-98 transition-all cursor-pointer border border-primary/40 shadow-md"
                  >
                    <span>{isEn ? `Continue • $${currentTotalUSD.toFixed(2)} USD` : `Continuar • $${currentTotalUSD.toFixed(2)} USD`}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>,
              document.body
            )}
          </>
        );
      })()}

      {/* Spacer para holgura de scroll con la barra flotante */}
      <div className="h-28 w-full pointer-events-none" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* PANTALLA COMPLETA MÓVIL: RED DE TIENDAS Y BUSCADOR DE CIUDADES Y ESTADOS */}
      {/* ========================================================================= */}
      {isMounted && isCashPickupSheetOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[200] flex justify-center bg-black/90 sm:backdrop-blur-md animate-fade-in"
          onClick={() => setIsCashPickupSheetOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cash-pickup-mexico-title"
        >
          <div
            className="w-full max-w-[412px] h-[100dvh] bg-[#06070B] border-x border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera nativa de pantalla móvil */}
            <div className="px-4 pt-3 pb-2.5 border-b border-white/10 bg-[#06070B]/95 backdrop-blur-md shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCashPickupSheetOpen(false)}
                  className="btn-circle"
                  title={isEn ? 'Back' : 'Regresar'}
                >
                  <ChevronLeftIcon className="w-5 h-5 text-white" />
                </button>
                <div>
                  <h3
                    id="cash-pickup-mexico-title"
                    className="font-title-base text-sm font-bold text-white leading-tight"
                  >
                    {isEn ? 'Cash Pickup in Mexico' : 'Retiro en Efectivo en México'}
                  </h3>
                  <p className="font-caption-sm text-[11px] text-on-surface-variant leading-tight">
                    {isEn ? 'Choose city and pickup partner' : 'Selecciona tu ciudad y tienda de cobro'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCashPickupSheetOpen(false)}
                className="btn-circle"
                title={isEn ? 'Close' : 'Cerrar'}
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* 3. BARRA DE BÚSQUEDA EN LA CABECERA: "Busca tu Ciudad" */}
            <div className="px-4 py-2 shrink-0 bg-[#06070B]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[19px]">
                  search
                </span>
                <input
                  type="text"
                  value={stateSearchQuery}
                  onChange={(e) => setStateSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search your City...' : 'Busca tu Ciudad'}
                  className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-container-high border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                />
                {stateSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setStateSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* CONTENIDO PRINCIPAL SCROLLABLE */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 custom-scrollbar">
              {stateSearchQuery.trim().length >= 1 ? (
                /* RESULTADOS DE BÚSQUEDA (CIUDADES Y ESTADOS) */
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1 sticky top-0 bg-[#06070B] z-10">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {matchingStates.length} {isEn ? 'locations found with' : 'lugares encontrados con'} "{stateSearchQuery}":
                    </span>
                    <span className="text-[10px] text-primary">Toca uno para seleccionarlo</span>
                  </div>
                  {matchingStates.length > 0 ? (
                    matchingStates.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleSelectState(st)}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer active:scale-[0.98] ${
                          st.id === selectedStateId
                            ? 'bg-primary/15 border-primary text-white shadow-sm'
                            : 'bg-surface-container border-white/5 hover:border-primary/40 text-slate-200'
                        }`}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {getStateDisplayName(st)}
                            </span>
                            <span className="px-1.5 py-0.2 rounded-md bg-white/10 text-primary text-[10px] font-bold font-financial-mono">
                              {st.code}
                            </span>
                            {st.isPopularRemittance && (
                              <span className="text-[10px] text-amber-400 font-bold">★ Popular</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {st.totalLocations} • {st.cities.slice(0, 4).join(', ')}...
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          chevron_right
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 space-y-1">
                      <p className="text-xs font-semibold">
                        {isEn ? 'No locations match' : 'No se encontraron lugares con'} "{stateSearchQuery}"
                      </p>
                      <p className="text-[11px]">Prueba buscando por tu ciudad (ej. Morelia, Guadalajara, León) o estado</p>
                    </div>
                  )}
                </div>
              ) : (
                /* VISTA NORMAL: RECUADRO 2 ELIMINADO! */
                <div className="space-y-4">
                  {/* Chips horizontales de estados (Recuadro 2 eliminado) */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        {isEn ? 'States with Cash Pickup' : 'Estados con Retiro en Efectivo'}
                      </span>
                      <span className="text-[10px] text-primary font-medium">
                        {currentStateObj.name} activo
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                      {pinnedStates.map((stId) => {
                        const st = MEXICO_STATES.find((s) => s.id === stId);
                        if (!st) return null;
                        const isSelected = st.id === selectedStateId;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => handleSelectState(st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-primary/20 text-primary border-primary ring-1 ring-primary/40 shadow-xs'
                                : 'bg-surface-container text-slate-300 border-white/5 hover:border-white/20'
                            }`}
                          >
                            {isSelected && <span className="text-primary mr-1">✓</span>}
                            {st.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Red de tiendas y sucursales en ese estado */}
                  <div className="flex flex-col space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-title-base text-xs text-on-surface font-bold">
                          Red de Tiendas en {currentStateObj.name}
                        </span>
                        <span className="font-caption-sm text-[10px] text-on-surface-variant">
                          Sucursales autorizadas para entrega de efectivo
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-bold text-primary border border-white/10">
                        9 Cadenas + Red
                      </span>
                    </div>

                    {/* Cuadrícula de 9 Cadenas Comerciales (3x3) */}
                    <div className="grid grid-cols-3 gap-2">
                      {CASH_PICKUP_STORES.filter((s) => s.id !== 'any').map((store) => {
                        const isSelected = selectedStore === store.id;
                        const StoreLogo = store.Logo;
                        return (
                          <button
                            key={store.id}
                            type="button"
                            onClick={() => handleSelectStore(store.id)}
                            className={`network-btn relative h-14 rounded-xl bg-white text-slate-900 shadow-md p-1.5 flex flex-col items-center justify-between text-center transition-all cursor-pointer active:scale-[0.97] ${
                              isSelected
                                ? 'border-2 border-primary ring-2 ring-primary shadow-[0_0_20px_rgba(46,213,164,0.55)] scale-[1.02]'
                                : 'border border-transparent hover:bg-slate-50'
                            }`}
                          >
                            <div className="w-full h-7 flex items-center justify-center">
                              <StoreLogo className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[9px] font-bold text-slate-700 leading-tight truncate w-full">
                              {store.badge}
                            </span>
                            {isSelected && (
                              <span className="absolute top-1 right-1.5 text-primary text-[17px] font-black leading-none select-none drop-shadow-xs">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}

                      {/* Tarjeta de Red Completa Comercial (40,000+ Puntos) */}
                      <button
                        type="button"
                        onClick={() => handleSelectStore('any')}
                        className={`network-btn col-span-3 h-13 rounded-xl bg-white text-slate-900 shadow-sm px-3.5 flex items-center justify-between text-left transition-all cursor-pointer active:scale-[0.98] ${
                          selectedStore === 'any'
                            ? 'border-2 border-primary ring-2 ring-primary shadow-[0_0_20px_rgba(46,213,164,0.55)]'
                            : 'border border-transparent hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-primary-container text-[22px]">hub</span>
                          <div className="flex flex-col leading-tight">
                            <span className="font-title-base text-xs font-bold text-slate-900">
                              {isEn ? 'Any Authorized Retail Partner' : 'Cualquier Tienda Comercial de la Red'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {isEn ? 'Receiver picks up at 40,000+ retail locations in Mexico' : 'El familiar cobra en cualquiera de los 40,000+ comercios con su clave'}
                            </span>
                          </div>
                        </div>
                        {selectedStore === 'any' && (
                          <span className="text-primary text-[24px] font-black leading-none select-none drop-shadow-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÓN INFERIOR DE CONFIRMACIÓN */}
            <div className="p-4 border-t border-white/10 bg-[#06070B]/95 backdrop-blur-md shrink-0">
              <button
                type="button"
                onClick={() => setIsCashPickupSheetOpen(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-container to-[#18A57E] text-slate-950 font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer font-headline-md tracking-wide"
              >
                <span>
                  Confirmar Retiro en {selectedStoreObj.name} ({currentStateObj.name})
                </span>
                <span className="material-symbols-outlined text-[17px]">check_circle</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* PANTALLA COMPLETA MÓVIL: SELECTOR DE ESTADO DE RETIRO (32 ESTADOS + DF)    */}
      {/* ========================================================================= */}
      {isMounted && isFormStateModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[210] flex justify-center bg-black/90 sm:backdrop-blur-md animate-fade-in"
          onClick={() => setIsFormStateModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[412px] h-[100dvh] bg-[#06070B] border-x border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera nativa */}
            <div className="px-4 pt-3 pb-2.5 border-b border-white/10 bg-[#06070B]/95 backdrop-blur-md shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormStateModalOpen(false)}
                  className="btn-circle"
                  title={isEn ? 'Back' : 'Regresar'}
                >
                  <ChevronLeftIcon className="w-5 h-5 text-white" />
                </button>
                <div>
                  <h3 className="font-title-base text-sm font-bold text-white leading-tight">
                    {isEn ? 'Cash Pickup State' : 'Estado de Retiro en México'}
                  </h3>
                  <p className="font-caption-sm text-[11px] text-on-surface-variant leading-tight">
                    {isEn ? '32 Mexican States + Mexico City' : '32 estados de la República y CDMX'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormStateModalOpen(false)}
                className="btn-circle"
                title={isEn ? 'Close' : 'Cerrar'}
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Barra de búsqueda en la cabecera */}
            <div className="px-4 py-2 shrink-0 bg-[#06070B]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[19px]">
                  search
                </span>
                <input
                  type="text"
                  autoFocus
                  value={formStateModalSearch}
                  onChange={(e) => setFormStateModalSearch(e.target.value)}
                  placeholder={isEn ? 'Search state (e.g. Michoacan, Jalisco...)' : 'Buscar estado (ej. Michoacán, Jalisco, Puebla...)'}
                  className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-container-high border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                />
                {formStateModalSearch && (
                  <button
                    type="button"
                    onClick={() => setFormStateModalSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Lista scrollable de los 32 Estados + DF */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
              {filteredFormStates.map((st) => {
                const isSelected = formState.toLowerCase() === st.name.toLowerCase();
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelectFormState(st)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? 'bg-primary/20 border-primary ring-1 ring-primary/40 shadow-xs'
                        : 'bg-surface-container-high/60 border-white/5 hover:border-primary/30 hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded-lg bg-surface-container font-mono text-[10px] font-bold text-primary shrink-0 border border-white/5">
                        {st.code}
                      </span>
                      <div className="min-w-0">
                        <span className="font-title-base text-xs font-bold text-white block truncate">
                          {getStateDisplayName(st)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {st.cities.length} ciudades disponibles • {st.totalLocations}
                        </span>
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="text-primary text-[19px] font-black leading-none drop-shadow-xs">✓</span>
                    ) : (
                      <span className="material-symbols-outlined text-slate-500 text-[18px]">chevron_right</span>
                    )}
                  </button>
                );
              })}
              {filteredFormStates.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  No se encontraron estados con &ldquo;{formStateModalSearch}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* PANTALLA COMPLETA MÓVIL: SELECTOR DE CIUDAD DE RETIRO (CASH PICKUP CITY)  */}
      {/* ========================================================================= */}
      {isMounted && isFormCityModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[210] flex justify-center bg-black/90 sm:backdrop-blur-md animate-fade-in"
          onClick={() => setIsFormCityModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[412px] h-[100dvh] bg-[#06070B] border-x border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="px-4 pt-3 pb-2.5 border-b border-white/10 bg-[#06070B]/95 backdrop-blur-md shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsFormCityModalOpen(false)}
                  className="btn-circle shrink-0"
                  title={isEn ? 'Back' : 'Regresar'}
                >
                  <ChevronLeftIcon className="w-5 h-5 text-white" />
                </button>
                <div className="min-w-0">
                  <h3 className="font-title-base text-sm font-bold text-white leading-tight truncate">
                    {isEn ? `Cities in ${formState}` : `Ciudades en ${formState}`}
                  </h3>
                  <p className="font-caption-sm text-[11px] text-on-surface-variant leading-tight truncate">
                    {isEn ? 'Select municipality or city for cash pickup' : 'Selecciona el municipio o ciudad de retiro'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormCityModalOpen(false)}
                className="btn-circle shrink-0"
                title={isEn ? 'Close' : 'Cerrar'}
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Barra de búsqueda en la cabecera */}
            <div className="px-4 py-2 shrink-0 bg-[#06070B]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[19px]">
                  search
                </span>
                <input
                  type="text"
                  autoFocus
                  value={formCityModalSearch}
                  onChange={(e) => setFormCityModalSearch(e.target.value)}
                  placeholder={isEn ? `Search city in ${formState}...` : `Buscar ciudad o municipio en ${formState}...`}
                  className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-container-high border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                />
                {formCityModalSearch && (
                  <button
                    type="button"
                    onClick={() => setFormCityModalSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Lista scrollable de ciudades */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
              {filteredFormCities.map((cityName) => {
                const isSelected = formCity.toLowerCase() === cityName.toLowerCase();
                return (
                  <button
                    key={cityName}
                    type="button"
                    onClick={() => handleSelectFormCity(cityName)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? 'bg-primary/20 border-primary ring-1 ring-primary/40 shadow-xs'
                        : 'bg-surface-container-high/60 border-white/5 hover:border-primary/30 hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                        pin_drop
                      </span>
                      <span className="font-title-base text-xs font-bold text-white truncate">
                        {cityName}
                      </span>
                    </div>
                    {isSelected ? (
                      <span className="text-primary text-[19px] font-black leading-none drop-shadow-xs">✓</span>
                    ) : (
                      <span className="material-symbols-outlined text-slate-500 text-[18px]">chevron_right</span>
                    )}
                  </button>
                );
              })}
              {filteredFormCities.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  No se encontraron ciudades con &ldquo;{formCityModalSearch}&rdquo; en {formState}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PERMISO PARA ACCEDER A CONTACTOS DE WHATSAPP                     */}
      {/* ========================================================================= */}
      {isMounted && isWhatsAppPermissionPromptOpen && createPortal(
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsWhatsAppPermissionPromptOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[360px] rounded-3xl bg-[#111B21] border border-[#25D366]/40 p-5 shadow-2xl relative overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow verde sutil de WhatsApp */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#25D366]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col items-center text-center space-y-3.5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/50 flex items-center justify-center shadow-lg shadow-[#25D366]/20">
                <WhatsAppIcon className="w-8 h-8 text-[#25D366]" />
              </div>

              <div>
                <h3 className="font-title-base text-base font-bold text-white">
                  {isEn ? 'Access WhatsApp Contacts?' : '¿Acceder a Contactos de WhatsApp?'}
                </h3>
                <p className="font-caption-sm text-xs text-slate-300 mt-1 leading-relaxed">
                  {isEn
                    ? 'Allow KIN to access your WhatsApp contacts to autofill your beneficiary name and phone number with 1 tap.'
                    : 'Permite que KIN acceda a tus contactos de WhatsApp para autocompletar el nombre y teléfono de tus familiares en 1 solo toque.'}
                </p>
              </div>

              {/* Puntos clave de seguridad y confianza */}
              <div className="w-full p-3 rounded-xl bg-[#202C33] border border-white/5 space-y-2 text-left">
                <div className="flex items-center gap-2 text-[11px] text-slate-200">
                  <span className="material-symbols-outlined text-[#25D366] text-[16px] shrink-0">bolt</span>
                  <span>{isEn ? 'Instant autofill without manual typing' : 'Autocompletado instantáneo sin teclear'}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-200">
                  <span className="material-symbols-outlined text-[#25D366] text-[16px] shrink-0">lock</span>
                  <span>{isEn ? 'End-to-end encrypted • Zero spam' : 'Cifrado seguro • Jamás enviamos spam'}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-200">
                  <span className="material-symbols-outlined text-[#25D366] text-[16px] shrink-0">verified_user</span>
                  <span>{isEn ? 'You always retain total control' : 'Solo se usa cuando tú lo solicitas'}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="w-full pt-1 space-y-2">
                <button
                  type="button"
                  onClick={handleGrantWhatsAppPermission}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-slate-950 font-black text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-slate-950" />
                  <span>{isEn ? 'Allow Access & Open Contacts' : 'Permitir y Acceder a Contactos'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWhatsAppPermissionPromptOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  {isEn ? 'Not Now' : 'Ahora no'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: LIBRETA DE CONTACTOS DE WHATSAPP                                 */}
      {/* ========================================================================= */}
      {isMounted && isImportContactModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[210] flex justify-center bg-black/90 sm:backdrop-blur-md animate-fade-in"
          onClick={() => setIsImportContactModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[412px] h-[100dvh] bg-[#111B21] border-x border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header oficial estilo WhatsApp */}
            <div className="px-4 pt-3 pb-2.5 border-b border-white/10 bg-[#202C33] shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsImportContactModalOpen(false)}
                  className="btn-circle shrink-0"
                  title={isEn ? 'Back' : 'Regresar'}
                >
                  <ChevronLeftIcon className="w-5 h-5 text-white" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                    <h3 className="font-title-base text-sm font-bold text-white leading-tight truncate">
                      {isEn ? 'WhatsApp Contacts' : 'Contactos de WhatsApp'}
                    </h3>
                  </div>
                  <p className="font-caption-sm text-[11px] text-[#25D366] leading-tight truncate">
                    {filteredImportContacts.length} {isEn ? 'contacts available' : 'contactos disponibles'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportContactModalOpen(false)}
                className="btn-circle shrink-0"
                title={isEn ? 'Close' : 'Cerrar'}
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Caja de pegado rápido (opcional para usuarios que copian de un chat de WhatsApp) */}
            <div className="px-4 pt-3 pb-1 shrink-0 bg-[#111B21]">
              <div className="p-2.5 rounded-xl bg-[#202C33] border border-dashed border-[#25D366]/40 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#25D366] text-[18px] shrink-0">content_paste</span>
                <input
                  type="text"
                  value={importPastedText}
                  onChange={(e) => setImportPastedText(e.target.value)}
                  placeholder={isEn ? 'Paste contact or number (e.g. Maria 4431234567)...' : 'Pega texto o número copiado de WhatsApp...'}
                  className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none font-medium"
                />
                {importPastedText && (
                  <button
                    type="button"
                    onClick={handleApplyPastedContact}
                    className="px-2.5 py-1 rounded-lg bg-[#25D366] text-slate-950 text-[11px] font-bold shrink-0 cursor-pointer active:scale-95"
                  >
                    {isEn ? 'Fill' : 'Rellenar'}
                  </button>
                )}
              </div>
            </div>

            {/* Barra de búsqueda en la cabecera */}
            <div className="px-4 py-2 shrink-0 bg-[#111B21]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#25D366] text-[19px]">
                  search
                </span>
                <input
                  type="text"
                  value={importContactSearch}
                  onChange={(e) => setImportContactSearch(e.target.value)}
                  placeholder={isEn ? 'Search WhatsApp contact...' : 'Buscar contacto de WhatsApp...'}
                  className="w-full h-11 pl-11 pr-10 rounded-xl bg-[#202C33] border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all font-medium"
                />
                {importContactSearch && (
                  <button
                    type="button"
                    onClick={() => setImportContactSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Lista scrollable de contactos de WhatsApp */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 custom-scrollbar">
              {filteredImportContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    applyImportedContact(
                      importContactTarget,
                      contact.fullName || contact.name,
                      contact.phone || '',
                      contact.bank,
                      contact.clabe
                    );
                    setIsImportContactModalOpen(false);
                  }}
                  className="p-3 rounded-2xl bg-[#202C33]/70 hover:bg-[#202C33] border border-white/5 hover:border-[#25D366]/40 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <ContactAvatar
                        photoUrl={contact.photoUrl}
                        name={contact.name}
                        className="w-10 h-10 rounded-xl ring-1 ring-white/10"
                        iconSize="text-[20px]"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#25D366] border border-[#111B21] flex items-center justify-center shadow-xs">
                        <WhatsAppIcon className="w-2.5 h-2.5 text-slate-950" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-title-base text-xs font-bold text-white truncate">
                        {contact.fullName || contact.name}
                      </p>
                      <p className="font-financial-mono text-[11px] text-[#25D366] truncate">
                        {contact.phone || 'Sin número'}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-[#25D366]/20 text-[#25D366] text-[11px] font-bold shrink-0 group-hover:bg-[#25D366] group-hover:text-slate-950 transition-colors">
                    {isEn ? 'Autofill' : 'Autorrellenar'}
                  </span>
                </div>
              ))}

              {filteredImportContacts.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                  <span className="material-symbols-outlined text-[32px] text-slate-500 block mb-1">
                    search_off
                  </span>
                  <p>No se encontraron contactos con &ldquo;{importContactSearch}&rdquo;</p>
                  <p className="text-[11px] text-slate-500">Puedes escribir el nombre o pegar el teléfono arriba.</p>
                </div>
              )}
            </div>

            {/* Pie de modal con garantía de privacidad y puente nativo */}
            <div className="px-4 py-2.5 bg-[#111B21] border-t border-white/10 shrink-0 text-center">
              <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[14px] text-[#25D366]">verified_user</span>
                {isEn
                  ? 'En la App Móvil oficial de KIN (iOS / Android), se conecta directo a los contactos de tu teléfono.'
                  : 'En la App Móvil oficial de KIN (iOS / Android), se conecta directo a los contactos de tu teléfono.'}
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
