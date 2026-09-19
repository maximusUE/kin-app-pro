'use client';

import React from 'react';

interface KinLogoProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

/**
 * Official KIN Mobile Fintech App Logo Component
 * Extracted from official design assets in KIN_logo_app
 */
export function KinLogo({ className = '', size = 32, showGlow = true }: KinLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {showGlow && (
        <div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#2ED5A4]/30 via-[#7047EB]/20 to-[#2ED5A4]/10 blur-sm pointer-events-none"
        />
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        width={size}
        height={size}
        fill="none"
        className="relative z-10 w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="kinGradComp" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2ED5A4" />
            <stop offset="100%" stopColor="#18A57E" />
          </linearGradient>
          <linearGradient id="purpleGlowComp" x1="0" y1="120" x2="120" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7047EB" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2ED5A4" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glowComp" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect width="120" height="120" rx="30" fill="#121320" stroke="rgba(46,213,164,0.35)" strokeWidth="1.5" />
        <rect width="120" height="120" rx="30" fill="url(#purpleGlowComp)" />
        {/* K Monogram with liquidity forward arrows */}
        <path d="M38 32V88" stroke="url(#kinGradComp)" strokeWidth="8" strokeLinecap="round" filter="url(#glowComp)" />
        <path d="M78 36L46 60L78 84" stroke="url(#kinGradComp)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" filter="url(#glowComp)" />
        <circle cx="46" cy="60" r="4.5" fill="#FFFFFF" />
        <circle cx="78" cy="36" r="3.5" fill="#2ED5A4" />
        <circle cx="78" cy="84" r="3.5" fill="#2ED5A4" />
      </svg>
    </div>
  );
}

export default KinLogo;
