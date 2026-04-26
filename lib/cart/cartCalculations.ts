/**
 * Cálculos del carrito de compras
 */

import { CartItem, CartDiscounts } from './types';
import { calculatePointsFromPurchase } from '@/lib/loyalty/pointsSystem';
import { calculateTotalWithDiscounts } from '@/lib/utils/priceCalculations';

/**
 * Calcula el subtotal del carrito
 */
export function calculateSubtotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
        const itemPrice = item.product.price * item.quantity;
        return total + itemPrice;
    }, 0);
}

/**
 * Calcula el descuento total de productos
 */
export function calculateProductDiscounts(items: CartItem[]): number {
    return items.reduce((total, item) => {
        if (item.product.originalPrice) {
            const discount = (item.product.originalPrice - item.product.price) * item.quantity;
            return total + discount;
        }
        return total;
    }, 0);
}

/**
 * Calcula el costo de envío
 */
export function calculateShipping(
    subtotal: number,
    hasFreeShipping: boolean,
    shippingMethod: 'standard' | 'express' = 'standard'
): number {
    // Envío gratis sobre $1,000 o por nivel VIP
    if (hasFreeShipping || subtotal >= 1000) {
        return 0;
    }

    return shippingMethod === 'express' ? 199 : 99;
}

/**
 * Calcula puntos a ganar por la compra
 */
export function calculatePointsToEarn(total: number): number {
    return calculatePointsFromPurchase(total);
}

/**
 * Calcula el total del carrito con todos los descuentos
 */
export function calculateCartTotal(
    subtotal: number,
    discounts: CartDiscounts,
    shipping: number
): number {
    const totalDiscounts = Object.values(discounts).reduce((sum, discount) => sum + discount, 0);
    const total = subtotal - totalDiscounts + shipping;
    return Math.max(0, total);
}

/**
 * Valida la cantidad de un item
 */
export function validateQuantity(quantity: number, stock: number): {
    valid: boolean;
    adjustedQuantity: number;
    error?: string;
} {
    if (quantity < 1) {
        return {
            valid: false,
            adjustedQuantity: 1,
            error: 'La cantidad mínima es 1',
        };
    }

    if (quantity > stock) {
        return {
            valid: false,
            adjustedQuantity: stock,
            error: `Solo hay ${stock} unidades disponibles`,
        };
    }

    return {
        valid: true,
        adjustedQuantity: quantity,
    };
}

/**
 * Genera ID único para item del carrito
 */
export function generateCartItemId(productId: string, variant?: { size?: string; color?: string }): string {
    const variantKey = variant
        ? `_${variant.size || ''}_${variant.color || ''}`
        : '';
    return `${productId}${variantKey}`;
}

/**
 * Calcula el resumen completo del carrito
 */
export function calculateCartSummary(
    items: CartItem[],
    tierDiscountPercentage: number,
    pointsToRedeem: number,
    couponDiscount: number,
    hasFreeShipping: boolean
) {
    const subtotal = calculateSubtotal(items);
    const productDiscounts = calculateProductDiscounts(items);

    // Calcular descuento por tier sobre el subtotal después de descuentos de producto
    const afterProductDiscount = subtotal - productDiscounts;
    const tierDiscount = afterProductDiscount * (tierDiscountPercentage / 100);

    const discounts: CartDiscounts = {
        products: productDiscounts,
        tier: tierDiscount,
        points: pointsToRedeem,
        coupon: couponDiscount,
    };

    const shipping = calculateShipping(subtotal, hasFreeShipping);
    const total = calculateCartTotal(subtotal, discounts, shipping);
    const pointsToEarn = calculatePointsToEarn(total);

    return {
        subtotal,
        discounts,
        shipping,
        total,
        pointsToEarn,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
}
