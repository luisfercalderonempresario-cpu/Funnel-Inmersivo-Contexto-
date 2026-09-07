// EXP_03 — EL ERROR INVISIBLE (P0 #02 CTX_E03_V01_PATTERN)
import React, { useState, useEffect, useRef, useTransition } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { EXP03_CONTENT } from './exp03Content';
import { EXP03_DEFINITION } from './exp03Definition';
import { ExperienceMemoryManager } from '../../engine/experience/experienceMemory';
import {
  loadExperienceRuntimeState,
  persistExperienceRuntimeState,
  transitionScreenState,
} from '../../engine/experience/experienceState';
import { ExperienceRuntimeState } from '../../engine/experience/types';
import { eventTracker } from '../../engine/events/eventTracker';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { ArrowDown, Volume2, VolumeX } from 'lucide-react';

export const EXP03: React.FC<ExperienceComponentProps> = ({
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
        experience: 'exp03',
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
      const exp03Responses = (prev.responses.exp03 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp03: {
            ...exp03Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp03',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_03
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp03');
    // Ensure screen is valid in EXP03_DEFINITION
    if (existing && existing.currentScreen && EXP03_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp03',
      currentScreen: 'screen_01_opening',
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

  // Cinematic state
  const [isCinematicActive, setIsCinematicActive] = useState<boolean>(false);
  const [isPostVideoSilence, setIsPostVideoSilence] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasEndedRef = useRef<boolean>(false);
  const safetyTimeoutRef = useRef<number | null>(null);

  // Progressive pacing stages for current screen
  const currentScreenId = runtimeState.currentScreen;
  const [pacingStage, setPacingStage] = useState<number>(1);

  // Reset pacing stage on screen change
  useEffect(() => {
    setPacingStage(1);
  }, [currentScreenId]);

  // Synchronize runtime persistence
  useEffect(() => {
    persistExperienceRuntimeState(runtimeState);
  }, [runtimeState]);

  // Track analytics events on screen transitions
  useEffect(() => {
    const screen = runtimeState.currentScreen;

    if (screen === 'screen_01_opening') {
      eventTracker.trackEvent('EXP03_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp03',
        payload: { screen: 'screen_01_opening' },
      });
    }

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { screenId: screen },
    });
  }, [runtimeState.currentScreen, state.session.sessionId, state.session.caseId]);

  // Navigate screen handler
  const navigateToScreen = (nextScreenId: string) => {
    startTransition(() => {
      setIsProcessing(false);
      setRuntimeState((prev) => {
        const next = transitionScreenState(prev, nextScreenId, 'ACTIVE');
        persistExperienceRuntimeState(next);
        return next;
      });
    });
  };

  const clearSafetyTimeout = () => {
    if (safetyTimeoutRef.current !== null) {
      window.clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSafetyTimeout();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // SCREEN 01: Apertura & Pacing
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_01_opening') return;

    // Stage 1: Eyebrow + Main title
    // Stage 2: Pause -> Secondary text "Y ocurre en cuestión de segundos."
    // Stage 3: CTA "VER QUÉ OCURRE"
    const timer1 = window.setTimeout(() => setPacingStage(2), 1600);
    const timer2 = window.setTimeout(() => setPacingStage(3), 2800);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // VIDEO INTERACTION & PLAYBACK (CTA -> VIDEO)
  // ---------------------------------------------------------------------------
  const handleEnterCinematic = async () => {
    if (isProcessing || isCinematicActive) return;
    setIsProcessing(true);

    // 1. Registrar eventos
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'view_what_happens', label: EXP03_CONTENT.screen01.ctaLabel },
    });
    eventTracker.trackEvent('CINEMATIC_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { asset: 'https://media.manualparanovios.com/CTX_E03_V01_PATTERN.mp4' },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp03.started', value: true, scope: 'global' },
      { key: 'exp03.cinematicStarted', value: true, scope: 'global' },
    ]);

    // 2. Activar la capa cinematográfica fullscreen
    setIsCinematicActive(true);
    hasEndedRef.current = false;

    // 3. Obtener videoRef.current directamente en el gesto del usuario
    const video = videoRef.current;
    if (video) {
      // 4. currentTime = 0
      video.currentTime = 0;
      // 5. muted = false
      video.muted = false;
      // 6. volume = 1
      video.volume = 1;

      // Arm safety timeout (based on duration if available + 2s, or 18s fallback)
      clearSafetyTimeout();
      const durationMs =
        video.duration && !isNaN(video.duration) && video.duration > 0
          ? (video.duration + 2) * 1000
          : 18000;
      safetyTimeoutRef.current = window.setTimeout(() => {
        if (!hasEndedRef.current) {
          handleVideoEnded();
        }
      }, durationMs);

      // 7. Ejecutar video.play() DIRECTAMENTE dentro del click del usuario
      try {
        await video.play();
      } catch (err) {
        console.warn('[EXP03 Video Audio Play Rejected]', err);
        // Fallback: intentar muted = true
        try {
          video.muted = true;
          await video.play();
        } catch (mutedErr) {
          console.error('[EXP03 Video Play Failed Completely]', mutedErr);
          eventTracker.trackEvent('CINEMATIC_FAILED', {
            sessionId: state.session.sessionId,
            caseId: state.session.caseId,
            experience: 'exp03',
            payload: { error: String(mutedErr) },
          });
          clearSafetyTimeout();
          // Salir limpiamente del modo cinematográfico hacia la reconstrucción, SIN bloquear EXP_03 y SIN navegar a EXP_04
          setIsCinematicActive(false);
          setIsProcessing(false);
          navigateToScreen('screen_02_reconstruction');
        }
      }
    } else {
      setIsCinematicActive(false);
      setIsProcessing(false);
      navigateToScreen('screen_02_reconstruction');
    }
  };

  // ---------------------------------------------------------------------------
  // VIDEO ONENDED HANDLER
  // ---------------------------------------------------------------------------
  const handleVideoEnded = () => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;
    clearSafetyTimeout();

    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
      } catch {}
    }

    eventTracker.trackEvent('CINEMATIC_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { asset: 'https://media.manualparanovios.com/CTX_E03_V01_PATTERN.mp4' },
    });

    // 1. Pausar/limpiar estado audiovisual
    // 2. Abandonar modo cinematográfico
    setIsCinematicActive(false);

    // 3. Mostrar negro
    setIsPostVideoSilence(true);

    // 4. Mantener aproximadamente 900 ms de silencio visual
    window.setTimeout(() => {
      setIsPostVideoSilence(false);
      setIsProcessing(false);
      // 5. Comenzar la reconstrucción
      navigateToScreen('screen_02_reconstruction');
    }, 900);
  };

  // ---------------------------------------------------------------------------
  // SCREEN 02: Reconstrucción del Patrón & Foco en Interpretación
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_02_reconstruction') return;

    // Stage 1: "Lo que acabas de ver ocurre muy rápido."
    // Stage 2: "Pero hay cuatro momentos diferentes."
    // Stage 3: Momento 1 (SITUACIÓN)
    // Stage 4: Momento 2 (INTERPRETACIÓN)
    // Stage 5: Momento 3 (REACCIÓN)
    // Stage 6: Momento 4 (CONSECUENCIA) -> Track PATTERN_RECONSTRUCTION_VIEWED
    // Stage 7: Foco en INTERPRETACIÓN (atenuar los demás) -> "Aquí puede comenzar el error..." -> Track INTERPRETATION_REVEALED
    // Stage 8: CTA CONTINUAR
    const t1 = window.setTimeout(() => setPacingStage(2), 1200);
    const t2 = window.setTimeout(() => setPacingStage(3), 2400);
    const t3 = window.setTimeout(() => setPacingStage(4), 3600);
    const t4 = window.setTimeout(() => setPacingStage(5), 4800);
    const t5 = window.setTimeout(() => {
      setPacingStage(6);
      eventTracker.trackEvent('PATTERN_RECONSTRUCTION_VIEWED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp03',
      });
    }, 6000);
    const t6 = window.setTimeout(() => {
      setPacingStage(7);
      eventTracker.trackEvent('INTERPRETATION_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp03',
      });
    }, 8200);
    const t7 = window.setTimeout(() => setPacingStage(8), 10200);

    return () => {
      [t1, t2, t3, t4, t5, t6, t7].forEach((t) => window.clearTimeout(t));
    };
  }, [currentScreenId, state.session.sessionId, state.session.caseId]);

  const handleReconstructionContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'proceed_to_distortion', label: EXP03_CONTENT.screen02.ctaLabel },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp03.patternReconstructed', value: true, scope: 'global' },
      { key: 'exp03.interpretationFocused', value: true, scope: 'global' },
    ]);

    navigateToScreen('screen_03_distortion');
  };

  // ---------------------------------------------------------------------------
  // SCREEN 03: Demostración de la Distorsión
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_03_distortion') return;

    // Stage 1: ELLA: “Sí.”
    // Stage 2: REALIDAD: “Sí.”
    // Stage 3: TU INTERPRETACIÓN: “Está molesta conmigo.”
    // Stage 4: “LA SEÑAL NO CAMBIÓ.”
    // Stage 5: “Lo que cambió fue el significado que le diste.”
    // Stage 6: CTA CONTINUAR
    const t1 = window.setTimeout(() => setPacingStage(2), 1400);
    const t2 = window.setTimeout(() => setPacingStage(3), 2800);
    const t3 = window.setTimeout(() => setPacingStage(4), 4400);
    const t4 = window.setTimeout(() => setPacingStage(5), 6000);
    const t5 = window.setTimeout(() => setPacingStage(6), 7600);

    return () => {
      [t1, t2, t3, t4, t5].forEach((t) => window.clearTimeout(t));
    };
  }, [currentScreenId]);

  const handleDistortionContinue = () => {
    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { action: 'proceed_to_revelation', label: EXP03_CONTENT.screen03.ctaLabel },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp03.distortionRecognized', value: true, scope: 'global' },
    ]);

    navigateToScreen('screen_04_revelation');
  };

  // ---------------------------------------------------------------------------
  // SCREEN 04: Revelación Central & CTA Final
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_04_revelation') return;

    // Stage 1: "Entonces, la pregunta ya no es…"
    // Stage 2: "¿Qué debería hacer?"
    // Stage 3: (Desvanecer pregunta anterior) -> "La pregunta debería ser:"
    // Stage 4: Dominant: "¿QUÉ INFORMACIÓN ME FALTA?" -> Track CONTEXT_GAP_QUESTION_REVEALED
    // Stage 5: CTA COMENZAR INVESTIGACIÓN
    const t1 = window.setTimeout(() => setPacingStage(2), 1200);
    const t2 = window.setTimeout(() => setPacingStage(3), 3200);
    const t3 = window.setTimeout(() => {
      setPacingStage(4);
      eventTracker.trackEvent('CONTEXT_GAP_QUESTION_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp03',
        payload: { question: EXP03_CONTENT.screen04.mainQuestion },
      });
    }, 5200);
    const t4 = window.setTimeout(() => setPacingStage(5), 7200);

    return () => {
      [t1, t2, t3, t4].forEach((t) => window.clearTimeout(t));
    };
  }, [currentScreenId, state.session.sessionId, state.session.caseId]);

  // Solo este CTA avanza a EXP_04
  const handleBeginInvestigation = () => {
    if (completingRef.current || isCompletedGuard) return;
    completingRef.current = true;
    setIsCompletedGuard(true);
    setIsProcessing(true);

    eventTracker.trackEvent('CTA_CLICKED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: {
        action: 'begin_investigation',
        label: EXP03_CONTENT.screen04.ctaLabel,
      },
    });

    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      invisibleErrorRecognized: true,
      contextGapRecognized: true,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp03.invisibleErrorRecognized', value: true, scope: 'global' },
      { key: 'exp03.contextGapRecognized', value: true, scope: 'global' },
      { key: 'exp03.completed', value: true, scope: 'global' },
      { key: 'exp03.completedAt', value: new Date().toISOString(), scope: 'global' },
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

    eventTracker.trackEvent('EXP03_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp03',
      payload: { memory: finalMemory },
    });

    // Advance to EXP_04
    onComplete(finalMemory);
  };

  return (
    <div
      id="exp03-container"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-10 sm:py-16 bg-[#050505] text-neutral-100 font-sans selection:bg-orange-500 selection:text-black"
    >
      {/* ========================================================================= */}
      {/* CAPA CINEMATOGRÁFICA FULLSCREEN (ASSET CTX_E03_V01_PATTERN.mp4)           */}
      {/* Montado en el DOM siempre para garantizar videoRef.current al interactuar */}
      {/* ========================================================================= */}
      <div
        id="exp03-cinematic-layer"
        className={`fixed inset-0 overflow-hidden bg-black flex items-center justify-center transition-opacity duration-700 ${
          isCinematicActive
            ? 'z-[9999] opacity-100 pointer-events-auto'
            : 'z-[-1] opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isCinematicActive}
      >
        <video
          ref={videoRef}
          src="https://media.manualparanovios.com/CTX_E03_V01_PATTERN.mp4"
          preload="auto"
          playsInline
          controls={false}
          loop={false}
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover object-center pointer-events-none select-none"
          aria-label="Escena cinematográfica: Reacción y patrón de comportamiento."
        />
      </div>

      {/* ========================================================================= */}
      {/* CAPA DE SILENCIO VISUAL (900 MS POST-VIDEO)                               */}
      {/* ========================================================================= */}
      {isPostVideoSilence && (
        <div
          id="exp03-silence-layer"
          className="fixed inset-0 z-[9998] bg-black pointer-events-auto transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Discrete Audio Ambient Control Hook */}
      {!isCinematicActive && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <button
            type="button"
            onClick={toggleAudio}
            aria-label={isAudioActive ? 'Silenciar audio' : 'Activar audio'}
            className="p-2 text-neutral-600 hover:text-neutral-400 transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-700 rounded-full"
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 01 — APERTURA                                                      */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_01_opening' && !isCinematicActive && (
        <div
          id="screen-01-opening"
          className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-6">
            <div className="transition-all duration-1000 opacity-100">
              <span className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
                {EXP03_CONTENT.screen01.eyebrow} #{caseId}
              </span>
            </div>

            {/* Dominant Headline */}
            <div
              className={`transition-all duration-1000 ${
                pacingStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-white tracking-wide leading-relaxed uppercase max-w-lg mx-auto">
                {EXP03_CONTENT.screen01.leadTitle}
              </h1>
            </div>

            {/* Visual Pause -> Secondary Beat */}
            <div
              className={`pt-2 transition-all duration-1000 ${
                pacingStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-400 font-body leading-relaxed italic">
                {EXP03_CONTENT.screen01.leadSubtitle}
              </p>
            </div>
          </div>

          {/* CTA VER QUÉ OCURRE */}
          <div
            className={`pt-6 transition-all duration-1000 ${
              pacingStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-view-what-happens"
              onClick={handleEnterCinematic}
              disabled={isProcessing}
            >
              {EXP03_CONTENT.screen01.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 02 — RECONSTRUCCIÓN DEL PATRÓN & FOCO EN INTERPRETACIÓN            */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_02_reconstruction' && (
        <div
          id="screen-02-reconstruction"
          className="w-full flex flex-col items-center text-center space-y-8 sm:space-y-10 animate-fade-in max-w-xl mx-auto py-6"
        >
          {/* Introductory Evidence Header */}
          <div className="space-y-3 w-full">
            <span className="font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase">
              {EXP03_CONTENT.screen02.eyebrow}
            </span>

            <div
              className={`transition-all duration-1000 ${
                pacingStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body">
                {EXP03_CONTENT.screen02.intro1}
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                pacingStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-sm sm:text-base text-neutral-500 font-body">
                {EXP03_CONTENT.screen02.intro2}
              </p>
            </div>
          </div>

          {/* Progressive 4-Moment Evidence Chain */}
          <div className="w-full max-w-md mx-auto space-y-3 pt-2 text-left">
            {/* MOMENTO 1: SITUACIÓN */}
            <div
              className={`p-4 sm:p-5 rounded-lg border transition-all duration-700 ${
                pacingStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              } ${
                pacingStage >= 7
                  ? 'bg-[#080808]/40 border-neutral-900/60 opacity-30'
                  : 'bg-[#0e0e0e] border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {EXP03_CONTENT.screen02.moment1.label}
                </span>
                <span className="text-[11px] font-mono text-neutral-600">01</span>
              </div>
              <p className="text-sm text-neutral-400 font-body mt-1">
                {EXP03_CONTENT.screen02.moment1.subtext}
              </p>
              <div className="mt-2 pt-2 border-t border-neutral-900 text-xs sm:text-sm font-serif italic text-neutral-300">
                <span className="text-neutral-500 font-sans not-italic mr-2">
                  {EXP03_CONTENT.screen02.moment1.exampleLabel}
                </span>
                {EXP03_CONTENT.screen02.moment1.exampleQuote}
              </div>
            </div>

            {/* Down arrow connector 1 */}
            {pacingStage >= 4 && (
              <div
                className={`flex justify-center transition-all duration-500 ${
                  pacingStage >= 7 ? 'opacity-25' : 'opacity-60'
                }`}
              >
                <ArrowDown className="w-4 h-4 text-neutral-500" />
              </div>
            )}

            {/* MOMENTO 2: INTERPRETACIÓN (FOCO PRINCIPAL EN STAGE 7) */}
            <div
              className={`p-4 sm:p-5 rounded-lg border transition-all duration-700 ${
                pacingStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              } ${
                pacingStage >= 7
                  ? 'bg-[#141210] border-orange-500/60 shadow-[0_0_20px_rgba(234,88,12,0.15)] ring-1 ring-orange-500/40'
                  : 'bg-[#0e0e0e] border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-xs uppercase tracking-[0.2em] ${
                    pacingStage >= 7 ? 'text-orange-400 font-medium' : 'text-neutral-400'
                  }`}
                >
                  {EXP03_CONTENT.screen02.moment2.label}
                </span>
                <span className="text-[11px] font-mono text-neutral-600">02</span>
              </div>
              <p
                className={`text-sm font-body mt-1 ${
                  pacingStage >= 7 ? 'text-neutral-200' : 'text-neutral-400'
                }`}
              >
                {EXP03_CONTENT.screen02.moment2.subtext}
              </p>
              <div className="mt-2 pt-2 border-t border-neutral-900 text-xs sm:text-sm font-serif italic text-neutral-200">
                <span className="text-neutral-500 font-sans not-italic mr-2">
                  {EXP03_CONTENT.screen02.moment2.exampleLabel}
                </span>
                {EXP03_CONTENT.screen02.moment2.exampleQuote}
              </div>
            </div>

            {/* Down arrow connector 2 */}
            {pacingStage >= 5 && (
              <div
                className={`flex justify-center transition-all duration-500 ${
                  pacingStage >= 7 ? 'opacity-25' : 'opacity-60'
                }`}
              >
                <ArrowDown className="w-4 h-4 text-neutral-500" />
              </div>
            )}

            {/* MOMENTO 3: REACCIÓN */}
            <div
              className={`p-4 sm:p-5 rounded-lg border transition-all duration-700 ${
                pacingStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              } ${
                pacingStage >= 7
                  ? 'bg-[#080808]/40 border-neutral-900/60 opacity-30'
                  : 'bg-[#0e0e0e] border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {EXP03_CONTENT.screen02.moment3.label}
                </span>
                <span className="text-[11px] font-mono text-neutral-600">03</span>
              </div>
              <p className="text-sm text-neutral-400 font-body mt-1">
                {EXP03_CONTENT.screen02.moment3.subtext}
              </p>
            </div>

            {/* Down arrow connector 3 */}
            {pacingStage >= 6 && (
              <div
                className={`flex justify-center transition-all duration-500 ${
                  pacingStage >= 7 ? 'opacity-25' : 'opacity-60'
                }`}
              >
                <ArrowDown className="w-4 h-4 text-neutral-500" />
              </div>
            )}

            {/* MOMENTO 4: CONSECUENCIA */}
            <div
              className={`p-4 sm:p-5 rounded-lg border transition-all duration-700 ${
                pacingStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              } ${
                pacingStage >= 7
                  ? 'bg-[#080808]/40 border-neutral-900/60 opacity-30'
                  : 'bg-[#0e0e0e] border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {EXP03_CONTENT.screen02.moment4.label}
                </span>
                <span className="text-[11px] font-mono text-neutral-600">04</span>
              </div>
              <p className="text-sm text-neutral-400 font-body mt-1">
                {EXP03_CONTENT.screen02.moment4.subtext}
              </p>
            </div>
          </div>

          {/* REVELACIÓN DEL FOCO: Aquí puede comenzar el error */}
          <div
            className={`w-full max-w-md mx-auto pt-4 transition-all duration-1000 ${
              pacingStage >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="border-l-2 border-orange-500 pl-4 py-2 text-left space-y-2">
              <p className="text-lg sm:text-xl font-serif text-white italic leading-snug">
                {EXP03_CONTENT.screen02.focus.statement}
              </p>
              <p className="text-sm sm:text-base text-neutral-400 font-body leading-relaxed">
                {EXP03_CONTENT.screen02.focus.explanation}
              </p>
            </div>
          </div>

          {/* CTA CONTINUAR */}
          <div
            className={`pt-4 transition-all duration-1000 ${
              pacingStage >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-reconstruction-continue"
              onClick={handleReconstructionContinue}
            >
              {EXP03_CONTENT.screen02.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 03 — DEMOSTRACIÓN DE LA DISTORSIÓN                                 */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_03_distortion' && (
        <div
          id="screen-03-distortion"
          className="w-full flex flex-col items-center text-center space-y-10 animate-fade-in max-w-xl mx-auto py-8"
        >
          <div className="space-y-3">
            <span className="font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase">
              {EXP03_CONTENT.screen03.eyebrow}
            </span>
          </div>

          {/* Comparative evidence sequence */}
          <div className="w-full max-w-md mx-auto space-y-4 text-left">
            {/* ELLA: “Sí.” */}
            <div
              className={`p-4 rounded-lg bg-[#0e0e0e] border border-neutral-800 transition-all duration-700 ${
                pacingStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                {EXP03_CONTENT.screen03.step1.speaker}
              </span>
              <p className="text-base sm:text-lg font-serif italic text-white mt-1">
                {EXP03_CONTENT.screen03.step1.text}
              </p>
            </div>

            {/* REALIDAD: “Sí.” */}
            <div
              className={`p-4 rounded-lg bg-[#0e0e0e] border border-neutral-800 transition-all duration-700 ${
                pacingStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                {EXP03_CONTENT.screen03.step2.speaker}
              </span>
              <p className="text-base sm:text-lg font-serif italic text-neutral-200 mt-1">
                {EXP03_CONTENT.screen03.step2.text}
              </p>
            </div>

            {/* TU INTERPRETACIÓN: “Está molesta conmigo.” */}
            <div
              className={`p-4 rounded-lg bg-[#141210] border border-neutral-700 transition-all duration-700 ${
                pacingStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-orange-400">
                {EXP03_CONTENT.screen03.step3.speaker}
              </span>
              <p className="text-base sm:text-lg font-serif italic text-orange-200 mt-1">
                {EXP03_CONTENT.screen03.step3.text}
              </p>
            </div>
          </div>

          {/* Punchline: LA SEÑAL NO CAMBIÓ. Lo que cambió fue el significado que le diste. */}
          <div className="space-y-4 max-w-lg mx-auto pt-2">
            <div
              className={`transition-all duration-1000 ${
                pacingStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif uppercase tracking-wider text-white">
                {EXP03_CONTENT.screen03.punchline.dominant}
              </h2>
            </div>

            <div
              className={`transition-all duration-1000 ${
                pacingStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed">
                {EXP03_CONTENT.screen03.punchline.subtext}
              </p>
            </div>
          </div>

          {/* CTA CONTINUAR */}
          <div
            className={`pt-4 transition-all duration-1000 ${
              pacingStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-distortion-continue"
              onClick={handleDistortionContinue}
            >
              {EXP03_CONTENT.screen03.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 04 — REVELACIÓN CENTRAL & CTA FINAL                                */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_04_revelation' && (
        <div
          id="screen-04-revelation"
          className="w-full flex flex-col items-center text-center space-y-12 animate-fade-in max-w-2xl mx-auto py-10"
        >
          <div className="space-y-6 w-full">
            <span className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
              {EXP03_CONTENT.screen04.eyebrow}
            </span>

            {/* Prelude: "Entonces, la pregunta ya no es…" */}
            <div
              className={`transition-all duration-1000 ${
                pacingStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg text-neutral-400 font-body">
                {EXP03_CONTENT.screen04.prelude}
              </p>
            </div>

            {/* Old question (fades out visually on stage >= 3) */}
            <div
              className={`transition-all duration-1000 ${
                pacingStage >= 2 && pacingStage < 3
                  ? 'opacity-100 translate-y-0'
                  : pacingStage >= 3
                  ? 'opacity-20 line-through text-neutral-600'
                  : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-lg sm:text-xl font-serif italic text-neutral-400">
                “{EXP03_CONTENT.screen04.oldQuestion}”
              </p>
            </div>

            {/* Bridge: "La pregunta debería ser:" */}
            <div
              className={`pt-4 transition-all duration-1000 ${
                pacingStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-400">
                {EXP03_CONTENT.screen04.bridge}
              </p>
            </div>

            {/* DOMINANT INSIGHT: "¿QUÉ INFORMACIÓN ME FALTA?" */}
            {/* Recibe el mayor peso visual y mayor espacio respiratorio de la experiencia */}
            <div
              className={`pt-6 pb-4 transition-all duration-1000 ${
                pacingStage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="max-w-xl mx-auto py-6 px-6 rounded-2xl bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-neutral-800 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-wide leading-tight uppercase font-medium">
                  {EXP03_CONTENT.screen04.mainQuestion}
                </h2>
              </div>
            </div>
          </div>

          {/* CTA FINAL: COMENZAR INVESTIGACIÓN (Solo este avanza a EXP_04) */}
          <div
            className={`pt-6 transition-all duration-1000 ${
              pacingStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="cta-begin-investigation"
              onClick={handleBeginInvestigation}
              disabled={isProcessing}
            >
              {EXP03_CONTENT.screen04.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}
    </div>
  );
};
