import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  FunnelState,
  ExperienceId,
  PreferencesState,
} from './types';
import {
  loadState,
  saveState,
  createInitialState,
  clearState,
  STORAGE_KEY,
} from '../memory/storage';
import { eventTracker } from '../events/eventTracker';
import { FunnelEventName } from '../events/types';
import {
  canAccessExperience,
  getNextExperienceId,
  calculateCompletionPercentage,
} from '../../experiences/registry';

interface FunnelContextValue {
  state: FunnelState;
  isLoading: boolean;
  error: string | null;
  updateState: (updater: Partial<FunnelState> | ((prev: FunnelState) => FunnelState)) => void;
  updatePreferences: (prefs: Partial<PreferencesState>) => void;
  startNewSession: () => void;
  completeExperience: (id: ExperienceId, responseData?: Record<string, unknown>) => void;
  goToExperience: (id: ExperienceId) => boolean;
  canAccess: (id: ExperienceId) => boolean;
  track: (eventName: FunnelEventName, payload?: Record<string, unknown>) => void;
  unlockAll: () => void;
  corruptLocalStorage: () => void;
  resetError: () => void;
}

const FunnelContext = createContext<FunnelContextValue | null>(null);

export const FunnelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FunnelState>(() => {
    // Initial sync load from localStorage or generate new
    const existing = loadState();
    if (existing) {
      return existing;
    }
    const fresh = createInitialState();
    saveState(fresh);
    return fresh;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Track funnel start / session resume on mount
  useEffect(() => {
    const existing = loadState();
    if (existing) {
      eventTracker.trackEvent('SESSION_RESUMED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: state.progress.currentExperience,
        payload: {
          resumedAt: new Date().toISOString(),
          completedCount: state.progress.completedExperiences.length,
        },
      });
    } else {
      eventTracker.trackEvent('FUNNEL_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: state.progress.currentExperience,
        payload: {
          trafficSource: state.acquisition.trafficSource,
          utmSource: state.acquisition.utmSource,
        },
      });
      eventTracker.trackEvent('SESSION_CREATED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: state.progress.currentExperience,
      });
    }

    // Trigger initial EXP started event
    if (state.progress.currentExperience === 'exp01') {
      eventTracker.trackEvent('EXP01_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp01',
      });
    }
  }, []);

  // Update helper
  const updateState = useCallback(
    (updater: Partial<FunnelState> | ((prev: FunnelState) => FunnelState)) => {
      setState((prev) => {
        let next: FunnelState;
        if (typeof updater === 'function') {
          next = updater(prev);
        } else {
          next = { ...prev, ...updater };
        }
        saveState(next);
        return next;
      });
    },
    []
  );

  // Preferences update
  const updatePreferences = useCallback(
    (prefs: Partial<PreferencesState>) => {
      setState((prev) => {
        const nextPreferences = { ...prev.preferences, ...prefs };
        const next: FunnelState = {
          ...prev,
          preferences: nextPreferences,
        };

        if (prefs.audioEnabled !== undefined) {
          eventTracker.trackEvent(
            prefs.audioEnabled ? 'AUDIO_ENABLED' : 'AUDIO_DISABLED',
            {
              sessionId: prev.session.sessionId,
              caseId: prev.session.caseId,
              experience: prev.progress.currentExperience,
            }
          );
        }

        saveState(next);
        return next;
      });
    },
    []
  );

  // Track helper
  const track = useCallback(
    (eventName: FunnelEventName, payload?: Record<string, unknown>) => {
      eventTracker.trackEvent(eventName, {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: state.progress.currentExperience,
        payload,
      });
    },
    [state.session.sessionId, state.session.caseId, state.progress.currentExperience]
  );

  // Access check
  const canAccess = useCallback(
    (id: ExperienceId): boolean => {
      return canAccessExperience(
        id,
        state.progress.completedExperiences,
        state.progress.currentExperience
      );
    },
    [state.progress.completedExperiences, state.progress.currentExperience]
  );

  // Complete experience
  const completeExperience = useCallback(
    (id: ExperienceId, responseData?: Record<string, unknown>) => {
      setIsLoading(true);

      setState((prev) => {
        const completed = prev.progress.completedExperiences.includes(id)
          ? prev.progress.completedExperiences
          : [...prev.progress.completedExperiences, id];

        const nextExpId = getNextExperienceId(id) || 'sales_page';
        const completionPercentage = calculateCompletionPercentage(completed);

        const nextResponses = {
          ...prev.responses,
          ...(responseData && id in prev.responses ? { [id]: { ...prev.responses[id as keyof typeof prev.responses], ...responseData } } : {}),
        };

        const next: FunnelState = {
          ...prev,
          progress: {
            ...prev.progress,
            completedExperiences: completed,
            currentExperience: nextExpId,
            completionPercentage,
          },
          responses: nextResponses,
        };

        // Track completion event
        const completionEventMap: Record<string, FunnelEventName> = {
          exp01: 'EXP01_COMPLETED',
          exp02: 'EXP02_COMPLETED',
          exp03: 'EXP03_COMPLETED',
          exp04: 'EXP04_COMPLETED',
          exp05: 'EXP05_COMPLETED',
          exp06: 'EXP06_COMPLETED',
          exp07: 'EXP07_COMPLETED',
          exp08: 'EXP08_COMPLETED',
        };

        const compEvent = completionEventMap[id];
        if (compEvent) {
          eventTracker.trackEvent(compEvent, {
            sessionId: prev.session.sessionId,
            caseId: prev.session.caseId,
            experience: id,
            payload: responseData,
          });
        }

        // Track start of next experience
        const startEventMap: Record<string, FunnelEventName> = {
          exp02: 'EXP02_STARTED',
          exp03: 'EXP03_STARTED',
          exp04: 'EXP04_STARTED',
          exp05: 'EXP05_STARTED',
          exp06: 'EXP06_STARTED',
          exp07: 'EXP07_STARTED',
          exp08: 'EXP08_STARTED',
          sales_page: 'SALES_PAGE_VIEWED',
        };

        const startEvent = startEventMap[nextExpId];
        if (startEvent) {
          eventTracker.trackEvent(startEvent, {
            sessionId: prev.session.sessionId,
            caseId: prev.session.caseId,
            experience: nextExpId,
          });
        }

        saveState(next);
        return next;
      });

      setTimeout(() => {
        setIsLoading(false);
      }, 250);
    },
    []
  );

  // Navigate to experience
  const goToExperience = useCallback(
    (id: ExperienceId): boolean => {
      const isAllowed = canAccessExperience(
        id,
        state.progress.completedExperiences,
        state.progress.currentExperience
      );

      if (!isAllowed) {
        eventTracker.trackEvent('EXPERIENCE_BLOCKED_ACCESSED', {
          sessionId: state.session.sessionId,
          caseId: state.session.caseId,
          experience: id,
          payload: { attemptId: id },
        });
        return false;
      }

      setState((prev) => {
        const next: FunnelState = {
          ...prev,
          progress: {
            ...prev.progress,
            currentExperience: id,
          },
        };
        saveState(next);
        return next;
      });

      return true;
    },
    [state.progress.completedExperiences, state.progress.currentExperience, state.session.sessionId, state.session.caseId]
  );

  // Start new session
  const startNewSession = useCallback(() => {
    clearState();
    const fresh = createInitialState(undefined, state.preferences);
    saveState(fresh);
    setState(fresh);

    eventTracker.trackEvent('SESSION_RESET', {
      sessionId: fresh.session.sessionId,
      caseId: fresh.session.caseId,
      experience: fresh.progress.currentExperience,
    });
    eventTracker.trackEvent('SESSION_CREATED', {
      sessionId: fresh.session.sessionId,
      caseId: fresh.session.caseId,
      experience: fresh.progress.currentExperience,
    });
    eventTracker.trackEvent('EXP01_STARTED', {
      sessionId: fresh.session.sessionId,
      caseId: fresh.session.caseId,
      experience: 'exp01',
    });
  }, [state.preferences]);

  // Debug tool: unlock all
  const unlockAll = useCallback(() => {
    setState((prev) => {
      const allExpIds: ExperienceId[] = [
        'exp01',
        'exp02',
        'exp03',
        'exp04',
        'exp05',
        'exp06',
        'exp07',
        'exp08',
      ];
      const next: FunnelState = {
        ...prev,
        progress: {
          ...prev.progress,
          completedExperiences: allExpIds,
          completionPercentage: 100,
        },
      };
      saveState(next);
      return next;
    });
  }, []);

  // Debug tool: corrupt local storage
  const corruptLocalStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, '{invalid_json_corrupted: true!#}');
      // Trigger a re-load to test resilient recovery
      const recovered = loadState();
      if (!recovered) {
        startNewSession();
      }
    }
  }, [startNewSession]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      state,
      isLoading,
      error,
      updateState,
      updatePreferences,
      startNewSession,
      completeExperience,
      goToExperience,
      canAccess,
      track,
      unlockAll,
      corruptLocalStorage,
      resetError,
    }),
    [
      state,
      isLoading,
      error,
      updateState,
      updatePreferences,
      startNewSession,
      completeExperience,
      goToExperience,
      canAccess,
      track,
      unlockAll,
      corruptLocalStorage,
      resetError,
    ]
  );

  return <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>;
};

export const useFunnel = (): FunnelContextValue => {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useFunnel must be used within a FunnelProvider');
  }
  return context;
};
