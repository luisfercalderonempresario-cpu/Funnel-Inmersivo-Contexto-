// Declarative Experience Engine Definition for EXP_04 (La Investigación) — P0 #03 CTX_E04_V02_TIMELINE
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP04_CONTENT } from './exp04Content';

export const EXP04_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp04',
  slug: 'la-investigacion',
  title: 'La Investigación',
  number: 4,
  initialScreen: 'screen_01_opening',
  screens: {
    // 1. APERTURA
    screen_01_opening: {
      id: 'screen_01_opening',
      type: 'INTRO',
      title: EXP04_CONTENT.screen01.leadTitle,
      subtitle: `${EXP04_CONTENT.screen01.leadBeat1} ${EXP04_CONTENT.screen01.leadBeat2}`,
      eyebrow: EXP04_CONTENT.screen01.eyebrow,
      nextScreen: 'screen_02_cinematic',
      actions: [
        {
          type: 'CLICK',
          label: EXP04_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_cinematic',
          payload: { action: 'start_investigation' },
          memoryUpdates: [
            {
              key: 'exp04.started',
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
      title: 'Timeline de Investigación',
      eyebrow: 'EXPEDIENTE #04',
      nextScreen: 'screen_03_timeline',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_03_timeline',
        },
      ],
    },

    // 3. TIMELINE INTERACTIVO & REVELACIÓN PROGRESIVA
    screen_03_timeline: {
      id: 'screen_03_timeline',
      type: 'CONTENT',
      title: EXP04_CONTENT.revelation.beat3,
      subtitle: `${EXP04_CONTENT.insight.beat1} ${EXP04_CONTENT.insight.beat2}`,
      eyebrow: 'REGISTRO DE OBSERVACIÓN',
      nextScreen: 'screen_04_question',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_04_question',
        },
      ],
    },

    // 4. PARTICIPACIÓN DE ANDRÉS & RESPUESTA DEL SISTEMA
    screen_04_question: {
      id: 'screen_04_question',
      type: 'QUESTION',
      title: EXP04_CONTENT.question.mainQuestion,
      subtitle: EXP04_CONTENT.question.lead,
      eyebrow: 'EVALUACIÓN DE PATRÓN',
      nextScreen: 'screen_05_investigation_mystery',
      options: EXP04_CONTENT.question.options.map((opt) => ({
        id: opt.id,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_05_investigation_mystery',
        memoryUpdates: [
          {
            key: 'exp04.patternConsideration',
            value: opt.label,
            scope: 'global',
          },
        ],
      })),
      actions: [],
    },

    // 5. GRAN PREGUNTA & PISTA ENCONTRADA (TRANSICIÓN A EXP_05)
    screen_05_investigation_mystery: {
      id: 'screen_05_investigation_mystery',
      type: 'TRANSITION',
      title: EXP04_CONTENT.bigQuestion.dominantTitle,
      subtitle: EXP04_CONTENT.bigQuestion.clueText,
      eyebrow: EXP04_CONTENT.bigQuestion.clueEyebrow,
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.finalCta.label,
          targetScreen: 'complete',
          payload: { action: 'discover_missing_piece' },
          memoryUpdates: [
            {
              key: 'exp04.completed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },
  },
};
