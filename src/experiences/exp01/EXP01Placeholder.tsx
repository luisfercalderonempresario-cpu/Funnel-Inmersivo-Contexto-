import React from 'react';
import { ExperienceComponentProps } from '../types';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { CaseId } from '../../components/ui/CaseId';

export const EXP01Placeholder: React.FC<ExperienceComponentProps> = ({
  caseId,
  status,
  onComplete,
}) => {
  return (
    <div id="exp01-view" className="flex flex-col items-center justify-center text-center space-y-8 w-full max-w-lg mx-auto py-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          Fase 01 &bull; Inicial
        </div>
        <p className="text-xs text-neutral-500 font-mono tracking-widest uppercase">
          EXPERIENCIA 01
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif italic font-bold text-white tracking-wide">
          La Puerta
        </h1>
        <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
          Módulo de entrada al universo de investigación para Andrés.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] w-full backdrop-blur-sm space-y-3">
        <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-[#1A1A1A] pb-2">
          <span>Identificador de Registro:</span>
          <CaseId code={caseId} />
        </div>
        <div className="flex justify-between items-center text-xs text-neutral-400">
          <span>Estado del Módulo:</span>
          <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">
            {status}
          </span>
        </div>
      </div>

      <div className="w-full pt-4">
        <PrimaryCTA
          id="exp01-continue-btn"
          onClick={() => onComplete({ doorOpened: true, timestamp: Date.now() })}
          variant="accent"
        >
          CONTINUAR INVESTIGACIÓN
        </PrimaryCTA>
      </div>
    </div>
  );
};
