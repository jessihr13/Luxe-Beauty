// Discount Display Component
// components/cart/DiscountDisplay.tsx

'use client';

import { AppliedDiscount } from '@/lib/discounts/discountTypes';
import { discountTypeInfo } from '@/lib/discounts/discountTypes';

interface DiscountDisplayProps {
    discounts: AppliedDiscount[];
    freeShipping?: boolean;
}

export function DiscountDisplay({ discounts, freeShipping }: DiscountDisplayProps) {
    if (discounts.length === 0 && !freeShipping) return null;

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Descuentos Aplicados</h3>
            
            {discounts.map((discount) => {
                const typeInfo = discountTypeInfo[discount.type];
                return (
                    <div
                        key={discount.discountId}
                        className="flex items-center justify-between text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <span>{typeInfo.icon}</span>
                            <span className="text-gray-700">
                                {discount.name}
                                {discount.code && (
                                    <span className="ml-1 text-xs text-gray-500">
                                        ({discount.code})
                                    </span>
                                )}
                            </span>
                        </div>
                        <span className="font-semibold text-green-600">
                            -${discount.amount.toLocaleString()}
                        </span>
                    </div>
                );
            })}

            {freeShipping && (
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <span>📦</span>
                        <span className="text-gray-700">Envío Gratis</span>
                    </div>
                    <span className="font-semibold text-green-600">
                        -$150
                    </span>
                </div>
            )}
        </div>
    );
}
