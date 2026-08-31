// EXP_07 — LA PRUEBA (Content & Copy Definitions V1.0)
import { CyclePhase } from './cycleEngine';

export interface UtilityOption {
  id: string;
  code: 'YES' | 'UNSURE';
  label: string;
  feedback: string;
}

export const EXP07_CONTENT = {
  // SCREEN 01 — EL CAMBIO
  screen01: {
    eyebrow: 'EXP_07 / LA PRUEBA',
    beat1: 'LA INVESTIGACIÓN TE MOSTRÓ ALGO.',
    beat2: 'A veces no necesitas una mejor reacción.',
    beat3: 'Necesitas más información antes de reaccionar.',
    beat4: 'Ahora vamos a probarlo.',
    ctaLabel: 'PROBAR CONTEXTO™',
  },

  // SCREEN 02 — VAMOS A PROBARLO
  screen02: {
    eyebrow: 'EXPERIENCIA PRÁCTICA',
    beat1: 'Por un momento, olvida la investigación.',
    beat2: 'Imagina que hoy es un día cualquiera.',
    beat3: 'Ella está frente a ti.',
    beat4: 'Y tú quieres saber algo antes de reaccionar.',
    beat5: '¿Qué contexto tienes hoy?',
    beat6: 'Vamos a descubrirlo.',
    ctaLabel: 'EMPEZAR',
  },

  // SCREEN 03 — EL DATO
  screen03: {
    eyebrow: 'EL PUNTO DE PARTIDA',
    title: 'CONTEXTO™ NECESITA UN PUNTO DE PARTIDA.',
    beat1: 'Una fecha.',
    beat2: 'El primer día de su última menstruación.',
    beat3: 'No necesitas recordarla con exactitud.',
    beat4: 'Una fecha aproximada también puede servir como referencia.',
    ctaLabel: 'INTRODUCIR FECHA',
  },

  // SCREEN 04 — LA FECHA
  screen04: {
    eyebrow: 'ENTRADA DE INFORMACIÓN',
    title: '¿CUÁNDO COMENZÓ SU ÚLTIMA MENSTRUACIÓN?',
    subtitle: 'Si no recuerdas el día exacto, introduce una fecha aproximada.',
    approximateToggleLabel: 'No recuerdo la fecha exacta (usar aproximación)',
    approximateHelper: 'Usaremos esta información solo como referencia orientativa.',
    quickPresets: [
      { label: 'Hace ~1 semana', daysAgo: 7 },
      { label: 'Hace ~2 semanas', daysAgo: 14 },
      { label: 'Hace ~3 semanas', daysAgo: 21 },
      { label: 'Hace ~4 semanas', daysAgo: 28 },
    ],
    ctaLabel: 'ANALIZAR MI CONTEXTO',
  },

  // SCREEN 05 — ANALIZANDO EL CASO
  screen05: {
    eyebrow: 'MOTOR CONTEXTUAL',
    steps: [
      { id: 'step1', text: 'RECIBIENDO DATO...' },
      { id: 'step2', text: 'CALCULANDO REFERENCIA...' },
      { id: 'step3', text: 'IDENTIFICANDO MOMENTO DEL CICLO...' },
      { id: 'step4', text: 'PREPARANDO CONTEXTO...' },
      { id: 'step5', text: 'LISTO.' },
    ],
    ctaLabel: 'VER RESULTADO',
  },

  // SCREEN 06 — TU CONTEXTO DE HOY
  screen06: {
    eyebrow: 'CONTEXTO DE HOY',
    lead: 'Según la fecha que introdujiste...',
    sublabel: 'PODRÍA ESTAR EN',
    disclaimerBadge: 'Estimación orientativa',
    clarification1: 'El ciclo menstrual varía entre mujeres y entre ciclos.',
    clarification2: 'Esta información no determina cómo se sentirá o comportará tu pareja.',
    ctaLabel: 'VER MI CONTEXTO DE HOY',
  },

  // SCREEN 07 — NO ES UNA RESPUESTA
  screen07: {
    eyebrow: 'INTERPRETACIÓN CORRECTA',
    beat1: 'PERO HAY ALGO IMPORTANTE.',
    beat2: 'Esto no te dice cómo está ella.',
    beat3: 'Te da algo diferente.',
    dominantWord: 'CONTEXTO',
    beat4: 'Una pieza de información que puedes considerar junto con lo que ves, escuchas y conversas con ella.',
    beat5: 'No reemplaza lo que ella te dice.',
    beat6: 'Te ayuda a interpretar con más información.',
    ctaLabel: 'VER MI CONTEXTO',
  },

  // SCREEN 08 — LO QUE PUEDES CONSIDERAR
  screen08: {
    eyebrow: 'CONSIDERACIONES PRÁCTICAS',
    title: 'HOY PODRÍAS CONSIDERAR',
    generalLead: 'Alrededor de esta etapa algunas personas pueden experimentar cambios físicos o emocionales.',
    principlesLead: 'Pero no asumas.',
    verbs: ['Observa.', 'Pregunta.', 'Escucha.'],
    closure: 'EL CONTEXTO ORIENTA. LA CONVERSACIÓN CONFIRMA.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 09 — ÍNDICE DE CONEXIÓN DIARIA™
  screen09: {
    eyebrow: 'MÉTRICA CUALITATIVA',
    title: 'ÍNDICE DE CONEXIÓN DIARIA™',
    modeLabel: 'MODO CUALITATIVO',
    modeValue: 'HOY: COMPRENDER',
    lead: 'Tu contexto de hoy sugiere una cosa:',
    directive: 'NO TE ADELANTES A LA INTERPRETACIÓN.',
    note: 'Una orientación diseñada para pausar la reactividad automática.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 10 — UNA ACCIÓN PARA HOY
  screen10: {
    eyebrow: 'ACCIÓN CONTEXTUAL',
    ideaTitle: 'UNA IDEA PARA HOY',
    ideaBody: 'Antes de asumir que algo tiene que ver contigo, pregúntale cómo está.',
    microgestureTitle: 'UN MICROGESTO',
    microgestureBody: '“¿Cómo estás hoy?”',
    guidance1: 'Si quiere hablar, escucha.',
    guidance2: 'Si necesita espacio, respétalo.',
    avoidTitle: '¿QUÉ EVITAR?',
    avoidBody: 'Convertir inmediatamente un cambio de ánimo, cansancio o distancia en una conclusión sobre la relación.',
    ctaLabel: 'VER EL SIGUIENTE PASO',
  },

  // SCREEN 11 — ¿TE SERÍA ÚTIL?
  screen11: {
    eyebrow: 'EVALUACIÓN DE VALOR',
    beat1: 'Acabas de ver una pequeña parte de lo que Contexto™ puede hacer.',
    beat2: 'Ahora quiero preguntarte algo.',
    beat3: 'Si pudieras tener este contexto cada día...',
    question: '¿Crees que te sería útil?',
    options: [
      {
        id: 'opt_yes',
        code: 'YES' as const,
        label: 'SÍ, ME SERÍA ÚTIL',
        feedback: 'Tener una referencia antes de reaccionar cambia por completo la calidad de la respuesta cotidiana.',
      },
      {
        id: 'opt_unsure',
        code: 'UNSURE' as const,
        label: 'NO ESTOY SEGURO',
        feedback: 'Es natural tener dudas. El verdadero impacto se observa cuando se utiliza de forma continuada en momentos clave.',
      },
    ],
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 12 — PRUEBA COMPLETADA
  screen12: {
    eyebrow: 'PRUEBA COMPLETADA',
    beat1: 'Ya utilizaste una pequeña parte de Contexto™.',
    beat2: 'Ahora sabes cómo se siente tener información adicional antes de reaccionar.',
    beat3: 'Pero hay algo que todavía no hemos investigado.',
    dominantQuestion: '¿Qué podría cambiar en tu relación si tuvieras este contexto todos los días?',
    ctaLabel: 'DESCUBRIRLO',
  },
};
