// Daily Action & Micro-Gestures Card for EXP_07 (Screen 10)
import React from 'react';
import { EXP07_CONTENT } from '../exp07Content';
import { Lightbulb, MessageSquare, ShieldAlert, CheckCircle } from 'lucide-react';
import { CyclePhase, PHASE_METADATA } from '../cycleEngine';

interface DailyActionCardProps {
  caseId: string;
  phase?: CyclePhase;
}

export const DailyActionCard: React.FC<DailyActionCardProps> = ({
  caseId,
  phase = 'LUTEAL',
}) => {
  const phaseData = PHASE_METADATA[phase] || PHASE_METADATA.LUTEAL;

  return (
    <div
      id="daily-action-card"
      className="w-full space-y-4 text-left animate-fade-in"
    >
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-500 pb-1 border-b border-[#161616]">
        <span>{EXP07_CONTENT.screen10.eyebrow}</span>
        <span>CASO #{caseId}</span>
      </div>

      {/* Idea block */}
      <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-1.5">
        <div className="flex items-center space-x-2 text-xs font-mono text-orange-400 uppercase tracking-wider">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{EXP07_CONTENT.screen10.ideaTitle}</span>
        </div>
        <p className="text-sm sm:text-base font-serif italic text-white leading-relaxed">
          {phaseData.dailyActionIdea || EXP07_CONTENT.screen10.ideaBody}
        </p>
      </div>

      {/* Micro-gesture block */}
      <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
          <span>{EXP07_CONTENT.screen10.microgestureTitle}</span>
        </div>
        <p className="text-base sm:text-lg font-serif italic text-orange-300">
          “{phaseData.microGesture || EXP07_CONTENT.screen10.microgestureBody}”
        </p>
        <div className="pt-2 border-t border-[#141414] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400">
          <div className="flex items-center space-x-1.5">
            <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{EXP07_CONTENT.screen10.guidance1}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{EXP07_CONTENT.screen10.guidance2}</span>
          </div>
        </div>
      </div>

      {/* What to avoid block */}
      <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-900/20 space-y-1">
        <div className="flex items-center space-x-2 text-xs font-mono text-rose-400 uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{EXP07_CONTENT.screen10.avoidTitle}</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-300 font-body leading-relaxed">
          {phaseData.whatToAvoid || EXP07_CONTENT.screen10.avoidBody}
        </p>
      </div>
    </div>
  );
};
