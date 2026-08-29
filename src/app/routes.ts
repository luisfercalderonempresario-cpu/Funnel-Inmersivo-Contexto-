import { ExperienceId } from '../engine/state/types';
import { getExperienceBySlug, getExperienceById } from '../experiences/registry';

export type AppRoute =
  | { type: 'funnel'; experienceId: ExperienceId }
  | { type: 'continue' }
  | { type: 'sales_page' }
  | { type: 'not_found' };

/**
 * Parses current window location pathname and search query into a structured AppRoute.
 */
export function parseCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') {
    return { type: 'funnel', experienceId: 'exp01' };
  }

  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const params = new URLSearchParams(window.location.search);

  // Check explicit query param deep link: ?exp=exp02 or ?slug=el-espejo
  const expParam = params.get('exp') as ExperienceId | null;
  if (expParam) {
    if (expParam === 'sales_page' || getExperienceById(expParam)) {
      return expParam === 'sales_page'
        ? { type: 'sales_page' }
        : { type: 'funnel', experienceId: expParam };
    }
  }

  const slugParam = params.get('slug');
  if (slugParam) {
    const matched = getExperienceBySlug(slugParam);
    if (matched) {
      return { type: 'funnel', experienceId: matched.id };
    }
  }

  // Pathname routing
  if (pathname === '' || pathname === '/') {
    return { type: 'funnel', experienceId: 'exp01' };
  }

  if (pathname === '/continuar') {
    return { type: 'continue' };
  }

  if (pathname === '/compra') {
    return { type: 'sales_page' };
  }

  // Check if pathname matches experience slug: /la-puerta, /el-espejo, etc.
  const pathClean = pathname.replace(/^\//, '');
  const matchedSlug = getExperienceBySlug(pathClean);
  if (matchedSlug) {
    return { type: 'funnel', experienceId: matchedSlug.id };
  }

  return { type: 'funnel', experienceId: 'exp01' };
}

/**
 * Updates browser history URL smoothly without triggering a full page reload.
 */
export function syncRouteUrl(experienceId: ExperienceId): void {
  if (typeof window === 'undefined') return;

  try {
    let targetPath = '/';
    if (experienceId === 'sales_page') {
      targetPath = '/compra';
    } else {
      const exp = getExperienceById(experienceId);
      if (exp && experienceId !== 'exp01') {
        targetPath = `/?exp=${exp.id}`;
      } else {
        targetPath = '/';
      }
    }

    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== targetPath) {
      window.history.replaceState(null, '', targetPath);
    }
  } catch (err) {
    console.warn('[Routing] Failed to update browser URL:', err);
  }
}
