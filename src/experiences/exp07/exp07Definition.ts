// Declarative Experience Engine Definition for EXP_07 (La Prueba) - Contexto™ Narrative Experience V1.0
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
          ],
        },
      ],
    },

    // SCREEN 02 — VAMOS A PROBARLO
    screen_02_lets_try_it: {
      id: 'screen_02_lets_try_it',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen02.beat5,
      subtitle: `${EXP07_CONTENT.screen02.beat1} ${EXP07_CONTENT.screen02.beat2}`,
      eyebrow: EXP07_CONTENT.screen02.eyebrow,
      nextScreen: 'screen_03_the_data',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_the_data',
          payload: { action: 'proceed_to_the_data' },
        },
      ],
    },

    // SCREEN 03 — EL DATO
    screen_03_the_data: {
      id: 'screen_03_the_data',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen03.title,
      subtitle: `${EXP07_CONTENT.screen03.beat1} ${EXP07_CONTENT.screen03.beat2}`,
      eyebrow: EXP07_CONTENT.screen03.eyebrow,
      nextScreen: 'screen_04_date_input',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen03.ctaLabel,
          targetScreen: 'screen_04_date_input',
          payload: { action: 'proceed_to_date_input' },
          memoryUpdates: [
            {
              key: 'exp07.dateInputStarted',
              value: true,
              scope: 'local',
            },
          ],
        },
      ],
    },

    // SCREEN 04 — LA FECHA
    screen_04_date_input: {
      id: 'screen_04_date_input',
      type: 'QUESTION',
      title: EXP07_CONTENT.screen04.title,
      subtitle: EXP07_CONTENT.screen04.subtitle,
      eyebrow: EXP07_CONTENT.screen04.eyebrow,
      nextScreen: 'screen_05_analyzing',
      actions: [
        {
          type: 'SUBMIT',
          label: EXP07_CONTENT.screen04.ctaLabel,
          targetScreen: 'screen_05_analyzing',
          payload: { action: 'submit_date_for_analysis' },
        },
      ],
    },

    // SCREEN 05 — ANALIZANDO EL CASO
    screen_05_analyzing: {
      id: 'screen_05_analyzing',
      type: 'CONTENT',
      title: 'Analizando variables contextuales',
      subtitle: 'Procesamiento de referencia biológica',
      eyebrow: EXP07_CONTENT.screen05.eyebrow,
      nextScreen: 'screen_06_today_context',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_today_context',
          payload: { action: 'proceed_to_today_context' },
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

    // SCREEN 06 — TU CONTEXTO DE HOY
    screen_06_today_context: {
      id: 'screen_06_today_context',
      type: 'CONTENT',
      title: 'Contexto de Hoy',
      subtitle: 'Estimación orientativa del ciclo',
      eyebrow: EXP07_CONTENT.screen06.eyebrow,
      nextScreen: 'screen_07_not_an_answer',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen06.ctaLabel,
          targetScreen: 'screen_07_not_an_answer',
          payload: { action: 'proceed_to_not_an_answer' },
          memoryUpdates: [
            {
              key: 'exp07.contextViewed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 07 — NO ES UNA RESPUESTA
    screen_07_not_an_answer: {
      id: 'screen_07_not_an_answer',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen07.dominantWord,
      subtitle: EXP07_CONTENT.screen07.beat4,
      eyebrow: EXP07_CONTENT.screen07.eyebrow,
      nextScreen: 'screen_08_what_to_consider',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen07.ctaLabel,
          targetScreen: 'screen_08_what_to_consider',
          payload: { action: 'proceed_to_what_to_consider' },
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

    // SCREEN 08 — LO QUE PUEDES CONSIDERAR
    screen_08_what_to_consider: {
      id: 'screen_08_what_to_consider',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen08.title,
      subtitle: EXP07_CONTENT.screen08.closure,
      eyebrow: EXP07_CONTENT.screen08.eyebrow,
      nextScreen: 'screen_09_daily_connection_index',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen08.ctaLabel,
          targetScreen: 'screen_09_daily_connection_index',
          payload: { action: 'proceed_to_daily_connection_index' },
          memoryUpdates: [
            {
              key: 'exp07.considerationsViewed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 09 — ÍNDICE DE CONEXIÓN DIARIA™
    screen_09_daily_connection_index: {
      id: 'screen_09_daily_connection_index',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen09.title,
      subtitle: EXP07_CONTENT.screen09.directive,
      eyebrow: EXP07_CONTENT.screen09.eyebrow,
      nextScreen: 'screen_10_daily_action',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen09.ctaLabel,
          targetScreen: 'screen_10_daily_action',
          payload: { action: 'proceed_to_daily_action' },
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

    // SCREEN 10 — UNA ACCIÓN PARA HOY
    screen_10_daily_action: {
      id: 'screen_10_daily_action',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen10.ideaTitle,
      subtitle: EXP07_CONTENT.screen10.ideaBody,
      eyebrow: EXP07_CONTENT.screen10.eyebrow,
      nextScreen: 'screen_11_utility_question',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen10.ctaLabel,
          targetScreen: 'screen_11_utility_question',
          payload: { action: 'proceed_to_utility_question' },
          memoryUpdates: [
            {
              key: 'exp07.dailyContextViewed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 11 — ¿TE SERÍA ÚTIL?
    screen_11_utility_question: {
      id: 'screen_11_utility_question',
      type: 'QUESTION',
      title: EXP07_CONTENT.screen11.question,
      subtitle: EXP07_CONTENT.screen11.beat3,
      eyebrow: EXP07_CONTENT.screen11.eyebrow,
      nextScreen: 'screen_12_trial_completed',
      options: EXP07_CONTENT.screen11.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_12_trial_completed',
        memoryUpdates: [
          {
            key: 'exp07.productUtilityRecognition',
            value: opt.code,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen11.ctaLabel,
          targetScreen: 'screen_12_trial_completed',
          payload: { action: 'proceed_to_trial_completed' },
        },
      ],
    },

    // SCREEN 12 — PRUEBA COMPLETADA
    screen_12_trial_completed: {
      id: 'screen_12_trial_completed',
      type: 'TRANSITION',
      title: EXP07_CONTENT.screen12.eyebrow,
      subtitle: EXP07_CONTENT.screen12.dominantQuestion,
      eyebrow: EXP07_CONTENT.screen12.eyebrow,
      actions: [
        {
          type: 'COMPLETE',
          label: EXP07_CONTENT.screen12.ctaLabel,
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
