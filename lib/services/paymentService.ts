// Payment Service
// lib/services/paymentService.ts

import { useIntegrationsStore } from '@/lib/integrations/integrationsStore';
import { PaymentProvider, Integration } from '@/lib/integrations/integrationTypes';
import { StripeAdapter } from '@/lib/integrations/payments/stripe';
import { PayPalAdapter } from '@/lib/integrations/payments/paypal';
import { MercadoPagoAdapter } from '@/lib/integrations/payments/mercadopago';
import { ConektaAdapter } from '@/lib/integrations/payments/conekta';
import { OXXOAdapter } from '@/lib/integrations/payments/oxxo';
import { PaymentAdapter } from '@/lib/integrations/baseAdapter';

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
    data?: any;
}

export class PaymentService {
    /**
     * Get all available (enabled) payment methods
     */
    static getAvailablePaymentMethods(): Integration[] {
        const store = useIntegrationsStore.getState();
        return store.getEnabledIntegrations('payment');
    }

    /**
     * Create payment adapter instance
     */
    private static createAdapter(integration: Integration): PaymentAdapter {
        switch (integration.provider as PaymentProvider) {
            case 'stripe':
                return new StripeAdapter(integration);
            case 'paypal':
                return new PayPalAdapter(integration);
            case 'mercadopago':
                return new MercadoPagoAdapter(integration);
            case 'conekta':
                return new ConektaAdapter(integration);
            case 'oxxo':
                return new OXXOAdapter(integration);
            default:
                throw new Error(`Unknown payment provider: ${integration.provider}`);
        }
    }

    /**
     * Process payment for an order
     */
    static async processPayment(
        provider: PaymentProvider,
        amount: number,
        currency: string = 'MXN',
        metadata?: any
    ): Promise<PaymentResult> {
        try {
            const store = useIntegrationsStore.getState();
            const integration = store.getIntegration(provider);

            if (!integration) {
                return {
                    success: false,
                    error: `Integration ${provider} not found`
                };
            }

            if (!integration.isEnabled) {
                return {
                    success: false,
                    error: `Integration ${provider} is not enabled`
                };
            }

            const adapter = this.createAdapter(integration);
            const result = await adapter.createPayment(amount, currency, metadata);

            if (result.success) {
                return {
                    success: true,
                    transactionId: result.data?.id,
                    data: result.data
                };
            } else {
                return {
                    success: false,
                    error: result.error
                };
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Capture/confirm a payment
     */
    static async capturePayment(
        provider: PaymentProvider,
        paymentId: string
    ): Promise<PaymentResult> {
        try {
            const store = useIntegrationsStore.getState();
            const integration = store.getIntegration(provider);

            if (!integration) {
                return { success: false, error: 'Integration not found' };
            }

            const adapter = this.createAdapter(integration);
            const result = await adapter.capturePayment(paymentId);

            return {
                success: result.success,
                transactionId: paymentId,
                data: result.data,
                error: result.error
            };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Refund a payment
     */
    static async refundPayment(
        provider: PaymentProvider,
        paymentId: string,
        amount?: number
    ): Promise<PaymentResult> {
        try {
            const store = useIntegrationsStore.getState();
            const integration = store.getIntegration(provider);

            if (!integration) {
                return { success: false, error: 'Integration not found' };
            }

            const adapter = this.createAdapter(integration);
            const result = await adapter.refundPayment(paymentId, amount);

            return {
                success: result.success,
                transactionId: result.data?.id,
                data: result.data,
                error: result.error
            };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get payment status
     */
    static async getPaymentStatus(
        provider: PaymentProvider,
        paymentId: string
    ): Promise<PaymentResult> {
        try {
            const store = useIntegrationsStore.getState();
            const integration = store.getIntegration(provider);

            if (!integration) {
                return { success: false, error: 'Integration not found' };
            }

            const adapter = this.createAdapter(integration);
            const result = await adapter.getPaymentStatus(paymentId);

            return {
                success: result.success,
                data: result.data,
                error: result.error
            };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
}
