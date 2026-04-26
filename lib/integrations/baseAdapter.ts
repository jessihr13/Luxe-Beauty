// Base Integration Adapter
// lib/integrations/baseAdapter.ts

import { Integration, IntegrationProvider } from './integrationTypes';

export interface AdapterResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export abstract class BaseIntegrationAdapter {
    protected integration: Integration;

    constructor(integration: Integration) {
        this.integration = integration;
    }

    /**
     * Test connection to the integration
     */
    abstract testConnection(): Promise<AdapterResponse<boolean>>;

    /**
     * Get integration status
     */
    getStatus(): 'active' | 'inactive' | 'testing' | 'error' {
        return this.integration.status;
    }

    /**
     * Check if integration is enabled
     */
    isEnabled(): boolean {
        return this.integration.isEnabled;
    }

    /**
     * Get configuration value
     */
    protected getConfig<T = any>(key: string): T | undefined {
        return this.integration.config[key] as T;
    }

    /**
     * Check if in sandbox/test mode
     */
    protected isSandbox(): boolean {
        return this.integration.config.environment === 'sandbox';
    }

    /**
     * Log error
     */
    protected logError(error: string): void {
        console.error(`[${this.integration.provider}] ${error}`);
        this.integration.lastError = error;
        this.integration.status = 'error';
    }

    /**
     * Log success
     */
    protected logSuccess(message: string): void {
        console.log(`[${this.integration.provider}] ${message}`);
        this.integration.lastSync = new Date();
        this.integration.status = 'active';
    }
}

export abstract class PaymentAdapter extends BaseIntegrationAdapter {
    /**
     * Create a payment
     */
    abstract createPayment(amount: number, currency: string, metadata?: any): Promise<AdapterResponse<any>>;

    /**
     * Capture/confirm a payment
     */
    abstract capturePayment(paymentId: string): Promise<AdapterResponse<any>>;

    /**
     * Refund a payment
     */
    abstract refundPayment(paymentId: string, amount?: number): Promise<AdapterResponse<any>>;

    /**
     * Get payment status
     */
    abstract getPaymentStatus(paymentId: string): Promise<AdapterResponse<any>>;
}

export abstract class ShippingAdapter extends BaseIntegrationAdapter {
    /**
     * Calculate shipping rate
     */
    abstract calculateRate(
        origin: any,
        destination: any,
        package: any
    ): Promise<AdapterResponse<{ cost: number; estimatedDays: number }>>;

    /**
     * Create shipping label
     */
    abstract createLabel(
        shipment: any
    ): Promise<AdapterResponse<{ trackingNumber: string; labelUrl: string }>>;

    /**
     * Track shipment
     */
    abstract trackShipment(trackingNumber: string): Promise<AdapterResponse<any>>;

    /**
     * Cancel shipment
     */
    abstract cancelShipment(trackingNumber: string): Promise<AdapterResponse<boolean>>;
}

export abstract class AccountingAdapter extends BaseIntegrationAdapter {
    /**
     * Create invoice
     */
    abstract createInvoice(order: any, customer: any): Promise<AdapterResponse<any>>;

    /**
     * Get invoice
     */
    abstract getInvoice(invoiceId: string): Promise<AdapterResponse<any>>;

    /**
     * Cancel invoice
     */
    abstract cancelInvoice(invoiceId: string): Promise<AdapterResponse<boolean>>;

    /**
     * Download invoice PDF
     */
    abstract downloadInvoice(invoiceId: string): Promise<AdapterResponse<string>>;
}
