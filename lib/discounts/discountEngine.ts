// Discount Calculation Engine
// lib/discounts/discountEngine.ts

import {
    Discount,
    AppliedDiscount,
    DiscountCalculationContext,
    DiscountCalculationResult
} from './discountTypes';
import { validateDiscount, canStackDiscounts } from './discountValidation';

export class DiscountEngine {
    /**
     * Calculate all applicable discounts for a given context
     */
    static calculateDiscounts(
        availableDiscounts: Discount[],
        context: DiscountCalculationContext
    ): DiscountCalculationResult {
        // Filter and validate discounts
        const validDiscounts = availableDiscounts
            .map(discount => ({
                discount,
                validation: validateDiscount(discount, context)
            }))
            .filter(({ validation }) => validation.isValid)
            .map(({ discount }) => discount)
            .sort((a, b) => b.priority - a.priority); // Higher priority first

        // Apply discounts with stacking rules
        const appliedDiscounts: AppliedDiscount[] = [];
        let freeShipping = false;

        for (const discount of validDiscounts) {
            // Check if can stack with already applied discounts
            const canApply = appliedDiscounts.length === 0 || 
                appliedDiscounts.every(applied => {
                    const appliedDiscount = availableDiscounts.find(d => d.id === applied.discountId);
                    return appliedDiscount && canStackDiscounts(discount, appliedDiscount);
                });

            if (!canApply) continue;

            // Maximum 2 discounts can stack
            if (appliedDiscounts.length >= 2) break;

            // Calculate discount amount
            const discountAmount = this.calculateDiscountAmount(discount, context);

            if (discountAmount > 0 || discount.type === 'free_shipping') {
                appliedDiscounts.push({
                    discountId: discount.id,
                    code: discount.code,
                    type: discount.type,
                    name: discount.name,
                    description: discount.description,
                    amount: discountAmount
                });

                if (discount.type === 'free_shipping' || discount.valueType === 'free_shipping') {
                    freeShipping = true;
                }
            }
        }

        // Calculate totals
        const totalDiscount = appliedDiscounts.reduce((sum, d) => sum + d.amount, 0);
        const shipping = freeShipping ? 0 : this.calculateShipping(context.subtotal);

        return {
            appliedDiscounts,
            totalDiscount,
            freeShipping,
            breakdown: {
                subtotal: context.subtotal,
                discounts: totalDiscount,
                shipping,
                total: context.subtotal - totalDiscount + shipping
            }
        };
    }

    /**
     * Calculate discount amount for a specific discount
     */
    private static calculateDiscountAmount(
        discount: Discount,
        context: DiscountCalculationContext
    ): number {
        let amount = 0;

        switch (discount.type) {
            case 'coupon':
            case 'birthday':
            case 'referral':
            case 'first_purchase':
            case 'payment_method':
                amount = this.calculateSimpleDiscount(discount, context);
                break;

            case 'volume':
                amount = this.calculateVolumeDiscount(discount, context);
                break;

            case 'free_shipping':
                // Free shipping doesn't reduce subtotal
                amount = 0;
                break;
        }

        // Apply maximum discount cap
        if (discount.maxDiscountAmount && amount > discount.maxDiscountAmount) {
            amount = discount.maxDiscountAmount;
        }

        return Math.round(amount * 100) / 100; // Round to 2 decimals
    }

    /**
     * Calculate simple percentage or fixed discount
     */
    private static calculateSimpleDiscount(
        discount: Discount,
        context: DiscountCalculationContext
    ): number {
        // Calculate applicable subtotal
        let applicableAmount = context.subtotal;

        // If specific products/categories, calculate only for those
        if (discount.applicableProducts && discount.applicableProducts.length > 0) {
            applicableAmount = context.cartItems
                .filter(item => discount.applicableProducts!.includes(item.productId))
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);
        } else if (discount.applicableCategories && discount.applicableCategories.length > 0) {
            applicableAmount = context.cartItems
                .filter(item => discount.applicableCategories!.includes(item.categoryId))
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        if (discount.valueType === 'percentage') {
            return (applicableAmount * discount.value) / 100;
        } else if (discount.valueType === 'fixed') {
            return Math.min(discount.value, applicableAmount);
        }

        return 0;
    }

    /**
     * Calculate volume discount (e.g., 3x2)
     */
    private static calculateVolumeDiscount(
        discount: Discount,
        context: DiscountCalculationContext
    ): number {
        if (!discount.buyQuantity || !discount.payQuantity) return 0;

        // Group items by product
        const productGroups = context.cartItems.reduce((groups, item) => {
            if (!groups[item.productId]) {
                groups[item.productId] = { quantity: 0, price: item.price };
            }
            groups[item.productId].quantity += item.quantity;
            return groups;
        }, {} as Record<string, { quantity: number; price: number }>);

        let totalDiscount = 0;

        // Calculate discount for each product group
        Object.values(productGroups).forEach(group => {
            const sets = Math.floor(group.quantity / discount.buyQuantity!);
            const freeItems = sets * (discount.buyQuantity! - discount.payQuantity!);
            totalDiscount += freeItems * group.price;
        });

        return totalDiscount;
    }

    /**
     * Calculate shipping cost (can be overridden with actual shipping logic)
     */
    private static calculateShipping(subtotal: number): number {
        // Free shipping over $1000
        if (subtotal >= 1000) return 0;
        
        // Standard shipping
        return 150;
    }

    /**
     * Apply a coupon code
     */
    static applyCoupon(
        code: string,
        availableDiscounts: Discount[],
        context: DiscountCalculationContext
    ): { success: boolean; discount?: Discount; message: string } {
        const coupon = availableDiscounts.find(
            d => d.code?.toLowerCase() === code.toLowerCase() && 
                 (d.type === 'coupon' || d.type === 'referral')
        );

        if (!coupon) {
            return { success: false, message: 'Cupón no válido' };
        }

        const validation = validateDiscount(coupon, context);
        if (!validation.isValid) {
            return { success: false, message: validation.reason || 'Cupón no válido' };
        }

        return {
            success: true,
            discount: coupon,
            message: `Cupón "${coupon.name}" aplicado correctamente`
        };
    }
}
