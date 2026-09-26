'use client';

import React, { useState } from 'react';
import { ContactAvatar } from '@/components/ContactAvatar';
import { getBankLogoUrl } from '@/components/Icons';

export interface HomeContact {
  id?: string;
  name: string;
  bank?: string;
  photoUrl?: string;
  clabe?: string;
  phone?: string;
  [key: string]: any;
}

export interface HomeTransaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  amountMXN?: number;
  time: string;
  type?: 'income' | 'expense' | string;
  iconType?: string;
  [key: string]: any;
}

export interface HomeViewProps {
  userFirstName?: string;
  userName?: string;
  userKycTier?: string;
  currencyPref?: 'USD' | 'MXN';
  handleToggleCurrency?: (pref: 'USD' | 'MXN') => void;
  hideBalance?: boolean;
  setHideBalance?: (hide: boolean) => void;
  executiveBalance?: number;
  USD_TO_MXN_RATE: number;
  language: 'es' | 'en';
  onNavigateTab: (tab: 'send' | 'kin-cash' | 'send-quick' | 'bill-pay') => void;
  contactsList: HomeContact[];
  setShowContactModal: (show: boolean) => void;
  isContactEditMode: boolean;
  setIsContactEditMode: (editing: boolean) => void;
  setQuickContactActionTarget: (target: { contact: HomeContact; index: number } | null) => void;
  handleDeleteContact: (id?: string) => void;
  setEditingContactAvatarTarget: (contact: HomeContact | null) => void;
  setEditingContactPhotoInput: (url: string) => void;
  dashboardFilter: 'all' | 'sent' | 'bills';
  setDashboardFilter: (filter: 'all' | 'sent' | 'bills') => void;
  filteredDashboardTransactions: HomeTransaction[];
  setSelectedTransactionDetail: (tx: HomeTransaction | null) => void;
}

export function HomeView({
  userFirstName,
  userName,
  userKycTier,
  currencyPref = 'USD',
  USD_TO_MXN_RATE,
  language,
  onNavigateTab,
  contactsList,
  setShowContactModal,
  isContactEditMode,
  setIsContactEditMode,
  setQuickContactActionTarget,
  handleDeleteContact,
  setEditingContactAvatarTarget,
  setEditingContactPhotoInput,
  dashboardFilter,
  setDashboardFilter,
  filteredDashboardTransactions,
  setSelectedTransactionDetail,
}: HomeViewProps) {
  // Estado para el efecto de pila (STACK) estilo notificaciones de Apple
  const [isStackExpanded, setIsStackExpanded] = useState<boolean>(false);

  const visibleTransactions = filteredDashboardTransactions.slice(0, 5);
  const primaryTx = visibleTransactions[0];
  const secondaryTx = visibleTransactions[1];
  const tertiaryTx = visibleTransactions[2];

  return (
    <div className="animate-fade-in flex flex-col min-h-[calc(100dvh-170px)] justify-between space-y-6">
      {/* ========================================================================= */}
      {/* 1. SECCIÓN SUPERIOR: CABECERA + 4 PRINCIPALES + QUICK SEND               */}
      {/* ========================================================================= */}
      <div className="flex flex-col space-y-5">
        {/* Cabecera intacta (Greeting & Status Header) */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              Executive Overview
            </span>
            <h1 className="font-headline-md text-headline-md text-white flex items-center gap-1.5 mt-0.5">
              Hola, {userFirstName || (userName ? userName.split(' ')[0] : 'Bienvenido')}{' '}
              <span className="inline-block animate-bounce text-xl">👋</span>
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high shadow-md border border-white/5">
            <span className="w-2 h-2 rounded-full bg-[#2ED5A4] animate-pulse shadow-[0_0_8px_#2ED5A4]" />
            <span className="font-caption-sm text-caption-sm text-[#2ED5A4] font-semibold">
              {userKycTier
                ? userKycTier.includes('Tier 1')
                  ? 'Tier-1 Básico'
                  : userKycTier.includes('Tier 2')
                  ? 'Tier-2 Verificado'
                  : 'Tier-3 Avanzado'
                : 'Tier-2 Verificado'}
            </span>
          </div>
        </div>

        {/* 4 BOTONES PRINCIPALES INMEDIATAMENTE DEBAJO DE LA CABECERA (RECUADRO AZUL 1) */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* 1. KIN CASH */}
          <button
            type="button"
            onClick={() => onNavigateTab('kin-cash')}
            className="group flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#2ED5A4] flex items-center justify-center text-[#06070B] shadow-[0_8px_20px_-4px_rgba(46,213,164,0.45)] transition-transform group-hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined text-[28px] font-bold">bolt</span>
            </div>
            <span className="font-label-caps text-label-caps text-white font-bold tracking-tight">
              KIN CASH
            </span>
          </button>

          {/* 2. Retiro SPEI */}
          <button
            type="button"
            onClick={() => onNavigateTab('send')}
            className="group flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary transition-transform group-hover:scale-105 active:scale-95 shadow-md border border-white/5">
              <span className="material-symbols-outlined text-[26px]">account_balance</span>
            </div>
            <span className="font-label-caps text-label-caps text-white font-bold tracking-tight">
              Retiro SPEI
            </span>
          </button>

          {/* 3. 1-Tap Send */}
          <button
            type="button"
            onClick={() => onNavigateTab('send-quick')}
            className="group flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-secondary transition-transform group-hover:scale-105 active:scale-95 shadow-md border border-white/5">
              <span className="material-symbols-outlined text-[26px]">touch_app</span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface font-semibold tracking-tight">
              1-Tap Send
            </span>
          </button>

          {/* 4. Servicios */}
          <button
            type="button"
            onClick={() => onNavigateTab('bill-pay')}
            className="group flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-secondary transition-transform group-hover:scale-105 active:scale-95 shadow-md border border-white/5">
              <span className="material-symbols-outlined text-[26px]">receipt_long</span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface font-semibold tracking-tight">
              Servicios
            </span>
          </button>
        </div>

        {/* QUICK SEND INMEDIATAMENTE DEBAJO DE LOS 4 PRINCIPALES (RECUADRO AZUL 2: "TO FAMILY" ELIMINADO) */}
        <div className="flex flex-col space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
              <h2 className="font-title-base text-title-base text-white font-bold">Quick Send</h2>
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
                  onClick={() => onNavigateTab('send-quick')}
                  className="font-caption-sm text-caption-sm text-primary font-bold hover:underline cursor-pointer"
                >
                  View All ({contactsList.length})
                </button>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 overflow-x-auto pb-1 -mx-margin-mobile px-margin-mobile scrollbar-none">
            {/* Botón + : New Recipient (Acceso a contactos) */}
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

            {/* Contactos Frecuentes con Long Press & Soporte de Edición */}
            {contactsList.map((contact, idx) => {
              const bankLogo = getBankLogoUrl(contact.bank);
              let timer: any = null;

              const handleTouchStart = () => {
                timer = setTimeout(() => {
                  setIsContactEditMode(true);
                  setQuickContactActionTarget({ contact, index: idx });
                }, 500);
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
                  <button
                    type="button"
                    onClick={() => {
                      if (isContactEditMode) {
                        setQuickContactActionTarget({ contact, index: idx });
                      } else {
                        onNavigateTab('send');
                      }
                    }}
                    className="relative w-14 h-14 rounded-2xl cursor-pointer group active:scale-95 transition-transform"
                    title={isContactEditMode ? 'Gestionar contacto' : `Enviar dinero a ${contact.name}`}
                  >
                    <ContactAvatar
                      photoUrl={contact.photoUrl}
                      name={contact.name}
                      className="w-full h-full rounded-2xl shadow-sm"
                      iconSize="text-[26px]"
                    />

                    {bankLogo && (
                      <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-white p-0.5 flex items-center justify-center shadow-md">
                        <img src={bankLogo} alt="Bank" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </button>

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
      </div>

      {/* Espaciador flexible para dar aire visual minimalista */}
      <div className="flex-1 min-h-[40px]" />

      {/* ========================================================================= */}
      {/* 2. RECENT ACTIVITY A PIE DE PÁGINA: EFECTO STACK DE NOTIFICACIONES APPLE */}
      {/* ========================================================================= */}
      <div className="flex flex-col space-y-3 pb-2">
        {/* Cabecera de Recent Activity con selector de visualización / toggle Stack */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-title-base text-title-base text-white font-bold">Recent Activity</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#1A1C2C] border border-white/10 text-[10px] font-bold text-[#8E91A5] flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#2ED5A4]">layers</span>
              <span>{visibleTransactions.length}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle de Pila (Stack) a Lista estilo iOS */}
            <button
              type="button"
              onClick={() => setIsStackExpanded(!isStackExpanded)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-xs font-bold text-primary transition-all border border-white/10 active:scale-95 cursor-pointer shadow-sm"
              title={isStackExpanded ? 'Agrupar en pila (Stack)' : 'Expandir lista completa'}
            >
              <span>{isStackExpanded ? 'Pila (Stack)' : 'Ver Lista'}</span>
              <span className="material-symbols-outlined text-[16px] transition-transform duration-200" style={{ transform: isStackExpanded ? 'rotate(180deg)' : 'none' }}>
                expand_more
              </span>
            </button>
          </div>
        </div>

        {/* Sin transacciones */}
        {filteredDashboardTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-container-low border border-dashed border-white/10 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Sin movimientos aún</p>
              <p className="text-[11px] text-on-surface-variant">
                Tus envíos SPEI o pagos aparecerán aquí en pila.
              </p>
            </div>
          </div>
        ) : isStackExpanded ? (
          /* ========================================================================= */
          /* MODO LISTA EXPANDIDA                                                      */
          /* ========================================================================= */
          <div className="flex flex-col space-y-2 animate-fade-in">
            {/* Filtros rápidos en modo expandido */}
            <div className="flex items-center justify-end gap-1 pb-1">
              {(['all', 'sent', 'bills'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setDashboardFilter(filter)}
                  className={`px-2.5 py-0.5 rounded-full font-label-caps text-[10px] font-bold transition-all cursor-pointer ${
                    dashboardFilter === filter
                      ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm'
                      : 'bg-surface-container-high text-[#8E91A5] hover:text-white'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'sent' ? 'Sent' : 'Bills'}
                </button>
              ))}
            </div>

            {visibleTransactions.map((tx) => renderTransactionRow(tx, setSelectedTransactionDetail, USD_TO_MXN_RATE))}
          </div>
        ) : (
          /* ========================================================================= */
          /* MODO STACK NATIVO APPLE (TARJETAS APILADAS SUPERPUESTAS EN EL FONDO)     */
          /* ========================================================================= */
          <div
            onClick={() => setIsStackExpanded(true)}
            className="relative cursor-pointer group pb-3 pt-1 select-none"
            title="Toca para desplegar las notificaciones agrupadas en pila"
          >
            {/* Tarjeta de Nivel 3 (Fondo profundo de la pila - más pequeña y tenue) */}
            {tertiaryTx && (
              <div
                className="absolute inset-x-6 top-5 h-14 rounded-2xl bg-[#0E0F1A] border border-white/5 opacity-40 shadow-sm pointer-events-none transition-all duration-300 group-hover:top-6"
                style={{ transform: 'scale(0.92)' }}
              />
            )}

            {/* Tarjeta de Nivel 2 (Fondo medio de la pila - ligeramente escalada) */}
            {secondaryTx && (
              <div
                className="absolute inset-x-3 top-2.5 h-16 rounded-2xl bg-[#141525] border border-white/10 opacity-70 shadow-md pointer-events-none transition-all duration-300 group-hover:top-3.5"
                style={{ transform: 'scale(0.96)' }}
              />
            )}

            {/* Tarjeta Principal Frontal (Most Recent Activity - Nivel 1) */}
            {primaryTx && (
              <div className="relative z-10 rounded-2xl bg-[#181928] border border-white/15 p-3.5 shadow-xl transition-all duration-300 group-hover:border-primary/40 group-active:scale-[0.99]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`relative w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${
                        primaryTx.iconType === 'bank'
                          ? 'bg-secondary-container/20 text-secondary'
                          : primaryTx.iconType === 'wallet'
                          ? 'bg-primary/10 text-primary'
                          : primaryTx.iconType === 'luz'
                          ? 'bg-surface-container-high text-secondary'
                          : 'bg-surface-container-high text-primary'
                      }`}
                    >
                      {primaryTx.iconType === 'luz' ? (
                        <span className="material-symbols-outlined text-[22px]">electric_meter</span>
                      ) : primaryTx.iconType === 'wallet' ? (
                        <span className="material-symbols-outlined text-[22px]">bolt</span>
                      ) : primaryTx.iconType === 'bank' ? (
                        <span className="material-symbols-outlined text-[22px]">account_balance</span>
                      ) : (
                        <span className="material-symbols-outlined text-[22px]">outgoing_mail</span>
                      )}
                      {getBankLogoUrl(primaryTx.title) && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded bg-white flex items-center justify-center shadow-sm p-0.5">
                          <img src={getBankLogoUrl(primaryTx.title)!} alt="Bank" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-body-medium text-body-medium text-white font-bold truncate">
                          {primaryTx.title}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-[#2ED5A4]/20 text-[#2ED5A4] text-[9px] font-black tracking-wider uppercase">
                          Nuevo
                        </span>
                      </div>
                      <span className="font-caption-sm text-caption-sm text-on-surface-variant truncate">
                        {primaryTx.category} • {primaryTx.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    <div className="flex flex-col items-end">
                      <span className="font-financial-mono text-financial-mono font-bold text-white">
                        {primaryTx.type === 'income'
                          ? `+$${Math.abs(primaryTx.amount).toFixed(2)}`
                          : `-$${Math.abs(primaryTx.amount).toFixed(2)}`}
                      </span>
                      <span className="font-caption-sm text-caption-sm font-semibold text-primary">
                        ${(primaryTx.amountMXN || Math.abs(primaryTx.amount) * USD_TO_MXN_RATE).toLocaleString('es-MX', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        MXN ✓
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      layers
                    </span>
                  </div>
                </div>

                {/* Micro indicador inferior de la pila estilo Apple */}
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8E91A5]">
                  <span className="flex items-center gap-1 text-[#2ED5A4] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4]" />
                    {visibleTransactions.length > 1
                      ? `+${visibleTransactions.length - 1} movimientos apilados debajo`
                      : 'Último movimiento registrado'}
                  </span>
                  <span className="text-[10px] text-primary font-bold flex items-center gap-0.5">
                    <span>Toca para expandir</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renderizador de fila de transacción individual
 */
function renderTransactionRow(
  tx: HomeTransaction,
  onSelect: (tx: HomeTransaction) => void,
  rate: number
) {
  const isIncome = tx.type === 'income';
  const bankLogo = getBankLogoUrl(tx.title) || getBankLogoUrl(tx.category);

  return (
    <button
      key={tx.id}
      type="button"
      onClick={() => onSelect(tx)}
      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#181928] hover:bg-surface-container transition-all shadow-md border border-white/5 hover:border-primary/40 cursor-pointer text-left group active:scale-[0.99]"
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
          <span className="font-caption-sm text-caption-sm font-semibold text-primary">
            ${(tx.amountMXN || Math.abs(tx.amount) * rate).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN ✓
          </span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
          chevron_right
        </span>
      </div>
    </button>
  );
}
