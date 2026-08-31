import React from 'react';
import { XCircle, ShieldAlert } from 'lucide-react';

export const WhatItDoesNotDoSection: React.FC = () => {
  const boundaries = [
    'NO pretende leer su mente.',
    'NO predice exactamente cómo se sentirá.',
    'NO convierte el ciclo en una explicación automática o reduccionista de sus emociones.',
    'NO sustituye la comunicación directa.',
    'NO reemplaza el consentimiento, los límites ni la conversación honesta.',
    'NO garantiza que nunca volverán a tener desacuerdos o conflictos.',
  ];

  return (
    <section
      id="section-08-lo-que-no-hace"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-3xl mx-auto border-b border-[#141414]"
    >
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono tracking-widest uppercase">
          <ShieldAlert className="w-3.5 h-3.5" />
          LÍMITES ÉTICOS Y CIENTÍFICOS
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Contexto™ no pretende hacer esto.
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto font-body">
          La credibilidad de una herramienta radica en tener absoluta claridad sobre sus límites.
        </p>
      </div>

      <div className="rounded-2xl bg-[#0B0B0B] border border-[#1E1E1E] p-6 sm:p-8 space-y-4">
        <ul className="space-y-3.5">
          {boundaries.map((text, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300 font-body">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <div className="pt-6 border-t border-[#181818] text-center">
          <p className="text-base sm:text-lg font-serif italic text-white leading-relaxed">
            «Porque comprenderla mejor <br className="hidden sm:inline" />
            <strong className="text-orange-400 font-bold not-italic">no significa dejar de escucharla</strong>.»
          </p>
        </div>
      </div>
    </section>
  );
};
