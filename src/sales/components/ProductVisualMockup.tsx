import React from 'react';
import { Calendar, Sparkles, Activity, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

interface ProductVisualMockupProps {
  caseId?: string;
}

export const ProductVisualMockup: React.FC<ProductVisualMockupProps> = ({ caseId }) => {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-[2.5rem] p-3 bg-gradient-to-b from-[#222222] via-[#121212] to-[#0A0A0A] border border-[#2A2A2A] shadow-[0_25px_60px_rgba(0,0,0,0.8)] select-none">
      {/* Phone Frame Outer Bezel */}
      <div className="relative rounded-[2rem] bg-[#080808] border border-[#1A1A1A] p-5 overflow-hidden text-left space-y-4">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 border-b border-[#141414] pb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
            <span className="tracking-widest uppercase font-semibold text-neutral-400">Contexto™</span>
          </div>
          <span className="text-[9px] text-neutral-600 font-mono">
            {caseId ? `#${caseId.slice(-4)}` : 'ACTIVO'}
          </span>
        </div>

        {/* Phase Indicator Card */}
        <div className="rounded-xl bg-[#0F0F0F] border border-[#1E1E1E] p-3.5 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-orange-400" />
              ESTIMACIÓN DE FASE
            </span>
            <span className="text-orange-400 font-semibold uppercase">Día 19 &bull; Lútea</span>
          </div>
          <p className="text-xs text-neutral-200 font-serif italic">
            «Mayor sensibilidad a sobrecargas y necesidad de claridad directa.»
          </p>
        </div>

        {/* Connection Index Gauge */}
        <div className="rounded-xl bg-[#0D0D0D] border border-[#1A1A1A] p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-amber-400" />
              ÍNDICE DE CONEXIÓN™
            </span>
            <span className="text-neutral-300 font-bold">RECEPTIVA CON ESPACIO</span>
          </div>
          <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full w-[68%] rounded-full" />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-neutral-600 uppercase">
            <span>Introversión</span>
            <span>Equilibrio</span>
            <span>Apertura</span>
          </div>
        </div>

        {/* Daily Guidance Micro-Action */}
        <div className="rounded-xl bg-[#0F0F0F] border border-[#1E1E1E] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-orange-400">
            <Compass className="w-3 h-3" />
            <span className="uppercase font-semibold">Sugerencia de Contacto</span>
          </div>
          <p className="text-[11px] text-neutral-300 leading-relaxed">
            Prioriza preguntas concretas y libres de demanda emocional. Valida antes de sugerir soluciones.
          </p>
        </div>

        {/* Bottom Micro Footer */}
        <div className="pt-1 flex items-center justify-between text-[9px] font-mono text-neutral-600 border-t border-[#141414]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 text-neutral-500" />
            Privado &bull; Local
          </span>
          <span className="italic text-neutral-500 font-serif">Observa &bull; Considera &bull; Decide</span>
        </div>
      </div>
    </div>
  );
};
