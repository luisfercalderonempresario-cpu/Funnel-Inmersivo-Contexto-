// Declarative Experience Engine Definition for EXP_07 (El Futuro) - Contexto™ Narrative Experience V1.0
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP07_CONTENT } from './exp07Content';

export const EXP07_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp07',
  slug: 'el-futuro',
  title: 'El Futuro',
  number: 7,
  initialScreen: 'screen_01_threshold',
  screens: {
    // SCREEN 01 — EL UMBRAL
    screen_01_threshold: {
      id: 'screen_01_threshold',
      type: 'INTRO',
      title: EXP07_CONTENT.screen01.beat1,
      subtitle: `${EXP07_CONTENT.screen01.beat2} ${EXP07_CONTENT.screen01.beat3}`,
      eyebrow: EXP07_CONTENT.screen01.eyebrow,
      nextScreen: 'screen_02_random_night',
      actions: [
        {
          type: 'CLICK',
          label: EXP07_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_random_night',
          payload: { action: 'start_exp07' },
          memoryUpdates: [
            {
              key: 'exp07.started',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp07.futureScenarioEntered',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 02 — UNA NOCHE CUALQUIERA
    screen_02_random_night: {
      id: 'screen_02_random_night',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen02.beat5,
      subtitle: `${EXP07_CONTENT.screen02.beat1} ${EXP07_CONTENT.screen02.beat4}`,
      eyebrow: EXP07_CONTENT.screen02.eyebrow,
      nextScreen: 'screen_03_same_moment',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_same_moment',
          payload: { action: 'proceed_to_same_moment' },
        },
      ],
    },

    // SCREEN 03 — EL MISMO MOMENTO
    screen_03_same_moment: {
      id: 'screen_03_same_moment',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen03.beat3,
      subtitle: `${EXP07_CONTENT.screen03.beat1} ${EXP07_CONTENT.screen03.nuance3}`,
      eyebrow: EXP07_CONTENT.screen03.eyebrow,
      nextScreen: 'screen_04_first_path_before',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen03.ctaLabel,
          targetScreen: 'screen_04_first_path_before',
          payload: { action: 'proceed_to_first_path_before' },
        },
      ],
    },

    // SCREEN 04 — PRIMER CAMINO (ANTES)
    screen_04_first_path_before: {
      id: 'screen_04_first_path_before',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen04.title,
      subtitle: EXP07_CONTENT.screen04.closure,
      eyebrow: EXP07_CONTENT.screen04.eyebrow,
      nextScreen: 'screen_05_second_path_now',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen04.ctaLabel,
          targetScreen: 'screen_05_second_path_now',
          payload: { action: 'proceed_to_second_path_now' },
          memoryUpdates: [
            {
              key: 'exp07.beforeScenarioViewed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 05 — SEGUNDO CAMINO (AHORA)
    screen_05_second_path_now: {
      id: 'screen_05_second_path_now',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen05.title,
      subtitle: 'Primero observas, recuerdas el contexto disponible y después conversas.',
      eyebrow: EXP07_CONTENT.screen05.eyebrow,
      nextScreen: 'screen_06_the_shift',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_the_shift',
          payload: { action: 'proceed_to_the_shift' },
          memoryUpdates: [
            {
              key: 'exp07.afterScenarioViewed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 06 — EL CAMBIO (REVELACIÓN EMOCIONAL)
    screen_06_the_shift: {
      id: 'screen_06_the_shift',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen06.dominantReveal,
      subtitle: `${EXP07_CONTENT.screen06.beat1} ${EXP07_CONTENT.screen06.beat2}`,
      eyebrow: EXP07_CONTENT.screen06.eyebrow,
      nextScreen: 'screen_07_new_way_of_seeing',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen06.ctaLabel,
          targetScreen: 'screen_07_new_way_of_seeing',
          payload: { action: 'proceed_to_new_way_of_seeing' },
          memoryUpdates: [
            {
              key: 'exp07.contextDifferenceRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 07 — UNA NUEVA FORMA DE MIRAR
    screen_07_new_way_of_seeing: {
      id: 'screen_07_new_way_of_seeing',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen07.afterQuestion,
      subtitle: `${EXP07_CONTENT.screen07.beat1} ${EXP07_CONTENT.screen07.beat2}`,
      eyebrow: EXP07_CONTENT.screen07.eyebrow,
      nextScreen: 'screen_08_three_moments',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen07.ctaLabel,
          targetScreen: 'screen_08_three_moments',
          payload: { action: 'proceed_to_three_moments' },
          memoryUpdates: [
            {
              key: 'exp07.questionShiftRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 08 — TRES MOMENTOS
    screen_08_three_moments: {
      id: 'screen_08_three_moments',
      type: 'CONTENT',
      title: 'Tres Situaciones Cotidianas',
      subtitle: EXP07_CONTENT.screen08.lead,
      eyebrow: EXP07_CONTENT.screen08.eyebrow,
      nextScreen: 'screen_09_what_changes',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen08.ctaLabel,
          targetScreen: 'screen_09_what_changes',
          payload: { action: 'proceed_to_what_changes' },
        },
      ],
    },

    // SCREEN 09 — LO QUE CAMBIA
    screen_09_what_changes: {
      id: 'screen_09_what_changes',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen09.possibilityCore,
      subtitle: `${EXP07_CONTENT.screen09.beat1} ${EXP07_CONTENT.screen09.beat2}`,
      eyebrow: EXP07_CONTENT.screen09.eyebrow,
      nextScreen: 'screen_10_what_does_not_change',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen09.ctaLabel,
          targetScreen: 'screen_10_what_does_not_change',
          payload: { action: 'proceed_to_what_does_not_change' },
        },
      ],
    },

    // SCREEN 10 — LO QUE NO CAMBIA
    screen_10_what_does_not_change: {
      id: 'screen_10_what_does_not_change',
      type: 'CONTENT',
      title: EXP07_CONTENT.screen10.purposeClosure,
      subtitle: EXP07_CONTENT.screen10.realityCheck,
      eyebrow: EXP07_CONTENT.screen10.eyebrow,
      nextScreen: 'screen_11_the_desire_interaction',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen10.ctaLabel,
          targetScreen: 'screen_11_the_desire_interaction',
          payload: { action: 'proceed_to_the_desire_interaction' },
        },
      ],
    },

    // SCREEN 11 — EL DESEO (INTERACCIÓN AUTOEVALUACIÓN)
    screen_11_the_desire_interaction: {
      id: 'screen_11_the_desire_interaction',
      type: 'QUESTION',
      title: EXP07_CONTENT.screen11.finalQuestion,
      subtitle: `${EXP07_CONTENT.screen11.lead1} ${EXP07_CONTENT.screen11.forLead} ${EXP07_CONTENT.screen11.forClosure}`,
      eyebrow: EXP07_CONTENT.screen11.eyebrow,
      nextScreen: 'screen_12_preparation_for_revelation',
      options: EXP07_CONTENT.screen11.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_12_preparation_for_revelation',
        memoryUpdates: [
          {
            key: 'exp07.usefulnessReaction',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp07.usefulnessReactionCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp07.usefulnessQuestionAnswered',
            value: true,
            scope: 'global',
          },
          {
            key: 'exp07.futureValueRecognized',
            value: true,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP07_CONTENT.screen11.ctaLabel,
          targetScreen: 'screen_12_preparation_for_revelation',
          payload: { action: 'proceed_to_preparation_for_revelation' },
        },
      ],
    },

    // SCREEN 12 — PREPARACIÓN PARA LA REVELACIÓN
    screen_12_preparation_for_revelation: {
      id: 'screen_12_preparation_for_revelation',
      type: 'TRANSITION',
      title: EXP07_CONTENT.screen12.dominantReveal,
      subtitle: `${EXP07_CONTENT.screen12.lead1} ${EXP07_CONTENT.screen12.lead3}`,
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
          ],
        },
      ],
    },
  },
};
