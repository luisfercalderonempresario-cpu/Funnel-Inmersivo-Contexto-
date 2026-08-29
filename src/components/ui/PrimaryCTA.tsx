import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PrimaryCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showIcon?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'accent' | 'danger';
}

export const PrimaryCTA: React.FC<PrimaryCTAProps> = ({
  id,
  children,
  showIcon = true,
  isLoading = false,
  variant = 'accent',
  disabled,
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-[#0F0F0F] border-[#2A2A2A] text-white hover:border-neutral-500 hover:bg-[#171717]',
    accent:
      'bg-orange-600/90 text-white border-orange-500/40 hover:bg-orange-600 hover:border-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.2)]',
    danger:
      'bg-red-950/30 border-red-500/30 text-red-400 hover:bg-red-900/50 hover:text-white',
  };

  return (
    <button
      id={id || 'primary-cta-button'}
      disabled={disabled || isLoading}
      className={`group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-full font-mono text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] border focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:ring-offset-2 focus:ring-offset-[#050505] ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="tracking-widest">PROCESANDO...</span>
        </span>
      ) : (
        <>
          <span>{children}</span>
          {showIcon && (
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
        </>
      )}
    </button>
  );
};

