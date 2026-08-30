import { ExperienceDefinition } from './types';
import { ExperienceId, ExperienceStatus, FunnelState } from '../engine/state/types';
import { EXP01 } from './exp01/EXP01';
import { EXP02 } from './exp02/EXP02';
import { EXP03 } from './exp03/EXP03';
import { EXP04Placeholder } from './exp04/EXP04Placeholder';
import { EXP05Placeholder } from './exp05/EXP05Placeholder';
import { EXP06Placeholder } from './exp06/EXP06Placeholder';
import { EXP07Placeholder } from './exp07/EXP07Placeholder';
import { EXP08Placeholder } from './exp08/EXP08Placeholder';

export const EXPERIENCES: ExperienceDefinition[] = [
  {
    id: 'exp01',
    slug: 'la-puerta',
    name: 'La Puerta',
    number: 1,
    description: 'Entrada al expediente de investigación para Andrés.',
    presentationMode: 'immersive',
    component: EXP01,
    completionCondition: (state: FunnelState) =>
      state.progress.completedExperiences.includes('exp01'),
    nextExperience: 'exp02',
  },
  {
    id: 'exp02',
    slug: 'el-espejo',
    name: 'El Espejo',
    number: 2,
    description: 'Reflejo de patrones, hábitos y fricciones iniciales.',
    presentationMode: 'immersive',
    component: EXP02,
    completionCondition: (state: FunnelState) =>
      state.progress.completedExperiences.includes('exp02'),
    nextExperience: 'exp03',
  },
  {
    id: 'exp03',
    slug: 'el-error-invisible',
    name: 'El Error Invisible',
    number: 3,
    description: 'Identificación de la falla recurrente en el modelo operativo.',
    presentationMode: 'immersive',
    component: EXP03,
    completionCondition: (state: FunnelState) =>
      state.progress.completedExperiences.includes('exp03'),
    nextExperience: 'exp04',
  },
  {
    id: 'exp04',
    slug: 'la-investigacion',
    name: 'La Investigación',
    number: 4,
    description: 'Recopilación de variables críticas y evidencia contextual.',
    presentationMode: 'standard',
    component: EXP04Placeholder,
    completionCondition: (state: FunnelState) =>
      state.progress.completedExperiences.includes('exp04'),
    nextExperience: 'exp05',
  },
  {
    id: 'exp05',
    slug: 'la-pieza-faltante',
    name: 'La Pieza Faltante',
    number: 5,
    description: 'El eslabón ausente en la toma de decisiones estratégicas.',
    presentationMode: 'standard',
    component: EXP05Placeholder,
    completionCondition: (state: FunnelState) =>
      state.progress.completedExperiences.includes('exp05'),
    nextExperience: 'exp06',
  },
  {
    id: 'exp06',
    slug: 'contexto',
    name: 'Contexto™',
    number: 6,
    description: 'Presentación de la arquitectura conceptual de Contexto™.',
    presentationMode: 'standard',
    component: EXP06Placeholder,
    completionCondition: (state: FunnelState) =>
      state.progress.completedExperiences.includes('exp06'),
    nextExperience: 'exp07',
  },
  {
    id: 'exp07',
    slug: 'el-futuro',
    name: 'El Futuro',
    number: 7,
    description: 'Proyección del impacto operativo con el marco de Contexto™.',
    presentationMode: 'standard',
    component: EXP07Placeholder,
    completionCondition: (state: FunnelState) =>
      state.progress.completedExperiences.includes('exp07'),
    nextExperience: 'exp08',
  },
  {
    id: 'exp08',
    slug: 'la-revelacion',
    name: 'La Revelación',
    number: 8,
    description: 'Cierre del expediente y transición a la propuesta integral.',
    presentationMode: 'standard',
    component: EXP08Placeholder,
    completionCondition: (state: FunnelState) =>
      state.progress.completedExperiences.includes('exp08'),
    nextExperience: 'sales_page',
  },
];

export const TOTAL_EXPERIENCES = EXPERIENCES.length;

export function getExperienceById(id: ExperienceId): ExperienceDefinition | undefined {
  return EXPERIENCES.find((exp) => exp.id === id);
}

export function getExperienceBySlug(slug: string): ExperienceDefinition | undefined {
  return EXPERIENCES.find((exp) => exp.slug === slug);
}

export function getNextExperienceId(currentId: ExperienceId): ExperienceId | null {
  const currentExp = getExperienceById(currentId);
  return currentExp ? currentExp.nextExperience : null;
}

/**
 * Computes status of an experience based on completed and current experience.
 */
export function getExperienceStatus(
  targetId: ExperienceId,
  completedExperiences: ExperienceId[],
  currentExperience: ExperienceId
): ExperienceStatus {
  if (completedExperiences.includes(targetId)) {
    return 'COMPLETED';
  }

  if (targetId === currentExperience) {
    return 'ACTIVE';
  }

  // EXP01 is available by default if not completed
  if (targetId === 'exp01') {
    return 'AVAILABLE';
  }

  // Target experience is available if its immediate predecessor is completed
  const targetIndex = EXPERIENCES.findIndex((exp) => exp.id === targetId);
  if (targetIndex > 0) {
    const previousExp = EXPERIENCES[targetIndex - 1];
    if (completedExperiences.includes(previousExp.id)) {
      return 'AVAILABLE';
    }
  }

  // Sales page is available if exp08 is completed
  if (targetId === 'sales_page' && completedExperiences.includes('exp08')) {
    return 'AVAILABLE';
  }

  return 'LOCKED';
}

/**
 * Checks if a user is allowed to access an experience.
 * Locked experiences cannot be entered directly via URL or navigation.
 */
export function canAccessExperience(
  targetId: ExperienceId,
  completedExperiences: ExperienceId[],
  currentExperience: ExperienceId
): boolean {
  if (targetId === 'exp01') return true;
  if (targetId === currentExperience) return true;
  if (completedExperiences.includes(targetId)) return true;

  const status = getExperienceStatus(targetId, completedExperiences, currentExperience);
  return status === 'AVAILABLE' || status === 'ACTIVE' || status === 'COMPLETED';
}

/**
 * Computes 0-100 percentage.
 */
export function calculateCompletionPercentage(completedExperiences: ExperienceId[]): number {
  return Math.min(100, Math.round((completedExperiences.length / TOTAL_EXPERIENCES) * 100));
}
