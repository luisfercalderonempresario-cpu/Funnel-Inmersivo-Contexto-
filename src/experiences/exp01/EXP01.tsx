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
import { RotateCcw } from 'lucide-react';

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

  // Scene staged reveal timers
  const [screenStage, setScreenStage] = useState<number>(1);

  // Synchronize runtime persistence
  useEffect(() => {
    persistExperienceRuntimeState(runtimeState);
  }, [runtimeState]);

  // Handle progressive reveals per screen
  useEffect(() => {
    setScreenStage(1);
    const screen = runtimeState.currentScreen;

    if (screen === 'screen_01_black_entry') {
      const t1 = setTimeout(() => setScreenStage(2), 650);
      const t2 = setTimeout(() => setScreenStage(3), 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else if (screen === 'screen_02_first_question') {
      const t1 = setTimeout(() => setScreenStage(2), 450);
      const t2 = setTimeout(() => setScreenStage(3), 950);
      const t3 = setTimeout(() => setScreenStage(4), 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (screen === 'screen_03_case_id') {
      const t1 = setTimeout(() => setScreenStage(2), 500);
      const t2 = setTimeout(() => setScreenStage(3), 1050);
      const t3 = setTimeout(() => setScreenStage(4), 1550);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (screen === 'screen_04_second_question') {
      const t1 = setTimeout(() => setScreenStage(2), 450);
      const t2 = setTimeout(() => setScreenStage(3), 950);
      const t3 = setTimeout(() => setScreenStage(4), 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (screen === 'screen_05_mirror_moment') {
      const t1 = setTimeout(() => setScreenStage(2), 550);
      const t2 = setTimeout(() => setScreenStage(3), 1250);
      const t3 = setTimeout(() => setScreenStage(4), 1850);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (screen === 'screen_06_investigation_activation') {
      const t1 = setTimeout(() => setScreenStage(2), 500);
      const t2 = setTimeout(() => setScreenStage(3), 1100);
      const t3 = setTimeout(() => setScreenStage(4), 1600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (screen === 'screen_08_confirmation') {
      const t1 = setTimeout(() => setScreenStage(2), 500);
      const t2 = setTimeout(() => setScreenStage(3), 1000);
      const t3 = setTimeout(() => setScreenStage(4), 1500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (screen === 'screen_09_final') {
      const t1 = setTimeout(() => setScreenStage(2), 600);
      const t2 = setTimeout(() => setScreenStage(3), 1300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [runtimeState.currentScreen]);

  // Track analytics events on screen transition
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

  // Screen transition handler
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

    // 3. Smooth cinematic pause before revealing the Case
    setTimeout(() => {
      navigateToScreen('screen_03_case_id');
    }, 550);
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
    }, 550);
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
      }, 350);
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
      }, 350);
    }
  };

  // SCREEN 09: Final de La Puerta (Completion)
  const handleFinalStep = () => {
    if (completingRef.current || isCompletedGuard) return;
    completingRef.current = true;
    setIsCompletedGuard(true);
    setIsProcessing(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: { action: 'complete_door' },
    });

    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      completed: true,
      completedAt: new Date().toISOString(),
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp01.completed', value: true, scope: 'global' },
      { key: 'exp01.completedAt', value: new Date().toISOString(), scope: 'global' },
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

    eventTracker.trackEvent('EXP01_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp01',
      payload: { memory: finalMemory },
    });

    onComplete(finalMemory);
  };

  const currentScreenId = runtimeState.currentScreen;

  return (
    <div
      id="exp01-container"
      className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[72vh] px-4 sm:px-6 py-10 relative text-neutral-200"
    >
      {/* ========================================================================= */}
      {/* ESCENA 01 — ENTRADA (CÁMARA OSCURA & REVELACIÓN)                          */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_01_black_entry' && (
        <div
          id="screen-01-black-entry"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in py-6"
        >
          <div className="space-y-8 max-w-lg mx-auto pt-6 sm:pt-12">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white tracking-wide leading-relaxed font-normal transition-opacity duration-700">
              {EXP01_CONTENT.screen01.leadText1}
            </h1>

            <p
              className={`text-sm sm:text-base text-neutral-400 font-body tracking-wider transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen01.leadText2}
            </p>
          </div>

          <div
            className={`w-full max-w-xs pt-4 transition-all duration-700 ${
              screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-enter-exp01"
              onClick={handleEnterExperience}
              variant="accent"
              showIcon={true}
            >
              {EXP01_CONTENT.screen01.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ESCENA 02 — PRIMERA PREGUNTA (DECLARACIÓN & REGISTRO)                      */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_02_first_question' && (
        <div
          id="screen-02-first-question"
          className="w-full flex flex-col space-y-8 animate-fade-in text-left max-w-xl mx-auto py-4"
        >
          <div className="space-y-2">
            <p
              className={`text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen02.intro1}
            </p>
            <p
              className={`text-sm text-neutral-400 font-body transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen02.intro2}
            </p>
            <h2
              className={`text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-white tracking-wide leading-snug pt-3 whitespace-pre-line transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen02.question}
            </h2>
          </div>

          <div
            className={`space-y-3 pt-3 transition-all duration-700 ${
              screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {EXP01_CONTENT.screen02.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;

              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-q1-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  evidenceLabel="DATO 01"
                  selected={isSelected}
                  isAnySelected={isAnySelected}
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

      {/* ========================================================================= */}
      {/* ESCENA 03 — REVELACIÓN DEL CASO (EVIDENCIA EDITORIAL SOBRIA)              */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_03_case_id' && (
        <div
          id="screen-03-case-id"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-lg mx-auto py-8"
        >
          <div className="space-y-6">
            <div className={`transition-all duration-700 ${screenStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-xs font-mono tracking-[0.3em] text-neutral-500 uppercase">
                {EXP01_CONTENT.screen03.label}
              </span>
            </div>

            <div
              className={`transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <h2 className="font-mono text-3xl sm:text-4xl tracking-[0.2em] font-semibold text-white">
                #{caseId}
              </h2>
            </div>

            <div
              className={`flex items-center justify-center gap-2 pt-2 transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(234,88,12,0.8)]" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-orange-400/90 uppercase">
                {EXP01_CONTENT.screen03.status}
              </span>
            </div>

            <div
              className={`pt-4 transition-all duration-700 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm font-body text-neutral-400 tracking-wide">
                {EXP01_CONTENT.screen03.footnote}
              </p>
            </div>
          </div>

          <div
            className={`w-full max-w-xs pt-4 transition-all duration-700 ${
              screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-caseid-continue"
              onClick={() => navigateToScreen('screen_04_second_question')}
              variant="accent"
              showIcon={true}
            >
              {EXP01_CONTENT.screen03.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ESCENA 04 — SEGUNDA PREGUNTA (SEGUNDO DATO)                               */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_04_second_question' && (
        <div
          id="screen-04-second-question"
          className="w-full flex flex-col space-y-8 animate-fade-in text-left max-w-xl mx-auto py-4"
        >
          <div className="space-y-2">
            <p
              className={`text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen04.intro1}
            </p>
            <p
              className={`text-sm text-neutral-400 font-body transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen04.intro2}
            </p>
            <h2
              className={`text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-white tracking-wide leading-snug pt-3 transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen04.question}
            </h2>
          </div>

          <div
            className={`space-y-3 pt-3 transition-all duration-700 ${
              screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {EXP01_CONTENT.screen04.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;

              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-q2-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  evidenceLabel="DATO 02"
                  selected={isSelected}
                  isAnySelected={isAnySelected}
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

      {/* ========================================================================= */}
      {/* ESCENA 05 — EL ESPEJO (MOMENTO ÍNTIMO & QUIEBRE)                          */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_05_mirror_moment' && (
        <div
          id="screen-05-mirror-moment"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-6"
        >
          <div className="space-y-8 text-left w-full">
            <h2
              className={`text-2xl sm:text-3xl font-serif italic font-normal text-white tracking-wide transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen05.title}
            </h2>

            <p
              className={`text-base sm:text-lg text-neutral-300 font-body leading-relaxed transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen05.paragraph1}
            </p>

            <p
              className={`text-lg sm:text-xl md:text-2xl text-white font-serif italic leading-relaxed border-l-2 border-orange-500 pl-5 py-2 transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen05.paragraph2}
            </p>
          </div>

          <div
            className={`w-full max-w-xs transition-all duration-700 ${
              screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-mirror-continue"
              onClick={() => navigateToScreen('screen_06_investigation_activation')}
              variant="accent"
              showIcon={true}
            >
              {EXP01_CONTENT.screen05.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ESCENA 06 — ACTIVACIÓN (PREPARACIÓN PARA LA VERDAD)                        */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_06_investigation_activation' && (
        <div
          id="screen-06-investigation-activation"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-6"
        >
          <div className="space-y-6 text-left w-full">
            <p
              className={`text-base sm:text-lg text-neutral-200 font-body leading-relaxed transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen06.paragraph1}
            </p>
            <p
              className={`text-sm sm:text-base text-neutral-400 font-body leading-relaxed transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen06.paragraph2}
            </p>
            <p
              className={`text-lg sm:text-xl text-white font-serif italic leading-relaxed pt-3 border-t border-[#1a1a1a] transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen06.paragraph3}
            </p>
          </div>

          <div
            className={`w-full max-w-xs transition-all duration-700 ${
              screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
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
              showIcon={true}
            >
              {EXP01_CONTENT.screen06.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ESCENA 07 — MICROCOMPROMISO (LA DECISIÓN CRUCIAL)                          */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07_microcommitment' && (
        <div
          id="screen-07-microcommitment"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-4 max-w-lg mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-white tracking-wide leading-snug">
              {EXP01_CONTENT.screen07.question}
            </h2>
          </div>

          <div className="w-full max-w-md space-y-4">
            <PrimaryCTA
              id="cta-microcommitment-yes"
              onClick={() => handleMicrocommitment(true)}
              variant="accent"
              showIcon={true}
              disabled={isProcessing}
            >
              {EXP01_CONTENT.screen07.options[0].label}
            </PrimaryCTA>

            <SecondaryCTA
              id="cta-microcommitment-no"
              onClick={() => handleMicrocommitment(false)}
              disabled={isProcessing}
            >
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase hover:text-neutral-300 transition-colors">
                {EXP01_CONTENT.screen07.options[1].label}
              </span>
            </SecondaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ESCENA 07 DECLINED — RAMA DE PAUSA SEGURA                                 */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07_declined' && (
        <div
          id="screen-07-declined"
          className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-lg mx-auto py-8"
        >
          <div className="space-y-6 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif italic font-normal text-white">
              {EXP01_CONTENT.screen07Declined.title}
            </h2>

            <p className="text-base text-neutral-400 font-body leading-relaxed">
              {EXP01_CONTENT.screen07Declined.message}
            </p>
          </div>

          <div className="w-full max-w-xs space-y-4 pt-4">
            <PrimaryCTA
              id="cta-declined-resume"
              onClick={() => handleMicrocommitment(true)}
              variant="accent"
              showIcon={false}
            >
              <span className="flex items-center justify-center gap-2">
                <RotateCcw className="w-3.5 h-3.5" />
                {EXP01_CONTENT.screen07Declined.resumeLabel}
              </span>
            </PrimaryCTA>

            <SecondaryCTA
              id="cta-declined-exit"
              onClick={() => {
                window.location.reload();
              }}
            >
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase hover:text-neutral-400">
                {EXP01_CONTENT.screen07Declined.exitLabel}
              </span>
            </SecondaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ESCENA 08 — CONFIRMACIÓN (INVESTIGACIÓN EN CURSO)                         */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_08_confirmation' && (
        <div
          id="screen-08-confirmation"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-lg mx-auto py-8"
        >
          <div className="space-y-6">
            <div className={`transition-all duration-700 ${screenStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-mono text-2xl sm:text-3xl tracking-[0.2em] font-semibold text-white">
                {EXP01_CONTENT.screen08.label} #{caseId}
              </span>
            </div>

            <div
              className={`flex items-center justify-center gap-2 transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(234,88,12,0.8)]" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-orange-400 uppercase">
                {EXP01_CONTENT.screen08.status}
              </span>
            </div>

            <div
              className={`pt-2 transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="text-base sm:text-lg font-serif italic text-neutral-300">
                {EXP01_CONTENT.screen08.body}
              </p>
            </div>
          </div>

          <div
            className={`w-full max-w-xs pt-4 transition-all duration-700 ${
              screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-confirm-continue"
              onClick={() => navigateToScreen('screen_09_final')}
              variant="accent"
              showIcon={true}
            >
              {EXP01_CONTENT.screen08.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ESCENA 09 — FINAL DE LA PUERTA (UMBRAL A LA EXPERIENCIA 02)              */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_09_final' && (
        <div
          id="screen-09-final"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <p
              className={`text-lg sm:text-xl font-serif italic text-white leading-relaxed transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen09.paragraph1}
            </p>
            <p
              className={`text-base sm:text-lg text-neutral-300 font-body leading-relaxed pt-4 border-t border-[#181818] transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP01_CONTENT.screen09.paragraph2}
            </p>
          </div>

          <div
            className={`w-full max-w-md pt-4 transition-all duration-700 ${
              screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-complete-exp01"
              onClick={handleFinalStep}
              variant="accent"
              showIcon={true}
              isLoading={isProcessing}
              disabled={isCompletedGuard}
            >
              {EXP01_CONTENT.screen09.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}
    </div>
  );
};
