// EXP_07 — EL FUTURO
// Narrative Experience Content Definition V1.0 — Contexto™

export interface ChoiceOption {
  id: string;
  code: 'A' | 'B' | 'C' | 'D';
  label: string;
  feedback: string;
}

export interface MomentExample {
  number: string;
  trigger: string;
  insteadOf: string;
  newAction: string;
}

export const EXP07_CONTENT = {
  // SCREEN 01 — EL UMBRAL
  screen01: {
    eyebrow: 'PROYECCIÓN // EXP_07',
    beat1: 'Ya sabes qué es Contexto™.',
    beat2: 'Ahora quiero que imagines algo.',
    beat3: 'Una situación que probablemente ya has vivido.',
    ctaLabel: 'IMAGINAR',
  },

  // SCREEN 02 — UNA NOCHE CUALQUIERA
  screen02: {
    eyebrow: 'ESCENARIO COTIDIANO',
    beat1: 'Es una noche cualquiera.',
    beat2: 'Llegas a casa.',
    beat3: 'Hablas con ella.',
    beat4: 'Notas que algo está diferente.',
    beat5: 'Está más callada.',
    beat6: 'Y no sabes por qué.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 03 — EL MISMO MOMENTO
  screen03: {
    eyebrow: 'LA NUEVA VARIABLE',
    beat1: 'El momento es el mismo.',
    beat2: 'Pero ahora...',
    beat3: '...tienes una pieza de contexto que antes no tenías.',
    nuance1: 'No es una respuesta.',
    nuance2: 'No es una explicación definitiva.',
    nuance3: 'Es información adicional.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 04 — PRIMER CAMINO (ANTES)
  screen04: {
    eyebrow: 'PRIMER CAMINO',
    title: 'ANTES',
    flow: [
      'Ella está diferente.',
      '¿Qué hice?',
      '¿Está molesta?',
      '¿Hice algo mal?',
      '¿Qué debería hacer?',
    ],
    closure: 'Y empiezas a reaccionar antes de comprender.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 05 — SEGUNDO CAMINO (AHORA)
  screen05: {
    eyebrow: 'SEGUNDO CAMINO',
    title: 'AHORA',
    flow: [
      'Ella está diferente.',
      'Primero observas.',
      'Recuerdas el contexto disponible.',
      'Consideras que el momento puede influir.',
      'Y después...',
      '...hablas con ella.',
    ],
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 06 — EL CAMBIO (REVELACIÓN EMOCIONAL)
  screen06: {
    eyebrow: 'REVELACIÓN',
    question: '¿Ves la diferencia?',
    beat1: 'No cambió ella.',
    beat2: 'No cambió la situación.',
    lead: 'Lo que cambió...',
    dominantReveal: '...fue la información con la que tú entraste en ese momento.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 07 — UNA NUEVA FORMA DE MIRAR
  screen07: {
    eyebrow: 'EL GIRO DE PERSPECTIVA',
    beat1: 'Contexto™ no te dice qué pensar de ella.',
    beat2: 'Te ayuda a considerar qué más podrías estar pasando por alto.',
    shiftLead: 'Y eso cambia la pregunta.',
    beforeQuestion: '¿Qué está mal?',
    afterQuestion: '¿Qué necesito comprender?',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 08 — TRES MOMENTOS
  screen08: {
    eyebrow: 'APLICACIÓN COTIDIANA // 3 MOMENTOS',
    lead: 'Tres situaciones comunes donde el contexto transforma la respuesta:',
    moments: [
      {
        number: '01',
        trigger: 'Está más sensible.',
        insteadOf: 'En lugar de asumir...',
        newAction: 'observas y consideras el contexto.',
      },
      {
        number: '02',
        trigger: 'Quiere estar sola.',
        insteadOf: 'En lugar de tomarlo personalmente...',
        newAction: 'consideras que quizá necesitas más información.',
      },
      {
        number: '03',
        trigger: 'Está más receptiva.',
        insteadOf: 'En lugar de dejar pasar el momento...',
        newAction: 'aprovechas para conectar.',
      },
    ] as MomentExample[],
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 09 — LO QUE CAMBIA
  screen09: {
    eyebrow: 'TRANSFORMACIÓN DE FONDO',
    beat1: 'Tal vez el verdadero cambio no está en saber más sobre el ciclo.',
    beat2: 'Está en dejar de reaccionar con una sola explicación.',
    leadPossibility: 'Porque cuando tienes más contexto...',
    possibilityCore: '...tienes más posibilidades de responder con intención.',
    triad: [
      'No desde el miedo.',
      'No desde la suposición.',
      'Desde la comprensión.',
    ],
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 10 — LO QUE NO CAMBIA (CREDIBILIDAD Y LÍMITES)
  screen10: {
    eyebrow: 'LÍMITES REALISTAS',
    warningLead: 'Pero hay algo importante.',
    hardTruths: [
      'Seguirán existiendo días difíciles.',
      'Seguirán existiendo conversaciones incómodas.',
      'Seguirán existiendo desacuerdos.',
    ],
    realityCheck: 'Contexto™ no elimina eso.',
    purposeClosure: 'Solo te ayuda a llegar a esos momentos con una pieza más de información.',
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 11 — EL DESEO (AUTOEVALUACIÓN)
  screen11: {
    eyebrow: 'IMAGINACIÓN COTIDIANA',
    lead1: 'Ahora imagina tener esa referencia todos los días.',
    notFor: [
      'No para controlar.',
      'No para predecir.',
      'No para encontrar excusas.',
    ],
    forLead: 'Para comprender.',
    forClosure: 'Antes de reaccionar.',
    finalQuestion: '¿Te serviría?',
    options: [
      {
        id: 'opt_quite_a_lot',
        code: 'A',
        label: 'Sí, bastante.',
        feedback: 'Tener una coordenada diaria transforma la incertidumbre en claridad operativa.',
      },
      {
        id: 'opt_think_so',
        code: 'B',
        label: 'Creo que sí.',
        feedback: 'Contar con una referencia previa facilita abordar las conversaciones con serenidad.',
      },
      {
        id: 'opt_try_first',
        code: 'C',
        label: 'Tendría que probarlo.',
        feedback: 'Experimentar el impacto en situaciones reales es la forma más honesta de evaluarlo.',
      },
      {
        id: 'opt_not_sure',
        code: 'D',
        label: 'No estoy seguro.',
        feedback: 'Es natural mantener la reserva antes de comprobar cómo se siente en tu día a día.',
      },
    ] as ChoiceOption[],
    ctaLabel: 'CONTINUAR',
  },

  // SCREEN 12 — PREPARACIÓN PARA LA REVELACIÓN
  screen12: {
    eyebrow: 'EL SIGUIENTE UMBRAL',
    lead1: 'Hay algo que todavía no has visto.',
    lead2: 'Porque hasta ahora...',
    lead3: '...solo has imaginado cómo podría ser utilizar Contexto™.',
    prelude: 'Ahora vas a ver...',
    dominantReveal: '...qué hay realmente detrás.',
    ctaLabel: 'VER LA REVELACIÓN',
  },
};
