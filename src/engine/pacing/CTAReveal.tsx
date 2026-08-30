// CTAReveal Component - Narrative Pacing System V1.0
import React from 'react';

interface CTARevealProps {
  isRevealed: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const CTAReveal: React.FC<CTARevealProps> = ({
  isRevealed,
  children,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      aria-hidden={!isRevealed}
      className={`w-full max-w-xs transition-all duration-700 ease-out ${
        isRevealed
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
};
