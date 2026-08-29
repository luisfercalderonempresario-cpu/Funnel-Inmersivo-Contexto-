import React from 'react';

interface CaseIdProps {
  code: string;
  className?: string;
  showIcon?: boolean;
}

export const CaseId: React.FC<CaseIdProps> = ({ code, className = '', showIcon = true }) => {
  return (
    <div
      id="case-id-badge"
      className={`inline-flex flex-col items-end ${className}`}
      title="Identificador de Caso"
    >
      <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono">Case ID</span>
      <div className="inline-flex items-center gap-1.5 font-mono text-xs text-white">
        {showIcon && (
          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_6px_rgba(234,88,12,0.7)]" aria-hidden="true" />
        )}
        <span className="font-semibold tracking-wider">{code}</span>
      </div>
    </div>
  );
};
