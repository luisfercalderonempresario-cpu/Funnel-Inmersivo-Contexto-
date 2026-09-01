// Paced Sequential Analysis Component for EXP_07 (Screen 05)
import React, { useState, useEffect, useRef } from 'react';
import { EXP07_CONTENT } from '../exp07Content';
import { CheckCircle2 } from 'lucide-react';
import { PrimaryCTA } from '../../../components/ui/PrimaryCTA';

interface ContextAnalysisProps {
  onComplete: () => void;
  onStepChange?: (stepIndex: number) => void;
  autoAdvance?: boolean;
}

export const ContextAnalysis: React.FC<ContextAnalysisProps> = ({
  onComplete,
  onStepChange,
  autoAdvance = true,
}) => {
  const steps = EXP07_CONTENT.screen05.steps;
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    // Deliberate, fluid pacing: ~300ms per step across 5 steps => ~1.2s total processing
    const stepInterval = 300;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (onStepChange) {
          onStepChange(next);
        }
        if (next >= steps.length - 1) {
          clearInterval(timer);
          setIsFinished(true);
          return steps.length - 1;
        }
        return next;
      });
    }, stepInterval);

    return () => clearInterval(timer);
  }, [steps.length, onStepChange]);

  useEffect(() => {
    if (isFinished && autoAdvance && !hasCompletedRef.current) {
      // Brief 250ms completion state before smooth transition to Screen 06
      const finishTimer = setTimeout(() => {
        hasCompletedRef.current = true;
        onComplete();
      }, 250);
      return () => clearTimeout(finishTimer);
    }
  }, [isFinished, autoAdvance, onComplete]);

  return (
    <div
      id="context-analysis-container"
      className="w-full flex flex-col items-center justify-center space-y-6 py-8 max-w-md mx-auto text-left animate-fade-in"
    >
      {/* Header & Activity Pulse */}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-500 pb-2 border-b border-[#181818]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            <span>{EXP07_CONTENT.screen05.eyebrow}</span>
          </div>
          <span>
            {Math.min(currentStepIndex + 1, steps.length)} / {steps.length}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-serif italic text-white">
            {EXP07_CONTENT.screen05.headline}
          </h3>
          <p className="text-xs sm:text-sm font-body text-neutral-400">
            {EXP07_CONTENT.screen05.subheadline}
          </p>
        </div>

        {/* Cinematic Minimal Progress Line */}
        <div className="w-full h-1 bg-[#141414] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-600 via-amber-400 to-orange-400 transition-all duration-300 ease-out"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Sequential Step List */}
      <div className="w-full space-y-2.5 pt-2">
        {steps.map((step, idx) => {
          const isDone = currentStepIndex > idx;
          const isCurrent = currentStepIndex === idx;
          const isPending = currentStepIndex < idx;

          if (isPending) return null;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                isCurrent
                  ? 'bg-orange-950/20 border-orange-500/40 text-white shadow-sm'
                  : 'bg-[#080808] border-[#161616] text-neutral-400'
              }`}
            >
              <span className="font-mono text-xs sm:text-sm tracking-wider uppercase">
                {step.text}
              </span>

              {isDone && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {isCurrent && !isFinished && (
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shrink-0" />
              )}
              {isCurrent && isFinished && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full pt-1 text-center">
        <p className="text-[11px] font-mono text-neutral-500 italic">
          {EXP07_CONTENT.screen05.helper}
        </p>
      </div>

      {/* Fallback button if auto-advance is disabled */}
      {isFinished && !autoAdvance && (
        <div className="w-full pt-2 animate-fade-in">
          <PrimaryCTA id="analysis-continue-cta" onClick={onComplete}>
            {EXP07_CONTENT.screen05.ctaLabel}
          </PrimaryCTA>
        </div>
      )}
    </div>
  );
};
