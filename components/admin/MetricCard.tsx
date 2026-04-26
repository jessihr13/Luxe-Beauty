'use client';

import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: string;
    color?: 'rose' | 'terracotta' | 'green' | 'blue';
}

export default function MetricCard({
    title,
    value,
    change,
    icon,
    color = 'rose'
}: MetricCardProps) {
    const colorClasses = {
        rose: 'bg-rose-gold-100 text-rose-gold-700',
        terracotta: 'bg-terracotta-100 text-terracotta-700',
        green: 'bg-green-100 text-green-700',
        blue: 'bg-blue-100 text-blue-700',
    };

    const valueStr = value.toString();
    const fontSizeClass = valueStr.length > 12
        ? 'text-lg lg:text-xl'
        : valueStr.length > 8
            ? 'text-xl lg:text-2xl'
            : 'text-2xl lg:text-3xl';

    return (
        <motion.div
            variants={fadeIn}
            className="card-luxury p-6 dark:bg-luxe-dark-800 dark:border-luxe-dark-700 h-full flex flex-col justify-between"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${colorClasses[color]} dark:bg-opacity-20 flex items-center justify-center text-2xl`}>
                    {icon}
                </div>

                {change !== undefined && (
                    <span className={`text-sm font-semibold ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                    </span>
                )}
            </div>

            <div className="flex flex-col items-center text-center w-full">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
                <p className={`${fontSizeClass} font-bold text-gray-900 dark:text-white whitespace-nowrap tracking-tight`}>
                    {value}
                </p>
            </div>
        </motion.div>
    );
}
