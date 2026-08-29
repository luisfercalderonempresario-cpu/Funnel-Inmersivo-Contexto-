import React from 'react';
import { ExperienceId } from '../../engine/state/types';
import { EXPERIENCES } from '../../experiences/registry';

interface ProgressIndicatorProps {
  currentExperience: ExperienceId;
  completedExperiences: ExperienceId[];
  percentage: number;
  className?: string;
  onSelectExperience?: (id: ExperienceId) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentExperience,
  completedExperiences,
  percentage,
  className = '',
  onSelectExperience,
}) => {
  const isExp01 = currentExperience === 'exp01';

  return (
    <div
      id="funnel-progress-indicator"
      className={`w-full flex flex-col gap-1.5 py-1 ${className}`}
      aria-label={isExp01 ? 'Expediente Activo' : `Progreso del funnel: ${percentage}%`}
    >
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
        <span>{isExp01 ? 'Expediente Activo' : 'Progreso de la Investigación'}</span>
        <span className="text-orange-500 font-bold">
          {isExp01 ? 'Fase Inicial' : `${percentage}%`}
        </span>
      </div>

      {/* Segmented bar */}
      <div className="grid grid-cols-8 gap-1.5 w-full h-1.5 bg-neutral-900 rounded-full p-0.5 border border-[#1A1A1A]">
        {EXPERIENCES.map((exp, idx) => {
          const isCompleted = completedExperiences.includes(exp.id);
          const isCurrent = exp.id === currentExperience;

          let bgClass = 'bg-neutral-800/60';
          if (isCompleted) {
            bgClass = 'bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]';
          } else if (isCurrent) {
            bgClass = 'bg-orange-500/80 animate-pulse';
          }

          // If in EXP01, don't show specific "Fase 0X of 8" tooltips
          const label = isExp01
            ? isCurrent ? 'Fase Activa' : 'Fase Reservada'
            : `Fase 0${idx + 1}: ${exp.name}`;

          return (
            <button
              key={exp.id}
              type="button"
              onClick={() => onSelectExperience?.(exp.id)}
              disabled={!onSelectExperience || (isExp01 && !isCompleted && !isCurrent)}
              className={`h-full rounded-full transition-all duration-300 ${bgClass} ${
                onSelectExperience ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
              }`}
              title={label}
              aria-label={label}
            />
          );
        })}
      </div>
    </div>
  );
};
