// Toast Notification System
// components/ui/Toast.tsx

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const toastConfig = {
    success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        textColor: 'text-green-800',
        iconColor: 'text-green-500',
    },
    error: {
        icon: XCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-500',
        textColor: 'text-red-800',
        iconColor: 'text-red-500',
    },
    warning: {
        icon: AlertCircle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-500',
    },
    info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-500',
    },
};

export function ToastComponent({ toast, onClose }: ToastProps) {
    const config = toastConfig[toast.type];
    const Icon = config.icon;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`
                ${config.bgColor} ${config.borderColor} ${config.textColor}
                border-l-4 p-4 rounded-lg shadow-lg
                flex items-start gap-3 min-w-[320px] max-w-md
            `}
        >
            <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => onClose(toast.id)}
                className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastComponent key={toast.id} toast={toast} onClose={onClose} />
                ))}
            </AnimatePresence>
        </div>
    );
}
