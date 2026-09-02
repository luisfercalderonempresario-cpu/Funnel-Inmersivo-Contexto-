// Context Engine Processing Component for EXP_07 (Screen 03)
// Fast, intelligent contextual processing (~2.5 seconds total)
import React, { useState, useEffect } from 'react';
import { EXP07_CONTENT } from '../exp07Content';
import { Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

interface ContextEngineProcessingProps {
  onComplete: () => void;
  isReducedMotion?: boolean;
}

export const ContextEngineProcessing: React.FC<ContextEngineProcessingProps> = ({
  onComplete,
  isReducedMotion = false,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(10);
  const steps = EXP07_CONTENT.screen03.steps;

  useEffect(() => {
    if (isReducedMotion) {
      // Immediate completion for reduced motion
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }

    // Step timing: total ~2.6s
    const t1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgressPercent(35);
    }, 600);

    const t2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgressPercent(65);
    }, 1300);

    const t3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgressPercent(88);
    }, 2000);

    const t4 = setTimeout(() => {
      setCurrentStepIndex(4);
      setProgressPercent(100);
    }, 2500);

    const t5 = setTimeout(() => {
      onComplete();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isReducedMotion, onComplete]);

  return (
    <div
      id="context-engine-processing"
      className="w-full max-w-lg mx-auto flex flex-col items-center justify-center py-10 px-4"
    >
      {/* Central Pulsing Engine Emblem */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-zinc-900 border border-amber-500/30 shadow-2xl shadow-amber-950/40 flex items-center justify-center">
          {currentStepIndex >= 4 ? (
            <CheckCircle2 className="w-9 h-9 text-emerald-400 transition-all duration-300 scale-110" />
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
