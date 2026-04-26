import type { Product } from '../data/products';

export interface ProductProfitability {
    productId: string;
    productName: string;
    category: string;
    revenue: number;
    cost: number;
    grossProfit: number;
    grossMargin: number;
    unitsSold: number;
    avgSellingPrice: number;
    roi: number;
    profitPerUnit: number;
    abcCategory: 'A' | 'B' | 'C';
}

/**
 * Calcula la rentabilidad de cada producto
 */
export function calculateProductProfitability(products: Product[]): ProductProfitability[] {
    const profitability: ProductProfitability[] = [];

    products.forEach(product => {
        const unitsSold = product.neuromarketing.socialProof.purchaseCount;
        const revenue = product.price * unitsSold;
        const cost = (product.cost || 0) * unitsSold;
        const grossProfit = revenue - cost;
        const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        const roi = cost > 0 ? (grossProfit / cost) * 100 : 0;
        const profitPerUnit = product.price - (product.cost || 0);

        profitability.push({
            productId: product.id,
            productName: product.name,
            category: product.category,
            revenue,
            cost,
            grossProfit,
            grossMargin,
            unitsSold,
            avgSellingPrice: product.price,
            roi,
            profitPerUnit,
            abcCategory: 'C', // Se calculará después
        });
    });

    // Ordenar por ganancia bruta
    profitability.sort((a, b) => b.grossProfit - a.grossProfit);

    // Aplicar análisis ABC (Pareto)
    const totalProfit = profitability.reduce((sum, p) => sum + p.grossProfit, 0);
    let cumulativeProfit = 0;

    profitability.forEach(p => {
        cumulativeProfit += p.grossProfit;
        const cumulativePercent = (cumulativeProfit / totalProfit) * 100;

        if (cumulativePercent <= 80) {
            p.abcCategory = 'A'; // Top 80% de ganancias
        } else if (cumulativePercent <= 95) {
            p.abcCategory = 'B'; // Siguiente 15%
        } else {
            p.abcCategory = 'C'; // Último 5%
        }
    });

    return profitability;
}

/**
 * Obtiene resumen de rentabilidad por categoría
 */
export function getProfitabilityByCategory(profitability: ProductProfitability[]): {
    category: string;
    revenue: number;
    profit: number;
    margin: number;
    productCount: number;
}[] {
    const categories = new Map<string, {
        revenue: number;
        profit: number;
        productCount: number;
    }>();

    profitability.forEach(p => {
        const existing = categories.get(p.category) || { revenue: 0, profit: 0, productCount: 0 };
        categories.set(p.category, {
            revenue: existing.revenue + p.revenue,
            profit: existing.profit + p.grossProfit,
            productCount: existing.productCount + 1,
        });
    });

    return Array.from(categories.entries()).map(([category, data]) => ({
        category,
        revenue: data.revenue,
        profit: data.profit,
        margin: data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0,
        productCount: data.productCount,
    })).sort((a, b) => b.profit - a.profit);
}

/**
 * Identifica productos con bajo rendimiento
 */
export function identifyLowPerformers(profitability: ProductProfitability[]): ProductProfitability[] {
    return profitability.filter(p => {
        // Criterios de bajo rendimiento:
        // 1. Margen bruto < 30%
        // 2. ROI < 50%
        // 3. Categoría C en análisis ABC
        return p.grossMargin < 30 || p.roi < 50 || p.abcCategory === 'C';
    }).sort((a, b) => a.grossMargin - b.grossMargin);
}

/**
 * Identifica productos estrella (alto margen y alto volumen)
 */
export function identifyStarProducts(profitability: ProductProfitability[]): ProductProfitability[] {
    const avgMargin = profitability.reduce((sum, p) => sum + p.grossMargin, 0) / profitability.length;
    const avgUnits = profitability.reduce((sum, p) => sum + p.unitsSold, 0) / profitability.length;

    return profitability.filter(p => {
        return p.grossMargin > avgMargin && p.unitsSold > avgUnits;
    }).sort((a, b) => b.grossProfit - a.grossProfit);
}

/**
 * Calcula métricas globales de rentabilidad
 */
export function calculateGlobalMetrics(profitability: ProductProfitability[]): {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    avgMargin: number;
    avgROI: number;
    productsAnalyzed: number;
    categoryA: number;
    categoryB: number;
    categoryC: number;
} {
    const totalRevenue = profitability.reduce((sum, p) => sum + p.revenue, 0);
    const totalCost = profitability.reduce((sum, p) => sum + p.cost, 0);
    const totalProfit = profitability.reduce((sum, p) => sum + p.grossProfit, 0);
    const avgMargin = profitability.reduce((sum, p) => sum + p.grossMargin, 0) / profitability.length;
    const avgROI = profitability.reduce((sum, p) => sum + p.roi, 0) / profitability.length;

    return {
        totalRevenue,
        totalCost,
        totalProfit,
        avgMargin,
        avgROI,
        productsAnalyzed: profitability.length,
        categoryA: profitability.filter(p => p.abcCategory === 'A').length,
        categoryB: profitability.filter(p => p.abcCategory === 'B').length,
        categoryC: profitability.filter(p => p.abcCategory === 'C').length,
    };
}
