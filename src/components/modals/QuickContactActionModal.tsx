'use client';

import React from 'react';
import { ContactAvatar } from '@/components/ContactAvatar';
import { CloseIcon, getBankLogoUrl } from '@/components/Icons';

export interface QuickContactTarget {
  contact: {
    id?: string;
    name: string;
    fullName?: string;
    phone?: string;
    bank?: string;
    photoUrl?: string;
    avatar?: string;
    country?: string;
    [key: string]: any;
  };
  index: number;
}

export interface QuickContactActionModalProps {
  target: QuickContactTarget | null;
  onClose: () => void;
  language: 'es' | 'en';
  contactsCount: number;
  onSendMoney: (contact: QuickContactTarget['contact']) => void;
  onSendKinCash: (contact: QuickContactTarget['contact']) => void;
  onEditPhoto: (contact: QuickContactTarget['contact']) => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
  onDeleteContact: (contact: QuickContactTarget['contact']) => void;
}

export function QuickContactActionModal({
  target,
  onClose,
  language,
  contactsCount,
  onSendMoney,
  onSendKinCash,
  onEditPhoto,
  onMoveLeft,
  onMoveRight,
  onDeleteContact,
}: QuickContactActionModalProps) {
  if (!target) return null;

  const { contact, index } = target;

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-contact-title"
    >
      <div
        className="modal-card space-y-4 max-h-[85vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile ergonomical bottom-sheet feel */}
        <div className="w-12 h-1.5 rounded-full bg-outline-variant/40 mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header con Avatar & Datos del Beneficiario */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-outline-variant/40 flex-shrink-0">
              <ContactAvatar
                photoUrl={contact.photoUrl}
                name={contact.name}
                className="w-full h-full rounded-2xl"
                iconSize="text-[28px]"
              />
              {getBankLogoUrl(contact.bank) && (
                <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-md bg-white p-0.5 flex items-center justify-center shadow-xs">
                  <img
                    src={getBankLogoUrl(contact.bank)!}
                    alt={contact.bank}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 id="quick-contact-title" className="text-sm font-bold text-on-surface truncate font-title-base">
                {contact.fullName || contact.name}
              </h3>
              <p className="text-[11px] text-primary font-mono truncate">
                {contact.phone || 'Destinatario KIN'}
              </p>
              <p className="text-[10px] text-on-surface-variant truncate">
                {contact.bank || 'Red Bancaria SPEI / Efectivo'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer active:scale-[0.95]"
            aria-label={language === 'en' ? 'Close' : 'Cerrar'}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Opciones de Acción Ergonómicas (Touch targets de 52px con Apple HIG & Material 3) */}
        <div className="space-y-2.5">
          {/* Acción 1: Enviar Dinero Ahora */}
          <button
            type="button"
            onClick={() => onSendMoney(contact)}
            className="w-full h-[52px] px-4 rounded-2xl bg-gradient-to-r from-primary to-[#26BC90] hover:brightness-110 text-on-primary font-bold text-sm flex items-center justify-between shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.97] transition-transform duration-150 ease-out"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[22px]">send_money</span>
              <span>{language === 'en' ? 'Send Money Now (SPEI / Cash)' : 'Enviar Dinero Ahora (SPEI / Efectivo)'}</span>
            </div>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          {/* Acción 2: Enviar por KIN CASH P2P */}
          <button
            type="button"
            onClick={() => onSendKinCash(contact)}
            className="w-full h-[52px] px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-bold text-sm flex items-center justify-between cursor-pointer active:scale-[0.97] transition-transform duration-150 ease-out"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-[22px]">bolt</span>
              <span>{language === 'en' ? 'Transfer with Instant KIN CASH' : 'Transferir con KIN CASH Instantáneo'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-black">
              $0 FEE
            </span>
          </button>

          {/* Acción 3: Editar Foto / Cambiar Avatar */}
          <button
            type="button"
            onClick={() => onEditPhoto(contact)}
            className="w-full h-[52px] px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-medium text-sm flex items-center justify-between cursor-pointer active:scale-[0.97] transition-transform duration-150 ease-out"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[22px]">add_a_photo</span>
              <span>{language === 'en' ? 'Edit Contact Photo / Avatar' : 'Editar Foto / Avatar del Contacto'}</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
          </button>

          {/* Acción 4: Reordenar / Mover de posición en el carrusel */}
          <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">swap_horiz</span>
                <span>{language === 'en' ? 'Move position in carousel' : 'Mover posición en el carrusel'}</span>
              </span>
              <span className="text-[10px] text-primary font-bold">
                {language === 'en'
                  ? `Position #${index + 1} of ${contactsCount}`
                  : `Posición #${index + 1} de ${contactsCount}`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onMoveLeft(index)}
                className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high disabled:opacity-30 text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-outline-variant/30 disabled:cursor-not-allowed active:scale-[0.97]"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>{language === 'en' ? 'Move Left' : 'Mover Izquierda'}</span>
              </button>
              <button
                type="button"
                disabled={index === contactsCount - 1}
                onClick={() => onMoveRight(index)}
                className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high disabled:opacity-30 text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-outline-variant/30 disabled:cursor-not-allowed active:scale-[0.97]"
              >
                <span>{language === 'en' ? 'Move Right' : 'Mover Derecha'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Acción 5: Eliminar contacto (Alerta Destructiva Sutil) */}
          <button
            type="button"
            onClick={() => onDeleteContact(contact)}
            className="w-full h-[52px] px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 dark:text-rose-400 font-bold text-sm flex items-center justify-between cursor-pointer active:scale-[0.97] transition-transform duration-150 ease-out"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[22px]">delete</span>
              <span>{language === 'en' ? 'Remove from Quick Send' : 'Eliminar de Envíos Rápidos'}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-rose-500 dark:text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full">
              {language === 'en' ? 'Remove' : 'Quitar'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
