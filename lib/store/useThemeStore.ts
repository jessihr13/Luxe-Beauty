import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type PrimaryColor = 'rose' | 'blue' | 'green' | 'purple' | 'orange';

interface ThemeState {
    mode: ThemeMode;
    primaryColor: PrimaryColor;
    setMode: (mode: ThemeMode) => void;
    setPrimaryColor: (color: PrimaryColor) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'light',
            primaryColor: 'rose',
            setMode: (mode) => set({ mode }),
            setPrimaryColor: (primaryColor) => set({ primaryColor }),
        }),
        {
            name: 'theme-storage',
        }
    )
);

export const themeColors = {
    rose: {
        primary: 'bg-rose-gold-600',
        hover: 'hover:bg-rose-gold-700',
        text: 'text-rose-gold-600',
        light: 'bg-rose-gold-50',
        border: 'border-rose-gold-200',
        ring: 'ring-rose-gold-500',
    },
    blue: {
        primary: 'bg-blue-600',
        hover: 'hover:bg-blue-700',
        text: 'text-blue-600',
        light: 'bg-blue-50',
        border: 'border-blue-200',
        ring: 'ring-blue-500',
    },
    green: {
        primary: 'bg-emerald-600',
        hover: 'hover:bg-emerald-700',
        text: 'text-emerald-600',
        light: 'bg-emerald-50',
        border: 'border-emerald-200',
        ring: 'ring-emerald-500',
    },
    purple: {
        primary: 'bg-purple-600',
        hover: 'hover:bg-purple-700',
        text: 'text-purple-600',
        light: 'bg-purple-50',
        border: 'border-purple-200',
        ring: 'ring-purple-500',
    },
    orange: {
        primary: 'bg-orange-600',
        hover: 'hover:bg-orange-700',
        text: 'text-orange-600',
        light: 'bg-orange-50',
        border: 'border-orange-200',
        ring: 'ring-orange-500',
    },
};
