'use client';

import React from 'react';
import { ChevronLeftIcon, CloseIcon, ShieldCheckIcon } from '@/components/Icons';
import { ContactAvatar } from '@/components/ContactAvatar';
import { capitalizeWords } from '@/lib/utils/capitalize';

export interface SendReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAvatar: {
    name: string;
    fullName?: string;
    phone?: string;
    photoUrl?: string;
    street?: string;
    houseNumber?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    clabe?: string;
    [key: string]: any;
  } | null;
  amountValue: string;
  USD_TO_MXN_RATE: number;
  paymentMethod: string;
  paymentFee: number;
  deliveryMethod: string;
  selectedStore: string;
  language: 'es' | 'en';
  isExecutingPayment: boolean;
  onExecutePayment: () => void;
  cashPickupStores: Array<{
    id: string;
    name: string;
    subtitle: string;
    badge: string;
    Logo?: React.ComponentType<{ className?: string }>;
  }>;
}

export function SendReviewModal({
  isOpen,
  onClose,
  selectedAvatar,
  amountValue,
  USD_TO_MXN_RATE,
  paymentMethod,
  paymentFee,
  deliveryMethod,
  selectedStore,
  language,
  isExecutingPayment,
  onExecutePayment,
  cashPickupStores,
}: SendReviewModalProps) {
  if (!isOpen || !selectedAvatar) return null;

  const baseAmount = parseFloat(amountValue) || 50;
  const totalUSD = baseAmount + paymentFee;
  const totalMXN = baseAmount * USD_TO_MXN_RATE;

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={() => !isExecutingPayment && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-review-title"
    >
      <div
        className="modal-card space-y-4 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle for bottom sheet feel */}
        <div className="w-12 h-1.5 rounded-full bg-outline-variant/40 mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header del Dashboard de Desglose */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isExecutingPayment}
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer transition-all disabled:opacity-40 active:scale-[0.95]"
              title={language === 'en' ? 'Back' : 'Volver'}
            >
              <ChevronLeftIcon className="w-4 h-4 text-on-surface" />
            </button>
            <div>
              <h3 id="send-review-title" className="text-sm font-bold text-on-surface leading-tight font-title-base flex items-center gap-1.5">
                <span>{language === 'en' ? 'Transfer Breakdown' : 'Desglose de Envío'}</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                  {language === 'en' ? '100% Transparent' : '100% Transparente'}
                </span>
              </h3>
              <p className="text-[10px] text-on-surface-variant">
                {language === 'en'
                  ? 'Review all details before authorizing debit'
                  : 'Revisa todos los datos antes de autorizar el débito'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => !isExecutingPayment && onClose()}
            disabled={isExecutingPayment}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer disabled:opacity-40 active:scale-[0.95]"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo con Scroll Ergonómico */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 no-scrollbar">
          {/* Tarjeta 1: Hero de Conversión (Monto Recibido en México) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c242c] via-[#12161b] to-[#0d1014] border border-[#2ED5A4]/30 shadow-[0_4px_20px_rgba(46,213,164,0.12)] space-y-2 text-center">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {language === 'en' ? 'Recipient receives in Mexico' : 'El beneficiario recibe en México'}
            </span>
            <div className="text-3xl sm:text-4xl font-black font-financial-mono text-[#2ED5A4] tracking-tight">
              ${totalMXN.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-sm font-bold text-white">MXN</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-[#2ED5A4]/20 text-[11px] text-[#2ED5A4] font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>
                1 USD = {USD_TO_MXN_RATE.toFixed(2)} MXN • {language === 'en' ? 'Guaranteed Rate' : 'Tasa Garantizada'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pt-0.5">
              {language === 'en' ? 'You send:' : 'Tú envías:'}{' '}
              <strong className="text-white font-mono">${baseAmount.toFixed(2)} USD</strong>
            </p>
          </div>

          {/* Tarjeta 2: Desglose 100% Transparente de Cargos */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20">
              <span className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">receipt_long</span>
                {language === 'en' ? 'Cost Transparency' : 'Transparencia de Costos'}
              </span>
              <span className="text-[10px] text-primary font-extrabold uppercase">
                {language === 'en' ? 'No Hidden Fees' : 'Sin Tarifas Ocultas'}
              </span>
            </div>

            <div className="flex items-center justify-between text-on-surface-variant">
              <span>{language === 'en' ? 'Amount to transfer (Base)' : 'Monto a transferir (Base)'}</span>
              <span className="text-on-surface font-mono font-bold">${baseAmount.toFixed(2)} USD</span>
            </div>

            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="flex items-center gap-1">
                {language === 'en' ? 'KIN transfer fee' : 'Tarifa por transferencia KIN'}
                <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                  PROMO
                </span>
              </span>
              <span className="text-primary font-bold">$0.00 USD</span>
            </div>

            <div className="flex items-center justify-between text-on-surface-variant">
              <span>
                {language === 'en' ? 'Payment method fee (' : 'Comisión método de pago ('}
                {paymentMethod === 'credit'
                  ? (language === 'en' ? 'Credit Card' : 'Tarjeta de Crédito')
                  : paymentMethod === 'debit'
                  ? (language === 'en' ? 'Debit Card' : 'Tarjeta de Débito')
                  : paymentMethod === 'apple'
                  ? 'Apple Pay'
                  : (language === 'en' ? 'Bank Account' : 'Cuenta Bancaria')}
                )
              </span>
              {paymentMethod === 'credit' ? (
                <span className="text-amber-500 font-mono font-semibold">+$1.99 USD</span>
              ) : (
                <span className="text-on-surface font-mono font-bold">$0.00 USD</span>
              )}
            </div>

            <div className="flex items-center justify-between text-on-surface-variant">
              <span>{language === 'en' ? 'Delivery / store pickup fee' : 'Comisión por entrega / retiro en sucursal'}</span>
              <span className="text-primary font-bold">$0.00 USD</span>
            </div>

            <div className="flex items-center justify-between text-on-surface-variant">
              <span>{language === 'en' ? 'Cross-border taxes & withholdings' : 'Impuestos y retenciones transfronterizas'}</span>
              <span className="text-on-surface font-mono font-bold">$0.00 USD</span>
            </div>

            <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="font-title-base text-xs text-on-surface font-bold block">
                  {language === 'en' ? 'Exact total to pay' : 'Total exacto a pagar'}
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  {language === 'en' ? 'Debited from your selected method' : 'Se debitará de tu método seleccionado'}
                </span>
              </div>
              <span className="text-lg font-black font-financial-mono text-on-surface">
                ${totalUSD.toFixed(2)} <span className="text-xs text-on-surface-variant">USD</span>
              </span>
            </div>
          </div>

          {/* Tarjeta 3: Datos del Beneficiario en México */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
              <span className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                {language === 'en' ? 'Recipient in Mexico' : 'Beneficiario en México'}
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                {language === 'en' ? 'Verified' : 'Verificado'}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-0.5">
              <ContactAvatar
                photoUrl={selectedAvatar.photoUrl}
                name={selectedAvatar.name}
                className="w-10 h-10 border border-outline-variant/40"
                iconSize="text-[22px]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-on-surface truncate">
                  {capitalizeWords(selectedAvatar.fullName || selectedAvatar.name)}
                </p>
                <p className="text-[11px] text-primary font-mono">{selectedAvatar.phone}</p>
                <p className="text-[10px] text-on-surface-variant truncate">
                  📍 {capitalizeWords(selectedAvatar.street || (language === 'en' ? 'Registered address' : 'Dirección registrada'))}{' '}
                  {selectedAvatar.houseNumber || ''}, {capitalizeWords(selectedAvatar.state || '')},{' '}
                  {capitalizeWords(selectedAvatar.country || 'México')}{' '}
                  {selectedAvatar.zipCode ? `• C.P. ${selectedAvatar.zipCode}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta 4: Modalidad y Punto de Entrega */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
              <span className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                {language === 'en' ? 'Delivery Method' : 'Método de Entrega'}
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {language === 'en' ? 'In under 5 minutes' : 'En menos de 5 minutos'}
              </span>
            </div>

            {deliveryMethod === 'cash' ? (
              <div className="space-y-2 pt-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center justify-center p-1">
                      {(() => {
                        const storeObj = cashPickupStores.find((s) => s.id === selectedStore) || cashPickupStores[0];
                        const StoreLogo = storeObj?.Logo;
                        return StoreLogo ? <StoreLogo className="w-6 h-6" /> : <span className="text-sm">🏪</span>;
                      })()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">
                        {language === 'en' ? 'Cash Pickup' : 'Retiro en Efectivo'} •{' '}
                        {(() => {
                          const storeObj = cashPickupStores.find((s) => s.id === selectedStore);
                          return storeObj?.name || 'OXXO';
                        })()}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {language === 'en' ? 'Authorized pickup network in Mexico' : 'Red de ventanillas autorizadas en México'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                    {language === 'en' ? 'Instant Cash' : 'Efectivo Inmediato'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2 text-[11px] text-on-surface-variant">
                  <span className="text-primary text-base">🔑</span>
                  <div>
                    <strong className="text-on-surface block">
                      {language === 'en' ? 'Official Cash Withdrawal Code Generation' : 'Generación de Clave de Retiro Oficial'}
                    </strong>
                    {language === 'en'
                      ? 'Upon payment confirmation, the system will immediately generate a Cash Withdrawal Code (8-digit PIN) that you can copy or send via WhatsApp for your recipient to collect at the counter presenting their official ID.'
                      : 'Al dar clic en pagar, el sistema creará inmediatamente una Clave de Retiro (PIN de 8 dígitos) que podrás copiar o enviar por WhatsApp para que tu familiar cobre en caja presentando su INE.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">account_balance</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">
                        {language === 'en' ? 'Deposit to Bank Account (SPEI)' : 'Depósito a Cuenta Bancaria (SPEI)'}
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-mono">
                        CLABE: {selectedAvatar.clabe ? `•••• ${selectedAvatar.clabe.slice(-4)}` : '012180••••••••1234'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                    SPEI Banxico
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant">
                  {language === 'en'
                    ? 'Direct transfer audited by Banco de México with Tracking Code (CEP).'
                    : 'Transferencia directa auditada por el Banco de México con generación de Clave de Rastreo (CEP).'}
                </p>
              </div>
            )}
          </div>

          {/* Tarjeta 5: Respaldo Regulatorio & Seguridad */}
          <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center gap-2 text-[10px] text-on-surface-variant">
            <ShieldCheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              {language === 'en'
                ? 'Transaction secured by military-grade AES-GCM-256 encryption and in full compliance with CNBV, Banxico, and FinCEN.'
                : 'Transacción protegida por cifrado militar AES-GCM-256 y en cumplimiento estricto con CNBV, Banxico y FinCEN.'}
            </span>
          </div>
        </div>

        {/* Footer con Botón a Pie de Página */}
        <div className="pt-2 border-t border-outline-variant/30 space-y-2 flex-shrink-0">
          <button
            type="button"
            onClick={onExecutePayment}
            disabled={isExecutingPayment}
            className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-[#26BC90] hover:brightness-110 text-on-primary font-headline-md text-title-base font-bold shadow-[0_12px_28px_-4px_rgba(46,213,164,0.45)] hover:shadow-[0_16px_32px_-4px_rgba(46,213,164,0.6)] active:scale-[0.97] transition-transform duration-150 ease-out flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isExecutingPayment ? (
              <>
                <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                <span>{language === 'en' ? 'Processing secure payment...' : 'Procesando pago seguro...'}</span>
              </>
            ) : (
              <>
                <span>
                  {language === 'en' ? 'Pay & Confirm Send' : 'Pagar y Confirmar Envío'} • ${totalUSD.toFixed(2)} USD
                </span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isExecutingPayment}
            className="w-full h-10 rounded-full bg-transparent hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-all cursor-pointer flex items-center justify-center disabled:opacity-40 active:scale-[0.98]"
          >
            {language === 'en' ? 'Edit transfer details' : 'Modificar datos de envío'}
          </button>
        </div>
      </div>
    </div>
  );
}
