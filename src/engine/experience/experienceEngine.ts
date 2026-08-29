// Experience Engine Core Orchestrator for Contexto™

import {
  ExperienceEngineDefinition,
  ExperienceRuntimeState,
  ExperienceAction,
  ActionResult,
} from './types';
import { ScreenManager } from './screenManager';
import { ExperienceMemoryManager } from './experienceMemory';
import { ActionDispatcher, ActionDispatcherContext } from './actionDispatcher';
import {
  createInitialRuntimeState,
  loadExperienceRuntimeState,
  persistExperienceRuntimeState,
  clearExperienceRuntimeState,
} from './experienceState';
import { trackExperienceEvent } from './experienceEvents';
import { FunnelState } from '../state/types';

export class ExperienceEngine {
  private definition: ExperienceEngineDefinition;
  private screenManager: ScreenManager;
  private memoryManager: ExperienceMemoryManager;
  private runtimeState: ExperienceRuntimeState;
  private funnelState: FunnelState;
  private setRuntimeStateCallback: (updater: (prev: ExperienceRuntimeState) => ExperienceRuntimeState) => void;
  private onCompleteExperienceCallback: (data?: Record<string, unknown>) => void;
  private sessionId: string;
  private caseId: string;

  constructor(options: {
    definition: ExperienceEngineDefinition;
    funnelState: FunnelState;
    sessionId: string;
    caseId: string;
    setRuntimeState: (updater: (prev: ExperienceRuntimeState) => ExperienceRuntimeState) => void;
    onCompleteExperience: (data?: Record<string, unknown>) => void;
    onPersistGlobalMemory?: (key: string, value: unknown) => void;
    onSaveResponse?: (experienceId: string, questionId: string, value: unknown) => void;
    onAddInsight?: (insight: { id: string; type: string; value: unknown; sourceExperience: string }) => void;
  }) {
    this.definition = options.definition;
    this.funnelState = options.funnelState;
    this.sessionId = options.sessionId;
    this.caseId = options.caseId;
    this.setRuntimeStateCallback = options.setRuntimeState;
    this.onCompleteExperienceCallback = options.onCompleteExperience;

    this.screenManager = new ScreenManager(this.definition);

    // Initialize or load runtime state
    const saved = loadExperienceRuntimeState(this.definition.id);
    this.runtimeState = saved || createInitialRuntimeState(this.definition);

    this.memoryManager = new ExperienceMemoryManager({
      experienceId: this.definition.id,
      initialLocalMemory: this.runtimeState.localMemory,
      onPersistGlobal: options.onPersistGlobalMemory,
      onSaveResponse: options.onSaveResponse,
      onAddInsight: options.onAddInsight,
    });
  }

  /**
   * Initializes or restores the experience lifecycle.
   */
  public initialize(): ExperienceRuntimeState {
    const existing = loadExperienceRuntimeState(this.definition.id);
    if (existing) {
      this.runtimeState = existing;
      trackExperienceEvent({
        eventName: 'EXPERIENCE_RESUMED',
        sessionId: this.sessionId,
        caseId: this.caseId,
        experienceId: this.definition.id,
        screenId: existing.currentScreen,
      });
    } else {
      this.runtimeState = createInitialRuntimeState(this.definition);
      persistExperienceRuntimeState(this.runtimeState);
      trackExperienceEvent({
        eventName: 'EXPERIENCE_STARTED',
        sessionId: this.sessionId,
        caseId: this.caseId,
        experienceId: this.definition.id,
        screenId: this.runtimeState.currentScreen,
      });
    }
    return this.runtimeState;
  }

  /**
   * Pauses experience execution.
   */
  public pause(): void {
    if (this.runtimeState.status !== 'ACTIVE') return;

    this.setRuntimeStateCallback((prev) => {
      const updated: ExperienceRuntimeState = {
        ...prev,
        status: 'PAUSED',
        lastActivityAt: new Date().toISOString(),
      };
      persistExperienceRuntimeState(updated);
      return updated;
    });

    trackExperienceEvent({
      eventName: 'EXPERIENCE_PAUSED',
      sessionId: this.sessionId,
      caseId: this.caseId,
      experienceId: this.definition.id,
      screenId: this.runtimeState.currentScreen,
    });
  }

  /**
   * Resumes experience execution.
   */
  public resume(): void {
    if (this.runtimeState.status !== 'PAUSED') return;

    this.setRuntimeStateCallback((prev) => {
      const updated: ExperienceRuntimeState = {
        ...prev,
        status: 'ACTIVE',
        lastActivityAt: new Date().toISOString(),
      };
      persistExperienceRuntimeState(updated);
      return updated;
    });

    trackExperienceEvent({
      eventName: 'EXPERIENCE_RESUMED',
      sessionId: this.sessionId,
      caseId: this.caseId,
      experienceId: this.definition.id,
      screenId: this.runtimeState.currentScreen,
    });
  }

  /**
   * Resets experience to its initial state.
   */
  public reset(): ExperienceRuntimeState {
    clearExperienceRuntimeState(this.definition.id);
    this.memoryManager.clearExperienceMemory();
    const fresh = createInitialRuntimeState(this.definition);
    persistExperienceRuntimeState(fresh);
    this.setRuntimeStateCallback(() => fresh);

    trackExperienceEvent({
      eventName: 'EXPERIENCE_STARTED',
      sessionId: this.sessionId,
      caseId: this.caseId,
      experienceId: this.definition.id,
      screenId: fresh.currentScreen,
      payload: { reset: true },
    });

    return fresh;
  }

  /**
   * Dispatches an action via ActionDispatcher.
   */
  public async dispatch(action: ExperienceAction): Promise<ActionResult> {
    const context: ActionDispatcherContext = {
      definition: this.definition,
      screenManager: this.screenManager,
      memoryManager: this.memoryManager,
      runtimeState: this.runtimeState,
      funnelState: this.funnelState,
      setRuntimeState: (updater) => {
        this.setRuntimeStateCallback((prev) => {
          const next = updater(prev);
          this.runtimeState = next;
          return next;
        });
      },
      onCompleteExperience: this.onCompleteExperienceCallback,
      sessionId: this.sessionId,
      caseId: this.caseId,
    };

    return ActionDispatcher.dispatchAction(action, context);
  }

  public getScreenManager(): ScreenManager {
    return this.screenManager;
  }

  public getMemoryManager(): ExperienceMemoryManager {
    return this.memoryManager;
  }

  public getRuntimeState(): ExperienceRuntimeState {
    return this.runtimeState;
  }

  public updateContext(funnelState: FunnelState, runtimeState: ExperienceRuntimeState): void {
    this.funnelState = funnelState;
    this.runtimeState = runtimeState;
  }
}
