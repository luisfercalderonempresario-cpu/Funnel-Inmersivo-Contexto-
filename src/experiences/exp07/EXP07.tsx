// EXP_07 — EL FUTURO (Narrative Experience V1.0 Integration)
import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { ExperienceId } from '../../engine/state/types';
import { EXP07_CONTENT } from './exp07Content';
import { EXP07_DEFINITION } from './exp07Definition';
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
import { Volume2, VolumeX, ArrowRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import { useNarrativePacing, CTAReveal, NarrativeBeat } from '../../engine/pacing';

export const EXP07: React.FC<ExperienceComponentProps> = ({
  caseId,
  onComplete,
}) => {
  const { state, updateState } = useFunnel();

  // Audio preference state
  const [isAudioActive, setIsAudioActive] = useState<boolean>(
    () => state.preferences.audioEnabled || false
  );

  const toggleAudio = () => {
    setIsAudioActive((prev) => {
      const next = !prev;
      eventTracker.trackEvent(next ? 'AUDIO_ENABLED' : 'AUDIO_DISABLED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
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
      const exp07Responses = (prev.responses.exp07 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp07: {
            ...exp07Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp07',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_07
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp07');
    if (existing && existing.currentScreen && EXP07_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp07',
      currentScreen: 'screen_01_threshold',
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

  // Narrative Beats Configuration for EXP_07
  const currentBeats: NarrativeBeat[] = useMemo(() => {
    switch (currentScreenId) {
      case 'screen_01_threshold':
        return [
          { id: 'caseId', stage: 1, pacing: 'SHORT', label: 'Caso ID Eyebrow' },
          { id: 'beat1', stage: 2, pacing: 'LONG', label: 'Ya sabes qué es Contexto™' },
          { id: 'beat2', stage: 3, pacing: 'MEDIUM', label: 'Ahora quiero que imagines algo' },
          { id: 'beat3', stage: 4, pacing: 'REVELATION', label: 'Situación que ya has vivido' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Imaginar', isCTA: true },
        ];
      case 'screen_02_random_night':
        return [
          { id: 'beat1_2', stage: 1, pacing: 'MEDIUM', label: 'Es una noche cualquiera / Llegas a casa' },
          { id: 'beat3_4', stage: 2, pacing: 'LONG', label: 'Hablas con ella / Notas algo diferente' },
          { id: 'beat5_6', stage: 3, pacing: 'REVELATION', label: 'Está más callada y no sabes por qué' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_03_same_moment':
        return [
          { id: 'beat1_2', stage: 1, pacing: 'LONG', label: 'El momento es el mismo / Pero ahora...' },
          { id: 'beat3', stage: 2, pacing: 'REVELATION', label: 'Tienes una pieza de contexto que antes no tenías' },
          { id: 'nuances', stage: 3, pacing: 'LONG', label: 'No es respuesta definitiva / Es información adicional' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_04_first_path_before':
        return [
          { id: 'title', stage: 1, pacing: 'SHORT', label: 'Título ANTES' },
          { id: 'flow', stage: 2, pacing: 'LONG', label: 'Secuencia Reactiva Antes' },
          { id: 'closure', stage: 3, pacing: 'REVELATION', label: 'Reaccionar antes de comprender' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_05_second_path_now':
        return [
          { id: 'title', stage: 1, pacing: 'SHORT', label: 'Título AHORA' },
          { id: 'flow', stage: 2, pacing: 'LONG', label: 'Secuencia Reflexiva Ahora' },
          { id: 'dialogue', stage: 3, pacing: 'REVELATION', label: 'Y después hablas con ella' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_06_the_shift':
        return [
          { id: 'question', stage: 1, pacing: 'LONG', label: '¿Ves la diferencia?' },
          { id: 'beat1_2', stage: 2, pacing: 'LONG', label: 'No cambió ella / No cambió la situación' },
          { id: 'lead', stage: 3, pacing: 'MEDIUM', label: 'Lo que cambió...' },
          { id: 'reveal', stage: 4, pacing: 'REVELATION', label: 'La información con la que tú entraste' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_07_new_way_of_seeing':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'No te dice qué pensar de ella' },
          { id: 'beat2', stage: 2, pacing: 'LONG', label: 'Te ayuda a considerar qué pasas por alto' },
          { id: 'shift', stage: 3, pacing: 'REVELATION', label: '¿Qué está mal? → ¿Qué necesito comprender?' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_08_three_moments':
        return [
          { id: 'lead', stage: 1, pacing: 'SHORT', label: 'Tres Situaciones Cotidianas' },
          { id: 'm1', stage: 2, pacing: 'LONG', label: 'Momento 01: Más sensible' },
          { id: 'm2', stage: 3, pacing: 'LONG', label: 'Momento 02: Quiere estar sola' },
          { id: 'm3', stage: 4, pacing: 'REVELATION', label: 'Momento 03: Más receptiva' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_09_what_changes':
        return [
          { id: 'beat1_2', stage: 1, pacing: 'LONG', label: 'Dejar de reaccionar con una sola explicación' },
          { id: 'lead', stage: 2, pacing: 'MEDIUM', label: 'Más posibilidades de responder con intención' },
          { id: 'triad', stage: 3, pacing: 'REVELATION', label: 'No desde el miedo / No suposición / Comprensión' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_10_what_does_not_change':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'Pero hay algo importante' },
          { id: 'truths', stage: 2, pacing: 'LONG', label: 'Seguirán existiendo días difíciles' },
          { id: 'closure', stage: 3, pacing: 'REVELATION', label: 'Llegar a esos momentos con una pieza más de información' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_11_the_desire_interaction':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'Imagina tener esa referencia todos los días' },
          { id: 'notFor', stage: 2, pacing: 'LONG', label: 'No para controlar / predecir / excusas' },
          { id: 'forLead', stage: 3, pacing: 'MEDIUM', label: 'Para comprender antes de reaccionar' },
          { id: 'question', stage: 4, pacing: 'SHORT', label: '¿Te serviría?' },
          { id: 'options', stage: 5, pacing: 'MANUAL', label: 'Opciones de Autoevaluación', isOptions: true },
          { id: 'feedback', stage: 6, pacing: 'REVELATION', label: 'Feedback Adaptativo' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_12_preparation_for_revelation':
        return [
          { id: 'lead1', stage: 1, pacing: 'LONG', label: 'Hay algo que todavía no has visto' },
          { id: 'lead2_3', stage: 2, pacing: 'LONG', label: 'Hasta ahora solo has imaginado' },
          { id: 'prelude', stage: 3, pacing: 'MEDIUM', label: 'Ahora vas a ver...' },
          { id: 'dominant', stage: 4, pacing: 'REVELATION', label: '...qué hay realmente detrás' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Ver la Revelación', isCTA: true },
        ];
      default:
        return [];
    }
  }, [currentScreenId]);

  // Hook into Narrative Pacing System
  const { stage: screenStage, isCTARevealed, isOptionsRevealed, advanceStage } = useNarrativePacing({
    experienceId: 'exp07',
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
        currentExperience: 'exp07',
        currentScreen: currentScreenId,
      },
    }));

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { screenId: currentScreenId },
    });

    if (currentScreenId === 'screen_11_the_desire_interaction') {
      eventTracker.trackEvent('QUESTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
        payload: { screenId: currentScreenId },
      });
    }
  }, [currentScreenId, state.session.sessionId, state.session.caseId, updateState]);

  // Initial event tracker on mount
  useEffect(() => {
    eventTracker.trackEvent('EXP07_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
    });
    memoryManagerRef.current.setMemory('exp07.started', true, 'global');
    memoryManagerRef.current.setMemory('exp07.futureScenarioEntered', true, 'global');
  }, [state.session.sessionId, state.session.caseId]);

  // Read saved responses
  const savedResponses = (state.responses.exp07 || {}) as Record<string, unknown>;
  const usefulnessReactionCode = (savedResponses['exp07.usefulnessReactionCode'] ||
    savedResponses['usefulnessReactionCode']) as 'A' | 'B' | 'C' | 'D' | undefined;

  const reactionFeedback = useMemo(() => {
    const opt = EXP07_CONTENT.screen11.options.find((o) => o.code === usefulnessReactionCode);
    return opt?.feedback || EXP07_CONTENT.screen11.options[0].feedback;
  }, [usefulnessReactionCode]);

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

  // Handler for Screen 11 Autoevaluation
  const handleSelectUsefulness = (code: 'A' | 'B' | 'C' | 'D', label: string) => {
    if (usefulnessReactionCode || isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { questionId: 'exp07_q_usefulness', choiceCode: code, choiceLabel: label },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp07.usefulnessReaction', value: label, scope: 'global' },
      { key: 'exp07.usefulnessReactionCode', value: code, scope: 'global' },
      { key: 'exp07.usefulnessQuestionAnswered', value: true, scope: 'global' },
      { key: 'exp07.futureValueRecognized', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { questionId: 'exp07_q_usefulness', answer: label, code },
    });

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { key: 'exp07.usefulnessReaction', value: label },
    });

    advanceStage();
    setIsProcessing(false);
  };

  // Register conceptual comprehension insights
  useEffect(() => {
    if (currentScreenId === 'screen_04_first_path_before') {
      memoryManagerRef.current.setMemory('exp07.beforeScenarioViewed', true, 'global');
    }
    if (currentScreenId === 'screen_05_second_path_now') {
      memoryManagerRef.current.setMemory('exp07.afterScenarioViewed', true, 'global');
    }
    if (currentScreenId === 'screen_06_the_shift' && screenStage >= 4) {
      memoryManagerRef.current.setMemory('exp07.contextDifferenceRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
        payload: { insight: 'context_difference_recognized', screen: 'screen_06_the_shift' },
      });
    }
    if (currentScreenId === 'screen_07_new_way_of_seeing' && screenStage >= 3) {
      memoryManagerRef.current.setMemory('exp07.questionShiftRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
        payload: { insight: 'question_shift_recognized', screen: 'screen_07_new_way_of_seeing' },
      });
    }
    if (currentScreenId === 'screen_11_the_desire_interaction' && screenStage >= 6) {
      memoryManagerRef.current.setMemory('exp07.futureValueRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
        payload: { insight: 'future_value_recognized', screen: 'screen_11_the_desire_interaction' },
      });
    }
  }, [currentScreenId, screenStage, state.session.sessionId, state.session.caseId]);

  // Complete EXP_07 and unlock EXP_08
  const handleCompleteExp07 = () => {
    if (isCompletedGuard || completingRef.current) return;
    completingRef.current = true;
    setIsCompletedGuard(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { action: 'complete_exp07', label: EXP07_CONTENT.screen12.ctaLabel },
    });

    const now = new Date().toISOString();
    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      futureScenarioEntered: true,
      beforeScenarioViewed: true,
      afterScenarioViewed: true,
      contextDifferenceRecognized: true,
      questionShiftRecognized: true,
      futureValueRecognized: true,
      completed: true,
      completedAt: now,
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp07.futureScenarioEntered', value: true, scope: 'global' },
      { key: 'exp07.beforeScenarioViewed', value: true, scope: 'global' },
      { key: 'exp07.afterScenarioViewed', value: true, scope: 'global' },
      { key: 'exp07.contextDifferenceRecognized', value: true, scope: 'global' },
      { key: 'exp07.questionShiftRecognized', value: true, scope: 'global' },
      { key: 'exp07.futureValueRecognized', value: true, scope: 'global' },
      { key: 'exp07.completed', value: true, scope: 'global' },
      { key: 'exp07.completedAt', value: now, scope: 'global' },
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

    eventTracker.trackEvent('EXP07_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { memory: finalMemory },
    });

    eventTracker.trackEvent('EXPERIENCE_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { experienceId: 'exp07' },
    });

    // Update FunnelState completed experiences
    updateState((prev) => {
      const alreadyCompleted = prev.progress.completedExperiences.includes('exp07');
      const updatedList: ExperienceId[] = alreadyCompleted
        ? prev.progress.completedExperiences
        : [...prev.progress.completedExperiences, 'exp07'];

      return {
        ...prev,
        progress: {
          ...prev.progress,
          completedExperiences: updatedList,
          completionPercentage: Math.max(prev.progress.completionPercentage, 87),
        },
      };
    });

    // Navigate to EXP_08
    onComplete(finalMemory);
  };

  return (
    <div
      id="exp07-root-container"
      className="relative min-h-[90vh] flex flex-col justify-between items-center bg-[#050505] text-neutral-100 px-4 sm:px-6 py-6 sm:py-10 selection:bg-orange-500/20 selection:text-orange-200"
    >
      {/* Top Bar with Minimal Case Reference & Audio Control */}
      <header
        id="exp07-header"
        className="w-full max-w-xl flex items-center justify-between py-2 mb-4 border-b border-[#141414]"
      >
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            CASO #{caseId}
          </span>
          <span className="text-[10px] text-neutral-700 font-mono">/</span>
          <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
            EXP_07
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            id="exp07-audio-toggle"
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
      <main id="exp07-main-stage" className="w-full max-w-xl flex-1 flex flex-col justify-center my-auto">
        {/* ========================================================================= */}
        {/* SCREEN 01 — EL UMBRAL */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_01_threshold' && (
          <div
            id="screen-01-threshold"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen01.eyebrow}
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
                <h1 className="text-2xl sm:text-3xl font-serif italic text-white leading-relaxed">
                  {EXP07_CONTENT.screen01.beat1}
                </h1>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-400 font-body">
                  {EXP07_CONTENT.screen01.beat2}
                </p>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xl sm:text-2xl font-serif italic text-orange-400 leading-snug">
                    {EXP07_CONTENT.screen01.beat3}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-01-cta"
                onClick={() => advanceToScreen('screen_02_random_night')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen01.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 02 — UNA NOCHE CUALQUIERA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_02_random_night' && (
          <div
            id="screen-02-random-night"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen02.eyebrow}
                </span>
              </div>

              <div
                className={`p-4 rounded-xl bg-[#080808] border border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen02.beat1}
                </p>
                <p className="text-lg font-serif italic text-neutral-200">
                  {EXP07_CONTENT.screen02.beat2}
                </p>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-300 font-body">
                  {EXP07_CONTENT.screen02.beat3}
                </p>
                <p className="text-xl sm:text-2xl font-serif italic text-white leading-snug">
                  {EXP07_CONTENT.screen02.beat4}
                </p>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-1 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-2xl sm:text-3xl font-serif italic text-orange-400">
                  {EXP07_CONTENT.screen02.beat5}
                </p>
                <p className="text-sm text-neutral-500 font-mono italic">
                  {EXP07_CONTENT.screen02.beat6}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-02-cta"
                onClick={() => advanceToScreen('screen_03_same_moment')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen02.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 03 — EL MISMO MOMENTO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_03_same_moment' && (
          <div
            id="screen-03-same-moment"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen03.eyebrow}
                </span>
              </div>

              <div
                className={`space-y-1 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen03.beat1}
                </p>
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen03.beat2}
                </p>
              </div>

              <div
                className={`p-5 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-white leading-snug">
                  {EXP07_CONTENT.screen03.beat3}
                </p>
              </div>

              {/* Nuance list */}
              <div
                className={`pt-3 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="flex items-center space-x-2 text-sm text-neutral-400">
                  <span className="w-1 h-1 rounded-full bg-neutral-600" />
                  <span>{EXP07_CONTENT.screen03.nuance1}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-400">
                  <span className="w-1 h-1 rounded-full bg-neutral-600" />
                  <span>{EXP07_CONTENT.screen03.nuance2}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm sm:text-base font-serif italic text-neutral-200">
                  <span className="w-1 h-1 rounded-full bg-orange-400" />
                  <span>{EXP07_CONTENT.screen03.nuance3}</span>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-03-cta"
                onClick={() => advanceToScreen('screen_04_first_path_before')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen03.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 04 — PRIMER CAMINO (ANTES) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_04_first_path_before' && (
          <div
            id="screen-04-first-path-before"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen04.eyebrow}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                  PATRÓN HISTÓRICO
                </span>
              </div>

              <div
                className={`transition-all duration-700 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-3xl sm:text-4xl font-serif italic text-neutral-400">
                  {EXP07_CONTENT.screen04.title}
                </h2>
              </div>

              {/* Reactive Sequence */}
              <div
                className={`space-y-2.5 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP07_CONTENT.screen04.flow.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#080808] border border-[#161616] flex items-center justify-between"
                  >
                    <span className="text-base text-neutral-300 font-body">{item}</span>
                    {idx < EXP07_CONTENT.screen04.flow.length - 1 && (
                      <span className="text-xs font-mono text-neutral-600">↓</span>
                    )}
                  </div>
                ))}
              </div>

              <div
                className={`pt-3 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg font-serif italic text-orange-400/90">
                  {EXP07_CONTENT.screen04.closure}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-04-cta"
                onClick={() => advanceToScreen('screen_05_second_path_now')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen04.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 05 — SEGUNDO CAMINO (AHORA) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_05_second_path_now' && (
          <div
            id="screen-05-second-path-now"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen05.eyebrow}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  CON CONTEXTO™
                </span>
              </div>

              <div
                className={`transition-all duration-700 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-3xl sm:text-4xl font-serif italic text-white">
                  {EXP07_CONTENT.screen05.title}
                </h2>
              </div>

              {/* Reflective Sequence */}
              <div
                className={`space-y-2.5 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP07_CONTENT.screen05.flow.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#080808] border border-[#1A1A1A] flex items-center justify-between"
                  >
                    <span className="text-base text-neutral-200 font-body">{item}</span>
                    <span className="text-xs font-mono text-neutral-600">↓</span>
                  </div>
                ))}
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-1 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen05.flow[4]}
                </p>
                <p className="text-2xl sm:text-3xl font-serif italic text-orange-400">
                  {EXP07_CONTENT.screen05.flow[5]}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-05-cta"
                onClick={() => advanceToScreen('screen_06_the_shift')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen05.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 06 — EL CAMBIO (REVELACIÓN EMOCIONAL) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_06_the_shift' && (
          <div
            id="screen-06-the-shift"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-10"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen06.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h1 className="text-3xl sm:text-4xl font-serif italic text-white">
                  {EXP07_CONTENT.screen06.question}
                </h1>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="p-3 rounded-lg bg-[#080808] border border-[#161616]">
                  <p className="text-base text-neutral-400 font-body">{EXP07_CONTENT.screen06.beat1}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#080808] border border-[#161616]">
                  <p className="text-base text-neutral-400 font-body">{EXP07_CONTENT.screen06.beat2}</p>
                </div>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen06.lead}
                </p>
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400 leading-snug">
                    {EXP07_CONTENT.screen06.dominantReveal}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-06-cta"
                onClick={() => advanceToScreen('screen_07_new_way_of_seeing')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen06.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 07 — UNA NUEVA FORMA DE MIRAR */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_07_new_way_of_seeing' && (
          <div
            id="screen-07-new-way-of-seeing"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen07.eyebrow}
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen07.beat1}
                </p>
                <p className="text-lg sm:text-xl font-serif italic text-neutral-200">
                  {EXP07_CONTENT.screen07.beat2}
                </p>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-4 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen07.shiftLead}
                </p>

                {/* Question Shift Contrast */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#080808] border border-[#161616] space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      ANTES
                    </span>
                    <p className="text-lg font-serif italic text-neutral-400 line-through decoration-neutral-600">
                      {EXP07_CONTENT.screen07.beforeQuestion}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 space-y-1">
                    <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">
                      AHORA
                    </span>
                    <p className="text-xl sm:text-2xl font-serif italic text-white font-medium">
                      {EXP07_CONTENT.screen07.afterQuestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-07-cta"
                onClick={() => advanceToScreen('screen_08_three_moments')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen07.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 08 — TRES MOMENTOS */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_08_three_moments' && (
          <div
            id="screen-08-three-moments"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen08.eyebrow}
                </span>
              </div>

              {/* Moments List */}
              <div className="space-y-3">
                {EXP07_CONTENT.screen08.moments.map((moment, idx) => {
                  const stageThreshold = idx + 2;
                  const isVisible = screenStage >= stageThreshold;
                  return (
                    <div
                      key={moment.number}
                      className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-2 transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-[#141414] pb-1">
                        <span className="text-[10px] font-mono tracking-widest text-neutral-500">
                          MOMENTO {moment.number}
                        </span>
                        <span className="text-xs font-serif italic text-orange-400">
                          {moment.trigger}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-body">
                        {moment.insteadOf}
                      </p>
                      <p className="text-sm sm:text-base font-serif italic text-white">
                        {moment.newAction}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-08-cta"
                onClick={() => advanceToScreen('screen_09_what_changes')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen08.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 09 — LO QUE CAMBIA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_09_what_changes' && (
          <div
            id="screen-09-what-changes"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen09.eyebrow}
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen09.beat1}
                </p>
                <p className="text-lg sm:text-xl font-serif italic text-neutral-200">
                  {EXP07_CONTENT.screen09.beat2}
                </p>
              </div>

              <div
                className={`pt-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen09.leadPossibility}
                </p>
                <p className="text-xl sm:text-2xl font-serif italic text-white mt-1">
                  {EXP07_CONTENT.screen09.possibilityCore}
                </p>
              </div>

              {/* Triad of Resolution */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="p-3 rounded-lg bg-[#080808] border border-[#161616] text-neutral-400 text-sm">
                  {EXP07_CONTENT.screen09.triad[0]}
                </div>
                <div className="p-3 rounded-lg bg-[#080808] border border-[#161616] text-neutral-400 text-sm">
                  {EXP07_CONTENT.screen09.triad[1]}
                </div>
                <div className="p-3 rounded-lg bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 text-white font-serif italic text-lg">
                  {EXP07_CONTENT.screen09.triad[2]}
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-09-cta"
                onClick={() => advanceToScreen('screen_10_what_does_not_change')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen09.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 10 — LO QUE NO CAMBIA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_10_what_does_not_change' && (
          <div
            id="screen-10-what-does-not-change"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen10.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-lg sm:text-xl font-serif italic text-neutral-300">
                  {EXP07_CONTENT.screen10.warningLead}
                </p>
              </div>

              <div
                className={`space-y-2.5 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP07_CONTENT.screen10.hardTruths.map((truth, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-[#080808] border border-[#161616] text-neutral-300 font-body text-base"
                  >
                    {truth}
                  </div>
                ))}
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen10.realityCheck}
                </p>
                <p className="text-xl sm:text-2xl font-serif italic text-orange-400 leading-snug">
                  {EXP07_CONTENT.screen10.purposeClosure}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-10-cta"
                onClick={() => advanceToScreen('screen_11_the_desire_interaction')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen10.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 11 — EL DESEO (INTERACCIÓN AUTOEVALUACIÓN) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_11_the_desire_interaction' && (
          <div
            id="screen-11-the-desire-interaction"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen11.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-lg sm:text-xl font-serif italic text-white">
                  {EXP07_CONTENT.screen11.lead1}
                </p>
              </div>

              {/* What it is NOT for */}
              <div
                className={`space-y-1.5 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP07_CONTENT.screen11.notFor.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-neutral-400">
                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* What it IS for */}
              <div
                className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 space-y-1 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-white">
                  {EXP07_CONTENT.screen11.forLead}
                </p>
                <p className="text-sm font-mono text-orange-400 uppercase tracking-wider">
                  {EXP07_CONTENT.screen11.forClosure}
                </p>
              </div>

              {/* Final Question */}
              <div
                className={`pt-2 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-2xl sm:text-3xl font-serif italic text-white">
                  {EXP07_CONTENT.screen11.finalQuestion}
                </p>
              </div>

              {/* Options */}
              {isOptionsRevealed && !usefulnessReactionCode && (
                <div className="space-y-3 pt-2 animate-fade-in">
                  {EXP07_CONTENT.screen11.options.map((opt) => (
                    <ChoiceButton
                      key={opt.id}
                      id={`choice-${opt.id}`}
                      code={opt.code}
                      selected={selectedOption === opt.code}
                      isAnySelected={selectedOption !== null}
                      onClick={() => handleSelectUsefulness(opt.code, opt.label)}
                      disabled={isProcessing || selectedOption !== null}
                    >
                      <span className="font-body text-base sm:text-lg">{opt.label}</span>
                    </ChoiceButton>
                  ))}
                </div>
              )}

              {/* Feedback */}
              {usefulnessReactionCode && (
                <div className="space-y-4 pt-4 border-t border-[#181818] animate-fade-in">
                  <div
                    className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] transition-all duration-1000 ${
                      screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider mb-1">
                      VALORACIÓN REGISTRADA
                    </p>
                    <p className="text-base font-serif italic text-white">
                      “{savedResponses['exp07.usefulnessReaction'] as string}”
                    </p>
                    <p className="text-sm text-neutral-300 font-body mt-2">
                      {reactionFeedback}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {usefulnessReactionCode && (
              <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
                <PrimaryCTA
                  id="screen-11-cta"
                  onClick={() => advanceToScreen('screen_12_preparation_for_revelation')}
                  disabled={isProcessing}
                >
                  {EXP07_CONTENT.screen11.ctaLabel}
                </PrimaryCTA>
              </CTAReveal>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 12 — PREPARACIÓN PARA LA REVELACIÓN */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_12_preparation_for_revelation' && (
          <div
            id="screen-12-preparation-for-revelation"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-12"
          >
            <div className="space-y-8 text-center w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500">
                  {EXP07_CONTENT.screen12.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h1 className="text-2xl sm:text-3xl font-serif italic text-white">
                  {EXP07_CONTENT.screen12.lead1}
                </h1>
              </div>

              <div
                className={`space-y-1 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen12.lead2}
                </p>
                <p className="text-base sm:text-lg text-neutral-300 font-body">
                  {EXP07_CONTENT.screen12.lead3}
                </p>
              </div>

              <div
                className={`pt-6 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  {EXP07_CONTENT.screen12.prelude}
                </p>
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-orange-400 leading-snug">
                    {EXP07_CONTENT.screen12.dominantReveal}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-6">
              <PrimaryCTA
                id="screen-12-cta-ver-la-revelacion"
                onClick={handleCompleteExp07}
                disabled={isProcessing || isCompletedGuard}
              >
                {EXP07_CONTENT.screen12.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer id="exp07-footer" className="w-full max-w-xl text-center py-4 border-t border-[#121212] mt-4">
        <p className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
          CONTEXTO™ // ANÁLISIS DE DINÁMICAS // EXP_07
        </p>
      </footer>
    </div>
  );
};
