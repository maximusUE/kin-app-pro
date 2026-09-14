'use client';

import React, { useState } from 'react';
import { CloseIcon, VaultIcon, ShieldCheckIcon, LockIcon } from './Icons';

interface ClientVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VaultItem {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

const INITIAL_DOCS: VaultItem[] = [
  { id: '1', name: 'INE_Frente_Oficial_2026.enc', type: 'Identificación Oficial', date: '12 Sep 2026', size: '2.4 MB' },
  { id: '2', name: 'Comprobante_Domicilio_CFE.enc', type: 'Comprobante Domicilio', date: '01 Sep 2026', size: '1.1 MB' },
  { id: '3', name: 'Recibo_Remesa_KIN_88921.enc', type: 'Comprobante SPEI Banxico', date: '28 Ago 2026', size: '420 KB' },
];

export function ClientVaultModal({ isOpen, onClose }: ClientVaultModalProps) {
  const [docs, setDocs] = useState<VaultItem[]>(INITIAL_DOCS);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploading(true);
    setTimeout(() => {
      const newDoc: VaultItem = {
        id: Date.now().toString(),
        name: `${file.name.replace(/\.[^/.]+$/, "")}.enc`,
        type: 'Documento Cifrado (AES-GCM-256)',
        date: 'Hoy',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      };
      setDocs([newDoc, ...docs]);
      setUploading(false);
    }, 1000);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#7047EB]/20 border border-[#7047EB]/40 flex items-center justify-center text-[#7047EB]">
              <VaultIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">ClientVault™ Zero-Knowledge</h2>
              <p className="text-[10px] text-[#8E91A5]">Cifrado AES-GCM-256 en tu dispositivo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-circle w-8 h-8"
          >
            <CloseIcon className="w-4 h-4 text-[#8E91A5]" />
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-3.5 p-3 rounded-2xl bg-[#0D0E15] border border-[#7047EB]/30 flex items-center gap-2.5">
          <ShieldCheckIcon className="w-5 h-5 text-[#2ED5A4] flex-shrink-0" />
          <div className="text-[10px] text-[#8E91A5] leading-snug">
            <span className="text-white font-semibold">Tus archivos nunca tocan la nube sin cifrar.</span> La llave privada reside únicamente en tu dispositivo.
          </div>
        </div>

        {/* Document List */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-[#8E91A5] uppercase tracking-wider">Tus Documentos Seguros</span>
            <span className="text-[10px] text-[#2ED5A4] font-semibold">{docs.length} guardados</span>
          </div>

          <div className="space-y-2">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-2xl bg-[#0D0E15] border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#1C1D2D] flex items-center justify-center text-[#7047EB] flex-shrink-0">
                    <LockIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{doc.name}</p>
                    <p className="text-[9px] text-[#8E91A5]">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] font-bold flex-shrink-0">
                  AES-256
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Button */}
        <div className="mt-4">
          <label className="w-full h-12 rounded-2xl bg-[#7047EB] text-white font-bold text-xs hover:bg-[#6035DA] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-glow-purple">
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <VaultIcon className="w-4 h-4 text-white" />
                <span>+ Cifrar y Guardar Nuevo Documento</span>
              </>
            )}
            <input
              type="file"
              onChange={handleSimulateUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
