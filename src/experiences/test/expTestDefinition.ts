// EXP_TEST Definition for Contexto™ Experience Engine Validation

import { ExperienceEngineDefinition } from '../../engine/experience/types';

export const EXP_TEST_DEFINITION: ExperienceEngineDefinition = {
  id: 'exp_test',
  slug: 'test-experience',
  title: 'Experiencia de Validación del Motor',
  number: 0,
  initialScreen: 'screen_intro',
  initialState: {
    initializedTest: true,
  },
  screens: {
    screen_intro: {
      id: 'screen_intro',
      type: 'INTRO',
      eyebrow: 'EXP_TEST &bull; Motor V1.0',
      title: 'Validación del Experience Engine',
      subtitle: 'Comprobación de flujo determinista, memoria narrativa, ramificación y convergencia.',
      content:
        'Esta experiencia evalúa el ciclo de vida completo del motor: acción → mutación de estado → persistencia deliberada en memoria → evaluación de condiciones → ramificación condicional → convergencia a evidencia común → finalización idempotente.',
      nextScreen: 'screen_question',
    },

    screen_question: {
      id: 'screen_question',
      type: 'QUESTION',
      eyebrow: 'Toma de Decisión',
      title: 'Selecciona una trayectoria operativa',
      subtitle: 'Tu elección será registrada en la memoria deliberada y determinará la rama a evaluar.',
      content: 'Elige entre la Opción A o la Opción B para comprobar la ramificación del motor:',
      options: [
        {
          id: 'option_a',
          code: 'A',
          label: 'Trayectoria A: Enfoque Estratégico',
          subtext: 'Prioriza el análisis de variables contextuales y causa raíz.',
          value: 'A',
          memoryUpdates: [
            { key: 'testAnswer', value: 'A', scope: 'global' },
            { key: 'chosenPath', value: 'Estratégico', scope: 'local' },
          ],
          nextScreen: 'screen_branch_a',
        },
        {
          id: 'option_b',
          code: 'B',
          label: 'Trayectoria B: Enfoque Operativo',
          subtext: 'Prioriza la velocidad de ejecución y respuesta táctica.',
          value: 'B',
          memoryUpdates: [
            { key: 'testAnswer', value: 'B', scope: 'global' },
            { key: 'chosenPath', value: 'Operativo', scope: 'local' },
          ],
          nextScreen: 'screen_branch_b',
        },
      ],
    },

    screen_branch_a: {
      id: 'screen_branch_a',
      type: 'CONTENT',
      eyebrow: 'Rama A Activada',
      title: 'Ruta Estratégica Seleccionada',
      subtitle: 'Condición validada: testAnswer === "A".',
      content:
        'Has ingresado a la Rama A. El motor evaluó la condición y desplegó esta pantalla exclusiva para el perfil analítico.',
      nextScreen: 'screen_common_reveal',
    },

    screen_branch_b: {
      id: 'screen_branch_b',
      type: 'CONTENT',
      eyebrow: 'Rama B Activada',
      title: 'Ruta Operativa Seleccionada',
      subtitle: 'Condición validada: testAnswer === "B".',
      content:
        'Has ingresado a la Rama B. El motor evaluó la condición y desplegó esta pantalla exclusiva para el perfil de ejecución.',
      nextScreen: 'screen_common_reveal',
    },

    screen_common_reveal: {
      id: 'screen_common_reveal',
      type: 'REVEAL',
      eyebrow: 'Punto de Convergencia',
      title: 'Convergencia y Revelación de Memoria',
      subtitle: 'Ambas ramas A y B convergen a este nodo común sin duplicación.',
      content:
        'El sistema ha recuperado tu elección almacenada con éxito. Esto demuestra que la memoria deliberada y la convergencia de ramas operan con total precisión.',
      nextScreen: 'screen_completion',
    },

    screen_completion: {
      id: 'screen_completion',
      type: 'COMPLETION',
      eyebrow: 'Validación Exitosa',
      title: 'Motor de Experiencia Certificado',
      subtitle: 'Todos los estados y eventos del ciclo de vida fueron validados.',
      content: 'La prueba de EXP_TEST ha concluido. Puedes avanzar o reiniciar el ciclo.',
    },
  },
};
