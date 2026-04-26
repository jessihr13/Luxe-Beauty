'use client';

import { motion } from 'framer-motion';
import { pulse } from '@/lib/animations';

interface ScarcityBadgeProps {
    type: 'stock' | 'trending' | 'limited' | 'new';
    stock?: number;
    viewingNow?: number;
}

export default function ScarcityBadge({ type, stock, viewingNow }: ScarcityBadgeProps) {
    const getBadgeConfig = () => {
        switch (type) {
            case 'stock':
                if (!stock || stock > 10) return null;
                return {
                    text: stock <= 3 ? `¡Solo ${stock} unidades!` : `${stock} disponibles`,
                    color: stock <= 3 ? 'bg-red-500' : 'bg-orange-500',
                    icon: '⚠️',
                    shouldPulse: stock <= 3,
                };

            case 'trending':
                return {
                    text: viewingNow ? `${viewingNow} viendo ahora` : 'Tendencia',
                    color: 'bg-orange-500',
                    icon: '🔥',
                    shouldPulse: true,
                };

            case 'limited':
                return {
                    text: 'Edición Limitada',
                    color: 'bg-purple-500',
                    icon: '✨',
                    shouldPulse: false,
                };

            case 'new':
                return {
                    text: 'Nuevo',
                    color: 'bg-green-500',
                    icon: '🆕',
                    shouldPulse: false,
                };

            default:
                return null;
        }
    };

    const config = getBadgeConfig();

    if (!config) return null;

    const BadgeContent = (
        <span
            className={`inline-flex items-center gap-1 px-3 py-1 ${config.color} text-white text-xs font-semibold rounded-full shadow-lg`}
        >
            <span>{config.icon}</span>
            <span>{config.text}</span>
        </span>
    );

    if (config.shouldPulse) {
        return (
            <motion.div
                variants={pulse}
                animate="animate"
            >
                {BadgeContent}
            </motion.div>
        );
    }

    return BadgeContent;
}
