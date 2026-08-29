import React from 'react';
import { ExperienceId, ExperienceStatus, FunnelState } from '../engine/state/types';

export type PresentationMode = 'standard' | 'immersive';

export interface ExperienceComponentProps {
  experienceId: ExperienceId;
  name: string;
  number: number;
  caseId: string;
  status: ExperienceStatus;
  onComplete: (data?: Record<string, unknown>) => void;
  onUpdateResponses?: (data: Record<string, unknown>) => void;
}

export interface ExperienceDefinition {
  id: ExperienceId;
  slug: string;
  name: string;
  number: number;
  description: string;
  presentationMode?: PresentationMode;
  component: React.ComponentType<ExperienceComponentProps>;
  completionCondition: (state: FunnelState) => boolean;
  nextExperience: ExperienceId | null;
}
