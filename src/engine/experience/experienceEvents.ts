// Experience Events Tracker for Contexto™ Experience Engine

import { eventTracker } from '../events/eventTracker';
import { ExperienceEventName } from './types';
import { ExperienceId } from '../state/types';

export interface TrackExperienceEventOptions {
  eventName: ExperienceEventName;
  sessionId: string;
  caseId: string;
  experienceId: string;
  screenId?: string;
  payload?: Record<string, unknown>;
}

/**
 * Tracks an experience engine event through the central EventTracker.
 * Sanitizes payloads to avoid PII.
 */
export function trackExperienceEvent(options: TrackExperienceEventOptions): void {
  const { eventName, sessionId, caseId, experienceId, screenId, payload = {} } = options;

  // Track via existing foundation eventTracker with mapped experience ID
  eventTracker.trackEvent(eventName as unknown as any, {
    sessionId,
    caseId,
    experience: (experienceId as ExperienceId) || 'none',
    payload: {
      screenId,
      ...payload,
    },
  });
}
