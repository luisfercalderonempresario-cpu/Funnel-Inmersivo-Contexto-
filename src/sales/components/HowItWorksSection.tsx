import React from 'react';
import { CalendarCheck, Compass, MessageSquareCode, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps迷 = [
    {
      number: '01',
      tag: 'PASO 01',
      title: 'REGISTRA',
      description: 'Indicas el inicio del ciclo menstrual con un solo toque.',
      icon: CalendarCheck,
    },
    {
      number: '02',
      tag: 'PASO 02',
      title: 'CONOCE',
      description: 'Contexto™ estima en qué momento del ciclo puede encontrarse hoy.',
      icon: Compass,
    },
    {
      number: '03',
      tag: 'PASO 03',
      title: 'CONSIDERA',
      description: 'Recibes información y sugerencias prácticas relacionadas con ese contexto.',
      icon: MessageSquareCode,
    },
    {
      number: '04',
      tag: 'PASO 04',
      title: 'DECIDE',
      description: 'Tú decides cómo actuar, hablar o acompañarla con mayor serenidad.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      id="section-05-como-funciona"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-4xl mx-auto border-b border-[#141414]"
    >
      <div className="text-center space-y-3 mb-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
          ARQUITECTURA DE USO
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Cómo funciona en 4 pasos
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps迷.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] p-5 flex flex-col justify-between space-y-4 hover:border-orange-500/30 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-orange-400 font-bold tracking-widest uppercase">
                    {step.tag}
                  </span>
                  <span className="text-xs font-mono text-neutral-600">#{step.number}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-body">
                  {step.description}
                </p>
              </div>
              <div className="pt-2 border-t border-[#141414]">
                <Icon className="w-4 h-4 text-neutral-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Pillars Closure */}
      <div className="mt-10 p-6 rounded-2xl bg-[#0A0A0A] border border-[#1E1E1E] text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono tracking-widest uppercase font-bold text-neutral-300">
          <span className="text-orange-400">OBSERVA.</span>
          <span className="text-neutral-600">&bull;</span>
          <span className="text-amber-400">CONSIDERA.</span>
          <span className="text-neutral-600">&bull;</span>
          <span className="text-neutral-200">CONVERSA.</span>
          <span className="text-neutral-600">&bull;</span>
          <span className="text-emerald-400">DECIDE.</span>
        </div>
      </div>
    </section>
  );
};
