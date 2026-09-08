// Declarative Experience Engine Definition for EXP_06 (Contexto™) — P0 #05 CTX_E06_V01_SAME_SIGNAL
import { ExperienceEngineDefinition } from '../../engine/experience/types';
import { EXP06_CONTENT } from './exp06Content';

export const EXP06_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp06',
  slug: 'contexto',
  title: 'Contexto™',
  number: 6,
  initialScreen: 'screen_01_opening',
  screens: {
    // 1. APERTURA
    screen_01_opening: {
      id: 'screen_01_opening',
      type: 'INTRO',
      title: EXP06_CONTENT.opening.lead,
      subtitle: EXP06_CONTENT.opening.subLead,
      eyebrow: 'EXPEDIENTE #06',
      nextScreen: 'screen_02_cinematic',
      actions: [
        {
          type: 'CLICK',
          label: EXP06_CONTENT.opening.ctaLabel,
          targetScreen: 'screen_02_cinematic',
          payload: { action: 'see_difference' },
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

    // 2. MODO CINEMATOGRÁFICO
    screen_02_cinematic: {
      id: 'screen_02_cinematic',
      type: 'CONTENT',
      title: 'Misma Señal',
      eyebrow: 'DEMOSTRACIÓN CINEMATOGRÁFICA',
      nextScreen: 'screen_03_same_signal',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_03_same_signal',
        },
      ],
    },

    // 3. CONTINUIDAD DEL ÚLTIMO FRAME & PRINCIPIO
    screen_03_same_signal: {
      id: 'screen_03_same_signal',
      type: 'CONTENT',
      title: EXP06_CONTENT.signal.principleTitle,
      subtitle: EXP06_CONTENT.signal.principleSubtitle,
      eyebrow: 'SEÑAL OBSERVABLE',
      nextScreen: 'screen_04_automatic_interpretation',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_04_automatic_interpretation',
        },
      ],
    },

    // 4. INTERPRETACIÓN AUTOMÁTICA
    screen_04_automatic_interpretation: {
      id: 'screen_04_automatic_interpretation',
      type: 'CONTENT',
      title: EXP06_CONTENT.automaticInterpretation.eyebrowInterpretation,
      subtitle: EXP06_CONTENT.automaticInterpretation.interpretationText,
      eyebrow: 'REACCIÓN RÁPIDA',
      nextScreen: 'screen_05_pause_and_context',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_05_pause_and_context',
        },
      ],
    },

    // 5. DETENER LA INTERPRETACIÓN (PAUSA) Y ENTRA CONTEXTO™
    screen_05_pause_and_context: {
      id: 'screen_05_pause_and_context',
      type: 'CONTENT',
      title: 'PAUSA',
      subtitle: EXP06_CONTENT.pauseInterruption.question,
      eyebrow: 'INTERRUPCIÓN CONSCIENTE',
      nextScreen: 'screen_06_perspective_shift',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_06_perspective_shift',
        },
      ],
    },

    // 6. CAMBIO DE PERSPECTIVA
    screen_06_perspective_shift: {
      id: 'screen_06_perspective_shift',
      type: 'CONTENT',
      title: EXP06_CONTENT.perspectiveShift.eyebrow,
      subtitle: `${EXP06_CONTENT.perspectiveShift.thought1} ${EXP06_CONTENT.perspectiveShift.thought2}`,
      eyebrow: 'NUEVA PERSPECTIVA',
      nextScreen: 'screen_07_wow_comparison',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_07_wow_comparison',
        },
      ],
    },

    // 7. MOMENTO WOW: ANTES VS AHORA
    screen_07_wow_comparison: {
      id: 'screen_07_wow_comparison',
      type: 'CONTENT',
      title: EXP06_CONTENT.wowComparison.coreInsight1,
      subtitle: EXP06_CONTENT.wowComparison.coreInsight2,
      eyebrow: 'DEMOSTRACIÓN',
      nextScreen: 'screen_08_conversation_question',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_08_conversation_question',
        },
      ],
    },

    // 8. DE INTERPRETACIÓN A CONVERSACIÓN
    screen_08_conversation_question: {
      id: 'screen_08_conversation_question',
      type: 'CONTENT',
      title: EXP06_CONTENT.conversation.question,
      subtitle: EXP06_CONTENT.conversation.transitionBeat2,
      eyebrow: 'ACERCAMIENTO',
      nextScreen: 'screen_09_mechanism',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_09_mechanism',
        },
      ],
    },

    // 9. MECANISMO VISUAL (5 PASOS)
    screen_09_mechanism: {
      id: 'screen_09_mechanism',
      type: 'CONTENT',
      title: 'Mecanismo Contexto™',
      eyebrow: 'ARQUITECTURA DE RESPUESTA',
      nextScreen: 'screen_10_definition_and_categories',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_10_definition_and_categories',
        },
      ],
    },

    // 10. DEFINICIÓN DE CONTEXTO™ & CATEGORÍAS
    screen_10_definition_and_categories: {
      id: 'screen_10_definition_and_categories',
      type: 'CONTENT',
      title: EXP06_CONTENT.definition.brand,
      subtitle: EXP06_CONTENT.definition.tagline,
      eyebrow: 'HERRAMIENTA COTIDIANA',
      nextScreen: 'screen_11_bridge_and_cta',
      actions: [
        {
          type: 'CONTINUE',
          label: 'CONTINUAR',
          targetScreen: 'screen_11_bridge_and_cta',
        },
      ],
    },

    // 11. PUENTE HACIA LA PRUEBA & CTA FINAL
    screen_11_bridge_and_cta: {
      id: 'screen_11_bridge_and_cta',
      type: 'TRANSITION',
      title: EXP06_CONTENT.bridge.beat1,
      subtitle: EXP06_CONTENT.bridge.beat2,
      eyebrow: 'EL SIGUIENTE PASO',
      actions: [
        {
          type: 'CONTINUE',
          label: EXP06_CONTENT.bridge.ctaLabel,
          targetScreen: 'complete',
          payload: { action: 'try_contexto' },
          memoryUpdates: [
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
