'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useProductsStore } from '@/lib/products/productsStore';
import { useOrdersStore } from '@/lib/orders/ordersStore';
import { useExpensesStore } from '@/lib/finances/expensesStore';
import { LogOut, LayoutDashboard, Package, ShoppingCart, Users, DollarSign, Megaphone, BarChart3, Settings, Edit2, Check, RotateCcw, Smartphone, Monitor } from 'lucide-react';
import { useDashboardStore } from '@/lib/store/useDashboardStore';
import { useThemeStore } from '@/lib/store/useThemeStore';
import WidgetSelector from '@/components/dashboard/WidgetSelector';
import ThemeSelector from '@/components/dashboard/ThemeSelector';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import dynamic from 'next/dynamic';

const DashboardGrid = dynamic(() => import('@/components/dashboard/DashboardGrid'), {
    loading: () => <div className="h-96 w-full animate-pulse bg-gray-100 rounded-xl" />,
    ssr: false
});

export default function AdminDashboard() {
    const router = useRouter();
    const { user, logout, isAdmin, isAuthenticated, loading } = useAuth();
    const { isEditMode, toggleEditMode, resetLayout, currentDevice, setDevice } = useDashboardStore();
    const { mode } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    const getAllProducts = useProductsStore(state => state.getAllProducts);
    const getAllOrders = useOrdersStore(state => state.getAllOrders);
    const getTotalExpenses = useExpensesStore(state => state.getTotalExpenses);
    const getTotalByCategory = useExpensesStore(state => state.getTotalExpensesByCategory);

    const products = getAllProducts();
    const orders = getAllOrders();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
        useProductsStore.persist.rehydrate();
        useOrdersStore.persist.rehydrate();
        useExpensesStore.persist.rehydrate();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold-500"></div>
        </div>;
    }

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // Calculate financial metrics
    const calculateMetrics = () => {
        // Calculate from real orders
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Calculate costs from products
        let totalCost = 0;
        orders.forEach(order => {
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product?.cost) {
                    totalCost += product.cost * item.quantity;
                }
            });
        });

        const grossProfit = totalRevenue - totalCost;
        const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

        // Get real expenses
        const totalExpenses = getTotalExpenses();
        const expensesByCategory = getTotalByCategory();

        const netProfit = grossProfit - totalExpenses;
        const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

        return {
            totalRevenue,
            totalCost,
            grossProfit,
            grossMargin,
            totalExpenses,
            netProfit,
            netMargin,
            totalOrders,
            avgOrderValue,
            expenses: expensesByCategory,
        };
    };

    const metrics = calculateMetrics();

    // Data for charts
    const salesData = [
        { name: 'Lun', ventas: 12500, gastos: 8000 },
        { name: 'Mar', ventas: 15200, gastos: 9500 },
        { name: 'Mié', ventas: 18900, gastos: 11000 },
        { name: 'Jue', ventas: 16700, gastos: 10200 },
        { name: 'Vie', ventas: 22100, gastos: 13500 },
        { name: 'Sáb', ventas: 28400, gastos: 16800 },
        { name: 'Dom', ventas: 24300, gastos: 14500 },
    ];

    const topProducts = [...products]
        .sort((a, b) => b.neuromarketing.socialProof.purchaseCount - a.neuromarketing.socialProof.purchaseCount)
        .slice(0, 5)
        .map(p => ({
            name: p.name.substring(0, 20),
            ventas: p.neuromarketing.socialProof.purchaseCount,
            ingresos: p.price * p.neuromarketing.socialProof.purchaseCount,
        }));

    const categoryData = [
        { name: 'Skincare', value: products.filter(p => p.category === 'skincare').reduce((sum, p) => sum + p.neuromarketing.socialProof.purchaseCount, 0) },
        { name: 'Makeup', value: products.filter(p => p.category === 'makeup').reduce((sum, p) => sum + p.neuromarketing.socialProof.purchaseCount, 0) },
        { name: 'Fragrance', value: products.filter(p => p.category === 'fragrance').reduce((sum, p) => sum + p.neuromarketing.socialProof.purchaseCount, 0) },
    ];

    const dashboardData = {
        metrics,
        salesData,
        categoryData,
        topProducts,
        products,
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen transition-colors duration-300 bg-nude-50 dark:bg-luxe-dark-900">
            {/* Header */}
            <header className="bg-white dark:bg-luxe-dark-800 shadow-sm sticky top-0 z-20 transition-colors duration-300 border-b dark:border-luxe-dark-700">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-serif font-bold gradient-text">
                                Luxe Beauty Admin
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Bienvenido, {user?.name}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeSelector />

                            <Link
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-luxe-dark-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-luxe-dark-600 transition-colors"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span className="hidden md:inline">Ver Tienda</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-rose-gold-600 text-white rounded-full hover:opacity-90 transition-opacity"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden md:inline">Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Sidebar with hover dropdowns */}
                    <DashboardSidebar />

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <h2 className="text-3xl font-serif font-bold dark:text-white">
                                Dashboard Financiero
                            </h2>
                            <div className="flex flex-wrap items-center gap-3">
                                {isEditMode ? (
                                    <>
                                        {/* Device Switcher in Edit Mode */}
                                        <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
                                            <button
                                                onClick={() => setDevice('desktop')}
                                                className={`p-2 rounded-md transition-all ${currentDevice === 'desktop' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                                                title="Vista Desktop"
                                            >
                                                <Monitor className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDevice('mobile')}
                                                className={`p-2 rounded-md transition-all ${currentDevice === 'mobile' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                                                title="Vista Móvil"
                                            >
                                                <Smartphone className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <WidgetSelector />
                                        <button
                                            onClick={resetLayout}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Reset
                                        </button>
                                        <button
                                            onClick={toggleEditMode}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Check className="w-4 h-4" />
                                            Guardar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={toggleEditMode}
                                        className="flex items-center gap-2 px-4 py-2 bg-rose-gold-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Personalizar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Preview Banner */}
                        {isEditMode && currentDevice === 'mobile' && (
                            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                                <Smartphone className="w-5 h-5" />
                                <p className="text-sm">
                                    Editando vista móvil. Los cambios aquí solo afectarán a dispositivos móviles.
                                </p>
                            </div>
                        )}

                        <div className={currentDevice === 'mobile' ? 'max-w-md mx-auto border-x-4 border-gray-300 min-h-screen bg-white p-4 shadow-xl' : ''}>
                            <DashboardGrid data={dashboardData} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
