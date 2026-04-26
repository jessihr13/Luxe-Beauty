/**
 * Utilidades para cálculos de precios y anclaje
 */

export interface PriceDisplay {
    originalPrice: number;
    currentPrice: number;
    discount: number; // percentage
    savings: number; // amount saved
    showOriginalPrice: boolean;
    hasDiscount: boolean;
}

/**
 * Calcula el display de precio con anclaje
 */
export function calculatePriceDisplay(
    originalPrice: number,
    currentPrice?: number,
    discountPercentage?: number
): PriceDisplay {
    // Si no hay precio actual, calcularlo del descuento
    const finalPrice = currentPrice ?? (discountPercentage
        ? originalPrice * (1 - discountPercentage / 100)
        : originalPrice);

    const savings = originalPrice - finalPrice;
    const discount = (savings / originalPrice) * 100;
    const hasDiscount = savings > 0;

    return {
        originalPrice,
        currentPrice: finalPrice,
        discount: Math.round(discount),
        savings: Math.round(savings),
        showOriginalPrice: hasDiscount,
        hasDiscount,
    };
}

/**
 * Formatea precio en pesos mexicanos
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

/**
 * Formatea descuento como porcentaje
 */
export function formatDiscount(discount: number): string {
    return `${discount}%`;
}

/**
 * Calcula el precio con descuento de nivel VIP
 */
export function applyTierDiscount(price: number, tierDiscountPercentage: number): number {
    return price * (1 - tierDiscountPercentage / 100);
}

/**
 * Calcula el total con múltiples descuentos
 */
export function calculateTotalWithDiscounts(
    subtotal: number,
    productDiscount: number = 0,
    tierDiscount: number = 0,
    pointsDiscount: number = 0
): {
    subtotal: number;
    productDiscount: number;
    tierDiscount: number;
    pointsDiscount: number;
    total: number;
    totalSavings: number;
} {
    // Aplicar descuentos en orden
    let currentTotal = subtotal;

    // 1. Descuento del producto
    const productDiscountAmount = currentTotal * (productDiscount / 100);
    currentTotal -= productDiscountAmount;

    // 2. Descuento de nivel VIP
    const tierDiscountAmount = currentTotal * (tierDiscount / 100);
    currentTotal -= tierDiscountAmount;

    // 3. Descuento de puntos (monto fijo)
    currentTotal -= pointsDiscount;

    const totalSavings = subtotal - currentTotal;

    return {
        subtotal,
        productDiscount: productDiscountAmount,
        tierDiscount: tierDiscountAmount,
        pointsDiscount,
        total: Math.max(0, currentTotal),
        totalSavings,
    };
}

/**
 * Genera mensaje de ahorro para mostrar al usuario
 */
export function getSavingsMessage(savings: number): string {
    if (savings <= 0) return '';
    return `¡Ahorras ${formatPrice(savings)}!`;
}

/**
 * Calcula el porcentaje de descuento para mostrar en badge
 */
export function getDiscountBadgeText(discount: number): string {
    if (discount <= 0) return '';
    return `-${discount}%`;
}
