// Shipping Service
// lib/services/shippingService.ts

import { useIntegrationsStore } from '@/lib/integrations/integrationsStore';
import { ShippingProvider, Integration } from '@/lib/integrations/integrationTypes';
import { FedExAdapter } from '@/lib/integrations/shipping/fedex';
import { DHLAdapter } from '@/lib/integrations/shipping/dhl';
import { UPSAdapter } from '@/lib/integrations/shipping/ups';
import { EstafetaAdapter } from '@/lib/integrations/shipping/estafeta';
import { NinetyNineMinutosAdapter } from '@/lib/integrations/shipping/99minutos';
import { ShippingAdapter } from '@/lib/integrations/baseAdapter';

export interface ShippingRate {
    provider: ShippingProvider;
    providerName: string;
    cost: number;
    estimatedDays: number;
}

export interface ShippingLabel {
    success: boolean;
    trackingNumber?: string;
    labelUrl?: string;
    error?: string;
}

export interface TrackingInfo {
    success: boolean;
    trackingNumber?: string;
    status?: string;
    estimatedDelivery?: Date;
    events?: any[];
    error?: string;
}

export class ShippingService {
    /**
     * Get all available (enabled) shipping methods
     */
    static getAvailableShippingMethods(): Integration[] {
        const store = useIntegrationsStore.getState();
        return store.getEnabledIntegrations('shipping');
    }

    /**
     * Create shipping adapter instance
     */
    private static createAdapter(integration: Integration): ShippingAdapter {
        switch (integration.provider as ShippingProvider) {
            case 'fedex':
                return new FedExAdapter(integration);
            case 'dhl':
                return new DHLAdapter(integration);
            case 'ups':
                return new UPSAdapter(integration);
            case 'estafeta':
                return new EstafetaAdapter(integration);
            case '99minutos':
                return new NinetyNineMinutosAdapter(integration);
            default:
                throw new Error(`Unknown shipping provider: ${integration.provider}`);
        }
    }

    /**
     * Calculate shipping rates from all enabled providers
     */
    static async calculateShippingRates(
        origin: any,
        destination: any,
        packageInfo: any
    ): Promise<ShippingRate[]> {
        const availableMethods = this.getAvailableShippingMethods();
        const rates: ShippingRate[] = [];

        for (const integration of availableMethods) {
            try {
                const adapter = this.createAdapter(integration);
                const result = await adapter.calculateRate(origin, destination, packageInfo);

                if (result.success && result.data) {
                    rates.push({
                        provider: integration.provider as ShippingProvider,
                        providerName: integration.name,
                        cost: result.data.cost,
                        estimatedDays: result.data.estimatedDays
                    });
                }
            } catch (error) {
                console.error(`Error calculating rate for ${integration.provider}:`, error);
            }
        }

        // Sort by cost (cheapest first)
        return rates.sort((a, b) => a.cost - b.cost);
    }

    /**
     * Create shipping label
     */
    static async createShippingLabel(
        provider: ShippingProvider,
        shipmentData: any
    ): Promise<ShippingLabel> {
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
            const result = await adapter.createLabel(shipmentData);

            if (result.success && result.data) {
                return {
                    success: true,
                    trackingNumber: result.data.trackingNumber,
                    labelUrl: result.data.labelUrl
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
     * Track shipment
     */
    static async trackShipment(
        provider: ShippingProvider,
        trackingNumber: string
    ): Promise<TrackingInfo> {
        try {
            const store = useIntegrationsStore.getState();
            const integration = store.getIntegration(provider);

            if (!integration) {
                return {
                    success: false,
                    error: `Integration ${provider} not found`
                };
            }

            const adapter = this.createAdapter(integration);
            const result = await adapter.trackShipment(trackingNumber);

            if (result.success && result.data) {
                return {
                    success: true,
                    trackingNumber: result.data.trackingNumber,
                    status: result.data.status,
                    estimatedDelivery: result.data.estimatedDelivery,
                    events: result.data.events
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
     * Cancel shipment
     */
    static async cancelShipment(
        provider: ShippingProvider,
        trackingNumber: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const store = useIntegrationsStore.getState();
            const integration = store.getIntegration(provider);

            if (!integration) {
                return { success: false, error: 'Integration not found' };
            }

            const adapter = this.createAdapter(integration);
            const result = await adapter.cancelShipment(trackingNumber);

            return {
                success: result.success,
                error: result.error
            };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
}
