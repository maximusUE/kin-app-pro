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
        isEn ? 'Personal information updated successfully!' : '¡Información personal actualizada con éxito!'
      );
      onClose();
    }, 400);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-[radial-gradient(circle_at_center,_rgba(46,213,164,0.12)_0%,_rgba(14,19,31,0.92)_55%,_rgba(6,7,11,0.98)_100%)] backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[420px] max-h-[92vh] overflow-y-auto scrollbar-none rounded-3xl bg-[#0E131F] border border-white/10 ring-1 ring-emerald-500/20 p-5 sm:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.9),_0_0_40px_rgba(46,213,164,0.08)] text-white space-y-4 my-auto">
        {/* Universal Don César Header: < | KinLogo | Badge */}
        <header className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-circle"
              title={isEn ? "Back" : "Volver"}
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <KinLogo size={34} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#2ED5A4]">
            <span className="material-symbols-outlined text-[13px]">badge</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider font-bold">
              {isEn ? 'Verified Profile' : 'Perfil Verificado'}
            </span>
          </div>
        </header>

        {/* Hero Title & Subtitle */}
        <div className="text-left pt-1">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {isEn ? 'Personal Information' : 'Información Personal'}
          </h2>
          <p className="text-xs text-[#A6ADC8] mt-0.5">
            {isEn
              ? 'Update your legal name, phone & registered tax address'
              : 'Actualiza tus datos personales y dirección fiscal registrada'}
          </p>
        </div>

        {/* Professional Form */}
        <form className="space-y-3.5 pt-1" onSubmit={handleSubmit}>
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-label-caps text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                {isEn ? 'First Name' : 'Nombre'}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#2ED5A4] text-[17px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#141824] text-white text-xs border border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4]/40 transition-all shadow-inner"
                  placeholder="César"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                {isEn ? 'Last Name' : 'Apellido'}
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#141824] text-white text-xs border border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4]/40 transition-all shadow-inner"
                placeholder="Ugalde"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-label-caps text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
              {isEn ? 'Phone Number' : 'Número Telefónico'}
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#2ED5A4] text-[17px]">
                call
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#141824] text-white text-xs font-mono border border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4]/40 transition-all shadow-inner"
                placeholder="+1 (347) 248-3668"
              />
            </div>
          </div>

          {/* Address 1 */}
          <div>
            <label className="block font-label-caps text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
              {isEn ? 'Primary Address' : 'Dirección 1'}
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#2ED5A4] text-[17px]">
                home
              </span>
              <input
                type="text"
                required
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#141824] text-white text-xs border border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4]/40 transition-all shadow-inner"
                placeholder="San Antonio, Texas"
              />
            </div>
          </div>

          {/* Address 2 */}
          <div>
            <label className="block font-label-caps text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
              {isEn ? 'Address 2 (Optional)' : 'Dirección 2 (Opcional)'}
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[17px]">
                apartment
              </span>
              <input
                type="text"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#141824] text-white text-xs border border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4]/40 transition-all shadow-inner"
                placeholder={isEn ? 'Apt, Suite, Unit' : 'Apto, Suite, Edificio (opcional)'}
              />
            </div>
          </div>

          {/* Zip & City */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-label-caps text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                {isEn ? 'ZIP Code' : 'Código Postal'}
              </label>
              <input
                type="text"
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#141824] text-white text-xs font-mono border border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4]/40 transition-all shadow-inner"
                placeholder="78201"
              />
            </div>

            <div>
              <label className="block font-label-caps text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                {isEn ? 'City' : 'Ciudad'}
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#141824] text-white text-xs border border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4]/40 transition-all shadow-inner"
                placeholder="San Antonio"
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block font-label-caps text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
              {isEn ? 'State / Province' : 'Estado'}
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#2ED5A4] text-[17px]">
                map
              </span>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#141824] text-white text-xs border border-white/10 focus:outline-none focus:border-[#2ED5A4] focus:ring-1 focus:ring-[#2ED5A4]/40 transition-all shadow-inner"
                placeholder="Texas"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-[#2ED5A4] hover:bg-[#28b88e] text-neutral-950 font-bold text-sm shadow-[0_8px_20px_rgba(46,213,164,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                  <span>{isEn ? 'Saving...' : 'Guardando...'}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>{isEn ? 'Save Changes' : 'Guardar Cambios'}</span>
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
