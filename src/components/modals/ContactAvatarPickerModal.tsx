'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ContactAvatar } from '@/components/ContactAvatar';
import { ChevronLeftIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';

export interface ContactAvatarPickerModalProps {
  target: {
    name: string;
    photoUrl?: string;
    [key: string]: any;
  } | null;
  photoInput: string;
  onPhotoInputChange: (url: string) => void;
  onClose: () => void;
  onSave: (target: any, photoUrl: string) => void;
  isUpdating: boolean;
  language: 'es' | 'en';
}

export function ContactAvatarPickerModal({
  target,
  photoInput,
  onPhotoInputChange,
  onClose,
  onSave,
  isUpdating,
  language = 'es',
}: ContactAvatarPickerModalProps) {
  const [mounted, setMounted] = useState(false);
  const isEn = language === 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!target || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in text-white"
      onClick={() => {
        if (!isUpdating) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-avatar-title"
    >
      <div
        className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto scrollbar-none bg-[#0E131F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.95)] flex flex-col space-y-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Universal Don César Header: < | KinLogo | Badge */}
        <header className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="btn-circle disabled:opacity-40"
              title={isEn ? 'Back' : 'Volver'}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={34} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[13px]">photo_camera</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-bold">
              {isEn ? 'Official Avatar' : 'Avatar Oficial'}
            </span>
          </div>
        </header>

        {/* Title */}
        <div className="text-center pt-1">
          <h3 id="contact-avatar-title" className="text-lg font-bold text-white tracking-tight">
            {isEn ? `Photo for ${target.name}` : `Foto para ${target.name}`}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEn
              ? 'Customize the contact picture or keep a clean verified silhouette'
              : 'Personaliza la imagen del contacto o mantén una silueta limpia'}
          </p>
        </div>

        {/* Live Preview Ring */}
        <div className="flex flex-col items-center justify-center py-3">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-[#2ED5A4]/50 shadow-[0_0_25px_rgba(46,213,164,0.25)] bg-[#141624]">
            <ContactAvatar
              photoUrl={photoInput}
              name={target.name}
              className="w-full h-full rounded-3xl"
              iconSize="text-[48px]"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium mt-2">
            {photoInput
              ? isEn ? 'Photo preview active' : 'Vista previa de la foto'
              : isEn ? 'Clean silhouette active' : 'Silueta de usuario limpia activa'}
          </span>
        </div>

        {/* Option 1: File Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#2ED5A4] text-[18px]">photo_camera</span>
            <span>{isEn ? 'Upload from Device' : 'Subir foto desde tu dispositivo'}</span>
          </label>
          <label className="w-full h-[52px] rounded-2xl bg-[#141624] hover:bg-[#1A1C2E] border border-dashed border-[#2ED5A4]/50 flex items-center justify-center gap-2 text-[#2ED5A4] font-bold text-xs cursor-pointer transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]">upload</span>
            <span>{isEn ? 'Choose file (Camera / Gallery)' : 'Elegir archivo (Cámara / Galería)'}</span>
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
                    if (result) onPhotoInputChange(result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>

        {/* Option 2: Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#2ED5A4] text-[18px]">link</span>
            <span>{isEn ? 'Or paste image URL' : 'O pegar URL de imagen'}</span>
          </label>
          <input
            type="url"
            value={photoInput}
            onChange={(e) => onPhotoInputChange(e.target.value)}
            placeholder="https://ejemplo.com/foto.jpg"
            className="w-full h-[48px] px-3.5 rounded-xl bg-[#141624] text-xs text-white placeholder:text-slate-500 border border-white/10 focus:border-[#2ED5A4] focus:outline-none transition-all"
          />
        </div>

        {/* Option 3: Reset */}
        {photoInput && (
          <button
            type="button"
            onClick={() => onPhotoInputChange('')}
            className="w-full py-2.5 rounded-xl bg-[#141624]/60 hover:bg-[#141624] text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] border border-white/5"
          >
            <span className="material-symbols-outlined text-[16px]">no_accounts</span>
            <span>
              {isEn
                ? 'Remove photo and use Clean Silhouette'
                : 'Quitar foto y usar Silueta Limpia'}
            </span>
          </button>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="h-[48px] rounded-2xl bg-[#141624] hover:bg-[#1A1C2E] border border-white/10 text-white font-bold text-xs transition-all cursor-pointer active:scale-[0.98] disabled:opacity-40"
          >
            {isEn ? 'Cancel' : 'Cancelar'}
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onSave(target, photoInput)}
            className="h-[48px] rounded-2xl bg-gradient-to-r from-[#2ED5A4] to-[#26BC90] hover:brightness-110 text-[#06070B] font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#2ED5A4]/20 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-40"
          >
            {isUpdating ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
            ) : (
              <>
                <span>{isEn ? 'Save Photo' : 'Guardar Foto'}</span>
                <span className="material-symbols-outlined text-[16px]">check</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
