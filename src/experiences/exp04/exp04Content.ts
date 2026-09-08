// Content Dictionary for EXP_04 (La Investigación) — P0 #03 CTX_E04_V02_TIMELINE
// Contexto™ Narrative Experience

export interface Exp04PatternOption {
  id: string;
  label: string;
}

export const EXP04_CONTENT = {
  // 1. APERTURA
  screen01: {
    eyebrow: 'EXPEDIENTE #04 — LA INVESTIGACIÓN',
    leadTitle: 'HAY UNA FORMA DISTINTA\nDE MIRAR UNA RELACIÓN.',
    leadBeat1: 'No buscando respuestas primero…',
    leadBeat2: 'Sino observando patrones.',
    ctaLabel: 'COMENZAR INVESTIGACIÓN',
  },

  // 2. MODO CINEMATOGRÁFICO
  cinematic: {
    assetUrl: 'https://media.manualparanovios.com/CTX_E04_V02_TIMELINE.mp4',
  },

  // 3. TIMELINE INTERACTIVO
  timeline: {
    months: [
      { id: 'julio', name: 'JULIO', upperDay: 9, lowerDay: 23 },
      { id: 'agosto', name: 'AGOSTO', upperDay: 6, lowerDay: 20 },
      { id: 'septiembre', name: 'SEPTIEMBRE', upperDay: 3, lowerDay: 17 },
    ],
  },

  // 4. REVELACIÓN PROGRESIVA
  revelation: {
    beat1: 'HAY ALGO QUE CAMBIA.',
    beat2: 'TIENE UN RITMO.',
    beat3: 'SE REPITE.',
  },

  // 5. NUEVO INSIGHT
  insight: {
    beat1: 'No todos los días son iguales.',
    beat2: 'Y no todo lo que cambia…',
    beat3: '…se ve desde fuera.',
  },

  // 6. PARTICIPACIÓN DE ANDRÉS
  question: {
    lead: 'Si algo parece repetirse con cierto ritmo…',
    mainQuestion: '¿Lo considerarías antes de sacar una conclusión?',
    options: [
      { id: 'opt_yes', label: 'Sí' },
      { id: 'opt_probably', label: 'Probablemente' },
      { id: 'opt_not_sure', label: 'No estoy seguro' },
    ] as Exp04PatternOption[],
  },

  // 7. RESPUESTA DEL SISTEMA
  systemResponse: {
    beat1: 'Eso es investigar el contexto.',
    beat2: 'No asumir que ya sabes qué significa una señal.',
    beat3: 'Buscar qué información podría estar faltando.',
  },

  // 8. GRAN PREGUNTA
  bigQuestion: {
    beat1: 'Hay una variable que puede aportar contexto…',
    beat2: '…a determinados momentos.',
    beat3: 'Pero todavía no sabemos cuál es.',
    dominantTitle: '¿QUÉ ESTAMOS VIENDO?',
    clueEyebrow: 'PISTA ENCONTRADA',
    clueText: 'Hay una pieza del contexto que todavía no hemos identificado.',
  },

  // 9. CTA FINAL
  finalCta: {
    label: 'DESCUBRIR LA PIEZA FALTANTE',
  },
};
