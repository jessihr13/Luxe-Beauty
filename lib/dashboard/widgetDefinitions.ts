import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, BarChart3, PieChart, List } from 'lucide-react';

export const WIDGET_TYPES = {
    KPI_REVENUE: {
        type: 'KPI_REVENUE',
        label: 'KPI: Ingresos',
        description: 'Tarjeta de métrica de ingresos totales',
        icon: DollarSign,
        defaultSize: 'small',
    },
    KPI_PROFIT: {
        type: 'KPI_PROFIT',
        label: 'KPI: Ganancia Bruta',
        description: 'Tarjeta de métrica de ganancia bruta',
        icon: TrendingUp,
        defaultSize: 'small',
    },
    KPI_NET: {
        type: 'KPI_NET',
        label: 'KPI: Ganancia Neta',
        description: 'Tarjeta de métrica de ganancia neta',
        icon: DollarSign,
        defaultSize: 'small',
    },
    KPI_MARGIN: {
        type: 'KPI_MARGIN',
        label: 'KPI: Margen',
        description: 'Tarjeta de métrica de margen neto',
        icon: BarChart3,
        defaultSize: 'small',
    },
    CHART_SALES: {
        type: 'CHART_SALES',
        label: 'Gráfico: Ventas',
        description: 'Gráfico de área de ventas vs gastos',
        icon: TrendingUp,
        defaultSize: 'medium',
    },
    CHART_CATEGORIES: {
        type: 'CHART_CATEGORIES',
        label: 'Gráfico: Categorías',
        description: 'Gráfico circular de distribución por categoría',
        icon: PieChart,
        defaultSize: 'medium',
    },
    CHART_TOP_PRODUCTS: {
        type: 'CHART_TOP_PRODUCTS',
        label: 'Gráfico: Top Productos',
        description: 'Gráfico de barras de productos más vendidos',
        icon: BarChart3,
        defaultSize: 'full',
    },
    TABLE_PERFORMANCE: {
        type: 'TABLE_PERFORMANCE',
        label: 'Tabla: Rendimiento',
        description: 'Tabla detallada de rendimiento por producto',
        icon: List,
        defaultSize: 'full',
    },
} as const;
