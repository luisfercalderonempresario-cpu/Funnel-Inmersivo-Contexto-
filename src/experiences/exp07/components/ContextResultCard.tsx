// Context Result Card for Screen 06 & Screen 08 (Contexto™ Micro-App Feel)
import React from 'react';
import { CycleCalculationResult } from '../cycleEngine';
import { EXP07_CONTENT } from '../exp07Content';
import { Sparkles, Info, Activity } from 'lucide-react';

interface ContextResultCardProps {
  caseId: string;
  result: CycleCalculationResult;
  isApproximate?: boolean;
}

export const ContextResultCard: React.FC<ContextResultCardProps> = ({
  caseId,
  result,
  isApproximate = false,
}) => {
  const { phaseData, estimatedPhase, estimatedCycleDay } = result;

  return (
    <div
      id="context-result-card"
      className="w-full space-y-6 text-left animate-fade-in"
    >
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080808] border border-[#1E1E1E] shadow-xl relative overflow-hidden space-y-6">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-[#161616] pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
              {EXP07_CONTENT.screen06.eyebrow}
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            CASO #{caseId}
          </span>
        </div>

        {/* Phase Dominant Block */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-body text-neutral-400">
            {EXP07_CONTENT.screen06.lead}
          </p>
          <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400/90 block">
            {EXP07_CONTENT.screen06.sublabel}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white tracking-wide">
            {phaseData.name}
          </h2>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[11px] font-mono">
              {phaseData.dayRangeText}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-[11px] font-mono">
              Día ~{estimatedCycleDay} del ciclo
            </span>
            {isApproximate && (
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-amber-900/40 text-amber-400 text-[11px] font-mono">
                Referencia aproximada
              </span>
            )}
          </div>
        </div>

        {/* Human Context Points */}
        <div className="p-4 rounded-xl bg-[#0C0C0C] border border-[#181818] space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400/90 block">
            {EXP07_CONTENT.screen06.sectionTitle}
          </span>
          <div className="space-y-2 text-xs sm:text-sm text-neutral-300 font-body leading-relaxed">
            <div className="flex items-start space-x-2">
              <span className="text-orange-400 font-bold shrink-0 mt-0.5">•</span>
              <p>{EXP07_CONTENT.screen06.point1}</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-orange-400 font-bold shrink-0 mt-0.5">•</span>
              <p>{EXP07_CONTENT.screen06.point2}</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-orange-400 font-bold shrink-0 mt-0.5">•</span>
              <p>{EXP07_CONTENT.screen06.point3}</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-orange-400 font-bold shrink-0 mt-0.5">•</span>
              <p>{EXP07_CONTENT.screen06.point4}</p>
            </div>
          </div>
        </div>

        {/* Closing Axiom */}
        <div className="pt-2 border-t border-[#141414]">
          <div className="p-3 rounded-lg bg-black/40 border border-[#1C1C1C] text-center">
            <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-orange-300">
              {EXP07_CONTENT.screen06.closure}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
