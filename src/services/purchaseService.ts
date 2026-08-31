import { PRODUCT_CONFIG } from '../config/productConfig';
import { eventTracker } from '../engine/events/eventTracker';

export interface CheckoutResult {
  status: 'redirected' | 'pending_configuration' | 'error';
  url?: string;
  message?: string;
}

export class PurchaseService {
  /**
   * Checks if an external payment processor URL is configured.
   */
  public isCheckoutConfigured(): boolean {
    return Boolean(PRODUCT_CONFIG.checkoutUrl && PRODUCT_CONFIG.checkoutUrl.trim().length > 0);
  }

  /**
   * Initiates checkout procedure.
   * If URL is configured, redirects or opens gateway.
   * If not configured, gracefully reports status without crashing.
   */
  public async initiateCheckout(options: {
    caseId: string;
    sessionId: string;
    metadata?: Record<string, unknown>;
  }): Promise<CheckoutResult> {
    const { caseId, sessionId, metadata } = options;

    // Track checkout initialization
    eventTracker.trackEvent('CHECKOUT_STARTED', {
      caseId,
      sessionId,
      experience: 'sales_page',
      payload: {
        productName: PRODUCT_CONFIG.name,
        price: PRODUCT_CONFIG.price,
        currency: PRODUCT_CONFIG.currency,
        isCheckoutConfigured: this.isCheckoutConfigured(),
        ...metadata,
      },
    });

    if (this.isCheckoutConfigured()) {
      try {
        const checkoutUrl = new URL(PRODUCT_CONFIG.checkoutUrl);
        // Append context parameters if supported
        checkoutUrl.searchParams.set('case_id', caseId);
        checkoutUrl.searchParams.set('session_id', sessionId);
        
        if (typeof window !== 'undefined') {
          window.location.href = checkoutUrl.toString();
        }

        return {
          status: 'redirected',
          url: checkoutUrl.toString(),
        };
      } catch (err) {
        console.error('[PurchaseService] Error parsing checkout URL:', err);
        eventTracker.trackEvent('PURCHASE_FAILED', {
          caseId,
          sessionId,
          experience: 'sales_page',
          payload: { reason: 'invalid_checkout_url', error: String(err) },
        });
        return {
          status: 'error',
          message: 'Error al redirigir al procesador de pagos.',
        };
      }
    }

    // Unconfigured state (graceful fallback)
    return {
      status: 'pending_configuration',
      message: 'El procesador de pagos se encuentra en proceso de vinculación final con la pasarela oficial.',
    };
  }
}

export const purchaseService = new PurchaseService();
