// Discount Validation Logic
// lib/discounts/discountValidation.ts

import { Discount, DiscountCalculationContext } from './discountTypes';

export function validateDiscount(
    discount: Discount,
    context: DiscountCalculationContext
): { isValid: boolean; reason?: string } {
    // Check if discount is active
    if (!discount.isActive) {
        return { isValid: false, reason: 'Descuento inactivo' };
    }

    // Check date validity
    const now = new Date();
    if (discount.startDate > now) {
        return { isValid: false, reason: 'Descuento aún no válido' };
    }
    if (discount.endDate && discount.endDate < now) {
        return { isValid: false, reason: 'Descuento expirado' };
    }

    // Check usage limits
    if (discount.maxUses && discount.currentUses >= discount.maxUses) {
        return { isValid: false, reason: 'Descuento agotado' };
    }

    // Check minimum purchase amount
    if (discount.minPurchaseAmount && context.subtotal < discount.minPurchaseAmount) {
        return { 
            isValid: false, 
            reason: `Compra mínima de $${discount.minPurchaseAmount}` 
        };
    }

    // Type-specific validations
    switch (discount.type) {
        case 'birthday':
            if (!context.userBirthday) {
                return { isValid: false, reason: 'Fecha de cumpleaños no disponible' };
            }
            if (!isBirthdayMonth(context.userBirthday)) {
                return { isValid: false, reason: 'No es tu mes de cumpleaños' };
            }
            break;

        case 'first_purchase':
            if (!context.isFirstPurchase) {
                return { isValid: false, reason: 'Solo para primera compra' };
            }
            break;

        case 'payment_method':
            if (!context.paymentMethod) {
                return { isValid: false, reason: 'Método de pago no seleccionado' };
            }
            if (discount.paymentMethods && !discount.paymentMethods.includes(context.paymentMethod)) {
                return { isValid: false, reason: 'Método de pago no válido' };
            }
            break;

        case 'volume':
            if (!discount.buyQuantity || !discount.payQuantity) {
                return { isValid: false, reason: 'Configuración de volumen inválida' };
            }
            // Check if cart has enough items
            const totalQuantity = context.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            if (totalQuantity < discount.buyQuantity) {
                return { 
                    isValid: false, 
                    reason: `Compra mínimo ${discount.buyQuantity} productos` 
                };
            }
            break;
    }

    // Check applicable products/categories
    if (discount.applicableProducts && discount.applicableProducts.length > 0) {
        const hasApplicableProduct = context.cartItems.some(item =>
            discount.applicableProducts!.includes(item.productId)
        );
        if (!hasApplicableProduct) {
            return { isValid: false, reason: 'No hay productos aplicables en el carrito' };
        }
    }

    if (discount.applicableCategories && discount.applicableCategories.length > 0) {
        const hasApplicableCategory = context.cartItems.some(item =>
            discount.applicableCategories!.includes(item.categoryId)
        );
        if (!hasApplicableCategory) {
            return { isValid: false, reason: 'No hay categorías aplicables en el carrito' };
        }
    }

    // Check excluded products
    if (discount.excludedProducts && discount.excludedProducts.length > 0) {
        const hasExcludedProduct = context.cartItems.some(item =>
            discount.excludedProducts!.includes(item.productId)
        );
        if (hasExcludedProduct) {
            return { isValid: false, reason: 'Carrito contiene productos excluidos' };
        }
    }

    return { isValid: true };
}

function isBirthdayMonth(birthday: Date): boolean {
    const now = new Date();
    return birthday.getMonth() === now.getMonth();
}

export function canStackDiscounts(discount1: Discount, discount2: Discount): boolean {
    // Same type discounts cannot stack
    if (discount1.type === discount2.type) {
        return false;
    }

    // Check if both allow stacking
    if (!discount1.canStackWithOthers || !discount2.canStackWithOthers) {
        return false;
    }

    // Volume discounts cannot stack with coupons
    if (
        (discount1.type === 'volume' && discount2.type === 'coupon') ||
        (discount1.type === 'coupon' && discount2.type === 'volume')
    ) {
        return false;
    }

    // Maximum 2 discounts can stack
    return true;
}
