import React from 'react';
import { ExperienceRuntime } from '../../components/experience/ExperienceRuntime';
import { EXP_TEST_DEFINITION } from './expTestDefinition';

export interface EXPTestComponentProps {
  caseId: string;
  onComplete?: (data?: Record<string, unknown>) => void;
}

export const EXPTestComponent: React.FC<EXPTestComponentProps> = ({
  caseId,
  onComplete = () => {},
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <ExperienceRuntime
        definition={EXP_TEST_DEFINITION}
        caseId={caseId}
        onComplete={onComplete}
      />
    </div>
  );
};
