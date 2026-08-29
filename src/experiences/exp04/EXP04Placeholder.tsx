import React from 'react';
import { ExperienceComponentProps } from '../types';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { CaseId } from '../../components/ui/CaseId';

export const EXP04Placeholder: React.FC<ExperienceComponentProps> = ({
  caseId,
  status,
  onComplete,
}) => {
  return (
    <div id="exp04-view" className="flex flex-col items-center justify-center text-center space-y-8 w-full max-w-lg mx-auto py-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-xs font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Fase 04 &bull; Análisis
        </div>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
          EXPERIENCIA 04
        </p>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-100 tracking-wide">
          LA INVESTIGACIÓN
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Recopilación de variables críticas y evidencia de fricción contextual.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 w-full backdrop-blur-sm space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800/60 pb-2">
          <span>Identificador de Registro:</span>
          <CaseId code={caseId} />
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Estado del Módulo:</span>
          <span className="font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            {status}
          </span>
        </div>
      </div>

      <div className="w-full pt-4">
        <PrimaryCTA
          id="exp04-continue-btn"
          onClick={() => onComplete({ investigationConcluded: true, timestamp: Date.now() })}
        >
          CONTINUAR INVESTIGACIÓN
        </PrimaryCTA>
      </div>
    </div>
  );
};
