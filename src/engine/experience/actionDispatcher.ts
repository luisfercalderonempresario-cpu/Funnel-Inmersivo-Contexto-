// Action Dispatcher for Contexto™ Experience Engine

import {
  ExperienceAction,
  ExperienceRuntimeState,
  ActionResult,
  ConditionEvaluationContext,
  ExperienceEngineDefinition,
} from './types';
import { ScreenManager } from './screenManager';
import { ExperienceMemoryManager } from './experienceMemory';
import { evaluateCondition } from './conditionEvaluator';
import { trackExperienceEvent } from './experienceEvents';
import { transitionScreenState, persistExperienceRuntimeState } from './experienceState';
import { FunnelState } from '../state/types';

export interface ActionDispatcherContext {
  definition: ExperienceEngineDefinition;
  screenManager: ScreenManager;
  memoryManager: ExperienceMemoryManager;
  runtimeState: ExperienceRuntimeState;
  funnelState: FunnelState;
  setRuntimeState: (updater: (prev: ExperienceRuntimeState) => ExperienceRuntimeState) => void;
  onCompleteExperience: (data?: Record<string, unknown>) => void;
  sessionId: string;
  caseId: string;
}

export class ActionDispatcher {
  /**
   * Validates if the action is permitted on the current screen and satisfies conditions.
   */
  public static validateAction(
    action: ExperienceAction,
    context: ActionDispatcherContext
  ): { valid: boolean; reason?: string } {
    const currentScreen = context.screenManager.getScreen(context.runtimeState.currentScreen);

    if (!currentScreen) {
      return { valid: false, reason: `Pantalla ${context.runtimeState.currentScreen} no existe` };
    }

    if (context.runtimeState.status === 'COMPLETED') {
      return { valid: false, reason: 'La experiencia ya se encuentra completada' };
    }

    // Evaluate action conditions if present
    if (action.conditions) {
      const evalCtx: ConditionEvaluationContext = {
        runtimeState: context.runtimeState,
        funnelState: context.funnelState,
        memory: context.memoryManager.getExperienceMemory(),
        responses: (context.funnelState.responses[context.definition.id as keyof typeof context.funnelState.responses] || {}) as Record<string, unknown>,
        completedExperiences: context.funnelState.progress.completedExperiences,
      };

      const satisfied = evaluateCondition(action.conditions, evalCtx);
      if (!satisfied) {
        return { valid: false, reason: 'No se cumplen las condiciones para ejecutar esta acción' };
      }
    }

    return { valid: true };
  }

  /**
   * Dispatches an action through the deterministic engine pipeline:
   * Action -> Validation -> State & Memory Update -> Event Tracking -> Next Screen / Completion
   */
  public static async dispatchAction(
    action: ExperienceAction,
    context: ActionDispatcherContext
  ): Promise<ActionResult> {
    try {
      // 1. Validation
      const validation = this.validateAction(action, context);
      if (!validation.valid) {
        console.warn(`[ActionDispatcher] Action rejected: ${validation.reason}`, action);
        return { success: false, error: validation.reason };
      }

      const { runtimeState, definition, sessionId, caseId, memoryManager } = context;

      // 2. Track ACTION_DISPATCHED
      trackExperienceEvent({
        eventName: 'ACTION_DISPATCHED',
        sessionId,
        caseId,
        experienceId: definition.id,
        screenId: runtimeState.currentScreen,
        payload: {
          actionType: action.type,
          actionLabel: action.label,
          payload: action.payload,
        },
      });

      // 3. Process Payload & Memory Updates
      if (action.memoryUpdates && action.memoryUpdates.length > 0) {
        memoryManager.applyUpdates(action.memoryUpdates);

        for (const update of action.memoryUpdates) {
          trackExperienceEvent({
            eventName: 'MEMORY_UPDATED',
            sessionId,
            caseId,
            experienceId: definition.id,
            screenId: runtimeState.currentScreen,
            payload: {
              key: update.key,
              value: update.value,
              scope: update.scope || 'local',
            },
          });
        }
      }

      // Handle specific action types
      if (action.type === 'SELECT' && action.payload) {
        const { questionId, optionId, value } = action.payload;
        if (questionId) {
          memoryManager.saveResponse(String(questionId), value ?? optionId);
          trackExperienceEvent({
            eventName: 'CHOICE_SELECTED',
            sessionId,
            caseId,
            experienceId: definition.id,
            screenId: runtimeState.currentScreen,
            payload: { questionId, optionId, value },
          });
        }
      }

      if (action.type === 'SUBMIT' && action.payload) {
        const { fieldId, value } = action.payload;
        if (fieldId) {
          memoryManager.saveResponse(String(fieldId), value);
          trackExperienceEvent({
            eventName: 'QUESTION_ANSWERED',
            sessionId,
            caseId,
            experienceId: definition.id,
            screenId: runtimeState.currentScreen,
            payload: { fieldId, value },
          });
        }
      }

      if (action.insight) {
        memoryManager.addInsight(action.insight);
        trackExperienceEvent({
          eventName: 'INSIGHT_DISCOVERED',
          sessionId,
          caseId,
          experienceId: definition.id,
          screenId: runtimeState.currentScreen,
          payload: action.insight,
        });
      }

      if (action.type === 'PLAY_VIDEO' || action.type === 'PLAY_AUDIO') {
        trackExperienceEvent({
          eventName: 'MEDIA_STARTED',
          sessionId,
          caseId,
          experienceId: definition.id,
          screenId: runtimeState.currentScreen,
          payload: action.payload,
        });
      }

      if (action.type === 'COMPLETE_VIDEO' || action.type === 'COMPLETE_AUDIO') {
        trackExperienceEvent({
          eventName: 'MEDIA_COMPLETED',
          sessionId,
          caseId,
          experienceId: definition.id,
          screenId: runtimeState.currentScreen,
          payload: action.payload,
        });
      }

      // 4. Handle Delay / Processing if specified
      if (action.delayMs && action.delayMs > 0) {
        context.setRuntimeState((prev) => ({
          ...prev,
          status: 'PROCESSING',
        }));
        await new Promise((resolve) => setTimeout(resolve, action.delayMs));
      }

      // 5. Evaluate Context for Next Screen
      const currentMemory = memoryManager.getExperienceMemory();
      const evalCtx: ConditionEvaluationContext = {
        runtimeState,
        funnelState: context.funnelState,
        memory: currentMemory,
        responses: (context.funnelState.responses[definition.id as keyof typeof context.funnelState.responses] || {}) as Record<string, unknown>,
        completedExperiences: context.funnelState.progress.completedExperiences,
      };

      // 6. Check Completion
      if (action.type === 'COMPLETE') {
        if (context.runtimeState.status !== 'COMPLETED') {
          context.setRuntimeState((prev) => {
            const next: ExperienceRuntimeState = {
              ...prev,
              status: 'COMPLETED',
              completedScreens: prev.completedScreens.includes(prev.currentScreen)
                ? prev.completedScreens
                : [...prev.completedScreens, prev.currentScreen],
            };
            persistExperienceRuntimeState(next);
            return next;
          });

          trackExperienceEvent({
            eventName: 'EXPERIENCE_COMPLETED',
            sessionId,
            caseId,
            experienceId: definition.id,
            screenId: runtimeState.currentScreen,
            payload: { memory: currentMemory },
          });

          context.onCompleteExperience(currentMemory);
        }
        return { success: true, completed: true };
      }

      // 7. Resolve Next Screen
      const nextScreenId = context.screenManager.resolveNextScreen(
        runtimeState.currentScreen,
        evalCtx,
        action.targetScreen,
        action.branchTargets
      );

      if (nextScreenId) {
        const nextScreenDef = context.screenManager.getScreen(nextScreenId);

        // Standard screen transition (including COMPLETION screen, waiting for CTA click)
        const newStatus = 'ACTIVE';
        context.setRuntimeState((prev) => {
          const updated = transitionScreenState(prev, nextScreenId, newStatus);
          persistExperienceRuntimeState(updated);
          return updated;
        });

        trackExperienceEvent({
          eventName: 'SCREEN_VIEWED',
          sessionId,
          caseId,
          experienceId: definition.id,
          screenId: nextScreenId,
          payload: { type: nextScreenDef?.type },
        });

        return { success: true, nextScreen: nextScreenId };
      }

      return { success: true };
    } catch (error) {
      console.error('[ActionDispatcher] Unexpected error during action dispatch:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
