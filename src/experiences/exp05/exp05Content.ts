// EXP_05 — LA PIEZA FALTANTE (P0 #04 CTX_E05_V01_MISSING_PIECE)
// Contexto™ Narrative Content Definition

export interface PhaseItem {
  id: string;
  label: string;
  roman: string;
}

export const EXP05_CONTENT = {
  // 1. APERTURA CINEMATOGRÁFICA
  opening: {
    lead: 'ENCONTRASTE UN PATRÓN.',
    subLead: 'Pero un patrón no explica por sí solo lo que ocurre.',
    ctaLabel: 'REVELAR LA PIEZA',
  },

  // 2. ASSET CINEMATOGRÁFICO OFICIAL
  cinematic: {
    assetUrl: 'https://media.manualparanovios.com/CTX_E05_V01_MISSING_PIECE.mp4',
  },

  // 3. PRIMERA REVELACIÓN (CONTINUIDAD VISUAL + VARIABLE)
  variableReveal: {
    beat1: 'LA PIEZA QUE FALTABA…',
    beat2: 'NO ERA UNA RESPUESTA.',
    beat3: 'ERA UNA VARIABLE.',
    keyword: 'VARIABLE',
  },

  // 4. GRAN REVEAL
  greatReveal: {
    titleLine1: 'EL CICLO',
    titleLine2: 'MENSTRUAL',
    durationMs: 2500,
  },

  // 5. GUARDRAIL INMEDIATO
  guardrails: {
    intro: 'El ciclo menstrual puede aportar contexto a determinados momentos.',
    items: [
      { prefix: 'NO', text: 'determina cómo se sentirá.' },
      { prefix: 'NO', text: 'explica automáticamente una emoción.' },
      { prefix: 'Y NO', text: 'sustituye preguntarle.' },
    ],
  },

  // 6. EXPLICACIÓN MÍNIMA
  explanation: {
    beat1: 'Durante el ciclo ocurren cambios biológicos.',
    beat2: 'Pero cada mujer puede vivirlos de manera diferente.',
    beat3: 'Por eso el ciclo no es una respuesta.',
    beat4: 'Es una variable más que puedes considerar antes de interpretar.',
  },

  // 7. VISUALIZACIÓN DE LAS CUATRO FASES
  phases: [
    { id: 'menstrual', label: 'MENSTRUAL', roman: '01' },
    { id: 'follicular', label: 'FOLICULAR', roman: '02' },
    { id: 'ovulatory', label: 'OVULATORIA', roman: '03' },
    { id: 'luteal', label: 'LÚTEA', roman: '04' },
  ] as PhaseItem[],

  // 8. FRASE DE SEGURIDAD CONCEPTUAL
  safetyPhrase: {
    title: 'EL CICLO NO ES UN GUION.',
    beat1: 'No te dice exactamente cómo se sentirá.',
    beat2: 'Te da una variable más para interpretar con menos prisa.',
  },

  // 9. DEMOSTRACIÓN — MISMA SEÑAL
  demonstration: {
    actor: 'ELLA',
    signal: '“Sí.”',
    before: {
      eyebrow: 'ANTES DE CONSIDERAR EL CONTEXTO',
      interpretation: '“Está molesta conmigo.”',
    },
    after: {
      eyebrow: 'CON UNA VARIABLE MÁS DE CONTEXTO',
      perspective1: '“Puede haber varias razones.”',
      perspective2: '“No voy a asumir.”',
    },
  },

  // 10. INSIGHT PRINCIPAL
  insight: {
    steps: ['MISMA SEÑAL', 'MÁS CONTEXTO', 'MENOS SUPOSICIÓN'],
    quote1: 'EL CONTEXTO NO TE DA LA RESPUESTA.',
    quote2: 'TE AYUDA A NO INVENTARLA.',
  },

  // 11. CONEXIÓN CON EL MECANISMO
  mechanism: {
    chain: ['SEÑAL', 'CONTEXTO', 'PREGUNTA', 'DECISIÓN', 'CONEXIÓN'],
    takeaway: 'Comprender antes de reaccionar.',
  },

  // 12. INTRODUCCIÓN DE CONTEXTO™
  contexto: {
    brand: 'CONTEXTO™',
    description: 'Una forma de considerar información que antes podías estar pasando por alto.',
  },

  // 13. CTA FINAL
  finalCta: {
    label: 'ENTENDER CONTEXTO™',
  },
};
