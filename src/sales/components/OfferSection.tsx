import React from 'react';
import { ShoppingBag, ShieldCheck, Zap, Sparkles, Check } from 'lucide-react';
import { PRODUCT_CONFIG } from '../../config/productConfig';
import { PrimaryCTA } from '../../components/ui/PrimaryCTA';

interface OfferSectionProps {
  caseId: string;
  onPurchase: () => void;
  isLoading?: boolean;
}

export const OfferSection: React.FC<OfferSectionProps> = ({
  caseId,
  onPurchase,
  isLoading = false,
}) => {
  const hasPrice = PRODUCT_CONFIG.price !== null;

  return (
    <section
      id="oferta"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-3xl mx-auto border-b border-[#141414]"
    >
      <div className="text-center space-y-3 mb-10">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-orange-400 font-semibold">
          PROPUESTA DE ACCESO
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          Lleva Contexto™ contigo.
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto font-body">
          La herramienta que convierte el conocimiento del ciclo en una experiencia práctica para tu relación.
        </p>
      </div>

      {/* Main Pricing Offer Box */}
      <div className="rounded-3xl bg-gradient-to-b from-[#111111] via-[#0A0A0A] to-[#070707] border border-[#262626] p-6 sm:p-10 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Product Spec Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#1C1C1C]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-mono uppercase tracking-widest border border-orange-500/20 mb-2">
              <Sparkles className="w-3 h-3" />
              Micro-App Digital
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">
              {PRODUCT_CONFIG.name}
            </h3>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Expediente #{caseId} &bull; Acceso Inmediato
            </p>
          </div>

          <div className="text-left sm:text-right">
            {hasPrice ? (
              <div>
                <p className="text-xs font-mono uppercase text-neutral-500">Inversión Única</p>
                <p className="text-3xl font-serif font-bold text-white">
                  {PRODUCT_CONFIG.formattedPrice || `${PRODUCT_CONFIG.currency || 'USD'} $${PRODUCT_CONFIG.price}`}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] font-mono uppercase text-orange-400 font-bold tracking-wider">
                  Acceso Especial
                </p>
                <p className="text-xs font-mono text-neutral-400">
                  Licencia Digital
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Feature Summary Checklist */}
        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
            INCLUYE ACCESO A:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 font-body">
            {PRODUCT_CONFIG.features.map((f) => (
              <div key={f.id} className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>{f.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Purchase CTA */}
        <div className="space-y-4 pt-4 text-center">
          <PrimaryCTA
            id="offer-purchase-cta"
            onClick={onPurchase}
            isLoading={isLoading}
            variant="accent"
            className="w-full text-sm sm:text-base py-4"
          >
            QUIERO CONTEXTO™
          </PrimaryCTA>

          <p className="text-[11px] font-mono text-neutral-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Procesamiento de orden protegido &bull; Sin cobros ocultos</span>
          </p>
        </div>
      </div>
    </section>
  );
};
