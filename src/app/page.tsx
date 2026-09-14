'use client';

import React, { useState } from 'react';
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
  FarmaciasGuadalajaraLogo,
  AnyAgentLogo,
  ApplePayIcon,
  CreditCardGradientIcon,
} from '@/components/Icons';
import { MexicanBillPayModal } from '@/components/MexicanBillPayModal';
import { KinCashP2PModal } from '@/components/KinCashP2PModal';
import { ClientVaultModal } from '@/components/ClientVaultModal';

// Tasa de cambio real de mercado USD/MXN
const USD_TO_MXN_RATE = 20.45;

// Sucursales de Cash Pickup en México
const CASH_PICKUP_STORES = [
  {
    id: 'aurrera',
    name: 'Bodega Aurrera',
    subtitle: 'Más de 2,400 sucursales en México',
    badge: 'Sin comisión',
    Logo: BodegaAurreraLogo,
  },
  {
    id: 'oxxo',
    name: 'OXXO',
    subtitle: 'Más de 21,000 tiendas 24/7',
    badge: 'Popular',
    Logo: OxxoLogo,
  },
  {
    id: 'bancoppel',
    name: 'BanCoppel',
    subtitle: 'Sucursales y tiendas Coppel en México',
    badge: 'Disponible',
    Logo: BancoppelLogo,
  },
  {
    id: 'elektra',
    name: 'Elektra',
    subtitle: 'Banco Azteca y tiendas Elektra',
    badge: 'Inmediato',
    Logo: ElektraLogo,
  },
  {
    id: 'guadalajara',
    name: 'Farmacias Guadalajara',
    subtitle: 'Más de 2,600 sucursales',
    badge: 'Disponible',
    Logo: FarmaciasGuadalajaraLogo,
  },
  {
    id: 'any',
    name: 'Any agent location',
    subtitle: 'Más de 40,000 ubicaciones en México',
    badge: 'Recomendado',
    Logo: AnyAgentLogo,
  },
];

// Avatares de la referencia (Sophia, David, Liam, Maria, Mike)
const RECENT_CONTACTS = [
  { id: '1', name: 'Sophia', avatar: '👩🏻', role: 'Sister', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'David', avatar: '👨🏽', role: 'Brother', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Liam', avatar: '👱🏼', role: 'Friend', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Maria', avatar: '👩🏽', role: 'Mother', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: '5', name: 'Mike', avatar: '👨🏻', role: 'Coworker', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
];

interface TransactionItem {
  id: string;
  title: string;
  category: string;
  time: string;
  amount: number;
  type: 'income' | 'expense';
  iconType?: 'send' | 'luz' | 'internet' | 'phone' | 'bank' | 'wallet' | 'card' | 'bill';
}

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
  const [activeTab, setActiveTab] = useState<'home' | 'send' | 'bills' | 'transactions'>('home');

  // Client profile state
  const [userName, setUserName] = useState('César U.');
  const [userAvatar, setUserAvatar] = useState(RECENT_CONTACTS[1].photoUrl);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  // Draft buffer state for profile editing (Solo se aplica al dar clic en 'Guardar')
  const [draftUserName, setDraftUserName] = useState('César U.');
  const [draftUserAvatar, setDraftUserAvatar] = useState(RECENT_CONTACTS[1].photoUrl);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // Abrir modal cargando valores actuales
  const handleOpenAvatarPicker = () => {
    setDraftUserName(userName);
    setDraftUserAvatar(userAvatar);
    setCustomAvatarInput('');
    setShowAvatarPicker(true);
  };

  // Guardar cambios de perfil confirmados
  const handleSaveProfile = () => {
    if (draftUserName.trim()) {
      setUserName(draftUserName.trim());
    }
    if (draftUserAvatar) {
      setUserAvatar(draftUserAvatar);
    }
    setShowAvatarPicker(false);
  };

  // Cancelar/cerrar modal sin guardar
  const handleCancelProfile = () => {
    setShowAvatarPicker(false);
  };

  // Transactions state (Inicia vacío para que solo aparezcan las transacciones que hagamos en pruebas)
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  // Servicios Frecuentes (Inicia vacío y se puebla dinámicamente en listado ordenado de menor a mayor frecuencia)
  const [frequentServices, setFrequentServices] = useState<FrequentServiceItem[]>([]);

  // Send Money state (Screenshot 1)
  const [sendSearch, setSendSearch] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(RECENT_CONTACTS[0]);
  const [amountValue, setAmountValue] = useState('50');
  const [deliveryMethod, setDeliveryMethod] = useState<'cash' | 'bank'>('cash');
  const [selectedStore, setSelectedStore] = useState('oxxo');
  const [paymentMethod, setPaymentMethod] = useState<'debit' | 'apple' | 'bank' | 'credit'>('debit');

  // Cálculo de comisiones y monto total a pagar según el método seleccionado
  const paymentFee = paymentMethod === 'credit' ? 1.99 : 0.0;
  const currentSendAmount = parseFloat(amountValue) || 0;
  const totalToPayUSD = currentSendAmount > 0 ? currentSendAmount + paymentFee : 0;
  
  // Success screen state (Screenshot 1: Rosette Badge, Money sent successfully, Statement, PDF, Share, Done)
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

  // Transactions Filter state (Screenshot 2 right)
  const [txFilter, setTxFilter] = useState<'all' | 'income' | 'expense' | 'month'>('all');

  // Modals
  const [showBillPayModal, setShowBillPayModal] = useState(false);
  const [showKinCashModal, setShowKinCashModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);

  // Helper para registrar un envío de dinero y abrir ventanilla de Success
  const handleSendNow = () => {
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
    };

    setTransactions((prev) => [newTx, ...prev]);

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
    };
    setTransactions((prev) => [newTx, ...prev]);

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
  const handleP2PSuccess = (recipient: string, amountMXN: number) => {
    const amountUSD = +(amountMXN / USD_TO_MXN_RATE).toFixed(2);
    const newTx: TransactionItem = {
      id: Date.now().toString(),
      title: `KIN Cash para ${recipient}`,
      category: 'Recarga / SPEI P2P',
      time: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: -amountUSD,
      type: 'expense',
      iconType: 'wallet',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Totales calculados dinámicamente
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const netBalance = 12458.90 + totalIncome - totalExpense;

  // Filtrado de transacciones
  const filteredTransactions = transactions.filter((tx) => {
    if (txFilter === 'income') return tx.type === 'income';
    if (txFilter === 'expense') return tx.type === 'expense';
    return true;
  });

  return (
    <div className="min-h-[100dvh] bg-[#06070B] text-white flex justify-center selection:bg-[#7047EB]/30 selection:text-[#2ED5A4]">
      {/* Smartphone Frame Silhouette (Centered Flagship Mobile Device Viewport) */}
      <div className="phone-viewport w-full max-w-[400px] flex flex-col justify-start px-5 pt-3 pb-28 relative">
        
        {/* Signature Bicolor Ambient Diffuse Glow (Dribbble Reference 2) */}
        <div className="bicolor-atmosphere-glow" />

        {/* ========================================================================= */}
        {/* TOP STATUS BAR (9:41, Cellular, Wifi, Battery)                            */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between text-xs text-white/90 font-semibold mb-2 pt-1 px-1">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <StatusCellularIcon className="w-3.5 h-2.5 text-white" />
            <StatusWifiIcon className="w-3.5 h-2.5 text-white" />
            <StatusBatteryIcon className="w-5 h-2.5 text-white" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 1: "MY CARD / HOME" (DASHBOARD REDISEÑADO CON ENCABEZADO Y AVATAR)   */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-4">
            {/* Header: Foto/Avatar + Nombre del Cliente + Notificaciones & Settings */}
            <header className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                {/* Avatar circular interactivo */}
                <button
                  type="button"
                  onClick={handleOpenAvatarPicker}
                  className="avatar-ring"
                  title="Cambiar foto de perfil"
                >
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="avatar-img"
                  />
                  <div className="avatar-status-dot" />
                </button>

                {/* Saludo y Nombre */}
                <div>
                  <span className="text-[11px] text-[#8E91A5] font-medium block">
                    Bienvenido de nuevo 👋
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <h1 className="text-base font-bold text-white tracking-tight">
                      {userName}
                    </h1>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] text-[10px] font-bold border border-[#2ED5A4]/30">
                      ✓ Verificado
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción derecha */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('No tienes notificaciones pendientes')}
                  className="btn-circle relative"
                  title="Notificaciones"
                >
                  <BellIcon className="w-5 h-5 text-white" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#2ED5A4]" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowVaultModal(true)}
                  className="btn-circle"
                  title="ClientVault & Seguridad"
                >
                  <SettingsGearIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </header>

            {/* 4 Circular Action Buttons (Orden exacto y arquitectura de Imagen 2) */}
            <div className="pt-2 pb-1">
              <div className="grid grid-cols-4 gap-2">
                {/* 1. Add Money */}
                <button
                  type="button"
                  onClick={() => setShowKinCashModal(true)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-[#2ED5A4] hover:border-[#2ED5A4] hover:bg-[#202236] transition-all shadow-md">
                    <AddMoneyIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#8E91A5] text-center leading-tight">
                    Add Money
                  </span>
                </button>

                {/* 2. Send Money */}
                <button
                  type="button"
                  onClick={() => setActiveTab('send')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-white hover:border-[#7047EB] hover:bg-[#202236] transition-all shadow-md">
                    <PaperPlaneIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#8E91A5] text-center leading-tight">
                    Send Money
                  </span>
                </button>

                {/* 3. To Bank */}
                <button
                  type="button"
                  onClick={() => alert('Transferencia bancaria SPEI a México')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-white hover:border-[#2ED5A4] hover:bg-[#202236] transition-all shadow-md">
                    <BankBuildingIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#8E91A5] text-center leading-tight">
                    To Bank
                  </span>
                </button>

                {/* 4. Card Limit */}
                <button
                  type="button"
                  onClick={() => setShowVaultModal(true)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-white hover:border-[#7047EB] hover:bg-[#202236] transition-all shadow-md">
                    <CardOutlineIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#8E91A5] text-center leading-tight">
                    Card Limit
                  </span>
                </button>
              </div>
            </div>

            {/* Servicios Frecuentes (Inicia vacío y se puebla dinámicamente en formato listado) */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-xs font-bold text-[#8E91A5] uppercase tracking-wider">
                  Servicios Frecuentes
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('bills')}
                  className="text-xs text-[#2ED5A4] hover:underline cursor-pointer"
                >
                  Ver todos
                </button>
              </div>

              {frequentServices.length === 0 ? (
                /* Estado vacío para pruebas de servicios frecuentes */
                <div className="p-5 rounded-2xl bg-[#181928] border border-white/5 text-center space-y-1.5">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white">
                    <LightningIcon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-bold text-white">Sin servicios frecuentes</p>
                  <p className="text-[10px] text-[#8E91A5] max-w-[280px] mx-auto">
                    Al realizar pagos de servicios en &quot;Ver todos&quot; se registrarán aquí en tu lista frecuente.
                  </p>
                </div>
              ) : (
                /* Listado dinámico de servicios frecuentes ordenado de menor a mayor frecuencia */
                <div className="space-y-2">
                  {frequentServices.map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setShowBillPayModal(true)}
                      className="w-full p-3 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between hover:border-white/15 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                          {svc.iconType === 'luz' ? (
                            <LightningIcon className="w-4 h-4 text-white" />
                          ) : svc.iconType === 'internet' ? (
                            <WifiIcon className="w-4 h-4 text-white" />
                          ) : svc.iconType === 'phone' ? (
                            <PhoneLandlineIcon className="w-4 h-4 text-white" />
                          ) : (
                            <LightningIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{svc.name}</p>
                          <p className="text-[10px] text-[#8E91A5] mt-0.5">
                            {svc.category} • {svc.count} {svc.count === 1 ? 'pago' : 'pagos frecuentes'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#FF5555]" style={{ color: '#FF5555' }}>
                          -${svc.lastAmountUSD.toFixed(2)}
                        </span>
                        <ChevronRightIcon className="w-4 h-4 text-[#8E91A5]" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Historial de Transacciones (Dinámico para pruebas con Iconografía Minimalista Blanca) */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-xs font-bold text-[#8E91A5] uppercase tracking-wider">
                  Historial de Transacciones
                </h3>
                {transactions.length > 0 && (
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs text-[#8E91A5] hover:text-white"
                  >
                    Ver todas ({transactions.length})
                  </button>
                )}
              </div>

              {transactions.length === 0 ? (
                /* Estado vacío para iniciar pruebas */
                <div className="p-5 rounded-2xl bg-[#181928] border border-white/5 text-center space-y-1.5">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white">
                    <CardOutlineIcon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-bold text-white">Sin transacciones registradas</p>
                  <p className="text-[10px] text-[#8E91A5] max-w-[280px] mx-auto">
                    Realiza una prueba de envío en &quot;Send Money&quot; o paga una factura para ver el registro aquí.
                  </p>
                </div>
              ) : (
                /* Lista minimalista en tiempo real con iconos blancos a juego */
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((tx) => (
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
                      <span
                        className={`text-xs font-bold ${tx.type === 'income' ? 'text-[#2ED5A4]' : 'text-[#FF5555]'}`}
                        style={{ color: tx.type === 'income' ? '#2ED5A4' : '#FF5555' }}
                      >
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
                    className="w-full h-13 rounded-full bg-white text-[#0E0F1A] font-bold text-sm hover:bg-gray-100 active:scale-95 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Done</span>
                    <ArrowRightIcon className="w-4 h-4 text-[#0E0F1A]" />
                  </button>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* SEND MONEY FORM (CON VERDE KIN Y TARJETA EXTENDIDA DE PAGO)              */
              /* ========================================================================= */
              <>
                {/* Header: < | Send Money | ⋮ */}
                <header className="flex items-center justify-between py-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="btn-circle"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-white" />
                  </button>

                  <h1 className="text-base font-bold text-white tracking-wide">Send Money</h1>

                  <button
                    type="button"
                    onClick={() => alert('Options')}
                    className="btn-circle"
                  >
                    <DotsVerticalIcon className="w-5 h-5 text-white" />
                  </button>
                </header>

                {/* Pill Search Bar with Filter Icon */}
                <div className="relative flex items-center bg-[#181928] border border-white/10 rounded-full h-11 px-4">
                  <SearchIcon className="w-4 h-4 text-[#8E91A5] mr-2.5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search hear..."
                    value={sendSearch}
                    onChange={(e) => setSendSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-[#8E91A5] focus:outline-none"
                  />
                  <button type="button" className="p-1 text-[#8E91A5] hover:text-white">
                    <SlidersFilterIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Recent Avatars Row (Verde KIN en selección) */}
                <div>
                  <span className="text-xs font-bold text-[#8E91A5] block mb-2 px-1">
                    Recent
                  </span>
                  <div className="flex items-center gap-3.5 overflow-x-auto pb-1">
                    {RECENT_CONTACTS.map((rec) => {
                      const isSelected = selectedAvatar.id === rec.id;
                      return (
                        <button
                          key={rec.id}
                          type="button"
                          onClick={() => setSelectedAvatar(rec)}
                          className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                        >
                          <div className={`w-13 h-13 rounded-full flex items-center justify-center text-2xl border-2 transition-all ${
                            isSelected
                              ? 'border-[#2ED5A4] bg-[#2ED5A4]/15 shadow-glow-mint scale-105'
                              : 'border-white/10 bg-[#181928]'
                          }`}>
                            <span>{rec.avatar}</span>
                          </div>
                          <span className={`text-[11px] transition-colors ${
                            isSelected ? 'text-[#2ED5A4] font-bold' : 'text-[#8E91A5]'
                          }`}>
                            {rec.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Destination Dropdown Pill (Arquitectura Western Union) */}
                <div className="flex items-center justify-between bg-[#181928] border border-white/10 rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">🇲🇽</span>
                    <div>
                      <span className="text-[10px] text-[#8E91A5] uppercase font-bold tracking-wider block leading-none">
                        Send to
                      </span>
                      <span className="text-sm font-bold text-white tracking-wide mt-0.5 block">
                        Mexico
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#8E91A5]">
                    <span className="text-xs font-semibold">MXN</span>
                    <span className="text-[10px]">▼</span>
                  </div>
                </div>

                {/* FX Remittance Currency Converter Card (You Send USD <-> Transfer <-> Receiver Gets MXN) */}
                <div className="bg-[#181928] border border-white/10 rounded-3xl p-4 space-y-3 shadow-lg">
                  {/* Row: You Send (USD) <-> Transfer Icon <-> Receiver Gets (MXN) */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    {/* Client Field: You send (USD) */}
                    <div className="bg-[#121320] border border-white/5 rounded-2xl p-3 flex flex-col justify-between min-h-[76px]">
                      <span className="text-[10px] font-bold text-[#8E91A5] uppercase tracking-wider block">
                        You send
                      </span>
                      <div className="flex items-baseline justify-between gap-1 mt-1">
                        <div className="flex items-baseline gap-0.5 min-w-0 flex-1">
                          <span className="text-base font-black text-white/70">$</span>
                          <input
                            type="number"
                            min="1"
                            value={amountValue}
                            onChange={(e) => setAmountValue(e.target.value)}
                            placeholder="50"
                            className="w-full text-2xl font-black bg-transparent text-white focus:outline-none tracking-tight placeholder-white/20 p-0 m-0"
                          />
                        </div>
                        <span className="text-xs font-black text-[#8E91A5] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 flex-shrink-0">
                          USD
                        </span>
                      </div>
                    </div>

                    {/* Subtle Transfer Icon */}
                    <div className="flex items-center justify-center pt-3">
                      <div className="w-8 h-8 rounded-full bg-[#121320] border border-white/10 flex items-center justify-center text-[#8E91A5] shadow-inner">
                        <TransferSwapIcon className="w-4 h-4 text-[#8E91A5]" />
                      </div>
                    </div>

                    {/* Receiver Field: Receiver gets (MXN) */}
                    <div className="bg-[#121320] border border-white/5 rounded-2xl p-3 flex flex-col justify-between min-h-[76px]">
                      <span className="text-[10px] font-bold text-[#8E91A5] uppercase tracking-wider block">
                        Receiver gets
                      </span>
                      <div className="flex items-baseline justify-between gap-1 mt-1">
                        <div className="flex items-baseline gap-0.5 min-w-0 flex-1 overflow-hidden">
                          <span className="text-base font-black text-[#2ED5A4]/70">$</span>
                          <span className="text-2xl font-black text-[#2ED5A4] tracking-tight truncate">
                            {((parseFloat(amountValue) || 0) * USD_TO_MXN_RATE).toLocaleString('es-MX', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-xs font-black text-[#2ED5A4] px-1.5 py-0.5 rounded bg-[#2ED5A4]/10 border border-[#2ED5A4]/30 flex-shrink-0">
                          <span>MXN</span>
                          <span className="text-[8px]">▼</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real Exchange Rate Indicator */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#8E91A5]">1 USD =</span>
                      <span className="font-bold text-white">${USD_TO_MXN_RATE.toFixed(2)} MXN</span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse ml-0.5" />
                      <span className="text-[#2ED5A4] font-medium hidden sm:inline">Tasa garantizada Banxico</span>
                    </div>
                    <span className="text-[#8E91A5] font-medium">0% comisión de cambio</span>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* HOW WILL YOUR RECEIVER GET IT? (3 CARDS SIDE-BY-SIDE)     */}
                {/* ========================================================= */}
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-[#8E91A5] uppercase tracking-wide block px-1">
                    How will your receiver get it?
                  </span>

                  {/* 3 Horizontal Delivery Options (Western Union Layout) */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* 1. Cash Pickup */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('cash')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[96px] ${
                        deliveryMethod === 'cash'
                          ? 'bg-[#181928] border-[#2ED5A4] shadow-glow-mint'
                          : 'bg-[#181928] border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Cluster of store logos (Western Union style) */}
                      <div className="flex items-center -space-x-1.5 pt-0.5">
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-[#181928] bg-white/10 flex items-center justify-center">
                          <OxxoLogo className="w-5 h-5" />
                        </div>
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-[#181928] bg-white/10 flex items-center justify-center">
                          <BodegaAurreraLogo className="w-5 h-5" />
                        </div>
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-[#181928] bg-white/10 flex items-center justify-center">
                          <ElektraLogo className="w-5 h-5" />
                        </div>
                        <div className="w-5 h-5 rounded-full border border-[#181928] bg-white/20 flex items-center justify-center text-[7px] font-black text-white">
                          +3
                        </div>
                      </div>
                      <div className="mt-1.5">
                        <p className="text-[11px] font-bold text-white leading-tight">
                          Cash pickup <sup className="text-[9px] text-[#2ED5A4]">6</sup>
                        </p>
                        <p className="text-[9px] text-[#8E91A5] mt-0.5">En efectivo</p>
                      </div>
                    </button>

                    {/* 2. Bank Account */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('bank')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[96px] relative ${
                        deliveryMethod === 'bank'
                          ? 'bg-[#181928] border-[#2ED5A4] shadow-glow-mint'
                          : 'bg-[#181928] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-[#2ED5A4]/20 border border-[#2ED5A4]/40 text-[#2ED5A4] text-[8px] font-bold uppercase tracking-wider">
                        Popular
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mt-1">
                        <BankBuildingIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="mt-1.5">
                        <p className="text-[11px] font-bold text-white leading-tight">
                          Bank account <sup className="text-[9px] text-[#2ED5A4]">10</sup>
                        </p>
                        <p className="text-[9px] text-[#8E91A5] mt-0.5">SPEI 24/7</p>
                      </div>
                    </button>

                    {/* 3. Mobile Wallet / KIN Cash */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('wallet')}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[96px] ${
                        deliveryMethod === 'wallet'
                          ? 'bg-[#181928] border-[#2ED5A4] shadow-glow-mint'
                          : 'bg-[#181928] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#2ED5A4] mt-1">
                        <WalletIcon className="w-4 h-4 text-[#2ED5A4]" />
                      </div>
                      <div className="mt-1.5">
                        <p className="text-[11px] font-bold text-white leading-tight">
                          Mobile wallet <sup className="text-[9px] text-[#2ED5A4]">9</sup>
                        </p>
                        <p className="text-[9px] text-[#8E91A5] mt-0.5">KIN / Wallet</p>
                      </div>
                    </button>
                  </div>

                  {/* Secondary Details Panel for Selected Delivery Channel */}
                  {deliveryMethod === 'cash' ? (
                    <div className="p-3 rounded-2xl bg-[#121320] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-[#8E91A5] font-bold">
                          Sucursal de cobro elegida:
                        </span>
                        <span className="text-[10px] text-[#2ED5A4] font-bold">
                          {CASH_PICKUP_STORES.find((s) => s.id === selectedStore)?.name} ✓
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                        {CASH_PICKUP_STORES.map((store) => {
                          const isSelected = selectedStore === store.id;
                          const StoreLogo = store.Logo;
                          return (
                            <button
                              key={store.id}
                              type="button"
                              onClick={() => setSelectedStore(store.id)}
                              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#181928] border-[#2ED5A4] shadow-sm'
                                  : 'bg-[#181928]/50 border-white/5 hover:border-white/15'
                              }`}
                            >
                              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
                                <StoreLogo className="w-6 h-6" />
                              </div>
                              <span className={`text-[9px] truncate w-full font-bold ${
                                isSelected ? 'text-[#2ED5A4]' : 'text-white/80'
                              }`}>
                                {store.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : deliveryMethod === 'bank' ? (
                    <div className="p-3.5 rounded-2xl bg-[#121320] border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 flex items-center justify-center text-[#2ED5A4]">
                          <BankBuildingIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Cuenta Bancaria (SPEI)</p>
                          <p className="text-[10px] text-[#8E91A5]">Depósito directo a 18 dígitos CLABE o Tarjeta en México</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-[#2ED5A4] bg-[#2ED5A4]/15 px-2 py-0.5 rounded-full">
                        Sin comisión
                      </span>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-[#121320] border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 flex items-center justify-center text-[#2ED5A4]">
                          <WalletIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Billetera KIN Cash</p>
                          <p className="text-[10px] text-[#8E91A5]">Transferencia directa P2P en segundos</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-[#2ED5A4] bg-[#2ED5A4]/15 px-2 py-0.5 rounded-full">
                        Instantáneo
                      </span>
                    </div>
                  )}
                </div>

                {/* ========================================================= */}
                {/* HOW WILL YOU PAY? (WESTERN UNION 2X2 GRID WITH FEES)      */}
                {/* ========================================================= */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-[#8E91A5] uppercase tracking-wide block">
                      How will you pay? <sup className="text-[9px] text-[#2ED5A4]">31</sup>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[#2ED5A4] text-[9px] font-bold">
                      Pay online ✓
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* 1. Debit Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('debit')}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        paymentMethod === 'debit'
                          ? 'bg-[#181928] border-[#2ED5A4] shadow-glow-mint'
                          : 'bg-[#181928] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                          <CardOutlineIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          paymentMethod === 'debit' ? 'bg-[#2ED5A4]/20 text-[#2ED5A4]' : 'bg-white/5 text-[#8E91A5]'
                        }`}>
                          Instant
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Debit card <sup className="text-[9px] text-[#2ED5A4]">3</sup></p>
                        <p className="text-[10px] text-[#2ED5A4] font-semibold mt-0.5">Fees² $0.00 USD</p>
                        <p className="text-[9px] text-[#8E91A5]">0-1 Business days</p>
                      </div>
                    </button>

                    {/* 2. Apple Pay */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple')}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        paymentMethod === 'apple'
                          ? 'bg-[#181928] border-[#2ED5A4] shadow-glow-mint'
                          : 'bg-[#181928] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                          <ApplePayIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          paymentMethod === 'apple' ? 'bg-[#2ED5A4]/20 text-[#2ED5A4]' : 'bg-white/5 text-[#8E91A5]'
                        }`}>
                          1-Tap
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Apple Pay</p>
                        <p className="text-[10px] text-[#2ED5A4] font-semibold mt-0.5">Fees² $0.00 USD</p>
                        <p className="text-[9px] text-[#8E91A5]">Instantáneo</p>
                      </div>
                    </button>

                    {/* 3. Bank Account */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        paymentMethod === 'bank'
                          ? 'bg-[#181928] border-[#2ED5A4] shadow-glow-mint'
                          : 'bg-[#181928] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                          <BankBuildingIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          paymentMethod === 'bank' ? 'bg-[#2ED5A4]/20 text-[#2ED5A4]' : 'bg-white/5 text-[#8E91A5]'
                        }`}>
                          ACH
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Bank account</p>
                        <p className="text-[10px] text-[#2ED5A4] font-semibold mt-0.5">Fees² $0.00 USD</p>
                        <p className="text-[9px] text-[#8E91A5]">0-1 Business days</p>
                      </div>
                    </button>

                    {/* 4. Credit Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit')}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        paymentMethod === 'credit'
                          ? 'bg-[#181928] border-[#2ED5A4] shadow-glow-mint'
                          : 'bg-[#181928] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                          <CreditCardGradientIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          paymentMethod === 'credit' ? 'bg-[#2ED5A4]/20 text-[#2ED5A4]' : 'bg-white/5 text-[#8E91A5]'
                        }`}>
                          +Puntos
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Credit card</p>
                        <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Fees² $1.99 USD</p>
                        <p className="text-[9px] text-[#8E91A5]">0-1 Business days</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sticky Bottom Action Bar: Continuar + Monto Total Sumado (Siempre visible en scroll) */}
                <div className="sticky bottom-18 z-20 -mx-3 px-3 pt-3 pb-2 bg-gradient-to-t from-[#06070B] via-[#06070B]/95 to-[#06070B]/80 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-2xl mt-4">
                  <button
                    type="button"
                    onClick={handleSendNow}
                    className="w-full h-13 rounded-full bg-white text-[#0E0F1A] font-bold text-sm hover:bg-gray-100 active:scale-95 shadow-xl transition-all flex items-center justify-between px-5 cursor-pointer"
                  >
                    <span className="text-sm font-black tracking-wide">Continuar</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-[#0E0F1A]/10 px-2.5 py-1 rounded-full text-[#0E0F1A]">
                        ${totalToPayUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                      </span>
                      <ArrowRightIcon className="w-4 h-4 text-[#0E0F1A]" />
                    </div>
                  </button>
                </div>
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

            {/* 4 Quick Category Circles (Gas, Electricity, Internet, More) */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                onClick={() => setShowBillPayModal(true)}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-12 h-12 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-white hover:border-[#7047EB]">
                  <FlameIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] text-[#8E91A5]">Gas</span>
              </button>

              <button
                onClick={() => setShowBillPayModal(true)}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-12 h-12 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-white hover:border-[#7047EB]">
                  <LightningIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] text-[#8E91A5]">Electricity</span>
              </button>

              <button
                onClick={() => setShowBillPayModal(true)}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-12 h-12 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-white hover:border-[#7047EB]">
                  <WifiIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] text-[#8E91A5]">Internet</span>
              </button>

              <button
                onClick={() => setShowBillPayModal(true)}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-12 h-12 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-white hover:border-[#7047EB]">
                  <FourSquaresIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] text-[#8E91A5]">More</span>
              </button>
            </div>

            {/* All Categories (2x3 Grid from Image 2) */}
            <div>
              <h3 className="text-xs font-bold text-white mb-2.5 px-1">
                All Categories
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { name: 'Landline', icon: <PhoneLandlineIcon className="w-5 h-5 text-white/90" /> },
                  { name: 'Education', icon: <GraduationCapIcon className="w-5 h-5 text-white/90" /> },
                  { name: 'Credit card', icon: <CardOutlineIcon className="w-5 h-5 text-white/90" /> },
                  { name: 'Municipal Tax', icon: <BankBuildingIcon className="w-5 h-5 text-white/90" /> },
                  { name: 'Rent', icon: <HouseRentIcon className="w-5 h-5 text-white/90" /> },
                  { name: 'Hospital', icon: <HospitalCrossIcon className="w-5 h-5 text-white/90" /> },
                ].map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setShowBillPayModal(true)}
                    className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-white/20 active:scale-95 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#222338] flex items-center justify-center">
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-semibold text-[#8E91A5] text-center leading-tight">
                      {cat.name}
                    </span>
                  </button>
                ))}
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
        {/* SCREEN 4: "TRANSACTIONS" (IMAGEN 2 DERECHA CON PÍLDORAS BLANCO, VERDE, ROJO)*/}
        {/* ========================================================================= */}
        {activeTab === 'transactions' && (
          <div className="animate-fade-in space-y-3.5">
            {/* Header: < | Transactions | Filter */}
            <header className="flex items-center justify-between py-1">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="btn-circle"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-base font-bold text-white tracking-wide">Transactions</h1>
              <button
                type="button"
                onClick={() => alert('Filtro de transacciones')}
                className="btn-circle"
              >
                <SlidersFilterIcon className="w-5 h-5 text-white" />
              </button>
            </header>

            {/* 3 Top Balance Pills (White: Total | Green: Income | Red: Expense) */}
            <div className="grid grid-cols-3 gap-2 pt-0.5">
              {/* White Solid Pill */}
              <div className="bg-white text-[#0E0F1A] py-2 px-2 rounded-full text-center shadow-md">
                <span className="text-[11px] font-black tracking-tight block leading-tight text-[#0E0F1A]">
                  ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Green Solid Pill */}
              <div
                className="bg-[#2ED5A4] text-[#0E0F1A] py-2 px-2 rounded-full text-center shadow-md"
                style={{ backgroundColor: '#2ED5A4' }}
              >
                <span className="text-[11px] font-black tracking-tight block leading-tight text-[#0E0F1A]">
                  +${totalIncome > 0 ? totalIncome.toFixed(2) : '458.90'}
                </span>
              </div>

              {/* Red Solid Pill (Color Rojo Sólido de la Referencia 2) */}
              <div
                className="bg-[#FF5555] text-white py-2 px-2 rounded-full text-center shadow-md"
                style={{ backgroundColor: '#FF5555', color: '#FFFFFF' }}
              >
                <span className="text-[11px] font-black tracking-tight block leading-tight text-white">
                  -${totalExpense > 0 ? totalExpense.toFixed(2) : '708.50'}
                </span>
              </div>
            </div>

            {/* Segmented Filter Control: All (white active) | Income | Expense | This Month */}
            <div className="bg-[#181928] p-1 rounded-full border border-white/5 flex items-center text-center">
              {(['all', 'income', 'expense', 'month'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTxFilter(tab)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                    txFilter === tab
                      ? 'bg-white text-[#0E0F1A] shadow-sm'
                      : 'text-[#8E91A5] hover:text-white'
                  }`}
                >
                  {tab === 'month' ? 'This Month' : tab}
                </button>
              ))}
            </div>

            {/* Transaction Stream (Minimalista Blanco) */}
            <div className="space-y-2 pt-0.5">
              {filteredTransactions.length === 0 ? (
                /* Estado vacío para pruebas */
                <div className="p-8 rounded-2xl bg-[#181928] border border-white/5 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white">
                    <CardOutlineIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-bold text-white">Sin movimientos en esta vista</p>
                  <p className="text-[11px] text-[#8E91A5] max-w-[260px] mx-auto">
                    Los envíos de dinero y pagos que realices se registrarán automáticamente aquí.
                  </p>
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between hover:border-white/15 transition-all"
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
                    <span
                      className={`text-xs font-bold ${tx.type === 'income' ? 'text-[#2ED5A4]' : 'text-[#FF5555]'}`}
                      style={{ color: tx.type === 'income' ? '#2ED5A4' : '#FF5555' }}
                    >
                      {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* FLOATING BOTTOM DOCK (5 ICONS FROM REFERENCE 2)                           */}
      {/* ========================================================================= */}
      <div className="dock-container">
        <nav className="dock-bar">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`dock-btn ${activeTab === 'home' ? 'active' : ''}`}
            title="Home"
          >
            <DockHomeIcon className="w-5 h-5" />
          </button>

          {/* 2. Card / Bills */}
          <button
            type="button"
            onClick={() => setActiveTab('bills')}
            className={`dock-btn ${activeTab === 'bills' ? 'active' : ''}`}
            title="Bills & Cards"
          >
            <DockCardIcon className="w-5 h-5" />
          </button>

          {/* 3. Send Money */}
          <button
            type="button"
            onClick={() => setActiveTab('send')}
            className={`dock-btn ${activeTab === 'send' ? 'active' : ''}`}
            title="Send Money"
          >
            <DockSendSparkleIcon className="w-5 h-5" />
          </button>

          {/* 4. Transactions */}
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`dock-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            title="Transactions"
          >
            <DockAnalyticsIcon className="w-5 h-5" />
          </button>

          {/* 5. Profile / Vault */}
          <button
            type="button"
            onClick={() => setShowVaultModal(true)}
            className="dock-btn"
            title="ClientVault"
          >
            <DockUserIcon className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Modals con aislamiento total de capas */}
      <MexicanBillPayModal
        isOpen={showBillPayModal}
        onClose={() => setShowBillPayModal(false)}
        onPaymentSuccess={handleBillPaymentSuccess}
      />
      <KinCashP2PModal
        isOpen={showKinCashModal}
        onClose={() => setShowKinCashModal(false)}
        onP2PSuccess={handleP2PSuccess}
      />
      <ClientVaultModal isOpen={showVaultModal} onClose={() => setShowVaultModal(false)} />

      {/* Modal: Selector de Foto y Nombre del Cliente */}
      {showAvatarPicker && (
        <div className="modal-backdrop animate-fade-in" onClick={handleCancelProfile}>
          <div
            className="modal-card space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2ED5A4]/15 flex items-center justify-center text-[#2ED5A4]">
                  <CameraIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Foto & Perfil del Cliente</h3>
                  <p className="text-[11px] text-[#8E91A5]">Personaliza la foto y nombre en tu Dashboard</p>
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

            {/* Nombre del Cliente Editable */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1.5 px-0.5">
                Nombre del Cliente:
              </label>
              <div className="auth-input-group">
                <input
                  type="text"
                  value={draftUserName}
                  onChange={(e) => setDraftUserName(e.target.value)}
                  placeholder="Tu nombre o alias"
                  className="auth-input-field"
                  style={{ paddingLeft: '16px' }}
                />
              </div>
            </div>

            {/* Subir foto de la galería / dispositivo del cliente */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-1.5 px-0.5">
                Foto desde la galería de tu dispositivo:
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

            {/* Galería de Personas de la Referencia (Screenshot 1: Sophia, David, Liam, Maria, Mike) */}
            <div>
              <label className="text-xs font-semibold text-[#8E91A5] block mb-2 px-0.5">
                O selecciona uno de los perfiles de la app:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {RECENT_CONTACTS.map((av) => {
                  const isSelected = draftUserAvatar === av.photoUrl;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setDraftUserAvatar(av.photoUrl)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2ED5A4] bg-[#2ED5A4]/10 scale-105'
                          : 'border-white/10 bg-[#181928] hover:border-white/20'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden relative border border-white/10">
                        <img
                          src={av.photoUrl}
                          alt={av.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#181928] flex items-center justify-center text-[10px]">
                          {av.avatar}
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#2ED5A4]/30 flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-white font-medium truncate max-w-[80px]">
                        {av.name}
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
