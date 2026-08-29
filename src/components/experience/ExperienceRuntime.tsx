import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ExperienceEngineDefinition,
  ExperienceRuntimeState,
  ExperienceAction,
} from '../../engine/experience/types';
import { ExperienceEngine } from '../../engine/experience/experienceEngine';
import { ScreenRenderer } from './ScreenRenderer';
import { useFunnel } from '../../engine/state/FunnelContext';
import { Transition } from '../interaction/Transition';
import { LoadingScreen } from '../ui/LoadingScreen';

export interface ExperienceRuntimeProps {
  definition: ExperienceEngineDefinition;
  caseId: string;
  onComplete: (data?: Record<string, unknown>) => void;
  className?: string;
}

export const ExperienceRuntime: React.FC<ExperienceRuntimeProps> = ({
  definition,
  caseId,
  onComplete,
  className = '',
}) => {
  const { state: funnelState, updateState } = useFunnel();
  const [runtimeState, setRuntimeState] = useState<ExperienceRuntimeState>(() => {
    return {
      experienceId: definition.id,
      currentScreen: definition.initialScreen,
      status: 'ACTIVE',
      localData: { ...(definition.initialState || {}) },
      localMemory: {},
      completedScreens: [],
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      error: null,
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Callbacks to sync with global FunnelState
  const handlePersistGlobalMemory = useCallback(
    (key: string, value: unknown) => {
      updateState((prev) => {
        const expId = definition.id as keyof typeof prev.responses;
        const currentExpResponses = (prev.responses[expId] || {}) as Record<string, unknown>;
        return {
          ...prev,
          responses: {
            ...prev.responses,
            [expId]: {
              ...currentExpResponses,
              [key]: value,
            },
          },
        };
      });
    },
    [definition.id, updateState]
  );

  const handleSaveResponse = useCallback(
    (experienceId: string, questionId: string, value: unknown) => {
      updateState((prev) => {
        const expId = experienceId as keyof typeof prev.responses;
        const currentExpResponses = (prev.responses[expId] || {}) as Record<string, unknown>;
        return {
          ...prev,
          responses: {
            ...prev.responses,
            [expId]: {
              ...currentExpResponses,
              [questionId]: value,
            },
          },
        };
      });
    },
    [updateState]
  );

  const handleAddInsight = useCallback(
    (insight: { id: string; type: string; value: unknown; sourceExperience: string }) => {
      updateState((prev) => {
        const discovered = prev.insights.discovered.includes(insight.id)
          ? prev.insights.discovered
          : [...prev.insights.discovered, insight.id];
        return {
          ...prev,
          insights: {
            ...prev.insights,
            discovered,
            narrativeProfile: {
              ...prev.insights.narrativeProfile,
              [insight.id]: insight.value,
            },
          },
        };
      });
    },
    [updateState]
  );

  // Instantiate engine
  const engine = useMemo(() => {
    return new ExperienceEngine({
      definition,
      funnelState,
      sessionId: funnelState.session.sessionId,
      caseId,
      setRuntimeState,
      onCompleteExperience: onComplete,
      onPersistGlobalMemory: handlePersistGlobalMemory,
      onSaveResponse: handleSaveResponse,
      onAddInsight: handleAddInsight,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [definition.id]);

  // Sync engine context on funnelState change
  useEffect(() => {
    engine.updateContext(funnelState, runtimeState);
  }, [engine, funnelState, runtimeState]);

  // Initialize engine on mount
  useEffect(() => {
    const initialized = engine.initialize();
    setRuntimeState(initialized);
  }, [engine]);

  // Accessibility: scroll and focus management when screen changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus({ preventScroll: true });
    }
  }, [runtimeState.currentScreen]);

  // Action Dispatch handler
  const handleDispatchAction = async (action: ExperienceAction) => {
    setIsLoading(true);
    try {
      await engine.dispatch(action);
    } finally {
      setIsLoading(false);
    }
  };

  const currentScreenDef = definition.screens[runtimeState.currentScreen] || {
    id: runtimeState.currentScreen,
    type: 'CONTENT',
    title: 'Pantalla no encontrada',
    content: `La pantalla ${runtimeState.currentScreen} no está declarada en la definición de la experiencia.`,
  };

  const activeMemory = engine.getMemoryManager().getExperienceMemory();

  return (
    <div
      ref={containerRef}
      id={`experience-runtime-${definition.id}`}
      tabIndex={-1}
      className={`relative w-full flex flex-col items-center justify-center focus:outline-none ${className}`}
    >
      {isLoading && <LoadingScreen message="PROCESANDO DECISIÓN..." subtext="Validando variable en memoria" />}

      <Transition transitionKey={runtimeState.currentScreen} mode="fade">
        <ScreenRenderer
          screen={currentScreenDef}
          caseId={caseId}
          memory={activeMemory}
          onDispatchAction={handleDispatchAction}
          isLoading={isLoading}
          audioEnabled={funnelState.preferences.audioEnabled}
        />
      </Transition>
    </div>
  );
};
