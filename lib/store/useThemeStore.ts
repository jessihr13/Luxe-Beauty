import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'rose-gold' | 'lavender' | 'emerald' | 'coral' | 'midnight';
export type FontFamily = 'serif' | 'sans' | 'mono';
export type FontSize = 90 | 100 | 110 | 120;
export type Density = 'compact' | 'normal' | 'comfortable';
export type BorderRadius = 'square' | 'rounded' | 'full';

interface ThemeState {
    // Theme settings
    mode: ThemeMode;
    colorScheme: ColorScheme;
    fontFamily: FontFamily;
    fontSize: FontSize;
    density: Density;
    animations: boolean;
    borderRadius: BorderRadius;

    // Actions
    setMode: (mode: ThemeMode) => void;
    setColorScheme: (scheme: ColorScheme) => void;
    setFontFamily: (font: FontFamily) => void;
    setFontSize: (size: FontSize) => void;
    setDensity: (density: Density) => void;
    setAnimations: (enabled: boolean) => void;
    setBorderRadius: (radius: BorderRadius) => void;
    resetToDefaults: () => void;
}

const defaultTheme = {
    mode: 'light' as ThemeMode,
    colorScheme: 'rose-gold' as ColorScheme,
    fontFamily: 'serif' as FontFamily,
    fontSize: 100 as FontSize,
    density: 'normal' as Density,
    animations: true,
    borderRadius: 'rounded' as BorderRadius,
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            ...defaultTheme,

            setMode: (mode) => set({ mode }),
            setColorScheme: (colorScheme) => set({ colorScheme }),
            setFontFamily: (fontFamily) => set({ fontFamily }),
            setFontSize: (fontSize) => set({ fontSize }),
            setDensity: (density) => set({ density }),
            setAnimations: (animations) => set({ animations }),
            setBorderRadius: (borderRadius) => set({ borderRadius }),
            resetToDefaults: () => set(defaultTheme),
        }),
        {
            name: 'luxe-beauty-theme',
        }
    )
);

// Color scheme definitions with CSS variables
export const colorSchemes = {
    'rose-gold': {
        name: 'Rose Gold',
        description: 'Elegante y sofisticado',
        primary: '#D4AF37',
        secondary: '#C9A0DC',
        accent: '#E8B4B8',
        background: '#FFF8F0',
        preview: 'linear-gradient(135deg, #D4AF37 0%, #E8B4B8 100%)',
    },
    'lavender': {
        name: 'Lavender Dream',
        description: 'Suave y relajante',
        primary: '#9B7EBD',
        secondary: '#D4A5D4',
        accent: '#E8C4E8',
        background: '#F8F4FF',
        preview: 'linear-gradient(135deg, #9B7EBD 0%, #E8C4E8 100%)',
    },
    'emerald': {
        name: 'Emerald Elegance',
        description: 'Fresco y natural',
        primary: '#2D6A4F',
        secondary: '#52B788',
        accent: '#95D5B2',
        background: '#F1FAF5',
        preview: 'linear-gradient(135deg, #2D6A4F 0%, #95D5B2 100%)',
    },
    'coral': {
        name: 'Coral Sunset',
        description: 'Vibrante y cálido',
        primary: '#FF6B6B',
        secondary: '#FFB6B9',
        accent: '#FEC8D8',
        background: '#FFF5F5',
        preview: 'linear-gradient(135deg, #FF6B6B 0%, #FEC8D8 100%)',
    },
    'midnight': {
        name: 'Midnight Blue',
        description: 'Profesional y moderno',
        primary: '#1E3A8A',
        secondary: '#3B82F6',
        accent: '#93C5FD',
        background: '#F0F4FF',
        preview: 'linear-gradient(135deg, #1E3A8A 0%, #93C5FD 100%)',
    },
};

// Font family configurations
export const fontFamilies = {
    serif: {
        name: 'Serif',
        description: 'Elegante y clásica',
        css: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    },
    sans: {
        name: 'Sans Serif',
        description: 'Moderna y limpia',
        css: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    mono: {
        name: 'Monospace',
        description: 'Técnica y precisa',
        css: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
};

// Density configurations
export const densityConfig = {
    compact: {
        name: 'Compacto',
        description: 'Más información en pantalla',
        spacing: 0.75,
        padding: 0.75,
    },
    normal: {
        name: 'Normal',
        description: 'Balance perfecto',
        spacing: 1,
        padding: 1,
    },
    comfortable: {
        name: 'Cómodo',
        description: 'Más espacio y legibilidad',
        spacing: 1.25,
        padding: 1.25,
    },
};

// Border radius configurations
export const borderRadiusConfig = {
    square: {
        name: 'Cuadrado',
        description: 'Bordes rectos',
        value: '0px',
    },
    rounded: {
        name: 'Redondeado',
        description: 'Bordes suaves',
        value: '0.5rem',
    },
    full: {
        name: 'Muy Redondeado',
        description: 'Bordes circulares',
        value: '1rem',
    },
};
