import React from 'react';

interface SecondaryCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const SecondaryCTA: React.FC<SecondaryCTAProps> = ({
  id,
  children,
  icon,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      id={id || 'secondary-cta-button'}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full font-mono text-xs tracking-wider uppercase text-neutral-300 bg-[#0A0A0A] hover:bg-[#141414] border border-[#1A1A1A] hover:border-neutral-700 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-600 ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
