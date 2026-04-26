import { useState, useMemo } from 'react';
import type { Product } from '../data/products';
import { useDebounce } from './useDebounce';
import { useURLFilters } from './useURLFilters';

export interface ProductFilters {
    search: string;
    category: string;
    subcategory: string;
    priceRange: { min: number; max: number };
    stockRange: { min: number; max: number };
    stockStatus: string; // 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
    sortBy: string; // 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'
}

const DEFAULT_FILTERS: ProductFilters = {
    search: '',
    category: '',
    subcategory: '',
    priceRange: { min: 0, max: 1000 },
    stockRange: { min: 0, max: 1000 },
    stockStatus: 'all',
    sortBy: 'name-asc',
};

export function useProductFilters(products: Product[]) {
    const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

    // URL sync
    const { copyFilterURL } = useURLFilters(filters, setFilters, DEFAULT_FILTERS);

    // Debounce search para mejor performance
    const debouncedSearch = useDebounce(filters.search, 300);

    // Filtrar y ordenar productos
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Búsqueda full-text
        if (debouncedSearch) {
            const searchLower = debouncedSearch.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower) ||
                p.subcategory.toLowerCase().includes(searchLower)
            );
        }

        // Filtro por categoría
        if (filters.category) {
            result = result.filter(p => p.category === filters.category);
        }

        // Filtro por subcategoría
        if (filters.subcategory) {
            result = result.filter(p => p.subcategory === filters.subcategory);
        }

        // Filtro por rango de precio
        result = result.filter(p =>
            p.price >= filters.priceRange.min &&
            p.price <= filters.priceRange.max
        );

        // Filtro por rango de stock
        result = result.filter(p =>
            p.stock >= filters.stockRange.min &&
            p.stock <= filters.stockRange.max
        );

        // Filtro por estado de stock
        if (filters.stockStatus !== 'all') {
            if (filters.stockStatus === 'out-of-stock') {
                result = result.filter(p => p.stock === 0);
            } else if (filters.stockStatus === 'low-stock') {
                result = result.filter(p => p.stock > 0 && p.stock <= 10);
            } else if (filters.stockStatus === 'in-stock') {
                result = result.filter(p => p.stock > 10);
            }
        }

        // Ordenamiento
        const [sortField, sortOrder] = filters.sortBy.split('-');
        result.sort((a, b) => {
            let comparison = 0;

            if (sortField === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortField === 'price') {
                comparison = a.price - b.price;
            } else if (sortField === 'stock') {
                comparison = a.stock - b.stock;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        return result;
    }, [products, debouncedSearch, filters]);

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    const updateFilter = <K extends keyof ProductFilters>(
        key: K,
        value: ProductFilters[K]
    ) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        filteredProducts,
        totalResults: filteredProducts.length,
        totalProducts: products.length,
        copyFilterURL,
    };
}
