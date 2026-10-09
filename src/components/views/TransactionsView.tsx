'use client';

import React, { useState } from 'react';
import { ChevronLeftIcon, CardOutlineIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';

export interface TxItem {
  id: string;
  title: string;
  category: string;
  time: string;
  amount: number;
  amountMXN?: number;
  type?: 'income' | 'expense' | string;
  iconType?: string;
  refNumber?: string;
  [key: string]: any;
}

interface TransactionsViewProps {
  onBack: () => void;
  transactions: TxItem[];
  groupedTransactions: Record<string, TxItem[]>;
  currencyPref: 'USD' | 'MXN';
  language: 'es' | 'en';
  USD_TO_MXN_RATE: number;
  onSelectTransaction: (tx: TxItem) => void;
  renderTransactionIcon: (tx: TxItem) => React.ReactNode;
}

export function TransactionsView({
  onBack,
  transactions,
  groupedTransactions,
  currencyPref,
  language,
  USD_TO_MXN_RATE,
  onSelectTransaction,
  renderTransactionIcon,
}: TransactionsViewProps) {
  const isEn = language === 'en';
  const [filterCategory, setFilterCategory] = useState<'all' | 'transfers' | 'bills'>('all');

  const GROUP_LABELS: Record<string, { es: string; en: string }> = {
    Hoy: { es: 'Hoy', en: 'Today' },
    Ayer: { es: 'Ayer', en: 'Yesterday' },
    'Esta semana': { es: 'Esta semana', en: 'This week' },
    Anteriores: { es: 'Anteriores', en: 'Earlier' },
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header: < | KinLogo | Transactions | Total Movimientos Badge */}
      <header className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="btn-circle"
            title={isEn ? "Back to Home" : "Volver al Home"}
          >
            <ChevronLeftIcon className="w-5 h-5 text-slate-800 dark:text-white" />
          </button>
          <KinLogo size={34} />
        </div>
        <div className="text-center">
          <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">{isEn ? 'Transactions' : 'Movimientos'}</h1>
          <p className="text-[10px] text-emerald-600 dark:text-[#2ED5A4] font-medium flex items-center justify-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#2ED5A4] animate-pulse" />
            {isEn ? 'Real-time movements' : 'Movimientos en tiempo real'}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full bg-white dark:bg-[#181928] border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-[#8E91A5] shadow-xs"
          title={isEn ? `${transactions.length} recorded transactions` : `${transactions.length} transacciones registradas`}
        >
          {transactions.length}
        </div>
      </header>

      {/* Quick Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => setFilterCategory('all')}
          className={`h-8 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            filterCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
              : 'bg-white dark:bg-[#181928] hover:bg-slate-50 dark:hover:bg-[#202236] text-slate-700 dark:text-[#8E91A5] border border-slate-200/80 dark:border-white/10 shadow-xs'
          }`}
        >
          {isEn ? 'All' : 'Todos'} ({transactions.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterCategory('transfers')}
          className={`h-8 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
            filterCategory === 'transfers'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
              : 'bg-white dark:bg-[#181928] hover:bg-slate-50 dark:hover:bg-[#202236] text-slate-700 dark:text-[#8E91A5] border border-slate-200/80 dark:border-white/10 shadow-xs'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">send</span>
          <span>{isEn ? 'SPEI Transfers' : 'Envíos SPEI'}</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterCategory('bills')}
          className={`h-8 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
            filterCategory === 'bills'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
              : 'bg-white dark:bg-[#181928] hover:bg-slate-50 dark:hover:bg-[#202236] text-slate-700 dark:text-[#8E91A5] border border-slate-200/80 dark:border-white/10 shadow-xs'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">receipt_long</span>
          <span>{isEn ? 'Utilities' : 'Servicios'}</span>
        </button>
      </div>

      {/* Listado Exclusivo de Transacciones de Forma Ordenada por Fecha */}
      <div className="space-y-4 pt-1">
        {transactions.length === 0 ? (
          /* Estado vacío si no hay transacciones */
          <div className="p-8 rounded-3xl bg-[#181928] border border-white/5 text-center space-y-2.5">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white">
              <CardOutlineIcon className="w-7 h-7 text-[#2ED5A4]" />
            </div>
            <p className="text-sm font-bold text-white">{isEn ? 'No transactions recorded' : 'Sin movimientos registrados'}</p>
            <p className="text-xs text-[#8E91A5] max-w-[260px] mx-auto leading-relaxed">
              {isEn
                ? 'Your transactions will be organized chronologically here.'
                : 'Las transacciones que realices se organizarán de forma cronológica aquí.'}
            </p>
          </div>
        ) : (
          /* Renderizado agrupado y ordenado cronológicamente */
          (['Hoy', 'Ayer', 'Esta semana', 'Anteriores'] as const).map((groupKey) => {
            const rawItems = groupedTransactions[groupKey] || [];
            const itemsInGroup = rawItems.filter((tx) => {
              if (filterCategory === 'all') return true;
              if (filterCategory === 'transfers') {
                return (
                  tx.category?.toLowerCase().includes('envío') ||
                  tx.category?.toLowerCase().includes('remesa') ||
                  tx.category?.toLowerCase().includes('transfer') ||
                  tx.category?.toLowerCase().includes('p2p') ||
                  !tx.category?.toLowerCase().includes('servicio')
                );
              }
              if (filterCategory === 'bills') {
                return (
                  tx.category?.toLowerCase().includes('servicio') ||
                  tx.category?.toLowerCase().includes('luz') ||
                  tx.category?.toLowerCase().includes('cfe') ||
                  tx.category?.toLowerCase().includes('agua') ||
                  tx.category?.toLowerCase().includes('bill')
                );
              }
              return true;
            });
            if (itemsInGroup.length === 0) return null;

            return (
              <div key={groupKey} className="space-y-2">
                {/* Cabecera de grupo temporal */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-[#8E91A5]">
                    {GROUP_LABELS[groupKey]?.[language] || groupKey}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#8E91A5] border border-slate-200/80 dark:border-white/5">
                    {itemsInGroup.length} {isEn ? (itemsInGroup.length === 1 ? 'transaction' : 'transactions') : (itemsInGroup.length === 1 ? 'movimiento' : 'movimientos')}
                  </span>
                </div>

                {/* Tarjetas de transacciones del bloque */}
                <div className="space-y-2">
                  {itemsInGroup.map((tx) => {
                    const isIncome = tx.type === 'income';
                    const isBill = tx.category?.toLowerCase().includes('servicio') || tx.category?.toLowerCase().includes('cfe');
                    return (
                      <button
                        key={tx.id}
                        type="button"
                        onClick={() => onSelectTransaction(tx)}
                        className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#181928] border border-slate-200/80 dark:border-white/5 flex items-center justify-between hover:border-emerald-500/40 hover:bg-slate-50/80 dark:hover:bg-[#1E2033] shadow-xs transition-all cursor-pointer text-left group active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          {/* Icono del movimiento con micro-badge de flujo */}
                          <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-[#202236] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white shadow-xs">
                              {renderTransactionIcon(tx)}
                            </div>
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white dark:border-[#181928] text-[8px] font-black ${
                                isIncome ? 'bg-emerald-500 text-slate-950' : 'bg-purple-600 text-white'
                              }`}
                            >
                              {isIncome ? '↓' : '↑'}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                              {tx.title}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-[#8E91A5] mt-0.5 flex items-center gap-1.5 flex-wrap">
                              <span>{tx.category}</span>
                              <span>•</span>
                              <span>{tx.time}</span>
                              <span className={`px-1.5 py-0.2 rounded font-mono text-[8px] font-bold ${
                                isBill
                                  ? 'bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/30'
                                  : 'bg-emerald-500/15 text-emerald-600 dark:text-[#2ED5A4] border border-emerald-500/30'
                              }`}>
                                {isBill ? 'SAT CFDI ✓' : 'CEP Banxico ✓'}
                              </span>
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
                                    isIncome ? 'text-emerald-600 dark:text-[#2ED5A4]' : 'text-slate-900 dark:text-white'
                                  }`}
                                >
                                  {isIncome ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                                  <span className="text-[10px] text-slate-500 dark:text-[#8E91A5] font-semibold ml-0.5">USD</span>
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-[#8E91A5] mt-0.5 font-medium">
                                  {tx.amountMXN ? (
                                    <span>
                                      ≈ ${tx.amountMXN.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                                    </span>
                                  ) : (
                                    <span className="text-emerald-600 dark:text-[#2ED5A4] font-semibold">
                                      {language === 'en' ? 'Completed ✓' : 'Completado ✓'}
                                    </span>
                                  )}
                                </p>
                              </>
                            ) : (
                              <>
                                <p
                                  className={`text-xs font-black tracking-tight ${
                                    isIncome ? 'text-emerald-600 dark:text-[#2ED5A4]' : 'text-slate-900 dark:text-white'
                                  }`}
                                >
                                  {isIncome
                                    ? `+$${(tx.amountMXN || (tx.amount * USD_TO_MXN_RATE)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : `-$${Math.abs(tx.amountMXN || (tx.amount * USD_TO_MXN_RATE)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                  <span className="text-[10px] text-slate-500 dark:text-[#8E91A5] font-semibold ml-0.5">MXN</span>
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-[#8E91A5] mt-0.5 font-medium">
                                  <span>
                                    ≈ ${Math.abs(tx.amount).toFixed(2)} USD
                                  </span>
                                </p>
                              </>
                            )}
                          </div>
                          <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-[#8E91A5] group-hover:text-primary transition-colors">
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
  );
}
