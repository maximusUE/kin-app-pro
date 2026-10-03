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
  BancoppelLogo,
  BancoAztecaLogo,
  BbvaBancomerLogo,
  BanorteLogo,
  BanamexLogo,
  SorianaLogo,
  FarmaciasGuadalajaraLogo,
  BansefiLogo,
  AnyAgentLogo,
} from '@/components/Icons';
import { ContactAvatar } from '@/components/ContactAvatar';
import { SelectedPickupLocation } from '@/components/modals/CashPickupLocationModal';
import { MEXICO_STATES, MexicoState } from '@/data/mexicoLocations';

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
    id: 'elektra',
    name: 'Elektra',
    subtitle: 'Tiendas Elektra en todo el país',
    badge: 'Inmediato',
    Logo: ElektraLogo,
  },
  {
    id: 'bancoppel',
    name: 'BanCoppel',
    subtitle: 'En tiendas Coppel y sucursales bancarias',
    badge: 'Horario extendido',
    Logo: BancoppelLogo,
  },
  {
    id: 'azteca',
    name: 'Banco Azteca',
    subtitle: 'Abierto los 365 días de 9am a 9pm',
    badge: '365 días',
    Logo: BancoAztecaLogo,
  },
  {
    id: 'bbva',
    name: 'BBVA México',
    subtitle: 'Cajeros y ventanillas BBVA en todo el país',
    badge: 'Líder SPEI',
    Logo: BbvaBancomerLogo,
  },
  {
    id: 'banorte',
    name: 'Banorte',
    subtitle: 'Red nacional de sucursales Banorte',
    badge: 'Cobertura',
    Logo: BanorteLogo,
  },
  {
    id: 'banamex',
    name: 'Citibanamex',
    subtitle: 'Sucursales Citi en todo México',
    badge: 'Red Tradicional',
    Logo: BanamexLogo,
  },
  {
    id: 'soriana',
    name: 'Soriana',
    subtitle: 'Hiper, Súper y City Club en México',
    badge: 'Cajas Soriana',
    Logo: SorianaLogo,
  },
  {
    id: 'any',
    name: 'Cualquier Sucursal / Agente Autorizado',
    subtitle: 'El familiar cobra en cualquier punto con su clave y documento',
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

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header: < | Send money | Historial */}
      <header className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onBack}
          className="btn-circle"
          title={isEn ? 'Back to home' : 'Volver al inicio'}
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>

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
          className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-xs font-bold text-[#8E91A5] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title={isEn ? 'View send history' : 'Ver historial de envíos'}
        >
          <DockAnalyticsIcon className="w-3.5 h-3.5" />
          <span>{isEn ? 'History' : 'Historial'}</span>
        </button>
      </header>

      {/* Corridor Routing & Lock Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container border border-white/10 p-3.5 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center -space-x-1.5 shrink-0">
              <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs shadow-sm">🇺🇸</span>
              <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs shadow-sm">🇲🇽</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-title-base text-xs text-white font-bold truncate">USA ➔ México</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] font-label-caps text-[9px] uppercase font-bold border border-[#2ED5A4]/30">SPEI</span>
              </div>
              <span className="font-caption-sm text-[10px] text-on-surface-variant">
                {isEn ? 'Instant Direct Remittance' : 'Envío Directo Inmediato SPEI'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest border border-white/10 shrink-0">
            <span className="material-symbols-outlined text-[#2ED5A4] text-[13px] animate-spin" style={{ animationDuration: '6s' }}>timer</span>
            <span className="font-financial-mono text-xs text-[#2ED5A4] font-bold">14:59</span>
          </div>
        </div>
      </div>

      {/* STITCH DUAL LIVE EXCHANGE CALCULATOR */}
      <div className="relative flex flex-col space-y-2">
        {/* You Send Card */}
        <div className="rounded-2xl bg-surface-container-high p-4 shadow-md flex flex-col space-y-3 border border-white/5">
          <div className="flex items-center justify-between">
            <label className="font-caption-sm text-xs uppercase text-on-surface-variant font-semibold" htmlFor="send-amount-input">
              {isEn ? 'You Send' : 'Tú Envías'}
            </label>
            <span className="font-caption-sm text-xs text-primary flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[13px]">check_circle</span> {isEn ? 'No markup rate' : 'Sin sobreprecio'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0 flex-1 relative">
              <span className="font-financial-mono text-3xl text-primary font-bold tracking-tight select-none">$</span>
              <input
                aria-label="Send amount in USD"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                className="w-full bg-transparent font-financial-mono text-3xl text-on-surface font-bold focus:outline-none placeholder:text-outline/40 border-b border-primary/30 focus:border-primary transition-colors py-1 cursor-text"
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
                  className="text-on-surface-variant hover:text-white text-xs px-2 py-1 rounded-full bg-surface-container-highest border border-white/10 shrink-0 cursor-pointer active:scale-95"
                  title={isEn ? 'Clear to zero' : 'Borrar a cero'}
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container shrink-0 shadow-inner border border-white/5">
              <span className="text-base">🇺🇸</span>
              <span className="font-title-base text-xs text-on-surface font-bold">USD</span>
            </div>
          </div>
          <p className="text-[11px] text-[#8E91A5] font-medium pt-0.5">
            {isEn ? 'Tap the amount to type with your phone keyboard' : 'Toca la cantidad para escribir con el teclado de tu teléfono'}
          </p>
          {/* Quick Amount Increment Pills */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none">
            <button
              className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright cursor-pointer border border-white/5"
              onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 50).toFixed(0))}
              type="button"
            >
              +$50
            </button>
            <button
              className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright cursor-pointer border border-white/5"
              onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 100).toFixed(0))}
              type="button"
            >
              +$100
            </button>
            <button
              className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright cursor-pointer border border-white/5"
              onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 200).toFixed(0))}
              type="button"
            >
              +$200
            </button>
            <button
              className="px-2.5 py-1 rounded-lg bg-surface-container text-primary font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright font-bold cursor-pointer border border-primary/20"
              onClick={() => setAmountValue('500')}
              type="button"
            >
              {isEn ? '$500 Max' : '$500 Máx'}
            </button>
          </div>
        </div>

        {/* Animated Swap / Ticker Node */}
        <div className="relative z-10 flex items-center justify-center -my-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F2133] shadow-lg border border-primary/30 max-w-[95%]">
            <span className="material-symbols-outlined text-primary text-[15px] shrink-0">swap_vert</span>
            <span className="font-financial-mono text-xs text-on-surface whitespace-nowrap">
              1 USD = <span className="text-primary font-bold">{USD_TO_MXN_RATE.toFixed(2)} MXN</span>
            </span>
            <span className="text-on-surface-variant font-caption-sm">•</span>
            <span className="font-label-caps text-[10px] text-primary font-black uppercase tracking-wider text-center">
              {isEn ? '$0 Fee on First Transfer' : 'Sin Comisión en tu Primer Envío'}
            </span>
          </div>
        </div>

        {/* Receiver Gets Card */}
        <div className="rounded-2xl bg-surface-container p-4 shadow-md flex flex-col space-y-2 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="font-caption-sm text-xs uppercase text-on-surface-variant font-semibold">
              {isEn ? 'Receiver Gets (Guaranteed)' : 'El destinatario recibe (Garantizado)'}
            </span>
            <span className="font-caption-sm text-xs text-on-surface-variant font-medium">
              {isEn ? 'Instant pickup' : 'Disponibilidad inmediata'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline min-w-0 flex-1 overflow-hidden">
              <span className="font-financial-mono text-2xl text-primary font-bold tracking-tight">$</span>
              <span className="font-financial-mono text-2xl text-primary font-bold tracking-tight truncate">
                {((parseFloat(amountValue) || 0) * USD_TO_MXN_RATE).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high shrink-0 shadow-inner border border-white/5">
              <span className="text-base">🇲🇽</span>
              <span className="font-title-base text-xs text-on-surface font-bold">MXN</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
            <span className="font-caption-sm text-[11px] text-on-surface-variant">
              {isEn
                ? 'Zero hidden FX spread • Complete amount delivered'
                : 'Sin comisiones ocultas • Monto completo entregado'}
            </span>
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

          {/* TARJETA INTERACTIVA DE CIUDAD Y SUCURSAL DE RETIRO EN MÉXICO */}
          <div
            onClick={onOpenPickupLocationModal}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-md ${
              pickupLocation
                ? 'bg-primary/10 border-primary/40 hover:border-primary'
                : 'bg-surface-container border-outline-variant/30 hover:border-primary/40'
            } active:scale-[0.98]`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">pin_drop</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-title-base text-xs font-bold text-on-surface truncate">
                      {pickupLocation
                        ? `${pickupLocation.city}, ${pickupLocation.state}`
                        : (isEn ? 'Cash Pickup City in Mexico' : 'Ciudad y Sucursal de Retiro')}
                    </span>
                    {pickupLocation && (
                      <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                        Confirmada
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {pickupLocation
                      ? `${pickupLocation.branch.storeName} • ${pickupLocation.branch.address}`
                      : (isEn
                          ? 'Tap to search state & city (32 Mexican states available)'
                          : 'Toca para buscar estado y ciudad (Michoacán, Jalisco, etc.)')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <span className="text-[10px] text-primary font-bold">
                  {pickupLocation ? (isEn ? 'Change' : 'Cambiar') : (isEn ? 'Search' : 'Buscar')}
                </span>
                <span className="material-symbols-outlined text-primary text-[18px]">
                  chevron_right
                </span>
              </div>
            </div>

            {pickupLocation && (
              <div className="mt-2.5 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[10px] text-on-surface-variant">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[13px] text-primary">schedule</span>
                  <span>{pickupLocation.branch.hours}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-bold text-[9px]">
                  {pickupLocation.branch.badge}
                </span>
              </div>
            )}
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
              onClick={() => handleSetReceiverMode('existing')}
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
          {/* TAB 3: DESTINATARIO FRECUENTE (SELECCIÓN Y LISTA DE CONTACTOS GUARDADOS)  */}
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

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Check verde sin círculo */}
                      <span className="text-primary text-[22px] font-black leading-none select-none drop-shadow-xs">
                        ✓
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsFrequentListExpanded(!isFrequentListExpanded)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-[11px] font-bold text-primary border border-white/10 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        <span>{isFrequentListExpanded ? 'Ocultar' : 'Cambiar'}</span>
                        <span className="material-symbols-outlined text-[15px]">
                          {isFrequentListExpanded ? 'expand_less' : 'expand_more'}
                        </span>
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
              ) : (
                <div className="p-4 rounded-2xl bg-surface-container border border-dashed border-primary/40 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">contacts</span>
                  </div>
                  <div>
                    <p className="font-title-base text-xs font-bold text-white">
                      {isEn ? 'Choose a frequent contact' : 'Selecciona un destinatario frecuente'}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {isEn ? 'Tap below to select who picks up cash in Mexico' : 'Toca uno de tus familiares guardados abajo para enviar'}
                    </p>
                  </div>
                </div>
              )}

              {/* Lista Desplegable de Destinatarios Frecuentes Guardados */}
              {(!selectedAvatar || isFrequentListExpanded) && (
                <div className="space-y-2 pt-1 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-title-base text-[11px] text-on-surface font-bold uppercase tracking-wider">
                      {isEn ? `Frequent Recipients (${filteredFrequentRecipients.length})` : `Destinatarios Frecuentes (${filteredFrequentRecipients.length})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSetReceiverMode('new')}
                      className="text-[11px] text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>+ Nuevo</span>
                    </button>
                  </div>

                  {/* Buscador de Destinatarios Frecuentes */}
                  {allFrequentList.length > 2 && (
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-[17px]">
                        search
                      </span>
                      <input
                        type="text"
                        value={frequentSearchQuery}
                        onChange={(e) => setFrequentSearchQuery(e.target.value)}
                        placeholder={isEn ? 'Filter by name, phone or city...' : 'Filtrar por nombre, teléfono o ciudad...'}
                        className="w-full h-9 pl-9 pr-8 rounded-xl bg-surface-container-high border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-all"
                      />
                      {frequentSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setFrequentSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <span className="material-symbols-outlined text-[15px]">close</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Tarjetas de contactos frecuentes */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredFrequentRecipients.map((c) => {
                      const isSelected = selectedAvatar?.id === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            handleSelectFrequentContact(c);
                            setIsFrequentListExpanded(false);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between active:scale-[0.98] ${
                            isSelected
                              ? 'bg-primary/15 border-2 border-primary ring-2 ring-primary/40 shadow-[0_0_15px_rgba(46,213,164,0.3)]'
                              : 'bg-surface-container border-white/5 hover:border-primary/40 hover:bg-surface-container-high'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <ContactAvatar
                              photoUrl={c.photoUrl}
                              name={c.name}
                              className={`w-9 h-9 rounded-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
                              iconSize="text-[18px]"
                            />
                            <div className="min-w-0">
                              <p className="font-title-base text-xs font-bold text-white truncate">
                                {c.fullName || c.name}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                                <span>{c.phone ? c.phone : 'Tel: +52...'}</span>
                                <span>•</span>
                                <span className="truncate">
                                  {(c as any).city || 'Morelia'}, {c.state || 'Michoacán'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {isSelected ? (
                              <span className="text-primary text-[20px] font-black leading-none drop-shadow-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-lg bg-surface-container-high text-primary text-[10px] font-bold border border-white/5">
                                Elegir
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {filteredFrequentRecipients.length === 0 && (
                      <div className="p-4 text-center rounded-xl bg-surface-container text-xs text-slate-400">
                        No hay contactos frecuentes que coincidan con &ldquo;{frequentSearchQuery}&rdquo;
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSetReceiverMode('new')}
                    className="w-full py-2.5 rounded-xl border border-dashed border-primary/40 hover:border-primary text-primary hover:bg-primary/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
                  >
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    <span>{isEn ? '+ Add New Receiver' : '+ Registrar Nuevo Destinatario'}</span>
                  </button>
                </div>
              )}
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

      {/* BANK (SPEI) SELECTION */}
      {deliveryMethod === 'bank' && (
        <div className="flex flex-col space-y-2.5 pt-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-title-base text-xs text-on-surface font-bold">
              {isEn ? 'Bank SPEI Beneficiary' : 'Beneficiario Cuenta Bancaria SPEI'}
            </span>
            <span className="font-caption-sm text-[11px] text-primary font-bold">
              {isEn ? '24/7 Instant' : 'Inmediato 24/7'}
            </span>
          </div>

          {selectedAvatar && (
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
                    {isEn ? 'Beneficiary' : 'Beneficiario'}: {selectedAvatar.fullName || selectedAvatar.name} • ${parseFloat(amountValue) || 50} USD
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSendDraft();
                }}
                className="text-white hover:text-red-300 px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-red-500/20 text-[11px] font-bold shrink-0 ml-2 cursor-pointer transition-all border border-white/10 flex items-center gap-1 active:scale-95"
                title={isEn ? 'Discard draft' : 'Descartar borrador'}
              >
                <span>{isEn ? '✕ Clear' : '✕ Limpiar'}</span>
              </button>
            </div>
          )}

          <div
            onClick={onSelectAvatarClick}
            className="p-3.5 rounded-2xl bg-surface-container border border-white/10 space-y-2 cursor-pointer hover:border-primary/40 transition-colors shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {selectedAvatar ? (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                      {getBankLogoUrl(selectedAvatar.bank) ? (
                        <img src={getBankLogoUrl(selectedAvatar.bank)!} alt={selectedAvatar.bank} className="w-full h-full object-contain" />
                      ) : (
                        <span className="font-financial-mono text-xs font-black text-[#004481]">
                          {(selectedAvatar.bank || 'SPEI').slice(0, 4).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-title-base text-xs font-bold text-white truncate">
                        {selectedAvatar.fullName || selectedAvatar.name}
                      </p>
                      <p className="font-financial-mono text-[11px] text-on-surface-variant truncate">
                        CLABE: {selectedAvatar.clabe || (isEn ? 'Interbank SPEI' : 'SPEI Interbancario')}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-dashed border-primary/30 flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">person_add</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-title-base text-xs font-bold text-white truncate">
                        {isEn ? 'Select a beneficiary' : 'Selecciona un beneficiario'}
                      </p>
                      <p className="text-[11px] text-on-surface-variant truncate">
                        {isEn ? 'Tap to choose from list or add one' : 'Toca para elegir de tu lista o agregar uno'}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {selectedAvatar ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] text-primary font-semibold">{isEn ? 'Change' : 'Cambiar'}</span>
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                </div>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-bold flex-shrink-0">
                  {isEn ? 'Choose' : 'Elegir'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE WALLET SELECTION */}
      {deliveryMethod === 'wallet' && (
        <div className="flex flex-col space-y-2.5 pt-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-title-base text-xs text-on-surface font-bold">
              {isEn ? 'Mobile Wallet Destination' : 'Billetera Móvil de Destino'}
            </span>
            <span className="font-caption-sm text-[11px] text-primary font-bold">
              {isEn ? 'Zero Fee' : 'Sin Comisión'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="p-3 rounded-xl bg-surface-container border border-primary text-left transition-all shadow-[0_0_16px_rgba(46,213,164,0.3)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
              <p className="font-title-base text-xs font-bold text-white mt-1">KIN Cash</p>
              <p className="text-[10px] text-primary">{isEn ? 'Direct P2P Transit' : 'Transferencia P2P Directa'}</p>
            </button>
            <button
              type="button"
              className="p-3 rounded-xl bg-surface-container border border-white/10 text-left transition-all hover:border-white/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-secondary text-[22px]">smartphone</span>
              <p className="font-title-base text-xs font-bold text-white mt-1">Mercado Pago</p>
              <p className="text-[10px] text-on-surface-variant">{isEn ? 'Instant Transfer' : 'Transferencia Instantánea'}</p>
            </button>
          </div>
        </div>
      )}

      {/* TRANSPARENT FEE BREAKDOWN CARD */}
      <div className="rounded-2xl bg-surface-container p-4 shadow-md space-y-2.5 border border-white/5">
        <div className="flex items-center justify-between">
          <span className="font-caption-sm text-xs text-on-surface-variant">
            {isEn ? 'Transfer Fee' : 'Comisión por Envío'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-financial-mono text-xs text-on-surface-variant line-through">$4.99</span>
            <span className="font-financial-mono text-xs text-primary font-bold">
              {isEn ? '$0.00 Free' : '$0.00 Gratis'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-caption-sm text-xs text-on-surface-variant">
            {isEn ? 'Exchange Rate Guaranteed' : 'Tipo de Cambio Garantizado'}
          </span>
          <span className="font-financial-mono text-xs text-on-surface font-semibold">1 USD = {USD_TO_MXN_RATE.toFixed(2)} MXN</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-caption-sm text-xs text-on-surface-variant">
            {isEn ? 'Estimated Delivery Time' : 'Tiempo Estimado de Entrega'}
          </span>
          <span className="font-caption-sm text-xs text-primary font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">bolt</span> {isEn ? 'Within 5 minutes' : 'En menos de 5 minutos'}
          </span>
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-white/5">
          <span className="font-title-base text-xs text-on-surface font-bold">
            {isEn ? 'Total to Charge' : 'Total a Cobrar'}
          </span>
          <span className="font-financial-mono text-sm text-primary font-bold">
            ${(parseFloat(amountValue) || 300).toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* PERSISTENT STICKY PRIMARY CTA */}
      <div className="sticky bottom-20 z-30 pt-2 pb-1">
        <button
          type="button"
          onClick={handleStartSendReview}
          className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#18A57E] text-white font-headline-md text-title-base font-bold shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
        >
          <span>
            {!selectedAvatar
              ? (isEn ? 'Select Beneficiary in Mexico' : 'Seleccionar Beneficiario en México')
              : (isEn
                  ? `Review Breakdown & Send • $${(parseFloat(amountValue) || 50).toFixed(2)} USD`
                  : `Revisar Desglose y Enviar • $${(parseFloat(amountValue) || 50).toFixed(2)} USD`)}
          </span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>

      {/* Spacer */}
      <div className="h-14 w-full pointer-events-none" aria-hidden="true" />

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
                  className="w-9 h-9 rounded-xl bg-surface-container-high hover:bg-surface-container flex items-center justify-center text-primary border border-white/10 cursor-pointer transition-colors active:scale-95"
                  title={isEn ? 'Back' : 'Regresar'}
                >
                  <span className="material-symbols-outlined text-[22px]">chevron_left</span>
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
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container flex items-center justify-center text-slate-400 hover:text-white border border-white/10 cursor-pointer transition-colors active:scale-90"
                title={isEn ? 'Close' : 'Cerrar'}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
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
                        10 Cadenas + Red
                      </span>
                    </div>

                    {/* Cuadrícula de 10 Tiendas */}
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

                      {/* 11. Cualquier Tienda o Banco de la Red (40,000+ Puntos) */}
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
                              {isEn ? 'Any Available Network Partner' : 'Cualquier Tienda o Banco de la Red'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {isEn ? 'Receiver picks up at any location in Mexico' : 'El familiar cobra en cualquier punto de los 40,000+ con su clave'}
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
                  className="w-9 h-9 rounded-xl bg-surface-container-high hover:bg-surface-container flex items-center justify-center text-primary border border-white/10 cursor-pointer transition-colors active:scale-95"
                  title={isEn ? 'Back' : 'Regresar'}
                >
                  <span className="material-symbols-outlined text-[22px]">chevron_left</span>
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
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container flex items-center justify-center text-slate-400 hover:text-white border border-white/10 cursor-pointer transition-colors active:scale-90"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
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
                  className="w-9 h-9 rounded-xl bg-surface-container-high hover:bg-surface-container flex items-center justify-center text-primary border border-white/10 cursor-pointer transition-colors active:scale-95 shrink-0"
                  title={isEn ? 'Back' : 'Regresar'}
                >
                  <span className="material-symbols-outlined text-[22px]">chevron_left</span>
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
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container flex items-center justify-center text-slate-400 hover:text-white border border-white/10 cursor-pointer transition-colors active:scale-90 shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
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
    </div>
  );
}
