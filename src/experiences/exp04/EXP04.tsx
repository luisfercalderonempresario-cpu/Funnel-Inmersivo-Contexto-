// EXP_04 — LA INVESTIGACIÓN (Narrative Pacing System V1.0 Integration)
import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { ExperienceId } from '../../engine/state/types';
import { EXP04_CONTENT } from './exp04Content';
import { EXP04_DEFINITION } from './exp04Definition';
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

export const EXP04: React.FC<ExperienceComponentProps> = ({
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
        experience: 'exp04',
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
      const exp04Responses = (prev.responses.exp04 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp04: {
            ...exp04Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp04',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_04
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp04');
    if (existing && existing.currentScreen && EXP04_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp04',
      currentScreen: 'screen_01_intro',
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

  // Narrative Beats Map for EXP_04
  const currentBeats: NarrativeBeat[] = useMemo(() => {
    switch (currentScreenId) {
      case 'screen_01_intro':
        return [
          { id: 'caseId', stage: 1, pacing: 'SHORT', label: 'Caso ID Eyebrow' },
          { id: 'leadStart', stage: 2, pacing: 'MEDIUM', label: 'Comencemos la investigación' },
          { id: 'questionIntro', stage: 3, pacing: 'LONG', label: 'Tenemos una pregunta' },
          { id: 'mainQuestion', stage: 4, pacing: 'REVELATION', label: '¿Qué información falta?' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Iniciar', isCTA: true },
        ];
      case 'screen_02_first_clue':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Un martes' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Todo está normal' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'Hablan' },
          { id: 'beat4', stage: 4, pacing: 'MEDIUM', label: 'Se ríen' },
          { id: 'beat5', stage: 5, pacing: 'LONG', label: 'Planean verse el fin de semana' },
          { id: 'pauseBeat', stage: 6, pacing: 'LONG', label: 'Dos días después...' },
          { id: 'changeBeat', stage: 7, pacing: 'LONG', label: 'Algo cambia' },
          { id: 'outcomeBeat', stage: 8, pacing: 'REVELATION', label: 'No quiere salir' },
          { id: 'cta', stage: 9, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_03_second_clue':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Una semana después' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Vuelve a ocurrir' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'Menos paciencia' },
          { id: 'beat4', stage: 4, pacing: 'MEDIUM', label: 'Más cansancio' },
          { id: 'beat5', stage: 5, pacing: 'LONG', label: 'Menos ganas de hablar' },
          { id: 'beat6', stage: 6, pacing: 'REVELATION', label: 'No sabes exactamente por qué' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_04_comparison':
        return [
          { id: 'lead1', stage: 1, pacing: 'MEDIUM', label: 'Dos momentos' },
          { id: 'lead2', stage: 2, pacing: 'MEDIUM', label: 'Una misma persona' },
          { id: 'lead3', stage: 3, pacing: 'LONG', label: 'Comportamientos diferentes' },
          { id: 'silenceQuestion', stage: 4, pacing: 'LONG', label: '¿Qué cambió?' },
          { id: 'question', stage: 5, pacing: 'MEDIUM', label: '¿Qué crees que puede estar detrás?' },
          { id: 'options', stage: 6, pacing: 'MANUAL', label: 'Opciones Pregunta 1', isOptions: true },
          { id: 'feedback', stage: 7, pacing: 'MEDIUM', label: 'Feedback Adaptativo 1' },
          { id: 'convergence1', stage: 8, pacing: 'MEDIUM', label: 'Pero todavía tenemos un problema' },
          { id: 'convergence2', stage: 9, pacing: 'REVELATION', label: 'No sabemos qué cambió' },
          { id: 'cta', stage: 10, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_05_anomaly':
        return [
          { id: 'recordA', stage: 1, pacing: 'LONG', label: 'Registro A Martes' },
          { id: 'recordB', stage: 2, pacing: 'LONG', label: 'Registro B Viernes' },
          { id: 'questionPerson', stage: 3, pacing: 'MEDIUM', label: '¿Es la misma persona?' },
          { id: 'answerYes', stage: 4, pacing: 'MEDIUM', label: 'Sí.' },
          { id: 'thenBeat', stage: 5, pacing: 'LONG', label: 'Entonces...' },
          { id: 'anomalyQuestion', stage: 6, pacing: 'REVELATION', label: '¿Qué cambió?' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_06_observation':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'Si solamente observas el viernes...' },
          { id: 'question', stage: 2, pacing: 'MEDIUM', label: '¿Qué conclusión podrías sacar?' },
          { id: 'options', stage: 3, pacing: 'MANUAL', label: 'Opciones Pregunta 2', isOptions: true },
          { id: 'feedback', stage: 4, pacing: 'MEDIUM', label: 'Feedback Adaptativo 2' },
          { id: 'convergence', stage: 5, pacing: 'REVELATION', label: 'Mirando solamente una fotografía' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_07_second_evidence':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Dos semanas después' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Vuelve a aparecer' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'Otro momento' },
          { id: 'beat4', stage: 4, pacing: 'MEDIUM', label: 'Otro comportamiento' },
          { id: 'beat5', stage: 5, pacing: 'LONG', label: 'Y después...' },
          { id: 'beat6', stage: 6, pacing: 'REVELATION', label: 'Todo vuelve a cambiar' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_08_pattern':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Una vez puede ser casualidad' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Dos veces puede no significar nada' },
          { id: 'beat3', stage: 3, pacing: 'LONG', label: 'Pero cuando algo empieza a repetirse...' },
          { id: 'revelation', stage: 4, pacing: 'REVELATION', label: '...merece ser investigado' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_09_hidden_process':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'El problema...' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: '...es que tú ves el comportamiento' },
          { id: 'dominantLead', stage: 3, pacing: 'LONG', label: 'Pero no necesariamente ves todo lo de detrás' },
          { id: 'beat3', stage: 4, pacing: 'MEDIUM', label: 'Hay procesos que ocurren...' },
          { id: 'beat4', stage: 5, pacing: 'REVELATION', label: '...sin pedir permiso para aparecer' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_10_variable':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'En una investigación...' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'cuando algo cambia...' },
          { id: 'beat3', stage: 3, pacing: 'LONG', label: 'buscas qué variable también cambió' },
          { id: 'variableVisual', stage: 4, pacing: 'LONG', label: 'Tarjeta de Variable y preguntas' },
          { id: 'question', stage: 5, pacing: 'MEDIUM', label: '¿Qué observarías?' },
          { id: 'options', stage: 6, pacing: 'MANUAL', label: 'Opciones Pregunta 3', isOptions: true },
          { id: 'feedback', stage: 7, pacing: 'MEDIUM', label: 'Feedback Adaptativo 3' },
          { id: 'convergenceLead', stage: 8, pacing: 'MEDIUM', label: 'Porque quizá...' },
          { id: 'convergenceWhat', stage: 9, pacing: 'LONG', label: '...el patrón no está solamente en LO QUE ocurre' },
          { id: 'convergenceWhen', stage: 10, pacing: 'REVELATION', label: 'Puede estar también en CUÁNDO ocurre' },
          { id: 'cta', stage: 11, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_11_open_question':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Si existe un patrón...' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'y si ese patrón aparece en determinados momentos...' },
          { id: 'beat3', stage: 3, pacing: 'LONG', label: 'entonces necesitamos descubrir algo' },
          { id: 'dominantQuestion', stage: 4, pacing: 'REVELATION', label: '¿Qué está ocurriendo durante esos momentos?' },
          { id: 'closure', stage: 5, pacing: 'MEDIUM', label: 'Eso es lo que vamos a investigar' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_12_transition':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Tenemos suficientes indicios' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Pero todavía nos falta una pieza' },
          { id: 'dominantPiece', stage: 3, pacing: 'LONG', label: 'Una pieza importante' },
          { id: 'beat3', stage: 4, pacing: 'MEDIUM', label: 'En la siguiente parte del caso...' },
          { id: 'beat4', stage: 5, pacing: 'REVELATION', label: '...vamos a buscarla' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Buscar la Pieza Faltante', isCTA: true },
        ];
      default:
        return [];
    }
  }, [currentScreenId]);

  // Hook into Narrative Pacing System
  const { stage: screenStage, isCTARevealed, isOptionsRevealed, advanceStage } = useNarrativePacing({
    experienceId: 'exp04',
    screenId: currentScreenId,
    beats: currentBeats,
  });

  // Synchronize runtime persistence
  useEffect(() => {
    persistExperienceRuntimeState(runtimeState);
  }, [runtimeState]);

  // Sync with funnel progress & track screen views
  useEffect(() => {
    updateState((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        currentExperience: 'exp04',
        currentScreen: currentScreenId,
      },
    }));

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { screenId: currentScreenId },
    });

    if (
      currentScreenId === 'screen_04_comparison' ||
      currentScreenId === 'screen_06_observation' ||
      currentScreenId === 'screen_10_variable'
    ) {
      eventTracker.trackEvent('QUESTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp04',
        payload: { screenId: currentScreenId },
      });
    }
  }, [currentScreenId, state.session.sessionId, state.session.caseId, updateState]);

  // Initial event tracker on mount
  useEffect(() => {
    eventTracker.trackEvent('EXP04_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
    });
    memoryManagerRef.current.setMemory('exp04.started', true, 'global');
  }, [state.session.sessionId, state.session.caseId]);

  // Read saved responses from funnel state for adaptive display
  const savedResponses = (state.responses.exp04 || {}) as Record<string, unknown>;
  const hypothesisCode = (savedResponses['exp04.hypothesisCode'] ||
    savedResponses['hypothesisCode']) as 'A' | 'B' | 'C' | 'D' | undefined;
  const observationConclusionCode = (savedResponses['exp04.observationConclusionCode'] ||
    savedResponses['observationConclusionCode']) as 'A' | 'B' | 'C' | 'D' | undefined;
  const investigationFocusCode = (savedResponses['exp04.investigationFocusCode'] ||
    savedResponses['investigationFocusCode']) as 'A' | 'B' | 'C' | 'D' | undefined;

  // Selected feedback calculations
  const hypothesisFeedback = useMemo(() => {
    const opt = EXP04_CONTENT.screen04.options.find((o) => o.code === hypothesisCode);
    return opt?.feedback || EXP04_CONTENT.screen04.options[3].feedback;
  }, [hypothesisCode]);

  const observationFeedback = useMemo(() => {
    const opt = EXP04_CONTENT.screen06.options.find((o) => o.code === observationConclusionCode);
    return opt?.feedback || EXP04_CONTENT.screen06.options[3].feedback;
  }, [observationConclusionCode]);

  const investigationFeedback = useMemo(() => {
    const opt = EXP04_CONTENT.screen10.options.find((o) => o.code === investigationFocusCode);
    return opt?.feedback || EXP04_CONTENT.screen10.options[3].feedback;
  }, [investigationFocusCode]);

  // Generic transition forward between screens
  const advanceToScreen = (targetScreenId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const nextState = transitionScreenState(runtimeState, targetScreenId);
    persistExperienceRuntimeState(nextState);

    startTransition(() => {
      setRuntimeState(nextState);
      setSelectedOption(null);
      setIsProcessing(false);
    });
  };

  // Handler for Question 1 (Screen 04: Hipótesis)
  const handleSelectHypothesis = (code: 'A' | 'B' | 'C' | 'D', label: string) => {
    if (hypothesisCode || isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { questionId: 'exp04_q1_hypothesis', choiceCode: code, choiceLabel: label },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp04.hypothesis', value: label, scope: 'global' },
      { key: 'exp04.hypothesisCode', value: code, scope: 'global' },
      { key: 'exp04.question01Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { questionId: 'exp04_q1_hypothesis', answer: label, code },
    });

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { key: 'exp04.hypothesis', value: label },
    });

    advanceStage();
    setIsProcessing(false);
  };

  // Handler for Question 2 (Screen 06: Observación Viernes)
  const handleSelectObservation = (code: 'A' | 'B' | 'C' | 'D', label: string) => {
    if (observationConclusionCode || isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { questionId: 'exp04_q2_observation', choiceCode: code, choiceLabel: label },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp04.observationConclusion', value: label, scope: 'global' },
      { key: 'exp04.observationConclusionCode', value: code, scope: 'global' },
      { key: 'exp04.question02Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { questionId: 'exp04_q2_observation', answer: label, code },
    });

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { key: 'exp04.observationConclusion', value: label },
    });

    advanceStage();
    setIsProcessing(false);
  };

  // Handler for Question 3 (Screen 10: Foco de Investigación)
  const handleSelectInvestigationFocus = (code: 'A' | 'B' | 'C' | 'D', label: string) => {
    if (investigationFocusCode || isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { questionId: 'exp04_q3_focus', choiceCode: code, choiceLabel: label },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp04.investigationFocus', value: label, scope: 'global' },
      { key: 'exp04.investigationFocusCode', value: code, scope: 'global' },
      { key: 'exp04.question03Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { questionId: 'exp04_q3_focus', answer: label, code },
    });

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { key: 'exp04.investigationFocus', value: label },
    });

    advanceStage();
    setIsProcessing(false);
  };

  // Record insights on screen progression
  useEffect(() => {
    if (currentScreenId === 'screen_08_pattern' && screenStage >= 4) {
      memoryManagerRef.current.setMemory('exp04.patternRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp04',
        payload: { insight: 'pattern_recognized', screen: 'screen_08_pattern' },
      });
    }
    if (currentScreenId === 'screen_09_hidden_process' && screenStage >= 5) {
      memoryManagerRef.current.setMemory('exp04.hiddenProcessRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp04',
        payload: { insight: 'hidden_process_recognized', screen: 'screen_09_hidden_process' },
      });
    }
  }, [currentScreenId, screenStage, state.session.sessionId, state.session.caseId]);

  // Complete EXP_04 and transition to EXP_05
  const handleCompleteExp04 = () => {
    if (isCompletedGuard || completingRef.current) return;
    completingRef.current = true;
    setIsCompletedGuard(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { action: 'complete_exp04', label: EXP04_CONTENT.screen12.ctaLabel },
    });

    const now = new Date().toISOString();
    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      patternRecognized: true,
      hiddenProcessRecognized: true,
      completed: true,
      completedAt: now,
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp04.patternRecognized', value: true, scope: 'global' },
      { key: 'exp04.hiddenProcessRecognized', value: true, scope: 'global' },
      { key: 'exp04.completed', value: true, scope: 'global' },
      { key: 'exp04.completedAt', value: now, scope: 'global' },
    ]);

    setRuntimeState((prev) => {
      const next: ExperienceRuntimeState = {
        ...prev,
        status: 'COMPLETED',
        completedScreens: Array.from(new Set([...prev.completedScreens, prev.currentScreen])),
        lastActivityAt: now,
      };
      persistExperienceRuntimeState(next);
      return next;
    });

    eventTracker.trackEvent('EXP04_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { memory: finalMemory },
    });

    eventTracker.trackEvent('EXPERIENCE_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { experienceId: 'exp04' },
    });

    // Update FunnelState completed experiences
    updateState((prev) => {
      const alreadyCompleted = prev.progress.completedExperiences.includes('exp04');
      const updatedList: ExperienceId[] = alreadyCompleted
        ? prev.progress.completedExperiences
        : [...prev.progress.completedExperiences, 'exp04'];

      return {
        ...prev,
        progress: {
          ...prev.progress,
          completedExperiences: updatedList,
          completionPercentage: Math.max(prev.progress.completionPercentage, 50),
        },
      };
    });

    // Invoke parent completion handler to navigate to EXP_05
    onComplete(finalMemory);
  };

  return (
    <div
      id="exp04-root-container"
      className="relative min-h-[90vh] flex flex-col justify-between items-center bg-[#050505] text-neutral-100 px-4 sm:px-6 py-6 sm:py-10 selection:bg-orange-500/20 selection:text-orange-200"
    >
      {/* Top Bar with Minimal Case Reference & Audio Control */}
      <header
        id="exp04-header"
        className="w-full max-w-xl flex items-center justify-between py-2 mb-4 border-b border-[#141414]"
      >
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            CASO #{caseId}
          </span>
          <span className="text-[10px] text-neutral-700 font-mono">/</span>
          <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
            EXP_04
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            id="exp04-audio-toggle"
            onClick={toggleAudio}
            className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-300 hover:bg-[#141414] transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-600"
            title={isAudioActive ? 'Silenciar ambiente' : 'Activar audio'}
            aria-label={isAudioActive ? 'Silenciar audio ambiental' : 'Activar audio ambiental'}
          >
            {isAudioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Narrative Area */}
      <main id="exp04-main-stage" className="w-full max-w-xl flex-1 flex flex-col justify-center my-auto">
        {/* ========================================================================= */}
        {/* SCREEN 01 — INICIO DE INVESTIGACIÓN */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_01_intro' && (
          <div
            id="screen-01-intro"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen01.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white leading-relaxed">
                  {EXP04_CONTENT.screen01.leadStart}
                </h1>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-400 font-serif italic">
                  {EXP04_CONTENT.screen01.questionIntro}
                </p>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-orange-400 leading-snug">
                    {EXP04_CONTENT.screen01.mainQuestion}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-01-cta-iniciar"
                onClick={() => advanceToScreen('screen_02_first_clue')}
                disabled={isProcessing}
              >
                {EXP04_CONTENT.screen01.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 02 — PRIMER INDICIO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_02_first_clue' && (
          <div
            id="screen-02-first-clue"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen02.eyebrow}
                </span>
              </div>

              {/* Normal Situation Sequence */}
              <div className="space-y-3">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xl sm:text-2xl font-serif italic text-white">
                    {EXP04_CONTENT.screen02.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-300 font-body">
                    {EXP04_CONTENT.screen02.beat2}
                  </p>
                </div>

                <div
                  className={`flex items-center space-x-3 text-base text-neutral-300 font-body transition-all duration-1000 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span>{EXP04_CONTENT.screen02.beat3}</span>
                  {screenStage >= 4 && (
                    <span className="animate-fade-in text-neutral-400 font-serif italic">
                      — {EXP04_CONTENT.screen02.beat4}
                    </span>
                  )}
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-300 font-body">
                    {EXP04_CONTENT.screen02.beat5}
                  </p>
                </div>
              </div>

              {/* The Shift */}
              <div
                className={`pt-6 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono tracking-widest text-neutral-500 uppercase">
                  {EXP04_CONTENT.screen02.pauseBeat}
                </p>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-lg sm:text-xl font-serif italic text-neutral-200">
                    {EXP04_CONTENT.screen02.changeBeat}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 transition-all duration-1000 ${
                    screenStage >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-lg sm:text-xl font-serif italic text-white">
                    “{EXP04_CONTENT.screen02.outcomeBeat}”
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-02-cta"
                onClick={() => advanceToScreen('screen_03_second_clue')}
                disabled={isProcessing}
              >
                {EXP04_CONTENT.screen02.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 03 — SEGUNDO INDICIO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_03_second_clue' && (
          <div
            id="screen-03-second-clue"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen03.eyebrow}
                </span>
              </div>

              <div className="space-y-3">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xl sm:text-2xl font-serif italic text-white">
                    {EXP04_CONTENT.screen03.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base font-serif italic text-neutral-400">
                    {EXP04_CONTENT.screen03.beat2}
                  </p>
                </div>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-2">
                  <p className="text-base text-neutral-300 font-body flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mr-3" />
                    {EXP04_CONTENT.screen03.beat3}
                  </p>
                  {screenStage >= 4 && (
                    <p className="text-base text-neutral-300 font-body flex items-center animate-fade-in">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mr-3" />
                      {EXP04_CONTENT.screen03.beat4}
                    </p>
                  )}
                  {screenStage >= 5 && (
                    <p className="text-base text-neutral-300 font-body flex items-center animate-fade-in">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mr-3" />
                      {EXP04_CONTENT.screen03.beat5}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`pt-4 transition-all duration-1000 ${
                  screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg font-serif italic text-neutral-400">
                  {EXP04_CONTENT.screen03.beat6}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-03-cta"
                onClick={() => advanceToScreen('screen_04_comparison')}
                disabled={isProcessing}
              >
                {EXP04_CONTENT.screen03.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 04 — COMPARACIÓN (PREGUNTA 1) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_04_comparison' && (
          <div
            id="screen-04-comparison"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen04.eyebrow}
                </span>
              </div>

              {/* Leading comparison statements */}
              <div className="space-y-2">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xl sm:text-2xl font-serif italic text-white">
                    {EXP04_CONTENT.screen04.lead1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-400 font-body">
                    {EXP04_CONTENT.screen04.lead2}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-300 font-body">
                    {EXP04_CONTENT.screen04.lead3}
                  </p>
                </div>
              </div>

              {/* Silence & Dominant Question */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-2xl sm:text-3xl font-serif italic text-orange-400">
                  {EXP04_CONTENT.screen04.silenceQuestion}
                </p>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-sm font-mono tracking-wider text-neutral-400 uppercase">
                    {EXP04_CONTENT.screen04.question}
                  </p>
                </div>
              </div>

              {/* Options */}
              {isOptionsRevealed && !hypothesisCode && (
                <div className="space-y-3 pt-2 animate-fade-in">
                  {EXP04_CONTENT.screen04.options.map((opt) => (
                    <ChoiceButton
                      key={opt.id}
                      id={`choice-${opt.id}`}
                      code={opt.code}
                      selected={selectedOption === opt.code}
                      isAnySelected={selectedOption !== null}
                      onClick={() => handleSelectHypothesis(opt.code, opt.label)}
                      disabled={isProcessing || selectedOption !== null}
                    >
                      <span className="font-body text-base sm:text-lg">{opt.label}</span>
                    </ChoiceButton>
                  ))}
                </div>
              )}

              {/* Adaptive Feedback & Convergence */}
              {hypothesisCode && (
                <div className="space-y-4 pt-4 border-t border-[#181818] animate-fade-in">
                  <div
                    className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 transition-all duration-1000 ${
                      screenStage >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider mb-1">
                      TU RESPUESTA
                    </p>
                    <p className="text-base font-serif italic text-white">
                      “{savedResponses['exp04.hypothesis'] as string}”
                    </p>
                    <p className="text-sm text-neutral-400 font-body mt-2">
                      {hypothesisFeedback}
                    </p>
                  </div>

                  <div
                    className={`space-y-2 pt-2 transition-all duration-1000 ${
                      screenStage >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-base text-neutral-400 font-body">
                      {EXP04_CONTENT.screen04.convergence1}
                    </p>
                    {screenStage >= 9 && (
                      <p className="text-xl sm:text-2xl font-serif italic text-white animate-fade-in">
                        {EXP04_CONTENT.screen04.convergence2}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {hypothesisCode && (
              <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
                <PrimaryCTA
                  id="screen-04-cta"
                  onClick={() => advanceToScreen('screen_05_anomaly')}
                  disabled={isProcessing}
                >
                  {EXP04_CONTENT.screen04.ctaLabel}
                </PrimaryCTA>
              </CTAReveal>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 05 — LA ANOMALÍA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_05_anomaly' && (
          <div
            id="screen-05-anomaly"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen05.eyebrow}
                </span>
              </div>

              {/* Editorial Side-by-side / Stacked Evidence Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* REGISTRO A */}
                <div
                  className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-3 transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#181818] pb-2">
                    <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
                      {EXP04_CONTENT.screen05.recordA.tag}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {EXP04_CONTENT.screen05.recordA.time}
                    </span>
                  </div>
                  <p className="text-lg font-serif italic text-white">
                    {EXP04_CONTENT.screen05.recordA.day}
                  </p>
                  <ul className="space-y-1 text-sm text-neutral-300 font-body">
                    {EXP04_CONTENT.screen05.recordA.items.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-1 h-1 rounded-full bg-neutral-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* REGISTRO B */}
                <div
                  className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-3 transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#181818] pb-2">
                    <span className="text-[11px] font-mono tracking-wider text-orange-400 uppercase">
                      {EXP04_CONTENT.screen05.recordB.tag}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {EXP04_CONTENT.screen05.recordB.time}
                    </span>
                  </div>
                  <p className="text-lg font-serif italic text-white">
                    {EXP04_CONTENT.screen05.recordB.day}
                  </p>
                  <ul className="space-y-1 text-sm text-neutral-300 font-body">
                    {EXP04_CONTENT.screen05.recordB.items.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-1 h-1 rounded-full bg-orange-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reflection */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP04_CONTENT.screen05.questionPerson}
                </p>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-lg font-serif italic text-white">
                    {EXP04_CONTENT.screen05.answerYes}
                  </p>
                </div>

                <div
                  className={`pt-2 transition-all duration-1000 ${
                    screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-sm font-mono tracking-widest text-neutral-500 uppercase">
                    {EXP04_CONTENT.screen05.thenBeat}
                  </p>
                </div>

                <div
                  className={`pt-2 transition-all duration-1000 ${
                    screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-2xl sm:text-3xl font-serif italic text-orange-400">
                    {EXP04_CONTENT.screen05.anomalyQuestion}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-05-cta"
                onClick={() => advanceToScreen('screen_06_observation')}
                disabled={isProcessing}
              >
                {EXP04_CONTENT.screen05.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 06 — TU HIPÓTESIS (PREGUNTA 2) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_06_observation' && (
          <div
            id="screen-06-observation"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen06.eyebrow}
                </span>
              </div>

              <div className="space-y-2">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base sm:text-lg text-neutral-400 font-serif italic">
                    {EXP04_CONTENT.screen06.lead}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white">
                    {EXP04_CONTENT.screen06.question}
                  </h2>
                </div>
              </div>

              {/* Options */}
              {isOptionsRevealed && !observationConclusionCode && (
                <div className="space-y-3 pt-2 animate-fade-in">
                  {EXP04_CONTENT.screen06.options.map((opt) => (
                    <ChoiceButton
                      key={opt.id}
                      id={`choice-obs-${opt.id}`}
                      code={opt.code}
                      selected={selectedOption === opt.code}
                      isAnySelected={selectedOption !== null}
                      onClick={() => handleSelectObservation(opt.code, opt.label)}
                      disabled={isProcessing || selectedOption !== null}
                    >
                      <span className="font-body text-base sm:text-lg">{opt.label}</span>
                    </ChoiceButton>
                  ))}
                </div>
              )}

              {/* Microfeedback & Convergence */}
              {observationConclusionCode && (
                <div className="space-y-4 pt-4 border-t border-[#181818] animate-fade-in">
                  <div
                    className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 transition-all duration-1000 ${
                      screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider mb-1">
                      CONCLUSIÓN OBSERVADA
                    </p>
                    <p className="text-base font-serif italic text-white">
                      “{savedResponses['exp04.observationConclusion'] as string}”
                    </p>
                    <p className="text-sm text-neutral-400 font-body mt-2">
                      {observationFeedback}
                    </p>
                  </div>

                  <div
                    className={`pt-2 transition-all duration-1000 ${
                      screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-lg sm:text-xl font-serif italic text-orange-400 leading-relaxed">
                      {EXP04_CONTENT.screen06.convergence}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {observationConclusionCode && (
              <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
                <PrimaryCTA
                  id="screen-06-cta"
                  onClick={() => advanceToScreen('screen_07_second_evidence')}
                  disabled={isProcessing}
                >
                  {EXP04_CONTENT.screen06.ctaLabel}
                </PrimaryCTA>
              </CTAReveal>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 07 — SEGUNDA EVIDENCIA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_07_second_evidence' && (
          <div
            id="screen-07-second-evidence"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen07.eyebrow}
                </span>
              </div>

              <div className="space-y-3">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xl sm:text-2xl font-serif italic text-white">
                    {EXP04_CONTENT.screen07.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-400 font-serif italic">
                    {EXP04_CONTENT.screen07.beat2}
                  </p>
                </div>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-300 font-body">
                  {EXP04_CONTENT.screen07.beat3}
                </p>
                {screenStage >= 4 && (
                  <p className="text-base text-neutral-300 font-body animate-fade-in">
                    {EXP04_CONTENT.screen07.beat4}
                  </p>
                )}
              </div>

              <div
                className={`pt-4 space-y-2 transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono tracking-widest text-neutral-500 uppercase">
                  {EXP04_CONTENT.screen07.beat5}
                </p>

                {screenStage >= 6 && (
                  <p className="text-xl sm:text-2xl font-serif italic text-orange-400 animate-fade-in">
                    {EXP04_CONTENT.screen07.beat6}
                  </p>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-07-cta"
                onClick={() => advanceToScreen('screen_08_pattern')}
                disabled={isProcessing}
              >
                {EXP04_CONTENT.screen07.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 08 — EL PATRÓN */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_08_pattern' && (
          <div
            id="screen-08-pattern"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen08.eyebrow}
                </span>
              </div>

              <div className="space-y-4">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base sm:text-lg text-neutral-400 font-serif italic">
                    {EXP04_CONTENT.screen08.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base sm:text-lg text-neutral-400 font-serif italic">
                    {EXP04_CONTENT.screen08.beat2}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-lg sm:text-xl text-neutral-200 font-serif italic">
                    {EXP04_CONTENT.screen08.beat3}
                  </p>
                </div>
              </div>

              {/* Revelation Highlight */}
              <div
                className={`pt-6 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white border-l-2 border-orange-500 pl-4 py-2">
                  {EXP04_CONTENT.screen08.revelation}
                </h2>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-08-cta"
                onClick={() => advanceToScreen('screen_09_hidden_process')}
                disabled={isProcessing}
              >
                {EXP04_CONTENT.screen08.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 09 — LO QUE NO PUEDES VER */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_09_hidden_process' && (
          <div
            id="screen-09-hidden-process"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen09.eyebrow}
                </span>
              </div>

              <div className="space-y-3">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-sm font-mono tracking-widest text-neutral-500 uppercase">
                    {EXP04_CONTENT.screen09.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base sm:text-lg text-neutral-300 font-body">
                    {EXP04_CONTENT.screen09.beat2}
                  </p>
                </div>
              </div>

              {/* Dominant statement */}
              <div
                className={`pt-6 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed">
                  {EXP04_CONTENT.screen09.dominantLead}
                </h2>
              </div>

              {/* Subtle process beat */}
              <div
                className={`space-y-2 pt-4 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP04_CONTENT.screen09.beat3}
                </p>

                {screenStage >= 5 && (
                  <p className="text-lg sm:text-xl font-serif italic text-orange-400 animate-fade-in">
                    {EXP04_CONTENT.screen09.beat4}
                  </p>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-09-cta"
                onClick={() => advanceToScreen('screen_10_variable')}
                disabled={isProcessing}
              >
                {EXP04_CONTENT.screen09.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 10 — LA VARIABLE (PREGUNTA 3) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_10_variable' && (
          <div
            id="screen-10-variable"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen10.eyebrow}
                </span>
              </div>

              {/* Conceptual Intro */}
              <div className="space-y-2">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-sm font-mono tracking-widest text-neutral-400 uppercase">
                    {EXP04_CONTENT.screen10.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-300 font-body">
                    {EXP04_CONTENT.screen10.beat2}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-lg sm:text-xl font-serif italic text-white">
                    {EXP04_CONTENT.screen10.beat3}
                  </p>
                </div>
              </div>

              {/* Variable Card */}
              <div
                className={`p-5 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-3 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#181818] pb-2">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-400">
                    {EXP04_CONTENT.screen10.variableLabel}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    PARÁMETROS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-neutral-300 font-serif italic">
                  <p>• {EXP04_CONTENT.screen10.q1}</p>
                  <p>• {EXP04_CONTENT.screen10.q2}</p>
                  <p>• {EXP04_CONTENT.screen10.q3}</p>
                  <p>• {EXP04_CONTENT.screen10.q4}</p>
                </div>
              </div>

              {/* Question */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-1 transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono tracking-wider text-neutral-400 uppercase">
                  {EXP04_CONTENT.screen10.question}
                </p>
                <h3 className="text-xl sm:text-2xl font-serif italic text-white">
                  {EXP04_CONTENT.screen10.subQuestion}
                </h3>
              </div>

              {/* Options */}
              {isOptionsRevealed && !investigationFocusCode && (
                <div className="space-y-3 pt-2 animate-fade-in">
                  {EXP04_CONTENT.screen10.options.map((opt) => (
                    <ChoiceButton
                      key={opt.id}
                      id={`choice-var-${opt.id}`}
                      code={opt.code}
                      selected={selectedOption === opt.code}
                      isAnySelected={selectedOption !== null}
                      onClick={() => handleSelectInvestigationFocus(opt.code, opt.label)}
                      disabled={isProcessing || selectedOption !== null}
                    >
                      <span className="font-body text-base sm:text-lg">{opt.label}</span>
                    </ChoiceButton>
                  ))}
                </div>
              )}

              {/* Adaptive Feedback & Convergence */}
              {investigationFocusCode && (
                <div className="space-y-4 pt-4 border-t border-[#181818] animate-fade-in">
                  <div
                    className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 transition-all duration-1000 ${
                      screenStage >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider mb-1">
                      TU FOCO
                    </p>
                    <p className="text-base font-serif italic text-white">
                      “{savedResponses['exp04.investigationFocus'] as string}”
                    </p>
                    <p className="text-sm text-neutral-400 font-body mt-2">
                      {investigationFeedback}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div
                      className={`transition-all duration-1000 ${
                        screenStage >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <p className="text-sm font-mono tracking-widest text-neutral-400 uppercase">
                        {EXP04_CONTENT.screen10.convergenceLead}
                      </p>
                    </div>

                    <div
                      className={`transition-all duration-1000 ${
                        screenStage >= 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <p className="text-base sm:text-lg text-neutral-300 font-body">
                        {EXP04_CONTENT.screen10.convergenceWhat}
                      </p>
                    </div>

                    <div
                      className={`pt-2 transition-all duration-1000 ${
                        screenStage >= 10 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <p className="text-xl sm:text-2xl font-serif italic text-orange-400">
                        {EXP04_CONTENT.screen10.convergenceWhen}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {investigationFocusCode && (
              <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
                <PrimaryCTA
                  id="screen-10-cta"
                  onClick={() => advanceToScreen('screen_11_open_question')}
                  disabled={isProcessing}
                >
                  {EXP04_CONTENT.screen10.ctaLabel}
                </PrimaryCTA>
              </CTAReveal>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 11 — LA PREGUNTA ABIERTA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_11_open_question' && (
          <div
            id="screen-11-open-question"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen11.eyebrow}
                </span>
              </div>

              <div className="space-y-3">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base sm:text-lg text-neutral-400 font-serif italic">
                    {EXP04_CONTENT.screen11.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base sm:text-lg text-neutral-300 font-serif italic">
                    {EXP04_CONTENT.screen11.beat2}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-sm font-mono tracking-widest text-neutral-400 uppercase pt-2">
                    {EXP04_CONTENT.screen11.beat3}
                  </p>
                </div>
              </div>

              {/* Revelation Highlight */}
              <div
                className={`pt-6 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white border-l-2 border-orange-500 pl-4 py-2 leading-relaxed">
                  {EXP04_CONTENT.screen11.dominantQuestion}
                </h2>
              </div>

              <div
                className={`pt-4 transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base font-serif italic text-neutral-400">
                  {EXP04_CONTENT.screen11.closure}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-11-cta"
                onClick={() => advanceToScreen('screen_12_transition')}
                disabled={isProcessing}
              >
                {EXP04_CONTENT.screen11.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 12 — TRANSICIÓN A EXP_05 */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_12_transition' && (
          <div
            id="screen-12-transition"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP04_CONTENT.screen12.eyebrow}
                </span>
              </div>

              <div className="space-y-3">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base sm:text-lg text-neutral-400 font-serif italic">
                    {EXP04_CONTENT.screen12.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-lg sm:text-xl text-neutral-200 font-serif italic">
                    {EXP04_CONTENT.screen12.beat2}
                  </p>
                </div>
              </div>

              <div
                className={`pt-6 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400 border-l-2 border-orange-500 pl-4 py-2">
                  {EXP04_CONTENT.screen12.dominantPiece}
                </h2>
              </div>

              <div
                className={`space-y-2 pt-4 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP04_CONTENT.screen12.beat3}
                </p>

                {screenStage >= 5 && (
                  <p className="text-lg font-serif italic text-white animate-fade-in">
                    {EXP04_CONTENT.screen12.beat4}
                  </p>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-12-cta-buscar"
                onClick={handleCompleteExp04}
                disabled={isProcessing || isCompletedGuard}
              >
                {EXP04_CONTENT.screen12.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}
      </main>

      {/* Footer System Indicator */}
      <footer id="exp04-footer" className="w-full max-w-xl text-center py-4 border-t border-[#101010]">
        <p className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
          EVIDENCIA DE CASO • CONTEXTO™
        </p>
      </footer>
    </div>
  );
};
