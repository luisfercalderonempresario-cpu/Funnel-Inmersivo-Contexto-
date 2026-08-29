import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { EXP02_CONTENT } from './exp02Content';
import { EXP02_DEFINITION } from './exp02Definition';
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

export const EXP02: React.FC<ExperienceComponentProps> = ({
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
        experience: 'exp02',
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
      const exp02Responses = (prev.responses.exp02 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp02: {
            ...exp02Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp02',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_02
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp02');
    if (existing && existing.currentScreen && EXP02_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp02',
      currentScreen: 'screen_01_transition',
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

  // Screen progressive stage reveal
  const [screenStage, setScreenStage] = useState<number>(1);
  const [chatMessageCount, setChatMessageCount] = useState<number>(1);

  // Synchronize runtime persistence
  useEffect(() => {
    persistExperienceRuntimeState(runtimeState);
  }, [runtimeState]);

  // Handle progressive staged reveals per screen
  useEffect(() => {
    setScreenStage(1);
    const screen = runtimeState.currentScreen;

    if (screen === 'screen_01_transition') {
      const t1 = setTimeout(() => setScreenStage(2), 600);
      const t2 = setTimeout(() => setScreenStage(3), 1200);
      const t3 = setTimeout(() => setScreenStage(4), 1800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (screen === 'screen_02_situation') {
      const t1 = setTimeout(() => setScreenStage(2), 700);
      const t2 = setTimeout(() => setScreenStage(3), 1400);
      const t3 = setTimeout(() => setScreenStage(4), 2100);
      const t4 = setTimeout(() => setScreenStage(5), 2900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else if (screen === 'screen_03_immediate_response') {
      const t1 = setTimeout(() => setScreenStage(2), 500);
      const t2 = setTimeout(() => setScreenStage(3), 1000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else if (screen === 'screen_04_conversation') {
      setChatMessageCount(1);
      const timers = [
        setTimeout(() => setChatMessageCount(2), 1000),
        setTimeout(() => setChatMessageCount(3), 2000),
        setTimeout(() => setChatMessageCount(4), 3000),
        setTimeout(() => setChatMessageCount(5), 4000),
        setTimeout(() => setChatMessageCount(6), 5000),
        setTimeout(() => setScreenStage(2), 5600),
      ];
      return () => {
        timers.forEach((t) => clearTimeout(t));
      };
    } else if (screen === 'screen_05_pattern') {
      const t1 = setTimeout(() => setScreenStage(2), 600);
      const t2 = setTimeout(() => setScreenStage(3), 1200);
      const t3 = setTimeout(() => setScreenStage(4), 1900);
      const t4 = setTimeout(() => setScreenStage(5), 2600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else if (screen === 'screen_06_mirror') {
      const t1 = setTimeout(() => setScreenStage(2), 500);
      const t2 = setTimeout(() => setScreenStage(3), 1000);
      const t3 = setTimeout(() => setScreenStage(4), 1500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (screen === 'screen_07_doubt') {
      const t1 = setTimeout(() => setScreenStage(2), 600);
      const t2 = setTimeout(() => setScreenStage(3), 1200);
      const t3 = setTimeout(() => setScreenStage(4), 1900);
      const t4 = setTimeout(() => setScreenStage(5), 2700);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else if (screen === 'screen_08_microrevelation') {
      const t1 = setTimeout(() => setScreenStage(2), 700);
      const t2 = setTimeout(() => setScreenStage(3), 1500);
      const t3 = setTimeout(() => setScreenStage(4), 2300);
      const t4 = setTimeout(() => setScreenStage(5), 3100);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else if (screen === 'screen_09_closing') {
      const t1 = setTimeout(() => setScreenStage(2), 600);
      const t2 = setTimeout(() => setScreenStage(3), 1300);
      const t3 = setTimeout(() => setScreenStage(4), 2000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (screen === 'screen_10_transition_exp03') {
      const t1 = setTimeout(() => setScreenStage(2), 600);
      const t2 = setTimeout(() => setScreenStage(3), 1200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [runtimeState.currentScreen]);

  // Track analytics events on screen transitions
  useEffect(() => {
    const currentScreen = runtimeState.currentScreen;

    if (currentScreen === 'screen_01_transition') {
      eventTracker.trackEvent('EXP02_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp02',
        payload: { screen: 'screen_01_transition' },
      });
    }

    if (
      currentScreen === 'screen_03_immediate_response' ||
      currentScreen === 'screen_06_mirror'
    ) {
      eventTracker.trackEvent('QUESTION_SHOWN', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp02',
        payload: { screenId: currentScreen },
      });
    }

    if (currentScreen === 'screen_04_conversation') {
      eventTracker.trackEvent('CHAT_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp02',
        payload: { totalMessages: EXP02_CONTENT.screen04.messages.length },
      });
    }

    if (currentScreen === 'screen_08_microrevelation') {
      eventTracker.trackEvent('INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp02',
        payload: { insightKey: 'contextGapRecognized' },
      });
      eventTracker.trackEvent('INSIGHT_DISCOVERED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp02',
        payload: { insightKey: 'contextGapRecognized' },
      });
    }

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { screenId: currentScreen },
    });
  }, [runtimeState.currentScreen, state.session.sessionId, state.session.caseId]);

  // Track chat messages reveal
  useEffect(() => {
    if (runtimeState.currentScreen === 'screen_04_conversation') {
      const currentMsg = EXP02_CONTENT.screen04.messages[chatMessageCount - 1];
      if (currentMsg) {
        eventTracker.trackEvent('CHAT_MESSAGE_SHOWN', {
          sessionId: state.session.sessionId,
          caseId: state.session.caseId,
          experience: 'exp02',
          payload: {
            messageIndex: chatMessageCount,
            speaker: currentMsg.speaker,
            text: currentMsg.text,
          },
        });
      }
    }
  }, [chatMessageCount, runtimeState.currentScreen, state.session.sessionId, state.session.caseId]);

  // Navigate screen handler
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

  // SCREEN 01: Entrar a la situación
  const handleTransitionContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'enter_exp02' },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.started', value: true, scope: 'global' },
    ]);

    navigateToScreen('screen_02_situation');
  };

  // SCREEN 02: Situación continue
  const handleSituationContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_first_question' },
    });

    navigateToScreen('screen_03_immediate_response');
  };

  // SCREEN 03: Pregunta 1 (Respuesta inmediata)
  const handleSelectQuestion1 = (code: string, label: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { questionId: 'exp02_q1_interpretation', option: code, label },
    });

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { questionId: 'exp02_q1_interpretation', answer: label, code },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.firstInterpretation', value: label, scope: 'global' },
      { key: 'exp02.firstInterpretationCode', value: code, scope: 'global' },
      { key: 'exp02.question01Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { key: 'exp02.firstInterpretation', value: label },
    });

    setTimeout(() => {
      navigateToScreen('screen_04_conversation');
    }, 600);
  };

  // SCREEN 04: Continuar después de la conversación
  const handleConversationContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_pattern' },
    });

    navigateToScreen('screen_05_pattern');
  };

  // SCREEN 05: Continuar después del patrón
  const handlePatternContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_mirror' },
    });

    navigateToScreen('screen_06_mirror');
  };

  // SCREEN 06: Pregunta 2 (El Espejo - Patrón de Reacción)
  const handleSelectQuestion2 = (code: string, label: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedOption(code);

    eventTracker.trackEvent('CHOICE_SELECTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { questionId: 'exp02_q2_reaction', option: code, label },
    });

    eventTracker.trackEvent('QUESTION_ANSWERED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { questionId: 'exp02_q2_reaction', answer: label, code },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.reactionPattern', value: label, scope: 'global' },
      { key: 'exp02.reactionPatternCode', value: code, scope: 'global' },
      { key: 'exp02.question02Answered', value: true, scope: 'global' },
    ]);

    eventTracker.trackEvent('MEMORY_UPDATED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { key: 'exp02.reactionPattern', value: label },
    });

    setTimeout(() => {
      navigateToScreen('screen_07_doubt');
    }, 600);
  };

  // SCREEN 07: Continuar después de la duda
  const handleDoubtContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_microrevelation' },
    });

    navigateToScreen('screen_08_microrevelation');
  };

  // SCREEN 08: Continuar después de la microrevelación
  const handleMicrorevelationContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_closing' },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.contextGapRecognized', value: true, scope: 'global' },
    ]);

    navigateToScreen('screen_09_closing');
  };

  // SCREEN 09: Continuar a la transición final
  const handleClosingContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'proceed_to_final_transition' },
    });

    navigateToScreen('screen_10_transition_exp03');
  };

  // SCREEN 10: Final de EXP_02 (Completion)
  const handleFinalStep = () => {
    if (completingRef.current || isCompletedGuard) return;
    completingRef.current = true;
    setIsCompletedGuard(true);
    setIsProcessing(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { action: 'complete_exp02' },
    });

    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      completed: true,
      completedAt: new Date().toISOString(),
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp02.completed', value: true, scope: 'global' },
      { key: 'exp02.completedAt', value: new Date().toISOString(), scope: 'global' },
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

    eventTracker.trackEvent('EXP02_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp02',
      payload: { memory: finalMemory },
    });

    onComplete(finalMemory);
  };

  const currentScreenId = runtimeState.currentScreen;

  // Retrieve saved responses for empathetic reflections
  const savedResponses = (state.responses.exp02 || {}) as Record<string, unknown>;
  const firstInterpretation = (savedResponses['exp02.firstInterpretation'] ||
    savedResponses['firstInterpretation']) as string | undefined;
  const firstInterpretationCode = (savedResponses['exp02.firstInterpretationCode'] ||
    savedResponses['firstInterpretationCode']) as 'A' | 'B' | 'C' | 'D' | undefined;

  const reactionPattern = (savedResponses['exp02.reactionPattern'] ||
    savedResponses['reactionPattern']) as string | undefined;
  const reactionPatternCode = (savedResponses['exp02.reactionPatternCode'] ||
    savedResponses['reactionPatternCode']) as 'A' | 'B' | 'C' | 'D' | undefined;

  // Empathetic reflection resolution for Screen 07
  const interpretationReflection = useMemo(() => {
    if (firstInterpretationCode && EXP02_CONTENT.screen07.interpretationReflections[firstInterpretationCode]) {
      return EXP02_CONTENT.screen07.interpretationReflections[firstInterpretationCode];
    }
    if (firstInterpretation?.includes('hice algo')) {
      return EXP02_CONTENT.screen07.interpretationReflections.B;
    }
    if (firstInterpretation?.includes('pasa')) {
      return EXP02_CONTENT.screen07.interpretationReflections.A;
    }
    if (firstInterpretation?.includes('quede')) {
      return EXP02_CONTENT.screen07.interpretationReflections.C;
    }
    return EXP02_CONTENT.screen07.interpretationReflections.D;
  }, [firstInterpretationCode, firstInterpretation]);

  const reactionReflection = useMemo(() => {
    if (reactionPatternCode && EXP02_CONTENT.screen07.reactionReflections[reactionPatternCode]) {
      return EXP02_CONTENT.screen07.reactionReflections[reactionPatternCode];
    }
    if (reactionPattern?.includes('arreglarlo')) {
      return EXP02_CONTENT.screen07.reactionReflections.A;
    }
    if (reactionPattern?.includes('averiguar')) {
      return EXP02_CONTENT.screen07.reactionReflections.B;
    }
    if (reactionPattern?.includes('espacio')) {
      return EXP02_CONTENT.screen07.reactionReflections.C;
    }
    return EXP02_CONTENT.screen07.reactionReflections.D;
  }, [reactionPatternCode, reactionPattern]);

  return (
    <div
      id="exp02-container"
      className="relative min-h-[90vh] sm:min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 bg-black text-neutral-100 selection:bg-orange-500 selection:text-black font-sans"
    >
      {/* Discrete Audio Ambient Control Hook */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isAudioActive ? 'Silenciar audio ambiental' : 'Activar audio ambiental'}
          className="p-2 text-neutral-700 hover:text-neutral-400 transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-700 rounded-full"
        >
          {isAudioActive ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 01 — TRANSICIÓN DESDE LA PUERTA                                    */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_01_transition' && (
        <div
          id="screen-01-transition"
          className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-lg mx-auto py-8"
        >
          <div className="space-y-6">
            <div className={`transition-all duration-700 ${screenStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
                {EXP02_CONTENT.screen01.leadCaseLabel} #{caseId}
              </span>
            </div>

            <div
              className={`transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-mono tracking-[0.25em] text-white uppercase">
                {EXP02_CONTENT.screen01.leadPause1}
              </h1>
            </div>

            <div
              className={`space-y-3 pt-2 transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-300 font-body leading-relaxed">
                {EXP02_CONTENT.screen01.leadText1}
              </p>
              <p className="text-sm sm:text-base text-neutral-400 font-body leading-relaxed">
                {EXP02_CONTENT.screen01.leadText2}
              </p>
            </div>
          </div>

          <div
            className={`w-full max-w-xs pt-4 transition-all duration-700 ${
              screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-transition-continue"
              onClick={handleTransitionContinue}
            >
              {EXP02_CONTENT.screen01.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 02 — LA SITUACIÓN                                                  */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_02_situation' && (
        <div
          id="screen-02-situation"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 w-full">
            <div
              className={`transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP02_CONTENT.screen02.beat1}
              </p>
            </div>

            <div
              className={`transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP02_CONTENT.screen02.beat2}
              </p>
            </div>

            <div
              className={`transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP02_CONTENT.screen02.beat3}
              </p>
              <p className="text-xs font-mono tracking-widest text-neutral-600 uppercase pt-2">
                {EXP02_CONTENT.screen02.beat4}
              </p>
            </div>

            {/* Dominant quote floating in space */}
            <div
              className={`py-8 sm:py-12 transition-all duration-1000 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white tracking-wide font-normal">
                {EXP02_CONTENT.screen02.dominantQuote}
              </h2>
            </div>
          </div>

          <div
            className={`w-full max-w-xs transition-all duration-700 ${
              screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-situation-continue"
              onClick={handleSituationContinue}
            >
              {EXP02_CONTENT.screen02.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 03 — LA RESPUESTA INMEDIATA (PREGUNTA 1)                           */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_03_immediate_response' && (
        <div
          id="screen-03-immediate-response"
          className="w-full flex flex-col space-y-8 animate-fade-in text-left max-w-xl mx-auto py-4"
        >
          <div className="space-y-2">
            <p
              className={`text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              SITUACIÓN
            </p>
            <h2
              className={`text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-white tracking-wide leading-snug pt-2 transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP02_CONTENT.screen03.question}
            </h2>
          </div>

          <div
            className={`space-y-3 pt-3 transition-all duration-700 ${
              screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {EXP02_CONTENT.screen03.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;
              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-exp02-q1-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  evidenceLabel="DATO 03"
                  selected={isSelected}
                  isAnySelected={isAnySelected}
                  disabled={isAnySelected}
                  onClick={() => handleSelectQuestion1(opt.code, opt.label)}
                >
                  <span className="font-body text-base sm:text-lg">{opt.label}</span>
                </ChoiceButton>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 04 — LA CONVERSACIÓN (REGISTRO CINEMATOGRÁFICO)                    */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_04_conversation' && (
        <div
          id="screen-04-conversation"
          className="w-full flex flex-col space-y-10 animate-fade-in text-left max-w-xl mx-auto py-6"
        >
          <div className="border-b border-[#181818] pb-3 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase">
              {EXP02_CONTENT.screen04.introLabel}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
              CASO #{caseId}
            </span>
          </div>

          {/* Dialogue sequence */}
          <div className="space-y-6 py-2">
            {EXP02_CONTENT.screen04.messages.map((msg, index) => {
              const isRevealed = index < chatMessageCount;
              const isYou = msg.speaker === 'YOU';
              return (
                <div
                  key={index}
                  className={`flex flex-col space-y-1 transition-all duration-700 ${
                    isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
                  } ${isYou ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">
                    {isYou ? 'TÚ' : 'ELLA'}
                  </span>
                  <div
                    className={`p-3.5 sm:p-4 rounded-xl max-w-md ${
                      isYou
                        ? 'bg-[#0A0A0A] border border-[#1C1C1C] text-neutral-200 font-body'
                        : 'bg-[#0E0E0E] border border-orange-500/20 text-neutral-100 font-serif italic'
                    }`}
                  >
                    <p className="text-sm sm:text-base leading-relaxed">“{msg.text}”</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`w-full max-w-xs mx-auto pt-4 transition-all duration-700 ${
              screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-conversation-continue"
              onClick={handleConversationContinue}
            >
              {EXP02_CONTENT.screen04.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 05 — EL PATRÓN                                                     */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_05_pattern' && (
        <div
          id="screen-05-pattern"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <div
              className={`transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                OBSERVACIÓN
              </span>
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed pt-3">
                {EXP02_CONTENT.screen05.beat1}
              </p>
            </div>

            <div
              className={`transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed">
                {EXP02_CONTENT.screen05.beat2}
              </p>
            </div>

            <div
              className={`transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-400 font-body italic">
                {EXP02_CONTENT.screen05.beat3}
              </p>
            </div>

            {/* Dominant weight */}
            <div
              className={`pt-6 border-t border-[#181818] transition-all duration-700 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed border-l-2 border-orange-500 pl-5 py-2">
                {EXP02_CONTENT.screen05.dominantText}
              </h2>
            </div>
          </div>

          <div
            className={`w-full max-w-xs pt-4 transition-all duration-700 ${
              screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-pattern-continue"
              onClick={handlePatternContinue}
            >
              {EXP02_CONTENT.screen05.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 06 — EL ESPEJO (PREGUNTA 2)                                        */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_06_mirror' && (
        <div
          id="screen-06-mirror"
          className="w-full flex flex-col space-y-8 animate-fade-in text-left max-w-xl mx-auto py-4"
        >
          <div className="space-y-2">
            <p
              className={`text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP02_CONTENT.screen06.lead1}
            </p>
            <p
              className={`text-sm text-neutral-400 font-body transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP02_CONTENT.screen06.lead2}
            </p>
            <h2
              className={`text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-white tracking-wide leading-snug pt-2 transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {EXP02_CONTENT.screen06.question}
            </h2>
          </div>

          <div
            className={`space-y-3 pt-3 transition-all duration-700 ${
              screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {EXP02_CONTENT.screen06.options.map((opt) => {
              const isSelected = selectedOption === opt.code;
              const isAnySelected = selectedOption !== null;
              return (
                <ChoiceButton
                  key={opt.id}
                  id={`opt-exp02-q2-${opt.code.toLowerCase()}`}
                  code={opt.code}
                  evidenceLabel="DATO 04"
                  selected={isSelected}
                  isAnySelected={isAnySelected}
                  disabled={isAnySelected}
                  onClick={() => handleSelectQuestion2(opt.code, opt.label)}
                >
                  <span className="font-body text-base sm:text-lg">{opt.label}</span>
                </ChoiceButton>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 07 — LA DUDA (BRANCHING EMPÁTICO)                                  */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07_doubt' && (
        <div
          id="screen-07-doubt"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-8 text-left w-full">
            {/* Empathetic branch reflection */}
            <div
              className={`space-y-3 p-4 sm:p-5 rounded-xl bg-[#080808] border border-[#1A1A1A] transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase">
                TU REGISTRO
              </span>
              <p className="text-sm sm:text-base text-neutral-300 font-body">
                {interpretationReflection}
              </p>
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {reactionReflection}
              </p>
            </div>

            <div
              className={`space-y-3 transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-serif italic text-white leading-relaxed">
                {EXP02_CONTENT.screen07.coreQuestion1}
              </h2>
            </div>

            <div
              className={`transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed">
                {EXP02_CONTENT.screen07.coreQuestion2}
              </p>
            </div>

            {/* Conceptual Contrast */}
            <div
              className={`pt-6 border-t border-[#181818] space-y-3 transition-all duration-700 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-xs font-mono tracking-[0.2em] text-neutral-500 uppercase">
                {EXP02_CONTENT.screen07.contrastLead}
              </p>
              <div className="space-y-2 pt-1 font-mono tracking-wider">
                <div className="text-sm text-neutral-400">
                  {EXP02_CONTENT.screen07.contrastA}
                </div>
                <div className="text-xs text-neutral-600 font-body italic">
                  {EXP02_CONTENT.screen07.contrastAnd}
                </div>
                <div className="text-base sm:text-lg text-white font-semibold border-l-2 border-orange-500 pl-3">
                  {EXP02_CONTENT.screen07.contrastB}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`w-full max-w-xs pt-4 transition-all duration-700 ${
              screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-doubt-continue"
              onClick={handleDoubtContinue}
            >
              {EXP02_CONTENT.screen07.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 08 — MICROREVELACIÓN                                               */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_08_microrevelation' && (
        <div
          id="screen-08-microrevelation"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-8 text-left w-full">
            <div
              className={`space-y-4 transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed">
                {EXP02_CONTENT.screen08.lead1}
              </h2>
            </div>

            <div
              className={`transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed border-l-2 border-orange-500 pl-4 py-1">
                {EXP02_CONTENT.screen08.lead2}
              </p>
            </div>

            <div
              className={`space-y-2 pt-2 transition-all duration-700 ${
                screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-xs font-mono tracking-[0.2em] text-neutral-500 uppercase">
                {EXP02_CONTENT.screen08.lead3}
              </p>
              <p className="text-sm sm:text-base text-neutral-400 font-body leading-relaxed">
                {EXP02_CONTENT.screen08.lead4}
              </p>
            </div>

            <div
              className={`pt-6 border-t border-[#181818] transition-all duration-700 ${
                screenStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-2xl sm:text-3xl font-serif italic text-white tracking-wide">
                {EXP02_CONTENT.screen08.conclusion}
              </p>
            </div>
          </div>

          <div
            className={`w-full max-w-xs pt-4 transition-all duration-700 ${
              screenStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-microrevelation-continue"
              onClick={handleMicrorevelationContinue}
            >
              {EXP02_CONTENT.screen08.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 09 — CIERRE                                                        */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_09_closing' && (
        <div
          id="screen-09-closing"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6 text-left w-full">
            <div
              className={`space-y-3 transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-lg sm:text-xl font-serif italic text-white leading-relaxed">
                {EXP02_CONTENT.screen09.lead1}
              </p>
              <p className="text-sm sm:text-base text-neutral-400 font-body">
                {EXP02_CONTENT.screen09.lead2}
              </p>
              <p className="text-sm sm:text-base text-neutral-300 font-body">
                {EXP02_CONTENT.screen09.lead3}
              </p>
            </div>

            <div
              className={`pt-4 border-t border-[#181818] space-y-3 transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-xs font-mono tracking-[0.2em] text-neutral-500 uppercase">
                {EXP02_CONTENT.screen09.lead4}
              </p>
              <h2 className="text-xl sm:text-2xl font-serif italic text-white leading-relaxed">
                {EXP02_CONTENT.screen09.lead5}
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 font-body leading-relaxed">
                {EXP02_CONTENT.screen09.lead6}
              </p>
            </div>
          </div>

          <div
            className={`w-full max-w-xs pt-4 transition-all duration-700 ${
              screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-closing-continue"
              onClick={handleClosingContinue}
            >
              {EXP02_CONTENT.screen09.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 10 — TRANSICIÓN A EXP_03 (COMPLETION)                              */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_10_transition_exp03' && (
        <div
          id="screen-10-transition-exp03"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-lg mx-auto py-8"
        >
          <div className="space-y-6">
            <div
              className={`transition-all duration-700 ${
                screenStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-mono tracking-[0.25em] text-white uppercase">
                {EXP02_CONTENT.screen10.lead1}
              </h1>
            </div>

            <div
              className={`transition-all duration-700 ${
                screenStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg font-serif italic text-neutral-300 leading-relaxed">
                {EXP02_CONTENT.screen10.lead2}
              </p>
            </div>
          </div>

          <div
            className={`w-full max-w-xs pt-4 transition-all duration-700 ${
              screenStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-complete-exp02"
              onClick={handleFinalStep}
            >
              {EXP02_CONTENT.screen10.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}
    </div>
  );
};
