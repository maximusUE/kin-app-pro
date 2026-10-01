// src/components/modals/CashPickupLocationModal.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  MEXICO_STATES,
  MexicoState,
  CashBranch,
  getBranchesForCity,
} from '@/data/mexicoLocations';
import {
  ChevronLeftIcon,
  CloseIcon,
  OxxoLogo,
  BodegaAurreraLogo,
  ElektraLogo,
  BancoppelLogo,
  FarmaciasGuadalajaraLogo,
  BansefiLogo,
  AnyAgentLogo,
} from '@/components/Icons';

export interface SelectedPickupLocation {
  state: string;
  city: string;
  branch: CashBranch;
}

export interface CashPickupLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
  currentSelection?: SelectedPickupLocation | null;
  onSelectLocation: (location: SelectedPickupLocation) => void;
}

export function CashPickupLocationModal({
  isOpen,
  onClose,
  language,
  currentSelection,
  onSelectLocation,
}: CashPickupLocationModalProps) {
  // Pasos: 'state' (1) | 'city' (2) | 'branch' (3)
  const [step, setStep] = useState<'state' | 'city' | 'branch'>(
    currentSelection ? 'branch' : 'state'
  );

  const [selectedState, setSelectedState] = useState<MexicoState | null>(() => {
    if (currentSelection?.state) {
      return (
        MEXICO_STATES.find(
          (s) => s.name.toLowerCase() === currentSelection.state.toLowerCase()
        ) || null
      );
    }
    return null;
  });

  const [selectedCity, setSelectedCity] = useState<string>(
    currentSelection?.city || ''
  );

  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const isEn = language === 'en';

  // Helper para renderizar logos de cadenas
  const renderStoreLogo = (chain: string, className = 'w-6 h-6 object-contain') => {
    switch (chain) {
      case 'oxxo':
        return <OxxoLogo className={className} />;
      case 'elektra':
        return <ElektraLogo className={className} />;
      case 'bancoppel':
        return <BancoppelLogo className={className} />;
      case 'guadalajara':
        return <FarmaciasGuadalajaraLogo className={className} />;
      case 'aurrera':
        return <BodegaAurreraLogo className={className} />;
      case 'bienestar':
        return <BansefiLogo className={className} />;
      default:
        return <AnyAgentLogo className={className} />;
    }
  };

  // Filtrado de estados
  const filteredStates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MEXICO_STATES;
    return MEXICO_STATES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.cities.some((c) => c.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Filtrado de ciudades del estado activo
  const filteredCities = useMemo(() => {
    if (!selectedState) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return selectedState.cities;
    return selectedState.cities.filter((c) => c.toLowerCase().includes(q));
  }, [selectedState, searchQuery]);

  // Sucursales generadas para la ciudad activa
  const branches = useMemo(() => {
    if (!selectedState || !selectedCity) return [];
    const list = getBranchesForCity(selectedState.name, selectedCity);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (b) =>
        b.storeName.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.chain.toLowerCase().includes(q)
    );
  }, [selectedState, selectedCity, searchQuery]);

  // Manejador: Selección de Estado
  const handleSelectState = (stateObj: MexicoState) => {
    setSelectedState(stateObj);
    setSelectedCity('');
    setSearchQuery('');
    setStep('city');
  };

  // Manejador: Selección de Ciudad
  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setSearchQuery('');
    setStep('branch');
  };

  // Manejador: Selección de Sucursal final
  const handleSelectBranch = (branch: CashBranch) => {
    if (!selectedState) return;
    onSelectLocation({
      state: selectedState.name,
      city: selectedCity,
      branch,
    });
    onClose();
  };

  // Retroceder un paso
  const handleGoBack = () => {
    setSearchQuery('');
    if (step === 'branch') {
      setStep('city');
    } else if (step === 'city') {
      setStep('state');
    } else {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cash-pickup-title"
    >
      <div
        className="modal-card space-y-3.5 max-h-[88vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de navegación y retroceso */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            {step !== 'state' ? (
              <button
                type="button"
                onClick={handleGoBack}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer transition-all border border-outline-variant/30 active:scale-[0.95]"
                title={isEn ? 'Go back' : 'Regresar'}
              >
                <ChevronLeftIcon className="w-4 h-4 text-on-surface" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
            )}

            <div>
              <h3
                id="cash-pickup-title"
                className="text-sm font-bold text-on-surface leading-tight font-title-base flex items-center gap-1.5"
              >
                <span>
                  {step === 'state' &&
                    (isEn ? 'Select State in Mexico' : '1. Selecciona Estado en México')}
                  {step === 'city' &&
                    (isEn
                      ? `Select City in ${selectedState?.name}`
                      : `2. Municipio en ${selectedState?.name}`)}
                  {step === 'branch' &&
                    (isEn
                      ? `Pickup Branch in ${selectedCity}`
                      : `3. Sucursal de Retiro en ${selectedCity}`)}
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                  {step === 'state' ? 'Paso 1/3' : step === 'city' ? 'Paso 2/3' : 'Paso 3/3'}
                </span>
              </h3>
              <p className="text-[10px] text-on-surface-variant">
                {step === 'state' &&
                  (isEn
                    ? '32 States • Over 40,000 official payout locations'
                    : '32 Estados • Más de 40,000 sucursales con retiro inmediato')}
                {step === 'city' &&
                  (isEn
                    ? 'Choose the town where your family will pick up cash'
                    : 'Elige la ciudad donde tu familiar recogerá el dinero')}
                {step === 'branch' &&
                  (isEn
                    ? 'Pick an OXXO, Elektra, BanCoppel or any store'
                    : 'Elige OXXO, Elektra, BanCoppel o retiro en cualquier tienda')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer border border-outline-variant/20 active:scale-[0.95]"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Breadcrumb visual de ruta activa */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium py-1 px-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setStep('state');
              setSearchQuery('');
            }}
            className={`cursor-pointer transition-colors ${
              step === 'state'
                ? 'text-primary font-bold underline'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            🇲🇽 México
          </button>

          {selectedState && (
            <>
              <span className="text-on-surface-variant/40">›</span>
              <button
                type="button"
                onClick={() => {
                  setStep('city');
                  setSearchQuery('');
                }}
                className={`cursor-pointer transition-colors ${
                  step === 'city'
                    ? 'text-primary font-bold underline'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {selectedState.name}
              </button>
            </>
          )}

          {selectedCity && (
            <>
              <span className="text-on-surface-variant/40">›</span>
              <span className="text-primary font-bold truncate max-w-[120px]">
                {selectedCity}
              </span>
            </>
          )}
        </div>

        {/* Buscador en tiempo real de alta velocidad */}
        <div className="relative flex-shrink-0">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              step === 'state'
                ? isEn
                  ? 'Search Mexican state (e.g. Michoacán, Jalisco...)'
                  : 'Buscar estado (ej. Michoacán, Jalisco, Puebla...)'
                : step === 'city'
                ? isEn
                  ? `Search town in ${selectedState?.name}...`
                  : `Buscar ciudad en ${selectedState?.name}...`
                : isEn
                ? 'Filter branch or store name...'
                : 'Filtrar tienda, OXXO, Elektra o dirección...'
            }
            className="w-full h-11 pl-10 pr-9 rounded-2xl bg-surface-container text-on-surface text-xs placeholder:text-on-surface-variant/50 border border-outline-variant/40 focus:border-primary focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* =================================================================== */}
        {/* PASO 1: LISTADO DE ESTADOS */}
        {/* =================================================================== */}
        {step === 'state' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {/* Chips de Acceso Rápido a Estados con Mayor Volumen de Remesas */}
            {!searchQuery && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                  {isEn ? 'Top Remittance States in Mexico' : 'Estados Más Frecuentes de Envío'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {MEXICO_STATES.filter((s) => s.isPopularRemittance)
                    .slice(0, 8)
                    .map((stateObj) => (
                      <button
                        key={stateObj.id}
                        type="button"
                        onClick={() => handleSelectState(stateObj)}
                        className="px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-primary/20 border border-outline-variant/30 hover:border-primary/50 text-xs text-on-surface font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.96]"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span>{stateObj.name}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Listado completo de los 32 Estados */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                {isEn
                  ? `All States (${filteredStates.length})`
                  : `Todos los Estados de México (${filteredStates.length})`}
              </span>

              {filteredStates.map((stateObj) => {
                const isSelected = selectedState?.id === stateObj.id;
                return (
                  <button
                    key={stateObj.id}
                    type="button"
                    onClick={() => handleSelectState(stateObj)}
                    className={`w-full min-h-[50px] px-3.5 py-2 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-primary/15 border-primary text-on-surface shadow-sm'
                        : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/20 text-on-surface'
                    } active:scale-[0.98]`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center font-financial-mono text-xs font-bold text-primary flex-shrink-0">
                        {stateObj.code}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate">
                          {stateObj.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                          {stateObj.totalLocations} • {stateObj.cities.length} ciudades clave
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {stateObj.isPopularRemittance && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                          Top
                        </span>
                      )}
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                        chevron_right
                      </span>
                    </div>
                  </button>
                );
              })}

              {filteredStates.length === 0 && (
                <div className="py-8 text-center text-on-surface-variant text-xs space-y-1">
                  <p>🔍 No se encontró ningún estado con ese nombre.</p>
                  <p className="text-[10px]">Verifica la ortografía o intenta con otra búsqueda.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PASO 2: LISTADO DE MUNICIPIOS / CIUDADES */}
        {/* =================================================================== */}
        {step === 'city' && selectedState && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-on-surface-variant block">Estado seleccionado:</span>
                <span className="text-xs font-bold text-primary">{selectedState.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep('state')}
                className="text-[10px] text-primary underline font-bold cursor-pointer"
              >
                {isEn ? 'Change State' : 'Cambiar Estado'}
              </button>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                {isEn
                  ? `Towns & Municipalities in ${selectedState.name} (${filteredCities.length})`
                  : `Municipios y Ciudades en ${selectedState.name} (${filteredCities.length})`}
              </span>

              {filteredCities.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className={`w-full min-h-[48px] px-3.5 py-2 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-primary/15 border-primary text-on-surface shadow-sm'
                        : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/20 text-on-surface'
                    } active:scale-[0.98]`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">
                        location_city
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate">{city}</p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                          Red de cobro disponible • OXXO, Elektra, Coppel
                        </p>
                      </div>
                    </div>

                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      chevron_right
                    </span>
                  </button>
                );
              })}

              {filteredCities.length === 0 && (
                <div className="py-8 text-center text-on-surface-variant text-xs space-y-1">
                  <p>🔍 No se encontró ninguna ciudad con &quot;{searchQuery}&quot;.</p>
                  <button
                    type="button"
                    onClick={() => handleSelectCity(searchQuery.trim())}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Usar &quot;{searchQuery.trim()}&quot; como destino</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PASO 3: SELECCIÓN DE SUCURSAL / RED DE COBRO EN ESA CIUDAD */}
        {/* =================================================================== */}
        {step === 'branch' && selectedState && selectedCity && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-on-surface-variant block">Destino de cobro:</span>
                <span className="text-xs font-bold text-primary">
                  {selectedCity}, {selectedState.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep('city')}
                className="text-[10px] text-primary underline font-bold cursor-pointer"
              >
                {isEn ? 'Change City' : 'Cambiar Ciudad'}
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                {isEn ? 'Available Pickup Locations' : 'Sucursales Disponibles en Esta Zona'}
              </span>

              {branches.map((b) => {
                const isSelected = currentSelection?.branch.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBranch(b)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col space-y-2 ${
                      isSelected
                        ? 'bg-primary/10 border-primary ring-1 ring-primary shadow-md'
                        : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/20'
                    } active:scale-[0.98]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-xs">
                          {renderStoreLogo(b.chain)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-on-surface truncate font-title-base">
                            {b.storeName}
                          </h4>
                          <p className="text-[10px] text-on-surface-variant truncate">
                            📍 {b.address}
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-bold whitespace-nowrap flex-shrink-0">
                        {b.badge}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-[10px] text-on-surface-variant">
                      <span className="flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[13px] text-primary">schedule</span>
                        {b.hours}
                      </span>
                      <span className="text-primary font-bold flex items-center gap-0.5">
                        <span>Elegir</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Informativo */}
        <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[10px] text-on-surface-variant flex-shrink-0">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-primary">verified_user</span>
            {isEn ? 'Red Banxico & CNBV Authorized' : 'Red Autorizada Banxico y CNBV'}
          </span>
          <span>{isEn ? 'Withdrawal with KIN PIN code' : 'Cobro con Clave PIN KIN'}</span>
        </div>
      </div>
    </div>
  );
}
