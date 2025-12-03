'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { getAllOrders } from '@/lib/data/orders';
import { generateCohortAnalysis, calculateChurnRate, calculateAverageLTV } from '@/lib/analytics/cohortAnalysis';
import dynamic from 'next/dynamic';
import { ArrowLeft, Users, TrendingDown, DollarSign } from 'lucide-react';
import Link from 'next/link';

const CohortRetentionChart = dynamic(() => import('@/components/reports/CohortRetentionChart'), { loading: () => <div className="h-96 w-full animate-pulse bg-gray-100 rounded-xl" /> });
const CohortHeatmap = dynamic(() => import('@/components/reports/CohortHeatmap'), { loading: () => <div className="h-96 w-full animate-pulse bg-gray-100 rounded-xl" /> });

export default function CohortAnalysisPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();

    // Hooks deben ir antes de cualquier return condicional
    const orders = getAllOrders();

    const cohortData = useMemo(() => generateCohortAnalysis(orders), [orders]);
    const churnRate = useMemo(() => calculateChurnRate(cohortData), [cohortData]);
    const avgLTV = useMemo(() => calculateAverageLTV(cohortData), [cohortData]);

    const totalCustomers = useMemo(() => {
        const uniqueCustomers = new Set(orders.map(o => o.customerEmail));
        return uniqueCustomers.size;
    }, [orders]);

    // Redirect si no es admin
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
                            href="/admin/dashboard"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-serif font-bold gradient-text">
                                Análisis de Cohortes
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Análisis de retención de clientes por fecha de primera compra
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Clientes</p>
                                <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
                            </div>
                            <div className="w-12 h-12 bg-rose-gold-100 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-rose-gold-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tasa de Churn Promedio</p>
                                <p className="text-3xl font-bold text-red-600">{churnRate.toFixed(1)}%</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">LTV Promedio</p>
                                <p className="text-3xl font-bold text-green-600">${avgLTV.toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="space-y-6">
                    <CohortHeatmap cohortData={cohortData} />
                    <CohortRetentionChart cohortData={cohortData} />
                </div>

                {/* Insights */}
                <div className="mt-8 card-luxury p-6">
                    <h3 className="text-xl font-semibold mb-4">💡 Insights</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li>• <strong>Cohortes identificadas:</strong> {cohortData.length} grupos de clientes</li>
                        <li>• <strong>Retención mes 1:</strong> En promedio, {(100 - churnRate).toFixed(1)}% de clientes regresan</li>
                        <li>• <strong>Valor de vida del cliente:</strong> Cada cliente genera en promedio ${avgLTV.toFixed(2)}</li>
                        <li>• <strong>Recomendación:</strong> Implementar estrategias de retención para reducir el churn en el primer mes</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
