import React from 'react';
import { ArrowDown, HelpCircle, Compass } from 'lucide-react';

export const TheShiftSection: React.FC = () => {
  const beforeQuestions = [
    '«¿Qué hice mal?»',
    '«¿Por qué está así?»',
    '«¿Qué debería hacer?»',
    '«¿Será por mí?»',
  ];

  const afterQuestions = [
    '«¿Qué está pasando realmente?»',
    '«¿Qué información tengo?»',
    '«¿Qué información me falta?»',
    '«¿Cómo puedo acercarme mejor?»',
  ];

  return (
    <section
      id="section-11-el-cambio"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-4xl mx-auto border-b border-[#141414]"
    >
      <div className="text-center space-y-3 mb-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
          TRANSICIÓN DE PERSPECTIVA
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          El cambio en tu forma de procesar
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* BEFORE CARD */}
        <div className="rounded-2xl bg-[#090909] border border-[#1A1A1A] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500 font-bold tracking-widest uppercase">
                EL PATRÓN ANTERIOR
              </span>
              <HelpCircle className="w-4 h-4 text-neutral-600" />
            </div>
            <p className="text-xs text-neutral-500">
              Reacción inmediata desde la duda y la presión personal:
            </p>
            <div className="space-y-2.5 pt-2 font-serif italic text-sm text-neutral-400">
              {beforeQuestions.map((q, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#0E0E0E] border border-[#161616]">
                  {q}
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 border-t border-[#141414] pt-3">
            Incertidumbre &bull; Fricción reactiva
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="rounded-2xl bg-[#0D0D0D] border border-orange-500/30 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_0_30px_rgba(234,88,12,0.05)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-orange-400 font-bold tracking-widest uppercase">
                CON CONTEXTO™
              </span>
              <Compass className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-xs text-neutral-300">
              Observación lúcida y preguntas con criterio:
            </p>
            <div className="space-y-2.5 pt-2 font-serif italic text-sm text-neutral-200">
              {afterQuestions.map((q, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#141414] border border-[#222222] text-white">
                  {q}
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] font-mono text-orange-400/80 border-t border-[#1C1C1C] pt-3">
            Claridad &bull; Serenidad operativa
          </div>
        </div>
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-[#0A0A0A] border border-[#1E1E1E] text-center max-w-2xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">
          LA VERDADERA TRANSFORMACIÓN
        </p>
        <p className="text-sm sm:text-base text-neutral-200 font-serif leading-relaxed">
          De reaccionar automáticamente a <strong className="text-orange-400 font-bold">considerar antes de responder</strong>.
        </p>
      </div>
    </section>
  );
};
