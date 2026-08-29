import React from 'react';

interface ChoiceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  selected?: boolean;
  code?: string;
  subtext?: string;
  evidenceLabel?: string;
  isAnySelected?: boolean;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  id,
  children,
  selected = false,
  code,
  subtext,
  evidenceLabel,
  disabled,
  isAnySelected = false,
  className = '',
  ...props
}) => {
  const isDimmed = isAnySelected && !selected;

  return (
    <button
      id={id}
      disabled={disabled}
      type="button"
      className={`group w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-4 sm:gap-5 focus:outline-none focus:ring-1 focus:ring-orange-500/50 ${
        selected
          ? 'bg-[#0E0E0E] border-orange-500 text-white shadow-[0_0_24px_rgba(234,88,12,0.15)] scale-[1.01]'
          : isDimmed
          ? 'bg-[#050505] border-[#121212] text-neutral-600 opacity-20 scale-[0.99] pointer-events-none'
          : 'bg-[#080808] border-[#181818] text-neutral-300 hover:bg-[#0D0D0D] hover:border-[#282828] hover:text-white'
      } ${disabled && !isDimmed ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {code && (
        <span
          className={`font-mono text-xs font-semibold w-7 h-7 shrink-0 rounded flex items-center justify-center border transition-colors ${
            selected
              ? 'bg-orange-600 text-white border-orange-500'
              : 'bg-[#121212] text-neutral-400 border-[#222222] group-hover:border-neutral-700 group-hover:text-neutral-200'
          }`}
        >
          {code}
        </span>
      )}

      <div className="flex-1 space-y-0.5">
        <div className="text-sm sm:text-base font-normal leading-relaxed tracking-normal font-body">
          {children}
        </div>
        {subtext && <p className="text-xs text-neutral-500 font-mono">{subtext}</p>}
      </div>

      {selected && (
        <span className="shrink-0 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-orange-400 uppercase bg-orange-950/50 px-2.5 py-1 rounded border border-orange-500/40 animate-fade-in shadow-[0_0_12px_rgba(234,88,12,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          {evidenceLabel ? `${evidenceLabel} REGISTRADO` : 'REGISTRADO'}
        </span>
      )}
    </button>
  );
};

