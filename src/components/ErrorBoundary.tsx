'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[KIN View ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-6 my-4 rounded-3xl bg-[#0B0F17] border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 animate-fade-in text-white">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
            <span className="material-symbols-outlined text-[30px]">healing</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              {this.props.fallbackTitle || 'Restaurando Vista Segura'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Se detectó una discrepancia en el estado de la pantalla. Los fondos y datos de tu cuenta están 100% protegidos.
            </p>
          </div>

          <button
            type="button"
            onClick={this.handleRetry}
            className="px-6 py-2.5 rounded-full bg-[#2ED5A4] text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-transform cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">refresh</span>
            <span>Reintentar / Cargar Pantalla</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
