// EXP_05 — LA PIEZA FALTANTE
// Narrative Experience Content Definition V1.0 — Contexto™

export interface CyclePhaseItem {
  id: string;
  name: string;
  subtitle: string;
  stageCode: '01' | '02' | '03' | '04';
  description: string;
}

export interface ComparisonMomentItem {
  number: string;
  title: string;
  traits: string[];
}

export interface ChoiceOption {
  id: string;
  code: 'A' | 'B' | 'C' | 'D';
  label: string;
  feedback: string;
}

export const EXP05_CONTENT = {
  // SCREEN 01 — LA PISTA
  screen01: {
    eyebrow: 'INVESTIGACIÓN // EXP_05',
    beat1: 'Encontramos una pista.',
    beat2: 'No explica todo.',
    beat3: 'Pero explica algo.',
    ctaLabel: 'VER LA PISTA',
  },

  // SCREEN 02 — UNA VARIABLE DIFERENTE
  screen02: {
    eyebrow: 'MÉTODO DE ANÁLISIS',
    lead1: 'En una investigación...',
    lead2: 'cuando un patrón se repite...',
    lead3: 'buscas qué variable también cambia.',
    recapIntro: 'Ya observamos...',
    recapWhat: 'qué ocurre.',
    recapWhen: 'cuándo ocurre.',
    questionIntro: 'Ahora falta una pregunta.',
    dominantQuestion: '¿Qué más está cambiando?',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 03 — EL CUERPO TAMBIÉN CAMBIA
  screen03: {
    eyebrow: 'VARIABLE NO VISIBLE',
    beat1: 'Hay algo que normalmente no puedes ver.',
    beat2: 'El cuerpo también atraviesa cambios.',
    beat3: 'No solamente de un día para otro.',
    beat4: 'Sino a lo largo del tiempo.',
    beat5: 'En ciclos.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 04 — EL CICLO
  screen04: {
    eyebrow: 'DIMENSIÓN TEMPORAL',
    beat1: 'El ciclo menstrual...',
    beat2: '...no es solamente el momento en que llega la menstruación.',
    beat3: 'Es un proceso que ocurre a lo largo del tiempo.',
    beat4: 'Y atraviesa diferentes etapas.',
    conceptLabel: 'UN CICLO',
    conceptSub: 'Proceso biológico dinámico y continuo',
    beat5: 'Y cada etapa tiene características biológicas diferentes.',
    ctaLabel: 'OBSERVAR LAS ETAPAS',
  },

  // SCREEN 05 — CUATRO MOMENTOS
  screen05: {
    eyebrow: 'LAS CUATRO ETAPAS',
    phases: [
      {
        id: 'phase_menstruation',
        name: 'Menstruación',
        subtitle: 'Reinicio y renovación',
        stageCode: '01',
        description: 'Bajos niveles hormonales basales. Mayor requerimiento de descanso y recuperación física.',
      },
      {
        id: 'phase_follicular',
        name: 'Fase Folicular',
        subtitle: 'Apertura y activación',
        stageCode: '02',
        description: 'Incremento gradual de estrógenos. Sensación de renovación, energía y disposición social.',
      },
      {
        id: 'phase_ovulation',
        name: 'Ovulación',
        subtitle: 'Punto de máxima energía',
        stageCode: '03',
        description: 'Pico hormonal. Mayor vitalidad, receptividad comunicativa y dinamismo.',
      },
      {
        id: 'phase_luteal',
        name: 'Fase Lútea',
        subtitle: 'Introspección y sensibilidad',
        stageCode: '04',
        description: 'Aumento de progesterona seguido de descenso premenstrual. Menor umbral de tolerancia a la sobrecarga.',
      },
    ] as CyclePhaseItem[],
    closure1: 'Cuatro momentos.',
    closure2: 'Un mismo ciclo.',
    closure3: 'Y un cuerpo que atraviesa cambios.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 06 — LA PRIMERA CONEXIÓN (PREGUNTA 1)
  screen06: {
    eyebrow: 'CONEXIÓN DE VARIABLES',
    lead1: 'Entonces...',
    lead2: '¿podría el momento del ciclo ser una pieza de información?',
    questionIntro: 'Si una situación se repite aproximadamente en determinados momentos...',
    question: '¿Te parecería útil saber en qué momento del ciclo se encontraba?',
    options: [
      {
        id: 'opt_useful',
        code: 'A',
        label: 'Sí, podría aportar información.',
        feedback: 'Puede ser una pieza útil de contexto.',
      },
      {
        id: 'opt_maybe',
        code: 'B',
        label: 'Tal vez.',
        feedback: 'Es razonable mantener la duda.',
      },
      {
        id: 'opt_not_necessarily',
        code: 'C',
        label: 'No necesariamente.',
        feedback: 'El ciclo no explica todo.',
      },
      {
        id: 'opt_depends',
        code: 'D',
        label: 'Dependería de la persona.',
        feedback: 'Esa variabilidad individual es importante.',
      },
    ] as ChoiceOption[],
    convergenceLead: 'Pero hay algo que sí podemos comprobar.',
    ctaLabel: 'VOLVER AL CASO',
  },

  // SCREEN 07 — COMPARACIÓN DE MOMENTOS
  screen07: {
    eyebrow: 'ANÁLISIS DE CASO // REGISTROS',
    moments: [
      {
        number: '01',
        title: 'MOMENTO 01',
        traits: ['Conversación fluida.', 'Más energía.', 'Planes a futuro.'],
      },
      {
        number: '02',
        title: 'MOMENTO 02',
        traits: ['Más cansancio.', 'Menos paciencia.', 'Necesidad de espacio.'],
      },
      {
        number: '03',
        title: 'MOMENTO 03',
        traits: ['Mayor cercanía.', 'Más apertura.', 'Más iniciativa.'],
      },
    ] as ComparisonMomentItem[],
    reflection1: '¿Y si no fueran tres situaciones aisladas?',
    reflection2: '¿Y si formaran parte de un mismo patrón?',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 08 — LO QUE ESTO NO SIGNIFICA (CIENCIA Y RIGOR)
  screen08: {
    eyebrow: 'MARCO CIENTÍFICO // LÍMITES',
    warningLead: 'Pero cuidado.',
    point1: 'Esto NO significa que el ciclo dicte cómo se comportará una mujer.',
    point2: 'No significa que puedas mirar una fase y saber exactamente cómo se sentirá.',
    point3: 'No significa que todo lo que ocurre en una relación tenga una explicación hormonal.',
    transitionLead: 'Significa algo mucho más sencillo.',
    dominantReveal: 'Que ahora tienes una pieza más de información.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 09 — LA VARIABLE OCULTA
  screen09: {
    eyebrow: 'NUEVA VARIABLE EN EL MAPA',
    beat1: 'Antes...',
    beat2: 'veías solamente el comportamiento.',
    beat3: 'Ahora puedes considerar...',
    dominantReveal: 'EL MOMENTO DEL CICLO.',
    closure: 'Una variable que antes no estaba en tu mapa.',
    ctaLabel: 'VER EL CALENDARIO',
  },

  // SCREEN 10 — EL CALENDARIO & PREFERENCIA (PREGUNTA 2)
  screen10: {
    eyebrow: 'LÍNEA TEMPORAL',
    timelineDays: [
      { dayNumber: 1, label: 'Día 01', phaseHint: 'Menstruación' },
      { dayNumber: 7, label: 'Día 07', phaseHint: 'Fase Folicular' },
      { dayNumber: 14, label: 'Día 14', phaseHint: 'Ovulación' },
      { dayNumber: 21, label: 'Día 21', phaseHint: 'Fase Lútea' },
    ],
    timelineLead1: 'El ciclo puede registrarse a través del tiempo.',
    timelineLead2: 'Y observarse.',
    timelineLead3: 'Y contextualizarse.',
    questionIntro: 'Si pudieras conocer una información antes de enfrentar una situación difícil...',
    question: '¿Qué preferirías?',
    options: [
      {
        id: 'opt_what_happened',
        code: 'A',
        label: 'Saber qué pasó.',
        feedback: 'Conocer los hechos objetivos es siempre un punto de partida.',
      },
      {
        id: 'opt_what_she_feels',
        code: 'B',
        label: 'Saber qué siente.',
        feedback: 'La empatía directa busca sintonizar con su estado interior.',
      },
      {
        id: 'opt_where_she_is',
        code: 'C',
        label: 'Saber en qué momento está.',
        feedback: 'Ubicar la coordenada temporal te da perspectiva sobre sus recursos.',
      },
      {
        id: 'opt_more_context',
        code: 'D',
        label: 'Tener más contexto antes de reaccionar.',
        feedback: 'Tener el mapa completo antes de responder cambia todo el resultado.',
      },
    ] as ChoiceOption[],
    microRevelation1: 'Porque quizá...',
    microRevelation2: '...la verdadera ventaja no está en reaccionar mejor después.',
    microRevelationDominant: 'Está en comprender mejor antes.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 11 — LA NUEVA PREGUNTA
  screen11: {
    eyebrow: 'NUEVA POSIBILIDAD',
    beat1: 'Ahora tenemos una nueva posibilidad.',
    beat2: 'Si conocemos el ciclo...',
    beat3: 'podemos conocer el momento.',
    beat4: 'Y si conocemos el momento...',
    beat5: 'podemos añadir contexto.',
    pauseLead: 'Pero queda una pregunta.',
    dominantQuestion: '¿Cómo utilizar esa información en la vida real?',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 12 — LA PIEZA FALTANTE
  screen12: {
    eyebrow: 'SÍNTESIS DE INVESTIGACIÓN',
    beat1: 'Eso era lo que faltaba.',
    beat2: 'No una explicación para todo.',
    beat3: 'No una fórmula para entenderla.',
    beat4: 'No una manera de predecirla.',
    dominantReveal: 'Una forma de tener contexto.',
    beat5: 'Antes de reaccionar.',
    beat6: 'Antes de asumir.',
    beat7: 'Antes de preguntar...',
    beat8: '...podrías saber algo más.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 13 — TRANSICIÓN A CONTEXTO™
  screen13: {
    eyebrow: 'UMBRAL DE ACCIÓN',
    beat1: 'Encontramos la pieza.',
    beat2: 'Ahora necesitamos descubrir cómo convertir esa información...',
    beat3: '...en algo que puedas utilizar.',
    dominantReveal: 'Eso es lo siguiente.',
    ctaLabel: 'DESCUBRIR CÓMO FUNCIONA',
  },
};
