import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { useURLFilters } from './useURLFilters';

// Interfaz básica de Campaign (ajustar según tu estructura real)
export interface Campaign {
    id: string;
    name: string;
    type: string;
    status: string;
    budget: number;
    spent: number;
    impressions: number;
    clicks: number;
    conversions: number;
    startDate: Date;
    endDate: Date;
}

export interface CampaignFilters {
    search: string;
    type: string; // 'all' | 'email' | 'social' | 'display' | 'search'
    status: string; // 'all' | 'active' | 'paused' | 'completed' | 'draft'
    budgetRange: { min: number; max: number };
    dateRange: { start: string; end: string };
    sortBy: string; // 'name-asc' | 'name-desc' | 'budget-desc' | 'budget-asc' | 'conversions-desc'
}

const DEFAULT_FILTERS: CampaignFilters = {
    search: '',
    type: 'all',
    status: 'all',
    budgetRange: { min: 0, max: 50000 },
    dateRange: { start: '', end: '' },
    sortBy: 'name-asc',
};

export function useCampaignFilters(campaigns: Campaign[]) {
    const [filters, setFilters] = useState<CampaignFilters>(DEFAULT_FILTERS);

    // URL sync
    const { copyFilterURL } = useURLFilters(filters, setFilters, DEFAULT_FILTERS);

    // Debounce search
    const debouncedSearch = useDebounce(filters.search, 300);

    // Filtrar y ordenar campañas
    const filteredCampaigns = useMemo(() => {
        let result = [...campaigns];

        // Búsqueda full-text
        if (debouncedSearch) {
            const searchLower = debouncedSearch.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(searchLower) ||
                c.type.toLowerCase().includes(searchLower)
            );
        }

        // Filtro por tipo
        if (filters.type !== 'all') {
            result = result.filter(c => c.type === filters.type);
        }

        // Filtro por estado
        if (filters.status !== 'all') {
            result = result.filter(c => c.status === filters.status);
        }

        // Filtro por rango de presupuesto
        result = result.filter(c =>
            c.budget >= filters.budgetRange.min &&
            c.budget <= filters.budgetRange.max
        );

        // Filtro por rango de fechas
        if (filters.dateRange.start) {
            const startDate = new Date(filters.dateRange.start);
            result = result.filter(c => new Date(c.startDate) >= startDate);
        }
        if (filters.dateRange.end) {
            const endDate = new Date(filters.dateRange.end);
            result = result.filter(c => new Date(c.endDate) <= endDate);
        }

        // Ordenamiento
        const [sortField, sortOrder] = filters.sortBy.split('-');
        result.sort((a, b) => {
            let comparison = 0;

            if (sortField === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortField === 'budget') {
                comparison = a.budget - b.budget;
            } else if (sortField === 'conversions') {
                comparison = a.conversions - b.conversions;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        return result;
    }, [campaigns, debouncedSearch, filters]);

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    const updateFilter = <K extends keyof CampaignFilters>(
        key: K,
        value: CampaignFilters[K]
    ) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        filteredCampaigns,
        totalResults: filteredCampaigns.length,
        totalCampaigns: campaigns.length,
        copyFilterURL,
    };
}
