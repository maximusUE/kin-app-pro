'use client';

import React, { useState } from 'react';

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
  // Zero-Trust Control States
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [pinEnabled, setPinEnabled] = useState(true);
  const [fxAlertEnabled, setFxAlertEnabled] = useState(true);
  const [lockdownEnabled, setLockdownEnabled] = useState(true);
  const [antiPhishingCode, setAntiPhishingCode] = useState('AZTECA-88');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [tempCode, setTempCode] = useState('');

  // Encrypted documents
  const [docs, setDocs] = useState<VaultItem[]>(INITIAL_DOCS);
  const [uploading, setUploading] = useState(false);
  const [encryptStatus, setEncryptStatus] = useState<string | null>(null);
  const [exportedCert, setExportedCert] = useState(false);

  if (!isOpen) return null;

  // Active controls count
  const activeControlsCount = [
    biometricsEnabled,
    pinEnabled,
    fxAlertEnabled,
    Boolean(antiPhishingCode),
    lockdownEnabled,
  ].filter(Boolean).length;

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploading(true);
    setEncryptStatus('Derivando llave AES-GCM-256 con PBKDF2...');

    setTimeout(() => {
      setEncryptStatus('Cifrando archivo en Secure Enclave...');
      setTimeout(() => {
        const newDoc: VaultItem = {
          id: Date.now().toString(),
          name: `${file.name.replace(/\.[^/.]+$/, '')}.enc`,
          type: 'Documento Cifrado (AES-GCM-256)',
          date: 'Hoy',
          size: `${(file.size / (1024 * 1024) || 0.8).toFixed(1)} MB`,
        };
        setDocs([newDoc, ...docs]);
        setUploading(false);
        setEncryptStatus(null);
      }, 700);
    }, 800);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(antiPhishingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveCode = () => {
    if (tempCode.trim()) {
      setAntiPhishingCode(tempCode.trim().toUpperCase());
    }
    setIsEditingCode(false);
  };

  const handleExportCert = () => {
    setExportedCert(true);
    setTimeout(() => setExportedCert(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] max-h-[92vh] overflow-y-auto scrollbar-none rounded-t-[32px] sm:rounded-3xl bg-[#06070B] border border-white/10 text-on-surface shadow-2xl relative p-5 pb-10 space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-1 mb-3 sm:hidden" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="font-label-caps text-[10px] uppercase tracking-wider">Zero-Knowledge Enclave</span>
            </div>
            <h1 className="font-headline-md text-xl font-bold text-white tracking-tight">ClientVault &amp; Security</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield_lock
              </span>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-75" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full" />
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high border border-white/10 text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              title="Cerrar Bóveda"
              aria-label="Cerrar Bóveda"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Tier 3 Certified Hero Card */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container p-space-md shadow-2xl border border-white/5">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary w-fit border border-primary/20">
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    gpp_good
                  </span>
                  <span className="font-label-caps text-[10px] font-bold tracking-wider">TIER 3 CERTIFIED</span>
                </div>
                <h2 className="font-title-base text-[15px] font-bold text-white leading-snug">
                  Unlimited Cross-Border Volume
                </h2>
                <p className="font-caption-sm text-[11px] text-on-surface-variant">
                  Highest Institutional Remittance Standing
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary shadow-inner flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  military_tech
                </span>
              </div>
            </div>

            {/* Limits Grid */}
            <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest/80 p-2.5 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant">
                  TRANSFER LIMIT
                </span>
                <span className="font-financial-mono text-base font-bold text-primary">$10,000 USD</span>
                <span className="font-caption-sm text-[10px] text-on-surface-variant">per single dispatch</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant">
                  MONTHLY CAP
                </span>
                <span className="font-financial-mono text-base font-bold text-white">$30,000 USD</span>
                <span className="font-caption-sm text-[10px] text-on-surface-variant">SPEI zero-hold pipeline</span>
              </div>
            </div>

            {/* CNBV & FinCEN Audited Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="px-1.5 py-0.5 rounded bg-white text-[#0A0D1C] font-financial-mono text-[9px] font-black tracking-tight leading-none">
                  CNBV
                </div>
                <div className="px-1.5 py-0.5 rounded bg-white text-[#0A0D1C] font-financial-mono text-[8px] font-black tracking-tight leading-none">
                  FinCEN
                </div>
                <span className="font-caption-sm text-[11px] text-on-surface-variant">Bilateral AML/PLD Audited</span>
              </div>
              <span className="material-symbols-outlined text-primary text-[17px]">verified</span>
            </div>
          </div>
        </div>

        {/* AES-GCM Client-Side Encryption Pill */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-container-low border border-white/5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="material-symbols-outlined text-primary text-[15px]">lock</span>
          <span className="font-financial-mono text-[11px] text-on-surface truncate">
            256-bit AES-GCM Client-Side Encryption active
          </span>
        </div>

        {/* Zero-Trust Controls Section */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider">
              Zero-Trust Controls
            </span>
            <span className="font-caption-sm text-[11px] text-primary font-bold">
              {activeControlsCount} of 5 Active
            </span>
          </div>

          <div className="flex flex-col rounded-2xl bg-surface-container divide-y divide-white/5 overflow-hidden shadow-xl border border-white/5">
            {/* Control 1: Biometric Authentication */}
            <div className="flex items-center justify-between p-3 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-base text-xs font-semibold text-white">Biometric Authentication</span>
                  <span className="font-caption-sm text-[11px] text-on-surface-variant">
                    Face ID / Touch ID hardware authorization
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Toggle Biometrics"
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  biometricsEnabled ? 'bg-primary-container' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow-md transition duration-200 ease-in-out mt-0.5 ${
                    biometricsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Control 2: 4-Digit Transfer PIN */}
            <div className="flex items-center justify-between p-3 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">pin</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-base text-xs font-semibold text-white">4-Digit Transfer PIN</span>
                  <span className="font-caption-sm text-[11px] text-on-surface-variant">
                    Mandatory verification above $500 USD
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Toggle Transfer PIN"
                onClick={() => setPinEnabled(!pinEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  pinEnabled ? 'bg-primary-container' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow-md transition duration-200 ease-in-out mt-0.5 ${
                    pinEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Control 3: FX Smart Rate Alert */}
            <div className="flex items-center justify-between p-3 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-fixed flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">trending_up</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-base text-xs font-semibold text-white">FX Smart Rate Alert</span>
                  <span className="font-caption-sm text-[11px] text-on-surface-variant">
                    Push notice when 1 USD &gt; 20.80 MXN
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Toggle FX Smart Rate Alert"
                onClick={() => setFxAlertEnabled(!fxAlertEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  fxAlertEnabled ? 'bg-primary-container' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow-md transition duration-200 ease-in-out mt-0.5 ${
                    fxAlertEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Control 4: Anti-Phishing Token */}
            <div className="flex items-center justify-between p-3 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3 pr-2 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary-fixed flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">tag</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-title-base text-xs font-semibold text-white">Anti-Phishing Token</span>
                  <div className="inline-flex items-center gap-1.5 mt-0.5">
                    <span className="font-caption-sm text-[10px] text-on-surface-variant">Emails confirm:</span>
                    {isEditingCode ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          value={tempCode}
                          onChange={(e) => setTempCode(e.target.value)}
                          placeholder="NUEVO-TOKEN"
                          className="w-24 px-1 py-0.5 text-[10px] font-financial-mono bg-[#06070B] border border-primary text-primary rounded focus:outline-none"
                          maxLength={12}
                        />
                        <button
                          type="button"
                          onClick={handleSaveCode}
                          className="px-1.5 py-0.5 bg-primary text-black rounded text-[9px] font-bold"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="font-financial-mono text-[10px] bg-surface-container-lowest px-1.5 py-0.5 rounded text-primary border border-primary/20 hover:border-primary transition-colors cursor-pointer"
                        title="Click para copiar"
                      >
                        {copiedCode ? '¡Copiado!' : antiPhishingCode}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {!isEditingCode && (
                <button
                  type="button"
                  aria-label="Edit anti-phishing code"
                  onClick={() => {
                    setTempCode(antiPhishingCode);
                    setIsEditingCode(true);
                  }}
                  className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                </button>
              )}
            </div>

            {/* Control 5: Zero-Knowledge Lockdown */}
            <div className="flex items-center justify-between p-3 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-base text-xs font-semibold text-white">Zero-Knowledge Lockdown</span>
                  <span className="font-caption-sm text-[11px] text-on-surface-variant">
                    Private keys confined to hardware Secure Enclave
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Toggle Zero-Knowledge Lockdown"
                onClick={() => setLockdownEnabled(!lockdownEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  lockdownEnabled ? 'bg-primary-container' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow-md transition duration-200 ease-in-out mt-0.5 ${
                    lockdownEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Primary Security Hardware Diagnostic Card */}
        <div className="rounded-2xl bg-surface-container p-3 flex flex-col gap-2 shadow-lg border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[19px]">phone_iphone</span>
              <span className="font-title-base text-xs font-bold text-white">Primary Security Hardware</span>
            </div>
            <span className="inline-flex items-center gap-1 font-caption-sm text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Active Now
            </span>
          </div>

          <div className="bg-surface-container-lowest p-2.5 rounded-xl flex flex-col gap-1.5 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-body-medium text-xs text-white font-semibold">iPhone 15 Pro</span>
              <span className="font-financial-mono text-[11px] text-on-surface-variant">iOS 17.5.1</span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-caption-sm text-[11px]">
              <span className="material-symbols-outlined text-[13px] text-primary">location_on</span>
              <span>Dallas, TX, United States (SPEI Gateway Auth)</span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-caption-sm text-[11px]">
              <span className="material-symbols-outlined text-[13px] text-primary">history</span>
              <span>Last transfer authorized: Today, 2:15 PM via Face ID</span>
            </div>
          </div>
        </div>

        {/* Encrypted Vault Documents Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[16px]">folder_special</span>
              <span className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Bóveda de Documentos Cifrados
              </span>
            </div>
            <span className="text-[10px] text-primary font-bold">{docs.length} protegidos</span>
          </div>

          <div className="space-y-1.5">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="p-2.5 rounded-xl bg-surface-container border border-white/5 flex items-center justify-between hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[17px]">lock</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{doc.name}</p>
                    <p className="text-[10px] text-on-surface-variant">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-financial-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold border border-primary/20 flex-shrink-0">
                  AES-256
                </span>
              </div>
            ))}
          </div>

          {/* Upload and Encrypt New Document */}
          <label className="w-full h-11 rounded-xl bg-surface-container-high border border-dashed border-primary/30 text-white font-bold text-xs hover:border-primary active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
            {uploading ? (
              <div className="flex items-center gap-2 text-primary text-xs">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>{encryptStatus || 'Cifrando documento...'}</span>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-primary text-[18px]">add_moderator</span>
                <span className="text-xs">+ Cifrar y Guardar Nuevo Documento</span>
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

        {/* Action Buttons: Export Certificate & Logout */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleExportCert}
            className="w-full h-12 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(46,213,164,0.3)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>{exportedCert ? '¡Certificado Descargado! ✓' : 'Exportar Certificado de Auditoría (PDF)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('¿Deseas cerrar sesión en todos los dispositivos y revocar tokens locales?')) {
                onClose();
              }
            }}
            className="w-full h-[52px] rounded-full bg-surface-container-high text-error hover:bg-error-container/40 flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">power_settings_new</span>
            <span className="font-title-base text-xs font-bold">Cerrar Sesión en Todos los Equipos</span>
          </button>

          <p className="text-center font-caption-sm text-[10px] text-on-surface-variant">
            Revoca instantáneamente los tokens de emparejamiento SPEI y reinicia la memoria caché Zero-Knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}
