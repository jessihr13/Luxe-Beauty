'use client';

import { TIER_CONFIGS, type TierLevel, calculateTierProgress } from '@/lib/loyalty/pointsSystem';
import TierBadge from './TierBadge';

interface TierProgressProps {
    totalPoints: number;
}

export default function TierProgress({ totalPoints }: TierProgressProps) {
    const { currentTier, progress, pointsToNext, nextTier } = calculateTierProgress(totalPoints);
    const currentConfig = TIER_CONFIGS[currentTier];

    return (
        <div className="space-y-3">
            {/* Current Tier */}
            <div className="flex items-center justify-between">
                <TierBadge tier={currentTier} size="md" />
                {nextTier && (
                    <span className="text-sm text-gray-600">
                        {pointsToNext} puntos para {TIER_CONFIGS[nextTier].name}
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            {nextTier && (
                <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: currentConfig.color,
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{currentConfig.name}</span>
                        <span>{Math.round(progress)}%</span>
                        <span>{TIER_CONFIGS[nextTier].name}</span>
                    </div>
                </div>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                {currentConfig.benefits.discountPercentage > 0 && (
                    <div className="flex items-center gap-1 text-green-600">
                        <span>✓</span>
                        <span>{currentConfig.benefits.discountPercentage}% descuento</span>
                    </div>
                )}
                {currentConfig.benefits.freeShipping && (
                    <div className="flex items-center gap-1 text-green-600">
                        <span>✓</span>
                        <span>Envío gratis</span>
                    </div>
                )}
                {currentConfig.benefits.earlyAccess && (
                    <div className="flex items-center gap-1 text-green-600">
                        <span>✓</span>
                        <span>Acceso anticipado</span>
                    </div>
                )}
            </div>
        </div>
    );
}
