// Psychological Utility Recognition Question for EXP_07 (Screen 13)
import React, { useState } from 'react';
import { EXP07_CONTENT, UtilityOption } from '../exp07Content';
import { ChoiceButton } from '../../../components/ui/ChoiceButton';
import { PrimaryCTA } from '../../../components/ui/PrimaryCTA';
import { Sparkles } from 'lucide-react';

interface UtilityQuestionProps {
  selectedCode?: 'YES' | 'UNSURE' | null;
  onSelect: (code: 'YES' | 'UNSURE', label: string) => void;
  onContinue: () => void;
  disabled?: boolean;
}

export const UtilityQuestion: React.FC<UtilityQuestionProps> = ({
  selectedCode,
  onSelect,
  onContinue,
  disabled = false,
}) => {
  const [currentSelection, setCurrentSelection] = useState<'YES' | 'UNSURE' | null>(
    selectedCode || null
  );

  const handleSelect = (opt: UtilityOption) => {
    if (currentSelection || disabled) return;
    setCurrentSelection(opt.code);
    onSelect(opt.code, opt.label);
  };

  const selectedOpt = EXP07_CONTENT.screen13.options.find(
    (o) => o.code === currentSelection
  );

  return (
    <div id="utility-question-container" className="w-full space-y-6 text-left animate-fade-in">
      <div className="space-y-3">
        {EXP07_CONTENT.screen13.options.map((opt) => {
          const isSelected = currentSelection === opt.code;
          return (
            <div key={opt.id} className="w-full">
              <ChoiceButton
                id={`utility-opt-${opt.code.toLowerCase()}`}
                selected={isSelected}
                onClick={() => handleSelect(opt)}
                disabled={Boolean(currentSelection && !isSelected) || disabled}
              >
                {opt.label}
              </ChoiceButton>
            </div>
          );
        })}
      </div>

      {/* Selected feedback block */}
      {selectedOpt && (
        <div
          id="utility-feedback-box"
          className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] space-y-3 animate-fade-in"
        >
          <div className="flex items-center space-x-2 text-xs font-mono text-orange-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RESPUESTA REGISTRADA</span>
          </div>
          <p className="text-sm font-serif italic text-neutral-300">
            {selectedOpt.feedback}
          </p>

          <div className="pt-2">
            <PrimaryCTA id="utility-continue-cta" onClick={onContinue}>
              {EXP07_CONTENT.screen13.ctaLabel}
            </PrimaryCTA>
          </div>
        </div>
      )}
    </div>
  );
};
