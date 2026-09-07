// Declarative Experience Engine Definition for EXP_03 (El Error Invisible) - P0 #02
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP03_CONTENT } from './exp03Content';

export const EXP03_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp03',
  slug: 'el-error-invisible',
  title: 'El Error Invisible',
  number: 3,
  initialScreen: 'screen_01_opening',
  screens: {
    // SCREEN 01 — APERTURA
    screen_01_opening: {
      id: 'screen_01_opening',
      type: 'INTRO',
      title: EXP03_CONTENT.screen01.leadTitle,
      subtitle: EXP03_CONTENT.screen01.leadSubtitle,
      eyebrow: EXP03_CONTENT.screen01.eyebrow,
      nextScreen: 'screen_02_reconstruction',
      actions: [
        {
          type: 'CLICK',
          label: EXP03_CONTENT.screen01.ctaLabel,
          targetScreen: 'screen_02_reconstruction',
          payload: { action: 'view_what_happens' },
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

    // SCREEN 02 — RECONSTRUCCIÓN DEL PATRÓN
    screen_02_reconstruction: {
      id: 'screen_02_reconstruction',
      type: 'CONTENT',
      title: EXP03_CONTENT.screen02.intro1,
      subtitle: EXP03_CONTENT.screen02.intro2,
      eyebrow: EXP03_CONTENT.screen02.eyebrow,
      nextScreen: 'screen_03_distortion',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen02.ctaLabel,
          targetScreen: 'screen_03_distortion',
          payload: { action: 'proceed_to_distortion' },
          memoryUpdates: [
            {
              key: 'exp03.patternReconstructed',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp03.interpretationFocused',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 03 — DISTORSIÓN
    screen_03_distortion: {
      id: 'screen_03_distortion',
      type: 'CONTENT',
      title: EXP03_CONTENT.screen03.punchline.dominant,
      subtitle: EXP03_CONTENT.screen03.punchline.subtext,
      eyebrow: EXP03_CONTENT.screen03.eyebrow,
      nextScreen: 'screen_04_revelation',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP03_CONTENT.screen03.ctaLabel,
          targetScreen: 'screen_04_revelation',
          payload: { action: 'proceed_to_revelation' },
          memoryUpdates: [
            {
              key: 'exp03.distortionRecognized',
              value: true,
              scope: 'global',
            },
          ],
        },
      ],
    },

    // SCREEN 04 — REVELACIÓN CENTRAL
    screen_04_revelation: {
      id: 'screen_04_revelation',
      type: 'COMPLETION',
      title: EXP03_CONTENT.screen04.mainQuestion,
      subtitle: EXP03_CONTENT.screen04.bridge,
      eyebrow: EXP03_CONTENT.screen04.eyebrow,
      actions: [
        {
          type: 'COMPLETE',
          label: EXP03_CONTENT.screen04.ctaLabel,
          payload: { action: 'begin_investigation' },
          memoryUpdates: [
            {
              key: 'exp03.invisibleErrorRecognized',
              value: true,
              scope: 'global',
            },
            {
              key: 'exp03.contextGapRecognized',
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
