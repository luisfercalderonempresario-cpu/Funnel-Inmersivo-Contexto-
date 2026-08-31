// EXP_08 — LA REVELACIÓN (Narrative Experience V1.0 Integration)
import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { ExperienceId } from '../../engine/state/types';
import { EXP08_CONTENT, ChoiceOption } from './exp08Content';
import { EXP08_DEFINITION } from './exp08Definition';
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
import { Volume2, VolumeX, ShieldCheck, Sparkles, Compass, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { useNarrativePacing, CTAReveal, NarrativeBeat } from '../../engine/pacing';

export const EXP08: React.FC<ExperienceComponentProps> = ({
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
        experience: 'exp08',
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
      const exp08Responses = (prev.responses.exp08 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp08: {
            ...exp08Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp08',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_08
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp08');
    if (existing && existing.currentScreen && EXP08_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp08',
      currentScreen: 'screen_01_silence',
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

  // Narrative Beats Configuration for EXP_08
  const currentBeats: NarrativeBeat[] = useMemo(() => {
    switch (currentScreenId) {
      case 'screen_01_silence':
        return [
          { id: 'caseId', stage: 1, pacing: 'SHORT', label: 'Caso ID Eyebrow' },
          { id: 'beat1', stage: 2, pacing: 'LONG', label: 'Antes de terminar...' },
          { id: 'beat2', stage: 3, pacing: 'REVELATION', label: 'Mires todo lo que acabas de descubrir' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Revisar el Caso', isCTA: true },
        ];
      case 'screen_02_the_case':
        return [
          { id: 'beat1_3', stage: 1, pacing: 'LONG', label: 'Situación sencilla / Ella cambió / Reaccionaste' },
          { id: 'question1', stage: 2, pacing: 'LONG', label: '¿Qué está pasando?' },
          { id: 'question2', stage: 3, pacing: 'REVELATION', label: '¿Qué información me falta?' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_03_first_piece':
        return [
          { id: 'beat1', stage: 1, pacing: 'SHORT', label: 'Primero descubriste algo' },
          { id: 'beat2_3', stage: 2, pacing: 'LONG', label: 'A veces reaccionas a lo que crees que está pasando' },
          { id: 'badge', stage: 3, pacing: 'REVELATION', label: 'INTERPRETACIÓN' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_04_second_piece':
        return [
          { id: 'beat1_3', stage: 1, pacing: 'LONG', label: 'Buenas intenciones y aun así reaccionar mal' },
          { id: 'beat4_5', stage: 2, pacing: 'LONG', label: 'Intentando decidir con información incompleta' },
          { id: 'badge', stage: 3, pacing: 'REVELATION', label: 'INFORMACIÓN INCOMPLETA' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_05_third_piece':
        return [
          { id: 'beat1', stage: 1, pacing: 'LONG', label: 'Apareció la pieza que faltaba' },
          { id: 'beat2_4', stage: 2, pacing: 'LONG', label: 'El contexto / El momento / El ciclo' },
          { id: 'badge', stage: 3, pacing: 'REVELATION', label: 'CONTEXTO' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_06_the_connection':
        return [
          { id: 'patternA', stage: 1, pacing: 'LONG', label: 'Patrón Anterior: Interpretas -> Reaccionas' },
          { id: 'patternB', stage: 2, pacing: 'LONG', label: 'Patrón Nuevo: Consideras -> Observas' },
          { id: 'closure', stage: 3, pacing: 'REVELATION', label: 'Significa que tienes una pregunta mejor' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_07_the_discovery':
        return [
          { id: 'lead', stage: 1, pacing: 'SHORT', label: 'Quizá eso era lo que estabas buscando' },
          { id: 'negations', stage: 2, pacing: 'LONG', label: 'No fórmula / No predecir / No respuesta automática' },
          { id: 'dominant', stage: 3, pacing: 'REVELATION', label: 'Una forma de llegar con más contexto' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_08_the_real_problem':
        return [
          { id: 'lead', stage: 1, pacing: 'SHORT', label: 'El problema nunca fue no saber qué hacer' },
          { id: 'headline', stage: 2, pacing: 'REVELATION', label: 'TENER QUE DECIDIR SIN VER EL CONTEXTO COMPLETO' },
          { id: 'purpose', stage: 3, pacing: 'LONG', label: 'Por qué Contexto™ puede tener sentido' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_09_the_tool':
        return [
          { id: 'title', stage: 1, pacing: 'SHORT', label: 'CONTEXTO™' },
          { id: 'steps', stage: 2, pacing: 'LONG', label: 'Flujo 4 pasos de la Micro-App' },
          { id: 'authority', stage: 3, pacing: 'REVELATION', label: 'Y decides tú' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_10_the_decision':
        return [
          { id: 'lead', stage: 1, pacing: 'SHORT', label: 'Contexto™ no decide por ti' },
          { id: 'boundaries', stage: 2, pacing: 'LONG', label: 'Límites éticos y de responsabilidad' },
          { id: 'autonomy', stage: 3, pacing: 'REVELATION', label: 'Te da una pieza. Tú decides qué hacer con ella.' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_11_the_invitation':
        return [
          { id: 'question', stage: 1, pacing: 'SHORT', label: '¿Qué crees que habría cambiado?' },
          { id: 'options', stage: 2, pacing: 'MANUAL', label: 'Opciones de Autoevaluación', isOptions: true },
          { id: 'feedback', stage: 3, pacing: 'LONG', label: 'Feedback Adaptativo' },
          { id: 'invitationLead', stage: 4, pacing: 'LONG', label: 'Has estado buscando respuesta en el contexto' },
          { id: 'invitationClosure', stage: 5, pacing: 'REVELATION', label: 'Contexto™ listo para acompañarte' },
          { id: 'cta', stage: 6, pacing: 'MANUAL', label: 'Botón Continuar', isCTA: true },
        ];
      case 'screen_12_case_closing':
        return [
          { id: 'header', stage: 1, pacing: 'SHORT', label: 'Caso ID & Investigación Completada' },
          { id: 'finding', stage: 2, pacing: 'REVELATION', label: 'HALLAZGO PRINCIPAL' },
          { id: 'closure', stage: 3, pacing: 'LONG', label: 'Posibilidad de llevarlo contigo' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Ver Paso Final', isCTA: true },
        ];
      case 'screen_13_final_step':
        return [
          { id: 'beat1', stage: 1, pacing: 'LONG', label: 'El caso termina aquí' },
          { id: 'beat2', stage: 2, pacing: 'LONG', label: 'Pero tu relación continúa' },
          { id: 'question', stage: 3, pacing: 'REVELATION', label: '¿Quieres llevar Contexto™ contigo?' },
          { id: 'cta', stage: 4, pacing: 'MANUAL', label: 'Botón Quiero Contexto™', isCTA: true },
        ];
      default:
        return [];
    }
  }, [currentScreenId]);

  // Hook into Narrative Pacing System
  const { stage: screenStage, isCTARevealed, advanceStage } = useNarrativePacing({
    experienceId: 'exp08',
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
        currentExperience: 'exp08',
        currentScreen: currentScreenId,
      },
    }));

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp08',
      payload: { screenId: currentScreenId },
    });

    if (currentScreenId === 'screen_11_the_invitation') {
      eventTracker.trackEvent('QUESTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp08',
        payload: { screenId: currentScreenId },
      });
    }
  }, [currentScreenId, state.session.sessionId, state.session.caseId, updateState]);

  // Initial event tracker on mount
  useEffect(() => {
    eventTracker.trackEvent('EXP08_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp08',
    });
    memoryManagerRef.current.setMemory('exp08.started', true, 'global');
  }, [state.session.sessionId, state.session.caseId]);

  // Read saved responses
  const savedResponses = (state.responses.exp08 || {}) as Record<string, unknown>;
  const purchaseDesireCode = (savedResponses['exp08.purchaseDesireCode'] ||
    savedResponses['purchaseDesireCode']) as 'A' | 'B' | 'C' | 'D' | undefined;

  const reactionFeedback = useMemo(() => {
    const opt = EXP08_CONTENT.screen11.options.find((o) => o.code === purchaseDesireCode);
    return opt?.feedback || EXP08_CONTENT.screen11.options[0].feedback;
  }, [purchaseDesireCode]);

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

  // Handler for Screen 11 Microinteraction
  const handleSelectOption = (opt: ChoiceOption) => {
    if (purchaseDesireCode || isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(opt.code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp08',
      payload: { questionId: 'exp08_q_desire', choiceCode: opt.code, choiceLabel: opt.label },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp08.purchaseDesire', value: opt.label, scope: 'global' },
      { key: 'exp08.purchaseDesireCode', value: opt.code, scope: 'global' },
      { key: 'conversion.purchaseIntent', value: opt.intent, scope: 'global' },
    ]);

    // Save purchaseIntent directly to conversion state
    updateState((prev) => ({
      ...prev,
      conversion: {
        ...prev.conversion,
        purchaseIntent: opt.intent,
      },
    }));

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp08',
      payload: { questionId: 'exp08_q_desire', answer: opt.label, code: opt.code, intent: opt.intent },
    });

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp08',
      payload: { key: 'exp08.purchaseDesire', value: opt.label },
    });

    advanceStage();
    setIsProcessing(false);
  };

  // Register conceptual comprehension insights
  useEffect(() => {
    if (currentScreenId === 'screen_01_silence') {
      memoryManagerRef.current.setMemory('exp08.caseReviewStarted', true, 'global');
    }
    if (currentScreenId === 'screen_03_first_piece' && screenStage >= 3) {
      memoryManagerRef.current.setMemory('exp08.interpretationRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp08',
        payload: { insight: 'interpretation_recognized', screen: 'screen_03_first_piece' },
      });
    }
    if (currentScreenId === 'screen_04_second_piece' && screenStage >= 3) {
      memoryManagerRef.current.setMemory('exp08.incompleteInformationRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp08',
        payload: { insight: 'incomplete_information_recognized', screen: 'screen_04_second_piece' },
      });
    }
    if (currentScreenId === 'screen_05_third_piece' && screenStage >= 3) {
      memoryManagerRef.current.setMemory('exp08.contextRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp08',
        payload: { insight: 'context_recognized', screen: 'screen_05_third_piece' },
      });
    }
    if (currentScreenId === 'screen_06_the_connection' && screenStage >= 3) {
      memoryManagerRef.current.setMemory('exp08.connectionRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp08',
        payload: { insight: 'connection_recognized', screen: 'screen_06_the_connection' },
      });
    }
    if (currentScreenId === 'screen_08_the_real_problem' && screenStage >= 2) {
      memoryManagerRef.current.setMemory('exp08.coreProblemRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp08',
        payload: { insight: 'core_problem_recognized', screen: 'screen_08_the_real_problem' },
      });
    }
    if (currentScreenId === 'screen_09_the_tool' && screenStage >= 2) {
      memoryManagerRef.current.setMemory('exp08.productPurposeRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp08',
        payload: { insight: 'product_purpose_recognized', screen: 'screen_09_the_tool' },
      });
    }
    if (currentScreenId === 'screen_10_the_decision' && screenStage >= 3) {
      memoryManagerRef.current.setMemory('exp08.autonomyRecognized', true, 'global');
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp08',
        payload: { insight: 'autonomy_recognized', screen: 'screen_10_the_decision' },
      });
    }
  }, [currentScreenId, screenStage, state.session.sessionId, state.session.caseId]);

  // Complete EXP_08 and Transition to Sales Page (/compra)
  const handleCompleteExp08 = () => {
    if (isCompletedGuard || completingRef.current) return;
    completingRef.current = true;
    setIsCompletedGuard(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp08',
      payload: { action: 'complete_exp08', label: EXP08_CONTENT.screen13.ctaLabel },
    });

    const now = new Date().toISOString();
    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      caseReviewStarted: true,
      interpretationRecognized: true,
      incompleteInformationRecognized: true,
      contextRecognized: true,
      connectionRecognized: true,
      coreProblemRecognized: true,
      productPurposeRecognized: true,
      autonomyRecognized: true,
      completed: true,
      completedAt: now,
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp08.caseReviewStarted', value: true, scope: 'global' },
      { key: 'exp08.interpretationRecognized', value: true, scope: 'global' },
      { key: 'exp08.incompleteInformationRecognized', value: true, scope: 'global' },
      { key: 'exp08.contextRecognized', value: true, scope: 'global' },
      { key: 'exp08.connectionRecognized', value: true, scope: 'global' },
      { key: 'exp08.coreProblemRecognized', value: true, scope: 'global' },
      { key: 'exp08.productPurposeRecognized', value: true, scope: 'global' },
      { key: 'exp08.autonomyRecognized', value: true, scope: 'global' },
      { key: 'exp08.completed', value: true, scope: 'global' },
      { key: 'exp08.completedAt', value: now, scope: 'global' },
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

    eventTracker.trackEvent('EXP08_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp08',
      payload: { memory: finalMemory },
    });

    eventTracker.trackEvent('EXPERIENCE_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp08',
      payload: { experienceId: 'exp08' },
    });

    // Mark revelationCompleted and track SALES_PAGE_VIEWED
    updateState((prev) => {
      const alreadyCompleted = prev.progress.completedExperiences.includes('exp08');
      const updatedList: ExperienceId[] = alreadyCompleted
        ? prev.progress.completedExperiences
        : [...prev.progress.completedExperiences, 'exp08'];

      return {
        ...prev,
        revelation: {
          ...prev.revelation,
          reached: true,
          completed: true,
        },
        conversion: {
          ...prev.conversion,
          revelationCompleted: true,
          salesPageViewed: true,
          purchaseIntent: prev.conversion.purchaseIntent || 'high',
        },
        progress: {
          ...prev.progress,
          completedExperiences: updatedList,
          completionPercentage: 100,
        },
      };
    });

    eventTracker.trackEvent('SALES_PAGE_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'sales_page',
      payload: { caseId: state.session.caseId },
    });

    // Invoke funnel completion callback to navigate to /compra (Sales Page)
    onComplete(finalMemory);
  };

  return (
    <div
      id="exp08-root-container"
      className="relative min-h-[90vh] flex flex-col justify-between items-center bg-[#050505] text-neutral-100 px-4 sm:px-6 py-6 sm:py-10 selection:bg-orange-500/20 selection:text-orange-200"
    >
      {/* Top Bar with Minimal Case Reference & Audio Control */}
      <header
        id="exp08-header"
        className="w-full max-w-xl flex items-center justify-between py-2 mb-4 border-b border-[#141414]"
      >
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            CASO #{caseId}
          </span>
          <span className="text-[10px] text-neutral-700 font-mono">/</span>
          <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
            EXP_08 &bull; REVELACIÓN
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            id="exp08-audio-toggle"
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
      <main id="exp08-main-stage" className="w-full max-w-xl flex-1 flex flex-col justify-center my-auto">
        {/* ========================================================================= */}
        {/* SCREEN 01 — EL SILENCIO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_01_silence' && (
          <div
            id="screen-01-silence"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-10"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen01.eyebrow}
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
                  {EXP08_CONTENT.screen01.beat1}
                </h1>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-orange-400 leading-snug">
                  {EXP08_CONTENT.screen01.beat2}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-01-cta"
                onClick={() => advanceToScreen('screen_02_the_case')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen01.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 02 — EL CASO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_02_the_case' && (
          <div
            id="screen-02-the-case"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen02.eyebrow}
                </span>
              </div>

              <div
                className={`p-4 rounded-xl bg-[#080808] border border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP08_CONTENT.screen02.beat1}
                </p>
                <div className="flex items-center space-x-3 text-base text-neutral-300">
                  <span>{EXP08_CONTENT.screen02.beat2}</span>
                  <span className="text-neutral-600 font-mono">→</span>
                  <span className="text-white font-medium">{EXP08_CONTENT.screen02.beat3}</span>
                </div>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm text-neutral-400 font-body">
                  {EXP08_CONTENT.screen02.beat4}
                </p>
                <div className="p-3 rounded-lg bg-[#080808] border border-[#161616] text-neutral-400 font-serif italic text-lg line-through decoration-neutral-600">
                  {EXP08_CONTENT.screen02.initialQuestion}
                </div>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP08_CONTENT.screen02.shiftLead}
                </p>
                <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500">
                  <p className="text-2xl sm:text-3xl font-serif italic text-orange-400 font-medium">
                    {EXP08_CONTENT.screen02.transformedQuestion}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-02-cta"
                onClick={() => advanceToScreen('screen_03_first_piece')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen02.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 03 — LA PRIMERA PIEZA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_03_first_piece' && (
          <div
            id="screen-03-first-piece"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen03.eyebrow}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                  EVIDENCIA 01
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP08_CONTENT.screen03.beat1}
                </p>
              </div>

              <div
                className={`space-y-3 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base text-neutral-400 font-body">
                  {EXP08_CONTENT.screen03.beat2}
                </p>
                <p className="text-xl sm:text-2xl font-serif italic text-white leading-snug">
                  {EXP08_CONTENT.screen03.beat3}
                </p>
              </div>

              {/* Sober Evidence Card */}
              <div
                className={`pt-4 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="p-5 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-neutral-400 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
                    PIEZA 01
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif italic text-white tracking-wide">
                    {EXP08_CONTENT.screen03.badge}
                  </h3>
                  <p className="text-xs text-neutral-400 font-body pt-1">
                    {EXP08_CONTENT.screen03.caption}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-03-cta"
                onClick={() => advanceToScreen('screen_04_second_piece')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen03.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 04 — LA SEGUNDA PIEZA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_04_second_piece' && (
          <div
            id="screen-04-second-piece"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen04.eyebrow}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                  EVIDENCIA 02
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP08_CONTENT.screen04.beat1}
                </p>
                <p className="text-base text-neutral-300 font-body">
                  {EXP08_CONTENT.screen04.beat2}
                </p>
                <p className="text-lg font-serif italic text-white">
                  {EXP08_CONTENT.screen04.beat3}
                </p>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm text-neutral-500 font-body italic">
                  {EXP08_CONTENT.screen04.beat4}
                </p>
                <p className="text-lg sm:text-xl font-serif italic text-orange-400/90 leading-snug">
                  {EXP08_CONTENT.screen04.beat5}
                </p>
              </div>

              {/* Sober Evidence Card */}
              <div
                className={`pt-4 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="p-5 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-neutral-400 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
                    PIEZA 02
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif italic text-white tracking-wide">
                    {EXP08_CONTENT.screen04.badge}
                  </h3>
                  <p className="text-xs text-neutral-400 font-body pt-1">
                    {EXP08_CONTENT.screen04.caption}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-04-cta"
                onClick={() => advanceToScreen('screen_05_third_piece')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen04.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 05 — LA TERCERA PIEZA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_05_third_piece' && (
          <div
            id="screen-05-third-piece"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen05.eyebrow}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  EVIDENCIA 03
                </span>
              </div>

              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP08_CONTENT.screen05.beat1}
                </p>
              </div>

              <div
                className={`p-4 rounded-xl bg-[#080808] border border-[#181818] flex items-center justify-between text-lg font-serif italic text-white transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span>{EXP08_CONTENT.screen05.beat2}</span>
                <span className="text-neutral-600 font-mono">&bull;</span>
                <span>{EXP08_CONTENT.screen05.beat3}</span>
                <span className="text-neutral-600 font-mono">&bull;</span>
                <span className="text-orange-400 font-medium">{EXP08_CONTENT.screen05.beat4}</span>
              </div>

              {/* Scientific nuance & Evidence Card */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="p-5 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-orange-400">
                    PIEZA 03
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif italic text-white tracking-wide">
                    {EXP08_CONTENT.screen05.badge}
                  </h3>
                  <p className="text-xs text-neutral-400 font-body pt-1">
                    {EXP08_CONTENT.screen05.scientificNuance}
                  </p>
                </div>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-05-cta"
                onClick={() => advanceToScreen('screen_06_the_connection')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen05.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 06 — LA CONEXIÓN */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_06_the_connection' && (
          <div
            id="screen-06-the-connection"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen06.eyebrow}
                </span>
              </div>

              {/* Comparative Structural Patterns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Before Pattern */}
                <div
                  className={`p-4 rounded-xl bg-[#080808] border border-[#161616] space-y-3 transition-all duration-1000 ${
                    screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    PATRÓN ANTERIOR
                  </span>
                  <div className="space-y-2">
                    {EXP08_CONTENT.screen06.beforePattern.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span>{p.label}</span>
                        {idx < 2 && <span className="text-neutral-600">↓</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* After Pattern */}
                <div
                  className={`p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500 space-y-3 transition-all duration-1000 ${
                    screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">
                    PATRÓN CON CONTEXTO™
                  </span>
                  <div className="space-y-2">
                    {EXP08_CONTENT.screen06.afterPattern.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono text-neutral-200">
                        <span className="font-serif italic text-sm text-white">{p.label}</span>
                        {idx < 2 && <span className="text-orange-500/60 font-mono">↓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Philosophical Closure */}
              <div
                className={`pt-4 border-t border-[#181818] space-y-2 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm text-neutral-400 font-body">
                  {EXP08_CONTENT.screen06.closure1}
                </p>
                <p className="text-xl sm:text-2xl font-serif italic text-orange-400 font-medium">
                  {EXP08_CONTENT.screen06.closure2}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-06-cta"
                onClick={() => advanceToScreen('screen_07_the_discovery')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen06.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 07 — EL DESCUBRIMIENTO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_07_the_discovery' && (
          <div
            id="screen-07-the-discovery"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen07.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-xl sm:text-2xl font-serif italic text-neutral-200">
                  {EXP08_CONTENT.screen07.lead}
                </p>
              </div>

              {/* Negations */}
              <div
                className={`space-y-2 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP08_CONTENT.screen07.negations.map((neg, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#080808] border border-[#161616] text-sm text-neutral-400 font-body">
                    {neg}
                  </div>
                ))}
              </div>

              {/* Dominant Reveal */}
              <div
                className={`pt-4 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400 font-medium leading-snug">
                  {EXP08_CONTENT.screen07.dominantReveal}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-07-cta"
                onClick={() => advanceToScreen('screen_08_the_real_problem')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen07.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 08 — EL VERDADERO PROBLEMA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_08_the_real_problem' && (
          <div
            id="screen-08-the-real-problem"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen08.eyebrow}
                </span>
              </div>

              <div
                className={`space-y-1 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP08_CONTENT.screen08.lead1}
                </p>
                <p className="text-lg font-serif italic text-neutral-400">
                  {EXP08_CONTENT.screen08.lead2}
                </p>
              </div>

              {/* Dominant Headline with Max Visual Hierarchy */}
              <div
                className={`p-6 rounded-2xl bg-[#080808] border border-[#222] border-l-4 border-l-orange-500 space-y-3 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen08.difficultyLead}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white font-medium leading-tight">
                  {EXP08_CONTENT.screen08.dominantHeadline}
                </h2>
              </div>

              <div
                className={`pt-3 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg font-serif italic text-orange-400/90 leading-snug">
                  {EXP08_CONTENT.screen08.purposeClosure}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-08-cta"
                onClick={() => advanceToScreen('screen_09_the_tool')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen08.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 09 — LA HERRAMIENTA */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_09_the_tool' && (
          <div
            id="screen-09-the-tool"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen09.eyebrow}
                </span>
              </div>

              <div
                className={`space-y-1 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h1 className="text-3xl sm:text-4xl font-serif italic text-white">
                  {EXP08_CONTENT.screen09.title}
                </h1>
                <p className="text-sm text-neutral-400 font-body">
                  {EXP08_CONTENT.screen09.subtitle}
                </p>
              </div>

              {/* 4-Step Progressive Architecture */}
              <div
                className={`space-y-2.5 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP08_CONTENT.screen09.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#080808] border border-[#1A1A1A] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-orange-400">
                        {st.num}
                      </span>
                      <span className="text-sm sm:text-base font-body text-neutral-200">{st.text}</span>
                    </div>
                    {idx < 3 && <span className="text-neutral-600 font-mono text-xs">↓</span>}
                  </div>
                ))}
              </div>

              <div
                className={`pt-4 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-2xl sm:text-3xl font-serif italic text-orange-400">
                  {EXP08_CONTENT.screen09.finalAuthority}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-09-cta"
                onClick={() => advanceToScreen('screen_10_the_decision')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen09.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 10 — LA DECISIÓN (AUTONOMÍA) */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_10_the_decision' && (
          <div
            id="screen-10-the-decision"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen10.eyebrow}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
                  {EXP08_CONTENT.screen10.lead}
                </h2>
              </div>

              {/* Ethical boundaries */}
              <div
                className={`space-y-2.5 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {EXP08_CONTENT.screen10.boundaries.map((bnd, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#080808] border border-[#161616] flex items-center space-x-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 shrink-0" />
                    <span className="text-sm text-neutral-300 font-body">{bnd}</span>
                  </div>
                ))}
              </div>

              <div
                className={`pt-4 border-t border-[#181818] space-y-1 transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP08_CONTENT.screen10.corePiece}
                </p>
                <p className="text-2xl sm:text-3xl font-serif italic text-orange-400">
                  {EXP08_CONTENT.screen10.finalAutonomy}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-10-cta"
                onClick={() => advanceToScreen('screen_11_the_invitation')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen10.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 11 — LA EVALUACIÓN & LA INVITACIÓN */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_11_the_invitation' && (
          <div
            id="screen-11-the-invitation"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="transition-all duration-1000 opacity-100">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen11.eyebrow}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP08_CONTENT.screen11.questionLead}
                </p>
                <h2 className="text-xl sm:text-2xl font-serif italic text-white">
                  {EXP08_CONTENT.screen11.questionCore}
                </h2>
              </div>

              {/* Autoevaluation Options */}
              <div className="space-y-3 pt-2">
                {EXP08_CONTENT.screen11.options.map((option) => {
                  const isSelected = selectedOption === option.code || purchaseDesireCode === option.code;
                  return (
                    <ChoiceButton
                      key={option.id}
                      id={`choice-${option.id}`}
                      code={option.code}
                      selected={isSelected}
                      isAnySelected={Boolean(selectedOption || purchaseDesireCode)}
                      onClick={() => handleSelectOption(option)}
                      disabled={Boolean(purchaseDesireCode) || isProcessing}
                    >
                      {option.label}
                    </ChoiceButton>
                  );
                })}
              </div>

              {/* Adaptive Feedback */}
              {(purchaseDesireCode || selectedOption) && (
                <div className="pt-2 animate-fade-in">
                  <div className="p-4 rounded-xl bg-[#080808] border border-[#1C1C1C] border-l-2 border-l-orange-500">
                    <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">
                      OBSERVACIÓN CLAVE
                    </p>
                    <p className="text-sm sm:text-base font-serif italic text-neutral-200">
                      {reactionFeedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Invitation Lead & Closure */}
              {(purchaseDesireCode || selectedOption) && (
                <div className="pt-4 border-t border-[#181818] space-y-3 animate-fade-in">
                  <p className="text-sm text-neutral-400 font-body">
                    {EXP08_CONTENT.screen11.invitationLead1}
                  </p>
                  <p className="text-base text-neutral-300 font-serif italic">
                    {EXP08_CONTENT.screen11.invitationLead2}
                  </p>
                  <p className="text-2xl sm:text-3xl font-serif italic text-orange-400 font-medium">
                    {EXP08_CONTENT.screen11.invitationHighlight}
                  </p>
                  <div className="pt-2 space-y-1 text-sm text-neutral-400 font-body">
                    <p>{EXP08_CONTENT.screen11.invitationClosure1}</p>
                    <p className="text-neutral-200 font-serif italic text-base">
                      {EXP08_CONTENT.screen11.invitationClosure2}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {(purchaseDesireCode || selectedOption) && (
              <CTAReveal isRevealed={true} className="w-full pt-4">
                <PrimaryCTA
                  id="screen-11-cta"
                  onClick={() => advanceToScreen('screen_12_case_closing')}
                  disabled={isProcessing}
                >
                  {EXP08_CONTENT.screen11.ctaLabel}
                </PrimaryCTA>
              </CTAReveal>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 12 — CIERRE DEL CASO */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_12_case_closing' && (
          <div
            id="screen-12-case-closing"
            className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
          >
            <div className="space-y-6 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen12.eyebrow}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  CASO #{caseId}
                </span>
              </div>

              <div
                className={`transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="p-4 rounded-xl bg-[#080808] border border-[#161616] flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0" />
                  <span className="text-sm font-mono tracking-wider text-neutral-300 uppercase">
                    {EXP08_CONTENT.screen12.caseTitle}
                  </span>
                </div>
              </div>

              {/* Hallazgo Principal Card */}
              <div
                className={`p-6 rounded-2xl bg-[#080808] border border-[#222] border-l-4 border-l-orange-500 space-y-3 transition-all duration-1000 ${
                  screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase">
                  {EXP08_CONTENT.screen12.mainFindingLabel}
                </span>
                <p className="text-2xl sm:text-3xl font-serif italic text-white font-medium leading-snug">
                  {EXP08_CONTENT.screen12.mainFindingText}
                </p>
              </div>

              <div
                className={`pt-3 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-base sm:text-lg font-serif italic text-orange-400/90">
                  {EXP08_CONTENT.screen12.closureBeat}
                </p>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-4">
              <PrimaryCTA
                id="screen-12-cta"
                onClick={() => advanceToScreen('screen_13_final_step')}
                disabled={isProcessing}
              >
                {EXP08_CONTENT.screen12.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 13 — PASO FINAL */}
        {/* ========================================================================= */}
        {currentScreenId === 'screen_13_final_step' && (
          <div
            id="screen-13-final-step"
            className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-10"
          >
            <div className="space-y-8 text-left w-full">
              <div className="transition-all duration-1000 opacity-100 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {EXP08_CONTENT.screen13.eyebrow}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
                  CASO #{caseId}
                </span>
              </div>

              <div
                className={`p-4 rounded-xl bg-[#080808] border border-[#161616] space-y-2 transition-all duration-1000 ${
                  screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  {EXP08_CONTENT.screen13.beat1}
                </p>
                <p className="text-xl sm:text-2xl font-serif italic text-white">
                  {EXP08_CONTENT.screen13.beat2}
                </p>
              </div>

              <div
                className={`pt-4 border-t border-[#181818] transition-all duration-1000 ${
                  screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-orange-400 leading-snug">
                  {EXP08_CONTENT.screen13.finalQuestion}
                </h1>
              </div>
            </div>

            <CTAReveal isRevealed={isCTARevealed} className="w-full pt-6">
              <PrimaryCTA
                id="screen-13-final-cta"
                onClick={handleCompleteExp08}
                disabled={isProcessing || isCompletedGuard}
              >
                {EXP08_CONTENT.screen13.ctaLabel}
              </PrimaryCTA>
            </CTAReveal>
          </div>
        )}
      </main>

      {/* Footer info note */}
      <footer id="exp08-footer" className="w-full max-w-xl text-center py-4 border-t border-[#121212]">
        <p className="text-[11px] text-neutral-600 font-mono tracking-wider uppercase">
          EVIDENCIA CONFIDENCIAL &bull; CONTEXTO™ ARCHIVE
        </p>
      </footer>
    </div>
  );
};
