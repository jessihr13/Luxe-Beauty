'use client';

import FilterPanel from '@/components/filters/FilterPanel';
import SearchBar from '@/components/filters/SearchBar';
import SelectFilter from '@/components/filters/SelectFilter';
import RangeFilter from '@/components/filters/RangeFilter';
import ShareFiltersButton from '@/components/filters/ShareFiltersButton';
import type { ProductFilters } from '@/lib/hooks/useProductFilters';

interface AdvancedProductFiltersProps {
    filters: ProductFilters;
    onFilterChange: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
    onReset: () => void;
    totalResults: number;
    totalProducts: number;
    onShareFilters: () => Promise<{ success: boolean; message: string }>;
}

export default function AdvancedProductFilters({
    filters,
    onFilterChange,
    onReset,
    totalResults,
    totalProducts,
    onShareFilters
}: AdvancedProductFiltersProps) {
    return (
        <div className="space-y-6">
            {/* Barra de búsqueda */}
            <SearchBar
                value={filters.search}
                onChange={(value) => onFilterChange('search', value)}
                placeholder="Buscar por nombre, descripción o categoría..."
            />

            {/* Botón de compartir filtros */}
            <ShareFiltersButton onShare={onShareFilters} className="w-full" />

            {/* Panel de filtros */}
            <FilterPanel onReset={onReset} title="Filtros Avanzados">
                {/* Categoría */}
                <SelectFilter
                    label="Categoría"
                    value={filters.category}
                    onChange={(value) => onFilterChange('category', value)}
                    options={[
                        { value: 'skincare', label: 'Skincare' },
                        { value: 'makeup', label: 'Makeup' },
                        { value: 'fragrance', label: 'Fragancias' },
                    ]}
                    placeholder="Todas las categorías"
                />

                {/* Rango de precio */}
                <RangeFilter
                    label="Rango de Precio"
                    min={0}
                    max={1000}
                    value={filters.priceRange}
                    onChange={(value) => onFilterChange('priceRange', value)}
                    prefix="$"
                    step={5}
                />

                {/* Rango de stock */}
                <RangeFilter
                    label="Rango de Stock"
                    min={0}
                    max={1000}
                    value={filters.stockRange}
                    onChange={(value) => onFilterChange('stockRange', value)}
                    suffix=" unidades"
                    step={1}
                />

                {/* Estado de stock */}
                <SelectFilter
                    label="Estado de Stock"
                    value={filters.stockStatus}
                    onChange={(value) => onFilterChange('stockStatus', value)}
                    options={[
                        { value: 'all', label: 'Todos' },
                        { value: 'in-stock', label: '🟢 En Stock (>10)' },
                        { value: 'low-stock', label: '🟡 Stock Bajo (1-10)' },
                        { value: 'out-of-stock', label: '🔴 Agotado (0)' },
                    ]}
                />

                {/* Ordenamiento */}
                <SelectFilter
                    label="Ordenar por"
                    value={filters.sortBy}
                    onChange={(value) => onFilterChange('sortBy', value)}
                    options={[
                        { value: 'name-asc', label: 'Nombre (A-Z)' },
                        { value: 'name-desc', label: 'Nombre (Z-A)' },
                        { value: 'price-asc', label: 'Precio (Menor a Mayor)' },
                        { value: 'price-desc', label: 'Precio (Mayor a Menor)' },
                        { value: 'stock-asc', label: 'Stock (Menor a Mayor)' },
                        { value: 'stock-desc', label: 'Stock (Mayor a Menor)' },
                    ]}
                />
            </FilterPanel>

            {/* Contador de resultados */}
            <div className="text-sm text-gray-600 text-center">
                Mostrando <span className="font-semibold text-rose-gold-600">{totalResults}</span> de{' '}
                <span className="font-semibold">{totalProducts}</span> productos
            </div>
        </div>
    );
}
