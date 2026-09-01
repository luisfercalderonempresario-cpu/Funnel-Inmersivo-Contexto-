// Declarative Experience Engine Definition for EXP_07 (La Prueba) - Contexto™ Interactive Demo V2.0
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP07_CONTENT } from './exp07Content';

export const EXP07_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp07',
  slug: 'la-prueba',
  title: 'La Prueba',
  number: 7,
  initialScreen: 'screen_01_the_shift',
  screens: {
    // SCREEN 01 — EL CAMBIO
    screen_01_the_shift: {
      id: 'screen_01_the_shift',
      type: 'INTRO',
      title: EXP07_CONTENT.screen01.beat1,
      subtitle: `${EXP07_CONTENT.screen01.beat2} ${EXP07_CONTENT.screen01.beat3}`,
      eyebrow: EXP07_CONTENT.screen01.eyebrow,
      nextScreen: 'screen_02_lets_try_it',
      actions: [
        {
          type: 'CLICK',
          label: EXP07_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_lets_try_it',
          payload: { action: 'start_exp07' },
          memoryUpdates: [
            {
              key: 'exp07.started',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp07.demoCase',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 02 — VAMOS A PROBARLO
    screen_02_lets_try_it: {
      id: 'screen_02_lets_try_it',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen02.beat1,
      subtitle: `${EXP07_CONTENT.screen02.beat2} ${EXP07_CONTENT.screen02.beat3}`,
      eyebrow: EXP07_CONTENT.screen02.eyebrow,
      nextScreen: 'screen_03_the_case',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_the_case',
          payload: { action: 'proceed_to_the_case' },
        },
      ],
    },

    // SCREEN 03 — EL CASO
    screen_03_the_case: {
      id: 'screen_03_the_case',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen03.title,
      subtitle: EXP07_CONTENT.screen03.beat1,
      eyebrow: EXP07_CONTENT.screen03.eyebrow,
      nextScreen: 'screen_04_the_data',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen03.ctaLabel,
          targetScreen: 'screen_04_the_data',
          payload: { action: 'proceed_to_the_data' },
          memoryUpdates: [
            {
              key: 'exp07.demoDate',
              value: '2026-08-25',
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 04 — EL DATO
    screen_04_the_data: {
      id: 'screen_04_the_data',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen04.dateTag,
      subtitle: EXP07_CONTENT.screen04.beat1,
      eyebrow: EXP07_CONTENT.screen04.eyebrow,
      nextScreen: 'screen_05_analyzing',
      actions: [
        {
          type: 'SUBMIT',
          label: EXP07_CONTENT.screen04.ctaLabel,
          targetScreen: 'screen_05_analyzing',
          payload: { action: 'analyze_demo_data' },
        },
      ],
    },

    // SCREEN 05 — MOTOR CONTEXTUAL
    screen_05_analyzing: {
      id: 'screen_05_analyzing',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen05.headline,
      subtitle: EXP07_CONTENT.screen05.subheadline,
      eyebrow: EXP07_CONTENT.screen05.eyebrow,
      nextScreen: 'screen_06_the_context',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_the_context',
          payload: { action: 'proceed_to_the_context' },
          memoryUpdates: [
            {
              key: 'exp07.analysisCompleted',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 06 — EL CONTEXTO
    screen_06_the_context: {
      id: 'screen_06_the_context',
      type: 'CONTENT',
      title: 'Contexto de Hoy',
      subtitle: 'Estimación orientativa del ciclo',
      eyebrow: EXP07_CONTENT.screen06.eyebrow,
      nextScreen: 'screen_07_not_just_phase',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen06.ctaLabel,
          targetScreen: 'screen_07_not_just_phase',
          payload: { action: 'proceed_to_not_just_phase' },
          memoryUpdates: [
            {
              key: 'exp07.demoContextExperienced',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 07 — LO IMPORTANTE NO ES LA FASE
    screen_07_not_just_phase: {
      id: 'screen_07_not_just_phase',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen07.title,
      subtitle: EXP07_CONTENT.screen07.dominantWord,
      eyebrow: EXP07_CONTENT.screen07.eyebrow,
      nextScreen: 'screen_08_situation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen07.ctaLabel,
          targetScreen: 'screen_08_situation',
          payload: { action: 'proceed_to_situation' },
          memoryUpdates: [
            {
              key: 'exp07.disclaimerViewed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 08 — UNA SITUACIÓN REAL
    screen_08_situation: {
      id: 'screen_08_situation',
      type: 'QUESTION',
      title: EXP07_CONTENT.screen08.title,
      subtitle: EXP07_CONTENT.screen08.question,
      eyebrow: EXP07_CONTENT.screen08.eyebrow,
      nextScreen: 'screen_09_context_in_action',
      actions: [
        {
          type: 'SUBMIT',
          label: 'CONTINUAR',
          targetScreen: 'screen_09_context_in_action',
          payload: { action: 'submit_situation_choice' },
        },
      ],
    },

    // SCREEN 09 — CONTEXTO EN ACCIÓN
    screen_09_context_in_action: {
      id: 'screen_09_context_in_action',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen09.title,
      subtitle: EXP07_CONTENT.screen09.beat1,
      eyebrow: EXP07_CONTENT.screen09.eyebrow,
      nextScreen: 'screen_10_better_question',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen09.ctaLabel,
          targetScreen: 'screen_10_better_question',
          payload: { action: 'proceed_to_better_question' },
        },
      ],
    },

    // SCREEN 10 — UNA MEJOR PREGUNTA
    screen_10_better_question: {
      id: 'screen_10_better_question',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen10.title,
      subtitle: EXP07_CONTENT.screen10.takeaway,
      eyebrow: EXP07_CONTENT.screen10.eyebrow,
      nextScreen: 'screen_11_daily_action',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen10.ctaLabel,
          targetScreen: 'screen_11_daily_action',
          payload: { action: 'proceed_to_daily_action' },
          memoryUpdates: [
            {
              key: 'exp07.demoActionViewed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 11 — UNA ACCIÓN PARA HOY
    screen_11_daily_action: {
      id: 'screen_11_daily_action',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen11.title,
      subtitle: EXP07_CONTENT.screen11.ideaBody,
      eyebrow: EXP07_CONTENT.screen11.eyebrow,
      nextScreen: 'screen_12_micro_result',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen11.ctaLabel,
          targetScreen: 'screen_12_micro_result',
          payload: { action: 'proceed_to_micro_result' },
          memoryUpdates: [
            {
              key: 'exp07.connectionMode',
              value: 'UNDERSTAND',
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 12 — EL MICRORESULTADO
    screen_12_micro_result: {
      id: 'screen_12_micro_result',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen12.eyebrow,
      subtitle: EXP07_CONTENT.screen12.closure,
      eyebrow: EXP07_CONTENT.screen12.eyebrow,
      nextScreen: 'screen_13_utility_question',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen12.ctaLabel,
          targetScreen: 'screen_13_utility_question',
          payload: { action: 'proceed_to_utility_question' },
        },
      ],
    },

    // SCREEN 13 — ¿TE SERÍA ÚTIL?
    screen_13_utility_question: {
      id: 'screen_13_utility_question',
      type: 'QUESTION',
      title: EXP07_CONTENT.screen13.question,
      subtitle: EXP07_CONTENT.screen13.lead,
      eyebrow: EXP07_CONTENT.screen13.eyebrow,
      nextScreen: 'screen_14_trial_completed',
      options: EXP07_CONTENT.screen13.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_14_trial_completed',
        memoryUpdates: [
          {
            key: 'exp07.productUtilityRecognition',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'productUtilityRecognition',
            value: opt.code,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen13.ctaLabel,
          targetScreen: 'screen_14_trial_completed',
          payload: { action: 'proceed_to_trial_completed' },
        },
      ],
    },

    // SCREEN 14 — CIERRE DE LA PRUEBA
    screen_14_trial_completed: {
      id: 'screen_14_trial_completed',
      type: 'TRANSITION',
      title: EXP07_CONTENT.screen14.eyebrow,
      subtitle: EXP07_CONTENT.screen14.beat5,
      eyebrow: EXP07_CONTENT.screen14.eyebrow,
      actions: [
        {
          type: 'COMPLETE',
          label: EXP07_CONTENT.screen14.ctaLabel,
          payload: { action: 'complete_exp07' },
          memoryUpdates: [
            {
              key: 'exp07.completed',
              value: true,
              scope: 'global',
            },
            {
              key: 'trialCompleted',
              value: true,
              scope: 'global',
            },
            {
              key: 'productValueExperienced',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },
  },
};
