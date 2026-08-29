import React from 'react';
import { Check } from 'lucide-react';

interface ChoiceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  selected?: boolean;
  code?: string;
  subtext?: string;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  id,
  children,
  selected = false,
  code,
  subtext,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      id={id}
      disabled={disabled}
      type="button"
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-4 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
        selected
          ? 'bg-orange-950/20 border-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.15)]'
          : 'bg-[#0A0A0A] border-[#1A1A1A] text-neutral-300 hover:bg-[#121212] hover:border-neutral-700'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {code && (
        <span
          className={`font-mono text-xs font-semibold px-2 py-0.5 rounded border transition-colors ${
            selected
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-[#1A1A1A] text-neutral-400 border-neutral-800'
          }`}
        >
          {code}
        </span>
      )}

      <div className="flex-1 space-y-1">
        <div className="text-sm font-medium leading-snug">{children}</div>
        {subtext && <p className="text-xs text-neutral-400">{subtext}</p>}
      </div>

      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
          selected
            ? 'bg-orange-600 border-orange-600 text-white'
            : 'border-neutral-700 bg-neutral-900/50 text-transparent'
        }`}
      >
        <Check className="w-3 h-3 stroke-[3]" />
      </div>
    </button>
  );
};
