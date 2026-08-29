import React from 'react';

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Sincronizando expediente...',
  subtext = 'Accediendo a la base de datos de contexto',
}) => {
  return (
    <div
      id="funnel-loading-screen"
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white px-6"
    >
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
        {/* Geometric radar spinner with orange glow */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-ping" />
          <div className="w-12 h-12 rounded-full border border-[#1A1A1A] border-t-orange-500 animate-spin" />
          <div className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_10px_#ea580c]" />
        </div>

        <div className="space-y-1.5">
          <p className="font-mono text-xs text-orange-500 tracking-widest uppercase font-medium">
            {message}
          </p>
          <p className="text-xs text-neutral-500 font-mono">
            {subtext}
          </p>
        </div>
      </div>
    </div>
  );
};
