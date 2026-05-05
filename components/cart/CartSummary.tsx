'use client';

import { useCartStore } from '@/lib/cart/cartStore';
import { formatPrice } from '@/lib/utils/priceCalculations';
import { Truck, Tag, Star, Percent } from 'lucide-react';

export default function CartSummary() {
    const {
        getSubtotal,
        getDiscountTotal,
        getFinalTotal
    } = useCartStore();
    
    const subtotal = getSubtotal();
    const discounts = getDiscountTotal();
    const total = getFinalTotal();
    const shipping = 0;

    const totalDiscounts = Object.values(discounts).reduce((sum, d) => sum + d, 0);

    return (
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
            {/* Subtotal */}
            <div className="flex justify-between text-xs">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>

            {/* Discounts */}
            {totalDiscounts > 0 && (
                <div className="space-y-1">
                    {discounts.products > 0 && (
                        <div className="flex justify-between text-xs text-green-600">
                            <span className="flex items-center gap-1">
                                <Tag className="w-2.5 h-2.5" />
                                Descuentos
                            </span>
                            <span>-{formatPrice(discounts.products)}</span>
                        </div>
                    )}
                    {discounts.tier > 0 && (
                        <div className="flex justify-between text-xs text-green-600">
                            <span className="flex items-center gap-1">
                                <Star className="w-2.5 h-2.5" />
                                VIP
                            </span>
                            <span>-{formatPrice(discounts.tier)}</span>
                        </div>
                    )}
                    {discounts.points > 0 && (
                        <div className="flex justify-between text-xs text-green-600">
                            <span className="flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                Puntos
                            </span>
                            <span>-{formatPrice(discounts.points)}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Shipping */}
            <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-gray-600">
                    <Truck className="w-2.5 h-2.5" />
                    Envío
                </span>
                {hasFreeShipping || shipping === 0 ? (
                    <span className="text-green-600 font-semibold">¡Gratis!</span>
                ) : (
                    <span className="font-semibold">{formatPrice(shipping)}</span>
                )}
            </div>

            {/* Free Shipping Progress */}
            {!hasFreeShipping && shipping > 0 && subtotal < 1000 && (
                <div className="text-[10px] text-gray-600 bg-blue-50 p-1.5 rounded">
                    💡 Agrega {formatPrice(1000 - subtotal)} para envío gratis
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-300 my-1.5" />

            {/* Total */}
            <div className="flex justify-between text-sm font-bold">
                <span>Total</span>
                <span className="text-rose-gold-700">{formatPrice(total)}</span>
            </div>

            {/* Points to Earn */}
            {pointsToEarn > 0 && (
                <div className="text-[10px] text-center text-green-600 bg-green-50 p-1.5 rounded">
                    ⭐ Ganarás {pointsToEarn} puntos
                </div>
            )}
        </div>
    );
}
