// Integrations Store
// lib/integrations/integrationsStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Integration, IntegrationProvider, IntegrationType } from './integrationTypes';

interface IntegrationsState {
    integrations: Integration[];
    
    // Getters
    getAllIntegrations: () => Integration[];
    getIntegrationsByType: (type: IntegrationType) => Integration[];
    getIntegration: (provider: IntegrationProvider) => Integration | undefined;
    getEnabledIntegrations: (type?: IntegrationType) => Integration[];
    
    // Actions
    addIntegration: (integration: Omit<Integration, 'id' | 'createdAt'>) => void;
    updateIntegration: (provider: IntegrationProvider, updates: Partial<Integration>) => void;
    toggleIntegration: (provider: IntegrationProvider) => void;
    deleteIntegration: (provider: IntegrationProvider) => void;
    updateConfig: (provider: IntegrationProvider, config: any) => void;
    updateStatus: (provider: IntegrationProvider, status: Integration['status']) => void;
}

export const useIntegrationsStore = create<IntegrationsState>()(
    persist(
        (set, get) => ({
            integrations: [
                // Payment Integrations
                { id: 'stripe_1', type: 'payment', provider: 'stripe', name: 'Stripe', description: 'Procesador de pagos internacional', status: 'inactive', config: { environment: 'sandbox', publicKey: '', secretKey: '' }, isEnabled: false, createdAt: new Date() },
                { id: 'paypal_1', type: 'payment', provider: 'paypal', name: 'PayPal', description: 'Wallet digital internacional', status: 'inactive', config: { environment: 'sandbox', clientId: '', clientSecret: '' }, isEnabled: false, createdAt: new Date() },
                { id: 'mercadopago_1', type: 'payment', provider: 'mercadopago', name: 'Mercado Pago', description: 'Pagos para LATAM', status: 'inactive', config: { environment: 'sandbox', accessToken: '', publicKey: '' }, isEnabled: false, createdAt: new Date() },
                { id: 'conekta_1', type: 'payment', provider: 'conekta', name: 'Conekta', description: 'Pagos para México', status: 'inactive', config: { environment: 'sandbox', privateKey: '', publicKey: '' }, isEnabled: false, createdAt: new Date() },
                { id: 'oxxo_1', type: 'payment', provider: 'oxxo', name: 'OXXO Pay', description: 'Pagos en efectivo OXXO', status: 'inactive', config: { environment: 'sandbox', privateKey: '' }, isEnabled: false, createdAt: new Date() },
                
                // Shipping Integrations
                { id: 'fedex_1', type: 'shipping', provider: 'fedex', name: 'FedEx', description: 'Envíos internacionales', status: 'inactive', config: { environment: 'sandbox', apiKey: '', accountNumber: '' }, isEnabled: false, createdAt: new Date() },
                { id: 'dhl_1', type: 'shipping', provider: 'dhl', name: 'DHL', description: 'Envíos internacionales', status: 'inactive', config: { environment: 'sandbox', apiKey: '', accountNumber: '' }, isEnabled: false, createdAt: new Date() },
                { id: 'ups_1', type: 'shipping', provider: 'ups', name: 'UPS', description: 'Envíos internacionales', status: 'inactive', config: { environment: 'sandbox', apiKey: '', accountNumber: '' }, isEnabled: false, createdAt: new Date() },
                { id: 'estafeta_1', type: 'shipping', provider: 'estafeta', name: 'Estafeta', description: 'Envíos nacionales México', status: 'inactive', config: { environment: 'sandbox', apiKey: '', accountNumber: '' }, isEnabled: false, createdAt: new Date() },
                { id: '99minutos_1', type: 'shipping', provider: '99minutos', name: '99 Minutos', description: 'Entregas rápidas México', status: 'inactive', config: { environment: 'sandbox', apiKey: '' }, isEnabled: false, createdAt: new Date() },
                
                // Accounting Integrations
                { id: 'sat_1', type: 'accounting', provider: 'sat', name: 'SAT', description: 'Facturación electrónica México', status: 'inactive', config: { environment: 'sandbox', rfc: '', certificatePath: '', keyPath: '' }, isEnabled: false, createdAt: new Date() },
                { id: 'quickbooks_1', type: 'accounting', provider: 'quickbooks', name: 'QuickBooks', description: 'Contabilidad internacional', status: 'inactive', config: { environment: 'sandbox', clientId: '', clientSecret: '' }, isEnabled: false, createdAt: new Date() },
                { id: 'xero_1', type: 'accounting', provider: 'xero', name: 'Xero', description: 'Contabilidad cloud', status: 'inactive', config: { environment: 'sandbox', clientId: '', clientSecret: '' }, isEnabled: false, createdAt: new Date() },
                { id: 'conta_1', type: 'accounting', provider: 'conta', name: 'Conta.mx', description: 'Contabilidad México', status: 'inactive', config: { environment: 'sandbox', apiKey: '' }, isEnabled: false, createdAt: new Date() },
            ],

            // Getters
            getAllIntegrations: () => get().integrations,

            getIntegrationsByType: (type: IntegrationType) =>
                get().integrations.filter(i => i.type === type),

            getIntegration: (provider: IntegrationProvider) =>
                get().integrations.find(i => i.provider === provider),

            getEnabledIntegrations: (type?: IntegrationType) => {
                const integrations = get().integrations.filter(i => i.isEnabled);
                return type ? integrations.filter(i => i.type === type) : integrations;
            },

            // Actions
            addIntegration: (integrationData) => {
                const newIntegration: Integration = {
                    ...integrationData,
                    id: `${integrationData.provider}_${Date.now()}`,
                    createdAt: new Date(),
                };
                
                set(state => ({
                    integrations: [...state.integrations, newIntegration]
                }));
            },

            updateIntegration: (provider, updates) => {
                set(state => ({
                    integrations: state.integrations.map(i =>
                        i.provider === provider
                            ? { ...i, ...updates, updatedAt: new Date() }
                            : i
                    )
                }));
            },

            toggleIntegration: (provider) => {
                set(state => ({
                    integrations: state.integrations.map(i =>
                        i.provider === provider
                            ? { ...i, isEnabled: !i.isEnabled, updatedAt: new Date() }
                            : i
                    )
                }));
            },

            deleteIntegration: (provider) => {
                set(state => ({
                    integrations: state.integrations.filter(i => i.provider !== provider)
                }));
            },

            updateConfig: (provider, config) => {
                set(state => ({
                    integrations: state.integrations.map(i =>
                        i.provider === provider
                            ? { ...i, config: { ...i.config, ...config }, updatedAt: new Date() }
                            : i
                    )
                }));
            },

            updateStatus: (provider, status) => {
                set(state => ({
                    integrations: state.integrations.map(i =>
                        i.provider === provider
                            ? { ...i, status, updatedAt: new Date() }
                            : i
                    )
                }));
            },
        }),
        {
            name: 'integrations-storage'
        }
    )
);
