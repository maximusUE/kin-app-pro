'use client';

import React from 'react';

interface KinLogoProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

/**
 * Official KIN Mobile Fintech App Logo Component
 * 3-Tier Isometric Emerald Layers Mark as loved by Don César (Screenshot 2)
 */
export function KinLogo({ className = '', size = 36, showGlow = true }: KinLogoProps) {
  // Proportional icon size inside the rounded container (approx 55% of container size)
  const iconSize = Math.round(size * 0.55);

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 shadow-[0_4px_16px_rgba(16,185,129,0.35)] border border-emerald-400/40 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {showGlow && (
        <div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-500/30 via-teal-400/20 to-emerald-600/10 blur-sm pointer-events-none"
        />
      )}
      <svg
        className="text-white relative z-10"
        style={{ width: iconSize, height: iconSize }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}

export default KinLogo;
