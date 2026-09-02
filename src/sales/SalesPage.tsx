import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useFunnel } from '../engine/state/FunnelContext';
import { eventTracker } from '../engine/events/eventTracker';
import { purchaseService, CheckoutResult } from '../services/purchaseService';
import { PRODUCT_CONFIG } from '../config/productConfig';

// 15 Sections Subcomponents
import { HeroSection } from './components/HeroSection';
import { DiscoveriesSection } from './components/DiscoveriesSection';
import { RealProblemSection } from './components/RealProblemSection';
import { WhatIsContextoSection } from './components/WhatIsContextoSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WhatYouReceiveSection } from './components/WhatYouReceiveSection';
import { OneDayScenarioSection } from './components/OneDayScenarioSection';
import { WhatItDoesNotDoSection } from './components/WhatItDoesNotDoSection';
import { WhoItIsForSection } from './components/WhoItIsForSection';
import { WhoItIsNotForSection } from './components/WhoItIsNotForSection';
import { TheShiftSection } from './components/TheShiftSection';
import { OfferSection } from './components/OfferSection';
import { RiskReductionSection } from './components/RiskReductionSection';
import { FAQSection } from './components/FAQSection';
import { FinalDecisionSection } from './components/FinalDecisionSection';
import { CheckoutModal } from './components/CheckoutModal';

interface SalesPageProps {
  onReturnToFunnel?: () => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onReturnToFunnel }) => {
  const { state, updateState, goToExperience } = useFunnel();
  const caseId = state.session.caseId || 'CASE-001';
  const sessionId = state.session.sessionId;
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [checkoutModalStatus, setCheckoutModalStatus] = useState<{
    isConfigured: boolean;
    url?: string;
  }>({
    isConfigured: false,
  });

  const hasTrackedPageView = useRef<boolean>(false);

  // Initial mount: update conversionState and track SALES_PAGE_VIEWED
  useEffect(() => {
    if (!hasTrackedPageView.current) {
      hasTrackedPageView.current = true;

      // Update FunnelState conversion metrics
      updateState((prev) => ({
        ...prev,
        conversion: {
          ...prev.conversion,
          salesPageViewed: true,
          lastViewedSection: 'hero',
        },
      }));

      // Track event
      eventTracker.trackEvent('SALES_PAGE_VIEWED', {
        caseId,
        sessionId,
        experience: 'sales_page',
        payload: {
          completedCount: state.progress.completedExperiences.length,
          hasRevelationCompleted: state.revelation.completed,
        },
      });
    }
  }, [caseId, sessionId, updateState, state.progress.completedExperiences.length, state.revelation.completed]);

  // Track sections on scroll via IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            eventTracker.trackEvent('SALES_SECTION_VIEWED', {
              caseId,
              sessionId,
              experience: 'sales_page',
              payload: { sectionId },
            });

            if (sectionId === 'section-04-que-es-contexto') {
              eventTracker.trackEvent('PRODUCT_VIEWED', {
                caseId,
                sessionId,
                experience: 'sales_page',
              });
            }

            if (sectionId === 'oferta' || sectionId === 'decision-final') {
              eventTracker.trackEvent('PURCHASE_CTA_VIEWED', {
                caseId,
                sessionId,
                experience: 'sales_page',
                payload: { sectionId },
              });
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      observer.disconnect();
    };
  }, [caseId, sessionId]);

  // Smooth scroll helper
  const handleScrollToOffer = () => {
    const offerElement = document.getElementById('oferta');
    if (offerElement) {
      offerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Primary Purchase Action Handler
  const handlePurchaseAction = async () => {
    setIsCheckoutLoading(true);

    // 1. Track CTA Click
    eventTracker.trackEvent('PURCHASE_CTA_CLICKED', {
      caseId,
      sessionId,
      experience: 'sales_page',
      payload: {
        productName: PRODUCT_CONFIG.name,
        price: PRODUCT_CONFIG.price,
      },
    });

    // 2. Update conversionState purchaseIntent = 'high' and increment ctaClicks
    updateState((prev) => ({
      ...prev,
      conversion: {
        ...prev.conversion,
        purchaseIntent: 'high',
        ctaClicks: (prev.conversion.ctaClicks || 0) + 1,
        checkoutStarted: true,
      },
    }));

    // 3. Delegate to purchaseService
    try {
      const result: CheckoutResult = await purchaseService.initiateCheckout({
        caseId,
        sessionId,
        metadata: {
          completedExperiences: state.progress.completedExperiences,
        },
      });

      if (result.status === 'redirected' && result.url) {
        // Redirection initiated
      } else {
        // Unconfigured or informative modal
        setCheckoutModalStatus({
          isConfigured: result.status === 'redirected',
          url: result.url,
        });
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('[SalesPage] Checkout error:', err);
      setCheckoutModalStatus({ isConfigured: false });
      setIsModalOpen(true);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleReturn = () => {
    if (onReturnToFunnel) {
      onReturnToFunnel();
    } else {
      goToExperience('exp08');
    }
  };

  return (
    <div
      id="sales-page-view"
      className="relative w-full min-h-screen bg-[#050505] text-[#D1D1D1] font-body selection:bg-orange-500/30 selection:text-white"
    >
      {/* Editorial Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#050505]/90 backdrop-blur-md border-b border-[#141414] px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.8)]" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-neutral-200">
            CONTEXTO™ &bull; INFORME FINAL
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleReturn}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">REVISAR EXPEDIENTE</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: 15 Seamless Editorial Sections */}
      <main className="w-full">
        {/* SECTION 01 — INFORME FINAL */}
        <HeroSection
          caseId={caseId}
          onScrollToOffer={handleScrollToOffer}
          onCtaClick={handlePurchaseAction}
        />

        {/* SECTION 02 — LO QUE DESCUBRISTE */}
        <DiscoveriesSection />

        {/* SECTION 03 — EL PROBLEMA REAL */}
        <RealProblemSection />

        {/* SECTION 04 — QUÉ ES CONTEXTO™ */}
        <WhatIsContextoSection caseId={caseId} />

        {/* SECTION 05 — CÓMO FUNCIONA */}
        <HowItWorksSection />

        {/* SECTION 06 — QUÉ RECIBES */}
        <WhatYouReceiveSection />

        {/* SECTION 07 — UN DÍA CON CONTEXTO™ */}
        <OneDayScenarioSection />

        {/* SECTION 08 — LO QUE CONTEXTO™ NO HACE */}
        <WhatItDoesNotDoSection />

        {/* SECTION 09 — PARA QUIÉN ES */}
        <WhoItIsForSection />

        {/* SECTION 10 — PARA QUIÉN NO ES */}
        <WhoItIsNotForSection />

        {/* SECTION 11 — EL CAMBIO */}
        <TheShiftSection />

        {/* SECTION 12 — OFERTA */}
        <OfferSection
          caseId={caseId}
          onPurchase={handlePurchaseAction}
          isLoading={isCheckoutLoading}
        />

        {/* SECTION 13 — GARANTÍA / REDUCCIÓN DE RIESGO */}
        <RiskReductionSection />

        {/* SECTION 14 — PREGUNTAS FRECUENTES */}
        <FAQSection caseId={caseId} sessionId={sessionId} />

        {/* SECTION 15 — DECISIÓN FINAL */}
        <FinalDecisionSection
          caseId={caseId}
          onPurchase={handlePurchaseAction}
          isLoading={isCheckoutLoading}
        />
      </main>

      {/* Editorial Footer */}
      <footer className="w-full border-t border-[#141414] bg-[#040404] py-8 px-4 sm:px-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>EXPEDIENTE CONFIDENCIAL &bull; {caseId}</span>
        </div>
        <p className="text-[11px] text-neutral-600 font-mono tracking-wider uppercase">
          Contexto™ &bull; Micro-App de Inteligencia Relacional y Ciclo
        </p>
      </footer>

      {/* Status Modal for Checkout */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        caseId={caseId}
        isConfigured={checkoutModalStatus.isConfigured}
        onProceedAnyway={() => {
          if (checkoutModalStatus.url && typeof window !== 'undefined') {
            window.open(checkoutModalStatus.url, '_blank', 'noopener,noreferrer');
            setIsModalOpen(false);
          }
        }}
      />
    </div>
  );
};
