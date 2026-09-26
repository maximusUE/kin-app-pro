'use client';

import React from 'react';
import {
  ChevronLeftIcon,
  LightningIcon,
  PhoneIcon,
  WifiIcon,
  TelevisionIcon,
  WaterDropIcon,
  FlameIcon,
} from '@/components/Icons';

export const BILL_SERVICES = [
  { id: 'electricidad', name: 'Electricidad', Icon: LightningIcon },
  { id: 'telefono', name: 'Telefono', Icon: PhoneIcon },
  { id: 'internet', name: 'Internet', Icon: WifiIcon },
  { id: 'television', name: 'Television', Icon: TelevisionIcon },
  { id: 'agua', name: 'Agua', Icon: WaterDropIcon },
  { id: 'gas', name: 'Gas', Icon: FlameIcon },
];

export interface BillTransaction {
  id: string;
  title: string;
  category: string;
  time: string;
  amount: number;
  type?: 'income' | 'expense' | string;
  iconType?: string;
  [key: string]: any;
}

interface BillsViewProps {
  onBack: () => void;
  selectedBillServiceId: string | null;
  onSelectService: (serviceId: string) => void;
  transactions: BillTransaction[];
  onSelectTransaction: (tx: BillTransaction) => void;
  renderTransactionIcon: (tx: BillTransaction) => React.ReactNode;
}

export function BillsView({
  onBack,
  selectedBillServiceId,
  onSelectService,
  transactions,
  onSelectTransaction,
  renderTransactionIcon,
}: BillsViewProps) {
  const paidBills = transactions.filter(
    (t) =>
      t.category.includes('Servicio') ||
      t.category.includes('Factura') ||
      t.iconType === 'luz' ||
      t.iconType === 'internet' ||
      t.iconType === 'phone' ||
      t.iconType === 'bill'
  );

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header: < | Bill Payments */}
      <header className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onBack}
          className="btn-circle"
          title="Volver"
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-base font-bold text-white tracking-wide">Bill Payments</h1>
        <div className="w-10" />
      </header>

      {/* Opciones para pagar bills: Desplazables */}
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

        {/* Fila desplazable con toque y arrastre */}
        <div className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-hide select-none cursor-grab active:cursor-grabbing">
          {BILL_SERVICES.map((serv) => {
            const isSelected = selectedBillServiceId === serv.id;
            const Icon = serv.Icon;
            return (
              <button
                key={serv.id}
                type="button"
                onClick={() => onSelectService(serv.id)}
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
        {paidBills.length === 0 ? (
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
            {paidBills.map((tx) => (
              <button
                key={tx.id}
                type="button"
                onClick={() => onSelectTransaction(tx)}
                className="w-full p-3 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between hover:border-primary/40 hover:bg-[#1E2033] transition-all cursor-pointer text-left group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                    {renderTransactionIcon(tx)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight group-hover:text-primary transition-colors">
                      {tx.title}
                    </p>
                    <p className="text-[10px] text-[#8E91A5] mt-0.5">
                      {tx.category} • {tx.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FF5555]">
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
  );
}
