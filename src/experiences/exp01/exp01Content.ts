export interface EXP01Option {
  id: string;
  code: 'A' | 'B' | 'C' | 'D' | 'YES' | 'NO';
  label: string;
  sublabel?: string;
}

export const EXP01_CONTENT = {
  screen01: {
    leadText1: 'HAY ALGO QUE QUIERO MOSTRARTE.',
    leadText2: 'PERO ANTES NECESITO QUE HAGAS ALGO.',
    ctaLabel: 'ENTRAR',
  },
  screen02: {
    intro1: 'Antes de seguir...',
    intro2: 'Necesito preguntarte algo.',
    question: 'Cuando tu pareja cambia de ánimo contigo,\n¿qué haces normalmente?',
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
    evidenceTag: 'DATO 01 REGISTRADO',
  },
  screen03: {
    label: 'CASO',
    status: 'INVESTIGACIÓN ABIERTA',
    footnote: 'Primer dato registrado.',
    ctaLabel: 'CONTINUAR',
  },
  screen04: {
    intro1: 'Ahora necesito otro dato.',
    intro2: 'Piensa en la última vez que sentiste que algo estaba mal entre ustedes.',
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
    evidenceTag: 'DATO 02 REGISTRADO',
  },
  screen05: {
    title: 'Interesante.',
    paragraph1: 'Porque probablemente has intentado resolver muchas de estas situaciones mirando lo que pasó.',
    paragraph2: 'Pero quizá hay algo que no has estado mirando.',
    ctaLabel: 'CONTINUAR',
  },
  screen06: {
    paragraph1: 'Tus respuestas ya forman un pequeño patrón.',
    paragraph2: 'Pero necesito una cosa más.',
    paragraph3: 'Quiero que seas completamente honesto en la siguiente respuesta.',
    ctaLabel: 'ESTOY LISTO',
  },
  screen07: {
    question: '¿Estás dispuesto a descubrir algo sobre tu relación que quizá nunca habías considerado?',
    options: [
      {
        id: 'opt_yes',
        code: 'YES',
        label: 'Sí, quiero saberlo',
      },
      {
        id: 'opt_no',
        code: 'NO',
        label: 'Prefiero no seguir',
      },
    ] as EXP01Option[],
  },
  screen07Declined: {
    title: 'Está bien.',
    message: 'Esta investigación seguirá aquí si algún día quieres continuarla.',
    resumeLabel: 'ESTOY LISTO PARA CONTINUAR',
    exitLabel: 'SALIR',
  },
  screen08: {
    label: 'CASO',
    status: 'INVESTIGACIÓN EN CURSO',
    body: 'Ya tenemos suficiente para continuar.',
    ctaLabel: 'CONTINUAR',
  },
  screen09: {
    paragraph1: 'En la siguiente parte vamos a mirar algo que probablemente has pasado por alto.',
    paragraph2: 'Y cuando lo veas, algunas situaciones de tu relación podrían empezar a tener mucho más sentido.',
    ctaLabel: 'VER EL SIGUIENTE PASO',
  },
};

