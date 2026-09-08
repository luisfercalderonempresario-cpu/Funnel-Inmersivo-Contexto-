// EXP_04 — LA INVESTIGACIÓN (P0 #03 CTX_E04_V02_TIMELINE)
// Contexto™ Narrative Experience
import React, { useState, useEffect, useRef, useTransition } from 'react';
import { ExperienceComponentProps } from '../types';
import { useFunnel } from '../../engine/state/FunnelContext';
import { EXP04_CONTENT } from './exp04Content';
import { EXP04_DEFINITION } from './exp04Definition';
import { ExperienceMemoryManager } from '../../engine/experience/experienceMemory';
import {
  loadExperienceRuntimeState,
  persistExperienceRuntimeState,
  transitionScreenState,
} from '../../engine/experience/experienceState';
import { ExperienceRuntimeState } from '../../engine/experience/types';
import { eventTracker } from '../../engine/events/eventTracker';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { Volume2, VolumeX, CheckCircle2 } from 'lucide-react';

export const EXP04: React.FC<ExperienceComponentProps> = ({
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
        experience: 'exp04',
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
      const exp04Responses = (prev.responses.exp04 || {}) as Record<string, unknown>;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          exp04: {
            ...exp04Responses,
            [key]: value,
          },
        },
      };
    });
  };

  const memoryManagerRef = useRef(
    new ExperienceMemoryManager({
      experienceId: 'exp04',
      onPersistGlobal: handlePersistGlobal,
    })
  );

  // Initialize or restore runtime state for EXP_04
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    const existing = loadExperienceRuntimeState('exp04');
    if (existing && existing.currentScreen && EXP04_DEFINITION.screens[existing.currentScreen]) {
      return existing;
    }
    return {
      experienceId: 'exp04',
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
  // Phase 1 (Apertura): stages 1 -> 4
  const [openingPacing, setOpeningPacing] = useState<number>(1);
  // Phase 3 (Timeline & Revelación): stages 1 -> 7
  const [timelinePacing, setTimelinePacing] = useState<number>(1);
  // Lines connection state
  const [isLinesConnected, setIsLinesConnected] = useState<boolean>(false);
  // Question & Andrés response
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [systemResponsePacing, setSystemResponsePacing] = useState<number>(0);
  // Gran Pregunta & Mystery phase
  const [mysteryPacing, setMysteryPacing] = useState<number>(0);

  const currentScreenId = runtimeState.currentScreen;

  // Synchronize runtime persistence
  useEffect(() => {
    persistExperienceRuntimeState(runtimeState);
  }, [runtimeState]);

  // Track initial screen view and EXP04_STARTED
  useEffect(() => {
    const screen = runtimeState.currentScreen;

    if (screen === 'screen_01_opening') {
      eventTracker.trackEvent('EXP04_STARTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp04',
        payload: { screen: 'screen_01_opening' },
      });
    }

    eventTracker.trackEvent('SCREEN_VIEWED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
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

    // Stage 1: "HAY UNA FORMA DISTINTA DE MIRAR UNA RELACIÓN."
    // Stage 2: "No buscando respuestas primero…" (pause 1600ms)
    // Stage 3: "Sino observando patrones." (pause 1600ms)
    // Stage 4: CTA "COMENZAR INVESTIGACIÓN" (pause 1200ms)
    const timer1 = window.setTimeout(() => setOpeningPacing(2), 1600);
    const timer2 = window.setTimeout(() => setOpeningPacing(3), 3200);
    const timer3 = window.setTimeout(() => setOpeningPacing(4), 4500);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
      window.clearTimeout(timer3);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 2. CTA -> VIDEO PLAYBACK
  // ---------------------------------------------------------------------------
  const handleBeginInvestigation = async () => {
    if (isProcessing || isCinematicActive) return;
    setIsProcessing(true);

    // Track user intention and cinematic start
    eventTracker.trackEvent('CTA_CLICKED_BEGIN_INVESTIGATION', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { label: EXP04_CONTENT.screen01.ctaLabel },
    });

    eventTracker.trackEvent('CINEMATIC_STARTED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { asset: EXP04_CONTENT.cinematic.assetUrl },
    });

    memoryManagerRef.current.applyUpdates([
      { key: 'exp04.started', value: true, scope: 'global' },
      { key: 'exp04.cinematicStarted', value: true, scope: 'global' },
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

      // Play video directly within user gesture
      try {
        await video.play();
      } catch (err) {
        console.warn('[EXP04 Audio Play Blocked - Retrying Muted]', err);
        try {
          video.muted = true;
          await video.play();
        } catch (mutedErr) {
          console.warn('[EXP04 Fallback - Direct Timeline Display]', mutedErr);
          clearSafetyTimeout();
          setIsCinematicActive(false);
          setIsProcessing(false);
          // Fallback: mostrar directamente el timeline interactivo
          navigateToScreen('screen_03_timeline');
          eventTracker.trackEvent('TIMELINE_REVEALED', {
            sessionId: state.session.sessionId,
            caseId: state.session.caseId,
            experience: 'exp04',
            payload: { fallback: true },
          });
        }
      }
    } else {
      setIsCinematicActive(false);
      setIsProcessing(false);
      navigateToScreen('screen_03_timeline');
      eventTracker.trackEvent('TIMELINE_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp04',
        payload: { fallback: true },
      });
    }
  };

  // ---------------------------------------------------------------------------
  // 3. TRANSICIÓN MÁS IMPORTANTE (VIDEO ONENDED -> TIMELINE INVISIBLE MATCH)
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
      experience: 'exp04',
      payload: { asset: EXP04_CONTENT.cinematic.assetUrl },
    });

    // NO cortar a negro.
    // Congelar visualmente y abandonar elemento <video> mostrando inmediatamente la representación DIL/SVG.
    setIsCinematicActive(false);
    setIsProcessing(false);
    navigateToScreen('screen_03_timeline');

    eventTracker.trackEvent('TIMELINE_REVEALED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
    });
  };

  // ---------------------------------------------------------------------------
  // 4. REVELACIÓN PROGRESIVA & LÍNEAS CONECTADAS EN TIMELINE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_03_timeline') return;

    // Reset timeline pacing
    setTimelinePacing(1);
    setIsLinesConnected(false);

    // Stage 1: "HAY ALGO QUE CAMBIA." (t=0ms)
    // Stage 2: "TIENE UN RITMO." (t=1600ms)
    const t2 = window.setTimeout(() => setTimelinePacing(2), 1600);

    // Stage 3: "SE REPITE." (t=3200ms) -> Activar animación de líneas (900ms)
    const t3 = window.setTimeout(() => {
      setTimelinePacing(3);
      setIsLinesConnected(true);
      eventTracker.trackEvent('PATTERN_CONNECTED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp04',
        payload: { durationMs: 900 },
      });
    }, 3200);

    // Stage 4: Nuevo Insight - Beat 1: "No todos los días son iguales." (t=5000ms)
    const t4 = window.setTimeout(() => setTimelinePacing(4), 5000);

    // Stage 5: Beat 2: "Y no todo lo que cambia…" (t=6600ms)
    const t5 = window.setTimeout(() => setTimelinePacing(5), 6600);

    // Stage 6: Beat 3: "…se ve desde fuera." (t=8200ms)
    const t6 = window.setTimeout(() => setTimelinePacing(6), 8200);

    // Stage 7: Transition to Andrés interactive participation (t=10000ms)
    const t7 = window.setTimeout(() => {
      setTimelinePacing(7);
      navigateToScreen('screen_04_question');
    }, 10200);

    return () => {
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
      window.clearTimeout(t6);
      window.clearTimeout(t7);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 5. PARTICIPACIÓN DE ANDRÉS (SELECCIÓN DE OPCIÓN)
  // ---------------------------------------------------------------------------
  const handleSelectOption = (optionLabel: string) => {
    if (selectedResponse !== null) return;
    setSelectedResponse(optionLabel);

    // Guardar respuesta silenciosamente
    memoryManagerRef.current.applyUpdates([
      { key: 'exp04.patternConsideration', value: optionLabel, scope: 'global' },
      { key: 'exp04.questionAnsweredAt', value: new Date().toISOString(), scope: 'global' },
    ]);

    eventTracker.trackEvent('USER_PATTERN_RESPONSE', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { response: optionLabel },
    });

    // Pacing de respuesta del sistema
    setSystemResponsePacing(1); // "Eso es investigar el contexto."
    const tSys2 = window.setTimeout(() => setSystemResponsePacing(2), 1600); // "No asumir que ya sabes..."
    const tSys3 = window.setTimeout(() => setSystemResponsePacing(3), 3200); // "Buscar qué información..."
    const tAdv = window.setTimeout(() => {
      navigateToScreen('screen_05_investigation_mystery');
    }, 5200);

    return () => {
      window.clearTimeout(tSys2);
      window.clearTimeout(tSys3);
      window.clearTimeout(tAdv);
    };
  };

  // ---------------------------------------------------------------------------
  // 6. GRAN PREGUNTA & PISTA ENCONTRADA
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentScreenId !== 'screen_05_investigation_mystery') return;

    setMysteryPacing(1); // "Hay una variable que puede aportar contexto…"
    const t1 = window.setTimeout(() => setMysteryPacing(2), 1600); // "…a determinados momentos."
    const t2 = window.setTimeout(() => setMysteryPacing(3), 3200); // "Pero todavía no sabemos cuál es."
    // Pausa larga
    const t3 = window.setTimeout(() => setMysteryPacing(4), 5200); // "¿QUÉ ESTAMOS VIENDO?"

    // Mantener ~2 segundos y mostrar PISTA ENCONTRADA + CTA FINAL
    const t4 = window.setTimeout(() => {
      setMysteryPacing(5);
      eventTracker.trackEvent('PIECE_NOT_FOUND_REVEALED', {
        sessionId: state.session.sessionId,
        caseId: state.session.caseId,
        experience: 'exp04',
      });
    }, 7200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [currentScreenId]);

  // ---------------------------------------------------------------------------
  // 7. CTA FINAL -> DESCUBRIR LA PIEZA FALTANTE (COMPLETION -> EXP_05)
  // ---------------------------------------------------------------------------
  const handleCompleteExperience = () => {
    if (completingRef.current || isCompletedGuard) return;
    completingRef.current = true;
    setIsCompletedGuard(true);

    eventTracker.trackEvent('CTA_CLICKED_DISCOVER', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { label: EXP04_CONTENT.finalCta.label },
    });

    const finalMemory = {
      ...memoryManagerRef.current.getExperienceMemory(),
      patternRecognized: true,
      recurrenceIdentified: true,
      investigationMissingPieceFound: true,
      completedAt: new Date().toISOString(),
    };

    memoryManagerRef.current.applyUpdates([
      { key: 'exp04.completed', value: true, scope: 'global' },
      { key: 'exp04.completedAt', value: new Date().toISOString(), scope: 'global' },
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

    eventTracker.trackEvent('EXP04_COMPLETED', {
      sessionId: state.session.sessionId,
      caseId: state.session.caseId,
      experience: 'exp04',
      payload: { memory: finalMemory },
    });

    // Advance to EXP_05
    onComplete(finalMemory);
  };

  // ---------------------------------------------------------------------------
  // RENDER COMPONENT
  // ---------------------------------------------------------------------------
  return (
    <div
      id="exp04-container"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-10 sm:py-16 bg-[#050505] text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white"
    >
      {/* ========================================================================= */}
      {/* CAPA CINEMATOGRÁFICA FULLSCREEN (ASSET CTX_E04_V02_TIMELINE.mp4)           */}
      {/* El elemento <video> está previamente montado en el DOM desde el inicio     */}
      {/* Durante reproducción: fullscreen absoluto, object-fit: cover, sin textos  */}
      {/* sin navegación, sin CTA, sin progreso, sin Case ID, sin overlays          */}
      {/* ========================================================================= */}
      <div
        id="exp04-cinematic-layer"
        aria-hidden={!isCinematicActive}
        className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-300 ${
          isCinematicActive
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <video
          ref={videoRef}
          src={EXP04_CONTENT.cinematic.assetUrl}
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
      {/* HEADER AMBIENTAL: CASO & AUDIO (Oculto en modo cinematográfico)            */}
      {/* ========================================================================= */}
      {!isCinematicActive && (
        <header
          id="exp04-header"
          className="absolute top-6 left-0 right-0 px-6 sm:px-10 flex items-center justify-between pointer-events-auto z-20"
        >
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-neutral-500 uppercase tracking-[0.25em]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-400/80 animate-pulse" />
            <span>INVESTIGACIÓN</span>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-400">EXPEDIENTE #{caseId}</span>
          </div>

          <button
            id="exp04-audio-toggle"
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
      {/* PANTALLA 1: APERTURA EN FONDO OSCURO (#050505)                            */}
      {/* Revelación progresiva con pausas -> CTA "COMENZAR INVESTIGACIÓN"          */}
      {/* ========================================================================= */}
      {currentScreenId === 'screen_01_opening' && !isCinematicActive && (
        <main
          id="exp04-screen-opening"
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center justify-center min-h-[70vh] z-10 animate-fade-in"
        >
          {/* Eyebrow */}
          <div className="mb-6 font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-neutral-500">
            {EXP04_CONTENT.screen01.eyebrow}
          </div>

          {/* Lead Title: "HAY UNA FORMA DISTINTA DE MIRAR UNA RELACIÓN." */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-neutral-100 uppercase leading-snug sm:leading-tight mb-8 whitespace-pre-line">
            {EXP04_CONTENT.screen01.leadTitle}
          </h1>

          {/* Beat 1: "No buscando respuestas primero…" */}
          <div className="min-h-[72px] flex flex-col items-center justify-center space-y-3 mb-10">
            {openingPacing >= 2 && (
              <p className="text-base sm:text-lg md:text-xl font-light text-neutral-400 tracking-wide transition-opacity duration-700 opacity-100">
                {EXP04_CONTENT.screen01.leadBeat1}
              </p>
            )}

            {/* Beat 2: "Sino observando patrones." */}
            {openingPacing >= 3 && (
              <p className="text-base sm:text-lg md:text-xl font-medium text-neutral-200 tracking-wide transition-opacity duration-700 opacity-100">
                {EXP04_CONTENT.screen01.leadBeat2}
              </p>
            )}
          </div>

          {/* CTA: COMENZAR INVESTIGACIÓN */}
          <div
            className={`transition-all duration-700 transform ${
              openingPacing >= 4
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <PrimaryCTA
              id="exp04-cta-begin"
              onClick={handleBeginInvestigation}
              disabled={isProcessing}
              variant="primary"
              className="bg-[#141417] border-neutral-700/80 hover:border-neutral-400 hover:bg-[#1c1c20] text-neutral-100"
            >
              {EXP04_CONTENT.screen01.ctaLabel}
            </PrimaryCTA>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 3 & 4 & 5: TIMELINE INTERACTIVO & CONTINUIDAD DEL ÚLTIMO FRAME  */}
      {/* Tres períodos consecutivos: JULIO, AGOSTO, SEPTIEMBRE                     */}
      {/* Dos marcas discretas: ● y ○                                               */}
      {/* Estética: grafito, gris cálido, sin rojo, sin rosa, sin símbolos bio     */}
      {/* ========================================================================= */}
      {(currentScreenId === 'screen_03_timeline' ||
        currentScreenId === 'screen_04_question' ||
        currentScreenId === 'screen_05_investigation_mystery') &&
        !isCinematicActive && (
          <main
            id="exp04-interactive-stage"
            className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center z-10 animate-fade-in transition-all duration-700"
          >
            {/* ------------------------------------------------------------------- */}
            {/* TIMELINE VISUAL INSPIRADO EN EL ÚLTIMO FRAME                       */}
            {/* ------------------------------------------------------------------- */}
            <section
              id="exp04-calendar-timeline"
              aria-label="Timeline de observación en tres períodos"
              className="w-full mb-10 relative bg-[#0c0c0e] border border-[#222226] rounded-xl p-5 sm:p-8 shadow-2xl transition-all duration-700"
            >
              {/* Agenda Header Label */}
              <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3 mb-6 font-mono text-[10px] sm:text-xs tracking-[0.25em] text-neutral-500 uppercase">
                <span>AGENDA DE OBSERVACIÓN</span>
                <span>FRACTURA TEMPORAL — 3 PERIODOS</span>
              </div>

              {/* 3 Period Columns */}
              <div className="relative grid grid-cols-3 gap-2 sm:gap-6">
                {/* SVG Overlay for connecting lines between equivalent marks */}
                {/* Connecting Line 1 (Upper ●) and Line 2 (Lower ○) */}
                {/* ViewBox: 600 wide, 190 high. Centers: Col1=100, Col2=300, Col3=500 */}
                {/* Upper dots Y = 68, Lower dots Y = 138 */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 600 190"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {/* Upper line: connects ● from Julio (x=100) to Septiembre (x=500) */}
                  <path
                    d="M 100 68 L 500 68"
                    fill="none"
                    stroke="#a1a1aa"
                    strokeWidth="1.5"
                    strokeDasharray="400"
                    strokeDashoffset={isLinesConnected ? '0' : '400'}
                    style={{
                      transition: 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />

                  {/* Lower line: connects ○ from Julio (x=100) to Septiembre (x=500) */}
                  <path
                    d="M 100 138 L 500 138"
                    fill="none"
                    stroke="#a1a1aa"
                    strokeWidth="1.5"
                    strokeDasharray="400"
                    strokeDashoffset={isLinesConnected ? '0' : '400'}
                    style={{
                      transition: 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </svg>

                {/* Column 1: JULIO */}
                <div
                  id="period-julio"
                  className="flex flex-col items-center bg-[#131316] border border-[#232328] rounded-lg p-3 sm:p-4 text-center relative z-0"
                >
                  <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-neutral-300 font-semibold uppercase mb-4">
                    JULIO
                  </span>

                  {/* Calendar rows & Upper Mark */}
                  <div className="w-full flex items-center justify-between border-b border-[#1f1f24] py-2 px-1 text-[10px] font-mono text-neutral-500">
                    <span className="opacity-40">09</span>
                    {/* Marca Superior ● */}
                    <span
                      className={`inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-neutral-200 shadow-sm border border-neutral-400/50 transition-transform duration-300 ${
                        isLinesConnected ? 'scale-110 ring-2 ring-neutral-500/40' : ''
                      }`}
                      title="Marca superior — Registro A"
                    />
                    <span className="opacity-0">--</span>
                  </div>

                  <div className="w-full py-2 px-1 flex items-center justify-center text-[10px] font-mono text-neutral-700">
                    <span className="tracking-widest">···</span>
                  </div>

                  {/* Calendar rows & Lower Mark */}
                  <div className="w-full flex items-center justify-between border-t border-[#1f1f24] py-2 px-1 text-[10px] font-mono text-neutral-500">
                    <span className="opacity-40">23</span>
                    {/* Marca Inferior ○ */}
                    <span
                      className={`inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#131316] border-2 border-neutral-400 transition-transform duration-300 ${
                        isLinesConnected ? 'scale-110 ring-2 ring-neutral-500/40' : ''
                      }`}
                      title="Marca inferior — Registro B"
                    />
                    <span className="opacity-0">--</span>
                  </div>
                </div>

                {/* Column 2: AGOSTO */}
                <div
                  id="period-agosto"
                  className="flex flex-col items-center bg-[#131316] border border-[#232328] rounded-lg p-3 sm:p-4 text-center relative z-0"
                >
                  <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-neutral-300 font-semibold uppercase mb-4">
                    AGOSTO
                  </span>

                  {/* Calendar rows & Upper Mark */}
                  <div className="w-full flex items-center justify-between border-b border-[#1f1f24] py-2 px-1 text-[10px] font-mono text-neutral-500">
                    <span className="opacity-40">06</span>
                    {/* Marca Superior ● */}
                    <span
                      className={`inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-neutral-200 shadow-sm border border-neutral-400/50 transition-transform duration-300 ${
                        isLinesConnected ? 'scale-110 ring-2 ring-neutral-500/40' : ''
                      }`}
                      title="Marca superior — Registro A"
                    />
                    <span className="opacity-0">--</span>
                  </div>

                  <div className="w-full py-2 px-1 flex items-center justify-center text-[10px] font-mono text-neutral-700">
                    <span className="tracking-widest">···</span>
                  </div>

                  {/* Calendar rows & Lower Mark */}
                  <div className="w-full flex items-center justify-between border-t border-[#1f1f24] py-2 px-1 text-[10px] font-mono text-neutral-500">
                    <span className="opacity-40">20</span>
                    {/* Marca Inferior ○ */}
                    <span
                      className={`inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#131316] border-2 border-neutral-400 transition-transform duration-300 ${
                        isLinesConnected ? 'scale-110 ring-2 ring-neutral-500/40' : ''
                      }`}
                      title="Marca inferior — Registro B"
                    />
                    <span className="opacity-0">--</span>
                  </div>
                </div>

                {/* Column 3: SEPTIEMBRE */}
                <div
                  id="period-septiembre"
                  className="flex flex-col items-center bg-[#131316] border border-[#232328] rounded-lg p-3 sm:p-4 text-center relative z-0"
                >
                  <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-neutral-300 font-semibold uppercase mb-4">
                    SEPTIEMBRE
                  </span>

                  {/* Calendar rows & Upper Mark */}
                  <div className="w-full flex items-center justify-between border-b border-[#1f1f24] py-2 px-1 text-[10px] font-mono text-neutral-500">
                    <span className="opacity-40">03</span>
                    {/* Marca Superior ● */}
                    <span
                      className={`inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-neutral-200 shadow-sm border border-neutral-400/50 transition-transform duration-300 ${
                        isLinesConnected ? 'scale-110 ring-2 ring-neutral-500/40' : ''
                      }`}
                      title="Marca superior — Registro A"
                    />
                    <span className="opacity-0">--</span>
                  </div>

                  <div className="w-full py-2 px-1 flex items-center justify-center text-[10px] font-mono text-neutral-700">
                    <span className="tracking-widest">···</span>
                  </div>

                  {/* Calendar rows & Lower Mark */}
                  <div className="w-full flex items-center justify-between border-t border-[#1f1f24] py-2 px-1 text-[10px] font-mono text-neutral-500">
                    <span className="opacity-40">17</span>
                    {/* Marca Inferior ○ */}
                    <span
                      className={`inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#131316] border-2 border-neutral-400 transition-transform duration-300 ${
                        isLinesConnected ? 'scale-110 ring-2 ring-neutral-500/40' : ''
                      }`}
                      title="Marca inferior — Registro B"
                    />
                    <span className="opacity-0">--</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------------- */}
            {/* SECCIÓN 7 & 8: REVELACIÓN PROGRESIVA Y NUEVO INSIGHT               */}
            {/* ------------------------------------------------------------------- */}
            {currentScreenId === 'screen_03_timeline' && (
              <div
                id="exp04-timeline-beats"
                className="w-full flex flex-col items-center text-center space-y-5 min-h-[140px]"
              >
                {/* Bloque 1: Revelación de patrón */}
                <div
                  className={`transition-opacity duration-700 space-y-2 ${
                    timelinePacing >= 4 ? 'opacity-30' : 'opacity-100'
                  }`}
                >
                  <p className="font-mono text-sm sm:text-base tracking-[0.2em] text-neutral-400 uppercase font-semibold">
                    {EXP04_CONTENT.revelation.beat1}
                  </p>

                  {timelinePacing >= 2 && (
                    <p className="font-mono text-sm sm:text-base tracking-[0.2em] text-neutral-300 uppercase font-semibold transition-opacity duration-700">
                      {EXP04_CONTENT.revelation.beat2}
                    </p>
                  )}

                  {timelinePacing >= 3 && (
                    <p className="font-mono text-base sm:text-lg tracking-[0.25em] text-neutral-100 uppercase font-bold transition-opacity duration-700">
                      {EXP04_CONTENT.revelation.beat3}
                    </p>
                  )}
                </div>

                {/* Bloque 2: Nuevo Insight */}
                {timelinePacing >= 4 && (
                  <div className="space-y-2 pt-2 transition-opacity duration-700 opacity-100">
                    <p className="text-base sm:text-lg font-light text-neutral-300 tracking-wide">
                      {EXP04_CONTENT.insight.beat1}
                    </p>

                    {timelinePacing >= 5 && (
                      <p className="text-base sm:text-lg font-light text-neutral-300 tracking-wide transition-opacity duration-700">
                        {EXP04_CONTENT.insight.beat2}
                      </p>
                    )}

                    {timelinePacing >= 6 && (
                      <p className="text-lg sm:text-xl font-medium text-neutral-100 tracking-wide transition-opacity duration-700">
                        {EXP04_CONTENT.insight.beat3}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* SECCIÓN 9 & 10: PARTICIPACIÓN DE ANDRÉS Y RESPUESTA DEL SISTEMA   */}
            {/* ------------------------------------------------------------------- */}
            {currentScreenId === 'screen_04_question' && (
              <div
                id="exp04-question-container"
                className="w-full flex flex-col items-center text-center space-y-6 animate-fade-in"
              >
                {/* Pregunta interactiva */}
                <div className="space-y-2 max-w-xl">
                  <p className="text-neutral-400 text-sm sm:text-base font-light">
                    {EXP04_CONTENT.question.lead}
                  </p>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-neutral-100 leading-snug">
                    {EXP04_CONTENT.question.mainQuestion}
                  </h2>
                </div>

                {/* Opciones interactivas */}
                <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {EXP04_CONTENT.question.options.map((option) => {
                    const isSelected = selectedResponse === option.label;
                    return (
                      <button
                        key={option.id}
                        id={`opt-${option.id}`}
                        type="button"
                        onClick={() => handleSelectOption(option.label)}
                        disabled={selectedResponse !== null}
                        className={`py-3.5 px-4 rounded-lg font-mono text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 border cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-100 text-neutral-900 border-white font-bold shadow-lg scale-102'
                            : selectedResponse !== null
                            ? 'opacity-30 border-neutral-800 bg-[#0f0f12] text-neutral-500 cursor-not-allowed'
                            : 'bg-[#121215] border-neutral-800 hover:border-neutral-500 text-neutral-200 hover:bg-[#18181d]'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {/* Respuesta del sistema */}
                {selectedResponse !== null && systemResponsePacing >= 1 && (
                  <div
                    id="exp04-system-response"
                    className="w-full max-w-lg mt-4 p-5 bg-[#0e0e11] border border-[#232328] rounded-xl space-y-3 animate-fade-in text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-neutral-400 font-mono text-xs tracking-wider uppercase mb-1">
                      <CheckCircle2 className="w-4 h-4 text-neutral-300" />
                      <span>INVESTIGACIÓN DE CONTEXTO</span>
                    </div>

                    <p className="text-sm sm:text-base font-medium text-neutral-200">
                      {EXP04_CONTENT.systemResponse.beat1}
                    </p>

                    {systemResponsePacing >= 2 && (
                      <p className="text-xs sm:text-sm text-neutral-400 font-light transition-opacity duration-700">
                        {EXP04_CONTENT.systemResponse.beat2}
                      </p>
                    )}

                    {systemResponsePacing >= 3 && (
                      <p className="text-xs sm:text-sm text-neutral-300 font-medium tracking-wide transition-opacity duration-700">
                        {EXP04_CONTENT.systemResponse.beat3}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* SECCIÓN 11 & 12: GRAN PREGUNTA, PISTA ENCONTRADA & CTA FINAL       */}
            {/* ------------------------------------------------------------------- */}
            {currentScreenId === 'screen_05_investigation_mystery' && (
              <div
                id="exp04-mystery-container"
                className="w-full flex flex-col items-center text-center space-y-6 animate-fade-in"
              >
                {/* Textos progresivos */}
                <div className="min-h-[90px] flex flex-col items-center justify-center space-y-2">
                  {mysteryPacing >= 1 && (
                    <p className="text-sm sm:text-base md:text-lg font-light text-neutral-300 transition-opacity duration-700">
                      {EXP04_CONTENT.bigQuestion.beat1}
                    </p>
                  )}

                  {mysteryPacing >= 2 && (
                    <p className="text-sm sm:text-base md:text-lg font-light text-neutral-300 transition-opacity duration-700">
                      {EXP04_CONTENT.bigQuestion.beat2}
                    </p>
                  )}

                  {mysteryPacing >= 3 && (
                    <p className="text-base sm:text-lg font-medium text-neutral-100 transition-opacity duration-700">
                      {EXP04_CONTENT.bigQuestion.beat3}
                    </p>
                  )}
                </div>

                {/* Dominant Title: ¿QUÉ ESTAMOS VIENDO? */}
                {mysteryPacing >= 4 && (
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.15em] text-neutral-100 transition-all duration-700 my-2">
                    {EXP04_CONTENT.bigQuestion.dominantTitle}
                  </h2>
                )}

                {/* Pista encontrada & CTA Final */}
                {mysteryPacing >= 5 && (
                  <div className="w-full max-w-md p-6 bg-[#0f0f13] border border-[#26262d] rounded-xl flex flex-col items-center text-center space-y-6 shadow-2xl animate-fade-in">
                    <div className="space-y-2">
                      <span className="inline-block px-3 py-1 bg-neutral-800/80 border border-neutral-700 text-neutral-300 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase rounded-full">
                        {EXP04_CONTENT.bigQuestion.clueEyebrow}
                      </span>
                      <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                        {EXP04_CONTENT.bigQuestion.clueText}
                      </p>
                    </div>

                    {/* CTA FINAL: DESCUBRIR LA PIEZA FALTANTE */}
                    <PrimaryCTA
                      id="exp04-cta-discover"
                      onClick={handleCompleteExperience}
                      disabled={isCompletedGuard}
                      variant="primary"
                      className="bg-neutral-100 text-neutral-950 hover:bg-white border-white hover:border-neutral-200 font-bold"
                    >
                      {EXP04_CONTENT.finalCta.label}
                    </PrimaryCTA>
                  </div>
                )}
              </div>
            )}
          </main>
        )}
    </div>
  );
};
