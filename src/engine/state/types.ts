// State Engine Types for Contexto™ Immersive Funnel

export type ExperienceId =
  | 'exp01'
  | 'exp02'
  | 'exp03'
  | 'exp04'
  | 'exp05'
  | 'exp06'
  | 'exp07'
  | 'exp08'
  | 'sales_page';

export type ExperienceStatus =
  | 'LOCKED'
  | 'AVAILABLE'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETED';

export interface SessionState {
  sessionId: string;
  caseId: string;
  createdAt: string;
  lastActivityAt: string;
}

export interface AcquisitionState {
  trafficSource: string | null;
  campaign: string | null;
  adId: string | null;
  contentId: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
}

export interface ProgressState {
  currentExperience: ExperienceId;
  currentScreen: string;
  completedExperiences: ExperienceId[];
  completionPercentage: number;
}

export interface PreferencesState {
  audioEnabled: boolean;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  voiceEnabled: boolean;
}

export interface ResponsesState {
  exp01: Record<string, unknown>;
  exp02: Record<string, unknown>;
  exp03: Record<string, unknown>;
  exp04: Record<string, unknown>;
  exp05: Record<string, unknown>;
  exp06: Record<string, unknown>;
  exp07: Record<string, unknown>;
  exp08: Record<string, unknown>;
}

export interface InsightsState {
  discovered: string[];
  narrativeProfile: Record<string, unknown>;
}

export interface ProductState {
  viewed: boolean;
  demoStarted: boolean;
  demoCompleted: boolean;
}

export interface FutureState {
  choices: Record<string, unknown>;
  path: string | null;
}

export interface RevelationState {
  reached: boolean;
  completed: boolean;
}

export interface ConversionState {
  salesPageViewed: boolean;
  vslStarted: boolean;
  vslCompleted: boolean;
  checkoutStarted: boolean;
  purchaseCompleted: boolean;
  purchaseIntent?: 'low' | 'medium' | 'high';
  revelationCompleted?: boolean;
}

export interface FunnelState {
  version: number;
  session: SessionState;
  acquisition: AcquisitionState;
  progress: ProgressState;
  preferences: PreferencesState;
  responses: ResponsesState;
  insights: InsightsState;
  product: ProductState;
  future: FutureState;
  revelation: RevelationState;
  conversion: ConversionState;
}

export const STATE_VERSION = 1;
