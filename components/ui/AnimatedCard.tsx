// Animated Card Component
// components/ui/AnimatedCard.tsx

'use client';

import { motion } from 'framer-motion';
import { hoverLift } from '@/lib/animations/advanced';

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function AnimatedCard({ children, className = '', onClick }: AnimatedCardProps) {
    return (
        <motion.div
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer ${className}`}
            whileHover={hoverLift}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
}
