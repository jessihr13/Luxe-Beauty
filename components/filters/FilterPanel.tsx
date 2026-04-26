'use client';

import { ReactNode } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
    children: ReactNode;
    onReset?: () => void;
    title?: string;
    isOpen?: boolean;
    onToggle?: () => void;
}

export default function FilterPanel({
    children,
    onReset,
    title = 'Filtros',
    isOpen = true,
    onToggle
}: FilterPanelProps) {
    return (
        <div className="card-luxury p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-rose-gold-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                {onReset && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-rose-gold-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Limpiar
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="space-y-6">
                    {children}
                </div>
            )}
        </div>
    );
}
