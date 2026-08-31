import React from 'react';
import { ArrowDown, CheckCircle2 } from 'lucide-react';
import { CaseId } from '../../components/ui/CaseId';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';

interface HeroSectionProps {
  caseId: string;
  onScrollToOffer: () => void;
  onCtaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  caseId,
  onScrollToOffer,
  onCtaClick,
}) => {
  return (
    <section
      id="section-01-informe-final"
      className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-24 border-b border-[#141414]"
    >
      <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
        {/* Top Confidential Status Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111111] border border-[#222222] text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            INVESTIGACIÓN COMPLETADA
          </span>
          <span className="text-neutral-600">&bull;</span>
          <CaseId code={caseId} />
        </div>

        {/* Section Main Title */}
        <div className="space-y-3">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-orange-400 font-semibold">
            INFORME FINAL DEL CASO
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Llegaste hasta aquí <br className="hidden sm:inline" />
            buscando una respuesta.
          </h1>
        </div>

        {/* Sequential Revealing Copy */}
        <div className="space-y-6 max-w-lg mx-auto text-neutral-300 font-body text-base sm:text-lg leading-relaxed">
          <p className="text-neutral-400">
            Y durante este recorrido encontraste algo más importante.
          </p>

          <div className="py-4">
            <span className="inline-block text-4xl sm:text-6xl font-serif italic font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-500 tracking-wider">
              CONTEXTO.
            </span>
          </div>

          <p className="text-sm sm:text-base text-neutral-300">
            Ahora sabes por qué puede cambiar la manera en que llegas a ciertas situaciones con ella.
          </p>
        </div>

        {/* Early CTA Button (Smooth scroll to offer) */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <PrimaryCTA
            id="hero-cta-scroll-offer"
            onClick={onScrollToOffer}
            variant="accent"
            className="w-full sm:w-auto"
          >
            QUIERO CONTEXTO™
          </PrimaryCTA>
        </div>

        {/* Scroll indicator prompt */}
        <div className="pt-8">
          <button
            type="button"
            onClick={onScrollToOffer}
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors uppercase tracking-widest cursor-pointer"
          >
            <span>LEER EL INFORME COMPLETO</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
