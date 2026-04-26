// Confirmation Modal Component
// components/ui/ConfirmModal.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { LoadingButton } from './LoadingSpinner';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger',
    loading = false,
}: ConfirmModalProps) {
    const typeStyles = {
        danger: {
            icon: 'bg-red-100 text-red-600',
            button: 'bg-red-600 hover:bg-red-700 text-white',
        },
        warning: {
            icon: 'bg-yellow-100 text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        },
        info: {
            icon: 'bg-blue-100 text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
        },
    };

    const styles = typeStyles[type];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${styles.icon}`}>
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {title}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {message}
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 bg-gray-50 flex gap-3 justify-end">
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    {cancelText}
                                </button>
                                <LoadingButton
                                    onClick={onConfirm}
                                    loading={loading}
                                    className={`px-4 py-2 rounded-lg transition-colors ${styles.button}`}
                                >
                                    {confirmText}
                                </LoadingButton>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

// Hook for easier usage
export function useConfirmModal() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [config, setConfig] = React.useState<Omit<ConfirmModalProps, 'isOpen' | 'onClose' | 'onConfirm'>>({
        title: '',
        message: '',
    });
    const [onConfirmCallback, setOnConfirmCallback] = React.useState<(() => void) | null>(null);

    const open = (
        confirmConfig: Omit<ConfirmModalProps, 'isOpen' | 'onClose' | 'onConfirm'>,
        onConfirm: () => void
    ) => {
        setConfig(confirmConfig);
        setOnConfirmCallback(() => onConfirm);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const confirm = () => {
        if (onConfirmCallback) {
            onConfirmCallback();
        }
        close();
    };

    return {
        isOpen,
        open,
        close,
        confirm,
        config,
    };
}

import React from 'react';
