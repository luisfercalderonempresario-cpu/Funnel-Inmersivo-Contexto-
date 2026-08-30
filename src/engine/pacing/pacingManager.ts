// Narrative Pacing Manager - State & Debug Hub
import {
  PacingMode,
  NarrativePacingDebugState,
  NORMAL_PACING_DURATIONS,
  FAST_PACING_DURATIONS,
  REDUCED_MOTION_PACING_DURATIONS,
} from './types';

class NarrativePacingManager {
  private fastMode: boolean = false;
  private listeners: Set<() => void> = new Set();
  private debugState: NarrativePacingDebugState = {
    experienceId: 'exp01',
    screenId: 'initial',
    currentStage: 1,
    totalStages: 1,
    currentPacing: 'MEDIUM',
    isPaused: false,
    isCTABlocked: true,
    isCTAAvailable: false,
    isOptionsAvailable: false,
    elapsedTimeMs: 0,
    isFastMode: false,
    reducedMotion: false,
  };

  constructor() {
    // Check local storage for debug flag
    try {
      const saved = localStorage.getItem('contexto_debug_fast_pacing');
      if (saved === 'true') {
        this.fastMode = true;
        this.debugState.isFastMode = true;
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }

  public isFastMode(): boolean {
    return this.fastMode;
  }

  public setFastMode(enabled: boolean): void {
    this.fastMode = enabled;
    this.debugState.isFastMode = enabled;
    try {
      localStorage.setItem('contexto_debug_fast_pacing', enabled ? 'true' : 'false');
    } catch {
      // Ignore
    }
    this.notify();
  }

  public toggleFastMode(): boolean {
    this.setFastMode(!this.fastMode);
    return this.fastMode;
  }

  public updateDebugState(partial: Partial<NarrativePacingDebugState>): void {
    this.debugState = {
      ...this.debugState,
      ...partial,
      isFastMode: this.fastMode,
    };
    this.notify();
  }

  public getDebugState(): NarrativePacingDebugState {
    return this.debugState;
  }

  public calculateDuration(
    mode: PacingMode,
    customDurationMs?: number,
    reducedMotion: boolean = false
  ): number {
    if (mode === 'MANUAL') return 0;
    if (this.fastMode) {
      return customDurationMs ? Math.min(customDurationMs / 4, 1000) : FAST_PACING_DURATIONS[mode];
    }
    if (reducedMotion) {
      return customDurationMs ? Math.min(customDurationMs / 2, 2000) : REDUCED_MOTION_PACING_DURATIONS[mode];
    }
    return customDurationMs ?? NORMAL_PACING_DURATIONS[mode];
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Error in pacing listener:', err);
      }
    });
  }
}

export const narrativePacingManager = new NarrativePacingManager();
