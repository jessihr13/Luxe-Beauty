// Order Confirmation Page
// app/order-confirmation/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useOrdersStore } from '@/lib/orders/ordersStore';
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        useOrdersStore.persist.rehydrate();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && orderId) {
            const orderStore = useOrdersStore.getState();
            const foundOrder = orderStore.getOrderById(orderId);
            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                router.push('/');
            }
        }
    }, [mounted, orderId, router]);

    if (!mounted || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-gold-50 via-nude-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-rose-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-gold-50 via-nude-50 to-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold gradient-text mb-2">
                        ¡Orden Confirmada!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Gracias por tu compra, {order.customerName}
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="card-luxury p-8 mb-6">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                        <div>
                            <p className="text-sm text-gray-600">Número de Orden</p>
                            <p className="text-2xl font-bold">{order.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-rose-gold-600">${order.total.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Pago</p>
                            <p className="font-semibold text-blue-600 capitalize">{order.paymentStatus || 'Procesando'}</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Envío</p>
                            <p className="font-semibold text-purple-600 capitalize">{order.shippingStatus || 'Preparando'}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <Mail className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Confirmación</p>
                            <p className="font-semibold text-green-600">Enviada</p>
                        </div>
                    </div>

                    {/* Tracking Number */}
                    {order.trackingNumber && (
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-1">Número de Rastreo</p>
                            <p className="text-xl font-bold text-purple-700">{order.trackingNumber}</p>
                            <p className="text-sm text-gray-600 mt-2">
                                Recibirás actualizaciones del envío por email
                            </p>
                        </div>
                    )}

                    {/* Shipping Address */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Dirección de Envío</h3>
                        <p className="text-gray-700">{order.shippingAddress}</p>
                        <p className="text-gray-600 text-sm mt-1">{order.customerEmail}</p>
                        <p className="text-gray-600 text-sm">{order.customerPhone}</p>
                    </div>

                    {/* Items */}
                    <div>
                        <h3 className="font-semibold mb-3">Productos</h3>
                        <div className="space-y-3">
                            {order.items.map((item: any, index: number) => (
                                <div key={index} className="flex gap-3 items-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/"
                        className="flex-1 btn-primary text-center"
                    >
                        Seguir Comprando
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="flex-1 btn-secondary"
                    >
                        Imprimir Confirmación
                    </button>
                </div>

                {/* Email Confirmation */}
                <div className="mt-8 text-center p-4 bg-blue-50 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-700">
                        Hemos enviado una confirmación a <strong>{order.customerEmail}</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
