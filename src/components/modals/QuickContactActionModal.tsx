'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ContactAvatar } from '@/components/ContactAvatar';
import { ChevronLeftIcon, getBankLogoUrl } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';

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
  language = 'es',
  contactsCount,
  onSendMoney,
  onSendKinCash,
  onEditPhoto,
  onMoveLeft,
  onMoveRight,
  onDeleteContact,
}: QuickContactActionModalProps) {
  const [mounted, setMounted] = useState(false);
  const isEn = language === 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!target || !mounted) return null;

  const { contact, index } = target;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in text-white"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-contact-title"
    >
      <div
        className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto scrollbar-none bg-[#0E131F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.95)] flex flex-col space-y-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Universal Don César Header: < | KinLogo | Contact Badge */}
        <header className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle"
              title={isEn ? 'Back' : 'Volver'}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={34} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[13px]">contacts</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
              {isEn ? 'Frequent Contact' : 'Contacto Frecuente'}
            </span>
          </div>
        </header>

        {/* Contact Profile Snippet Card */}
        <div className="p-4 rounded-2xl bg-[#141624] border border-white/5 flex items-center gap-3.5">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-white/10 flex-shrink-0">
            <ContactAvatar
              photoUrl={contact.photoUrl}
              name={contact.name}
              className="w-full h-full rounded-2xl"
              iconSize="text-[30px]"
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
          <div className="min-w-0 flex-1">
            <h3 id="quick-contact-title" className="text-base font-bold text-white truncate font-title-base">
              {contact.fullName || contact.name}
            </h3>
            <p className="text-xs text-[#2ED5A4] font-mono truncate">
              {contact.phone || 'Destinatario KIN'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {contact.bank || 'Red Bancaria SPEI / Efectivo'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Action 1: Enviar Dinero Ahora */}
          <button
            type="button"
            onClick={() => {
              onSendMoney(contact);
              onClose();
            }}
            className="w-full h-[52px] px-4 rounded-2xl bg-gradient-to-r from-[#2ED5A4] to-[#26BC90] hover:brightness-110 text-[#06070B] font-black text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-[#2ED5A4]/20 cursor-pointer active:scale-[0.98] transition-transform duration-150 ease-out"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[22px]">send_money</span>
              <span>{isEn ? 'Send Money Now (SPEI / Cash)' : 'Enviar Dinero Ahora (SPEI / Efectivo)'}</span>
            </div>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          {/* Action 2: Enviar por KIN CASH P2P */}
          <button
            type="button"
            onClick={() => {
              onSendKinCash(contact);
              onClose();
            }}
            className="w-full h-[52px] px-4 rounded-2xl bg-[#141624] hover:bg-[#1A1C2E] border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform duration-150 ease-out"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#7047EB] text-[22px]">bolt</span>
              <span>{isEn ? 'Transfer with Instant KIN CASH' : 'Transferir con KIN CASH Instantáneo'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#7047EB]/20 text-[#A78BFA] text-[10px] font-black border border-[#7047EB]/30">
              $0 FEE
            </span>
          </button>

          {/* Action 3: Editar Foto / Cambiar Avatar */}
          <button
            type="button"
            onClick={() => {
              onEditPhoto(contact);
              onClose();
            }}
            className="w-full h-[50px] px-4 rounded-2xl bg-[#141624] hover:bg-[#1A1C2E] border border-white/10 text-white font-medium text-xs sm:text-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform duration-150 ease-out"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#2ED5A4] text-[20px]">add_a_photo</span>
              <span>{isEn ? 'Edit Contact Photo / Avatar' : 'Editar Foto / Avatar del Contacto'}</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
          </button>

          {/* Action 4: Reordenar / Mover de posición en el carrusel */}
          <div className="p-3 rounded-2xl bg-[#141624]/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#2ED5A4]">swap_horiz</span>
                <span>{isEn ? 'Position in carousel' : 'Posición en carrusel'}</span>
              </span>
              <span className="text-[10px] text-[#2ED5A4] font-bold font-mono">
                #{index + 1} / {contactsCount}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onMoveLeft(index)}
                className="h-10 rounded-xl bg-[#141624] hover:bg-[#1A1C2E] disabled:opacity-30 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-white/10 disabled:cursor-not-allowed active:scale-[0.97]"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>{isEn ? 'Move Left' : 'Mover Izquierda'}</span>
              </button>
              <button
                type="button"
                disabled={index === contactsCount - 1}
                onClick={() => onMoveRight(index)}
                className="h-10 rounded-xl bg-[#141624] hover:bg-[#1A1C2E] disabled:opacity-30 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-white/10 disabled:cursor-not-allowed active:scale-[0.97]"
              >
                <span>{isEn ? 'Move Right' : 'Mover Derecha'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Action 5: Eliminar contacto */}
          <button
            type="button"
            onClick={() => {
              onDeleteContact(contact);
              onClose();
            }}
            className="w-full h-[48px] px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-xs sm:text-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform duration-150 ease-out"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]">delete</span>
              <span>{isEn ? 'Remove from Quick Send' : 'Eliminar de Envíos Rápidos'}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
              {isEn ? 'Remove' : 'Quitar'}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
