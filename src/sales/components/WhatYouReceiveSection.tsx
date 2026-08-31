import React from 'react';
import { Check, Smartphone, Shield, Sparkles } from 'lucide-react';
import { PRODUCT_CONFIG } from '../../config/productConfig';

export const WhatYouReceiveSection: React.FC = () => {
  return (
    <section
      id="section-06-que-recibes"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-4xl mx-auto border-b border-[#141414]"
    >
      <div className="text-center space-y-3 mb-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
          ENTREGABLES CONCRETOS
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Qué recibes con tu acceso a Contexto™
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto font-body">
          Herramientas diseñadas para uso directo en segundos, sin fricción técnica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRODUCT_CONFIG.features.map((feature) => (
          <div
            key={feature.id}
            className="rounded-2xl bg-[#0A0A0A] border border-[#1C1C1C] p-5 flex items-start gap-4 hover:border-[#2C2C2C] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-orange-600/10 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-orange-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white font-serif">
                  {feature.title}
                </h3>
                {feature.tag && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#161616] text-neutral-400 border border-[#222222]">
                    {feature.tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-body">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-[#080808] border border-[#181818] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-neutral-500" />
          <span>Acceso inmediato desde cualquier navegador web y móvil</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-neutral-500" />
          <span>Sin instalaciones complejas ni almacenamiento de terceros</span>
        </div>
      </div>
    </section>
  );
};
