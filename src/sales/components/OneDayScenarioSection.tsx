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

        <div className="space-y-6 text-sm sm:text-base text-neutral-300 font-body leading-relaxed">
          {/* Situation Dialog */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-[#1E1E1E] text-neutral-200 space-y-3">
            <p className="font-serif italic text-base sm:text-lg text-white">
              «Le escribes: “¿Ya llegaste?”»
            </p>
            <p className="font-serif italic text-base sm:text-lg text-neutral-300">
              Ella responde: “Sí.”
            </p>
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Nada más.
            </p>
            <div className="pt-2 border-t border-[#1C1C1C] space-y-1 text-xs sm:text-sm text-neutral-400 font-mono">
              <p className="text-neutral-400">Y tú empiezas a pensar:</p>
              <p className="text-neutral-300">“¿Está molesta conmigo?”</p>
              <p className="text-neutral-300">“¿Hice algo?”</p>
              <p className="text-neutral-300">“¿Por qué está tan seca?”</p>
            </div>
          </div>

          <div className="space-y-2 text-neutral-300">
            <p className="font-medium text-white">
              Entonces abres Contexto™.
            </p>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Y en lugar de encontrar una explicación definitiva sobre ella, encuentras algo como:
            </p>
          </div>

          {/* Micro-App Contexto Real Snippet */}
          <div className="rounded-2xl bg-[#0F0F0F] border border-orange-500/30 p-5 sm:p-6 space-y-3 shadow-[0_0_30px_rgba(234,88,12,0.06)] relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-orange-400 font-semibold">
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>CONTEXTO DE HOY</span>
              </div>
              <span className="text-[9px] font-mono text-neutral-500 uppercase px-2 py-0.5 rounded bg-[#161616] border border-[#222222]">
                MICRO-APP
              </span>
            </div>
            <div className="space-y-3 text-neutral-200 text-sm sm:text-base font-serif leading-relaxed italic">
              <p className="text-white">
                “Por el momento del ciclo en el que podría encontrarse, hoy puede ser un día en el que necesite un poco más de calma y menos presión.
              </p>
              <p className="text-neutral-300">
                Eso no significa que esté molesta contigo.
              </p>
              <p className="text-orange-300/90 not-italic font-sans text-xs sm:text-sm font-medium">
                Solo es una razón más para no sacar conclusiones demasiado rápido.”
              </p>
            </div>
          </div>

          {/* Psychological Shift & Resolution */}
          <div className="space-y-4 pt-1 text-neutral-300 text-sm sm:text-base">
            <div className="space-y-2">
              <p className="text-white font-medium">Y ahí cambia algo.</p>
              <p className="text-neutral-400 text-xs sm:text-sm">
                No sabes exactamente qué le pasa. Pero ahora tienes más información antes de reaccionar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1A1A1A] text-xs font-mono space-y-1">
                <span className="text-[10px] uppercase text-neutral-500">En lugar de pensar:</span>
                <p className="text-neutral-400 line-through">“Seguro está molesta conmigo.”</p>
              </div>
              <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/20 text-xs font-mono space-y-1">
                <span className="text-[10px] uppercase text-orange-400 font-semibold">Puedes pensar:</span>
                <p className="text-neutral-200">“Puede que simplemente necesite estar tranquila. Mejor le pregunto cómo está antes de imaginarme lo peor.”</p>
              </div>
            </div>

            <div className="space-y-3 pt-3 text-neutral-400">
              <p className="flex items-center gap-2 text-neutral-300">
                <CornerDownRight className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Entonces puedes:</span>
              </p>
              <div className="pl-6 space-y-1.5 font-serif italic text-base sm:text-lg text-neutral-200">
                <p>Detenerte.</p>
                <p>Mirar.</p>
                <p>Considerar.</p>
                <p className="text-orange-400 font-bold">Y después decidir cómo acercarte.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#161616] text-xs text-neutral-500 font-mono">
          *El ciclo no determina cómo responderá, pero puede darte una perspectiva adicional para no interpretar demasiado rápido y acercarte con mayor serenidad.
        </div>
      </div>
    </section>
  );
};
