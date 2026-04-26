'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { products } from '@/lib/data/products';
import { useOrdersStore } from '@/lib/orders/ordersStore';
import { convertToLegacyOrders } from '@/lib/orders/orderAdapter';
import { generateDemandForecast, identifyStockRisks } from '@/lib/analytics/demandPrediction';
import dynamic from 'next/dynamic';
import { ArrowLeft, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

const DemandForecastChart = dynamic(() => import('@/components/reports/DemandForecastChart'), { loading: () => <div className="h-96 w-full animate-pulse bg-gray-100 rounded-xl" /> });

export default function DemandPredictionPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);

    const getAllOrders = useOrdersStore(state => state.getAllOrders);
    const orders = getAllOrders();

    useEffect(() => {
        setMounted(true);
        useOrdersStore.persist.rehydrate();
    }, []);

    // Convert to legacy format for analytics
    const legacyOrders = useMemo(() => convertToLegacyOrders(orders), [orders]);

    const forecasts = useMemo(() => generateDemandForecast(products, legacyOrders, 3), [legacyOrders]);

    const currentStock = useMemo(() => {
        const stockMap = new Map<string, number>();
        products.forEach(p => stockMap.set(p.id, p.stock));
        return stockMap;
    }, []);

    const stockRisks = useMemo(() => identifyStockRisks(forecasts, currentStock), [forecasts, currentStock]);

    // Top 5 productos para mostrar
    const topForecasts = forecasts.slice(0, 5);

    // Redirect si no es admin
    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    return (
        <AdminPageLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/reportes"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-serif font-bold gradient-text">
                                Predicción de Demanda
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Forecasting de ventas basado en histórico y tendencias
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Productos Analizados</p>
                                <p className="text-3xl font-bold text-gray-900">{forecasts.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Productos en Riesgo</p>
                                <p className="text-3xl font-bold text-red-600">{stockRisks.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Confianza Promedio</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {(forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length).toFixed(1)}%
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertas de Stock */}
                {stockRisks.length > 0 && (
                    <div className="card-luxury p-6 mb-8 border-l-4 border-red-500">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-700">
                            <AlertTriangle className="w-5 h-5" />
                            Alertas de Desabastecimiento
                        </h3>
                        <div className="space-y-3">
                            {stockRisks.map(risk => (
                                <div
                                    key={risk.productId}
                                    className={`p-4 rounded-lg ${risk.risk === 'high' ? 'bg-red-50' : 'bg-yellow-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">{risk.productName}</p>
                                            <p className="text-sm text-gray-600">
                                                Stock se agotará en aproximadamente {risk.daysUntilStockout} días
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${risk.risk === 'high'
                                                ? 'bg-red-200 text-red-800'
                                                : 'bg-yellow-200 text-yellow-800'
                                                }`}
                                        >
                                            {risk.risk === 'high' ? 'Riesgo Alto' : 'Riesgo Medio'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Forecasts */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Top 5 Productos - Predicción de Demanda</h2>
                    {topForecasts.map(forecast => (
                        <DemandForecastChart key={forecast.productId} forecast={forecast} />
                    ))}
                </div>

                {/* Insights */}
                <div className="mt-8 card-luxury p-6">
                    <h3 className="text-xl font-semibold mb-4">💡 Insights y Recomendaciones</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li>• <strong>Algoritmo:</strong> Promedio móvil simple con detección de tendencias</li>
                        <li>• <strong>Período de análisis:</strong> Últimos 12 meses de ventas</li>
                        <li>• <strong>Predicción:</strong> Próximos 3 meses</li>
                        <li>• <strong>Productos en tendencia creciente:</strong> {forecasts.filter(f => f.trend === 'increasing').length}</li>
                        <li>• <strong>Productos en tendencia decreciente:</strong> {forecasts.filter(f => f.trend === 'decreasing').length}</li>
                        <li>• <strong>Recomendación:</strong> Revisar stock de productos con riesgo alto y ajustar pedidos</li>
                    </ul>
                </div>
            </div>
        </AdminPageLayout>
    );
}
