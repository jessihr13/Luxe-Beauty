// Loading Spinner Component
// components/ui/LoadingSpinner.tsx

'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export function LoadingSpinner({ message, size = 'md', fullScreen = false }: LoadingSpinnerProps) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <Loader2 className={`${sizes[size]} animate-spin text-rose-gold-600`} />
            {message && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-600 font-medium"
                >
                    {message}
                </motion.p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
}

export function LoadingButton({
    loading,
    children,
    ...props
}: {
    loading: boolean;
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`relative ${props.className || ''}`}
        >
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            )}
            <span className={loading ? 'opacity-0' : ''}>{children}</span>
        </button>
    );
}

export function LoadingOverlay({ message }: { message?: string }) {
    return (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
            <LoadingSpinner message={message} size="lg" />
        </div>
    );
}

export function LoadingDots() {
    return (
        <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 bg-rose-gold-600 rounded-full"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    );
}
