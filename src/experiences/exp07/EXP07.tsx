// EXP_07 — LA PRUEBA (Contexto™ Interactive Product Demo V2.0)
import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { ExperienceId } from '../../engine/state/types';
import { EXP07_CONTENT, SituationOption } from './exp07Content';
import { EXP07_DEFINITION } from './exp07Definition';
import {
  calculateCycleContext,
  CycleCalculationResult,
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
import { ChoiceButton } from '../../components/ui/ChoiceButton';
import { Volume2, VolumeX, Sparkles, Compass, ShieldCheck, HeartHandshake, Calendar, ArrowRight, HelpCircle, Check, MessageSquare } from 'lucide-react';
import { useNarrativePacing, CTAReveal, NarrativeBeat } from '../../engine/pacing';

// Subcomponents
import { ContextAnalysis } from './components/ContextAnalysis';
import { ContextResultCard } from './components/ContextResultCard';
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
      localData: {
        demoDate: EXP07_CONTENT.demoCase.dateStr,
      },
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

  // Restore saved state from responses/localData
  const savedResponses = (state.responses.exp07 || {}) as Record<string, unknown>;
  const savedSituationChoice = (savedResponses['exp07.demoSituationChoice'] ||
    runtimeState.localData?.demoSituationChoice) as 'A' | 'B' | 'C' | undefined;
  const savedUtilityRecognition = (savedResponses['exp07.productUtilityRecognition'] ||
    runtimeState.localData?.productUtilityRecognition) as 'YES' | 'UNSURE' | undefined;

  // Compute cycle result using fixed demo date (25th August)
  const cycleResult: CycleCalculationResult = useMemo(() => {
    return calculateCycleContext({
      menstruationDate: EXP07_CONTENT.demoCase.dateStr,
      dateIsApproximate: false,
    });
  }, []);

  // Narrative Beats Configuration for all 14 screens of EXP_07
  const currentBeats: NarrativeBeat[] = useMemo(() => {
    switch (currentScreenId) {
      case 'screen_01_the_shift':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1_2', stage: 2, pacing: 'LONG', label: 'Hemos pasado varios minutos' },
          { id: 'beat3_4', stage: 3, pacing: 'LONG', label: 'No siempre reaccionas mal' },
          { id: 'beat5', stage: 4, pacing: 'REVELATION', label: '¿Y si pudieras tener más contexto?' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Quiero Verlo', isCTA: true },
        ];
      case 'screen_02_lets_try_it':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1', stage: 2, pacing: 'MEDIUM', label: 'Vamos a probar Contexto™ con un caso' },
          { id: 'beat2_3', stage: 3, pacing: 'LONG', label: 'Sin configurar nada / Sin aprender nada' },
          { id: 'beat4', stage: 4, pacing: 'REVELATION', label: 'Solo vamos a darle un dato' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Empezar Prueba', isCTA: true },
        ];
      case 'screen_03_the_case':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1', stage: 2, pacing: 'LONG', label: 'Imagina que fue el 25 de agosto' },
          { id: 'beat2_3', stage: 3, pacing: 'REVELATION', label: 'No necesitas introducirla / Contexto™ hará el resto' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Ver Qué Encuentra', isCTA: true },
        ];
      case 'screen_04_the_data':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'card', stage: 2, pacing: 'LONG', label: 'Tarjeta Dato 25 de Agosto' },
          { id: 'beat1', stage: 3, pacing: 'REVELATION', label: 'Mira qué hace Contexto™ con un dato tan sencillo' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Analizar', isCTA: true },
        ];
      case 'screen_05_analyzing':
        return [
          { id: 'analysis', stage: 1, pacing: 'LONG', label: 'Motor Contextual en progreso' },
        ];
      case 'screen_06_the_context':
        return [
          { id: 'card', stage: 1, pacing: 'LONG', label: 'Resultado de Contexto de Hoy' },
          { id: 'cta', stage: 2, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_07_not_just_phase':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1_2_3', stage: 2, pacing: 'LONG', label: 'Pero aquí está lo importante' },
          { id: 'question', stage: 3, pacing: 'MEDIUM', label: '¿Entonces para qué sirve?' },
          { id: 'dominant', stage: 4, pacing: 'REVELATION', label: 'Una pieza más de contexto' },
          { id: 'beat5_6', stage: 5, pacing: 'LONG', label: 'Ahora tienes un dato más' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Ver el Ejemplo', isCTA: true },
        ];
      case 'screen_08_situation':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'story', stage: 2, pacing: 'LONG', label: 'Ella llega a casa / Cansada' },
          { id: 'question', stage: 3, pacing: 'REVELATION', label: '¿Qué harías normalmente?' },
          { id: 'options', stage: 4, pacing: 'MANUAL', label: 'Opciones A, B, C', isOptions: true },
        ];
      case 'screen_09_context_in_action':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1_2', stage: 2, pacing: 'LONG', label: 'Sin contexto tu mente completa los espacios' },
          { id: 'beat3_4', stage: 3, pacing: 'LONG', label: 'Contexto™ no decide por ti / Da información' },
          { id: 'formula', stage: 4, pacing: 'REVELATION', label: 'Fórmula Contextual' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Ver Qué Preguntar', isCTA: true },
        ];
      case 'screen_10_better_question':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'lead', stage: 2, pacing: 'LONG', label: '¿Qué necesita ella realmente?' },
          { id: 'alts', stage: 3, pacing: 'LONG', label: 'Alternativas de preguntas' },
          { id: 'takeaway', stage: 4, pacing: 'REVELATION', label: 'Te ayuda a hacer mejores preguntas' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Ver Acción de Hoy', isCTA: true },
        ];
      case 'screen_11_daily_action':
        return [
          { id: 'card', stage: 1, pacing: 'LONG', label: 'Acción y Microgesto de Hoy' },
          { id: 'cta', stage: 2, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_12_micro_result':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1_2', stage: 2, pacing: 'LONG', label: 'Hace unos minutos solo tenías una situación' },
          { id: 'beat3_4', stage: 3, pacing: 'LONG', label: 'No sabes exactamente qué le pasa / No necesitas inventarlo' },
          { id: 'verbs', stage: 4, pacing: 'REVELATION', label: 'Puedes observar, preguntar, escuchar' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_13_utility_question':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'lead_q', stage: 2, pacing: 'LONG', label: 'Si tuvieras esta información cada día' },
          { id: 'options', stage: 3, pacing: 'MANUAL', label: 'Opciones de Utilidad', isOptions: true },
        ];
      case 'screen_14_trial_completed':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1_2', stage: 2, pacing: 'LONG', label: 'Esto fue solo una demostración' },
          { id: 'beat3', stage: 3, pacing: 'LONG', label: 'En Contexto™ real se construye alrededor de tu relación' },
          { id: 'beat4_5', stage: 4, pacing: 'REVELATION', label: 'Para ayudarte a comprender antes de reaccionar' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      default:
        return [];
    }
  }, [currentScreenId]);

  // Hook into Narrative Pacing System
  const { stage: screenStage, isCTARevealed } = useNarrativePacing({
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

    if (currentScreenId === 'screen_03_the_case') {
      eventTracker.trackEvent('EXP07_DEMO_CASE_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    }

    if (currentScreenId === 'screen_04_the_data') {
      eventTracker.trackEvent('EXP07_DEMO_DATA_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
        payload: { date: EXP07_CONTENT.demoCase.dateStr },
      });
    }

    if (currentScreenId === 'screen_06_the_context') {
      eventTracker.trackEvent('EXP07_DEMO_CONTEXT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
        payload: {
          phase: cycleResult.estimatedPhase,
          cycleDay: cycleResult.estimatedCycleDay,
        },
      });
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

    if (currentScreenId === 'screen_08_situation') {
      eventTracker.trackEvent('EXP07_DEMO_SITUATION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    }

    if (currentScreenId === 'screen_09_context_in_action') {
      eventTracker.trackEvent('EXP07_DEMO_INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    }

    if (currentScreenId === 'screen_11_daily_action') {
      eventTracker.trackEvent('EXP07_DEMO_ACTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
      eventTracker.trackEvent('DAILY_ACTION_VIEWED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    }

    if (currentScreenId === 'screen_13_utility_question') {
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
    eventTracker.trackEvent('EXP07_DEMO_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
    });
    memoryManagerRef.current.applyUpdates([
      { key: 'exp07.started', value: true, scope: 'global' },
      { key: 'exp07.demoCase', value: true, scope: 'global' },
    ]);
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

  // Handler for Screen 04 Date Analysis Trigger
  const handleStartAnalysis = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { action: 'analyze_demo_date', date: EXP07_CONTENT.demoCase.dateStr },
    });

    eventTracker.trackEvent('CONTEXT_ANALYSIS_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { date: EXP07_CONTENT.demoCase.dateStr, isDemo: true },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp07.demoDate', value: EXP07_CONTENT.demoCase.dateStr, scope: 'global' },
      { key: 'exp07.estimatedCycleDay', value: cycleResult.estimatedCycleDay, scope: 'global' },
      { key: 'exp07.estimatedPhase', value: cycleResult.estimatedPhase, scope: 'global' },
      { key: 'exp07.confidenceLevel', value: cycleResult.confidenceLevel, scope: 'global' },
    ]);

    const nextState: ExperienceRuntimeState = {
      ...runtimeState,
      currentScreen: 'screen_05_analyzing',
      localData: {
        ...runtimeState.localData,
        demoDate: EXP07_CONTENT.demoCase.dateStr,
        estimatedCycleDay: cycleResult.estimatedCycleDay,
        estimatedPhase: cycleResult.estimatedPhase,
      },
      lastActivityAt: new Date().toISOString(),
    };
    persistExperienceRuntimeState(nextState);

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

    advanceToScreen('screen_06_the_context');
  };

  // Handler for Screen 08 Situation Choice
  const handleSelectSituationChoice = (opt: SituationOption) => {
    if (isProcessing) return;

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { choiceCode: opt.code, choiceLabel: opt.text },
    });

    eventTracker.trackEvent('EXP07_DEMO_CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { choice: opt.code, label: opt.text },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp07.demoSituationChoice', value: opt.code, scope: 'global' },
    ]);

    setRuntimeState((prev) => ({
      ...prev,
      localData: {
        ...prev.localData,
        demoSituationChoice: opt.code,
      },
    }));

    advanceToScreen('screen_09_context_in_action');
  };

  // Handler for Screen 13 Utility Response
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

    setRuntimeState((prev) => ({
      ...prev,
      localData: {
        ...prev.localData,
        productUtilityRecognition: code,
      },
    }));
  };

  // Handler for Screen 14 Completion & Navigation to EXP_08
  const handleCompleteExp07 = () => {
    if (isCompletedGuard || completingRef.current) return;
    completingRef.current = true;
    setIsCompletedGuard(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { action: 'complete_exp07', label: EXP07_CONTENT.screen14.ctaLabel },
    });

    const now = new Date().toISOString();
    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      started: true,
      demoCase: true,
      demoDate: EXP07_CONTENT.demoCase.dateStr,
      estimatedCycleDay: cycleResult.estimatedCycleDay,
      estimatedPhase: cycleResult.estimatedPhase,
      confidenceLevel: cycleResult.confidenceLevel,
      demoSituationChoice: savedSituationChoice || 'C',
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
      { key: 'exp07.demoCase', value: true, scope: 'global' },
      { key: 'exp07.demoDate', value: EXP07_CONTENT.demoCase.dateStr, scope: 'global' },
      { key: 'exp07.estimatedCycleDay', value: cycleResult.estimatedCycleDay, scope: 'global' },
      { key: 'exp07.estimatedPhase', value: cycleResult.estimatedPhase, scope: 'global' },
      { key: 'exp07.confidenceLevel', value: cycleResult.confidenceLevel, scope: 'global' },
      { key: 'exp07.contextViewed', value: true, scope: 'global' },
      { key: 'exp07.connectionMode', value: 'UNDERSTAND', scope: 'global' },
      { key: 'exp07.dailyContextViewed', value: true, scope: 'global' },
      { key: 'exp07.productUtilityRecognition', value: savedUtilityRecognition || 'YES', scope: 'global' },
      { key: 'exp07.completed', value: true, scope: 'global' },
      { key: 'exp07.completedAt', value: now, scope: 'global' },
      { key: 'productUtilityRecognition', value: savedUtilityRecognition || 'YES', scope: 'global' },
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

    eventTracker.trackEvent('EXP07_DEMO_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
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
                <p className="text-base sm:text-lg text-neutral-400 font-body mt-2">
                  {EXP07_CONTENT.screen01.beat2}
                </p>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-300 font-body">
                  {EXP07_CONTENT.screen01.beat3}
                </p>
                <p className="text-base sm:text-lg text-neutral-400 font-body">
                  {EXP07_CONTENT.screen01.beat4}
                </p>

                <div
                  className={`pt-3 transition-all duration-1000 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xl sm:text-2xl font-serif italic text-orange-400 leading-snug">
                    {EXP07_CONTENT.screen01.beat5}
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
                className={`transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl font-serif italic text-white leading-snug">
                  {EXP07_CONTENT.screen02.beat1}
                </h2>
              </div>

              <div
                className={`p-5 rounded-xl bg-[#080808] border border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-300 font-body">
                  • {EXP07_CONTENT.screen02.beat2}
                </p>
                <p className="text-base text-neutral-300 font-body">
                  • {EXP07_CONTENT.screen02.beat3}
                </p>
              </div>

              <div
                className={`pt-2 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-orange-400">
                  {EXP07_CONTENT.screen02.beat4}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-02-cta"
                onClick={() => advanceToScreen('screen_03_the_case')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen02.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 03 — EL CASO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_03_the_case' && (
          <div
            id="screen-03-the-case"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen03.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              <div
                className={`p-6 rounded-2xl bg-[#080808] border border-[#1E1E1E] space-y-4 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs font-mono text-orange-400 uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>EJEMPLO ORIENTATIVO</span>
                </div>

                <p className="text-xl sm:text-2xl font-serif italic text-white leading-relaxed">
                  {EXP07_CONTENT.screen03.beat1}
                </p>
              </div>

              <div
                className={`pt-2 space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen03.beat2}
                </p>
                <p className="text-lg font-serif italic text-orange-300">
                  {EXP07_CONTENT.screen03.beat3}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-03-cta"
                onClick={() => advanceToScreen('screen_04_the_data')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen03.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 04 — EL DATO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_04_the_data' && (
          <div
            id="screen-04-the-data"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen04.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              {/* Data Card Highlight */}
              <div
                className={`p-6 rounded-2xl bg-[#080808] border border-orange-500/30 shadow-xl space-y-3 text-center transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
                  FECHA INTRODUCIDA
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif italic text-orange-400 font-semibold tracking-wide">
                  {EXP07_CONTENT.screen04.dateTag}
                </h2>
                <p className="text-xs sm:text-sm font-mono text-neutral-500 pt-1">
                  {EXP07_CONTENT.screen04.dateSubtext}
                </p>
              </div>

              <div
                className={`pt-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed">
                  {EXP07_CONTENT.screen04.beat1}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-04-cta"
                onClick={handleStartAnalysis}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen04.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 05 — MOTOR CONTEXTUAL */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_05_analyzing' && (
          <div id="screen-05-analyzing" className="w-full animate-fade-in">
            <ContextAnalysis onComplete={handleAnalysisComplete} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 06 — EL CONTEXTO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_06_the_context' && (
          <div
            id="screen-06-the-context"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <ContextResultCard
              caseId={caseId}
              result={cycleResult}
              isApproximate={false}
            />

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-2">
              <PrimaryCTA
                id="screen-06-cta"
                onClick={() => advanceToScreen('screen_07_not_just_phase')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen06.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 07 — LO IMPORTANTE NO ES LA FASE */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_07_not_just_phase' && (
          <div
            id="screen-07-not-just-phase"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen07.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              <div
                className={`p-5 rounded-2xl bg-[#080808] border border-[#1E1E1E] space-y-3 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400 block">
                  {EXP07_CONTENT.screen07.title}
                </span>
                <p className="text-xl sm:text-2xl font-serif italic text-white leading-snug">
                  {EXP07_CONTENT.screen07.beat1}
                </p>
                <p className="text-sm sm:text-base text-neutral-300 font-body">
                  {EXP07_CONTENT.screen07.beat2} {EXP07_CONTENT.screen07.beat3}
                </p>
              </div>

              <div
                className={`pt-1 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg font-serif italic text-orange-200">
                  {EXP07_CONTENT.screen07.beatQuestion}
                </p>
              </div>

              {/* Dominant Highlight Reveal */}
              <div
                className={`p-6 rounded-2xl bg-[#0C0C0C] border border-orange-500/30 text-center transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
                  {EXP07_CONTENT.screen07.beat4}
                </p>
                <span className="text-xl sm:text-2xl md:text-3xl font-serif italic text-orange-400 tracking-wide font-semibold block">
                  “{EXP07_CONTENT.screen07.dominantWord}”
                </span>
              </div>

              <div
                className={`p-4 rounded-xl bg-[#080808] border border-[#161616] text-left transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm sm:text-base text-neutral-300 font-body">
                  {EXP07_CONTENT.screen07.beat5} {EXP07_CONTENT.screen07.beat6}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-07-cta"
                onClick={() => advanceToScreen('screen_08_situation')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen07.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 08 — UNA SITUACIÓN REAL (INTERACTIVE CHOICE) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_08_situation' && (
          <div
            id="screen-08-situation"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen08.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              {/* Story Box */}
              <div
                className={`p-5 rounded-2xl bg-[#080808] border border-[#1E1E1E] space-y-2.5 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 block">
                  {EXP07_CONTENT.screen08.title}
                </span>
                <p className="text-base text-neutral-300 font-body">
                  {EXP07_CONTENT.screen08.story1} {EXP07_CONTENT.screen08.story2}
                </p>
                <p className="text-base text-neutral-300 font-body">
                  {EXP07_CONTENT.screen08.story3}
                </p>
                <div className="pt-2">
                  <p className="text-xl sm:text-2xl font-serif italic text-orange-300 font-semibold">
                    {EXP07_CONTENT.screen08.herResponse}
                  </p>
                </div>
              </div>

              {/* Question */}
              <div
                className={`pt-1 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h3 className="text-xl sm:text-2xl font-serif italic text-white">
                  {EXP07_CONTENT.screen08.question}
                </h3>
              </div>

              {/* Interactive Options */}
              <div className="space-y-3 pt-2">
                {EXP07_CONTENT.screen08.options.map((opt) => {
                  const isSelected = savedSituationChoice === opt.code;
                  return (
                    <div key={opt.id} className="w-full">
                      <ChoiceButton
                        id={`situation-opt-${opt.code.toLowerCase()}`}
                        selected={isSelected}
                        onClick={() => handleSelectSituationChoice(opt)}
                        disabled={isProcessing}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-orange-400 font-semibold uppercase">
                            {opt.label}:
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      </ChoiceButton>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 09 — CONTEXTO EN ACCIÓN */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_09_context_in_action' && (
          <div
            id="screen-09-context-in-action"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen09.eyebrow}
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
                <h2 className="text-2xl sm:text-3xl font-serif italic text-white leading-snug">
                  {EXP07_CONTENT.screen09.title}
                </h2>
                <p className="text-base text-neutral-300 font-body">
                  {EXP07_CONTENT.screen09.beat1}
                </p>
                <p className="text-sm text-neutral-400 font-body">
                  {EXP07_CONTENT.screen09.beat2}
                </p>
              </div>

              <div
                className={`p-4 rounded-xl bg-[#080808] border border-[#1A1A1A] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base font-serif italic text-orange-200">
                  {EXP07_CONTENT.screen09.beat3}
                </p>
                <p className="text-sm text-neutral-400 font-body">
                  {EXP07_CONTENT.screen09.beat4}
                </p>
              </div>

              {/* Context Formula Card */}
              <div
                className={`p-5 rounded-2xl bg-[#0C0C0C] border border-orange-500/30 text-center space-y-3 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                  ESTRUCTURA DE COMPRENSIÓN
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-mono">
                  <span className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-orange-300 font-semibold">
                    {EXP07_CONTENT.screen09.formula.part1}
                  </span>
                  <span className="text-neutral-500 font-bold">+</span>
                  <span className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 font-semibold">
                    {EXP07_CONTENT.screen09.formula.part2}
                  </span>
                  <span className="text-neutral-500 font-bold">+</span>
                  <span className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 font-semibold">
                    {EXP07_CONTENT.screen09.formula.part3}
                  </span>
                  <span className="text-orange-400 font-bold">=</span>
                  <span className="px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 font-bold">
                    {EXP07_CONTENT.screen09.formula.result}
                  </span>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-09-cta"
                onClick={() => advanceToScreen('screen_10_better_question')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen09.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 10 — UNA MEJOR PREGUNTA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_10_better_question' && (
          <div
            id="screen-10-better-question"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen10.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              <div
                className={`space-y-1 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
                  {EXP07_CONTENT.screen10.title}
                </h2>
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen10.leadQuestion}
                </p>
              </div>

              {/* Two Alternative Questions */}
              <div
                className={`space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="p-4 rounded-xl bg-[#080808] border border-[#1A1A1A] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 block">
                    {EXP07_CONTENT.screen10.alternative1Title}
                  </span>
                  <p className="text-lg font-serif italic text-white">
                    {EXP07_CONTENT.screen10.alternative1}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#080808] border border-[#1A1A1A] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    {EXP07_CONTENT.screen10.alternative2Title}
                  </span>
                  <p className="text-lg font-serif italic text-neutral-200">
                    {EXP07_CONTENT.screen10.alternative2}
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl bg-[#0C0C0C] border border-orange-500/20 text-center transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm sm:text-base font-serif italic text-orange-300">
                  {EXP07_CONTENT.screen10.takeaway}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-10-cta"
                onClick={() => advanceToScreen('screen_11_daily_action')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen10.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 11 — UNA ACCIÓN PARA HOY */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_11_daily_action' && (
          <div
            id="screen-11-daily-action"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <DailyActionCard caseId={caseId} phase={cycleResult.estimatedPhase} />

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-2">
              <PrimaryCTA
                id="screen-11-cta"
                onClick={() => advanceToScreen('screen_12_micro_result')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen11.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 12 — EL MICRORESULTADO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_12_micro_result' && (
          <div
            id="screen-12-micro-result"
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
                className={`p-5 rounded-2xl bg-[#080808] border border-[#1C1C1C] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-300 font-body">
                  {EXP07_CONTENT.screen12.beat3}
                </p>
                <p className="text-base font-serif italic text-orange-300">
                  {EXP07_CONTENT.screen12.beat4}
                </p>
              </div>

              <div
                className={`space-y-2 text-center transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="flex items-center justify-center space-x-3 text-sm sm:text-base font-serif italic text-neutral-200">
                  {EXP07_CONTENT.screen12.verbs.map((verb, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-orange-400 font-semibold">{verb}</span>
                      {idx < EXP07_CONTENT.screen12.verbs.length - 1 && (
                        <span className="text-neutral-600">•</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-lg sm:text-xl font-serif italic text-white pt-2">
                  {EXP07_CONTENT.screen12.closure}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-12-cta"
                onClick={() => advanceToScreen('screen_13_utility_question')}
                disabled={isProcessing}
              >
                {EXP07_CONTENT.screen12.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 13 — ¿TE SERÍA ÚTIL? */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_13_utility_question' && (
          <div
            id="screen-13-utility-question"
            className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in max-w-xl mx-auto py-6"
          >
            <div className="space-y-4 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen13.eyebrow}
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen13.lead}
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif italic text-white pt-1 leading-snug">
                  {EXP07_CONTENT.screen13.question}
                </h2>
              </div>
            </div>

            {/* Utility question interactive widget */}
            <UtilityQuestion
              selectedCode={savedUtilityRecognition}
              onSelect={handleSelectUtility}
              onContinue={() => advanceToScreen('screen_14_trial_completed')}
              disabled={isProcessing}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 14 — CIERRE DE LA PRUEBA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_14_trial_completed' && (
          <div
            id="screen-14-trial-completed"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP07_CONTENT.screen14.eyebrow}
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
                  {EXP07_CONTENT.screen14.beat1}
                </p>
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen14.beat2}
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl bg-[#080808] border border-[#1C1C1C] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-300 font-body">
                  {EXP07_CONTENT.screen14.beat3}
                </p>
              </div>

              <div
                className={`pt-2 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP07_CONTENT.screen14.beat4}
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-orange-400 leading-snug">
                  {EXP07_CONTENT.screen14.beat5}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-14-complete-cta"
                onClick={handleCompleteExp07}
                disabled={isProcessing || isCompletedGuard}
              >
                {EXP07_CONTENT.screen14.ctaLabel}
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
