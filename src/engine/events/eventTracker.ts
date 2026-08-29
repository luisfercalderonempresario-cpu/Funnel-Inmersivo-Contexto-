import { FunnelEventName, FunnelEventLogEntry, EventListener } from './types';
import { ExperienceId } from '../state/types';

class EventTracker {
  private logs: FunnelEventLogEntry[] = [];
  private listeners: Set<EventListener> = new Set();
  private maxLogs = 150;

  /**
   * Tracks an event across the funnel.
   */
  public trackEvent(
    eventName: FunnelEventName,
    context: {
      sessionId: string;
      caseId: string;
      experience?: ExperienceId | 'none';
      payload?: Record<string, unknown>;
    }
  ): FunnelEventLogEntry {
    const entry: FunnelEventLogEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      eventName,
      timestamp: new Date().toISOString(),
      sessionId: context.sessionId,
      caseId: context.caseId,
      experience: context.experience || 'none',
      payload: context.payload || {},
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // In development mode, log to console for debugging
    if (typeof window !== 'undefined') {
      console.log(
        `%c[EVENT: ${eventName}] %c(${entry.experience})`,
        'color: #38BDF8; font-weight: bold;',
        'color: #94A3B8;',
        entry
      );
    }

    // Notify listeners
    this.listeners.forEach((listener) => {
      try {
        listener(entry);
      } catch (err) {
        console.error('[EventTracker] Listener error:', err);
      }
    });

    return entry;
  }

  /**
   * Retrieves current log history.
   */
  public getLogs(): FunnelEventLogEntry[] {
    return [...this.logs];
  }

  /**
   * Clears the event logs.
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Subscribes a listener to new events.
   */
  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const eventTracker = new EventTracker();
