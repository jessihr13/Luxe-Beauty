import type { Product } from '../data/products';
import type { LegacyOrder } from '../data/orders';

export interface DemandForecast {
    productId: string;
    productName: string;
    historicalSales: number[];
    predictedSales: number[];
    trend: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
    recommendedStock: number;
}

/**
 * Calcula el promedio móvil simple
 */
function simpleMovingAverage(data: number[], period: number): number[] {
    const result: number[] = [];

    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push(data[i]);
        } else {
            const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            result.push(sum / period);
        }
    }

    return result;
}

/**
 * Detecta la tendencia de ventas
 */
function detectTrend(data: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (data.length < 3) return 'stable';

    const recent = data.slice(-3);
    const older = data.slice(-6, -3);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
}

/**
 * Genera predicción de demanda para productos
 */
export function generateDemandForecast(
    products: Product[],
    orders: LegacyOrder[],
    monthsToPredict: number = 3
): DemandForecast[] {
    const forecasts: DemandForecast[] = [];

    products.forEach(product => {
        // Simular ventas históricas (últimos 12 meses)
        // En producción, esto vendría de datos reales de pedidos
        const historicalSales: number[] = [];
        const baselineSales = product.neuromarketing.socialProof.purchaseCount / 12;

        for (let i = 0; i < 12; i++) {
            // Agregar variación aleatoria y estacionalidad
            const seasonality = Math.sin((i / 12) * Math.PI * 2) * 0.2 + 1;
            const randomVariation = (Math.random() - 0.5) * 0.3 + 1;
            const sales = Math.max(0, Math.round(baselineSales * seasonality * randomVariation));
            historicalSales.push(sales);
        }

        // Calcular promedio móvil
        const movingAvg = simpleMovingAverage(historicalSales, 3);

        // Predecir ventas futuras
        const predictedSales: number[] = [];
        const lastAvg = movingAvg[movingAvg.length - 1];
        const trend = detectTrend(historicalSales);

        let trendMultiplier = 1;
        if (trend === 'increasing') trendMultiplier = 1.1;
        if (trend === 'decreasing') trendMultiplier = 0.9;

        for (let i = 0; i < monthsToPredict; i++) {
            const predicted = Math.round(lastAvg * Math.pow(trendMultiplier, i + 1));
            predictedSales.push(predicted);
        }

        // Calcular confianza (basado en variabilidad histórica)
        const variance = historicalSales.reduce((sum, val) => {
            const diff = val - (historicalSales.reduce((a, b) => a + b, 0) / historicalSales.length);
            return sum + diff * diff;
        }, 0) / historicalSales.length;

        const stdDev = Math.sqrt(variance);
        const coefficientOfVariation = stdDev / (historicalSales.reduce((a, b) => a + b, 0) / historicalSales.length);
        const confidence = Math.max(0, Math.min(100, (1 - coefficientOfVariation) * 100));

        // Recomendar stock (suma de predicciones + buffer de seguridad)
        const totalPredicted = predictedSales.reduce((a, b) => a + b, 0);
        const safetyStock = Math.round(totalPredicted * 0.2); // 20% buffer
        const recommendedStock = totalPredicted + safetyStock;

        forecasts.push({
            productId: product.id,
            productName: product.name,
            historicalSales,
            predictedSales,
            trend,
            confidence,
            recommendedStock,
        });
    });

    return forecasts.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Identifica productos con riesgo de desabastecimiento
 */
export function identifyStockRisks(
    forecasts: DemandForecast[],
    currentStock: Map<string, number>
): Array<{ productId: string; productName: string; risk: 'high' | 'medium' | 'low'; daysUntilStockout: number }> {
    const risks: Array<{ productId: string; productName: string; risk: 'high' | 'medium' | 'low'; daysUntilStockout: number }> = [];

    forecasts.forEach(forecast => {
        const stock = currentStock.get(forecast.productId) || 0;
        const avgDailySales = forecast.predictedSales[0] / 30; // Ventas diarias estimadas

        if (avgDailySales === 0) return;

        const daysUntilStockout = Math.floor(stock / avgDailySales);

        let risk: 'high' | 'medium' | 'low' = 'low';
        if (daysUntilStockout < 7) risk = 'high';
        else if (daysUntilStockout < 30) risk = 'medium';

        if (risk !== 'low') {
            risks.push({
                productId: forecast.productId,
                productName: forecast.productName,
                risk,
                daysUntilStockout,
            });
        }
    });

    return risks.sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);
}
