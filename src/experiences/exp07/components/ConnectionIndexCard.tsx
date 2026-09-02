// Connection Index Card Component for EXP_07 (Screen 10)
// Authentic representation of the Micro-App Daily Connection Interface
import React from 'react';
import { EXP07_CONTENT } from '../exp07Content';
import { Compass, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const ConnectionIndexCard: React.FC = () => {
  const content = EXP07_CONTENT.screen10;

  const getIconForIndex = (index: number) => {
    switch (index) {
      case 0:
        return <Compass className="w-4 h-4 text-amber-400" />;
      case 1:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 2:
        return <HeartHandshake className="w-4 h-4 text-sky-400" />;
      case 3:
      default:
        return <ShieldCheck className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div
      id="connection-index-card"
      className="w-full max-w-md mx-auto rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-2xl p-6 relative overflow-hidden"
    >
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-amber-400/90 uppercase font-semibold">
            {content.title}
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
          HOY · ORIENTATIVO
        </span>
      </div>

      {/* 4 Pillars List */}
      <div className="space-y-3.5 mb-6">
        {content.items.map((item, idx) => (
          <div
            key={item.label}
            className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/70 hover:border-zinc-700 transition-colors flex items-start gap-3.5"
          >
            <div className="mt-0.5 p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/40 shrink-0">
              {getIconForIndex(idx)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-mono font-bold tracking-wider text-zinc-200 uppercase mb-1">
                {item.label}
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Core Principle Footer */}
      <div className="pt-4 border-t border-zinc-800/70 text-center">
        <p className="text-[11px] font-mono uppercase tracking-widest text-amber-400/80 font-medium">
          {content.principle}
        </p>
      </div>
    </div>
  );
};
