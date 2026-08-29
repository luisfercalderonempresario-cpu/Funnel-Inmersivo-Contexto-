import React from 'react';
import { ShoppingBag, CheckCircle, ArrowLeft } from 'lucide-react';
import { CaseId } from '../ui/CaseId';
import { PrimaryCTA } from '../ui/PrimaryCTA';
import { SecondaryCTA } from '../ui/SecondaryCTA';

interface SalesPagePlaceholderProps {
  caseId: string;
  onReturnToFunnel: () => void;
  onCheckout: () => void;
}

export const SalesPagePlaceholder: React.FC<SalesPagePlaceholderProps> = ({
  caseId,
  onReturnToFunnel,
  onCheckout,
}) => {
  return (
    <div
      id="sales-page-placeholder-view"
      className="flex flex-col items-center justify-center text-center space-y-8 w-full max-w-lg mx-auto py-8"
    >
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-mono tracking-widest uppercase">
          <CheckCircle className="w-3.5 h-3.5" />
          Expediente Completo
        </div>
        <p className="text-xs text-neutral-500 font-mono tracking-widest uppercase">
          DESTINO FINAL
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif italic font-bold text-white tracking-wide">
          Contexto™ &bull; Propuesta
        </h1>
        <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
          Módulo de presentación comercial y oferta de Contexto™. (Placeholder de Foundation).
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] w-full backdrop-blur-sm space-y-3 text-left">
        <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-[#1A1A1A] pb-2">
          <span>Expediente Asociado:</span>
          <CaseId code={caseId} />
        </div>
        <div className="text-xs text-neutral-400 font-mono space-y-1">
          <p>&bull; Diagnóstico de Andrés: Concluido</p>
          <p>&bull; 8 Fases de investigación: 100% Desbloqueadas</p>
          <p>&bull; Estado de la Sales Page: Módulo Placeholder Conectado</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full pt-2 justify-center">
        <PrimaryCTA id="sales-page-checkout-btn" onClick={onCheckout} variant="accent">
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            SIMULAR CHECKOUT
          </span>
        </PrimaryCTA>
        <SecondaryCTA id="sales-page-back-btn" onClick={onReturnToFunnel}>
          <span className="flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            REVISAR EXPEDIENTE
          </span>
        </SecondaryCTA>
      </div>
    </div>
  );
};
