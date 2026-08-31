import React from 'react';
import { Smartphone, Sparkles, CornerDownRight } from 'lucide-react';

export const OneDayScenarioSection: React.FC = () => {
  return (
    <section
      id="section-07-un-dia-con-contexto"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-3xl mx-auto border-b border-[#141414]"
    >
      <div className="text-center space-y-3 mb-10">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
          EXPERIENCIA COTIDIANA
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          Imagina abrir Contexto™ <br className="hidden sm:inline" />
          antes de escribirle.
        </h2>
      </div>

      {/* Cinematic Simulation Card */}
      <div className="rounded-3xl bg-[#090909] border border-[#1F1F1F] p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
          <Smartphone className="w-3.5 h-3.5" />
          <span>ESCENARIO HABITUAL &bull; 19:45 HS</span>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-body leading-relaxed">
          <p className="p-4 rounded-xl bg-[#121212] border border-[#1E1E1E] text-neutral-200 font-mono text-xs sm:text-sm">
            «Hoy su ciclo puede estar entrando en una etapa de mayor sobrecarga cognitiva y menor tolerancia al ruido.»
          </p>

          <div className="space-y-3 pt-2 text-neutral-400">
            <p className="flex items-center gap-2 text-neutral-300">
              <CornerDownRight className="w-4 h-4 text-orange-400 shrink-0" />
              <span>En lugar de asumir que algo está mal entre ustedes...</span>
            </p>
            <div className="pl-6 space-y-2 font-serif italic text-base sm:text-lg text-neutral-200">
              <p>Puedes detenerte.</p>
              <p>Mirar.</p>
              <p>Considerar.</p>
              <p className="text-orange-400 font-bold">Y después decidir cómo acercarte.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#161616] text-xs text-neutral-500 font-mono">
          *El ciclo no determina cómo responderá, pero te da una perspectiva con mayor serenidad antes de iniciar cualquier conversación sensible.
        </div>
      </div>
    </section>
  );
};
