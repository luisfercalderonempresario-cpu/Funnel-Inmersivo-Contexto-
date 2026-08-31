import React from 'react';
import { Eye, ShieldCheck, Cpu } from 'lucide-react';
import { ProductVisualMockup } from './ProductVisualMockup';

interface WhatIsContextoSectionProps {
  caseId: string;
}

export const WhatIsContextoSection: React.FC<WhatIsContextoSectionProps> = ({ caseId }) => {
  return (
    <section
      id="section-04-que-es-contexto"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-4xl mx-auto border-b border-[#141414]"
    >
      <div className="text-center space-y-4 mb-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-orange-400 font-semibold">
          LA HERRAMIENTA
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          Por eso creamos Contexto™.
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed font-body">
          <strong>Contexto™</strong> es una Micro-App que te ayuda a considerar el momento del ciclo menstrual de tu pareja como una pieza adicional de información.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <ProductVisualMockup caseId={caseId} />
        </div>

        {/* Core Capabilities */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Observar, considerar y actuar con mayor contexto.
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-body">
              En lugar de adivinar qué pudo salir mal o reaccionar desde la sorpresa, cuentas con una referencia biológica y psicológica sobria antes de cada interacción relevante.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C]">
              <Eye className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-200">
                  Lectura del Momento
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Conoce en qué fase del ciclo puede encontrarse y qué variaciones de energía y receptividad suelen asociarse.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C]">
              <Cpu className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-200">
                  Sugerencias Reflexivas
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Recomendaciones discretas para ajustar expectativas, ritmo de conversación y nivel de demanda.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-200">
                  Total Privacidad
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Sin cuentas invasivas ni rastreo innecesario. Tu herramienta personal de criterio y empatía.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
