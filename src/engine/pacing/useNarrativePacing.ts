// useNarrativePacing Hook - Narrative Pacing System V1.0
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PacingMode, NarrativeBeat } from './types';
import { narrativePacingManager } from './pacingManager';

export interface UseNarrativePacingOptions {
  experienceId: string;
  screenId: string;
  beats: NarrativeBeat[];
  onBeatEnter?: (beat: NarrativeBeat) => void;
  onAllStagesRevealed?: () => void;
}

export interface UseNarrativePacingReturn {
  stage: number;
  isStageVisible: (stageNumber: number) => boolean;
  isCTARevealed: boolean;
  isOptionsRevealed: boolean;
  isPaused: boolean;
  currentBeat: NarrativeBeat | undefined;
  currentPacing: PacingMode;
  elapsedTimeMs: number;
  advanceStage: () => void;
  fastForward: () => void;
  reset: () => void;
  reducedMotion: boolean;
  isFastMode: boolean;
}

export function useNarrativePacing({
  experienceId,
  screenId,
  beats,
  onBeatEnter,
  onAllStagesRevealed,
}: UseNarrativePacingOptions): UseNarrativePacingReturn {
  const [stage, setStage] = useState<number>(1);
  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [isFastMode, setIsFastMode] = useState<boolean>(() => narrativePacingManager.isFastMode());

  const totalStages = useMemo(() => {
    if (!beats || beats.length === 0) return 1;
    return Math.max(...beats.map((b) => b.stage));
  }, [beats]);

  // Subscribe to prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Subscribe to fastMode debug changes
  useEffect(() => {
    return narrativePacingManager.subscribe(() => {
      setIsFastMode(narrativePacingManager.isFastMode());
    });
  }, []);

  const currentBeat = useMemo(() => {
    return beats.find((b) => b.stage === stage);
  }, [beats, stage]);

  const currentPacing: PacingMode = currentBeat?.pacing || 'MEDIUM';
  const isPaused = currentBeat?.isPause === true;

  const isCTARevealed = useMemo(() => {
    const ctaBeat = beats.find((b) => b.isCTA === true);
    if (!ctaBeat) {
      // If no explicit CTA beat, CTA is revealed on last stage
      return stage >= totalStages;
    }
    return stage >= ctaBeat.stage;
  }, [beats, stage, totalStages]);

  const isOptionsRevealed = useMemo(() => {
    const optionsBeat = beats.find((b) => b.isOptions === true);
    if (!optionsBeat) {
      return stage >= 2;
    }
    return stage >= optionsBeat.stage;
  }, [beats, stage]);

  // Track elapsed time ticker for fine debug HUD inspection
  const startTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    startTimeRef.current = Date.now();
    setElapsedTimeMs(0);
    const interval = setInterval(() => {
      setElapsedTimeMs(Date.now() - startTimeRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [stage, screenId]);

  // Notify beat enter
  useEffect(() => {
    if (currentBeat && onBeatEnter) {
      onBeatEnter(currentBeat);
    }
  }, [currentBeat, onBeatEnter]);

  // Update central debug manager
  useEffect(() => {
    narrativePacingManager.updateDebugState({
      experienceId,
      screenId,
      currentStage: stage,
      totalStages,
      currentBeatId: currentBeat?.id,
      currentBeatLabel: currentBeat?.label || currentBeat?.id,
      currentPacing,
      isPaused,
      isCTABlocked: !isCTARevealed,
      isCTAAvailable: isCTARevealed,
      isOptionsAvailable: isOptionsRevealed,
      elapsedTimeMs,
      reducedMotion,
    });
  }, [
    experienceId,
    screenId,
    stage,
    totalStages,
    currentBeat,
    currentPacing,
    isPaused,
    isCTARevealed,
    isOptionsRevealed,
    elapsedTimeMs,
    reducedMotion,
  ]);

  // Progressive timer chain
  useEffect(() => {
    // Reset stage when screen changes
    setStage(1);
  }, [screenId]);

  useEffect(() => {
    if (!currentBeat) return;

    // Check if beat auto-advances
    const shouldAutoAdvance =
      currentBeat.autoAdvance !== false &&
      currentBeat.pacing !== 'MANUAL' &&
      stage < totalStages;

    if (!shouldAutoAdvance) {
      if (stage >= totalStages && onAllStagesRevealed) {
        onAllStagesRevealed();
      }
      return;
    }

    const duration = narrativePacingManager.calculateDuration(
      currentBeat.pacing,
      currentBeat.durationMs,
      reducedMotion
    );

    const timer = setTimeout(() => {
      setStage((prev) => {
        const next = prev + 1;
        return next <= totalStages ? next : prev;
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [stage, currentBeat, totalStages, reducedMotion, isFastMode, onAllStagesRevealed]);

  const advanceStage = useCallback(() => {
    setStage((prev) => (prev < totalStages ? prev + 1 : prev));
  }, [totalStages]);

  const fastForward = useCallback(() => {
    setStage(totalStages);
  }, [totalStages]);

  const reset = useCallback(() => {
    setStage(1);
  }, []);

  const isStageVisible = useCallback(
    (stageNumber: number) => stage >= stageNumber,
    [stage]
  );

  return {
    stage,
    isStageVisible,
    isCTARevealed,
    isOptionsRevealed,
    isPaused,
    currentBeat,
    currentPacing,
    elapsedTimeMs,
    advanceStage,
    fastForward,
    reset,
    reducedMotion,
    isFastMode,
  };
}
