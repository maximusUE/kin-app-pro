'use client';

import React from 'react';

export interface KinWordmarkProps {
  /** Height in pixels (width scales automatically to preserve ratio) */
  height?: number;
  /** Visual theme / fill color */
  variant?: 'emerald' | 'white' | 'current' | 'gradient-cyan';
  /** Style of the letter K: 'deconstructed' (with stem, ultra-clear) or 'radical' (pure chevron like Nokia) */
  kStyle?: 'deconstructed' | 'radical';
  /** Optional subtitle badge under or beside wordmark */
  badge?: string;
  /** Add subtle ambient glow */
  showGlow?: boolean;
  className?: string;
}

/**
 * 🏛️ KIN Bespoke Vector Wordmark
 * Inspired by the 2023 Nokia Lippincott Rebrand (as requested by Don César)
 * 
 * Recreates the iconic deconstructed, mathematical aesthetic:
 * - K: Vertical stem + detached high-precision chevron
 * - I: Monoline architectural vertical stem
 * - N: Vertical stem + downward diagonal (omitted right bar)
 * 
 * Vector-perfect SVG with zero pixelation at any scale.
 */
export function KinWordmark({
  height = 32,
  variant = 'emerald',
  kStyle = 'deconstructed',
  badge,
  showGlow = false,
  className = '',
}: KinWordmarkProps) {
  // Bounding box calculations:
  // Height = 80
  // With deconstructed K:
  // K width = 77.81
  // Kerning K-I = 28
  // I width = 11.455
  // Kerning I-N = 28
  // N width = 70.98
  // Total width ≈ 216.25
  const isDeconstructed = kStyle === 'deconstructed';
  const viewBoxWidth = isDeconstructed ? 218 : 172;
  const viewBoxHeight = 80;

  // Aspect ratio preserved width
  const calculatedWidth = Math.round((height / viewBoxHeight) * viewBoxWidth);

  // Gradient IDs unique per render
  const gradId = React.useId ? React.useId() : 'kin-nokia-grad';

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <div className="relative inline-flex items-center">
        {showGlow && (
          <div
            className={`absolute -inset-2 blur-md opacity-50 pointer-events-none rounded-full ${
              variant === 'emerald'
                ? 'bg-emerald-500/30'
                : variant === 'gradient-cyan'
                ? 'bg-cyan-500/30'
                : 'bg-white/20'
            }`}
          />
        )}

        <svg
          width={calculatedWidth}
          height={height}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 hover:scale-[1.02]"
          aria-label="KIN"
          role="img"
        >
          <defs>
            <linearGradient id={`${gradId}-emerald`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#2ED5A4" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id={`${gradId}-cyan`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#2ED5A4" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Group styling according to variant */}
          <g
            fill={
              variant === 'emerald'
                ? `url(#${gradId}-emerald)`
                : variant === 'gradient-cyan'
                ? `url(#${gradId}-cyan)`
                : variant === 'white'
                ? '#FFFFFF'
                : 'currentColor'
            }
          >
            {isDeconstructed ? (
              /* K with vertical stem + detached chevron */
              <>
                {/* K - Vertical Stem */}
                <path d="M0 2.423v74.839h11.455V2.423z" />
                {/* K - Detached Chevron */}
                <path d="M61.11 2.423L19.455 39.842l41.655 37.42h16.702l-41.718-37.42 41.718-37.419z" />
                
                {/* I - Monoline Stem */}
                <path d="M106.812 2.423v74.839h11.455V2.423z" />
                
                {/* N - Deconstructed Stem & Downward Diagonal (Missing Right Stem) */}
                <path d="M147.267 0v77.263h11.455v-51.06l59.525 53.483V63.667z" />
              </>
            ) : (
              /* K radical (only chevron like Nokia) */
              <>
                {/* K - Chevron Only */}
                <path d="M41.655 2.423L0 39.842l41.655 37.42h16.702l-41.718-37.42 41.718-37.419z" />
                
                {/* I - Monoline Stem */}
                <path d="M86.812 2.423v74.839h11.455V2.423z" />
                
                {/* N - Deconstructed Stem & Downward Diagonal */}
                <path d="M127.267 0v77.263h11.455v-51.06l59.525 53.483V63.667z" />
              </>
            )}
          </g>
        </svg>
      </div>

      {badge && (
        <span
          className="text-[9px] font-black uppercase tracking-[0.28em] text-[#2ED5A4] mt-1 pl-0.5 opacity-90"
          style={{ fontFamily: "'Syncopate', sans-serif" }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

export default KinWordmark;
