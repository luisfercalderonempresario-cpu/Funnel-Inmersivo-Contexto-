import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { PRODUCT_CONFIG } from '../../config/productConfig';

export const RiskReductionSection: React.FC = () => {
  const guarantee = PRODUCT_CONFIG.guarantee;

  return (
    <section
      id="section-13-seguridad"
      className="px-4 sm:px-6 py-12 sm:py-16 max-w-3xl mx-auto border-b border-[#141414]"
    >
      <div className="rounded-2xl bg-[#080808] border border-[#1A1A1A] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-orange-400" />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-base font-serif font-bold text-white">
              {guarantee?.title || 'Garantía de Contexto™ — 7 días'}
            </h3>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#141414] text-emerald-400 border border-emerald-500/30 uppercase">
              {guarantee?.days || 7} DÍAS
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed font-body">
            {PRODUCT_CONFIG.paymentPlatformDescription} Cuentas con 7 días de garantía completa para explorar tu acceso a Contexto™ con total tranquilidad.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-[10px] font-mono text-neutral-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-neutral-400" />
              Pasarela Hotmart
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-neutral-400" />
              Acceso Inmediato
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
