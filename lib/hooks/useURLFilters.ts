import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Hook para sincronizar filtros con URL params
 * Permite compartir filtros via URL
 */
export function useURLFilters<T extends Record<string, any>>(
    filters: T,
    setFilters: (filters: T) => void,
    defaultFilters: T
) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Cargar filtros desde URL al montar
    useEffect(() => {
        const urlFilters: Partial<T> = {};
        let hasFilters = false;

        searchParams.forEach((value, key) => {
            hasFilters = true;

            // Parsear valores según tipo
            if (key.includes('Range')) {
                // Para rangos (ej: priceRange)
                const [min, max] = value.split('-').map(Number);
                urlFilters[key as keyof T] = { min, max } as any;
            } else if (value === 'true' || value === 'false') {
                // Booleanos
                urlFilters[key as keyof T] = (value === 'true') as any;
            } else if (!isNaN(Number(value))) {
                // Números
                urlFilters[key as keyof T] = Number(value) as any;
            } else {
                // Strings
                urlFilters[key as keyof T] = value as any;
            }
        });

        if (hasFilters) {
            setFilters({ ...defaultFilters, ...urlFilters });
        }
    }, []); // Solo al montar

    // Actualizar URL cuando cambien los filtros
    useEffect(() => {
        const params = new URLSearchParams();
        let hasNonDefaultFilters = false;

        Object.entries(filters).forEach(([key, value]) => {
            const defaultValue = defaultFilters[key as keyof T];

            // Solo agregar si es diferente del valor por defecto
            if (JSON.stringify(value) !== JSON.stringify(defaultValue)) {
                hasNonDefaultFilters = true;

                if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
                    // Rangos
                    params.set(key, `${value.min}-${value.max}`);
                } else {
                    // Otros valores
                    params.set(key, String(value));
                }
            }
        });

        // Actualizar URL sin recargar página
        const newUrl = hasNonDefaultFilters
            ? `?${params.toString()}`
            : window.location.pathname;

        router.replace(newUrl, { scroll: false });
    }, [filters]);

    // Función para copiar URL al portapapeles
    const copyFilterURL = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            return { success: true, message: 'Enlace copiado al portapapeles' };
        } catch (error) {
            return { success: false, message: 'Error al copiar enlace' };
        }
    };

    return {
        copyFilterURL,
    };
}
