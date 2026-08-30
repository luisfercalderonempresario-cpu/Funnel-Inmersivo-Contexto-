// Declarative Experience Engine Definition for EXP_05 (La Pieza Faltante) - Contexto™ Narrative Experience V1.0
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP05_CONTENT } from './exp05Content';

export const EXP05_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp05',
  slug: 'la-pieza-faltante',
  title: 'La Pieza Faltante',
  number: 5,
  initialScreen: 'screen_01_clue',
  screens: {
    // SCREEN 01 — LA PISTA
    screen_01_clue: {
      id: 'screen_01_clue',
      type: 'INTRO',
      title: EXP05_CONTENT.screen01.beat1,
      subtitle: `${EXP05_CONTENT.screen01.beat2} ${EXP05_CONTENT.screen01.beat3}`,
      eyebrow: EXP05_CONTENT.screen01.eyebrow,
      nextScreen: 'screen_02_different_variable',
      actions: [
        {
          type: 'CLICK',
          label: EXP05_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_different_variable',
          payload: { action: 'start_clue_investigation' },
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

    // SCREEN 02 — UNA VARIABLE DIFERENTE
    screen_02_different_variable: {
      id: 'screen_02_different_variable',
      type: 'CONTENT',
      title: EXP05_CONTENT.screen02.dominantQuestion,
      subtitle: `${EXP05_CONTENT.screen02.lead1} ${EXP05_CONTENT.screen02.lead2} ${EXP05_CONTENT.screen02.lead3}`,
      eyebrow: EXP05_CONTENT.screen02.eyebrow,
      nextScreen: 'screen_03_body_changes',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_body_changes',
          payload: { action: 'proceed_to_body_changes' },
        },
      ],
    },

    // SCREEN 03 — EL CUERPO TAMBIÉN CAMBIA
    screen_03_body_changes: {
      id: 'screen_03_body_changes',
      type: 'CONTENT',
      title: EXP05_CONTENT.screen03.beat2,
      subtitle: `${EXP05_CONTENT.screen03.beat1} ${EXP05_CONTENT.screen03.beat3} ${EXP05_CONTENT.screen03.beat5}`,
      eyebrow: EXP05_CONTENT.screen03.eyebrow,
      nextScreen: 'screen_04_cycle',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen03.ctaLabel,
          targetScreen: 'screen_04_cycle',
          payload: { action: 'proceed_to_cycle' },
        },
      ],
    },

    // SCREEN 04 — EL CICLO
    screen_04_cycle: {
      id: 'screen_04_cycle',
      type: 'CONTENT',
      title: EXP05_CONTENT.screen04.conceptLabel,
      subtitle: `${EXP05_CONTENT.screen04.beat1} ${EXP05_CONTENT.screen04.beat2} ${EXP05_CONTENT.screen04.beat3}`,
      eyebrow: EXP05_CONTENT.screen04.eyebrow,
      nextScreen: 'screen_05_four_moments',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen04.ctaLabel,
          targetScreen: 'screen_05_four_moments',
          payload: { action: 'proceed_to_four_moments' },
        },
      ],
    },

    // SCREEN 05 — CUATRO MOMENTOS
    screen_05_four_moments: {
      id: 'screen_05_four_moments',
      type: 'CONTENT',
      title: EXP05_CONTENT.screen05.closure1,
      subtitle: `${EXP05_CONTENT.screen05.closure2} ${EXP05_CONTENT.screen05.closure3}`,
      eyebrow: EXP05_CONTENT.screen05.eyebrow,
      nextScreen: 'screen_06_first_connection',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_first_connection',
          payload: { action: 'proceed_to_first_connection' },
        },
      ],
    },

    // SCREEN 06 — LA PRIMERA CONEXIÓN (PREGUNTA 1)
    screen_06_first_connection: {
      id: 'screen_06_first_connection',
      type: 'QUESTION',
      title: EXP05_CONTENT.screen06.question,
      subtitle: EXP05_CONTENT.screen06.lead2,
      eyebrow: EXP05_CONTENT.screen06.eyebrow,
      nextScreen: 'screen_07_comparison',
      options: EXP05_CONTENT.screen06.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_07_comparison',
        memoryUpdates: [
          {
            key: 'exp05.cycleContextHypothesis',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp05.cycleContextHypothesisCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp05.question01Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen06.ctaLabel,
          targetScreen: 'screen_07_comparison',
          payload: { action: 'proceed_to_comparison' },
        },
      ],
    },

    // SCREEN 07 — COMPARACIÓN
    screen_07_comparison: {
      id: 'screen_07_comparison',
      type: 'CONTENT',
      title: EXP05_CONTENT.screen07.reflection1,
      subtitle: EXP05_CONTENT.screen07.reflection2,
      eyebrow: EXP05_CONTENT.screen07.eyebrow,
      nextScreen: 'screen_08_limits',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen07.ctaLabel,
          targetScreen: 'screen_08_limits',
          payload: { action: 'proceed_to_limits' },
        },
      ],
    },

    // SCREEN 08 — LO QUE ESTO NO SIGNIFICA
    screen_08_limits: {
      id: 'screen_08_limits',
      type: 'CONTENT',
      title: EXP05_CONTENT.screen08.dominantReveal,
      subtitle: `${EXP05_CONTENT.screen08.warningLead} ${EXP05_CONTENT.screen08.point1}`,
      eyebrow: EXP05_CONTENT.screen08.eyebrow,
      nextScreen: 'screen_09_hidden_variable',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen08.ctaLabel,
          targetScreen: 'screen_09_hidden_variable',
          payload: { action: 'proceed_to_hidden_variable' },
          memoryUpdates: [
            {
              key: 'exp05.cycleRecognizedAsContext',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 09 — LA VARIABLE OCULTA
    screen_09_hidden_variable: {
      id: 'screen_09_hidden_variable',
      type: 'CONTENT',
      title: EXP05_CONTENT.screen09.dominantReveal,
      subtitle: `${EXP05_CONTENT.screen09.beat1} ${EXP05_CONTENT.screen09.beat2} ${EXP05_CONTENT.screen09.closure}`,
      eyebrow: EXP05_CONTENT.screen09.eyebrow,
      nextScreen: 'screen_10_calendar',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen09.ctaLabel,
          targetScreen: 'screen_10_calendar',
          payload: { action: 'proceed_to_calendar' },
        },
      ],
    },

    // SCREEN 10 — EL CALENDARIO & PREFERENCIA (PREGUNTA 2)
    screen_10_calendar: {
      id: 'screen_10_calendar',
      type: 'QUESTION',
      title: EXP05_CONTENT.screen10.question,
      subtitle: EXP05_CONTENT.screen10.microRevelationDominant,
      eyebrow: EXP05_CONTENT.screen10.eyebrow,
      nextScreen: 'screen_11_new_question',
      options: EXP05_CONTENT.screen10.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_11_new_question',
        memoryUpdates: [
          {
            key: 'exp05.informationPreference',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp05.informationPreferenceCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp05.question02Answered',
            value: true,
            scope: 'global',
          },
          {
            key: 'exp05.contextNeedRecognized',
            value: true,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen10.ctaLabel,
          targetScreen: 'screen_11_new_question',
          payload: { action: 'proceed_to_new_question' },
        },
      ],
    },

    // SCREEN 11 — LA NUEVA PREGUNTA
    screen_11_new_question: {
      id: 'screen_11_new_question',
      type: 'CONTENT',
      title: EXP05_CONTENT.screen11.dominantQuestion,
      subtitle: `${EXP05_CONTENT.screen11.beat1} ${EXP05_CONTENT.screen11.beat3} ${EXP05_CONTENT.screen11.beat5}`,
      eyebrow: EXP05_CONTENT.screen11.eyebrow,
      nextScreen: 'screen_12_missing_piece',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen11.ctaLabel,
          targetScreen: 'screen_12_missing_piece',
          payload: { action: 'proceed_to_missing_piece' },
        },
      ],
    },

    // SCREEN 12 — LA PIEZA FALTANTE
    screen_12_missing_piece: {
      id: 'screen_12_missing_piece',
      type: 'CONTENT',
      title: EXP05_CONTENT.screen12.dominantReveal,
      subtitle: `${EXP05_CONTENT.screen12.beat1} ${EXP05_CONTENT.screen12.beat5} ${EXP05_CONTENT.screen12.beat8}`,
      eyebrow: EXP05_CONTENT.screen12.eyebrow,
      nextScreen: 'screen_13_transition_contexto',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP05_CONTENT.screen12.ctaLabel,
          targetScreen: 'screen_13_transition_contexto',
          payload: { action: 'proceed_to_transition' },
        },
      ],
    },

    // SCREEN 13 — TRANSICIÓN A CONTEXTO™
    screen_13_transition_contexto: {
      id: 'screen_13_transition_contexto',
      type: 'TRANSITION',
      title: EXP05_CONTENT.screen13.dominantReveal,
      subtitle: `${EXP05_CONTENT.screen13.beat1} ${EXP05_CONTENT.screen13.beat2} ${EXP05_CONTENT.screen13.beat3}`,
      eyebrow: EXP05_CONTENT.screen13.eyebrow,
      actions: [
        {
          type: 'COMPLETE',
          label: EXP05_CONTENT.screen13.ctaLabel,
          payload: { action: 'complete_exp05' },
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
