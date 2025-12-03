'use client';

import { useThemeStore } from '@/lib/store/useThemeStore';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const { mode, setMode } = useThemeStore();

    const toggleTheme = () => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
            <motion.div
                initial={false}
                animate={{
                    scale: mode === 'dark' ? 0 : 1,
                    rotate: mode === 'dark' ? 90 : 0,
                    opacity: mode === 'dark' ? 0 : 1
                }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Sun className="w-5 h-5 text-orange-500" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    scale: mode === 'dark' ? 1 : 0,
                    rotate: mode === 'dark' ? 0 : -90,
                    opacity: mode === 'dark' ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
            >
                <Moon className="w-5 h-5 text-blue-400" />
            </motion.div>
        </button>
    );
}
