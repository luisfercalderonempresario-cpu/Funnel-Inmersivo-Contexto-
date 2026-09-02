// EXP_07 — LA PRUEBA (Content & Copy Definitions V3.0 - Full 13-Screen Cinematic Interactive Demo)

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  code: 'A' | 'B' | 'C' | 'D';
  label: string;
  text: string;
}

export const EXP07_CONTENT = {
  // Demo Case Static Reference
  demoCase: {
    dateStr: '2026-08-25',
    displayDate: '25 DE AGOSTO',
    intro: 'El primer día de la última menstruación de tu novia fue:',
  },

  // SCREEN 01 — LA PRUEBA
  screen01: {
    eyebrow: 'EXP_07 / LA PRUEBA',
    beat1: 'Hasta ahora has estado descubriendo qué es el contexto.',
    beat2: 'Ahora vamos a hacer algo diferente.',
    beat3: 'Vamos a verlo funcionar.',
    beat4: 'No necesitas responder nada.',
    beat5: 'Vamos a simular una situación real.',
    ctaLabel: 'PROBAR CONTEXTO™',
  },

  // SCREEN 02 — EL DATO
  screen02: {
    eyebrow: 'SUPONGAMOS QUE...',
    lead: 'El primer día de la última menstruación de tu novia fue:',
    dateTag: '25 DE AGOSTO',
    beat1: 'Eso es prácticamente todo lo que necesitas introducir.',
    beat2: 'Ahora observa qué hace Contexto™ con ese dato.',
    ctaLabel: 'ANALIZAR ESTE CASO',
  },

  // SCREEN 03 — MOTOR CONTEXTUAL
  screen03: {
    eyebrow: 'MOTOR CONTEXTUAL',
    steps: [
      { id: 'step1', text: 'ANALIZANDO CASO...' },
      { id: 'step2', text: 'Identificando referencia...' },
      { id: 'step3', text: 'Estimando momento del ciclo...' },
      { id: 'step4', text: 'Preparando contexto de hoy...' },
      { id: 'step5', text: 'LISTO.' },
    ],
  },

  // SCREEN 04 — TU CONTEXTO DE HOY
  screen04: {
    eyebrow: 'INFORMACIÓN ORIENTATIVA',
    title: 'TU CONTEXTO DE HOY',
    referenceLabel: 'Referencia estimada:',
    referenceValue: 'UNA ETAPA DE CAMBIO DENTRO DEL CICLO',
    phaseSecondary: 'FASE FOLICULAR · DÍA 8 ESTIMADO',
    explanation1: 'En esta etapa pueden producirse cambios fisiológicos que algunas mujeres experimentan de maneras diferentes.',
    explanation2: 'Pero esto no te dice cómo se siente ella.',
    explanation3: 'Y Contexto™ no intenta adivinarlo.',
    closure: 'Lo importante es saber qué observar y cómo acercarte.',
    ctaLabel: 'VER QUÉ PUEDES HACER HOY',
  },

  // SCREEN 05 — LO QUE ESTÁS PASANDO POR ALTO
  screen05: {
    eyebrow: 'PERSPECTIVA CONTEXTUAL',
    title: 'HAY ALGO QUE NORMALMENTE NO VES',
    beat1: 'Tú recibes únicamente el comportamiento.',
    beat2: 'Contexto™ añade una pieza de información que normalmente no tienes presente:',
    highlight: 'EL MOMENTO DEL CICLO',
    beat3: 'Eso no te dice cómo se siente.',
    beat4: 'Pero cambia la forma en la que puedes acercarte a ella.',
    ctaLabel: 'MOSTRARME EL CONTEXTO',
  },

  // SCREEN 06 — LA PREGUNTA
  screen06: {
    eyebrow: 'PARTICIPACIÓN ACTIVA',
    title: 'ANTES DE ACTUAR...',
    question: '¿Qué sería más inteligente hacer primero?',
    options: [
      {
        id: 'A',
        code: 'A',
        label: 'A',
        text: 'Intentar solucionar lo que creo que le pasa.',
      },
      {
        id: 'B',
        code: 'B',
        label: 'B',
        text: 'Preguntarle directamente cómo se siente.',
      },
      {
        id: 'C',
        code: 'C',
        label: 'C',
        text: 'Observar cómo está y acercarme sin asumir.',
      },
      {
        id: 'D',
        code: 'D',
        label: 'D',
        text: 'Darle espacio y esperar a que ella diga algo.',
      },
    ] as QuestionOption[],
    reflectionTitle: 'Exactamente.',
    reflectionBeat1: 'El contexto no reemplaza la conversación.',
    reflectionBeat2: 'Te ayuda a llegar a ella de una mejor manera.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 07 — CONTEXTO → DECISIÓN
  screen07: {
    eyebrow: 'APLICACIÓN PRÁCTICA',
    title: 'AHORA CONVIERTE EL CONTEXTO EN UNA DECISIÓN',
    beat1: 'Con esta referencia, Contexto™ no te dice:',
    quote1: '“Ella está así.”',
    beat2: 'Te dice:',
    quote2: '“Hoy podrías probar esto.”',
    blockLabel: 'HOY',
    blockBody: 'Busca un momento tranquilo para preguntarle cómo está, sin intentar solucionar nada inmediatamente.',
    comparisonInstead: 'En lugar de:',
    comparisonBad: '“¿Qué te pasa?”',
    comparisonTry: 'Prueba:',
    comparisonGood: '“¿Cómo has estado hoy? ¿Quieres contarme algo o prefieres que simplemente esté contigo?”',
    ctaLabel: 'VER MI ACCIÓN DE HOY',
  },

  // SCREEN 08 — ACCIÓN DE HOY
  screen08: {
    eyebrow: 'HERRAMIENTA COTIDIANA',
    title: 'TU ACCIÓN DE HOY',
    timing: 'Esta noche, cuando estén tranquilos:',
    action: 'Pregúntale cómo estuvo su día y escucha su respuesta sin convertirla inmediatamente en un problema que tienes que solucionar.',
    scenarios: [
      { condition: 'SI QUIERE HABLAR', arrow: '→', action: 'ESCUCHA.' },
      { condition: 'SI NO QUIERE HABLAR', arrow: '→', action: 'NO LO CONVIERTAS EN RECHAZO.' },
      { condition: 'SI NECESITA ALGO', arrow: '→', action: 'PREGÚNTALE CÓMO PUEDES AYUDAR.' },
    ],
    closure: 'Una conversación de 2 minutos puede cambiar completamente cómo termina el día.',
    ctaLabel: 'VER QUÉ EVITAR',
  },

  // SCREEN 09 — EL ERROR QUE CONTEXTO™ TE AYUDA A EVITAR
  screen09: {
    eyebrow: 'BENEFICIO PREVENTIVO',
    title: 'Y HAY ALGO QUE HOY CONVIENE EVITAR',
    highlight: 'INTERPRETAR ANTES DE PREGUNTAR.',
    examples: [
      { trigger: 'Si está más callada:', note: 'no significa automáticamente que esté molesta contigo.' },
      { trigger: 'Si está cansada:', note: 'no significa automáticamente que haya un problema.' },
      { trigger: 'Si necesita espacio:', note: 'no significa automáticamente que se esté alejando.' },
    ],
    closure: 'El contexto no te da una respuesta definitiva. Te ayuda a no inventarla.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 10 — ÍNDICE DE CONEXIÓN DIARIA™
  screen10: {
    eyebrow: 'MICRO-APP INTERFACE',
    title: 'ÍNDICE DE CONEXIÓN DIARIA™',
    items: [
      { label: 'COMPRENDER', text: 'Antes de reaccionar, intenta entender.' },
      { label: 'ACERCARTE', text: 'Pregunta cómo está sin presionarla para responder.' },
      { label: 'ESCUCHAR', text: 'Si decide hablar, escucha antes de intentar solucionar.' },
      { label: 'EVITAR', text: 'Convertir su estado de ánimo en una explicación sobre ti.' },
    ],
    principle: 'EL CONTEXTO ORIENTA. LA CONVERSACIÓN CONFIRMA.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 11 — MOMENTO WOW
  screen11: {
    eyebrow: 'SÍNTESIS DE LA EXPERIENCIA',
    title: 'MIRA LO QUE ACABAS DE HACER',
    lead: 'Solo introdujimos UN DATO.',
    steps: [
      'UNA REFERENCIA',
      'UNA FORMA DE INTERPRETAR EL MOMENTO',
      'UNA PREGUNTA',
      'UNA ACCIÓN',
      'UNA FORMA DE CONECTAR MEJOR',
    ],
    summary: 'Eso es Contexto™.',
    conclusion1: 'No te enseña a controlar a tu pareja.',
    conclusion2: 'Te ayuda a comprender mejor antes de reaccionar.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 12 — EL DESEO
  screen12: {
    eyebrow: 'DISPONIBILIDAD DIARIA',
    title: 'AHORA IMAGINA TENER ESTO CADA DÍA',
    lead: 'No tener que preguntarte constantemente:',
    questions: [
      '“¿Qué le pasa?”',
      '“¿Hice algo?”',
      '“¿Qué debería hacer?”',
    ],
    transition: 'Sino poder abrir Contexto™ y encontrar:',
    features: [
      'QUÉ CONTEXTO TENER PRESENTE',
      'QUÉ OBSERVAR',
      'CÓMO ACERCARTE',
      'QUÉ PODRÍAS HACER HOY',
      'Y QUÉ SERÍA MEJOR EVITAR',
    ],
    closure: 'Eso cambia la forma de vivir una relación.',
    ctaLabel: 'QUIERO VER MI CONTEXTO CADA DÍA',
  },

  // SCREEN 13 — TRANSICIÓN A LA REVELACIÓN
  screen13: {
    eyebrow: 'SIGUIENTE PASO',
    beat1: 'Esto fue solo una demostración.',
    beat2: 'En la aplicación real, este contexto cambia a medida que avanza el ciclo.',
    beat3: 'Y puedes consultarlo cada día.',
    ctaLabel: 'VER EL RESUMEN DE MI CASO',
  },
};
