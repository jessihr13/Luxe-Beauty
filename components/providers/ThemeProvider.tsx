'use client';

import { useEffect, useState } from 'react';
import { useThemeStore, colorSchemes, fontFamilies, densityConfig, borderRadiusConfig } from '@/lib/store/useThemeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { colorScheme, fontFamily, fontSize, density, animations, borderRadius, mode } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const scheme = colorSchemes[colorScheme];
        const font = fontFamilies[fontFamily];
        const densityMultiplier = densityConfig[density].spacing;
        const radiusValue = borderRadiusConfig[borderRadius].value;

        // Apply color scheme via CSS variables
        root.style.setProperty('--color-primary', scheme.primary);
        root.style.setProperty('--color-secondary', scheme.secondary);
        root.style.setProperty('--color-accent', scheme.accent);
        root.style.setProperty('--color-background', scheme.background);

        // Apply typography
        root.style.setProperty('--font-family-base', font.css);
        root.style.setProperty('--font-size-base', `${fontSize}%`);

        // Apply density (spacing multiplier)
        root.style.setProperty('--spacing-multiplier', densityMultiplier.toString());

        // Apply border radius
        root.style.setProperty('--border-radius-base', radiusValue);

        // Apply animations
        root.style.setProperty('--transition-duration', animations ? '300ms' : '0ms');

        // Apply theme mode class
        root.classList.remove('dark', 'light');

        if (mode === 'dark') {
            root.classList.add('dark');
        } else if (mode === 'light') {
            root.classList.add('light');
        } else if (mode === 'auto') {
            // Auto mode - detect system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(prefersDark ? 'dark' : 'light');
        }
    }, [mounted, colorScheme, fontFamily, fontSize, density, animations, borderRadius, mode]);

    if (!mounted) {
        return <>{children}</>;
    }

    return <>{children}</>;
}
