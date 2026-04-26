'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    Phone,
    Mail,
    Calendar,
    DollarSign,
    Truck,
    Download,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useOrdersStore, type Order } from '@/lib/orders/ordersStore';
import { useToast } from '@/lib/hooks/useToast';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { isAdmin, isAuthenticated } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [updating, setUpdating] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    const getOrderById = useOrdersStore(state => state.getOrderById);
    const updateOrderStatus = useOrdersStore(state => state.updateOrderStatus);
    const toast = useToast();

    useEffect(() => {
        setMounted(true);
        useOrdersStore.persist.rehydrate();
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
            return;
        }

        const id = params.id as string;
        const foundOrder = getOrderById(id);
        if (foundOrder) {
            setOrder(foundOrder);
        } else {
            router.push('/admin/pedidos');
        }
    }, [params.id, isAuthenticated, isAdmin, router, getOrderById, mounted]);

    const handleStatusChange = (newStatus: Order['status']) => {
        if (!order) return;

        setUpdating(true);
        updateOrderStatus(order.id, newStatus);
        const updatedOrder = getOrderById(order.id);
        if (updatedOrder) {
            setOrder(updatedOrder);
        }
        setTimeout(() => setUpdating(false), 500);
    };

    if (!mounted || !order) {
        return (
            <AdminPageLayout>
                <div className="min-h-screen flex items-center justify-center">Cargando...</div>
            </AdminPageLayout>
        );
    }

    const statusInfo = {
        pending: { icon: '⏳', name: 'Pendiente' },
        processing: { icon: '⚙️', name: 'Procesando' },
        shipped: { icon: '📦', name: 'Enviado' },
        delivered: { icon: '✅', name: 'Entregado' },
        cancelled: { icon: '❌', name: 'Cancelado' }
    }[order.status];

    return (
        <AdminPageLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/pedidos"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-serif font-bold gradient-text">
                                Pedido {order.id}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Creado el {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Products */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Productos ({order.items.length})
                            </h3>
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-sm text-gray-600">${item.price.toFixed(2)} c/u</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío:</span>
                                    <span>${order.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                                    <span>Total:</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Dirección de Envío
                            </h3>
                            <div className="space-y-2 text-gray-700">
                                <p>{order.shippingAddress}</p>
                                {order.notes && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        <strong>Instrucciones:</strong> {order.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-4">Estado del Pedido</h3>
                            <div className="mb-4">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                    }`}>
                                    <span className="text-lg">{statusInfo.icon}</span>
                                    {statusInfo.name}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => handleStatusChange('processing')}
                                    disabled={updating || order.status === 'processing'}
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    Marcar como Procesando
                                </button>
                                <button
                                    onClick={() => handleStatusChange('shipped')}
                                    disabled={updating || order.status === 'shipped'}
                                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    Marcar como Enviado
                                </button>
                                <button
                                    onClick={() => handleStatusChange('delivered')}
                                    disabled={updating || order.status === 'delivered'}
                                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    Marcar como Entregado
                                </button>
                                <button
                                    onClick={() => handleStatusChange('cancelled')}
                                    disabled={updating || order.status === 'cancelled'}
                                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    Cancelar Pedido
                                </button>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Cliente
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span>{order.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">{order.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span>{order.customerPhone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="card-luxury p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Historial
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Pedido creado</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                </div>
                                {order.updatedAt !== order.createdAt && (
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">Última actualización</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.updatedAt || order.createdAt).toLocaleString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
}
