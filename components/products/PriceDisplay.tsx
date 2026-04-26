'use client';

import { formatPrice, calculatePriceDisplay, getDiscountBadgeText, getSavingsMessage } from '@/lib/utils/priceCalculations';

interface PriceDisplayProps {
    originalPrice: number;
    currentPrice?: number;
    discountPercentage?: number;
    size?: 'sm' | 'md' | 'lg';
    showSavings?: boolean;
}

export default function PriceDisplay({
    originalPrice,
    currentPrice,
    discountPercentage,
    size = 'md',
    showSavings = true,
}: PriceDisplayProps) {
    const priceData = calculatePriceDisplay(originalPrice, currentPrice, discountPercentage);

    const sizeClasses = {
        sm: {
            current: 'text-lg',
            original: 'text-sm',
            savings: 'text-xs',
            badge: 'text-xs px-2 py-0.5',
        },
        md: {
            current: 'text-2xl',
            original: 'text-base',
            savings: 'text-sm',
            badge: 'text-sm px-2.5 py-1',
        },
        lg: {
            current: 'text-3xl',
            original: 'text-lg',
            savings: 'text-base',
            badge: 'text-base px-3 py-1.5',
        },
    };

    const classes = sizeClasses[size];

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
                {/* Precio Actual */}
                <span className={`font-bold text-gray-900 ${classes.current}`}>
                    {formatPrice(priceData.currentPrice)}
                </span>

                {/* Precio Original (tachado) */}
                {priceData.showOriginalPrice && (
                    <span className={`text-gray-500 line-through ${classes.original}`}>
                        {formatPrice(priceData.originalPrice)}
                    </span>
                )}

                {/* Badge de Descuento */}
                {priceData.hasDiscount && (
                    <span className={`bg-red-500 text-white font-bold rounded-full ${classes.badge}`}>
                        {getDiscountBadgeText(priceData.discount)}
                    </span>
                )}
            </div>

            {/* Mensaje de Ahorro */}
            {showSavings && priceData.hasDiscount && (
                <span className={`text-green-600 font-semibold ${classes.savings}`}>
                    {getSavingsMessage(priceData.savings)}
                </span>
            )}
        </div>
    );
}
