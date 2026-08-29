export interface EXP01Option {
  id: string;
  code: 'A' | 'B' | 'C' | 'D' | 'YES' | 'NO';
  label: string;
  sublabel?: string;
}

export const EXP01_CONTENT = {
  screen01: {
    leadText: 'HAY ALGO QUE QUIERO MOSTRARTE.',
    subText: 'PERO ANTES NECESITO QUE HAGAS ALGO.',
    ctaLabel: 'ENTRAR',
  },
  screen02: {
    eyebrow: 'EXPEDIENTE &bull; PASO 01',
    leadText: 'Antes de seguir, quiero hacerte una pregunta.',
    question: 'Cuando tu pareja cambia de ánimo contigo, ¿qué haces normalmente?',
    options: [
      {
        id: 'opt_a',
        code: 'A',
        label: 'Intento hablarlo inmediatamente.',
      },
      {
        id: 'opt_b',
        code: 'B',
        label: 'Le doy espacio y espero que se le pase.',
      },
      {
        id: 'opt_c',
        code: 'C',
        label: 'Intento entender qué hice mal.',
      },
      {
        id: 'opt_d',
        code: 'D',
        label: 'A veces no sé qué hacer.',
      },
    ] as EXP01Option[],
  },
  screen03: {
    eyebrow: 'REGISTRO DE CASO',
    leadText: 'Bien. Ya tenemos el primer dato.',
    bodyText: 'Voy a guardar tus respuestas porque las vamos a necesitar más adelante.',
    badgeLabel: 'EXPEDIENTE ASIGNADO',
    ctaLabel: 'CONTINUAR',
  },
  screen04: {
    eyebrow: 'EXPEDIENTE &bull; PASO 02',
    leadText: 'Ahora piensa en la última vez que sentiste que algo estaba mal entre ustedes.',
    question: '¿Qué fue lo primero que pensaste?',
    options: [
      {
        id: 'opt_interp_a',
        code: 'A',
        label: '“Seguro hice algo.”',
      },
      {
        id: 'opt_interp_b',
        code: 'B',
        label: '“¿Qué le pasa?”',
      },
      {
        id: 'opt_interp_c',
        code: 'C',
        label: '“Necesita espacio.”',
      },
      {
        id: 'opt_interp_d',
        code: 'D',
        label: '“No entiendo qué está pasando.”',
      },
    ] as EXP01Option[],
  },
  screen05: {
    eyebrow: 'OBSERVACIÓN',
    title: 'Interesante.',
    paragraph1: 'Porque probablemente has intentado resolver muchas de estas situaciones mirando lo que pasó.',
    paragraph2: 'Pero quizá hay algo que no has estado mirando.',
    cliffhanger: '¿QUIERES SEGUIR?',
    ctaLabel: 'CONTINUAR',
  },
  screen06: {
    eyebrow: 'ANÁLISIS PREVIO',
    paragraph1: 'Tus respuestas ya forman un pequeño patrón.',
    paragraph2: 'Pero necesito una cosa más.',
    paragraph3: 'Quiero que seas completamente honesto en la siguiente respuesta.',
    ctaLabel: 'ESTOY LISTO',
  },
  screen07: {
    eyebrow: 'COMPROMISO',
    question: '¿Estás dispuesto a descubrir algo sobre tu relación que quizá nunca habías considerado?',
    options: [
      {
        id: 'opt_yes',
        code: 'YES',
        label: 'SÍ, QUIERO SABERLO',
      },
      {
        id: 'opt_no',
        code: 'NO',
        label: 'PREFIERO NO SEGUIR',
      },
    ] as EXP01Option[],
  },
  screen07Declined: {
    eyebrow: 'SESIÓN PAUSADA',
    title: 'Está bien.',
    message: 'Esta investigación seguirá aquí si algún día quieres continuarla.',
    resumeLabel: 'ESTOY LISTO PARA CONTINUAR',
    exitLabel: 'SALIR',
  },
  screen08: {
    eyebrow: 'CONFIRMACIÓN',
    leadText: 'Entonces continuemos.',
    subText: 'Tu caso acaba de empezar.',
    statusText: 'INVESTIGACIÓN EN CURSO',
    ctaLabel: 'CONTINUAR',
  },
  screen09: {
    eyebrow: 'EXPEDIENTE INICIAL COMPLETADO',
    leadText: 'En la siguiente parte vamos a mirar algo que probablemente has pasado por alto.',
    subText: 'Y cuando lo veas, algunas situaciones de tu relación podrían empezar a tener mucho más sentido.',
    ctaLabel: 'VER EL SIGUIENTE PASO',
  },
};
