import React from 'react';
import { HeartCrack, Layers } from 'lucide-react';

export const RealProblemSection: React.FC = () => {
  return (
    <section
      id="section-03-problema-real"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-3xl mx-auto text-center border-b border-[#141414]"
    >
      <div className="space-y-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
          DIAGNÓSTICO CENTRAL
        </p>

        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-snug">
          Tu problema quizá nunca fue <br className="hidden sm:inline" />
          no saber amar.
        </h2>

        <p className="text-base sm:text-lg text-neutral-400 font-body max-w-xl mx-auto leading-relaxed">
          En muchas situaciones, el problema era intentar hacerlo bien sin tener toda la información disponible.
        </p>

        {/* High Impact Conceptual Statement */}
        <div className="my-8 py-8 px-6 rounded-2xl bg-gradient-to-b from-[#111111] to-[#080808] border border-[#222222] space-y-4 shadow-xl">
          <div className="flex justify-center items-center gap-3 text-neutral-500 text-xs font-mono">
            <span className="line-through text-neutral-500">HIPÓTESIS TRADICIONAL</span>
            <span className="text-orange-400">&rarr;</span>
            <span className="text-orange-400 font-bold">REALIDAD OPERATIVA</span>
          </div>

          <div className="space-y-2">
            <p className="text-lg sm:text-2xl font-mono uppercase tracking-widest text-neutral-400">
              NO ES FALTA DE AMOR.
            </p>
            <p className="text-2xl sm:text-4xl font-serif italic font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 tracking-wide">
              ES FALTA DE CONTEXTO.
            </p>
          </div>

          <p className="text-xs text-neutral-500 max-w-md mx-auto pt-2">
            *Un factor biológico no determina el 100% de la conducta, pero ignorarlo incrementa exponencialmente los malentendidos en la interacción cotidiana.
          </p>
        </div>
      </div>
    </section>
  );
};
