// Qualitative Connection Mode Card for EXP_07 (Screen 09)
import React from 'react';
import { EXP07_CONTENT } from '../exp07Content';
import { Compass } from 'lucide-react';

interface ConnectionModeCardProps {
  caseId: string;
  connectionMode?: 'UNDERSTAND' | 'OBSERVE' | 'SUPPORT';
}

export const ConnectionModeCard: React.FC<ConnectionModeCardProps> = ({
  caseId,
  connectionMode = 'UNDERSTAND',
}) => {
  return (
    <div
      id="connection-mode-card"
      className="w-full space-y-6 text-left animate-fade-in"
    >
      <div className="p-6 rounded-2xl bg-[#080808] border border-[#1E1E1E] space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#161616] pb-3">
          <div className="flex items-center space-x-2">
            <Compass className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
              {EXP07_CONTENT.screen09.eyebrow}
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            CASO #{caseId}
          </span>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
            {EXP07_CONTENT.screen09.title}
          </span>

          <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-orange-400 block">
                {EXP07_CONTENT.screen09.modeLabel}
              </span>
              <p className="text-2xl sm:text-3xl font-serif italic text-white font-semibold">
                {EXP07_CONTENT.screen09.modeValue}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
              30 SEGUNDOS AL DÍA
            </span>
          </div>

          <div className="space-y-1 pt-1 text-xs sm:text-sm text-neutral-300 font-body">
            <p>{EXP07_CONTENT.screen09.lead1}</p>
            <p className="font-serif italic text-orange-200">{EXP07_CONTENT.screen09.lead2}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#161616] space-y-3">
          <div className="p-4 rounded-xl bg-[#0C0C0C] border border-[#222] space-y-2">
            <p className="text-lg sm:text-xl font-serif italic text-orange-400 text-center">
              “{EXP07_CONTENT.screen09.directive}”
            </p>
            <div className="space-y-1 text-xs text-neutral-300 font-body text-center pt-1 border-t border-[#181818]">
              <p>{EXP07_CONTENT.screen09.explanation1}</p>
              <p className="text-neutral-400">{EXP07_CONTENT.screen09.explanation2}</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 font-mono text-center pt-1">
            {EXP07_CONTENT.screen09.note}
          </p>
        </div>
      </div>
    </div>
  );
};
