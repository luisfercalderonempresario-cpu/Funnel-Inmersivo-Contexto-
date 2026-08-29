// Declarative Experience Engine Definition for EXP_01 (La Puerta)
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP01_CONTENT } from './exp01Content';

export const EXP01_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp01',
  slug: 'la-puerta',
  title: 'La Puerta',
  number: 1,
  initialScreen: 'screen_01_black_entry',
  screens: {
    // SCREEN 01 — BLACK ENTRY
    screen_01_black_entry: {
      id: 'screen_01_black_entry',
      type: 'INTRO',
      title: EXP01_CONTENT.screen01.leadText1,
      subtitle: EXP01_CONTENT.screen01.leadText2,
      eyebrow: 'EXPEDIENTE',
      nextScreen: 'screen_02_first_question',
      actions: [
        {
          type: 'CLICK',
          label: EXP01_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_first_question',
          payload: { action: 'enter_experience' },
          memoryUpdates: [
            {
              key: 'exp01.started',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 02 — FIRST QUESTION
    screen_02_first_question: {
      id: 'screen_02_first_question',
      type: 'QUESTION',
      title: EXP01_CONTENT.screen02.question,
      subtitle: `${EXP01_CONTENT.screen02.intro1} ${EXP01_CONTENT.screen02.intro2}`,
      eyebrow: 'EXPEDIENTE',
      nextScreen: 'screen_03_case_id',
      options: EXP01_CONTENT.screen02.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.code,
        nextScreen: 'screen_03_case_id',
        memoryUpdates: [
          {
            key: 'exp01.relationshipResponse',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp01.question01Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
    },

    // SCREEN 03 — CASE ID REVEAL
    screen_03_case_id: {
      id: 'screen_03_case_id',
      type: 'REVEAL',
      title: EXP01_CONTENT.screen03.label,
      subtitle: EXP01_CONTENT.screen03.footnote,
      eyebrow: EXP01_CONTENT.screen03.status,
      nextScreen: 'screen_04_second_question',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP01_CONTENT.screen03.ctaLabel,
          targetScreen: 'screen_04_second_question',
          payload: { action: 'continue_after_case_id' },
        },
      ],
    },

    // SCREEN 04 — SECOND QUESTION
    screen_04_second_question: {
      id: 'screen_04_second_question',
      type: 'QUESTION',
      title: EXP01_CONTENT.screen04.question,
      subtitle: `${EXP01_CONTENT.screen04.intro1} ${EXP01_CONTENT.screen04.intro2}`,
      eyebrow: 'EXPEDIENTE',
      nextScreen: 'screen_05_mirror_moment',
      options: EXP01_CONTENT.screen04.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        label: opt.label,
        value: opt.code,
        nextScreen: 'screen_05_mirror_moment',
        memoryUpdates: [
          {
            key: 'exp01.relationshipInterpretation',
            value: opt.code,
            scope: 'global',
          },
          {
            key: 'exp01.question02Answered',
            value: true,
            scope: 'global',
          },
        ],
      })),
    },

    // SCREEN 05 — MIRROR MOMENT
    screen_05_mirror_moment: {
      id: 'screen_05_mirror_moment',
      type: 'CONTENT',
      title: EXP01_CONTENT.screen05.title,
      subtitle: `${EXP01_CONTENT.screen05.paragraph1} ${EXP01_CONTENT.screen05.paragraph2}`,
      eyebrow: 'OBSERVACIÓN',
      nextScreen: 'screen_06_investigation_activation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP01_CONTENT.screen05.ctaLabel,
          targetScreen: 'screen_06_investigation_activation',
          payload: { action: 'continue_mirror_moment' },
        },
      ],
    },

    // SCREEN 06 — INVESTIGATION ACTIVATION
    screen_06_investigation_activation: {
      id: 'screen_06_investigation_activation',
      type: 'CONTENT',
      title: EXP01_CONTENT.screen06.paragraph1,
      subtitle: `${EXP01_CONTENT.screen06.paragraph2} ${EXP01_CONTENT.screen06.paragraph3}`,
      eyebrow: 'ANÁLISIS',
      nextScreen: 'screen_07_microcommitment',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP01_CONTENT.screen06.ctaLabel,
          targetScreen: 'screen_07_microcommitment',
          payload: { action: 'ready_for_microcommitment' },
        },
      ],
    },

    // SCREEN 07 — MICROCOMMITMENT
    screen_07_microcommitment: {
      id: 'screen_07_microcommitment',
      type: 'CHOICE',
      title: EXP01_CONTENT.screen07.question,
      eyebrow: 'DECISIÓN',
      options: [
        {
          id: 'opt_yes',
          code: 'YES',
          label: EXP01_CONTENT.screen07.options[0].label,
          value: true,
          nextScreen: 'screen_08_confirmation',
          memoryUpdates: [
            {
              key: 'exp01.investigationAccepted',
              value: true,
              scope: 'global',
            },
          ],
        },
        {
          id: 'opt_no',
          code: 'NO',
          label: EXP01_CONTENT.screen07.options[1].label,
          value: false,
          nextScreen: 'screen_07_declined',
          memoryUpdates: [
            {
              key: 'exp01.investigationAccepted',
              value: false,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 07 DECLINED — PAUSED STATE
    screen_07_declined: {
      id: 'screen_07_declined',
      type: 'CONTENT',
      title: EXP01_CONTENT.screen07Declined.title,
      subtitle: EXP01_CONTENT.screen07Declined.message,
      eyebrow: 'PAUSA',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP01_CONTENT.screen07Declined.resumeLabel,
          targetScreen: 'screen_08_confirmation',
          memoryUpdates: [
            {
              key: 'exp01.investigationAccepted',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 08 — CONFIRMATION & CASE ID
    screen_08_confirmation: {
      id: 'screen_08_confirmation',
      type: 'REVEAL',
      title: EXP01_CONTENT.screen08.label,
      subtitle: EXP01_CONTENT.screen08.body,
      eyebrow: EXP01_CONTENT.screen08.status,
      nextScreen: 'screen_09_final',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP01_CONTENT.screen08.ctaLabel,
          targetScreen: 'screen_09_final',
          payload: { action: 'proceed_to_door_final' },
        },
      ],
    },

    // SCREEN 09 — FINAL DE LA PUERTA
    screen_09_final: {
      id: 'screen_09_final',
      type: 'COMPLETION',
      title: EXP01_CONTENT.screen09.paragraph1,
      subtitle: EXP01_CONTENT.screen09.paragraph2,
      eyebrow: 'EXPEDIENTE',
      actions: [
        {
          type: 'COMPLETE',
          label: EXP01_CONTENT.screen09.ctaLabel,
          payload: { action: 'complete_door' },
        },
      ],
    },
  },
  nextExperience: 'exp02',
};

