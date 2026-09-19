'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeftIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StatusCellularIcon,
  StatusWifiIcon,
  StatusBatteryIcon,
  DockAnalyticsIcon,
  SearchIcon,
  CloseIcon,
  ChevronRightIcon,
  getBankLogoUrl,
} from './Icons';

export interface ContactItem {
  id: string;
  name: string;
  fullName: string;
  avatar: string;
  role: string;
  country: string;
  bank: string;
  photoUrl: string;
}

const DEFAULT_CONTACTS: ContactItem[] = [
  { id: '1', name: 'Manuel', fullName: 'Manuel Ugalde Eligio', avatar: '👨🏻', role: 'Hermano', country: 'Mexico', bank: 'BanCoppel SPEI', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'Sophia', fullName: 'Sophia Ramos Eligio', avatar: '👩🏻', role: 'Hermana', country: 'Mexico', bank: 'BBVA Bancomer', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'David', fullName: 'David Ortiz Ramos', avatar: '👨🏽', role: 'Primo', country: 'Mexico', bank: 'Banco Azteca', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Maria', fullName: 'María Elena Ugalde', avatar: '👩🏽', role: 'Madre', country: 'Mexico', bank: 'Santander México', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: '5', name: 'Mike', fullName: 'Mike Chen González', avatar: '👨🏻', role: 'Amigo', country: 'Mexico', bank: 'Banorte', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
];

interface KinCashP2PModalProps {
  isOpen: boolean;
  onClose: () => void;
  onP2PSuccess?: (recipient: string, amountMXN: number) => void;
  contacts?: ContactItem[];
  onViewHistory?: () => void;
}

export function KinCashP2PModal({
  isOpen,
  onClose,
  onP2PSuccess,
  contacts = DEFAULT_CONTACTS,
  onViewHistory,
}: KinCashP2PModalProps) {
  const [activeStep, setActiveStep] = useState<'amount' | 'recipient' | 'note' | 'review'>('amount');
  const [recipient, setRecipient] = useState('Manuel Ugalde Eligio (Hermano)');
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(contacts[0] || DEFAULT_CONTACTS[0]);
  const [amount, setAmount] = useState('250.00');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrado reactivo de contactos en tiempo real
  const filteredContacts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.bank.toLowerCase().includes(q)
    );
  }, [contacts, searchQuery]);

  if (!isOpen) return null;

  const handleSelectContact = (contact: ContactItem) => {
    setSelectedContact(contact);
    setRecipient(`${contact.fullName} (${contact.role})`);
    setShowContactPicker(false);
    setActiveStep('amount');
  };

  const handleSendP2P = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      if (onP2PSuccess) {
        onP2PSuccess(recipient, parseFloat(amount));
      }
    }, 800);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setRecipient('Manuel Ugalde Eligio (Hermano)');
    setSelectedContact(contacts[0] || DEFAULT_CONTACTS[0]);
    setAmount('250.00');
    setNote('');
    setShowContactPicker(false);
    setSearchQuery('');
    setActiveStep('amount');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06070B] flex justify-center animate-fade-in overflow-y-auto">
      {/* Flagship Device Viewport */}
      <div className="phone-viewport w-full max-w-[400px] min-h-[100dvh] bg-[#0E0F1A] flex flex-col justify-between px-5 pt-3 pb-8 relative">
        
        {/* Signature Ambient Bicolor Glow */}
        <div className="bicolor-atmosphere-glow" />

        {/* Top Status Bar & Header */}
        <div className="space-y-1">
          {/* iOS Status Bar */}
          <div className="flex items-center justify-between text-xs text-white/90 font-semibold mb-1 pt-1 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <StatusCellularIcon className="w-3.5 h-2.5 text-white" />
              <StatusWifiIcon className="w-3.5 h-2.5 text-white" />
              <StatusBatteryIcon className="w-5 h-2.5 text-white" />
            </div>
          </div>

          {/* CABECERA IDÉNTICA A SEND MONEY: < | KIN Cash | Historial */}
          <header className="flex items-center justify-between py-1">
            <button
              type="button"
              onClick={showContactPicker ? () => setShowContactPicker(false) : handleReset}
              className="btn-circle"
              title="Volver"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>

            {/* Título y subtítulo con tag KIN Cash */}
            <div className="text-center">
              <h1 className="text-base font-black text-white tracking-wide">KIN Cash</h1>
              <span className="text-[10px] font-semibold text-[#2ED5A4] flex items-center justify-center gap-1">
                <span>P2P Instantáneo</span>
                <span>•</span>
                <span>Red KIN ⚡</span>
              </span>
            </div>

            {/* Botón Historial idéntico al de Send Money */}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onViewHistory) onViewHistory();
              }}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-xs font-bold text-[#8E91A5] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Ver historial de transacciones"
            >
              <DockAnalyticsIcon className="w-3.5 h-3.5" />
              <span>Historial</span>
            </button>
          </header>

          {/* BARRA DE CABECERA (STEPPER FLOW: Monto | Destinatario | Concepto | Confirmar) */}
          <div className="grid grid-cols-4 border-b border-white/10 text-center pb-2.5 pt-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setShowContactPicker(false);
                setActiveStep('amount');
              }}
              className={`relative pb-1 cursor-pointer transition-all ${
                activeStep === 'amount' && !showContactPicker
                  ? 'font-black text-white'
                  : 'text-white/60 hover:text-white font-medium'
              }`}
            >
              <span>Monto</span>
              {activeStep === 'amount' && !showContactPicker && (
                <div className="absolute bottom-[-11px] left-1 right-1 h-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowContactPicker(true);
                setActiveStep('recipient');
              }}
              className={`relative pb-1 cursor-pointer transition-all ${
                activeStep === 'recipient' || showContactPicker
                  ? 'font-black text-white'
                  : 'text-white/60 hover:text-white font-medium'
              }`}
            >
              <span>Destinatario</span>
              {(activeStep === 'recipient' || showContactPicker) && (
                <div className="absolute bottom-[-11px] left-1 right-1 h-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowContactPicker(false);
                setActiveStep('note');
              }}
              className={`relative pb-1 cursor-pointer transition-all ${
                activeStep === 'note' && !showContactPicker
                  ? 'font-black text-white'
                  : 'text-white/60 hover:text-white font-medium'
              }`}
            >
              <span>Concepto</span>
              {activeStep === 'note' && !showContactPicker && (
                <div className="absolute bottom-[-11px] left-1 right-1 h-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowContactPicker(false);
                setActiveStep('review');
              }}
              className={`relative pb-1 cursor-pointer transition-all ${
                activeStep === 'review' && !showContactPicker
                  ? 'font-black text-white'
                  : 'text-white/60 hover:text-white font-medium'
              }`}
            >
              <span>Confirmar</span>
              {activeStep === 'review' && !showContactPicker && (
                <div className="absolute bottom-[-11px] left-1 right-1 h-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        {isSuccess ? (
          /* PANTALLA DE ÉXITO */
          <div className="my-auto py-8 text-center space-y-4 animate-fade-in">
            <div className="w-18 h-18 mx-auto rounded-full bg-[#2ED5A4]/15 text-[#2ED5A4] flex items-center justify-center border border-[#2ED5A4]/30 shadow-lg">
              <CheckCircleIcon className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">¡Envío Exitoso!</h3>
              <p className="text-xs text-[#8E91A5] max-w-[280px] mx-auto">
                Se transfirieron <span className="text-white font-bold">${amount} MXN</span> a{' '}
                <span className="text-[#2ED5A4] font-bold">{recipient}</span> al instante mediante la red KIN Cash.
              </p>
            </div>

            <div className="p-3 bg-[#181928] border border-white/5 rounded-2xl max-w-[280px] mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between text-[#8E91A5]">
                <span>Comisión KIN Cash:</span>
                <span className="text-[#2ED5A4] font-bold">$0.00 MXN (Gratis)</span>
              </div>
              <div className="flex justify-between text-[#8E91A5]">
                <span>Tiempo de liquidación:</span>
                <span className="text-white font-bold">Inmediato (&lt; 2s)</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="w-full h-13 rounded-full bg-[#2ED5A4] text-[#0E0F1A] font-black text-sm hover:bg-[#26BC90] active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        ) : showContactPicker ? (
          /* ========================================================================= */
          /* SELECTOR DE CONTACTOS INTEGRADO CON BUSCADOR DINÁMICO                     */
          /* ========================================================================= */
          <div className="flex-1 flex flex-col justify-between py-2 animate-fade-in space-y-3">
            <div className="space-y-3">
              {/* Encabezado del buscador */}
              <div className="flex items-center justify-between px-0.5">
                <div>
                  <h3 className="text-sm font-bold text-white">Directorio de Contactos</h3>
                  <p className="text-[11px] text-[#8E91A5]">Selecciona a quién transferir KIN Cash</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowContactPicker(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8E91A5] hover:text-white transition-all cursor-pointer"
                  title="Cerrar buscador"
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Barra de Búsqueda Interactiva */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#8E91A5]">
                  <SearchIcon className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, teléfono o banco..."
                  className="w-full h-11 pl-9 pr-8 rounded-2xl bg-[#181928] border border-white/15 text-white placeholder-[#8E91A5] text-xs focus:outline-none focus:border-[#2ED5A4] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-2.5 flex items-center text-xs text-[#8E91A5] hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Carrusel Horizontal de Contactos Frecuentes */}
              {!searchQuery && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-[#8E91A5] uppercase tracking-wider block px-1">
                    Frecuentes
                  </span>
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1">
                    {contacts.slice(0, 5).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectContact(c)}
                        className="flex flex-col items-center gap-1 group flex-shrink-0 cursor-pointer"
                      >
                        <div
                          className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all shadow-md ${
                            selectedContact?.id === c.id
                              ? 'border-[#2ED5A4] scale-105'
                              : 'border-white/10 group-hover:border-white/30'
                          }`}
                        >
                          <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[11px] font-bold text-white max-w-[56px] truncate text-center">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lista Detallada de Contactos Filtrados */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar pr-0.5">
                {filteredContacts.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#181928] border border-white/5 text-center space-y-2">
                    <p className="text-xs text-[#8E91A5]">
                      No se encontraron contactos con &quot;{searchQuery}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setRecipient(searchQuery);
                        setSelectedContact(null);
                        setShowContactPicker(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#202236] border border-[#2ED5A4]/30 text-xs font-bold text-[#2ED5A4] hover:bg-[#2ED5A4] hover:text-[#0E0F1A] transition-all cursor-pointer"
                    >
                      Usar &quot;{searchQuery}&quot; como destinatario directo
                    </button>
                  </div>
                ) : (
                  filteredContacts.map((c) => {
                    const isSelected = selectedContact?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectContact(c)}
                        className={`w-full p-2.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#2ED5A4]/15 border-[#2ED5A4] shadow-sm'
                            : 'bg-[#181928] border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                              <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#2ED5A4] border-2 border-[#0E0F1A]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-tight">{c.fullName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-[#8E91A5]">{c.role} •</span>
                              {getBankLogoUrl(c.bank) && (
                                <div className="w-4 h-4 rounded bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                                  <img src={getBankLogoUrl(c.bank)!} alt={c.bank} className="w-full h-full object-contain" />
                                </div>
                              )}
                              <span className="text-[10px] text-[#2ED5A4] font-semibold">{c.bank}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-xs font-black text-[#2ED5A4]">✓</span>
                          )}
                          <ChevronRightIcon className="w-4 h-4 text-[#8E91A5]" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Botón para volver al formulario sin cambios */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowContactPicker(false)}
                className="w-full h-11 rounded-full bg-[#202236] border border-white/10 hover:border-white/20 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Volver al Formulario
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* FORMULARIO DE ENVÍO KIN CASH                                             */
          /* ========================================================================= */
          <form onSubmit={handleSendP2P} className="flex-1 flex flex-col justify-between py-2">
            <div className="space-y-3.5">
              {/* Amount Display */}
              <div className="text-center py-5 space-y-1 bg-[#181928] rounded-3xl border border-white/5 shadow-md">
                <span className="text-[11px] font-bold text-[#8E91A5] uppercase tracking-wider block">
                  Monto a Transferir
                </span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-black text-[#2ED5A4]">$</span>
                  <input
                    type="number"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-40 text-center text-4xl font-black bg-transparent text-white focus:outline-none tracking-tight"
                    required
                  />
                  <span className="text-xs font-bold text-[#8E91A5]">MXN</span>
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div className="grid grid-cols-4 gap-2">
                {['100', '250', '500', '1000'].map((chip) => {
                  const isSelected = amount === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setAmount(chip)}
                      className={`py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[#0E0F1A] shadow-md scale-105'
                          : 'bg-[#181928] text-white border border-white/10 hover:border-white/25'
                      }`}
                    >
                      ${chip}
                    </button>
                  );
                })}
              </div>

              {/* BARRA DEL DESTINATARIO (INTERACTIVA: CLIC ABRE EL BUSCADOR DE CONTACTOS) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <label className="text-xs font-bold text-white block">
                    Destinatario
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowContactPicker(true)}
                    className="text-[11px] font-bold text-[#2ED5A4] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Buscar contactos</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Tarjeta / Barra interactiva del destinatario */}
                <div
                  onClick={() => setShowContactPicker(true)}
                  className="p-3 rounded-2xl bg-[#181928] border border-white/15 hover:border-[#2ED5A4] transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                  title="Toca para seleccionar o buscar en tus contactos"
                >
                  <div className="flex items-center gap-3">
                    {selectedContact ? (
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#2ED5A4] flex-shrink-0">
                          <img src={selectedContact.photoUrl} alt={selectedContact.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#2ED5A4] border-2 border-[#181928]" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#202236] border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                        <PhoneIcon className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-black text-white group-hover:text-[#2ED5A4] transition-colors leading-tight">
                        {recipient || 'Toca para seleccionar destinatario'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {selectedContact && getBankLogoUrl(selectedContact.bank) && (
                          <div className="w-3.5 h-3.5 rounded bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                            <img src={getBankLogoUrl(selectedContact.bank)!} alt={selectedContact.bank} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <p className="text-[10px] text-[#8E91A5]">
                          {selectedContact ? `${selectedContact.bank} • Red KIN` : 'Toca para abrir agenda y buscar'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botón Contactos Blanco & Verde */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-[#202236] border border-white/10 text-[11px] font-bold text-white group-hover:border-[#2ED5A4] transition-all">
                      Contactos 👥
                    </span>
                  </div>
                </div>
              </div>

              {/* Concepto / Nota */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5 px-0.5">
                  Concepto (Opcional):
                </label>
                <div className="auth-input-group">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="ej. Apoyo familiar / Despensa"
                    className="auth-input-field text-white placeholder-[#8E91A5]"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading || !recipient || !amount}
                className={`w-full h-13 rounded-full font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  recipient && amount
                    ? 'bg-white text-[#0E0F1A] hover:bg-gray-100 shadow-[0_12px_32px_rgba(255,255,255,0.2)] cursor-pointer active:scale-95 border border-white'
                    : 'bg-[#222338] text-white/60 border border-white/10 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#0E0F1A] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-[#0E0F1A] font-black">Transferir ${amount} MXN KIN Cash</span>
                    <ArrowRightIcon className="w-4 h-4 text-[#0E0F1A] stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
