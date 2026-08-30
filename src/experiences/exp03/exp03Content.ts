// Narrative and UI Content for EXP_03 (El Error Invisible) - V1.0
export const EXP03_CONTENT = {
  screen01: {
    leadCaseLabel: 'CASO',
    leadPiece: 'Tenemos una pieza más.',
    leadBefore: 'Pero antes...',
    leadShow: 'Quiero mostrarte algo.',
    ctaLabel: 'VER',
  },

  screen02: {
    beat1: 'Son las 8:47 p. m.',
    beat2: 'Habían quedado en verse.',
    beat3: 'Pero ella cancela.',
    dominantQuote: '“Hoy prefiero quedarme en casa.”',
    beat4: 'Nada más.',
    ctaLabel: 'CONTINUAR',
  },

  screen03: {
    beat1: 'Eso es todo lo que tienes.',
    beat2: 'Un mensaje.',
    beat3: 'Una respuesta.',
    beat4: 'Un cambio de plan.',
    beat5: 'Nada más.',
    ctaLabel: 'CONTINUAR',
  },

  screen04: {
    lead: 'Con esa información...',
    question: '...¿qué podría estar pasando?',
    options: [
      {
        id: 'opt_exp03_q1_a',
        code: 'A',
        label: 'Está molesta conmigo.',
        subtext: 'Interpretación centrada en conflicto personal.',
      },
      {
        id: 'opt_exp03_q1_b',
        code: 'B',
        label: 'Ya no quiere verme.',
        subtext: 'Interpretación de pérdida de interés o distancia.',
      },
      {
        id: 'opt_exp03_q1_c',
        code: 'C',
        label: 'Le pasa algo.',
        subtext: 'Interpretación de un malestar externo no definido.',
      },
      {
        id: 'opt_exp03_q1_d',
        code: 'D',
        label: 'No tengo suficiente información.',
        subtext: 'Reconocimiento explícito del vacío de datos.',
      },
    ],
  },

  screen05: {
    branches: {
      A: 'Es una explicación posible.',
      B: 'También es una explicación posible.',
      C: 'Puede ser.',
      D: 'Reconociste algo importante: todavía no tienes suficiente información.',
    },
    convergence:
      'Pero ninguna de esas explicaciones puede confirmarse con la información que tenías.',
    interesting: 'Interesante.',
    imagine: 'Ahora imagina que aparece una información que no tenías.',
    ctaLabel: 'MOSTRAR',
  },

  screen06: {
    beat1: 'Antes de cancelar la cita...',
    beat2: '...ella había tenido un día especialmente difícil.',
    beat3: 'Había dormido poco.',
    beat4: 'Tenía varias cosas encima.',
    beat5: 'Y desde hacía unas horas no se sentía bien.',
    ctaLabel: 'CONTINUAR',
  },

  screen06b: {
    lead: 'Ahora que conoces esa información...',
    question: '¿Cambiaría tu interpretación?',
    options: [
      {
        id: 'opt_exp03_q2_a',
        code: 'A',
        label: 'Sí.',
      },
      {
        id: 'opt_exp03_q2_b',
        code: 'B',
        label: 'Probablemente.',
      },
      {
        id: 'opt_exp03_q2_c',
        code: 'C',
        label: 'No estoy seguro.',
      },
      {
        id: 'opt_exp03_q2_d',
        code: 'D',
        label: 'No.',
      },
    ],
    microInsights: {
      A: 'Entonces acabas de comprobar algo.',
      B: 'Y esa duda es precisamente importante.',
      C: 'Reconocer que no estás seguro también es información.',
      D: 'Entonces observa qué información utilizaste para llegar a esa conclusión.',
    },
  },

  screen07: {
    lead: 'Ahora vuelve a mirar la primera escena.',
    quote: '“Hoy prefiero quedarme en casa.”',
    beat1: 'El mensaje no cambió.',
    beat2: 'La situación sí.',
    dominantTitle: 'Y ahí aparece el error invisible.',
    ctaLabel: 'CONTINUAR',
  },

  screen08: {
    eyebrow: 'REGISTRO',
    beat1: 'Tal vez alguna vez hiciste esto.',
    beat2: 'Viste una reacción.',
    beat3: 'Le diste una explicación.',
    beat4: 'Y actuaste según esa explicación.',
    beat5: 'Sin saber si realmente era cierta.',
    ctaLabel: 'CONTINUAR',
  },

  screen09: {
    beat1: 'El problema no siempre es interpretar mal.',
    beat2: 'El problema puede empezar antes.',
    dominant1: 'Interpretar demasiado pronto.',
    dominant2: 'Con información incompleta.',
    ctaLabel: 'CONTINUAR',
  },

  screen10: {
    beat1: 'Puedes tener buenas intenciones.',
    beat2: 'Puedes querer hacer lo correcto.',
    beat3: 'Puedes conocer muy bien a tu pareja.',
    beat4: 'Y aun así...',
    dominantPunch: '...equivocarte al interpretar lo que está pasando.',
    ctaLabel: 'CONTINUAR',
  },

  screen11: {
    lead: 'Entonces la pregunta ya no es...',
    oldQuestion: '¿Qué debería hacer?',
    mainQuestion: '¿Qué información me falta?',
    because: 'Porque quizá...',
    before: '...antes de aprender a reaccionar mejor...',
    punchline: '...necesitas aprender a mirar mejor.',
    ctaLabel: 'CONTINUAR',
  },

  screen12: {
    beat1: 'Tenemos una pregunta.',
    beat2: 'Ahora vamos a investigar la respuesta.',
    ctaLabel: 'CONTINUAR',
  },
};
