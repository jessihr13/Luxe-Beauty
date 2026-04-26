'use client';

import { TIER_CONFIGS, type TierLevel } from '@/lib/loyalty/pointsSystem';

interface TierBadgeProps {
    tier: TierLevel;
    size?: 'sm' | 'md' | 'lg';
    showName?: boolean;
}

export default function TierBadge({ tier, size = 'md', showName = true }: TierBadgeProps) {
    const config = TIER_CONFIGS[tier];

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
    };

    const iconSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <div
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]}`}
            style={{
                backgroundColor: `${config.color}20`,
                color: config.color,
                border: `2px solid ${config.color}`,
            }}
        >
            <span className={iconSizes[size]}>{config.icon}</span>
            {showName && <span>{config.name}</span>}
        </div>
    );
}
