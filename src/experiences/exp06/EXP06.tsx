// EXP_06 — CONTEXTO™ (P0 #05 CTX_E06_V01_SAME_SIGNAL)
// Narrative Experience & Central Demonstration Component
import React, { useState, useEffect, useRef, useTransition } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
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
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { Volume2, VolumeX } from 'lucide-react';

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

  // Cinematic video state
  const [isCinematicActive, setIsCinematicActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasEndedRef = useRef<boolean>(false);
  const safetyTimeoutRef = useRef<number | null>(null);

  // Pacing stages per screen
  const [openingPacing, setOpeningPacing] = useState<number>(1);
  const [signalPacing, setSignalPacing] = useState<number>(0);
  const [interpPacing, setInterpPacing] = useState<number>(0);
  const [pausePacing, setPausePacing] = useState<number>(0);
  const [perspectivePacing, setPerspectivePacing] = useState<number>(0);
  const [wowPacing, setWowPacing] = useState<number>(0);
  const [convPacing, setConvPacing] = useState<number>(0);
  const [mechanismPacing, setMechanismPacing] = useState<number>(0);
  const [defPacing, setDefPacing] = useState<number>(0);
  const [bridgePacing, setBridgePacing] = useState<number>(1);

  const currentScreenId = runtimeState.currentScreen;

  // Synchronize runtime persistence
  useEffect(() => {
    persistExperienceRuntimeState(runtimeState);
  }, [runtimeState]);

  // Track initial screen view and EXP06_STARTED
  useEffect(() => {
    const screen = runtimeState.currentScreen;

    if (screen === 'screen_01_opening') {
      eventTracker.trackEvent('EXP06_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
        payload: { screen: 'screen_01_opening' },
      });
    }

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { screenId: screen },
    });
  }, [runtimeState.currentScreen, state.session.sessionId, state.session.caseId]);

  // Navigation helper
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

  useEffect(() => {
    return () => {
      clearSafetyTimeout();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 1. APERTURA PACING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_01_opening') return;

    // Stage 1: "YA ENCONTRASTE LA VARIABLE." (t=0ms)
    // Stage 2: "Ahora veamos qué cambia cuando la consideras antes de reaccionar." (t=1400ms)
    // Stage 3: CTA "VER LA DIFERENCIA" (t=2800ms)
    const t1 = window.setTimeout(() => setOpeningPacing(2), 1400);
    const t2 = window.setTimeout(() => setOpeningPacing(3), 2800);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 2. CTA -> VIDEO PLAYBACK (DIRECT USER GESTURE)
  // ---------------------------------------------------------------------------
  const handleSeeDifference = async () => {
    if (isProcessing || isCinematicActive) return;
    setIsProcessing(true);

    eventTracker.trackEvent('CTA_CLICKED_SEE_DIFFERENCE', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { label: EXP06_CONTENT.opening.ctaLabel },
    });

    eventTracker.trackEvent('CINEMATIC_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { asset: EXP06_CONTENT.cinematic.assetUrl },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp06.started', value: true, scope: 'global' },
      { key: 'exp06.cinematicStarted', value: true, scope: 'global' },
    ]);

    setIsCinematicActive(true);
    hasEndedRef.current = false;

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1;

      clearSafetyTimeout();
      const durationMs =
        video.duration && !isNaN(video.duration) && video.duration > 0
          ? (video.duration + 3) * 1000
          : 22000;

      safetyTimeoutRef.current = window.setTimeout(() => {
        if (!hasEndedRef.current) {
          handleVideoEnded();
        }
      }, durationMs);

      try {
        await video.play();
      } catch (err) {
        console.warn('[EXP06 Audio Play Blocked - Retrying Muted]', err);
        try {
          video.muted = true;
          await video.play();
        } catch (mutedErr) {
          console.warn('[EXP06 Video Fallback - Direct Interactive Reveal]', mutedErr);
          clearSafetyTimeout();
          setIsCinematicActive(false);
          setIsProcessing(false);
          navigateToScreen('screen_03_same_signal');
        }
      }
    } else {
      setIsCinematicActive(false);
      setIsProcessing(false);
      navigateToScreen('screen_03_same_signal');
    }
  };

  // ---------------------------------------------------------------------------
  // 3. TRANSICIÓN VIDEO -> CONTINUIDAD ÚLTIMO FRAME
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
      experience: 'exp06',
      payload: { asset: EXP06_CONTENT.cinematic.assetUrl },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp06.cinematicCompleted', value: true, scope: 'global' },
    ]);

    // NO cortar a negro. Sustituir el video inmediatamente por la reconstrucción visual
    setIsCinematicActive(false);
    setIsProcessing(false);
    navigateToScreen('screen_03_same_signal');
  };

  // ---------------------------------------------------------------------------
  // 4 & 5. SCREEN 03: CONTINUIDAD DEL ÚLTIMO FRAME & PRINCIPIO
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_03_same_signal') return;

    setSignalPacing(0);

    // Mantener 700-1000ms de quietud inicial tras video
    // Stage 1: "MISMA SEÑAL." discreto (t=900ms)
    const t1 = window.setTimeout(() => {
      setSignalPacing(1);
      eventTracker.trackEvent('SAME_SIGNAL_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
        payload: { signal: 'Sí.' },
      });
    }, 900);

    // Stage 2: "Pero una señal no viene con una interpretación incluida." (t=2400ms)
    const t2 = window.setTimeout(() => {
      setSignalPacing(2);
    }, 2400);

    // Stage 3: Botón continuar a interpretación automática (t=3800ms)
    const t3 = window.setTimeout(() => {
      setSignalPacing(3);
    }, 3800);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 6. SCREEN 04: INTERPRETACIÓN AUTOMÁTICA
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_04_automatic_interpretation') return;

    setInterpPacing(1); // Muestra Hecho Observable vs Tu Primera Interpretación
    eventTracker.trackEvent('AUTOMATIC_INTERPRETATION_REVEALED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { interpretation: 'Está molesta conmigo.' },
    });

    // Stage 2: "Eso puede ocurrir en segundos." (t=1800ms)
    const t1 = window.setTimeout(() => setInterpPacing(2), 1800);
    // Stage 3: "Recibes una señal…" (t=3200ms)
    const t2 = window.setTimeout(() => setInterpPacing(3), 3200);
    // Stage 4: "…y tu mente completa lo que falta." (t=4600ms)
    const t3 = window.setTimeout(() => setInterpPacing(4), 4600);
    // Stage 5: Botón continuar (t=5800ms)
    const t4 = window.setTimeout(() => setInterpPacing(5), 5800);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 7 & 8. SCREEN 05: DETENER LA INTERPRETACIÓN (PAUSA) & ENTRA CONTEXTO™
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_05_pause_and_context') return;

    setPausePacing(1); // SEÑAL -> INTERPRETACIÓN -> [ PAUSA ]
    eventTracker.trackEvent('PAUSE_INTRODUCED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
    });

    // Stage 2: "¿Y si antes de reaccionar consideraras una información más?" (t=2000ms)
    const t1 = window.setTimeout(() => {
      setPausePacing(2);
    }, 2000);

    // Stage 3: ENTRA CONTEXTO™ (tarjeta sobria CONTEXTO DE HOY) (t=3600ms)
    const t2 = window.setTimeout(() => {
      setPausePacing(3);
      eventTracker.trackEvent('CONTEXT_LAYER_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
      });
    }, 3600);

    // Stage 4: Guardrail "Eso NO significa que esté molesta contigo." (t=5200ms)
    const t3 = window.setTimeout(() => {
      setPausePacing(4);
    }, 5200);

    // Stage 5: Botón continuar a cambio de perspectiva (t=6800ms)
    const t4 = window.setTimeout(() => {
      setPausePacing(5);
    }, 6800);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 9. SCREEN 06: CAMBIO DE PERSPECTIVA (ELLA NO CAMBIA, MENSAJE NO CAMBIA)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_06_perspective_shift') return;

    setPerspectivePacing(1); // Muestra CON MÁS CONTEXTO + "Puede haber otras razones."
    eventTracker.trackEvent('PERSPECTIVE_CHANGED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
    });

    // Stage 2: "No voy a asumir todavía." (t=1800ms)
    const t1 = window.setTimeout(() => setPerspectivePacing(2), 1800);
    // Stage 3: Botón continuar (t=3400ms)
    const t2 = window.setTimeout(() => setPerspectivePacing(3), 3400);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 10. SCREEN 07: MOMENTO WOW & COMPARACIÓN
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_07_wow_comparison') return;

    setWowPacing(1); // Comparación ANTES vs AHORA

    // Stage 2: Desvanecer la comparativa y revelar el insight central (t=3000ms)
    const t1 = window.setTimeout(() => {
      setWowPacing(2);
      eventTracker.trackEvent('SAME_SIGNAL_DEMONSTRATION_COMPLETED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
      });
    }, 3000);

    // Stage 3: "TÚ SÍ CAMBIASTE LA FORMA DE MIRARLA." (t=4600ms)
    const t2 = window.setTimeout(() => {
      setWowPacing(3);
    }, 4600);

    // Stage 4: Botón continuar a conversación (t=6200ms)
    const t3 = window.setTimeout(() => {
      setWowPacing(4);
    }, 6200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 11. SCREEN 08: DE INTERPRETACIÓN A CONVERSACIÓN
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_08_conversation_question') return;

    setConvPacing(1); // "Entonces, en lugar de reaccionar a una conclusión…"

    // Stage 2: "…puedes acercarte con una pregunta." (t=1800ms)
    const t1 = window.setTimeout(() => setConvPacing(2), 1800);

    // Stage 3: Nuevo mensaje de Andrés: "¿Cómo estuvo tu día?" (t=3200ms)
    const t2 = window.setTimeout(() => {
      setConvPacing(3);
      eventTracker.trackEvent('CONVERSATION_QUESTION_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp06',
        payload: { question: '¿Cómo estuvo tu día?' },
      });
    }, 3200);

    // Stage 4: Botón continuar (t=4800ms)
    const t3 = window.setTimeout(() => setConvPacing(4), 4800);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 12. SCREEN 09: MECANISMO VISUAL (5 PASOS)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_09_mechanism') return;

    setMechanismPacing(1);
    eventTracker.trackEvent('CONTEXTO_MECHANISM_REVEALED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
    });

    const t1 = window.setTimeout(() => setMechanismPacing(2), 2400);

    return () => {
      window.clearTimeout(t1);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 13 & 14. SCREEN 10: DEFINICIÓN DE CONTEXTO™ & CATEGORÍAS CONCEPTUALES
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_10_definition_and_categories') return;

    setDefPacing(1); // Definición y guardrails
    eventTracker.trackEvent('CONTEXTO_DEFINED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
    });

    // Stage 2: Transición a categorías conceptuales (t=2600ms)
    const t1 = window.setTimeout(() => setDefPacing(2), 2600);
    // Stage 3: Categorías: HOY, COMPRENDER, ACERCARTE, ESCUCHAR, EVITAR (t=4000ms)
    const t2 = window.setTimeout(() => setDefPacing(3), 4000);
    // Stage 4: Botón continuar (t=5400ms)
    const t3 = window.setTimeout(() => setDefPacing(4), 5400);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 15. SCREEN 11: PUENTE HACIA LA PRUEBA & CTA FINAL
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_11_bridge_and_cta') return;

    setBridgePacing(1);
    const t1 = window.setTimeout(() => setBridgePacing(2), 1400);
    const t2 = window.setTimeout(() => setBridgePacing(3), 2600);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // COMPLETION -> ADVANCE TO EXP_07
  // ---------------------------------------------------------------------------
  const handleTryContexto = () => {
    if (completingRef.current || isCompletedGuard) return;
    completingRef.current = true;
    setIsCompletedGuard(true);

    eventTracker.trackEvent('CTA_CLICKED_TRY_CONTEXTO', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { label: EXP06_CONTENT.bridge.ctaLabel },
    });

    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      variableApplied: true,
      sameSignalDemonstrated: true,
      perspectiveShiftObserved: true,
      contextoDemonstrationCompleted: true,
      completedAt: new Date().toISOString(),
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp06.completed', value: true, scope: 'global' },
      { key: 'exp06.completedAt', value: new Date().toISOString(), scope: 'global' },
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

    eventTracker.trackEvent('EXP06_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp06',
      payload: { memory: finalMemory },
    });

    // Advance to EXP_07
    onComplete(finalMemory);
  };

  // ---------------------------------------------------------------------------
  // REUTILIZABLE: COMPONENTE DE SEÑAL NOVIA "Sí." (INALTERABLE)
  // ---------------------------------------------------------------------------
  const renderObservableSignal = (extraClasses = '') => (
    <div
      id="exp06-observable-signal"
      className={`w-full max-w-sm mx-auto p-4 rounded-xl bg-[#0c0c0f] border border-[#222228] flex flex-col text-left shadow-lg ${extraClasses}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
          {EXP06_CONTENT.signal.actor}
        </span>
        <span className="font-mono text-[10px] text-neutral-600 tracking-wider">
          SEÑAL OBSERVABLE
        </span>
      </div>
      <div className="py-1">
        <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-wide">
          {EXP06_CONTENT.signal.text}
        </p>
      </div>
    </div>
  );

  return (
    <div
      id="exp06-container"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-10 sm:py-16 bg-[#050505] text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white"
    >
      {/* ========================================================================= */}
      {/* CAPA CINEMATOGRÁFICA FULLSCREEN (ASSET CTX_E06_V01_SAME_SIGNAL.mp4)        */}
      {/* Montado en el DOM desde el inicio con preload="auto", controls={false}    */}
      {/* Durante reproducción: fullscreen absoluto, object-fit: cover, sin textos, */}
      {/* sin navegación, sin CTA, sin progreso, sin Case ID, sin overlays          */}
      {/* ========================================================================= */}
      <div
        id="exp06-cinematic-layer"
        aria-hidden={!isCinematicActive}
        className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-300 ${
          isCinematicActive
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <video
          ref={videoRef}
          src={EXP06_CONTENT.cinematic.assetUrl}
          preload="auto"
          playsInline
          controls={false}
          loop={false}
          onEnded={handleVideoEnded}
          className={`w-full h-full object-cover object-center pointer-events-none select-none ${
            isCinematicActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* ========================================================================= */}
      {/* HEADER AMBIENTAL DISCRETO (Oculto en modo cinematográfico)                 */}
      {/* ========================================================================= */}
      {!isCinematicActive && (
        <header
          id="exp06-header"
          className="absolute top-6 left-0 right-0 px-6 sm:px-10 flex items-center justify-between pointer-events-auto z-20"
        >
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-neutral-500 uppercase tracking-[0.25em]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-400/80 animate-pulse" />
            <span>CONTEXTO™</span>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-400">EXPEDIENTE #{caseId}</span>
          </div>

          <button
            id="exp06-audio-toggle"
            type="button"
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-800 bg-[#0d0d0f] hover:bg-neutral-800/80 text-neutral-400 hover:text-neutral-200 transition-colors font-mono text-[10px] sm:text-[11px] uppercase tracking-widest cursor-pointer"
            title={isAudioActive ? 'Silenciar audio' : 'Activar audio'}
            aria-label="Control de audio"
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-neutral-300" />
                <span className="hidden sm:inline">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden sm:inline">AUDIO OFF</span>
              </>
            )}
          </button>
        </header>
      )}

      {/* ========================================================================= */}
      {/* 1. APERTURA: "YA ENCONTRASTE LA VARIABLE." -> CTA "VER LA DIFERENCIA"     */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_01_opening' && !isCinematicActive && (
        <main
          id="exp06-screen-opening"
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          <div className="mb-6 font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-neutral-500">
            DEMOSTRACIÓN CENTRAL
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-neutral-100 uppercase leading-snug sm:leading-tight mb-8">
            {EXP06_CONTENT.opening.lead}
          </h1>

          <div className="min-h-[48px] flex items-center justify-center mb-10">
            {openingPacing >= 2 && (
              <p className="text-base sm:text-lg md:text-xl font-light text-neutral-400 tracking-wide transition-opacity duration-700 opacity-100">
                {EXP06_CONTENT.opening.subLead}
              </p>
            )}
          </div>

          <div
            className={`transition-all duration-700 transform ${
              openingPacing >= 3
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="exp06-cta-see-difference"
              onClick={handleSeeDifference}
              disabled={isProcessing}
              variant="primary"
              className="bg-[#141417] border-neutral-700/80 hover:border-neutral-400 hover:bg-[#1c1c20] text-neutral-100 font-medium"
            >
              {EXP06_CONTENT.opening.ctaLabel}
            </PrimaryCTA>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 4 & 5. SCREEN 03: CONTINUIDAD DEL ÚLTIMO FRAME & PRINCIPIO                */}
      {/* "MISMA SEÑAL." -> ELLA: "Sí." -> "Pero una señal no viene con..."         */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_03_same_signal' && !isCinematicActive && (
        <main
          id="exp06-screen-same-signal"
          className="w-full max-w-xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          {/* Señal inalterada del último frame */}
          <div className="mb-8 w-full">{renderObservableSignal()}</div>

          <div className="min-h-[110px] flex flex-col items-center justify-center space-y-4 mb-8">
            {signalPacing >= 1 && (
              <h2 className="font-mono text-base sm:text-lg tracking-[0.25em] uppercase text-neutral-200 font-semibold transition-opacity duration-700">
                {EXP06_CONTENT.signal.principleTitle}
              </h2>
            )}

            {signalPacing >= 2 && (
              <p className="text-sm sm:text-base md:text-lg font-light text-neutral-400 max-w-md transition-opacity duration-700">
                {EXP06_CONTENT.signal.principleSubtitle}
              </p>
            )}
          </div>

          {signalPacing >= 3 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp06-cta-to-interpretation"
                onClick={() => navigateToScreen('screen_04_automatic_interpretation')}
                variant="primary"
                className="bg-[#141417] border-neutral-700 hover:border-neutral-400 text-neutral-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                CONTINUAR
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 6. SCREEN 04: INTERPRETACIÓN AUTOMÁTICA                                    */}
      {/* HECHO OBSERVABLE: "Sí." vs INTERPRETACIÓN: "Está molesta conmigo."        */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_04_automatic_interpretation' && !isCinematicActive && (
        <main
          id="exp06-screen-interpretation"
          className="w-full max-w-xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          <div className="mb-4 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500">
            ARQUITECTURA COGNITIVA
          </div>

          {/* Señal Observable fija */}
          <div className="w-full mb-4">{renderObservableSignal()}</div>

          {/* Capa separada: TU PRIMERA INTERPRETACIÓN */}
          <div
            id="exp06-first-interpretation-card"
            className="w-full max-w-sm mx-auto p-4 rounded-xl bg-[#111115] border border-neutral-700/70 text-left mb-8 shadow-md"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
              {EXP06_CONTENT.automaticInterpretation.eyebrowInterpretation}
            </span>
            <p className="text-sm sm:text-base font-medium text-neutral-200">
              {EXP06_CONTENT.automaticInterpretation.interpretationText}
            </p>
          </div>

          {/* Secuencia explicativa */}
          <div className="min-h-[80px] flex flex-col items-center justify-center space-y-2 mb-8 text-xs sm:text-sm text-neutral-400 font-light">
            {interpPacing >= 2 && (
              <p className="transition-opacity duration-700">
                {EXP06_CONTENT.automaticInterpretation.fastBeat1}
              </p>
            )}
            {interpPacing >= 3 && (
              <p className="text-neutral-300 font-normal transition-opacity duration-700">
                {EXP06_CONTENT.automaticInterpretation.fastBeat2}
              </p>
            )}
            {interpPacing >= 4 && (
              <p className="text-white font-medium transition-opacity duration-700">
                {EXP06_CONTENT.automaticInterpretation.fastBeat3}
              </p>
            )}
          </div>

          {interpPacing >= 5 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp06-cta-to-pause"
                onClick={() => navigateToScreen('screen_05_pause_and_context')}
                variant="primary"
                className="bg-[#141417] border-neutral-700 hover:border-neutral-400 text-neutral-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                CONTINUAR
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 7 & 8. SCREEN 05: DETENER LA INTERPRETACIÓN (PAUSA) & ENTRA CONTEXTO™      */}
      {/* SEÑAL -> INTERPRETACIÓN -> [ PAUSA ] -> CONTEXTO DE HOY                   */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_05_pause_and_context' && !isCinematicActive && (
        <main
          id="exp06-screen-pause-context"
          className="w-full max-w-xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          {/* Cadena con [ PAUSA ] */}
          <div
            id="exp06-interruption-chain"
            className="flex items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs uppercase tracking-wider mb-6"
          >
            <span className="text-neutral-400">SEÑAL</span>
            <span className="text-neutral-600">→</span>
            <span className="text-neutral-400">INTERPRETACIÓN</span>
            <span className="text-neutral-600">→</span>
            <span className="px-2.5 py-1 rounded bg-neutral-200 text-neutral-950 font-bold tracking-widest animate-pulse">
              PAUSA
            </span>
          </div>

          {/* Pregunta de interrupción limpia */}
          {pausePacing >= 2 && (
            <p className="text-base sm:text-lg font-light text-neutral-200 max-w-md mb-6 transition-opacity duration-700">
              {EXP06_CONTENT.pauseInterruption.question}
            </p>
          )}

          {/* Señal fija inalterada */}
          <div className="w-full mb-4">{renderObservableSignal()}</div>

          {/* Tarjeta CONTEXTO DE HOY */}
          {pausePacing >= 3 && (
            <div
              id="exp06-context-layer-card"
              className="w-full max-w-sm mx-auto p-5 rounded-xl bg-[#0f0f14] border border-neutral-600/60 text-left space-y-3 shadow-xl transition-all duration-700 animate-fade-in mb-6"
            >
              <div className="flex items-center justify-between border-b border-[#202028] pb-2">
                <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase font-semibold">
                  {EXP06_CONTENT.contextLayer.cardEyebrow}
                </span>
                <span className="font-mono text-[9px] text-neutral-500 uppercase">
                  INFORMACIÓN ADICIONAL
                </span>
              </div>

              <p className="text-xs sm:text-sm font-light text-neutral-200 leading-relaxed">
                {EXP06_CONTENT.contextLayer.cardBody}
              </p>

              {pausePacing >= 4 && (
                <div className="pt-2 border-t border-[#1c1c24] space-y-1.5 transition-opacity duration-700">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {EXP06_CONTENT.contextLayer.guardrailNotUpset}
                  </p>
                  <p className="text-[11px] sm:text-xs text-neutral-400 font-light">
                    {EXP06_CONTENT.contextLayer.guardrailNotConclude}
                  </p>
                </div>
              )}
            </div>
          )}

          {pausePacing >= 5 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp06-cta-to-perspective"
                onClick={() => navigateToScreen('screen_06_perspective_shift')}
                variant="primary"
                className="bg-[#141417] border-neutral-700 hover:border-neutral-400 text-neutral-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                VER EL CAMBIO DE PERSPECTIVA
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 9. SCREEN 06: CAMBIO DE PERSPECTIVA                                       */}
      {/* ELLA NO CAMBIA. "Sí." NO CAMBIA.                                          */}
      {/* Desvanece "Está molesta conmigo." -> "Puede haber otras razones."         */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_06_perspective_shift' && !isCinematicActive && (
        <main
          id="exp06-screen-perspective"
          className="w-full max-w-xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          <div className="mb-4 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500">
            DEMOSTRACIÓN CENTRAL
          </div>

          {/* Señal Observable exactamente fija */}
          <div className="w-full mb-6">{renderObservableSignal()}</div>

          {/* Nueva perspectiva disponible para Andrés */}
          <div
            id="exp06-new-perspective-card"
            className="w-full max-w-sm mx-auto p-5 rounded-xl bg-[#121217] border border-neutral-700 text-left space-y-2 mb-8 shadow-xl transition-all duration-700"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
              {EXP06_CONTENT.perspectiveShift.eyebrow}
            </span>

            <p className="text-sm sm:text-base font-medium text-white">
              {EXP06_CONTENT.perspectiveShift.thought1}
            </p>

            {perspectivePacing >= 2 && (
              <p className="text-xs sm:text-sm font-light text-neutral-300 transition-opacity duration-700">
                {EXP06_CONTENT.perspectiveShift.thought2}
              </p>
            )}
          </div>

          {/* Recordatorio de invariancia */}
          <div className="text-xs sm:text-sm text-neutral-500 font-mono uppercase tracking-wider mb-8">
            ELLA NO CAMBIÓ &bull; SU MENSAJE NO CAMBIÓ
          </div>

          {perspectivePacing >= 3 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp06-cta-to-wow"
                onClick={() => navigateToScreen('screen_07_wow_comparison')}
                variant="primary"
                className="bg-[#141417] border-neutral-700 hover:border-neutral-400 text-neutral-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                OBSERVAR LA DIFERENCIA
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 10. SCREEN 07: MOMENTO WOW & COMPARACIÓN                                  */}
      {/* ANTES vs AHORA -> "LA SEÑAL NO CAMBIÓ. TÚ SÍ CAMBIASTE LA FORMA DE MIRARLA" */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07_wow_comparison' && !isCinematicActive && (
        <main
          id="exp06-screen-wow"
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          {/* Comparativa ANTES vs AHORA */}
          <div
            id="exp06-comparison-grid"
            className={`w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left transition-opacity duration-700 ${
              wowPacing >= 2 ? 'opacity-30' : 'opacity-100'
            }`}
          >
            {/* ANTES */}
            <div className="p-4 rounded-xl bg-[#0d0d10] border border-[#202025]">
              <span className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase block mb-2">
                {EXP06_CONTENT.wowComparison.beforeLabel}
              </span>
              <p className="font-mono text-base font-semibold text-neutral-200 mb-2">
                {EXP06_CONTENT.wowComparison.beforeSignal}
              </p>
              <div className="pt-2 border-t border-[#1b1b20]">
                <p className="text-xs text-neutral-400 font-light">
                  {EXP06_CONTENT.wowComparison.beforeInterpretation}
                </p>
              </div>
            </div>

            {/* AHORA */}
            <div className="p-4 rounded-xl bg-[#121216] border border-neutral-700">
              <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase block mb-2">
                {EXP06_CONTENT.wowComparison.afterLabel}
              </span>
              <p className="font-mono text-base font-semibold text-white mb-2">
                {EXP06_CONTENT.wowComparison.afterSignal}
              </p>
              <div className="pt-2 border-t border-[#22222a] space-y-1">
                <p className="text-xs text-neutral-200 font-medium">
                  {EXP06_CONTENT.wowComparison.afterStep1}
                </p>
                <p className="text-xs text-neutral-400 font-light">
                  {EXP06_CONTENT.wowComparison.afterStep2}
                </p>
              </div>
            </div>
          </div>

          {/* INSIGHT CENTRAL MOMENTO WOW */}
          {wowPacing >= 2 && (
            <div
              id="exp06-wow-insight"
              className="w-full max-w-lg p-6 bg-[#0e0e12] border border-[#282830] rounded-xl space-y-3 animate-fade-in mb-8"
            >
              <p className="text-base sm:text-lg font-semibold text-neutral-300 uppercase tracking-widest">
                {EXP06_CONTENT.wowComparison.coreInsight1}
              </p>

              {wowPacing >= 3 && (
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider pt-2 border-t border-[#202026] transition-opacity duration-700">
                  {EXP06_CONTENT.wowComparison.coreInsight2}
                </p>
              )}
            </div>
          )}

          {wowPacing >= 4 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp06-cta-to-conversation"
                onClick={() => navigateToScreen('screen_08_conversation_question')}
                variant="primary"
                className="bg-[#141417] border-neutral-700 hover:border-neutral-400 text-neutral-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                DE INTERPRETAR A CONVERSAR
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 11. SCREEN 08: DE INTERPRETACIÓN A CONVERSACIÓN                           */}
      {/* "...puedes acercarte con una pregunta." -> Andrés: "¿Cómo estuvo tu día?" */}
      {/* ELLA NO RESPONDE. NO SE CONTROLA EL RESULTADO.                            */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_08_conversation_question' && !isCinematicActive && (
        <main
          id="exp06-screen-conversation"
          className="w-full max-w-xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          <div className="mb-4 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500">
            EL ACERCAMIENTO
          </div>

          <div className="space-y-2 mb-8">
            <p className="text-sm sm:text-base text-neutral-400 font-light">
              {EXP06_CONTENT.conversation.transitionBeat1}
            </p>
            {convPacing >= 2 && (
              <p className="text-base sm:text-lg text-neutral-200 font-medium transition-opacity duration-700">
                {EXP06_CONTENT.conversation.transitionBeat2}
              </p>
            )}
          </div>

          {/* Nuevo mensaje de Andrés */}
          {convPacing >= 3 && (
            <div
              id="exp06-andres-question-bubble"
              className="w-full max-w-sm mx-auto p-5 rounded-xl bg-[#141418] border border-neutral-700 text-left mb-8 shadow-xl animate-fade-in"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-300 font-semibold">
                  {EXP06_CONTENT.conversation.actor}
                </span>
                <span className="font-mono text-[10px] text-neutral-500 uppercase">
                  PREGUNTA CON CONTEXTO
                </span>
              </div>
              <p className="font-mono text-lg sm:text-xl font-bold text-white">
                {EXP06_CONTENT.conversation.question}
              </p>
            </div>
          )}

          {convPacing >= 4 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp06-cta-to-mechanism"
                onClick={() => navigateToScreen('screen_09_mechanism')}
                variant="primary"
                className="bg-[#141417] border-neutral-700 hover:border-neutral-400 text-neutral-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                CONOCER EL MECANISMO
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 12. SCREEN 09: MECANISMO VISUAL (5 PASOS)                                 */}
      {/* CONTEXTO -> INTERPRETAR -> ANTICIPAR -> ACTUAR -> CONECTAR                */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_09_mechanism' && !isCinematicActive && (
        <main
          id="exp06-screen-mechanism"
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          <div className="mb-6 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500">
            ARQUITECTURA DE DECISIÓN
          </div>

          <div
            id="exp06-mechanism-steps"
            className="w-full max-w-lg space-y-3 text-left mb-8"
          >
            {EXP06_CONTENT.mechanism.steps.map((step, idx) => (
              <div
                key={step.name}
                className="p-3.5 sm:p-4 rounded-xl bg-[#0e0e12] border border-[#222228] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-neutral-500 font-bold">
                    0{idx + 1}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-neutral-100 uppercase">
                    {step.name}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-neutral-400 font-light text-right">
                  {step.description}
                </span>
              </div>
            ))}
          </div>

          {mechanismPacing >= 2 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp06-cta-to-definition"
                onClick={() => navigateToScreen('screen_10_definition_and_categories')}
                variant="primary"
                className="bg-[#141417] border-neutral-700 hover:border-neutral-400 text-neutral-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                DEFINICIÓN DE CONTEXTO™
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 13 & 14. SCREEN 10: DEFINICIÓN DE CONTEXTO™ & CATEGORÍAS CONCEPTUALES      */}
      {/* Micro-app + Guardrails + Categorías: HOY, COMPRENDER, ACERCARTE...        */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_10_definition_and_categories' && !isCinematicActive && (
        <main
          id="exp06-screen-definition"
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          <div className="mb-4 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500">
            DEFINICIÓN RIGUROSA
          </div>

          {/* Nombre y Tagline */}
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[0.2em] uppercase text-neutral-100 mb-3">
            {EXP06_CONTENT.definition.brand}
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-light max-w-md leading-relaxed mb-6">
            {EXP06_CONTENT.definition.tagline}
          </p>

          {/* Guardrails */}
          <div className="w-full max-w-md bg-[#0e0e11] border border-[#202026] rounded-xl p-4 sm:p-5 space-y-2 text-left mb-6">
            <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-300 font-light">
              {EXP06_CONTENT.definition.guardrails.map((g, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-neutral-500 text-[11px]">&times;</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
            <p className="pt-2 border-t border-[#1c1c22] text-xs sm:text-sm font-medium text-neutral-200">
              {EXP06_CONTENT.definition.closure}
            </p>
          </div>

          {/* Categorías Conceptuales */}
          {defPacing >= 2 && (
            <div className="w-full max-w-md space-y-3 mb-8 transition-all duration-700 animate-fade-in">
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                {EXP06_CONTENT.categories.intro1}
              </p>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal">
                {EXP06_CONTENT.categories.intro2}
              </p>

              {defPacing >= 3 && (
                <div
                  id="exp06-categories-chips"
                  className="flex flex-wrap items-center justify-center gap-2 pt-2"
                >
                  {EXP06_CONTENT.categories.items.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 rounded-full bg-[#15151a] border border-[#282832] font-mono text-[11px] sm:text-xs text-neutral-200 tracking-wider uppercase font-semibold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {defPacing >= 4 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp06-cta-to-bridge"
                onClick={() => navigateToScreen('screen_11_bridge_and_cta')}
                variant="primary"
                className="bg-[#141417] border-neutral-700 hover:border-neutral-400 text-neutral-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                CONTINUAR
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 15. SCREEN 11: PUENTE HACIA LA PRUEBA & CTA FINAL                         */}
      {/* "Ya viste la diferencia..." -> CTA: PROBAR CONTEXTO™                      */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_11_bridge_and_cta' && !isCinematicActive && (
        <main
          id="exp06-screen-bridge"
          className="w-full max-w-xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          <div className="mb-6 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500">
            EL SIGUIENTE PASO
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-neutral-100 uppercase mb-4">
            {EXP06_CONTENT.bridge.beat1}
          </h2>

          <div className="min-h-[60px] flex flex-col items-center justify-center space-y-2 mb-10">
            {bridgePacing >= 2 && (
              <p className="text-base sm:text-lg text-neutral-300 font-light transition-opacity duration-700">
                {EXP06_CONTENT.bridge.beat2}
              </p>
            )}
            {bridgePacing >= 3 && (
              <p className="text-sm sm:text-base text-neutral-400 font-normal transition-opacity duration-700">
                {EXP06_CONTENT.bridge.beat3}
              </p>
            )}
          </div>

          <div className="w-full max-w-xs transition-all duration-700 animate-fade-in">
            <PrimaryCTA
              id="exp06-cta-try-contexto"
              onClick={handleTryContexto}
              disabled={isCompletedGuard}
              variant="primary"
              className="w-full bg-neutral-100 text-neutral-950 hover:bg-white border-white hover:border-neutral-200 font-bold tracking-wider py-3.5 sm:py-4"
            >
              {EXP06_CONTENT.bridge.ctaLabel}
            </PrimaryCTA>
          </div>
        </main>
      )}
    </div>
  );
};
