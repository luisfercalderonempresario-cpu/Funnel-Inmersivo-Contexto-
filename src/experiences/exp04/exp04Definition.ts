// Declarative Experience Engine Definition for EXP_04 (La Investigación) - Contexto™ Narrative Experience V1.0
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP04_CONTENT } from './exp04Content';

export const EXP04_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp04',
  slug: 'la-investigacion',
  title: 'La Investigación',
  number: 4,
  initialScreen: 'screen_01_intro',
  screens: {
    // SCREEN 01 — INICIO DE INVESTIGACIÓN
    screen_01_intro: {
      id: 'screen_01_intro',
      type: 'INTRO',
      title: EXP04_CONTENT.screen01.leadStart,
      subtitle: `${EXP04_CONTENT.screen01.questionIntro} ${EXP04_CONTENT.screen01.mainQuestion}`,
      eyebrow: EXP04_CONTENT.screen01.eyebrow,
      nextScreen: 'screen_02_first_clue',
      actions: [
        {
          type: 'CLICK',
          label: EXP04_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_first_clue',
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

    // SCREEN 02 — PRIMER INDICIO
    screen_02_first_clue: {
      id: 'screen_02_first_clue',
      type: 'CONTENT',
      title: EXP04_CONTENT.screen02.changeBeat,
      subtitle: `${EXP04_CONTENT.screen02.beat1} ${EXP04_CONTENT.screen02.beat2} ${EXP04_CONTENT.screen02.outcomeBeat}`,
      eyebrow: EXP04_CONTENT.screen02.eyebrow,
      nextScreen: 'screen_03_second_clue',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_second_clue',
          payload: { action: 'proceed_to_second_clue' },
        },
      ],
    },

    // SCREEN 03 — SEGUNDO INDICIO
    screen_03_second_clue: {
      id: 'screen_03_second_clue',
      type: 'CONTENT',
      title: EXP04_CONTENT.screen03.beat2,
      subtitle: `${EXP04_CONTENT.screen03.beat1} ${EXP04_CONTENT.screen03.beat3} ${EXP04_CONTENT.screen03.beat6}`,
      eyebrow: EXP04_CONTENT.screen03.eyebrow,
      nextScreen: 'screen_04_comparison',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.screen03.ctaLabel,
          targetScreen: 'screen_04_comparison',
          payload: { action: 'proceed_to_comparison' },
        },
      ],
    },

    // SCREEN 04 — COMPARACIÓN (PREGUNTA 1: TU HIPÓTESIS INICIAL)
    screen_04_comparison: {
      id: 'screen_04_comparison',
      type: 'QUESTION',
      title: EXP04_CONTENT.screen04.question,
      subtitle: EXP04_CONTENT.screen04.silenceQuestion,
      eyebrow: EXP04_CONTENT.screen04.eyebrow,
      nextScreen: 'screen_05_anomaly',
      options: EXP04_CONTENT.screen04.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_05_anomaly',
        memoryUpdates: [
          {
            key: 'exp04.hypothesis',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp04.hypothesisCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp04.question01Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.screen04.ctaLabel,
          targetScreen: 'screen_05_anomaly',
          payload: { action: 'proceed_to_anomaly' },
        },
      ],
    },

    // SCREEN 05 — LA ANOMALÍA
    screen_05_anomaly: {
      id: 'screen_05_anomaly',
      type: 'CONTENT',
      title: EXP04_CONTENT.screen05.anomalyQuestion,
      subtitle: `${EXP04_CONTENT.screen05.questionPerson} ${EXP04_CONTENT.screen05.answerYes}`,
      eyebrow: EXP04_CONTENT.screen05.eyebrow,
      nextScreen: 'screen_06_observation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_observation',
          payload: { action: 'proceed_to_observation' },
        },
      ],
    },

    // SCREEN 06 — TU HIPÓTESIS (PREGUNTA 2: CONCLUSIÓN DE OBSERVACIÓN)
    screen_06_observation: {
      id: 'screen_06_observation',
      type: 'QUESTION',
      title: EXP04_CONTENT.screen06.question,
      subtitle: EXP04_CONTENT.screen06.lead,
      eyebrow: EXP04_CONTENT.screen06.eyebrow,
      nextScreen: 'screen_07_second_evidence',
      options: EXP04_CONTENT.screen06.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_07_second_evidence',
        memoryUpdates: [
          {
            key: 'exp04.observationConclusion',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp04.observationConclusionCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp04.question02Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.screen06.ctaLabel,
          targetScreen: 'screen_07_second_evidence',
          payload: { action: 'proceed_to_second_evidence' },
        },
      ],
    },

    // SCREEN 07 — SEGUNDA EVIDENCIA
    screen_07_second_evidence: {
      id: 'screen_07_second_evidence',
      type: 'CONTENT',
      title: EXP04_CONTENT.screen07.beat2,
      subtitle: `${EXP04_CONTENT.screen07.beat1} ${EXP04_CONTENT.screen07.beat6}`,
      eyebrow: EXP04_CONTENT.screen07.eyebrow,
      nextScreen: 'screen_08_pattern',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.screen07.ctaLabel,
          targetScreen: 'screen_08_pattern',
          payload: { action: 'proceed_to_pattern' },
        },
      ],
    },

    // SCREEN 08 — EL PATRÓN
    screen_08_pattern: {
      id: 'screen_08_pattern',
      type: 'CONTENT',
      title: EXP04_CONTENT.screen08.revelation,
      subtitle: EXP04_CONTENT.screen08.beat3,
      eyebrow: EXP04_CONTENT.screen08.eyebrow,
      nextScreen: 'screen_09_hidden_process',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.screen08.ctaLabel,
          targetScreen: 'screen_09_hidden_process',
          payload: { action: 'proceed_to_hidden_process' },
          memoryUpdates: [
            {
              key: 'exp04.patternRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 09 — LO QUE NO PUEDES VER
    screen_09_hidden_process: {
      id: 'screen_09_hidden_process',
      type: 'CONTENT',
      title: EXP04_CONTENT.screen09.dominantLead,
      subtitle: `${EXP04_CONTENT.screen09.beat3} ${EXP04_CONTENT.screen09.beat4}`,
      eyebrow: EXP04_CONTENT.screen09.eyebrow,
      nextScreen: 'screen_10_variable',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.screen09.ctaLabel,
          targetScreen: 'screen_10_variable',
          payload: { action: 'proceed_to_variable' },
          memoryUpdates: [
            {
              key: 'exp04.hiddenProcessRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 10 — LA VARIABLE (PREGUNTA 3: FOCO DE INVESTIGACIÓN)
    screen_10_variable: {
      id: 'screen_10_variable',
      type: 'QUESTION',
      title: EXP04_CONTENT.screen10.subQuestion,
      subtitle: EXP04_CONTENT.screen10.question,
      eyebrow: EXP04_CONTENT.screen10.eyebrow,
      nextScreen: 'screen_11_open_question',
      options: EXP04_CONTENT.screen10.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_11_open_question',
        memoryUpdates: [
          {
            key: 'exp04.investigationFocus',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp04.investigationFocusCode',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp04.question03Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.screen10.ctaLabel,
          targetScreen: 'screen_11_open_question',
          payload: { action: 'proceed_to_open_question' },
        },
      ],
    },

    // SCREEN 11 — LA PREGUNTA ABIERTA
    screen_11_open_question: {
      id: 'screen_11_open_question',
      type: 'CONTENT',
      title: EXP04_CONTENT.screen11.dominantQuestion,
      subtitle: EXP04_CONTENT.screen11.closure,
      eyebrow: EXP04_CONTENT.screen11.eyebrow,
      nextScreen: 'screen_12_transition',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP04_CONTENT.screen11.ctaLabel,
          targetScreen: 'screen_12_transition',
          payload: { action: 'proceed_to_transition' },
        },
      ],
    },

    // SCREEN 12 — TRANSICIÓN A EXP_05
    screen_12_transition: {
      id: 'screen_12_transition',
      type: 'TRANSITION',
      title: EXP04_CONTENT.screen12.dominantPiece,
      subtitle: `${EXP04_CONTENT.screen12.beat3} ${EXP04_CONTENT.screen12.beat4}`,
      eyebrow: EXP04_CONTENT.screen12.eyebrow,
      nextScreen: null,
      actions: [
        {
          type: 'CLICK',
          label: EXP04_CONTENT.screen12.ctaLabel,
          targetScreen: null,
          payload: { action: 'complete_exp04_and_seek_missing_piece' },
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
