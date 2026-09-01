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
    lead: 'Según la fecha que ingresaste...',
    sublabel: 'PODRÍA ESTAR EN',
    disclaimerBadge: 'Estimación orientativa',
    sectionTitle: 'PARA ENTENDER EL CONTEXTO',
    point1: 'Durante esta etapa ocurren cambios naturales en el cuerpo.',
    point2: 'No significa que ella vaya a sentirse o comportarse de una manera determinada.',
    point3: 'Cada mujer y cada ciclo pueden ser diferentes.',
    point4: 'Lo importante es que ahora tienes una pieza más de información antes de interpretar lo que ocurre.',
    clarification1: 'El ciclo menstrual varía entre mujeres y entre ciclos.',
    clarification2: 'Esta información no determina cómo se sentirá o comportará tu pareja.',
    closure: 'EL CONTEXTO ORIENTA. LA CONVERSACIÓN CONFIRMA.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 07 — NO ES UNA RESPUESTA
  screen07: {
    eyebrow: 'INTERPRETACIÓN CORRECTA',
    title: 'NO ES UNA RESPUESTA',
    beat1: 'Esto no te dice cómo se siente ella.',
    beat2: 'Tampoco puede decirte exactamente cómo va a reaccionar.',
    beat3: 'Porque el ciclo no determina la personalidad, las emociones ni las decisiones de una persona.',
    dominantLead: 'Lo que sí hace es darte algo que antes no tenías:',
    dominantWord: 'UNA PIEZA MÁS DE CONTEXTO',
    beat4: 'Y eso cambia la pregunta.',
    ctaLabel: 'VER LO QUE PUEDES CONSIDERAR',
  },

  // SCREEN 08 — LO QUE PUEDES CONSIDERAR
  screen08: {
    eyebrow: 'CONSIDERACIONES PRÁCTICAS',
    title: 'LO QUE PUEDES CONSIDERAR',
    subtitle: 'Contexto™ no te dice qué pensar de ella. Te ayuda a saber qué mirar antes de reaccionar.',
    categories: [
      {
        tag: 'OBSERVA',
        description: 'Antes de asumir qué ocurre, mira cómo está realmente.',
      },
      {
        tag: 'PREGUNTA',
        description: 'En lugar de adivinar, pregúntale.',
      },
      {
        tag: 'ESCUCHA',
        description: 'Deja que su respuesta tenga más peso que tu primera interpretación.',
      },
    ],
    closure: 'EL CONTEXTO ORIENTA. LA CONVERSACIÓN CONFIRMA.',
    ctaLabel: 'VER ÍNDICE DE CONEXIÓN',
  },

  // SCREEN 09 — ÍNDICE DE CONEXIÓN DIARIA™
  screen09: {
    eyebrow: 'MÉTRICA CUALITATIVA',
    title: 'ÍNDICE DE CONEXIÓN DIARIA™',
    modeLabel: 'MODO CUALITATIVO',
    modeValue: 'HOY: COMPRENDER',
    lead1: 'No necesitas resolver lo que ocurre inmediatamente.',
    lead2: 'Primero intenta comprenderlo.',
    directiveTitle: 'DIRECTIVA CENTRAL',
    directive: 'NO TE ADELANTES A LA INTERPRETACIÓN.',
    explanation1: 'Si algo cambia en ella, no tienes que inventar una explicación.',
    explanation2: 'Ahora tienes una pieza de contexto que puede ayudarte a mirar la situación de otra manera.',
    note: '30 segundos al día para pausar la reactividad automática.',
    ctaLabel: 'VER ACCIÓN PARA HOY',
  },

  // SCREEN 10 — UNA ACCIÓN PARA HOY
  screen10: {
    eyebrow: 'ACCIÓN CONTEXTUAL',
    title: 'UNA ACCIÓN PARA HOY',
    ideaTitle: 'IDEA',
    ideaBody: 'En lugar de intentar arreglarlo todo, empieza preguntando cómo está.',
    microgestureTitle: 'MICROGESTO',
    microgestureBody: '“¿Cómo estás hoy?”',
    guidance1: 'Si quiere hablar, escucha.',
    guidance2: 'Si necesita espacio, respétalo.',
    avoidTitle: 'QUÉ EVITAR',
    avoidBody: 'No interpretes su respuesta antes de escucharla.',
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
