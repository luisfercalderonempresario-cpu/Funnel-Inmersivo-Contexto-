// Declarative Experience Engine Definition for EXP_05 (La Pieza Faltante) — P0 #04 CTX_E05_V01_MISSING_PIECE
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP05_CONTENT } from './exp05Content';

export const EXP05_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp05',
  slug: 'la-pieza-faltante',
  title: 'La Pieza Faltante',
  number: 5,
  initialScreen: 'screen_01_opening',
  screens: {
    // 1. APERTURA CINEMATOGRÁFICA
    screen_01_opening: {
      id: 'screen_01_opening',
      type: 'INTRO',
      title: EXP05_CONTENT.opening.lead,
      subtitle: EXP05_CONTENT.opening.subLead,
      eyebrow: 'EXPEDIENTE #05',
      nextScreen: 'screen_02_cinematic',
      actions: [
        {
          type: 'CLICK',
          label: EXP05_CONTENT.opening.ctaLabel,
          targetScreen: 'screen_02_cinematic',
          payload: { action: 'reveal_piece' },
          memoryUpdates: [
            {
              key: 'exp05.started',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // 2. MODO CINEMATOGRÁFICO
    screen_02_cinematic: {
      id: 'screen_02_cinematic',
      type: 'CONTENT',
      title: 'La Pieza Faltante',
      eyebrow: 'PROCESO DE INVESTIGACIÓN',
      nextScreen: 'screen_03_revelation',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_03_revelation',
        },
      ],
    },

    // 3. PRIMERA REVELACIÓN (CONTINUIDAD VISUAL + VARIABLE)
    screen_03_revelation: {
      id: 'screen_03_revelation',
      type: 'CONTENT',
      title: EXP05_CONTENT.variableReveal.beat3,
      subtitle: `${EXP05_CONTENT.variableReveal.beat1} ${EXP05_CONTENT.variableReveal.beat2}`,
      eyebrow: 'REVELACIÓN',
      nextScreen: 'screen_04_reveal_guardrails',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_04_reveal_guardrails',
        },
      ],
    },

    // 4. GRAN REVEAL & GUARDRAILS
    screen_04_reveal_guardrails: {
      id: 'screen_04_reveal_guardrails',
      type: 'CONTENT',
      title: `${EXP05_CONTENT.greatReveal.titleLine1} ${EXP05_CONTENT.greatReveal.titleLine2}`,
      subtitle: EXP05_CONTENT.guardrails.intro,
      eyebrow: 'VARIABLE DE CONTEXTO',
      nextScreen: 'screen_05_phases',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_05_phases',
        },
      ],
    },

    // 5. CUATRO FASES & SEGURIDAD CONCEPTUAL
    screen_05_phases: {
      id: 'screen_05_phases',
      type: 'CONTENT',
      title: EXP05_CONTENT.safetyPhrase.title,
      subtitle: `${EXP05_CONTENT.safetyPhrase.beat1} ${EXP05_CONTENT.safetyPhrase.beat2}`,
      eyebrow: 'ESTRUCTURA CÍCLICA',
      nextScreen: 'screen_06_demonstration',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_06_demonstration',
        },
      ],
    },

    // 6. DEMOSTRACIÓN — MISMA SEÑAL & NUEVA PERSPECTIVA
    screen_06_demonstration: {
      id: 'screen_06_demonstration',
      type: 'CONTENT',
      title: EXP05_CONTENT.insight.quote1,
      subtitle: EXP05_CONTENT.insight.quote2,
      eyebrow: 'REINTERPRETACIÓN',
      nextScreen: 'screen_07_mechanism_contexto',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_07_mechanism_contexto',
        },
      ],
    },

    // 7. MECANISMO & CONTEXTO™
    screen_07_mechanism_contexto: {
      id: 'screen_07_mechanism_contexto',
      type: 'TRANSITION',
      title: EXP05_CONTENT.contexto.brand,
      subtitle: EXP05_CONTENT.contexto.description,
      eyebrow: 'ARQUITECTURA DE CONTEXTO',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.finalCta.label,
          targetScreen: 'complete',
          payload: { action: 'understand_contexto' },
          memoryUpdates: [
            {
              key: 'exp05.completed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },
  },
};
