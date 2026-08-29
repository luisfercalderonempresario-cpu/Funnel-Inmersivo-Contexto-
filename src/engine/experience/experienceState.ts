// Experience Runtime State Manager for Contexto™ Experience Engine

import {
  ExperienceRuntimeState,
  ExperienceRuntimeStatus,
  ExperienceEngineDefinition,
} from './types';

const RUNTIME_STORAGE_PREFIX = 'contexto_exp_runtime_';

/**
 * Creates initial runtime state for an experience.
 */
export function createInitialRuntimeState(
  definition: ExperienceEngineDefinition,
  initialOverrides?: Partial<ExperienceRuntimeState>
): ExperienceRuntimeState {
  const now = new Date().toISOString();

  return {
    experienceId: definition.id,
    currentScreen: definition.initialScreen,
    status: 'ACTIVE',
    localData: { ...(definition.initialState || {}) },
    localMemory: {},
    completedScreens: [],
    startedAt: now,
    lastActivityAt: now,
    error: null,
    ...initialOverrides,
  };
}

/**
 * Saves runtime state of an experience to localStorage for persistence across reloads.
 */
export function persistExperienceRuntimeState(state: ExperienceRuntimeState): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${RUNTIME_STORAGE_PREFIX}${state.experienceId}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (err) {
    console.warn(`[ExperienceState] Failed to persist runtime state for ${state.experienceId}:`, err);
  }
}

/**
 * Restores persisted runtime state for an experience.
 */
export function loadExperienceRuntimeState(
  experienceId: string
): ExperienceRuntimeState | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = `${RUNTIME_STORAGE_PREFIX}${experienceId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.experienceId === experienceId && parsed.currentScreen) {
      return parsed as ExperienceRuntimeState;
    }
    return null;
  } catch (err) {
    console.warn(`[ExperienceState] Failed to load runtime state for ${experienceId}:`, err);
    return null;
  }
}

/**
 * Clears persisted runtime state for an experience.
 */
export function clearExperienceRuntimeState(experienceId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${RUNTIME_STORAGE_PREFIX}${experienceId}`;
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[ExperienceState] Failed to clear runtime state for ${experienceId}:`, err);
  }
}

/**
 * Updates status and marks screen as completed.
 */
export function transitionScreenState(
  current: ExperienceRuntimeState,
  nextScreenId: string,
  newStatus: ExperienceRuntimeStatus = 'ACTIVE'
): ExperienceRuntimeState {
  const now = new Date().toISOString();
  const completed = current.completedScreens.includes(current.currentScreen)
    ? current.completedScreens
    : [...current.completedScreens, current.currentScreen];

  return {
    ...current,
    currentScreen: nextScreenId,
    status: newStatus,
    completedScreens: completed,
    lastActivityAt: now,
  };
}
