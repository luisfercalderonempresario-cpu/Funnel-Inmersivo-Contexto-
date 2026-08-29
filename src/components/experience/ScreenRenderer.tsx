import React, { useState, useEffect } from 'react';
import {
  ScreenDefinition,
  ExperienceAction,
  ChoiceOption,
} from '../../engine/experience/types';
import { PrimaryCTA } from '../ui/PrimaryCTA';
import { SecondaryCTA } from '../ui/SecondaryCTA';
import { ChoiceButton } from '../ui/ChoiceButton';
import { CaseId } from '../ui/CaseId';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Video,
  Volume2,
  MessageSquare,
  CheckCircle2,
  FileSearch,
} from 'lucide-react';

export interface ScreenRendererProps {
  screen: ScreenDefinition;
  caseId: string;
  memory: Record<string, unknown>;
  onDispatchAction: (action: ExperienceAction) => Promise<void>;
  isLoading?: boolean;
  audioEnabled?: boolean;
}

export const ScreenRenderer: React.FC<ScreenRendererProps> = ({
  screen,
  caseId,
  memory,
  onDispatchAction,
  isLoading = false,
  audioEnabled = false,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    screen.waitDurationSeconds || 3
  );

  // Handle WAIT type auto-advance
  useEffect(() => {
    if (screen.type !== 'WAIT') return;

    const duration = screen.waitDurationSeconds || 3;
    setSecondsRemaining(duration);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (screen.autoAdvance !== false) {
            onDispatchAction({
              type: 'CONTINUE',
              targetScreen: screen.nextScreen,
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen.id, screen.type, screen.waitDurationSeconds, screen.nextScreen, screen.autoAdvance]);

  // Render options selection for QUESTION & CHOICE screens
  const handleSelectOption = (option: ChoiceOption) => {
    setSelectedOptionId(option.id);

    const action: ExperienceAction = {
      type: 'SELECT',
      payload: {
        questionId: screen.id,
        optionId: option.id,
        value: option.value ?? option.id,
      },
      targetScreen: option.nextScreen || screen.nextScreen,
      memoryUpdates: option.memoryUpdates,
    };

    onDispatchAction(action);
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    onDispatchAction({
      type: 'SUBMIT',
      payload: {
        fieldId: screen.id,
        value: inputValue.trim(),
      },
      targetScreen: screen.nextScreen,
      memoryUpdates: [
        {
          key: screen.id,
          value: inputValue.trim(),
          scope: 'global',
        },
      ],
    });
  };

  return (
    <div
      id={`screen-${screen.id}`}
      className="w-full max-w-xl mx-auto flex flex-col items-center text-center space-y-6 py-6 px-4 animate-fade-in"
      role="region"
      aria-labelledby={`screen-heading-${screen.id}`}
    >
      {/* Header Eyebrow / Badges */}
      <div className="flex flex-col items-center gap-2">
        {screen.eyebrow ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            {screen.eyebrow}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1A1A1A] bg-[#0A0A0A] text-neutral-400 text-[10px] font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            SCREEN TYPE: {screen.type}
          </div>
        )}
      </div>

      {/* Screen Title */}
      <div className="space-y-2">
        <h2
          id={`screen-heading-${screen.id}`}
          className="text-2xl sm:text-3xl font-serif italic font-bold text-white tracking-wide leading-tight"
        >
          {screen.title}
        </h2>
        {screen.subtitle && (
          <p className="text-sm text-neutral-400 font-body leading-relaxed max-w-md mx-auto">
            {screen.subtitle}
          </p>
        )}
      </div>

      {/* Dynamic Content Switching by Screen Type */}
      {screen.type === 'INTRO' && (
        <div className="w-full space-y-6">
          {screen.content && (
            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] text-sm text-neutral-300 leading-relaxed text-left font-body">
              {screen.content}
            </div>
          )}

          <div className="pt-2">
            <PrimaryCTA
              id={`cta-continue-${screen.id}`}
              variant="accent"
              isLoading={isLoading}
              onClick={() => {
                onDispatchAction({
                  type: 'CONTINUE',
                  targetScreen: screen.nextScreen,
                  branchTargets: screen.branchTargets,
                });
              }}
            >
              <span className="flex items-center gap-2">
                CONTINUAR
                <ArrowRight className="w-4 h-4" />
              </span>
            </PrimaryCTA>
          </div>
        </div>
      )}

      {screen.type === 'CONTENT' && (
        <div className="w-full space-y-6">
          {screen.content && (
            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] text-sm text-neutral-300 leading-relaxed text-left font-body">
              {screen.content}
            </div>
          )}

          {screen.actions && screen.actions.length > 0 ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {screen.actions.map((act, idx) => (
                <PrimaryCTA
                  key={idx}
                  id={`cta-action-${screen.id}-${idx}`}
                  variant={idx === 0 ? 'accent' : 'primary'}
                  isLoading={isLoading}
                  onClick={() => onDispatchAction(act)}
                >
                  {act.label || 'CONTINUAR'}
                </PrimaryCTA>
              ))}
            </div>
          ) : (
            <PrimaryCTA
              id={`cta-content-next-${screen.id}`}
              variant="accent"
              isLoading={isLoading}
              onClick={() =>
                onDispatchAction({
                  type: 'CONTINUE',
                  targetScreen: screen.nextScreen,
                  branchTargets: screen.branchTargets,
                })
              }
            >
              CONTINUAR
            </PrimaryCTA>
          )}
        </div>
      )}

      {(screen.type === 'QUESTION' || screen.type === 'CHOICE') && (
        <div className="w-full space-y-4">
          {screen.content && (
            <p className="text-xs text-neutral-400 font-mono">{screen.content}</p>
          )}

          {/* Options Grid */}
          {screen.options && screen.options.length > 0 ? (
            <div className="space-y-2.5 text-left">
              {screen.options.map((opt) => (
                <ChoiceButton
                  key={opt.id}
                  id={`option-${opt.id}`}
                  code={opt.code || opt.id.toUpperCase()}
                  subtext={opt.subtext}
                  selected={selectedOptionId === opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isLoading}
                >
                  {opt.label}
                </ChoiceButton>
              ))}
            </div>
          ) : (
            /* Text Input fallback for open-ended questions */
            <form onSubmit={handleSubmitText} className="space-y-4 w-full text-left">
              <input
                id={`input-field-${screen.id}`}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-body text-sm"
                required
              />
              <div className="flex justify-end">
                <PrimaryCTA
                  id={`submit-input-${screen.id}`}
                  type="submit"
                  variant="accent"
                  isLoading={isLoading}
                >
                  ENVIAR
                </PrimaryCTA>
              </div>
            </form>
          )}
        </div>
      )}

      {screen.type === 'REVEAL' && (
        <div className="w-full space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-orange-500/30 text-left space-y-4 shadow-[0_0_20px_rgba(234,88,12,0.1)]">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400">
                Evidencia Contextual
              </span>
              <CaseId code={caseId} />
            </div>

            <div className="text-sm text-neutral-200 font-body leading-relaxed">
              {screen.content || 'Información revelada a partir de los datos recolectados.'}
            </div>

            {/* Display relevant active memory */}
            {Object.keys(memory).length > 0 && (
              <div className="p-3 rounded-xl bg-[#050505] border border-[#1A1A1A] text-xs font-mono space-y-1">
                <p className="text-neutral-500 uppercase text-[10px]">Memoria Narrativa Registrada:</p>
                {Object.entries(memory).map(([k, v]) => (
                  <p key={k} className="text-neutral-300">
                    &bull; <span className="text-orange-400">{k}:</span> {String(v)}
                  </p>
                ))}
              </div>
            )}
          </div>

          <PrimaryCTA
            id={`cta-reveal-next-${screen.id}`}
            variant="accent"
            isLoading={isLoading}
            onClick={() =>
              onDispatchAction({
                type: 'CONTINUE',
                targetScreen: screen.nextScreen,
                branchTargets: screen.branchTargets,
              })
            }
          >
            CONTINUAR
          </PrimaryCTA>
        </div>
      )}

      {screen.type === 'WAIT' && (
        <div className="w-full space-y-6 py-4">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-ping" />
            <div className="w-12 h-12 rounded-full border-2 border-neutral-800 border-t-orange-500 animate-spin" />
            <Clock className="w-5 h-5 text-orange-400" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-orange-400">
              Procesando Variable Contextual...
            </p>
            <p className="text-xs text-neutral-500 font-mono">
              Tiempo restante: {secondsRemaining}s
            </p>
          </div>

          <div className="pt-2">
            <SecondaryCTA
              id={`cta-skip-wait-${screen.id}`}
              onClick={() =>
                onDispatchAction({
                  type: 'CONTINUE',
                  targetScreen: screen.nextScreen,
                })
              }
            >
              SALTAR ESPERA
            </SecondaryCTA>
          </div>
        </div>
      )}

      {screen.type === 'COMPLETION' && (
        <div className="w-full space-y-6">
          <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-emerald-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif italic font-bold text-white">
              {screen.content || 'Fase completada con éxito.'}
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Expediente actualizado y sincronizado.
            </p>
          </div>

          <PrimaryCTA
            id={`cta-complete-${screen.id}`}
            variant="accent"
            isLoading={isLoading}
            onClick={() =>
              onDispatchAction({
                type: 'COMPLETE',
              })
            }
          >
            FINALIZAR Y AVANZAR
          </PrimaryCTA>
        </div>
      )}

      {screen.type === 'VIDEO' && (
        <div className="w-full space-y-6">
          <div className="aspect-video w-full rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] flex flex-col items-center justify-center p-6 text-neutral-500 space-y-3">
            <Video className="w-10 h-10 text-orange-500/60" />
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              Video Player Placeholder
            </p>
            <p className="text-[11px] text-neutral-500">
              Audio: {audioEnabled ? 'Activado' : 'Silenciado'}
            </p>
          </div>

          <PrimaryCTA
            id={`cta-video-complete-${screen.id}`}
            variant="accent"
            onClick={() =>
              onDispatchAction({
                type: 'COMPLETE_VIDEO',
                targetScreen: screen.nextScreen,
              })
            }
          >
            COMPLETAR VIDEO Y CONTINUAR
          </PrimaryCTA>
        </div>
      )}

      {screen.type === 'AUDIO' && (
        <div className="w-full space-y-6">
          <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] flex flex-col items-center justify-center text-neutral-400 space-y-3">
            <Volume2 className="w-8 h-8 text-orange-500" />
            <p className="text-xs font-mono uppercase tracking-widest">
              Audio Stream Player
            </p>
          </div>

          <PrimaryCTA
            id={`cta-audio-complete-${screen.id}`}
            variant="accent"
            onClick={() =>
              onDispatchAction({
                type: 'COMPLETE_AUDIO',
                targetScreen: screen.nextScreen,
              })
            }
          >
            CONTINUAR
          </PrimaryCTA>
        </div>
      )}

      {screen.type === 'CHAT' && (
        <div className="w-full space-y-6">
          <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] flex items-center gap-3 text-left">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            <div>
              <p className="text-xs font-mono uppercase text-orange-400">Canal Interactivo</p>
              <p className="text-xs text-neutral-300">
                {screen.content || 'Módulo de conversación contextual.'}
              </p>
            </div>
          </div>

          <PrimaryCTA
            id={`cta-chat-next-${screen.id}`}
            variant="accent"
            onClick={() =>
              onDispatchAction({
                type: 'CONTINUE',
                targetScreen: screen.nextScreen,
              })
            }
          >
            CONTINUAR
          </PrimaryCTA>
        </div>
      )}

      {screen.type === 'TRANSITION' && (
        <div className="w-full space-y-6 py-6">
          <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] space-y-3">
            <FileSearch className="w-8 h-8 text-orange-500 mx-auto animate-pulse" />
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              {screen.content || 'Conectando variables del expediente...'}
            </p>
          </div>

          <PrimaryCTA
            id={`cta-transition-next-${screen.id}`}
            variant="accent"
            onClick={() =>
              onDispatchAction({
                type: 'CONTINUE',
                targetScreen: screen.nextScreen,
              })
            }
          >
            ENTRAR
          </PrimaryCTA>
        </div>
      )}
    </div>
  );
};
