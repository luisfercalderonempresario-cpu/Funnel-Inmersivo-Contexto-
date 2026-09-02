// EXP_07 — LA PRUEBA (Contexto™ Interactive Product Demo V3.0)
import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { EXP07_CONTENT, QuestionOption } from './exp07Content';
import { EXP07_DEFINITION } from './exp07Definition';
import { calculateCycleContext, CycleCalculationResult } from './cycleEngine';
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
import {
  Volume2,
  VolumeX,
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  Check,
  MessageSquare,
  Eye,
  HeartHandshake,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useNarrativePacing, CTAReveal, NarrativeBeat } from '../../engine/pacing';

// Subcomponents
import { ContextEngineProcessing } from './components/ContextEngineProcessing';
import { ConnectionIndexCard } from './components/ConnectionIndexCard';
import { WowSequenceVisual } from './components/WowSequenceVisual';

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
      currentScreen: 'screen_01_the_test',
      status: 'ACTIVE',
      localData: {
        simulatedDate: EXP07_CONTENT.demoCase.dateStr,
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

  // Restore saved responses from memory/state
  const savedResponses = (state.responses.exp07 || {}) as Record<string, unknown>;
  const savedFirstDecision = (savedResponses['exp07.firstDecisionCode'] ||
    runtimeState.localData?.firstDecisionCode) as 'A' | 'B' | 'C' | 'D' | undefined;
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(
    savedFirstDecision || null
  );

  // Compute deterministic cycle calculation for simulated date
  const cycleResult: CycleCalculationResult = useMemo(() => {
    return calculateCycleContext({
      menstruationDate: EXP07_CONTENT.demoCase.dateStr,
      dateIsApproximate: false,
    });
  }, []);

  // Narrative Beats Configuration for all 13 screens of EXP_07
  const currentBeats: NarrativeBeat[] = useMemo(() => {
    switch (currentScreenId) {
      case 'screen_01_the_test':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1_2', stage: 2, pacing: 'LONG', label: 'Hasta ahora has estado descubriendo' },
          { id: 'beat3_4_5', stage: 3, pacing: 'LONG', label: 'Vamos a verlo funcionar' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Probar Contexto', isCTA: true },
        ];
      case 'screen_02_the_data':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'card', stage: 2, pacing: 'LONG', label: 'Tarjeta Dato 25 de Agosto' },
          { id: 'beat1_2', stage: 3, pacing: 'LONG', label: 'Eso es prácticamente todo lo que necesitas' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Analizar Caso', isCTA: true },
        ];
      case 'screen_03_engine':
        return [
          { id: 'engine', stage: 1, pacing: 'LONG', label: 'Motor Contextual' },
        ];
      case 'screen_04_today_context':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'reference', stage: 2, pacing: 'LONG', label: 'Referencia estimada' },
          { id: 'explanation', stage: 3, pacing: 'LONG', label: 'Explicación humana' },
          { id: 'closure', stage: 4, pacing: 'REVELATION', label: 'Lo importante es saber qué observar' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Ver Qué Hacer', isCTA: true },
        ];
      case 'screen_05_missing_piece':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1_2', stage: 2, pacing: 'LONG', label: 'Tú recibes únicamente el comportamiento' },
          { id: 'highlight', stage: 3, pacing: 'REVELATION', label: 'El Momento del Ciclo' },
          { id: 'beat3_4', stage: 4, pacing: 'LONG', label: 'Cambia la forma de acercarte' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Mostrarme el Contexto', isCTA: true },
        ];
      case 'screen_06_the_question':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'question', stage: 2, pacing: 'LONG', label: '¿Qué sería más inteligente hacer primero?' },
          { id: 'options', stage: 3, pacing: 'MANUAL', label: 'Opciones A, B, C, D', isOptions: true },
          { id: 'reflection', stage: 4, pacing: 'REVELATION', label: 'Reflexión y botón continuar' },
        ];
      case 'screen_07_context_to_decision':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1_quote', stage: 2, pacing: 'LONG', label: 'No te dice ella está así' },
          { id: 'block_today', stage: 3, pacing: 'REVELATION', label: 'Bloque Hoy' },
          { id: 'comparison', stage: 4, pacing: 'LONG', label: 'Comparación de preguntas' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Ver Acción', isCTA: true },
        ];
      case 'screen_08_daily_action':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'action', stage: 2, pacing: 'LONG', label: 'Tu acción de hoy' },
          { id: 'scenarios', stage: 3, pacing: 'LONG', label: 'Tres escenarios' },
          { id: 'closure', stage: 4, pacing: 'REVELATION', label: 'Conversación de 2 minutos' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Ver Qué Evitar', isCTA: true },
        ];
      case 'screen_09_what_to_avoid':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'avoid_title', stage: 2, pacing: 'LONG', label: 'Interpretar antes de preguntar' },
          { id: 'examples', stage: 3, pacing: 'LONG', label: 'Ejemplos prácticos' },
          { id: 'closure', stage: 4, pacing: 'REVELATION', label: 'Te ayuda a no inventarla' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_10_connection_index':
        return [
          { id: 'card', stage: 1, pacing: 'LONG', label: 'Índice de Conexión Diaria' },
          { id: 'cta', stage: 2, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_11_wow_moment':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'lead', stage: 2, pacing: 'SHORT', label: 'Solo introdujimos un dato' },
          { id: 'flow', stage: 3, pacing: 'LONG', label: 'Flujo visual WOW' },
          { id: 'summary', stage: 4, pacing: 'REVELATION', label: 'Eso es Contexto™' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_12_the_desire':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'questions', stage: 2, pacing: 'LONG', label: 'No tener que preguntarte constantemente' },
          { id: 'features', stage: 3, pacing: 'LONG', label: 'Lista de contexto diario' },
          { id: 'closure', stage: 4, pacing: 'REVELATION', label: 'Eso cambia la forma de vivir una relación' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Quiero Ver Mi Contexto Cada Día', isCTA: true },
        ];
      case 'screen_13_transition_revelation':
        return [
          { id: 'eyebrow', stage: 1, pacing: 'SHORT', label: 'Eyebrow' },
          { id: 'beat1', stage: 2, pacing: 'MEDIUM', label: 'Esto fue solo una demostración' },
          { id: 'beat2_3', stage: 3, pacing: 'LONG', label: 'En la aplicación real cambia cada día' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Ver el Resumen de Mi Caso', isCTA: true },
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
      },
    }));

    eventTracker.trackEvent('EXP07_SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { screenId: currentScreenId },
    });

    // Special event tracks per screen
    if (currentScreenId === 'screen_01_the_test') {
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
    } else if (currentScreenId === 'screen_02_the_data') {
      eventTracker.trackEvent('EXP07_SIMULATION_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
      eventTracker.trackEvent('EXP07_DEMO_DATA_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    } else if (currentScreenId === 'screen_04_today_context') {
      eventTracker.trackEvent('EXP07_CONTEXT_CALCULATED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
        payload: {
          phase: cycleResult.estimatedPhase,
          day: cycleResult.estimatedCycleDay,
        },
      });
      eventTracker.trackEvent('EXP07_CONTEXT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
      eventTracker.trackEvent('EXP07_DEMO_CONTEXT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    } else if (currentScreenId === 'screen_06_the_question') {
      eventTracker.trackEvent('EXP07_DECISION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
      eventTracker.trackEvent('EXP07_DEMO_SITUATION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    } else if (currentScreenId === 'screen_08_daily_action') {
      eventTracker.trackEvent('EXP07_ACTION_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
      eventTracker.trackEvent('EXP07_DEMO_ACTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    } else if (currentScreenId === 'screen_10_connection_index') {
      eventTracker.trackEvent('EXP07_CONNECTION_INDEX_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    } else if (currentScreenId === 'screen_11_wow_moment') {
      eventTracker.trackEvent('EXP07_WOW_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
      eventTracker.trackEvent('EXP07_DEMO_INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    } else if (currentScreenId === 'screen_12_the_desire') {
      eventTracker.trackEvent('EXP07_DESIRE_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp07',
      });
    }
  }, [currentScreenId, state.session.sessionId, state.session.caseId, cycleResult, updateState]);

  // Generic navigation handler between screens
  const handleNavigate = (targetScreen: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    eventTracker.trackEvent('EXP07_CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { fromScreen: currentScreenId, targetScreen },
    });

    startTransition(() => {
      setRuntimeState((prev) =>
        transitionScreenState(prev, targetScreen, 'ACTIVE')
      );
      setIsProcessing(false);
    });
  };

  // Option selection on Screen 06
  const handleSelectDecisionOption = (option: QuestionOption) => {
    setSelectedOption(option.code);

    memoryManagerRef.current.setMemory('exp07.firstDecision', option.text, 'global');
    memoryManagerRef.current.setMemory('exp07.firstDecisionCode', option.code, 'global');
    memoryManagerRef.current.setMemory('exp07.questionAnswered', true, 'global');

    eventTracker.trackEvent('EXP07_DECISION_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { code: option.code, text: option.text },
    });

    eventTracker.trackEvent('EXP07_DEMO_CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
      payload: { choice: option.code },
    });
  };

  // Completion and transition to EXP_08 (La Revelación)
  const handleCompleteExperience = () => {
    if (completingRef.current || isCompletedGuard) return;
    completingRef.current = true;
    setIsCompletedGuard(true);

    const now = new Date().toISOString();

    // Persist all required memory keys
    memoryManagerRef.current.setMemory('exp07.completed', true, 'global');
    memoryManagerRef.current.setMemory('exp07.completedAt', now, 'global');
    memoryManagerRef.current.setMemory('exp07.productUtilityRecognition', 'YES', 'global');
    memoryManagerRef.current.setMemory('exp07.simulatedDate', EXP07_CONTENT.demoCase.dateStr, 'global');
    memoryManagerRef.current.setMemory('exp07.estimatedCycleDay', cycleResult.estimatedCycleDay, 'global');
    memoryManagerRef.current.setMemory('exp07.estimatedPhase', cycleResult.estimatedPhase, 'global');
    memoryManagerRef.current.setMemory('exp07.contextRecognized', true, 'global');
    memoryManagerRef.current.setMemory('exp07.dailyActionShown', true, 'global');
    memoryManagerRef.current.setMemory('exp07.productValueExperienced', true, 'global');
    memoryManagerRef.current.setMemory('trialCompleted', true, 'global');
    memoryManagerRef.current.setMemory('productValueExperienced', true, 'global');

    // Update runtime state
    setRuntimeState((prev) => ({
      ...prev,
      status: 'COMPLETED',
      completedAt: now,
    }));

    // Unlock EXP_08 in global funnel state
    updateState((prev) => {
      const exp07Responses = (prev.responses.exp07 || {}) as Record<string, unknown>;
      const completedList = prev.progress.completedExperiences.includes('exp07')
        ? prev.progress.completedExperiences
        : [...prev.progress.completedExperiences, 'exp07' as const];

      return {
        ...prev,
        progress: {
          ...prev.progress,
          currentExperience: 'exp08',
          completedExperiences: completedList,
        },
        responses: {
          ...prev.responses,
          exp07: {
            ...exp07Responses,
            'exp07.completed': true,
            'exp07.completedAt': now,
            'exp07.simulatedDate': EXP07_CONTENT.demoCase.dateStr,
            'exp07.estimatedCycleDay': cycleResult.estimatedCycleDay,
            'exp07.estimatedPhase': cycleResult.estimatedPhase,
            'exp07.productUtilityRecognition': 'YES',
            'trialCompleted': true,
            'productValueExperienced': true,
          },
        },
      };
    });

    eventTracker.trackEvent('EXP07_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
    });

    eventTracker.trackEvent('EXP07_DEMO_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp07',
    });

    // Notify parent onComplete
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div
      id="exp07-container"
      className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans selection:bg-amber-500/20 selection:text-amber-200"
    >
      {/* Top Bar / Audio & Identity */}
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between py-2 border-b border-zinc-900">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono tracking-widest text-amber-500/80 font-semibold">
            CONTEXTO™
          </span>
          <span className="text-zinc-700">/</span>
          <span className="text-xs font-mono tracking-wider text-zinc-500">
            DEMO
          </span>
        </div>

        <button
          type="button"
          onClick={toggleAudio}
          className="p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500/40"
          aria-label={isAudioActive ? 'Silenciar audio ambiental' : 'Activar audio ambiental'}
          title={isAudioActive ? 'Silenciar' : 'Activar audio'}
        >
          {isAudioActive ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-center py-6 sm:py-10 text-center">
        {/* ========================================================================= */}
        {/* SCREEN 01 — LA PRUEBA                                                    */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_01_the_test' && (
          <div id="exp07-screen-01" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  {EXP07_CONTENT.screen01.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <div className="space-y-4">
                <p className="text-xl sm:text-2xl font-serif font-normal text-zinc-100 leading-relaxed">
                  {EXP07_CONTENT.screen01.beat1}
                </p>
                <p className="text-lg sm:text-xl font-sans text-zinc-300 font-light">
                  {EXP07_CONTENT.screen01.beat2}
                </p>
              </div>
            )}

            {screenStage >= 3 && (
              <div className="space-y-3 pt-2">
                <p className="text-2xl sm:text-3xl font-serif italic text-amber-200 font-semibold">
                  {EXP07_CONTENT.screen01.beat3}
                </p>
                <p className="text-sm font-sans text-zinc-400">
                  {EXP07_CONTENT.screen01.beat4}
                </p>
                <p className="text-sm font-mono text-zinc-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen01.beat5}
                </p>
              </div>
            )}

            <CTAReveal isRevealed={isCTARevealed} className="pt-6">
              <PrimaryCTA
                id="btn-exp07-start"
                onClick={() => handleNavigate('screen_02_the_data')}
              >
                {EXP07_CONTENT.screen01.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 02 — EL DATO                                                      */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_02_the_data' && (
          <div id="exp07-screen-02" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  {EXP07_CONTENT.screen02.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-2xl space-y-4 max-w-md mx-auto">
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  {EXP07_CONTENT.screen02.lead}
                </p>
                <div className="py-3 px-4 rounded-xl bg-zinc-950 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] flex items-center justify-center gap-3">
                  <Calendar className="w-6 h-6 text-amber-400" />
                  <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-zinc-100">
                    {EXP07_CONTENT.screen02.dateTag}
                  </span>
                </div>
              </div>
            )}

            {screenStage >= 3 && (
              <div className="space-y-2 pt-2">
                <p className="text-base sm:text-lg font-sans text-zinc-300">
                  {EXP07_CONTENT.screen02.beat1}
                </p>
                <p className="text-sm font-sans text-amber-200/90 font-medium">
                  {EXP07_CONTENT.screen02.beat2}
                </p>
              </div>
            )}

            <CTAReveal isRevealed={isCTARevealed} className="pt-4">
              <PrimaryCTA
                id="btn-exp07-analyze"
                onClick={() => handleNavigate('screen_03_engine')}
              >
                {EXP07_CONTENT.screen02.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 03 — MOTOR CONTEXTUAL                                             */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_03_engine' && (
          <div id="exp07-screen-03" className="w-full">
            <ContextEngineProcessing
              onComplete={() => handleNavigate('screen_04_today_context')}
              isReducedMotion={
                typeof window !== 'undefined' &&
                window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
              }
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 04 — TU CONTEXTO DE HOY                                           */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_04_today_context' && (
          <div id="exp07-screen-04" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  {EXP07_CONTENT.screen04.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                  {EXP07_CONTENT.screen04.title}
                </h2>
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/20 via-zinc-900 to-zinc-950 border border-amber-500/30 max-w-md mx-auto">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    {EXP07_CONTENT.screen04.referenceLabel}
                  </span>
                  <p className="text-lg sm:text-xl font-serif italic text-amber-200 font-semibold">
                    {EXP07_CONTENT.screen04.referenceValue}
                  </p>
                  <span className="text-[10px] font-mono text-zinc-500 mt-2 block">
                    {EXP07_CONTENT.screen04.phaseSecondary}
                  </span>
                </div>
              </div>
            )}

            {screenStage >= 3 && (
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left space-y-3 max-w-md mx-auto">
                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  {EXP07_CONTENT.screen04.explanation1}
                </p>
                <div className="border-t border-zinc-800/60 pt-2 space-y-1">
                  <p className="text-sm font-semibold text-zinc-200 font-sans">
                    {EXP07_CONTENT.screen04.explanation2}
                  </p>
                  <p className="text-xs font-mono text-amber-400/90">
                    {EXP07_CONTENT.screen04.explanation3}
                  </p>
                </div>
              </div>
            )}

            {screenStage >= 4 && (
              <p className="text-sm sm:text-base font-serif italic text-zinc-200">
                {EXP07_CONTENT.screen04.closure}
              </p>
            )}

            <CTAReveal isRevealed={isCTARevealed} className="pt-4">
              <PrimaryCTA
                id="btn-exp07-see-what-to-do"
                onClick={() => handleNavigate('screen_05_missing_piece')}
              >
                {EXP07_CONTENT.screen04.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 05 — LO QUE ESTÁS PASANDO POR ALTO                                */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_05_missing_piece' && (
          <div id="exp07-screen-05" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  {EXP07_CONTENT.screen05.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                  {EXP07_CONTENT.screen05.title}
                </h2>
                <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed">
                  {EXP07_CONTENT.screen05.beat1}
                </p>
                <p className="text-sm sm:text-base text-zinc-400 font-sans">
                  {EXP07_CONTENT.screen05.beat2}
                </p>
              </div>
            )}

            {screenStage >= 3 && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 max-w-md mx-auto shadow-lg">
                <span className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-amber-300">
                  {EXP07_CONTENT.screen05.highlight}
                </span>
              </div>
            )}

            {screenStage >= 4 && (
              <div className="space-y-2 pt-2">
                <p className="text-sm font-sans text-zinc-400">
                  {EXP07_CONTENT.screen05.beat3}
                </p>
                <p className="text-base sm:text-lg font-serif italic text-zinc-100 font-medium">
                  {EXP07_CONTENT.screen05.beat4}
                </p>
              </div>
            )}

            <CTAReveal isRevealed={isCTARevealed} className="pt-4">
              <PrimaryCTA
                id="btn-exp07-show-context"
                onClick={() => handleNavigate('screen_06_the_question')}
              >
                {EXP07_CONTENT.screen05.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 06 — LA PREGUNTA                                                  */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_06_the_question' && (
          <div id="exp07-screen-06" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  {EXP07_CONTENT.screen06.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
                  {EXP07_CONTENT.screen06.title}
                </h2>
                <p className="text-base sm:text-lg text-zinc-300 font-sans">
                  {EXP07_CONTENT.screen06.question}
                </p>
              </div>
            )}

            {screenStage >= 3 && (
              <div className="space-y-2.5 max-w-md mx-auto text-left">
                {EXP07_CONTENT.screen06.options.map((opt) => {
                  const isSelected = selectedOption === opt.code;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectDecisionOption(opt)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-500/60 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40'
                          : 'bg-zinc-900/70 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-sm font-sans leading-snug">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedOption && (
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 max-w-md mx-auto space-y-2 text-center animate-fadeIn">
                <p className="text-lg font-serif italic text-amber-200 font-semibold">
                  {EXP07_CONTENT.screen06.reflectionTitle}
                </p>
                <p className="text-sm text-zinc-300 font-sans">
                  {EXP07_CONTENT.screen06.reflectionBeat1}
                </p>
                <p className="text-sm font-medium text-zinc-100 font-sans">
                  {EXP07_CONTENT.screen06.reflectionBeat2}
                </p>
                <div className="pt-2">
                  <PrimaryCTA
                    id="btn-exp07-question-continue"
                    onClick={() => handleNavigate('screen_07_context_to_decision')}
                  >
                    {EXP07_CONTENT.screen06.ctaLabel}
                  </PrimaryCTA>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 07 — CONTEXTO → DECISIÓN                                          */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_07_context_to_decision' && (
          <div id="exp07-screen-07" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  {EXP07_CONTENT.screen07.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 leading-snug">
                  {EXP07_CONTENT.screen07.title}
                </h2>
                <div className="space-y-1">
                  <p className="text-xs font-mono text-zinc-500 uppercase">
                    {EXP07_CONTENT.screen07.beat1}
                  </p>
                  <p className="text-sm font-sans line-through text-zinc-500">
                    {EXP07_CONTENT.screen07.quote1}
                  </p>
                </div>
                <div className="space-y-1 pt-1">
                  <p className="text-xs font-mono text-amber-400 uppercase font-medium">
                    {EXP07_CONTENT.screen07.beat2}
                  </p>
                  <p className="text-base sm:text-lg font-serif italic text-amber-200 font-semibold">
                    {EXP07_CONTENT.screen07.quote2}
                  </p>
                </div>
              </div>
            )}

            {screenStage >= 3 && (
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-left max-w-md mx-auto space-y-3 shadow-xl">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                    {EXP07_CONTENT.screen07.blockLabel}
                  </span>
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                  {EXP07_CONTENT.screen07.blockBody}
                </p>
              </div>
            )}

            {screenStage >= 4 && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-left max-w-md mx-auto space-y-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    {EXP07_CONTENT.screen07.comparisonInstead}
                  </span>
                  <p className="text-xs font-mono text-zinc-400 line-through">
                    {EXP07_CONTENT.screen07.comparisonBad}
                  </p>
                </div>
                <div className="pt-1 border-t border-zinc-800/50">
                  <span className="text-[10px] font-mono uppercase text-amber-400 block">
                    {EXP07_CONTENT.screen07.comparisonTry}
                  </span>
                  <p className="text-sm font-serif italic text-amber-100 leading-relaxed font-medium">
                    {EXP07_CONTENT.screen07.comparisonGood}
                  </p>
                </div>
              </div>
            )}

            <CTAReveal isRevealed={isCTARevealed} className="pt-4">
              <PrimaryCTA
                id="btn-exp07-see-action"
                onClick={() => handleNavigate('screen_08_daily_action')}
              >
                {EXP07_CONTENT.screen07.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 08 — ACCIÓN DE HOY                                                */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_08_daily_action' && (
          <div id="exp07-screen-08" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  {EXP07_CONTENT.screen08.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-amber-500/30 text-left max-w-md mx-auto space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-amber-300">
                    {EXP07_CONTENT.screen08.title}
                  </h2>
                  <span className="text-[10px] font-mono text-zinc-500">HOY</span>
                </div>
                <p className="text-xs font-mono text-zinc-400 uppercase">
                  {EXP07_CONTENT.screen08.timing}
                </p>
                <p className="text-sm sm:text-base font-serif italic text-zinc-100 leading-relaxed font-medium">
                  {EXP07_CONTENT.screen08.action}
                </p>
              </div>
            )}

            {screenStage >= 3 && (
              <div className="space-y-2 max-w-md mx-auto text-left">
                {EXP07_CONTENT.screen08.scenarios.map((sc) => (
                  <div
                    key={sc.condition}
                    className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-zinc-400">{sc.condition}</span>
                    <span className="text-amber-400 font-bold">{sc.action}</span>
                  </div>
                ))}
              </div>
            )}

            {screenStage >= 4 && (
              <p className="text-sm font-serif italic text-zinc-300 max-w-md mx-auto">
                {EXP07_CONTENT.screen08.closure}
              </p>
            )}

            <CTAReveal isRevealed={isCTARevealed} className="pt-4">
              <PrimaryCTA
                id="btn-exp07-see-avoid"
                onClick={() => handleNavigate('screen_09_what_to_avoid')}
              >
                {EXP07_CONTENT.screen08.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 09 — EL ERROR QUE CONTEXTO™ TE AYUDA A EVITAR                     */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_09_what_to_avoid' && (
          <div id="exp07-screen-09" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[11px] font-mono tracking-widest text-rose-400 uppercase font-semibold">
                  {EXP07_CONTENT.screen09.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
                  {EXP07_CONTENT.screen09.title}
                </h2>
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 max-w-md mx-auto">
                  <span className="text-base sm:text-lg font-mono font-bold tracking-wide text-rose-300">
                    {EXP07_CONTENT.screen09.highlight}
                  </span>
                </div>
              </div>
            )}

            {screenStage >= 3 && (
              <div className="space-y-2.5 max-w-md mx-auto text-left">
                {EXP07_CONTENT.screen09.examples.map((ex) => (
                  <div
                    key={ex.trigger}
                    className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1"
                  >
                    <span className="text-xs font-mono font-semibold text-zinc-200 block">
                      {ex.trigger}
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                      {ex.note}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {screenStage >= 4 && (
              <p className="text-base sm:text-lg font-serif italic text-amber-200 font-semibold max-w-md mx-auto">
                {EXP07_CONTENT.screen09.closure}
              </p>
            )}

            <CTAReveal isRevealed={isCTARevealed} className="pt-4">
              <PrimaryCTA
                id="btn-exp07-avoid-continue"
                onClick={() => handleNavigate('screen_10_connection_index')}
              >
                {EXP07_CONTENT.screen09.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 10 — ÍNDICE DE CONEXIÓN DIARIA™                                    */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_10_connection_index' && (
          <div id="exp07-screen-10" className="space-y-6 animate-fadeIn">
            <ConnectionIndexCard />

            <CTAReveal isRevealed={isCTARevealed} className="pt-4">
              <PrimaryCTA
                id="btn-exp07-index-continue"
                onClick={() => handleNavigate('screen_11_wow_moment')}
              >
                {EXP07_CONTENT.screen10.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 11 — MOMENTO WOW                                                  */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_11_wow_moment' && (
          <div id="exp07-screen-11" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  {EXP07_CONTENT.screen11.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                  {EXP07_CONTENT.screen11.title}
                </h2>
                <p className="text-base sm:text-lg font-mono text-amber-300 font-semibold">
                  {EXP07_CONTENT.screen11.lead}
                </p>
              </div>
            )}

            {screenStage >= 3 && <WowSequenceVisual />}

            {screenStage >= 4 && (
              <div className="space-y-3 max-w-md mx-auto pt-2">
                <p className="text-xl sm:text-2xl font-serif italic text-amber-200 font-bold">
                  {EXP07_CONTENT.screen11.summary}
                </p>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                    {EXP07_CONTENT.screen11.conclusion1}
                  </p>
                  <p className="text-sm sm:text-base text-zinc-200 font-sans font-medium">
                    {EXP07_CONTENT.screen11.conclusion2}
                  </p>
                </div>
              </div>
            )}

            <CTAReveal isRevealed={isCTARevealed} className="pt-4">
              <PrimaryCTA
                id="btn-exp07-wow-continue"
                onClick={() => handleNavigate('screen_12_the_desire')}
              >
                {EXP07_CONTENT.screen11.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 12 — EL DESEO                                                     */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_12_the_desire' && (
          <div id="exp07-screen-12" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  {EXP07_CONTENT.screen12.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                  {EXP07_CONTENT.screen12.title}
                </h2>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  {EXP07_CONTENT.screen12.lead}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {EXP07_CONTENT.screen12.questions.map((q) => (
                    <span
                      key={q}
                      className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-serif italic text-zinc-400 line-through"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {screenStage >= 3 && (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-amber-500/40 shadow-2xl max-w-md mx-auto space-y-3 text-left">
                <p className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold border-b border-zinc-800 pb-2">
                  {EXP07_CONTENT.screen12.transition}
                </p>
                <ul className="space-y-2 text-xs sm:text-sm font-mono text-zinc-200">
                  {EXP07_CONTENT.screen12.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {screenStage >= 4 && (
              <p className="text-base sm:text-lg font-serif italic text-amber-200 font-semibold">
                {EXP07_CONTENT.screen12.closure}
              </p>
            )}

            <CTAReveal isRevealed={isCTARevealed} className="pt-4">
              <PrimaryCTA
                id="btn-exp07-desire-cta"
                onClick={() => handleNavigate('screen_13_transition_revelation')}
              >
                {EXP07_CONTENT.screen12.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 13 — TRANSICIÓN A LA REVELACIÓN                                   */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_13_transition_revelation' && (
          <div id="exp07-screen-13" className="space-y-6 animate-fadeIn">
            {screenStage >= 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                  {EXP07_CONTENT.screen13.eyebrow}
                </span>
              </div>
            )}

            {screenStage >= 2 && (
              <p className="text-xl sm:text-2xl font-serif italic text-zinc-200">
                {EXP07_CONTENT.screen13.beat1}
              </p>
            )}

            {screenStage >= 3 && (
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 max-w-md mx-auto space-y-3">
                <p className="text-sm sm:text-base font-sans text-zinc-300 leading-relaxed">
                  {EXP07_CONTENT.screen13.beat2}
                </p>
                <p className="text-base sm:text-lg font-serif italic text-amber-300 font-semibold">
                  {EXP07_CONTENT.screen13.beat3}
                </p>
              </div>
            )}

            <CTAReveal isRevealed={isCTARevealed} className="pt-6">
              <PrimaryCTA
                id="btn-exp07-complete-to-exp08"
                onClick={handleCompleteExperience}
              >
                {EXP07_CONTENT.screen13.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}
      </main>

      {/* Footer / Brand watermark */}
      <footer className="w-full max-w-2xl mx-auto text-center py-4 border-t border-zinc-900">
        <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
          CONTEXTO™ · SISTEMA DE COMPRENSIÓN RELACIONAL
        </p>
      </footer>
    </div>
  );
};
