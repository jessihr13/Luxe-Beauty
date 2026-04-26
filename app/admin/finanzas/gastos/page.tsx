'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    DollarSign,
    TrendingDown,
    Plus,
    Edit,
    Trash2,
    Filter,
    Download,
    ArrowLeft,
    Calendar,
    CreditCard
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useExpensesStore, categoryInfo, type ExpenseCategory } from '@/lib/finances/expensesStore';
import { useToast } from '@/lib/hooks/useToast';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { SearchInput } from '@/components/ui/SearchInput';
import { fadeIn, staggerContainer } from '@/lib/animations';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function ExpensesPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const getAllExpenses = useExpensesStore(state => state.getAllExpenses);
    const getTotalExpenses = useExpensesStore(state => state.getTotalExpenses);
    const getTotalByCategory = useExpensesStore(state => state.getTotalExpensesByCategory);
    const deleteExpense = useExpensesStore(state => state.deleteExpense);

    const expenses = getAllExpenses();

    useEffect(() => {
        setMounted(true);
        useExpensesStore.persist.rehydrate();
    }, []);

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    if (!mounted) {
        return (
            <AdminPageLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold-600"></div>
                </div>
            </AdminPageLayout>
        );
    }

    // Filter expenses
    const filteredExpenses = expenses.filter(expense => {
        const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Calculate totals
    const totalExpenses = getTotalExpenses();
    const categoryTotals = getTotalByCategory();

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este gasto?')) {
            deleteExpense(id);
        }
    };

    return (
        <AdminPageLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-serif font-bold gradient-text">
                            Gestión de Gastos
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Control completo de gastos operativos
                        </p>
                    </div>

                    <Link
                        href="/admin/finanzas/gastos/nuevo"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Gasto
                    </Link>
                </div>

                {/* Summary Cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                >
                    {/* Total Expenses */}
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="text-sm text-gray-500">Total</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            ${totalExpenses.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600">Gastos totales</p>
                    </div>

                    {/* Logistics */}
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <span className="text-2xl">{categoryInfo.logistics.icon}</span>
                            </div>
                            <span className="text-sm text-gray-500">{categoryInfo.logistics.name}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            ${categoryTotals.logistics.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {((categoryTotals.logistics / totalExpenses) * 100).toFixed(1)}% del total
                        </p>
                    </div>

                    {/* Marketing */}
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <span className="text-2xl">{categoryInfo.marketing.icon}</span>
                            </div>
                            <span className="text-sm text-gray-500">{categoryInfo.marketing.name}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            ${categoryTotals.marketing.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {((categoryTotals.marketing / totalExpenses) * 100).toFixed(1)}% del total
                        </p>
                    </div>
                </motion.div>

                {/* Category Breakdown */}
                <div className="card-luxury p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-6">Desglose por Categoría</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {Object.entries(categoryTotals).map(([category, amount]) => {
                            const info = categoryInfo[category as ExpenseCategory];
                            const percentage = (amount / totalExpenses) * 100;

                            return (
                                <div key={category} className="p-4 border-2 border-gray-100 rounded-lg hover:border-rose-gold-300 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">{info.icon}</span>
                                        <span className="font-medium text-gray-700">{info.name}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">
                                        ${amount.toLocaleString()}
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                        <div
                                            className="bg-rose-gold-400 h-2 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Filters */}
                <div className="card-luxury p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-700">Filtrar:</span>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | 'all')}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        >
                            <option value="all">Todas las categorías</option>
                            {Object.entries(categoryInfo).map(([key, info]) => (
                                <option key={key} value={key}>
                                    {info.icon} {info.name}
                                </option>
                            ))}
                        </select>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Buscar por descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />

                        <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Exportar
                        </button>
                    </div>
                </div>

                {/* Expenses Table */}
                <div className="card-luxury p-6">
                    <h3 className="text-xl font-semibold mb-6">
                        Registro de Gastos ({filteredExpenses.length})
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4">Fecha</th>
                                    <th className="text-left py-3 px-4">Categoría</th>
                                    <th className="text-left py-3 px-4">Descripción</th>
                                    <th className="text-right py-3 px-4">Monto</th>
                                    <th className="text-center py-3 px-4">Método</th>
                                    <th className="text-center py-3 px-4">Estado</th>
                                    <th className="text-center py-3 px-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            No se encontraron gastos
                                        </td>
                                    </tr>
                                ) : (
                                    filteredExpenses.map((expense) => {
                                        const info = categoryInfo[expense.category];

                                        return (
                                            <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm">
                                                            {new Date(expense.date).toLocaleDateString('es-ES')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                                                        <span>{info.icon}</span>
                                                        <span>{info.name}</span>
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-medium">{expense.description}</td>
                                                <td className="text-right py-3 px-4 font-bold text-red-600">
                                                    -${expense.amount.toLocaleString()}
                                                </td>
                                                <td className="text-center py-3 px-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm capitalize">{expense.paymentMethod || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="text-center py-3 px-4">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${expense.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        expense.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                        {expense.status === 'paid' ? 'Pagado' :
                                                            expense.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                                    </span>
                                                </td>
                                                <td className="text-center py-3 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(expense.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
}
