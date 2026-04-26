/**
 * Checkout TypeScript Types and Interfaces
 */

export interface ShippingInfo {
    fullName: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    deliveryInstructions?: string;
}

export interface PaymentMethod {
    type: 'card' | 'paypal' | 'bank_transfer';
    cardDetails?: {
        cardNumber: string;
        cardHolder: string;
        expiryDate: string;
        cvv: string;
    };
}

export interface BillingAddress {
    sameAsShipping: boolean;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export interface CheckoutData {
    shipping: ShippingInfo | null;
    payment: PaymentMethod | null;
    billing: BillingAddress;
    acceptedTerms: boolean;
}

export interface Order {
    id: string;
    items: any[]; // Will use CartItem from cart store
    shipping: ShippingInfo;
    payment: PaymentMethod;
    billing: BillingAddress;
    subtotal: number;
    shipping_cost: number;
    discount: number;
    total: number;
    createdAt: Date;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

export type CheckoutStep = 1 | 2 | 3;

export interface FormErrors {
    [key: string]: string;
}
