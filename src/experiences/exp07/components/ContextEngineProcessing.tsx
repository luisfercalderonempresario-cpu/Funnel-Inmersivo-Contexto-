// Context Engine Processing Component for EXP_07 (Screen 03)
// Fast, autonomous, resilient contextual processing with hard 10s fallback
import React, { useState, useEffect, useRef } from 'react';
import { EXP07_CONTENT } from '../exp07Content';
import { Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

interface ContextEngineProcessingProps {
  onComplete: () => void;
  isReducedMotion?: boolean;
}

const MAX_PROCESSING_TIME = 10000; // 10s maximum absolute limit

export const ContextEngineProcessing: React.FC<ContextEngineProcessingProps> = ({
  onComplete,
  isReducedMotion = false,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(12);
  const steps = EXP07_CONTENT.screen03.steps;

  // Stable ref for onComplete to prevent re-renders from resetting the timer sequence
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Idempotency guard ref
  const hasCompletedRef = useRef<boolean>(false);
  const activeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Reset state for new mount
    hasCompletedRef.current = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    activeTimersRef.current = timers;

    console.log('[EXP07] Processing started');
    console.log('[EXP07] Context calculation started');
    console.log('[EXP07] Context calculation completed');

    const executeComplete = (source: 'NORMAL' | 'TIMEOUT_FALLBACK') => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;

      // Clear all active timers
      timers.forEach((t) => clearTimeout(t));

      if (source === 'TIMEOUT_FALLBACK') {
        console.warn('[EXP07] Processing timeout reached');
        console.warn('[EXP07] Applying fallback completion');
      } else {
        console.log('[EXP07] Processing animation completed');
      }

      console.log('[EXP07] Transitioning to SCREEN 04');
      onCompleteRef.current?.();
    };

    // Hard safety timeout fallback (10 seconds absolute maximum)
    const safetyTimeout = setTimeout(() => {
      executeComplete('TIMEOUT_FALLBACK');
    }, MAX_PROCESSING_TIME);
    timers.push(safetyTimeout);

    // Reduced motion fast-track
    if (isReducedMotion) {
      setCurrentStepIndex(4);
      setProgressPercent(100);
      const reducedTimer = setTimeout(() => {
        executeComplete('NORMAL');
      }, 600);
      timers.push(reducedTimer);
      return () => {
        timers.forEach((t) => clearTimeout(t));
      };
    }

    // Step Timing Sequence:
    // 0.0s: Step 0: ANALIZANDO CASO... (12%)
    // 0.8s: Step 1: Identificando referencia... (38%)
    // 1.7s: Step 2: Estimando momento del ciclo... (68%)
    // 2.6s: Step 3: Preparando contexto de hoy... (90%)
    // 3.5s: Step 4: LISTO. (100%)
    // 4.2s: Auto transition to SCREEN 04

    const t1 = setTimeout(() => {
      if (!hasCompletedRef.current) {
        setCurrentStepIndex(1);
        setProgressPercent(38);
      }
    }, 800);
    timers.push(t1);

    const t2 = setTimeout(() => {
      if (!hasCompletedRef.current) {
        setCurrentStepIndex(2);
        setProgressPercent(68);
      }
    }, 1700);
    timers.push(t2);

    const t3 = setTimeout(() => {
      if (!hasCompletedRef.current) {
        setCurrentStepIndex(3);
        setProgressPercent(90);
      }
    }, 2600);
    timers.push(t3);

    const t4 = setTimeout(() => {
      if (!hasCompletedRef.current) {
        setCurrentStepIndex(4);
        setProgressPercent(100);
      }
    }, 3500);
    timers.push(t4);

    const t5 = setTimeout(() => {
      executeComplete('NORMAL');
    }, 4200);
    timers.push(t5);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isReducedMotion]);

  return (
    <div
      id="context-engine-processing"
      className="w-full max-w-lg mx-auto flex flex-col items-center justify-center py-10 px-4 select-none"
    >
      {/* Central Pulsing Engine Emblem */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-zinc-900 border border-amber-500/30 shadow-2xl shadow-amber-950/40 flex items-center justify-center">
          {currentStepIndex >= 4 ? (
            <CheckCircle2 className="w-9 h-9 text-emerald-400 transition-all duration-300 scale-110 animate-bounce" />
          ) : (
            <Cpu className="w-9 h-9 text-amber-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400/90 font-medium">
          {EXP07_CONTENT.screen03.eyebrow}
        </span>
      </div>

      {/* Current Step Label */}
      <div className="h-10 flex items-center justify-center text-center mb-6">
        <h3
          key={currentStepIndex}
          className="text-lg md:text-xl font-medium tracking-tight text-zinc-100 animate-fadeIn"
        >
          {steps[currentStepIndex]?.text || steps[0].text}
        </h3>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm bg-zinc-900/90 border border-zinc-800 rounded-full h-2 p-0.5 mb-8 shadow-inner overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(245,158,11,0.5)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Subtle Step Log */}
      <div className="w-full max-w-sm space-y-2">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center justify-between text-xs px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                isCurrent
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : isDone
                  ? 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400'
                  : 'bg-transparent border-transparent text-zinc-600'
              }`}
            >
              <span className="font-mono">{step.text}</span>
              <span className="font-mono text-[10px]">
                {isDone ? '✓' : isCurrent ? '···' : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
