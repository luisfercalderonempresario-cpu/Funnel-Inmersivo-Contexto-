import React from 'react';
import { CheckCircle } from 'lucide-react';

export const WhoItIsForSection: React.FC = () => {
  const points = [
    'Quieres comprender mejor a tu pareja y sus ritmos.',
    'Quieres dejar de reaccionar automáticamente desde la defensiva.',
    'Te gustaría tener más información antes de interpretar una situación.',
    'Quieres convertir la empatía en algo práctico y aplicable en el día a día.',
    'Quieres construir una relación más consciente, sólida y respetuosa.',
  ];

  return (
    <section
      id="section-09-para-quien-es"
      className="px-4 sm:px-6 py-16 sm:py-20 max-w-3xl mx-auto border-b border-[#141414]"
    >
      <div className="space-y-3 mb-8 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-semibold">
          PERFIL ADECUADO
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Contexto™ es para ti si...
        </h2>
      </div>

      <div className="rounded-2xl bg-[#090909] border border-[#1C1C1C] p-6 sm:p-8 space-y-4">
        <ul className="space-y-4">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-3.5 text-xs sm:text-sm text-neutral-200 font-body">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
