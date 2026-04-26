'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ShoppingCart,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Filter,
    ArrowLeft,
    Eye
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useOrdersStore } from '@/lib/orders/ordersStore';
import { SkeletonTable } from '@/components/ui/Skeleton';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { fadeIn, staggerContainer } from '@/lib/animations';

export default function OrdersPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'all'>('all');
    const [mounted, setMounted] = useState(false);
    
    const getAllOrders = useOrdersStore(state => state.getAllOrders);
    const orders = getAllOrders();

    useEffect(() => {
        setMounted(true);
        useOrdersStore.persist.rehydrate();
    }, []);

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    if (!mounted) {
        return <AdminPageLayout><div>Cargando...</div></AdminPageLayout>;
    }

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Calculate metrics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    return (
        <AdminPageLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-serif font-bold gradient-text">
                            Gestión de Pedidos
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Control de órdenes y envíos
                        </p>
                    </div>
                    <Link
                        href="/admin/pedidos/nuevo"
                        className="btn-primary flex items-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Nuevo Pedido
                    </Link>
                </div>

                {/* Summary Cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid md:grid-cols-5 gap-6 mb-8"
                >
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {totalOrders}
                        </h3>
                        <p className="text-sm text-gray-600">Total pedidos</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gray-100 rounded-full">
                                <Clock className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {pendingOrders}
                        </h3>
                        <p className="text-sm text-gray-600">Pendientes</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {processingOrders}
                        </h3>
                        <p className="text-sm text-gray-600">Procesando</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Truck className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {shippedOrders}
                        </h3>
                        <p className="text-sm text-gray-600">Enviados</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            ${totalRevenue.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600">Ingresos</p>
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
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pending">⏳ Pendientes</option>
                            <option value="processing">⚙️ Procesando</option>
                            <option value="shipped">📦 Enviados</option>
                            <option value="delivered">✅ Entregados</option>
                            <option value="cancelled">❌ Cancelados</option>
                        </select>

                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por orden, cliente o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="card-luxury p-6">
                    <h3 className="text-xl font-semibold mb-6">Lista de Pedidos ({filteredOrders.length})</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4">Orden</th>
                                    <th className="text-left py-3 px-4">Cliente</th>
                                    <th className="text-center py-3 px-4">Productos</th>
                                    <th className="text-center py-3 px-4">Fecha</th>
                                    <th className="text-right py-3 px-4">Total</th>
                                    <th className="text-center py-3 px-4">Estado</th>
                                    <th className="text-center py-3 px-4">Tracking</th>
                                    <th className="text-center py-3 px-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => {
                                    const statusInfo = {
                                        pending: { icon: '⏳', name: 'Pendiente' },
                                        processing: { icon: '⚙️', name: 'Procesando' },
                                        shipped: { icon: '📦', name: 'Enviado' },
                                        delivered: { icon: '✅', name: 'Entregado' },
                                        cancelled: { icon: '❌', name: 'Cancelado' }
                                    }[order.status];

                                    return (
                                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{order.id}</p>
                                                    <p className="text-xs text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.customerName}</p>
                                                    <p className="text-sm text-gray-600">{order.customerEmail}</p>
                                                </div>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                                                    {order.items.length} items
                                                </span>
                                            </td>
                                            <td className="text-center py-3 px-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: 'short'
                                                })}
                                            </td>
                                            <td className="text-right py-3 px-4 font-semibold text-gray-900">
                                                ${order.total.toLocaleString()}
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {statusInfo.icon} {statusInfo.name}
                                                </span>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <span className="text-xs text-gray-400">-</span>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <Link
                                                    href={`/admin/pedidos/${order.id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Ver
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredOrders.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No se encontraron pedidos
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
}
