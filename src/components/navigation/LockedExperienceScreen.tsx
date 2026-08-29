import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { PrimaryCTA } from '../ui/PrimaryCTA';
import { CaseId } from '../ui/CaseId';

interface LockedExperienceScreenProps {
  caseId: string;
  onReturnToCurrent: () => void;
}

export const LockedExperienceScreen: React.FC<LockedExperienceScreenProps> = ({
  caseId,
  onReturnToCurrent,
}) => {
  return (
    <div
      id="experience-locked-view"
      className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-md mx-auto py-12 px-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center text-neutral-500 shadow-xl">
        <Lock className="w-6 h-6 text-neutral-400" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-center pb-1">
          <CaseId code={caseId} />
        </div>
        <h2 className="text-2xl font-serif italic font-bold text-white tracking-wide">
          Acceso Restringido
        </h2>
        <p className="text-xs text-neutral-400 font-mono leading-relaxed max-w-sm mx-auto">
          Esta parte de la investigación todavía no está disponible.
        </p>
      </div>

      <div className="pt-2 w-full sm:w-auto">
        <PrimaryCTA id="return-to-unlocked-btn" onClick={onReturnToCurrent} showIcon={false} variant="accent">
          <span className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            VOLVER AL MÓDULO ACTUAL
          </span>
        </PrimaryCTA>
      </div>
    </div>
  );
};
