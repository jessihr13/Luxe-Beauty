'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Package,
    AlertTriangle,
    TrendingDown,
    TrendingUp,
    ArrowLeft,
    Search,
    Filter,
    Download,
    ChevronDown
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { products } from '@/lib/data/products';
import { getStockAlerts, getAllMovements } from '@/lib/data/inventory';
import { staggerContainer } from '@/lib/animations';
import { exportProductsToExcel, exportToCSV } from '@/lib/utils/export-utils';
import { exportInventoryToPDF } from '@/lib/utils/pdf-utils';

export default function InventoryPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'low' | 'ok'>('all');
    const [showExportMenu, setShowExportMenu] = useState(false);

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    // Get stock alerts
    const alerts = getStockAlerts(products);
    const recentMovements = getAllMovements().slice(0, 5);

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterStatus === 'all') return matchesSearch;

        const alert = alerts.find(a => a.productId === product.id);
        if (filterStatus === 'critical') return matchesSearch && alert?.status === 'critical';
        if (filterStatus === 'low') return matchesSearch && alert?.status === 'low';
        if (filterStatus === 'ok') return matchesSearch && !alert;

        return matchesSearch;
    });

    // Calculate metrics
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const criticalAlerts = alerts.filter(a => a.status === 'critical').length;
    const lowStockAlerts = alerts.filter(a => a.status === 'low').length;

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
                                Gestión de Inventario
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Control de stock y movimientos
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Export Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Exportar
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {showExportMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                                    <button
                                        onClick={() => {
                                            exportProductsToExcel(products);
                                            setShowExportMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <span>📊</span>
                                        Exportar a Excel
                                    </button>
                                    <button
                                        onClick={() => {
                                            const csvData = products.map(p => ({
                                                SKU: p.id,
                                                Nombre: p.name,
                                                Categoría: p.category,
                                                Precio: p.price,
                                                Costo: p.cost || 0,
                                                Stock: p.stock,
                                                Ventas: p.neuromarketing.socialProof.purchaseCount,
                                            }));
                                            exportToCSV(csvData, 'inventario');
                                            setShowExportMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <span>📄</span>
                                        Exportar a CSV
                                    </button>
                                    <button
                                        onClick={() => {
                                            exportInventoryToPDF(products);
                                            setShowExportMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <span>📑</span>
                                        Exportar a PDF
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/admin/inventario/movimientos"
                            className="btn-primary flex items-center gap-2"
                        >
                            <Package className="w-5 h-5" />
                            Ver Historial Completo
                        </Link>
                    </div>
                </div>

                {/* Summary Cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid md:grid-cols-4 gap-6 mb-8"
                >
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {totalProducts}
                        </h3>
                        <p className="text-sm text-gray-600">Productos totales</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {totalStock}
                        </h3>
                        <p className="text-sm text-gray-600">Unidades en stock</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {criticalAlerts}
                        </h3>
                        <p className="text-sm text-gray-600">Stock crítico</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <TrendingDown className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {lowStockAlerts}
                        </h3>
                        <p className="text-sm text-gray-600">Stock bajo</p>
                    </div>
                </motion.div>

                {/* Alerts Section */}
                {alerts.length > 0 && (
                    <div className="card-luxury p-6 mb-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            Alertas de Stock
                        </h3>
                        <div className="space-y-2">
                            {alerts.map(alert => (
                                <div
                                    key={alert.productId}
                                    className={`p-4 rounded-lg border-l-4 ${alert.status === 'critical'
                                        ? 'bg-red-50 border-red-500'
                                        : 'bg-yellow-50 border-yellow-500'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{alert.productName}</p>
                                            <p className="text-sm text-gray-600">
                                                Stock actual: {alert.currentStock} unidades
                                                {alert.status === 'critical' && ' - ¡Crítico!'}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/admin/productos/${alert.productId}`}
                                            className="btn-primary text-sm"
                                        >
                                            Reabastecer
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="card-luxury p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-700">Filtrar:</span>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        >
                            <option value="all">Todos los productos</option>
                            <option value="critical">🔴 Stock crítico</option>
                            <option value="low">🟡 Stock bajo</option>
                            <option value="ok">🟢 Stock normal</option>
                        </select>

                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar producto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="card-luxury p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-6">Inventario de Productos</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4">Producto</th>
                                    <th className="text-center py-3 px-4">Categoría</th>
                                    <th className="text-center py-3 px-4">Stock</th>
                                    <th className="text-center py-3 px-4">Estado</th>
                                    <th className="text-right py-3 px-4">Valor</th>
                                    <th className="text-center py-3 px-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => {
                                    const alert = alerts.find(a => a.productId === product.id);
                                    const stockValue = product.stock * (product.cost || 0);

                                    return (
                                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded-lg"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-sm text-gray-600">{product.subcategory}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <span className="font-semibold text-gray-900">
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                {alert ? (
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${alert.status === 'critical'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        {alert.status === 'critical' ? '🔴 Crítico' : '🟡 Bajo'}
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                        🟢 Normal
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-right py-3 px-4 font-semibold text-gray-900">
                                                ${stockValue.toLocaleString()}
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <Link
                                                    href={`/admin/productos/${product.id}`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Editar
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Movements */}
                <div className="card-luxury p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">Movimientos Recientes</h3>
                        <Link
                            href="/admin/inventario/movimientos"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Ver todos →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentMovements.map(movement => (
                            <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {movement.type === 'in' ? '📥' : movement.type === 'out' ? '📤' : '⚙️'}
                                    </span>
                                    <div>
                                        <p className="font-medium text-gray-900">{movement.productName}</p>
                                        <p className="text-sm text-gray-600">{movement.reason}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`font-semibold ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {movement.date.toLocaleDateString('es-ES')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
