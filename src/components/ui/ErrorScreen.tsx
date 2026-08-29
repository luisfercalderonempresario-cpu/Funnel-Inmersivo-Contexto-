import React from 'react';
import { AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';
import { PrimaryCTA } from './PrimaryCTA';
import { SecondaryCTA } from './SecondaryCTA';

interface ErrorScreenProps {
  onRetry?: () => void;
  onContinue?: () => void;
  title?: string;
  description?: string;
  caseId?: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  onRetry,
  onContinue,
  title = 'INTERRUPCIÓN DE SEÑAL',
  description = 'Se detectó una discrepancia momentánea en la sincronización del expediente. Los datos de la sesión se encuentran a salvo.',
  caseId,
}) => {
  return (
    <div
      id="funnel-error-screen"
      role="alert"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white p-6"
    >
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] backdrop-blur-md shadow-2xl text-center space-y-6">
        <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-500">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          {caseId && (
            <p className="font-mono text-[11px] text-neutral-500 tracking-wider">
              {caseId}
            </p>
          )}
          <h2 className="font-serif italic text-2xl font-bold text-white tracking-wide">
            {title}
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto font-body">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          {onRetry && (
            <PrimaryCTA id="error-retry-btn" onClick={onRetry} variant="accent">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" />
                REINTENTAR
              </span>
            </PrimaryCTA>
          )}
          {onContinue && (
            <SecondaryCTA id="error-continue-btn" onClick={onContinue}>
              <span className="flex items-center gap-2">
                CONTINUAR
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </SecondaryCTA>
          )}
        </div>
      </div>
    </div>
  );
};
