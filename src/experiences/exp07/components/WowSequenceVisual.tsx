// Wow Sequence Visualizer Component for EXP_07 (Screen 11)
import React from 'react';
import { EXP07_CONTENT } from '../exp07Content';
import { ArrowDown } from 'lucide-react';

export const WowSequenceVisual: React.FC = () => {
  const steps = EXP07_CONTENT.screen11.steps;

  return (
    <div
      id="wow-sequence-visual"
      className="w-full max-w-md mx-auto py-2 flex flex-col items-center"
    >
      <div className="w-full space-y-2">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step}>
              <div
                className={`p-3 rounded-xl border text-center font-mono text-xs md:text-sm tracking-wide font-medium transition-all duration-300 ${
                  isLast
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-bold'
                    : 'bg-zinc-900/70 border-zinc-800/80 text-zinc-300'
                }`}
              >
                {step}
              </div>
              {!isLast && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-4 h-4 text-amber-400/60 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
