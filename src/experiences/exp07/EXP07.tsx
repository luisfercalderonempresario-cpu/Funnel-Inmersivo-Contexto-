// EXP_07 — LA PRUEBA (Interactive Contexto™ Product Experience V1.0)
import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { ExperienceId } from '../../engine/state/types';
import { EXP07_CONTENT } from './exp07Content';
import { EXP07_DEFINITION } from './exp07Definition';
import {
  calculateCycleContext,
  CycleCalculationResult,
  CyclePhase,
} from './cycleEngine';
import { ExperienceMemoryManager } from '../../engine/experience/experienceMemory';
import {
  loadExperienceRuntimeState,
  persistExperienceRuntimeState,
  transitionScreenState,
} from '../../engine/experience/experienceState';
import { ExperienceRuntimeState } from '../../engine/experience/types';
import { eventTracker } from '../../engine/events/eventTracker';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { Volume2, VolumeX, Sparkles, Compass, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useNarrativePacing, CTAReveal, NarrativeBeat } from '../../engine/pacing';

// Subcomponents
import { CycleDateInput } from './components/CycleDateInput';
import { ContextAnalysis } from './components/ContextAnalysis';
import { ContextResultCard } from './components/ContextResultCard';
import { ConnectionModeCard } from './components/ConnectionModeCard';
import { DailyActionCard } from './components/DailyActionCard';
import { UtilityQuestion } from './components/UtilityQuestion';

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
      currentScreen: 'screen_01_the_shift',
      status: 'ACTIVE',
      localData: {},
      localMemory: {},
      completedScreens: [],
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
  });

  const [, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompletedGuard, setIsCompletedGuard] = useState<boolean>(false);
  const completingRef = useRef<boolean>(false);

  const currentScreenId = runtimeState.currentScreen;

  // Restore saved inputs from memory/state
  const savedResponses = (state.responses.exp07 || {}) as Record<string, unknown>;
  const savedMenstruationDate = (savedResponses['exp07.menstruationDate'] ||
    runtimeState.localData?.menstruationDate ||
    '') as string;
  const savedDateIsApproximate = Boolean(
    savedResponses['exp07.dateIsApproximate'] ??
      runtimeState.localData?.dateIsApproximate ??
      false
  );
  const savedUtilityRecognition = (savedResponses['exp07.productUtilityRecognition'] ||
    runtimeState.localData?.productUtilityRecognition) as 'YES' | 'UNSURE' | undefined;

  // Compute cycle result from saved date (or fallback)
  const cycleResult: CycleCalculationResult = useMemo(() => {
    if (!savedMenstruationDate) {
      // Default to 18 days ago (Luteal phase demo) if no date selected yet
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() - 18);
      return calculateCycleContext({
        menstruationDate: fallbackDate.toISOString().split('T')[0],
        dateIsApproximate: true,
      });
    }
    return calculateCycleContext({
      menstruationDate: savedMenstruationDate,
      dateIsApproximate: savedDateIsApproximate,
    });
  }, [savedMenstruationDate, savedDateIsApproximate]);

  // Narrative Beats Configuration for EXP_07
  const currentBeats: NarrativeBeat[] = useMemo(() => {
    switch (currentScreenId) {
      case 'screen_01_the_shift':
        return [
          { id: 'caseId', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1', stage: 2, pacing: 'LONG', label: 'La investigación te mostró algo' },
          { id: 'beat2', stage: 3, pacing: 'MEDIUM', label: 'A veces no necesitas mejor reacción' },
          { id: 'beat3', stage: 4, pacing: 'LONG', label: 'Necesitas más información antes de reaccionar' },
          { id: 'beat4', stage: 5, pacing: 'REVELATION', label: 'Ahora vamos a probarlo' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Probar Contexto™', isCTA: true },
        ];
      case 'screen_02_lets_try_it':
        return [
          { id: 'beat1_2', stage: 1, pacing: 'MEDIUM', label: 'Olvida la investigación / Día cualquiera' },
          { id: 'beat3_4', stage: 2, pacing: 'LONG', label: 'Ella frente a ti / Quieres saber algo' },
          { id: 'beat5_6', stage: 3, pacing: 'REVELATION', label: '¿Qué contexto tienes hoy? / Vamos a descubrirlo' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Empezar', isCTA: true },
        ];
      case 'screen_03_the_data':
        return [
          { id: 'title', stage: 1, pacing: 'LONG', label: 'Contexto™ necesita un punto de partida' },
          { id: 'beat1_2', stage: 2, pacing: 'LONG', label: 'Una fecha / Primer día de su última menstruación' },
          { id: 'beat3_4', stage: 3, pacing: 'REVELATION', label: 'No necesitas recordarla con exactitud / Aproximada sirve' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Introducir Fecha', isCTA: true },
        ];
      case 'screen_04_date_input':
        return [
          { id: 'form', stage: 1, pacing: 'SHORT', label: 'Formulario de Fecha' },
        ];
      case 'screen_05_analyzing':
        return [
          { id: 'analysis', stage: 1, pacing: 'LONG', label: 'Análisis en tiempo real' },
        ];
      case 'screen_06_today_context':
        return [
          { id: 'card', stage: 1, pacing: 'LONG', label: 'Resultado de Contexto de Hoy' },
          { id: 'cta', stage: 2, pacing: 'MANUAL', label: 'Botón Ver Mi Contexto de Hoy', isCTA: true },
        ];
      case 'screen_07_not_an_answer':
        return [
          { id: 'beat1_2', stage: 1, pacing: 'MEDIUM', label: 'Pero hay algo importante / No te dice cómo está ella' },
          { id: 'dominant', stage: 2, pacing: 'REVELATION', label: 'Palabra dominante CONTEXTO' },
          { id: 'beat4', stage: 3, pacing: 'LONG', label: 'Pieza de información para considerar' },
          { id: 'beat5_6', stage: 4, pacing: 'REVELATION', label: 'No reemplaza lo que ella te dice / Ayuda a interpretar' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Ver Mi Contexto', isCTA: true },
        ];
      case 'screen_08_what_to_consider':
        return [
          { id: 'lead', stage: 1, pacing: 'LONG', label: 'Hoy podrías considerar' },
          { id: 'principles', stage: 2, pacing: 'LONG', label: 'No asumas / Observa, pregunta, escucha' },
          { id: 'closure', stage: 3, pacing: 'REVELATION', label: 'El contexto orienta. La conversación confirma.' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_09_daily_connection_index':
        return [
          { id: 'card', stage: 1, pacing: 'LONG', label: 'Índice de Conexión Diaria™' },
          { id: 'cta', stage: 2, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_10_daily_action':
        return [
          { id: 'card', stage: 1, pacing: 'LONG', label: 'Acción y Microgesto de Hoy' },
          { id: 'cta', stage: 2, pacing: 'MANUAL', label: 'Botón Ver el Siguiente Paso', isCTA: true },
        ];
      case 'screen_11_utility_question':
        return [
          { id: 'beat1_2', stage: 1, pacing: 'MEDIUM', label: 'Acabas de ver una pequeña parte / Quiero preguntarte algo' },
          { id: 'beat3_q', stage: 2, pacing: 'LONG', label: 'Si tuvieras este contexto cada día / ¿Crees que te sería útil?' },
          { id: 'options', stage: 3, pacing: 'MANUAL', label: 'Opciones Sí / No estoy seguro', isOptions: true },
        ];
      case 'screen_12_trial_completed':
        return [
          { id: 'beat1', stage: 1, pacing: 'SHORT', label: 'Prueba completada' },
          { id: 'beat2', stage: 2, pacing: 'LONG', label: 'Ya utilizaste una pequeña parte de Contexto™' },
          { id: 'beat3', stage: 3, pacing: 'MEDIUM', label: 'Pero hay algo que todavía no hemos investigado' },
          { id: 'dominant', stage: 4, pacing: 'REVELATION', label: '¿Qué podría cambiar en tu relación si tuvieras este contexto todos los días?' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Descubrirlo', isCTA: true },
        ];
      default:
        return [];
    }
  }, [currentScreenId]);

  // Hook into Narrative Pacing System
  const { stage: screenStage, isCTARevealed, advanceStage } = useNarrativePacing({
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

    if (currentScreenId === 'screen_03_the_data') {
      eventTracker.trackEvent('DATE_INPUT_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    }

    if (currentScreenId === 'screen_06_today_context') {
      eventTracker.trackEvent('CONTEXT_VIEWED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
        payload: {
          phase: cycleResult.estimatedPhase,
          cycleDay: cycleResult.estimatedCycleDay,
        },
      });
    }

    if (currentScreenId === 'screen_07_not_an_answer') {
      eventTracker.trackEvent('CONTEXT_DISCLAIMER_VIEWED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    }

    if (currentScreenId === 'screen_09_daily_connection_index') {
      eventTracker.trackEvent('CONNECTION_MODE_VIEWED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
        payload: { mode: 'UNDERSTAND' },
      });
    }

    if (currentScreenId === 'screen_10_daily_action') {
      eventTracker.trackEvent('DAILY_ACTION_VIEWED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    }

    if (currentScreenId === 'screen_11_utility_question') {
      eventTracker.trackEvent('UTILITY_QUESTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    }
  }, [
    currentScreenId,
    cycleResult.estimatedCycleDay,
    cycleResult.estimatedPhase,
    state.session.sessionId,
    state.session.caseId,
    updateState,
  ]);

  // Initial event tracker on mount
  useEffect(() => {
    eventTracker.trackEvent('EXP07_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
    });
    memoryManagerRef.current.setMemory('exp07.started', true, 'global');
  }, [state.session.sessionId, state.session.caseId]);

  // Generic transition forward between screens
  const advanceToScreen = (targetScreenId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const nextState = transitionScreenState(runtimeState, targetScreenId);
    persistExperienceRuntimeState(nextState);

    startTransition(() => {
      setRuntimeState(nextState);
      setIsProcessing(false);
    });
  };

  // Handler for Screen 04 Date Submission
  const handleDateSubmit = (dateStr: string, isApprox: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { action: 'submit_date', date: dateStr, isApproximate: isApprox },
    });

    eventTracker.trackEvent('DATE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { date: dateStr, isApproximate: isApprox },
    });

    if (isApprox) {
      eventTracker.trackEvent('DATE_APPROXIMATE_SELECTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
        payload: { date: dateStr },
      });
    }

    const calculated = calculateCycleContext({
      menstruationDate: dateStr,
      dateIsApproximate: isApprox,
    });

    // Save locally and globally
    memoryManagerRef.current.applyUpdates([
      { key: 'exp07.menstruationDate', value: dateStr, scope: 'global' },
      { key: 'exp07.dateIsApproximate', value: isApprox, scope: 'global' },
      { key: 'exp07.estimatedCycleDay', value: calculated.estimatedCycleDay, scope: 'global' },
      { key: 'exp07.estimatedPhase', value: calculated.estimatedPhase, scope: 'global' },
      { key: 'exp07.confidenceLevel', value: calculated.confidenceLevel, scope: 'global' },
    ]);

    // Save to runtime localData for fast resume
    const nextState: ExperienceRuntimeState = {
      ...runtimeState,
      currentScreen: 'screen_05_analyzing',
      localData: {
        ...runtimeState.localData,
        menstruationDate: dateStr,
        dateIsApproximate: isApprox,
        estimatedCycleDay: calculated.estimatedCycleDay,
        estimatedPhase: calculated.estimatedPhase,
      },
      lastActivityAt: new Date().toISOString(),
    };
    persistExperienceRuntimeState(nextState);

    eventTracker.trackEvent('CONTEXT_ANALYSIS_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { date: dateStr, isApproximate: isApprox },
    });

    startTransition(() => {
      setRuntimeState(nextState);
      setIsProcessing(false);
    });
  };

  // Handler for Screen 05 Analysis Finished
  const handleAnalysisComplete = () => {
    eventTracker.trackEvent('CONTEXT_ANALYSIS_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: {
        phase: cycleResult.estimatedPhase,
        cycleDay: cycleResult.estimatedCycleDay,
      },
    });

    advanceToScreen('screen_06_today_context');
  };

  // Handler for Screen 11 Utility Response
  const handleSelectUtility = (code: 'YES' | 'UNSURE', label: string) => {
    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { choiceCode: code, choiceLabel: label },
    });

    eventTracker.trackEvent('UTILITY_RESPONSE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { response: code, label },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp07.productUtilityRecognition', value: code, scope: 'global' },
      { key: 'productUtilityRecognition', value: code, scope: 'global' },
    ]);

    // Update runtime local data
    setRuntimeState((prev) => ({
      ...prev,
      localData: {
        ...prev.localData,
        productUtilityRecognition: code,
      },
    }));
  };

  // Handler for Screen 12 Completion & Navigation to EXP_08
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
      started: true,
      menstruationDate: savedMenstruationDate || cycleResult.phaseDisplayName,
      dateIsApproximate: savedDateIsApproximate,
      estimatedCycleDay: cycleResult.estimatedCycleDay,
      estimatedPhase: cycleResult.estimatedPhase,
      confidenceLevel: cycleResult.confidenceLevel,
      contextViewed: true,
      connectionMode: 'UNDERSTAND',
      dailyContextViewed: true,
      productUtilityRecognition: savedUtilityRecognition || 'YES',
      trialCompleted: true,
      productValueExperienced: true,
      completed: true,
      completedAt: now,
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp07.started', value: true, scope: 'global' },
      { key: 'exp07.contextViewed', value: true, scope: 'global' },
      { key: 'exp07.connectionMode', value: 'UNDERSTAND', scope: 'global' },
      { key: 'exp07.dailyContextViewed', value: true, scope: 'global' },
      { key: 'exp07.completed', value: true, scope: 'global' },
      { key: 'exp07.completedAt', value: now, scope: 'global' },
      { key: 'trialCompleted', value: true, scope: 'global' },
      { key: 'productValueExperienced', value: true, scope: 'global' },
      { key: 'estimatedCyclePhase', value: cycleResult.estimatedPhase, scope: 'global' },
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

    // Update FunnelState completed experiences to unlock EXP_08
    updateState((prev) => {
      const alreadyCompleted = prev.progress.completedExperiences.includes('exp07');
      const updatedList: ExperienceId[] = alreadyCompleted
        ? prev.progress.completedExperiences
        : [...prev.progress.completedExperiences, 'exp07'];

      return {
        ...prev,
        product: {
          ...prev.product,
          demoCompleted: true,
        },
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
          <span className="text-[10px] font-mono tracking-wider text-orange-400 uppercase">
            EXP_07 — LA PRUEBA
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

      {/* Main Narrative Stage */}
      <main id="exp07-main-stage" className="w-full max-w-xl flex-1 flex flex-col justify-center my-auto">
        {/* ========================================================================= */}
        {/* SCREEN 01 — EL CAMBIO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_01_the_shift' && (
          <div
            id="screen-01-the-shift"
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white leading-relaxed">
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

                <div
                  className={`pt-2 transition-all duration-1000 ${
                    screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base font-body text-neutral-300">
                    {EXP07_CONTENT.screen01.beat4}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-01-cta"
                onClick={() => advanceToScreen('screen_02_lets_try_it')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen01.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 02 — VAMOS A PROBARLO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_02_lets_try_it' && (
          <div
            id="screen-02-lets-try-it"
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
                <p className="text-base sm:text-lg font-serif italic text-neutral-200">
                  {EXP07_CONTENT.screen02.beat1}
                </p>
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen02.beat2}
                </p>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-lg sm:text-xl font-serif italic text-white leading-snug">
                  {EXP07_CONTENT.screen02.beat3}
                </p>
                <p className="text-base text-neutral-400 font-body">
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
                onClick={() => advanceToScreen('screen_03_the_data')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen02.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 03 — EL DATO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_03_the_data' && (
          <div
            id="screen-03-the-data"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen03.eyebrow}
                </span>
              </div>

              <div
                className={`p-5 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-xl sm:text-2xl font-serif italic text-white leading-snug">
                  {EXP07_CONTENT.screen03.title}
                </h2>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-lg font-serif italic text-orange-400">
                  “{EXP07_CONTENT.screen03.beat1}”
                </p>
                <p className="text-base text-neutral-300 font-body">
                  {EXP07_CONTENT.screen03.beat2}
                </p>
              </div>

              <div
                className={`pt-3 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm text-neutral-400 font-body">
                  {EXP07_CONTENT.screen03.beat3}
                </p>
                <p className="text-sm sm:text-base font-serif italic text-neutral-200">
                  {EXP07_CONTENT.screen03.beat4}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-03-cta"
                onClick={() => advanceToScreen('screen_04_date_input')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen03.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 04 — LA FECHA (SELECTOR DE FECHA MOBILE-FIRST) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_04_date_input' && (
          <div
            id="screen-04-date-input"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <div className="space-y-4 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen04.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
                {EXP07_CONTENT.screen04.title}
              </h2>

              <p className="text-sm text-neutral-400 font-body">
                {EXP07_CONTENT.screen04.subtitle}
              </p>
            </div>

            {/* Interactive Cycle Date Form */}
            <CycleDateInput
              initialDate={savedMenstruationDate}
              initialIsApproximate={savedDateIsApproximate}
              onSubmit={handleDateSubmit}
              disabled={isProcessing}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 05 — ANALIZANDO EL CASO (PROCESO PAUSADO) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_05_analyzing' && (
          <div id="screen-05-analyzing" className="w-full animate-fade-in">
            <ContextAnalysis onComplete={handleAnalysisComplete} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 06 — TU CONTEXTO DE HOY (MICRO-APP FEEL) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_06_today_context' && (
          <div
            id="screen-06-today-context"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <ContextResultCard
              caseId={caseId}
              result={cycleResult}
              isApproximate={savedDateIsApproximate}
            />

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-2">
              <PrimaryCTA
                id="screen-06-cta"
                onClick={() => advanceToScreen('screen_07_not_an_answer')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen06.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 07 — NO ES UNA RESPUESTA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_07_not_an_answer' && (
          <div
            id="screen-07-not-an-answer"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen07.eyebrow}
                </span>
              </div>

              <div
                className={`space-y-1 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                  {EXP07_CONTENT.screen07.beat1}
                </p>
                <p className="text-xl sm:text-2xl font-serif italic text-white">
                  {EXP07_CONTENT.screen07.beat2}
                </p>
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen07.beat3}
                </p>
              </div>

              {/* Dominant Word Reveal */}
              <div
                className={`p-6 rounded-2xl bg-[#080808] border border-[#222] text-center transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <span className="text-3xl sm:text-5xl font-serif italic text-orange-400 tracking-wider">
                  {EXP07_CONTENT.screen07.dominantWord}
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm sm:text-base text-neutral-300 font-body leading-relaxed">
                  {EXP07_CONTENT.screen07.beat4}
                </p>
              </div>

              <div
                className={`pt-3 border-t border-[#181818] space-y-1 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 italic">
                  {EXP07_CONTENT.screen07.beat5}
                </p>
                <p className="text-base sm:text-lg font-serif italic text-orange-300">
                  {EXP07_CONTENT.screen07.beat6}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-07-cta"
                onClick={() => advanceToScreen('screen_08_what_to_consider')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen07.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 08 — LO QUE PUEDES CONSIDERAR */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_08_what_to_consider' && (
          <div
            id="screen-08-what-to-consider"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen08.eyebrow}
                </span>
                <span className="text-xs font-mono text-orange-400">
                  {cycleResult.phaseDisplayName}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
                {EXP07_CONTENT.screen08.title}
              </h2>

              <div
                className={`p-5 rounded-2xl bg-[#080808] border border-[#1E1E1E] space-y-4 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm sm:text-base font-body text-neutral-300 leading-relaxed">
                  {cycleResult.phaseData.practicalConsideration}
                </p>

                <div
                  className={`pt-3 border-t border-[#161616] space-y-3 transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    {EXP07_CONTENT.screen08.principlesLead}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {EXP07_CONTENT.screen08.verbs.map((verb, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#0C0C0C] border border-[#1A1A1A] text-center"
                      >
                        <span className="text-sm sm:text-base font-serif italic text-orange-400 font-semibold">
                          {verb}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`pt-2 border-t border-[#141414] transition-all duration-1000 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-center text-xs sm:text-sm font-mono uppercase tracking-wider text-orange-300/90">
                    {EXP07_CONTENT.screen08.closure}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-08-cta"
                onClick={() => advanceToScreen('screen_09_daily_connection_index')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen08.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 09 — ÍNDICE DE CONEXIÓN DIARIA™ */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_09_daily_connection_index' && (
          <div
            id="screen-09-daily-connection-index"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <ConnectionModeCard caseId={caseId} connectionMode="UNDERSTAND" />

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-2">
              <PrimaryCTA
                id="screen-09-cta"
                onClick={() => advanceToScreen('screen_10_daily_action')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen09.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 10 — UNA ACCIÓN PARA HOY */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_10_daily_action' && (
          <div
            id="screen-10-daily-action"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <DailyActionCard caseId={caseId} phase={cycleResult.estimatedPhase} />

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-2">
              <PrimaryCTA
                id="screen-10-cta"
                onClick={() => advanceToScreen('screen_11_utility_question')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen10.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 11 — ¿TE SERÍA ÚTIL? (EVALUACIÓN PSICOLÓGICA DE VALOR) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_11_utility_question' && (
          <div
            id="screen-11-utility-question"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <div className="space-y-4 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen11.eyebrow}
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen11.beat1}
                </p>
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen11.beat2}
                </p>
              </div>

              <div
                className={`pt-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-300 font-body">
                  {EXP07_CONTENT.screen11.beat3}
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif italic text-white pt-1">
                  {EXP07_CONTENT.screen11.question}
                </h2>
              </div>
            </div>

            {/* Utility question interaction */}
            <UtilityQuestion
              selectedCode={savedUtilityRecognition}
              onSelect={handleSelectUtility}
              onContinue={() => advanceToScreen('screen_12_trial_completed')}
              disabled={isProcessing}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 12 — PRUEBA COMPLETADA (CIERRE Y DESBLOQUEO EXP_08) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_12_trial_completed' && (
          <div
            id="screen-12-trial-completed"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen12.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-white">
                  {EXP07_CONTENT.screen12.beat1}
                </p>
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen12.beat2}
                </p>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen12.beat3}
                </p>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400 leading-snug">
                    {EXP07_CONTENT.screen12.dominantQuestion}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-12-complete-cta"
                onClick={handleCompleteExp07}
                disabled={isProcessing || isCompletedGuard}
              >
                {EXP07_CONTENT.screen12.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}
      </main>

      {/* Subtle Footer status */}
      <footer id="exp07-footer" className="w-full max-w-xl text-center py-3 border-t border-[#111]">
        <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
          CONTEXTO™ — DEMOSTRACIÓN INTERACTIVA ORIENTATIVA
        </span>
      </footer>
    </div>
  );
};
