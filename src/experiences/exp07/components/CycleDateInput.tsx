// Mobile-First Date Input with Approximate Option for EXP_07
import React, { useState, useEffect } from 'react';
import { Calendar, HelpCircle, Check, AlertCircle } from 'lucide-react';
import { validateMenstruationDate } from '../cycleEngine';
import { EXP07_CONTENT } from '../exp07Content';
import { PrimaryCTA } from '../../../components/ui/PrimaryCTA';

interface CycleDateInputProps {
  initialDate?: string;
  initialIsApproximate?: boolean;
  onSubmit: (date: string, isApproximate: boolean) => void;
  onDateSelected?: (date: string, isApproximate: boolean) => void;
  disabled?: boolean;
}

export const CycleDateInput: React.FC<CycleDateInputProps> = ({
  initialDate = '',
  initialIsApproximate = false,
  onSubmit,
  onDateSelected,
  disabled = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [isApproximate, setIsApproximate] = useState<boolean>(initialIsApproximate);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  // Maximum allowed date is today
  const today = new Date();
  const maxDateStr = today.toISOString().split('T')[0];

  // Calculate 60 days ago as minimum reference date
  const sixtyDaysAgo = new Date(today);
  sixtyDaysAgo.setDate(today.getDate() - 60);
  const minDateStr = sixtyDaysAgo.toISOString().split('T')[0];

  const handleDateChange = (dateVal: string, isApprox: boolean, presetIndex: number | null = null) => {
    setSelectedDate(dateVal);
    setIsApproximate(isApprox);
    setActivePreset(presetIndex);

    if (!dateVal) {
      setValidationError('Por favor introduce una fecha para continuar.');
      return;
    }

    const validation = validateMenstruationDate(dateVal);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Fecha no válida.');
    } else {
      setValidationError(null);
      if (onDateSelected) {
        onDateSelected(dateVal, isApprox);
      }
    }
  };

  const handlePresetSelect = (daysAgo: number, index: number) => {
    const target = new Date();
    target.setDate(today.getDate() - daysAgo);
    const dateStr = target.toISOString().split('T')[0];
    handleDateChange(dateStr, true, index);
  };

  const handleToggleApproximate = () => {
    const nextApprox = !isApproximate;
    setIsApproximate(nextApprox);
    if (nextApprox && !selectedDate) {
      // Default to 2 weeks ago as convenient starting approximate preset
      handlePresetSelect(14, 1);
    } else if (selectedDate) {
      handleDateChange(selectedDate, nextApprox, activePreset);
    }
  };

  const isValid = Boolean(selectedDate && !validationError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || disabled) return;
    onSubmit(selectedDate, isApproximate);
  };

  return (
    <form
      id="cycle-date-input-form"
      onSubmit={handleSubmit}
      className="w-full space-y-6 text-left"
      noValidate
    >
      <div className="space-y-3">
        <label
          htmlFor="menstruation-date-picker"
          className="block text-xs font-mono uppercase tracking-widest text-neutral-400"
        >
          Fecha de inicio (último ciclo)
        </label>

        {/* Date Input Box */}
        <div className="relative rounded-xl bg-[#080808] border border-[#222] focus-within:border-orange-500/80 transition-colors p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Calendar className="w-4 h-4 text-orange-400 shrink-0" aria-hidden="true" />
            <input
              id="menstruation-date-picker"
              type="date"
              value={selectedDate}
              max={maxDateStr}
              min={minDateStr}
              onChange={(e) => handleDateChange(e.target.value, isApproximate, null)}
              className="bg-transparent text-white text-base sm:text-lg font-sans w-full focus:outline-none placeholder-neutral-600 appearance-none [color-scheme:dark]"
              aria-label="Selecciona la fecha del primer día de su última menstruación"
              aria-invalid={Boolean(validationError)}
              aria-describedby={validationError ? 'date-error-msg' : 'date-helper-msg'}
              disabled={disabled}
            />
          </div>

          {isValid && (
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-mono shrink-0">
              <Check className="w-3 h-3" />
              <span>VÁLIDA</span>
            </div>
          )}
        </div>

        {/* Approximate Toggle Option */}
        <div className="pt-1">
          <button
            type="button"
            id="approximate-toggle-btn"
            onClick={handleToggleApproximate}
            className={`w-full py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-sans flex items-center justify-between transition-all ${
              isApproximate
                ? 'bg-orange-950/20 border-orange-500/40 text-orange-300'
                : 'bg-[#090909] border-[#1A1A1A] text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
            aria-pressed={isApproximate}
          >
            <span className="flex items-center space-x-2">
              <HelpCircle className="w-3.5 h-3.5 text-orange-400/80" />
              <span>{EXP07_CONTENT.screen04.approximateToggleLabel}</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              {isApproximate ? 'ACTIVADO' : 'SELECCIONAR'}
            </span>
          </button>
        </div>

        {/* Quick presets when approximate is active */}
        {isApproximate && (
          <div className="space-y-2 pt-2 animate-fade-in">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">
              Referencias aproximadas rápidas:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {EXP07_CONTENT.screen04.quickPresets.map((preset, idx) => {
                const isSelected = activePreset === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    id={`preset-btn-${idx}`}
                    onClick={() => handlePresetSelect(preset.daysAgo, idx)}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-mono transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500/50 text-orange-300'
                        : 'bg-[#0A0A0A] border-[#181818] text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {validationError && (
          <div
            id="date-error-msg"
            className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-950/20 border border-rose-900/30 rounded-lg p-2.5"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Helper Disclaimer */}
        <p
          id="date-helper-msg"
          className="text-xs text-neutral-500 font-mono italic leading-relaxed pt-1"
        >
          {EXP07_CONTENT.screen04.approximateHelper}
        </p>
      </div>

      <div className="pt-4">
        <PrimaryCTA
          id="screen-04-submit-cta"
          disabled={!isValid || disabled}
          type="submit"
        >
          {EXP07_CONTENT.screen04.ctaLabel}
        </PrimaryCTA>
      </div>
    </form>
  );
};
