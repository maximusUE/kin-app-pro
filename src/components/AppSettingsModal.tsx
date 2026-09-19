'use client';

import React, { useState } from 'react';
import {
  CloseIcon,
  SettingsGearIcon,
  ShieldCheckIcon,
  LockIcon,
  BellIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  DownloadIcon,
  VaultIcon,
  MailIcon,
  PhoneIcon,
  CheckCircleIcon as CheckIcon,
} from './Icons';

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVault: () => void;
  onLogout: () => void;
  biometricsEnabled: boolean;
  onToggleBiometrics: () => void;
  pushNotificationsEnabled: boolean;
  onTogglePushNotifications: () => void;
  userEmail?: string;
  userPhone?: string;
  currencyPref: 'USD' | 'MXN';
  onCurrencyChange: (curr: 'USD' | 'MXN') => void;
  language: 'es' | 'en';
  onLanguageChange: (lang: 'es' | 'en') => void;
}

export function ToggleSwitch({
  enabled,
  onToggle,
  title,
}: {
  enabled: boolean;
  onToggle: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      title={title}
      className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center flex-shrink-0 ${
        enabled ? 'bg-[#2ED5A4]' : 'bg-[#202236] border border-white/15'
      }`}
    >
      <span
        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function AppSettingsModal({
  isOpen,
  onClose,
  onOpenVault,
  onLogout,
  biometricsEnabled,
  onToggleBiometrics,
  pushNotificationsEnabled,
  onTogglePushNotifications,
  userEmail = 'cesar.urrutia@gmail.com',
  userPhone = '+1 (555) 349-2810',
  currencyPref = 'USD',
  onCurrencyChange,
  language = 'es',
  onLanguageChange,
}: AppSettingsModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'seguridad' | 'notificaciones' | 'legal'>('general');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [sms2FA, setSms2FA] = useState(true);
  const [fxAlerts, setFxAlerts] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [pinSet, setPinSet] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [pinChangeModal, setPinChangeModal] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadStatement = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      setPinFeedback('El PIN debe contener exactamente 4 dígitos numéricos.');
      return;
    }
    setPinFeedback('✓ ¡PIN de seguridad actualizado con éxito!');
    setTimeout(() => {
      setPinChangeModal(false);
      setPinFeedback(null);
      setCurrentPin('');
      setNewPin('');
    }, 1200);
  };

  const isEn = language === 'en';

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="modal-card space-y-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px' }}
      >
        {/* Header de Configuración */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 flex items-center justify-center text-[#2ED5A4] shadow-sm">
              <SettingsGearIcon className="w-5 h-5 text-[#2ED5A4]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                {isEn ? 'Settings & Preferences' : 'Configuración & Preferencias'}
              </h2>
              <p className="text-[10px] text-[#8E91A5]">
                {isEn ? 'KIN Mobile system settings' : 'Ajustes del sistema KIN Mobile'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8E91A5] hover:text-white transition-all cursor-pointer"
            title={isEn ? 'Close settings' : 'Cerrar configuración'}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Categorías (Pills de Navegación) */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#0E0F1A] border border-white/5 flex-shrink-0 text-center">
          {[
            { id: 'general', label: isEn ? 'General' : 'General' },
            { id: 'seguridad', label: isEn ? 'Security' : 'Seguridad' },
            { id: 'notificaciones', label: isEn ? 'Alerts' : 'Alertas' },
            { id: 'legal', label: isEn ? 'Legal' : 'Legal' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-[#2ED5A4] text-[#06070B] shadow-sm'
                  : 'text-[#8E91A5] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido Dinámico con Scroll Ergonómico */}
        <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 pr-0.5">

          {/* ========================================================================= */}
          {/* TAB 1: GENERAL & PREFERENCIAS OPERATIVAS                                  */}
          {/* ========================================================================= */}
          {activeSubTab === 'general' && (
            <div className="space-y-3 animate-fade-in">
              {/* Moneda de Visualización */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isEn ? 'Display Currency' : 'Moneda de Visualización'}
                    </span>
                    <span className="text-[10px] text-[#8E91A5]">
                      {isEn ? 'Primary balances and rates across the app' : 'Precios y saldos primarios en pantalla'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#202236] p-1 rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => onCurrencyChange('USD')}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        currencyPref === 'USD'
                          ? 'bg-[#2ED5A4] text-white shadow-sm'
                          : 'text-[#8E91A5] hover:text-white'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => onCurrencyChange('MXN')}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        currencyPref === 'MXN'
                          ? 'bg-[#2ED5A4] text-white shadow-sm'
                          : 'text-[#8E91A5] hover:text-white'
                      }`}
                    >
                      MXN ($)
                    </button>
                  </div>
                </div>
              </div>

              {/* Alerta de Mejor Tasa FX */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isEn ? 'Smart FX Rate Alert' : 'Alerta Inteligente de Tasa FX'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {isEn ? 'Notify me when 1 USD exceeds $20.50 MXN' : 'Avisarme cuando 1 USD supere $20.50 MXN'}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={fxAlerts}
                  onToggle={() => setFxAlerts(!fxAlerts)}
                  title={isEn ? 'Smart FX Alert' : 'Alerta Inteligente de Tasa FX'}
                />
              </div>

              {/* Idioma de la Aplicación */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isEn ? 'Interface Language' : 'Idioma de la Interfaz'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {isEn ? 'Default application language' : 'Lenguaje predeterminado de la aplicación'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#202236] p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => onLanguageChange('es')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      language === 'es' ? 'bg-[#2ED5A4] text-white shadow-sm' : 'text-[#8E91A5] hover:text-white'
                    }`}
                  >
                    Español
                  </button>
                  <button
                    type="button"
                    onClick={() => onLanguageChange('en')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      language === 'en' ? 'bg-[#2ED5A4] text-white shadow-sm' : 'text-[#8E91A5] hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Respuesta Háptica (Vibración) */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isEn ? 'Haptic Feedback (Vibration)' : 'Respuesta Háptica (Vibración)'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {isEn ? 'Micro-vibration on transfer confirmations' : 'Micro-vibración al confirmar transferencias'}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={hapticFeedback}
                  onToggle={() => setHapticFeedback(!hapticFeedback)}
                  title={isEn ? 'Haptic feedback' : 'Respuesta Háptica'}
                />
              </div>

              {/* Descargar Estado de Cuenta PDF */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isEn ? 'Official Account Statement' : 'Estado de Cuenta Oficial'}
                    </span>
                    <span className="text-[10px] text-[#8E91A5]">
                      {isEn ? 'Monthly certified tax statement' : 'Extracto mensual con certificación fiscal'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadStatement}
                    className="px-3 py-1.5 rounded-xl bg-[#202236] border border-white/10 hover:border-[#2ED5A4] text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <DownloadIcon className="w-3.5 h-3.5 text-[#2ED5A4]" />
                    <span>{isEn ? 'Download PDF' : 'Descargar PDF'}</span>
                  </button>
                </div>
                {downloadSuccess && (
                  <div className="p-2 rounded-xl bg-[#2ED5A4]/15 border border-[#2ED5A4]/30 text-[11px] font-bold text-[#2ED5A4] flex items-center gap-1.5">
                    <span>✓</span>
                    <span>
                      {isEn
                        ? 'Encrypted statement successfully downloaded.'
                        : 'Estado de cuenta encriptado descargado en tu dispositivo.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: SEGURIDAD, BIOMETRÍA, PIN & CLIENTVAULT                            */}
          {/* ========================================================================= */}
          {activeSubTab === 'seguridad' && (
            <div className="space-y-3 animate-fade-in">
              {/* Autenticación Biométrica (Face ID) */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isEn ? 'Biometric Authentication (Face ID)' : 'Autenticación Biométrica (Face ID)'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {isEn ? 'Quick sign in and SPEI authorizations' : 'Inicio de sesión y autorización SPEI'}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={biometricsEnabled}
                  onToggle={onToggleBiometrics}
                  title={isEn ? 'Face ID Authentication' : 'Autenticación Biométrica'}
                />
              </div>

              {/* PIN de Seguridad para Transferencias */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isEn ? 'Transfer PIN (4 Digits)' : 'PIN de Transferencias (4 Dígitos)'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {isEn ? 'Required for transfers over $500 USD' : 'Requerido para envíos mayores a $500 USD'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPinChangeModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#202236] border border-white/10 hover:border-[#2ED5A4] text-xs font-bold text-[#2ED5A4] transition-all cursor-pointer"
                >
                  {pinSet ? (isEn ? 'Change PIN' : 'Cambiar PIN') : (isEn ? 'Create PIN' : 'Crear PIN')}
                </button>
              </div>

              {/* Verificación en 2 Pasos (SMS 2FA) */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isEn ? 'Two-Step Verification (2FA)' : 'Verificación en Dos Pasos (2FA)'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {isEn ? `SMS code sent to ${userPhone}` : `Código vía SMS a ${userPhone}`}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={sms2FA}
                  onToggle={() => setSms2FA(!sms2FA)}
                  title={isEn ? 'SMS 2FA' : 'Verificación SMS'}
                />
              </div>

              {/* Bóveda Cero Conocimiento ClientVault */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-[#2ED5A4]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#2ED5A4]/15 flex items-center justify-center text-[#2ED5A4]">
                      <LockIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">ClientVault™ Zero-Knowledge</span>
                      <span className="text-[10px] text-[#8E91A5]">
                        {isEn ? 'AES-GCM-256 military-grade encryption' : 'Cifrado criptográfico AES-GCM-256'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenVault();
                    }}
                    className="px-3 py-1 rounded-xl bg-[#2ED5A4] text-[#06070B] text-xs font-black shadow-sm hover:brightness-110 cursor-pointer"
                  >
                    {isEn ? 'Open Vault' : 'Ver Bóveda'}
                  </button>
                </div>
              </div>

              {/* Sesiones y Dispositivos de Confianza */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold text-[#8E91A5] uppercase tracking-wider block">
                  {isEn ? 'Trusted Device' : 'Dispositivo de Confianza'}
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📱</span>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {isEn ? 'Apple iPhone (This session)' : 'Apple iPhone (Esta sesión)'}
                      </p>
                      <p className="text-[10px] text-[#2ED5A4]">
                        {isEn ? 'Active now • California, USA' : 'Activo ahora • California, USA'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-[#8E91A5]">
                    {isEn ? 'Primary' : 'Principal'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: NOTIFICACIONES & ALERTAS DE ENVÍOS                                  */}
          {/* ========================================================================= */}
          {activeSubTab === 'notificaciones' && (
            <div className="space-y-3 animate-fade-in">
              {/* Notificaciones Push Inmediatas */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isEn ? 'Live Push Notifications' : 'Notificaciones Push en Vivo'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {isEn ? 'Instant alerts on SPEI settlement' : 'Avisos instantáneos de liquidación SPEI'}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={pushNotificationsEnabled}
                  onToggle={onTogglePushNotifications}
                  title={isEn ? 'Push notifications' : 'Notificaciones Push'}
                />
              </div>

              {/* Comprobantes por Correo Electrónico */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isEn ? 'Email Receipts' : 'Recibos por Correo Electrónico'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {isEn ? `Send PDF receipt to ${userEmail}` : `Enviar comprobante PDF a ${userEmail}`}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={emailAlerts}
                  onToggle={() => setEmailAlerts(!emailAlerts)}
                  title={isEn ? 'Email receipts' : 'Recibos por Correo'}
                />
              </div>

              {/* Notificación de Depósitos Entrantes */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isEn ? 'KIN Cash Deposit Alerts' : 'Avisos de Fondos KIN Cash'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {isEn ? 'When receiving funds from relatives' : 'Al recibir transferencias de familiares'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4]">
                  {isEn ? 'Always On' : 'Siempre Activo'}
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: LEGAL, CUMPLIMIENTO, SOPORTE & VERSION                             */}
          {/* ========================================================================= */}
          {activeSubTab === 'legal' && (
            <div className="space-y-3 animate-fade-in">
              {/* Soporte 24/7 */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isEn ? 'Help Center & Support 24/7' : 'Centro de Ayuda & Soporte 24/7'}
                  </span>
                  <span className="text-[10px] text-[#8E91A5]">
                    {isEn ? 'Instant bilingual support via chat' : 'Atención bilingüe inmediata vía chat'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(isEn ? 'Connecting with a KIN banking specialist...' : 'Conectando con un especialista bancario de KIN...')}
                  className="px-3 py-1.5 rounded-xl bg-[#202236] text-white text-xs font-bold hover:bg-[#2B2C42] border border-white/10 cursor-pointer"
                >
                  {isEn ? 'Start Chat' : 'Iniciar Chat'}
                </button>
              </div>

              {/* Cumplimiento Regulatorio FinCEN / CNBV */}
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 space-y-1">
                <span className="text-xs font-bold text-white block">
                  {isEn ? 'Licenses & Regulatory Compliance' : 'Licencias y Cumplimiento Financiero'}
                </span>
                <p className="text-[10px] text-[#8E91A5] leading-relaxed">
                  {isEn
                    ? 'KIN Mobile operates in strict compliance with Anti-Money Laundering (AML) standards supervised by FinCEN (USA) and the National Banking and Securities Commission (CNBV Mexico).'
                    : 'KIN Mobile opera en estricto apego a las disposiciones de Prevención de Lavado de Dinero (PLD) supervisadas por FinCEN (USA) y la Comisión Nacional Bancaria y de Valores (CNBV México).'}
                </p>
                <div className="pt-1 flex items-center gap-2 text-[9px] text-[#2ED5A4] font-semibold">
                  <span>{isEn ? '✓ SPEI Router Code 90642' : '✓ Enrutador SPEI Clave 90642'}</span>
                  <span>•</span>
                  <span>ISO-27001 Certified</span>
                </div>
              </div>

              {/* Términos & Privacidad */}
              <div className="p-3 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-[#8E91A5]">
                  {isEn ? 'Terms & Conditions of Service' : 'Términos y Condiciones de Servicio'}
                </span>
                <button
                  type="button"
                  onClick={() => alert(isEn ? 'Opening KIN Terms of Service and Customer Agreement' : 'Abriendo Términos de Servicio y Contrato de Apertura KIN')}
                  className="text-xs text-[#2ED5A4] hover:underline cursor-pointer font-bold"
                >
                  {isEn ? 'Read' : 'Leer'}
                </button>
              </div>

              {/* Versión de la Aplicación */}
              <div className="p-3 rounded-2xl bg-[#0E0F1A] border border-white/5 text-center">
                <p className="text-xs font-black text-white">KIN Mobile Fintech App</p>
                <p className="text-[10px] text-[#8E91A5]">
                  {isEn ? 'Version 2.4.0 (Build 8920) Pro Edition' : 'Versión 2.4.0 (Build 8920) Pro Edition'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Emergente Secundario para Cambiar PIN */}
        {pinChangeModal && (
          <div className="p-4 rounded-2xl bg-[#0E0F1A] border border-white/15 space-y-3 flex-shrink-0 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                {isEn ? 'Change 4-Digit PIN' : 'Cambiar PIN de 4 Dígitos'}
              </span>
              <button
                type="button"
                onClick={() => setPinChangeModal(false)}
                className="text-xs text-[#8E91A5] hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveNewPin} className="space-y-2">
              <input
                type="password"
                maxLength={4}
                placeholder={isEn ? 'New PIN (4 digits)' : 'Nuevo PIN (4 dígitos)'}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full h-11 px-3 rounded-xl bg-[#202236] border border-white/10 text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-[#2ED5A4]"
              />
              {pinFeedback && (
                <p className={`text-[11px] font-bold ${pinFeedback.startsWith('✓') ? 'text-[#2ED5A4]' : 'text-[#FF5555]'}`}>
                  {pinFeedback}
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPinChangeModal(false)}
                  className="flex-1 py-2 rounded-xl bg-[#202236] text-white text-xs font-bold hover:bg-[#2B2C42]"
                >
                  {isEn ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#2ED5A4] text-[#06070B] text-xs font-black hover:brightness-110"
                >
                  {isEn ? 'Save PIN' : 'Guardar PIN'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer: Botón Cerrar Sesión Segura */}
        <div className="pt-2 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-2.5 rounded-2xl bg-[#FF5555]/10 border border-[#FF5555]/30 hover:bg-[#FF5555]/20 text-[#FF5555] text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{isEn ? 'Log Out Securely on this Device' : 'Cerrar Sesión Segura en este Dispositivo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
