import React, { useState } from 'react';
import { CarFront } from 'lucide-react';

interface AurexImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

export const AurexImage: React.FC<AurexImageProps> = ({ src, alt, className = '', eager = false }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container-lowest text-outline ${className}`}
        role="img"
        aria-label={alt}
      >
        <CarFront className="w-8 h-8 text-primary/40 mb-1.5" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-outline/80 px-2 text-center">
          Aurex Atelier
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
    />
  );
};
