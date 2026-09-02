import React from 'react';
import { ShieldCheck, Info, X, ExternalLink, ArrowRight } from 'lucide-react';
import { PRODUCT_CONFIG } from '../../config/productConfig';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  isConfigured: boolean;
  onProceedAnyway?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  caseId,
  isConfigured,
  onProceedAnyway,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#0C0C0C] border border-[#262626] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-left space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-500 hover:text-white hover:bg-neutral-800/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-mono tracking-widest uppercase">
            <ShieldCheck className="w-3 h-3" />
            <span>SOLICITUD DE ACCESO &bull; EXPEDIENTE #{caseId.slice(-6)}</span>
          </div>
          <h3 id="checkout-modal-title" className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {isConfigured ? 'Redirigiendo a Pasarela Segura' : 'Pasarela en Configuración'}
          </h3>
        </div>

        {/* Modal Body */}
        {isConfigured ? (
          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed font-body">
            <p>
              Estás a punto de ser redirigido a la pasarela oficial de <strong>Hotmart</strong> para completar el acceso a <strong>{PRODUCT_CONFIG.name}</strong> ({PRODUCT_CONFIG.formattedPrice}).
            </p>
            <p className="text-xs text-neutral-400">
              Incluye el Manual de uso de Contexto™ (PDF con instrucciones de acceso) y {PRODUCT_CONFIG.guarantee.days} días de garantía.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onProceedAnyway}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] cursor-pointer"
              >
                <span>CONTINUAR A HOTMART</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed font-body">
            <div className="p-3.5 rounded-xl bg-[#141414] border border-[#222222] flex gap-3 items-start">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-400 leading-relaxed">
                El enlace oficial de la pasarela de pagos de Hotmart está pendiente de inicialización en este entorno.
              </p>
            </div>
            <p className="text-xs text-neutral-400">
              Tu intención de compra y tu expediente <strong className="text-neutral-300">#{caseId}</strong> han quedado registrados exitosamente en el sistema de telemetría.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-6 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                ENTENDIDO &bull; VOLVER AL INFORME
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
