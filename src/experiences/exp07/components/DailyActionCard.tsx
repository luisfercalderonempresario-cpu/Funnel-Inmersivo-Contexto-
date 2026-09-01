// Daily Action & Micro-Gestures Card for EXP_07 (Screen 11)
import React from 'react';
import { EXP07_CONTENT } from '../exp07Content';
import { Lightbulb, MessageSquare, ShieldAlert, Compass } from 'lucide-react';
import { CyclePhase, PHASE_METADATA } from '../cycleEngine';

interface DailyActionCardProps {
  caseId: string;
  phase?: CyclePhase;
}

export const DailyActionCard: React.FC<DailyActionCardProps> = ({
  caseId,
  phase = 'FOLLICULAR',
}) => {
  const phaseData = PHASE_METADATA[phase] || PHASE_METADATA.FOLLICULAR;

  return (
    <div
      id="daily-action-card"
      className="w-full space-y-4 text-left animate-fade-in"
    >
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-500 pb-1 border-b border-[#161616]">
        <div className="flex items-center space-x-2">
          <Compass className="w-3.5 h-3.5 text-orange-400" />
          <span>{EXP07_CONTENT.screen11.eyebrow}</span>
        </div>
        <span>CASO #{caseId}</span>
      </div>

      {/* Mode qualitative banner */}
      <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-orange-400 block">
            {EXP07_CONTENT.screen11.modeLabel}
          </span>
          <p className="text-xl sm:text-2xl font-serif italic text-white font-semibold">
            {EXP07_CONTENT.screen11.modeValue}
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
          30 SEGUNDOS AL DÍA
        </span>
      </div>

      {/* Idea block */}
      <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-1.5">
        <div className="flex items-center space-x-2 text-xs font-mono text-orange-400 uppercase tracking-wider">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{EXP07_CONTENT.screen11.ideaTitle}</span>
        </div>
        <p className="text-sm sm:text-base font-serif italic text-white leading-relaxed">
          {EXP07_CONTENT.screen11.ideaBody}
        </p>
      </div>

      {/* Micro-gesture block */}
      <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
          <span>{EXP07_CONTENT.screen11.microgestureTitle}</span>
        </div>
        <p className="text-base sm:text-lg font-serif italic text-orange-300">
          {EXP07_CONTENT.screen11.microgestureBody}
        </p>
      </div>

      {/* What to avoid block */}
      <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-900/20 space-y-1">
        <div className="flex items-center space-x-2 text-xs font-mono text-rose-400 uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{EXP07_CONTENT.screen11.avoidTitle}</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-300 font-body leading-relaxed">
          {EXP07_CONTENT.screen11.avoidBody}
        </p>
      </div>

      <div className="text-center pt-1">
        <p className="text-xs text-neutral-500 font-mono italic">
          {EXP07_CONTENT.screen11.note}
        </p>
      </div>
    </div>
  );
};
