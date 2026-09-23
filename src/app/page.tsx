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
    if (user.city) setUserCity(capitalizeWords(user.city));
    if (user.state) setUserState(capitalizeWords(user.state));
    if (user.zip) setUserZip(user.zip);
    if (user.country) setUserCountry(capitalizeWords(user.country));
    // Asignar el avatar explícito (si está vacío o es foto de stock ficticia, deja recuadro vacío sin foto)
    setUserAvatar(user.avatar && !user.avatar.includes('images.unsplash.com') ? user.avatar : '');
    if (user.clientId) setUserClientId(user.clientId);
    if (user.memberSince) setUserMemberSince(user.memberSince);
    if (user.docType) setUserDocType(user.docType);
    if (user.docNumber) setUserDocNumber(user.docNumber);
    if (user.kycTier) setUserKycTier(user.kycTier);
    if (user.dailyLimit) setUserDailyLimit(user.dailyLimit);
    if (typeof user.balanceUSD === 'number') setBaseBalanceUSD(user.balanceUSD);
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

    // 0. Recuperar idioma y moneda guardados en localStorage
    const savedLang = localStorage.getItem('kin_language');
    if (savedLang === 'es' || savedLang === 'en') {
      setLanguage(savedLang);
    }
    const savedCurr = localStorage.getItem('kin_currency_pref');
    if (savedCurr === 'USD' || savedCurr === 'MXN') {
      setCurrencyPref(savedCurr);
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kin_draft_send_recipient');
      localStorage.removeItem('kin_draft_send_amount');
      localStorage.removeItem('kin_draft_send_delivery');
      localStorage.removeItem('kin_draft_send_store');
    }
    if (userId) {
      fetch('/api/account/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates: { draftSend: null } }),
      }).catch(() => {});
    }
  };

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
    if (amountValue && amountValue !== '50') {
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
  }, [userId, kinCashDraftContact, kinCashDraftAmount, kinCashDraftNote, selectedAvatar, amountValue, deliveryMethod, selectedStore]);

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
      pickupStore: storeObj?.name || 'OXXO',
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

          {(activeTab === 'home' || activeTab === 'kin-cash' || activeTab === 'bill-pay') && !sendSuccessData && (
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
                  To {sendSuccessData.recipientName}
                </p>
              </div>
            </div>

            {/* ================================================================= */}
            {/* CLAVE OFICIAL DE RETIRO EN EFECTIVO (SUCURSAL SELECCIONADA)      */}
            {/* ================================================================= */}
            {sendSuccessData.claveRetiroEfectivo ? (
              <div className="bg-gradient-to-b from-[#182322] to-[#12161b] border-2 border-[#2ED5A4]/50 rounded-3xl p-4 shadow-[0_0_35px_rgba(46,213,164,0.22)] space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#2ED5A4]/20 flex items-center justify-center text-base">
                      🔑
                    </div>
                    <div>
                      <span className="text-[10px] font-black tracking-wider uppercase text-[#2ED5A4] block">
                        Clave Oficial de Retiro en Efectivo
                      </span>
                      <p className="text-xs font-bold text-white">
                        Cobro en ventanilla: {sendSuccessData.pickupStore || 'OXXO'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#2ED5A4]/20 border border-[#2ED5A4]/40 text-[10px] font-black text-[#2ED5A4] tracking-wider uppercase shadow-sm">
                    LISTA EN CAJA
                  </span>
                </div>

                {/* Gran Clave Numérica */}
                <div className="py-3 px-3 bg-black/60 rounded-2xl border border-[#2ED5A4]/40 text-center relative overflow-hidden group">
                  <div className="text-[10px] text-[#8E91A5] font-semibold mb-1 tracking-wider uppercase">
                    Código de Retiro Único (PIN)
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-financial-mono text-[#2ED5A4] tracking-widest select-all drop-shadow-[0_2px_14px_rgba(46,213,164,0.45)]">
                    {sendSuccessData.claveRetiroEfectivo}
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-1 font-medium">
                    Vigencia: 30 días • Sin costo adicional para el beneficiario
                  </div>
                </div>

                {/* Botones de Acción: Copiar Clave & Compartir por WhatsApp */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (sendSuccessData.claveRetiroEfectivo) {
                        navigator.clipboard?.writeText(sendSuccessData.claveRetiroEfectivo);
                        setCopiedWithdrawalPin(true);
                        setTimeout(() => setCopiedWithdrawalPin(false), 2500);
                      }
                    }}
                    className="h-12 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer active:scale-[0.98]"
                  >
                    {copiedWithdrawalPin ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-[#2ED5A4]" />
                        <span className="text-[#2ED5A4]">¡Clave Copiada!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-4 h-4 text-white" />
                        <span>Copiar Clave</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `¡Hola ${sendSuccessData.recipientName}! 💵 Te envié $${(sendSuccessData.amountMXN || (sendSuccessData.amount * USD_TO_MXN_RATE)).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN a través de KIN.\n\n` +
                      `📍 Puedes retirarlo en efectivo de inmediato en cualquier sucursal ${sendSuccessData.pickupStore || 'OXXO'} de México.\n\n` +
                      `🔑 TU CLAVE DE RETIRO ES: ${sendSuccessData.claveRetiroEfectivo}\n\n` +
                      `Solo acude a ventanilla, menciona cobro de remesa KIN y presenta tu identificación oficial vigente (INE o Pasaporte). ¡Listo!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-[0_4px_16px_rgba(37,211,102,0.35)] active:scale-[0.98]"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-black" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Pasos para retirar en ventanilla */}
                <div className="bg-black/30 rounded-2xl p-3 border border-white/5 space-y-1.5 text-[11px] text-[#A6A9BC]">
                  <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#2ED5A4]">storefront</span>
                    Instrucciones para {sendSuccessData.recipientName}:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 pl-0.5 text-[10.5px]">
                    <li>Acudir a cualquier sucursal <strong>{sendSuccessData.pickupStore || 'OXXO'}</strong> en México.</li>
                    <li>Solicitar en ventanilla o caja el <strong>cobro de remesa KIN</strong>.</li>
                    <li>Presentar <strong>INE o Pasaporte vigente</strong> y proporcionar la Clave: <strong className="text-[#2ED5A4] font-mono">{sendSuccessData.claveRetiroEfectivo}</strong>.</li>
                  </ol>
                </div>
              </div>
            ) : sendSuccessData.claveRastreoBanxico ? (
              <div className="bg-[#181928] border border-[#2ED5A4]/30 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E91A5] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#2ED5A4]">verified_user</span>
                    Clave de Rastreo Banxico (CEP)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (sendSuccessData.claveRastreoBanxico) {
                        navigator.clipboard?.writeText(sendSuccessData.claveRastreoBanxico);
                        setCopiedTrackingBanxico(true);
                        setTimeout(() => setCopiedTrackingBanxico(false), 2500);
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-[#2ED5A4] hover:underline font-semibold cursor-pointer"
                  >
                    <span>{copiedTrackingBanxico ? '¡Copiado!' : 'Copiar CEP'}</span>
                    <CopyIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="bg-black/40 rounded-xl p-2 font-financial-mono text-xs text-white break-all select-all border border-white/5">
                  {sendSuccessData.claveRastreoBanxico}
                </div>
                <p className="text-[10px] text-[#8E91A5]">
                  Depósito interbancario SPEI procesado. Verificable en Banxico mediante Comprobante Electrónico de Pago.
                </p>
              </div>
            ) : null}

            {/* Method details pill */}
            <div className="bg-[#181928] border border-white/10 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#8E91A5]">
                <span>Monto enviado en USD</span>
                <span className="text-white font-bold">${sendSuccessData.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between text-[#8E91A5]">
                <span>Tipo de cambio garantizado</span>
                <span className="text-white font-semibold">1 USD = {USD_TO_MXN_RATE.toFixed(2)} MXN</span>
              </div>
              <div className="flex items-center justify-between text-[#8E91A5]">
                <span>Monto que recibe el familiar</span>
                <span className="text-[#2ED5A4] font-extrabold font-financial-mono text-sm">
                  ${(sendSuccessData.amountMXN || (sendSuccessData.amount * USD_TO_MXN_RATE)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                </span>
              </div>
              <div className="flex items-center justify-between text-[#8E91A5] pt-1 border-t border-white/5">
                <span>Tarifa por transferencia KIN</span>
                <span className="text-[#2ED5A4] font-bold">GRATIS ($0.00 USD)</span>
              </div>
              {sendSuccessData.fee > 0 ? (
                <div className="flex items-center justify-between text-[#8E91A5]">
                  <span>Comisión ({sendSuccessData.paymentTitle})</span>
                  <span className="text-amber-400 font-semibold">+${sendSuccessData.fee.toFixed(2)} USD</span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[#8E91A5]">
                  <span>Comisión método de pago</span>
                  <span className="text-white font-semibold">$0.00 USD</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[#8E91A5] pt-1 border-t border-white/5">
                <span>Total debitado</span>
                <span className="text-white font-extrabold text-sm">${sendSuccessData.totalPaid.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between text-[#8E91A5] pt-1 border-t border-white/5">
                <span>Método de entrega</span>
                <span className="text-[#2ED5A4] font-bold">{sendSuccessData.deliveryTitle}</span>
              </div>
            </div>

            {/* Statement Pill with Copy button */}
            <div className="bg-[#181928] border border-white/10 rounded-2xl p-3 flex items-center justify-between">
              <span className="text-xs text-[#8E91A5] font-medium">Folio de Rastreo KIN</span>
              <button
                type="button"
                onClick={() => alert(`ID de transacción copiado: ${sendSuccessData.id}`)}
                className="flex items-center gap-1.5 text-xs text-[#2ED5A4] hover:underline cursor-pointer font-semibold font-mono"
              >
                <span>{sendSuccessData.id}</span>
                <CopyIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Timestamp */}
            <p className="text-center text-[11px] text-[#8E91A5]">
              {sendSuccessData.time}
            </p>

            {/* Outlined Action Buttons: Download PDF & Share Receipt */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => alert('Descargando comprobante PDF encriptado de KIN...')}
                className="w-full h-12 rounded-2xl bg-[#181928] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <DownloadIcon className="w-4 h-4 text-[#2ED5A4]" />
                <span>Descargar Comprobante PDF</span>
              </button>

              <button
                type="button"
                onClick={() => alert('Compartiendo comprobante vía WhatsApp / Mensaje...')}
                className="w-full h-12 rounded-2xl bg-[#181928] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <ShareReceiptIcon className="w-4 h-4 text-[#2ED5A4]" />
                <span>Compartir Comprobante</span>
              </button>
            </div>

            {/* Bottom Full Width CTA Button: Done → */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSendSuccessData(null);
                  setActiveTab('home');
                }}
                className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#18A57E] text-white font-headline-md text-title-base font-bold shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] hover:shadow-[0_16px_32px_-4px_rgba(46,213,164,0.6)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Done</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ) : (
          <>

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
                {/* Balance Header & Dual Currency Segmented Switch */}
                <div className="flex items-center justify-between gap-2">
                  {/* Conmutador Bimonetario Transfronterizo 🇺🇸 USD / 🇲🇽 MXN */}
                  <div className="flex items-center bg-[#0C0D18] p-1 rounded-2xl border border-white/10 shadow-inner">
                    <button
                      type="button"
                      onClick={() => handleToggleCurrency('USD')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        currencyPref === 'USD'
                          ? 'bg-[#2ED5A4] text-[#06070B] shadow-md shadow-[#2ED5A4]/20 font-black'
                          : 'text-[#8E91A5] hover:text-white'
                      }`}
                      title="Activar Cuenta USA en Dólares"
                    >
                      <span className="text-sm">🇺🇸</span>
                      <span>USD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleCurrency('MXN')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        currencyPref === 'MXN'
                          ? 'bg-[#2ED5A4] text-[#06070B] shadow-md shadow-[#2ED5A4]/20 font-black'
                          : 'text-[#8E91A5] hover:text-white'
                      }`}
                      title="Activar Billetera México en Pesos (Modo Viajero)"
                    >
                      <span className="text-sm">🇲🇽</span>
                      <span>MXN</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-[#2ED5A4] font-financial-mono text-[11px] font-bold border border-[#2ED5A4]/20">
                      {currencyPref === 'USD' ? '🇺🇸 Cuenta USA' : '🇲🇽 Billetera MX'}
                    </span>

                    <button
                      type="button"
                      onClick={() => setHideBalance(!hideBalance)}
                      aria-label="Toggle Balance Visibility"
                      className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-white transition-colors cursor-pointer border border-white/5"
                      title={hideBalance ? 'Mostrar saldo' : 'Ocultar saldo'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {hideBalance ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Banner Inteligente de Modo Viajero cuando está activo en Pesos MXN */}
                {currencyPref === 'MXN' && (
                  <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-[#2ED5A4]/10 border border-[#2ED5A4]/25 text-[11px] text-[#2ED5A4] animate-fade-in">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📍</span>
                      <span className="font-semibold text-white">
                        {language === 'en' ? 'Travel Mode Active: México' : 'Modo Viajero Activo: México'}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#2ED5A4] font-bold">
                      {language === 'en' ? 'Local Spending & SPEI' : 'Pesos para KIN CASH & SPEI'}
                    </span>
                  </div>
                )}

                {/* Main Dynamic Balance Display (USD o MXN según preferencia activa) */}
                <div className="flex flex-col">
                  {currencyPref === 'USD' ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display-hero text-display-hero text-white tracking-tight font-extrabold">
                          {hideBalance
                            ? '••••••••'
                            : `$${executiveBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </span>
                        <span className="font-financial-mono text-financial-mono text-[#2ED5A4] font-black">USD</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-body-medium text-body-medium text-[#8E91A5] font-semibold">
                          {hideBalance
                            ? '≈ •••••••• MXN'
                            : `≈ $${(executiveBalance * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`}
                        </span>
                        <span className="text-[10px] text-[#8E91A5]">
                          (en México al tipo de cambio)
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display-hero text-display-hero text-white tracking-tight font-extrabold">
                          {hideBalance
                            ? '••••••••'
                            : `$${(executiveBalance * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </span>
                        <span className="font-financial-mono text-financial-mono text-[#2ED5A4] font-black">MXN</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-body-medium text-body-medium text-[#8E91A5] font-semibold">
                          {hideBalance
                            ? '≈ •••••••• USD'
                            : `≈ $${executiveBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`}
                        </span>
                        <span className="text-[10px] text-[#8E91A5]">
                          (equivalente en cuenta origen USA)
                        </span>
                      </div>
                    </>
                  )}
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

            {/* Quick Action Rail Adaptable por Moneda (USA USD vs México MXN) */}
            <div className="grid grid-cols-4 gap-2.5">
              {currencyPref === 'USD' ? (
                <>
                  {/* Send Money to Mexico */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('send')}
                    className="group flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary shadow-[0_8px_20px_-4px_rgba(46,213,164,0.45)] transition-transform group-hover:scale-105 active:scale-95">
                      <span className="material-symbols-outlined text-[26px]">send</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-white font-bold tracking-tight">
                      {language === 'en' ? 'Send MX' : 'Enviar MX'}
                    </span>
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
                </>
              ) : (
                <>
                  {/* KIN CASH MX: P2P en Pesos para México / Viajeros */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('kin-cash')}
                    className="group flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary shadow-[0_8px_20px_-4px_rgba(46,213,164,0.45)] transition-transform group-hover:scale-105 active:scale-95">
                      <span className="material-symbols-outlined text-[26px]">bolt</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-white font-bold tracking-tight">KIN CASH</span>
                  </button>

                  {/* Retirar SPEI a banco de México */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('send')}
                    className="group flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary transition-transform group-hover:scale-105 active:scale-95 shadow-md border border-white/5">
                      <span className="material-symbols-outlined text-[26px]">account_balance</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-white font-bold tracking-tight">Retiro SPEI</span>
                  </button>

                  {/* 1-Tap Send a Familia */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('send-quick')}
                    className="group flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-secondary transition-transform group-hover:scale-105 active:scale-95 shadow-md border border-white/5">
                      <span className="material-symbols-outlined text-[26px]">touch_app</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-on-surface font-semibold tracking-tight">1-Tap Send</span>
                  </button>

                  {/* Pagar Servicios en México (CFE, recargas, etc.) */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('bill-pay')}
                    className="group flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-secondary transition-transform group-hover:scale-105 active:scale-95 shadow-md border border-white/5">
                      <span className="material-symbols-outlined text-[26px]">receipt_long</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-on-surface font-semibold tracking-tight">Servicios</span>
                  </button>
                </>
              )}
            </div>

            {/* Beneficiaries Horizontal Carousel */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">family_restroom</span>
                  <h2 className="font-title-base text-title-base text-white font-bold">Quick Send to Family</h2>
                  {isContactEditMode && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold animate-pulse">
                      Modo Edición
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isContactEditMode ? (
                    <button
                      type="button"
                      onClick={() => setIsContactEditMode(false)}
                      className="px-3 py-1 rounded-full bg-primary text-on-primary font-caption-sm text-xs font-black cursor-pointer shadow-md active:scale-95 transition-all"
                    >
                      Listo ✓
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab('send-quick')}
                      className="font-caption-sm text-caption-sm text-primary font-bold hover:underline cursor-pointer"
                    >
                      View All ({contactsList.length})
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 overflow-x-auto pb-1 -mx-margin-mobile px-margin-mobile scrollbar-none">
                {/* Botón + : Acceso Directo a los Contactos del Celular (iPhone / Android) */}
                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer"
                  title="Acceder a tus contactos del celular"
                >
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary shadow-sm group-hover:bg-surface-bright group-active:scale-95 transition-all border border-white/5">
                    <span className="material-symbols-outlined text-[26px]">add</span>
                  </div>
                  <span className="font-caption-sm text-caption-sm text-on-surface-variant font-medium">New Recipient</span>
                </button>

                {/* Contactos Frecuentes con Soporte de Pulsación Larga (Long Press tipo iPhone) */}
                {contactsList.map((contact, idx) => {
                  const bankLogo = getBankLogoUrl(contact.bank);
                  let timer: any = null;

                  const handleTouchStart = () => {
                    timer = setTimeout(() => {
                      setIsContactEditMode(true);
                      setQuickContactActionTarget({ contact, index: idx });
                    }, 500); // 500ms long-press
                  };

                  const handleTouchEnd = () => {
                    if (timer) clearTimeout(timer);
                  };

                  return (
                    <div
                      key={contact.id || idx}
                      className={`flex flex-col items-center gap-1.5 flex-shrink-0 text-left relative ${
                        isContactEditMode ? 'animate-jiggle' : ''
                      }`}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      onMouseDown={handleTouchStart}
                      onMouseUp={handleTouchEnd}
                      onMouseLeave={handleTouchEnd}
                    >
                      {/* Botón de Acción / Selección */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isContactEditMode) {
                            setQuickContactActionTarget({ contact, index: idx });
                          } else {
                            // Clic normal: abrir menú de envío rápido o acción directa
                            setQuickContactActionTarget({ contact, index: idx });
                          }
                        }}
                        className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-white/10 group cursor-pointer active:scale-95 transition-transform"
                        title="Mantén presionado para editar avatar o eliminar"
                      >
                        <ContactAvatar
                          photoUrl={contact.photoUrl}
                          name={contact.name}
                          className="w-full h-full rounded-2xl group-hover:scale-105 transition-transform"
                          iconSize="text-[32px]"
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
                      </button>

                      {/* Botón flotante 'X' tipo iPhone cuando está en modo edición */}
                      {isContactEditMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`¿Eliminar a ${contact.name} de tus envíos frecuentes?`)) {
                              handleDeleteContact(contact.id);
                            }
                          }}
                          className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg border border-white/40 cursor-pointer active:scale-90 transition-transform z-10"
                          title="Eliminar contacto"
                        >
                          <span className="text-[11px] font-black leading-none">✕</span>
                        </button>
                      )}

                      {/* Botón flotante de Cámara para cambiar foto en modo edición */}
                      {isContactEditMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingContactAvatarTarget(contact);
                            setEditingContactPhotoInput(contact.photoUrl || '');
                          }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary hover:bg-[#26BC90] text-on-primary flex items-center justify-center shadow-lg border border-white/40 cursor-pointer active:scale-90 transition-transform z-10"
                          title="Editar foto o avatar"
                        >
                          <span className="material-symbols-outlined text-[12px] font-bold leading-none">photo_camera</span>
                        </button>
                      )}

                      <span className="font-caption-sm text-caption-sm text-white font-semibold text-center truncate max-w-[70px]">
                        {contact.name}
                      </span>
                    </div>
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
                      <button
                        key={tx.id}
                        type="button"
                        onClick={() => setSelectedTransactionDetail(tx)}
                        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all shadow-md border border-white/5 hover:border-primary/40 cursor-pointer text-left group active:scale-[0.99]"
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
                            <span className="font-body-medium text-body-medium text-white font-bold truncate group-hover:text-primary transition-colors">
                              {tx.title}
                            </span>
                            <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                              {tx.category} • {tx.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                          <div className="flex flex-col items-end">
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
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
                            chevron_right
                          </span>
                        </div>
                      </button>
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
                {/* CASH PICKUP BENEFICIARY SELECTION                                         */}
                {/* ========================================================================= */}
                {deliveryMethod === 'cash' && (
                  <div className="flex flex-col space-y-2.5 pt-1 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-title-base text-xs text-on-surface font-bold">
                        Persona que Retira en México
                      </span>
                      <span className="font-caption-sm text-[11px] text-primary font-bold">INE / Pasaporte Requerido</span>
                    </div>

                    {/* Active Draft Auto-Save Banner */}
                    {selectedAvatar && (
                      <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl px-3 py-2 text-xs animate-fade-in shadow-inner">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 animate-pulse">
                            save
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-white font-semibold text-[11px] truncate">
                              Borrador guardado automáticamente
                            </span>
                            <span className="text-primary text-[10px] font-medium truncate">
                              Beneficiario: {selectedAvatar.fullName || selectedAvatar.name} • ${parseFloat(amountValue) || 50} USD
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
                          title="Descartar borrador y seleccionar otro destinatario"
                        >
                          <span>✕ Limpiar</span>
                        </button>
                      </div>
                    )}

                    <div
                      onClick={() => setShowContactModal(true)}
                      className="p-3.5 rounded-2xl bg-surface-container border border-white/10 space-y-2 cursor-pointer hover:border-primary/40 transition-colors shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {selectedAvatar ? (
                            <>
                              <ContactAvatar
                                photoUrl={selectedAvatar.photoUrl}
                                name={selectedAvatar.name}
                                className="w-10 h-10 rounded-xl"
                                iconSize="text-[22px]"
                              />
                              <div className="min-w-0">
                                <p className="font-title-base text-xs font-bold text-white truncate">
                                  {selectedAvatar.fullName || selectedAvatar.name}
                                </p>
                                <p className="font-financial-mono text-[11px] text-on-surface-variant truncate">
                                  {selectedAvatar.phone ? `Tel: ${selectedAvatar.phone}` : 'Retiro con Clave KIN y Cédula/INE'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-dashed border-primary/30 flex-shrink-0">
                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-title-base text-xs font-bold text-white truncate">Selecciona quién retira en sucursal</p>
                                <p className="text-[11px] text-on-surface-variant truncate">Toca para elegir familiar o agregar uno nuevo</p>
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
                {/* BANK (SPEI) SELECTION                                                     */}
                {/* ========================================================================= */}
                {deliveryMethod === 'bank' && (
                  <div className="flex flex-col space-y-2.5 pt-1 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-title-base text-xs text-on-surface font-bold">Bank SPEI Beneficiary</span>
                      <span className="font-caption-sm text-[11px] text-primary font-bold">24/7 Instant</span>
                    </div>

                    {/* Active Draft Auto-Save Banner */}
                    {selectedAvatar && (
                      <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl px-3 py-2 text-xs animate-fade-in shadow-inner">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 animate-pulse">
                            save
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-white font-semibold text-[11px] truncate">
                              Borrador guardado automáticamente
                            </span>
                            <span className="text-primary text-[10px] font-medium truncate">
                              Beneficiario: {selectedAvatar.fullName || selectedAvatar.name} • ${parseFloat(amountValue) || 50} USD
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
                          title="Descartar borrador y seleccionar otro destinatario"
                        >
                          <span>✕ Limpiar</span>
                        </button>
                      </div>
                    )}

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
                    onClick={handleStartSendReview}
                    className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#18A57E] text-white font-headline-md text-title-base font-bold shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
                  >
                    <span>
                      {!selectedAvatar
                        ? (language === 'en' ? 'Select Beneficiary in Mexico' : 'Seleccionar Beneficiario en México')
                        : (language === 'en'
                            ? `Review Breakdown & Send • $${(parseFloat(amountValue) || 50).toFixed(2)} USD`
                            : `Revisar Desglose y Enviar • $${(parseFloat(amountValue) || 50).toFixed(2)} USD`)}
                    </span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>

                {/* Spacer */}
                <div className="h-14 w-full pointer-events-none" aria-hidden="true" />
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
                      className="w-[72px] flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group active:scale-95 transition-transform"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0 relative overflow-hidden ${
                          isSelected
                            ? 'border-2 border-[#2ED5A4] bg-[#2ED5A4]/15 shadow-glow-mint scale-105 text-[#2ED5A4]'
                            : 'border border-white/10 bg-[#181928] text-white hover:border-[#2ED5A4] hover:bg-[#202236]'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[11px] font-semibold transition-colors text-center truncate w-full max-w-[70px] ${
                          isSelected ? 'text-[#2ED5A4]' : 'text-[#8E91A5] group-hover:text-white'
                        }`}
                        title={serv.name}
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
                      <button
                        key={tx.id}
                        type="button"
                        onClick={() => setSelectedTransactionDetail(tx)}
                        className="w-full p-3 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between hover:border-primary/40 hover:bg-[#1E2033] transition-all cursor-pointer text-left group active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                            {renderTransactionIcon(tx)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-tight group-hover:text-primary transition-colors">{tx.title}</p>
                            <p className="text-[10px] text-[#8E91A5] mt-0.5">{tx.category} • {tx.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#FF5555]" style={{ color: '#FF5555' }}>
                            {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-[#8E91A5] group-hover:text-primary transition-colors">
                            chevron_right
                          </span>
                        </div>
                      </button>
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
                            <button
                              key={tx.id}
                              type="button"
                              onClick={() => setSelectedTransactionDetail(tx)}
                              className="w-full p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between hover:border-primary/40 hover:bg-[#1E2033] transition-all cursor-pointer text-left group active:scale-[0.99]"
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
                                  <p className="text-xs font-bold text-white leading-tight group-hover:text-primary transition-colors">{tx.title}</p>
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
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="text-right">
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
                                <span className="material-symbols-outlined text-[16px] text-[#8E91A5] group-hover:text-primary transition-colors">
                                  chevron_right
                                </span>
                              </div>
                            </button>
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
                            <ContactAvatar
                              photoUrl={c.photoUrl}
                              name={c.name}
                              className={`w-12 h-12 rounded-full border-2 transition-all ${
                                isSelected ? 'border-[#2ED5A4]' : 'border-white/10'
                              }`}
                              iconSize="text-[26px]"
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

              {/* Selector de Idioma / Language */}
              <div className="flex items-center justify-between py-1.5 border-t border-white/5">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'en' ? 'App Language' : 'Idioma de la Aplicación'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {language === 'en' ? 'Active language preference' : 'Preferencia de idioma activa'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#202236] p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('es');
                      if (typeof window !== 'undefined') localStorage.setItem('kin_language', 'es');
                      if (userId) fetch('/api/account/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, updates: { language: 'es' } }) }).catch(() => {});
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      language === 'es' ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm' : 'text-[#8E91A5] hover:text-white'
                    }`}
                  >
                    🇲🇽 ES
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      if (typeof window !== 'undefined') localStorage.setItem('kin_language', 'en');
                      if (userId) fetch('/api/account/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, updates: { language: 'en' } }) }).catch(() => {});
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      language === 'en' ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm' : 'text-[#8E91A5] hover:text-white'
                    }`}
                  >
                    🇺🇸 EN
                  </button>
                </div>
              </div>

              {/* Selector de Moneda Base / Currency */}
              <div className="flex items-center justify-between py-1.5 border-t border-white/5">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'en' ? 'Base Currency / Region' : 'Moneda Base / Región'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {language === 'en' ? 'Primary account balance mode' : 'Modo de saldo principal'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#202236] p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => handleToggleCurrency('USD')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      currencyPref === 'USD' ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm' : 'text-[#8E91A5] hover:text-white'
                    }`}
                  >
                    🇺🇸 USD
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleCurrency('MXN')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      currencyPref === 'MXN' ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm' : 'text-[#8E91A5] hover:text-white'
                    }`}
                  >
                    🇲🇽 MXN
                  </button>
                </div>
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
                <span>{language === 'en' ? 'Edit Profile, Language & Currency' : 'Editar Información, Idioma y Moneda'}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-12 rounded-2xl bg-[#181928] border border-[#FF5555]/20 hover:border-[#FF5555]/50 hover:bg-[#FF5555]/10 flex items-center justify-center gap-2 text-xs font-bold text-[#FF5555] transition-all cursor-pointer shadow-sm"
              >
                <span>{language === 'en' ? 'Secure Log Out' : 'Cerrar Sesión Segura'}</span>
              </button>
            </div>
          </div>
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
      {/* MODAL 1: ACTION SHEET NATIVO PARA CONTACTO RÁPIDO (ENVIAR/EDITAR/MOVER/BORRAR) */}
      {/* ========================================================================= */}
      {quickContactActionTarget && (
        <div
          className="modal-backdrop animate-fade-in"
          onClick={() => setQuickContactActionTarget(null)}
        >
          <div
            className="modal-card space-y-4 max-h-[85vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con Avatar & Datos del Beneficiario */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-white/10 flex-shrink-0">
                  <ContactAvatar
                    photoUrl={quickContactActionTarget.contact.photoUrl}
                    name={quickContactActionTarget.contact.name}
                    className="w-full h-full rounded-2xl"
                    iconSize="text-[28px]"
                  />
                  {getBankLogoUrl(quickContactActionTarget.contact.bank) && (
                    <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-md bg-white p-0.5 flex items-center justify-center">
                      <img
                        src={getBankLogoUrl(quickContactActionTarget.contact.bank)!}
                        alt={quickContactActionTarget.contact.bank}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate font-title-base">
                    {quickContactActionTarget.contact.fullName || quickContactActionTarget.contact.name}
                  </h3>
                  <p className="text-[11px] text-primary font-mono truncate">
                    {quickContactActionTarget.contact.phone || 'Destinatario KIN'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant truncate">
                    {quickContactActionTarget.contact.bank || 'Red Bancaria SPEI / Efectivo'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickContactActionTarget(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#8E91A5] hover:text-white transition-all cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Opciones de Acción Ergonómicas (Touch targets de 52px con Apple HIG & Material 3) */}
            <div className="space-y-2.5">
              {/* Acción 1: Enviar Dinero Ahora */}
              <button
                type="button"
                onClick={() => {
                  setSelectedAvatar(quickContactActionTarget.contact);
                  setQuickContactActionTarget(null);
                  setActiveTab('send');
                }}
                className="w-full h-[52px] px-4 rounded-2xl bg-gradient-to-r from-primary to-[#26BC90] hover:brightness-110 text-on-primary font-bold text-sm flex items-center justify-between shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[22px]">send_money</span>
                  <span>Enviar Dinero Ahora (SPEI / Efectivo)</span>
                </div>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              {/* Acción 2: Enviar por KIN CASH P2P */}
              <button
                type="button"
                onClick={() => {
                  setKinCashDraftContact(quickContactActionTarget.contact);
                  setQuickContactActionTarget(null);
                  setActiveTab('kin-cash');
                }}
                className="w-full h-[52px] px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-white font-bold text-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[22px]">bolt</span>
                  <span>Transferir con KIN CASH Instantáneo</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-black">
                  $0 FEE
                </span>
              </button>

              {/* Acción 3: Editar Foto / Cambiar Avatar */}
              <button
                type="button"
                onClick={() => {
                  const target = quickContactActionTarget.contact;
                  setEditingContactAvatarTarget(target);
                  setEditingContactPhotoInput(target.photoUrl || '');
                  setQuickContactActionTarget(null);
                }}
                className="w-full h-[52px] px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-white font-medium text-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[22px]">add_a_photo</span>
                  <span>Editar Foto / Avatar del Contacto</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
              </button>

              {/* Acción 4: Reordenar / Mover de posición en el carrusel */}
              <div className="p-3 rounded-2xl bg-[#131422] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">swap_horiz</span>
                    <span>Mover posición en el carrusel</span>
                  </span>
                  <span className="text-[10px] text-primary font-bold">
                    Posición #{quickContactActionTarget.index + 1} de {contactsList.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={quickContactActionTarget.index === 0}
                    onClick={() => {
                      handleMoveContactUp(quickContactActionTarget.index);
                      setQuickContactActionTarget((prev) =>
                        prev ? { ...prev, index: Math.max(0, prev.index - 1) } : null
                      );
                    }}
                    className="h-11 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-25 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-white/5 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Mover Izquierda</span>
                  </button>
                  <button
                    type="button"
                    disabled={quickContactActionTarget.index === contactsList.length - 1}
                    onClick={() => {
                      handleMoveContactDown(quickContactActionTarget.index);
                      setQuickContactActionTarget((prev) =>
                        prev ? { ...prev, index: Math.min(contactsList.length - 1, prev.index + 1) } : null
                      );
                    }}
                    className="h-11 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-25 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-white/5 disabled:cursor-not-allowed"
                  >
                    <span>Mover Derecha</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Acción 5: Eliminar contacto (Alerta Destructiva Sutil) */}
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Estás seguro de que deseas eliminar a ${quickContactActionTarget.contact.name} de tus envíos rápidos?`)) {
                    handleDeleteContact(quickContactActionTarget.contact.id);
                    setQuickContactActionTarget(null);
                    setContactFeedback(`Contacto ${quickContactActionTarget.contact.name} eliminado de la lista.`);
                    setTimeout(() => setContactFeedback(null), 3000);
                  }
                }}
                className="w-full h-[52px] px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[22px] text-rose-400">delete</span>
                  <span>Eliminar de Envíos Rápidos</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-rose-400/80 bg-rose-500/20 px-2 py-0.5 rounded-full">
                  Quitar
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDITOR DE FOTO / AVATAR DE BENEFICIARIO (SUBIR / CAMBIAR / QUITAR) */}
      {/* ========================================================================= */}
      {editingContactAvatarTarget && (
        <div
          className="modal-backdrop animate-fade-in"
          onClick={() => {
            if (!isUpdatingContactPhoto) setEditingContactAvatarTarget(null);
          }}
        >
          <div
            className="modal-card space-y-4 max-h-[85vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">account_circle</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-title-base">
                    Foto de {editingContactAvatarTarget.name}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant">
                    Personaliza la imagen o mantén una silueta limpia
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingContactAvatarTarget(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#8E91A5] hover:text-white transition-all cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Vista previa en vivo del avatar */}
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-2 border-primary/40 shadow-xl bg-surface-container-high">
                <ContactAvatar
                  photoUrl={editingContactPhotoInput}
                  name={editingContactAvatarTarget.name}
                  className="w-full h-full rounded-3xl"
                  iconSize="text-[44px]"
                />
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium">
                {editingContactPhotoInput ? 'Vista previa de la foto' : 'Silueta de usuario limpia activa'}
              </span>
            </div>

            {/* Opción 1: Subir imagen desde galería / cámara del celular */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">photo_camera</span>
                <span>Subir foto desde tu dispositivo</span>
              </label>
              <label className="w-full h-[52px] rounded-2xl bg-surface-container hover:bg-surface-container-high border border-dashed border-primary/50 flex items-center justify-center gap-2 text-primary font-bold text-xs cursor-pointer transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined text-[20px]">upload</span>
                <span>Elegir archivo (Cámara / Galería)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (loadEvent) => {
                        const result = loadEvent.target?.result as string;
                        if (result) setEditingContactPhotoInput(result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            {/* Opción 2: Pegar enlace URL de imagen */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">link</span>
                <span>O pegar URL de imagen</span>
              </label>
              <input
                type="url"
                value={editingContactPhotoInput}
                onChange={(e) => setEditingContactPhotoInput(e.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
                className="w-full h-[48px] px-3.5 rounded-xl bg-[#181928] text-sm text-white placeholder:text-on-surface-variant/40 border border-white/10 focus:border-primary focus:outline-none transition-all"
              />
            </div>

            {/* Opción 3: Restablecer a silueta limpia sin foto */}
            {editingContactPhotoInput && (
              <button
                type="button"
                onClick={() => setEditingContactPhotoInput('')}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-on-surface-variant hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">no_accounts</span>
                <span>Quitar foto y usar Silueta Limpia</span>
              </button>
            )}

            {/* Botones de acción */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingContactAvatarTarget(null)}
                disabled={isUpdatingContactPhoto}
                className="h-[48px] rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isUpdatingContactPhoto}
                onClick={() => handleSaveContactPhoto(editingContactAvatarTarget, editingContactPhotoInput)}
                className="h-[48px] rounded-full bg-primary hover:bg-[#26BC90] text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 transition-all cursor-pointer active:scale-[0.98]"
              >
                {isUpdatingContactPhoto ? (
                  <span className="animate-spin text-sm">⏳</span>
                ) : (
                  <>
                    <span>Guardar Foto</span>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </>
                )}
              </button>
            </div>
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
                  <h3 className="text-sm font-bold text-white">
                    {draftUserLanguage === 'en' ? 'Edit Profile & Settings' : 'Editar Perfil & Datos'}
                  </h3>
                  <p className="text-[11px] text-[#8E91A5]">
                    {draftUserLanguage === 'en' ? 'Update contact info, photo & app language' : 'Actualiza tu información de contacto, foto e idioma'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelProfile}
                className="p-1 rounded-full text-[#8E91A5] hover:text-white cursor-pointer"
                title={draftUserLanguage === 'en' ? 'Close without saving' : 'Cerrar sin guardar'}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* SECCIÓN PREMIER: SELECTOR DE IDIOMA DEL CLIENTE (BILINGÜE ES / EN) */}
            <div className="p-3.5 rounded-2xl bg-[#141524] border border-[#2ED5A4]/25 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 flex items-center justify-center text-[#2ED5A4]">
                    <LanguageIcon className="w-4 h-4 text-[#2ED5A4]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {draftUserLanguage === 'en' ? 'App Language' : 'Idioma de la Aplicación'}
                    </span>
                    <span className="text-[10px] text-[#8E91A5]">
                      {draftUserLanguage === 'en' ? 'Interface & notifications language' : 'Idioma para interfaz y avisos'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/30">
                  {draftUserLanguage === 'en' ? '🇺🇸 EN Active' : '🇲🇽 ES Activo'}
                </span>
              </div>

              {/* Segmented Touch Targets (min 48-52px de altura para ergonomía móvil HIG) */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setDraftUserLanguage('es')}
                  className={`h-12 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    draftUserLanguage === 'es'
                      ? 'bg-[#2ED5A4] text-[#06070B] border-[#2ED5A4] shadow-md shadow-[#2ED5A4]/20 font-black scale-[1.01]'
                      : 'bg-[#1E2033] text-[#8E91A5] border-white/5 hover:border-white/20 hover:text-white font-semibold'
                  }`}
                >
                  <span className="text-base">🇲🇽</span>
                  <span>Español</span>
                  {draftUserLanguage === 'es' && (
                    <span className="text-sm font-black">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDraftUserLanguage('en')}
                  className={`h-12 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    draftUserLanguage === 'en'
                      ? 'bg-[#2ED5A4] text-[#06070B] border-[#2ED5A4] shadow-md shadow-[#2ED5A4]/20 font-black scale-[1.01]'
                      : 'bg-[#1E2033] text-[#8E91A5] border-white/5 hover:border-white/20 hover:text-white font-semibold'
                  }`}
                >
                  <span className="text-base">🇺🇸</span>
                  <span>English</span>
                  {draftUserLanguage === 'en' && (
                    <span className="text-sm font-black">✓</span>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-[#8E91A5] text-center">
                {draftUserLanguage === 'en'
                  ? 'The application, notifications and SPEI receipts will display in English.'
                  : 'Toda la interfaz, notificaciones y comprobantes SPEI se mostrarán en español.'}
              </p>
            </div>

            {/* SECCIÓN PREMIER 2: BILLETERA & MONEDA BASE (USA USD 🇺🇸 / MÉXICO MXN 🇲🇽) */}
            <div className="p-3.5 rounded-2xl bg-[#141524] border border-[#2ED5A4]/25 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 flex items-center justify-center text-[#2ED5A4]">
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {draftUserLanguage === 'en' ? 'Default Account Currency' : 'Moneda Base de la Cuenta'}
                    </span>
                    <span className="text-[10px] text-[#8E91A5]">
                      {draftUserLanguage === 'en' ? 'Select primary balance & region mode' : 'Selecciona tu moneda principal y región'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] border border-[#2ED5A4]/30">
                  {draftUserCurrencyPref === 'USD' ? '🇺🇸 USD Activo' : '🇲🇽 MXN Activo'}
                </span>
              </div>

              {/* Segmented Control 2 Opciones: 🇺🇸 Dólares (USA) y 🇲🇽 Pesos (México) */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setDraftUserCurrencyPref('USD')}
                  className={`h-12 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    draftUserCurrencyPref === 'USD'
                      ? 'bg-[#2ED5A4] text-[#06070B] border-[#2ED5A4] shadow-md shadow-[#2ED5A4]/20 font-black scale-[1.01]'
                      : 'bg-[#1E2033] text-[#8E91A5] border-white/5 hover:border-white/20 hover:text-white font-semibold'
                  }`}
                >
                  <span className="text-base">🇺🇸</span>
                  <span>{draftUserLanguage === 'en' ? 'US Dollars (USD)' : 'Dólares (USD)'}</span>
                  {draftUserCurrencyPref === 'USD' && (
                    <span className="text-sm font-black">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDraftUserCurrencyPref('MXN')}
                  className={`h-12 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    draftUserCurrencyPref === 'MXN'
                      ? 'bg-[#2ED5A4] text-[#06070B] border-[#2ED5A4] shadow-md shadow-[#2ED5A4]/20 font-black scale-[1.01]'
                      : 'bg-[#1E2033] text-[#8E91A5] border-white/5 hover:border-white/20 hover:text-white font-semibold'
                  }`}
                >
                  <span className="text-base">🇲🇽</span>
                  <span>{draftUserLanguage === 'en' ? 'Mexican Pesos (MXN)' : 'Pesos (MXN)'}</span>
                  {draftUserCurrencyPref === 'MXN' && (
                    <span className="text-sm font-black">✓</span>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-[#8E91A5] text-center">
                {draftUserCurrencyPref === 'USD'
                  ? (draftUserLanguage === 'en' 
                      ? 'Configured for US residents: Send money to Mexico and domestic USD transfers.'
                      : 'Configurado para residentes en EE. UU.: Envíos a México y transferencias en dólares.')
                  : (draftUserLanguage === 'en'
                      ? 'Configured for Mexico residents & travelers: KIN CASH in pesos and local SPEI withdrawals.'
                      : 'Configurado para residentes en México y viajeros: KIN CASH en pesos y retiros locales SPEI.')}
              </p>
            </div>

            {/* Nombre y Apellido (2 Columnas) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                  {draftUserLanguage === 'en' ? 'First Name(s):' : 'Nombre(s):'}
                </label>
                <div className="auth-input-group">
                  <input
                    type="text"
                    autoCapitalize="words"
                    autoCorrect="off"
                    spellCheck={false}
                    value={draftUserFirstName}
                    onChange={(e) => setDraftUserFirstName(capitalizeWords(e.target.value))}
                    placeholder={draftUserLanguage === 'en' ? 'First Name' : 'Nombre'}
                    className="auth-input-field capitalize"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                  {draftUserLanguage === 'en' ? 'Last Name(s):' : 'Apellido(s):'}
                </label>
                <div className="auth-input-group">
                  <input
                    type="text"
                    autoCapitalize="words"
                    autoCorrect="off"
                    spellCheck={false}
                    value={draftUserLastName}
                    onChange={(e) => setDraftUserLastName(capitalizeWords(e.target.value))}
                    placeholder={draftUserLanguage === 'en' ? 'Last Name' : 'Apellido'}
                    className="auth-input-field capitalize"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>
            </div>

            {/* Correo Electrónico Registrado */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                {draftUserLanguage === 'en' ? 'Registered Email:' : 'Correo Electrónico Registrado:'}
              </label>
              <div className="auth-input-group">
                <input
                  type="email"
                  value={draftUserEmail}
                  onChange={(e) => setDraftUserEmail(e.target.value)}
                  placeholder={draftUserLanguage === 'en' ? 'your@email.com' : 'tu@correo.com'}
                  className="auth-input-field"
                  style={{ paddingLeft: '14px' }}
                />
              </div>
            </div>

            {/* Teléfono Móvil */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                {draftUserLanguage === 'en' ? 'Mobile Phone (with country code):' : 'Teléfono Móvil (con lada):'}
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
                  {draftUserLanguage === 'en' ? 'City:' : 'Ciudad:'}
                </label>
                <div className="auth-input-group">
                  <input
                    type="text"
                    autoCapitalize="words"
                    autoCorrect="off"
                    spellCheck={false}
                    value={draftUserCity}
                    onChange={(e) => setDraftUserCity(capitalizeWords(e.target.value))}
                    placeholder={draftUserLanguage === 'en' ? 'City' : 'Ciudad'}
                    className="auth-input-field capitalize"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                  {draftUserLanguage === 'en' ? 'State:' : 'Estado:'}
                </label>
                <div className="auth-input-group">
                  <input
                    type="text"
                    autoCapitalize="words"
                    autoCorrect="off"
                    spellCheck={false}
                    value={draftUserState}
                    onChange={(e) => setDraftUserState(capitalizeWords(e.target.value))}
                    placeholder={draftUserLanguage === 'en' ? 'State' : 'Estado'}
                    className="auth-input-field capitalize"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>
            </div>

            {/* Opción Sin Foto / Dejar Recuadro Vacío */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1.5 px-0.5">
                {draftUserLanguage === 'en' ? 'Profile photo options:' : 'Opciones de foto de perfil:'}
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
                <span>{draftUserLanguage === 'en' ? 'No profile photo (Empty frame)' : 'Sin foto de perfil (Recuadro vacío)'}</span>
              </button>
            </div>

            {/* Subir foto de la galería / dispositivo del cliente */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1.5 px-0.5">
                {draftUserLanguage === 'en' ? 'Or upload from your device gallery:' : 'O subir desde la galería de tu dispositivo:'}
              </label>
              <label className="w-full h-11 rounded-2xl bg-[#222338] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-white cursor-pointer transition-colors shadow-sm">
                <CameraIcon className="w-4 h-4 text-[#2ED5A4]" />
                <span>{draftUserLanguage === 'en' ? 'Choose photo from gallery' : 'Elegir foto de mi galería'}</span>
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
                {draftUserLanguage === 'en' ? 'Or select a predefined avatar:' : 'O selecciona uno de los avatares predefinidos:'}
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
                        {draftUserLanguage === 'en' ? `Option ${idx + 1}` : `Opción ${idx + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* O ingresar URL personalizada */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1 px-0.5">
                {draftUserLanguage === 'en' ? 'Or enter custom image URL:' : 'O ingresa la URL de tu imagen:'}
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
                  {draftUserLanguage === 'en' ? 'Apply' : 'Usar'}
                </button>
              </div>
            </div>

            {/* Botón Guardar (Solo aplica los cambios al dar clic aquí) */}
            <button
              type="button"
              onClick={handleSaveProfile}
              className="auth-btn-cta active mt-3"
            >
              {draftUserLanguage === 'en' ? 'Save Changes' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DASHBOARD DE DESGLOSE Y REVISIÓN DE ENVÍO (CHECKOUT TRANSPARENTE KIN)     */}
      {/* ========================================================================= */}
      {showSendReviewModal && selectedAvatar && (
        <div className="modal-backdrop animate-fade-in" onClick={() => !isExecutingPayment && setShowSendReviewModal(false)}>
          <div
            className="modal-card space-y-4 max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Dashboard de Desglose */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSendReviewModal(false)}
                  disabled={isExecutingPayment}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white cursor-pointer transition-all disabled:opacity-40"
                  title="Volver"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-white" />
                </button>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight font-title-base flex items-center gap-1.5">
                    <span>Desglose de Envío</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                      100% Transparente
                    </span>
                  </h3>
                  <p className="text-[10px] text-on-surface-variant">
                    Revisa todos los datos antes de autorizar el débito
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isExecutingPayment && setShowSendReviewModal(false)}
                disabled={isExecutingPayment}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#8E91A5] hover:text-white transition-all cursor-pointer disabled:opacity-40"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Cuerpo con Scroll Ergonómico */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 no-scrollbar">
              {/* Tarjeta 1: Hero de Conversión (Monto Recibido en México) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c242c] via-[#12161b] to-[#0d1014] border border-[#2ED5A4]/30 shadow-[0_4px_20px_rgba(46,213,164,0.12)] space-y-2 text-center">
                <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider block">
                  El beneficiario recibe en México
                </span>
                <div className="text-3xl sm:text-4xl font-black font-financial-mono text-[#2ED5A4] tracking-tight">
                  ${((parseFloat(amountValue) || 50) * USD_TO_MXN_RATE).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-bold text-white">MXN</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-[#2ED5A4]/20 text-[11px] text-[#2ED5A4] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>1 USD = {USD_TO_MXN_RATE.toFixed(2)} MXN • Tasa Garantizada</span>
                </div>
                <p className="text-[11px] text-[#8E91A5] pt-0.5">
                  Tú envías: <strong className="text-white font-mono">${(parseFloat(amountValue) || 50).toFixed(2)} USD</strong>
                </p>
              </div>

              {/* Tarjeta 2: Desglose 100% Transparente de Cargos */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/10 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">receipt_long</span>
                    Transparencia de Costos
                  </span>
                  <span className="text-[10px] text-[#2ED5A4] font-extrabold uppercase">Sin Tarifas Ocultas</span>
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span>Monto a transferir (Base)</span>
                  <span className="text-white font-mono font-bold">${(parseFloat(amountValue) || 50).toFixed(2)} USD</span>
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span className="flex items-center gap-1">
                    Tarifa por transferencia KIN
                    <span className="px-1.5 py-0.2 rounded-full bg-[#2ED5A4]/20 text-[#2ED5A4] text-[9px] font-bold">
                      PROMO
                    </span>
                  </span>
                  <span className="text-[#2ED5A4] font-bold">$0.00 USD</span>
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span>
                    Comisión método de pago (
                    {paymentMethod === 'credit'
                      ? 'Tarjeta de Crédito'
                      : paymentMethod === 'debit'
                      ? 'Tarjeta de Débito'
                      : paymentMethod === 'apple'
                      ? 'Apple Pay'
                      : 'Cuenta Bancaria'}
                    )
                  </span>
                  {paymentMethod === 'credit' ? (
                    <span className="text-amber-400 font-mono font-semibold">+$1.99 USD</span>
                  ) : (
                    <span className="text-white font-mono font-bold">$0.00 USD</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span>Comisión por entrega / retiro en sucursal</span>
                  <span className="text-[#2ED5A4] font-bold">$0.00 USD</span>
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span>Impuestos y retenciones transfronterizas</span>
                  <span className="text-white font-mono font-bold">$0.00 USD</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-title-base text-xs text-white font-bold block">
                      Total exacto a pagar
                    </span>
                    <span className="text-[10px] text-on-surface-variant">Se debitará de tu método seleccionado</span>
                  </div>
                  <span className="text-lg font-black font-financial-mono text-white">
                    ${((parseFloat(amountValue) || 50) + paymentFee).toFixed(2)} <span className="text-xs text-[#8E91A5]">USD</span>
                  </span>
                </div>
              </div>

              {/* Tarjeta 3: Datos del Beneficiario en México */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-white/5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                    Beneficiario en México
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                    Verificado
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-0.5">
                  <ContactAvatar
                    photoUrl={selectedAvatar.photoUrl}
                    name={selectedAvatar.name}
                    className="w-10 h-10 border border-white/10"
                    iconSize="text-[22px]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">
                      {capitalizeWords(selectedAvatar.fullName || selectedAvatar.name)}
                    </p>
                    <p className="text-[11px] text-primary font-mono">{selectedAvatar.phone}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">
                      📍 {capitalizeWords(selectedAvatar.street || 'Dirección registrada')} {selectedAvatar.houseNumber || ''}, {capitalizeWords(selectedAvatar.state || '')}, {capitalizeWords(selectedAvatar.country || 'México')} {selectedAvatar.zipCode ? `• C.P. ${selectedAvatar.zipCode}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tarjeta 4: Modalidad y Punto de Entrega */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-white/5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                    Método de Entrega
                  </span>
                  <span className="text-[10px] text-on-surface-variant">En menos de 5 minutos</span>
                </div>

                {deliveryMethod === 'cash' ? (
                  <div className="space-y-2 pt-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1">
                          {(() => {
                            const storeObj = CASH_PICKUP_STORES.find((s) => s.id === selectedStore) || CASH_PICKUP_STORES[0];
                            const StoreLogo = storeObj?.Logo;
                            return StoreLogo ? <StoreLogo className="w-6 h-6" /> : <span className="text-sm">🏪</span>;
                          })()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            Retiro en Efectivo • {(() => {
                              const storeObj = CASH_PICKUP_STORES.find((s) => s.id === selectedStore);
                              return storeObj?.name || 'OXXO';
                            })()}
                          </p>
                          <p className="text-[10px] text-on-surface-variant">
                            Red de ventanillas autorizadas en México
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/20 text-[#2ED5A4] text-[10px] font-bold">
                        Efectivo Inmediato
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2 text-[11px] text-[#A6A9BC]">
                      <span className="text-primary text-base">🔑</span>
                      <div>
                        <strong className="text-white block">Generación de Clave de Retiro Oficial</strong>
                        Al dar clic en pagar, el sistema creará inmediatamente una Clave de Retiro (PIN de 8 dígitos) que podrás copiar o enviar por WhatsApp para que tu familiar cobre en caja presentando su INE.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">account_balance</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Depósito a Cuenta Bancaria (SPEI)</p>
                          <p className="text-[10px] text-on-surface-variant font-mono">
                            CLABE: {selectedAvatar.clabe ? `•••• ${selectedAvatar.clabe.slice(-4)}` : '012180••••••••1234'}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/20 text-[#2ED5A4] text-[10px] font-bold">
                        SPEI Banxico
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8E91A5]">
                      Transferencia directa auditada por el Banco de México con generación de Clave de Rastreo (CEP).
                    </p>
                  </div>
                )}
              </div>

              {/* Tarjeta 5: Respaldo Regulatorio & Seguridad */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-[10px] text-[#8E91A5]">
                <ShieldCheckIcon className="w-4 h-4 text-[#2ED5A4] flex-shrink-0" />
                <span>
                  Transacción protegida por cifrado militar AES-GCM-256 y en cumplimiento estricto con CNBV, Banxico y FinCEN.
                </span>
              </div>
            </div>

            {/* Footer con Botón a Pie de Página */}
            <div className="pt-2 border-t border-white/10 space-y-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleExecuteSendPayment}
                disabled={isExecutingPayment}
                className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#18A57E] text-white font-headline-md text-title-base font-bold shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] hover:shadow-[0_16px_32px_-4px_rgba(46,213,164,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isExecutingPayment ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Procesando pago seguro...</span>
                  </>
                ) : (
                  <>
                    <span>Pagar y Confirmar Envío • ${((parseFloat(amountValue) || 50) + paymentFee).toFixed(2)} USD</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSendReviewModal(false)}
                disabled={isExecutingPayment}
                className="w-full h-10 rounded-full bg-transparent hover:bg-white/5 text-[#8E91A5] hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center disabled:opacity-40"
              >
                Modificar datos de envío
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DASHBOARD DE DETALLE DE TRANSACCIÓN Y ACTIVIDADES RECIENTES (KIN AUDIT)   */}
      {/* ========================================================================= */}
      {selectedTransactionDetail && (
        <div
          className="modal-backdrop animate-fade-in"
          onClick={() => setSelectedTransactionDetail(null)}
        >
          <div
            className="modal-card space-y-4 max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Comprobante */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedTransactionDetail(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white cursor-pointer transition-all"
                  title="Volver"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-white" />
                </button>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight font-title-base flex items-center gap-1.5">
                    <span>Detalle de Transacción</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                      Oficial
                    </span>
                  </h3>
                  <p className="text-[10px] text-on-surface-variant">
                    Comprobante Electrónico KIN • Banxico
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTransactionDetail(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#8E91A5] hover:text-white transition-all cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido con Scroll Ergonómico */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 no-scrollbar">
              {/* Tarjeta Hero Principal: Monto, Estatus y Conversión */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c242c] via-[#12161b] to-[#0d1014] border border-[#2ED5A4]/30 shadow-[0_4px_20px_rgba(46,213,164,0.12)] space-y-2 text-center">
                {/* Badge de Estatus */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[11px] font-bold text-[#2ED5A4]">
                  <span className="w-2 h-2 rounded-full bg-[#2ED5A4] animate-pulse" />
                  <span>{selectedTransactionDetail.status || 'Completado'} • Fondos Entregados</span>
                </div>

                {/* Importe en USD */}
                <div className="text-3xl sm:text-4xl font-black font-financial-mono text-white tracking-tight">
                  {selectedTransactionDetail.type === 'income'
                    ? `+$${Math.abs(selectedTransactionDetail.amount).toFixed(2)}`
                    : `-$${Math.abs(selectedTransactionDetail.amount).toFixed(2)}`}{' '}
                  <span className="text-sm font-bold text-[#8E91A5]">USD</span>
                </div>

                {/* Equivalente en MXN */}
                <p className="text-sm font-bold text-[#2ED5A4] font-financial-mono">
                  ≈ ${(selectedTransactionDetail.amountMXN || (Math.abs(selectedTransactionDetail.amount) * USD_TO_MXN_RATE)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                </p>

                {/* Concepto y Fecha */}
                <div className="pt-1 border-t border-white/5 space-y-0.5">
                  <h4 className="text-sm font-bold text-white">
                    {selectedTransactionDetail.title}
                  </h4>
                  <p className="text-[11px] text-[#8E91A5]">
                    {selectedTransactionDetail.category} • {selectedTransactionDetail.time}
                  </p>
                </div>
              </div>

              {/* MÓDULO: Clave de Retiro en Efectivo (Si aplica) */}
              {selectedTransactionDetail.claveRetiroEfectivo && (
                <div className="bg-gradient-to-b from-[#182322] to-[#12161b] border-2 border-[#2ED5A4]/50 rounded-3xl p-4 shadow-[0_0_35px_rgba(46,213,164,0.22)] space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#2ED5A4]/20 flex items-center justify-center text-base">
                        🔑
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-[#2ED5A4] block">
                          Clave Oficial de Retiro en Efectivo
                        </span>
                        <p className="text-xs font-bold text-white">
                          Cobro en ventanilla: {selectedTransactionDetail.pickupStore || 'OXXO'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/20 border border-[#2ED5A4]/40 text-[10px] font-black text-[#2ED5A4] tracking-wider uppercase">
                      LISTA EN CAJA
                    </span>
                  </div>

                  {/* Clave de Retiro PIN */}
                  <div className="py-2.5 px-3 bg-black/60 rounded-2xl border border-[#2ED5A4]/40 text-center">
                    <div className="text-[10px] text-[#8E91A5] font-semibold mb-0.5 tracking-wider uppercase">
                      Código de Retiro Único (PIN)
                    </div>
                    <div className="text-3xl font-black font-financial-mono text-[#2ED5A4] tracking-widest select-all">
                      {selectedTransactionDetail.claveRetiroEfectivo}
                    </div>
                    <div className="text-[10px] text-on-surface-variant mt-0.5 font-medium">
                      Vigencia: 30 días • Sin costo adicional para el beneficiario
                    </div>
                  </div>

                  {/* Botones: Copiar Clave & WhatsApp */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedTransactionDetail.claveRetiroEfectivo) {
                          navigator.clipboard?.writeText(selectedTransactionDetail.claveRetiroEfectivo);
                          setCopiedDetailPin(true);
                          setTimeout(() => setCopiedDetailPin(false), 2500);
                        }
                      }}
                      className="h-11 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer active:scale-[0.98]"
                    >
                      {copiedDetailPin ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 text-[#2ED5A4]" />
                          <span className="text-[#2ED5A4]">¡Clave Copiada!</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-4 h-4 text-white" />
                          <span>Copiar Clave</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `¡Hola ${selectedTransactionDetail.nombreBeneficiario || 'familiar'}! 💵 Te comparto los datos de tu cobro por KIN de $${(selectedTransactionDetail.amountMXN || (Math.abs(selectedTransactionDetail.amount) * USD_TO_MXN_RATE)).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN.\n\n` +
                        `📍 Retiro en ventanilla en cualquier sucursal ${selectedTransactionDetail.pickupStore || 'OXXO'} de México.\n\n` +
                        `🔑 CLAVE DE RETIRO: ${selectedTransactionDetail.claveRetiroEfectivo}\n\n` +
                        `Solo acude a caja, menciona cobro de remesa KIN y presenta tu identificación oficial vigente (INE o Pasaporte). ¡Listo!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-[0_4px_16px_rgba(37,211,102,0.35)] active:scale-[0.98]"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-black" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Instrucciones de cobro */}
                  <div className="bg-black/30 rounded-2xl p-2.5 border border-white/5 space-y-1 text-[10.5px] text-[#A6A9BC]">
                    <div className="font-bold text-white text-[10.5px] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#2ED5A4]">storefront</span>
                      Pasos para cobrar en ventanilla:
                    </div>
                    <ol className="list-decimal list-inside space-y-0.5 pl-0.5">
                      <li>Acudir a cualquier sucursal <strong>{selectedTransactionDetail.pickupStore || 'OXXO'}</strong> en México.</li>
                      <li>Solicitar en caja el <strong>cobro de remesa KIN</strong>.</li>
                      <li>Presentar <strong>INE vigente</strong> y la Clave: <strong className="text-[#2ED5A4] font-mono">{selectedTransactionDetail.claveRetiroEfectivo}</strong>.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* MÓDULO: Clave de Rastreo Banxico CEP (Si aplica) */}
              {selectedTransactionDetail.claveRastreoBanxico && !selectedTransactionDetail.claveRetiroEfectivo && (
                <div className="bg-[#181928] border border-[#2ED5A4]/30 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8E91A5] font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#2ED5A4]">verified_user</span>
                      Clave de Rastreo Banxico (CEP)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedTransactionDetail.claveRastreoBanxico) {
                          navigator.clipboard?.writeText(selectedTransactionDetail.claveRastreoBanxico);
                          setCopiedDetailTracking(true);
                          setTimeout(() => setCopiedDetailTracking(false), 2500);
                        }
                      }}
                      className="flex items-center gap-1 text-xs text-[#2ED5A4] hover:underline font-semibold cursor-pointer"
                    >
                      <span>{copiedDetailTracking ? '¡Copiado!' : 'Copiar CEP'}</span>
                      <CopyIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="bg-black/40 rounded-xl p-2 font-financial-mono text-xs text-white break-all select-all border border-white/5">
                    {selectedTransactionDetail.claveRastreoBanxico}
                  </div>
                  <p className="text-[10px] text-[#8E91A5]">
                    Transferencia SPEI interbancaria verificable en el portal de Banco de México.
                  </p>
                </div>
              )}

              {/* Tarjeta: Desglose Financiero Transparente */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/10 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">receipt_long</span>
                    Desglose de la Transacción
                  </span>
                  <span className="text-[10px] text-[#2ED5A4] font-extrabold uppercase">Transparencia Total</span>
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span>Monto de la Operación</span>
                  <span className="text-white font-mono font-bold">
                    ${(Math.abs(selectedTransactionDetail.amount) - (selectedTransactionDetail.feeUSD || 0)).toFixed(2)} USD
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span>Tipo de cambio aplicado</span>
                  <span className="text-white font-semibold">1 USD = {USD_TO_MXN_RATE.toFixed(2)} MXN</span>
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span>Monto recibido en México</span>
                  <span className="text-[#2ED5A4] font-extrabold font-financial-mono">
                    ${(selectedTransactionDetail.amountMXN || (Math.abs(selectedTransactionDetail.amount) * USD_TO_MXN_RATE)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span>Tarifa por transferencia KIN</span>
                  <span className="text-[#2ED5A4] font-bold">GRATIS ($0.00 USD)</span>
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span>Comisión método de pago</span>
                  {selectedTransactionDetail.feeUSD && selectedTransactionDetail.feeUSD > 0 ? (
                    <span className="text-amber-400 font-mono font-semibold">+${selectedTransactionDetail.feeUSD.toFixed(2)} USD</span>
                  ) : (
                    <span className="text-white font-mono font-bold">$0.00 USD</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[#A6A9BC]">
                  <span>Comisión por retiro en sucursal</span>
                  <span className="text-[#2ED5A4] font-bold">$0.00 USD</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="font-title-base text-xs text-white font-bold">
                    Total debitado
                  </span>
                  <span className="text-base font-black font-financial-mono text-white">
                    ${Math.abs(selectedTransactionDetail.amount).toFixed(2)} <span className="text-xs text-[#8E91A5]">USD</span>
                  </span>
                </div>
              </div>

              {/* Tarjeta: Información del Beneficiario y Destino */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-white/5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                    Información del Destinatario
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                    Verificado
                  </span>
                </div>

                <div className="space-y-1.5 pt-0.5 text-[#A6A9BC]">
                  <div className="flex items-center justify-between">
                    <span>Nombre:</span>
                    <span className="text-white font-bold">
                      {capitalizeWords(selectedTransactionDetail.nombreBeneficiario || selectedTransactionDetail.title)}
                    </span>
                  </div>
                  {selectedTransactionDetail.recipientPhone && (
                    <div className="flex items-center justify-between">
                      <span>Teléfono:</span>
                      <span className="text-primary font-mono">{selectedTransactionDetail.recipientPhone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Destino:</span>
                    <span className="text-white font-medium">
                      {selectedTransactionDetail.pickupStore
                        ? `Retiro en Efectivo (${selectedTransactionDetail.pickupStore})`
                        : selectedTransactionDetail.bancoDestino || selectedTransactionDetail.category}
                    </span>
                  </div>
                  {selectedTransactionDetail.cuentaBeneficiario && (
                    <div className="flex items-center justify-between">
                      <span>Cuenta / CLABE:</span>
                      <span className="text-white font-mono">•••• {selectedTransactionDetail.cuentaBeneficiario.slice(-4)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Método de Pago:</span>
                    <span className="text-white font-medium">
                      {selectedTransactionDetail.paymentMethod || 'Balance KIN / Débito'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarjeta: Folio y Auditoría Criptográfica */}
              <div className="p-3 rounded-2xl bg-[#181928] border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#8E91A5] block">Folio de Rastreo KIN</span>
                  <span className="font-mono font-bold text-white text-xs">
                    {selectedTransactionDetail.refNumber || selectedTransactionDetail.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const ref = selectedTransactionDetail.refNumber || selectedTransactionDetail.id;
                    navigator.clipboard?.writeText(ref);
                    setCopiedDetailRef(true);
                    setTimeout(() => setCopiedDetailRef(false), 2500);
                  }}
                  className="flex items-center gap-1 text-xs text-[#2ED5A4] hover:underline font-semibold cursor-pointer"
                >
                  <span>{copiedDetailRef ? '¡Copiado!' : 'Copiar Folio'}</span>
                  <CopyIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tarjeta: Trazabilidad / Timeline en 4 Pasos */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/10 space-y-2 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5 pb-1 border-b border-white/5">
                  <span className="material-symbols-outlined text-[16px] text-primary">timeline</span>
                  Trazabilidad de la Operación
                </span>

                <div className="space-y-2.5 pt-1 pl-1">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#2ED5A4]/20 border border-[#2ED5A4] flex items-center justify-center text-[10px] text-[#2ED5A4] font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Solicitud creada y autorizada</p>
                      <p className="text-[10px] text-[#8E91A5]">{selectedTransactionDetail.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#2ED5A4]/20 border border-[#2ED5A4] flex items-center justify-center text-[10px] text-[#2ED5A4] font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Validación regulatoria y fondos asegurados</p>
                      <p className="text-[10px] text-[#8E91A5]">Filtros AML/PLD CNBV y FinCEN aprobados</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#2ED5A4]/20 border border-[#2ED5A4] flex items-center justify-center text-[10px] text-[#2ED5A4] font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {selectedTransactionDetail.claveRetiroEfectivo
                          ? 'Clave de retiro generada para ventanilla'
                          : 'Riel Banxico SPEI conectado'}
                      </p>
                      <p className="text-[10px] text-[#8E91A5]">
                        {selectedTransactionDetail.claveRetiroEfectivo
                          ? `PIN emitido para cobro en ${selectedTransactionDetail.pickupStore || 'sucursal'}`
                          : 'Comprobante Electrónico CEP registrado'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#2ED5A4]/20 border border-[#2ED5A4] flex items-center justify-center text-[10px] text-[#2ED5A4] font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2ED5A4]">Fondos entregados / disponibles</p>
                      <p className="text-[10px] text-on-surface-variant">Listo para retiro o acreditado en cuenta</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sello de Cumplimiento Regulatorio */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2 text-[10px] text-[#8E91A5]">
                <ShieldCheckIcon className="w-4 h-4 text-[#2ED5A4] flex-shrink-0" />
                <span>
                  Comprobante digital verificado con firma criptográfica KIN. Auditado bajo normativas CNBV, Banxico y SAT.
                </span>
              </div>
            </div>

            {/* Sticky Footer: Acciones */}
            <div className="pt-2 border-t border-white/10 space-y-2 flex-shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Descargando comprobante PDF encriptado del movimiento ${selectedTransactionDetail.refNumber || selectedTransactionDetail.id}...`)}
                  className="h-12 rounded-2xl bg-[#181928] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <DownloadIcon className="w-4 h-4 text-[#2ED5A4]" />
                  <span>Descargar PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const text = `Comprobante KIN: ${selectedTransactionDetail.title} por $${Math.abs(selectedTransactionDetail.amount).toFixed(2)} USD (≈ $${(selectedTransactionDetail.amountMXN || (Math.abs(selectedTransactionDetail.amount) * USD_TO_MXN_RATE)).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN). Folio: ${selectedTransactionDetail.refNumber || selectedTransactionDetail.id}`;
                    if (navigator.share) {
                      navigator.share({ title: 'Comprobante KIN', text }).catch(() => {});
                    } else {
                      navigator.clipboard?.writeText(text);
                      alert('Resumen del comprobante copiado al portapapeles');
                    }
                  }}
                  className="h-12 rounded-2xl bg-[#181928] border border-white/10 hover:border-[#2ED5A4] flex items-center justify-center gap-2 text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <ShareReceiptIcon className="w-4 h-4 text-[#2ED5A4]" />
                  <span>Compartir</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransactionDetail(null)}
                className="w-full h-11 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center active:scale-[0.98]"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
