import React from 'react';

interface ExperienceContainerProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  isImmersive?: boolean;
}

export const ExperienceContainer: React.FC<ExperienceContainerProps> = ({
  children,
  className = '',
  isLoading = false,
  isImmersive = false,
}) => {
  return (
    <main
      id="funnel-experience-container"
      className={`relative w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-6 ${
        isImmersive ? 'min-h-[100dvh]' : 'min-h-[calc(100dvh-130px)] safe-area-bottom'
      } ${className}`}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
            Cargando experiencia...
          </p>
        </div>
      ) : (
        children
      )}
    </main>
  );
};
