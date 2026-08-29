// Memory Engine for Contexto™ Experience Engine

import { MemoryScope, MemoryUpdate } from './types';
import { FunnelState } from '../state/types';

export interface MemoryStoreOptions {
  experienceId: string;
  initialLocalMemory?: Record<string, unknown>;
  onPersistGlobal?: (key: string, value: unknown) => void;
  onSaveResponse?: (experienceId: string, questionId: string, value: unknown) => void;
  onAddInsight?: (insight: { id: string; type: string; value: unknown; sourceExperience: string }) => void;
}

export class ExperienceMemoryManager {
  private experienceId: string;
  private localMemory: Record<string, unknown> = {};
  private onPersistGlobal?: (key: string, value: unknown) => void;
  private onSaveResponse?: (experienceId: string, questionId: string, value: unknown) => void;
  private onAddInsight?: (insight: { id: string; type: string; value: unknown; sourceExperience: string }) => void;

  constructor(options: MemoryStoreOptions) {
    this.experienceId = options.experienceId;
    this.localMemory = { ...(options.initialLocalMemory || {}) };
    this.onPersistGlobal = options.onPersistGlobal;
    this.onSaveResponse = options.onSaveResponse;
    this.onAddInsight = options.onAddInsight;
  }

  /**
   * Sets a memory item with deliberate scope (local vs global).
   */
  public setMemory(key: string, value: unknown, scope: MemoryScope = 'local'): void {
    if (!key) return;

    if (scope === 'local') {
      this.localMemory[key] = value;
    } else {
      // Global scope is also stored locally for immediate reference
      this.localMemory[key] = value;
      if (this.onPersistGlobal) {
        this.onPersistGlobal(key, value);
      }
    }
  }

  /**
   * Retrieves a memory item from local memory or global funnel state.
   */
  public getMemory<T = unknown>(key: string, funnelState?: FunnelState): T | undefined {
    if (key in this.localMemory) {
      return this.localMemory[key] as T;
    }

    if (funnelState) {
      // Check responses for this experience
      const expResponses = funnelState.responses[
        this.experienceId as keyof typeof funnelState.responses
      ] as Record<string, unknown> | undefined;

      if (expResponses && key in expResponses) {
        return expResponses[key] as T;
      }

      // Check insights
      if (funnelState.insights?.narrativeProfile && key in funnelState.insights.narrativeProfile) {
        return funnelState.insights.narrativeProfile[key] as T;
      }
    }

    return undefined;
  }

  /**
   * Checks if a memory key exists.
   */
  public hasMemory(key: string, funnelState?: FunnelState): boolean {
    return this.getMemory(key, funnelState) !== undefined;
  }

  /**
   * Removes a key from local memory.
   */
  public removeMemory(key: string): void {
    delete this.localMemory[key];
  }

  /**
   * Clears all local experience memory.
   */
  public clearExperienceMemory(): void {
    this.localMemory = {};
  }

  /**
   * Returns a copy of the active local experience memory.
   */
  public getExperienceMemory(): Record<string, unknown> {
    return { ...this.localMemory };
  }

  /**
   * Applies a list of deliberate MemoryUpdates.
   */
  public applyUpdates(updates: MemoryUpdate[]): void {
    if (!Array.isArray(updates)) return;
    for (const update of updates) {
      this.setMemory(update.key, update.value, update.scope || 'local');
    }
  }

  /**
   * Saves an explicit user response.
   */
  public saveResponse(questionId: string, value: unknown): void {
    this.setMemory(questionId, value, 'global');
    if (this.onSaveResponse) {
      this.onSaveResponse(this.experienceId, questionId, value);
    }
  }

  /**
   * Records a discovered insight for the funnel.
   */
  public addInsight(insight: { id: string; type: string; value: unknown }): void {
    const fullInsight = {
      ...insight,
      sourceExperience: this.experienceId,
      timestamp: new Date().toISOString(),
    };
    if (this.onAddInsight) {
      this.onAddInsight(fullInsight);
    }
  }
}
