'use client';

import React from 'react';
import { Toaster } from 'sonner';

export function KinToaster() {
  return (
    <Toaster
      position="bottom-center"
      theme="dark"
      richColors
      closeButton
      duration={3500}
      toastOptions={{
        style: {
          background: 'rgba(19, 21, 34, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.65)',
          fontFamily: 'inherit',
          fontSize: '13px',
          fontWeight: 600,
        },
      }}
    />
  );
}
