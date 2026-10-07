'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { capitalizeWords } from '@/lib/utils/capitalize';
import { KinAppTab } from '@/components/layout/MobileBottomDock';

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
  street?: string;
  houseNumber?: string;
  state?: string;
  zipCode?: string;
  isFamily?: boolean;
}

export interface TransactionItem {
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

export interface UserProfileState {
  userId: string;
  userName: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPhone: string;
  userAddress1: string;
  userAddress2: string;
  userCity: string;
  userState: string;
  userZip: string;
  userCountry: string;
  userAvatar: string;
  userClientId: string;
  userMemberSince: string;
  userDocType: string;
  userDocNumber: string;
  userKycTier: string;
  userDailyLimit: string;
  baseBalanceUSD: number;
  biometricsEnabled: boolean;
  pushNotificationsEnabled: boolean;
}

export interface KinAppContextType {
  // Navigation
  activeTab: KinAppTab;
  setActiveTab: (tab: KinAppTab) => void;

  // User Profile
  user: UserProfileState;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  loadUserData: (userData: any) => void;
  handleLogout: () => void;
  updateUserProfile: (updates: Partial<UserProfileState>) => void;

  // Balances & Currency
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  currencyPref: 'USD' | 'MXN';
  handleToggleCurrency: (newCurr?: 'USD' | 'MXN') => void;
  hideBalance: boolean;
  setHideBalance: (hide: boolean) => void;
  executiveBalance: number;
  netBalance: number;

  // Preferences & Appearance
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  theme: 'dark' | 'light';
  handleToggleTheme: (newTheme?: 'dark' | 'light') => void;

  // Contacts
  contactsList: ContactItem[];
  setContactsList: React.Dispatch<React.SetStateAction<ContactItem[]>>;
  handleDeleteContact: (id?: string) => void;
  handleAddContact: (contact: ContactItem) => void;

  // Transactions
  transactions: TransactionItem[];
  setTransactions: React.Dispatch<React.SetStateAction<TransactionItem[]>>;
  addTransaction: (tx: TransactionItem) => void;
  dashboardFilter: 'all' | 'sent' | 'bills';
  setDashboardFilter: (filter: 'all' | 'sent' | 'bills') => void;
  filteredDashboardTransactions: TransactionItem[];
  groupedTransactions: Record<string, TransactionItem[]>;
  selectedTransactionDetail: TransactionItem | null;
  setSelectedTransactionDetail: (tx: TransactionItem | null) => void;
}

const DEFAULT_USD_TO_MXN_RATE = 20.45;

const KinAppContext = createContext<KinAppContextType | undefined>(undefined);

export function KinAppProvider({ children }: { children: ReactNode }) {
  // Navigation state
  const [activeTab, setActiveTab] = useState<KinAppTab>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // User profile state
  const [user, setUser] = useState<UserProfileState>({
    userId: '',
    userName: '',
    userFirstName: '',
    userLastName: '',
    userEmail: '',
    userPhone: '',
    userAddress1: '',
    userAddress2: '',
    userCity: '',
    userState: '',
    userZip: '',
    userCountry: 'Estados Unidos 🇺🇸',
    userAvatar: '',
    userClientId: '',
    userMemberSince: '',
    userDocType: 'INE / Pasaporte en Trámite',
    userDocNumber: '••••••••0000',
    userKycTier: 'Tier 1 (Básico - Onboarding)',
    userDailyLimit: '$300.00 USD / día',
    baseBalanceUSD: 0,
    biometricsEnabled: true,
    pushNotificationsEnabled: true,
  });

  // FX & Financial preferences
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_USD_TO_MXN_RATE);
  const [currencyPref, setCurrencyPref] = useState<'USD' | 'MXN'>('USD');
  const [hideBalance, setHideBalance] = useState<boolean>(false);

  // Language & Theme
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Contacts
  const [contactsList, setContactsList] = useState<ContactItem[]>([]);

  // Transactions
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'sent' | 'bills'>('all');
  const [selectedTransactionDetail, setSelectedTransactionDetail] = useState<TransactionItem | null>(null);

  // Load User Data
  const loadUserData = (userData: any) => {
    if (!userData) return;
    const cleanFirst = capitalizeWords(userData.firstName);
    const cleanLast = capitalizeWords(userData.lastName);
    let resolvedName = '';
    if (userData.name) {
      resolvedName = capitalizeWords(userData.name);
    } else if (cleanFirst) {
      resolvedName = `${cleanFirst} ${cleanLast ? cleanLast[0] + '.' : ''}`.trim();
    }

    const isMaster =
      userData.email === 'airygc7@gmail.com' ||
      userData.role === 'MASTER_ADMIN' ||
      userData.isMasterAdmin;

    setUser({
      userId: userData.id || '',
      userName: resolvedName,
      userFirstName: cleanFirst || '',
      userLastName: cleanLast || '',
      userEmail: userData.email || '',
      userPhone: userData.phone || '',
      userAddress1: userData.address1 || '',
      userAddress2: userData.address2 || '',
      userCity: userData.city ? capitalizeWords(userData.city) : '',
      userState: userData.state ? capitalizeWords(userData.state) : '',
      userZip: userData.zip || '',
      userCountry: userData.country ? capitalizeWords(userData.country) : 'Estados Unidos 🇺🇸',
      userAvatar:
        userData.avatar && !userData.avatar.includes('images.unsplash.com')
          ? userData.avatar
          : '',
      userClientId: isMaster ? 'KIN-MASTER-001' : userData.clientId || '',
      userMemberSince: userData.memberSince || '',
      userDocType: isMaster ? 'Credencial Maestro de Operador KIN' : userData.docType || 'INE / Pasaporte en Trámite',
      userDocNumber: isMaster ? 'KIN-CEO-0001' : userData.docNumber || '••••••••0000',
      userKycTier: isMaster ? 'Tier 3 — Propietario / Master Admin' : userData.kycTier || 'Tier 1 (Básico - Onboarding)',
      userDailyLimit: isMaster ? '$100,000.00 USD / día' : userData.dailyLimit || '$300.00 USD / día',
      baseBalanceUSD: typeof userData.balanceUSD === 'number' ? userData.balanceUSD : isMaster ? 10000 : 0,
      biometricsEnabled: userData.biometricsEnabled ?? true,
      pushNotificationsEnabled: userData.pushNotificationsEnabled ?? true,
    });

    if (userData.language === 'es' || userData.language === 'en') {
      setLanguage(userData.language);
    }
    if (userData.currencyPref === 'USD' || userData.currencyPref === 'MXN') {
      setCurrencyPref(userData.currencyPref);
    }
  };

  const updateUserProfile = (updates: Partial<UserProfileState>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('kin_auth');
      localStorage.removeItem('kin_active_user');
    }
    setIsAuthenticated(false);
  };

  const handleToggleCurrency = (newCurr?: 'USD' | 'MXN') => {
    const next = newCurr || (currencyPref === 'USD' ? 'MXN' : 'USD');
    setCurrencyPref(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_currency_pref', next);
      } catch (_) {}
    }
  };

  const handleToggleTheme = (newTheme?: 'dark' | 'light') => {
    const next = newTheme || (theme === 'dark' ? 'light' : 'dark');
    setTheme(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kin_theme', next);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(next);
      } catch (_) {}
    }
  };

  const handleDeleteContact = (id?: string) => {
    if (!id) return;
    setContactsList((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddContact = (contact: ContactItem) => {
    setContactsList((prev) => [contact, ...prev.filter((c) => c.id !== contact.id)]);
  };

  const addTransaction = (tx: TransactionItem) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  // Balances calculations
  const netBalance = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      if (tx.type === 'income') return acc + tx.amount;
      return acc - tx.amount;
    }, user.baseBalanceUSD);
  }, [transactions, user.baseBalanceUSD]);

  const executiveBalance = netBalance;

  // Filtered transactions for dashboard
  const filteredDashboardTransactions = useMemo(() => {
    if (dashboardFilter === 'sent') {
      return transactions.filter((t) => t.iconType === 'send' || t.category?.toLowerCase().includes('envío') || t.category?.toLowerCase().includes('send'));
    }
    if (dashboardFilter === 'bills') {
      return transactions.filter((t) => t.category?.toLowerCase().includes('servicio') || t.iconType === 'luz' || t.iconType === 'internet' || t.iconType === 'phone');
    }
    return transactions;
  }, [transactions, dashboardFilter]);

  // Grouped transactions by period
  const groupedTransactions = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      const grp = tx.dateGroup || 'Hoy';
      if (!acc[grp]) acc[grp] = [];
      acc[grp].push(tx);
      return acc;
    }, {} as Record<string, TransactionItem[]>);
  }, [transactions]);

  // Initialize theme from storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('kin_theme') as 'dark' | 'light' | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(savedTheme);
      }
      const savedLang = localStorage.getItem('kin_language') as 'es' | 'en' | null;
      if (savedLang === 'es' || savedLang === 'en') {
        setLanguage(savedLang);
      }
    }
  }, []);

  const value = {
    activeTab,
    setActiveTab,
    user,
    isAuthenticated,
    setIsAuthenticated,
    loadUserData,
    handleLogout,
    updateUserProfile,
    exchangeRate,
    setExchangeRate,
    currencyPref,
    handleToggleCurrency,
    hideBalance,
    setHideBalance,
    executiveBalance,
    netBalance,
    language,
    setLanguage,
    theme,
    handleToggleTheme,
    contactsList,
    setContactsList,
    handleDeleteContact,
    handleAddContact,
    transactions,
    setTransactions,
    addTransaction,
    dashboardFilter,
    setDashboardFilter,
    filteredDashboardTransactions,
    groupedTransactions,
    selectedTransactionDetail,
    setSelectedTransactionDetail,
  };

  return <KinAppContext.Provider value={value}>{children}</KinAppContext.Provider>;
}

export function useKinApp() {
  const context = useContext(KinAppContext);
  if (!context) {
    throw new Error('useKinApp must be used within a KinAppProvider');
  }
  return context;
}

export default KinAppContext;
