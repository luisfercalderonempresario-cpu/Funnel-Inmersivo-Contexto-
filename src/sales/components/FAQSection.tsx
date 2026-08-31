import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { eventTracker } from '../../engine/events/eventTracker';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-01',
    question: '¿Necesito saber mucho sobre el ciclo menstrual?',
    answer:
      'No. Contexto™ está diseñado para traducir información biológica relevante en lenguaje práctico, directo y aplicable en segundos.',
  },
  {
    id: 'faq-02',
    question: '¿Contexto™ predice cómo se sentirá?',
    answer:
      'No. El ciclo puede aportar contexto, pero cada mujer y cada ciclo son diferentes. No es un oráculo predictivo, sino un marco de comprensión.',
  },
  {
    id: 'faq-03',
    question: '¿Esto reemplaza hablar con mi pareja?',
    answer:
      'No. La conversación y la escucha activa siguen siendo fundamentales. Contexto™ te prepara para conversar con mejor tono y serenidad.',
  },
  {
    id: 'faq-04',
    question: '¿Tengo que estar pendiente todos los días?',
    answer:
      'No. Puedes consultar la Micro-App en menos de 20 segundos antes de conversaciones importantes, fines de semana o cuando percibas cambios sutiles en su interacción.',
  },
  {
    id: 'faq-05',
    question: '¿Funciona si su ciclo es irregular?',
    answer:
      'El sistema permite ajustar manualmente el inicio de cada fase. Aunque la variabilidad biológica natural existe, entender los principios hormonales sigue brindando herramientas valiosas.',
  },
  {
    id: 'faq-06',
    question: '¿Contexto™ sirve para controlar la relación?',
    answer:
      'No. Su propósito es exclusivamente ayudarte a comprender mejor el contexto y gestionar tu propia reacción, nunca manipular ni controlar a tu pareja.',
  },
  {
    id: 'faq-07',
    question: '¿Qué pasa si el ciclo no coincide exactamente con la predicción?',
    answer:
      'Es completamente normal que exista variabilidad. La información de Contexto™ debe entenderse como contexto orientativo para cultivar empatía, no como una certeza matemática.',
  },
];

interface FAQSectionProps {
  caseId: string;
  sessionId?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ caseId, sessionId }) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleFaq = (id: string, question: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (!isOpen) {
        // Track FAQ opening
        eventTracker.trackEvent('FAQ_OPENED', {
          caseId,
          sessionId: sessionId || 'anon-session',
          experience: 'sales_page',
          payload: { faqId: id, question },
        });
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  };

  return (
    <section
      id="faq"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-3xl mx-auto border-b border-[#141414]"
    >
      <div className="text-center space-y-3 mb-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
          CLARIDAD Y RESPUESTAS
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Preguntas Frecuentes
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq) => {
          const isOpen不易 = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all ${
                isOpen不易
                  ? 'bg-[#0E0E0E] border-[#2A2A2A]'
                  : 'bg-[#080808] border-[#181818] hover:border-[#222222]'
              }`}
            >
              <button
                type="button"
                id={`faq-btn-${faq.id}`}
                aria-expanded={isOpen不易}
                aria-controls={`faq-ans-${faq.id}`}
                onClick={() => toggleFaq(faq.id, faq.question)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500/40 rounded-2xl"
              >
                <span className="text-sm sm:text-base font-serif font-semibold text-neutral-200">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                    isOpen不易 ? 'rotate-180 text-orange-400' : ''
                  }`}
                />
              </button>

              {isOpen不易 && (
                <div
                  id={`faq-ans-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed font-body border-t border-[#161616] animate-fade-in"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
