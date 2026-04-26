// Animated Button Component
// components/ui/AnimatedButton.tsx

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { hoverScale, tapScale } from '@/lib/animations/advanced';

interface AnimatedButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export function AnimatedButton({ 
    variant = 'primary', 
    children, 
    className = '',
    onClick,
    type = 'button',
    disabled = false
}: AnimatedButtonProps) {
    const variants = {
        primary: 'btn-primary',
        secondary: 'px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50',
        danger: 'px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700',
        ghost: 'px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg'
    };

    return (
        <motion.button
            className={`${variants[variant]} ${className} transition-colors`}
            whileHover={disabled ? undefined : hoverScale}
            whileTap={disabled ? undefined : tapScale}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}
