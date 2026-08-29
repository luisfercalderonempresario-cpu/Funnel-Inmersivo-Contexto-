// Declarative Experience Engine Definition for EXP_02 (El Espejo)
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP02_CONTENT } from './exp02Content';

export const EXP02_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp02',
  slug: 'el-espejo',
  title: 'El Espejo',
  number: 2,
  initialScreen: 'screen_01_transition',
  screens: {
    // SCREEN 01 — TRANSICIÓN DESDE LA PUERTA
    screen_01_transition: {
      id: 'screen_01_transition',
      type: 'INTRO',
      title: EXP02_CONTENT.screen01.leadPause1,
      subtitle: `${EXP02_CONTENT.screen01.leadText1} ${EXP02_CONTENT.screen01.leadText2}`,
      eyebrow: 'EXPEDIENTE',
      nextScreen: 'screen_02_situation',
      actions: [
        {
          type: 'CLICK',
          label: EXP02_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_situation',
          payload: { action: 'enter_exp02' },
          memoryUpdates: [
            {
              key: 'exp02.started',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 02 — LA SITUACIÓN
    screen_02_situation: {
      id: 'screen_02_situation',
      type: 'CONTENT',
      title: EXP02_CONTENT.screen02.dominantQuote,
      subtitle: `${EXP02_CONTENT.screen02.beat1} ${EXP02_CONTENT.screen02.beat2} ${EXP02_CONTENT.screen02.beat3}`,
      eyebrow: 'SITUACIÓN',
      nextScreen: 'screen_03_immediate_response',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP02_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_immediate_response',
          payload: { action: 'proceed_to_first_question' },
        },
      ],
    },

    // SCREEN 03 — LA RESPUESTA INMEDIATA
    screen_03_immediate_response: {
      id: 'screen_03_immediate_response',
      type: 'QUESTION',
      title: EXP02_CONTENT.screen03.question,
      eyebrow: 'EVIDENCIA',
      nextScreen: 'screen_04_conversation',
      options: EXP02_CONTENT.screen03.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_04_conversation',
        memoryUpdates: [
          {
            key: 'exp02.firstInterpretation',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp02.firstInterpretationCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp02.question01Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
    },

    // SCREEN 04 — LA CONVERSACIÓN
    screen_04_conversation: {
      id: 'screen_04_conversation',
      type: 'CONTENT',
      title: EXP02_CONTENT.screen04.introLabel,
      eyebrow: 'REGISTRO',
      nextScreen: 'screen_05_pattern',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP02_CONTENT.screen04.ctaLabel,
          targetScreen: 'screen_05_pattern',
          payload: { action: 'proceed_to_pattern' },
        },
      ],
    },

    // SCREEN 05 — EL PATRÓN
    screen_05_pattern: {
      id: 'screen_05_pattern',
      type: 'CONTENT',
      title: EXP02_CONTENT.screen05.dominantText,
      subtitle: `${EXP02_CONTENT.screen05.beat1} ${EXP02_CONTENT.screen05.beat2}`,
      eyebrow: 'PATRÓN',
      nextScreen: 'screen_06_mirror',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP02_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_mirror',
          payload: { action: 'proceed_to_mirror' },
        },
      ],
    },

    // SCREEN 06 — EL ESPEJO
    screen_06_mirror: {
      id: 'screen_06_mirror',
      type: 'QUESTION',
      title: EXP02_CONTENT.screen06.question,
      subtitle: `${EXP02_CONTENT.screen06.lead1} ${EXP02_CONTENT.screen06.lead2}`,
      eyebrow: 'EL ESPEJO',
      nextScreen: 'screen_07_doubt',
      options: EXP02_CONTENT.screen06.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_07_doubt',
        memoryUpdates: [
          {
            key: 'exp02.reactionPattern',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp02.reactionPatternCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp02.question02Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
    },

    // SCREEN 07 — LA DUDA
    screen_07_doubt: {
      id: 'screen_07_doubt',
      type: 'CONTENT',
      title: EXP02_CONTENT.screen07.coreQuestion1,
      subtitle: EXP02_CONTENT.screen07.coreQuestion2,
      eyebrow: 'REFLEXIÓN',
      nextScreen: 'screen_08_microrevelation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP02_CONTENT.screen07.ctaLabel,
          targetScreen: 'screen_08_microrevelation',
          payload: { action: 'proceed_to_microrevelation' },
        },
      ],
    },

    // SCREEN 08 — MICROREVELACIÓN
    screen_08_microrevelation: {
      id: 'screen_08_microrevelation',
      type: 'REVEAL',
      title: EXP02_CONTENT.screen08.conclusion,
      subtitle: `${EXP02_CONTENT.screen08.lead1} ${EXP02_CONTENT.screen08.lead2}`,
      eyebrow: 'MICROREVELACIÓN',
      nextScreen: 'screen_09_closing',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP02_CONTENT.screen08.ctaLabel,
          targetScreen: 'screen_09_closing',
          payload: { action: 'proceed_to_closing' },
          memoryUpdates: [
            {
              key: 'exp02.contextGapRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 09 — CIERRE
    screen_09_closing: {
      id: 'screen_09_closing',
      type: 'CONTENT',
      title: EXP02_CONTENT.screen09.lead1,
      subtitle: `${EXP02_CONTENT.screen09.lead5} ${EXP02_CONTENT.screen09.lead6}`,
      eyebrow: 'CONCLUSIÓN',
      nextScreen: 'screen_10_transition_exp03',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP02_CONTENT.screen09.ctaLabel,
          targetScreen: 'screen_10_transition_exp03',
          payload: { action: 'proceed_to_final_transition' },
        },
      ],
    },

    // SCREEN 10 — TRANSICIÓN A EXP_03
    screen_10_transition_exp03: {
      id: 'screen_10_transition_exp03',
      type: 'COMPLETION',
      title: EXP02_CONTENT.screen10.lead1,
      subtitle: EXP02_CONTENT.screen10.lead2,
      eyebrow: 'TRANSICIÓN',
      actions: [
        {
          type: 'COMPLETE',
          label: EXP02_CONTENT.screen10.ctaLabel,
          payload: { action: 'complete_exp02' },
        },
      ],
    },
  },
  nextExperience: 'exp03',
};
