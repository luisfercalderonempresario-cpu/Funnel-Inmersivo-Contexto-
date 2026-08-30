// NarrativePause Component - Narrative Pacing System V1.0
import React from 'react';

interface NarrativePauseProps {
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const NarrativePause: React.FC<NarrativePauseProps> = ({
  active = true,
  className = '',
  children,
}) => {
  if (!active) return null;

  return (
    <div
      data-narrative-pause="true"
      className={`min-h-[1.5rem] flex items-center justify-center transition-opacity duration-1000 ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {children}
    </div>
  );
};
