'use client';

import { Star, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils/priceCalculations';
import { calculateDiscountFromPoints } from '@/lib/loyalty/pointsSystem';
import TierBadge from './TierBadge';
import type { TierLevel } from '@/lib/loyalty/pointsSystem';

interface PointsBalanceProps {
    availablePoints: number;
    tier: TierLevel;
    compact?: boolean;
}

export default function PointsBalance({ availablePoints, tier, compact = false }: PointsBalanceProps) {
    const discountValue = calculateDiscountFromPoints(availablePoints);

    if (compact) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-gold-50 to-amber-50 rounded-lg border border-rose-gold-200">
                <Star className="w-4 h-4 text-rose-gold-600 fill-rose-gold-600" />
                <span className="text-sm font-semibold text-gray-900">
                    {availablePoints.toLocaleString()} pts
                </span>
                <span className="text-xs text-gray-600">
                    = {formatPrice(discountValue)}
                </span>
            </div>
        );
    }

    return (
        <div className="card-luxury p-6 bg-gradient-to-br from-rose-gold-50 via-white to-amber-50">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Tus Puntos</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                            {availablePoints.toLocaleString()}
                        </span>
                        <Star className="w-6 h-6 text-rose-gold-600 fill-rose-gold-600" />
                    </div>
                </div>
                <TierBadge tier={tier} size="md" />
            </div>

            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-rose-gold-200">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                    <p className="text-xs text-gray-600">Valor en descuentos</p>
                    <p className="text-lg font-bold text-green-600">{formatPrice(discountValue)}</p>
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
                Usa tus puntos en tu próxima compra
            </p>
        </div>
    );
}
