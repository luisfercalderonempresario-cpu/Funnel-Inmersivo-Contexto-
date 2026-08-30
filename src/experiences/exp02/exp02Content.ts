// Narrative and UI Content for EXP_02 (El Espejo) - V1.1 Refinement

export const EXP02_CONTENT = {
  screen01: {
    leadCaseLabel: 'CASO',
    leadPause1: 'SIGAMOS.',
    leadText1: 'Ahora quiero mostrarte algo más cotidiano.',
    leadText2: 'Algo que probablemente te ha pasado.',
    ctaLabel: 'CONTINUAR',
  },

  screen02: {
    beat1: 'Es de noche.',
    beat2: 'Estás hablando con tu pareja.',
    beat3: 'Todo parecía estar bien.',
    beat4: 'Pero de repente...',
    dominantQuote: '“Hoy no quiero salir.”',
    ctaLabel: 'CONTINUAR',
  },

  screen03: {
    question: '¿Qué piensas primero?',
    options: [
      {
        id: 'opt_q1_a',
        code: 'A',
        label: '¿Qué le pasa?',
        subtext: 'Búsqueda inmediata de una causa o motivo.',
      },
      {
        id: 'opt_q1_b',
        code: 'B',
        label: 'Seguro hice algo.',
        subtext: 'Asunción automática de responsabilidad directa.',
      },
      {
        id: 'opt_q1_c',
        code: 'C',
        label: 'Bueno, que se quede en casa.',
        subtext: 'Reacción práctica de distancia inmediata.',
      },
      {
        id: 'opt_q1_d',
        code: 'D',
        label: 'No sé qué está pasando.',
        subtext: 'Reconocimiento de incertidumbre total.',
      },
    ],
  },

  screen04: {
    introLabel: 'REGISTRO DE CONVERSACIÓN',
    messages: [
      { speaker: 'YOU', text: '¿Qué pasó?' },
      { speaker: 'HER', text: 'No sé.' },
      { speaker: 'YOU', text: '¿Estás molesta conmigo?' },
      { speaker: 'HER', text: 'No.' },
      { speaker: 'YOU', text: 'Entonces, ¿qué tienes?' },
      { speaker: 'HER', text: 'No quiero hablar ahora.' },
    ],
    ctaLabel: 'CONTINUAR',
  },

  screen05: {
    beat1: 'Y aquí suele pasar algo.',
    beat2: 'Intentas entender lo que está pasando...',
    beat3: '...con la información que tienes.',
    dominantText: 'El problema es que quizá no tienes toda la información.',
    ctaLabel: 'CONTINUAR',
  },

  screen06: {
    lead1: 'Ahora mírate a ti.',
    lead2: 'Cuando algo cambia en ella...',
    question: '¿Qué haces tú?',
    options: [
      {
        id: 'opt_q2_a',
        code: 'A',
        label: 'Intento arreglarlo.',
        subtext: 'Búsqueda activa de soluciones operativas.',
      },
      {
        id: 'opt_q2_b',
        code: 'B',
        label: 'Intento averiguar qué hice.',
        subtext: 'Revisión exhaustiva de posibles errores propios.',
      },
      {
        id: 'opt_q2_c',
        code: 'C',
        label: 'Le doy espacio.',
        subtext: 'Retirada cautelosa a la espera de que se resuelva.',
      },
      {
        id: 'opt_q2_d',
        code: 'D',
        label: 'Me bloqueo.',
        subtext: 'Inmovilidad ante la falta de un camino claro.',
      },
    ],
  },

  // SCREEN A — TU REGISTRO
  screen07a: {
    eyebrow: 'TU REGISTRO',
    firstResponseQuotes: {
      A: 'Dijiste que lo primero que piensas es:\n“¿Qué le pasa?”',
      B: 'Dijiste que lo primero que piensas es:\n“Seguro hice algo.”',
      C: 'Dijiste que tu primera reacción es dejar que se quede en casa.',
      D: 'Dijiste que no sabes qué está pasando.',
    },
    followUp: 'Y eso nos dice algo.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN B — LO QUE BUSCAS
  screen07b: {
    beat1: 'Cuando algo cambia...',
    beat2: '...tu mente intenta encontrar una explicación.',
    questions: [
      '¿Qué pasó?',
      '¿Qué hice?',
      '¿Qué necesita?',
      '¿Cómo lo arreglo?',
    ],
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN C — LO QUE NO PUEDES VER
  screen07c: {
    beat1: 'Pero hay algo que no puedes revisar.',
    beat2: 'Lo que estaba pasando con ella...',
    beat3: '...antes de que tú llegaras a esa conversación.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN D — LA NUEVA PREGUNTA
  screen07d: {
    lead: 'Y eso cambia la pregunta.',
    beforeLabel: 'Antes:',
    beforeQuestion: '¿Qué hice mal?',
    afterLabel: 'Después:',
    afterQuestion: '¿Qué estaba pasando que yo no podía ver?',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN E — PARTICIPACIÓN (TERCERA PREGUNTA)
  screen07e: {
    lead: 'Piensa en la última vez que no entendiste a tu pareja.',
    question: '¿Qué intentaste descubrir primero?',
    options: [
      {
        id: 'opt_q3_a',
        code: 'A',
        label: 'Qué hice mal.',
        subtext: 'Búsqueda de responsabilidad propia.',
      },
      {
        id: 'opt_q3_b',
        code: 'B',
        label: 'Qué le pasaba.',
        subtext: 'Búsqueda del detonante en su estado.',
      },
      {
        id: 'opt_q3_c',
        code: 'C',
        label: 'Cómo arreglarlo.',
        subtext: 'Búsqueda inmediata de resolución práctica.',
      },
      {
        id: 'opt_q3_d',
        code: 'D',
        label: 'Por qué estaba actuando así.',
        subtext: 'Búsqueda de lógica detrás de su comportamiento.',
      },
    ],
  },

  // SCREEN F — MICROREVELACIÓN
  screen08: {
    branches: {
      A: 'Buscaste la explicación en ti.',
      B: 'Buscaste la explicación en ella.',
      C: 'Buscaste una solución antes de tener toda la explicación.',
      D: 'Buscaste una explicación para algo que todavía no podías ver completo.',
    },
    pivot: 'Y quizá ahí está el problema.',
    pause1: 'No que no quieras entenderla.',
    pause2: 'Sino que quizá estás intentando entender una parte de la historia...',
    pause3: '...sin conocer toda la historia.',
    finalLead: 'Tal vez no te falta intención.',
    finalPunch: 'Tal vez te falta información.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN G — CIERRE
  screen09: {
    beat1: 'Y si eso es cierto...',
    beat2: '...hay una pieza que todavía no tenemos.',
    beat3: 'Una pieza que podría cambiar la forma en que interpretas estos momentos.',
    ctaLabel: 'CONTINUAR',
  },
};
