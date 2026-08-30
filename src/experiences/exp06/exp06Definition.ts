// Declarative Experience Engine Definition for EXP_06 (Contexto™) - Contexto™ Narrative Experience V1.0
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP06_CONTENT } from './exp06Content';

export const EXP06_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp06',
  slug: 'contexto',
  title: 'Contexto™',
  number: 6,
  initialScreen: 'screen_01_question',
  screens: {
    // SCREEN 01 — LA PREGUNTA
    screen_01_question: {
      id: 'screen_01_question',
      type: 'INTRO',
      title: EXP06_CONTENT.screen01.beat1,
      subtitle: `${EXP06_CONTENT.screen01.beat2} ${EXP06_CONTENT.screen01.beat3}`,
      eyebrow: EXP06_CONTENT.screen01.eyebrow,
      nextScreen: 'screen_02_information',
      actions: [
        {
          type: 'CLICK',
          label: EXP06_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_information',
          payload: { action: 'start_exp06' },
          memoryUpdates: [
            {
              key: 'exp06.started',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 02 — LA INFORMACIÓN
    screen_02_information: {
      id: 'screen_02_information',
      type: 'CONTENT',
      title: EXP06_CONTENT.screen02.beat3,
      subtitle: `${EXP06_CONTENT.screen02.beat1} ${EXP06_CONTENT.screen02.beat2}`,
      eyebrow: EXP06_CONTENT.screen02.eyebrow,
      nextScreen: 'screen_03_practical_problem',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_practical_problem',
          payload: { action: 'proceed_to_practical_problem' },
        },
      ],
    },

    // SCREEN 03 — EL PROBLEMA PRÁCTICO
    screen_03_practical_problem: {
      id: 'screen_03_practical_problem',
      type: 'CONTENT',
      title: EXP06_CONTENT.screen03.resolution,
      subtitle: `${EXP06_CONTENT.screen03.lead} ${EXP06_CONTENT.screen03.verdict}`,
      eyebrow: EXP06_CONTENT.screen03.eyebrow,
      nextScreen: 'screen_04_idea',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen03.ctaLabel,
          targetScreen: 'screen_04_idea',
          payload: { action: 'proceed_to_idea' },
        },
      ],
    },

    // SCREEN 04 — LA IDEA
    screen_04_idea: {
      id: 'screen_04_idea',
      type: 'CONTENT',
      title: EXP06_CONTENT.screen04.question,
      subtitle: `${EXP06_CONTENT.screen04.lead} ${EXP06_CONTENT.screen04.hypothesis}`,
      eyebrow: EXP06_CONTENT.screen04.eyebrow,
      nextScreen: 'screen_05_first_revelation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen04.ctaLabel,
          targetScreen: 'screen_05_first_revelation',
          payload: { action: 'proceed_to_first_revelation' },
        },
      ],
    },

    // SCREEN 05 — MICRO-INTERACCIÓN & PRIMERA REVELACIÓN
    screen_05_first_revelation: {
      id: 'screen_05_first_revelation',
      type: 'QUESTION',
      title: EXP06_CONTENT.screen05.question,
      subtitle: EXP06_CONTENT.screen05.beat3,
      eyebrow: EXP06_CONTENT.screen05.eyebrow,
      nextScreen: 'screen_06_contexto_born',
      options: EXP06_CONTENT.screen05.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_06_contexto_born',
        memoryUpdates: [
          {
            key: 'exp06.toolValueReaction',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp06.toolValueReactionCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp06.questionAnswered',
            value: true,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_contexto_born',
          payload: { action: 'proceed_to_contexto_born' },
        },
      ],
    },

    // SCREEN 06 — NACE CONTEXTO™
    screen_06_contexto_born: {
      id: 'screen_06_contexto_born',
      type: 'CONTENT',
      title: EXP06_CONTENT.screen06.brandName,
      subtitle: `${EXP06_CONTENT.screen06.lead} ${EXP06_CONTENT.screen06.tagline}`,
      eyebrow: EXP06_CONTENT.screen06.eyebrow,
      nextScreen: 'screen_07_how_it_works',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen06.ctaLabel,
          targetScreen: 'screen_07_how_it_works',
          payload: { action: 'proceed_to_how_it_works' },
          memoryUpdates: [
            {
              key: 'exp06.productRecognized',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp06.productNameRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 07 — CÓMO FUNCIONA
    screen_07_how_it_works: {
      id: 'screen_07_how_it_works',
      type: 'CONTENT',
      title: 'Cuatro Pasos Fundamentales',
      subtitle: EXP06_CONTENT.screen07.closingNote,
      eyebrow: EXP06_CONTENT.screen07.eyebrow,
      nextScreen: 'screen_08_input_data',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen07.ctaLabel,
          targetScreen: 'screen_08_input_data',
          payload: { action: 'proceed_to_input_data' },
          memoryUpdates: [
            {
              key: 'exp06.mechanismUnderstood',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 08 — EL DATO QUE NECESITAS
    screen_08_input_data: {
      id: 'screen_08_input_data',
      type: 'CONTENT',
      title: EXP06_CONTENT.screen08.dominantData,
      subtitle: `${EXP06_CONTENT.screen08.beat1} ${EXP06_CONTENT.screen08.beat3}`,
      eyebrow: EXP06_CONTENT.screen08.eyebrow,
      nextScreen: 'screen_09_daily_index',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen08.ctaLabel,
          targetScreen: 'screen_09_daily_index',
          payload: { action: 'proceed_to_daily_index' },
          memoryUpdates: [
            {
              key: 'exp06.cycleStartInputUnderstood',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 09 — EL ÍNDICE DE CONEXIÓN DIARIA™
    screen_09_daily_index: {
      id: 'screen_09_daily_index',
      type: 'CONTENT',
      title: EXP06_CONTENT.screen09.dominantConcept,
      subtitle: `${EXP06_CONTENT.screen09.lead1} ${EXP06_CONTENT.screen09.conceptSubtitle}`,
      eyebrow: EXP06_CONTENT.screen09.eyebrow,
      nextScreen: 'screen_10_real_situation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen09.ctaLabel,
          targetScreen: 'screen_10_real_situation',
          payload: { action: 'proceed_to_real_situation' },
          memoryUpdates: [
            {
              key: 'exp06.dailyIndexUnderstood',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 10 — UNA SITUACIÓN REAL
    screen_10_real_situation: {
      id: 'screen_10_real_situation',
      type: 'CONTENT',
      title: EXP06_CONTENT.screen10.resolutionDominant,
      subtitle: EXP06_CONTENT.screen10.pivotQuestion,
      eyebrow: EXP06_CONTENT.screen10.eyebrow,
      nextScreen: 'screen_11_before_after',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen10.ctaLabel,
          targetScreen: 'screen_11_before_after',
          payload: { action: 'proceed_to_before_after' },
          memoryUpdates: [
            {
              key: 'exp06.contextValueRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 11 — ANTES / DESPUÉS
    screen_11_before_after: {
      id: 'screen_11_before_after',
      type: 'CONTENT',
      title: 'Transformación de Respuesta',
      subtitle: EXP06_CONTENT.screen11.dialogueNote,
      eyebrow: EXP06_CONTENT.screen11.eyebrow,
      nextScreen: 'screen_12_what_it_does_not_do',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen11.ctaLabel,
          targetScreen: 'screen_12_what_it_does_not_do',
          payload: { action: 'proceed_to_what_it_does_not_do' },
        },
      ],
    },

    // SCREEN 12 — LO QUE CONTEXTO™ NO HACE
    screen_12_what_it_does_not_do: {
      id: 'screen_12_what_it_does_not_do',
      type: 'CONTENT',
      title: EXP06_CONTENT.screen12.closurePrinciple,
      subtitle: EXP06_CONTENT.screen12.warningLead,
      eyebrow: EXP06_CONTENT.screen12.eyebrow,
      nextScreen: 'screen_13_what_it_can_do',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen12.ctaLabel,
          targetScreen: 'screen_13_what_it_can_do',
          payload: { action: 'proceed_to_what_it_can_do' },
          memoryUpdates: [
            {
              key: 'exp06.limitationsUnderstood',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 13 — LO QUE SÍ PUEDE HACER
    screen_13_what_it_can_do: {
      id: 'screen_13_what_it_can_do',
      type: 'CONTENT',
      title: EXP06_CONTENT.screen13.centralPromise,
      subtitle: `${EXP06_CONTENT.screen13.lead1} ${EXP06_CONTENT.screen13.lead2}`,
      eyebrow: EXP06_CONTENT.screen13.eyebrow,
      nextScreen: 'screen_14_transition_future',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.screen13.ctaLabel,
          targetScreen: 'screen_14_transition_future',
          payload: { action: 'proceed_to_transition_future' },
        },
      ],
    },

    // SCREEN 14 — TRANSICIÓN A EL FUTURO
    screen_14_transition_future: {
      id: 'screen_14_transition_future',
      type: 'TRANSITION',
      title: EXP06_CONTENT.screen14.dominantQuestion,
      subtitle: `${EXP06_CONTENT.screen14.lead1} ${EXP06_CONTENT.screen14.lead3}`,
      eyebrow: EXP06_CONTENT.screen14.eyebrow,
      actions: [
        {
          type: 'COMPLETE',
          label: EXP06_CONTENT.screen14.ctaLabel,
          payload: { action: 'complete_exp06' },
          memoryUpdates: [
            {
              key: 'exp06.futureCuriosity',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp06.completed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },
  },
};
