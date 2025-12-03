import { useState, useMemo } from 'react';
import type { LegacyOrder } from '../data/orders';
import { useDebounce } from './useDebounce';
import { useURLFilters } from './useURLFilters';

export interface OrderFilters {
    search: string;
    status: string; // 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    paymentMethod: string; // 'all' | 'credit-card' | 'debit-card' | 'paypal' | 'transfer'
    dateRange: { start: string; end: string };
    amountRange: { min: number; max: number };
    sortBy: string; // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
}

const DEFAULT_FILTERS: OrderFilters = {
    search: '',
    status: 'all',
    paymentMethod: 'all',
    dateRange: { start: '', end: '' },
    amountRange: { min: 0, max: 10000 },
    sortBy: 'date-desc',
};

export function useOrderFilters(orders: LegacyOrder[]) {
    const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);

    // URL sync
    const { copyFilterURL } = useURLFilters(filters, setFilters, DEFAULT_FILTERS);

    // Debounce search
    const debouncedSearch = useDebounce(filters.search, 300);

    // Filtrar y ordenar pedidos
    const filteredOrders = useMemo(() => {
        let result = [...orders];

        // Búsqueda full-text (número de pedido, nombre de cliente, email)
        if (debouncedSearch) {
            const searchLower = debouncedSearch.toLowerCase();
            result = result.filter(o =>
                o.orderNumber.toLowerCase().includes(searchLower) ||
                o.customerName.toLowerCase().includes(searchLower) ||
                o.customerEmail.toLowerCase().includes(searchLower)
            );
        }

        // Filtro por estado
        if (filters.status !== 'all') {
            result = result.filter(o => o.status === filters.status);
        }

        // Filtro por método de pago
        if (filters.paymentMethod !== 'all') {
            result = result.filter(o => o.paymentMethod === filters.paymentMethod);
        }

        // Filtro por rango de fechas
        if (filters.dateRange.start) {
            const startDate = new Date(filters.dateRange.start);
            result = result.filter(o => new Date(o.createdAt) >= startDate);
        }
        if (filters.dateRange.end) {
            const endDate = new Date(filters.dateRange.end);
            endDate.setHours(23, 59, 59, 999); // Incluir todo el día
            result = result.filter(o => new Date(o.createdAt) <= endDate);
        }

        // Filtro por rango de monto
        result = result.filter(o =>
            o.total >= filters.amountRange.min &&
            o.total <= filters.amountRange.max
        );

        // Ordenamiento
        const [sortField, sortOrder] = filters.sortBy.split('-');
        result.sort((a, b) => {
            let comparison = 0;

            if (sortField === 'date') {
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else if (sortField === 'amount') {
                comparison = a.total - b.total;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        return result;
    }, [orders, debouncedSearch, filters]);

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    const updateFilter = <K extends keyof OrderFilters>(
        key: K,
        value: OrderFilters[K]
    ) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        filteredOrders,
        totalResults: filteredOrders.length,
        totalOrders: orders.length,
        copyFilterURL,
    };
}
