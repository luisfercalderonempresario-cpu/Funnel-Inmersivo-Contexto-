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
  variant = 'primary',
  disabled,
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-transparent border-white/20 text-white hover:bg-white hover:text-black hover:border-white',
    accent:
      'bg-orange-600 text-white hover:bg-orange-500 border-transparent shadow-[0_0_15px_rgba(234,88,12,0.35)]',
    danger:
      'bg-red-950/40 border-red-500/40 text-red-400 hover:bg-red-900/60 hover:text-white',
  };

  return (
    <button
      id={id || 'primary-cta-button'}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center gap-3 w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-full font-mono text-xs tracking-widest uppercase font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] border focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-[#050505] ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>PROCESANDO...</span>
        </span>
      ) : (
        <>
          <span>{children}</span>
          {showIcon && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
        </>
      )}
    </button>
  );
};
