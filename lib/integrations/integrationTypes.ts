// Integration System Types
// lib/integrations/integrationTypes.ts

export type IntegrationType = 'payment' | 'shipping' | 'accounting';

export type PaymentProvider = 'stripe' | 'paypal' | 'mercadopago' | 'conekta' | 'oxxo';
export type ShippingProvider = 'fedex' | 'dhl' | 'ups' | 'estafeta' | '99minutos';
export type AccountingProvider = 'sat' | 'quickbooks' | 'xero' | 'conta';

export type IntegrationProvider = PaymentProvider | ShippingProvider | AccountingProvider;

export type IntegrationStatus = 'active' | 'inactive' | 'testing' | 'error';

export interface Integration {
    id: string;
    type: IntegrationType;
    provider: IntegrationProvider;
    name: string;
    description: string;
    status: IntegrationStatus;
    
    // Configuration
    config: {
        apiKey?: string;
        secretKey?: string;
        publicKey?: string;
        webhookUrl?: string;
        environment?: 'sandbox' | 'production';
        [key: string]: any; // Provider-specific config
    };
    
    // Metadata
    isEnabled: boolean;
    lastSync?: Date;
    lastError?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface PaymentTransaction {
    id: string;
    orderId: string;
    provider: PaymentProvider;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    metadata?: any;
    createdAt: Date;
}

export interface ShippingLabel {
    id: string;
    orderId: string;
    provider: ShippingProvider;
    trackingNumber: string;
    labelUrl?: string;
    cost: number;
    estimatedDelivery?: Date;
    status: 'created' | 'in_transit' | 'delivered' | 'failed';
    createdAt: Date;
}

export interface Invoice {
    id: string;
    orderId: string;
    provider: AccountingProvider;
    invoiceNumber: string;
    uuid?: string; // For SAT CFDI
    xmlUrl?: string;
    pdfUrl?: string;
    status: 'draft' | 'issued' | 'cancelled';
    createdAt: Date;
}

// Integration metadata for UI
export const integrationInfo: Record<IntegrationProvider, {
    name: string;
    type: IntegrationType;
    icon: string;
    description: string;
    color: string;
    region?: string;
}> = {
    // Payments
    stripe: {
        name: 'Stripe',
        type: 'payment',
        icon: '💳',
        description: 'Procesador de pagos internacional',
        color: 'purple',
        region: 'Global'
    },
    paypal: {
        name: 'PayPal',
        type: 'payment',
        icon: '🅿️',
        description: 'Wallet digital internacional',
        color: 'blue',
        region: 'Global'
    },
    mercadopago: {
        name: 'Mercado Pago',
        type: 'payment',
        icon: '💰',
        description: 'Pagos para LATAM',
        color: 'cyan',
        region: 'LATAM'
    },
    conekta: {
        name: 'Conekta',
        type: 'payment',
        icon: '🇲🇽',
        description: 'Pagos para México',
        color: 'green',
        region: 'México'
    },
    oxxo: {
        name: 'OXXO Pay',
        type: 'payment',
        icon: '🏪',
        description: 'Pagos en efectivo OXXO',
        color: 'red',
        region: 'México'
    },
    
    // Shipping
    fedex: {
        name: 'FedEx',
        type: 'shipping',
        icon: '📦',
        description: 'Envíos internacionales',
        color: 'purple',
        region: 'Global'
    },
    dhl: {
        name: 'DHL',
        type: 'shipping',
        icon: '🚚',
        description: 'Envíos internacionales',
        color: 'yellow',
        region: 'Global'
    },
    ups: {
        name: 'UPS',
        type: 'shipping',
        icon: '📮',
        description: 'Envíos internacionales',
        color: 'brown',
        region: 'Global'
    },
    estafeta: {
        name: 'Estafeta',
        type: 'shipping',
        icon: '🇲🇽',
        description: 'Envíos nacionales México',
        color: 'red',
        region: 'México'
    },
    '99minutos': {
        name: '99 Minutos',
        type: 'shipping',
        icon: '⚡',
        description: 'Entregas rápidas México',
        color: 'orange',
        region: 'México'
    },
    
    // Accounting
    sat: {
        name: 'SAT',
        type: 'accounting',
        icon: '🧾',
        description: 'Facturación electrónica México (CFDI)',
        color: 'green',
        region: 'México'
    },
    quickbooks: {
        name: 'QuickBooks',
        type: 'accounting',
        icon: '📊',
        description: 'Contabilidad internacional',
        color: 'green',
        region: 'Global'
    },
    xero: {
        name: 'Xero',
        type: 'accounting',
        icon: '📈',
        description: 'Contabilidad cloud',
        color: 'blue',
        region: 'Global'
    },
    conta: {
        name: 'Conta.mx',
        type: 'accounting',
        icon: '🇲🇽',
        description: 'Contabilidad México',
        color: 'teal',
        region: 'México'
    }
};
