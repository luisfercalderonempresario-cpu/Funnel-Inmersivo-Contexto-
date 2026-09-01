// EXP_07 — LA PRUEBA (Content & Copy Definitions V2.0 - Interactive Product Demo)
import { CyclePhase } from './cycleEngine';

export interface UtilityOption {
  id: string;
  code: 'YES' | 'UNSURE';
  label: string;
  feedback: string;
}

export interface SituationOption {
  id: 'A' | 'B' | 'C';
  code: 'A' | 'B' | 'C';
  label: string;
  text: string;
}

export const EXP07_CONTENT = {
  // Demo Case Static Reference
  demoCase: {
    dateStr: '2026-08-25',
    displayDate: '25 DE AGOSTO',
    description: 'Primer día de la última menstruación.',
  },

  // SCREEN 01 — EL CAMBIO
  screen01: {
    eyebrow: 'EXP_07 / LA PRUEBA',
    beat1: 'Hemos pasado varios minutos intentando entender algo.',
    beat2: 'Y hay una idea que empieza a aparecer.',
    beat3: 'No siempre reaccionas mal porque no sabes qué hacer.',
    beat4: 'A veces reaccionas con la información que tienes.',
    beat5: '¿Y si pudieras tener un poco más de contexto antes de hacerlo?',
    ctaLabel: 'QUIERO VERLO',
  },

  // SCREEN 02 — VAMOS A PROBARLO
  screen02: {
    eyebrow: 'DEMOSTRACIÓN INTERACTIVA',
    beat1: 'Vamos a probar Contexto™ con un caso.',
    beat2: 'Sin configurar nada.',
    beat3: 'Sin aprender nada.',
    beat4: 'Solo vamos a darle un dato.',
    ctaLabel: 'EMPEZAR PRUEBA',
  },

  // SCREEN 03 — EL CASO
  screen03: {
    eyebrow: 'CASO DEMOSTRATIVO',
    title: 'CASO DEMOSTRATIVO',
    beat1: 'Imagina que el primer día de la última menstruación de tu novia fue el 25 de agosto.',
    beat2: 'No necesitas introducir la fecha.',
    beat3: 'Contexto™ hará el resto.',
    ctaLabel: 'VER QUÉ ENCUENTRA',
  },

  // SCREEN 04 — EL DATO
  screen04: {
    eyebrow: 'DATO RECIBIDO',
    dateTag: '25 DE AGOSTO',
    dateSubtext: 'Primer día de la última menstruación.',
    beat1: 'Ahora mira qué hace Contexto™ con un dato tan sencillo.',
    ctaLabel: 'ANALIZAR',
  },

  // SCREEN 05 — MOTOR CONTEXTUAL
  screen05: {
    eyebrow: 'MOTOR CONTEXTUAL',
    headline: 'ANALIZANDO EL DATO...',
    subheadline: 'Preparando tu contexto.',
    helper: 'Esto tomará solo un momento.',
    steps: [
      { id: 'step1', text: 'RECIBIENDO DATO...' },
      { id: 'step2', text: 'CALCULANDO REFERENCIA...' },
      { id: 'step3', text: 'IDENTIFICANDO MOMENTO DEL CICLO...' },
      { id: 'step4', text: 'PREPARANDO CONTEXTO...' },
      { id: 'step5', text: 'LISTO.' },
    ],
    ctaLabel: 'VER RESULTADO',
  },

  // SCREEN 06 — EL CONTEXTO
  screen06: {
    eyebrow: 'CONTEXTO DE HOY',
    lead: 'Con este dato, Contexto™ puede generar una referencia orientativa del momento del ciclo.',
    sublabel: 'PODRÍA ESTAR EN',
    disclaimerBadge: 'Estimación orientativa',
    sectionTitle: '¿QUÉ ME APORTA SABER ESTO?',
    point1: 'Durante esta etapa ocurren cambios naturales en el cuerpo.',
    point2: 'No significa que ella vaya a sentirse o comportarse de una manera determinada.',
    point3: 'Cada mujer y cada ciclo pueden ser diferentes.',
    point4: 'Lo importante es que ahora tienes una pieza más de información antes de interpretar lo que ocurre.',
    closure: 'EL CONTEXTO ORIENTA. LA CONVERSACIÓN CONFIRMA.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 07 — LO IMPORTANTE NO ES LA FASE
  screen07: {
    eyebrow: 'INTERPRETACIÓN CORRECTA',
    title: 'LO IMPORTANTE NO ES LA FASE',
    beat1: 'Pero aquí está lo importante.',
    beat2: 'La fase no te dice cómo se siente ella.',
    beat3: 'Tampoco te dice cómo va a reaccionar.',
    beatQuestion: 'Entonces... ¿para qué sirve?',
    beat4: 'Para que no tengas que interpretar una situación con una sola pieza de información.',
    dominantWord: 'UNA PIEZA MÁS DE CONTEXTO',
    beat5: 'Ahora tienes un dato más.',
    beat6: 'Y ese dato puede cambiar la forma en que miras lo que está pasando.',
    ctaLabel: 'VER EL EJEMPLO',
  },

  // SCREEN 08 — UNA SITUACIÓN REAL
  screen08: {
    eyebrow: 'SITUACIÓN COTIDIANA',
    title: 'IMAGINA ESTO',
    story1: 'Ella llega a casa.',
    story2: 'Está más callada de lo habitual.',
    story3: 'Le preguntas si ocurre algo.',
    herResponse: '“Estoy cansada.”',
    question: '¿Qué harías normalmente?',
    options: [
      {
        id: 'A',
        code: 'A',
        label: 'OPCIÓN A',
        text: '“Seguro está molesta conmigo.”',
      },
      {
        id: 'B',
        code: 'B',
        label: 'OPCIÓN B',
        text: '“Le doy espacio y no pregunto más.”',
      },
      {
        id: 'C',
        code: 'C',
        label: 'OPCIÓN C',
        text: '“Le pregunto qué necesita y escucho su respuesta.”',
      },
    ] as SituationOption[],
  },

  // SCREEN 09 — CONTEXTO EN ACCIÓN
  screen09: {
    eyebrow: 'LA DIFERENCIA CONTEXTUAL',
    title: 'FÍJATE EN LO QUE ACABA DE PASAR',
    beat1: 'Sin contexto, tu mente tiene que completar los espacios vacíos.',
    beat2: 'Y cuando faltan datos, es fácil llenarlos con suposiciones.',
    beat3: 'Contexto™ no decide por ti.',
    beat4: 'Te ayuda a llegar a la situación con una pieza más de información.',
    formula: {
      part1: 'DATO',
      part2: 'OBSERVACIÓN',
      part3: 'CONVERSACIÓN',
      result: 'MEJOR CONTEXTO',
    },
    ctaLabel: 'VER QUÉ PREGUNTAR',
  },

  // SCREEN 10 — UNA MEJOR PREGUNTA
  screen10: {
    eyebrow: 'EN LUGAR DE ADIVINAR...',
    title: 'UNA MEJOR PREGUNTA',
    leadQuestion: '¿Qué necesita ella realmente?',
    alternative1Title: 'OPCIÓN 1',
    alternative1: '“¿Quieres contarme qué pasa?”',
    alternative2Title: 'OPCIÓN 2',
    alternative2: '“¿Quieres descansar un rato?”',
    takeaway: 'Contexto™ no te da una respuesta automática. Te ayuda a hacer mejores preguntas.',
    ctaLabel: 'VER ACCIÓN DE HOY',
  },

  // SCREEN 11 — UNA ACCIÓN PARA HOY
  screen11: {
    eyebrow: 'HERRAMIENTA COTIDIANA',
    title: 'ÍNDICE DE CONEXIÓN DIARIA™',
    modeLabel: 'MODO CUALITATIVO',
    modeValue: 'HOY: COMPRENDER',
    ideaTitle: 'UNA ACCIÓN',
    ideaBody: 'Antes de sacar una conclusión, pregunta.',
    microgestureTitle: 'MICROGESTO',
    microgestureBody: '“¿Cómo estás hoy?”',
    avoidTitle: 'QUÉ EVITAR',
    avoidBody: 'Convertir inmediatamente su estado de ánimo en una explicación sobre ti.',
    note: 'Una orientación diseñada para pausar la reactividad automática.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 12 — EL MICRORESULTADO
  screen12: {
    eyebrow: 'EL CAMBIO EN LA CONVERSACIÓN',
    beat1: 'Hace unos minutos solo tenías una situación.',
    beat2: 'Ahora tienes otra forma de mirarla.',
    beat3: 'No sabes exactamente qué le pasa.',
    beat4: 'Pero tampoco necesitas inventarlo.',
    verbs: ['Puedes observar.', 'Puedes preguntar.', 'Puedes escuchar.'],
    closure: 'Y eso ya cambia la conversación.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 13 — ¿TE SERÍA ÚTIL?
  screen13: {
    eyebrow: 'EVALUACIÓN DE UTILIDAD',
    lead: 'Si pudieras tener esta información contigo cada día...',
    question: '¿Crees que te ayudaría a reaccionar con más contexto?',
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
    ] as UtilityOption[],
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 14 — CIERRE DE LA PRUEBA
  screen14: {
    eyebrow: 'DEMOSTRACIÓN FINALIZADA',
    beat1: 'Esto fue solo una demostración.',
    beat2: 'Usamos un caso de ejemplo.',
    beat3: 'En Contexto™ real, el contexto se construye alrededor de tu relación y del momento que estás viviendo.',
    beat4: 'No para decirte cómo es ella.',
    beat5: 'Sino para ayudarte a comprender antes de reaccionar.',
    ctaLabel: 'CONTINUAR',
  },
};
