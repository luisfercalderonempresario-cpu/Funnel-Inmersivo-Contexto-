// Declarative Experience Engine Definition for EXP_08 (La Revelación) - Contexto™ Narrative Experience V1.0
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP08_CONTENT } from './exp08Content';

export const EXP08_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp08',
  slug: 'la-revelacion',
  title: 'La Revelación',
  number: 8,
  initialScreen: 'screen_01_silence',
  screens: {
    // SCREEN 01 — EL SILENCIO
    screen_01_silence: {
      id: 'screen_01_silence',
      type: 'INTRO',
      title: EXP08_CONTENT.screen01.beat1,
      subtitle: EXP08_CONTENT.screen01.beat2,
      eyebrow: EXP08_CONTENT.screen01.eyebrow,
      nextScreen: 'screen_02_the_case',
      actions: [
        {
          type: 'CLICK',
          label: EXP08_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_the_case',
          payload: { action: 'start_case_review' },
          memoryUpdates: [
            {
              key: 'exp08.started',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp08.caseReviewStarted',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 02 — EL CASO
    screen_02_the_case: {
      id: 'screen_02_the_case',
      type: 'CONTENT',
      title: EXP08_CONTENT.screen02.transformedQuestion,
      subtitle: `${EXP08_CONTENT.screen02.beat1} ${EXP08_CONTENT.screen02.shiftLead}`,
      eyebrow: EXP08_CONTENT.screen02.eyebrow,
      nextScreen: 'screen_03_first_piece',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_first_piece',
          payload: { action: 'proceed_to_first_piece' },
        },
      ],
    },

    // SCREEN 03 — LA PRIMERA PIEZA
    screen_03_first_piece: {
      id: 'screen_03_first_piece',
      type: 'CONTENT',
      title: EXP08_CONTENT.screen03.badge,
      subtitle: EXP08_CONTENT.screen03.beat3,
      eyebrow: EXP08_CONTENT.screen03.eyebrow,
      nextScreen: 'screen_04_second_piece',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen03.ctaLabel,
          targetScreen: 'screen_04_second_piece',
          payload: { action: 'proceed_to_second_piece' },
          memoryUpdates: [
            {
              key: 'exp08.interpretationRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 04 — LA SEGUNDA PIEZA
    screen_04_second_piece: {
      id: 'screen_04_second_piece',
      type: 'CONTENT',
      title: EXP08_CONTENT.screen04.badge,
      subtitle: EXP08_CONTENT.screen04.beat5,
      eyebrow: EXP08_CONTENT.screen04.eyebrow,
      nextScreen: 'screen_05_third_piece',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen04.ctaLabel,
          targetScreen: 'screen_05_third_piece',
          payload: { action: 'proceed_to_third_piece' },
          memoryUpdates: [
            {
              key: 'exp08.incompleteInformationRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 05 — LA TERCERA PIEZA
    screen_05_third_piece: {
      id: 'screen_05_third_piece',
      type: 'CONTENT',
      title: EXP08_CONTENT.screen05.badge,
      subtitle: EXP08_CONTENT.screen05.scientificNuance,
      eyebrow: EXP08_CONTENT.screen05.eyebrow,
      nextScreen: 'screen_06_the_connection',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_the_connection',
          payload: { action: 'proceed_to_the_connection' },
          memoryUpdates: [
            {
              key: 'exp08.contextRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 06 — LA CONEXIÓN
    screen_06_the_connection: {
      id: 'screen_06_the_connection',
      type: 'CONTENT',
      title: EXP08_CONTENT.screen06.closure2,
      subtitle: EXP08_CONTENT.screen06.closure1,
      eyebrow: EXP08_CONTENT.screen06.eyebrow,
      nextScreen: 'screen_07_the_discovery',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen06.ctaLabel,
          targetScreen: 'screen_07_the_discovery',
          payload: { action: 'proceed_to_the_discovery' },
          memoryUpdates: [
            {
              key: 'exp08.connectionRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 07 — EL DESCUBRIMIENTO
    screen_07_the_discovery: {
      id: 'screen_07_the_discovery',
      type: 'CONTENT',
      title: EXP08_CONTENT.screen07.dominantReveal,
      subtitle: EXP08_CONTENT.screen07.lead,
      eyebrow: EXP08_CONTENT.screen07.eyebrow,
      nextScreen: 'screen_08_the_real_problem',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen07.ctaLabel,
          targetScreen: 'screen_08_the_real_problem',
          payload: { action: 'proceed_to_the_real_problem' },
        },
      ],
    },

    // SCREEN 08 — EL VERDADERO PROBLEMA
    screen_08_the_real_problem: {
      id: 'screen_08_the_real_problem',
      type: 'CONTENT',
      title: EXP08_CONTENT.screen08.dominantHeadline,
      subtitle: `${EXP08_CONTENT.screen08.lead1} ${EXP08_CONTENT.screen08.lead2}`,
      eyebrow: EXP08_CONTENT.screen08.eyebrow,
      nextScreen: 'screen_09_the_tool',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen08.ctaLabel,
          targetScreen: 'screen_09_the_tool',
          payload: { action: 'proceed_to_the_tool' },
          memoryUpdates: [
            {
              key: 'exp08.coreProblemRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 09 — LA HERRAMIENTA
    screen_09_the_tool: {
      id: 'screen_09_the_tool',
      type: 'CONTENT',
      title: EXP08_CONTENT.screen09.title,
      subtitle: EXP08_CONTENT.screen09.subtitle,
      eyebrow: EXP08_CONTENT.screen09.eyebrow,
      nextScreen: 'screen_10_the_decision',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen09.ctaLabel,
          targetScreen: 'screen_10_the_decision',
          payload: { action: 'proceed_to_the_decision' },
          memoryUpdates: [
            {
              key: 'exp08.productPurposeRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 10 — LA DECISIÓN
    screen_10_the_decision: {
      id: 'screen_10_the_decision',
      type: 'CONTENT',
      title: EXP08_CONTENT.screen10.finalAutonomy,
      subtitle: `${EXP08_CONTENT.screen10.lead} ${EXP08_CONTENT.screen10.corePiece}`,
      eyebrow: EXP08_CONTENT.screen10.eyebrow,
      nextScreen: 'screen_11_the_invitation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen10.ctaLabel,
          targetScreen: 'screen_11_the_invitation',
          payload: { action: 'proceed_to_the_invitation' },
          memoryUpdates: [
            {
              key: 'exp08.autonomyRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 11 — LA EVALUACIÓN & LA INVITACIÓN
    screen_11_the_invitation: {
      id: 'screen_11_the_invitation',
      type: 'QUESTION',
      title: EXP08_CONTENT.screen11.questionCore,
      subtitle: EXP08_CONTENT.screen11.questionLead,
      eyebrow: EXP08_CONTENT.screen11.eyebrow,
      nextScreen: 'screen_12_case_closing',
      options: EXP08_CONTENT.screen11.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.label,
        nextScreen: 'screen_12_case_closing',
        memoryUpdates: [
          {
            key: 'exp08.purchaseDesire',
            value: opt.label,
            scope: 'global',
          },
          {
            key: 'exp08.purchaseDesireCode',
            value: opt.code,
            scope: 'global',
          },
        ],
      })),
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen11.ctaLabel,
          targetScreen: 'screen_12_case_closing',
          payload: { action: 'proceed_to_case_closing' },
        },
      ],
    },

    // SCREEN 12 — CIERRE DEL CASO
    screen_12_case_closing: {
      id: 'screen_12_case_closing',
      type: 'CONTENT',
      title: EXP08_CONTENT.screen12.mainFindingText,
      subtitle: `${EXP08_CONTENT.screen12.caseTitle} ${EXP08_CONTENT.screen12.closureBeat}`,
      eyebrow: EXP08_CONTENT.screen12.eyebrow,
      nextScreen: 'screen_13_final_step',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP08_CONTENT.screen12.ctaLabel,
          targetScreen: 'screen_13_final_step',
          payload: { action: 'proceed_to_final_step' },
        },
      ],
    },

    // SCREEN 13 — PASO FINAL (CIERRE DE LA INVESTIGACIÓN)
    screen_13_final_step: {
      id: 'screen_13_final_step',
      type: 'TRANSITION',
      title: EXP08_CONTENT.screen13.beat5,
      subtitle: `${EXP08_CONTENT.screen13.beat1} ${EXP08_CONTENT.screen13.beat2}`,
      eyebrow: EXP08_CONTENT.screen13.eyebrow,
      actions: [
        {
          type: 'COMPLETE',
          label: EXP08_CONTENT.screen13.ctaLabel,
          payload: { action: 'open_final_report' },
          memoryUpdates: [
            {
              key: 'exp08.completed',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp08.finalReportOpened',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },
  },
};
