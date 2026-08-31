import React from 'react';
import { Ban } from 'lucide-react';

export const WhoItIsNotForSection: React.FC = () => {
  const points = [
    'Buscas una fórmula mágica o técnica para manipular a tu pareja.',
    'Quieres predecir de forma rígida o matemática cómo se comportará.',
    'Buscas justificar cualquier conducta o desatención atribuyéndola exclusivamente al ciclo.',
    'Quieres evitar hablar o tener conversaciones honestas con ella.',
    'Quieres una herramienta que piense o tome decisiones por ti.',
  ];

  return (
    <section
      id="section-10-para-quien-no-es"
      className="px-4 sm:px-6 py-16 sm:py-20 max-w-3xl mx-auto border-b border-[#141414]"
    >
      <div className="space-y-3 mb-8 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
          FILTRO DE INTEGRIDAD
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Contexto™ no es para ti si...
        </h2>
      </div>

      <div className="rounded-2xl bg-[#090909] border border-[#1C1C1C] p-6 sm:p-8 space-y-6">
        <ul className="space-y-4">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-3.5 text-xs sm:text-sm text-neutral-400 font-body">
              <Ban className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="pt-6 border-t border-[#181818] text-center">
          <p className="text-sm sm:text-base text-neutral-300 font-serif italic">
            «Contexto™ no reemplaza tu criterio. <strong className="text-white not-italic font-semibold">Lo complementa.</strong>»
          </p>
        </div>
      </div>
    </section>
  );
};
