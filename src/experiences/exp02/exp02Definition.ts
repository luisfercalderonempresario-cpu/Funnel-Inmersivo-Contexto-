// Declarative Experience Engine Definition for EXP_02 (El Espejo) - V1.1 Refinement
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

    // SCREEN 03 — LA RESPUESTA INMEDIATA (PREGUNTA 1)
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

    // SCREEN 06 — EL ESPEJO (PREGUNTA 2)
    screen_06_mirror: {
      id: 'screen_06_mirror',
      type: 'QUESTION',
      title: EXP02_CONTENT.screen06.question,
      subtitle: `${EXP02_CONTENT.screen06.lead1} ${EXP02_CONTENT.screen06.lead2}`,
      eyebrow: 'EL ESPEJO',
      nextScreen: 'screen_07a_record',
      options: EXP02_CONTENT.screen06.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_07a_record',
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

    // SCREEN A — TU REGISTRO
    screen_07a_record: {
      id: 'screen_07a_record',
      type: 'CONTENT',
      title: EXP02_CONTENT.screen07a.eyebrow,
      eyebrow: 'EXPEDIENTE',
      nextScreen: 'screen_07b_searching',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP02_CONTENT.screen07a.ctaLabel,
          targetScreen: 'screen_07b_searching',
          payload: { action: 'proceed_to_searching' },
        },
      ],
    },

    // SCREEN B — LO QUE BUSCAS
    screen_07b_searching: {
      id: 'screen_07b_searching',
      type: 'CONTENT',
      title: EXP02_CONTENT.screen07b.beat1,
      subtitle: EXP02_CONTENT.screen07b.beat2,
      eyebrow: 'REFLEXIÓN',
      nextScreen: 'screen_07c_unseen',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP02_CONTENT.screen07b.ctaLabel,
          targetScreen: 'screen_07c_unseen',
          payload: { action: 'proceed_to_unseen' },
        },
      ],
    },

    // SCREEN C — LO QUE NO PUEDES VER
    screen_07c_unseen: {
      id: 'screen_07c_unseen',
      type: 'CONTENT',
      title: EXP02_CONTENT.screen07c.beat1,
      subtitle: `${EXP02_CONTENT.screen07c.beat2} ${EXP02_CONTENT.screen07c.beat3}`,
      eyebrow: 'DESCUBRIMIENTO',
      nextScreen: 'screen_07d_new_question',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP02_CONTENT.screen07c.ctaLabel,
          targetScreen: 'screen_07d_new_question',
          payload: { action: 'proceed_to_new_question' },
        },
      ],
    },

    // SCREEN D — LA NUEVA PREGUNTA
    screen_07d_new_question: {
      id: 'screen_07d_new_question',
      type: 'CONTENT',
      title: EXP02_CONTENT.screen07d.lead,
      subtitle: EXP02_CONTENT.screen07d.afterQuestion,
      eyebrow: 'PERSPECTIVA',
      nextScreen: 'screen_07e_participation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP02_CONTENT.screen07d.ctaLabel,
          targetScreen: 'screen_07e_participation',
          payload: { action: 'proceed_to_third_question' },
        },
      ],
    },

    // SCREEN E — PARTICIPACIÓN (PREGUNTA 3)
    screen_07e_participation: {
      id: 'screen_07e_participation',
      type: 'QUESTION',
      title: EXP02_CONTENT.screen07e.question,
      subtitle: EXP02_CONTENT.screen07e.lead,
      eyebrow: 'EVIDENCIA',
      nextScreen: 'screen_08_microrevelation',
      options: EXP02_CONTENT.screen07e.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_08_microrevelation',
        memoryUpdates: [
          {
            key: 'exp02.whatHeTriedToDiscover',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp02.whatHeTriedToDiscoverCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp02.question03Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
    },

    // SCREEN F — MICROREVELACIÓN
    screen_08_microrevelation: {
      id: 'screen_08_microrevelation',
      type: 'REVEAL',
      title: EXP02_CONTENT.screen08.finalPunch,
      subtitle: EXP02_CONTENT.screen08.finalLead,
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

    // SCREEN G — CIERRE / COMPLETION
    screen_09_closing: {
      id: 'screen_09_closing',
      type: 'COMPLETION',
      title: EXP02_CONTENT.screen09.beat1,
      subtitle: `${EXP02_CONTENT.screen09.beat2} ${EXP02_CONTENT.screen09.beat3}`,
      eyebrow: 'CONCLUSIÓN',
      actions: [
        {
          type: 'COMPLETE',
          label: EXP02_CONTENT.screen09.ctaLabel,
          payload: { action: 'complete_exp02' },
          memoryUpdates: [
            {
              key: 'exp02.contextGapRecognized',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp02.completed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },
  },
  nextExperience: 'exp03',
};
