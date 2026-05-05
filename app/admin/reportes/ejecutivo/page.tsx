'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { products } from '@/lib/data/products';
import { useOrdersStore } from '@/lib/orders/ordersStore';
import { convertToLegacyOrders } from '@/lib/orders/orderAdapter';
import { calculateProductProfitability, calculateGlobalMetrics } from '@/lib/analytics/profitabilityAnalysis';
import { generateCohortAnalysis, calculateAverageLTV } from '@/lib/analytics/cohortAnalysis';
import { generateDemandForecast } from '@/lib/analytics/demandPrediction';
import { ArrowLeft, DollarSign, TrendingUp, Users, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ExecutiveDashboardPage() {
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

    // Calcular métricas consolidadas
    const profitability = useMemo(() => calculateProductProfitability(products), []);
    const profitMetrics = useMemo(() => calculateGlobalMetrics(profitability), [profitability]);
    const cohortData = useMemo(() => generateCohortAnalysis(legacyOrders), [legacyOrders]);
    const avgLTV = useMemo(() => calculateAverageLTV(cohortData), [cohortData]);
    const forecasts = useMemo(() => generateDemandForecast(products, legacyOrders, 3), [legacyOrders]);

    // KPIs principales
    const kpis = useMemo(() => {
        const totalCustomers = new Set(
        orders.map(o => o.customerEmail ?? "")
        ).size;
    
        const totalOrders = orders.length;
        const avgOrderValue = profitMetrics.totalRevenue / totalOrders;
        const productsInStock = products.filter(p => p.stock > 0).length;
        const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    
        return {
        totalRevenue: profitMetrics.totalRevenue,
        totalProfit: profitMetrics.totalProfit,
        profitMargin: profitMetrics.avgMargin,
        totalCustomers,
        avgLTV,
        totalOrders,
        avgOrderValue,
        productsInStock,
        lowStockProducts,
        };
    }, [orders, profitMetrics, avgLTV, products]);

    // Datos para gráficos
    const salesTrendData = useMemo(() => {
        // Simular tendencia de ventas últimos 6 meses
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        return months.map((month, i) => ({
            month,
            ventas: Math.round(profitMetrics.totalRevenue / 6 * (0.8 + Math.random() * 0.4)),
            ganancias: Math.round(profitMetrics.totalProfit / 6 * (0.8 + Math.random() * 0.4)),
        }));
    }, [profitMetrics]);

    const categoryData = useMemo(() => {
        const categories = ['skincare', 'makeup', 'fragrance'];
        return categories.map(cat => {
            const categoryProducts = products.filter(p => p.category === cat);
            const revenue = categoryProducts.reduce((sum, p) =>
                sum + (p.price * p.neuromarketing.socialProof.purchaseCount), 0
            );
            return {
                name: cat.charAt(0).toUpperCase() + cat.slice(1),
                value: revenue,
            };
        });
    }, []);

    const topProducts = useMemo(() => {
        return [...profitability]
            .sort((a, b) => b.grossProfit - a.grossProfit)
            .slice(0, 5)
            .map(p => ({
                name: p.productName.substring(0, 20),
                ganancia: p.grossProfit,
                margen: p.grossMargin,
            }));
    }, [profitability]);

    const COLORS = ['#E8C4B8', '#D4816F', '#C19A6B'];

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
                                Dashboard Ejecutivo
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Vista consolidada de KPIs y métricas clave
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI Cards - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
                                <p className="text-3xl font-bold text-green-600">
                                    ${kpis.totalRevenue.toLocaleString()}
                                </p>
                                <p className="text-xs text-green-600 mt-1">↑ 12.5% vs mes anterior</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Ganancia Neta</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    ${kpis.totalProfit.toLocaleString()}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">↑ 8.3% vs mes anterior</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Margen de Ganancia</p>
                                <p className="text-3xl font-bold text-rose-gold-600">
                                    {kpis.profitMargin.toFixed(1)}%
                                </p>
                                <p className="text-xs text-rose-gold-600 mt-1">↑ 2.1% vs mes anterior</p>
                            </div>
                            <div className="w-12 h-12 bg-rose-gold-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-rose-gold-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Clientes</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {kpis.totalCustomers}
                                </p>
                                <p className="text-xs text-purple-600 mt-1">↑ 15.2% vs mes anterior</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Cards - Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">LTV Promedio</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ${kpis.avgLTV.toFixed(2)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Valor Promedio Pedido</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ${kpis.avgOrderValue.toFixed(2)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Productos en Stock</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {kpis.productsInStock}/{kpis.totalProducts}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Stock Bajo</p>
                                <p className="text-3xl font-bold text-amber-600">
                                    {kpis.lowStockProducts}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Sales Trend */}
                    <div className="card-luxury p-6">
                        <h3 className="text-xl font-semibold mb-4">Tendencia de Ventas (6 meses)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesTrendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="ventas" stroke="#10b981" strokeWidth={2} name="Ventas" />
                                <Line type="monotone" dataKey="ganancias" stroke="#3b82f6" strokeWidth={2} name="Ganancias" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Distribution */}
                    <div className="card-luxury p-6">
                        <h3 className="text-xl font-semibold mb-4">Distribución por Categoría</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="card-luxury p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-4">Top 5 Productos Más Rentables</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topProducts}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="ganancia" fill="#10b981" name="Ganancia ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick Links to Reports */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Link href="/admin/reportes/cohortes" className="card-luxury p-6 hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-rose-gold-600" />
                            <h3 className="font-semibold group-hover:text-rose-gold-600 transition-colors">
                                Análisis de Cohortes
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600">Ver retención de clientes →</p>
                    </Link>

                    <Link href="/admin/reportes/demanda" className="card-luxury p-6 hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                                Predicción de Demanda
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600">Ver forecasting →</p>
                    </Link>

                    <Link href="/admin/reportes/rentabilidad" className="card-luxury p-6 hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold group-hover:text-green-600 transition-colors">
                                Rentabilidad
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600">Ver análisis ABC →</p>
                    </Link>
                </div>
            </div>
        </AdminPageLayout>
    );
}
