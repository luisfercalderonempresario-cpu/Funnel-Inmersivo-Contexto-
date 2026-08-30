// EXP_03 — EL ERROR INVISIBLE (Narrative Pacing System V1.0 Integration)
import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { EXP03_CONTENT } from './exp03Content';
import { EXP03_DEFINITION } from './exp03Definition';
import { ExperienceMemoryManager } from '../../engine/experience/experienceMemory';
import {
  loadExperienceRuntimeState,
  persistExperienceRuntimeState,
  transitionScreenState,
} from '../../engine/experience/experienceState';
import { ExperienceRuntimeState } from '../../engine/experience/types';
import { eventTracker } from '../../engine/events/eventTracker';
import { ChoiceButton } from '../../components/ui/ChoiceButton';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { Volume2, VolumeX } from 'lucide-react';
import { useNarrativePacing, CTAReveal, NarrativeBeat, narrativePacingManager } from '../../engine/pacing';

export const EXP03: React.FC<ExperienceComponentProps> = ({
  caseId,
  onComplete,
}) => {
  const { state, updateState } = useFunnel();

  // Audio preference state (technical integration hook)
  const [isAudioActive, setIsAudioActive] = useState<boolean>(
    () => state.preferences.audioEnabled || false
  );

  const toggleAudio = () => {
    setIsAudioActive((prev) => {
      const next = !prev;
      eventTracker.trackEvent(next ? 'AUDIO_ENABLED' : 'AUDIO_DISABLED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp03',
      });
      updateState((curr) => ({
        ...curr,
        preferences: {
          ...curr.preferences,
          audioEnabled: next,
        },
      }));
      return next;
    });
  };

  const handlePersistGlobal = (key: string, value: unknown) => {
    updateState((prev) => {
      const exp03Responses = (prev.responses.exp03 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp03: {
            ...exp03Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp03',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_03
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp03');
    if (existing && existing.currentScreen && EXP03_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp03',
      currentScreen: 'screen_01_record',
      status: 'ACTIVE',
      localData: {},
      localMemory: {},
      completedScreens: [],
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
  });

  const [, startTransition] = useTransition();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompletedGuard, setIsCompletedGuard] = useState<boolean>(false);
  const completingRef = useRef<boolean>(false);

  const currentScreenId = runtimeState.currentScreen;

  // Narrative Beats Map for EXP_03
  const currentBeats: NarrativeBeat[] = useMemo(() => {
    switch (currentScreenId) {
      case 'screen_01_record':
        return [
          { id: 'caseId', stage: 1, pacing: 'SHORT', label: 'Caso ID Eyebrow' },
          { id: 'piece', stage: 2, pacing: 'MEDIUM', label: 'Tenemos una pieza más' },
          { id: 'before', stage: 3, pacing: 'MEDIUM', label: 'Pero antes...' },
          { id: 'show', stage: 4, pacing: 'LONG', label: 'Quiero mostrarte algo' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Ver', isCTA: true },
        ];
      case 'screen_02_scene':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Son las 8:47 p. m.' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Habían quedado en verse' },
          { id: 'beat3', stage: 3, pacing: 'LONG', label: 'Pero ella cancela' },
          { id: 'quote', stage: 4, pacing: 'REVELATION', label: 'Hoy prefiero quedarme en casa' },
          { id: 'beat4', stage: 5, pacing: 'MEDIUM', label: 'Nada más' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_03_what_you_see':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Eso es todo lo que tienes' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Un mensaje' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'Una respuesta' },
          { id: 'beat4', stage: 4, pacing: 'MEDIUM', label: 'Un cambio de plan' },
          { id: 'beat5', stage: 5, pacing: 'REVELATION', label: 'Nada más' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_04_interpretation':
        return [
          { id: 'question', stage: 1, pacing: 'MEDIUM', label: 'Pregunta 1' },
          { id: 'options', stage: 2, pacing: 'MANUAL', label: 'Opciones Pregunta 1', isOptions: true },
        ];
      case 'screen_05_hidden_info':
        return [
          { id: 'branch', stage: 1, pacing: 'MEDIUM', label: 'Microadaptación respuesta' },
          { id: 'convergence', stage: 2, pacing: 'LONG', label: 'Convergencia explicaciones' },
          { id: 'interesting', stage: 3, pacing: 'MEDIUM', label: 'Interesante' },
          { id: 'imagine', stage: 4, pacing: 'LONG', label: 'Imagina información nueva' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Mostrar', isCTA: true },
        ];
      case 'screen_06_the_change':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Antes de cancelar' },
          { id: 'beat2', stage: 2, pacing: 'LONG', label: 'Día especialmente difícil' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'Había dormido poco' },
          { id: 'beat4', stage: 4, pacing: 'MEDIUM', label: 'Varias cosas encima' },
          { id: 'beat5', stage: 5, pacing: 'LONG', label: 'No se sentía bien' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_06b_second_question':
        return [
          { id: 'question', stage: 1, pacing: 'MEDIUM', label: 'Pregunta 2' },
          { id: 'options', stage: 2, pacing: 'MANUAL', label: 'Opciones Pregunta 2', isOptions: true },
        ];
      case 'screen_07_the_error':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'Vuelve a mirar' },
          { id: 'quote', stage: 2, pacing: 'MEDIUM', label: 'Cita mensaje' },
          { id: 'beat1', stage: 3, pacing: 'LONG', label: 'El mensaje no cambió' },
          { id: 'beat2', stage: 4, pacing: 'LONG', label: 'La situación sí' },
          { id: 'dominant', stage: 5, pacing: 'REVELATION', label: 'Y ahí aparece el error invisible' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_08_your_case':
        return [
          { id: 'caseId', stage: 1, pacing: 'SHORT', label: 'Caso ID Eyebrow' },
          { id: 'beat1', stage: 2, pacing: 'MEDIUM', label: 'Tal vez alguna vez hiciste esto' },
          { id: 'beat2', stage: 3, pacing: 'MEDIUM', label: 'Viste una reacción' },
          { id: 'beat3', stage: 4, pacing: 'MEDIUM', label: 'Le diste una explicación' },
          { id: 'beat4', stage: 5, pacing: 'MEDIUM', label: 'Y actuaste según esa explicación' },
          { id: 'beat5', stage: 6, pacing: 'LONG', label: 'Sin saber si era cierta' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_09_pattern':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'El problema no siempre es interpretar mal' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'El problema puede empezar antes' },
          { id: 'dominant1', stage: 3, pacing: 'LONG', label: 'Interpretar demasiado pronto' },
          { id: 'dominant2', stage: 4, pacing: 'REVELATION', label: 'Con información incompleta' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_10_microrevelation':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Buenas intenciones' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Hacer lo correcto' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'Conocer bien a tu pareja' },
          { id: 'beat4', stage: 4, pacing: 'LONG', label: 'Y aun así...' },
          { id: 'punch', stage: 5, pacing: 'REVELATION', label: 'Equivocarte al interpretar' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_11_the_question':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'La pregunta ya no es...' },
          { id: 'oldQ', stage: 2, pacing: 'MEDIUM', label: '¿Qué debería hacer?' },
          { id: 'mainQ', stage: 3, pacing: 'REVELATION', label: '¿Qué información me falta?' },
          { id: 'because', stage: 4, pacing: 'MEDIUM', label: 'Porque quizá...' },
          { id: 'before', stage: 5, pacing: 'MEDIUM', label: 'Aprender a reaccionar mejor' },
          { id: 'punchline', stage: 6, pacing: 'REVELATION', label: 'Aprender a mirar mejor' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_12_transition':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Tenemos una pregunta' },
          { id: 'beat2', stage: 2, pacing: 'LONG', label: 'Vamos a investigar la respuesta' },
          { id: 'cta', stage: 3, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      default:
        return [{ id: 'default', stage: 1, pacing: 'MANUAL', isCTA: true, isOptions: true }];
    }
  }, [currentScreenId]);

  // Integrated Narrative Pacing Hook
  const { stage: screenStage, isCTARevealed, isOptionsRevealed } = useNarrativePacing({
    experienceId: 'exp03',
    screenId: currentScreenId,
    beats: currentBeats,
  });

  // Synchronize runtime persistence
  useEffect(() => {
    persistExperienceRuntimeState(runtimeState);
  }, [runtimeState]);

  // Track analytics events on screen transitions
  useEffect(() => {
    const currentScreen = runtimeState.currentScreen;

    if (currentScreen === 'screen_01_record') {
      eventTracker.trackEvent('EXP03_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp03',
        payload: { screen: 'screen_01_record' },
      });
    }

    if (
      currentScreen === 'screen_04_interpretation' ||
      currentScreen === 'screen_06b_second_question'
    ) {
      eventTracker.trackEvent('QUESTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp03',
        payload: { screenId: currentScreen },
      });
    }

    if (currentScreen === 'screen_10_microrevelation') {
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp03',
        payload: { insightKey: 'contextGapRecognized' },
      });
      eventTracker.trackEvent('INSIGHT_DISCOVERED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp03',
        payload: { insightKey: 'contextGapRecognized' },
      });
    }

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { screenId: currentScreen },
    });
  }, [runtimeState.currentScreen, state.session.sessionId, state.session.caseId]);

  // Navigate screen handler
  const navigateToScreen = (nextScreenId: string) => {
    startTransition(() => {
      setSelectedOption(null);
      setIsProcessing(false);
      setRuntimeState((prev) => {
        const next = transitionScreenState(prev, nextScreenId, 'ACTIVE');
        persistExperienceRuntimeState(next);
        return next;
      });
    });
  };

  // SCREEN 01: Entrar a EXP_03
  const handleRecordContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'enter_exp03' },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp03.started', value: true, scope: 'global' },
    ]);

    navigateToScreen('screen_02_scene');
  };

  // SCREEN 02: Continuar desde la escena
  const handleSceneContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'proceed_to_what_you_see' },
    });

    navigateToScreen('screen_03_what_you_see');
  };

  // SCREEN 03: Continuar desde lo que ves
  const handleWhatYouSeeContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'proceed_to_interpretation' },
    });

    navigateToScreen('screen_04_interpretation');
  };

  // SCREEN 04: Pregunta 1 (Tu Interpretación)
  const handleSelectQuestion1 = (code: string, label: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { questionId: 'exp03_q1_interpretation', option: code, label },
    });

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { questionId: 'exp03_q1_interpretation', answer: label, code },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp03.interpretation', value: label, scope: 'global' },
      { key: 'exp03.interpretationCode', value: code, scope: 'global' },
      { key: 'exp03.question01Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { key: 'exp03.interpretation', value: label },
    });

    const pauseDuration = narrativePacingManager.calculateDuration('SHORT');
    setTimeout(() => {
      navigateToScreen('screen_05_hidden_info');
    }, pauseDuration);
  };

  // SCREEN 05: Continuar hacia la información oculta
  const handleHiddenInfoContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'show_hidden_context' },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp03.hiddenContextViewed', value: true, scope: 'global' },
    ]);

    navigateToScreen('screen_06_the_change');
  };

  // SCREEN 06: Continuar hacia la segunda pregunta
  const handleChangeContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'proceed_to_second_question' },
    });

    navigateToScreen('screen_06b_second_question');
  };

  // SCREEN 06B: Pregunta 2 (¿Cambiaría tu interpretación?)
  const handleSelectQuestion2 = (code: string, label: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { questionId: 'exp03_q2_interpretation_changed', option: code, label },
    });

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { questionId: 'exp03_q2_interpretation_changed', answer: label, code },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp03.interpretationChanged', value: label, scope: 'global' },
      { key: 'exp03.interpretationChangedCode', value: code, scope: 'global' },
      { key: 'exp03.question02Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { key: 'exp03.interpretationChanged', value: label },
    });

    const pauseDuration = narrativePacingManager.calculateDuration('SHORT');
    setTimeout(() => {
      navigateToScreen('screen_07_the_error');
    }, pauseDuration);
  };

  // SCREEN 07: Continuar desde el error invisible
  const handleErrorContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'proceed_to_your_case' },
    });

    navigateToScreen('screen_08_your_case');
  };

  // SCREEN 08: Continuar desde tu caso
  const handleYourCaseContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'proceed_to_pattern' },
    });

    navigateToScreen('screen_09_pattern');
  };

  // SCREEN 09: Continuar desde el patrón
  const handlePatternContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'proceed_to_microrevelation' },
    });

    navigateToScreen('screen_10_microrevelation');
  };

  // SCREEN 10: Continuar desde la microrevelación
  const handleMicrorevelationContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'proceed_to_the_question' },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp03.invisibleErrorRecognized', value: true, scope: 'global' },
    ]);

    navigateToScreen('screen_11_the_question');
  };

  // SCREEN 11: Continuar hacia la transición final
  const handleTheQuestionContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'proceed_to_transition' },
    });

    navigateToScreen('screen_12_transition');
  };

  // SCREEN 12: Final de EXP_03 (Completion & Transition to EXP_04)
  const handleFinalStep = () => {
    if (completingRef.current || isCompletedGuard) return;
    completingRef.current = true;
    setIsCompletedGuard(true);
    setIsProcessing(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'complete_exp03' },
    });

    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      invisibleErrorRecognized: true,
      contextGapRecognized: true,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp03.invisibleErrorRecognized', value: true, scope: 'global' },
      { key: 'exp03.completed', value: true, scope: 'global' },
      { key: 'exp03.completedAt', value: new Date().toISOString(), scope: 'global' },
    ]);

    setRuntimeState((prev) => {
      const next: ExperienceRuntimeState = {
        ...prev,
        status: 'COMPLETED',
        completedScreens: Array.from(new Set([...prev.completedScreens, prev.currentScreen])),
        lastActivityAt: new Date().toISOString(),
      };
      persistExperienceRuntimeState(next);
      return next;
    });

    eventTracker.trackEvent('EXP03_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { memory: finalMemory },
    });

    onComplete(finalMemory);
  };

  // Retrieve saved responses for branching & personalized micro-insights
  const savedResponses = (state.responses.exp03 || {}) as Record<string, unknown>;
  const interpretationCode = (savedResponses['exp03.interpretationCode'] ||
    savedResponses['interpretationCode']) as 'A' | 'B' | 'C' | 'D' | undefined;
  const interpretation = (savedResponses['exp03.interpretation'] ||
    savedResponses['interpretation']) as string | undefined;

  // Screen 05 branch text based on interpretationCode
  const screen05BranchText = useMemo(() => {
    if (interpretationCode && EXP03_CONTENT.screen05.branches[interpretationCode]) {
      return EXP03_CONTENT.screen05.branches[interpretationCode];
    }
    if (interpretation?.includes('molesta')) {
      return EXP03_CONTENT.screen05.branches.A;
    }
    if (interpretation?.includes('verme')) {
      return EXP03_CONTENT.screen05.branches.B;
    }
    if (interpretation?.includes('pasa')) {
      return EXP03_CONTENT.screen05.branches.C;
    }
    return EXP03_CONTENT.screen05.branches.D;
  }, [interpretationCode, interpretation]);

  return (
    <div
      id="exp03-container"
      className="relative min-h-[90vh] sm:min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 bg-black text-neutral-100 selection:bg-orange-500 selection:text-black font-sans"
    >
      {/* Discrete Audio Ambient Control Hook */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isAudioActive ? 'Silenciar audio ambiental' : 'Activar audio ambiental'}
          className="p-2 text-neutral-700 hover:text-neutral-400 transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-700 rounded-full"
        >
          {isAudioActive ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 01 — EL REGISTRO                                                   */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_01_record' && (
        <div
          id="screen-01-record"
          className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-lg mx-auto py-8"
        >
          <div className="space-y-6">
            <div className="transition-all duration-1000 opacity-100">
              <span className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
                {EXP03_CONTENT.screen01.leadCaseLabel} #{caseId}
              </span>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-mono tracking-[0.25em] text-white uppercase">
                {EXP03_CONTENT.screen01.leadPiece}
              </h1>
            </div>

            <div
              className={`space-y-3 pt-2 transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body leading-relaxed">
                {EXP03_CONTENT.screen01.leadBefore}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-200 font-body leading-relaxed">
                {EXP03_CONTENT.screen01.leadShow}
              </p>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-record-view"
              onClick={handleRecordContinue}
            >
              {EXP03_CONTENT.screen01.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 02 — LA ESCENA                                                     */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_02_scene' && (
        <div
          id="screen-02-scene"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 w-full">
            <div className="transition-all duration-1000 opacity-100">
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP03_CONTENT.screen02.beat1}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP03_CONTENT.screen02.beat2}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP03_CONTENT.screen02.beat3}
              </p>
            </div>

            {/* Dominant quote floating in space */}
            <div
              className={`py-8 sm:py-12 transition-all duration-1000 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white tracking-wide font-normal">
                {EXP03_CONTENT.screen02.dominantQuote}
              </h2>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                {EXP03_CONTENT.screen02.beat4}
              </p>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed}>
            <PrimaryCTA
              id="cta-scene-continue"
              onClick={handleSceneContinue}
            >
              {EXP03_CONTENT.screen02.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 03 — LO QUE VES                                                    */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_03_what_you_see' && (
        <div
          id="screen-03-what-you-see"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                EVIDENCIA
              </span>
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed pt-3">
                {EXP03_CONTENT.screen03.beat1}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed">
                {EXP03_CONTENT.screen03.beat2}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed">
                {EXP03_CONTENT.screen03.beat3}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed">
                {EXP03_CONTENT.screen03.beat4}
              </p>
            </div>

            {/* Dominant weight for "Nada más" */}
            <div
              className={`pt-6 border-t border-[#181818] transition-all duration-1000 ${
                screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed border-l-2 border-orange-500 pl-5 py-2">
                {EXP03_CONTENT.screen03.beat5}
              </h2>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-what-you-see-continue"
              onClick={handleWhatYouSeeContinue}
            >
              {EXP03_CONTENT.screen03.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 04 — TU INTERPRETACIÓN (PREGUNTA 1)                                */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_04_interpretation' && (
        <div
          id="screen-04-interpretation"
          className="w-full flex flex-col space-y-8 animate-fade-in text-left max-w-xl mx-auto py-4"
        >
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              INTERPRETACIÓN
            </p>
            <p className="text-sm text-neutral-400 font-body">
              {EXP03_CONTENT.screen04.lead}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-white tracking-wide leading-snug pt-2">
              {EXP03_CONTENT.screen04.question}
            </h2>
          </div>

          <div
            className={`space-y-3 pt-3 transition-all duration-700 ${
              isOptionsRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {EXP03_CONTENT.screen04.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;
              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-exp03-q1-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  evidenceLabel="DATO 05"
                  selected={isSelected}
                  isAnySelected={isAnySelected}
                  disabled={isAnySelected}
                  onClick={() => handleSelectQuestion1(opt.code, opt.label)}
                >
                  <span className="font-body text-base sm:text-lg">{opt.label}</span>
                </ChoiceButton>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 05 — LA INFORMACIÓN OCULTA                                         */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_05_hidden_info' && (
        <div
          id="screen-05-hidden-info"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            {/* Non-judgmental branch reflection */}
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                OBSERVACIÓN
              </span>
              <p className="text-base sm:text-lg text-neutral-200 font-body leading-relaxed pt-3">
                {screen05BranchText}
              </p>
            </div>

            {/* Convergence message */}
            <div
              className={`p-4 rounded-lg bg-[#0A0A0A] border border-[#1C1C1C] transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-serif italic leading-relaxed">
                {EXP03_CONTENT.screen05.convergence}
              </p>
            </div>

            {/* Interesting pause */}
            <div
              className={`pt-2 transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                {EXP03_CONTENT.screen05.interesting}
              </p>
            </div>

            {/* Imagine prompt */}
            <div
              className={`pt-2 transition-all duration-1000 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif italic text-white leading-relaxed">
                {EXP03_CONTENT.screen05.imagine}
              </h2>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-hidden-info-show"
              onClick={handleHiddenInfoContinue}
            >
              {EXP03_CONTENT.screen05.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 06 — EL CAMBIO                                                     */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_06_the_change' && (
        <div
          id="screen-06-the-change"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                CONTEXTO OCULTO
              </span>
              <p className="text-base sm:text-lg text-neutral-400 font-body leading-relaxed pt-3">
                {EXP03_CONTENT.screen06.beat1}
              </p>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-xl bg-[#090909] border border-[#1C1C1C] space-y-4 transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-lg sm:text-xl font-serif italic text-white leading-relaxed">
                {EXP03_CONTENT.screen06.beat2}
              </p>

              <div
                className={`space-y-2 pt-2 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm sm:text-base text-neutral-300 font-body">
                  • {EXP03_CONTENT.screen06.beat3}
                </p>
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-sm sm:text-base text-neutral-300 font-body">
                    • {EXP03_CONTENT.screen06.beat4}
                  </p>
                </div>
              </div>

              <div
                className={`pt-2 transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg font-serif italic text-orange-200/90 leading-relaxed">
                  {EXP03_CONTENT.screen06.beat5}
                </p>
              </div>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-change-continue"
              onClick={handleChangeContinue}
            >
              {EXP03_CONTENT.screen06.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 06B — SEGUNDA PARTICIPACIÓN (PREGUNTA 2)                           */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_06b_second_question' && (
        <div
          id="screen-06b-second-question"
          className="w-full flex flex-col space-y-8 animate-fade-in text-left max-w-xl mx-auto py-4"
        >
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              EVALUACIÓN
            </p>
            <p className="text-sm text-neutral-400 font-body">
              {EXP03_CONTENT.screen06b.lead}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-white tracking-wide leading-snug pt-2">
              {EXP03_CONTENT.screen06b.question}
            </h2>
          </div>

          <div
            className={`space-y-3 pt-3 transition-all duration-700 ${
              isOptionsRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {EXP03_CONTENT.screen06b.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;
              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-exp03-q2-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  evidenceLabel="DATO 06"
                  selected={isSelected}
                  isAnySelected={isAnySelected}
                  disabled={isAnySelected}
                  onClick={() => handleSelectQuestion2(opt.code, opt.label)}
                >
                  <span className="font-body text-base sm:text-lg">{opt.label}</span>
                </ChoiceButton>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 07 — EL ERROR                                                      */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07_the_error' && (
        <div
          id="screen-07-the-error"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-8 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                PERSPECTIVA
              </span>
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed pt-3">
                {EXP03_CONTENT.screen07.lead}
              </p>
            </div>

            {/* Quote box */}
            <div
              className={`p-5 rounded-xl bg-[#080808] border border-[#1C1C1C] transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-lg sm:text-xl font-serif italic text-neutral-200">
                {EXP03_CONTENT.screen07.quote}
              </p>
            </div>

            {/* Independent beats for revelation */}
            <div className="space-y-4 pt-2">
              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-400 font-body">
                  {EXP03_CONTENT.screen07.beat1}
                </p>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-200 font-body">
                  {EXP03_CONTENT.screen07.beat2}
                </p>
              </div>
            </div>

            {/* Dominant weight for "Y ahí aparece el error invisible" */}
            <div
              className={`pt-6 border-t border-[#181818] transition-all duration-1000 ${
                screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white leading-relaxed border-l-2 border-orange-500 pl-5 py-2">
                {EXP03_CONTENT.screen07.dominantTitle}
              </h2>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-error-continue"
              onClick={handleErrorContinue}
            >
              {EXP03_CONTENT.screen07.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 08 — TU CASO                                                       */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_08_your_case' && (
        <div
          id="screen-08-your-case"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <div className="transition-all duration-1000 opacity-100 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                {EXP03_CONTENT.screen08.eyebrow}
              </span>
              <span className="text-xs font-mono tracking-widest text-neutral-600 uppercase">
                CASO #{caseId}
              </span>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed">
                {EXP03_CONTENT.screen08.beat1}
              </p>
            </div>

            <div
              className={`space-y-2 pl-4 border-l border-neutral-800 transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                • {EXP03_CONTENT.screen08.beat2}
              </p>
              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm sm:text-base text-neutral-400 font-body">
                  • {EXP03_CONTENT.screen08.beat3}
                </p>
              </div>
              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm sm:text-base text-neutral-400 font-body">
                  • {EXP03_CONTENT.screen08.beat4}
                </p>
              </div>
            </div>

            <div
              className={`pt-4 transition-all duration-1000 ${
                screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-lg sm:text-xl font-serif italic text-white leading-relaxed">
                {EXP03_CONTENT.screen08.beat5}
              </p>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-your-case-continue"
              onClick={handleYourCaseContinue}
            >
              {EXP03_CONTENT.screen08.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 09 — EL PATRÓN                                                     */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_09_pattern' && (
        <div
          id="screen-09-pattern"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                PATRÓN
              </span>
              <p className="text-base sm:text-lg text-neutral-400 font-body leading-relaxed pt-3">
                {EXP03_CONTENT.screen09.beat1}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed">
                {EXP03_CONTENT.screen09.beat2}
              </p>
            </div>

            {/* Dominant weight */}
            <div
              className={`pt-6 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed border-l-2 border-orange-500 pl-5 py-1">
                {EXP03_CONTENT.screen09.dominant1}
              </h2>
              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-lg sm:text-xl font-mono uppercase tracking-widest text-orange-400 pl-5">
                  {EXP03_CONTENT.screen09.dominant2}
                </p>
              </div>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-pattern-continue"
              onClick={handlePatternContinue}
            >
              {EXP03_CONTENT.screen09.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 10 — MICROREVELACIÓN                                               */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_10_microrevelation' && (
        <div
          id="screen-10-microrevelation"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                CLARIDAD
              </span>
              <p className="text-base sm:text-lg text-neutral-400 font-body leading-relaxed pt-3">
                {EXP03_CONTENT.screen10.beat1}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-400 font-body leading-relaxed">
                {EXP03_CONTENT.screen10.beat2}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-400 font-body leading-relaxed">
                {EXP03_CONTENT.screen10.beat3}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-500 font-body italic">
                {EXP03_CONTENT.screen10.beat4}
              </p>
            </div>

            {/* Dominant Punch */}
            <div
              className={`pt-6 border-t border-[#181818] transition-all duration-1000 ${
                screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed border-l-2 border-orange-500 pl-5 py-2">
                {EXP03_CONTENT.screen10.dominantPunch}
              </h2>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-microrevelation-continue"
              onClick={handleMicrorevelationContinue}
            >
              {EXP03_CONTENT.screen10.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 11 — LA PREGUNTA                                                   */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_11_the_question' && (
        <div
          id="screen-11-the-question"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-8 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                PREGUNTA CLAVE
              </span>
              <p className="text-base sm:text-lg text-neutral-400 font-body leading-relaxed pt-3">
                {EXP03_CONTENT.screen11.lead}
              </p>
            </div>

            {/* Old question */}
            <div
              className={`space-y-1 pl-4 border-l border-neutral-800 transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base text-neutral-500 font-serif italic">
                “{EXP03_CONTENT.screen11.oldQuestion}”
              </p>
            </div>

            {/* Pitch black contrast highlight - Main Question */}
            <div
              className={`pt-6 border-t border-[#181818] space-y-4 transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white leading-relaxed border-l-2 border-orange-500 pl-4 py-2">
                “{EXP03_CONTENT.screen11.mainQuestion}”
              </h2>
            </div>

            <div
              className={`space-y-2 pt-2 transition-all duration-1000 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP03_CONTENT.screen11.because}
              </p>
              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm sm:text-base text-neutral-400 font-body">
                  {EXP03_CONTENT.screen11.before}
                </p>
              </div>
              <div
                className={`pt-2 transition-all duration-1000 ${
                  screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-orange-400 leading-relaxed">
                  {EXP03_CONTENT.screen11.punchline}
                </p>
              </div>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-the-question-continue"
              onClick={handleTheQuestionContinue}
            >
              {EXP03_CONTENT.screen11.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 12 — TRANSICIÓN A EXP_04                                           */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_12_transition' && (
        <div
          id="screen-12-transition"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-center w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                TRANSICIÓN
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed pt-3">
                {EXP03_CONTENT.screen12.beat1}
              </h2>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-lg sm:text-xl font-serif italic text-neutral-300 leading-relaxed">
                {EXP03_CONTENT.screen12.beat2}
              </p>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-final-transition"
              onClick={handleFinalStep}
            >
              {EXP03_CONTENT.screen12.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}
    </div>
  );
};
