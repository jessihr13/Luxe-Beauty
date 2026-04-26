'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Search,
    Filter,
    Calendar,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useInventoryStore, movementTypeInfo, type MovementType } from '@/lib/inventory/inventoryStore';
import { useToast } from '@/lib/hooks/useToast';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { SearchInput } from '@/components/ui/SearchInput';
import { staggerContainer } from '@/lib/animations';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function InventoryMovementsPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<MovementType | 'all'>('all');

    const getAllMovements = useInventoryStore(state => state.getAllMovements);
    const movements = getAllMovements();

    useEffect(() => {
        setMounted(true);
        useInventoryStore.persist.rehydrate();
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

    // Filter movements
    const filteredMovements = movements.filter(movement => {
        const matchesSearch =
            movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' || movement.type === filterType;

        return matchesSearch && matchesType;
    });

    // Calculate metrics
    const totalIn = movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0);
    const totalOut = movements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0);
    const totalAdjustments = movements.filter(m => m.type === 'adjustment').length;

    return (
        <AdminPageLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-serif font-bold gradient-text">
                            Movimientos de Inventario
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Historial completo de entradas y salidas
                        </p>
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
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {movements.length}
                        </h3>
                        <p className="text-sm text-gray-600">Total movimientos</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            +{totalIn}
                        </h3>
                        <p className="text-sm text-gray-600">Unidades ingresadas</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            -{totalOut}
                        </h3>
                        <p className="text-sm text-gray-600">Unidades vendidas</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <span className="text-2xl">⚙️</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {totalAdjustments}
                        </h3>
                        <p className="text-sm text-gray-600">Ajustes realizados</p>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="card-luxury p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-700">Filtrar:</span>
                        </div>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as MovementType | 'all')}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="in">📥 Entradas</option>
                            <option value="out">📤 Salidas</option>
                            <option value="adjustment">⚙️ Ajustes</option>
                        </select>

                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por producto, razón o usuario..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Movements Table */}
                <div className="card-luxury p-6">
                    <h3 className="text-xl font-semibold mb-6">
                        Historial de Movimientos ({filteredMovements.length})
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4">Fecha</th>
                                    <th className="text-left py-3 px-4">Producto</th>
                                    <th className="text-center py-3 px-4">Tipo</th>
                                    <th className="text-center py-3 px-4">Cantidad</th>
                                    <th className="text-center py-3 px-4">Stock Anterior</th>
                                    <th className="text-center py-3 px-4">Stock Nuevo</th>
                                    <th className="text-left py-3 px-4">Razón</th>
                                    <th className="text-left py-3 px-4">Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMovements.map(movement => {
                                    const typeInfo = movementTypeInfo[movement.type];

                                    return (
                                        <tr key={movement.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(movement.date).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-gray-900">{movement.productName}</p>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${movement.type === 'in' ? 'bg-green-100 text-green-700' :
                                                    movement.type === 'out' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {typeInfo.icon} {typeInfo.name}
                                                </span>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <span className={`font-semibold ${movement.type === 'in' ? 'text-green-600' :
                                                    movement.type === 'out' ? 'text-red-600' :
                                                        'text-yellow-600'
                                                    }`}>
                                                    {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}
                                                    {movement.quantity}
                                                </span>
                                            </td>
                                            <td className="text-center py-3 px-4 text-gray-600">
                                                {movement.previousStock}
                                            </td>
                                            <td className="text-center py-3 px-4 font-semibold text-gray-900">
                                                {movement.newStock}
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-sm text-gray-700">{movement.reason}</p>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {movement.createdBy}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredMovements.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No se encontraron movimientos
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Note */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>💡 Tip:</strong> Los movimientos de inventario se registran automáticamente cuando:
                        <br />• Se crea o edita un producto (Entrada)
                        <br />• Se procesa una venta (Salida)
                        <br />• Se realiza un ajuste manual (Ajuste)
                    </p>
                </div>
            </div>
        </AdminPageLayout>
    );
}
