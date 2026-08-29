// Condition Evaluator for Contexto™ Experience Engine

import {
  ConditionRule,
  SimpleCondition,
  CompoundCondition,
  ConditionEvaluationContext,
} from './types';

/**
 * Safely resolves a dot-notated or direct property path from the evaluation context.
 * e.g. "memory.testAnswer", "responses.exp01.choice", "status", "currentScreen", "completedExperiences"
 */
function resolveContextValue(path: string, context: ConditionEvaluationContext): unknown {
  if (!path) return undefined;

  const parts = path.split('.');
  const rootKey = parts[0];

  let current: unknown;

  if (rootKey === 'memory') {
    current = context.memory;
  } else if (rootKey === 'localMemory') {
    current = context.runtimeState.localMemory;
  } else if (rootKey === 'localData') {
    current = context.runtimeState.localData;
  } else if (rootKey === 'responses') {
    current = context.responses;
  } else if (rootKey === 'runtimeState' || rootKey === 'runtime') {
    current = context.runtimeState;
  } else if (rootKey === 'funnelState' || rootKey === 'funnel') {
    current = context.funnelState;
  } else if (rootKey === 'completedExperiences') {
    current = context.completedExperiences;
  } else {
    // Check localMemory first, then localData, then funnel responses, then top-level context
    if (context.memory && rootKey in context.memory) {
      current = context.memory;
      return resolveNestedPath(current, parts);
    }
    if (context.runtimeState.localData && rootKey in context.runtimeState.localData) {
      current = context.runtimeState.localData;
      return resolveNestedPath(current, parts);
    }
    if (rootKey in context.runtimeState) {
      current = context.runtimeState;
    } else if (rootKey in context.funnelState) {
      current = context.funnelState;
    } else {
      return undefined;
    }
  }

  return resolveNestedPath(current, parts.slice(1));
}

function resolveNestedPath(root: unknown, parts: string[]): unknown {
  let current: unknown = root;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Evaluates a single SimpleCondition against the context.
 */
function evaluateSimpleCondition(
  condition: SimpleCondition,
  context: ConditionEvaluationContext
): boolean {
  try {
    const actualValue = resolveContextValue(condition.field, context);
    const expectedValue = condition.value;

    switch (condition.operator) {
      case '==':
        // eslint-disable-next-line eqeqeq
        return actualValue == expectedValue;
      case '!=':
        // eslint-disable-next-line eqeqeq
        return actualValue != expectedValue;
      case '!==':
        return actualValue !== expectedValue;
      case '>':
        return typeof actualValue === 'number' && typeof expectedValue === 'number'
          ? actualValue > expectedValue
          : false;
      case '<':
        return typeof actualValue === 'number' && typeof expectedValue === 'number'
          ? actualValue < expectedValue
          : false;
      case '>=':
        return typeof actualValue === 'number' && typeof expectedValue === 'number'
          ? actualValue >= expectedValue
          : false;
      case '<=':
        return typeof actualValue === 'number' && typeof expectedValue === 'number'
          ? actualValue <= expectedValue
          : false;
      case 'exists':
        return actualValue !== undefined && actualValue !== null && actualValue !== '';
      case 'notExists':
        return actualValue === undefined || actualValue === null || actualValue === '';
      case 'includes':
        if (Array.isArray(actualValue)) {
          return actualValue.includes(expectedValue);
        }
        if (typeof actualValue === 'string') {
          return actualValue.includes(String(expectedValue));
        }
        return false;
      default:
        console.warn(`[ConditionEvaluator] Unknown operator: ${(condition as SimpleCondition).operator}`);
        return false;
    }
  } catch (err) {
    console.warn('[ConditionEvaluator] Error evaluating simple condition:', err);
    return false;
  }
}

/**
 * Evaluates any ConditionRule (Simple, Compound, Functional).
 * Never throws — always returns a safe boolean fallback (false if invalid).
 */
export function evaluateCondition(
  rule: ConditionRule | undefined,
  context: ConditionEvaluationContext
): boolean {
  if (!rule) {
    // If no condition is specified, it is considered satisfied
    return true;
  }

  try {
    // Functional condition
    if (typeof rule === 'function') {
      return Boolean(rule(context));
    }

    // Compound condition
    if ('operator' in rule && ('AND' === rule.operator || 'OR' === rule.operator || 'NOT' === rule.operator)) {
      const compound = rule as CompoundCondition;
      if (!Array.isArray(compound.conditions) || compound.conditions.length === 0) {
        return true;
      }

      if (compound.operator === 'AND') {
        return compound.conditions.every((sub) => evaluateCondition(sub, context));
      }

      if (compound.operator === 'OR') {
        return compound.conditions.some((sub) => evaluateCondition(sub, context));
      }

      if (compound.operator === 'NOT') {
        return !evaluateCondition(compound.conditions[0], context);
      }
    }

    // Simple condition
    if ('field' in rule && 'operator' in rule) {
      return evaluateSimpleCondition(rule as SimpleCondition, context);
    }

    return false;
  } catch (err) {
    console.warn('[ConditionEvaluator] Exception during condition evaluation, failing safely to false:', err);
    return false;
  }
}
