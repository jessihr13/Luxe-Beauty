'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/store/useThemeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { mode } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return <>{children}</>;
}
