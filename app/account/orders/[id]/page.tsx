// Order Detail with Tracking
// app/account/orders/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCustomerStore } from '@/lib/customer/customerStore';
import { useOrdersStore } from '@/lib/orders/ordersStore';
import { OrderService } from '@/lib/services/orderService';
import AccountLayout from '@/components/account/AccountLayout';
import { Package, Truck, CheckCircle, Clock, MapPin, FileText, Download } from 'lucide-react';
import { useToast } from '@/lib/hooks/useToast';

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useToast();
    const { email } = useCustomerStore();
    const [order, setOrder] = useState<any>(null);
    const [tracking, setTracking] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        useCustomerStore.persist.rehydrate();
        useOrdersStore.persist.rehydrate();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && params.id) {
            const orderStore = useOrdersStore.getState();
            const foundOrder = orderStore.getOrderById(params.id as string);
            
            if (foundOrder && foundOrder.customerEmail === email) {
                setOrder(foundOrder);
                loadTracking(foundOrder);
            } else {
                router.push('/account/orders');
            }
        }
    }, [mounted, params.id, email, router]);

    const loadTracking = async (order: any) => {
        if (order.trackingNumber && order.shippingMethod) {
            const result = await OrderService.trackOrder(order.id);
            if (result.success) {
                setTracking(result);
            }
        }
    };

    if (!mounted || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-rose-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    const timeline = [
        { status: 'pending', label: 'Orden Creada', icon: Package, completed: true },
        { status: 'paid', label: 'Pago Confirmado', icon: CheckCircle, completed: order.paymentStatus === 'paid' },
        { status: 'processing', label: 'En Preparación', icon: Clock, completed: order.status !== 'pending' },
        { status: 'shipped', label: 'Enviado', icon: Truck, completed: order.status === 'shipped' || order.status === 'delivered' },
        { status: 'delivered', label: 'Entregado', icon: MapPin, completed: order.status === 'delivered' }
    ];

    return (
        <AccountLayout title={`Pedido ${order.id}`}>
            {/* Order Status Timeline */}
            <div className="card-luxury p-6 mb-6">
                <h3 className="text-lg font-bold mb-6">Estado del Pedido</h3>
                <div className="relative">
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
                    <div className="relative flex justify-between">
                        {timeline.map((step, index) => (
                            <div key={step.status} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                                }`}>
                                    <step.icon className={`w-5 h-5 ${step.completed ? 'text-white' : 'text-gray-400'}`} />
                                </div>
                                <span className={`text-xs text-center ${step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tracking Info */}
            {order.trackingNumber && (
                <div className="card-luxury p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3 mb-3">
                        <Truck className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-bold">Información de Envío</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Número de Rastreo</p>
                            <p className="font-mono font-bold text-lg">{order.trackingNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Paquetería</p>
                            <p className="font-semibold capitalize">{order.shippingMethod}</p>
                        </div>
                    </div>
                    {order.shippingLabelUrl && (
                        <button
                            onClick={() => window.open(order.shippingLabelUrl, '_blank')}
                            className="mt-4 btn-secondary flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Descargar Guía
                        </button>
                    )}
                </div>
            )}

            {/* Order Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="card-luxury p-6">
                    <h3 className="text-lg font-bold mb-4">Detalles del Pedido</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Número de Orden</span>
                            <span className="font-semibold">{order.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Fecha</span>
                            <span className="font-semibold">
                                {new Date(order.createdAt).toLocaleDateString('es-MX', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Método de Pago</span>
                            <span className="font-semibold capitalize">{order.paymentMethod || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Estado de Pago</span>
                            <span className={`font-semibold ${
                                order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                                {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card-luxury p-6">
                    <h3 className="text-lg font-bold mb-4">Dirección de Envío</h3>
                    <p className="text-gray-700">{order.shippingAddress}</p>
                    <div className="mt-4 space-y-1 text-sm text-gray-600">
                        <p>{order.customerEmail}</p>
                        <p>{order.customerPhone}</p>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="card-luxury p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Productos</h3>
                <div className="space-y-4">
                    {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            <div className="card-luxury p-6">
                <h3 className="text-lg font-bold mb-4">Resumen</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Descuento</span>
                            <span>-${order.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-600">Envío</span>
                        <span>${order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                        <span>Total</span>
                        <span className="text-rose-gold-600">${order.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Request Invoice Button (Future) */}
                <button
                    onClick={() => toast.info('Función de facturación próximamente')}
                    className="w-full mt-6 btn-secondary flex items-center justify-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    Solicitar Factura
                </button>
            </div>
        </AccountLayout>
    );
}
