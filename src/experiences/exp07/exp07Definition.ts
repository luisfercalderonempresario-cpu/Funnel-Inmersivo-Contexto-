// Declarative Experience Engine Definition for EXP_07 (La Prueba) - Contexto™ Interactive Demo V3.0
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP07_CONTENT } from './exp07Content';

export const EXP07_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp07',
  slug: 'la-prueba',
  title: 'La Prueba',
  number: 7,
  initialScreen: 'screen_01_the_test',
  screens: {
    // SCREEN 01 — LA PRUEBA
    screen_01_the_test: {
      id: 'screen_01_the_test',
      type: 'INTRO',
      title: EXP07_CONTENT.screen01.beat1,
      subtitle: `${EXP07_CONTENT.screen01.beat2} ${EXP07_CONTENT.screen01.beat3}`,
      eyebrow: EXP07_CONTENT.screen01.eyebrow,
      nextScreen: 'screen_02_the_data',
      actions: [
        {
          type: 'CLICK',
          label: EXP07_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_the_data',
          payload: { action: 'start_exp07' },
          memoryUpdates: [
            {
              key: 'exp07.started',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp07.simulatedDate',
              value: EXP07_CONTENT.demoCase.dateStr,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 02 — EL DATO
    screen_02_the_data: {
      id: 'screen_02_the_data',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen02.dateTag,
      subtitle: EXP07_CONTENT.screen02.beat1,
      eyebrow: EXP07_CONTENT.screen02.eyebrow,
      nextScreen: 'screen_03_engine',
      actions: [
        {
          type: 'SUBMIT',
          label: EXP07_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_engine',
          payload: { action: 'analyze_simulated_case' },
        },
      ],
    },

    // SCREEN 03 — MOTOR CONTEXTUAL
    screen_03_engine: {
      id: 'screen_03_engine',
      type: 'WAIT',
      title: EXP07_CONTENT.screen03.steps[0].text,
      subtitle: 'Preparando contexto...',
      eyebrow: EXP07_CONTENT.screen03.eyebrow,
      nextScreen: 'screen_04_today_context',
      actions: [
        {
          type: 'CONTINUE',
          label: 'Continuar',
          targetScreen: 'screen_04_today_context',
          payload: { action: 'engine_completed' },
          memoryUpdates: [
            {
              key: 'exp07.contextCalculated',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 04 — TU CONTEXTO DE HOY
    screen_04_today_context: {
      id: 'screen_04_today_context',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen04.title,
      subtitle: EXP07_CONTENT.screen04.referenceValue,
      eyebrow: EXP07_CONTENT.screen04.eyebrow,
      nextScreen: 'screen_05_missing_piece',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen04.ctaLabel,
          targetScreen: 'screen_05_missing_piece',
          payload: { action: 'proceed_to_missing_piece' },
          memoryUpdates: [
            {
              key: 'exp07.contextRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 05 — LO QUE ESTÁS PASANDO POR ALTO
    screen_05_missing_piece: {
      id: 'screen_05_missing_piece',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen05.title,
      subtitle: EXP07_CONTENT.screen05.highlight,
      eyebrow: EXP07_CONTENT.screen05.eyebrow,
      nextScreen: 'screen_06_the_question',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_the_question',
          payload: { action: 'proceed_to_the_question' },
        },
      ],
    },

    // SCREEN 06 — LA PREGUNTA
    screen_06_the_question: {
      id: 'screen_06_the_question',
      type: 'QUESTION',
      title: EXP07_CONTENT.screen06.title,
      subtitle: EXP07_CONTENT.screen06.question,
      eyebrow: EXP07_CONTENT.screen06.eyebrow,
      nextScreen: 'screen_07_context_to_decision',
      options: EXP07_CONTENT.screen06.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.text,
        value: opt.text,
        nextScreen: 'screen_07_context_to_decision',
        memoryUpdates: [
          {
            key: 'exp07.firstDecision',
            value: opt.text,
            scope: 'global',
          },
          {
            key: 'exp07.firstDecisionCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp07.questionAnswered',
            value: true,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen06.ctaLabel,
          targetScreen: 'screen_07_context_to_decision',
          payload: { action: 'proceed_to_context_to_decision' },
        },
      ],
    },

    // SCREEN 07 — CONTEXTO → DECISIÓN
    screen_07_context_to_decision: {
      id: 'screen_07_context_to_decision',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen07.title,
      subtitle: EXP07_CONTENT.screen07.blockBody,
      eyebrow: EXP07_CONTENT.screen07.eyebrow,
      nextScreen: 'screen_08_daily_action',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen07.ctaLabel,
          targetScreen: 'screen_08_daily_action',
          payload: { action: 'proceed_to_daily_action' },
        },
      ],
    },

    // SCREEN 08 — ACCIÓN DE HOY
    screen_08_daily_action: {
      id: 'screen_08_daily_action',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen08.title,
      subtitle: EXP07_CONTENT.screen08.action,
      eyebrow: EXP07_CONTENT.screen08.eyebrow,
      nextScreen: 'screen_09_what_to_avoid',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen08.ctaLabel,
          targetScreen: 'screen_09_what_to_avoid',
          payload: { action: 'proceed_to_what_to_avoid' },
          memoryUpdates: [
            {
              key: 'exp07.dailyActionShown',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 09 — EL ERROR QUE CONTEXTO™ TE AYUDA A EVITAR
    screen_09_what_to_avoid: {
      id: 'screen_09_what_to_avoid',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen09.title,
      subtitle: EXP07_CONTENT.screen09.highlight,
      eyebrow: EXP07_CONTENT.screen09.eyebrow,
      nextScreen: 'screen_10_connection_index',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen09.ctaLabel,
          targetScreen: 'screen_10_connection_index',
          payload: { action: 'proceed_to_connection_index' },
        },
      ],
    },

    // SCREEN 10 — ÍNDICE DE CONEXIÓN DIARIA™
    screen_10_connection_index: {
      id: 'screen_10_connection_index',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen10.title,
      subtitle: EXP07_CONTENT.screen10.principle,
      eyebrow: EXP07_CONTENT.screen10.eyebrow,
      nextScreen: 'screen_11_wow_moment',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen10.ctaLabel,
          targetScreen: 'screen_11_wow_moment',
          payload: { action: 'proceed_to_wow_moment' },
        },
      ],
    },

    // SCREEN 11 — MOMENTO WOW
    screen_11_wow_moment: {
      id: 'screen_11_wow_moment',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen11.title,
      subtitle: EXP07_CONTENT.screen11.summary,
      eyebrow: EXP07_CONTENT.screen11.eyebrow,
      nextScreen: 'screen_12_the_desire',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen11.ctaLabel,
          targetScreen: 'screen_12_the_desire',
          payload: { action: 'proceed_to_the_desire' },
          memoryUpdates: [
            {
              key: 'exp07.productValueExperienced',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 12 — EL DESEO
    screen_12_the_desire: {
      id: 'screen_12_the_desire',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen12.title,
      subtitle: EXP07_CONTENT.screen12.closure,
      eyebrow: EXP07_CONTENT.screen12.eyebrow,
      nextScreen: 'screen_13_transition_revelation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen12.ctaLabel,
          targetScreen: 'screen_13_transition_revelation',
          payload: { action: 'proceed_to_transition_revelation' },
        },
      ],
    },

    // SCREEN 13 — TRANSICIÓN A LA REVELACIÓN
    screen_13_transition_revelation: {
      id: 'screen_13_transition_revelation',
      type: 'TRANSITION',
      title: EXP07_CONTENT.screen13.eyebrow,
      subtitle: EXP07_CONTENT.screen13.beat3,
      eyebrow: EXP07_CONTENT.screen13.eyebrow,
      actions: [
        {
          type: 'COMPLETE',
          label: EXP07_CONTENT.screen13.ctaLabel,
          payload: { action: 'complete_exp07_to_exp08' },
          memoryUpdates: [
            {
              key: 'exp07.completed',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp07.productUtilityRecognition',
              value: 'YES',
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
