// EXP_02 — EL ESPEJO (Narrative Pacing System V1.0 Integration)
import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { EXP02_CONTENT } from './exp02Content';
import { EXP02_DEFINITION } from './exp02Definition';
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

export const EXP02: React.FC<ExperienceComponentProps> = ({
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
        experience: 'exp02',
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
      const exp02Responses = (prev.responses.exp02 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp02: {
            ...exp02Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp02',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_02
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp02');
    if (existing && existing.currentScreen && EXP02_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp02',
      currentScreen: 'screen_01_transition',
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

  // Narrative Beats Map for EXP_02
  const currentBeats: NarrativeBeat[] = useMemo(() => {
    switch (currentScreenId) {
      case 'screen_01_transition':
        return [
          { id: 'leadCase', stage: 1, pacing: 'SHORT', label: 'Caso ID Eyebrow' },
          { id: 'leadPause', stage: 2, pacing: 'MEDIUM', label: 'Sigamos' },
          { id: 'leadTexts', stage: 3, pacing: 'LONG', label: 'Texto narrativo' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_02_situation':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Es de noche' },
          { id: 'beat2', stage: 2, pacing: 'LONG', label: 'Estás hablando con tu pareja' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'Pero de repente' },
          { id: 'quote', stage: 4, pacing: 'REVELATION', label: 'Frase dominante flotante' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_03_immediate_response':
        return [
          { id: 'question', stage: 1, pacing: 'MEDIUM', label: 'Pregunta 1' },
          { id: 'options', stage: 2, pacing: 'MANUAL', label: 'Opciones Pregunta 1', isOptions: true },
        ];
      case 'screen_04_conversation':
        return [
          { id: 'msg1', stage: 1, pacing: 'MEDIUM', label: 'Mensaje 1 (TÚ)' },
          { id: 'msg2', stage: 2, pacing: 'MEDIUM', label: 'Mensaje 2 (ELLA)' },
          { id: 'msg3', stage: 3, pacing: 'MEDIUM', label: 'Mensaje 3 (TÚ)' },
          { id: 'msg4', stage: 4, pacing: 'MEDIUM', label: 'Mensaje 4 (ELLA)' },
          { id: 'msg5', stage: 5, pacing: 'MEDIUM', label: 'Mensaje 5 (TÚ)' },
          { id: 'msg6', stage: 6, pacing: 'LONG', label: 'Mensaje 6 (ELLA)' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_05_pattern':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Observación 1' },
          { id: 'beat2', stage: 2, pacing: 'LONG', label: 'Observación 2' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'Observación 3' },
          { id: 'dominant', stage: 4, pacing: 'REVELATION', label: 'Texto dominante quiebre' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_06_mirror':
        return [
          { id: 'question', stage: 1, pacing: 'MEDIUM', label: 'Pregunta 2' },
          { id: 'options', stage: 2, pacing: 'MANUAL', label: 'Opciones Pregunta 2', isOptions: true },
        ];
      case 'screen_07a_record':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow Tu Registro' },
          { id: 'quote', stage: 2, pacing: 'LONG', label: 'Cita personalizada Andrés' },
          { id: 'followUp', stage: 3, pacing: 'MEDIUM', label: 'Follow up narrativo' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_07b_searching':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Reflexión 1' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Reflexión 2' },
          { id: 'q1', stage: 3, pacing: 'SHORT', label: '¿Qué pasó?' },
          { id: 'q2', stage: 4, pacing: 'SHORT', label: '¿Qué hice?' },
          { id: 'q3', stage: 5, pacing: 'SHORT', label: '¿Qué necesita?' },
          { id: 'q4', stage: 6, pacing: 'MEDIUM', label: '¿Cómo lo arreglo?' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_07c_unseen':
        return [
          { id: 'beat1', stage: 1, pacing: 'LONG', label: 'Lo que no puedes revisar' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Lo que pasaba con ella' },
          { id: 'beat3', stage: 3, pacing: 'REVELATION', label: 'Antes de llegar a la conversación' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_07d_new_question':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'La nueva perspectiva' },
          { id: 'before', stage: 2, pacing: 'MEDIUM', label: 'Pregunta anterior' },
          { id: 'after', stage: 3, pacing: 'REVELATION', label: 'La nueva pregunta dominante' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_07e_participation':
        return [
          { id: 'question', stage: 1, pacing: 'MEDIUM', label: 'Pregunta 3' },
          { id: 'options', stage: 2, pacing: 'MANUAL', label: 'Opciones Pregunta 3', isOptions: true },
        ];
      case 'screen_08_microrevelation':
        return [
          { id: 'branch', stage: 1, pacing: 'MEDIUM', label: 'Rama personalizada' },
          { id: 'pivot', stage: 2, pacing: 'LONG', label: 'El problema real' },
          { id: 'pause1', stage: 3, pacing: 'MEDIUM', label: 'No falta de intención' },
          { id: 'pause2', stage: 4, pacing: 'LONG', label: 'La historia completa' },
          { id: 'pause3', stage: 5, pacing: 'MEDIUM', label: 'Intención vs información' },
          { id: 'punch', stage: 6, pacing: 'REVELATION', label: 'Falta información quiebre' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_09_closing':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Cierre beat 1' },
          { id: 'beat2', stage: 2, pacing: 'LONG', label: 'La pieza que falta' },
          { id: 'beat3', stage: 3, pacing: 'LONG', label: 'Transición hacia EXP_03' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      default:
        return [{ id: 'default', stage: 1, pacing: 'MANUAL', isCTA: true, isOptions: true }];
    }
  }, [currentScreenId]);

  // Integrated Narrative Pacing Hook
  const { stage: screenStage, isCTARevealed, isOptionsRevealed } = useNarrativePacing({
    experienceId: 'exp02',
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

    if (currentScreen === 'screen_01_transition') {
      eventTracker.trackEvent('EXP02_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp02',
        payload: { screen: 'screen_01_transition' },
      });
    }

    if (
      currentScreen === 'screen_03_immediate_response' ||
      currentScreen === 'screen_06_mirror' ||
      currentScreen === 'screen_07e_participation'
    ) {
      eventTracker.trackEvent('QUESTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp02',
        payload: { screenId: currentScreen },
      });
    }

    if (currentScreen === 'screen_04_conversation') {
      eventTracker.trackEvent('CHAT_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp02',
        payload: { totalMessages: EXP02_CONTENT.screen04.messages.length },
      });
    }

    if (currentScreen === 'screen_08_microrevelation') {
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp02',
        payload: { insightKey: 'contextGapRecognized' },
      });
      eventTracker.trackEvent('INSIGHT_DISCOVERED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp02',
        payload: { insightKey: 'contextGapRecognized' },
      });
    }

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { screenId: currentScreen },
    });
  }, [runtimeState.currentScreen, state.session.sessionId, state.session.caseId]);

  // Track chat messages reveal based on screenStage
  useEffect(() => {
    if (runtimeState.currentScreen === 'screen_04_conversation') {
      const msgIndex = screenStage;
      const currentMsg = EXP02_CONTENT.screen04.messages[msgIndex - 1];
      if (currentMsg) {
        eventTracker.trackEvent('CHAT_MESSAGE_SHOWN', {
          sessionId: state.session.sessionId,
          caseId: state.session.caseId,
          experience: 'exp02',
          payload: {
            messageIndex: msgIndex,
            speaker: currentMsg.speaker,
            text: currentMsg.text,
          },
        });
      }
    }
  }, [screenStage, runtimeState.currentScreen, state.session.sessionId, state.session.caseId]);

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

  // SCREEN 01: Entrar a la situación
  const handleTransitionContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'enter_exp02' },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.started', value: true, scope: 'global' },
    ]);

    navigateToScreen('screen_02_situation');
  };

  // SCREEN 02: Situación continue
  const handleSituationContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_first_question' },
    });

    navigateToScreen('screen_03_immediate_response');
  };

  // SCREEN 03: Pregunta 1 (Respuesta inmediata)
  const handleSelectQuestion1 = (code: string, label: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { questionId: 'exp02_q1_interpretation', option: code, label },
    });

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { questionId: 'exp02_q1_interpretation', answer: label, code },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.firstInterpretation', value: label, scope: 'global' },
      { key: 'exp02.firstInterpretationCode', value: code, scope: 'global' },
      { key: 'exp02.question01Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { key: 'exp02.firstInterpretation', value: label },
    });

    const pauseDuration = narrativePacingManager.calculateDuration('SHORT');
    setTimeout(() => {
      navigateToScreen('screen_04_conversation');
    }, pauseDuration);
  };

  // SCREEN 04: Continuar después de la conversación
  const handleConversationContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_pattern' },
    });

    navigateToScreen('screen_05_pattern');
  };

  // SCREEN 05: Continuar después del patrón
  const handlePatternContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_mirror' },
    });

    navigateToScreen('screen_06_mirror');
  };

  // SCREEN 06: Pregunta 2 (El Espejo - Patrón de Reacción)
  const handleSelectQuestion2 = (code: string, label: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { questionId: 'exp02_q2_reaction', option: code, label },
    });

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { questionId: 'exp02_q2_reaction', answer: label, code },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.reactionPattern', value: label, scope: 'global' },
      { key: 'exp02.reactionPatternCode', value: code, scope: 'global' },
      { key: 'exp02.question02Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { key: 'exp02.reactionPattern', value: label },
    });

    const pauseDuration = narrativePacingManager.calculateDuration('SHORT');
    setTimeout(() => {
      navigateToScreen('screen_07a_record');
    }, pauseDuration);
  };

  // SCREEN A: Record continue
  const handleRecordContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_searching' },
    });

    navigateToScreen('screen_07b_searching');
  };

  // SCREEN B: Searching continue
  const handleSearchingContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_unseen' },
    });

    navigateToScreen('screen_07c_unseen');
  };

  // SCREEN C: Unseen continue
  const handleUnseenContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_new_question' },
    });

    navigateToScreen('screen_07d_new_question');
  };

  // SCREEN D: New Question continue
  const handleNewQuestionContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_third_question' },
    });

    navigateToScreen('screen_07e_participation');
  };

  // SCREEN E: Pregunta 3 (Participación)
  const handleSelectQuestion3 = (code: string, label: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { questionId: 'exp02_q3_discovery', option: code, label },
    });

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { questionId: 'exp02_q3_discovery', answer: label, code },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.whatHeTriedToDiscover', value: label, scope: 'global' },
      { key: 'exp02.whatHeTriedToDiscoverCode', value: code, scope: 'global' },
      { key: 'exp02.question03Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { key: 'exp02.whatHeTriedToDiscover', value: label },
    });

    const pauseDuration = narrativePacingManager.calculateDuration('SHORT');
    setTimeout(() => {
      navigateToScreen('screen_08_microrevelation');
    }, pauseDuration);
  };

  // SCREEN F: Microrevelación continue
  const handleMicrorevelationContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_closing' },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.contextGapRecognized', value: true, scope: 'global' },
    ]);

    navigateToScreen('screen_09_closing');
  };

  // SCREEN G: Final de EXP_02 (Completion & Transition to EXP_03)
  const handleFinalStep = () => {
    if (completingRef.current || isCompletedGuard) return;
    completingRef.current = true;
    setIsCompletedGuard(true);
    setIsProcessing(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'complete_exp02' },
    });

    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      contextGapRecognized: true,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.contextGapRecognized', value: true, scope: 'global' },
      { key: 'exp02.completed', value: true, scope: 'global' },
      { key: 'exp02.completedAt', value: new Date().toISOString(), scope: 'global' },
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

    eventTracker.trackEvent('EXP02_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { memory: finalMemory },
    });

    onComplete(finalMemory);
  };

  // Retrieve saved responses for empathetic reflections
  const savedResponses = (state.responses.exp02 || {}) as Record<string, unknown>;
  const firstInterpretation = (savedResponses['exp02.firstInterpretation'] ||
    savedResponses['firstInterpretation']) as string | undefined;
  const firstInterpretationCode = (savedResponses['exp02.firstInterpretationCode'] ||
    savedResponses['firstInterpretationCode']) as 'A' | 'B' | 'C' | 'D' | undefined;

  const whatHeTriedToDiscoverCode = (savedResponses['exp02.whatHeTriedToDiscoverCode'] ||
    savedResponses['whatHeTriedToDiscoverCode']) as 'A' | 'B' | 'C' | 'D' | undefined;
  const whatHeTriedToDiscover = (savedResponses['exp02.whatHeTriedToDiscover'] ||
    savedResponses['whatHeTriedToDiscover']) as string | undefined;

  // Screen A quote based on firstInterpretationCode
  const recordQuote = useMemo(() => {
    if (firstInterpretationCode && EXP02_CONTENT.screen07a.firstResponseQuotes[firstInterpretationCode]) {
      return EXP02_CONTENT.screen07a.firstResponseQuotes[firstInterpretationCode];
    }
    if (firstInterpretation?.includes('hice algo')) {
      return EXP02_CONTENT.screen07a.firstResponseQuotes.B;
    }
    if (firstInterpretation?.includes('pasa')) {
      return EXP02_CONTENT.screen07a.firstResponseQuotes.A;
    }
    if (firstInterpretation?.includes('quede')) {
      return EXP02_CONTENT.screen07a.firstResponseQuotes.C;
    }
    return EXP02_CONTENT.screen07a.firstResponseQuotes.D;
  }, [firstInterpretationCode, firstInterpretation]);

  // Screen F microrevelation branching based on whatHeTriedToDiscoverCode
  const microrevelationBranch = useMemo(() => {
    if (whatHeTriedToDiscoverCode && EXP02_CONTENT.screen08.branches[whatHeTriedToDiscoverCode]) {
      return EXP02_CONTENT.screen08.branches[whatHeTriedToDiscoverCode];
    }
    if (whatHeTriedToDiscover?.includes('mal')) {
      return EXP02_CONTENT.screen08.branches.A;
    }
    if (whatHeTriedToDiscover?.includes('pasaba')) {
      return EXP02_CONTENT.screen08.branches.B;
    }
    if (whatHeTriedToDiscover?.includes('arreglarlo')) {
      return EXP02_CONTENT.screen08.branches.C;
    }
    return EXP02_CONTENT.screen08.branches.D;
  }, [whatHeTriedToDiscoverCode, whatHeTriedToDiscover]);

  return (
    <div
      id="exp02-container"
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
      {/* SCREEN 01 — TRANSICIÓN DESDE LA PUERTA                                    */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_01_transition' && (
        <div
          id="screen-01-transition"
          className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-lg mx-auto py-8"
        >
          <div className="space-y-6">
            <div className="transition-all duration-1000 opacity-100">
              <span className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
                {EXP02_CONTENT.screen01.leadCaseLabel} #{caseId}
              </span>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-mono tracking-[0.25em] text-white uppercase">
                {EXP02_CONTENT.screen01.leadPause1}
              </h1>
            </div>

            <div
              className={`space-y-3 pt-2 transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-300 font-body leading-relaxed">
                {EXP02_CONTENT.screen01.leadText1}
              </p>
              <p className="text-sm sm:text-base text-neutral-400 font-body leading-relaxed">
                {EXP02_CONTENT.screen01.leadText2}
              </p>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-transition-continue"
              onClick={handleTransitionContinue}
            >
              {EXP02_CONTENT.screen01.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 02 — LA SITUACIÓN                                                  */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_02_situation' && (
        <div
          id="screen-02-situation"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 w-full">
            <div className="transition-all duration-1000 opacity-100">
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP02_CONTENT.screen02.beat1}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP02_CONTENT.screen02.beat2}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP02_CONTENT.screen02.beat3}
              </p>
              <p className="text-xs font-mono tracking-widest text-neutral-600 uppercase pt-2">
                {EXP02_CONTENT.screen02.beat4}
              </p>
            </div>

            {/* Dominant quote floating in space */}
            <div
              className={`py-8 sm:py-12 transition-all duration-1000 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white tracking-wide font-normal">
                {EXP02_CONTENT.screen02.dominantQuote}
              </h2>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed}>
            <PrimaryCTA
              id="cta-situation-continue"
              onClick={handleSituationContinue}
            >
              {EXP02_CONTENT.screen02.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 03 — LA RESPUESTA INMEDIATA (PREGUNTA 1)                           */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_03_immediate_response' && (
        <div
          id="screen-03-immediate-response"
          className="w-full flex flex-col space-y-8 animate-fade-in text-left max-w-xl mx-auto py-4"
        >
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              SITUACIÓN
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-white tracking-wide leading-snug pt-2">
              {EXP02_CONTENT.screen03.question}
            </h2>
          </div>

          <div
            className={`space-y-3 pt-3 transition-all duration-700 ${
              isOptionsRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {EXP02_CONTENT.screen03.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;
              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-exp02-q1-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  evidenceLabel="DATO 03"
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
      {/* SCREEN 04 — LA CONVERSACIÓN (REGISTRO CINEMATOGRÁFICO)                    */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_04_conversation' && (
        <div
          id="screen-04-conversation"
          className="w-full flex flex-col space-y-10 animate-fade-in text-left max-w-xl mx-auto py-6"
        >
          <div className="border-b border-[#181818] pb-3 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase">
              {EXP02_CONTENT.screen04.introLabel}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
              CASO #{caseId}
            </span>
          </div>

          {/* Dialogue sequence */}
          <div className="space-y-6 py-2">
            {EXP02_CONTENT.screen04.messages.map((msg, index) => {
              const isRevealed = screenStage >= index + 1;
              const isYou = msg.speaker === 'YOU';
              return (
                <div
                  key={index}
                  className={`flex flex-col space-y-1 transition-all duration-1000 ${
                    isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
                  } ${isYou ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">
                    {isYou ? 'TÚ' : 'ELLA'}
                  </span>
                  <div
                    className={`p-3.5 sm:p-4 rounded-xl max-w-md ${
                      isYou
                        ? 'bg-[#0A0A0A] border border-[#1C1C1C] text-neutral-200 font-body'
                        : 'bg-[#0E0E0E] border border-orange-500/20 text-neutral-100 font-serif italic'
                    }`}
                  >
                    <p className="text-sm sm:text-base leading-relaxed">“{msg.text}”</p>
                  </div>
                </div>
              );
            })}
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-conversation-continue"
              onClick={handleConversationContinue}
            >
              {EXP02_CONTENT.screen04.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 05 — EL PATRÓN                                                     */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_05_pattern' && (
        <div
          id="screen-05-pattern"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                OBSERVACIÓN
              </span>
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed pt-3">
                {EXP02_CONTENT.screen05.beat1}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed">
                {EXP02_CONTENT.screen05.beat2}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body italic">
                {EXP02_CONTENT.screen05.beat3}
              </p>
            </div>

            {/* Dominant weight */}
            <div
              className={`pt-6 border-t border-[#181818] transition-all duration-1000 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed border-l-2 border-orange-500 pl-5 py-2">
                {EXP02_CONTENT.screen05.dominantText}
              </h2>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-pattern-continue"
              onClick={handlePatternContinue}
            >
              {EXP02_CONTENT.screen05.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 06 — EL ESPEJO (PREGUNTA 2)                                        */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_06_mirror' && (
        <div
          id="screen-06-mirror"
          className="w-full flex flex-col space-y-8 animate-fade-in text-left max-w-xl mx-auto py-4"
        >
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              {EXP02_CONTENT.screen06.lead1}
            </p>
            <p className="text-sm text-neutral-400 font-body">
              {EXP02_CONTENT.screen06.lead2}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-white tracking-wide leading-snug pt-2">
              {EXP02_CONTENT.screen06.question}
            </h2>
          </div>

          <div
            className={`space-y-3 pt-3 transition-all duration-700 ${
              isOptionsRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {EXP02_CONTENT.screen06.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;
              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-exp02-q2-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  evidenceLabel="DATO 04"
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
      {/* SCREEN A — TU REGISTRO                                                    */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07a_record' && (
        <div
          id="screen-07a-record"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-8 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                {EXP02_CONTENT.screen07a.eyebrow}
              </span>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-xl bg-[#080808] border border-[#1C1C1C] transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-200 font-serif italic whitespace-pre-line leading-relaxed">
                {recordQuote}
              </p>
            </div>

            <div
              className={`pt-2 transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-lg sm:text-xl font-serif italic text-white leading-relaxed">
                {EXP02_CONTENT.screen07a.followUp}
              </p>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-record-continue"
              onClick={handleRecordContinue}
            >
              {EXP02_CONTENT.screen07a.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN B — LO QUE BUSCAS                                                  */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07b_searching' && (
        <div
          id="screen-07b-searching"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                REFLEXIÓN
              </span>
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed pt-3">
                {EXP02_CONTENT.screen07b.beat1}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-200 font-body leading-relaxed">
                {EXP02_CONTENT.screen07b.beat2}
              </p>
            </div>

            {/* Questions appearing progressively one by one with soft fade */}
            <div className="space-y-3 pt-4 border-t border-[#181818]">
              {EXP02_CONTENT.screen07b.questions.map((q, idx) => {
                const stageTarget = idx + 3;
                const isVisible = screenStage >= stageTarget;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg bg-[#0A0A0A] border border-[#1C1C1C] transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-base sm:text-lg font-serif italic text-white tracking-wide">
                      “{q}”
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-searching-continue"
              onClick={handleSearchingContinue}
            >
              {EXP02_CONTENT.screen07b.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN C — LO QUE NO PUEDES VER                                           */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07c_unseen' && (
        <div
          id="screen-07c-unseen"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-8 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                DESCUBRIMIENTO
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed pt-3">
                {EXP02_CONTENT.screen07c.beat1}
              </h2>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-xl bg-[#090909] border-l-2 border-orange-500 transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-neutral-100 leading-relaxed">
                {EXP02_CONTENT.screen07c.beat2}
              </p>
              <div
                className={`pt-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-orange-200/90 leading-relaxed">
                  {EXP02_CONTENT.screen07c.beat3}
                </p>
              </div>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-unseen-continue"
              onClick={handleUnseenContinue}
            >
              {EXP02_CONTENT.screen07c.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN D — LA NUEVA PREGUNTA                                              */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07d_new_question' && (
        <div
          id="screen-07d-new-question"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-8 text-left w-full">
            <div className="transition-all duration-1000 opacity-100">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                PERSPECTIVA
              </span>
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed pt-3">
                {EXP02_CONTENT.screen07d.lead}
              </p>
            </div>

            {/* Before */}
            <div
              className={`space-y-1 pl-4 border-l border-neutral-800 transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="text-xs font-mono tracking-widest text-neutral-600 uppercase">
                {EXP02_CONTENT.screen07d.beforeLabel}
              </span>
              <p className="text-base text-neutral-500 font-serif italic">
                “{EXP02_CONTENT.screen07d.beforeQuestion}”
              </p>
            </div>

            {/* After - Maximum visual hierarchy with generous negative space */}
            <div
              className={`pt-6 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="text-xs font-mono tracking-widest text-orange-500/80 uppercase">
                {EXP02_CONTENT.screen07d.afterLabel}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white leading-relaxed border-l-2 border-orange-500 pl-4 py-2">
                “{EXP02_CONTENT.screen07d.afterQuestion}”
              </h2>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-new-question-continue"
              onClick={handleNewQuestionContinue}
            >
              {EXP02_CONTENT.screen07d.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN E — PARTICIPACIÓN (TERCERA PREGUNTA)                               */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07e_participation' && (
        <div
          id="screen-07e-participation"
          className="w-full flex flex-col space-y-8 animate-fade-in text-left max-w-xl mx-auto py-4"
        >
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              {EXP02_CONTENT.screen07e.lead}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-white tracking-wide leading-snug pt-2">
              {EXP02_CONTENT.screen07e.question}
            </h2>
          </div>

          <div
            className={`space-y-3 pt-3 transition-all duration-700 ${
              isOptionsRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {EXP02_CONTENT.screen07e.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;
              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-exp02-q3-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  evidenceLabel="DATO 05"
                  selected={isSelected}
                  isAnySelected={isAnySelected}
                  disabled={isAnySelected}
                  onClick={() => handleSelectQuestion3(opt.code, opt.label)}
                >
                  <span className="font-body text-base sm:text-lg">{opt.label}</span>
                </ChoiceButton>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN F — MICROREVELACIÓN                                                */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_08_microrevelation' && (
        <div
          id="screen-08-microrevelation"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-8 text-left w-full">
            {/* Adapted reflection based on Q3 */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#080808] border border-[#1C1C1C] transition-all duration-1000 opacity-100">
              <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase">
                TU REGISTRO
              </span>
              <p className="text-base sm:text-lg text-neutral-200 font-serif italic pt-2">
                {microrevelationBranch}
              </p>
            </div>

            {/* Pivot */}
            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-serif italic text-white leading-relaxed">
                {EXP02_CONTENT.screen08.pivot}
              </h2>
            </div>

            {/* Nuances */}
            <div
              className={`space-y-3 transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP02_CONTENT.screen08.pause1}
              </p>
              <p
                className={`text-base sm:text-lg text-neutral-300 font-body leading-relaxed transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP02_CONTENT.screen08.pause2}
              </p>
              <p
                className={`text-base sm:text-lg text-neutral-200 font-serif italic transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP02_CONTENT.screen08.pause3}
              </p>
            </div>

            {/* Final insight phrase - Clean, human, intriguing */}
            <div
              className={`pt-6 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-400 font-serif italic">
                {EXP02_CONTENT.screen08.finalLead}
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white tracking-wide border-l-2 border-orange-500 pl-4 py-1">
                {EXP02_CONTENT.screen08.finalPunch}
              </p>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-microrevelation-continue"
              onClick={handleMicrorevelationContinue}
            >
              {EXP02_CONTENT.screen08.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN G — CIERRE / TRANSICIÓN HACIA EXP_03                                */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_09_closing' && (
        <div
          id="screen-09-closing"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <div className="space-y-3 transition-all duration-1000 opacity-100">
              <p className="text-lg sm:text-xl font-serif italic text-neutral-300 leading-relaxed">
                {EXP02_CONTENT.screen09.beat1}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed border-l-2 border-orange-500 pl-4 py-1">
                {EXP02_CONTENT.screen09.beat2}
              </h2>
            </div>

            <div
              className={`pt-4 border-t border-[#181818] transition-all duration-1000 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body leading-relaxed">
                {EXP02_CONTENT.screen09.beat3}
              </p>
            </div>
          </div>

          <CTAReveal isRevealed={isCTARevealed} className="pt-4">
            <PrimaryCTA
              id="cta-complete-exp02"
              onClick={handleFinalStep}
            >
              {EXP02_CONTENT.screen09.ctaLabel}
            </PrimaryCTA>
          </CTAReveal>
        </div>
      )}
    </div>
  );
};
