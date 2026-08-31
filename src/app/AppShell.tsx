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
import { SalesPage } from '../sales/SalesPage';
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

  const isImmersive =
    !isTestMode &&
    (currentExperienceId === 'sales_page' || currentExp?.presentationMode === 'immersive');

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

        {/* Global Top Bar (Hidden in Immersive Mode) */}
        {!isImmersive && (
          <header
            id="funnel-top-bar"
            className="w-full border-b border-[#141414] bg-[#050505]/90 backdrop-blur-md sticky top-0 z-40 safe-area-top"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]"
                  aria-hidden="true"
                />
                <span className="text-xs tracking-[0.25em] font-mono uppercase text-neutral-300">
                  Contexto
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <CaseId code={state.session.caseId} />
                </div>

                <AudioController
                  preferences={state.preferences}
                  onUpdatePreferences={updatePreferences}
                />
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-1">
              <ProgressIndicator
                currentExperience={state.progress.currentExperience}
                completedExperiences={state.progress.completedExperiences}
                percentage={state.progress.completionPercentage}
                onSelectExperience={(id) => goToExperience(id)}
              />
            </div>
          </header>
        )}

        {/* Experience Content Viewport with Transition */}
        <ExperienceContainer isLoading={isLoading} isImmersive={isImmersive}>
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
              <SalesPage
                onReturnToFunnel={() => goToExperience('exp08')}
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

        {/* Global Footer (Hidden in Immersive Mode) */}
        {!isImmersive && (
          <footer className="w-full h-12 border-t border-[#121212] flex items-center justify-between px-4 sm:px-8 bg-[#040404] z-20 safe-area-bottom">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                EXPEDIENTE CONFIDENCIAL
              </span>
            </div>

            <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest">
              Contexto™
            </p>
          </footer>
        )}

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
