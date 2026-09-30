'use client';

import React from 'react';
import { ContactAvatar } from '@/components/ContactAvatar';
import { CloseIcon } from '@/components/Icons';

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
  language,
}: ContactAvatarPickerModalProps) {
  if (!target) return null;

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={() => {
        if (!isUpdating) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-avatar-title"
    >
      <div
        className="modal-card space-y-4 max-h-[85vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 rounded-full bg-outline-variant/40 mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header del modal */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </div>
            <div>
              <h3 id="contact-avatar-title" className="text-sm font-bold text-on-surface font-title-base">
                {language === 'en' ? `Photo of ${target.name}` : `Foto de ${target.name}`}
              </h3>
              <p className="text-[10px] text-on-surface-variant">
                {language === 'en'
                  ? 'Customize the picture or keep a clean silhouette'
                  : 'Personaliza la imagen o mantén una silueta limpia'}
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

        {/* Vista previa en vivo del avatar */}
        <div className="flex flex-col items-center justify-center py-2 space-y-2">
          <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-2 border-primary/40 shadow-xl bg-surface-container-high">
            <ContactAvatar
              photoUrl={photoInput}
              name={target.name}
              className="w-full h-full rounded-3xl"
              iconSize="text-[44px]"
            />
          </div>
          <span className="text-[11px] text-on-surface-variant font-medium">
            {photoInput
              ? language === 'en' ? 'Photo preview' : 'Vista previa de la foto'
              : language === 'en' ? 'Clean silhouette active' : 'Silueta de usuario limpia activa'}
          </span>
        </div>

        {/* Opción 1: Subir imagen desde galería / cámara del celular */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">photo_camera</span>
            <span>{language === 'en' ? 'Upload photo from device' : 'Subir foto desde tu dispositivo'}</span>
          </label>
          <label className="w-full h-[52px] rounded-2xl bg-surface-container hover:bg-surface-container-high border border-dashed border-primary/50 flex items-center justify-center gap-2 text-primary font-bold text-xs cursor-pointer transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]">upload</span>
            <span>{language === 'en' ? 'Choose file (Camera / Gallery)' : 'Elegir archivo (Cámara / Galería)'}</span>
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

        {/* Opción 2: Pegar enlace URL de imagen */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">link</span>
            <span>{language === 'en' ? 'Or paste image URL' : 'O pegar URL de imagen'}</span>
          </label>
          <input
            type="url"
            value={photoInput}
            onChange={(e) => onPhotoInputChange(e.target.value)}
            placeholder="https://ejemplo.com/foto.jpg"
            className="w-full h-[48px] px-3.5 rounded-xl bg-surface-container-low text-sm text-on-surface placeholder:text-on-surface-variant/40 border border-outline-variant/40 focus:border-primary focus:outline-none transition-all"
          />
        </div>

        {/* Opción 3: Restablecer a silueta limpia sin foto */}
        {photoInput && (
          <button
            type="button"
            onClick={() => onPhotoInputChange('')}
            className="w-full py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.97]"
          >
            <span className="material-symbols-outlined text-[16px]">no_accounts</span>
            <span>
              {language === 'en'
                ? 'Remove photo and use Clean Silhouette'
                : 'Quitar foto y usar Silueta Limpia'}
            </span>
          </button>
        )}

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="h-[48px] rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs transition-all cursor-pointer active:scale-[0.97]"
          >
            {language === 'en' ? 'Cancel' : 'Cancelar'}
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onSave(target, photoInput)}
            className="h-[48px] rounded-full bg-primary hover:bg-[#26BC90] text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 transition-all cursor-pointer active:scale-[0.97]"
          >
            {isUpdating ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <>
                <span>{language === 'en' ? 'Save Photo' : 'Guardar Foto'}</span>
                <span className="material-symbols-outlined text-[16px]">check</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
