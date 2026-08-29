import React from 'react';

interface TypingIndicatorProps {
  label?: string;
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  label = 'Procesando respuesta',
  className = '',
}) => {
  return (
    <div
      id="typing-indicator"
      className={`inline-flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A] text-neutral-400 text-xs font-mono ${className}`}
      aria-label={label}
    >
      <span className="text-[10px] tracking-wider uppercase text-neutral-500">{label}</span>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
      </div>
    </div>
  );
};
