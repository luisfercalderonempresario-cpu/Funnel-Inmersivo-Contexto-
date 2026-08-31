import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';
import { CaseId } from '../../components/ui/CaseId';

interface FinalDecisionSectionProps {
  caseId: string;
  onPurchase: () => void;
  isLoading?: boolean;
}

export const FinalDecisionSection: React.FC<FinalDecisionSectionProps> = ({
  caseId,
  onPurchase,
  isLoading = false,
}) => {
  return (
    <section
      id="decision-final"
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-24 sm:py-32"
    >
      <div className="w-full max-w-xl mx-auto space-y-12 animate-fade-in">
        {/* Subtle Case Tag */}
        <div className="flex justify-center">
          <CaseId code={caseId} />
        </div>

        {/* Closing Narrative */}
        <div className="space-y-4">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 font-semibold">
            CONCLUSIÓN DEL CASO
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Ya terminaste la investigación.
          </h2>
        </div>

        <p className="text-sm font-mono uppercase tracking-widest text-orange-400 font-semibold">
          Ahora tienes dos opciones:
        </p>

        {/* 2 Options Card */}
        <div className="space-y-4 text-left max-w-lg mx-auto">
          <div className="p-5 rounded-2xl bg-[#090909] border border-[#1C1C1C] space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              OPCIÓN 01
            </span>
            <p className="text-sm sm:text-base text-neutral-300 font-serif">
              Seguir reaccionando con la información disponible hasta ahora.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-orange-500/40 space-y-1 shadow-[0_0_20px_rgba(234,88,12,0.1)]">
            <span className="text-[10px] font-mono uppercase text-orange-400 font-bold tracking-wider">
              OPCIÓN 02
            </span>
            <p className="text-sm sm:text-base text-white font-serif font-semibold">
              Empezar a considerar más contexto antes de reaccionar.
            </p>
          </div>
        </div>

        {/* Reflection */}
        <div className="space-y-3 max-w-md mx-auto text-neutral-300 font-body text-sm sm:text-base leading-relaxed">
          <p className="text-neutral-400">
            Contexto™ no puede decidir por ti.
          </p>
          <p className="text-white font-serif italic text-lg">
            Pero puede ayudarte a mirar antes de responder.
          </p>
        </div>

        {/* Question & Final CTA */}
        <div className="pt-6 space-y-6">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            ¿QUIERES CONTEXTO™?
          </h3>

          <div className="flex justify-center">
            <PrimaryCTA
              id="final-decision-purchase-cta"
              onClick={onPurchase}
              isLoading={isLoading}
              variant="accent"
              className="w-full sm:w-auto text-sm sm:text-base py-4 px-10"
            >
              QUIERO CONTEXTO™
            </PrimaryCTA>
          </div>
        </div>
      </div>
    </section>
  );
};
