'use client';

import React, { useState } from 'react';

export interface ContactAvatarProps {
  photoUrl?: string | null;
  name?: string;
  className?: string;
  iconSize?: string;
  alt?: string;
}

/**
 * ContactAvatar - Componente maestro para avatares de contactos y beneficiarios KIN.
 * - Si el contacto cuenta con foto de perfil (de su celular o imagen asignada), se despliega con nitidez.
 * - Si NO cuenta con foto, se despliega una silueta de usuario moderna, limpia y ergonómica
 *   (sin emojis ni fotos aleatorias de personas desconocidas), siguiendo Apple HIG y Google Material 3.
 */
export function ContactAvatar({
  photoUrl,
  name = 'Contacto',
  className = 'w-10 h-10',
  iconSize = 'text-[22px]',
  alt,
}: ContactAvatarProps) {
  const [imgError, setImgError] = useState(false);

  // Considerar foto válida sólo si es una URL válida y no es una foto de stock ficticia (Unsplash) ni ha fallado
  const isStockPhoto = Boolean(
    photoUrl && typeof photoUrl === 'string' && photoUrl.includes('images.unsplash.com')
  );

  const hasValidPhoto = Boolean(
    photoUrl &&
    typeof photoUrl === 'string' &&
    photoUrl.trim().length > 0 &&
    !isStockPhoto &&
    (photoUrl.startsWith('http://') ||
      photoUrl.startsWith('https://') ||
      photoUrl.startsWith('data:image/') ||
      photoUrl.startsWith('blob:') ||
      photoUrl.startsWith('/')) &&
    !imgError
  );

  if (hasValidPhoto) {
    return (
      <div className={`relative rounded-full overflow-hidden flex-shrink-0 bg-surface-container-high ${className}`}>
        <img
          src={photoUrl!}
          alt={alt || name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Silueta de usuario sin foto (Sleek, native Apple HIG & Material 3 silhouette)
  return (
    <div
      className={`relative rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-surface-container-high to-surface-container-highest border border-white/10 flex items-center justify-center text-on-surface-variant shadow-inner ${className}`}
      title={name}
      aria-label={name}
    >
      <span
        className={`material-symbols-outlined text-outline group-hover:text-primary transition-colors select-none ${iconSize}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        person
      </span>
    </div>
  );
}
