/**
 * Tipos para el sistema de carrito de compras
 */

import { Product } from '@/lib/data/products';

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    selectedVariant?: {
        size?: string;
        color?: string;
    };
    addedAt: Date;
}

export interface CartDiscounts {
    products: number;      // Descuento de productos
    tier: number;          // Descuento por nivel VIP
    points: number;        // Descuento por puntos
    coupon: number;        // Descuento por cupón
}

export interface Cart {
    id: string;
    userId?: string;
    items: CartItem[];
    subtotal: number;
    discounts: CartDiscounts;
    shipping: number;
    pointsToEarn: number;
    pointsToRedeem: number;
    total: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Coupon {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minPurchase?: number;
    maxDiscount?: number;
    expiresAt?: Date;
    isActive: boolean;
}
