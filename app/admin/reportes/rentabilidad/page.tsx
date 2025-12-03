'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { products } from '@/lib/data/products';
import {
    calculateProductProfitability,
    getProfitabilityByCategory,
    identifyLowPerformers,
    identifyStarProducts,
    calculateGlobalMetrics,
} from '@/lib/analytics/profitabilityAnalysis';
import dynamic from 'next/dynamic';
import { ArrowLeft, DollarSign, TrendingUp, AlertCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProfitabilityScatter = dynamic(() => import('@/components/reports/ProfitabilityScatter'), { loading: () => <div className="h-96 w-full animate-pulse bg-gray-100 rounded-xl" /> });

export default function ProfitabilityPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();

    // Hooks deben ir antes de cualquier return condicional
    const profitability = useMemo(() => calculateProductProfitability(products), []);
    const categoryData = useMemo(() => getProfitabilityByCategory(profitability), [profitability]);
    const lowPerformers = useMemo(() => identifyLowPerformers(profitability), [profitability]);
    const starProducts = useMemo(() => identifyStarProducts(profitability), [profitability]);
    const metrics = useMemo(() => calculateGlobalMetrics(profitability), [profitability]);

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-nude-50 p-8">
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
                                Análisis de Rentabilidad
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Márgenes, ROI y análisis ABC por producto
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Ganancia Total</p>
                                <p className="text-3xl font-bold text-green-600">
                                    ${metrics.totalProfit.toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Margen Promedio</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {metrics.avgMargin.toFixed(1)}%
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Productos Estrella</p>
                                <p className="text-3xl font-bold text-amber-600">
                                    {starProducts.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                <Star className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Bajo Rendimiento</p>
                                <p className="text-3xl font-bold text-red-600">
                                    {lowPerformers.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ABC Analysis Summary */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="card-luxury p-6 border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold mb-2 text-green-700">Categoría A</h3>
                        <p className="text-3xl font-bold text-green-600">{metrics.categoryA}</p>
                        <p className="text-sm text-gray-600 mt-1">Top 80% de ganancias</p>
                    </div>
                    <div className="card-luxury p-6 border-l-4 border-amber-500">
                        <h3 className="text-lg font-semibold mb-2 text-amber-700">Categoría B</h3>
                        <p className="text-3xl font-bold text-amber-600">{metrics.categoryB}</p>
                        <p className="text-sm text-gray-600 mt-1">Siguiente 15%</p>
                    </div>
                    <div className="card-luxury p-6 border-l-4 border-red-500">
                        <h3 className="text-lg font-semibold mb-2 text-red-700">Categoría C</h3>
                        <p className="text-3xl font-bold text-red-600">{metrics.categoryC}</p>
                        <p className="text-sm text-gray-600 mt-1">Último 5%</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="space-y-6 mb-8">
                    <ProfitabilityScatter profitability={profitability} />

                    <div className="card-luxury p-6">
                        <h3 className="text-xl font-semibold mb-4">Rentabilidad por Categoría</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="profit" fill="#10b981" name="Ganancia ($)" />
                                <Bar dataKey="margin" fill="#3b82f6" name="Margen (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Star Products */}
                {starProducts.length > 0 && (
                    <div className="card-luxury p-6 mb-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            Productos Estrella (Alto Margen + Alto Volumen)
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4">Producto</th>
                                        <th className="text-right py-3 px-4">Margen</th>
                                        <th className="text-right py-3 px-4">ROI</th>
                                        <th className="text-right py-3 px-4">Vendidos</th>
                                        <th className="text-right py-3 px-4">Ganancia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {starProducts.slice(0, 10).map(p => (
                                        <tr key={p.productId} className="border-b border-gray-100">
                                            <td className="py-3 px-4">{p.productName}</td>
                                            <td className="text-right py-3 px-4 text-green-600 font-semibold">
                                                {p.grossMargin.toFixed(1)}%
                                            </td>
                                            <td className="text-right py-3 px-4">{p.roi.toFixed(1)}%</td>
                                            <td className="text-right py-3 px-4">{p.unitsSold}</td>
                                            <td className="text-right py-3 px-4 font-semibold text-green-600">
                                                ${p.grossProfit.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Low Performers */}
                {lowPerformers.length > 0 && (
                    <div className="card-luxury p-6 mb-8 border-l-4 border-red-500">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            Productos de Bajo Rendimiento
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4">Producto</th>
                                        <th className="text-right py-3 px-4">Margen</th>
                                        <th className="text-right py-3 px-4">ROI</th>
                                        <th className="text-right py-3 px-4">Categoría ABC</th>
                                        <th className="text-right py-3 px-4">Ganancia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowPerformers.slice(0, 10).map(p => (
                                        <tr key={p.productId} className="border-b border-gray-100">
                                            <td className="py-3 px-4">{p.productName}</td>
                                            <td className="text-right py-3 px-4 text-red-600 font-semibold">
                                                {p.grossMargin.toFixed(1)}%
                                            </td>
                                            <td className="text-right py-3 px-4">{p.roi.toFixed(1)}%</td>
                                            <td className="text-right py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.abcCategory === 'A' ? 'bg-green-100 text-green-800' :
                                                    p.abcCategory === 'B' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {p.abcCategory}
                                                </span>
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                ${p.grossProfit.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Insights */}
                <div className="card-luxury p-6">
                    <h3 className="text-xl font-semibold mb-4">💡 Insights y Recomendaciones</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li>• <strong>Análisis ABC:</strong> {metrics.categoryA} productos generan el 80% de las ganancias</li>
                        <li>• <strong>Margen promedio:</strong> {metrics.avgMargin.toFixed(1)}% - {metrics.avgMargin > 40 ? 'Excelente' : metrics.avgMargin > 30 ? 'Bueno' : 'Mejorable'}</li>
                        <li>• <strong>ROI promedio:</strong> {metrics.avgROI.toFixed(1)}%</li>
                        <li>• <strong>Productos estrella:</strong> {starProducts.length} productos con alto margen y volumen</li>
                        <li>• <strong>Recomendación:</strong> Enfocarse en productos categoría A y considerar descontinuar productos C con bajo rendimiento</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
