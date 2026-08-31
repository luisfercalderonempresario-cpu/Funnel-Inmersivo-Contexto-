// Paced Sequential Analysis Component for EXP_07 (Screen 05)
import React, { useState, useEffect, useRef } from 'react';
import { EXP07_CONTENT } from '../exp07Content';
import { CheckCircle2, Loader2 } from 'lucide-react';
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
    // Deliberate pacing between steps (1200ms per step)
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
    }, 1200);

    return () => clearInterval(timer);
  }, [steps.length, onStepChange]);

  useEffect(() => {
    if (isFinished && autoAdvance && !hasCompletedRef.current) {
      const finishTimer = setTimeout(() => {
        hasCompletedRef.current = true;
        onComplete();
      }, 1000);
      return () => clearTimeout(finishTimer);
    }
  }, [isFinished, autoAdvance, onComplete]);

  return (
    <div
      id="context-analysis-container"
      className="w-full flex flex-col items-center justify-center space-y-8 py-10 max-w-md mx-auto text-left"
    >
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-500 pb-2 border-b border-[#181818]">
          <span>{EXP07_CONTENT.screen05.eyebrow}</span>
          <span>
            {Math.min(currentStepIndex + 1, steps.length)} / {steps.length}
          </span>
        </div>

        {/* Progress Line */}
        <div className="w-full h-1 bg-[#141414] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-700 ease-out"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Sequential Step List */}
      <div className="w-full space-y-3.5 pt-4">
        {steps.map((step, idx) => {
          const isDone = currentStepIndex > idx;
          const isCurrent = currentStepIndex === idx;
          const isPending = currentStepIndex < idx;

          if (isPending) return null;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-500 ${
                isCurrent
                  ? 'bg-orange-950/10 border-orange-500/30 text-white shadow-sm'
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
                <Loader2 className="w-4 h-4 text-orange-400 animate-spin shrink-0" />
              )}
              {isCurrent && isFinished && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Fallback button if auto-advance is disabled */}
      {isFinished && !autoAdvance && (
        <div className="w-full pt-4 animate-fade-in">
          <PrimaryCTA id="analysis-continue-cta" onClick={onComplete}>
            {EXP07_CONTENT.screen05.ctaLabel}
          </PrimaryCTA>
        </div>
      )}
    </div>
  );
};
