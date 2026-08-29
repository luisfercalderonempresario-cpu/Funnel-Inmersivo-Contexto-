import React, { useState, useEffect, useRef, useTransition } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { EXP01_CONTENT } from './exp01Content';
import { EXP01_DEFINITION } from './exp01Definition';
import { ExperienceMemoryManager } from '../../engine/experience/experienceMemory';
import {
  loadExperienceRuntimeState,
  persistExperienceRuntimeState,
  transitionScreenState,
} from '../../engine/experience/experienceState';
import { ExperienceRuntimeState, ExperienceAction } from '../../engine/experience/types';
import { eventTracker } from '../../engine/events/eventTracker';
import { ChoiceButton } from '../../components/ui/ChoiceButton';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { SecondaryCTA } from '../../components/ui/SecondaryCTA';
import { CaseId } from '../../components/ui/CaseId';
import {
  Shield,
  FileCheck2,
  Lock,
  ArrowRight,
  Eye,
  Check,
  RotateCcw,
} from 'lucide-react';

export const EXP01: React.FC<ExperienceComponentProps> = ({
  caseId,
  onComplete,
}) => {
  const { state, updateState } = useFunnel();

  const handlePersistGlobal = (key: string, value: unknown) => {
    updateState((prev) => {
      const exp01Responses = (prev.responses.exp01 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp01: {
            ...exp01Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp01',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp01');
    if (existing && existing.currentScreen && EXP01_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp01',
      currentScreen: 'screen_01_black_entry',
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

  // Synchronize runtime persistence
  useEffect(() => {
    persistExperienceRuntimeState(runtimeState);
  }, [runtimeState]);

  // Track initial events and screen entries
  useEffect(() => {
    const currentScreen = runtimeState.currentScreen;

    if (currentScreen === 'screen_01_black_entry') {
      eventTracker.trackEvent('EXP01_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp01',
        payload: { screen: 'screen_01_black_entry' },
      });
    }

    if (currentScreen === 'screen_02_first_question' || currentScreen === 'screen_04_second_question') {
      eventTracker.trackEvent('QUESTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp01',
        payload: { screenId: currentScreen },
      });
    }

    if (currentScreen === 'screen_03_case_id' || currentScreen === 'screen_08_confirmation') {
      eventTracker.trackEvent('CASE_ID_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp01',
        payload: { caseId: state.session.caseId, screenId: currentScreen },
      });
    }

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: { screenId: currentScreen },
    });
  }, [runtimeState.currentScreen, state.session.sessionId, state.session.caseId]);

  // Helper to transition to a new screen safely
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

  // Dispatch narrative actions
  const handleAction = async (action: ExperienceAction) => {
    if (isProcessing) return;

    // Track CTA click
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: {
        actionLabel: action.label,
        actionType: action.type,
        targetScreen: action.targetScreen,
        payload: action.payload,
      },
    });

    if (action.memoryUpdates && action.memoryUpdates.length > 0) {
      memoryManagerRef.current.applyUpdates(action.memoryUpdates);
    }

    if (action.targetScreen) {
      navigateToScreen(action.targetScreen);
    }
  };

  // SCREEN 01: Entrar
  const handleEnterExperience = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: { action: 'enter_experience' },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp01.started', value: true, scope: 'global' },
    ]);

    navigateToScreen('screen_02_first_question');
  };

  // SCREEN 02: Pregunta 1
  const handleSelectQuestion1 = (code: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    // 1. Emit Choice & Question Answered Events
    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: { questionId: 'question_01', option: code },
    });

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: { questionId: 'question_01', answer: code },
    });

    // 2. Persist memory
    memoryManagerRef.current.applyUpdates([
      { key: 'exp01.relationshipResponse', value: code, scope: 'global' },
      { key: 'exp01.question01Answered', value: true, scope: 'global' },
    ]);

    // 3. Smooth cinematic delay
    setTimeout(() => {
      navigateToScreen('screen_03_case_id');
    }, 450);
  };

  // SCREEN 04: Pregunta 2
  const handleSelectQuestion2 = (code: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: { questionId: 'question_02', option: code },
    });

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: { questionId: 'question_02', answer: code },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp01.relationshipInterpretation', value: code, scope: 'global' },
      { key: 'exp01.question02Answered', value: true, scope: 'global' },
    ]);

    setTimeout(() => {
      navigateToScreen('screen_05_mirror_moment');
    }, 450);
  };

  // SCREEN 07: Microcommitment
  const handleMicrocommitment = (accepted: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (accepted) {
      eventTracker.trackEvent('INVESTIGATION_ACCEPTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp01',
        payload: { accepted: true },
      });

      memoryManagerRef.current.applyUpdates([
        { key: 'exp01.investigationAccepted', value: true, scope: 'global' },
      ]);

      setTimeout(() => {
        navigateToScreen('screen_08_confirmation');
      }, 400);
    } else {
      eventTracker.trackEvent('INVESTIGATION_DECLINED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp01',
        payload: { accepted: false },
      });

      memoryManagerRef.current.applyUpdates([
        { key: 'exp01.investigationAccepted', value: false, scope: 'global' },
      ]);

      setTimeout(() => {
        navigateToScreen('screen_07_declined');
      }, 400);
    }
  };

  // SCREEN 09: Final de La Puerta (Completion)
  const handleFinalStep = () => {
    // Guard against double clicks
    if (completingRef.current || isCompletedGuard) return;
    completingRef.current = true;
    setIsCompletedGuard(true);
    setIsProcessing(true);

    // 1. Emit CTA Clicked
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: { action: 'complete_door' },
    });

    // 2. Mark EXP01 as completed in memory
    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      completed: true,
      completedAt: new Date().toISOString(),
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp01.completed', value: true, scope: 'global' },
      { key: 'exp01.completedAt', value: new Date().toISOString(), scope: 'global' },
    ]);

    // 3. Mark runtime state as COMPLETED
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

    // 4. Emit EXP01_COMPLETED
    eventTracker.trackEvent('EXP01_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: { memory: finalMemory },
    });

    // 5. Complete experience in Funnel Engine and advance to EXP_02
    onComplete(finalMemory);
  };

  const currentScreenId = runtimeState.currentScreen;

  return (
    <div
      id="exp01-container"
      className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[68vh] px-4 py-8 relative text-neutral-200"
    >
      {/* SCREEN 01 — BLACK ENTRY */}
      {currentScreenId === 'screen_01_black_entry' && (
        <div
          id="screen-01-black-entry"
          className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in"
        >
          <div className="space-y-6 max-w-lg mx-auto pt-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white tracking-wide leading-relaxed font-bold animate-fade-in">
              {EXP01_CONTENT.screen01.leadText}
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 font-body leading-relaxed opacity-90 transition-opacity duration-1000">
              {EXP01_CONTENT.screen01.subText}
            </p>
          </div>

          <div className="w-full max-w-xs pt-4">
            <PrimaryCTA
              id="cta-enter-exp01"
              onClick={handleEnterExperience}
              variant="accent"
            >
              <span className="flex items-center justify-center gap-2 tracking-widest uppercase text-sm font-semibold">
                {EXP01_CONTENT.screen01.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </span>
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* SCREEN 02 — FIRST QUESTION */}
      {currentScreenId === 'screen_02_first_question' && (
        <div
          id="screen-02-first-question"
          className="w-full flex flex-col space-y-7 animate-fade-in text-left"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              PRIMERA PREGUNTA
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 font-body">
              {EXP01_CONTENT.screen02.leadText}
            </p>

            <h2 className="text-xl sm:text-2xl font-serif italic font-bold text-white tracking-wide leading-snug">
              {EXP01_CONTENT.screen02.question}
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {EXP01_CONTENT.screen02.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;

              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-q1-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  selected={isSelected}
                  disabled={isAnySelected}
                  onClick={() => handleSelectQuestion1(opt.code)}
                >
                  {opt.label}
                </ChoiceButton>
              );
            })}
          </div>
        </div>
      )}

      {/* SCREEN 03 — CASE ID REVEAL */}
      {currentScreenId === 'screen_03_case_id' && (
        <div
          id="screen-03-case-id"
          className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in"
        >
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-[#0A0A0A] text-neutral-400 text-xs font-mono tracking-widest uppercase">
              <Shield className="w-3.5 h-3.5 text-orange-500" />
              EXPEDIENTE INICIAL
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif italic font-bold text-white tracking-wide">
              {EXP01_CONTENT.screen03.leadText}
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 font-body leading-relaxed">
              {EXP01_CONTENT.screen03.bodyText}
            </p>
          </div>

          {/* Investigation Case Card */}
          <div className="w-full p-6 rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F] shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-orange-400" />
                EXPEDIENTE ASIGNADO
              </span>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVO
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
              <div>
                <p className="text-xs text-neutral-500 uppercase font-mono">Identificador de Caso</p>
                <div className="pt-1">
                  <CaseId code={caseId} />
                </div>
              </div>
              <div className="text-right sm:text-right">
                <p className="text-xs text-neutral-500 uppercase font-mono">Registro</p>
                <p className="text-xs font-mono text-neutral-300">DATO 01 REGISTRADO</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs pt-2">
            <PrimaryCTA
              id="cta-caseid-continue"
              onClick={() => navigateToScreen('screen_04_second_question')}
              variant="accent"
            >
              <span className="flex items-center justify-center gap-2 uppercase tracking-wider text-sm font-semibold">
                {EXP01_CONTENT.screen03.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </span>
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* SCREEN 04 — SECOND QUESTION */}
      {currentScreenId === 'screen_04_second_question' && (
        <div
          id="screen-04-second-question"
          className="w-full flex flex-col space-y-7 animate-fade-in text-left"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              SEGUNDA PREGUNTA
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 font-body">
              {EXP01_CONTENT.screen04.leadText}
            </p>

            <h2 className="text-xl sm:text-2xl font-serif italic font-bold text-white tracking-wide leading-snug">
              {EXP01_CONTENT.screen04.question}
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {EXP01_CONTENT.screen04.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;

              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-q2-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  selected={isSelected}
                  disabled={isAnySelected}
                  onClick={() => handleSelectQuestion2(opt.code)}
                >
                  {opt.label}
                </ChoiceButton>
              );
            })}
          </div>
        </div>
      )}

      {/* SCREEN 05 — MIRROR MOMENT */}
      {currentScreenId === 'screen_05_mirror_moment' && (
        <div
          id="screen-05-mirror-moment"
          className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in"
        >
          <div className="space-y-5 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-[#0A0A0A] text-neutral-400 text-xs font-mono tracking-widest uppercase">
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              OBSERVACIÓN
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif italic font-bold text-white tracking-wide">
              {EXP01_CONTENT.screen05.title}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-body leading-relaxed text-left p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A]">
              <p>{EXP01_CONTENT.screen05.paragraph1}</p>
              <p className="text-white font-medium">{EXP01_CONTENT.screen05.paragraph2}</p>
            </div>

            <p className="text-xs uppercase font-mono tracking-widest text-orange-400 font-semibold pt-2">
              {EXP01_CONTENT.screen05.cliffhanger}
            </p>
          </div>

          <div className="w-full max-w-xs">
            <PrimaryCTA
              id="cta-mirror-continue"
              onClick={() => navigateToScreen('screen_06_investigation_activation')}
              variant="accent"
            >
              <span className="flex items-center justify-center gap-2 uppercase tracking-wider text-sm font-semibold">
                {EXP01_CONTENT.screen05.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </span>
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* SCREEN 06 — INVESTIGATION ACTIVATION */}
      {currentScreenId === 'screen_06_investigation_activation' && (
        <div
          id="screen-06-investigation-activation"
          className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in"
        >
          <div className="space-y-5 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-mono tracking-widest uppercase">
              <Lock className="w-3.5 h-3.5" />
              ANÁLISIS DE PATRÓN
            </div>

            <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-body leading-relaxed text-left p-6 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A]">
              <p>{EXP01_CONTENT.screen06.paragraph1}</p>
              <p className="text-neutral-400">{EXP01_CONTENT.screen06.paragraph2}</p>
              <p className="text-white font-medium border-t border-[#1A1A1A] pt-3">
                {EXP01_CONTENT.screen06.paragraph3}
              </p>
            </div>
          </div>

          <div className="w-full max-w-xs">
            <PrimaryCTA
              id="cta-activation-ready"
              onClick={() => {
                eventTracker.trackEvent('CTA_CLICKED', {
                  sessionId: state.session.sessionId,
                  caseId: state.session.caseId,
                  experience: 'exp01',
                  payload: { action: 'ready_for_microcommitment' },
                });
                navigateToScreen('screen_07_microcommitment');
              }}
              variant="accent"
            >
              <span className="flex items-center justify-center gap-2 uppercase tracking-wider text-sm font-semibold">
                {EXP01_CONTENT.screen06.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </span>
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* SCREEN 07 — MICROCOMMITMENT */}
      {currentScreenId === 'screen_07_microcommitment' && (
        <div
          id="screen-07-microcommitment"
          className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in"
        >
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              COMPROMISO
            </div>

            <h2 className="text-xl sm:text-2xl font-serif italic font-bold text-white tracking-wide leading-snug">
              {EXP01_CONTENT.screen07.question}
            </h2>
          </div>

          <div className="w-full max-w-md space-y-3.5">
            <PrimaryCTA
              id="cta-microcommitment-yes"
              onClick={() => handleMicrocommitment(true)}
              variant="accent"
              disabled={isProcessing}
            >
              <span className="flex items-center justify-center gap-2 uppercase tracking-wider text-sm font-semibold">
                <Check className="w-4 h-4" />
                {EXP01_CONTENT.screen07.options[0].label}
              </span>
            </PrimaryCTA>

            <SecondaryCTA
              id="cta-microcommitment-no"
              onClick={() => handleMicrocommitment(false)}
              disabled={isProcessing}
            >
              <span className="text-xs uppercase font-mono tracking-wider text-neutral-400">
                {EXP01_CONTENT.screen07.options[1].label}
              </span>
            </SecondaryCTA>
          </div>
        </div>
      )}

      {/* SCREEN 07 DECLINED — SAFE PAUSE STATE */}
      {currentScreenId === 'screen_07_declined' && (
        <div
          id="screen-07-declined"
          className="w-full flex flex-col items-center text-center space-y-7 animate-fade-in"
        >
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-[#0A0A0A] text-neutral-400 text-xs font-mono tracking-widest uppercase">
              SESIÓN PAUSADA
            </div>

            <h2 className="text-2xl font-serif italic font-bold text-white">
              {EXP01_CONTENT.screen07Declined.title}
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-body leading-relaxed p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A]">
              {EXP01_CONTENT.screen07Declined.message}
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <PrimaryCTA
              id="cta-declined-resume"
              onClick={() => handleMicrocommitment(true)}
              variant="accent"
            >
              <span className="flex items-center justify-center gap-2 uppercase tracking-wider text-xs font-semibold">
                <RotateCcw className="w-3.5 h-3.5" />
                {EXP01_CONTENT.screen07Declined.resumeLabel}
              </span>
            </PrimaryCTA>

            <SecondaryCTA
              id="cta-declined-exit"
              onClick={() => {
                // Preserves session cleanly without erasing
                window.location.reload();
              }}
            >
              <span className="text-xs uppercase font-mono tracking-wider text-neutral-500">
                {EXP01_CONTENT.screen07Declined.exitLabel}
              </span>
            </SecondaryCTA>
          </div>
        </div>
      )}

      {/* SCREEN 08 — CONFIRMATION & CASE ID */}
      {currentScreenId === 'screen_08_confirmation' && (
        <div
          id="screen-08-confirmation"
          className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in"
        >
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-widest uppercase">
              <Check className="w-3.5 h-3.5" />
              CONFIRMADO
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif italic font-bold text-white tracking-wide">
              {EXP01_CONTENT.screen08.leadText}
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 font-body">
              {EXP01_CONTENT.screen08.subText}
            </p>
          </div>

          <div className="w-full p-6 rounded-2xl bg-[#0A0A0A] border border-orange-500/30 shadow-[0_0_30px_rgba(234,88,12,0.08)] space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
                EXPEDIENTE ACTIVO
              </span>
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                {EXP01_CONTENT.screen08.statusText}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <CaseId code={caseId} />
              <span className="text-xs font-mono text-neutral-400">FASE 01 LISTA</span>
            </div>
          </div>

          <div className="w-full max-w-xs pt-2">
            <PrimaryCTA
              id="cta-confirm-continue"
              onClick={() => navigateToScreen('screen_09_final')}
              variant="accent"
            >
              <span className="flex items-center justify-center gap-2 uppercase tracking-wider text-sm font-semibold">
                {EXP01_CONTENT.screen08.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </span>
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* SCREEN 09 — FINAL DE LA PUERTA (COMPLETION) */}
      {currentScreenId === 'screen_09_final' && (
        <div
          id="screen-09-final"
          className="w-full flex flex-col items-center text-center space-y-8 animate-fade-in"
        >
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              EXPEDIENTE PREPARADO
            </div>

            <h2 className="text-xl sm:text-2xl font-serif italic font-bold text-white tracking-wide leading-snug">
              {EXP01_CONTENT.screen09.leadText}
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-body leading-relaxed p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A]">
              {EXP01_CONTENT.screen09.subText}
            </p>
          </div>

          <div className="w-full max-w-md pt-4">
            <PrimaryCTA
              id="cta-complete-exp01"
              onClick={handleFinalStep}
              variant="accent"
              isLoading={isProcessing}
              disabled={isCompletedGuard}
            >
              <span className="flex items-center justify-center gap-2 tracking-widest uppercase text-sm font-bold">
                {EXP01_CONTENT.screen09.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </span>
            </PrimaryCTA>
          </div>
        </div>
      )}
    </div>
  );
};
