// EXP_06 — CONTEXTO™ (Narrative Experience V1.0 Integration)
import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { ExperienceId } from '../../engine/state/types';
import { EXP06_CONTENT } from './exp06Content';
import { EXP06_DEFINITION } from './exp06Definition';
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
import { Volume2, VolumeX, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNarrativePacing, CTAReveal, NarrativeBeat } from '../../engine/pacing';

export const EXP06: React.FC<ExperienceComponentProps> = ({
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
        experience: 'exp06',
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
      const exp06Responses = (prev.responses.exp06 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp06: {
            ...exp06Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp06',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_06
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp06');
    if (existing && existing.currentScreen && EXP06_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp06',
      currentScreen: 'screen_01_question',
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

  // Narrative Beats Configuration for EXP_06
  const currentBeats: NarrativeBeat[] = useMemo(() => {
    switch (currentScreenId) {
      case 'screen_01_question':
        return [
          { id: 'caseId', stage: 1, pacing: 'SHORT', label: 'Caso ID Eyebrow' },
          { id: 'beat1', stage: 2, pacing: 'LONG', label: 'Ya encontramos la pieza' },
          { id: 'beat2', stage: 3, pacing: 'MEDIUM', label: 'Ahora viene la pregunta importante' },
          { id: 'beat3', stage: 4, pacing: 'REVELATION', label: '¿Cómo utilizarla?' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_02_information':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Saber que existe no cambia nada' },
          { id: 'beat2', stage: 2, pacing: 'MEDIUM', label: 'Lo que cambia algo...' },
          { id: 'beat3', stage: 3, pacing: 'LONG', label: 'Tener la información cuando la necesitas' },
          { id: 'triggers', stage: 4, pacing: 'REVELATION', label: 'Antes de conversar / interpretar / reaccionar' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_03_practical_problem':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'Pero hay un problema' },
          { id: 'q1', stage: 2, pacing: 'MEDIUM', label: '¿Vas a recordar el ciclo?' },
          { id: 'q2', stage: 3, pacing: 'MEDIUM', label: '¿Vas a calcularlo mentalmente?' },
          { id: 'q3', stage: 4, pacing: 'LONG', label: '¿Vas a buscar una fecha cada vez?' },
          { id: 'verdict', stage: 5, pacing: 'MEDIUM', label: 'Probablemente no' },
          { id: 'resolution', stage: 6, pacing: 'REVELATION', label: 'Necesitas que sea fácil de consultar' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_04_idea':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'Entonces...' },
          { id: 'hypo', stage: 2, pacing: 'LONG', label: '¿Y si no tuvieras que adivinar?' },
          { id: 'question', stage: 3, pacing: 'LONG', label: '¿Y si pudieras consultar el contexto?' },
          { id: 'points', stage: 4, pacing: 'REVELATION', label: 'Sin tarea / Sin estudiar / Sin memorizar' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_05_first_revelation':
        return [
          { id: 'beat1_2', stage: 1, pacing: 'MEDIUM', label: 'Herramienta sencilla para una sola cosa' },
          { id: 'beat3_4', stage: 2, pacing: 'LONG', label: 'Recordar que el momento importa' },
          { id: 'question', stage: 3, pacing: 'MEDIUM', label: 'Pregunta de Micro-interacción' },
          { id: 'options', stage: 4, pacing: 'MANUAL', label: 'Opciones de Interacción', isOptions: true },
          { id: 'feedback', stage: 5, pacing: 'MEDIUM', label: 'Feedback Adaptativo' },
          { id: 'convergence', stage: 6, pacing: 'REVELATION', label: 'Llegar a la conversación con más contexto' },
          { id: 'cta', stage: 7, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_06_contexto_born':
        return [
          { id: 'lead', stage: 1, pacing: 'LONG', label: 'Una forma de tener contexto' },
          { id: 'brandReveal', stage: 2, pacing: 'REVELATION', label: 'CONTEXTO™ Nombre' },
          { id: 'tagline', stage: 3, pacing: 'LONG', label: 'Micro-App para comprender mejor el momento' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Ver Cómo Funciona', isCTA: true },
        ];
      case 'screen_07_how_it_works':
        return [
          { id: 'step1', stage: 1, pacing: 'MEDIUM', label: 'Paso 01: Registras inicio' },
          { id: 'step2', stage: 2, pacing: 'MEDIUM', label: 'Paso 02: Calcula momento' },
          { id: 'step3', stage: 3, pacing: 'MEDIUM', label: 'Paso 03: Muestra información' },
          { id: 'step4', stage: 4, pacing: 'MEDIUM', label: 'Paso 04: Ayuda a considerar' },
          { id: 'closing', stage: 5, pacing: 'REVELATION', label: 'Sin tecnicismos' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_08_input_data':
        return [
          { id: 'beat1', stage: 1, pacing: 'MEDIUM', label: 'Solo necesitas un dato' },
          { id: 'dominantData', stage: 2, pacing: 'REVELATION', label: 'El primer día de su menstruación' },
          { id: 'beat2_3', stage: 3, pacing: 'LONG', label: 'Ubicar el momento aproximado' },
          { id: 'clarification', stage: 4, pacing: 'MEDIUM', label: 'Sin cálculos mentales' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_09_daily_index':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'Saber la fase no es suficiente' },
          { id: 'conceptReveal', stage: 2, pacing: 'REVELATION', label: 'ÍNDICE DE CONEXIÓN DIARIA™' },
          { id: 'pillars', stage: 3, pacing: 'LONG', label: 'Pilares de Orientación Breve' },
          { id: 'examples', stage: 4, pacing: 'LONG', label: 'Ejemplos Conceptuales Cotidianos' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_10_real_situation':
        return [
          { id: 'situation1', stage: 1, pacing: 'LONG', label: 'Llegas a casa, está cansada' },
          { id: 'situation2', stage: 2, pacing: 'LONG', label: '¿Está molesta conmigo?' },
          { id: 'pivot', stage: 3, pacing: 'LONG', label: '¿En qué momento del ciclo está?' },
          { id: 'resolution', stage: 4, pacing: 'REVELATION', label: 'No da la respuesta. Te da contexto.' },
          { id: 'cta', stage: 5, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_11_before_after':
        return [
          { id: 'before', stage: 1, pacing: 'LONG', label: 'Antes: Sin Contexto' },
          { id: 'after', stage: 2, pacing: 'LONG', label: 'Después: Con Contexto™' },
          { id: 'note', stage: 3, pacing: 'REVELATION', label: 'Te prepara para conversar mejor' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_12_what_it_does_not_do':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'Lo que Contexto™ NO hace' },
          { id: 'limits', stage: 2, pacing: 'LONG', label: 'No predice / No diagnostica / No sustituye hablar' },
          { id: 'closure', stage: 3, pacing: 'REVELATION', label: 'Comprender no significa asumir' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_13_what_it_can_do':
        return [
          { id: 'lead', stage: 1, pacing: 'MEDIUM', label: 'Lo que sí puede hacer' },
          { id: 'coordinates', stage: 2, pacing: 'LONG', label: 'Una referencia / Un momento / Un contexto' },
          { id: 'centralPromise', stage: 3, pacing: 'REVELATION', label: 'Comprender antes de reaccionar' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_14_transition_future':
        return [
          { id: 'lead1', stage: 1, pacing: 'MEDIUM', label: 'Ya sabes qué es Contexto™' },
          { id: 'lead2_3', stage: 2, pacing: 'LONG', label: 'Imaginar tu día a día' },
          { id: 'dominantQuestion', stage: 3, pacing: 'REVELATION', label: '¿Cómo sería tu relación con este contexto?' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Ver el Futuro', isCTA: true },
        ];
      default:
        return [];
    }
  }, [currentScreenId]);

  // Hook into Narrative Pacing System
  const { stage: screenStage, isCTARevealed, isOptionsRevealed, advanceStage } = useNarrativePacing({
    experienceId: 'exp06',
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
        currentExperience: 'exp06',
        currentScreen: currentScreenId,
      },
    }));

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { screenId: currentScreenId },
    });

    if (currentScreenId === 'screen_05_first_revelation') {
      eventTracker.trackEvent('QUESTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
        payload: { screenId: currentScreenId },
      });
    }
  }, [currentScreenId, state.session.sessionId, state.session.caseId, updateState]);

  // Initial event tracker on mount
  useEffect(() => {
    eventTracker.trackEvent('EXP06_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
    });
    memoryManagerRef.current.setMemory('exp06.started', true, 'global');
  }, [state.session.sessionId, state.session.caseId]);

  // Read saved responses
  const savedResponses = (state.responses.exp06 || {}) as Record<string, unknown>;
  const toolValueReactionCode = (savedResponses['exp06.toolValueReactionCode'] ||
    savedResponses['toolValueReactionCode']) as 'A' | 'B' | 'C' | 'D' | undefined;

  const reactionFeedback = useMemo(() => {
    const opt = EXP06_CONTENT.screen05.options.find((o) => o.code === toolValueReactionCode);
    return opt?.feedback || EXP06_CONTENT.screen05.options[0].feedback;
  }, [toolValueReactionCode]);

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

  // Handler for Screen 05 Micro-Interaction
  const handleSelectReaction = (code: 'A' | 'B' | 'C' | 'D', label: string) => {
    if (toolValueReactionCode || isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { questionId: 'exp06_q_reaction', choiceCode: code, choiceLabel: label },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp06.toolValueReaction', value: label, scope: 'global' },
      { key: 'exp06.toolValueReactionCode', value: code, scope: 'global' },
      { key: 'exp06.questionAnswered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { questionId: 'exp06_q_reaction', answer: label, code },
    });

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { key: 'exp06.toolValueReaction', value: label },
    });

    advanceStage();
    setIsProcessing(false);
  };

  // Register conceptual comprehension insights
  useEffect(() => {
    if (currentScreenId === 'screen_06_contexto_born' && screenStage >= 2) {
      memoryManagerRef.current.setMemory('exp06.productRecognized', true, 'global');
      memoryManagerRef.current.setMemory('exp06.productNameRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
        payload: { insight: 'product_recognized', screen: 'screen_06_contexto_born' },
      });
    }
    if (currentScreenId === 'screen_07_how_it_works' && screenStage >= 4) {
      memoryManagerRef.current.setMemory('exp06.mechanismUnderstood', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
        payload: { insight: 'mechanism_understood', screen: 'screen_07_how_it_works' },
      });
    }
    if (currentScreenId === 'screen_08_input_data' && screenStage >= 2) {
      memoryManagerRef.current.setMemory('exp06.cycleStartInputUnderstood', true, 'global');
    }
    if (currentScreenId === 'screen_09_daily_index' && screenStage >= 2) {
      memoryManagerRef.current.setMemory('exp06.dailyIndexUnderstood', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
        payload: { insight: 'daily_index_understood', screen: 'screen_09_daily_index' },
      });
    }
    if (currentScreenId === 'screen_10_real_situation' && screenStage >= 4) {
      memoryManagerRef.current.setMemory('exp06.contextValueRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
        payload: { insight: 'context_value_recognized', screen: 'screen_10_real_situation' },
      });
    }
    if (currentScreenId === 'screen_12_what_it_does_not_do' && screenStage >= 2) {
      memoryManagerRef.current.setMemory('exp06.limitationsUnderstood', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
        payload: { insight: 'limitations_understood', screen: 'screen_12_what_it_does_not_do' },
      });
    }
    if (currentScreenId === 'screen_14_transition_future' && screenStage >= 3) {
      memoryManagerRef.current.setMemory('exp06.futureCuriosity', true, 'global');
    }
  }, [currentScreenId, screenStage, state.session.sessionId, state.session.caseId]);

  // Complete EXP_06 and unlock EXP_07
  const handleCompleteExp06 = () => {
    if (isCompletedGuard || completingRef.current) return;
    completingRef.current = true;
    setIsCompletedGuard(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { action: 'complete_exp06', label: EXP06_CONTENT.screen14.ctaLabel },
    });

    const now = new Date().toISOString();
    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      productRecognized: true,
      productNameRecognized: true,
      mechanismUnderstood: true,
      cycleStartInputUnderstood: true,
      dailyIndexUnderstood: true,
      contextValueRecognized: true,
      limitationsUnderstood: true,
      futureCuriosity: true,
      completed: true,
      completedAt: now,
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp06.productRecognized', value: true, scope: 'global' },
      { key: 'exp06.productNameRecognized', value: true, scope: 'global' },
      { key: 'exp06.mechanismUnderstood', value: true, scope: 'global' },
      { key: 'exp06.cycleStartInputUnderstood', value: true, scope: 'global' },
      { key: 'exp06.dailyIndexUnderstood', value: true, scope: 'global' },
      { key: 'exp06.contextValueRecognized', value: true, scope: 'global' },
      { key: 'exp06.limitationsUnderstood', value: true, scope: 'global' },
      { key: 'exp06.futureCuriosity', value: true, scope: 'global' },
      { key: 'exp06.completed', value: true, scope: 'global' },
      { key: 'exp06.completedAt', value: now, scope: 'global' },
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

    eventTracker.trackEvent('EXP06_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { memory: finalMemory },
    });

    eventTracker.trackEvent('EXPERIENCE_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { experienceId: 'exp06' },
    });

    // Update FunnelState completed experiences
    updateState((prev) => {
      const alreadyCompleted = prev.progress.completedExperiences.includes('exp06');
      const updatedList: ExperienceId[] = alreadyCompleted
        ? prev.progress.completedExperiences
        : [...prev.progress.completedExperiences, 'exp06'];

      return {
        ...prev,
        progress: {
          ...prev.progress,
          completedExperiences: updatedList,
          completionPercentage: Math.max(prev.progress.completionPercentage, 75),
        },
      };
    });

    // Navigate to EXP_07
    onComplete(finalMemory);
  };

  return (
    <div
      id="exp06-root-container"
      className="relative min-h-[90vh] flex flex-col justify-between items-center bg-[#050505] text-neutral-100 px-4 sm:px-6 py-6 sm:py-10 selection:bg-orange-500/20 selection:text-orange-200"
    >
      {/* Top Bar with Minimal Case Reference & Audio Control */}
      <header
        id="exp06-header"
        className="w-full max-w-xl flex items-center justify-between py-2 mb-4 border-b border-[#141414]"
      >
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            CASO #{caseId}
          </span>
          <span className="text-[10px] text-neutral-700 font-mono">/</span>
          <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
            EXP_06
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            id="exp06-audio-toggle"
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
      <main id="exp06-main-stage" className="w-full max-w-xl flex-1 flex flex-col justify-center my-auto">
        {/* ========================================================================= */}
        {/* SCREEN 01 — LA PREGUNTA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_01_question' && (
          <div
            id="screen-01-question"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen01.eyebrow}
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
                  {EXP06_CONTENT.screen01.beat1}
                </h1>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-400 font-serif italic">
                  {EXP06_CONTENT.screen01.beat2}
                </p>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400 leading-snug">
                    {EXP06_CONTENT.screen01.beat3}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-01-cta"
                onClick={() => advanceToScreen('screen_02_information')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen01.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 02 — LA INFORMACIÓN */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_02_information' && (
          <div
            id="screen-02-information"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen02.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-300 font-body">
                  {EXP06_CONTENT.screen02.beat1}
                </p>
              </div>

              <div className="space-y-2">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-400 font-serif italic">
                    {EXP06_CONTENT.screen02.beat2}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xl sm:text-2xl font-serif italic text-white leading-snug">
                    {EXP06_CONTENT.screen02.beat3}
                  </p>
                </div>
              </div>

              {/* Three Pre-Action Triggers */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-2.5 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP06_CONTENT.screen02.triggers.map((trigger, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span className="text-base sm:text-lg font-serif italic text-neutral-200">
                      {trigger.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-02-cta"
                onClick={() => advanceToScreen('screen_03_practical_problem')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen02.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 03 — EL PROBLEMA PRÁCTICO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_03_practical_problem' && (
          <div
            id="screen-03-practical-problem"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen03.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-lg sm:text-xl font-serif italic text-neutral-400">
                  {EXP06_CONTENT.screen03.lead}
                </p>
              </div>

              <div className="space-y-3">
                {EXP06_CONTENT.screen03.questions.map((q, idx) => {
                  const stageThreshold = idx + 2;
                  const isVisible = screenStage >= stageThreshold;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl bg-[#080808] border border-[#181818] transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <p className="text-base sm:text-lg font-body text-neutral-300">{q}</p>
                    </div>
                  );
                })}
              </div>

              <div
                className={`pt-3 transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-500 font-mono italic">
                  {EXP06_CONTENT.screen03.verdict}
                </p>
              </div>

              <div
                className={`pt-2 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-orange-400 leading-snug">
                  {EXP06_CONTENT.screen03.resolution}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-03-cta"
                onClick={() => advanceToScreen('screen_04_idea')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen03.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 04 — LA IDEA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_04_idea' && (
          <div
            id="screen-04-idea"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen04.eyebrow}
                </span>
              </div>

              <div className="space-y-2">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider">
                    {EXP06_CONTENT.screen04.lead}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-2xl sm:text-3xl font-serif italic text-white leading-relaxed">
                    {EXP06_CONTENT.screen04.hypothesis}
                  </p>
                </div>
              </div>

              <div
                className={`pt-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-lg sm:text-xl font-serif italic text-orange-400">
                  {EXP06_CONTENT.screen04.question}
                </p>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP06_CONTENT.screen04.simplicityPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm sm:text-base text-neutral-400">
                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-04-cta"
                onClick={() => advanceToScreen('screen_05_first_revelation')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen04.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 05 — MICRO-INTERACCIÓN & PRIMERA REVELACIÓN */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_05_first_revelation' && (
          <div
            id="screen-05-first-revelation"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen05.eyebrow}
                </span>
              </div>

              <div className="space-y-1">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-400 font-body">
                    {EXP06_CONTENT.screen05.beat1} {EXP06_CONTENT.screen05.beat2}
                  </p>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-2xl sm:text-3xl font-serif italic text-white leading-relaxed">
                    {EXP06_CONTENT.screen05.beat3}
                  </p>
                  <p className="text-sm text-neutral-400 font-serif italic mt-1">
                    {EXP06_CONTENT.screen05.beat4}
                  </p>
                </div>
              </div>

              {/* Question */}
              <div
                className={`pt-2 space-y-1 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm text-neutral-400 font-body">
                  {EXP06_CONTENT.screen05.questionIntro}
                </p>
                <p className="text-lg font-serif italic text-neutral-200">
                  {EXP06_CONTENT.screen05.question}
                </p>
              </div>

              {/* Options */}
              {isOptionsRevealed && !toolValueReactionCode && (
                <div className="space-y-3 pt-2 animate-fade-in">
                  {EXP06_CONTENT.screen05.options.map((opt) => (
                    <ChoiceButton
                      key={opt.id}
                      id={`choice-${opt.id}`}
                      code={opt.code}
                      selected={selectedOption === opt.code}
                      isAnySelected={selectedOption !== null}
                      onClick={() => handleSelectReaction(opt.code, opt.label)}
                      disabled={isProcessing || selectedOption !== null}
                    >
                      <span className="font-body text-base sm:text-lg">{opt.label}</span>
                    </ChoiceButton>
                  ))}
                </div>
              )}

              {/* Feedback & Convergence */}
              {toolValueReactionCode && (
                <div className="space-y-4 pt-4 border-t border-[#181818] animate-fade-in">
                  <div
                    className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 transition-all duration-1000 ${
                      screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider mb-1">
                      TU POSTURA
                    </p>
                    <p className="text-base font-serif italic text-white">
                      “{savedResponses['exp06.toolValueReaction'] as string}”
                    </p>
                    <p className="text-sm text-neutral-300 font-body mt-2">
                      {reactionFeedback}
                    </p>
                  </div>

                  <div
                    className={`pt-2 transition-all duration-1000 ${
                      screenStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <p className="text-base text-neutral-300 font-body">
                      {EXP06_CONTENT.screen05.convergenceLead}
                    </p>
                    <p className="text-xl sm:text-2xl font-serif italic text-orange-400 mt-1">
                      {EXP06_CONTENT.screen05.convergenceClosure}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {toolValueReactionCode && (
              <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
                <PrimaryCTA
                  id="screen-05-cta"
                  onClick={() => advanceToScreen('screen_06_contexto_born')}
                  disabled={isProcessing}
                >
                  {EXP06_CONTENT.screen05.ctaLabel}
                </PrimaryCTA>
              </CTAReveal>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 06 — NACE CONTEXTO™ (REVELACIÓN PRINCIPAL) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_06_contexto_born' && (
          <div
            id="screen-06-contexto-born"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-12"
          >
            <div className="space-y-8 text-center w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500">
                  {EXP06_CONTENT.screen06.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-lg sm:text-xl font-serif italic text-neutral-400">
                  {EXP06_CONTENT.screen06.lead}
                </p>
              </div>

              {/* Product Name Reveal: Blur-to-focus, Minimal Scale, Pure Restraint */}
              <div
                className={`py-8 transition-all duration-1000 ${
                  screenStage >= 2
                    ? 'opacity-100 blur-0 scale-100'
                    : 'opacity-0 blur-md scale-95'
                }`}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-[0.15em] text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                  {EXP06_CONTENT.screen06.brandName}
                </h1>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent mx-auto mt-4" />
              </div>

              <div
                className={`pt-4 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg text-neutral-300 font-body max-w-md mx-auto leading-relaxed">
                  {EXP06_CONTENT.screen06.tagline}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-06-cta-ver-como-funciona"
                onClick={() => advanceToScreen('screen_07_how_it_works')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen06.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 07 — CÓMO FUNCIONA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_07_how_it_works' && (
          <div
            id="screen-07-how-it-works"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen07.eyebrow}
                </span>
              </div>

              {/* 4 Steps Sequence */}
              <div className="space-y-3">
                {EXP06_CONTENT.screen07.steps.map((step, idx) => {
                  const stageThreshold = idx + 1;
                  const isVisible = screenStage >= stageThreshold;
                  return (
                    <div
                      key={step.number}
                      className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-1.5 transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-[#141414] pb-1">
                        <span className="text-[10px] font-mono tracking-widest text-neutral-500">
                          PASO {step.stepCode}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141414] text-neutral-300 uppercase tracking-wider">
                          {step.badge}
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-serif italic text-white font-medium">
                        {step.title}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-400 font-body">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div
                className={`pt-3 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-400 italic">
                  {EXP06_CONTENT.screen07.closingNote}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-07-cta"
                onClick={() => advanceToScreen('screen_08_input_data')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen07.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 08 — EL DATO QUE NECESITAS */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_08_input_data' && (
          <div
            id="screen-08-input-data"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen08.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP06_CONTENT.screen08.beat1}
                </p>
              </div>

              {/* Single Input Highlight */}
              <div
                className={`p-6 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 space-y-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  PUNTO DE PARTIDA
                </span>
                <p className="text-xl sm:text-2xl font-serif italic text-white">
                  {EXP06_CONTENT.screen08.dominantData}
                </p>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP06_CONTENT.screen08.beat2}
                </p>
                <p className="text-base sm:text-lg text-neutral-300 font-serif italic">
                  {EXP06_CONTENT.screen08.beat3}
                </p>
              </div>

              <div
                className={`pt-2 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xs sm:text-sm text-neutral-500 font-body">
                  {EXP06_CONTENT.screen08.clarification}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-08-cta"
                onClick={() => advanceToScreen('screen_09_daily_index')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen08.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 09 — EL ÍNDICE DE CONEXIÓN DIARIA™ */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_09_daily_index' && (
          <div
            id="screen-09-daily-index"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen09.eyebrow}
                </span>
              </div>

              <div className="space-y-1">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-400 font-body">
                    {EXP06_CONTENT.screen09.lead1}
                  </p>
                  <p className="text-base text-neutral-300 font-body">
                    {EXP06_CONTENT.screen09.lead2}
                  </p>
                </div>

                <div
                  className={`pt-3 transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white">
                    {EXP06_CONTENT.screen09.dominantConcept}
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 tracking-wider mt-1 uppercase">
                    {EXP06_CONTENT.screen09.conceptSubtitle}
                  </p>
                </div>
              </div>

              {/* Pillars */}
              <div
                className={`grid grid-cols-2 gap-2 pt-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP06_CONTENT.screen09.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#0A0A0A] border border-[#181818] flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange-400" />
                    <span className="text-xs sm:text-sm text-neutral-300 font-body">
                      {pillar.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Conceptual Daily Guidance Examples */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-2.5 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  EJEMPLOS CONCEPTUALES
                </span>
                <div className="space-y-2">
                  {EXP06_CONTENT.screen09.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#080808] border border-[#161616] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-widest text-neutral-500">
                          {ex.tag}
                        </span>
                      </div>
                      <p className="text-sm font-serif italic text-neutral-200">
                        “{ex.guidance}”
                      </p>
                      <p className="text-xs text-neutral-400 font-body">
                        {ex.reflection}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-09-cta"
                onClick={() => advanceToScreen('screen_10_real_situation')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen09.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 10 — UNA SITUACIÓN REAL */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_10_real_situation' && (
          <div
            id="screen-10-real-situation"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen10.eyebrow}
                </span>
              </div>

              {/* Case Story Progression */}
              <div className="space-y-2">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base sm:text-lg text-neutral-300 font-body">
                    {EXP06_CONTENT.screen10.situationBeats[0]}
                  </p>
                  <p className="text-base text-neutral-400 font-body">
                    {EXP06_CONTENT.screen10.situationBeats[1]} {EXP06_CONTENT.screen10.situationBeats[2]}
                  </p>
                </div>

                <div
                  className={`pt-2 transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-sm font-mono text-neutral-500">
                    {EXP06_CONTENT.screen10.situationBeats[3]}
                  </p>
                  <p className="text-xl sm:text-2xl font-serif italic text-white">
                    {EXP06_CONTENT.screen10.situationBeats[4]}
                  </p>
                </div>
              </div>

              {/* The Pivotal Question */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider">
                  {EXP06_CONTENT.screen10.pivotLead}
                </p>
                <p className="text-2xl sm:text-3xl font-serif italic text-orange-400">
                  {EXP06_CONTENT.screen10.pivotQuestion}
                </p>
              </div>

              {/* Revelation Resolution */}
              <div
                className={`pt-3 space-y-1 transition-all duration-1000 ${
                  screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP06_CONTENT.screen10.resolution1}
                </p>
                <p className="text-2xl sm:text-3xl font-serif italic text-white">
                  {EXP06_CONTENT.screen10.resolutionDominant}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-10-cta"
                onClick={() => advanceToScreen('screen_11_before_after')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen10.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 11 — ANTES / DESPUÉS */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_11_before_after' && (
          <div
            id="screen-11-before-after"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen11.eyebrow}
                </span>
              </div>

              {/* Before vs After Stack */}
              <div className="space-y-4">
                {/* Before */}
                <div
                  className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] space-y-2 transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    {EXP06_CONTENT.screen11.beforeTitle}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-400 font-body">
                    {EXP06_CONTENT.screen11.beforeFlow.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span>{step}</span>
                        {idx < EXP06_CONTENT.screen11.beforeFlow.length - 1 && (
                          <span className="text-neutral-700">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* After */}
                <div
                  className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 space-y-2 transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400">
                    {EXP06_CONTENT.screen11.afterTitle}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-white font-body">
                    {EXP06_CONTENT.screen11.afterFlow.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className={idx === 2 ? 'text-orange-400 font-medium' : ''}>
                          {step}
                        </span>
                        {idx < EXP06_CONTENT.screen11.afterFlow.length - 1 && (
                          <span className="text-neutral-600">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dialogue Safety Note */}
              <div
                className={`pt-3 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-serif italic text-neutral-400">
                  {EXP06_CONTENT.screen11.dialogueNote}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-11-cta"
                onClick={() => advanceToScreen('screen_12_what_it_does_not_do')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen11.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 12 — LO QUE CONTEXTO™ NO HACE */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_12_what_it_does_not_do' && (
          <div
            id="screen-12-what-it-does-not-do"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen12.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-white">
                  {EXP06_CONTENT.screen12.warningLead}
                </p>
              </div>

              {/* Limits Stack */}
              <div
                className={`space-y-2.5 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP06_CONTENT.screen12.limits.map((lim, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#080808] border border-[#1C1C1C] flex items-start space-x-3"
                  >
                    <span className="text-neutral-500 text-xs font-mono mt-0.5">✕</span>
                    <span className="text-sm sm:text-base text-neutral-300 font-body">
                      {lim}
                    </span>
                  </div>
                ))}
              </div>

              {/* Epistemological Safety Closure */}
              <div
                className={`pt-4 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-orange-400">
                  {EXP06_CONTENT.screen12.closurePrinciple}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-12-cta"
                onClick={() => advanceToScreen('screen_13_what_it_can_do')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen12.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 13 — LO QUE SÍ PUEDE HACER (FRASE CENTRAL) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_13_what_it_can_do' && (
          <div
            id="screen-13-what-it-can-do"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-10"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen13.eyebrow}
                </span>
              </div>

              <div className="space-y-1">
                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-base text-neutral-400 font-body">
                    {EXP06_CONTENT.screen13.lead1}
                  </p>
                  <p className="text-lg sm:text-xl font-serif italic text-neutral-200">
                    {EXP06_CONTENT.screen13.lead2}
                  </p>
                </div>
              </div>

              {/* Three Coordinates */}
              <div
                className={`flex flex-wrap gap-3 pt-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP06_CONTENT.screen13.coordinates.map((coord, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-[#0E0E0E] border border-[#222222] text-sm text-neutral-300 font-mono"
                  >
                    {coord}
                  </span>
                ))}
              </div>

              {/* Central Core Promise of Contexto™ */}
              <div
                className={`pt-6 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white leading-tight">
                  “{EXP06_CONTENT.screen13.centralPromise}”
                </h2>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-13-cta"
                onClick={() => advanceToScreen('screen_14_transition_future')}
                disabled={isProcessing}
              >
                {EXP06_CONTENT.screen13.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 14 — TRANSICIÓN A EL FUTURO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_14_transition_future' && (
          <div
            id="screen-14-transition-future"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-10"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP06_CONTENT.screen14.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP06_CONTENT.screen14.lead1}
                </p>
                <p className="text-base text-neutral-300 font-serif italic">
                  {EXP06_CONTENT.screen14.lead2} {EXP06_CONTENT.screen14.lead3}
                </p>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono tracking-wider text-neutral-400 uppercase">
                  {EXP06_CONTENT.screen14.questionIntro}
                </p>

                <div
                  className={`transition-all duration-1000 ${
                    screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400 leading-snug">
                    {EXP06_CONTENT.screen14.dominantQuestion}
                  </h3>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-14-cta-ver-el-futuro"
                onClick={handleCompleteExp06}
                disabled={isProcessing || isCompletedGuard}
              >
                {EXP06_CONTENT.screen14.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}
      </main>

      {/* Minimal Bottom Bar */}
      <footer
        id="exp06-footer"
        className="w-full max-w-xl flex items-center justify-between pt-4 mt-auto border-t border-[#121212] text-[10px] font-mono text-neutral-600"
      >
        <span>DESCUBRIMIENTO // EXP_06</span>
        <span className="uppercase">{currentScreenId.replace('screen_', '').replace(/_/g, ' ')}</span>
      </footer>
    </div>
  );
};
