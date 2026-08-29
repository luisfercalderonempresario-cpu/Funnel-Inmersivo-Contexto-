import {
  FunnelState,
  STATE_VERSION,
  SessionState,
  AcquisitionState,
  ProgressState,
  PreferencesState,
  ResponsesState,
  InsightsState,
  ProductState,
  FutureState,
  RevelationState,
  ConversionState,
} from '../state/types';

export const STORAGE_KEY = 'contexto_funnel_state_v1';

/**
 * Generates a cryptographically random session ID without personal info.
 */
export function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a short, memorable, non-PII Case ID for Andrés.
 * Format: CASO #7K4M21
 */
export function generateCaseId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes confusing 0, 1, I, O
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return `CASO #${code}`;
}

/**
 * Extracts UTM and acquisition tracking parameters from the current URL safely.
 */
export function extractAcquisitionFromUrl(): AcquisitionState {
  if (typeof window === 'undefined') {
    return {
      trafficSource: null,
      campaign: null,
      adId: null,
      contentId: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    trafficSource: params.get('trafficSource') || params.get('source') || null,
    campaign: params.get('campaign') || null,
    adId: params.get('adId') || params.get('ad_id') || null,
    contentId: params.get('contentId') || params.get('content_id') || null,
    utmSource: params.get('utm_source') || null,
    utmMedium: params.get('utm_medium') || null,
    utmCampaign: params.get('utm_campaign') || null,
    utmContent: params.get('utm_content') || null,
    utmTerm: params.get('utm_term') || null,
  };
}

/**
 * Creates a clean, typed initial FunnelState.
 */
export function createInitialState(
  overrides?: Partial<FunnelState>,
  preservedPreferences?: Partial<PreferencesState>
): FunnelState {
  const now = new Date().toISOString();

  const session: SessionState = {
    sessionId: generateSessionId(),
    caseId: generateCaseId(),
    createdAt: now,
    lastActivityAt: now,
  };

  const acquisition: AcquisitionState = extractAcquisitionFromUrl();

  const progress: ProgressState = {
    currentExperience: 'exp01',
    currentScreen: 'entry',
    completedExperiences: [],
    completionPercentage: 0,
  };

  const preferences: PreferencesState = {
    audioEnabled: false,
    musicEnabled: false,
    sfxEnabled: true,
    voiceEnabled: true,
    ...preservedPreferences,
  };

  const responses: ResponsesState = {
    exp01: {},
    exp02: {},
    exp03: {},
    exp04: {},
    exp05: {},
    exp06: {},
    exp07: {},
    exp08: {},
  };

  const insights: InsightsState = {
    discovered: [],
    narrativeProfile: {},
  };

  const product: ProductState = {
    viewed: false,
    demoStarted: false,
    demoCompleted: false,
  };

  const future: FutureState = {
    choices: {},
    path: null,
  };

  const revelation: RevelationState = {
    reached: false,
    completed: false,
  };

  const conversion: ConversionState = {
    salesPageViewed: false,
    vslStarted: false,
    vslCompleted: false,
    checkoutStarted: false,
    purchaseCompleted: false,
  };

  const base: FunnelState = {
    version: STATE_VERSION,
    session,
    acquisition,
    progress,
    preferences,
    responses,
    insights,
    product,
    future,
    revelation,
    conversion,
  };

  return { ...base, ...overrides };
}

/**
 * Validates whether an arbitrary object conforms safely to FunnelState structure.
 * Returns null if data is corrupt or incompatible.
 */
export function validateState(data: unknown): FunnelState | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const raw = data as Partial<FunnelState>;

  // Check version compatibility
  if (typeof raw.version !== 'number' || raw.version !== STATE_VERSION) {
    return null;
  }

  // Check session
  if (
    !raw.session ||
    typeof raw.session.sessionId !== 'string' ||
    typeof raw.session.caseId !== 'string'
  ) {
    return null;
  }

  // Check progress
  if (
    !raw.progress ||
    typeof raw.progress.currentExperience !== 'string' ||
    !Array.isArray(raw.progress.completedExperiences)
  ) {
    return null;
  }

  // Check preferences
  if (
    !raw.preferences ||
    typeof raw.preferences.audioEnabled !== 'boolean' ||
    typeof raw.preferences.sfxEnabled !== 'boolean'
  ) {
    return null;
  }

  // Assemble full validated state filling in any missing sub-objects safely
  const initial = createInitialState();

  return {
    version: STATE_VERSION,
    session: {
      sessionId: raw.session.sessionId,
      caseId: raw.session.caseId,
      createdAt: raw.session.createdAt || initial.session.createdAt,
      lastActivityAt: new Date().toISOString(),
    },
    acquisition: {
      ...initial.acquisition,
      ...(raw.acquisition || {}),
    },
    progress: {
      currentExperience: raw.progress.currentExperience,
      currentScreen: raw.progress.currentScreen || 'entry',
      completedExperiences: raw.progress.completedExperiences,
      completionPercentage:
        typeof raw.progress.completionPercentage === 'number'
          ? raw.progress.completionPercentage
          : Math.round((raw.progress.completedExperiences.length / 8) * 100),
    },
    preferences: {
      ...initial.preferences,
      ...(raw.preferences || {}),
    },
    responses: {
      ...initial.responses,
      ...(raw.responses || {}),
    },
    insights: {
      ...initial.insights,
      ...(raw.insights || {}),
    },
    product: {
      ...initial.product,
      ...(raw.product || {}),
    },
    future: {
      ...initial.future,
      ...(raw.future || {}),
    },
    revelation: {
      ...initial.revelation,
      ...(raw.revelation || {}),
    },
    conversion: {
      ...initial.conversion,
      ...(raw.conversion || {}),
    },
  };
}

/**
 * Saves FunnelState to local storage.
 */
export function saveState(state: FunnelState): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify({
      ...state,
      session: {
        ...state.session,
        lastActivityAt: new Date().toISOString(),
      },
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('[Contexto Storage] Failed to save state to localStorage:', error);
  }
}

/**
 * Loads and validates FunnelState from local storage.
 * Returns null if not found or corrupted.
 */
export function loadState(): FunnelState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return validateState(parsed);
  } catch (error) {
    console.warn('[Contexto Storage] Failed to load state (corrupted or unparseable):', error);
    return null;
  }
}

/**
 * Clears the persisted state.
 */
export function clearState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[Contexto Storage] Failed to clear localStorage:', error);
  }
}
