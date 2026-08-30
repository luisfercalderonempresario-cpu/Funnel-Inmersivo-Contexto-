// Content Dictionary for EXP_04 (La Investigación) - Contexto™ Narrative Experience V1.0

export interface Exp04QuestionOption {
  id: string;
  code: 'A' | 'B' | 'C' | 'D';
  label: string;
  feedback: string;
}

export const EXP04_CONTENT = {
  // SCREEN 01 — INICIO DE INVESTIGACIÓN
  screen01: {
    eyebrow: 'EXPEDIENTE',
    leadStart: 'Comencemos la investigación.',
    questionIntro: 'Tenemos una pregunta.',
    mainQuestion: '¿Qué información falta?',
    ctaLabel: 'INICIAR',
  },

  // SCREEN 02 — PRIMER INDICIO
  screen02: {
    eyebrow: 'PRIMER INDICIO',
    beat1: 'Un martes.',
    beat2: 'Todo está normal.',
    beat3: 'Hablan.',
    beat4: 'Se ríen.',
    beat5: 'Planean verse el fin de semana.',
    pauseBeat: 'Dos días después...',
    changeBeat: 'Algo cambia.',
    outcomeBeat: 'No quiere salir.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 03 — SEGUNDO INDICIO
  screen03: {
    eyebrow: 'SEGUNDO INDICIO',
    beat1: 'Una semana después.',
    beat2: 'Vuelve a ocurrir.',
    beat3: 'Menos paciencia.',
    beat4: 'Más cansancio.',
    beat5: 'Menos ganas de hablar.',
    beat6: 'No sabes exactamente por qué.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 04 — COMPARACIÓN
  screen04: {
    eyebrow: 'COMPARACIÓN',
    lead1: 'Dos momentos.',
    lead2: 'Una misma persona.',
    lead3: 'Comportamientos diferentes.',
    silenceQuestion: '¿Qué cambió?',
    question: '¿Qué crees que puede estar detrás?',
    options: [
      {
        id: 'opt_a',
        code: 'A',
        label: 'Algo que ocurrió.',
        feedback: 'Es posible.',
      },
      {
        id: 'opt_b',
        code: 'B',
        label: 'Su estado emocional.',
        feedback: 'Puede influir.',
      },
      {
        id: 'opt_c',
        code: 'C',
        label: 'Algo que está viviendo.',
        feedback: 'También puede ser.',
      },
      {
        id: 'opt_d',
        code: 'D',
        label: 'No tengo suficiente información.',
        feedback: 'Y esa posibilidad es importante.',
      },
    ] as Exp04QuestionOption[],
    convergence1: 'Pero todavía tenemos un problema.',
    convergence2: 'No sabemos qué cambió.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 05 — LA ANOMALÍA
  screen05: {
    eyebrow: 'LA ANOMALÍA',
    recordA: {
      tag: 'REGISTRO A',
      day: 'MARTES',
      time: '08:15 PM',
      items: [
        'Conversación fluida.',
        'Buen ánimo.',
        'Planes.',
      ],
    },
    recordB: {
      tag: 'REGISTRO B',
      day: 'VIERNES',
      time: '08:47 PM',
      items: [
        'Más cansancio.',
        'Menos paciencia.',
        'Quiere estar sola.',
      ],
    },
    questionPerson: '¿Es la misma persona?',
    answerYes: 'Sí.',
    thenBeat: 'Entonces...',
    anomalyQuestion: '¿Qué cambió?',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 06 — TU HIPÓTESIS
  screen06: {
    eyebrow: 'TU HIPÓTESIS',
    lead: 'Si solamente observas el viernes...',
    question: '¿Qué conclusión podrías sacar?',
    options: [
      {
        id: 'opt_a',
        code: 'A',
        label: 'Está molesta.',
        feedback: 'Es una interpretación posible.',
      },
      {
        id: 'opt_b',
        code: 'B',
        label: 'Está distante.',
        feedback: 'También es posible.',
      },
      {
        id: 'opt_c',
        code: 'C',
        label: 'Algo le pasa.',
        feedback: 'Es una hipótesis.',
      },
      {
        id: 'opt_d',
        code: 'D',
        label: 'No puedo saberlo todavía.',
        feedback: 'Reconoces el límite de la información.',
      },
    ] as Exp04QuestionOption[],
    convergence: 'Pero todavía estamos mirando solamente una fotografía.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 07 — SEGUNDA EVIDENCIA
  screen07: {
    eyebrow: 'SEGUNDA EVIDENCIA',
    beat1: 'Dos semanas después.',
    beat2: 'Vuelve a aparecer.',
    beat3: 'Otro momento.',
    beat4: 'Otro comportamiento.',
    beat5: 'Y después...',
    beat6: 'Todo vuelve a cambiar.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 08 — EL PATRÓN
  screen08: {
    eyebrow: 'EL PATRÓN',
    beat1: 'Una vez puede ser casualidad.',
    beat2: 'Dos veces puede no significar nada.',
    beat3: 'Pero cuando algo empieza a repetirse...',
    revelation: '...merece ser investigado.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 09 — LO QUE NO PUEDES VER
  screen09: {
    eyebrow: 'LO QUE NO PUEDES VER',
    beat1: 'El problema...',
    beat2: '...es que tú ves el comportamiento.',
    dominantLead: 'Pero no necesariamente ves todo lo que está ocurriendo detrás.',
    beat3: 'Hay procesos que ocurren...',
    beat4: '...sin pedir permiso para aparecer.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 10 — LA VARIABLE
  screen10: {
    eyebrow: 'LA VARIABLE',
    beat1: 'En una investigación...',
    beat2: 'cuando algo cambia...',
    beat3: 'buscas qué variable también cambió.',
    variableLabel: 'VARIABLE',
    q1: '¿Qué cambió?',
    q2: '¿Cuándo cambió?',
    q3: '¿Con qué frecuencia?',
    q4: '¿Se repite?',
    question: 'Si quisieras investigar este caso...',
    subQuestion: '¿Qué observarías?',
    options: [
      {
        id: 'opt_a',
        code: 'A',
        label: 'Solo lo que hace.',
        feedback: 'El comportamiento importa.',
      },
      {
        id: 'opt_b',
        code: 'B',
        label: 'Cuándo ocurre.',
        feedback: 'El momento también importa.',
      },
      {
        id: 'opt_c',
        code: 'C',
        label: 'Qué estaba pasando alrededor.',
        feedback: 'El contexto alrededor puede aportar información.',
      },
      {
        id: 'opt_d',
        code: 'D',
        label: 'Ambas cosas: qué ocurre y cuándo.',
        feedback: 'Exactamente ahí empieza una investigación más profunda.',
      },
    ] as Exp04QuestionOption[],
    convergenceLead: 'Porque quizá...',
    convergenceWhat: '...el patrón no está solamente en LO QUE ocurre.',
    convergenceWhen: 'Puede estar también en CUÁNDO ocurre.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 11 — LA PREGUNTA ABIERTA
  screen11: {
    eyebrow: 'LA PREGUNTA ABIERTA',
    beat1: 'Si existe un patrón...',
    beat2: 'y si ese patrón aparece en determinados momentos...',
    beat3: 'entonces necesitamos descubrir algo.',
    dominantQuestion: '¿Qué está ocurriendo durante esos momentos?',
    closure: 'Eso es lo que vamos a investigar.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 12 — TRANSICIÓN A EXP_05
  screen12: {
    eyebrow: 'TRANSICIÓN',
    beat1: 'Tenemos suficientes indicios.',
    beat2: 'Pero todavía nos falta una pieza.',
    dominantPiece: 'Una pieza importante.',
    beat3: 'En la siguiente parte del caso...',
    beat4: '...vamos a buscarla.',
    ctaLabel: 'BUSCAR LA PIEZA FALTANTE',
  },
};
