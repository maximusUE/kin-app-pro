'use client';

import React from 'react';
import { ChevronLeftIcon, CardOutlineIcon } from '@/components/Icons';

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

  const GROUP_LABELS: Record<string, { es: string; en: string }> = {
    Hoy: { es: 'Hoy', en: 'Today' },
    Ayer: { es: 'Ayer', en: 'Yesterday' },
    'Esta semana': { es: 'Esta semana', en: 'This week' },
    Anteriores: { es: 'Anteriores', en: 'Earlier' },
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header: < | Transactions | Total Movimientos Badge */}
      <header className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onBack}
          className="btn-circle"
          title={isEn ? "Back to Home" : "Volver al Home"}
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold text-white tracking-wide">{isEn ? 'Transactions' : 'Movimientos'}</h1>
          <p className="text-[10px] text-[#2ED5A4] font-medium flex items-center justify-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ED5A4] animate-pulse" />
            {isEn ? 'Real-time movements' : 'Movimientos en tiempo real'}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full bg-[#181928] border border-white/10 flex items-center justify-center text-xs font-bold text-[#8E91A5] shadow-sm"
          title={isEn ? `${transactions.length} recorded transactions` : `${transactions.length} transacciones registradas`}
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
            const itemsInGroup = groupedTransactions[groupKey] || [];
            if (itemsInGroup.length === 0) return null;

            return (
              <div key={groupKey} className="space-y-2">
                {/* Cabecera de grupo temporal */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#8E91A5]">
                    {GROUP_LABELS[groupKey]?.[language] || groupKey}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-[#8E91A5] border border-white/5">
                    {itemsInGroup.length} {isEn ? (itemsInGroup.length === 1 ? 'transaction' : 'transactions') : (itemsInGroup.length === 1 ? 'movimiento' : 'movimientos')}
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
                        onClick={() => onSelectTransaction(tx)}
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
                            <p className="text-xs font-bold text-white leading-tight group-hover:text-primary transition-colors">
                              {tx.title}
                            </p>
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
  );
}
