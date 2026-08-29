import React from 'react';
import { ExperienceComponentProps } from '../types';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { CaseId } from '../../components/ui/CaseId';

export const EXP03Placeholder: React.FC<ExperienceComponentProps> = ({
  caseId,
  status,
  onComplete,
}) => {
  return (
    <div id="exp03-view" className="flex flex-col items-center justify-center text-center space-y-8 w-full max-w-lg mx-auto py-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Fase 03 &bull; Desglose
        </div>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
          EXPERIENCIA 03
        </p>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-100 tracking-wide">
          EL ERROR INVISIBLE
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Identificación de la falla recurrente en el modelo operativo.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 w-full backdrop-blur-sm space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800/60 pb-2">
          <span>Identificador de Registro:</span>
          <CaseId code={caseId} />
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Estado del Módulo:</span>
          <span className="font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {status}
          </span>
        </div>
      </div>

      <div className="w-full pt-4">
        <PrimaryCTA
          id="exp03-continue-btn"
          onClick={() => onComplete({ errorIdentified: true, timestamp: Date.now() })}
        >
          CONTINUAR INVESTIGACIÓN
        </PrimaryCTA>
      </div>
    </div>
  );
};
