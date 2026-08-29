import React, { useState } from 'react';
import { useFunnel } from '../engine/state/FunnelContext';
import { useFunnelNavigation } from '../engine/navigation/useFunnelNavigation';
import { getExperienceById, getExperienceStatus } from '../experiences/registry';
import { ExperienceContainer } from '../components/navigation/ExperienceContainer';
import { Transition } from '../components/interaction/Transition';
import { CaseId } from '../components/ui/CaseId';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { AudioController } from '../components/media/AudioController';
import { LockedExperienceScreen } from '../components/navigation/LockedExperienceScreen';
import { SalesPagePlaceholder } from '../components/navigation/SalesPagePlaceholder';
import { DebugPanel } from '../components/debug/DebugPanel';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { EXPTestComponent } from '../experiences/test/EXPTestComponent';

export const AppShell: React.FC = () => {
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const {
    state,
    isLoading,
    updatePreferences,
    completeExperience,
    startNewSession,
    unlockAll,
    corruptLocalStorage,
    goToExperience,
  } = useFunnel();

  const { currentExperienceId } = useFunnelNavigation();

  const currentExp = getExperienceById(currentExperienceId);
  const status = getExperienceStatus(
    currentExperienceId,
    state.progress.completedExperiences,
    state.progress.currentExperience
  );

  const isLocked =
    currentExperienceId !== 'sales_page' &&
    status === 'LOCKED' &&
    !state.progress.completedExperiences.includes(currentExperienceId);

  const handleCompleteCurrent = (data?: Record<string, unknown>) => {
    completeExperience(currentExperienceId, data);
  };

  const handleReturnToCurrent = () => {
    const firstUnlocked = state.progress.completedExperiences.length > 0
      ? state.progress.currentExperience
      : 'exp01';
    goToExperience(firstUnlocked);
  };

  return (
    <ErrorBoundary>
      <div
        id="app-shell"
        className="relative min-h-[100dvh] w-full flex flex-col bg-[#050505] text-[#D1D1D1] cinematic-vignette overflow-x-hidden font-body"
      >
        {/* Subtle Matrix Dot Overlay */}
        <div
          className="pointer-events-none fixed inset-0 matrix-dots opacity-10 z-0"
          aria-hidden="true"
        />

        {isLoading && <LoadingScreen />}

        {/* Global Sophisticated Dark Top Bar */}
        <header
          id="funnel-top-bar"
          className="w-full border-b border-[#1A1A1A] bg-[#0A0A0A]/95 backdrop-blur-md sticky top-0 z-40 safe-area-top"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            {/* Left: Brand Identity with Orange Glow */}
            <div className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]"
                aria-hidden="true"
              />
              <h1 className="text-xs uppercase tracking-[0.3em] font-medium text-white">
                Contexto™ Foundation <span className="text-orange-600/80 font-mono text-[11px]">V1.0</span>
              </h1>
            </div>

            {/* Right: Case ID, Session & Audio HUD */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono">
                    Session
                  </span>
                  <span className="font-mono text-[11px] text-neutral-300">
                    {state.session.sessionId.slice(0, 8)}...
                  </span>
                </div>
                <div className="hidden sm:block h-6 w-px bg-neutral-800" />
                <CaseId code={state.session.caseId} />
              </div>

              <AudioController
                preferences={state.preferences}
                onUpdatePreferences={updatePreferences}
              />
            </div>
          </div>

          {/* Progress bar below header */}
          <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-1">
            <ProgressIndicator
              currentExperience={state.progress.currentExperience}
              completedExperiences={state.progress.completedExperiences}
              percentage={state.progress.completionPercentage}
              onSelectExperience={(id) => goToExperience(id)}
            />
          </div>
        </header>

        {/* Experience Content Viewport with Transition */}
        <ExperienceContainer isLoading={isLoading}>
          <Transition transitionKey={isTestMode ? 'exp_test' : currentExperienceId} mode="fade">
            {isTestMode ? (
              <div className="w-full flex flex-col items-center">
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono">
                  <span>Modo Sandbox: EXP_TEST (Experiencia de Prueba)</span>
                  <button
                    type="button"
                    onClick={() => setIsTestMode(false)}
                    className="underline text-white hover:text-orange-300 ml-2"
                  >
                    Salir
                  </button>
                </div>
                <EXPTestComponent
                  caseId={state.session.caseId}
                  onComplete={() => {
                    // Test completion
                  }}
                />
              </div>
            ) : isLocked ? (
              <LockedExperienceScreen
                caseId={state.session.caseId}
                onReturnToCurrent={handleReturnToCurrent}
              />
            ) : currentExperienceId === 'sales_page' ? (
              <SalesPagePlaceholder
                caseId={state.session.caseId}
                onReturnToFunnel={() => goToExperience('exp01')}
                onCheckout={() => {
                  completeExperience('exp08', { simulatedCheckout: true });
                }}
              />
            ) : currentExp ? (
              <currentExp.component
                experienceId={currentExp.id}
                name={currentExp.name}
                number={currentExp.number}
                caseId={state.session.caseId}
                status={status}
                onComplete={handleCompleteCurrent}
              />
            ) : (
              <div className="p-8 text-center text-xs font-mono text-neutral-500">
                Experiencia no identificada.
              </div>
            )}
          </Transition>
        </ExperienceContainer>

        {/* Sophisticated Dark Footer */}
        <footer className="w-full h-14 border-t border-[#1A1A1A] flex items-center justify-between px-4 sm:px-8 bg-[#080808] z-20 safe-area-bottom">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Engine: Ready
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                State: Sync
              </span>
            </div>
          </div>

          <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
            Contexto™ Foundation
          </p>
        </footer>

        {/* Development Debug HUD */}
        <DebugPanel
          state={state}
          activeTestMode={isTestMode}
          onToggleTestMode={() => setIsTestMode((prev) => !prev)}
          onResetSession={startNewSession}
          onGoToExperience={(id) => goToExperience(id)}
          onUnlockAll={unlockAll}
          onCorruptSession={corruptLocalStorage}
        />
      </div>
    </ErrorBoundary>
  );
};
