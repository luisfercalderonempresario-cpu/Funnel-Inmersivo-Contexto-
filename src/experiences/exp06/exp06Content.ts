// EXP_06 — CONTEXTO™
// Narrative Experience Content Definition V1.0 — Contexto™

export interface StepItem {
  number: string;
  stepCode: '01' | '02' | '03' | '04';
  title: string;
  description: string;
  badge: string;
}

export interface ChoiceOption {
  id: string;
  code: 'A' | 'B' | 'C' | 'D';
  label: string;
  feedback: string;
}

export interface DailyIndexExample {
  tag: string;
  guidance: string;
  reflection: string;
}

export const EXP06_CONTENT = {
  // SCREEN 01 — LA PREGUNTA
  screen01: {
    eyebrow: 'DESCUBRIMIENTO // EXP_06',
    beat1: 'Ya encontramos la pieza.',
    beat2: 'Ahora viene la pregunta importante.',
    beat3: '¿Cómo utilizarla?',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 02 — LA INFORMACIÓN
  screen02: {
    eyebrow: 'EL VALOR DEL TIEMPO',
    beat1: 'Porque saber que el ciclo existe no cambia nada por sí solo.',
    beat2: 'Lo que cambia algo...',
    beat3: '...es tener esa información cuando realmente la necesitas.',
    triggers: [
      { label: 'Antes de una conversación.' },
      { label: 'Antes de interpretar.' },
      { label: 'Antes de reaccionar.' },
    ],
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 03 — EL PROBLEMA PRÁCTICO
  screen03: {
    eyebrow: 'LA FRICCIÓN REAL',
    lead: 'Pero hay un problema.',
    questions: [
      '¿Vas a recordar el ciclo?',
      '¿Vas a calcularlo mentalmente?',
      '¿Vas a buscar una fecha cada vez?',
    ],
    verdict: 'Probablemente no.',
    resolution: 'Necesitas que la información sea fácil de consultar.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 04 — LA IDEA
  screen04: {
    eyebrow: 'NUEVA PREMISA',
    lead: 'Entonces...',
    hypothesis: '¿Y si no tuvieras que adivinar?',
    question: '¿Y si pudieras consultar el contexto del momento?',
    simplicityPoints: [
      'Sin convertirlo en una tarea.',
      'Sin estudiar el ciclo.',
      'Sin memorizar fechas.',
    ],
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 05 — MICRO-INTERACCIÓN & PRIMERA REVELACIÓN
  screen05: {
    eyebrow: 'PRIMERA REVELACIÓN',
    beat1: 'Una herramienta sencilla.',
    beat2: 'Creada para una sola cosa.',
    beat3: 'Recordarte que el momento también importa.',
    beat4: 'Y ayudarte a actuar desde ahí.',
    questionIntro: 'Si pudieras tener una referencia antes de una situación difícil...',
    question: '¿Cómo lo verías?',
    options: [
      {
        id: 'opt_help',
        code: 'A',
        label: 'Me ayudaría.',
        feedback: 'Tener una coordenada inicial reduce la reactividad involuntaria.',
      },
      {
        id: 'opt_try',
        code: 'B',
        label: 'Tendría que probarlo.',
        feedback: 'Comprobar la utilidad en situaciones cotidianas es la vía más objetiva.',
      },
      {
        id: 'opt_unsure',
        code: 'C',
        label: 'No estoy seguro.',
        feedback: 'Es natural mantener la cautela antes de ver cómo encaja en tu dinámica.',
      },
      {
        id: 'opt_talk_directly',
        code: 'D',
        label: 'Preferiría hablar directamente.',
        feedback: 'La comunicación honesta es insustituible. Esto solo busca afinar el momento de entrada.',
      },
    ] as ChoiceOption[],
    convergenceLead: 'Y justamente por eso Contexto™ no pretende reemplazar la conversación.',
    convergenceClosure: 'Busca ayudarte a llegar a ella con más contexto.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 06 — NACE CONTEXTO™
  screen06: {
    eyebrow: 'SÍNTESIS',
    lead: 'Una forma de tener contexto.',
    brandName: 'CONTEXTO™',
    tagline: 'Una Micro-App creada para ayudarte a comprender mejor el momento que estás viviendo con tu pareja.',
    ctaLabel: 'VER CÓMO FUNCIONA',
  },

  // SCREEN 07 — CÓMO FUNCIONA
  screen07: {
    eyebrow: 'ARQUITECTURA // 4 PASOS',
    steps: [
      {
        number: '01',
        stepCode: '01',
        title: 'Registras el inicio de su ciclo.',
        description: 'Una única referencia temporal como punto de partida.',
        badge: 'DATO',
      },
      {
        number: '02',
        stepCode: '02',
        title: 'Contexto™ calcula el momento aproximado.',
        description: 'Sitúa la coordenada estimada dentro del continuo biológico.',
        badge: 'MOMENTO',
      },
      {
        number: '03',
        stepCode: '03',
        title: 'Te muestra información relevante sobre esa etapa.',
        description: 'Recursos energéticos, sensibilidad biológica y predisposición.',
        badge: 'CONTEXTO',
      },
      {
        number: '04',
        stepCode: '04',
        title: 'Te ayuda a considerar qué podría ser útil hacer o evitar.',
        description: 'Orientaciones claras para afinar tu respuesta antes de actuar.',
        badge: 'ACCIÓN',
      },
    ] as StepItem[],
    closingNote: 'Sin tecnicismos. Sin complicaciones. Solo la referencia necesaria.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 08 — EL DATO QUE NECESITAS
  screen08: {
    eyebrow: 'SIMPLICIDAD DE ENTRADA',
    beat1: 'Solo necesitas un dato.',
    dominantData: 'El primer día de su menstruación.',
    beat2: 'Desde ahí...',
    beat3: 'Contexto™ puede ayudarte a ubicar el momento aproximado del ciclo.',
    clarification: 'Sin requerir calendarios complejos ni cálculos mentales.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 09 — EL ÍNDICE DE CONEXIÓN DIARIA™
  screen09: {
    eyebrow: 'ORIENTACIÓN COTIDIANA',
    lead1: 'Pero saber la fase no es suficiente.',
    lead2: 'Necesitas saber qué hacer con esa información.',
    dominantConcept: 'ÍNDICE DE CONEXIÓN DIARIA™',
    conceptSubtitle: 'Una orientación breve para el día.',
    pillars: [
      { text: 'Qué podría ser útil.' },
      { text: 'Qué conviene considerar.' },
      { text: 'Qué conversación podría ayudar.' },
      { text: 'Qué gesto puede acercarlos.' },
    ],
    examples: [
      {
        tag: 'CONSIDERACIÓN',
        guidance: 'Hoy puede ser mejor escuchar.',
        reflection: 'Priorizar la recepción silenciosa sobre el intento de resolver.',
      },
      {
        tag: 'PERSPECTIVA',
        guidance: 'Hoy quizá conviene no asumir.',
        reflection: 'Dar espacio a que la emoción se asiente sin tomarla como ataque personal.',
      },
      {
        tag: 'ACERCAMIENTO',
        guidance: 'Un gesto pequeño puede importar.',
        reflection: 'Aliviar una carga cotidiana sin exigir una conversación profunda a cambio.',
      },
    ] as DailyIndexExample[],
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 10 — UNA SITUACIÓN REAL
  screen10: {
    eyebrow: 'CASO DE APLICACIÓN',
    situationBeats: [
      'Imagina que llegas a casa.',
      'Ella está más cansada.',
      'Habla menos.',
      'Tú podrías pensar...',
      '“¿Está molesta conmigo?”',
    ],
    pivotLead: 'Pero ahora tienes una pregunta adicional.',
    pivotQuestion: '¿En qué momento del ciclo está?',
    resolution1: 'Eso no te da la respuesta.',
    resolutionDominant: 'Pero te da contexto.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 11 — ANTES / DESPUÉS
  screen11: {
    eyebrow: 'TRANSFORMACIÓN DE RESPUESTA',
    beforeTitle: 'ANTES // SIN CONTEXTO',
    beforeFlow: [
      'Ella está distante.',
      '¿Qué hice?',
      '¿Está molesta?',
      '¿Qué debería hacer?',
    ],
    afterTitle: 'DESPUÉS // CON CONTEXTO™',
    afterFlow: [
      'Ella está diferente.',
      'Primero observo.',
      'Considero el contexto.',
      'Después converso.',
      'Y entonces decido cómo actuar.',
    ],
    dialogueNote: 'El contexto no sustituye la conversación. Te prepara para que sea más clara.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 12 — LO QUE CONTEXTO™ NO HACE
  screen12: {
    eyebrow: 'LÍMITES Y RIGOR',
    warningLead: 'Pero hay algo que Contexto™ NO hace.',
    limits: [
      'No te dice exactamente cómo se siente.',
      'No predice su comportamiento.',
      'No convierte el ciclo en una explicación para cada discusión.',
      'No reemplaza hablar con ella.',
    ],
    closurePrinciple: 'Porque comprender no significa asumir.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 13 — LO QUE SÍ PUEDE HACER
  screen13: {
    eyebrow: 'PROPÓSITO CENTRAL',
    lead1: 'Lo que sí puede hacer...',
    lead2: '...es darte una pieza más de información.',
    coordinates: ['Una referencia.', 'Un momento.', 'Un contexto.'],
    centralPromise: 'Para que puedas comprender antes de reaccionar.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 14 — TRANSICIÓN A EL FUTURO
  screen14: {
    eyebrow: 'EL SIGUIENTE PASO',
    lead1: 'Ahora ya sabes qué es Contexto™.',
    lead2: 'Pero conocer una herramienta...',
    lead3: '...es diferente a imaginar cómo podría cambiar tu día a día.',
    questionIntro: 'Porque la verdadera pregunta ahora es...',
    dominantQuestion: '¿Cómo sería tu relación si tuvieras ese contexto antes de reaccionar?',
    ctaLabel: 'VER EL FUTURO',
  },
};
