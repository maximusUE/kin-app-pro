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
  WhatsAppIcon,
  LanguageIcon,
} from '@/components/Icons';
import { MexicanBillPayModal } from '@/components/MexicanBillPayModal';
import { KinCashP2PModal, KIN_FAMILY_MEMBERS, exportContactVCard } from '@/components/KinCashP2PModal';
import { ClientVaultModal } from '@/components/ClientVaultModal';
import { AppSettingsModal, ToggleSwitch } from '@/components/AppSettingsModal';
import { KinLogo } from '@/components/KinLogo';
import { BilingualAuthScreen } from '@/components/BilingualAuthScreen';
import { capitalizeWords } from '@/lib/utils/capitalize';
import { ContactAvatar } from '@/components/ContactAvatar';
import { WhatsAppContactsModal } from '@/components/WhatsAppContactsModal';
import { ReceiptView } from '@/components/views/ReceiptView';
import { HomeView } from '@/components/views/HomeView';
import { BillsView } from '@/components/views/BillsView';
import { TransactionsView } from '@/components/views/TransactionsView';
import { WalletView } from '@/components/views/WalletView';
import { SendView } from '@/components/views/SendView';
import { SendQuickView } from '@/components/views/SendQuickView';
import { ProfileView } from '@/components/views/ProfileView';
import { QuickContactActionModal } from '@/components/modals/QuickContactActionModal';
import { ContactAvatarPickerModal } from '@/components/modals/ContactAvatarPickerModal';
import { UserProfileEditModal } from '@/components/modals/UserProfileEditModal';
import { SendReviewModal } from '@/components/modals/SendReviewModal';
import { TransactionDetailModal } from '@/components/modals/TransactionDetailModal';
import { CashPickupLocationModal, SelectedPickupLocation } from '@/components/modals/CashPickupLocationModal';

// Tasa de cambio base por defecto USD/MXN
const DEFAULT_USD_TO_MXN_RATE = 20.45;

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
  claveRastreoBanxico?: string;
  claveRetiroEfectivo?: string;
  pickupStore?: string;
  bancoDestino?: string;
  cuentaBeneficiario?: string;
  nombreBeneficiario?: string;
  recipientPhone?: string;
  paymentMethod?: string;
  feeUSD?: number;
  createdAt?: string;
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
  const [userAddress1, setUserAddress1] = useState('');
  const [userAddress2, setUserAddress2] = useState('');
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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [copiedClientId, setCopiedClientId] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Dynamic FX Exchange Rate (Treasury Control)
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_USD_TO_MXN_RATE);
  const USD_TO_MXN_RATE = exchangeRate;

  const loadUserData = (user: any) => {
    if (!user) return;
    if (user.id) setUserId(user.id);
    const cleanFirst = capitalizeWords(user.firstName);
    const cleanLast = capitalizeWords(user.lastName);
    if (cleanFirst) setUserFirstName(cleanFirst);
    if (cleanLast) setUserLastName(cleanLast);
    if (user.name) {
      setUserName(capitalizeWords(user.name));
    } else if (cleanFirst) {
      const short = `${cleanFirst} ${cleanLast ? cleanLast[0] + '.' : ''}`.trim();
      setUserName(short);
    }
    if (user.email) setUserEmail(user.email);
    if (user.phone) setUserPhone(user.phone);
    setUserAddress1(user.address1 ?? '');
    setUserAddress2(user.address2 ?? '');
    setUserCity(user.city ? capitalizeWords(user.city) : '');
    setUserState(user.state ? capitalizeWords(user.state) : '');
    setUserZip(user.zip ?? '');
    if (user.country) setUserCountry(capitalizeWords(user.country));
    // Asignar el avatar explícito (si está vacío o es foto de stock ficticia, deja recuadro vacío sin foto)
    setUserAvatar(user.avatar && !user.avatar.includes('images.unsplash.com') ? user.avatar : '');
    if (user.email === 'airygc7@gmail.com' || user.role === 'MASTER_ADMIN' || user.isMasterAdmin) {
      setUserClientId(user.clientId || 'KIN-MASTER-001');
      setUserDocType('Credencial Maestro de Operador KIN');
      setUserDocNumber('KIN-CEO-0001');
      setUserKycTier('Tier 3 — Propietario / Master Admin');
      setUserDailyLimit('$100,000.00 USD / día');
      setBaseBalanceUSD(typeof user.balanceUSD === 'number' ? user.balanceUSD : 10000);
    } else {
      if (user.clientId) setUserClientId(user.clientId);
      if (user.docType) setUserDocType(user.docType);
      if (user.docNumber) setUserDocNumber(user.docNumber);
      if (user.kycTier) setUserKycTier(user.kycTier);
      if (user.dailyLimit) setUserDailyLimit(user.dailyLimit);
      if (typeof user.balanceUSD === 'number') setBaseBalanceUSD(user.balanceUSD);
    }
    if (user.memberSince) setUserMemberSince(user.memberSince);
    if (user.language === 'es' || user.language === 'en') {
      setLanguage(user.language);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('kin_language', user.language);
        } catch (_) {}
      }
    }
    if (user.currencyPref === 'USD' || user.currencyPref === 'MXN') {
      setCurrencyPref(user.currencyPref);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('kin_currency_pref', user.currencyPref);
        } catch (_) {}
      }
    }
    if (user.theme === 'dark' || user.theme === 'light') {
      setTheme(user.theme);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('kin_theme', user.theme);
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(user.theme);
        } catch (_) {}
      }
    }
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
  const [draftUserLanguage, setDraftUserLanguage] = useState<'es' | 'en'>('es');
  const [draftUserCurrencyPref, setDraftUserCurrencyPref] = useState<'USD' | 'MXN'>('USD');
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

  // Sincronizar Tipo de Cambio FX desde LocalStorage y Endpoint de Tesorería (/api/fx)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedRate = localStorage.getItem('kin_active_exchange_rate');
      if (savedRate) {
        const parsed = parseFloat(savedRate);
        if (!isNaN(parsed) && parsed > 0) {
          setExchangeRate(parsed);
        }
      }
    } catch (_) {}

    fetch('/api/fx')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.customerRate === 'number' && data.customerRate > 0) {
          setExchangeRate(data.customerRate);
        }
      })
      .catch(() => {});
  }, []);

  // Sincronizar parámetros de URL y usuario activo (?view=login, ?view=dashboard, ?userId=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const auth = params.get('auth');
    const queryUserId = params.get('userId');

    const hasActiveSession = !!localStorage.getItem('kin_active_user') || !!sessionStorage.getItem('kin_auth');

    if (view === 'login' || auth === 'login') {
      setIsAuthenticated(false);
    } else if (view === 'dashboard' || auth === 'skip' || auth === 'dashboard') {
      setIsAuthenticated(true);
    } else if (!hasActiveSession) {
      // Experiencia de primer uso: nuevo cliente abriendo la app por primera vez
      setIsAuthenticated(false);
    }

    // 0. Recuperar idioma, moneda y tema guardados en localStorage
    const savedLang = localStorage.getItem('kin_language');
    if (savedLang === 'es' || savedLang === 'en') {
      setLanguage(savedLang);
    }
    const savedCurr = localStorage.getItem('kin_currency_pref');
    if (savedCurr === 'USD' || savedCurr === 'MXN') {
      setCurrencyPref(savedCurr);
    }
    const savedTheme = localStorage.getItem('kin_theme') as 'dark' | 'light' | null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(savedTheme);
    }
    const savedTab = localStorage.getItem('kin_active_tab');
    if (savedTab && ['home', 'send', 'bills', 'transactions', 'wallet', 'send-quick', 'profile', 'kin-cash', 'bill-pay', 'vault'].includes(savedTab)) {
      setActiveTab(savedTab as any);
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

    // 3. Recuperar borradores de KIN Cash y Send Money desde localStorage
    try {
      const savedKinContact = localStorage.getItem('kin_draft_kincash_contact');
      if (savedKinContact) {
        setKinCashDraftContact(JSON.parse(savedKinContact));
      }
      const savedKinAmt = localStorage.getItem('kin_draft_kincash_amount');
      if (savedKinAmt) {
        setKinCashDraftAmount(savedKinAmt);
      }
      const savedKinNote = localStorage.getItem('kin_draft_kincash_note');
      if (savedKinNote) {
        setKinCashDraftNote(savedKinNote);
      }

      const savedSendRecipient = localStorage.getItem('kin_draft_send_recipient');
      if (savedSendRecipient) {
        setSelectedAvatar(JSON.parse(savedSendRecipient));
      }
      const savedSendAmt = localStorage.getItem('kin_draft_send_amount');
      if (savedSendAmt) {
        setAmountValue(savedSendAmt);
      }
      const savedSendDelivery = localStorage.getItem('kin_draft_send_delivery');
      if (savedSendDelivery === 'cash' || savedSendDelivery === 'bank' || savedSendDelivery === 'wallet') {
        setDeliveryMethod(savedSendDelivery);
      }
      const savedSendStore = localStorage.getItem('kin_draft_send_store');
      if (savedSendStore) {
        setSelectedStore(savedSendStore);
      }
      const savedPickupLocation = localStorage.getItem('kin_draft_send_pickup_location');
      if (savedPickupLocation) {
        try {
          setPickupLocation(JSON.parse(savedPickupLocation));
        } catch (e) {
          console.warn('[PickupLocation restore error]', e);
        }
      }
      const savedPaymentMethod = localStorage.getItem('kin_draft_send_payment_method');
      if (savedPaymentMethod && ['debit', 'apple', 'bank', 'credit'].includes(savedPaymentMethod)) {
        setPaymentMethod(savedPaymentMethod as any);
      }
    } catch (e) {
      console.warn('[Draft Restore Error]', e);
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
          // Mantener persistencia estricta: Si el cliente editó y guardó sus datos localmente, darles prioridad
          let clientSaved: any = {};
          try {
            const raw = localStorage.getItem('kin_active_user');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed.id === data.user.id || parsed.email === data.user.email) {
                clientSaved = parsed;
              }
            }
          } catch (_) {}

          const effectiveUser = {
            ...data.user,
            ...clientSaved,
            address1: clientSaved.address1 !== undefined ? clientSaved.address1 : (data.user.address1 || ''),
            address2: clientSaved.address2 !== undefined ? clientSaved.address2 : (data.user.address2 || ''),
            city: clientSaved.city !== undefined ? clientSaved.city : (data.user.city || ''),
            state: clientSaved.state !== undefined ? clientSaved.state : (data.user.state || ''),
            zip: clientSaved.zip !== undefined ? clientSaved.zip : (data.user.zip || ''),
          };
          loadUserData(effectiveUser);
          if (Array.isArray(data.transactions)) {
            setTransactions(data.transactions);
          }
          if (Array.isArray(data.contacts)) {
            setContactsList(data.contacts);
          }
          if (Array.isArray(data.familyNetwork)) {
            setFamilyNetwork(data.familyNetwork);
          }

          // Hidratación de respaldo desde backend si el cliente no tenía borrador en localStorage
          if (data.user.draftP2P) {
            setKinCashDraftContact((prev) => {
              if (prev) return prev;
              if (!data.user.draftP2P?.contactName) return null;
              return {
                id: data.user.draftP2P.contactId || 'p2p-draft',
                name: data.user.draftP2P.contactName,
                fullName: data.user.draftP2P.contactName,
                phone: data.user.draftP2P.contactPhone || '',
                bank: data.user.draftP2P.contactBank || 'Red KIN Cash P2P',
                role: 'Familiar',
                avatar: data.user.draftP2P.contactAvatar || '',
                country: 'Mexico',
                photoUrl: '',
              };
            });
            if (data.user.draftP2P.amount) {
              setKinCashDraftAmount((prev) => (prev && prev !== '0' ? prev : data.user.draftP2P.amount));
            }
            if (data.user.draftP2P.note) {
              setKinCashDraftNote((prev) => (prev && prev !== 'Groceries & medicine for the week' ? prev : data.user.draftP2P.note));
            }
          }

          if (data.user.draftSend) {
            setSelectedAvatar((prev) => {
              if (prev) return prev;
              if (!data.user.draftSend?.recipientName) return null;
              return {
                id: data.user.draftSend.recipientId || 'send-draft',
                name: data.user.draftSend.recipientName,
                fullName: data.user.draftSend.recipientName,
                phone: data.user.draftSend.recipientPhone || '',
                bank: 'Red Banxico SPEI',
                role: 'Beneficiario',
                avatar: data.user.draftSend.recipientAvatar || '',
                country: 'Mexico',
                photoUrl: data.user.draftSend.recipientPhotoUrl || '',
              };
            });
            if (data.user.draftSend.amount) {
              setAmountValue((prev) => (prev && prev !== '50' ? prev : data.user.draftSend.amount));
            }
            if (data.user.draftSend.deliveryMethod) {
              setDeliveryMethod(data.user.draftSend.deliveryMethod as any);
            }
            if (data.user.draftSend.selectedStore) {
              setSelectedStore((prev) => prev || data.user.draftSend.selectedStore);
            }
            if (data.user.draftSend.pickupLocation) {
              setPickupLocation((prev) => prev || data.user.draftSend.pickupLocation);
            }
            if (data.user.draftSend.paymentMethod) {
              setPaymentMethod((prev) => prev || data.user.draftSend.paymentMethod);
            }
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
    setDraftUserName(capitalizeWords(userName));
    setDraftUserFirstName(capitalizeWords(userFirstName));
    setDraftUserLastName(capitalizeWords(userLastName));
    setDraftUserEmail(userEmail);
    setDraftUserPhone(userPhone);
    setDraftUserCity(capitalizeWords(userCity));
    setDraftUserState(capitalizeWords(userState));
    setDraftUserAvatar(userAvatar);
    setDraftUserLanguage(language);
    setDraftUserCurrencyPref(currencyPref);
    setCustomAvatarInput('');
    setShowAvatarPicker(true);
  };

  // Conmutador rápido bimonetario para Dashboard y Modo Viajero
  const handleToggleCurrency = (newCurr: 'USD' | 'MXN') => {
    setCurrencyPref(newCurr);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_currency_pref', newCurr);
      } catch (_) {}
    }
    if (userId) {
      fetch('/api/account/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates: { currencyPref: newCurr } }),
      }).catch(() => {});
    }
  };

  // Conmutador universal de Modo Claro / Modo Oscuro
  const handleToggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_theme', newTheme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(newTheme);
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', newTheme === 'light' ? '#EAECF0' : '#11111B');
        }
      } catch (_) {}
    }
    if (userId) {
      fetch('/api/account/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates: { theme: newTheme } }),
      }).catch(() => {});
    }
  };

  // Actualizar datos de perfil editados en tiempo real
  const handleUpdateProfile = (updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    email?: string;
  }) => {
    if (updates.firstName !== undefined) {
      const clean = capitalizeWords(updates.firstName);
      setUserFirstName(clean);
      setUserName(`${clean} ${userLastName ? userLastName[0] + '.' : ''}`.trim());
    }
    if (updates.lastName !== undefined) {
      const clean = capitalizeWords(updates.lastName);
      setUserLastName(clean);
      setUserName(`${userFirstName} ${clean ? clean[0] + '.' : ''}`.trim());
    }
    if (updates.phone !== undefined) setUserPhone(updates.phone);
    if (updates.address1 !== undefined) setUserAddress1(updates.address1);
    if (updates.address2 !== undefined) setUserAddress2(updates.address2);
    if (updates.city !== undefined) setUserCity(capitalizeWords(updates.city));
    if (updates.state !== undefined) setUserState(capitalizeWords(updates.state));
    if (updates.zip !== undefined) setUserZip(updates.zip);
    if (updates.email !== undefined) setUserEmail(updates.email);

    try {
      const currentSaved = localStorage.getItem('kin_active_user');
      const parsed = currentSaved ? JSON.parse(currentSaved) : {};
      const updatedUser = {
        ...parsed,
        ...updates,
      };
      localStorage.setItem('kin_active_user', JSON.stringify(updatedUser));
    } catch (_) {}

    if (userId) {
      fetch('/api/account/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates }),
      }).catch((e) => console.warn('[Profile update sync error]', e));
    }
  };

  // Guardar cambios de perfil confirmados
  const handleSaveProfile = () => {
    const cleanFirst = capitalizeWords(draftUserFirstName.trim());
    const cleanLast = capitalizeWords(draftUserLastName.trim());
    const cleanCity = capitalizeWords(draftUserCity.trim());
    const cleanState = capitalizeWords(draftUserState.trim());

    if (cleanFirst) {
      setUserFirstName(cleanFirst);
      const shortName = cleanFirst + (cleanLast ? ` ${cleanLast.charAt(0)}.` : '');
      setUserName(shortName);
    }
    if (cleanLast) {
      setUserLastName(cleanLast);
    }
    if (draftUserEmail.trim()) {
      setUserEmail(draftUserEmail.trim());
    }
    if (draftUserPhone.trim()) {
      setUserPhone(draftUserPhone.trim());
    }
    if (cleanCity) {
      setUserCity(cleanCity);
    }
    if (cleanState) {
      setUserState(cleanState);
    }
    setUserAvatar(draftUserAvatar);
    setLanguage(draftUserLanguage);
    setCurrencyPref(draftUserCurrencyPref);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_language', draftUserLanguage);
        localStorage.setItem('kin_currency_pref', draftUserCurrencyPref);
      } catch (_) {}
    }

    const updatedUserObj = {
      id: userId,
      firstName: cleanFirst || userFirstName,
      lastName: cleanLast || userLastName,
      name: cleanFirst ? (cleanFirst + (cleanLast ? ` ${cleanLast.charAt(0)}.` : '')) : userName,
      email: draftUserEmail.trim() || userEmail,
      phone: draftUserPhone.trim() || userPhone,
      city: cleanCity || userCity,
      state: cleanState || userState,
      avatar: draftUserAvatar,
      language: draftUserLanguage,
      currencyPref: draftUserCurrencyPref,
    };

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kin_active_user');
        const prev = saved ? JSON.parse(saved) : {};
        const updated = {
          ...prev,
          ...updatedUserObj,
        };
        localStorage.setItem('kin_active_user', JSON.stringify(updated));
      } catch (_) {}
    }

    // Sincronizar inmediatamente con backend y Firestore
    fetch('/api/account/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        updates: updatedUserObj,
      }),
    }).catch((e) => console.warn('[Profile Save Sync Error]', e));

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
  const [newContactFirstName, setNewContactFirstName] = useState('');
  const [newContactLastName, setNewContactLastName] = useState('');
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
  const [pickupLocation, setPickupLocation] = useState<SelectedPickupLocation | null>(null);
  const [showPickupLocationModal, setShowPickupLocationModal] = useState(false);

  // Estados para Gestión Táctil de Contactos Rápidos (Action Sheet & Avatar Editor & iPhone Edit Mode)
  const [quickContactActionTarget, setQuickContactActionTarget] = useState<{ contact: ContactItem; index: number } | null>(null);
  const [isContactEditMode, setIsContactEditMode] = useState(false);
  const [editingContactAvatarTarget, setEditingContactAvatarTarget] = useState<ContactItem | null>(null);
  const [editingContactPhotoInput, setEditingContactPhotoInput] = useState('');
  const [isUpdatingContactPhoto, setIsUpdatingContactPhoto] = useState(false);
  const [smartContactQuery, setSmartContactQuery] = useState('');

  // KIN Cash P2P Unbreakable Persistent Draft state
  const [kinCashDraftContact, setKinCashDraftContact] = useState<ContactItem | null>(null);
  const [kinCashDraftAmount, setKinCashDraftAmount] = useState<string>('0');
  const [kinCashDraftNote, setKinCashDraftNote] = useState<string>('Groceries & medicine for the week');

  // Limpiar borrador de KIN Cash
  const handleClearKinCashDraft = () => {
    setKinCashDraftContact(null);
    setKinCashDraftAmount('0');
    setKinCashDraftNote('Groceries & medicine for the week');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kin_draft_kincash_contact');
      localStorage.removeItem('kin_draft_kincash_amount');
      localStorage.removeItem('kin_draft_kincash_note');
    }
    if (userId) {
      fetch('/api/account/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates: { draftP2P: null } }),
      }).catch(() => {});
    }
  };

  // Limpiar borrador de Send Money (Remesas)
  const handleClearSendDraft = () => {
    setSelectedAvatar(null);
    setAmountValue('50');
    setDeliveryMethod('cash');
    setPickupLocation(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kin_draft_send_recipient');
      localStorage.removeItem('kin_draft_send_amount');
      localStorage.removeItem('kin_draft_send_delivery');
      localStorage.removeItem('kin_draft_send_store');
      localStorage.removeItem('kin_draft_send_pickup_location');
      localStorage.removeItem('kin_draft_send_payment_method');
      localStorage.removeItem('kin_draft_send_pickup_state');
    }
    if (userId) {
      fetch('/api/account/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates: { draftSend: null } }),
      }).catch(() => {});
    }
  };

  // Persistencia reactiva universal de configuración de usuario (idioma, tema, moneda, tab)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (language) {
      localStorage.setItem('kin_language', language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (theme) {
      localStorage.setItem('kin_theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (currencyPref) {
      localStorage.setItem('kin_currency_pref', currencyPref);
    }
  }, [currencyPref]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activeTab) {
      localStorage.setItem('kin_active_tab', activeTab);
    }
  }, [activeTab]);

  // Persistencia reactiva de Send Money en localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedAvatar) {
      localStorage.setItem('kin_draft_send_recipient', JSON.stringify(selectedAvatar));
    } else {
      localStorage.removeItem('kin_draft_send_recipient');
    }
  }, [selectedAvatar]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (amountValue) {
      localStorage.setItem('kin_draft_send_amount', amountValue);
    }
  }, [amountValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (deliveryMethod) {
      localStorage.setItem('kin_draft_send_delivery', deliveryMethod);
    }
  }, [deliveryMethod]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedStore) {
      localStorage.setItem('kin_draft_send_store', selectedStore);
    }
  }, [selectedStore]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pickupLocation) {
      localStorage.setItem('kin_draft_send_pickup_location', JSON.stringify(pickupLocation));
    } else {
      localStorage.removeItem('kin_draft_send_pickup_location');
    }
  }, [pickupLocation]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (paymentMethod) {
      localStorage.setItem('kin_draft_send_payment_method', paymentMethod);
    }
  }, [paymentMethod]);

  // Sincronización continua de borradores al backend de manera asíncrona (debounce 1200ms)
  useEffect(() => {
    if (!userId) return;
    const timer = setTimeout(() => {
      const updates: any = {};
      if (kinCashDraftContact || (kinCashDraftAmount && kinCashDraftAmount !== '0')) {
        updates.draftP2P = {
          contactId: kinCashDraftContact?.id,
          contactName: kinCashDraftContact?.fullName || kinCashDraftContact?.name,
          contactPhone: kinCashDraftContact?.phone,
          contactBank: kinCashDraftContact?.bank,
          contactAvatar: kinCashDraftContact?.avatar || (kinCashDraftContact as any)?.photoUrl,
          amount: kinCashDraftAmount,
          note: kinCashDraftNote,
          updatedAt: new Date().toISOString(),
        };
      }
      if (selectedAvatar) {
        updates.draftSend = {
          recipientId: selectedAvatar.id,
          recipientName: selectedAvatar.fullName || selectedAvatar.name,
          recipientPhone: selectedAvatar.phone,
          recipientAvatar: selectedAvatar.avatar,
          amount: amountValue,
          deliveryMethod,
          selectedStore,
          pickupLocation,
          paymentMethod,
          updatedAt: new Date().toISOString(),
        };
      }
      if (Object.keys(updates).length > 0) {
        fetch('/api/account/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, updates }),
        }).catch(() => {});
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [userId, kinCashDraftContact, kinCashDraftAmount, kinCashDraftNote, selectedAvatar, amountValue, deliveryMethod, selectedStore, pickupLocation, paymentMethod]);

  // Reordenar contactos hacia arriba (subir orden)
  const handleMoveContactUp = (index: number) => {
    if (index <= 0) return;
    setContactsList((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      
      // Sincronizar nuevo orden al backend
      fetch('/api/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reorderList: updated }),
      }).catch((e) => console.warn('[Reorder contacts API error]', e));

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

      // Sincronizar nuevo orden al backend
      fetch('/api/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reorderList: updated }),
      }).catch((e) => console.warn('[Reorder contacts API error]', e));

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

  // Guardar foto / avatar personalizado de un contacto
  const handleSaveContactPhoto = async (targetContact: ContactItem, newPhotoUrl: string) => {
    setIsUpdatingContactPhoto(true);
    const updatedPhoto = newPhotoUrl.trim();

    setContactsList((prev) =>
      prev.map((c) => (c.id === targetContact.id ? { ...c, photoUrl: updatedPhoto } : c))
    );

    if (selectedAvatar?.id === targetContact.id) {
      setSelectedAvatar((prev) => (prev ? { ...prev, photoUrl: updatedPhoto } : null));
    }
    if (kinCashDraftContact?.id === targetContact.id) {
      setKinCashDraftContact((prev) => (prev ? { ...prev, photoUrl: updatedPhoto } : null));
    }

    try {
      await fetch('/api/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          contactId: targetContact.id,
          updates: { photoUrl: updatedPhoto },
        }),
      });
      setContactFeedback(`Foto de ${targetContact.name} actualizada correctamente.`);
      setTimeout(() => setContactFeedback(null), 3500);
    } catch (err) {
      console.warn('[Update Contact Photo API Error]', err);
    } finally {
      setIsUpdatingContactPhoto(false);
      setEditingContactAvatarTarget(null);
      setEditingContactPhotoInput('');
    }
  };

  // Acceso directo a los contactos del teléfono móvil (Web Contact Picker API)
  const handlePickPhoneContacts = async () => {
    try {
      if (typeof window !== 'undefined' && 'contacts' in navigator && 'ContactsManager' in window) {
        const props = ['name', 'tel'];
        const contacts = await (navigator as any).contacts.select(props, { multiple: true });
        if (contacts && contacts.length > 0) {
          const newEntries: ContactItem[] = contacts.map((c: any, idx: number) => {
            const rawName = c.name?.[0] || 'Contacto Teléfono';
            const tel = c.tel?.[0] || '';
            return {
              id: `phone-${Date.now()}-${idx}`,
              name: rawName.split(' ')[0],
              fullName: rawName,
              avatar: '',
              role: tel || 'Móvil directo',
              country: 'Mexico',
              bank: 'SPEI Banxico',
              photoUrl: '', // Silueta de usuario sin foto
              phone: tel,
            };
          });

          setContactsList((prev) => [...newEntries, ...prev]);
          if (newEntries.length > 0) {
            setSelectedAvatar(newEntries[0]);
          }

          // Guardar cada contacto importado en backend y Firestore
          newEntries.forEach((entry) => {
            fetch('/api/contacts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                name: entry.name,
                fullName: entry.fullName,
                phone: entry.phone,
                bank: entry.bank,
                avatar: entry.avatar,
                country: entry.country,
              }),
            }).catch(() => {});
          });

          setContactFeedback(`¡${newEntries.length} contacto(s) sincronizado(s) desde tu teléfono!`);
          setTimeout(() => setContactFeedback(null), 3500);
          return;
        }
      }
    } catch (err: any) {
      console.warn('Contact picker cancelled or denied:', err);
    }

    // Si el navegador no soporta Contact Picker API (ej. Safari Desktop o sin permiso), abrir búsqueda directa
    setShowContactModal(true);
    setBeneficiaryModalTab('select');
  };

  // Agregar contacto / beneficiario con validación estricta de dirección CNBV / Banxico (USA -> México)
  const handleAddNewContact = () => {
    const trimmedFirstName = capitalizeWords((newContactFirstName || newContactName.split(' ')[0] || '').trim());
    const trimmedLastName = capitalizeWords((newContactLastName || newContactName.split(' ').slice(1).join(' ') || '').trim());
    const trimmedName = capitalizeWords(`${trimmedFirstName} ${trimmedLastName}`.trim());
    const trimmedPhone = newContactPhone.trim();
    const trimmedStreet = capitalizeWords((newContactStreet.trim() || 'Av. Juárez'));
    const trimmedHouse = newContactHouseNumber.trim() || '104';
    const trimmedState = capitalizeWords(newContactState.trim());
    const trimmedCountry = capitalizeWords((newContactCountry.trim() || 'Mexico'));
    const trimmedZip = newContactZip.trim() || '78201';

    const errors: Record<string, string> = {};
    if (!trimmedFirstName) errors.firstName = 'El nombre es obligatorio';
    if (!trimmedLastName) errors.lastName = 'El apellido es obligatorio';
    if (!trimmedPhone) errors.phone = 'El teléfono celular es obligatorio';
    if (!trimmedCountry) errors.country = 'El país de residencia es obligatorio';
    if (!trimmedState) errors.state = 'El estado o provincia es obligatorio';

    if (Object.keys(errors).length > 0) {
      setBeneficiaryErrors(errors);
      return;
    }

    setBeneficiaryErrors(null);
    setIsSavingBeneficiary(true);

    const newContact: ContactItem = {
      id: `manual-${Date.now()}`,
      name: trimmedName,
      fullName: trimmedName,
      avatar: '',
      role: `${trimmedState}, ${trimmedCountry} • ${trimmedPhone}`,
      country: trimmedCountry,
      bank: newContactBank || (deliveryMethod === 'cash' ? 'OXXO Cash Pickup' : 'SPEI Banxico'),
      photoUrl: '', // Silueta de usuario sin foto
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

    // Avanzar inmediatamente al Dashboard de Desglose y Revisión
    if (activeTab === 'send') {
      setShowSendReviewModal(true);
    }

    setNewContactFirstName('');
    setNewContactLastName('');
    setNewContactName('');
    setNewContactPhone('');
    setNewContactState('');

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

  // Success screen state (Rosette Badge, Money sent successfully, Clave de Retiro)
  const [sendSuccessData, setSendSuccessData] = useState<{
    id: string;
    amount: number;
    amountMXN?: number;
    fee: number;
    totalPaid: number;
    recipientName: string;
    recipientAvatar?: string;
    recipientPhotoUrl?: string;
    recipientPhone?: string;
    recipientStreet?: string;
    recipientState?: string;
    recipientCountry?: string;
    time: string;
    deliveryTitle: string;
    deliveryMethod?: 'cash' | 'bank' | string;
    pickupStore?: string;
    paymentTitle: string;
    claveRastreoBanxico?: string;
    claveRetiroEfectivo?: string;
  } | null>(null);

  // Review & Checkout Breakdown Dashboard Modal State
  const [showSendReviewModal, setShowSendReviewModal] = useState(false);
  const [isExecutingPayment, setIsExecutingPayment] = useState(false);
  const [copiedWithdrawalPin, setCopiedWithdrawalPin] = useState(false);
  const [copiedTrackingBanxico, setCopiedTrackingBanxico] = useState(false);

  // Transaction Detail Dashboard Modal State (Actividades Recientes a Detalle)
  const [selectedTransactionDetail, setSelectedTransactionDetail] = useState<TransactionItem | null>(null);
  const [copiedDetailPin, setCopiedDetailPin] = useState(false);
  const [copiedDetailTracking, setCopiedDetailTracking] = useState(false);
  const [copiedDetailRef, setCopiedDetailRef] = useState(false);

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
  // Helper para validar y abrir el Dashboard de Desglose y Revisión (Review & Breakdown Dashboard)
  const handleStartSendReview = () => {
    if (!selectedAvatar) {
      setBeneficiaryModalTab('select');
      setShowContactModal(true);
      return;
    }

    // Validación regulatoria para Envíos USA -> México (Nombre, Apellido, País, Estado y Teléfono)
    const rawName = (selectedAvatar.fullName || selectedAvatar.name || '').trim();
    const nameParts = rawName.split(/\s+/);
    const hasFirstName = !!(nameParts[0] && nameParts[0].trim());
    const hasLastName = !!(nameParts.length >= 2 || (selectedAvatar as any).lastName);
    const hasCountry = !!(selectedAvatar.country && selectedAvatar.country.trim());
    const hasState = !!(selectedAvatar.state && selectedAvatar.state.trim());
    const hasPhone = !!(selectedAvatar.phone && selectedAvatar.phone.trim());

    if (!hasFirstName || !hasLastName || !hasCountry || !hasState || !hasPhone) {
      const fName = nameParts[0] || selectedAvatar.name || '';
      const lName = nameParts.slice(1).join(' ') || (selectedAvatar as any).lastName || '';
      setNewContactFirstName(fName);
      setNewContactLastName(lName);
      setNewContactName(rawName);
      setNewContactPhone(selectedAvatar.phone || '');
      setNewContactCountry(selectedAvatar.country || 'Mexico');
      setNewContactState(selectedAvatar.state || '');
      setNewContactStreet(selectedAvatar.street || '');
      setNewContactHouseNumber(selectedAvatar.houseNumber || '');
      setNewContactZip(selectedAvatar.zipCode || '');
      setBeneficiaryModalTab('register');
      setBeneficiaryErrors({
        firstName: !hasFirstName ? 'El nombre es obligatorio' : '',
        lastName: !hasLastName ? 'El apellido es obligatorio' : '',
        country: !hasCountry ? 'El país de residencia es obligatorio' : '',
        state: !hasState ? 'El estado o provincia es obligatorio' : '',
        phone: !hasPhone ? 'El número telefónico es obligatorio' : '',
      });
      setShowContactModal(true);
      return;
    }

    // Beneficiario validado con éxito -> Abrir Dashboard de Desglose y Revisión
    setShowSendReviewModal(true);
  };

  // Helper para ejecutar el pago desde el Dashboard de Desglose y redirigir a Success con la Clave de Retiro
  const handleExecuteSendPayment = async () => {
    if (!selectedAvatar) return;
    setIsExecutingPayment(true);

    const amt = parseFloat(amountValue) || 50;
    const fee = paymentMethod === 'credit' ? 1.99 : 0.0;
    const totalPaid = +(amt + fee).toFixed(2);
    const txId = 'KIN-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

    const storeObj = CASH_PICKUP_STORES.find((s) => s.id === selectedStore);
    const deliveryTitle = deliveryMethod === 'cash'
      ? `Retiro en Efectivo (${storeObj?.name || 'OXXO'})`
      : 'Depósito a Cuenta Bancaria (SPEI)';
    
    const paymentTitle = paymentMethod === 'debit' ? 'Tarjeta de Débito ($0.00 fee)'
      : paymentMethod === 'apple' ? 'Apple Pay ($0.00 fee)'
      : paymentMethod === 'bank' ? 'Cuenta de Banco ($0.00 fee)'
      : 'Tarjeta de Crédito ($1.99 fee)';

    // Generar Clave de Retiro en Efectivo (PIN de 8 dígitos formato XXXX-XXXX para cobro en sucursal)
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    const clientClaveRetiro = `${p1}-${p2}`;

    // Clave de Rastreo Banxico oficial
    const timestampIso = now.toISOString().replace(/\D/g, '').slice(0, 14);
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const clientClaveBanxico = `KIN${timestampIso}${randomSuffix}`.padEnd(24, '0').slice(0, 24);

    const amountMXN = +(amt * USD_TO_MXN_RATE).toFixed(2);

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
      amountMXN,
      status: 'Completado',
      claveRastreoBanxico: clientClaveBanxico,
      claveRetiroEfectivo: deliveryMethod === 'cash' ? clientClaveRetiro : undefined,
      pickupStore: pickupLocation ? pickupLocation.branch.storeName : (storeObj?.name || 'OXXO'),
      pickupCity: pickupLocation?.city,
      pickupState: pickupLocation?.state,
      nombreBeneficiario: selectedAvatar.name,
      recipientPhone: selectedAvatar.phone,
      bancoDestino: deliveryMethod === 'cash' ? (storeObj?.name || 'OXXO') : 'Red Banxico SPEI',
      cuentaBeneficiario: selectedAvatar.clabe || '',
      paymentMethod: paymentTitle,
      feeUSD: fee,
      createdAt: now.toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    setBaseBalanceUSD((prev) => +(prev - totalPaid).toFixed(2));

    try {
      const res = await fetch('/api/spei/transfer', {
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
          clabe: selectedAvatar.clabe || '',
        }),
      });
      const data = await res.json();
      const finalClaveRetiro = data.claveRetiroEfectivo || clientClaveRetiro;
      const finalClaveBanxico = data.claveRastreoBanxico || clientClaveBanxico;

      setTransactions((prev) =>
        prev.map((t) =>
          t.refNumber === txId
            ? {
                ...t,
                claveRetiroEfectivo: deliveryMethod === 'cash' ? finalClaveRetiro : undefined,
                claveRastreoBanxico: finalClaveBanxico,
              }
            : t
        )
      );

      setSendSuccessData({
        id: txId,
        amount: amt,
        amountMXN,
        fee,
        totalPaid,
        recipientName: selectedAvatar.name,
        recipientAvatar: selectedAvatar.avatar,
        recipientPhotoUrl: selectedAvatar.photoUrl,
        recipientPhone: selectedAvatar.phone,
        recipientStreet: selectedAvatar.street,
        recipientState: selectedAvatar.state,
        recipientCountry: selectedAvatar.country,
        time: `${dateStr} a las ${timeStr}`,
        deliveryTitle,
        deliveryMethod,
        pickupStore: storeObj?.name || 'OXXO',
        paymentTitle,
        claveRastreoBanxico: finalClaveBanxico,
        claveRetiroEfectivo: deliveryMethod === 'cash' ? finalClaveRetiro : undefined,
      });
    } catch (e) {
      console.warn('[SPEI API error]', e);
      setSendSuccessData({
        id: txId,
        amount: amt,
        amountMXN,
        fee,
        totalPaid,
        recipientName: selectedAvatar.name,
        recipientAvatar: selectedAvatar.avatar,
        recipientPhotoUrl: selectedAvatar.photoUrl,
        recipientPhone: selectedAvatar.phone,
        recipientStreet: selectedAvatar.street,
        recipientState: selectedAvatar.state,
        recipientCountry: selectedAvatar.country,
        time: `${dateStr} a las ${timeStr}`,
        deliveryTitle,
        deliveryMethod,
        pickupStore: storeObj?.name || 'OXXO',
        paymentTitle,
        claveRastreoBanxico: clientClaveBanxico,
        claveRetiroEfectivo: deliveryMethod === 'cash' ? clientClaveRetiro : undefined,
      });
    } finally {
      setIsExecutingPayment(false);
      setShowSendReviewModal(false);
      handleClearSendDraft();
    }
  };

  // Helper para Envío Rápido (Send Quick en 1 solo toque)
  const handleSendQuick = () => {
    if (contactsList.length === 0) {
      setBeneficiaryModalTab('register');
      setShowContactModal(true);
      return;
    }
    const recipient = contactsList[sendQuickSelectedRecipient] || contactsList[0];
    if (!recipient) {
      setBeneficiaryModalTab('select');
      setShowContactModal(true);
      return;
    }

    // Validación regulatoria para Envíos USA -> México (Nombre, Apellido, País, Estado y Teléfono)
    const rawName = (recipient.fullName || recipient.name || '').trim();
    const nameParts = rawName.split(/\s+/);
    const hasFirstName = !!(nameParts[0] && nameParts[0].trim());
    const hasLastName = !!(nameParts.length >= 2 || (recipient as any).lastName);
    const hasCountry = !!(recipient.country && recipient.country.trim());
    const hasState = !!(recipient.state && recipient.state.trim());
    const hasPhone = !!(recipient.phone && recipient.phone.trim());

    if (!hasFirstName || !hasLastName || !hasCountry || !hasState || !hasPhone) {
      const fName = nameParts[0] || recipient.name || '';
      const lName = nameParts.slice(1).join(' ') || (recipient as any).lastName || '';
      setNewContactFirstName(fName);
      setNewContactLastName(lName);
      setNewContactName(rawName);
      setNewContactPhone(recipient.phone || '');
      setNewContactCountry(recipient.country || 'Mexico');
      setNewContactState(recipient.state || '');
      setNewContactStreet(recipient.street || '');
      setNewContactHouseNumber(recipient.houseNumber || '');
      setNewContactZip(recipient.zipCode || '');
      setBeneficiaryModalTab('register');
      setBeneficiaryErrors({
        firstName: !hasFirstName ? 'El nombre es obligatorio' : '',
        lastName: !hasLastName ? 'El apellido es obligatorio' : '',
        country: !hasCountry ? 'El país de residencia es obligatorio' : '',
        state: !hasState ? 'El estado o provincia es obligatorio' : '',
        phone: !hasPhone ? 'El número telefónico es obligatorio' : '',
      });
      setShowContactModal(true);
      return;
    }
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
      nombreBeneficiario: recipient.name,
      recipientPhone: recipient.phone,
      bancoDestino: recipient.bank || 'Red Banxico SPEI',
      cuentaBeneficiario: recipient.clabe || '',
      paymentMethod: 'KIN Balance ($0.00 fee)',
      feeUSD: 0,
      createdAt: now.toISOString(),
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
      amountMXN: amt * USD_TO_MXN_RATE,
      fee: 0,
      totalPaid: amt,
      recipientName: recipient.name,
      recipientAvatar: recipient.avatar,
      recipientPhotoUrl: recipient.photoUrl,
      recipientPhone: recipient.phone,
      time: `${dateStr} a las ${timeStr}`,
      deliveryTitle: 'SPEI Exprés Inmediato (Banxico)',
      deliveryMethod: 'bank',
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
      nombreBeneficiario: service,
      bancoDestino: 'Proveedor de Servicio',
      paymentMethod: 'Saldo USD KIN Transit',
      feeUSD: 0,
      createdAt: new Date().toISOString(),
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
    const txId = 'KIN-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

    const newTx: TransactionItem = {
      id: Date.now().toString(),
      title: `KIN Cash para ${recipient}`,
      category: 'Recarga / SPEI P2P',
      time: `Hoy, ${timeStr}`,
      amount: -amountUSD,
      type: 'expense',
      iconType: 'wallet',
      dateGroup: 'Hoy',
      refNumber: txId,
      amountMXN,
      status: 'Completado',
      nombreBeneficiario: recipient,
      recipientPhone: contact?.phone,
      bancoDestino: 'Red KIN Cash P2P',
      paymentMethod: 'Saldo USD KIN Transit ($0.00 fee)',
      feeUSD: 0,
      createdAt: now.toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    setBaseBalanceUSD((prev) => +(prev - amountUSD).toFixed(2));

    setShowKinCashModal(false);
    handleClearKinCashDraft();

    setSendSuccessData({
      id: txId,
      amount: amountUSD,
      amountMXN: +(amountUSD * USD_TO_MXN_RATE).toFixed(2),
      fee: 0,
      totalPaid: amountUSD,
      recipientName: recipient,
      recipientAvatar: contact?.avatar || '',
      recipientPhotoUrl: contact?.photoUrl || '',
      recipientPhone: contact?.phone,
      time: `${dateStr} a las ${timeStr}`,
      deliveryTitle: 'KIN Cash Express (P2P Inmediato)',
      deliveryMethod: 'cash',
      paymentTitle: 'Saldo USD KIN Transit ($0.00 fee)',
    });

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

          {(activeTab === 'home' || activeTab === 'kin-cash' || activeTab === 'bill-pay' || activeTab === 'profile') && !sendSuccessData && (
            <header className="flex items-center justify-between gap-2 mb-1 px-0.5">
              <div className="flex items-center gap-2">
                {activeTab === 'profile' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="w-9 h-9 rounded-xl bg-surface-container-high border border-white/10 flex items-center justify-center text-[#2ED5A4] hover:bg-surface-container cursor-pointer transition-colors shadow-sm"
                    title="Volver a Inicio"
                  >
                    <span className="material-symbols-outlined text-[22px]">chevron_left</span>
                  </button>
                ) : (
                  <KinLogo size={34} />
                )}
                <div className="flex flex-col leading-none">
                  <span className="font-headline-md text-[17px] font-bold tracking-tight text-white">KIN</span>
                  <span className="font-label-caps text-[9px] uppercase tracking-widest text-[#2ED5A4]">Global</span>
                </div>
              </div>
            </header>
          )}
        </div>

        {/* SCREEN CONTENT BODY */}
        <main className="flex-1 px-4 py-2 pb-24 relative">
        {sendSuccessData ? (
          <ReceiptView
            data={sendSuccessData}
            exchangeRate={USD_TO_MXN_RATE}
            language={language}
            onDone={() => {
              setSendSuccessData(null);
              setActiveTab('home');
            }}
          />
        ) : (
          <>

        {/* ========================================================================= */}
        {/* SCREEN 1: "MY CARD / HOME" (STITCH EXECUTIVE DASHBOARD)                   */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <HomeView
            userFirstName={userFirstName}
            userName={userName}
            userKycTier={userKycTier}
            currencyPref={currencyPref}
            handleToggleCurrency={handleToggleCurrency}
            hideBalance={hideBalance}
            setHideBalance={setHideBalance}
            executiveBalance={executiveBalance}
            USD_TO_MXN_RATE={USD_TO_MXN_RATE}
            language={language}
            onNavigateTab={(tab) => setActiveTab(tab)}
            contactsList={contactsList}
            setShowContactModal={setShowContactModal}
            isContactEditMode={isContactEditMode}
            setIsContactEditMode={setIsContactEditMode}
            setQuickContactActionTarget={setQuickContactActionTarget}
            handleDeleteContact={handleDeleteContact}
            setEditingContactAvatarTarget={setEditingContactAvatarTarget}
            setEditingContactPhotoInput={setEditingContactPhotoInput}
            dashboardFilter={dashboardFilter}
            setDashboardFilter={setDashboardFilter}
            filteredDashboardTransactions={filteredDashboardTransactions}
            setSelectedTransactionDetail={setSelectedTransactionDetail}
          />
        )}

        {/* ========================================================================= */}
        {/* SCREEN: "KIN CASH" (P2P EXPRESS ZERO-FEE DASHBOARD TAB)                   */}
        {/* ========================================================================= */}
        {activeTab === 'kin-cash' && (
          <div className="animate-fade-in space-y-4">
            <KinCashP2PModal
              isScreen={true}
              userId={userId}
              language={language}
              onContactCreated={(c) => setContactsList((prev) => [c, ...prev])}
              onP2PSuccess={handleP2PSuccess}
              contacts={contactsList}
              familyNetwork={familyNetwork}
              onViewHistory={() => setActiveTab('transactions')}
              exchangeRate={USD_TO_MXN_RATE}
              userBalanceUSD={executiveBalance}
              draftContact={kinCashDraftContact}
              onDraftContactChange={setKinCashDraftContact}
              draftAmount={kinCashDraftAmount}
              onDraftAmountChange={setKinCashDraftAmount}
              draftNote={kinCashDraftNote}
              onDraftNoteChange={setKinCashDraftNote}
              onClearDraft={handleClearKinCashDraft}
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
              language={language}
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
          <SendView
            onBack={() => setActiveTab('home')}
            onViewHistory={() => setActiveTab('transactions')}
            amountValue={amountValue}
            setAmountValue={setAmountValue}
            USD_TO_MXN_RATE={USD_TO_MXN_RATE}
            language={language}
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
            selectedAvatar={selectedAvatar}
            onSelectAvatarClick={() => {
              setShowContactModal(true);
            }}
            handleClearSendDraft={handleClearSendDraft}
            handleStartSendReview={handleStartSendReview}
            pickupLocation={pickupLocation}
            setPickupLocation={setPickupLocation}
            onOpenPickupLocationModal={() => setShowPickupLocationModal(true)}
            receiverMode={receiverMode}
            setReceiverMode={setReceiverMode}
            onOpenNewRecipient={() => {
              setBeneficiaryModalTab('register');
              setShowContactModal(true);
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: "BILL PAYMENTS" (IMAGEN 2 CENTRO)                                */}
        {/* ========================================================================= */}
        {activeTab === 'bills' && (
          <BillsView
            onBack={() => setActiveTab('home')}
            selectedBillServiceId={selectedBillServiceId}
            language={language}
            onSelectService={(serviceId) => {
              setSelectedBillServiceId(serviceId);
              setShowBillPayModal(true);
            }}
            transactions={transactions}
            onSelectTransaction={setSelectedTransactionDetail}
            renderTransactionIcon={renderTransactionIcon}
          />
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: "TRANSACTIONS" (DASHBOARD EXCLUSIVO Y ORDENADO DE MOVIMIENTOS)  */}
        {/* ========================================================================= */}
        {activeTab === 'transactions' && (
          <TransactionsView
            onBack={() => setActiveTab('home')}
            transactions={transactions}
            groupedTransactions={groupedTransactions}
            currencyPref={currencyPref}
            language={language}
            USD_TO_MXN_RATE={USD_TO_MXN_RATE}
            onSelectTransaction={setSelectedTransactionDetail}
            renderTransactionIcon={renderTransactionIcon}
          />
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: "MY WALLET" (KIN VISA DEBIT CARD & BÓVEDA DE DIVISAS)          */}
        {/* ========================================================================= */}
        {activeTab === 'wallet' && (
          <WalletView
            onBack={() => setActiveTab('home')}
            onOpenSettings={() => setShowSettingsModal(true)}
            userName={userName}
            netBalance={netBalance}
            currencyPref={currencyPref}
            language={language}
            USD_TO_MXN_RATE={USD_TO_MXN_RATE}
            cardFrozen={cardFrozen}
            setCardFrozen={setCardFrozen}
            showCardDetails={showCardDetails}
            setShowCardDetails={setShowCardDetails}
          />
        )}

        {/* ========================================================================= */}
        {/* SCREEN 6: "SEND QUICK DASHBOARD" (DASHBOARD NATIVO MÓVIL EN 1 TOQUE)     */}
        {/* ========================================================================= */}
        {activeTab === 'send-quick' && (
          <SendQuickView
            onBack={() => setActiveTab('home')}
            contactsList={contactsList}
            sendQuickSelectedRecipient={sendQuickSelectedRecipient}
            setSendQuickSelectedRecipient={setSendQuickSelectedRecipient}
            onAddContact={() => setShowContactModal(true)}
            sendQuickAmount={sendQuickAmount}
            setSendQuickAmount={setSendQuickAmount}
            USD_TO_MXN_RATE={USD_TO_MXN_RATE}
            netBalance={netBalance}
            onSendQuick={handleSendQuick}
            language={language}
            currencyPref={currencyPref}
          />
        )}

        {/* ========================================================================= */}
        {/* SCREEN 7: "MY PROFILE" (INFORMACIÓN COMPLETA DE REGISTRO & COMPLIANCE)   */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <ProfileView
            onBack={() => setActiveTab('home')}
            onOpenSettings={() => setShowSettingsModal(true)}
            userKycTier={userKycTier}
            userAvatar={userAvatar}
            userName={userName}
            userFirstName={userFirstName}
            userLastName={userLastName}
            userEmail={userEmail}
            handleOpenAvatarPicker={handleOpenAvatarPicker}
            handleCopyClientId={handleCopyClientId}
            userClientId={userClientId}
            copiedClientId={copiedClientId}
            userPhone={userPhone}
            userCity={userCity}
            userState={userState}
            userZip={userZip}
            userAddress1={userAddress1}
            userAddress2={userAddress2}
            userMemberSince={userMemberSince}
            userDailyLimit={userDailyLimit}
            userDocType={userDocType}
            userDocNumber={userDocNumber}
            onOpenVault={() => setShowVaultModal(true)}
            biometricsEnabled={biometricsEnabled}
            setBiometricsEnabled={setBiometricsEnabled}
            pushNotificationsEnabled={pushNotificationsEnabled}
            setPushNotificationsEnabled={setPushNotificationsEnabled}
            language={language}
            setLanguage={setLanguage}
            userId={userId}
            currencyPref={currencyPref}
            handleToggleCurrency={handleToggleCurrency}
            theme={theme}
            handleToggleTheme={handleToggleTheme}
            onUpdateProfile={handleUpdateProfile}
            onUpdateAvatar={(newAvatar: string) => {
              setUserAvatar(newAvatar);
              if (typeof window !== 'undefined') {
                try {
                  localStorage.setItem('kin_avatar', newAvatar);
                } catch (_) {}
              }
            }}
            exchangeRate={exchangeRate}
            onExchangeRateUpdated={(newRate: number) => {
              setExchangeRate(newRate);
            }}
            handleLogout={handleLogout}
          />
        )}
        </>
        )}
        </main>

        {/* ========================================================================= */}
        {/* STITCH MASTER BOTTOM DOCK (5 TABS: HOME, SEND, KIN CASH, BILL PAY, VAULT) */}
        {/* ========================================================================= */}
        {!sendSuccessData && activeTab !== 'send-quick' && (
          <nav
            className="stitch-bottom-dock"
            style={{ backgroundColor: theme === 'light' ? '#FFFFFF' : '#181825', opacity: 1 }}
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
                title={language === 'en' ? 'Home' : 'Inicio'}
              >
                <span className="material-symbols-outlined text-[24px]">home</span>
                <span className="font-label-caps text-[10px] tracking-tight">
                  {language === 'en' ? 'Home' : 'Inicio'}
                </span>
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
                title={language === 'en' ? 'Send' : 'Enviar'}
              >
                <span className="material-symbols-outlined text-[24px]">send</span>
                <span className="font-label-caps text-[10px] tracking-tight">
                  {language === 'en' ? 'Send' : 'Enviar'}
                </span>
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
                title={language === 'en' ? 'Bill Pay' : 'Servicios'}
              >
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                <span className="font-label-caps text-[10px] tracking-tight">
                  {language === 'en' ? 'Bill Pay' : 'Servicios'}
                </span>
              </button>

              {/* 5. Profile */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('profile');
                  setShowKinCashModal(false);
                  setShowBillPayModal(false);
                  setShowVaultModal(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'text-primary font-bold scale-105'
                    : 'text-on-surface-variant hover:text-white'
                }`}
                title={language === 'en' ? 'Profile' : 'Perfil'}
              >
                <span className="material-symbols-outlined text-[24px]">person</span>
                <span className="font-label-caps text-[10px] tracking-tight">
                  {language === 'en' ? 'Profile' : 'Perfil'}
                </span>
              </button>
            </div>
          </nav>
        )}

      </div>

      {/* Modals con aislamiento total de capas */}
      <MexicanBillPayModal
        isOpen={showBillPayModal}
        language={language}
        onClose={() => setShowBillPayModal(false)}
        onPaymentSuccess={handleBillPaymentSuccess}
        selectedServiceId={selectedBillServiceId}
      />
      <KinCashP2PModal
        isOpen={showKinCashModal}
        userId={userId}
        language={language}
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
        draftContact={kinCashDraftContact}
        onDraftContactChange={setKinCashDraftContact}
        draftAmount={kinCashDraftAmount}
        onDraftAmountChange={setKinCashDraftAmount}
        draftNote={kinCashDraftNote}
        onDraftNoteChange={setKinCashDraftNote}
        onClearDraft={handleClearKinCashDraft}
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
        onCurrencyChange={handleToggleCurrency}
        language={language}
        onLanguageChange={(newLang) => {
          setLanguage(newLang);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('kin_language', newLang);
            } catch (_) {}
          }
          if (userId) {
            fetch('/api/account/data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, updates: { language: newLang } }),
            }).catch(() => {});
          }
        }}
      />

      {/* ========================================================================= */}
      {/* MODAL: AGENDA DE CONTACTOS DEL TELÉFONO ESTILO WHATSAPP iOS               */}
      {/* ========================================================================= */}
      <WhatsAppContactsModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        contacts={contactsList}
        familyNetwork={familyNetwork}
        userId={userId}
        language={language}
        onImportBatch={(newBatch) => {
          setContactsList((prev) => {
            const existingIds = new Set(prev.map((c) => c.phone?.replace(/\D/g, '') || c.name.toLowerCase()));
            const toAdd = newBatch.filter((c) => !existingIds.has(c.phone?.replace(/\D/g, '') || c.name.toLowerCase()));
            return [...toAdd, ...prev];
          });
          newBatch.forEach((contact) => {
            fetch('/api/contacts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                name: contact.name,
                fullName: contact.fullName,
                phone: contact.phone,
                bank: contact.bank,
                avatar: contact.avatar,
                photoUrl: contact.photoUrl,
                country: contact.country || 'Mexico',
              }),
            }).catch(() => {});
          });
        }}
        onSelectContact={(contact) => {
          setSelectedAvatar(contact);

          // Agregar al carrusel al frente si no estaba
          setContactsList((prev) => {
            const exists = prev.some(
              (c) =>
                c.id === contact.id ||
                (c.phone && contact.phone && c.phone.replace(/\D/g, '') === contact.phone.replace(/\D/g, ''))
            );
            if (exists) return prev;
            return [contact, ...prev];
          });

          // Persistir en backend / Firestore
          fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              name: contact.name,
              fullName: contact.fullName,
              phone: contact.phone,
              bank: contact.bank,
              avatar: contact.avatar,
              photoUrl: contact.photoUrl,
              country: contact.country || 'Mexico',
            }),
          }).catch(() => {});

          setContactFeedback(`Destinatario ${contact.fullName || contact.name} seleccionado.`);
          setTimeout(() => setContactFeedback(null), 3000);

          if (activeTab === 'send') {
            setShowSendReviewModal(true);
          }
        }}
      />

      {/* ========================================================================= */}
      {/* MODALES MODULARIZADOS: EMIL KOWALSKI MICRO-INTERACTIONS & APPLE ERGONOMICS */}
      {/* ========================================================================= */}

      {/* MODAL 1: Action Sheet de Contacto Rápido */}
      <QuickContactActionModal
        target={quickContactActionTarget}
        onClose={() => setQuickContactActionTarget(null)}
        language={language}
        contactsCount={contactsList.length}
        onSendMoney={(contact) => {
          setSelectedAvatar(contact);
          setQuickContactActionTarget(null);
          setActiveTab('send');
        }}
        onSendKinCash={(contact) => {
          setKinCashDraftContact(contact);
          setQuickContactActionTarget(null);
          setActiveTab('kin-cash');
        }}
        onEditPhoto={(contact) => {
          setEditingContactAvatarTarget(contact);
          setEditingContactPhotoInput(contact.photoUrl || '');
          setQuickContactActionTarget(null);
        }}
        onMoveLeft={(index) => {
          handleMoveContactUp(index);
          setQuickContactActionTarget((prev) =>
            prev ? { ...prev, index: Math.max(0, prev.index - 1) } : null
          );
        }}
        onMoveRight={(index) => {
          handleMoveContactDown(index);
          setQuickContactActionTarget((prev) =>
            prev ? { ...prev, index: Math.min(contactsList.length - 1, prev.index + 1) } : null
          );
        }}
        onDeleteContact={(contact) => {
          if (confirm(language === 'en' ? `Are you sure you want to remove ${contact.name} from your quick sends?` : `¿Estás seguro de que deseas eliminar a ${contact.name} de tus envíos rápidos?`)) {
            handleDeleteContact(contact.id);
            setQuickContactActionTarget(null);
            setContactFeedback(language === 'en' ? `Contact ${contact.name} removed from list.` : `Contacto ${contact.name} eliminado de la lista.`);
            setTimeout(() => setContactFeedback(null), 3000);
          }
        }}
      />

      {/* MODAL 2: Editor de Foto / Avatar de Contacto */}
      <ContactAvatarPickerModal
        target={editingContactAvatarTarget}
        photoInput={editingContactPhotoInput}
        onPhotoInputChange={setEditingContactPhotoInput}
        onClose={() => setEditingContactAvatarTarget(null)}
        onSave={(target, photoUrl) => handleSaveContactPhoto(target, photoUrl)}
        isUpdating={isUpdatingContactPhoto}
        language={language}
      />

      {/* MODAL 3: Editor de Perfil de Usuario & Configuración */}
      <UserProfileEditModal
        isOpen={showAvatarPicker}
        onClose={handleCancelProfile}
        draftLanguage={draftUserLanguage}
        setDraftLanguage={setDraftUserLanguage}
        draftCurrencyPref={draftUserCurrencyPref}
        setDraftCurrencyPref={setDraftUserCurrencyPref}
        draftFirstName={draftUserFirstName}
        setDraftFirstName={setDraftUserFirstName}
        draftLastName={draftUserLastName}
        setDraftLastName={setDraftUserLastName}
        draftEmail={draftUserEmail}
        setDraftEmail={setDraftUserEmail}
        draftPhone={draftUserPhone}
        setDraftPhone={setDraftUserPhone}
        draftCity={draftUserCity}
        setDraftCity={setDraftUserCity}
        draftState={draftUserState}
        setDraftState={setDraftUserState}
        draftAvatar={draftUserAvatar}
        setDraftAvatar={setDraftUserAvatar}
        customAvatarInput={customAvatarInput}
        setCustomAvatarInput={setCustomAvatarInput}
        onSave={handleSaveProfile}
      />

      {/* MODAL 4: Desglose y Revisión de Envío (Checkout Transparente) */}
      <SendReviewModal
        isOpen={showSendReviewModal}
        onClose={() => setShowSendReviewModal(false)}
        selectedAvatar={selectedAvatar}
        amountValue={amountValue}
        USD_TO_MXN_RATE={USD_TO_MXN_RATE}
        paymentMethod={paymentMethod}
        paymentFee={paymentFee}
        deliveryMethod={deliveryMethod}
        selectedStore={selectedStore}
        language={language}
        isExecutingPayment={isExecutingPayment}
        onExecutePayment={handleExecuteSendPayment}
        cashPickupStores={CASH_PICKUP_STORES}
        pickupLocation={pickupLocation}
      />

      {/* MODAL 5: Detalle de Transacción con Recibo Viral WhatsApp */}
      <TransactionDetailModal
        transaction={selectedTransactionDetail}
        onClose={() => setSelectedTransactionDetail(null)}
        USD_TO_MXN_RATE={USD_TO_MXN_RATE}
        language={language}
      />

      {/* MODAL 6: Selector de Estado, Ciudad y Sucursal en México (KIN Cash Pickup) */}
      <CashPickupLocationModal
        isOpen={showPickupLocationModal}
        onClose={() => setShowPickupLocationModal(false)}
        language={language}
        currentSelection={pickupLocation}
        onSelectLocation={(loc) => {
          setPickupLocation(loc);
          if (loc.branch.chain && loc.branch.chain !== 'any') {
            setSelectedStore(loc.branch.chain);
          }
        }}
      />
    </div>
  );
}
