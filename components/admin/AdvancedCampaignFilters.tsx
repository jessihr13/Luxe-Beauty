'use client';

import FilterPanel from '@/components/filters/FilterPanel';
import SearchBar from '@/components/filters/SearchBar';
import SelectFilter from '@/components/filters/SelectFilter';
import RangeFilter from '@/components/filters/RangeFilter';
import ShareFiltersButton from '@/components/filters/ShareFiltersButton';
import type { CampaignFilters } from '@/lib/hooks/useCampaignFilters';

interface AdvancedCampaignFiltersProps {
    filters: CampaignFilters;
    onFilterChange: <K extends keyof CampaignFilters>(key: K, value: CampaignFilters[K]) => void;
    onReset: () => void;
    totalResults: number;
    totalCampaigns: number;
    onShareFilters: () => Promise<{ success: boolean; message: string }>;
}

export default function AdvancedCampaignFilters({
    filters,
    onFilterChange,
    onReset,
    totalResults,
    totalCampaigns,
    onShareFilters
}: AdvancedCampaignFiltersProps) {
    return (
        <div className="space-y-6">
            {/* Barra de búsqueda */}
            <SearchBar
                value={filters.search}
                onChange={(value) => onFilterChange('search', value)}
                placeholder="Buscar por nombre o tipo..."
            />

            {/* Botón de compartir filtros */}
            <ShareFiltersButton onShare={onShareFilters} className="w-full" />

            {/* Panel de filtros */}
            <FilterPanel onReset={onReset} title="Filtros Avanzados">
                {/* Tipo de campaña */}
                <SelectFilter
                    label="Tipo de Campaña"
                    value={filters.type}
                    onChange={(value) => onFilterChange('type', value)}
                    options={[
                        { value: 'all', label: 'Todos los tipos' },
                        { value: 'email', label: '📧 Email Marketing' },
                        { value: 'social', label: '📱 Redes Sociales' },
                        { value: 'display', label: '🖼️ Display Ads' },
                        { value: 'search', label: '🔍 Search Ads' },
                    ]}
                />

                {/* Estado */}
                <SelectFilter
                    label="Estado"
                    value={filters.status}
                    onChange={(value) => onFilterChange('status', value)}
                    options={[
                        { value: 'all', label: 'Todos los estados' },
                        { value: 'active', label: '🟢 Activa' },
                        { value: 'paused', label: '⏸️ Pausada' },
                        { value: 'completed', label: '✅ Completada' },
                        { value: 'draft', label: '📝 Borrador' },
                    ]}
                />

                {/* Rango de presupuesto */}
                <RangeFilter
                    label="Presupuesto"
                    min={0}
                    max={50000}
                    value={filters.budgetRange}
                    onChange={(value) => onFilterChange('budgetRange', value)}
                    step={500}
                    prefix="$"
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

                {/* Ordenamiento */}
                <SelectFilter
                    label="Ordenar por"
                    value={filters.sortBy}
                    onChange={(value) => onFilterChange('sortBy', value)}
                    options={[
                        { value: 'name-asc', label: 'Nombre (A-Z)' },
                        { value: 'name-desc', label: 'Nombre (Z-A)' },
                        { value: 'budget-desc', label: 'Presupuesto (Mayor a Menor)' },
                        { value: 'budget-asc', label: 'Presupuesto (Menor a Mayor)' },
                        { value: 'conversions-desc', label: 'Conversiones (Mayor a Menor)' },
                    ]}
                />
            </FilterPanel>

            {/* Resultados */}
            <div className="text-sm text-gray-600 text-center">
                Mostrando <span className="font-semibold text-rose-gold-600">{totalResults}</span> de{' '}
                <span className="font-semibold">{totalCampaigns}</span> campañas
            </div>
        </div>
    );
}
