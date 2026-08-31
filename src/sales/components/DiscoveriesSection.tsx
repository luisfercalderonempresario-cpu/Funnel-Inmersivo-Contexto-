import React from 'react';
import { Search, Lightbulb, Compass, AlertCircle } from 'lucide-react';

export const DiscoveriesSection: React.FC = () => {
  const findings = [
    {
      number: '01',
      title: 'HALLAZGO 01',
      text: 'No siempre reaccionas a lo que está pasando.',
      icon: Search,
      accent: 'text-amber-400',
    },
    {
      number: '02',
      title: 'HALLAZGO 02',
      text: 'A veces reaccionas a lo que crees que está pasando.',
      icon: Lightbulb,
      accent: 'text-orange-400',
    },
    {
      number: '03',
      title: 'HALLAZGO 03',
      text: 'Y cuando falta información, tomar una buena decisión se vuelve más difícil.',
      icon: AlertCircle,
      accent: 'text-rose-400',
    },
  ];

  return (
    <section
      id="section-02-descubriste"
      className="px-4 sm:px-6 py-16 sm:py-20 max-w-4xl mx-auto border-b border-[#141414]"
    >
      <div className="text-center space-y-3 mb-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
          RECONSTRUCCIÓN DE EVIDENCIA
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Lo que descubriste durante la investigación
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {findings.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.number}
              className="rounded-2xl bg-[#0A0A0A] border border-[#1C1C1C] p-6 flex flex-col justify-between space-y-4 hover:border-[#2C2C2C] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`font-bold tracking-widest ${item.accent}`}>
                    {item.title}
                  </span>
                  <Icon className={`w-4 h-4 ${item.accent}`} />
                </div>
                <p className="text-sm sm:text-base text-neutral-200 font-serif leading-relaxed italic">
                  «{item.text}»
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-[#0D0D0D] border border-[#1A1A1A] text-center max-w-xl mx-auto">
        <p className="text-sm sm:text-base text-neutral-300 font-body leading-relaxed">
          Por eso <strong className="text-white font-semibold">comprender</strong> puede empezar antes de que ocurra el conflicto.
        </p>
      </div>
    </section>
  );
};
