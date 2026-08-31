// Isolated Cycle Calculation Engine for Contexto™ EXP_07
export type CyclePhase = 'MENSTRUAL' | 'FOLLICULAR' | 'OVULATORY' | 'LUTEAL';

export interface CycleConfig {
  defaultCycleLength: number;
}

export const CYCLE_CONFIG: CycleConfig = {
  defaultCycleLength: 28,
};

export interface CycleCalculationInput {
  menstruationDate: string; // Format: YYYY-MM-DD
  currentDate?: Date;
  dateIsApproximate?: boolean;
  cycleConfig?: CycleConfig;
}

export interface CycleCalculationResult {
  isValid: boolean;
  errorMessage?: string;
  diffDays: number;
  estimatedCycleDay: number;
  estimatedPhase: CyclePhase;
  phaseDisplayName: string;
  confidenceLevel: 'ORIENTATIVE_ESTIMATE' | 'APPROXIMATE_REFERENCE';
  cycleLengthSource: 'default_reference' | 'custom';
  phaseData: {
    name: string;
    dayRangeText: string;
    scientificContext: string;
    practicalConsideration: string;
    dailyActionIdea: string;
    microGesture: string;
    whatToAvoid: string;
  };
}

export const PHASE_METADATA: Record<
  CyclePhase,
  {
    name: string;
    dayRangeText: string;
    scientificContext: string;
    practicalConsideration: string;
    dailyActionIdea: string;
    microGesture: string;
    whatToAvoid: string;
  }
> = {
  MENSTRUAL: {
    name: 'FASE MENSTRUAL',
    dayRangeText: 'Días 1 a 5 aprox.',
    scientificContext: 'Inicio del ciclo biológico con reajuste hormonal y mayor gasto energético basal.',
    practicalConsideration:
      'Alrededor de esta etapa algunas personas pueden experimentar mayor cansancio físico, sensibilidad o necesidad de menor estimulación externa.',
    dailyActionIdea: 'Antes de asumir que un silencio o cansancio tiene que ver contigo, pregúntale cómo está.',
    microGesture: '¿Cómo te sientes hoy? Si necesitas descansar o espacio, dímelo con calma.',
    whatToAvoid: 'Interpretar la falta de energía o el deseo de descansar como desinterés en la relación.',
  },
  FOLLICULAR: {
    name: 'FASE FOLICULAR',
    dayRangeText: 'Días 6 a 13 aprox.',
    scientificContext: 'Incremento paulatino de estrógenos que suele correlacionar con mayor energía y disposición física.',
    practicalConsideration:
      'En esta fase es común encontrar mayor apertura a la planificación y a nuevas actividades, aunque cada organismo tiene su propio ritmo.',
    dailyActionIdea: 'Buen momento para conversar sobre iniciativas compartidas, manteniendo la escucha activa.',
    microGesture: '¿Qué te gustaría hacer hoy o durante el fin de semana?',
    whatToAvoid: 'Dar por sentado que siempre habrá disponibilidad total solo por estar en esta fase.',
  },
  OVULATORY: {
    name: 'FASE OVULATORIA',
    dayRangeText: 'Días 14 a 16 aprox.',
    scientificContext: 'Ventana central del ciclo biológico con pico estrogénico y mayor dinamismo general.',
    practicalConsideration:
      'Puede existir mayor disposición para la conexión social y la comunicación, sujeta a factores cotidianos como el estrés o el descanso.',
    dailyActionIdea: 'Aprovecha momentos de tranquilidad para conectar con presencia genuina.',
    microGesture: 'Me alegra verte bien hoy. ¿Cómo va tu día?',
    whatToAvoid: 'Asumir automáticamente expectativas rígidas; el contexto orienta, la conversación confirma.',
  },
  LUTEAL: {
    name: 'FASE LÚTEA',
    dayRangeText: 'Días 17 a 28 aprox.',
    scientificContext: 'Segunda mitad del ciclo con predominio de progesterona y fluctuaciones neuroquímicas naturales.',
    practicalConsideration:
      'Alrededor de esta etapa algunas personas pueden experimentar mayor sensibilidad a la sobrecarga, cambios de ánimo o necesidad de contención.',
    dailyActionIdea: 'Antes de reaccionar a una respuesta cortante, haz una pausa y evalúa si hay fatiga acumulada.',
    microGesture: 'Noto que ha sido un día largo. ¿Quieres que preparemos algo tranquilos o prefieres un rato para ti?',
    whatToAvoid: 'Convertir inmediatamente un cambio de tono, cansancio o distancia en una discusión sobre la relación.',
  },
};

/**
 * Validates a menstruation date string (YYYY-MM-DD).
 */
export function validateMenstruationDate(
  dateStr: string,
  referenceDate: Date = new Date()
): { isValid: boolean; error?: string; diffDays?: number } {
  if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') {
    return { isValid: false, error: 'Por favor introduce una fecha para continuar.' };
  }

  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    return { isValid: false, error: 'Formato de fecha inválido.' };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return { isValid: false, error: 'Fecha no válida.' };
  }

  const parsed = new Date(year, month, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return { isValid: false, error: 'La fecha introducida no existe en el calendario.' };
  }

  // Calculate day difference without time component
  const startUtc = Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  const refUtc = Date.UTC(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  const diffDays = Math.floor((refUtc - startUtc) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { isValid: false, error: 'La fecha no puede ser futura.' };
  }

  if (diffDays > 60) {
    return {
      isValid: false,
      error: 'Necesitamos una fecha más reciente para hacer esta prueba (últimos 60 días).',
    };
  }

  return { isValid: true, diffDays };
}

/**
 * Isolated calculation function for cycle context.
 */
export function calculateCycleContext(
  input: CycleCalculationInput
): CycleCalculationResult {
  const {
    menstruationDate,
    currentDate = new Date(),
    dateIsApproximate = false,
    cycleConfig = CYCLE_CONFIG,
  } = input;

  const validation = validateMenstruationDate(menstruationDate, currentDate);

  if (!validation.isValid || validation.diffDays === undefined) {
    return {
      isValid: false,
      errorMessage: validation.error || 'Fecha no válida.',
      diffDays: 0,
      estimatedCycleDay: 1,
      estimatedPhase: 'FOLLICULAR',
      phaseDisplayName: 'FASE FOLICULAR',
      confidenceLevel: dateIsApproximate
        ? 'APPROXIMATE_REFERENCE'
        : 'ORIENTATIVE_ESTIMATE',
      cycleLengthSource: 'default_reference',
      phaseData: PHASE_METADATA.FOLLICULAR,
    };
  }

  const cycleLength = cycleConfig.defaultCycleLength || 28;
  const estimatedCycleDay = (validation.diffDays % cycleLength) + 1;

  let estimatedPhase: CyclePhase = 'FOLLICULAR';
  if (estimatedCycleDay >= 1 && estimatedCycleDay <= 5) {
    estimatedPhase = 'MENSTRUAL';
  } else if (estimatedCycleDay >= 6 && estimatedCycleDay <= 13) {
    estimatedPhase = 'FOLLICULAR';
  } else if (estimatedCycleDay >= 14 && estimatedCycleDay <= 16) {
    estimatedPhase = 'OVULATORY';
  } else {
    estimatedPhase = 'LUTEAL';
  }

  const phaseData = PHASE_METADATA[estimatedPhase];

  return {
    isValid: true,
    diffDays: validation.diffDays,
    estimatedCycleDay,
    estimatedPhase,
    phaseDisplayName: phaseData.name,
    confidenceLevel: dateIsApproximate
      ? 'APPROXIMATE_REFERENCE'
      : 'ORIENTATIVE_ESTIMATE',
    cycleLengthSource: 'default_reference',
    phaseData,
  };
}
