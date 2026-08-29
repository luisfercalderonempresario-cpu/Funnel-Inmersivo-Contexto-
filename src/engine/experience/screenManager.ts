// Screen Manager for Contexto™ Experience Engine

import {
  ScreenDefinition,
  ExperienceEngineDefinition,
  ConditionEvaluationContext,
  BranchTarget,
} from './types';
import { evaluateCondition } from './conditionEvaluator';

export class ScreenManager {
  private definition: ExperienceEngineDefinition;

  constructor(definition: ExperienceEngineDefinition) {
    this.definition = definition;
  }

  /**
   * Retrieves a screen definition by ID.
   */
  public getScreen(screenId: string): ScreenDefinition | undefined {
    return this.definition.screens[screenId];
  }

  /**
   * Checks if a screen exists in the experience.
   */
  public hasScreen(screenId: string): boolean {
    return Boolean(this.definition.screens[screenId]);
  }

  /**
   * Validates if a screen can be accessed based on screen-level conditions.
   */
  public canAccessScreen(
    screenId: string,
    context: ConditionEvaluationContext
  ): boolean {
    const screen = this.getScreen(screenId);
    if (!screen) return false;

    if (screen.conditions) {
      return evaluateCondition(screen.conditions, context);
    }

    return true;
  }

  /**
   * Determines the next screen ID to navigate to from the current screen.
   * Handles:
   * 1. Dynamic branch targets with conditions (IF condition THEN screenA ELSE screenB)
   * 2. Direct nextScreen property
   * 3. Convergence back to common screens
   */
  public resolveNextScreen(
    currentScreenId: string,
    context: ConditionEvaluationContext,
    targetOverride?: string,
    actionBranchTargets?: BranchTarget[]
  ): string | null {
    // 1. Direct explicit target from action override
    if (targetOverride && this.hasScreen(targetOverride)) {
      return targetOverride;
    }

    // 2. Action-level branch targets
    if (actionBranchTargets && actionBranchTargets.length > 0) {
      for (const branch of actionBranchTargets) {
        if (evaluateCondition(branch.condition, context)) {
          if (this.hasScreen(branch.targetScreen)) {
            return branch.targetScreen;
          }
        }
      }
    }

    const screen = this.getScreen(currentScreenId);
    if (!screen) return null;

    // 3. Screen-level branch targets
    if (screen.branchTargets && screen.branchTargets.length > 0) {
      for (const branch of screen.branchTargets) {
        if (evaluateCondition(branch.condition, context)) {
          if (this.hasScreen(branch.targetScreen)) {
            return branch.targetScreen;
          }
        }
      }
    }

    // 4. Static nextScreen on screen definition
    if (screen.nextScreen && this.hasScreen(screen.nextScreen)) {
      return screen.nextScreen;
    }

    return null;
  }

  /**
   * Returns all screen IDs.
   */
  public getAllScreenIds(): string[] {
    return Object.keys(this.definition.screens);
  }
}
