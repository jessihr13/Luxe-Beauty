'use client';

import { useThemeStore, themeColors, type PrimaryColor } from '@/lib/store/useThemeStore';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function ThemeSelector() {
    const { primaryColor, setPrimaryColor } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const colors: { value: PrimaryColor; label: string; bg: string }[] = [
        { value: 'rose', label: 'Rose Gold', bg: 'bg-rose-400' },
        { value: 'blue', label: 'Azul Real', bg: 'bg-blue-500' },
        { value: 'green', label: 'Esmeralda', bg: 'bg-emerald-500' },
        { value: 'purple', label: 'Lavanda', bg: 'bg-purple-500' },
        { value: 'orange', label: 'Terracota', bg: 'bg-orange-500' },
    ];

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors ${themeColors[primaryColor].light} ${themeColors[primaryColor].text}`}
                title="Personalizar Colores"
            >
                <Palette className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-luxe-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-luxe-dark-700 p-4 z-50"
                    >
                        <div className="space-y-4">
                            {/* Color Selector */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Color Principal
                                </h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {colors.map((c) => (
                                        <button
                                            key={c.value}
                                            onClick={() => setPrimaryColor(c.value)}
                                            className="group relative flex items-center justify-center"
                                            title={c.label}
                                        >
                                            <div className={`w-8 h-8 rounded-full ${c.bg} transition-transform group-hover:scale-110 flex items-center justify-center`}>
                                                {primaryColor === c.value && (
                                                    <Check className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
