// Page Transition Wrapper
// components/ui/PageTransition.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '@/lib/animations/advanced';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
    return (
        <motion.div
            className={className}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    );
}

// List with stagger animation
export function AnimatedList({ children, className = '' }: PageTransitionProps) {
    return (
        <motion.div
            className={className}
            initial="initial"
            animate="animate"
            variants={{
                animate: {
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
        >
            {children}
        </motion.div>
    );
}

// List Item
export function AnimatedListItem({ children, className = '' }: PageTransitionProps) {
    return (
        <motion.div
            className={className}
            variants={{
                initial: { x: -20, opacity: 0 },
                animate: { 
                    x: 0, 
                    opacity: 1,
                    transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                    }
                }
            }}
        >
            {children}
        </motion.div>
    );
}
