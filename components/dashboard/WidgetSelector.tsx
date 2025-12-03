'use client';

import { useState } from 'react';
import { useDashboardStore } from '@/lib/store/useDashboardStore';
import { WIDGET_TYPES } from '@/lib/dashboard/widgetDefinitions';
import { Plus, X } from 'lucide-react';

export default function WidgetSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { addWidget } = useDashboardStore();

    const handleAdd = (type: string, def: any) => {
        addWidget(type, def.label, def.defaultSize);
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-gold-100 text-rose-gold-700 rounded-lg hover:bg-rose-gold-200 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Agregar Widget
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-serif font-bold text-gray-800">
                                Agregar Widget
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(WIDGET_TYPES).map(([key, def]) => {
                                const Icon = def.icon;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleAdd(key, def)}
                                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-rose-gold-500 hover:bg-rose-gold-50 transition-all text-left group"
                                    >
                                        <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                            <Icon className="w-6 h-6 text-gray-600 group-hover:text-rose-gold-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {def.label}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {def.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
