// EXP_08 — LA REVELACIÓN
// Narrative Experience Content Definition V1.0 — Contexto™

export interface ChoiceOption {
  id: string;
  code: 'A' | 'B' | 'C' | 'D';
  label: string;
  feedback: string;
  intent: 'medium' | 'high';
}

export interface ConnectionPillar {
  step: string;
  label: string;
  description: string;
}

export const EXP08_CONTENT = {
  // SCREEN 01 — EL SILENCIO
  screen01: {
    eyebrow: 'EXPEDIENTE // EXP_08',
    beat1: 'Antes de terminar...',
    beat2: '...quiero que mires todo lo que acabas de descubrir.',
    ctaLabel: 'REVISAR EL CASO',
  },

  // SCREEN 02 — EL CASO
  screen02: {
    eyebrow: 'RECONSTRUCCIÓN DE LOS HECHOS',
    beat1: 'Empezaste con una situación sencilla.',
    beat2: 'Ella cambió.',
    beat3: 'Tú reaccionaste.',
    beat4: 'Y apareció una pregunta.',
    initialQuestion: '¿Qué está pasando?',
    shiftLead: 'Pero la investigación cambió esa pregunta.',
    transformedQuestion: '¿Qué información me falta?',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 03 — LA PRIMERA PIEZA
  screen03: {
    eyebrow: 'PRIMER HALLAZGO // PIEZA 01',
    beat1: 'Primero descubriste algo.',
    beat2: 'No siempre reaccionas a lo que está pasando.',
    beat3: 'A veces reaccionas a lo que crees que está pasando.',
    badge: 'INTERPRETACIÓN',
    caption: 'El filtro previo con el que juzgas la realidad.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 04 — LA SEGUNDA PIEZA
  screen04: {
    eyebrow: 'SEGUNDO HALLAZGO // PIEZA 02',
    beat1: 'Después descubriste otra cosa.',
    beat2: 'Puedes tener buenas intenciones...',
    beat3: '...y aun así reaccionar mal.',
    beat4: 'No necesariamente porque no sepas amar.',
    beat5: 'Sino porque estás intentando decidir con información incompleta.',
    badge: 'INFORMACIÓN INCOMPLETA',
    caption: 'La ausencia de una coordenada esencial para comprender.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 05 — LA TERCERA PIEZA
  screen05: {
    eyebrow: 'TERCER HALLAZGO // PIEZA 03',
    beat1: 'Y entonces apareció la pieza que faltaba.',
    beat2: 'El contexto.',
    beat3: 'El momento.',
    beat4: 'El ciclo.',
    scientificNuance: 'El ciclo puede aportar una pieza adicional de contexto.',
    badge: 'CONTEXTO',
    caption: 'La variable biológica y temporal que contextualiza la experiencia.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 06 — LA CONEXIÓN
  screen06: {
    eyebrow: 'LA CONEXIÓN ESTRUCTURAL',
    beforePattern: [
      { step: '01', label: 'INTERPRETAS' },
      { step: '02', label: 'REACCIONAS' },
      { step: '03', label: 'CON INFORMACIÓN LIMITADA' },
    ],
    afterPattern: [
      { step: '01', label: 'CONSIDERAS' },
      { step: '02', label: 'OBSERVAS' },
      { step: '03', label: 'CON MÁS CONTEXTO' },
    ],
    closure1: 'No significa que ahora tengas todas las respuestas.',
    closure2: 'Significa que tienes una pregunta mejor.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 07 — EL DESCUBRIMIENTO
  screen07: {
    eyebrow: 'EL GIRO DEFINITIVO',
    lead: 'Y quizá eso era lo que estabas buscando.',
    negations: [
      'No una fórmula para entenderla.',
      'No una manera de predecirla.',
      'No una respuesta automática.',
    ],
    dominantReveal: 'Una forma de llegar con más contexto.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 08 — EL VERDADERO PROBLEMA
  screen08: {
    eyebrow: 'DIAGNÓSTICO DE FONDO',
    lead1: 'Entonces el problema nunca fue simplemente...',
    lead2: 'no saber qué hacer.',
    difficultyLead: 'La dificultad estaba en...',
    dominantHeadline: 'TENER QUE DECIDIR SIN VER EL CONTEXTO COMPLETO.',
    purposeClosure: 'Y ahora entiendes por qué una herramienta como Contexto™ puede tener sentido.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 09 — LA HERRAMIENTA
  screen09: {
    eyebrow: 'LA HERRAMIENTA // CONTEXTO™',
    title: 'CONTEXTO™',
    subtitle: 'Una Micro-App creada para poner esa pieza de información más cerca de ti.',
    steps: [
      { num: '01', text: 'Registras el inicio del ciclo.' },
      { num: '02', text: 'Conoces el momento aproximado.' },
      { num: '03', text: 'Recibes contexto.' },
      { num: '04', text: 'Consideras cómo actuar.' },
    ],
    finalAuthority: 'Y decides tú.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 10 — LA DECISIÓN (AUTONOMÍA)
  screen10: {
    eyebrow: 'AUTONOMÍA Y RESPONSABILIDAD',
    lead: 'Pero Contexto™ no decide por ti.',
    boundaries: [
      'No te dice qué hacer con tu pareja.',
      'No sustituye una conversación.',
      'No convierte una hipótesis en una certeza.',
    ],
    corePiece: 'Te da una pieza.',
    finalAutonomy: 'Tú decides qué hacer con ella.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 11 — LA EVALUACIÓN & LA INVITACIÓN
  screen11: {
    eyebrow: 'EVALUACIÓN & INVITACIÓN',
    questionLead: 'Después de todo lo que viste...',
    questionCore: '¿Qué crees que habría cambiado en algunas de esas situaciones si hubieras tenido más contexto?',
    options: [
      {
        id: 'opt_react_differently',
        code: 'A',
        label: 'Habría reaccionado diferente.',
        feedback: 'El espacio entre el estímulo y la respuesta te devuelve el control de tus actos.',
        intent: 'medium',
      },
      {
        id: 'opt_think_before_acting',
        code: 'B',
        label: 'Habría pensado antes de actuar.',
        feedback: 'Detener la inercia reactiva permite evaluar el escenario con serenidad.',
        intent: 'medium',
      },
      {
        id: 'opt_understood_moment',
        code: 'C',
        label: 'Habría entendido mejor el momento.',
        feedback: 'Reconocer las coordenadas del momento evita atribuir intenciones erróneas.',
        intent: 'high',
      },
      {
        id: 'opt_want_to_try',
        code: 'D',
        label: 'No lo sé, pero quiero probarlo.',
        feedback: 'Validar la herramienta en situaciones reales es el criterio más honesto y pragmático.',
        intent: 'high',
      },
    ] as ChoiceOption[],
    invitationLead1: 'Durante toda esta investigación has estado buscando una respuesta.',
    invitationLead2: 'Y ahora ya sabes dónde buscarla.',
    invitationHighlight: 'En el contexto.',
    invitationClosure1: 'Durante toda esta investigación has estado buscando una respuesta.',
    invitationClosure2: 'Y ahora ya sabes dónde buscarla: en el contexto.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 12 — CIERRE DEL CASO
  screen12: {
    eyebrow: 'DICTAMEN FINAL DEL EXPEDIENTE',
    caseTitle: 'Investigación completada.',
    mainFindingLabel: 'HALLAZGO PRINCIPAL',
    mainFindingText: 'Comprender antes de reaccionar empieza por tener contexto.',
    closureBeat: 'Toda la evidencia recogida apunta a la misma conclusión.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 13 — PASO FINAL (CIERRE DE LA INVESTIGACIÓN)
  screen13: {
    eyebrow: 'EXPEDIENTE // CIERRE DE LA INVESTIGACIÓN',
    beat1: 'Has llegado al final de la investigación.',
    beat2: 'A estas alturas ya puedes ver algo que antes era mucho más difícil de ver.',
    beat3: 'No necesitabas aprender a adivinarla.',
    beat4: 'Necesitabas aprender a comprender su contexto.',
    beat5: 'Y ahora que has visto cómo funciona, falta una última pieza.',
    ctaLabel: 'ABRIR INFORME FINAL',
  },
};
