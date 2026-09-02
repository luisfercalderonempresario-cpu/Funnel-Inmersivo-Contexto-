/**
 * Centralized Configuration for Contexto™ Product, Offer & Checkout
 * 
 * IMPORTANT:
 * - Do NOT invent fake prices, guarantees, or testimonials.
 * - If price or checkoutUrl is not configured, the UI must handle it gracefully
 *   without crashing or breaking the experience.
 */

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  tag?: string;
  isCore: boolean;
}

export interface ProductConfig {
  name: string;
  edition: string;
  type: string;
  accessType: string;
  deviceSupport: string;
  price: number | null;
  currency: string | null;
  formattedPrice: string;
  checkoutUrl: string;
  guarantee: {
    days: number;
    title: string;
    description: string;
    policyUrl?: string;
  };
  includedMaterial: string;
  includedMaterialDescription: string;
  paymentPlatform: string;
  paymentPlatformDescription: string;
  features: ProductFeature[];
}

export interface TestimonialsConfig {
  enabled: boolean;
  items: Array<{
    id: string;
    author: string;
    text: string;
    role?: string;
  }>;
}

export interface OfferConfig {
  urgencyEnabled: boolean;
  countdownEnabled: boolean;
  discountEnabled: boolean;
  scarcityNote?: string | null;
}

export const PRODUCT_CONFIG: ProductConfig = {
  name: "Contexto™",
  edition: "Acceso Digital",
  type: "Micro-App",
  accessType: "Acceso Web Inmediato Multiplataforma",
  deviceSupport: "Optimizado para Smartphone, Tablet y Computadora",
  price: 9.99,
  currency: "USD",
  formattedPrice: "$9.99 USD",
  checkoutUrl: "https://pay.hotmart.com/S107279344E",
  guarantee: {
    days: 7,
    title: "Garantía de Contexto™ — 7 días",
    description: "Cuentas con 7 días de garantía completa con tu acceso a Contexto™.",
  },
  includedMaterial: "Manual de uso de Contexto™",
  includedMaterialDescription: "PDF con instrucciones de acceso",
  paymentPlatform: "Hotmart",
  paymentPlatformDescription: "Compra respaldada por Hotmart y su pasarela de pago.",
  features: [
    {
      id: "cycle_tracking",
      title: "Seguimiento y Registro de Ciclo",
      description: "Registro intuitivo de fechas clave y estimación de fases hormonales y fisiológicas.",
      isCore: true,
      tag: "Base"
    },
    {
      id: "connection_index",
      title: "Índice de Conexión Diaria™",
      description: "Métrica orientativa de receptividad emocional y contexto biológico para cada jornada.",
      isCore: true,
      tag: "Exclusivo"
    },
    {
      id: "daily_context",
      title: "Contexto Diario Orientativo",
      description: "Traducción en lenguaje claro de qué procesos biológicos pueden estar ocurriendo hoy.",
      isCore: true,
      tag: "Clave"
    },
    {
      id: "interaction_suggestions",
      title: "Sugerencias de Interacción Reflexiva",
      description: "Puntos de partida y pausas conscientes para calibrar tono, escucha y acompañamiento.",
      isCore: true,
      tag: "Práctico"
    },
    {
      id: "case_personalization",
      title: "Personalización por Expediente",
      description: "Adaptación del marco analítico con base en las observaciones y descubrimientos del caso.",
      isCore: true,
      tag: "Personal"
    },
    {
      id: "multi_device_access",
      title: "Acceso Móvil Continuo",
      description: "Micro-App ligera, rápida y privada disponible desde cualquier navegador móvil.",
      isCore: true,
      tag: "Ligera"
    }
  ]
};

// Social proof configuration (Disabled by default to prevent fake testimonials)
export const TESTIMONIALS_CONFIG: TestimonialsConfig = {
  enabled: false,
  items: []
};

// Ethical offer configuration (Strictly no artificial scarcity or fake countdowns)
export const OFFER_CONFIG: OfferConfig = {
  urgencyEnabled: false,
  countdownEnabled: false,
  discountEnabled: false,
  scarcityNote: null
};
