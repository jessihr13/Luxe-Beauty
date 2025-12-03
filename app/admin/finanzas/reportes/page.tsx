'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Download,
    Calendar
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { products } from '@/lib/data/products';
import { getTotalExpenses, getTotalExpensesByCategory, categoryInfo } from '@/lib/data/expenses';
import { fadeIn } from '@/lib/animations';

export default function FinancialReportsPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    // Calculate financial metrics
    const calculatePL = () => {
        let totalRevenue = 0;
        let totalCost = 0;

        products.forEach(p => {
            const sales = p.neuromarketing.socialProof.purchaseCount;
            totalRevenue += p.price * sales;
            totalCost += (p.cost || 0) * sales;
        });

        const grossProfit = totalRevenue - totalCost;
        const grossMargin = (grossProfit / totalRevenue) * 100;

        const totalExpenses = getTotalExpenses();
        const netProfit = grossProfit - totalExpenses;
        const netMargin = (netProfit / totalRevenue) * 100;

        const expensesByCategory = {
            logistics: getTotalExpensesByCategory('logistics'),
            marketing: getTotalExpensesByCategory('marketing'),
            salaries: getTotalExpensesByCategory('salaries'),
            general: getTotalExpensesByCategory('general'),
            technology: getTotalExpensesByCategory('technology'),
        };

        return {
            totalRevenue,
            totalCost,
            grossProfit,
            grossMargin,
            totalExpenses,
            netProfit,
            netMargin,
            expensesByCategory,
        };
    };

    const pl = calculatePL();

    // Monthly trend data (mock)
    const monthlyData = [
        { month: 'Jun', ingresos: 520000, gastos: 65000, ganancia: 455000 },
        { month: 'Jul', ingresos: 545000, gastos: 68000, ganancia: 477000 },
        { month: 'Ago', ingresos: 580000, gastos: 72000, ganancia: 508000 },
        { month: 'Sep', ingresos: 595000, gastos: 74000, ganancia: 521000 },
        { month: 'Oct', ingresos: 610000, gastos: 76000, ganancia: 534000 },
        { month: 'Nov', ingresos: 629425, gastos: 83300, ganancia: 546125 },
    ];

    // Expense distribution
    const expenseDistribution = Object.entries(pl.expensesByCategory).map(([category, amount]) => ({
        name: categoryInfo[category as keyof typeof categoryInfo].name,
        value: amount,
    }));

    const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#6B7280', '#6366F1'];

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
                                Reportes Financieros
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Análisis de Profit & Loss (P&L)
                            </p>
                        </div>
                    </div>

                    <button className="btn-primary flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Exportar PDF
                    </button>
                </div>

                {/* P&L Statement */}
                <div className="card-luxury p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif font-bold">Estado de Resultados (P&L)</h2>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-5 h-5" />
                            <span>Noviembre 2024</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Revenue */}
                        <div className="flex justify-between items-center py-3 border-b-2 border-gray-200">
                            <span className="text-lg font-semibold text-gray-900">Ingresos por Ventas</span>
                            <span className="text-2xl font-bold text-green-600">
                                ${pl.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {/* Cost of Goods */}
                        <div className="flex justify-between items-center py-2 pl-6">
                            <span className="text-gray-700">Costo de Productos Vendidos</span>
                            <span className="font-semibold text-red-600">
                                -${pl.totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {/* Gross Profit */}
                        <div className="flex justify-between items-center py-3 border-y-2 border-gray-300 bg-green-50">
                            <span className="text-lg font-bold text-gray-900">Ganancia Bruta</span>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">
                                    ${pl.grossProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Margen: {pl.grossMargin.toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        {/* Operating Expenses */}
                        <div className="py-3">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-lg font-semibold text-gray-900">Gastos Operativos</span>
                            </div>

                            <div className="space-y-2 pl-6">
                                {Object.entries(pl.expensesByCategory).map(([category, amount]) => {
                                    const info = categoryInfo[category as keyof typeof categoryInfo];
                                    return (
                                        <div key={category} className="flex justify-between items-center py-1">
                                            <span className="text-gray-700 flex items-center gap-2">
                                                <span>{info.icon}</span>
                                                {info.name}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                ${amount.toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })}

                                <div className="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                                    <span className="text-gray-900">Total Gastos Operativos</span>
                                    <span className="text-red-600">
                                        -${pl.totalExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Net Profit */}
                        <div className="flex justify-between items-center py-4 border-y-4 border-gray-900 bg-gradient-to-r from-green-50 to-emerald-50">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">Ganancia Neta</div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Margen Neto: {pl.netMargin.toFixed(1)}%
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-green-600">
                                    ${pl.netProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="flex items-center gap-1 text-green-600 mt-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-medium">+12.5% vs mes anterior</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Monthly Trend */}
                    <div className="card-luxury p-6">
                        <h3 className="text-xl font-semibold mb-4">Tendencia Mensual</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                                <Legend />
                                <Line type="monotone" dataKey="ingresos" stroke="#10B981" strokeWidth={2} name="Ingresos" />
                                <Line type="monotone" dataKey="gastos" stroke="#EF4444" strokeWidth={2} name="Gastos" />
                                <Line type="monotone" dataKey="ganancia" stroke="#3B82F6" strokeWidth={2} name="Ganancia" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Expense Distribution */}
                    <div className="card-luxury p-6">
                        <h3 className="text-xl font-semibold mb-4">Distribución de Gastos</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={expenseDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {expenseDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="card-luxury p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-green-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">ROI</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {((pl.netProfit / pl.totalExpenses) * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-600">Retorno de inversión</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Margen Bruto</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {pl.grossMargin.toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-600">Sobre ventas</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <TrendingDown className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Gastos/Ingresos</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {((pl.totalExpenses / pl.totalRevenue) * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-600">Ratio de eficiencia</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-emerald-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Margen Neto</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {pl.netMargin.toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-600">Ganancia final</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
