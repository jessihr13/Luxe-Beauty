'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    DollarSign,
    TrendingUp,
    Target,
    Users,
    Calendar,
    BarChart3
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
    getCampaignById,
    getCampaignExpenses,
    getCampaignSales,
    calculateCampaignROI,
    calculateCampaignRevenue,
    calculateCPA,
    calculateROAS,
    calculateCTR,
    calculateConversionRate,
    campaignTypeInfo,
    campaignStatusInfo,
    type CampaignType,
    type CampaignStatus
} from '@/lib/data/campaigns';

export default function CampaignDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { isAdmin, isAuthenticated } = useAuth();
    const [campaign, setCampaign] = useState<any>(null);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
            return;
        }

        const id = params.id as string;
        const foundCampaign = getCampaignById(id);
        if (foundCampaign) {
            setCampaign(foundCampaign);
        } else {
            router.push('/admin/marketing');
        }
    }, [params.id, isAuthenticated, isAdmin, router]);

    if (!campaign) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    const typeInfo = campaignTypeInfo[campaign.type as CampaignType];
    const statusInfo = campaignStatusInfo[campaign.status as CampaignStatus];
    const expenses = getCampaignExpenses(campaign.id);
    const sales = getCampaignSales(campaign.id);

    const roi = calculateCampaignROI(campaign.id);
    const revenue = calculateCampaignRevenue(campaign.id);
    const cpa = calculateCPA(campaign.id);
    const roas = calculateROAS(campaign.id);
    const ctr = calculateCTR(campaign.id);
    const conversionRate = calculateConversionRate(campaign.id);

    const budgetProgress = (campaign.spent / campaign.budget) * 100;
    const remaining = campaign.budget - campaign.spent;

    return (
        <div className="min-h-screen bg-nude-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href="/admin/marketing"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{typeInfo.icon}</span>
                            <h1 className="text-4xl font-serif font-bold gradient-text">
                                {campaign.name}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                                campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {statusInfo.icon} {statusInfo.name}
                            </span>
                            <span className="text-sm text-gray-600">{typeInfo.name}</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-4">Descripción</h3>
                            <p className="text-gray-700">{campaign.description}</p>

                            <div className="mt-6 grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Audiencia Objetivo</p>
                                    <p className="font-medium text-gray-900">{campaign.targetAudience}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Período</p>
                                    <p className="font-medium text-gray-900">
                                        {campaign.startDate.toLocaleDateString('es-ES')} - {campaign.endDate.toLocaleDateString('es-ES')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-6">Métricas de Rendimiento</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Impresiones</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {campaign.metrics.impressions.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Clicks</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {campaign.metrics.clicks.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Conversiones</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {campaign.metrics.conversions}
                                    </p>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">CTR</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {ctr.toFixed(2)}%
                                    </p>
                                </div>
                                <div className="p-4 bg-pink-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Tasa de Conversión</p>
                                    <p className="text-2xl font-bold text-pink-600">
                                        {conversionRate.toFixed(2)}%
                                    </p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">CPA</p>
                                    <p className="text-2xl font-bold text-indigo-600">
                                        ${cpa.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Expenses */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-6">Gastos Detallados ({expenses.length})</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-3 px-4">Fecha</th>
                                            <th className="text-left py-3 px-4">Descripción</th>
                                            <th className="text-left py-3 px-4">Categoría</th>
                                            <th className="text-right py-3 px-4">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map(expense => (
                                            <tr key={expense.id} className="border-b border-gray-100">
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {expense.date.toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="py-3 px-4 font-medium text-gray-900">
                                                    {expense.description}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {expense.category}
                                                </td>
                                                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                                    ${expense.amount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Sales Attribution */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-6">Ventas Atribuidas ({sales.length})</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-3 px-4">Fecha</th>
                                            <th className="text-left py-3 px-4">Cliente</th>
                                            <th className="text-left py-3 px-4">Fuente</th>
                                            <th className="text-right py-3 px-4">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.map(sale => (
                                            <tr key={sale.id} className="border-b border-gray-100">
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {sale.date.toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="py-3 px-4 font-medium text-gray-900">
                                                    {sale.customerName}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {sale.source}
                                                </td>
                                                <td className="py-3 px-4 text-right font-semibold text-green-600">
                                                    ${sale.amount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Budget */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Presupuesto
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Gastado</span>
                                        <span className="font-semibold text-gray-900">
                                            ${campaign.spent.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Presupuesto</span>
                                        <span className="font-semibold text-gray-900">
                                            ${campaign.budget.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                        <div
                                            className={`h-3 rounded-full ${budgetProgress > 90 ? 'bg-red-500' :
                                                budgetProgress > 70 ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                                }`}
                                            style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Restante</span>
                                        <span className={`font-semibold ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ${remaining.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ROI Analysis */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Análisis Financiero
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">ROI</p>
                                    <p className={`text-3xl font-bold ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {roi.toFixed(0)}%
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">ROAS</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {roas.toFixed(2)}x
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Costo Total</span>
                                        <span className="font-semibold text-red-600">
                                            ${campaign.spent.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Ingresos</span>
                                        <span className="font-semibold text-green-600">
                                            ${revenue.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="text-sm font-semibold text-gray-900">Ganancia</span>
                                        <span className={`font-bold ${(revenue - campaign.spent) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ${(revenue - campaign.spent).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Goals */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Objetivos
                            </h3>
                            <ul className="space-y-2">
                                {campaign.goals.map((goal: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span className="text-sm text-gray-700">{goal}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
