'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon } from '@/components/Icons';
import { KinLogo } from '@/components/KinLogo';
import { toast } from 'sonner';

export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  zip: string;
  city: string;
  state: string;
}

export interface PersonalInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: PersonalInfoData;
  onSave: (data: PersonalInfoData) => void;
  language?: 'es' | 'en';
}

export function PersonalInformationModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  language = 'es',
}: PersonalInformationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [phone, setPhone] = useState(initialData.phone);
  const [address1, setAddress1] = useState(initialData.address1);
  const [address2, setAddress2] = useState(initialData.address2 || '');
  const [zip, setZip] = useState(initialData.zip);
  const [city, setCity] = useState(initialData.city);
  const [state, setState] = useState(initialData.state);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEn = language === 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setPhone(initialData.phone);
      setAddress1(initialData.address1);
      setAddress2(initialData.address2 || '');
      setZip(initialData.zip);
      setCity(initialData.city);
      setState(initialData.state);
    }
  }, [isOpen, initialData]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address1: address1.trim(),
        address2: address2.trim(),
        zip: zip.trim(),
        city: city.trim(),
        state: state.trim(),
      });
      setIsSubmitting(false);
      toast.success(
        isEn
          ? 'Personal and tax information updated successfully!'
          : '¡Información personal y fiscal actualizada con éxito!'
      );
      onClose();
    }, 450);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-black/60 dark:bg-black/85 backdrop-blur-xl flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[440px] max-h-[92vh] flex flex-col bg-white dark:bg-gradient-to-b dark:from-[#111625] dark:via-[#0D111D] dark:to-[#080B11] border-t sm:border border-slate-200/80 dark:border-white/10 rounded-t-[32px] sm:rounded-[28px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.95),_0_0_40px_rgba(46,213,164,0.08)] overflow-hidden text-slate-900 dark:text-white my-0 sm:my-auto">
        {/* iOS Drag Handle on Mobile */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mt-2.5 mb-1 shrink-0 select-none sm:hidden" />

        {/* Universal Top Header */}
        <header className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-slate-100 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white transition-all cursor-pointer"
              title={isEn ? 'Back' : 'Volver'}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <KinLogo size={32} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-extrabold">
              {isEn ? 'CNBV & IRS Verified' : 'Perfil Verificado CNBV & IRS'}
            </span>
          </div>
        </header>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 scrollbar-none">
          {/* Hero Section */}
          <div className="text-left">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEn ? 'Personal & Tax Profile' : 'Información Personal & Fiscal'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isEn
                ? 'Legal identity registered for SPEI Banxico transfers, debit card issuing & IRS/SAT tax reports.'
                : 'Identidad legal registrada para envíos SPEI Banxico, emisión de tarjetas y reportes fiscales ante el SAT.'}
            </p>
          </div>

          {/* Security Banner Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/15 dark:to-teal-500/10 border border-emerald-500/20 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-[#2ED5A4] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-[#2ED5A4] block">
                {isEn ? 'Bank-Grade 256-bit Encryption' : 'Blindaje Bancario 256-Bit'}
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-300 block leading-tight mt-0.5">
                {isEn
                  ? 'All changes are audited under FinCEN 31 CFR § 1010 and Banco de México regulatory rails.'
                  : 'Tus datos están protegidos bajo normas de secreto bancario CNBV y regulaciones FinCEN.'}
              </span>
            </div>
          </div>

          {/* Bento Card 1: Identidad Legal */}
          <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-[#141824] border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 dark:text-[#2ED5A4] text-[18px]">badge</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  {isEn ? 'Legal Identity' : 'Identidad del Titular'}
                </span>
              </div>
              <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                {isEn ? 'Matches Official ID' : 'Coincide con INE / Pasaporte'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                  {isEn ? 'First Name' : 'Nombre(s)'}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400 dark:text-slate-500 text-[16px]">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-white dark:bg-[#0D101A] text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-2 focus:ring-[#2ED5A4]/20 transition-all font-medium"
                    placeholder="César"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                  {isEn ? 'Last Name' : 'Apellidos'}
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-white dark:bg-[#0D101A] text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-2 focus:ring-[#2ED5A4]/20 transition-all font-medium"
                  placeholder="Ugalde"
                />
              </div>
            </div>
          </div>

          {/* Bento Card 2: Contacto Directo */}
          <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-[#141824] border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 dark:text-[#2ED5A4] text-[18px]">call</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  {isEn ? 'Security Phone' : 'Teléfono de Seguridad (2FA)'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-[#2ED5A4] text-[9px] font-bold">
                SMS 2FA
              </span>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                {isEn ? 'Primary Mobile Phone' : 'Número Celular Principal'}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-emerald-600 dark:text-[#2ED5A4] text-[17px]">
                  smartphone
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-white dark:bg-[#0D101A] text-slate-900 dark:text-white text-xs font-mono border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-2 focus:ring-[#2ED5A4]/20 transition-all font-medium"
                  placeholder="+1 (347) 248-3668"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Used to send instant transfer alerts and 2FA authentication codes.'
                  : 'Canal seguro para confirmaciones SPEI y códigos de autenticación 2FA.'}
              </p>
            </div>
          </div>

          {/* Bento Card 3: Domicilio Fiscal */}
          <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-[#141824] border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 dark:text-[#2ED5A4] text-[18px]">home_pin</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  {isEn ? 'Registered Tax Address' : 'Domicilio Fiscal Registrado'}
                </span>
              </div>
              <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                SAT CFDI 4.0
              </span>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                {isEn ? 'Street & Number' : 'Calle y Número'}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 dark:text-slate-500 text-[17px]">
                  location_on
                </span>
                <input
                  type="text"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-white dark:bg-[#0D101A] text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-2 focus:ring-[#2ED5A4]/20 transition-all font-medium"
                  placeholder="San Antonio, Texas"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                {isEn ? 'Address Line 2 (Apt, Suite, Unit - Optional)' : 'Dirección 2 (Apto, Suite, Interior - Opcional)'}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 dark:text-slate-500 text-[17px]">
                  apartment
                </span>
                <input
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-white dark:bg-[#0D101A] text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-2 focus:ring-[#2ED5A4]/20 transition-all font-medium"
                  placeholder={isEn ? 'Apt, Suite, Unit' : 'Apto, Suite, Edificio (opcional)'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                  {isEn ? 'ZIP Code' : 'Código Postal'}
                </label>
                <input
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-white dark:bg-[#0D101A] text-slate-900 dark:text-white text-xs font-mono border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-2 focus:ring-[#2ED5A4]/20 transition-all font-medium"
                  placeholder="78201"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                  {isEn ? 'City' : 'Ciudad'}
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-white dark:bg-[#0D101A] text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-2 focus:ring-[#2ED5A4]/20 transition-all font-medium"
                  placeholder="San Antonio"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                {isEn ? 'State / Province' : 'Estado / Provincia'}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 dark:text-slate-500 text-[17px]">
                  map
                </span>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-white dark:bg-[#0D101A] text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-2 focus:ring-[#2ED5A4]/20 transition-all font-medium"
                  placeholder="Texas"
                />
              </div>
            </div>
          </div>

          {/* Pinned Action Area */}
          <div className="pt-2 pb-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#2ED5A4] to-[#18A57E] hover:opacity-95 text-slate-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>{isEn ? 'Saving Changes...' : 'Guardando Cambios...'}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>{isEn ? 'Save Legal Information' : 'Guardar Información Legal'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
