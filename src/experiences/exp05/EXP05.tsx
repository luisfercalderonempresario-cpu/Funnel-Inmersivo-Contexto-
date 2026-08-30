// EXP_05 — LA PIEZA FALTANTE (Narrative Experience V1.0 Integration)
import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { ExperienceId } from '../../engine/state/types';
import { EXP05_CONTENT } from './exp05Content';
import { EXP05_DEFINITION } from './exp05Definition';
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
import { Volume2, VolumeX, Moon, Sparkles, Sun, Compass } from 'lucide-react';
import { useNarrativePacing, CTAReveal, NarrativeBeat } from '../../engine/pacing';

export const EXP05: React.FC<ExperienceComponentProps> = ({
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
        experience: 'exp05',
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
      const exp05Responses = (prev.responses.exp05 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp05: {
            ...exp05Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp05',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_05
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp05');
    if (existing && existing.currentScreen && EXP05_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp05',
      currentScreen: 'screen_01_clue',
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

  // Narrative Beats Map for EXP_05
  const currentBeats: NarrativeBeat[] = useMemo(() => {
    switch (currentScreenId) {
      case 'screen_01_clue':
        return [
          { id: 'caseId', stage: 1, pacing: 'SHORT', label: 'Caso ID Eyebrow' },
          { id: 'beat1', stage: 2, pacing: 'LONG', label: 'Encontramos una pista' },
          { id: 'beat2', stage: 3, pacing: 'MEDIUM', label: 'No explica todo' },
          { id: 'beat3', stage: 4, pacing: 'REVELATION', label: 'Pero explica algo' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Ver la Pista', isCTA: true },
        ];
      case 'screen_02_different_variable':
        return [
          { id: 'lead1', stage: 1, pacing: 'MEDIUM', label: 'En una investigación' },
          { id: 'lead2', stage: 2, pacing: 'MEDIUM', label: 'Cuando un patrón se repite' },
          { id: 'lead3', stage: 3, pacing: 'LONG', label: 'Buscas qué variable cambia' },
          { id: 'recap', stage: 4, pacing: 'LONG', label: 'Qué ocurre / Cuándo ocurre' },
          { id: 'questionIntro', stage: 5, pacing: 'MEDIUM', label: 'Ahora falta una pregunta' },
          { id: 'dominantQuestion', stage: 6, pacing: 'REVELATION', label: '¿Qué más está cambiando?' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_03_body_changes':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Hay algo que normalmente no ves' },
          { id: 'beat2', stage: 2, pacing: 'LONG', label: 'El cuerpo también atraviesa cambios' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'No de un día para otro' },
          { id: 'beat4', stage: 4, pacing: 'MEDIUM', label: 'Sino a lo largo del tiempo' },
          { id: 'beat5', stage: 5, pacing: 'REVELATION', label: 'En ciclos' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_04_cycle':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'El ciclo menstrual' },
          { id: 'beat2', stage: 2, pacing: 'LONG', label: 'No es solo el momento de la regla' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'Es un proceso en el tiempo' },
          { id: 'beat4', stage: 4, pacing: 'MEDIUM', label: 'Atraviesa diferentes etapas' },
          { id: 'cycleVisual', stage: 5, pacing: 'LONG', label: 'Diagrama Editorial de Ciclo' },
          { id: 'beat5', stage: 6, pacing: 'REVELATION', label: 'Características biológicas distintas' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Observar las Etapas', isCTA: true },
        ];
      case 'screen_05_four_moments':
        return [
          { id: 'phase1', stage: 1, pacing: 'MEDIUM', label: 'Etapa 01 Menstruación' },
          { id: 'phase2', stage: 2, pacing: 'MEDIUM', label: 'Etapa 02 Fase Folicular' },
          { id: 'phase3', stage: 3, pacing: 'MEDIUM', label: 'Etapa 03 Ovulación' },
          { id: 'phase4', stage: 4, pacing: 'MEDIUM', label: 'Etapa 04 Fase Lútea' },
          { id: 'closure1', stage: 5, pacing: 'MEDIUM', label: 'Cuatro momentos' },
          { id: 'closure2', stage: 6, pacing: 'MEDIUM', label: 'Un mismo ciclo' },
          { id: 'closure3', stage: 7, pacing: 'REVELATION', label: 'Un cuerpo que atraviesa cambios' },
          { id: 'cta', stage: 8, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_06_first_connection':
        return [
          { id: 'lead1', stage: 1, pacing: 'MEDIUM', label: 'Entonces...' },
          { id: 'lead2', stage: 2, pacing: 'LONG', label: '¿Podría el ciclo ser información?' },
          { id: 'question', stage: 3, pacing: 'MEDIUM', label: 'Pregunta Contexto' },
          { id: 'options', stage: 4, pacing: 'MANUAL', label: 'Opciones Pregunta 1', isOptions: true },
          { id: 'feedback', stage: 5, pacing: 'MEDIUM', label: 'Feedback Adaptativo' },
          { id: 'convergenceLead', stage: 6, pacing: 'REVELATION', label: 'Algo que sí podemos comprobar' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Volver al Caso', isCTA: true },
        ];
      case 'screen_07_comparison':
        return [
          { id: 'moment1', stage: 1, pacing: 'LONG', label: 'Momento 01 Registro' },
          { id: 'moment2', stage: 2, pacing: 'LONG', label: 'Momento 02 Registro' },
          { id: 'moment3', stage: 3, pacing: 'LONG', label: 'Momento 03 Registro' },
          { id: 'reflection1', stage: 4, pacing: 'MEDIUM', label: '¿Y si no fueran aisladas?' },
          { id: 'reflection2', stage: 5, pacing: 'REVELATION', label: '¿Y si fueran un patrón?' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_08_limits':
        return [
          { id: 'warningLead', stage: 1, pacing: 'MEDIUM', label: 'Pero cuidado' },
          { id: 'point1', stage: 2, pacing: 'LONG', label: 'No dicta cómo se comportará' },
          { id: 'point2', stage: 3, pacing: 'LONG', label: 'No permite saber exacto cómo sentirá' },
          { id: 'point3', stage: 4, pacing: 'LONG', label: 'No todo es hormonal' },
          { id: 'transitionLead', stage: 5, pacing: 'MEDIUM', label: 'Significa algo más sencillo' },
          { id: 'dominantReveal', stage: 6, pacing: 'REVELATION', label: 'Una pieza más de información' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_09_hidden_variable':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Antes...' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Veías solo el comportamiento' },
          { id: 'beat3', stage: 3, pacing: 'LONG', label: 'Ahora puedes considerar...' },
          { id: 'dominantReveal', stage: 4, pacing: 'REVELATION', label: 'EL MOMENTO DEL CICLO' },
          { id: 'closure', stage: 5, pacing: 'LONG', label: 'Variable que no estaba en tu mapa' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Ver el Calendario', isCTA: true },
        ];
      case 'screen_10_calendar':
        return [
          { id: 'calendarVisual', stage: 1, pacing: 'LONG', label: 'Línea de Tiempo Editorial' },
          { id: 'timelineLeads', stage: 2, pacing: 'LONG', label: 'Registrarse, observarse, contextualizarse' },
          { id: 'question', stage: 3, pacing: 'MEDIUM', label: 'Pregunta Preferencia' },
          { id: 'options', stage: 4, pacing: 'MANUAL', label: 'Opciones Pregunta 2', isOptions: true },
          { id: 'feedback', stage: 5, pacing: 'MEDIUM', label: 'Feedback Preferencia' },
          { id: 'micro1', stage: 6, pacing: 'MEDIUM', label: 'Porque quizá...' },
          { id: 'micro2', stage: 7, pacing: 'LONG', label: 'No en reaccionar mejor después' },
          { id: 'microDominant', stage: 8, pacing: 'REVELATION', label: 'Comprender mejor antes' },
          { id: 'cta', stage: 9, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_11_new_question':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Nueva posibilidad' },
          { id: 'beat2_3', stage: 2, pacing: 'MEDIUM', label: 'Conocer ciclo -> Conocer momento' },
          { id: 'beat4_5', stage: 3, pacing: 'LONG', label: 'Conocer momento -> Añadir contexto' },
          { id: 'pauseLead', stage: 4, pacing: 'LONG', label: 'Pero queda una pregunta' },
          { id: 'dominantQuestion', stage: 5, pacing: 'REVELATION', label: '¿Cómo utilizar esa información?' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_12_missing_piece':
        return [
          { id: 'beat1_4', stage: 1, pacing: 'LONG', label: 'Eso era lo que faltaba' },
          { id: 'dominantReveal', stage: 2, pacing: 'REVELATION', label: 'Una forma de tener contexto' },
          { id: 'beat5_7', stage: 3, pacing: 'LONG', label: 'Antes de reaccionar / asumir / preguntar' },
          { id: 'beat8', stage: 4, pacing: 'LONG', label: 'Podrías saber algo más' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_13_transition_contexto':
        return [
          { id: 'beat1', stage: 1, pacing: 'LONG', label: 'Encontramos la pieza' },
          { id: 'beat2_3', stage: 2, pacing: 'LONG', label: 'Convertir esa información en algo útil' },
          { id: 'dominantReveal', stage: 3, pacing: 'REVELATION', label: 'Eso es lo siguiente' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Descubrir Cómo Funciona', isCTA: true },
        ];
      default:
        return [];
    }
  }, [currentScreenId]);

  // Hook into Narrative Pacing System
  const { stage: screenStage, isCTARevealed, isOptionsRevealed, advanceStage } = useNarrativePacing({
    experienceId: 'exp05',
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
        currentExperience: 'exp05',
        currentScreen: currentScreenId,
      },
    }));

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { screenId: currentScreenId },
    });

    if (
      currentScreenId === 'screen_06_first_connection' ||
      currentScreenId === 'screen_10_calendar'
    ) {
      eventTracker.trackEvent('QUESTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp05',
        payload: { screenId: currentScreenId },
      });
    }
  }, [currentScreenId, state.session.sessionId, state.session.caseId, updateState]);

  // Initial event tracker on mount
  useEffect(() => {
    eventTracker.trackEvent('EXP05_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
    });
    memoryManagerRef.current.setMemory('exp05.started', true, 'global');
  }, [state.session.sessionId, state.session.caseId]);

  // Read saved responses from funnel state for adaptive display
  const savedResponses = (state.responses.exp05 || {}) as Record<string, unknown>;
  const cycleHypothesisCode = (savedResponses['exp05.cycleContextHypothesisCode'] ||
    savedResponses['cycleContextHypothesisCode']) as 'A' | 'B' | 'C' | 'D' | undefined;
  const infoPrefCode = (savedResponses['exp05.informationPreferenceCode'] ||
    savedResponses['informationPreferenceCode']) as 'A' | 'B' | 'C' | 'D' | undefined;

  // Selected feedback calculations
  const cycleHypothesisFeedback = useMemo(() => {
    const opt = EXP05_CONTENT.screen06.options.find((o) => o.code === cycleHypothesisCode);
    return opt?.feedback || EXP05_CONTENT.screen06.options[0].feedback;
  }, [cycleHypothesisCode]);

  const infoPrefFeedback = useMemo(() => {
    const opt = EXP05_CONTENT.screen10.options.find((o) => o.code === infoPrefCode);
    return opt?.feedback || EXP05_CONTENT.screen10.options[3].feedback;
  }, [infoPrefCode]);

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

  // Handler for Question 1 (Screen 06: Hipótesis de Contexto del Ciclo)
  const handleSelectCycleHypothesis = (code: 'A' | 'B' | 'C' | 'D', label: string) => {
    if (cycleHypothesisCode || isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { questionId: 'exp05_q1_cycle_hypothesis', choiceCode: code, choiceLabel: label },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp05.cycleContextHypothesis', value: label, scope: 'global' },
      { key: 'exp05.cycleContextHypothesisCode', value: code, scope: 'global' },
      { key: 'exp05.question01Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { questionId: 'exp05_q1_cycle_hypothesis', answer: label, code },
    });

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { key: 'exp05.cycleContextHypothesis', value: label },
    });

    advanceStage();
    setIsProcessing(false);
  };

  // Handler for Question 2 (Screen 10: Preferencia de Información)
  const handleSelectInformationPreference = (code: 'A' | 'B' | 'C' | 'D', label: string) => {
    if (infoPrefCode || isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { questionId: 'exp05_q2_info_preference', choiceCode: code, choiceLabel: label },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp05.informationPreference', value: label, scope: 'global' },
      { key: 'exp05.informationPreferenceCode', value: code, scope: 'global' },
      { key: 'exp05.question02Answered', value: true, scope: 'global' },
      { key: 'exp05.contextNeedRecognized', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { questionId: 'exp05_q2_info_preference', answer: label, code },
    });

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { key: 'exp05.informationPreference', value: label },
    });

    advanceStage();
    setIsProcessing(false);
  };

  // Record scientific / narrative insights on screen progression
  useEffect(() => {
    if (currentScreenId === 'screen_08_limits' && screenStage >= 6) {
      memoryManagerRef.current.setMemory('exp05.cycleRecognizedAsContext', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp05',
        payload: { insight: 'cycle_recognized_as_context', screen: 'screen_08_limits' },
      });
    }
    if (currentScreenId === 'screen_12_missing_piece' && screenStage >= 2) {
      memoryManagerRef.current.setMemory('exp05.contextNeedRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp05',
        payload: { insight: 'context_need_recognized', screen: 'screen_12_missing_piece' },
      });
    }
  }, [currentScreenId, screenStage, state.session.sessionId, state.session.caseId]);

  // Complete EXP_05 and transition to EXP_06
  const handleCompleteExp05 = () => {
    if (isCompletedGuard || completingRef.current) return;
    completingRef.current = true;
    setIsCompletedGuard(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { action: 'complete_exp05', label: EXP05_CONTENT.screen13.ctaLabel },
    });

    const now = new Date().toISOString();
    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      cycleRecognizedAsContext: true,
      contextNeedRecognized: true,
      completed: true,
      completedAt: now,
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp05.cycleRecognizedAsContext', value: true, scope: 'global' },
      { key: 'exp05.contextNeedRecognized', value: true, scope: 'global' },
      { key: 'exp05.completed', value: true, scope: 'global' },
      { key: 'exp05.completedAt', value: now, scope: 'global' },
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

    eventTracker.trackEvent('EXP05_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { memory: finalMemory },
    });

    eventTracker.trackEvent('EXPERIENCE_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { experienceId: 'exp05' },
    });

    // Update FunnelState completed experiences
    updateState((prev) => {
      const alreadyCompleted = prev.progress.completedExperiences.includes('exp05');
      const updatedList: ExperienceId[] = alreadyCompleted
        ? prev.progress.completedExperiences
        : [...prev.progress.completedExperiences, 'exp05'];

      return {
        ...prev,
        progress: {
          ...prev.progress,
          completedExperiences: updatedList,
          completionPercentage: Math.max(prev.progress.completionPercentage, 62),
        },
      };
    });

    // Invoke parent completion handler to navigate to EXP_06
    onComplete(finalMemory);
  };

  return (
    <div
      id="exp05-root-container"
      className="relative min-h-[90vh] flex flex-col justify-between items-center bg-[#050505] text-neutral-100 px-4 sm:px-6 py-6 sm:py-10 selection:bg-orange-500/20 selection:text-orange-200"
    >
      {/* Top Bar with Minimal Case Reference & Audio Control */}
      <header
        id="exp05-header"
        className="w-full max-w-xl flex items-center justify-between py-2 mb-4 border-b border-[#141414]"
      >
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            CASO #{caseId}
          </span>
          <span className="text-[10px] text-neutral-700 font-mono">/</span>
          <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
            EXP_05
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            id="exp05-audio-toggle"
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
      <main id="exp05-main-stage" className="w-full max-w-xl flex-1 flex flex-col justify-center my-auto">
        {/* ========================================================================= */}
        {/* SCREEN 01 — LA PISTA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_01_clue' && (
          <div
            id="screen-01-clue"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen01.eyebrow}
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
                  {EXP05_CONTENT.screen01.beat1}
                </h1>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-400 font-serif italic">
                  {EXP05_CONTENT.screen01.beat2}
                </p>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-orange-400 leading-snug">
                    {EXP05_CONTENT.screen01.beat3}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-01-cta-ver-pista"
                onClick={() => advanceToScreen('screen_02_different_variable')}
                disabled={isProcessing}
              >
                {EXP05_CONTENT.screen01.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 02 — UNA VARIABLE DIFERENTE */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_02_different_variable' && (
          <div
            id="screen-02-different-variable"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen02.eyebrow}
                </span>
              </div>

              {/* Research Methodology */}
              <div className="space-y-2">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-400 font-body">
                    {EXP05_CONTENT.screen02.lead1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-lg sm:text-xl font-serif italic text-neutral-200">
                    {EXP05_CONTENT.screen02.lead2}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-300 font-body">
                    {EXP05_CONTENT.screen02.lead3}
                  </p>
                </div>
              </div>

              {/* Recap of EXP_04 Findings */}
              <div
                className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-2 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP05_CONTENT.screen02.recapIntro}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0 text-sm text-neutral-300">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                    <span>{EXP05_CONTENT.screen02.recapWhat}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                    <span>{EXP05_CONTENT.screen02.recapWhen}</span>
                  </div>
                </div>
              </div>

              {/* Missing Question Setup */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono tracking-wider text-neutral-400 uppercase">
                  {EXP05_CONTENT.screen02.questionIntro}
                </p>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400 leading-snug">
                    {EXP05_CONTENT.screen02.dominantQuestion}
                  </h3>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-02-cta"
                onClick={() => advanceToScreen('screen_03_body_changes')}
                disabled={isProcessing}
              >
                {EXP05_CONTENT.screen02.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 03 — EL CUERPO TAMBIÉN CAMBIA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_03_body_changes' && (
          <div
            id="screen-03-body-changes"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen03.eyebrow}
                </span>
              </div>

              <div className="space-y-4">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-400 font-body">
                    {EXP05_CONTENT.screen03.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-2xl sm:text-3xl font-serif italic text-white leading-relaxed">
                    {EXP05_CONTENT.screen03.beat2}
                  </p>
                </div>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP05_CONTENT.screen03.beat3}
                </p>

                {screenStage >= 4 && (
                  <p className="text-lg sm:text-xl font-serif italic text-neutral-300 animate-fade-in">
                    {EXP05_CONTENT.screen03.beat4}
                  </p>
                )}

                {screenStage >= 5 && (
                  <div className="pt-2 animate-fade-in">
                    <p className="text-2xl sm:text-3xl font-serif italic text-orange-400">
                      {EXP05_CONTENT.screen03.beat5}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-03-cta"
                onClick={() => advanceToScreen('screen_04_cycle')}
                disabled={isProcessing}
              >
                {EXP05_CONTENT.screen03.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 04 — EL CICLO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_04_cycle' && (
          <div
            id="screen-04-cycle"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen04.eyebrow}
                </span>
              </div>

              <div className="space-y-2">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-2xl sm:text-3xl font-serif italic text-white">
                    {EXP05_CONTENT.screen04.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-400 font-serif italic">
                    {EXP05_CONTENT.screen04.beat2}
                  </p>
                </div>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-300 font-body">
                  {EXP05_CONTENT.screen04.beat3}
                </p>

                {screenStage >= 4 && (
                  <p className="text-base text-neutral-300 font-body animate-fade-in">
                    {EXP05_CONTENT.screen04.beat4}
                  </p>
                )}
              </div>

              {/* Minimalist Editorial Cycle Diagram */}
              {screenStage >= 5 && (
                <div className="py-6 px-4 rounded-xl bg-[#080808] border border-[#1C1C1C] flex flex-col items-center justify-center space-y-4 animate-fade-in">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* Subtle outer continuous orbital ring */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-neutral-700/80 animate-[spin_60s_linear_infinite]" />
                    {/* Inner glowing core */}
                    <div className="w-24 h-24 rounded-full border border-[#282828] bg-[#0A0A0A] flex flex-col items-center justify-center text-center p-2">
                      <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                        SISTEMA
                      </span>
                      <span className="text-xs font-serif italic text-orange-400 font-semibold mt-0.5">
                        {EXP05_CONTENT.screen04.conceptLabel}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500 tracking-wider">
                    {EXP05_CONTENT.screen04.conceptSub}
                  </span>
                </div>
              )}

              <div
                className={`pt-2 transition-all duration-1000 ${
                  screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg font-serif italic text-neutral-300">
                  {EXP05_CONTENT.screen04.beat5}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-04-cta"
                onClick={() => advanceToScreen('screen_05_four_moments')}
                disabled={isProcessing}
              >
                {EXP05_CONTENT.screen04.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 05 — CUATRO MOMENTOS */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_05_four_moments' && (
          <div
            id="screen-05-four-moments"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen05.eyebrow}
                </span>
              </div>

              {/* Four Phases Editorial Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXP05_CONTENT.screen05.phases.map((phase, idx) => {
                  const stageThreshold = idx + 1;
                  const isVisible = screenStage >= stageThreshold;
                  return (
                    <div
                      key={phase.id}
                      className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-2 transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-[#161616] pb-1.5">
                        <span className="text-[10px] font-mono tracking-widest text-neutral-500">
                          FASE {phase.stageCode}
                        </span>
                        {idx === 0 && <Moon className="w-3.5 h-3.5 text-neutral-500" />}
                        {idx === 1 && <Sparkles className="w-3.5 h-3.5 text-neutral-500" />}
                        {idx === 2 && <Sun className="w-3.5 h-3.5 text-orange-400" />}
                        {idx === 3 && <Compass className="w-3.5 h-3.5 text-neutral-500" />}
                      </div>
                      <p className="text-base font-serif italic text-white font-medium">
                        {phase.name}
                      </p>
                      <p className="text-xs text-neutral-400 font-body">
                        {phase.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Editorial Closures */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-300 font-body">
                  {EXP05_CONTENT.screen05.closure1}
                </p>

                {screenStage >= 6 && (
                  <p className="text-base text-neutral-300 font-body animate-fade-in">
                    {EXP05_CONTENT.screen05.closure2}
                  </p>
                )}

                {screenStage >= 7 && (
                  <p className="text-xl sm:text-2xl font-serif italic text-white animate-fade-in pt-1">
                    {EXP05_CONTENT.screen05.closure3}
                  </p>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-05-cta"
                onClick={() => advanceToScreen('screen_06_first_connection')}
                disabled={isProcessing}
              >
                {EXP05_CONTENT.screen05.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 06 — LA PRIMERA CONEXIÓN (PREGUNTA 1) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_06_first_connection' && (
          <div
            id="screen-06-first-connection"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen06.eyebrow}
                </span>
              </div>

              {/* Lead-in */}
              <div className="space-y-2">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-sm font-mono tracking-wider text-neutral-400 uppercase">
                    {EXP05_CONTENT.screen06.lead1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-2xl sm:text-3xl font-serif italic text-white leading-relaxed">
                    {EXP05_CONTENT.screen06.lead2}
                  </p>
                </div>
              </div>

              {/* Question setup */}
              <div
                className={`pt-2 space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm text-neutral-400 font-body">
                  {EXP05_CONTENT.screen06.questionIntro}
                </p>
                <p className="text-lg font-serif italic text-neutral-200">
                  {EXP05_CONTENT.screen06.question}
                </p>
              </div>

              {/* Options */}
              {isOptionsRevealed && !cycleHypothesisCode && (
                <div className="space-y-3 pt-2 animate-fade-in">
                  {EXP05_CONTENT.screen06.options.map((opt) => (
                    <ChoiceButton
                      key={opt.id}
                      id={`choice-${opt.id}`}
                      code={opt.code}
                      selected={selectedOption === opt.code}
                      isAnySelected={selectedOption !== null}
                      onClick={() => handleSelectCycleHypothesis(opt.code, opt.label)}
                      disabled={isProcessing || selectedOption !== null}
                    >
                      <span className="font-body text-base sm:text-lg">{opt.label}</span>
                    </ChoiceButton>
                  ))}
                </div>
              )}

              {/* Adaptive Feedback & Convergence */}
              {cycleHypothesisCode && (
                <div className="space-y-4 pt-4 border-t border-[#181818] animate-fade-in">
                  <div
                    className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 transition-all duration-1000 ${
                      screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider mb-1">
                      TU REFLEXIÓN
                    </p>
                    <p className="text-base font-serif italic text-white">
                      “{savedResponses['exp05.cycleContextHypothesis'] as string}”
                    </p>
                    <p className="text-sm text-neutral-300 font-body mt-2">
                      {cycleHypothesisFeedback}
                    </p>
                  </div>

                  <div
                    className={`pt-2 transition-all duration-1000 ${
                      screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-xl sm:text-2xl font-serif italic text-orange-400">
                      {EXP05_CONTENT.screen06.convergenceLead}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {cycleHypothesisCode && (
              <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
                <PrimaryCTA
                  id="screen-06-cta"
                  onClick={() => advanceToScreen('screen_07_comparison')}
                  disabled={isProcessing}
                >
                  {EXP05_CONTENT.screen06.ctaLabel}
                </PrimaryCTA>
              </CTAReveal>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 07 — COMPARACIÓN */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_07_comparison' && (
          <div
            id="screen-07-comparison"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen07.eyebrow}
                </span>
              </div>

              {/* Three Moments Stack */}
              <div className="space-y-3">
                {EXP05_CONTENT.screen07.moments.map((mom, idx) => {
                  const stageThreshold = idx + 1;
                  const isVisible = screenStage >= stageThreshold;
                  return (
                    <div
                      key={mom.number}
                      className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-2 transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-[#161616] pb-1">
                        <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                          {mom.title}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-600">CASO #{caseId}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-300 font-body">
                        {mom.traits.map((t, i) => (
                          <span key={i} className="flex items-center space-x-1.5">
                            <span className="w-1 h-1 rounded-full bg-neutral-500" />
                            <span>{t}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Critical Reflections */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-400 font-serif italic">
                  {EXP05_CONTENT.screen07.reflection1}
                </p>

                {screenStage >= 5 && (
                  <p className="text-xl sm:text-2xl font-serif italic text-white animate-fade-in">
                    {EXP05_CONTENT.screen07.reflection2}
                  </p>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-07-cta"
                onClick={() => advanceToScreen('screen_08_limits')}
                disabled={isProcessing}
              >
                {EXP05_CONTENT.screen07.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 08 — LO QUE ESTO NO SIGNIFICA (MARCO CIENTÍFICO) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_08_limits' && (
          <div
            id="screen-08-limits"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen08.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono tracking-widest text-neutral-400 uppercase">
                  {EXP05_CONTENT.screen08.warningLead}
                </p>
              </div>

              {/* Scientific Non-Determinism Principles */}
              <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-3">
                <div
                  className={`flex items-start space-x-3 text-sm sm:text-base text-neutral-300 font-body transition-all duration-700 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 mt-2 flex-shrink-0" />
                  <span>{EXP05_CONTENT.screen08.point1}</span>
                </div>

                <div
                  className={`flex items-start space-x-3 text-sm sm:text-base text-neutral-300 font-body transition-all duration-700 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 mt-2 flex-shrink-0" />
                  <span>{EXP05_CONTENT.screen08.point2}</span>
                </div>

                <div
                  className={`flex items-start space-x-3 text-sm sm:text-base text-neutral-300 font-body transition-all duration-700 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 mt-2 flex-shrink-0" />
                  <span>{EXP05_CONTENT.screen08.point3}</span>
                </div>
              </div>

              {/* Reality framing */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP05_CONTENT.screen08.transitionLead}
                </p>

                {screenStage >= 6 && (
                  <p className="text-2xl sm:text-3xl font-serif italic text-white animate-fade-in">
                    {EXP05_CONTENT.screen08.dominantReveal}
                  </p>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-08-cta"
                onClick={() => advanceToScreen('screen_09_hidden_variable')}
                disabled={isProcessing}
              >
                {EXP05_CONTENT.screen08.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 09 — LA VARIABLE OCULTA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_09_hidden_variable' && (
          <div
            id="screen-09-hidden-variable"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen09.eyebrow}
                </span>
              </div>

              <div className="space-y-2">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-sm font-mono tracking-wider text-neutral-500 uppercase">
                    {EXP05_CONTENT.screen09.beat1}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-lg text-neutral-400 font-body">
                    {EXP05_CONTENT.screen09.beat2}
                  </p>
                </div>
              </div>

              {/* Dominant Variable Reveal */}
              <div
                className={`pt-6 border-t border-[#181818] space-y-4 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP05_CONTENT.screen09.beat3}
                </p>

                {screenStage >= 4 && (
                  <div className="p-6 rounded-xl bg-[#080808] border border-orange-500/30 border-l-4 border-l-orange-500 animate-fade-in">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400">
                      {EXP05_CONTENT.screen09.dominantReveal}
                    </h2>
                  </div>
                )}

                {screenStage >= 5 && (
                  <p className="text-base sm:text-lg font-serif italic text-neutral-300 animate-fade-in pt-2">
                    {EXP05_CONTENT.screen09.closure}
                  </p>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-09-cta"
                onClick={() => advanceToScreen('screen_10_calendar')}
                disabled={isProcessing}
              >
                {EXP05_CONTENT.screen09.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 10 — EL CALENDARIO (PREGUNTA 2) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_10_calendar' && (
          <div
            id="screen-10-calendar"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen10.eyebrow}
                </span>
              </div>

              {/* Minimalist Editorial Horizontal Timeline */}
              {screenStage >= 1 && (
                <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-[#161616] pb-2">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                      LÍNEA TEMPORAL ILUSTRATIVA
                    </span>
                    <span className="text-[10px] font-mono text-neutral-600">VARIABILIDAD INDIVIDUAL</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {EXP05_CONTENT.screen10.timelineDays.map((td) => (
                      <div
                        key={td.dayNumber}
                        className="flex flex-col items-center p-2 rounded-lg bg-[#0C0C0C] border border-[#181818]"
                      >
                        <span className="text-xs font-mono text-white font-medium">{td.label}</span>
                        <span className="text-[10px] text-neutral-400 font-serif italic mt-0.5 text-center">
                          {td.phaseHint}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline context leads */}
              <div
                className={`space-y-1 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm text-neutral-400 font-body">
                  {EXP05_CONTENT.screen10.timelineLead1}
                </p>
                <p className="text-sm text-neutral-300 font-serif italic">
                  {EXP05_CONTENT.screen10.timelineLead2} {EXP05_CONTENT.screen10.timelineLead3}
                </p>
              </div>

              {/* Question */}
              <div
                className={`pt-2 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm text-neutral-400 font-body">
                  {EXP05_CONTENT.screen10.questionIntro}
                </p>
                <p className="text-lg sm:text-xl font-serif italic text-white">
                  {EXP05_CONTENT.screen10.question}
                </p>
              </div>

              {/* Options */}
              {isOptionsRevealed && !infoPrefCode && (
                <div className="space-y-3 pt-2 animate-fade-in">
                  {EXP05_CONTENT.screen10.options.map((opt) => (
                    <ChoiceButton
                      key={opt.id}
                      id={`choice-${opt.id}`}
                      code={opt.code}
                      selected={selectedOption === opt.code}
                      isAnySelected={selectedOption !== null}
                      onClick={() => handleSelectInformationPreference(opt.code, opt.label)}
                      disabled={isProcessing || selectedOption !== null}
                    >
                      <span className="font-body text-base sm:text-lg">{opt.label}</span>
                    </ChoiceButton>
                  ))}
                </div>
              )}

              {/* Micro-revelation after choice */}
              {infoPrefCode && (
                <div className="space-y-4 pt-4 border-t border-[#181818] animate-fade-in">
                  <div
                    className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 transition-all duration-1000 ${
                      screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider mb-1">
                      TU ELECCIÓN
                    </p>
                    <p className="text-base font-serif italic text-white">
                      “{savedResponses['exp05.informationPreference'] as string}”
                    </p>
                    <p className="text-sm text-neutral-300 font-body mt-2">
                      {infoPrefFeedback}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p
                      className={`text-sm font-mono tracking-wider text-neutral-400 uppercase transition-all duration-1000 ${
                        screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      {EXP05_CONTENT.screen10.microRevelation1}
                    </p>

                    <p
                      className={`text-base text-neutral-300 font-body transition-all duration-1000 ${
                        screenStage >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      {EXP05_CONTENT.screen10.microRevelation2}
                    </p>

                    {screenStage >= 8 && (
                      <p className="text-2xl sm:text-3xl font-serif italic text-orange-400 animate-fade-in pt-1">
                        {EXP05_CONTENT.screen10.microRevelationDominant}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {infoPrefCode && (
              <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
                <PrimaryCTA
                  id="screen-10-cta"
                  onClick={() => advanceToScreen('screen_11_new_question')}
                  disabled={isProcessing}
                >
                  {EXP05_CONTENT.screen10.ctaLabel}
                </PrimaryCTA>
              </CTAReveal>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 11 — LA NUEVA PREGUNTA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_11_new_question' && (
          <div
            id="screen-11-new-question"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen11.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-white">
                  {EXP05_CONTENT.screen11.beat1}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-2">
                <div
                  className={`text-sm sm:text-base text-neutral-300 font-body transition-all duration-700 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  {EXP05_CONTENT.screen11.beat2} <span className="text-neutral-400 font-serif italic">— {EXP05_CONTENT.screen11.beat3}</span>
                </div>

                <div
                  className={`text-sm sm:text-base text-neutral-300 font-body transition-all duration-700 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  {EXP05_CONTENT.screen11.beat4} <span className="text-orange-400 font-serif italic">— {EXP05_CONTENT.screen11.beat5}</span>
                </div>
              </div>

              <div
                className={`pt-6 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono tracking-widest text-neutral-500 uppercase">
                  {EXP05_CONTENT.screen11.pauseLead}
                </p>

                {screenStage >= 5 && (
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white animate-fade-in leading-snug">
                    {EXP05_CONTENT.screen11.dominantQuestion}
                  </h3>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-11-cta"
                onClick={() => advanceToScreen('screen_12_missing_piece')}
                disabled={isProcessing}
              >
                {EXP05_CONTENT.screen11.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 12 — LA PIEZA FALTANTE */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_12_missing_piece' && (
          <div
            id="screen-12-missing-piece"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen12.eyebrow}
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-neutral-300">
                  {EXP05_CONTENT.screen12.beat1}
                </p>
                <p className="text-base text-neutral-400 font-body">
                  {EXP05_CONTENT.screen12.beat2} {EXP05_CONTENT.screen12.beat3} {EXP05_CONTENT.screen12.beat4}
                </p>
              </div>

              {/* Dominant Revelation */}
              {screenStage >= 2 && (
                <div className="p-6 rounded-xl bg-[#080808] border border-orange-500/30 border-l-4 border-l-orange-500 animate-fade-in">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400">
                    {EXP05_CONTENT.screen12.dominantReveal}
                  </h2>
                </div>
              )}

              {/* Setup before actions */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="flex flex-col space-y-1 text-sm text-neutral-400 font-body">
                  <span>{EXP05_CONTENT.screen12.beat5}</span>
                  <span>{EXP05_CONTENT.screen12.beat6}</span>
                  <span>{EXP05_CONTENT.screen12.beat7}</span>
                </div>

                {screenStage >= 4 && (
                  <p className="text-xl sm:text-2xl font-serif italic text-white animate-fade-in pt-2">
                    {EXP05_CONTENT.screen12.beat8}
                  </p>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-12-cta"
                onClick={() => advanceToScreen('screen_13_transition_contexto')}
                disabled={isProcessing}
              >
                {EXP05_CONTENT.screen12.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 13 — TRANSICIÓN A CONTEXTO™ */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_13_transition_contexto' && (
          <div
            id="screen-13-transition-contexto"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP05_CONTENT.screen13.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white leading-relaxed">
                  {EXP05_CONTENT.screen13.beat1}
                </h1>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-300 font-serif italic">
                  {EXP05_CONTENT.screen13.beat2}
                </p>
                <p className="text-base text-neutral-400 font-body">
                  {EXP05_CONTENT.screen13.beat3}
                </p>

                {screenStage >= 3 && (
                  <div className="pt-4 animate-fade-in">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400">
                      {EXP05_CONTENT.screen13.dominantReveal}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-13-cta-descubrir"
                onClick={handleCompleteExp05}
                disabled={isProcessing || isCompletedGuard}
              >
                {EXP05_CONTENT.screen13.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}
      </main>

      {/* Subtle Footer with Status & Pacing Details */}
      <footer
        id="exp05-footer"
        className="w-full max-w-xl flex items-center justify-between pt-4 mt-auto border-t border-[#121212] text-[10px] font-mono text-neutral-600"
      >
        <span>INVESTIGACIÓN // EXP_05</span>
        <span className="uppercase">{currentScreenId.replace('screen_', '').replace(/_/g, ' ')}</span>
      </footer>
    </div>
  );
};
