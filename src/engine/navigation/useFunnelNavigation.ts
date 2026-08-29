import { useEffect } from 'react';
import { useFunnel } from '../state/FunnelContext';
import { parseCurrentRoute, syncRouteUrl } from '../../app/routes';
import { ExperienceId } from '../state/types';
import { getNextExperienceId } from '../../experiences/registry';

export function useFunnelNavigation() {
  const {
    state,
    goToExperience,
    completeExperience,
    canAccess,
    startNewSession,
    unlockAll,
  } = useFunnel();

  // Synchronize initial route from URL on mount
  useEffect(() => {
    const route = parseCurrentRoute();

    if (route.type === 'continue') {
      // Return to user's saved experience
      syncRouteUrl(state.progress.currentExperience);
    } else if (route.type === 'sales_page') {
      if (canAccess('sales_page')) {
        goToExperience('sales_page');
      } else {
        // Fallback to current experience if sales page is locked
        syncRouteUrl(state.progress.currentExperience);
      }
    } else if (route.type === 'funnel') {
      const requestedId = route.experienceId;
      if (canAccess(requestedId)) {
        if (requestedId !== state.progress.currentExperience) {
          goToExperience(requestedId);
        }
      } else {
        // Blocked: ensure state's current unlocked experience is maintained
        syncRouteUrl(state.progress.currentExperience);
      }
    }
  }, []);

  // Keep browser URL synchronized whenever currentExperience changes
  useEffect(() => {
    syncRouteUrl(state.progress.currentExperience);
  }, [state.progress.currentExperience]);

  const nextExperience = () => {
    const nextId = getNextExperienceId(state.progress.currentExperience);
    if (nextId && canAccess(nextId)) {
      goToExperience(nextId);
    }
  };

  const navigateTo = (id: ExperienceId): boolean => {
    return goToExperience(id);
  };

  return {
    currentExperienceId: state.progress.currentExperience,
    completedExperiences: state.progress.completedExperiences,
    completionPercentage: state.progress.completionPercentage,
    goToExperience: navigateTo,
    nextExperience,
    completeExperience,
    canAccessExperience: canAccess,
    startNewSession,
    unlockAll,
  };
}
