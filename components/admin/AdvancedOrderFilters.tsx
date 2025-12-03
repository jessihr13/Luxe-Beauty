'use client';

import FilterPanel from '@/components/filters/FilterPanel';
import SearchBar from '@/components/filters/SearchBar';
import SelectFilter from '@/components/filters/SelectFilter';
import RangeFilter from '@/components/filters/RangeFilter';
import ShareFiltersButton from '@/components/filters/ShareFiltersButton';
import type { OrderFilters } from '@/lib/hooks/useOrderFilters';

interface AdvancedOrderFiltersProps {
    filters: OrderFilters;
    onFilterChange: <K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) => void;
    onReset: () => void;
    totalResults: number;
    totalOrders: number;
    onShareFilters: () => Promise<{ success: boolean; message: string }>;
}

export default function AdvancedOrderFilters({
    filters,
    onFilterChange,
    onReset,
    totalResults,
    totalOrders,
    onShareFilters
}: AdvancedOrderFiltersProps) {
    return (
        <div className="space-y-6">
            {/* Barra de búsqueda */}
            <SearchBar
                value={filters.search}
                onChange={(value) => onFilterChange('search', value)}
                placeholder="Buscar por número, cliente o email..."
            />

            {/* Botón de compartir filtros */}
            <ShareFiltersButton onShare={onShareFilters} className="w-full" />

            {/* Panel de filtros */}
            <FilterPanel onReset={onReset} title="Filtros Avanzados">
                {/* Estado */}
                <SelectFilter
                    label="Estado del Pedido"
                    value={filters.status}
                    onChange={(value) => onFilterChange('status', value)}
                    options={[
                        { value: 'all', label: 'Todos los estados' },
                        { value: 'pending', label: '⏳ Pendiente' },
                        { value: 'processing', label: '⚙️ Procesando' },
                        { value: 'shipped', label: '📦 Enviado' },
                        { value: 'delivered', label: '✅ Entregado' },
                        { value: 'cancelled', label: '❌ Cancelado' },
                    ]}
                />

                {/* Método de pago */}
                <SelectFilter
                    label="Método de Pago"
                    value={filters.paymentMethod}
                    onChange={(value) => onFilterChange('paymentMethod', value)}
                    options={[
                        { value: 'all', label: 'Todos los métodos' },
                        { value: 'credit-card', label: '💳 Tarjeta de Crédito' },
                        { value: 'debit-card', label: '💳 Tarjeta de Débito' },
                        { value: 'paypal', label: '🅿️ PayPal' },
                        { value: 'transfer', label: '🏦 Transferencia' },
                    ]}
                />

                {/* Rango de fechas */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Rango de Fechas</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Desde</label>
                            <input
                                type="date"
                                value={filters.dateRange.start}
                                onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                            <input
                                type="date"
                                value={filters.dateRange.end}
                                onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Rango de monto */}
                <RangeFilter
                    label="Monto Total"
                    min={0}
                    max={10000}
                    value={filters.amountRange}
                    onChange={(value) => onFilterChange('amountRange', value)}
                    step={50}
                    prefix="$"
                />

                {/* Ordenamiento */}
                <SelectFilter
                    label="Ordenar por"
                    value={filters.sortBy}
                    onChange={(value) => onFilterChange('sortBy', value)}
                    options={[
                        { value: 'date-desc', label: 'Fecha (Más reciente)' },
                        { value: 'date-asc', label: 'Fecha (Más antiguo)' },
                        { value: 'amount-desc', label: 'Monto (Mayor a Menor)' },
                        { value: 'amount-asc', label: 'Monto (Menor a Mayor)' },
                    ]}
                />
            </FilterPanel>

            {/* Resultados */}
            <div className="text-sm text-gray-600 text-center">
                Mostrando <span className="font-semibold text-rose-gold-600">{totalResults}</span> de{' '}
                <span className="font-semibold">{totalOrders}</span> pedidos
            </div>
        </div>
    );
}
