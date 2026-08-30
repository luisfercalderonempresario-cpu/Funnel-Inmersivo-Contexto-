// Narrative Pacing System V1.0 - Types Definition

export type PacingMode =
  | 'INSTANT'
  | 'SHORT'
  | 'MEDIUM'
  | 'LONG'
  | 'REVELATION'
  | 'MANUAL';

export interface PacingDurations {
  INSTANT: number;
  SHORT: number;
  MEDIUM: number;
  LONG: number;
  REVELATION: number;
  MANUAL: number;
}

export const NORMAL_PACING_DURATIONS: PacingDurations = {
  INSTANT: 600,     // 300–800 ms
  SHORT: 1600,      // 1.2–2.0 s
  MEDIUM: 3200,     // 2.5–4.0 s
  LONG: 4800,       // 4.0–6.0 s
  REVELATION: 6500, // 5.0–8.0 s
  MANUAL: 0,        // Never auto-advances
};

export const FAST_PACING_DURATIONS: PacingDurations = {
  INSTANT: 150,
  SHORT: 400,
  MEDIUM: 700,
  LONG: 1000,
  REVELATION: 1300,
  MANUAL: 0,
};

export const REDUCED_MOTION_PACING_DURATIONS: PacingDurations = {
  INSTANT: 200,
  SHORT: 600,
  MEDIUM: 1200,
  LONG: 1800,
  REVELATION: 2200,
  MANUAL: 0,
};

export interface NarrativeBeat<T = unknown> {
  id: string;
  stage: number;
  pacing: PacingMode;
  durationMs?: number;
  requiresInteraction?: boolean;
  autoAdvance?: boolean;
  content?: T;
  label?: string;
  isCTA?: boolean;
  isOptions?: boolean;
  isPause?: boolean;
  eventOnEnter?: string;
}

export interface NarrativePacingDebugState {
  experienceId: string;
  screenId: string;
  currentStage: number;
  totalStages: number;
  currentBeatId?: string;
  currentBeatLabel?: string;
  currentPacing: PacingMode;
  isPaused: boolean;
  isCTABlocked: boolean;
  isCTAAvailable: boolean;
  isOptionsAvailable: boolean;
  elapsedTimeMs: number;
  isFastMode: boolean;
  reducedMotion: boolean;
}
