'use client';

import { useCartStore } from '@/lib/cart/cartStore';
import { formatPrice } from '@/lib/utils/priceCalculations';
import { Truck } from 'lucide-react';

export default function CartSummary() {
    const {
        getSubtotal,
        getDiscountTotal,
        getFinalTotal
    } = useCartStore();
    
    const subtotal = getSubtotal();
    const discounts = getDiscountTotal(); // ✅ number
    const total = getFinalTotal();
    const shipping = 0;

    return (
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
            
            {/* Subtotal */}
            <div className="flex justify-between text-xs">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>

            {/* Discounts */}
            {discounts > 0 && (
                <div className="flex justify-between text-xs text-green-600">
                    <span>Descuentos</span>
                    <span>-{formatPrice(discounts)}</span>
                </div>
            )}

            {/* Shipping */}
            <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-gray-600">
                    <Truck className="w-2.5 h-2.5" />
                    Envío
                </span>
                <span className="text-green-600 font-semibold">¡Gratis!</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-1.5" />

            {/* Total */}
            <div className="flex justify-between text-sm font-bold">
                <span>Total</span>
                <span className="text-rose-gold-700">{formatPrice(total)}</span>
            </div>

        </div>
    );
}