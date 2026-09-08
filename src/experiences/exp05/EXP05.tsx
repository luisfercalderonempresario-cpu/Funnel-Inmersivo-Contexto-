// EXP_05 — LA PIEZA FALTANTE (P0 #04 CTX_E05_V01_MISSING_PIECE)
// Contexto™ Narrative Experience
import React, { useState, useEffect, useRef, useTransition } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { EXP05_CONTENT } from './exp05Content';
import { EXP05_DEFINITION } from './exp05Definition';
import { ExperienceMemoryManager } from '../../engine/experience/experienceMemory';
import {
  loadExperienceRuntimeState,
  persistExperienceRuntimeState,
  transitionScreenState,
} from '../../engine/experience/experienceState';
import { ExperienceRuntimeState } from '../../engine/experience/types';
import { eventTracker } from '../../engine/events/eventTracker';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { Volume2, VolumeX, ArrowRight, ArrowDown } from 'lucide-react';

export const EXP05: React.FC<ExperienceComponentProps> = ({
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
        experience: 'exp05',
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
      const exp05Responses = (prev.responses.exp05 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp05: {
            ...exp05Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp05',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_05
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp05');
    if (existing && existing.currentScreen && EXP05_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp05',
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

  // Pacing stages per phase
  // Phase 1 (Apertura): stages 1 -> 3
  const [openingPacing, setOpeningPacing] = useState<number>(1);
  // Phase 3 (Continuidad + Variable): stages 1 -> 4
  const [variablePacing, setVariablePacing] = useState<number>(0);
  // Phase 4 (Gran Reveal & Guardrails): stages 1 -> 5
  const [revealPacing, setRevealPacing] = useState<number>(0);
  // Phase 5 (Fases & Frase de Seguridad): stages 1 -> 4
  const [phasesPacing, setPhasesPacing] = useState<number>(0);
  // Phase 6 (Demostración — Misma Señal): stages 1 -> 5
  const [demoPacing, setDemoPacing] = useState<number>(0);
  // Phase 7 (Mecanismo & Contexto™): stages 1 -> 3
  const [contextoPacing, setContextoPacing] = useState<number>(0);

  const currentScreenId = runtimeState.currentScreen;

  // Synchronize runtime persistence
  useEffect(() => {
    persistExperienceRuntimeState(runtimeState);
  }, [runtimeState]);

  // Track initial screen view and EXP05_STARTED
  useEffect(() => {
    const screen = runtimeState.currentScreen;

    if (screen === 'screen_01_opening') {
      eventTracker.trackEvent('EXP05_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp05',
        payload: { screen: 'screen_01_opening' },
      });
    }

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
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

    // Stage 1: "ENCONTRASTE UN PATRÓN." (t=0ms)
    // Stage 2: "Pero un patrón no explica por sí solo lo que ocurre." (t=1400ms)
    // Stage 3: CTA "REVELAR LA PIEZA" (t=2800ms)
    const timer1 = window.setTimeout(() => setOpeningPacing(2), 1400);
    const timer2 = window.setTimeout(() => setOpeningPacing(3), 2800);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 2. CTA -> VIDEO PLAYBACK (DIRECT USER GESTURE)
  // ---------------------------------------------------------------------------
  const handleRevealPiece = async () => {
    if (isProcessing || isCinematicActive) return;
    setIsProcessing(true);

    // Track CTA click
    eventTracker.trackEvent('CTA_CLICKED_REVEAL_PIECE', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { label: EXP05_CONTENT.opening.ctaLabel },
    });

    eventTracker.trackEvent('CINEMATIC_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { asset: EXP05_CONTENT.cinematic.assetUrl },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp05.started', value: true, scope: 'global' },
      { key: 'exp05.cinematicStarted', value: true, scope: 'global' },
    ]);

    // Activate fullscreen cinematic layer
    setIsCinematicActive(true);
    hasEndedRef.current = false;

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1;

      // Arm safety timeout (video duration + 3s, or 20s fallback)
      clearSafetyTimeout();
      const durationMs =
        video.duration && !isNaN(video.duration) && video.duration > 0
          ? (video.duration + 3) * 1000
          : 20000;

      safetyTimeoutRef.current = window.setTimeout(() => {
        if (!hasEndedRef.current) {
          handleVideoEnded();
        }
      }, durationMs);

      // Play directly via user gesture
      try {
        await video.play();
      } catch (err) {
        console.warn('[EXP05 Audio Play Blocked - Retrying Muted]', err);
        try {
          video.muted = true;
          await video.play();
        } catch (mutedErr) {
          console.warn('[EXP05 Fallback - Direct Interactive Reveal]', mutedErr);
          clearSafetyTimeout();
          setIsCinematicActive(false);
          setIsProcessing(false);
          // Fallback: avanzar directamente a la revelación interactiva
          navigateToScreen('screen_03_revelation');
        }
      }
    } else {
      setIsCinematicActive(false);
      setIsProcessing(false);
      navigateToScreen('screen_03_revelation');
    }
  };

  // ---------------------------------------------------------------------------
  // 3. TRANSICIÓN VIDEO -> REVELACIÓN (CONTINUIDAD DEL ÚLTIMO FRAME)
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
      experience: 'exp05',
      payload: { asset: EXP05_CONTENT.cinematic.assetUrl },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp05.cinematicCompleted', value: true, scope: 'global' },
    ]);

    // NO cortar a negro. NO fade largo a negro.
    // Sustituir el video inmediatamente por la reconstrucción visual ligera
    setIsCinematicActive(false);
    setIsProcessing(false);
    navigateToScreen('screen_03_revelation');
  };

  // ---------------------------------------------------------------------------
  // 4. PRIMERA REVELACIÓN (SOBRE LA COMPOSICIÓN)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_03_revelation') return;

    // Reset variable pacing
    setVariablePacing(0);

    // Mantener 700-1000ms de quietud inicial tras video
    // Stage 1: "LA PIEZA QUE FALTABA…" (t=900ms)
    const t1 = window.setTimeout(() => {
      setVariablePacing(1);
    }, 900);

    // Stage 2: "NO ERA UNA RESPUESTA." (t=2300ms)
    const t2 = window.setTimeout(() => {
      setVariablePacing(2);
    }, 2300);

    // Stage 3: "ERA UNA VARIABLE." (t=3800ms)
    const t3 = window.setTimeout(() => {
      setVariablePacing(3);
      eventTracker.trackEvent('MISSING_VARIABLE_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp05',
      });
    }, 3800);

    // Silencio visual breve y auto-avance suave al Gran Reveal
    const t4 = window.setTimeout(() => {
      setVariablePacing(4);
      navigateToScreen('screen_04_reveal_guardrails');
    }, 5800);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 5. GRAN REVEAL ("EL CICLO MENSTRUAL") & GUARDRAIL INMEDIATO
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_04_reveal_guardrails') return;

    setRevealPacing(1); // Muestra únicamente "EL CICLO MENSTRUAL" centrado
    eventTracker.trackEvent('MENSTRUAL_CYCLE_REVEALED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp05.cycleRevealed', value: true, scope: 'global' },
    ]);

    // Mantener la gran revelación aprox. 2.5s antes de continuar con los guardrails
    // Stage 2: Intro guardrail "El ciclo menstrual puede aportar contexto…" (t=2600ms)
    const t1 = window.setTimeout(() => {
      setRevealPacing(2);
      eventTracker.trackEvent('GUARDRAIL_PRESENTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp05',
      });
    }, 2600);

    // Stage 3: Guardrails secuenciales "NO determina...", "NO explica...", "Y NO sustituye..." (t=4000ms)
    const t2 = window.setTimeout(() => {
      setRevealPacing(3);
    }, 4000);

    // Stage 4: Explicación mínima (t=6200ms)
    const t3 = window.setTimeout(() => {
      setRevealPacing(4);
    }, 6200);

    // Stage 5: Botón continuar a Fases (t=8200ms)
    const t4 = window.setTimeout(() => {
      setRevealPacing(5);
    }, 8200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 6. VISUALIZACIÓN DE LAS CUATRO FASES & SEGURIDAD CONCEPTUAL
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_05_phases') return;

    setPhasesPacing(1); // Rueda 4 fases activa
    eventTracker.trackEvent('PHASES_PRESENTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
    });

    // Stage 2: Oscurecer la rueda ligeramente y mostrar "EL CICLO NO ES UN GUION." (t=2400ms)
    const t1 = window.setTimeout(() => {
      setPhasesPacing(2);
    }, 2400);

    // Stage 3: "No te dice exactamente cómo se sentirá." (t=3800ms)
    const t2 = window.setTimeout(() => {
      setPhasesPacing(3);
    }, 3800);

    // Stage 4: "Te da una variable más para interpretar con menos prisa." + Botón (t=5200ms)
    const t3 = window.setTimeout(() => {
      setPhasesPacing(4);
    }, 5200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 7. DEMOSTRACIÓN — MISMA SEÑAL (“Sí.”) & NUEVA PERSPECTIVA
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_06_demonstration') return;

    setDemoPacing(1); // ANTES DE CONSIDERAR EL CONTEXTO -> ELLA: "Sí." -> TU INTERPRETACIÓN: "Está molesta conmigo."

    // Stage 2: CON UNA VARIABLE MÁS DE CONTEXTO -> ELLA: "Sí." permanece idéntico! (t=3000ms)
    const t1 = window.setTimeout(() => {
      setDemoPacing(2);
    }, 3000);

    // Stage 3: TU NUEVA PERSPECTIVA: "Puede haber varias razones." / "No voy a asumir." (t=4400ms)
    const t2 = window.setTimeout(() => {
      setDemoPacing(3);
      eventTracker.trackEvent('SAME_SIGNAL_REINTERPRETED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp05',
        payload: { signal: 'Sí.' },
      });
      memoryManagerRef.current.applyUpdates([
        { key: 'exp05.perspectiveShifted', value: true, scope: 'global' },
      ]);
    }, 4400);

    // Stage 4: INSIGHT PRINCIPAL: MISMA SEÑAL -> MÁS CONTEXTO -> MENOS SUPOSICIÓN (t=6200ms)
    const t3 = window.setTimeout(() => {
      setDemoPacing(4);
      eventTracker.trackEvent('CONTEXT_INSIGHT_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp05',
      });
    }, 6200);

    // Stage 5: Botón continuar a Mecanismo (t=8200ms)
    const t4 = window.setTimeout(() => {
      setDemoPacing(5);
    }, 8200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 8. CONEXIÓN CON EL MECANISMO & CONTEXTO™
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_07_mechanism_contexto') return;

    setContextoPacing(1); // SEÑAL -> CONTEXTO -> PREGUNTA -> DECISIÓN -> CONEXIÓN

    // Stage 2: CONTEXTO™ reveal (t=2800ms)
    const t1 = window.setTimeout(() => {
      setContextoPacing(2);
      eventTracker.trackEvent('CONTEXTO_INTRODUCED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp05',
      });
    }, 2800);

    // Stage 3: CTA Final "ENTENDER CONTEXTO™" (t=4400ms)
    const t2 = window.setTimeout(() => {
      setContextoPacing(3);
    }, 4400);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 9. CTA FINAL -> ENTENDER CONTEXTO™ (COMPLETION -> EXP_06)
  // ---------------------------------------------------------------------------
  const handleCompleteExperience = () => {
    if (completingRef.current || isCompletedGuard) return;
    completingRef.current = true;
    setIsCompletedGuard(true);

    eventTracker.trackEvent('CTA_CLICKED_UNDERSTAND_CONTEXTO', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { label: EXP05_CONTENT.finalCta.label },
    });

    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      missingPieceFound: true,
      menstrualCycleContextUnderstood: true,
      perspectiveShiftAdopted: true,
      contextoFrameworkIntroduced: true,
      completedAt: new Date().toISOString(),
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp05.completed', value: true, scope: 'global' },
      { key: 'exp05.completedAt', value: new Date().toISOString(), scope: 'global' },
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

    eventTracker.trackEvent('EXP05_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp05',
      payload: { memory: finalMemory },
    });

    // Advance to EXP_06
    onComplete(finalMemory);
  };

  // ---------------------------------------------------------------------------
  // RENDER COMPONENT
  // ---------------------------------------------------------------------------
  return (
    <div
      id="exp05-container"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-10 sm:py-16 bg-[#050505] text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white"
    >
      {/* ========================================================================= */}
      {/* CAPA CINEMATOGRÁFICA FULLSCREEN (ASSET CTX_E05_V01_MISSING_PIECE.mp4)      */}
      {/* Montado en el DOM desde el inicio con preload="auto", controls={false}    */}
      {/* Durante reproducción: fullscreen absoluto, object-fit: cover, sin textos, */}
      {/* sin navegación, sin CTA, sin progreso, sin Case ID, sin overlays          */}
      {/* ========================================================================= */}
      <div
        id="exp05-cinematic-layer"
        aria-hidden={!isCinematicActive}
        className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-300 ${
          isCinematicActive
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <video
          ref={videoRef}
          src={EXP05_CONTENT.cinematic.assetUrl}
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
          id="exp05-header"
          className="absolute top-6 left-0 right-0 px-6 sm:px-10 flex items-center justify-between pointer-events-auto z-20"
        >
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-neutral-500 uppercase tracking-[0.25em]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-400/80 animate-pulse" />
            <span>LA PIEZA FALTANTE</span>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-400">EXPEDIENTE #{caseId}</span>
          </div>

          <button
            id="exp05-audio-toggle"
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
      {/* PANTALLA 1: APERTURA CINEMATOGRÁFICA                                      */}
      {/* "ENCONTRASTE UN PATRÓN." -> CTA "REVELAR LA PIEZA"                        */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_01_opening' && !isCinematicActive && (
        <main
          id="exp05-screen-opening"
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          {/* Eyebrow */}
          <div className="mb-6 font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-neutral-500">
            CONTINUIDAD DE INVESTIGACIÓN
          </div>

          {/* Lead: "ENCONTRASTE UN PATRÓN." */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-neutral-100 uppercase leading-snug sm:leading-tight mb-8">
            {EXP05_CONTENT.opening.lead}
          </h1>

          {/* SubLead: "Pero un patrón no explica por sí solo lo que ocurre." */}
          <div className="min-h-[48px] flex items-center justify-center mb-10">
            {openingPacing >= 2 && (
              <p className="text-base sm:text-lg md:text-xl font-light text-neutral-400 tracking-wide transition-opacity duration-700 opacity-100">
                {EXP05_CONTENT.opening.subLead}
              </p>
            )}
          </div>

          {/* CTA: REVELAR LA PIEZA */}
          <div
            className={`transition-all duration-700 transform ${
              openingPacing >= 3
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="exp05-cta-reveal-piece"
              onClick={handleRevealPiece}
              disabled={isProcessing}
              variant="primary"
              className="bg-[#141417] border-neutral-700/80 hover:border-neutral-400 hover:bg-[#1c1c20] text-neutral-100 font-medium"
            >
              {EXP05_CONTENT.opening.ctaLabel}
            </PrimaryCTA>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 3: PRIMERA REVELACIÓN (CONTINUIDAD DEL ÚLTIMO FRAME)             */}
      {/* Reconstrucción visual: Tiempo Lineal + Estructura Cíclica                 */}
      {/* "LA PIEZA QUE FALTABA…" -> "NO ERA UNA RESPUESTA." -> "ERA UNA VARIABLE." */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_03_revelation' && !isCinematicActive && (
        <main
          id="exp05-screen-revelation"
          className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center z-10 animate-fade-in text-center"
        >
          {/* Reconstrucción visual ligera del último frame: Tiempo Lineal + Estructura Cíclica */}
          <section
            id="exp05-visual-reconstruction"
            aria-label="Reconstrucción visual: tiempo lineal y estructura cíclica"
            className="w-full max-w-lg mb-10 relative bg-[#0a0a0c] border border-[#202024] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl transition-opacity duration-700"
          >
            <div className="w-full flex items-center justify-between border-b border-[#1b1b20] pb-3 mb-6 font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
              <span>ESTRUCTURA OBSERVADA</span>
              <span>LÍNEA & CÍRCULO</span>
            </div>

            {/* SVG compositing linear axis and circular orbit */}
            <div className="relative w-64 h-48 sm:w-80 sm:h-56 flex items-center justify-center">
              <svg
                className="w-full h-full"
                viewBox="0 0 320 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Horizontal Linear Timeline Axis */}
                <line
                  x1="20"
                  y1="110"
                  x2="300"
                  y2="110"
                  stroke="#3f3f46"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Linear markers */}
                <circle cx="50" cy="110" r="3.5" fill="#71717a" />
                <circle cx="110" cy="110" r="3.5" fill="#71717a" />
                <circle cx="210" cy="110" r="3.5" fill="#71717a" />
                <circle cx="270" cy="110" r="3.5" fill="#71717a" />

                {/* Concentric Cyclic Orbit connecting the timeline */}
                <circle
                  cx="160"
                  cy="110"
                  r="62"
                  stroke="#a1a1aa"
                  strokeWidth="2"
                  className="opacity-90"
                />

                {/* 4 Cyclic Nodes */}
                <circle cx="160" cy="48" r="5" fill="#f4f4f5" stroke="#18181b" strokeWidth="2" />
                <circle cx="222" cy="110" r="5" fill="#f4f4f5" stroke="#18181b" strokeWidth="2" />
                <circle cx="160" cy="172" r="5" fill="#f4f4f5" stroke="#18181b" strokeWidth="2" />
                <circle cx="98" cy="110" r="5" fill="#f4f4f5" stroke="#18181b" strokeWidth="2" />
              </svg>
            </div>
          </section>

          {/* Textos progresivos de la revelación */}
          <div className="min-h-[110px] flex flex-col items-center justify-center space-y-3">
            {variablePacing >= 1 && (
              <p className="font-mono text-sm sm:text-base tracking-[0.25em] text-neutral-400 uppercase font-semibold transition-opacity duration-700">
                {EXP05_CONTENT.variableReveal.beat1}
              </p>
            )}

            {variablePacing >= 2 && (
              <p className="font-mono text-sm sm:text-base tracking-[0.25em] text-neutral-300 uppercase font-semibold transition-opacity duration-700">
                {EXP05_CONTENT.variableReveal.beat2}
              </p>
            )}

            {variablePacing >= 3 && (
              <p className="text-xl sm:text-2xl md:text-3xl tracking-wider text-neutral-100 uppercase font-bold transition-all duration-700">
                ERA UNA{' '}
                <span className="text-white underline decoration-neutral-500 underline-offset-8">
                  {EXP05_CONTENT.variableReveal.keyword}
                </span>
                .
              </p>
            )}
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 4: GRAN REVEAL ("EL CICLO MENSTRUAL") & GUARDRAIL INMEDIATO       */}
      {/* Sin iconografía médica, sin rojo, sin rosa. Presencia de 2.5s              */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_04_reveal_guardrails' && !isCinematicActive && (
        <main
          id="exp05-screen-reveal-guardrails"
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          {/* GRAN REVEAL: EL CICLO MENSTRUAL */}
          <div className="mb-10">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500 block mb-4">
              VARIABLE IDENTIFICADA
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.15em] uppercase text-neutral-100 leading-tight transition-all duration-700">
              {EXP05_CONTENT.greatReveal.titleLine1}
              <br />
              {EXP05_CONTENT.greatReveal.titleLine2}
            </h2>
          </div>

          {/* GUARDRAILS INMEDIATOS */}
          {revealPacing >= 2 && (
            <div
              id="exp05-guardrails-container"
              className="w-full bg-[#0d0d10] border border-[#222228] rounded-xl p-6 sm:p-8 space-y-4 shadow-xl transition-all duration-700 animate-fade-in text-left mb-6"
            >
              <p className="text-sm sm:text-base font-medium text-neutral-300 border-b border-[#1c1c22] pb-3">
                {EXP05_CONTENT.guardrails.intro}
              </p>

              {revealPacing >= 3 && (
                <ul className="space-y-2.5 pt-1">
                  {EXP05_CONTENT.guardrails.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 font-light"
                    >
                      <span className="font-mono font-semibold text-neutral-100 tracking-wider">
                        {item.prefix}
                      </span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* EXPLICACIÓN MÍNIMA */}
          {revealPacing >= 4 && (
            <div className="w-full max-w-xl space-y-2 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed mb-8 transition-opacity duration-700">
              <p>{EXP05_CONTENT.explanation.beat1}</p>
              <p>{EXP05_CONTENT.explanation.beat2}</p>
              <p className="text-neutral-200 font-normal pt-1">
                {EXP05_CONTENT.explanation.beat4}
              </p>
            </div>
          )}

          {/* CTA AVANZAR A FASES */}
          {revealPacing >= 5 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp05-cta-to-phases"
                onClick={() => navigateToScreen('screen_05_phases')}
                variant="primary"
                className="bg-[#141417] border-neutral-700 hover:border-neutral-400 text-neutral-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                OBSERVAR LAS CUATRO FASES
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 5: VISUALIZACIÓN DE LAS CUATRO FASES & SEGURIDAD CONCEPTUAL       */}
      {/* Rueda en grafito / gris neutro. "EL CICLO NO ES UN GUION."                 */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_05_phases' && !isCinematicActive && (
        <main
          id="exp05-screen-phases"
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          {/* Header */}
          <div className="mb-6 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500">
            ESTRUCTURA CÍCLICA
          </div>

          {/* 4 PHASES CIRCULAR VISUALIZATION */}
          <div
            id="exp05-phases-wheel"
            className={`w-full max-w-md grid grid-cols-2 gap-3 mb-8 transition-opacity duration-700 ${
              phasesPacing >= 2 ? 'opacity-40' : 'opacity-100'
            }`}
          >
            {EXP05_CONTENT.phases.map((phase) => (
              <div
                key={phase.id}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#111114] border border-[#24242a] text-center"
              >
                <span className="font-mono text-[10px] tracking-widest text-neutral-500 mb-1">
                  FASE {phase.roman}
                </span>
                <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-neutral-200 uppercase">
                  {phase.label}
                </span>
              </div>
            ))}
          </div>

          {/* FRASE DE SEGURIDAD CONCEPTUAL */}
          {phasesPacing >= 2 && (
            <div
              id="exp05-safety-phrase"
              className="w-full max-w-lg space-y-4 animate-fade-in mb-8"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.15em] uppercase text-neutral-100">
                {EXP05_CONTENT.safetyPhrase.title}
              </h3>

              {phasesPacing >= 3 && (
                <p className="text-sm sm:text-base text-neutral-300 font-light transition-opacity duration-700">
                  {EXP05_CONTENT.safetyPhrase.beat1}
                </p>
              )}

              {phasesPacing >= 4 && (
                <p className="text-sm sm:text-base text-neutral-200 font-medium tracking-wide transition-opacity duration-700">
                  {EXP05_CONTENT.safetyPhrase.beat2}
                </p>
              )}
            </div>
          )}

          {/* CTA AVANZAR A DEMOSTRACIÓN */}
          {phasesPacing >= 4 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp05-cta-to-demonstration"
                onClick={() => navigateToScreen('screen_06_demonstration')}
                variant="primary"
                className="bg-[#141417] border-neutral-700 hover:border-neutral-400 text-neutral-100 text-xs sm:text-sm uppercase tracking-wider"
              >
                VER DEMOSTRACIÓN DE SEÑAL
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 6: DEMOSTRACIÓN — MISMA SEÑAL (“Sí.”) & NUEVA PERSPECTIVA         */}
      {/* "EL CONTEXTO NO TE DA LA RESPUESTA. TE AYUDA A NO INVENTARLA."             */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_06_demonstration' && !isCinematicActive && (
        <main
          id="exp05-screen-demonstration"
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          <div className="mb-6 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500">
            DEMOSTRACIÓN DE CASO
          </div>

          {/* SECCIÓN COMPARATIVA: ANTES VS CON CONTEXTO */}
          <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            {/* ANTES DE CONSIDERAR EL CONTEXTO */}
            <div className="p-5 rounded-xl bg-[#0e0e11] border border-[#222227] flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase block mb-3">
                  {EXP05_CONTENT.demonstration.before.eyebrow}
                </span>

                <div className="mb-4">
                  <span className="font-mono text-[11px] text-neutral-400 block mb-1">
                    {EXP05_CONTENT.demonstration.actor}:
                  </span>
                  <p className="text-base sm:text-lg font-mono font-semibold text-neutral-100">
                    {EXP05_CONTENT.demonstration.signal}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1c1c21]">
                <span className="font-mono text-[10px] text-neutral-500 uppercase block mb-1">
                  TU INTERPRETACIÓN:
                </span>
                <p className="text-xs sm:text-sm text-neutral-300 font-light">
                  {EXP05_CONTENT.demonstration.before.interpretation}
                </p>
              </div>
            </div>

            {/* CON UNA VARIABLE MÁS DE CONTEXTO */}
            <div
              className={`p-5 rounded-xl border transition-all duration-700 flex flex-col justify-between ${
                demoPacing >= 2
                  ? 'bg-[#121216] border-neutral-700 opacity-100'
                  : 'bg-[#0a0a0c] border-[#18181c] opacity-30'
              }`}
            >
              <div>
                <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase block mb-3">
                  {EXP05_CONTENT.demonstration.after.eyebrow}
                </span>

                <div className="mb-4">
                  <span className="font-mono text-[11px] text-neutral-400 block mb-1">
                    {EXP05_CONTENT.demonstration.actor}:
                  </span>
                  {/* EXACTAMENTE LA MISMA SEÑAL */}
                  <p className="text-base sm:text-lg font-mono font-semibold text-white">
                    {EXP05_CONTENT.demonstration.signal}
                  </p>
                </div>
              </div>

              {demoPacing >= 3 && (
                <div className="pt-3 border-t border-[#25252c] transition-opacity duration-700">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase block mb-1">
                    TU NUEVA PERSPECTIVA:
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-200 font-medium">
                    {EXP05_CONTENT.demonstration.after.perspective1}
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light mt-0.5">
                    {EXP05_CONTENT.demonstration.after.perspective2}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* INSIGHT PRINCIPAL */}
          {demoPacing >= 4 && (
            <div
              id="exp05-core-insight"
              className="w-full max-w-lg p-6 bg-[#0f0f13] border border-[#26262e] rounded-xl space-y-5 animate-fade-in mb-8"
            >
              {/* Pasos */}
              <div className="flex items-center justify-center gap-2 font-mono text-[11px] sm:text-xs text-neutral-400 uppercase tracking-wider">
                <span>{EXP05_CONTENT.insight.steps[0]}</span>
                <span className="text-neutral-600">→</span>
                <span className="text-neutral-300">{EXP05_CONTENT.insight.steps[1]}</span>
                <span className="text-neutral-600">→</span>
                <span className="text-white font-semibold">
                  {EXP05_CONTENT.insight.steps[2]}
                </span>
              </div>

              {/* Gran Frase */}
              <div className="space-y-1.5 pt-2 border-t border-[#202026]">
                <p className="text-base sm:text-lg font-semibold text-neutral-200 uppercase tracking-wide">
                  {EXP05_CONTENT.insight.quote1}
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                  {EXP05_CONTENT.insight.quote2}
                </p>
              </div>
            </div>
          )}

          {/* CTA AVANZAR A MECANISMO */}
          {demoPacing >= 5 && (
            <div className="transition-all duration-700 animate-fade-in">
              <PrimaryCTA
                id="exp05-cta-to-mechanism"
                onClick={() => navigateToScreen('screen_07_mechanism_contexto')}
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
      {/* PANTALLA 7: CONEXIÓN CON EL MECANISMO, CONTEXTO™ & CTA FINAL              */}
      {/* SEÑAL -> CONTEXTO -> PREGUNTA -> DECISIÓN -> CONEXIÓN                      */}
      {/* CTA: ENTENDER CONTEXTO™ -> TRANSICIÓN A EXP_06                             */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_07_mechanism_contexto' && !isCinematicActive && (
        <main
          id="exp05-screen-mechanism"
          className="w-full max-w-xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          <div className="mb-6 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500">
            ARQUITECTURA DE DECISIÓN
          </div>

          {/* CADENA DE VALOR */}
          <div
            id="exp05-mechanism-chain"
            className="w-full bg-[#0d0d10] border border-[#202026] rounded-xl p-5 mb-8 flex flex-col items-center space-y-2"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] sm:text-xs tracking-widest text-neutral-300 uppercase">
              {EXP05_CONTENT.mechanism.chain.map((item, idx) => (
                <React.Fragment key={item}>
                  <span
                    className={`px-2.5 py-1 rounded bg-[#15151a] border border-[#262630] ${
                      item === 'CONTEXTO' ? 'border-neutral-500 text-white font-semibold' : ''
                    }`}
                  >
                    {item}
                  </span>
                  {idx < EXP05_CONTENT.mechanism.chain.length - 1 && (
                    <span className="text-neutral-600 font-light">↓</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 font-light pt-3">
              {EXP05_CONTENT.mechanism.takeaway}
            </p>
          </div>

          {/* INTRODUCCIÓN DE CONTEXTO™ */}
          {contextoPacing >= 2 && (
            <div
              id="exp05-contexto-brand-reveal"
              className="space-y-3 mb-10 transition-all duration-700 animate-fade-in"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.2em] uppercase text-neutral-100">
                {EXP05_CONTENT.contexto.brand}
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
                {EXP05_CONTENT.contexto.description}
              </p>
            </div>
          )}

          {/* CTA FINAL: ENTENDER CONTEXTO™ */}
          {contextoPacing >= 3 && (
            <div className="transition-all duration-700 animate-fade-in w-full max-w-xs">
              <PrimaryCTA
                id="exp05-cta-understand-contexto"
                onClick={handleCompleteExperience}
                disabled={isCompletedGuard}
                variant="primary"
                className="w-full bg-neutral-100 text-neutral-950 hover:bg-white border-white hover:border-neutral-200 font-bold tracking-wider"
              >
                {EXP05_CONTENT.finalCta.label}
              </PrimaryCTA>
            </div>
          )}
        </main>
      )}
    </div>
  );
};
