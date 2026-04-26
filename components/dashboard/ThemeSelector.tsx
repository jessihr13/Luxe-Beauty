'use client';

import Link from 'next/link';
import { useThemeStore, colorSchemes, type ColorScheme } from '@/lib/store/useThemeStore';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function ThemeSelector() {
    const { colorScheme, setColorScheme } = useThemeStore();
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

    const schemes = Object.entries(colorSchemes).map(([key, scheme]) => ({
        value: key as ColorScheme,
        label: scheme.name,
        preview: scheme.preview,
    }));

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full transition-colors bg-rose-gold-100 text-rose-gold-700 hover:bg-rose-gold-200 border border-rose-gold-200"
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
                        className="absolute right-0 mt-2 w-72 bg-white dark:bg-luxe-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-luxe-dark-700 p-4 z-50"
                    >
                        <div className="space-y-4">
                            {/* Color Scheme Selector */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    Esquema de Color
                                </h3>
                                <div className="space-y-2">
                                    {schemes.map((scheme) => (
                                        <button
                                            key={scheme.value}
                                            onClick={() => {
                                                setColorScheme(scheme.value);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${colorScheme === scheme.value
                                                ? 'bg-rose-gold-50 border-2 border-rose-gold-500'
                                                : 'border-2 border-transparent hover:bg-gray-50'
                                                }`}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-lg flex-shrink-0"
                                                style={{ background: scheme.preview }}
                                            />
                                            <div className="flex-1 text-left">
                                                <div className="font-medium text-sm">{scheme.label}</div>
                                            </div>
                                            {colorScheme === scheme.value && (
                                                <Check className="w-5 h-5 text-rose-gold-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Link to full settings */}
                            <div className="pt-2 border-t border-gray-200">
                                <Link
                                    href="/admin/configuracion/apariencia"
                                    className="text-xs text-rose-gold-600 hover:text-rose-gold-700 font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Ver todas las opciones de apariencia →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
