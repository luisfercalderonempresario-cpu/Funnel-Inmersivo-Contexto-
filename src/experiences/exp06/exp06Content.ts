// EXP_06 — CONTEXTO™ (P0 #05 CTX_E06_V01_SAME_SIGNAL)
// Narrative & Demonstration Content Definition

export interface MechanismStep {
  name: string;
  description: string;
}

export const EXP06_CONTENT = {
  // 1. CONTINUIDAD DESDE EXP_05 & APERTURA
  opening: {
    lead: 'YA ENCONTRASTE LA VARIABLE.',
    subLead: 'Ahora veamos qué cambia cuando la consideras antes de reaccionar.',
    ctaLabel: 'VER LA DIFERENCIA',
  },

  // 2. ASSET CINEMATOGRÁFICO OFICIAL
  cinematic: {
    assetUrl: 'https://media.manualparanovios.com/CTX_E06_V01_SAME_SIGNAL.mp4',
  },

  // 4 & 5. CONTINUIDAD DEL ÚLTIMO FRAME Y PRINCIPIO
  signal: {
    actor: 'NOVIA',
    text: '“Sí.”',
    cleanText: 'Sí.',
    principleTitle: 'MISMA SEÑAL.',
    principleSubtitle: 'Pero una señal no viene con una interpretación incluida.',
  },

  // 6. INTERPRETACIÓN AUTOMÁTICA
  automaticInterpretation: {
    eyebrowObservable: 'HECHO OBSERVABLE',
    eyebrowInterpretation: 'TU PRIMERA INTERPRETACIÓN',
    interpretationText: '“Está molesta conmigo.”',
    fastBeat1: 'Eso puede ocurrir en segundos.',
    fastBeat2: 'Recibes una señal…',
    fastBeat3: '…y tu mente completa lo que falta.',
  },

  // 7. DETENER LA INTERPRETACIÓN (PAUSA)
  pauseInterruption: {
    chainSteps: ['SEÑAL', 'INTERPRETACIÓN', 'PAUSA'],
    question: '¿Y si antes de reaccionar consideraras una información más?',
  },

  // 8. ENTRA CONTEXTO™
  contextLayer: {
    brand: 'CONTEXTO™',
    cardEyebrow: 'CONTEXTO DE HOY',
    cardBody:
      'Por el momento del ciclo en el que podría encontrarse, hoy puede ser un día en el que necesite un poco más de calma y menos presión.',
    guardrailNotUpset: 'Eso NO significa que esté molesta contigo.',
    guardrailNotConclude:
      'Es solo una razón más para no sacar conclusiones demasiado rápido.',
  },

  // 9. CAMBIO DE PERSPECTIVA
  perspectiveShift: {
    eyebrow: 'CON MÁS CONTEXTO',
    thought1: '“Puede haber otras razones.”',
    thought2: '“No voy a asumir todavía.”',
  },

  // 10. MOMENTO WOW & COMPARACIÓN
  wowComparison: {
    beforeLabel: 'ANTES',
    beforeSignal: '“Sí.”',
    beforeInterpretation: '“Está molesta conmigo.”',
    afterLabel: 'AHORA',
    afterSignal: '“Sí.”',
    afterStep1: '“Puede haber otras razones.”',
    afterStep2: '“No voy a asumir todavía.”',
    coreInsight1: 'LA SEÑAL NO CAMBIÓ.',
    coreInsight2: 'TÚ SÍ CAMBIASTE LA FORMA DE MIRARLA.',
  },

  // 11. DE INTERPRETACIÓN A CONVERSACIÓN
  conversation: {
    transitionBeat1: 'Entonces, en lugar de reaccionar a una conclusión…',
    transitionBeat2: '…puedes acercarte con una pregunta.',
    actor: 'ANDRÉS',
    question: '“¿Cómo estuvo tu día?”',
  },

  // 12. MECANISMO VISUAL
  mechanism: {
    steps: [
      {
        name: 'CONTEXTO',
        description: 'Considera información adicional.',
      },
      {
        name: 'INTERPRETAR',
        description: 'No asumas demasiado rápido.',
      },
      {
        name: 'ANTICIPAR',
        description: 'Piensa antes de reaccionar.',
      },
      {
        name: 'ACTUAR',
        description: 'Acércate con intención.',
      },
      {
        name: 'CONECTAR',
        description: 'Abre espacio para una mejor conversación.',
      },
    ] as MechanismStep[],
  },

  // 13. DEFINICIÓN DE CONTEXTO™
  definition: {
    brand: 'CONTEXTO™',
    tagline:
      'Una micro-app diseñada para darte una referencia diaria que puede ayudarte a considerar el contexto antes de interpretar.',
    guardrails: [
      'No te dice cómo se siente ella.',
      'No pretende predecirla.',
      'No sustituye hablar con ella.',
    ],
    closure: 'Te ayuda a llegar mejor preparado a esa conversación.',
  },

  // 14. DE MECANISMO A EXPERIENCIA (CATEGORÍAS CONCEPTUALES)
  categories: {
    intro1: 'Y no necesitas convertirte en experto en el ciclo.',
    intro2: 'Contexto™ traduce esa información en algo que puedas usar en tu día.',
    items: ['HOY', 'COMPRENDER', 'ACERCARTE', 'ESCUCHAR', 'EVITAR'],
  },

  // 15. PUENTE HACIA LA PRUEBA
  bridge: {
    beat1: 'Ya viste la diferencia.',
    beat2: 'Ahora puedes experimentarla tú mismo.',
    beat3: 'Vamos a usar un caso sencillo.',
    ctaLabel: 'PROBAR CONTEXTO™',
  },
};
