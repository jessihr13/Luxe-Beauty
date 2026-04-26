// Discount System Types
// lib/discounts/discountTypes.ts

export type DiscountType = 
    | 'coupon'
    | 'volume'
    | 'birthday'
    | 'referral'
    | 'first_purchase'
    | 'payment_method'
    | 'free_shipping';

export type DiscountValueType = 'percentage' | 'fixed' | 'free_shipping';

export type DiscountStatus = 'active' | 'inactive' | 'expired' | 'exhausted';

export interface Discount {
    id: string;
    code?: string; // For coupons and referrals
    name: string;
    description: string;
    type: DiscountType;
    valueType: DiscountValueType;
    value: number; // Percentage (0-100) or fixed amount
    
    // Conditions
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    applicableProducts?: string[]; // Product IDs
    applicableCategories?: string[];
    excludedProducts?: string[];
    
    // Volume discount specific
    buyQuantity?: number; // Buy X items
    payQuantity?: number; // Pay for Y items
    
    // Payment method specific
    paymentMethods?: string[]; // ['transfer', 'cash', 'card']
    
    // Usage limits
    maxUses?: number; // Total uses allowed
    maxUsesPerUser?: number; // Per user limit
    currentUses: number;
    
    // Validity
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    
    // Stacking rules
    canStackWithOthers: boolean;
    priority: number; // Higher = applied first
    
    // Metadata
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
}

export interface UserDiscountUsage {
    userId: string;
    discountId: string;
    usageCount: number;
    lastUsed: Date;
    firstUsed: Date;
}

export interface AppliedDiscount {
    discountId: string;
    code?: string;
    type: DiscountType;
    name: string;
    description: string;
    amount: number; // Calculated discount amount
    appliedTo?: string[]; // Product IDs this discount applies to
}

export interface DiscountCalculationContext {
    userId?: string;
    userEmail?: string;
    userBirthday?: Date;
    isFirstPurchase: boolean;
    cartItems: Array<{
        productId: string;
        categoryId: string;
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    paymentMethod?: string;
    appliedCoupons: string[];
}

export interface DiscountCalculationResult {
    appliedDiscounts: AppliedDiscount[];
    totalDiscount: number;
    freeShipping: boolean;
    breakdown: {
        subtotal: number;
        discounts: number;
        shipping: number;
        total: number;
    };
}

// Discount type info for UI
export const discountTypeInfo: Record<DiscountType, {
    name: string;
    icon: string;
    description: string;
    color: string;
}> = {
    coupon: {
        name: 'Cupón',
        icon: '🎟️',
        description: 'Código de descuento',
        color: 'blue'
    },
    volume: {
        name: 'Volumen',
        icon: '💯',
        description: 'Descuento por cantidad',
        color: 'purple'
    },
    birthday: {
        name: 'Cumpleaños',
        icon: '🎂',
        description: 'Regalo de cumpleaños',
        color: 'pink'
    },
    referral: {
        name: 'Referido',
        icon: '👥',
        description: 'Descuento por referir',
        color: 'green'
    },
    first_purchase: {
        name: 'Primera Compra',
        icon: '🎯',
        description: 'Bienvenida para nuevos clientes',
        color: 'orange'
    },
    payment_method: {
        name: 'Método de Pago',
        icon: '💳',
        description: 'Descuento por forma de pago',
        color: 'indigo'
    },
    free_shipping: {
        name: 'Envío Gratis',
        icon: '📦',
        description: 'Sin costo de envío',
        color: 'teal'
    }
};
