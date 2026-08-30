// Declarative Experience Engine Definition for EXP_03 (El Error Invisible) - V1.0
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP03_CONTENT } from './exp03Content';

export const EXP03_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp03',
  slug: 'el-error-invisible',
  title: 'El Error Invisible',
  number: 3,
  initialScreen: 'screen_01_record',
  screens: {
    // SCREEN 01 — EL REGISTRO
    screen_01_record: {
      id: 'screen_01_record',
      type: 'INTRO',
      title: EXP03_CONTENT.screen01.leadPiece,
      subtitle: `${EXP03_CONTENT.screen01.leadBefore} ${EXP03_CONTENT.screen01.leadShow}`,
      eyebrow: 'EXPEDIENTE',
      nextScreen: 'screen_02_scene',
      actions: [
        {
          type: 'CLICK',
          label: EXP03_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_scene',
          payload: { action: 'enter_exp03' },
          memoryUpdates: [
            {
              key: 'exp03.started',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 02 — LA ESCENA
    screen_02_scene: {
      id: 'screen_02_scene',
      type: 'CONTENT',
      title: EXP03_CONTENT.screen02.dominantQuote,
      subtitle: `${EXP03_CONTENT.screen02.beat1} ${EXP03_CONTENT.screen02.beat2} ${EXP03_CONTENT.screen02.beat3}`,
      eyebrow: 'SITUACIÓN',
      nextScreen: 'screen_03_what_you_see',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_what_you_see',
          payload: { action: 'proceed_to_what_you_see' },
        },
      ],
    },

    // SCREEN 03 — LO QUE VES
    screen_03_what_you_see: {
      id: 'screen_03_what_you_see',
      type: 'CONTENT',
      title: EXP03_CONTENT.screen03.beat1,
      subtitle: `${EXP03_CONTENT.screen03.beat2} ${EXP03_CONTENT.screen03.beat3} ${EXP03_CONTENT.screen03.beat4} ${EXP03_CONTENT.screen03.beat5}`,
      eyebrow: 'EVIDENCIA',
      nextScreen: 'screen_04_interpretation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen03.ctaLabel,
          targetScreen: 'screen_04_interpretation',
          payload: { action: 'proceed_to_interpretation' },
        },
      ],
    },

    // SCREEN 04 — TU INTERPRETACIÓN (PREGUNTA 1)
    screen_04_interpretation: {
      id: 'screen_04_interpretation',
      type: 'QUESTION',
      title: EXP03_CONTENT.screen04.question,
      subtitle: EXP03_CONTENT.screen04.lead,
      eyebrow: 'INTERPRETACIÓN',
      nextScreen: 'screen_05_hidden_info',
      options: EXP03_CONTENT.screen04.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_05_hidden_info',
        memoryUpdates: [
          {
            key: 'exp03.interpretation',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp03.interpretationCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp03.question01Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
    },

    // SCREEN 05 — LA INFORMACIÓN OCULTA
    screen_05_hidden_info: {
      id: 'screen_05_hidden_info',
      type: 'CONTENT',
      title: EXP03_CONTENT.screen05.imagine,
      subtitle: EXP03_CONTENT.screen05.convergence,
      eyebrow: 'CONVERGENCIA',
      nextScreen: 'screen_06_the_change',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_the_change',
          payload: { action: 'show_hidden_context' },
          memoryUpdates: [
            {
              key: 'exp03.hiddenContextViewed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 06 — EL CAMBIO
    screen_06_the_change: {
      id: 'screen_06_the_change',
      type: 'CONTENT',
      title: EXP03_CONTENT.screen06.beat1,
      subtitle: `${EXP03_CONTENT.screen06.beat2} ${EXP03_CONTENT.screen06.beat3} ${EXP03_CONTENT.screen06.beat4} ${EXP03_CONTENT.screen06.beat5}`,
      eyebrow: 'CONTEXTO',
      nextScreen: 'screen_06b_second_question',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen06.ctaLabel,
          targetScreen: 'screen_06b_second_question',
          payload: { action: 'proceed_to_second_question' },
        },
      ],
    },

    // SCREEN 06B — SEGUNDA PARTICIPACIÓN (PREGUNTA 2)
    screen_06b_second_question: {
      id: 'screen_06b_second_question',
      type: 'QUESTION',
      title: EXP03_CONTENT.screen06b.question,
      subtitle: EXP03_CONTENT.screen06b.lead,
      eyebrow: 'EVALUACIÓN',
      nextScreen: 'screen_07_the_error',
      options: EXP03_CONTENT.screen06b.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_07_the_error',
        memoryUpdates: [
          {
            key: 'exp03.interpretationChanged',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp03.interpretationChangedCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp03.question02Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
    },

    // SCREEN 07 — EL ERROR
    screen_07_the_error: {
      id: 'screen_07_the_error',
      type: 'CONTENT',
      title: EXP03_CONTENT.screen07.dominantTitle,
      subtitle: `${EXP03_CONTENT.screen07.beat1} ${EXP03_CONTENT.screen07.beat2}`,
      eyebrow: 'REVELACIÓN',
      nextScreen: 'screen_08_your_case',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen07.ctaLabel,
          targetScreen: 'screen_08_your_case',
          payload: { action: 'proceed_to_your_case' },
        },
      ],
    },

    // SCREEN 08 — TU CASO
    screen_08_your_case: {
      id: 'screen_08_your_case',
      type: 'CONTENT',
      title: EXP03_CONTENT.screen08.beat1,
      subtitle: `${EXP03_CONTENT.screen08.beat2} ${EXP03_CONTENT.screen08.beat3} ${EXP03_CONTENT.screen08.beat4} ${EXP03_CONTENT.screen08.beat5}`,
      eyebrow: 'REGISTRO',
      nextScreen: 'screen_09_pattern',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen08.ctaLabel,
          targetScreen: 'screen_09_pattern',
          payload: { action: 'proceed_to_pattern' },
        },
      ],
    },

    // SCREEN 09 — EL PATRÓN
    screen_09_pattern: {
      id: 'screen_09_pattern',
      type: 'CONTENT',
      title: EXP03_CONTENT.screen09.dominant1,
      subtitle: `${EXP03_CONTENT.screen09.beat1} ${EXP03_CONTENT.screen09.beat2} ${EXP03_CONTENT.screen09.dominant2}`,
      eyebrow: 'PATRÓN',
      nextScreen: 'screen_10_microrevelation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen09.ctaLabel,
          targetScreen: 'screen_10_microrevelation',
          payload: { action: 'proceed_to_microrevelation' },
        },
      ],
    },

    // SCREEN 10 — MICROREVELACIÓN
    screen_10_microrevelation: {
      id: 'screen_10_microrevelation',
      type: 'REVEAL',
      title: EXP03_CONTENT.screen10.dominantPunch,
      subtitle: `${EXP03_CONTENT.screen10.beat1} ${EXP03_CONTENT.screen10.beat2} ${EXP03_CONTENT.screen10.beat3} ${EXP03_CONTENT.screen10.beat4}`,
      eyebrow: 'MICROREVELACIÓN',
      nextScreen: 'screen_11_the_question',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen10.ctaLabel,
          targetScreen: 'screen_11_the_question',
          payload: { action: 'proceed_to_the_question' },
          memoryUpdates: [
            {
              key: 'exp03.invisibleErrorRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 11 — LA PREGUNTA
    screen_11_the_question: {
      id: 'screen_11_the_question',
      type: 'CONTENT',
      title: EXP03_CONTENT.screen11.mainQuestion,
      subtitle: `${EXP03_CONTENT.screen11.because} ${EXP03_CONTENT.screen11.before} ${EXP03_CONTENT.screen11.punchline}`,
      eyebrow: 'PREGUNTA CLAVE',
      nextScreen: 'screen_12_transition',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen11.ctaLabel,
          targetScreen: 'screen_12_transition',
          payload: { action: 'proceed_to_transition' },
        },
      ],
    },

    // SCREEN 12 — TRANSICIÓN A EXP_04
    screen_12_transition: {
      id: 'screen_12_transition',
      type: 'COMPLETION',
      title: EXP03_CONTENT.screen12.beat1,
      subtitle: EXP03_CONTENT.screen12.beat2,
      eyebrow: 'TRANSICIÓN',
      actions: [
        {
          type: 'COMPLETE',
          label: EXP03_CONTENT.screen12.ctaLabel,
          payload: { action: 'complete_exp03' },
          memoryUpdates: [
            {
              key: 'exp03.invisibleErrorRecognized',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp03.completed',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },
  },
  nextExperience: 'exp04',
};
