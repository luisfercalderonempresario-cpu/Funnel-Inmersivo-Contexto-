// Experience Engine Types for Contexto™ Immersive Funnel

import { FunnelState, ExperienceId, ExperienceStatus } from '../state/types';

export type ScreenType =
  | 'INTRO'
  | 'CONTENT'
  | 'QUESTION'
  | 'CHOICE'
  | 'CHAT'
  | 'VIDEO'
  | 'AUDIO'
  | 'REVEAL'
  | 'WAIT'
  | 'TRANSITION'
  | 'COMPLETION';

export type ActionType =
  | 'CLICK'
  | 'SELECT'
  | 'SUBMIT'
  | 'TYPE'
  | 'PLAY_VIDEO'
  | 'COMPLETE_VIDEO'
  | 'PLAY_AUDIO'
  | 'COMPLETE_AUDIO'
  | 'CONTINUE'
  | 'REVEAL'
  | 'OPEN'
  | 'CLOSE'
  | 'WAIT'
  | 'COMPLETE';

export type ExperienceRuntimeStatus =
  | 'IDLE'
  | 'ACTIVE'
  | 'WAITING'
  | 'PROCESSING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'ERROR';

export type MemoryScope = 'local' | 'global';

export type ConditionOperator =
  | '=='
  | '!='
  | '!=='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'exists'
  | 'notExists'
  | 'includes';

export interface SimpleCondition {
  field: string;
  operator: ConditionOperator;
  value?: unknown;
}

export interface CompoundCondition {
  operator: 'AND' | 'OR' | 'NOT';
  conditions: ConditionRule[];
}

export type ConditionRule =
  | SimpleCondition
  | CompoundCondition
  | ((context: ConditionEvaluationContext) => boolean);

export interface ConditionEvaluationContext {
  runtimeState: ExperienceRuntimeState;
  funnelState: FunnelState;
  memory: Record<string, unknown>;
  responses: Record<string, unknown>;
  completedExperiences: ExperienceId[];
}

export interface MemoryUpdate {
  key: string;
  value: unknown;
  scope?: MemoryScope;
}

export interface ChoiceOption {
  id: string;
  label: string;
  subtext?: string;
  code?: string;
  value?: unknown;
  nextScreen?: string;
  memoryUpdates?: MemoryUpdate[];
  conditions?: ConditionRule;
}

export interface BranchTarget {
  targetScreen: string;
  condition: ConditionRule;
}

export interface ExperienceAction {
  id?: string;
  type: ActionType;
  label?: string;
  payload?: Record<string, unknown>;
  targetScreen?: string;
  branchTargets?: BranchTarget[];
  conditions?: ConditionRule;
  memoryUpdates?: MemoryUpdate[];
  saveToMemory?: boolean;
  memoryScope?: MemoryScope;
  delayMs?: number;
  insight?: {
    id: string;
    type: string;
    value: unknown;
  };
}

export interface ScreenDefinition {
  id: string;
  type: ScreenType;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'video' | 'audio' | 'image';
  options?: ChoiceOption[];
  actions?: ExperienceAction[];
  nextScreen?: string;
  branchTargets?: BranchTarget[];
  conditions?: ConditionRule;
  waitDurationSeconds?: number;
  autoAdvance?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ExperienceRuntimeState {
  experienceId: string;
  currentScreen: string;
  status: ExperienceRuntimeStatus;
  localData: Record<string, unknown>;
  localMemory: Record<string, unknown>;
  completedScreens: string[];
  startedAt: string;
  lastActivityAt: string;
  error?: string | null;
}

export interface ExperienceEngineDefinition {
  id: string;
  slug: string;
  title: string;
  number?: number;
  initialScreen: string;
  screens: Record<string, ScreenDefinition>;
  initialState?: Record<string, unknown>;
  actions?: Record<string, ExperienceAction>;
  completionCondition?: ConditionRule | ((runtimeState: ExperienceRuntimeState, funnelState: FunnelState) => boolean);
  nextExperience?: ExperienceId | 'sales_page' | null;
}

export type ExperienceEventName =
  | 'SCREEN_VIEWED'
  | 'SCREEN_COMPLETED'
  | 'ACTION_DISPATCHED'
  | 'QUESTION_SHOWN'
  | 'QUESTION_ANSWERED'
  | 'CHOICE_SHOWN'
  | 'CHOICE_SELECTED'
  | 'MEMORY_UPDATED'
  | 'INSIGHT_DISCOVERED'
  | 'CONDITION_EVALUATED'
  | 'BRANCH_SELECTED'
  | 'EXPERIENCE_STARTED'
  | 'EXPERIENCE_PAUSED'
  | 'EXPERIENCE_RESUMED'
  | 'EXPERIENCE_COMPLETED'
  | 'MEDIA_STARTED'
  | 'MEDIA_COMPLETED';

export interface ActionResult {
  success: boolean;
  nextScreen?: string;
  error?: string;
  stateUpdated?: boolean;
  completed?: boolean;
}
