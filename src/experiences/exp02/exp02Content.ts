// Narrative and UI Content for EXP_02 (El Espejo)

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

  screen07: {
    // Empathetic Branching Interpretations for Q1
    interpretationReflections: {
      A: 'Cuando no encuentras una explicación, es fácil buscar una.',
      B: 'Cuando no encuentras una explicación, es fácil asumir que fuiste tú.',
      C: 'A veces la primera reacción es tomar una distancia práctica.',
      D: 'Reconocer la confusión es el primer paso para no inventar explicaciones.',
    },
    // Empathetic Branching Interpretations for Q2
    reactionReflections: {
      A: 'Tu impulso inmediato es actuar y buscar una solución activa.',
      B: 'Revisas mentalmente cada interacción para entender si hubo un error.',
      C: 'Prefieres no presionar y dar espacio para evitar empeorar la situación.',
      D: 'La falta de claridad te deja sin un mapa de acción inmediato.',
    },
    coreQuestion1: '¿Y si el problema no fuera tu intención?',
    coreQuestion2:
      '¿Y si estuvieras intentando responder a una situación que no puedes ver completa?',
    contrastLead: 'Porque hay una diferencia entre...',
    contrastA: 'NO SABER QUÉ HACER',
    contrastAnd: 'y',
    contrastB: 'NO TENER EL CONTEXTO PARA SABER QUÉ HACER.',
    ctaLabel: 'CONTINUAR',
  },

  screen08: {
    lead1: 'Tal vez no estás fallando por no saber amar.',
    lead2: 'Tal vez estás reaccionando con información incompleta.',
    lead3: 'Y si eso es cierto...',
    lead4: '...entonces aprender a reaccionar mejor no empieza por reaccionar.',
    conclusion: 'Empieza por comprender.',
    ctaLabel: 'CONTINUAR',
  },

  screen09: {
    lead1: 'Acabas de hacer algo importante.',
    lead2: 'No intentaste resolverla.',
    lead3: 'Intentaste observar cómo reaccionas tú.',
    lead4: 'Y eso nos da una pista.',
    lead5: 'Pero todavía falta una pieza.',
    lead6:
      'Una que puede cambiar completamente la forma en que interpretas estos momentos.',
    ctaLabel: 'CONTINUAR',
  },

  screen10: {
    lead1: 'SIGAMOS.',
    lead2: 'Porque ahora vamos a buscar esa pieza.',
    ctaLabel: 'CONTINUAR',
  },
};
