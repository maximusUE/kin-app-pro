'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  StatusBatteryIcon,
  StatusWifiIcon,
  StatusCellularIcon,
  ChevronLeftIcon,
  SettingsGearIcon,
  DotsVerticalIcon,
  SearchIcon,
  SlidersFilterIcon,
  AddMoneyIcon,
  KinCashCircleIcon,
  BankBuildingIcon,
  PaperPlaneIcon,
  CardOutlineIcon,
  FlameIcon,
  LightningIcon,
  WifiIcon,
  FourSquaresIcon,
  PhoneLandlineIcon,
  GraduationCapIcon,
  HouseRentIcon,
  HospitalCrossIcon,
  ShoppingCartIcon,
  WalletIcon,
  CoffeeCupIcon,
  AirplaneIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  DockHomeIcon,
  DockCardIcon,
  DockSendSparkleIcon,
  DockAnalyticsIcon,
  DockUserIcon,
  BellIcon,
  CameraIcon,
  CopyIcon,
  RosetteBadgeCheckIcon,
  TransferSwapIcon,
  BodegaAurreraLogo,
  OxxoLogo,
  BancoppelLogo,
  ElektraLogo,
  BancoAztecaLogo,
  BbvaBancomerLogo,
  SorianaLogo,
  BanorteLogo,
  WalmartLogo,
  BanamexLogo,
  FarmaciasGuadalajaraLogo,
  BansefiLogo,
  AnyAgentLogo,
  getBankLogoUrl,
  ApplePayIcon,
  CreditCardGradientIcon,
  DownloadIcon,
  ShareReceiptIcon,
  CloseIcon,
  CheckCircleIcon,
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserPlusIcon,
  TrashIcon,
  PhoneIcon,
  TelevisionIcon,
  WaterDropIcon,
  QuickLinkIcon,
  BillPaymentDocIcon,
  DockWalletIcon,
  SendQuickIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  ShieldCheckIcon,
} from '@/components/Icons';
import { MexicanBillPayModal } from '@/components/MexicanBillPayModal';
import { KinCashP2PModal, KIN_FAMILY_MEMBERS, exportContactVCard } from '@/components/KinCashP2PModal';
import { ClientVaultModal } from '@/components/ClientVaultModal';
import { AppSettingsModal, ToggleSwitch } from '@/components/AppSettingsModal';
import { KinLogo } from '@/components/KinLogo';
import { BilingualAuthScreen } from '@/components/BilingualAuthScreen';

// Tasa de cambio real de mercado USD/MXN
const USD_TO_MXN_RATE = 20.45;

// Red Oficial de Sucursales de Retiro en Efectivo (Cash Pickup México - 12 Redes Oficiales)
const CASH_PICKUP_STORES = [
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
    id: 'walmart',
    name: 'Walmart',
    subtitle: 'Supercenter y Walmart Express en México',
    badge: 'Nacional',
    Logo: WalmartLogo,
  },
  {
    id: 'elektra',
    name: 'Elektra',
    subtitle: 'Tiendas Elektra en todo el país',
    badge: 'Inmediato',
    Logo: ElektraLogo,
  },
  {
    id: 'azteca',
    name: 'Banco Azteca',
    subtitle: 'Abierto 9am a 9pm los 365 días del año',
    badge: 'Sin tarjeta',
    Logo: BancoAztecaLogo,
  },
  {
    id: 'bancoppel',
    name: 'BanCoppel',
    subtitle: 'Sucursales y tiendas Coppel en México',
    badge: 'Disponible',
    Logo: BancoppelLogo,
  },
  {
    id: 'bbva',
    name: 'BBVA Bancomer',
    subtitle: 'Cajeros automáticos y ventanilla BBVA',
    badge: 'Líder',
    Logo: BbvaBancomerLogo,
  },
  {
    id: 'banorte',
    name: 'Banorte',
    subtitle: 'Red nacional de sucursales y corresponsales',
    badge: 'Disponible',
    Logo: BanorteLogo,
  },
  {
    id: 'banamex',
    name: 'Citibanamex',
    subtitle: 'Sucursales y centros de servicio Banamex',
    badge: 'Disponible',
    Logo: BanamexLogo,
  },
  {
    id: 'soriana',
    name: 'Soriana',
    subtitle: 'Soriana Híper, Súper y City Club',
    badge: 'Nacional',
    Logo: SorianaLogo,
  },
  {
    id: 'guadalajara',
    name: 'Farmacias Guadalajara',
    subtitle: 'Super Farmacia con servicio 24 horas',
    badge: '24 Horas',
    Logo: FarmaciasGuadalajaraLogo,
  },
  {
    id: 'bansefi',
    name: 'Bansefi / Bienestar',
    subtitle: 'El banco que te incluye en todo México',
    badge: 'Cobertura rural',
    Logo: BansefiLogo,
  },
  {
    id: 'any',
    name: 'Cualquier agente (Any agent)',
    subtitle: 'Red de más de 40,000 puntos en México',
    badge: 'Recomendado',
    Logo: AnyAgentLogo,
  },
];

// 6 Opciones para pagar bills en el orden exacto requerido: Electricidad, Telefono, Internet, Television, Agua, Gas
const BILL_SERVICES = [
  { id: 'electricidad', name: 'Electricidad', Icon: LightningIcon },
  { id: 'telefono', name: 'Telefono', Icon: PhoneIcon },
  { id: 'internet', name: 'Internet', Icon: WifiIcon },
  { id: 'television', name: 'Television', Icon: TelevisionIcon },
  { id: 'agua', name: 'Agua', Icon: WaterDropIcon },
  { id: 'gas', name: 'Gas', Icon: FlameIcon },
];

export interface ContactItem {
  id: string;
  name: string;
  fullName: string;
  avatar: string;
  role: string;
  country: string;
  bank: string;
  photoUrl: string;
  clabe?: string;
  phone?: string;
  street?: string;       // calle
  houseNumber?: string;  // número de casa/exterior
  state?: string;        // estado
  zipCode?: string;      // código postal
  isFamily?: boolean;
}

// Avatares disponibles para personalización de perfil
const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
];

interface TransactionItem {
  id: string;
  title: string;
  category: string;
  time: string;
  amount: number;
  type: 'income' | 'expense';
  iconType?: 'send' | 'luz' | 'internet' | 'phone' | 'bank' | 'wallet' | 'card' | 'bill';
  dateGroup?: 'Hoy' | 'Ayer' | 'Esta semana' | 'Anteriores';
  refNumber?: string;
  amountMXN?: number;
  status?: string;
}

// Estado limpio inicial (Clean Slate): sin transacciones ficticias
const INITIAL_TRANSACTIONS: TransactionItem[] = [];

interface FrequentServiceItem {
  id: string;
  name: string;
  category: string;
  iconType: 'luz' | 'internet' | 'phone' | 'bill';
  count: number;
  lastPaid: string;
  lastAmountUSD: number;
}

// Renderizador de iconos blancos y minimalistas (coherente con la botonera superior)
function renderTransactionIcon(tx: TransactionItem) {
  const lower = (tx.title + ' ' + tx.category).toLowerCase();
  if (tx.iconType === 'luz' || lower.includes('cfe') || lower.includes('luz') || lower.includes('electric')) {
    return <LightningIcon className="w-4 h-4 text-white" />;
  }
  if (tx.iconType === 'internet' || lower.includes('internet') || lower.includes('totalplay') || lower.includes('telmex') || lower.includes('wifi')) {
    return <WifiIcon className="w-4 h-4 text-white" />;
  }
  if (tx.iconType === 'phone' || lower.includes('celular') || lower.includes('recarga') || lower.includes('telcel') || lower.includes('at&t') || lower.includes('phone')) {
    return <PhoneLandlineIcon className="w-4 h-4 text-white" />;
  }
  if (tx.iconType === 'bank' || lower.includes('spei') || lower.includes('banco') || lower.includes('bank') || lower.includes('to bank')) {
    return <BankBuildingIcon className="w-4 h-4 text-white" />;
  }
  if (tx.iconType === 'wallet' || lower.includes('kin cash') || lower.includes('add money') || lower.includes('recarga')) {
    return <AddMoneyIcon className="w-4 h-4 text-white" />;
  }
  if (tx.iconType === 'card' || lower.includes('tarjeta') || lower.includes('card')) {
    return <CardOutlineIcon className="w-4 h-4 text-white" />;
  }
  return <PaperPlaneIcon className="w-4 h-4 text-white" />;
}

export default function MobileApp() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'send' | 'bills' | 'transactions' | 'wallet' | 'send-quick' | 'profile' | 'kin-cash' | 'bill-pay' | 'vault'>('home');

  // Client registration & KYC profile state (Sin datos hardcodeados para evitar sobreescritura de nuevos clientes)
  const [userId, setUserId] = useState<string>('');
  const [baseBalanceUSD, setBaseBalanceUSD] = useState<number>(0);
  const [userName, setUserName] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userCity, setUserCity] = useState('');
  const [userState, setUserState] = useState('');
  const [userZip, setUserZip] = useState('');
  const [userCountry, setUserCountry] = useState('Estados Unidos 🇺🇸');
  const [userAvatar, setUserAvatar] = useState('');
  const [userClientId, setUserClientId] = useState('');
  const [userMemberSince, setUserMemberSince] = useState('');
  const [userDocType, setUserDocType] = useState('INE / Pasaporte en Trámite');
  const [userDocNumber, setUserDocNumber] = useState('••••••••0000');
  const [userKycTier, setUserKycTier] = useState('Tier 1 (Básico - Onboarding)');
  const [userDailyLimit, setUserDailyLimit] = useState('$300.00 USD / día');
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [currencyPref, setCurrencyPref] = useState<'USD' | 'MXN'>('USD');
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [copiedClientId, setCopiedClientId] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const loadUserData = (user: any) => {
    if (!user) return;
    if (user.id) setUserId(user.id);
    if (user.firstName) setUserFirstName(user.firstName);
    if (user.lastName) setUserLastName(user.lastName);
    if (user.name) {
      setUserName(user.name);
    } else if (user.firstName) {
      const short = `${user.firstName.trim()} ${user.lastName ? user.lastName.trim()[0] + '.' : ''}`.trim();
      setUserName(short);
    }
    if (user.email) setUserEmail(user.email);
    if (user.phone) setUserPhone(user.phone);
    if (user.city) setUserCity(user.city);
    if (user.state) setUserState(user.state);
    if (user.zip) setUserZip(user.zip);
    if (user.country) setUserCountry(user.country);
    // Asignar el avatar explícito (si está vacío, deja recuadro vacío sin foto)
    setUserAvatar(user.avatar || '');
    if (user.clientId) setUserClientId(user.clientId);
    if (user.memberSince) setUserMemberSince(user.memberSince);
    if (user.docType) setUserDocType(user.docType);
    if (user.docNumber) setUserDocNumber(user.docNumber);
    if (user.kycTier) setUserKycTier(user.kycTier);
    if (user.dailyLimit) setUserDailyLimit(user.dailyLimit);
    if (typeof user.balanceUSD === 'number') setBaseBalanceUSD(user.balanceUSD);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_active_user', JSON.stringify(user));
      } catch (_) {}
    }
  };
  
  // Draft buffer state for profile editing (Solo se aplica al dar clic en 'Guardar')
  const [draftUserName, setDraftUserName] = useState('');
  const [draftUserFirstName, setDraftUserFirstName] = useState('');
  const [draftUserLastName, setDraftUserLastName] = useState('');
  const [draftUserEmail, setDraftUserEmail] = useState('');
  const [draftUserPhone, setDraftUserPhone] = useState('');
  const [draftUserCity, setDraftUserCity] = useState('');
  const [draftUserState, setDraftUserState] = useState('');
  const [draftUserAvatar, setDraftUserAvatar] = useState('');
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // Stitch Executive Dashboard state
  const [hideBalance, setHideBalance] = useState(false);
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'sent' | 'bills'>('all');

  // Helper para copiar Folio de Cliente
  const handleCopyClientId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(userClientId);
    }
    setCopiedClientId(true);
    setTimeout(() => setCopiedClientId(false), 2000);
  };

  // Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Sincronizar parámetros de URL y usuario activo (?view=login, ?view=dashboard, ?userId=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const auth = params.get('auth');
    const queryUserId = params.get('userId');

    if (view === 'login' || auth === 'login') {
      setIsAuthenticated(false);
    } else if (view === 'dashboard' || auth === 'skip' || auth === 'dashboard') {
      setIsAuthenticated(true);
    }

    // 1. Recuperar usuario guardado en localStorage (sesión activa tras login/registro)
    let savedUser: any = null;
    const saved = localStorage.getItem('kin_active_user');
    if (saved) {
      try {
        savedUser = JSON.parse(saved);
      } catch (e) {
        console.warn('[LocalStorage] parse error', e);
      }
    }

    // 2. Prioridad de sincronización:
    if (queryUserId) {
      // Si la URL pide un usuario específico y coincide con localStorage, cargarlo inmediatamente para 0ms latency
      if (savedUser && savedUser.id === queryUserId) {
        loadUserData(savedUser);
      }
      setUserId(queryUserId);
    } else if (savedUser && savedUser.id) {
      // Si no viene en URL pero hay un usuario con sesión activa en el navegador
      loadUserData(savedUser);
      setUserId(savedUser.id);
    } else {
      // Fallback predeterminado solo si es una visita en frío sin sesión ni parámetros
      setUserId('user-001');
    }
  }, []);

  // Sincronizar datos reactivos de cuenta desde el backend con protección de carrera
  useEffect(() => {
    if (!userId) return;
    let isCancelled = false;

    fetch(`/api/account/data?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isCancelled) return;
        if (data.success && data.user) {
          loadUserData(data.user);
          if (Array.isArray(data.transactions)) {
            setTransactions(data.transactions);
          }
          if (Array.isArray(data.contacts)) {
            setContactsList(data.contacts);
          }
          if (Array.isArray(data.familyNetwork)) {
            setFamilyNetwork(data.familyNetwork);
          }
        }
      })
      .catch((err) => console.warn('[Backend Sync]', err));

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  // Helper para Cerrar Sesión Segura
  const handleLogout = () => {
    if (confirm('¿Deseas cerrar tu sesión segura en KIN?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kin_active_user');
        sessionStorage.removeItem('kin_auth');
      }
      setIsAuthenticated(false);
      setActiveTab('home');
      router.push('/auth');
    }
  };

  // Abrir modal cargando valores actuales
  const handleOpenAvatarPicker = () => {
    setDraftUserName(userName);
    setDraftUserFirstName(userFirstName);
    setDraftUserLastName(userLastName);
    setDraftUserEmail(userEmail);
    setDraftUserPhone(userPhone);
    setDraftUserCity(userCity);
    setDraftUserState(userState);
    setDraftUserAvatar(userAvatar);
    setCustomAvatarInput('');
    setShowAvatarPicker(true);
  };

  // Guardar cambios de perfil confirmados
  const handleSaveProfile = () => {
    if (draftUserFirstName.trim()) {
      setUserFirstName(draftUserFirstName.trim());
      const shortName = draftUserFirstName.trim() + (draftUserLastName.trim() ? ` ${draftUserLastName.trim().charAt(0)}.` : '');
      setUserName(shortName);
    }
    if (draftUserLastName.trim()) {
      setUserLastName(draftUserLastName.trim());
    }
    if (draftUserEmail.trim()) {
      setUserEmail(draftUserEmail.trim());
    }
    if (draftUserPhone.trim()) {
      setUserPhone(draftUserPhone.trim());
    }
    if (draftUserCity.trim()) {
      setUserCity(draftUserCity.trim());
    }
    if (draftUserState.trim()) {
      setUserState(draftUserState.trim());
    }
    setUserAvatar(draftUserAvatar);
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kin_active_user');
        const prev = saved ? JSON.parse(saved) : {};
        const updated = {
          ...prev,
          id: userId,
          firstName: draftUserFirstName.trim() || userFirstName,
          lastName: draftUserLastName.trim() || userLastName,
          name: draftUserFirstName.trim() ? (draftUserFirstName.trim() + (draftUserLastName.trim() ? ` ${draftUserLastName.trim().charAt(0)}.` : '')) : userName,
          email: draftUserEmail.trim() || userEmail,
          phone: draftUserPhone.trim() || userPhone,
          city: draftUserCity.trim() || userCity,
          state: draftUserState.trim() || userState,
          avatar: draftUserAvatar,
        };
        localStorage.setItem('kin_active_user', JSON.stringify(updated));
      } catch (_) {}
    }
    setShowAvatarPicker(false);
  };

  // Cancelar/cerrar modal sin guardar
  const handleCancelProfile = () => {
    setShowAvatarPicker(false);
  };

  // Transactions state (Inicializado con historial ordenado por fechas)
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);

  // Servicios Frecuentes (Inicia vacío y se puebla dinámicamente en listado ordenado de menor a mayor frecuencia)
  const [frequentServices, setFrequentServices] = useState<FrequentServiceItem[]>([]);

  // Send Money state (Screenshot 1)
  const [sendSearch, setSendSearch] = useState('');
  const [contactsList, setContactsList] = useState<ContactItem[]>([]);
  const [familyNetwork, setFamilyNetwork] = useState<ContactItem[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactStreet, setNewContactStreet] = useState('');
  const [newContactHouseNumber, setNewContactHouseNumber] = useState('');
  const [newContactState, setNewContactState] = useState('');
  const [newContactCountry, setNewContactCountry] = useState('Mexico');
  const [newContactZip, setNewContactZip] = useState('');
  const [newContactBank, setNewContactBank] = useState('Red Banxico SPEI');
  const [newContactClabe, setNewContactClabe] = useState('');
  const [beneficiaryErrors, setBeneficiaryErrors] = useState<Record<string, string> | null>(null);
  const [beneficiaryModalTab, setBeneficiaryModalTab] = useState<'select' | 'register'>('select');
  const [saveBeneficiaryToPhone, setSaveBeneficiaryToPhone] = useState(true);
  const [isSavingBeneficiary, setIsSavingBeneficiary] = useState(false);
  const [contactFeedback, setContactFeedback] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<ContactItem | null>(null);
  const [amountValue, setAmountValue] = useState('50');
  const [deliveryMethod, setDeliveryMethod] = useState<'cash' | 'bank' | 'wallet'>('cash');
  const [selectedStore, setSelectedStore] = useState('oxxo');
  const [paymentMethod, setPaymentMethod] = useState<'debit' | 'apple' | 'bank' | 'credit'>('debit');
  const [receiverMode, setReceiverMode] = useState<'existing' | 'new'>('existing');
  const [payOnlineTab, setPayOnlineTab] = useState<'online' | 'store'>('online');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showRateAlertToast, setShowRateAlertToast] = useState(false);
  const [showReceiverPicker, setShowReceiverPicker] = useState(false);
  const [isCashPickupExpanded, setIsCashPickupExpanded] = useState(false);

  // Reordenar contactos hacia arriba (subir orden)
  const handleMoveContactUp = (index: number) => {
    if (index <= 0) return;
    setContactsList((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  // Reordenar contactos hacia abajo (bajar orden)
  const handleMoveContactDown = (index: number) => {
    if (index >= contactsList.length - 1) return;
    setContactsList((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  // Eliminar contacto de la lista
  const handleDeleteContact = (id: string) => {
    setContactsList((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (selectedAvatar?.id === id) {
        setSelectedAvatar(filtered.length > 0 ? filtered[0] : null);
      }
      return filtered;
    });

    fetch(`/api/contacts?userId=${encodeURIComponent(userId)}&contactId=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch((e) => console.warn('[Delete contact API error]', e));
  };

  // Acceso directo a los contactos del teléfono móvil (Web Contact Picker API)
  const handlePickPhoneContacts = async () => {
    try {
      if (typeof window !== 'undefined' && 'contacts' in navigator && 'ContactsManager' in window) {
        const props = ['name', 'tel'];
        const contacts = await (navigator as any).contacts.select(props, { multiple: true });
        if (contacts && contacts.length > 0) {
          const emojis = ['🧑🏻', '👩🏻', '🧔🏽', '👱🏼', '👵🏼', '👨🏽', '👧🏻'];
          const newEntries: ContactItem[] = contacts.map((c: any, idx: number) => {
            const rawName = c.name?.[0] || 'Contacto Teléfono';
            const tel = c.tel?.[0] || '';
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            return {
              id: `phone-${Date.now()}-${idx}`,
              name: rawName.split(' ')[0],
              fullName: rawName,
              avatar: randomEmoji,
              role: tel || 'Móvil directo',
              country: 'Mexico',
              bank: 'SPEI Banxico',
              photoUrl: DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length],
              phone: tel,
            };
          });

          setContactsList((prev) => [...newEntries, ...prev]);
          if (newEntries.length > 0) {
            setSelectedAvatar(newEntries[0]);
          }
          setContactFeedback(`¡${newEntries.length} contacto(s) sincronizado(s) desde tu teléfono!`);
          setTimeout(() => setContactFeedback(null), 3500);
          return;
        }
      }
    } catch (err: any) {
      console.warn('Contact picker cancelled or denied:', err);
    }

    setContactFeedback('Usa el formulario arriba para agregar a tu beneficiario en México.');
    setTimeout(() => setContactFeedback(null), 3000);
  };

  // Agregar contacto / beneficiario con validación estricta de dirección CNBV / Banxico
  const handleAddNewContact = () => {
    const trimmedName = newContactName.trim();
    const trimmedPhone = newContactPhone.trim();
    const trimmedStreet = newContactStreet.trim();
    const trimmedHouse = newContactHouseNumber.trim();
    const trimmedState = newContactState.trim();
    const trimmedCountry = newContactCountry.trim() || 'Mexico';
    const trimmedZip = newContactZip.trim();

    const errors: Record<string, string> = {};
    if (!trimmedName) errors.name = 'El nombre es obligatorio';
    if (!trimmedPhone) errors.phone = 'El teléfono celular es obligatorio';
    if (!trimmedStreet) errors.street = 'La calle es obligatoria para envíos a México';
    if (!trimmedHouse) errors.houseNumber = 'El número de casa/exterior es obligatorio';
    if (!trimmedState) errors.state = 'El estado o provincia es obligatorio';
    if (!trimmedCountry) errors.country = 'El país destino es obligatorio';
    if (!trimmedZip) errors.zipCode = 'El código postal es obligatorio';

    if (Object.keys(errors).length > 0) {
      setBeneficiaryErrors(errors);
      return;
    }

    setBeneficiaryErrors(null);
    setIsSavingBeneficiary(true);

    const emojis = ['🧑🏻', '👩🏻', '🧔🏽', '👱🏼', '👵🏼', '👨🏽', '👧🏻'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const newContact: ContactItem = {
      id: `manual-${Date.now()}`,
      name: trimmedName,
      fullName: trimmedName,
      avatar: randomEmoji,
      role: `${trimmedState}, ${trimmedCountry} • ${trimmedPhone}`,
      country: trimmedCountry,
      bank: newContactBank || (deliveryMethod === 'cash' ? 'OXXO Cash Pickup' : 'SPEI Banxico'),
      photoUrl: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
      phone: trimmedPhone,
      street: trimmedStreet,
      houseNumber: trimmedHouse,
      state: trimmedState,
      zipCode: trimmedZip,
      clabe: newContactClabe.trim(),
    };

    setContactsList((prev) => [newContact, ...prev]);
    setSelectedAvatar(newContact);
    setShowContactModal(false);
    setBeneficiaryModalTab('select');
    setContactFeedback(`Beneficiario ${newContact.name} verificado y registrado.`);
    setTimeout(() => setContactFeedback(null), 3500);

    if (saveBeneficiaryToPhone) {
      exportContactVCard(trimmedName, trimmedPhone);
    }

    fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        name: newContact.name,
        fullName: newContact.fullName,
        phone: newContact.phone,
        bank: newContact.bank,
        avatar: newContact.avatar,
        street: newContact.street,
        houseNumber: newContact.houseNumber,
        state: newContact.state,
        country: newContact.country,
        zipCode: newContact.zipCode,
        clabe: newContact.clabe,
        validateFor: 'remittance',
      }),
    })
      .catch((e) => console.warn('[Contacts API error]', e))
      .finally(() => setIsSavingBeneficiary(false));
  };

  // Cálculo de comisiones y monto total a pagar según el método seleccionado
  const paymentFee = paymentMethod === 'credit' ? 1.99 : 0.0;
  const currentSendAmount = parseFloat(amountValue) || 0;
  const totalToPayUSD = currentSendAmount > 0 ? currentSendAmount + paymentFee : 0;

  // Success screen state (Rosette Badge, Money sent successfully)
  const [sendSuccessData, setSendSuccessData] = useState<{
    id: string;
    amount: number;
    fee: number;
    totalPaid: number;
    recipientName: string;
    recipientAvatar: string;
    time: string;
    deliveryTitle: string;
    paymentTitle: string;
  } | null>(null);

  // Modals
  const [showBillPayModal, setShowBillPayModal] = useState(false);
  const [selectedBillServiceId, setSelectedBillServiceId] = useState<string>('electricidad');
  const [showKinCashModal, setShowKinCashModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sendQuickAmount, setSendQuickAmount] = useState('50');
  const [sendQuickSelectedRecipient, setSendQuickSelectedRecipient] = useState<number>(0);
  const [cardFrozen, setCardFrozen] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Helper para registrar un envío de dinero y abrir ventanilla de Success
  const handleSendNow = () => {
    if (!selectedAvatar) {
      setBeneficiaryModalTab('select');
      setShowContactModal(true);
      return;
    }

    // Validación regulatoria para Envíos USA -> México (CNBV / Banxico / FinCEN)
    const hasAddress = !!(
      selectedAvatar.street &&
      selectedAvatar.houseNumber &&
      selectedAvatar.state &&
      selectedAvatar.country &&
      selectedAvatar.zipCode &&
      selectedAvatar.phone
    );

    if (!hasAddress) {
      setNewContactName(selectedAvatar.fullName || selectedAvatar.name);
      setNewContactPhone(selectedAvatar.phone || '');
      setNewContactStreet(selectedAvatar.street || '');
      setNewContactHouseNumber(selectedAvatar.houseNumber || '');
      setNewContactState(selectedAvatar.state || '');
      setNewContactCountry(selectedAvatar.country || 'Mexico');
      setNewContactZip(selectedAvatar.zipCode || '');
      setBeneficiaryModalTab('register');
      setBeneficiaryErrors({
        name: !selectedAvatar.name ? 'El nombre es obligatorio' : '',
        phone: !selectedAvatar.phone ? 'El teléfono celular es obligatorio' : '',
        street: !selectedAvatar.street ? 'La calle es obligatoria para envíos a México' : '',
        houseNumber: !selectedAvatar.houseNumber ? 'El número exterior es obligatorio' : '',
        state: !selectedAvatar.state ? 'El estado es obligatorio' : '',
        country: !selectedAvatar.country ? 'El país es obligatorio' : '',
        zipCode: !selectedAvatar.zipCode ? 'El código postal es obligatorio' : '',
      });
      setShowContactModal(true);
      return;
    }
    const amt = parseFloat(amountValue) || 50;
    const fee = paymentMethod === 'credit' ? 1.99 : 0.0;
    const totalPaid = amt + fee;
    const txId = 'KIN-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

    const storeObj = CASH_PICKUP_STORES.find((s) => s.id === selectedStore);
    const deliveryTitle = deliveryMethod === 'cash'
      ? `Cash Pickup (${storeObj?.name || 'Any agent'})`
      : 'Depósito a Cuenta Bancaria (SPEI)';
    
    const paymentTitle = paymentMethod === 'debit' ? 'Debit Card ($0.00 fee)'
      : paymentMethod === 'apple' ? 'Apple Pay ($0.00 fee)'
      : paymentMethod === 'bank' ? 'Bank account ($0.00 fee)'
      : 'Credit Card ($1.99 fee)';

    const newTx: TransactionItem = {
      id: Date.now().toString(),
      title: `Envío a ${selectedAvatar.name}`,
      category: deliveryTitle,
      time: `Hoy, ${timeStr}`,
      amount: -totalPaid,
      type: 'expense',
      iconType: 'send',
      dateGroup: 'Hoy',
      refNumber: txId,
      amountMXN: +(amt * USD_TO_MXN_RATE).toFixed(2),
      status: 'Completado',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setBaseBalanceUSD((prev) => +(prev - totalPaid).toFixed(2));

    // Despacho asíncrono hacia el backend SPEI
    fetch('/api/spei/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        recipientName: selectedAvatar.name,
        recipientId: selectedAvatar.id,
        recipientPhone: selectedAvatar.phone,
        amountUSD: amt,
        deliveryMethod,
        pickupStore: selectedStore,
      }),
    }).catch((e) => console.warn('[SPEI API error]', e));

    setSendSuccessData({
      id: txId,
      amount: amt,
      fee,
      totalPaid,
      recipientName: selectedAvatar.name,
      recipientAvatar: selectedAvatar.avatar,
      time: `${dateStr} a las ${timeStr}`,
      deliveryTitle,
      paymentTitle,
    });
  };

  // Helper para Envío Rápido (Send Quick en 1 solo toque)
  const handleSendQuick = () => {
    if (contactsList.length === 0) {
      setShowContactModal(true);
      return;
    }
    const recipient = contactsList[sendQuickSelectedRecipient] || contactsList[0];
    if (!recipient) return;
    const amt = parseFloat(sendQuickAmount) || 50;
    const txId = 'KIN-QK-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

    const newTx: TransactionItem = {
      id: Date.now().toString(),
      title: `Envío Rápido a ${recipient.name}`,
      category: 'SPEI Exprés (0 comisiones)',
      time: `Hoy, ${timeStr}`,
      amount: -amt,
      type: 'expense',
      iconType: 'send',
      dateGroup: 'Hoy',
      refNumber: txId,
      amountMXN: +(amt * USD_TO_MXN_RATE).toFixed(2),
      status: 'Completado',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setBaseBalanceUSD((prev) => +(prev - amt).toFixed(2));

    fetch('/api/spei/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        recipientName: recipient.name,
        recipientId: recipient.id,
        recipientPhone: recipient.phone,
        amountUSD: amt,
        deliveryMethod: 'bank',
      }),
    }).catch((e) => console.warn('[SPEI Quick API error]', e));

    setSendSuccessData({
      id: txId,
      amount: amt,
      fee: 0,
      totalPaid: amt,
      recipientName: recipient.name,
      recipientAvatar: recipient.avatar,
      time: `${dateStr} a las ${timeStr}`,
      deliveryTitle: 'SPEI Exprés Inmediato (Banxico)',
      paymentTitle: 'KIN Balance ($0.00 fee)',
    });
    setActiveTab('send');
  };

  // Callback de pago de facturas
  const handleBillPaymentSuccess = (service: string, amountMXN: number) => {
    const amountUSD = +(amountMXN / USD_TO_MXN_RATE).toFixed(2);
    let iconType: 'luz' | 'internet' | 'phone' | 'bill' = 'bill';
    const lower = service.toLowerCase();
    if (lower.includes('luz') || lower.includes('cfe') || lower.includes('electric')) iconType = 'luz';
    else if (lower.includes('internet') || lower.includes('totalplay') || lower.includes('telmex')) iconType = 'internet';
    else if (lower.includes('celular') || lower.includes('recarga') || lower.includes('telcel') || lower.includes('at&t')) iconType = 'phone';

    const newTx: TransactionItem = {
      id: Date.now().toString(),
      title: `Pago de ${service}`,
      category: 'Servicio en México',
      time: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: -amountUSD,
      type: 'expense',
      iconType,
      dateGroup: 'Hoy',
      refNumber: 'CFE-' + Math.floor(100000 + Math.random() * 900000),
      amountMXN,
      status: 'Completado',
    };
    setTransactions((prev) => [newTx, ...prev]);
    setBaseBalanceUSD((prev) => +(prev - amountUSD).toFixed(2));

    fetch('/api/bills/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        serviceName: service,
        amountMXN,
      }),
    }).catch((e) => console.warn('[BillPay API error]', e));

    // Actualizar lista de servicios frecuentes (ordenados de menor a mayor frecuencia)
    setFrequentServices((prev) => {
      const existingIndex = prev.findIndex((s) => s.name.toLowerCase() === service.toLowerCase());
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          count: updated[existingIndex].count + 1,
          lastPaid: 'Hoy',
          lastAmountUSD: amountUSD,
        };
        return updated.sort((a, b) => a.count - b.count);
      } else {
        const newItem: FrequentServiceItem = {
          id: Date.now().toString(),
          name: service,
          category: 'Servicio en México',
          iconType,
          count: 1,
          lastPaid: 'Hoy',
          lastAmountUSD: amountUSD,
        };
        return [...prev, newItem].sort((a, b) => a.count - b.count);
      }
    });
  };

  // Callback de recarga KIN Cash
  const handleP2PSuccess = (recipient: string, amountMXN: number, contact?: any) => {
    const amountUSD = +(amountMXN / USD_TO_MXN_RATE).toFixed(2);
    const newTx: TransactionItem = {
      id: Date.now().toString(),
      title: `KIN Cash para ${recipient}`,
      category: 'Recarga / SPEI P2P',
      time: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: -amountUSD,
      type: 'expense',
      iconType: 'wallet',
      dateGroup: 'Hoy',
      refNumber: 'KIN-' + Math.floor(100000 + Math.random() * 900000),
      amountMXN,
      status: 'Completado',
    };
    setTransactions((prev) => [newTx, ...prev]);
    setBaseBalanceUSD((prev) => +(prev - amountUSD).toFixed(2));

    fetch('/api/kin-cash/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        recipientName: recipient,
        recipientId: contact?.id,
        recipientPhone: contact?.phone,
        amountUSD,
      }),
    }).catch((e) => console.warn('[KIN Cash API error]', e));
  };

  // Totales calculados dinámicamente
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const netBalance = baseBalanceUSD;

  // Stitch Executive Dashboard: balance dinámico reactivo
  const executiveBalance = baseBalanceUSD;

  // Filtered transactions for Stitch Executive Activity feed
  const filteredDashboardTransactions = transactions.filter((tx) => {
    if (dashboardFilter === 'all') return true;
    if (dashboardFilter === 'sent') {
      return (
        tx.type === 'expense' &&
        (tx.category.toLowerCase().includes('spei') ||
          tx.category.toLowerCase().includes('envío') ||
          tx.category.toLowerCase().includes('pickup') ||
          tx.category.toLowerCase().includes('remesa') ||
          tx.iconType === 'send')
      );
    }
    if (dashboardFilter === 'bills') {
      return (
        tx.category.toLowerCase().includes('servicio') ||
        tx.category.toLowerCase().includes('cfe') ||
        tx.category.toLowerCase().includes('telmex') ||
        tx.iconType === 'luz' ||
        tx.iconType === 'internet' ||
        tx.iconType === 'phone' ||
        tx.iconType === 'bill'
      );
    }
    return true;
  });

  // Agrupación ordenada de transacciones por temporalidad (Hoy, Ayer, Esta semana, Anteriores)
  const groupedTransactions = transactions.reduce<Record<string, TransactionItem[]>>((acc, tx) => {
    const group = tx.dateGroup || 'Hoy';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(tx);
    return acc;
  }, {});

  // Si el usuario aún no ha iniciado sesión, desplegar pantalla de autenticación y login Stitch
  if (!isAuthenticated) {
    return (
      <BilingualAuthScreen
        initialMode="login"
        onLoginSuccess={(userData) => {
          setIsAuthenticated(true);
          if (userData) {
            loadUserData(userData);
            if (userData.id) {
              setUserId(userData.id);
            }
          }
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('kin_auth', 'true');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#06070B] text-white flex justify-center selection:bg-[#7047EB]/30 selection:text-[#2ED5A4]">
      {/* Centered Mobile Layout (Clean, Upright & Frameless) */}
      <div className="w-full max-w-[412px] min-h-[100dvh] flex flex-col relative bg-[#06070B] pb-24">
        
        {/* Signature Bicolor Ambient Diffuse Glow (Dribbble Reference 2) */}
        <div className="bicolor-atmosphere-glow" />

        {/* ========================================================================= */}
        {/* TOP STATUS BAR & APP HEADER (STICKY HEADER AT THE VERY TOP)               */}
        {/* ========================================================================= */}
        <div className="sticky top-0 z-30 bg-[#06070B]/95 backdrop-blur-md px-4 pt-1.5 pb-2 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-[#8E91A5] font-semibold mb-2 pt-1 px-1">
            <span className="font-financial-mono text-white">9:41</span>
            <div className="h-3.5 w-20 bg-[#121320] rounded-full mx-auto shadow-inner border border-white/5" />
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px] text-white">signal_cellular_alt</span>
              <span className="font-financial-mono text-[10px] text-white">5G</span>
              <span className="material-symbols-outlined text-[13px] text-white">battery_full</span>
            </div>
          </div>

          {(activeTab === 'home' || activeTab === 'kin-cash' || activeTab === 'bill-pay') && (
            <header className="flex items-center justify-between gap-2 mb-1 px-0.5">
              <div className="flex items-center gap-2">
                <KinLogo size={34} />
                <div className="flex flex-col leading-none">
                  <span className="font-headline-md text-[17px] font-bold tracking-tight text-white">KIN</span>
                  <span className="font-label-caps text-[9px] uppercase tracking-widest text-[#2ED5A4]">Global</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high/80 text-[#2ED5A4] shadow-inner border border-white/5">
                <span className="font-financial-mono text-caption-sm font-semibold tracking-tight text-white">
                  1 USD = {USD_TO_MXN_RATE.toFixed(2)} MXN
                </span>
                <span className="material-symbols-outlined text-[13px] text-[#2ED5A4] animate-pulse">bolt</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => alert('No tienes notificaciones pendientes')}
                  aria-label="Notifications"
                  className="relative w-9 h-9 flex items-center justify-center rounded-full text-on-surface hover:text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2ED5A4] shadow-[0_0_8px_#2ED5A4]" />
                </button>

                <button
                  type="button"
                  onClick={handleOpenAvatarPicker}
                  className="relative w-8 h-8 rounded-full p-0.5 bg-surface-container-high flex items-center justify-center cursor-pointer border border-white/10 hover:border-[#2ED5A4]/40 transition-colors"
                  title={userAvatar ? "Ajustes de Perfil" : "Agregar Foto de Perfil"}
                >
                  {userAvatar ? (
                    <img alt={userName || 'Perfil'} className="w-full h-full rounded-full object-cover" src={userAvatar} />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#202236] flex items-center justify-center text-[#8E91A5] border border-dashed border-white/25">
                      <span className="material-symbols-outlined text-[15px] text-[#8E91A5]">person</span>
                    </div>
                  )}
                  {userAvatar && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2ED5A4] flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[9px] text-[#003828] font-bold">check</span>
                    </div>
                  )}
                </button>
              </div>
            </header>
          )}
        </div>

        {/* SCREEN CONTENT BODY */}
        <main className="flex-1 px-4 py-2 pb-24 relative">

        {/* ========================================================================= */}
        {/* SCREEN 1: "MY CARD / HOME" (STITCH EXECUTIVE DASHBOARD)                   */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-5">
            {/* Greeting & Status Header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Executive Overview
                </span>
                <h1 className="font-headline-md text-headline-md text-white flex items-center gap-1.5 mt-0.5">
                  Hola, {userFirstName || (userName ? userName.split(' ')[0] : 'Bienvenido')} <span className="inline-block animate-bounce text-xl">👋</span>
                </h1>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high shadow-md border border-white/5">
                <span className="w-2 h-2 rounded-full bg-[#2ED5A4] animate-pulse shadow-[0_0_8px_#2ED5A4]" />
                <span className="font-caption-sm text-caption-sm text-[#2ED5A4] font-semibold">
                  {userKycTier ? (userKycTier.includes('Tier 1') ? 'Tier-1 Básico' : userKycTier.includes('Tier 2') ? 'Tier-2 Verificado' : 'Tier-3 Avanzado') : 'Tier-1 Básico'}
                </span>
              </div>
            </div>

            {/* Dynamic Balance Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-surface-container-low shadow-2xl p-5 border border-white/5">
              {/* Atmospheric Dual Glow Radiance */}
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#5018cb]/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#2ED5A4]/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col space-y-4">
                {/* Balance Header & Privacy Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                      Combined Liquid Capital
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-[#2ED5A4] font-financial-mono text-[11px] font-bold">
                      USD/SPEI
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHideBalance(!hideBalance)}
                    aria-label="Toggle Balance Visibility"
                    className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white transition-colors cursor-pointer border border-white/5"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {hideBalance ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Main USD Balance Display */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-hero text-display-hero text-white tracking-tight font-extrabold">
                      {hideBalance
                        ? '••••••••'
                        : `$${executiveBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </span>
                    <span className="font-financial-mono text-financial-mono text-on-surface-variant">USD</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-body-medium text-body-medium text-on-surface font-semibold">
                      {hideBalance
                        ? '≈ •••••••• MXN'
                        : `≈ $${(executiveBalance * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary/15 text-[#2ED5A4] font-caption-sm text-caption-sm font-bold">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span>+1.2%
                    </span>
                  </div>
                </div>

                {/* Live FX Guarantee Badge */}
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-surface-container-high shadow-inner border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2ED5A4]" />
                      <span className="absolute w-2.5 h-2.5 rounded-full bg-[#2ED5A4] animate-ping opacity-75" />
                    </div>
                    <span className="font-caption-sm text-caption-sm text-white font-medium">
                      1 USD = {USD_TO_MXN_RATE.toFixed(2)} MXN
                    </span>
                  </div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Banxico Guaranteed
                  </span>
                </div>

                {/* Virtual Metal Card Drawer Snippet */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-6 rounded-md bg-gradient-to-tr from-[#0a0d1c] via-[#303445] to-[#353849] flex items-center justify-between px-1.5 shadow-sm border border-white/10">
                      <span className="w-2 h-2 rounded-sm bg-[#2ED5A4]/40" />
                      <span className="font-financial-mono text-[8px] text-white font-bold">KIN</span>
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-caption-sm text-caption-sm text-white font-bold tracking-wide">
                        Obsidian Metal •• 8942
                      </span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant">Virtual Card Ready</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Apple Pay: Obsidian Metal KIN Card lista para pagos')}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest hover:bg-surface-bright text-white text-caption-sm font-medium transition-colors shadow-sm cursor-pointer border border-white/5"
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#2ED5A4]">account_balance_wallet</span>
                    <span>Apple Pay</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Rail */}
            <div className="grid grid-cols-4 gap-2.5">
              {/* Send Money */}
              <button
                type="button"
                onClick={() => setActiveTab('send')}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary shadow-[0_8px_20px_-4px_rgba(46,213,164,0.45)] transition-transform group-hover:scale-105 active:scale-95">
                  <span className="material-symbols-outlined text-[26px]">send</span>
                </div>
                <span className="font-label-caps text-label-caps text-white font-bold tracking-tight">Send MX</span>
              </button>

              {/* Kin Cash P2P */}
              <button
                type="button"
                onClick={() => setActiveTab('kin-cash')}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-container to-secondary flex items-center justify-center text-white shadow-[0_8px_20px_-4px_rgba(112,71,235,0.45)] transition-transform group-hover:scale-105 active:scale-95">
                  <span className="material-symbols-outlined text-[26px]">bolt</span>
                </div>
                <span className="font-label-caps text-label-caps text-white font-bold tracking-tight">Kin Cash</span>
              </button>

              {/* 1-Tap Send */}
              <button
                type="button"
                onClick={() => setActiveTab('send-quick')}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary transition-transform group-hover:scale-105 active:scale-95 shadow-md border border-white/5">
                  <span className="material-symbols-outlined text-[26px]">touch_app</span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface font-semibold tracking-tight">1-Tap Send</span>
              </button>

              {/* Bill Pay */}
              <button
                type="button"
                onClick={() => setActiveTab('bill-pay')}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-secondary transition-transform group-hover:scale-105 active:scale-95 shadow-md border border-white/5">
                  <span className="material-symbols-outlined text-[26px]">receipt_long</span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface font-semibold tracking-tight">Bill Pay</span>
              </button>
            </div>

            {/* Beneficiaries Horizontal Carousel */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">family_restroom</span>
                  <h2 className="font-title-base text-title-base text-white font-bold">Quick Send to Family</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('send-quick')}
                  className="font-caption-sm text-caption-sm text-primary font-bold hover:underline cursor-pointer"
                >
                  View All ({contactsList.length})
                </button>
              </div>

              <div className="flex items-start gap-3 overflow-x-auto pb-1 -mx-margin-mobile px-margin-mobile scrollbar-none">
                {/* Add New Recipient */}
                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary shadow-sm group-hover:bg-surface-bright transition-colors border border-white/5">
                    <span className="material-symbols-outlined text-[26px]">add</span>
                  </div>
                  <span className="font-caption-sm text-caption-sm text-on-surface-variant font-medium">New Recipient</span>
                </button>

                {contactsList.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setShowContactModal(true)}
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-surface-container-high/50 border border-dashed border-white/10 text-left flex-shrink-0 hover:border-primary/40 transition-colors cursor-pointer h-14"
                  >
                    <span className="material-symbols-outlined text-primary text-[20px]">person_add</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white leading-tight">+ Agregar a tu familia</span>
                      <span className="text-[10px] text-on-surface-variant leading-tight">Envía directo a México</span>
                    </div>
                  </button>
                )}

                {/* Authentic Contact Cards */}
                {contactsList.map((contact, idx) => {
                  const bankLogo = getBankLogoUrl(contact.bank);
                  return (
                    <button
                      key={contact.id || idx}
                      type="button"
                      onClick={() => {
                        setSendQuickSelectedRecipient(idx);
                        setActiveTab('send');
                      }}
                      className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer text-left"
                    >
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-white/10">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          src={contact.photoUrl}
                          alt={contact.name}
                        />
                        {bankLogo ? (
                          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-white flex items-center justify-center shadow-md p-0.5">
                            <img src={bankLogo} alt={contact.bank} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-white flex items-center justify-center shadow-md p-0.5">
                            <span className="font-financial-mono text-[7px] text-[#004481] font-extrabold leading-none">SPEI</span>
                          </div>
                        )}
                      </div>
                      <span className="font-caption-sm text-caption-sm text-white font-semibold text-center truncate max-w-[70px]">
                        {contact.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="flex flex-col space-y-3">
              {/* Header with Filter Controls */}
              <div className="flex items-center justify-between">
                <h2 className="font-title-base text-title-base text-white font-bold">Recent Activity</h2>
                <div className="flex items-center gap-1 bg-surface-container-high rounded-full p-0.5 shadow-inner border border-white/5">
                  <button
                    type="button"
                    onClick={() => setDashboardFilter('all')}
                    className={`px-2.5 py-1 rounded-full font-label-caps text-[10px] font-bold transition-all cursor-pointer ${
                      dashboardFilter === 'all'
                        ? 'bg-surface-container-highest text-white'
                        : 'text-on-surface-variant hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setDashboardFilter('sent')}
                    className={`px-2.5 py-1 rounded-full font-label-caps text-[10px] font-bold transition-all cursor-pointer ${
                      dashboardFilter === 'sent'
                        ? 'bg-surface-container-highest text-white'
                        : 'text-on-surface-variant hover:text-white'
                    }`}
                  >
                    Sent
                  </button>
                  <button
                    type="button"
                    onClick={() => setDashboardFilter('bills')}
                    className={`px-2.5 py-1 rounded-full font-label-caps text-[10px] font-bold transition-all cursor-pointer ${
                      dashboardFilter === 'bills'
                        ? 'bg-surface-container-highest text-white'
                        : 'text-on-surface-variant hover:text-white'
                    }`}
                  >
                    Bills
                  </button>
                </div>
              </div>

              {/* Filtered Transaction List */}
              <div className="flex flex-col space-y-2.5">
                {filteredDashboardTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-surface-container-low border border-dashed border-white/10 text-center space-y-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Sin transacciones aún</p>
                      <p className="text-xs text-on-surface-variant max-w-[240px] mt-0.5">
                        Tus envíos SPEI, pagos de facturas o recargas KIN Cash aparecerán aquí al realizarlos.
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredDashboardTransactions.slice(0, 5).map((tx) => {
                    const isIncome = tx.type === 'income';
                    const bankLogo = getBankLogoUrl(tx.title) || getBankLogoUrl(tx.category);
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors shadow-md border border-white/5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`relative w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${
                              tx.iconType === 'bank'
                                ? 'bg-secondary-container/20 text-secondary'
                                : tx.iconType === 'wallet'
                                ? 'bg-primary/10 text-primary'
                                : tx.iconType === 'luz'
                                ? 'bg-surface-container-high text-secondary'
                                : 'bg-surface-container-high text-primary'
                            }`}
                          >
                            {tx.iconType === 'luz' ? (
                              <span className="material-symbols-outlined text-[22px]">electric_meter</span>
                            ) : tx.iconType === 'wallet' ? (
                              <span className="material-symbols-outlined text-[22px]">bolt</span>
                            ) : tx.iconType === 'bank' ? (
                              <span className="material-symbols-outlined text-[22px]">account_balance</span>
                            ) : (
                              <span className="material-symbols-outlined text-[22px]">outgoing_mail</span>
                            )}
                            {bankLogo ? (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded bg-white flex items-center justify-center shadow-sm p-0.5">
                                <img src={bankLogo} alt="Bank" className="w-full h-full object-contain" />
                              </div>
                            ) : tx.title.includes('OXXO') ? (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded bg-white flex items-center justify-center shadow-sm">
                                <span className="font-financial-mono text-[6px] text-[#E31B23] font-bold">O</span>
                              </div>
                            ) : tx.title.includes('CFE') ? (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded bg-white flex items-center justify-center shadow-sm">
                                <span className="font-financial-mono text-[6px] text-[#00693E] font-bold">CFE</span>
                              </div>
                            ) : null}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-body-medium text-body-medium text-white font-bold truncate">
                              {tx.title}
                            </span>
                            <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                              {tx.category} • {tx.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0 pl-2">
                          <span
                            className={`font-financial-mono text-financial-mono font-bold ${
                              isIncome ? 'text-primary' : 'text-white'
                            }`}
                          >
                            {isIncome ? `+$${Math.abs(tx.amount).toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                          </span>
                          {tx.iconType === 'luz' ? (
                            <span className="font-caption-sm text-caption-sm text-on-surface-variant font-medium">
                              ${(tx.amountMXN || Math.abs(tx.amount) * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                            </span>
                          ) : tx.iconType === 'bank' ? (
                            <span className="font-caption-sm text-caption-sm text-on-surface-variant font-medium">
                              Direct USD
                            </span>
                          ) : isIncome ? (
                            <span className="font-caption-sm text-caption-sm text-primary/80 font-medium">
                              USD Balance
                            </span>
                          ) : (
                            <span className="font-caption-sm text-caption-sm font-semibold text-primary">
                              ${(tx.amountMXN || Math.abs(tx.amount) * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN ✓
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN: "KIN CASH" (P2P EXPRESS ZERO-FEE DASHBOARD TAB)                   */}
        {/* ========================================================================= */}
        {activeTab === 'kin-cash' && (
          <div className="animate-fade-in space-y-4">
            <KinCashP2PModal
              isScreen={true}
              userId={userId}
              onContactCreated={(c) => setContactsList((prev) => [c, ...prev])}
              onP2PSuccess={handleP2PSuccess}
              contacts={contactsList}
              familyNetwork={familyNetwork}
              onViewHistory={() => setActiveTab('transactions')}
              exchangeRate={USD_TO_MXN_RATE}
              userBalanceUSD={executiveBalance}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN: "BILL PAY" (STITCH DASHBOARD TAB)                                 */}
        {/* ========================================================================= */}
        {activeTab === 'bill-pay' && (
          <div className="animate-fade-in space-y-4">
            <MexicanBillPayModal
              isScreen={true}
              isOpen={true}
              onPaymentSuccess={handleBillPaymentSuccess}
              selectedServiceId={selectedBillServiceId}
              exchangeRate={USD_TO_MXN_RATE}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: "SEND MONEY" (ARQUITECTURA EXACTA DE LA IMAGEN 1)               */}
        {/* ========================================================================= */}
        {activeTab === 'send' && (
          <div className="animate-fade-in space-y-4">
            {sendSuccessData ? (
              /* ========================================================================= */
              /* SUCCESS SCREEN (ARQUITECTURA EXACTA DEL SCREENSHOT 1 DE REFERENCIA)      */
              /* ========================================================================= */
              <div className="animate-fade-in space-y-4 py-1">
                {/* Header: < | ⋮ */}
                <header className="flex items-center justify-between py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSendSuccessData(null);
                      setActiveTab('home');
                    }}
                    className="btn-circle"
                    title="Volver al Inicio"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-white" />
                  </button>

                  <div className="w-8" />

                  <button
                    type="button"
                    onClick={() => alert('Comprobante verificado con firma criptográfica KIN')}
                    className="btn-circle"
                    title="Opciones"
                  >
                    <DotsVerticalIcon className="w-5 h-5 text-white" />
                  </button>
                </header>

                {/* Center Rosette Badge & Success Info (Screenshot 1) */}
                <div className="text-center pt-1 space-y-3">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto rounded-full bg-[#2ED5A4]/15 flex items-center justify-center border border-[#2ED5A4]/40 shadow-glow-mint">
                      <RosetteBadgeCheckIcon className="w-14 h-14" />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <h2 className="text-2xl font-black text-white tracking-tight">Success!</h2>
                    <p className="text-xs text-[#8E91A5] font-medium">Money sent successfully</p>
                  </div>

                  <div className="pt-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">
                      ${sendSuccessData.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-bold text-[#8E91A5]">USD</span>
                    </h1>
                    <p className="text-xs font-semibold text-[#8E91A5] mt-0.5">
                      ≈ ${(sendSuccessData.amount * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                    </p>
                    <p className="text-xs font-bold text-[#2ED5A4] mt-1">
                      To {sendSuccessData.recipientName} {sendSuccessData.recipientAvatar}
                    </p>
                  </div>
                </div>

                {/* Method details pill */}
                <div className="bg-[#181928] border border-white/10 rounded-2xl p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#8E91A5]">
                    <span>Monto enviado</span>
                    <span className="text-white font-bold">${sendSuccessData.amount.toFixed(2)} USD</span>
                  </div>
                  {sendSuccessData.fee > 0 && (
                    <div className="flex items-center justify-between text-[#8E91A5]">
                      <span>Comisión ({sendSuccessData.paymentTitle})</span>
                      <span className="text-amber-400 font-semibold">+${sendSuccessData.fee.toFixed(2)} USD</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[#8E91A5] pt-1 border-t border-white/5">
                    <span>Total pagado</span>
                    <span className="text-white font-extrabold text-sm">${sendSuccessData.totalPaid.toFixed(2)} USD</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8E91A5] pt-1 border-t border-white/5">
                    <span>Método de entrega</span>
                    <span className="text-[#2ED5A4] font-bold">{sendSuccessData.deliveryTitle}</span>
                  </div>
                </div>

                {/* Statement Pill with Copy button */}
                <div className="bg-[#181928] border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                  <span className="text-xs text-[#8E91A5] font-medium">Request Statement</span>
                  <button
                    type="button"
                    onClick={() => alert(`ID de transacción copiado: ${sendSuccessData.id}`)}
                    className="flex items-center gap-1.5 text-xs text-[#2ED5A4] hover:underline cursor-pointer font-semibold"
                  >
                    <span>{sendSuccessData.id}</span>
                    <CopyIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Timestamp */}
                <p className="text-center text-[11px] text-[#8E91A5]">
                  {sendSuccessData.time}
                </p>

                {/* Outlined Action Buttons: Download PDF & Share Receipt (Screenshot 1) */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => alert('Descargando comprobante PDF encriptado de KIN...')}
                    className="w-full h-12 rounded-2xl bg-[#181928] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
                  >
                    <DownloadIcon className="w-4 h-4 text-[#2ED5A4]" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert('Compartiendo comprobante vía WhatsApp / Mensaje...')}
                    className="w-full h-12 rounded-2xl bg-[#181928] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
                  >
                    <ShareReceiptIcon className="w-4 h-4 text-[#2ED5A4]" />
                    <span>Share Receipt</span>
                  </button>
                </div>

                {/* Bottom Full Width CTA Button: Done → */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSendSuccessData(null);
                      setActiveTab('transactions');
                    }}
                    className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#18A57E] text-white font-headline-md text-title-base font-bold shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] hover:shadow-[0_16px_32px_-4px_rgba(46,213,164,0.6)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Done</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* SEND MONEY FORM (CON VERDE KIN Y TARJETA EXTENDIDA DE PAGO)              */
              /* ========================================================================= */
              <>
                {/* Header: < | Send money | Historial */}
                <header className="flex items-center justify-between py-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="btn-circle"
                    title="Volver al inicio"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-white" />
                  </button>

                  <div className="text-center">
                    <h1 className="text-base font-black text-white tracking-wide">Send money</h1>
                    <span className="text-[10px] font-semibold text-[#2ED5A4] flex items-center justify-center gap-1">
                      <span>USA</span>
                      <span>⇄</span>
                      <span>México</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('transactions')}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-xs font-bold text-[#8E91A5] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Ver historial de envíos"
                  >
                    <DockAnalyticsIcon className="w-3.5 h-3.5" />
                    <span>Historial</span>
                  </button>
                </header>

                {/* Corridor Routing & Lock Banner (Stitch Specs) */}
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
                        <span className="font-caption-sm text-[10px] text-on-surface-variant">Instant Direct Remittance</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest border border-white/10 shrink-0">
                      <span className="material-symbols-outlined text-[#2ED5A4] text-[13px] animate-spin" style={{ animationDuration: '6s' }}>timer</span>
                      <span className="font-financial-mono text-xs text-[#2ED5A4] font-bold">14:59</span>
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* STITCH DUAL LIVE EXCHANGE CALCULATOR                                      */}
                {/* ========================================================================= */}
                <div className="relative flex flex-col space-y-2">
                  {/* You Send Card */}
                  <div className="rounded-2xl bg-surface-container-high p-4 shadow-md flex flex-col space-y-3 border border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="font-caption-sm text-xs uppercase text-on-surface-variant font-semibold" htmlFor="send-amount-input">
                        You Send
                      </label>
                      <span className="font-caption-sm text-xs text-primary flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span> No markup rate
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 min-w-0 flex-1">
                        <span className="font-financial-mono text-2xl text-on-surface font-bold tracking-tight">$</span>
                        <input
                          aria-label="Send amount in USD"
                          className="w-full bg-transparent font-financial-mono text-2xl text-on-surface font-bold focus:outline-none placeholder:text-outline"
                          id="send-amount-input"
                          max="2999"
                          min="10"
                          step="10"
                          type="number"
                          value={amountValue}
                          onChange={(e) => setAmountValue(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container shrink-0 shadow-inner border border-white/5">
                        <span className="text-base">🇺🇸</span>
                        <span className="font-title-base text-xs text-on-surface font-bold">USD</span>
                      </div>
                    </div>
                    {/* Quick Amount Increment Pills */}
                    <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none">
                      <button
                        className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright cursor-pointer border border-white/5"
                        onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 50).toFixed(2))}
                        type="button"
                      >
                        +$50
                      </button>
                      <button
                        className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright cursor-pointer border border-white/5"
                        onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 100).toFixed(2))}
                        type="button"
                      >
                        +$100
                      </button>
                      <button
                        className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright cursor-pointer border border-white/5"
                        onClick={() => setAmountValue((prev) => ((parseFloat(prev) || 0) + 200).toFixed(2))}
                        type="button"
                      >
                        +$200
                      </button>
                      <button
                        className="px-2.5 py-1 rounded-lg bg-surface-container text-primary font-financial-mono text-xs active:scale-95 transition-transform hover:bg-surface-bright font-bold cursor-pointer border border-primary/20"
                        onClick={() => setAmountValue('500.00')}
                        type="button"
                      >
                        $500 Max
                      </button>
                    </div>
                  </div>

                  {/* Animated Swap / Ticker Node */}
                  <div className="relative z-10 flex items-center justify-center -my-2.5">
                    <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1F2133] shadow-lg border border-white/10">
                      <span className="material-symbols-outlined text-primary text-[15px]">swap_vert</span>
                      <span className="font-financial-mono text-xs text-on-surface">
                        1 USD = <span className="text-primary font-bold">{USD_TO_MXN_RATE.toFixed(2)} MXN</span>
                      </span>
                      <span className="text-on-surface-variant font-caption-sm">•</span>
                      <span className="font-label-caps text-[10px] text-primary font-bold uppercase tracking-wider">$0 Fee</span>
                    </div>
                  </div>

                  {/* Receiver Gets Card */}
                  <div className="rounded-2xl bg-surface-container p-4 shadow-md flex flex-col space-y-2 border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="font-caption-sm text-xs uppercase text-on-surface-variant font-semibold">
                        Receiver Gets (Guaranteed)
                      </span>
                      <span className="font-caption-sm text-xs text-on-surface-variant font-medium">Instant pickup</span>
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
                        Zero hidden FX spread • Complete amount delivered
                      </span>
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* DELIVERY METHOD SELECTOR (3-TABS GRID)                                    */}
                {/* ========================================================================= */}
                <div className="flex flex-col space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-title-base text-xs text-on-surface font-bold">How will your receiver get it?</span>
                    <span className="font-caption-sm text-xs text-primary font-bold">Free</span>
                  </div>
                  {/* Delivery Method Tabs */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-container-lowest border border-white/5">
                    <button
                      className={`py-2.5 px-1.5 rounded-lg font-caption-sm text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        deliveryMethod === 'cash'
                          ? 'bg-surface-container-high text-primary shadow-sm border border-primary/20'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => setDeliveryMethod('cash')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">payments</span>
                      <span className="truncate">Cash Pickup</span>
                    </button>
                    <button
                      className={`py-2.5 px-1.5 rounded-lg font-caption-sm text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        deliveryMethod === 'bank'
                          ? 'bg-surface-container-high text-primary shadow-sm border border-primary/20'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => setDeliveryMethod('bank')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">account_balance</span>
                      <span className="truncate">Bank (SPEI)</span>
                    </button>
                    <button
                      className={`py-2.5 px-1.5 rounded-lg font-caption-sm text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        deliveryMethod === 'wallet'
                          ? 'bg-surface-container-high text-primary shadow-sm border border-primary/20'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => setDeliveryMethod('wallet')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">smartphone</span>
                      <span className="truncate">Mobile Wallet</span>
                    </button>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* PICKUP PARTNER NETWORK (13 NETWORK CAPSULES)                              */}
                {/* ========================================================================= */}
                {deliveryMethod === 'cash' && (
                  <div className="flex flex-col space-y-3 pt-1 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-title-base text-xs text-on-surface font-bold">Pickup Partner Network</span>
                        <span className="font-caption-sm text-[11px] text-on-surface-variant">
                          40,000+ branch and retail locations in Mexico
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5">
                        <span className="material-symbols-outlined text-primary text-[18px]">storefront</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {CASH_PICKUP_STORES.filter((s) => s.id !== 'any').map((store) => {
                        const isSelected = selectedStore === store.id;
                        const StoreLogo = store.Logo;
                        return (
                          <button
                            key={store.id}
                            type="button"
                            onClick={() => setSelectedStore(store.id)}
                            className={`network-btn relative h-14 rounded-xl bg-white text-slate-900 shadow-md p-1.5 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                              isSelected ? 'ring-2 ring-primary shadow-[0_0_16px_rgba(46,213,164,0.45)]' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="w-full h-7 flex items-center justify-center">
                              <StoreLogo className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[9px] font-bold text-slate-700 leading-tight truncate w-full">
                              {store.badge}
                            </span>
                            {isSelected && (
                              <span className="selected-pill absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-[11px] font-bold">check</span>
                              </span>
                            )}
                          </button>
                        );
                      })}

                      {/* 13. Any Available Network Partner (Full Span) */}
                      <button
                        type="button"
                        onClick={() => setSelectedStore('any')}
                        className={`network-btn col-span-3 h-12 rounded-xl bg-white text-slate-900 shadow-sm px-3 flex items-center justify-between text-left transition-all cursor-pointer ${
                          selectedStore === 'any' ? 'ring-2 ring-primary shadow-[0_0_16px_rgba(46,213,164,0.45)]' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary-container text-[20px]">hub</span>
                          <div className="flex flex-col leading-tight">
                            <span className="font-title-base text-xs font-bold text-slate-900">
                              Any Available Network Partner
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              Receiver picks up at any of 40,000+ locations
                            </span>
                          </div>
                        </div>
                        {selectedStore === 'any' && (
                          <span className="selected-pill w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-[11px] font-bold">check</span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* BANK (SPEI) SELECTION                                                     */}
                {/* ========================================================================= */}
                {deliveryMethod === 'bank' && (
                  <div className="flex flex-col space-y-2.5 pt-1 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-title-base text-xs text-on-surface font-bold">Bank SPEI Beneficiary</span>
                      <span className="font-caption-sm text-[11px] text-primary font-bold">24/7 Instant</span>
                    </div>
                    <div
                      onClick={() => setShowContactModal(true)}
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
                                  CLABE: {selectedAvatar.clabe || 'SPEI Interbancario'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-dashed border-primary/30 flex-shrink-0">
                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-title-base text-xs font-bold text-white truncate">Selecciona un beneficiario</p>
                                <p className="text-[11px] text-on-surface-variant truncate">Toca para elegir de tu lista o agregar uno</p>
                              </div>
                            </>
                          )}
                        </div>
                        {selectedAvatar ? (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-[10px] text-primary font-semibold">Cambiar</span>
                            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-bold flex-shrink-0">
                            Elegir
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* MOBILE WALLET SELECTION                                                   */}
                {/* ========================================================================= */}
                {deliveryMethod === 'wallet' && (
                  <div className="flex flex-col space-y-2.5 pt-1 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-title-base text-xs text-on-surface font-bold">Mobile Wallet Destination</span>
                      <span className="font-caption-sm text-[11px] text-primary font-bold">Zero Fee</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="p-3 rounded-xl bg-surface-container border border-primary text-left transition-all shadow-[0_0_16px_rgba(46,213,164,0.3)] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
                        <p className="font-title-base text-xs font-bold text-white mt-1">KIN Cash</p>
                        <p className="text-[10px] text-primary">Direct P2P Transit</p>
                      </button>
                      <button
                        type="button"
                        className="p-3 rounded-xl bg-surface-container border border-white/10 text-left transition-all hover:border-white/20 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-secondary text-[22px]">smartphone</span>
                        <p className="font-title-base text-xs font-bold text-white mt-1">Mercado Pago</p>
                        <p className="text-[10px] text-on-surface-variant">Instant Transfer</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* TRANSPARENT FEE BREAKDOWN CARD                                            */}
                {/* ========================================================================= */}
                <div className="rounded-2xl bg-surface-container p-4 shadow-md space-y-2.5 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="font-caption-sm text-xs text-on-surface-variant">Transfer Fee</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-financial-mono text-xs text-on-surface-variant line-through">$4.99</span>
                      <span className="font-financial-mono text-xs text-primary font-bold">$0.00 Free</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-caption-sm text-xs text-on-surface-variant">Exchange Rate Guaranteed</span>
                    <span className="font-financial-mono text-xs text-on-surface font-semibold">1 USD = {USD_TO_MXN_RATE.toFixed(2)} MXN</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-caption-sm text-xs text-on-surface-variant">Estimated Delivery Time</span>
                    <span className="font-caption-sm text-xs text-primary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">bolt</span> Within 5 minutes
                    </span>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <span className="font-title-base text-xs text-on-surface font-bold">Total to Charge</span>
                    <span className="font-financial-mono text-sm text-primary font-bold">
                      ${(parseFloat(amountValue) || 300).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* PERSISTENT STICKY PRIMARY CTA (EXACT STITCH SPECS)                        */}
                {/* ========================================================================= */}
                <div className="sticky bottom-20 z-30 pt-2 pb-1">
                  <button
                    type="button"
                    onClick={handleSendNow}
                    className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#18A57E] text-white font-headline-md text-title-base font-bold shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
                  >
                    <span>{language === 'en' ? 'Continue to Beneficiary' : 'Continuar al Beneficiario'}</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>

                {/* Spacer */}
                <div className="h-14 w-full pointer-events-none" aria-hidden="true" />
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: "BILL PAYMENTS" (IMAGEN 2 CENTRO)                                */}
        {/* ========================================================================= */}
        {activeTab === 'bills' && (
          <div className="animate-fade-in space-y-4">
            {/* Header: < | Bill Payments */}
            <header className="flex items-center justify-between py-1">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="btn-circle"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-base font-bold text-white tracking-wide">Bill Payments</h1>
              <div className="w-10" />
            </header>

            {/* Opciones para pagar bills: Desplazables de izquierda a derecha (Estilo Recent) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#8E91A5] uppercase tracking-wider">
                  Pagar Servicios
                </span>
                <span className="text-[10px] text-[#2ED5A4] font-semibold flex items-center gap-1">
                  <span>Desliza</span>
                  <span>← →</span>
                </span>
              </div>

              {/* Fila desplazable con toque y arrastre (Touch & Hold horizontal scroll) */}
              <div className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-hide select-none cursor-grab active:cursor-grabbing">
                {BILL_SERVICES.map((serv) => {
                  const isSelected = selectedBillServiceId === serv.id;
                  const Icon = serv.Icon;
                  return (
                    <button
                      key={serv.id}
                      type="button"
                      onClick={() => {
                        setSelectedBillServiceId(serv.id);
                        setShowBillPayModal(true);
                      }}
                      className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
                    >
                      <div
                        className={`w-13 h-13 rounded-full flex items-center justify-center transition-all shadow-md ${
                          isSelected
                            ? 'border-2 border-[#2ED5A4] bg-[#2ED5A4]/15 shadow-glow-mint scale-105 text-[#2ED5A4]'
                            : 'border border-white/10 bg-[#181928] text-white hover:border-[#2ED5A4] hover:bg-[#202236]'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[11px] font-semibold transition-colors text-center ${
                          isSelected ? 'text-[#2ED5A4]' : 'text-[#8E91A5] group-hover:text-white'
                        }`}
                      >
                        {serv.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Bills (Historial Dinámico de Facturas & Servicios) */}
            <div>
              <h3 className="text-xs font-bold text-white mb-2 px-1">
                Facturas & Servicios Pagados
              </h3>
              {transactions.filter(t => t.category.includes('Servicio') || t.category.includes('Factura') || t.iconType === 'luz' || t.iconType === 'internet' || t.iconType === 'phone' || t.iconType === 'bill').length === 0 ? (
                <div className="p-5 rounded-2xl bg-[#181928] border border-white/5 text-center space-y-1.5">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white">
                    <LightningIcon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-bold text-white">Sin facturas pagadas</p>
                  <p className="text-[10px] text-[#8E91A5] max-w-[280px] mx-auto">
                    Selecciona un servicio arriba para realizar una prueba y ver aquí el registro.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions
                    .filter(t => t.category.includes('Servicio') || t.category.includes('Factura') || t.iconType === 'luz' || t.iconType === 'internet' || t.iconType === 'phone' || t.iconType === 'bill')
                    .map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between hover:border-white/15 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                            {renderTransactionIcon(tx)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-tight">{tx.title}</p>
                            <p className="text-[10px] text-[#8E91A5] mt-0.5">{tx.category} • {tx.time}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#FF5555]" style={{ color: '#FF5555' }}>
                          {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: "TRANSACTIONS" (DASHBOARD EXCLUSIVO Y ORDENADO DE MOVIMIENTOS)  */}
        {/* ========================================================================= */}
        {activeTab === 'transactions' && (
          <div className="animate-fade-in space-y-4">
            {/* Header: < | Transactions | Total Movimientos Badge */}
            <header className="flex items-center justify-between py-1">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="btn-circle"
                title="Volver al Home"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
              <div className="text-center">
                <h1 className="text-base font-bold text-white tracking-wide">Transactions</h1>
                <p className="text-[10px] text-[#2ED5A4] font-medium flex items-center justify-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
                  Movimientos en tiempo real
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-xs font-bold text-[#8E91A5] shadow-sm"
                title={`${transactions.length} transacciones registradas`}
              >
                {transactions.length}
              </div>
            </header>

            {/* Listado Exclusivo de Transacciones de Forma Ordenada por Fecha */}
            <div className="space-y-4 pt-1">
              {transactions.length === 0 ? (
                /* Estado vacío si no hay transacciones */
                <div className="p-8 rounded-3xl bg-[#181928] border border-white/5 text-center space-y-2.5">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white">
                    <CardOutlineIcon className="w-7 h-7 text-[#2ED5A4]" />
                  </div>
                  <p className="text-sm font-bold text-white">Sin movimientos registrados</p>
                  <p className="text-xs text-[#8E91A5] max-w-[260px] mx-auto leading-relaxed">
                    Las transacciones que realices se organizarán de forma cronológica aquí.
                  </p>
                </div>
              ) : (
                /* Renderizado agrupado y ordenado cronológicamente */
                (['Hoy', 'Ayer', 'Esta semana', 'Anteriores'] as const).map((groupKey) => {
                  const itemsInGroup = groupedTransactions[groupKey] || [];
                  if (itemsInGroup.length === 0) return null;

                  return (
                    <div key={groupKey} className="space-y-2">
                      {/* Cabecera de grupo temporal ordenada */}
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#8E91A5]">
                          {groupKey}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-[#8E91A5] border border-white/5">
                          {itemsInGroup.length} {itemsInGroup.length === 1 ? 'movimiento' : 'movimientos'}
                        </span>
                      </div>

                      {/* Tarjetas de transacciones del bloque */}
                      <div className="space-y-2">
                        {itemsInGroup.map((tx) => {
                          const isIncome = tx.type === 'income';
                          return (
                            <div
                              key={tx.id}
                              className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between hover:border-white/15 hover:bg-[#1E2033] transition-all cursor-default"
                            >
                              <div className="flex items-center gap-3">
                                {/* Icono del movimiento con micro-badge de flujo */}
                                <div className="relative flex-shrink-0">
                                  <div className="w-11 h-11 rounded-2xl bg-[#202236] border border-white/10 flex items-center justify-center text-white shadow-sm">
                                    {renderTransactionIcon(tx)}
                                  </div>
                                  <div
                                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#181928] text-[8px] font-black ${
                                      isIncome ? 'bg-[#2ED5A4] text-[#06070B]' : 'bg-[#7047EB] text-white'
                                    }`}
                                  >
                                    {isIncome ? '↓' : '↑'}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs font-bold text-white leading-tight">{tx.title}</p>
                                  <p className="text-[10px] text-[#8E91A5] mt-0.5 flex items-center gap-1.5">
                                    <span>{tx.category}</span>
                                    <span>•</span>
                                    <span>{tx.time}</span>
                                    {tx.refNumber && (
                                      <>
                                        <span>•</span>
                                        <span className="text-[#8E91A5]/75 font-mono text-[9px]">
                                          {tx.refNumber}
                                        </span>
                                      </>
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* Monto e importe en moneda local / estatus */}
                              <div className="text-right flex-shrink-0">
                                {currencyPref === 'USD' ? (
                                  <>
                                    <p
                                      className={`text-xs font-black tracking-tight ${
                                        isIncome ? 'text-[#2ED5A4]' : 'text-white'
                                      }`}
                                    >
                                      {isIncome ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                                      <span className="text-[10px] text-[#8E91A5] font-semibold ml-0.5">USD</span>
                                    </p>
                                    <p className="text-[10px] text-[#8E91A5] mt-0.5 font-medium">
                                      {tx.amountMXN ? (
                                        <span>
                                          ≈ ${tx.amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                                        </span>
                                      ) : (
                                        <span className="text-[#2ED5A4] font-semibold">
                                          {language === 'en' ? 'Completed ✓' : 'Completado ✓'}
                                        </span>
                                      )}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p
                                      className={`text-xs font-black tracking-tight ${
                                        isIncome ? 'text-[#2ED5A4]' : 'text-white'
                                      }`}
                                    >
                                      {isIncome
                                        ? `+$${(tx.amountMXN || (tx.amount * USD_TO_MXN_RATE)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : `-$${Math.abs(tx.amountMXN || (tx.amount * USD_TO_MXN_RATE)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                      <span className="text-[10px] text-[#8E91A5] font-semibold ml-0.5">MXN</span>
                                    </p>
                                    <p className="text-[10px] text-[#8E91A5] mt-0.5 font-medium">
                                      <span>
                                        ≈ ${Math.abs(tx.amount).toFixed(2)} USD
                                      </span>
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: "MY WALLET" (KIN VISA DEBIT CARD & BÓVEDA DE DIVISAS)          */}
        {/* ========================================================================= */}
        {activeTab === 'wallet' && (
          <div className="animate-fade-in space-y-4">
            {/* Header: < | My Wallet | Shield */}
            <header className="flex items-center justify-between py-1">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="btn-circle"
                title="Volver a Home"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
              <div className="text-center">
                <h1 className="text-base font-bold text-white tracking-wide">My Wallet</h1>
                <span className="text-[10px] text-[#2ED5A4] font-medium flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
                  KIN Digital Vault
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="btn-circle"
                title="Configuración & Ajustes"
              >
                <SettingsGearIcon className="w-5 h-5 text-white" />
              </button>
            </header>

            {/* KIN Platinum Debit Card */}
            <div className={`relative p-5 rounded-3xl bg-gradient-to-br from-[#1C1D2F] via-[#141524] to-[#0A0B12] border transition-all duration-300 shadow-2xl overflow-hidden ${
              cardFrozen ? 'border-[#FF5555]/40 opacity-75 grayscale-[50%]' : 'border-[#2ED5A4]/30'
            }`}>
              {/* Card Ambient Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#2ED5A4]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#7047EB]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Top: KIN Logo & Chip */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#2ED5A4] text-[#06070B] font-black flex items-center justify-center text-sm shadow-md">
                    K
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-white tracking-wider block">KIN CARD</span>
                    <span className="text-[9px] text-[#8E91A5] font-semibold">VISA PLATINUM</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cardFrozen && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FF5555]/20 border border-[#FF5555]/40 text-[#FF5555] text-[10px] font-bold">
                      ❄️ Congelada
                    </span>
                  )}
                  {/* Contactless Waves */}
                  <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M8.5 16.5a6 6 0 010-9M12 19a10 10 0 010-14M15.5 21.5a14 14 0 010-19" />
                  </svg>
                </div>
              </div>

              {/* Card Chip & Balance */}
              <div className="my-5 relative z-10 flex items-center justify-between">
                {/* EMV Chip */}
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] border border-[#8C6D1F] relative overflow-hidden flex items-center justify-center shadow-inner">
                  <div className="w-full h-0.5 bg-[#8C6D1F]/50 absolute" />
                  <div className="h-full w-0.5 bg-[#8C6D1F]/50 absolute" />
                </div>

                {/* Card Balance */}
                <div className="text-right">
                  <span className="text-[10px] text-[#8E91A5] block">
                    {language === 'en' ? 'Card Balance' : 'Saldo en Tarjeta'}
                  </span>
                  <span className="text-lg font-black text-white tracking-tight">
                    {currencyPref === 'USD' ? (
                      <>
                        ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                        <span className="text-[10px] font-bold text-[#2ED5A4]">USD</span>
                      </>
                    ) : (
                      <>
                        ${(netBalance * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                        <span className="text-[10px] font-bold text-[#2ED5A4]">MXN</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Card Number & Details */}
              <div className="relative z-10 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-bold text-white tracking-widest">
                    {showCardDetails ? '4892  3100  8824  4892' : '••••  ••••  ••••  4892'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCardDetails(!showCardDetails)}
                    className="text-[10px] text-[#2ED5A4] hover:underline font-semibold cursor-pointer"
                  >
                    {showCardDetails ? 'Ocultar' : 'Revelar'}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3 text-[10px]">
                  <div>
                    <span className="text-[#8E91A5] block uppercase text-[8px] font-bold">Titular</span>
                    <span className="text-white font-bold tracking-wide">{userName.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-[#8E91A5] block uppercase text-[8px] font-bold">Expira</span>
                    <span className="text-white font-mono font-bold">08/29</span>
                  </div>
                  <div>
                    <span className="text-[#8E91A5] block uppercase text-[8px] font-bold">CVV</span>
                    <span className="text-white font-mono font-bold">{showCardDetails ? '481' : '•••'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Card Controls (3 Botones Ergonómicos) */}
            <div className="grid grid-cols-3 gap-2">
              {/* Congelar */}
              <button
                type="button"
                onClick={() => setCardFrozen(!cardFrozen)}
                className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                  cardFrozen
                    ? 'bg-[#FF5555]/15 border-[#FF5555]/40 text-[#FF5555]'
                    : 'bg-[#181928] border-white/5 text-[#8E91A5] hover:text-white hover:border-white/15'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#202236] flex items-center justify-center text-current text-sm">
                  {cardFrozen ? '❄️' : '🔒'}
                </div>
                <span className="text-[11px] font-bold leading-tight">
                  {cardFrozen ? 'Descongelar' : 'Congelar'}
                </span>
              </button>

              {/* Ver PIN */}
              <button
                type="button"
                onClick={() => alert('Tu PIN de cajero es: 4892 (Encriptado con FaceID)')}
                className="p-3 rounded-2xl bg-[#181928] border border-white/5 text-[#8E91A5] hover:text-white hover:border-white/15 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#202236] flex items-center justify-center text-white text-sm">
                  🔑
                </div>
                <span className="text-[11px] font-bold text-white leading-tight">
                  Ver PIN
                </span>
              </button>

              {/* Límite */}
              <button
                type="button"
                onClick={() => alert('Límite diario actual: $5,000.00 USD')}
                className="p-3 rounded-2xl bg-[#181928] border border-white/5 text-[#8E91A5] hover:text-white hover:border-white/15 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#202236] flex items-center justify-center text-white text-sm">
                  ⚙️
                </div>
                <span className="text-[11px] font-bold text-white leading-tight">
                  Límites
                </span>
              </button>
            </div>

            {/* Desglose de Balances (USD & MXN) */}
            <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3">
              <span className="text-xs font-bold text-[#8E91A5] uppercase tracking-wider block">
                Bóvedas de Divisas
              </span>

              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-[#0E0F1A] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white font-bold text-xs">
                      🇺🇸
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Billetera USD</p>
                      <p className="text-[10px] text-[#8E91A5]">Cuenta principal KIN</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white">
                      ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] text-[#2ED5A4] font-semibold">USD Activo</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#0E0F1A] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white font-bold text-xs">
                      🇲🇽
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Bóveda SPEI MXN</p>
                      <p className="text-[10px] text-[#8E91A5]">Tipo de cambio $20.45 MXN/USD</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white">
                      ${(netBalance * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] text-[#8E91A5] font-semibold">MXN Equivalente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 6: "SEND QUICK DASHBOARD" (DASHBOARD NATIVO MÓVIL EN 1 TOQUE)     */}
        {/* ========================================================================= */}
        {activeTab === 'send-quick' && (
          <div className="animate-fade-in space-y-4 pb-28">
            {/* Native Mobile Header: < | Send Quick | Info */}
            <header className="flex items-center justify-between py-1">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="btn-circle"
                title="Volver a Home"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-wide">Send Quick</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[#2ED5A4] text-[10px] font-black tracking-wider">
                    ⚡ 1-TAP
                  </span>
                </div>
                <span className="text-[10px] text-[#8E91A5] block">
                  Envío SPEI ultrarrápido sin pasos innecesarios
                </span>
              </div>
              <button
                type="button"
                onClick={() => alert('Send Quick te permite enviar dinero a tus destinatarios frecuentes con 1 solo toque, con acreditación instantánea en México vía SPEI Banxico.')}
                className="btn-circle"
                title="Información"
              >
                <span className="text-xs font-bold text-white">ℹ️</span>
              </button>
            </header>

            {/* 1. Recipient Selection Card (Diseño Nativo Ergonómico) */}
            <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8E91A5] uppercase tracking-wider">
                  Destinatario Frecuente
                </span>
                <span className="text-[10px] text-[#2ED5A4] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
                  SPEI Activo
                </span>
              </div>

              {/* Recipient Selection or Empty State */}
              {contactsList.length === 0 ? (
                <div
                  onClick={() => setShowContactModal(true)}
                  className="p-5 rounded-2xl bg-[#0E0F1A] border border-dashed border-white/15 flex items-center gap-3 cursor-pointer hover:border-[#2ED5A4]/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#202236] border border-white/10 flex items-center justify-center text-[#2ED5A4] flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">person_add</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">Sin contactos registrados</p>
                    <p className="text-xs text-[#8E91A5] truncate">Toca aquí para agregar a tu familia en México</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] text-xs font-bold border border-[#2ED5A4]/20 flex-shrink-0">
                    + Agregar
                  </span>
                </div>
              ) : (
                <>
                  {/* Horizontal Contact Selector */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
                    {contactsList.map((c, idx) => {
                      const isSelected = sendQuickSelectedRecipient === idx;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSendQuickSelectedRecipient(idx)}
                          className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-[#2ED5A4]/15 border-[#2ED5A4] text-white shadow-md shadow-[#2ED5A4]/10'
                              : 'bg-[#202236] border-white/5 text-[#8E91A5] hover:text-white hover:border-white/15'
                          }`}
                          style={{ minWidth: '78px' }}
                        >
                          <div className="relative">
                            <img
                              src={c.photoUrl}
                              alt={c.name}
                              className={`w-12 h-12 rounded-full object-cover border-2 transition-all ${
                                isSelected ? 'border-[#2ED5A4]' : 'border-white/10'
                              }`}
                            />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2ED5A4] flex items-center justify-center text-white text-[9px] font-black shadow-sm">
                                ✓
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold truncate max-w-[70px]">
                            {c.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setShowContactModal(true)}
                      className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border border-dashed border-white/15 text-[#8E91A5] hover:text-white hover:border-white/30 transition-all flex-shrink-0 cursor-pointer"
                      style={{ minWidth: '78px', height: '84px' }}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#202236] flex items-center justify-center text-[#2ED5A4]">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                      </div>
                      <span className="text-[10px] font-bold">Nuevo</span>
                    </button>
                  </div>

                  {/* Active Recipient Details Banner */}
                  {(() => {
                    const currentRecipient = contactsList[sendQuickSelectedRecipient] || contactsList[0];
                    if (!currentRecipient) return null;
                    return (
                      <div className="p-3 rounded-2xl bg-[#0E0F1A] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center font-bold text-sm text-[#2ED5A4] flex-shrink-0">
                            {currentRecipient.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{currentRecipient.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {getBankLogoUrl(currentRecipient.bank) && (
                                <div className="w-3.5 h-3.5 rounded bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                                  <img src={getBankLogoUrl(currentRecipient.bank)!} alt={currentRecipient.bank} className="w-full h-full object-contain" />
                                </div>
                              )}
                              <p className="text-[10px] text-white/90 truncate">
                                {currentRecipient.bank || 'Cuenta Bancaria SPEI'} • CLABE verificada
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] text-[10px] font-bold border border-[#2ED5A4]/20 flex-shrink-0">
                          ✓ Listo
                        </span>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>

            {/* 2. Hero Amount Card (Gran Tipografía Móvil & Chips) */}
            <div className="p-5 rounded-3xl bg-[#181928] border border-white/5 space-y-4 shadow-lg text-center">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                Monto del Envío Rápido
              </span>

              {/* Display Gigante del Monto */}
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-black text-white/70">$</span>
                <input
                  type="number"
                  value={sendQuickAmount}
                  onChange={(e) => setSendQuickAmount(e.target.value)}
                  className="text-4xl font-black text-white bg-transparent text-center focus:outline-none w-36 tracking-tight"
                  placeholder="0"
                />
                <span className="text-sm font-bold text-[#2ED5A4] tracking-wide">USD</span>
              </div>

              {/* Conversión en Vivo con Tasa SPEI */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202236] border border-white/5 text-center">
                <span className="text-xs font-bold text-white">
                  ≈ ${((parseFloat(sendQuickAmount) || 0) * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                </span>
                <span className="text-[10px] text-white/60">|</span>
                <span className="text-[10px] text-[#2ED5A4] font-semibold">1 USD = $20.45 MXN</span>
              </div>

              {/* 4 Chips de Monto Ergonómicos (Touch Targets de 52px) */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {['25', '50', '100', '200'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSendQuickAmount(val)}
                    className={`h-12 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                      sendQuickAmount === val
                        ? 'bg-[#2ED5A4] text-white shadow-md shadow-[#2ED5A4]/20 scale-[1.02]'
                        : 'bg-[#202236] border border-white/5 text-white hover:bg-[#2B2C42]'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Beneficios SPEI / Fuente de Fondos */}
            <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#8E91A5]">
                <span>Origen de fondos:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <span>🟢</span> KIN Digital Wallet (${netBalance.toFixed(2)} USD)
                </span>
              </div>
              <div className="flex items-center justify-between text-[#8E91A5]">
                <span>Comisión de transferencia:</span>
                <span className="font-bold text-[#2ED5A4]">GRATIS ($0.00 USD)</span>
              </div>
              <div className="flex items-center justify-between text-[#8E91A5]">
                <span>Tiempo de acreditación:</span>
                <span className="font-bold text-white">⚡ Menos de 30 segundos</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 7: "MY PROFILE" (INFORMACIÓN COMPLETA DE REGISTRO & COMPLIANCE)   */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in space-y-4 pb-4">
            {/* Header: < | My Profile | SettingsGearIcon */}
            <header className="flex items-center justify-between py-1">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="btn-circle"
                title="Volver al Home"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
              <div className="text-center">
                <h1 className="text-base font-bold text-white tracking-wide">My Profile</h1>
                <p className="text-[10px] text-[#2ED5A4] font-medium flex items-center justify-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
                  {userKycTier ? userKycTier.split(' (')[0] : 'Tier 1'} • Cuenta Activa
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="btn-circle"
                title="Configuración & Ajustes"
              >
                <SettingsGearIcon className="w-5 h-5 text-white" />
              </button>
            </header>

            {/* 1. Hero Card: Avatar Proporcional Estándar Móvil (56px), Nombre, Email, Folio & Badge */}
            <div className="p-4 rounded-3xl bg-[#181928] border border-white/10 text-center relative overflow-hidden shadow-xl space-y-2.5">
              {/* Brillo ambiental sutil en cabecera */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-36 bg-[#2ED5A4]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Avatar Estándar Móvil (56px) con micro-badge de cámara ergonómico */}
              <div className="relative inline-block mx-auto">
                <div className="w-14 h-14 rounded-full p-0.5 border-2 border-[#2ED5A4]/40 shadow-md shadow-[#2ED5A4]/15 overflow-hidden bg-[#202236] flex items-center justify-center">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName || 'Perfil'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-white/5 text-[#8E91A5]">
                      <span className="material-symbols-outlined text-[28px] text-[#8E91A5]">person</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleOpenAvatarPicker}
                  className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-[#202236] border border-white/20 flex items-center justify-center text-[#2ED5A4] shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title={userAvatar ? "Cambiar foto de perfil" : "Agregar foto de perfil"}
                >
                  <CameraIcon className="w-3 h-3" />
                </button>
                {userAvatar && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#2ED5A4] border-2 border-[#181928]" />
                )}
              </div>

              {/* Nombre y Correo en Escala Proporcional Estándar */}
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  {userFirstName} {userLastName}
                </h2>
                <p className="text-[11px] text-[#8E91A5] font-medium mt-0.5">{userEmail}</p>
              </div>

              {/* Badges de Estatus & Folio de Cliente con función de copiado */}
              <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyClientId}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202236] border border-white/10 text-xs font-bold text-white hover:border-[#2ED5A4] transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Copiar Folio de Cliente"
                >
                  <span className="text-[#8E91A5] font-normal">ID:</span>
                  <span className="font-mono text-[11px] text-[#2ED5A4]">{userClientId}</span>
                  <CopyIcon className="w-3 h-3 text-[#8E91A5]" />
                  {copiedClientId && (
                    <span className="text-[10px] text-[#2ED5A4] font-semibold animate-fade-in">✓</span>
                  )}
                </button>

                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[10px] font-bold text-[#2ED5A4]">
                  <span>✓</span>
                  <span>KYC Verificado</span>
                </div>
              </div>
            </div>

            {/* 2. Sección: Datos Personales & Contacto de Registro */}
            <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5]">
                  Datos de Registro & Contacto
                </span>
                <button
                  type="button"
                  onClick={handleOpenAvatarPicker}
                  className="text-xs font-bold text-[#2ED5A4] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Editar</span>
                  <span>✎</span>
                </button>
              </div>

              {/* Fila 1: Nombre Legal */}
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
                    <UserIcon className="w-4 h-4 text-[#8E91A5]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E91A5] block">Nombre Legal</span>
                    <span className="text-xs font-bold text-white">{userFirstName} {userLastName}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-[#8E91A5]">
                  Titular
                </span>
              </div>

              {/* Fila 2: Correo Registrado */}
              <div className="flex items-center justify-between py-1.5 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
                    <MailIcon className="w-4 h-4 text-[#8E91A5]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E91A5] block">Correo Electrónico</span>
                    <span className="text-xs font-bold text-white truncate max-w-[190px] block">{userEmail}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
                  Verificado
                </span>
              </div>

              {/* Fila 3: Teléfono Móvil con 2FA */}
              <div className="flex items-center justify-between py-1.5 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
                    <PhoneIcon className="w-4 h-4 text-[#8E91A5]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E91A5] block">Teléfono Móvil</span>
                    <span className="text-xs font-bold text-white">{userPhone}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
                  2FA Activo
                </span>
              </div>

              {/* Fila 4: Domicilio / Residencia en USA */}
              <div className="flex items-center justify-between py-1.5 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
                    <HouseRentIcon className="w-4 h-4 text-[#8E91A5]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E91A5] block">Residencia Oficial</span>
                    <span className="text-xs font-bold text-white">{userCity}, {userState} ({userZip})</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#8E91A5]">
                  USA 🇺🇸
                </span>
              </div>

              {/* Fila 5: Fecha de Alta */}
              <div className="flex items-center justify-between py-1.5 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
                    <RosetteBadgeCheckIcon className="w-4 h-4 text-[#8E91A5]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E91A5] block">Fecha de Registro</span>
                    <span className="text-xs font-bold text-white">{userMemberSince}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#2ED5A4]">
                  Cuenta Activa
                </span>
              </div>
            </div>

            {/* 3. Sección: Cumplimiento Regulatorio, KYC & Bóveda */}
            <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5] block pb-1">
                Cumplimiento Regulatorio (Fintech KYC/AML)
              </span>

              {/* Nivel de Cuenta & Límite Transaccional */}
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/20 flex items-center justify-center text-[#2ED5A4]">
                    <ShieldCheckIcon className="w-4 h-4 text-[#2ED5A4]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E91A5] block">Nivel de Cuenta</span>
                    <span className="text-xs font-bold text-white">{userKycTier}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#2ED5A4]">{userDailyLimit}</span>
              </div>

              {/* Documento Oficial Validado */}
              <div className="flex items-center justify-between py-1.5 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
                    <CardOutlineIcon className="w-4 h-4 text-[#8E91A5]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E91A5] block">Documento Validado</span>
                    <span className="text-xs font-bold text-white">{userDocType}</span>
                    <span className="text-[9px] text-[#8E91A5] block">Folio {userDocNumber} • OCR Forense Gemini</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
                  Verificado ✓
                </span>
              </div>

              {/* ClientVault Bóveda Cero Conocimiento */}
              <div className="flex items-center justify-between py-1.5 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-[#8E91A5]">
                    <LockIcon className="w-4 h-4 text-[#8E91A5]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E91A5] block">Bóveda Cero Conocimiento</span>
                    <span className="text-xs font-bold text-white">ClientVault AES-GCM-256</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVaultModal(true)}
                  className="text-xs font-bold text-[#2ED5A4] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Abrir Bóveda</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* 4. Sección: Métodos de Pago Vinculados */}
            <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5] block pb-1">
                Métodos de Pago Registrados
              </span>

              {/* Tarjeta de Débito Visa */}
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-white">
                    <CardOutlineIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E91A5] block">Tarjeta de Débito Principal</span>
                    <span className="text-xs font-bold text-white">Visa KIN •••• 4242</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white border border-white/10">
                  Predeterminada
                </span>
              </div>

              {/* Cuenta Bancaria ACH Chase */}
              <div className="flex items-center justify-between py-1.5 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202236] border border-white/5 flex items-center justify-center text-white">
                    <BankBuildingIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E91A5] block">Cuenta Bancaria USA (ACH)</span>
                    <span className="text-xs font-bold text-white">Chase Bank •••• 8910</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/20">
                  Conectada
                </span>
              </div>
            </div>

            {/* 5. Sección: Seguridad & Preferencias Táctiles */}
            <div className="p-4 rounded-3xl bg-[#181928] border border-white/5 space-y-3 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8E91A5] block pb-1">
                Seguridad & Preferencias
              </span>

              {/* Switch Biometría FaceID */}
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'en' ? 'Biometric Authentication (Face ID)' : 'Autenticación Biométrica (Face ID)'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {language === 'en' ? 'Quick access & SPEI authorizations' : 'Acceso rápido y confirmación de envíos SPEI'}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={biometricsEnabled}
                  onToggle={() => setBiometricsEnabled(!biometricsEnabled)}
                  title={language === 'en' ? 'Face ID' : 'Biometría'}
                />
              </div>

              {/* Switch Notificaciones de Envíos */}
              <div className="flex items-center justify-between py-1.5 border-t border-white/5">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'en' ? 'Real-Time Notifications' : 'Notificaciones en Tiempo Real'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {language === 'en' ? 'Delivery confirmations & FX quotes' : 'Confirmaciones de entrega y cotizaciones FX'}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={pushNotificationsEnabled}
                  onToggle={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
                  title={language === 'en' ? 'Notifications' : 'Notificaciones'}
                />
              </div>
            </div>

            {/* 6. Botones de Acción: Editar Perfil & Cerrar Sesión */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleOpenAvatarPicker}
                className="w-full h-13 rounded-2xl bg-[#202236] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-black text-white hover:bg-[#2B2C42] transition-all cursor-pointer shadow-md"
              >
                <span>✎</span>
                <span>Editar Información del Perfil</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-12 rounded-2xl bg-[#181928] border border-[#FF5555]/20 hover:border-[#FF5555]/50 hover:bg-[#FF5555]/10 flex items-center justify-center gap-2 text-xs font-bold text-[#FF5555] transition-all cursor-pointer shadow-sm"
              >
                <span>Cerrar Sesión Segura</span>
              </button>
            </div>
          </div>
        )}
        </main>

        {/* ========================================================================= */}
        {/* STITCH MASTER BOTTOM DOCK (5 TABS: HOME, SEND, KIN CASH, BILL PAY, VAULT) */}
        {/* ========================================================================= */}
        {!sendSuccessData && activeTab !== 'send-quick' && (
          <nav
            className="stitch-bottom-dock"
            style={{ backgroundColor: '#000000', opacity: 1 }}
            data-active-classes="text-primary font-bold scale-105"
          >
            <div className="h-16 w-full flex items-center justify-around px-2">
              {/* 1. Home */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('home');
                  setShowKinCashModal(false);
                  setShowBillPayModal(false);
                  setShowVaultModal(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'home' && !showKinCashModal && !showBillPayModal && !showVaultModal
                    ? 'text-primary font-bold scale-105'
                    : 'text-on-surface-variant hover:text-white'
                }`}
                title="Home"
              >
                <span className="material-symbols-outlined text-[24px]">home</span>
                <span className="font-label-caps text-[10px] tracking-tight">Home</span>
              </button>

              {/* 2. Send */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('send');
                  setShowKinCashModal(false);
                  setShowBillPayModal(false);
                  setShowVaultModal(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'send' && !showKinCashModal && !showBillPayModal && !showVaultModal
                    ? 'text-primary font-bold scale-105'
                    : 'text-on-surface-variant hover:text-white'
                }`}
                title="Send"
              >
                <span className="material-symbols-outlined text-[24px]">send</span>
                <span className="font-label-caps text-[10px] tracking-tight">Send</span>
              </button>

              {/* 3. Kin Cash */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('kin-cash');
                  setShowKinCashModal(false);
                  setShowBillPayModal(false);
                  setShowVaultModal(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'kin-cash'
                    ? 'text-primary font-bold scale-105'
                    : 'text-on-surface-variant hover:text-white'
                }`}
                title="Kin Cash"
              >
                <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                <span className="font-label-caps text-[10px] tracking-tight">Kin Cash</span>
              </button>

              {/* 4. Bill Pay */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('bill-pay');
                  setShowBillPayModal(false);
                  setShowKinCashModal(false);
                  setShowVaultModal(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'bill-pay'
                    ? 'text-primary font-bold scale-105'
                    : 'text-on-surface-variant hover:text-white'
                }`}
                title="Bill Pay"
              >
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                <span className="font-label-caps text-[10px] tracking-tight">Bill Pay</span>
              </button>

              {/* 5. Vault */}
              <button
                type="button"
                onClick={() => {
                  setShowVaultModal(true);
                  setShowKinCashModal(false);
                  setShowBillPayModal(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all cursor-pointer ${
                  showVaultModal || activeTab === 'vault'
                    ? 'text-primary font-bold scale-105'
                    : 'text-on-surface-variant hover:text-white'
                }`}
                title="Vault"
              >
                <span className="material-symbols-outlined text-[24px]">shield_lock</span>
                <span className="font-label-caps text-[10px] tracking-tight">Vault</span>
              </button>
            </div>
          </nav>
        )}

        {/* FLOATING ACTION CTA: SEND QUICK (STITCH MINT GRADIENT CTA) */}
        {activeTab === 'send-quick' && (
          <div className="send-floating-cta-container">
            <button
              type="button"
              onClick={handleSendQuick}
              className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#18A57E] text-white px-5 shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer font-bold border border-white/10"
            >
              <span className="text-sm font-bold tracking-wide flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>
                  {contactsList.length > 0
                    ? `${language === 'en' ? 'Send to' : 'Enviar a'} ${(contactsList[sendQuickSelectedRecipient] || contactsList[0]).name.split(' ')[0]}`
                    : (language === 'en' ? 'Add Recipient' : 'Agregar Destinatario')}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <span className="h-9 px-3.5 rounded-full bg-[#003828] text-primary text-xs font-financial-mono font-bold flex items-center justify-center gap-1.5 shadow-sm">
                  <span>
                    {currencyPref === 'USD'
                      ? `$${(parseFloat(sendQuickAmount) || 50).toFixed(2)} USD`
                      : `$${((parseFloat(sendQuickAmount) || 50) * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Modals con aislamiento total de capas */}
      <MexicanBillPayModal
        isOpen={showBillPayModal}
        onClose={() => setShowBillPayModal(false)}
        onPaymentSuccess={handleBillPaymentSuccess}
        selectedServiceId={selectedBillServiceId}
      />
      <KinCashP2PModal
        isOpen={showKinCashModal}
        userId={userId}
        onContactCreated={(c) => setContactsList((prev) => [c, ...prev])}
        onClose={() => setShowKinCashModal(false)}
        onP2PSuccess={handleP2PSuccess}
        contacts={contactsList}
        familyNetwork={familyNetwork}
        onViewHistory={() => {
          setShowKinCashModal(false);
          setActiveTab('transactions');
        }}
        exchangeRate={USD_TO_MXN_RATE}
        userBalanceUSD={executiveBalance}
      />
      <ClientVaultModal isOpen={showVaultModal} onClose={() => setShowVaultModal(false)} />
      <AppSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onOpenVault={() => setShowVaultModal(true)}
        onLogout={handleLogout}
        biometricsEnabled={biometricsEnabled}
        onToggleBiometrics={() => setBiometricsEnabled(!biometricsEnabled)}
        pushNotificationsEnabled={pushNotificationsEnabled}
        onTogglePushNotifications={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
        userEmail={userEmail}
        userPhone={userPhone}
        currencyPref={currencyPref}
        onCurrencyChange={setCurrencyPref}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Modal: Gestión de Beneficiarios y Contactos (Regulación CNBV / Banxico / FinCEN) */}
      {showContactModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowContactModal(false)}>
          <div
            className="modal-card space-y-3.5 max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">shield_person</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight font-title-base">
                    Beneficiario de Envío (México / USA)
                  </h3>
                  <p className="text-[10px] text-on-surface-variant">
                    Cumplimiento Regulatorio CNBV • Banxico • FinCEN
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#8E91A5] hover:text-white transition-all cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Selector de Pestañas Ergonómicas (iOS 18 HIG & Material 3) */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-container-lowest rounded-2xl border border-white/5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setBeneficiaryModalTab('select')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  beneficiaryModalTab === 'select'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-white'
                }`}
              >
                👥 Contactos y Familiares ({contactsList.length})
              </button>
              <button
                type="button"
                onClick={() => setBeneficiaryModalTab('register')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  beneficiaryModalTab === 'register'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-white'
                }`}
              >
                ➕ Registrar Beneficiario
              </button>
            </div>

            {/* Notification / Feedback Banner */}
            {contactFeedback && (
              <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-2 animate-fade-in flex-shrink-0">
                <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                <span>{contactFeedback}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PESTAÑA 1: SELECCIONAR DE CONTACTOS / RED FAMILIAR                        */}
            {/* ========================================================================= */}
            {beneficiaryModalTab === 'select' && (
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
                {/* Sincronizar libreta telefónica */}
                <button
                  type="button"
                  onClick={handlePickPhoneContacts}
                  className="w-full py-3 px-3.5 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/15 to-[#7047EB]/20 border border-primary/40 hover:border-primary flex items-center justify-between text-left transition-all cursor-pointer group flex-shrink-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">📱</span>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                        Sincronizar contactos del celular
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        Acceso directo a tu agenda telefónica (iOS / Android)
                      </p>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-[10px] font-black tracking-wide">
                    ACCEDER
                  </div>
                </button>

                {/* Red Familiar KIN Registrada */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] uppercase tracking-wider text-primary font-bold">
                      👨‍👩‍👧‍👦 Red Familiar KIN (1 toque para enviar)
                    </span>
                    <span className="text-[10px] text-on-surface-variant">Ecosistema Activo</span>
                  </div>

                  <div className="space-y-2">
                    {(familyNetwork.length > 0 ? familyNetwork : KIN_FAMILY_MEMBERS).filter((f) => !f.id.includes(userId)).map((fam) => (
                      <div
                        key={fam.id}
                        onClick={() => {
                          const completeFamilyContact: ContactItem = {
                            ...fam,
                            street: fam.street || 'Av. Juárez',
                            houseNumber: fam.houseNumber || '104',
                            state: fam.state || 'San Antonio',
                            country: fam.country || 'Mexico',
                            zipCode: fam.zipCode || '78201',
                            clabe: fam.clabe || '012180001234567890',
                          };
                          setSelectedAvatar(completeFamilyContact);
                          setShowContactModal(false);
                          setContactFeedback(`Beneficiario ${fam.name} seleccionado.`);
                          setTimeout(() => setContactFeedback(null), 3000);
                        }}
                        className="p-3 rounded-2xl bg-[#181928] border border-white/5 hover:border-primary/40 transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0 bg-surface-container-high flex items-center justify-center">
                            {fam.photoUrl ? (
                              <img src={fam.photoUrl} alt={fam.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg">{fam.avatar}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                                {fam.fullName}
                              </p>
                              <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                                Familia
                              </span>
                            </div>
                            <p className="text-[11px] text-primary font-mono truncate">{fam.phone}</p>
                            <p className="text-[10px] text-on-surface-variant truncate">
                              📍 Av. Juárez #104, San Antonio • {fam.bank}
                            </p>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-primary/20 group-hover:bg-primary text-primary group-hover:text-on-primary text-xs font-bold flex items-center gap-1 flex-shrink-0 transition-all">
                          <span>Elegir</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tus Contactos Guardados */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-medium px-1">
                    <span>Tus Contactos Guardados ({contactsList.length})</span>
                    <span className="text-[10px] text-primary">Usa ▲ ▼ para ordenar</span>
                  </div>

                  {contactsList.length === 0 ? (
                    <div className="p-5 text-center rounded-2xl bg-[#121320] border border-dashed border-white/10 space-y-2">
                      <p className="text-xs font-semibold text-white">No tienes contactos guardados aún</p>
                      <p className="text-[11px] text-on-surface-variant">
                        Selecciona a un familiar arriba o usa la pestaña "Registrar Beneficiario" para dar de alta a una persona con dirección completa.
                      </p>
                      <button
                        type="button"
                        onClick={() => setBeneficiaryModalTab('register')}
                        className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        <span>Registrar Nuevo Beneficiario</span>
                      </button>
                    </div>
                  ) : (
                    contactsList.map((c, idx) => {
                      const isSelected = selectedAvatar?.id === c.id;
                      return (
                        <div
                          key={c.id}
                          className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-[#181928] border-primary shadow-sm'
                              : 'bg-[#121320] border-white/5 hover:border-white/15'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAvatar(c);
                              setShowContactModal(false);
                            }}
                            className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-base flex-shrink-0">
                              {c.avatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-white truncate">{c.name}</p>
                                {isSelected && (
                                  <span className="text-[8px] font-bold text-primary bg-primary/20 px-1.5 py-0.2 rounded-full flex-shrink-0">
                                    Activo
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-on-surface-variant truncate">
                                {c.phone || c.role} {c.street ? `• 📍 ${c.street} #${c.houseNumber}` : ''}
                              </p>
                            </div>
                          </button>

                          {/* Controls */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveContactUp(idx)}
                              disabled={idx === 0}
                              title="Subir posición"
                              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 flex items-center justify-center text-on-surface-variant hover:text-white transition-all cursor-pointer"
                            >
                              <ChevronUpIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveContactDown(idx)}
                              disabled={idx === contactsList.length - 1}
                              title="Bajar posición"
                              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 flex items-center justify-center text-on-surface-variant hover:text-white transition-all cursor-pointer"
                            >
                              <ChevronDownIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteContact(c.id)}
                              title="Eliminar de la lista"
                              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/20 flex items-center justify-center text-on-surface-variant hover:text-rose-400 transition-all cursor-pointer ml-0.5"
                            >
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PESTAÑA 2: REGISTRAR NUEVO BENEFICIARIO (CUMPLIMIENTO CNBV / BANXICO)      */}
            {/* ========================================================================= */}
            {beneficiaryModalTab === 'register' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {/* Banner Regulatorio */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-primary/10 via-[#181928] to-transparent border border-primary/20 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-primary flex-shrink-0 mt-0.5">
                    verified_user
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">Requisito Obligatorio CNBV & Banxico</p>
                    <p className="text-[10px] text-on-surface-variant">
                      Para envíos USA $\rightarrow$ México, la ley exige nombre completo, teléfono y domicilio estructurado.
                    </p>
                  </div>
                </div>

                {/* Banner de Validación en Rojo si faltan datos */}
                {beneficiaryErrors && Object.keys(beneficiaryErrors).length > 0 && (
                  <div className="p-3 rounded-2xl bg-red-500/15 border-2 border-red-500/40 text-red-400 text-xs font-bold flex items-start gap-2 animate-fade-in">
                    <span className="material-symbols-outlined text-[20px] text-red-400 flex-shrink-0">
                      gpp_maybe
                    </span>
                    <span>
                      ⚠️ Requisito Regulatorio CNBV/Banxico: Todos los campos marcados en rojo son obligatorios para transferencias transfronterizas (Nombre, Teléfono, Calle, Número, Estado, País y Código Postal).
                    </span>
                  </div>
                )}

                {/* Campo 1: Nombre Completo */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-on-surface-variant flex items-center justify-between">
                    <span>Nombre Completo del Beneficiario</span>
                    {beneficiaryErrors?.name && <span className="text-red-400 text-[10px] font-bold">* Requerido</span>}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-[18px] text-on-surface-variant pointer-events-none">
                      person
                    </span>
                    <input
                      type="text"
                      placeholder="Ej. Jose Eligio"
                      value={newContactName}
                      onChange={(e) => {
                        setNewContactName(e.target.value);
                        if (beneficiaryErrors?.name) setBeneficiaryErrors((prev) => prev ? { ...prev, name: '' } : null);
                      }}
                      className={`w-full h-[52px] pl-11 pr-4 rounded-2xl bg-[#181928] text-base text-white placeholder-on-surface-variant/50 focus:outline-none transition-all ${
                        beneficiaryErrors?.name
                          ? 'border-2 border-red-500 bg-red-500/10 text-red-400'
                          : 'border border-white/10 focus:border-primary'
                      }`}
                    />
                  </div>
                </div>

                {/* Campo 2: Teléfono Celular */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-on-surface-variant flex items-center justify-between">
                    <span>Teléfono Celular (+52 / +1)</span>
                    {beneficiaryErrors?.phone && <span className="text-red-400 text-[10px] font-bold">* Requerido</span>}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-[18px] text-on-surface-variant pointer-events-none">
                      smartphone
                    </span>
                    <input
                      type="tel"
                      placeholder="+1 (347) 248-6386 ó +52..."
                      value={newContactPhone}
                      onChange={(e) => {
                        setNewContactPhone(e.target.value);
                        if (beneficiaryErrors?.phone) setBeneficiaryErrors((prev) => prev ? { ...prev, phone: '' } : null);
                      }}
                      className={`w-full h-[52px] pl-11 pr-4 rounded-2xl bg-[#181928] text-base text-white placeholder-on-surface-variant/50 focus:outline-none transition-all ${
                        beneficiaryErrors?.phone
                          ? 'border-2 border-red-500 bg-red-500/10 text-red-400'
                          : 'border border-white/10 focus:border-primary'
                      }`}
                    />
                  </div>
                </div>

                {/* Separador de Sección Domicilio */}
                <div className="pt-2 pb-1 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-primary">
                    Dirección Domiciliaria (México / USA)
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-medium">5 Campos Obligatorios</span>
                </div>

                {/* Grid 2 Columnas: Calle & Número Exterior */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-on-surface-variant flex items-center justify-between">
                      <span>Calle</span>
                      {beneficiaryErrors?.street && <span className="text-red-400 font-bold">*</span>}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-[16px] text-on-surface-variant pointer-events-none">
                        home
                      </span>
                      <input
                        type="text"
                        placeholder="Ej. Av. Hidalgo"
                        value={newContactStreet}
                        onChange={(e) => {
                          setNewContactStreet(e.target.value);
                          if (beneficiaryErrors?.street) setBeneficiaryErrors((prev) => prev ? { ...prev, street: '' } : null);
                        }}
                        className={`w-full h-[52px] pl-9 pr-3 rounded-2xl bg-[#181928] text-base text-white placeholder-on-surface-variant/50 focus:outline-none transition-all ${
                          beneficiaryErrors?.street
                            ? 'border-2 border-red-500 bg-red-500/10 text-red-400'
                            : 'border border-white/10 focus:border-primary'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-on-surface-variant flex items-center justify-between">
                      <span>No. Exterior</span>
                      {beneficiaryErrors?.houseNumber && <span className="text-red-400 font-bold">*</span>}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-[16px] text-on-surface-variant pointer-events-none">
                        tag
                      </span>
                      <input
                        type="text"
                        placeholder="Ej. 142"
                        value={newContactHouseNumber}
                        onChange={(e) => {
                          setNewContactHouseNumber(e.target.value);
                          if (beneficiaryErrors?.houseNumber) setBeneficiaryErrors((prev) => prev ? { ...prev, houseNumber: '' } : null);
                        }}
                        className={`w-full h-[52px] pl-9 pr-3 rounded-2xl bg-[#181928] text-base text-white placeholder-on-surface-variant/50 focus:outline-none transition-all ${
                          beneficiaryErrors?.houseNumber
                            ? 'border-2 border-red-500 bg-red-500/10 text-red-400'
                            : 'border border-white/10 focus:border-primary'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Grid 2 Columnas: Estado & Código Postal */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-on-surface-variant flex items-center justify-between">
                      <span>Estado / Entidad</span>
                      {beneficiaryErrors?.state && <span className="text-red-400 font-bold">*</span>}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-[16px] text-on-surface-variant pointer-events-none">
                        map
                      </span>
                      <input
                        type="text"
                        placeholder="Ej. Jalisco"
                        value={newContactState}
                        onChange={(e) => {
                          setNewContactState(e.target.value);
                          if (beneficiaryErrors?.state) setBeneficiaryErrors((prev) => prev ? { ...prev, state: '' } : null);
                        }}
                        className={`w-full h-[52px] pl-9 pr-3 rounded-2xl bg-[#181928] text-base text-white placeholder-on-surface-variant/50 focus:outline-none transition-all ${
                          beneficiaryErrors?.state
                            ? 'border-2 border-red-500 bg-red-500/10 text-red-400'
                            : 'border border-white/10 focus:border-primary'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-on-surface-variant flex items-center justify-between">
                      <span>Código Postal (C.P.)</span>
                      {beneficiaryErrors?.zipCode && <span className="text-red-400 font-bold">*</span>}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-[16px] text-on-surface-variant pointer-events-none">
                        markunread_mailbox
                      </span>
                      <input
                        type="text"
                        placeholder="Ej. 44100"
                        maxLength={6}
                        value={newContactZip}
                        onChange={(e) => {
                          setNewContactZip(e.target.value);
                          if (beneficiaryErrors?.zipCode) setBeneficiaryErrors((prev) => prev ? { ...prev, zipCode: '' } : null);
                        }}
                        className={`w-full h-[52px] pl-9 pr-3 rounded-2xl bg-[#181928] text-base text-white placeholder-on-surface-variant/50 focus:outline-none transition-all ${
                          beneficiaryErrors?.zipCode
                            ? 'border-2 border-red-500 bg-red-500/10 text-red-400'
                            : 'border border-white/10 focus:border-primary'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Selector de País */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-on-surface-variant">País de Residencia</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewContactCountry('Mexico')}
                      className={`h-[48px] rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        newContactCountry === 'Mexico'
                          ? 'bg-primary text-on-primary shadow-sm border border-primary'
                          : 'bg-[#181928] border border-white/10 text-on-surface-variant hover:text-white'
                      }`}
                    >
                      <span>🇲🇽 México</span>
                      {newContactCountry === 'Mexico' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewContactCountry('Estados Unidos')}
                      className={`h-[48px] rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        newContactCountry === 'Estados Unidos'
                          ? 'bg-primary text-on-primary shadow-sm border border-primary'
                          : 'bg-[#181928] border border-white/10 text-on-surface-variant hover:text-white'
                      }`}
                    >
                      <span>🇺🇸 Estados Unidos</span>
                      {newContactCountry === 'Estados Unidos' && <span className="text-xs">✓</span>}
                    </button>
                  </div>
                </div>

                {/* Guardar en libreta del teléfono */}
                <div
                  onClick={() => setSaveBeneficiaryToPhone((prev) => !prev)}
                  className="p-3 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between cursor-pointer hover:border-white/15 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">contact_page</span>
                    <div>
                      <p className="text-xs font-bold text-white">Guardar en la agenda de mi teléfono</p>
                      <p className="text-[10px] text-on-surface-variant">Descarga tarjeta vCard (.vcf) de 1 toque</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={saveBeneficiaryToPhone}
                    onChange={() => {}}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </div>

                {/* Botón CTA Principal */}
                <button
                  type="button"
                  onClick={handleAddNewContact}
                  disabled={isSavingBeneficiary}
                  className="w-full h-[54px] rounded-full bg-primary hover:bg-primary-container text-on-primary text-sm font-bold transition-all cursor-pointer shadow-[0_8px_24px_rgba(46,213,164,0.3)] flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
                >
                  {isSavingBeneficiary ? (
                    <span>Validando y Guardando...</span>
                  ) : (
                    <>
                      <span>Guardar Beneficiario y Continuar</span>
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Footer Done */}
            {beneficiaryModalTab === 'select' && (
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="w-full h-12 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer flex-shrink-0 flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <span>Cerrar</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Selector de Foto y Nombre del Cliente */}
      {showAvatarPicker && (
        <div className="modal-backdrop animate-fade-in" onClick={handleCancelProfile}>
          <div
            className="modal-card space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2ED5A4]/15 flex items-center justify-center text-[#2ED5A4]">
                  <CameraIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Editar Perfil & Datos</h3>
                  <p className="text-[11px] text-[#8E91A5]">Actualiza tu información de contacto y foto</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelProfile}
                className="p-1 rounded-full text-[#8E91A5] hover:text-white cursor-pointer"
                title="Cerrar sin guardar"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Nombre y Apellido (2 Columnas) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                  Nombre(s):
                </label>
                <div className="auth-input-group">
                  <input
                    type="text"
                    autoCapitalize="words"
                    autoCorrect="off"
                    spellCheck={false}
                    value={draftUserFirstName}
                    onChange={(e) => setDraftUserFirstName(e.target.value.replace(/(^|\s)(\p{L})/gu, (_, s, c) => s + c.toUpperCase()))}
                    placeholder="Nombre"
                    className="auth-input-field capitalize"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                  Apellido(s):
                </label>
                <div className="auth-input-group">
                  <input
                    type="text"
                    autoCapitalize="words"
                    autoCorrect="off"
                    spellCheck={false}
                    value={draftUserLastName}
                    onChange={(e) => setDraftUserLastName(e.target.value.replace(/(^|\s)(\p{L})/gu, (_, s, c) => s + c.toUpperCase()))}
                    placeholder="Apellido"
                    className="auth-input-field capitalize"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>
            </div>

            {/* Correo Electrónico Registrado */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                Correo Electrónico:
              </label>
              <div className="auth-input-group">
                <input
                  type="email"
                  value={draftUserEmail}
                  onChange={(e) => setDraftUserEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="auth-input-field"
                  style={{ paddingLeft: '14px' }}
                />
              </div>
            </div>

            {/* Teléfono Móvil */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                Teléfono Móvil (con lada):
              </label>
              <div className="auth-input-group">
                <input
                  type="tel"
                  value={draftUserPhone}
                  onChange={(e) => setDraftUserPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="auth-input-field"
                  style={{ paddingLeft: '14px' }}
                />
              </div>
            </div>

            {/* Ciudad y Estado (2 Columnas) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                  Ciudad:
                </label>
                <div className="auth-input-group">
                  <input
                    type="text"
                    value={draftUserCity}
                    onChange={(e) => setDraftUserCity(e.target.value)}
                    placeholder="Ciudad"
                    className="auth-input-field"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                  Estado:
                </label>
                <div className="auth-input-group">
                  <input
                    type="text"
                    value={draftUserState}
                    onChange={(e) => setDraftUserState(e.target.value)}
                    placeholder="Estado"
                    className="auth-input-field"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>
            </div>

            {/* Opción Sin Foto / Dejar Recuadro Vacío */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1.5 px-0.5">
                Opciones de foto de perfil:
              </label>
              <button
                type="button"
                onClick={() => {
                  setDraftUserAvatar('');
                  setCustomAvatarInput('');
                }}
                className={`w-full py-2.5 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !draftUserAvatar
                    ? 'border-[#2ED5A4] bg-[#2ED5A4]/15 text-[#2ED5A4] shadow-sm'
                    : 'border-white/10 bg-[#181928] text-[#8E91A5] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">no_accounts</span>
                <span>Sin foto de perfil (Recuadro vacío)</span>
              </button>
            </div>

            {/* Subir foto de la galería / dispositivo del cliente */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1.5 px-0.5">
                O subir desde la galería de tu dispositivo:
              </label>
              <label className="w-full h-11 rounded-2xl bg-[#222338] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-white cursor-pointer transition-colors shadow-sm">
                <CameraIcon className="w-4 h-4 text-[#2ED5A4]" />
                <span>Elegir foto de mi galería</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setDraftUserAvatar(event.target.result as string);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            {/* Galería de Avatares Predefinidos */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-2 px-0.5">
                O selecciona uno de los avatares predefinidos:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {DEFAULT_AVATARS.map((url, idx) => {
                  const isSelected = draftUserAvatar === url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDraftUserAvatar(url)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2ED5A4] bg-[#2ED5A4]/10 scale-105'
                          : 'border-white/10 bg-[#181928] hover:border-white/20'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden relative border border-white/10">
                        <img
                          src={url}
                          alt={`Avatar ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#2ED5A4]/30 flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-white font-medium">
                        Opción {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* O ingresar URL personalizada */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                O ingresa la URL de tu imagen:
              </label>
              <div className="flex gap-2">
                <div className="auth-input-group flex-1">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={customAvatarInput}
                    onChange={(e) => setCustomAvatarInput(e.target.value)}
                    className="auth-input-field"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (customAvatarInput.trim()) {
                      setDraftUserAvatar(customAvatarInput.trim());
                      setCustomAvatarInput('');
                    }
                  }}
                  className="px-4 rounded-2xl bg-[#2B2C42] text-white text-xs font-bold hover:bg-[#343552] border border-white/10 cursor-pointer"
                >
                  Usar
                </button>
              </div>
            </div>

            {/* Botón Guardar (Solo aplica los cambios al dar clic aquí) */}
            <button
              type="button"
              onClick={handleSaveProfile}
              className="auth-btn-cta active mt-3"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
