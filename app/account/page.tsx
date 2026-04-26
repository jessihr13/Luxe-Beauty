// Account Dashboard Overview
// app/account/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useCustomerStore } from '@/lib/customer/customerStore';
import { useOrdersStore } from '@/lib/orders/ordersStore';
import { useDiscountsStore } from '@/lib/discounts/discountsStore';
import AccountLayout from '@/components/account/AccountLayout';
import { Package, Tag, Award, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AccountDashboardPage() {
    const { email, name, loyaltyPoints, loyaltyTier } = useCustomerStore();
    const [mounted, setMounted] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);

    useEffect(() => {
        useCustomerStore.persist.rehydrate();
        useOrdersStore.persist.rehydrate();
        useDiscountsStore.persist.rehydrate();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && email) {
            const orderStore = useOrdersStore.getState();
            const discountStore = useDiscountsStore.getState();
            
            // Get customer orders
            const customerOrders = orderStore.orders.filter(o => o.customerEmail === email);
            setOrders(customerOrders);
            
            // Get available coupons
            const availableCoupons = discountStore.discounts.filter(d => 
                d.type === 'coupon' && d.isActive
            );
            setCoupons(availableCoupons);
        }
    }, [mounted, email]);

    if (!mounted) return null;

    const recentOrders = orders.slice(0, 3);
    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

    return (
        <AccountLayout title="Mi Cuenta">
            {/* Welcome Section */}
            <div className="card-luxury p-6 mb-6 bg-gradient-to-r from-rose-gold-50 to-nude-50">
                <h2 className="text-2xl font-bold mb-2">¡Bienvenido, {name}!</h2>
                <p className="text-gray-600">Aquí puedes gestionar tus pedidos, cupones y más</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card-luxury p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Pedidos</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                        </div>
                    </div>
                </div>

                <div className="card-luxury p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">En Proceso</p>
                            <p className="text-2xl font-bold">{activeOrders.length}</p>
                        </div>
                    </div>
                </div>

                <div className="card-luxury p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Tag className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Cupones</p>
                            <p className="text-2xl font-bold">{coupons.length}</p>
                        </div>
                    </div>
                </div>

                <div className="card-luxury p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Award className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Puntos</p>
                            <p className="text-2xl font-bold">{loyaltyPoints}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card-luxury p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Pedidos Recientes</h3>
                    <Link href="/account/orders" className="text-rose-gold-600 hover:text-rose-gold-700 text-sm font-medium">
                        Ver todos →
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No tienes pedidos aún</p>
                        <Link href="/" className="text-rose-gold-600 hover:underline mt-2 inline-block">
                            Comenzar a comprar
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className="block p-4 border border-gray-200 rounded-lg hover:border-rose-gold-300 hover:shadow-sm transition-all"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">{order.id}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {order.status === 'delivered' ? 'Entregado' :
                                         order.status === 'shipped' ? 'Enviado' :
                                         order.status === 'processing' ? 'En Proceso' :
                                         'Pendiente'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span className="font-semibold text-rose-gold-600">${order.total.toFixed(2)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Available Coupons */}
            <div className="card-luxury p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Cupones Disponibles</h3>
                    <Link href="/account/coupons" className="text-rose-gold-600 hover:text-rose-gold-700 text-sm font-medium">
                        Ver todos →
                    </Link>
                </div>

                {coupons.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Tag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No hay cupones disponibles</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {coupons.slice(0, 4).map((coupon) => (
                            <div key={coupon.id} className="p-4 border-2 border-dashed border-rose-gold-300 rounded-lg bg-rose-gold-50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-rose-gold-700">{coupon.code}</span>
                                    <Tag className="w-5 h-5 text-rose-gold-600" />
                                </div>
                                <p className="text-sm text-gray-700 mb-1">{coupon.name}</p>
                                <p className="text-xs text-gray-600">
                                    {coupon.discountType === 'percentage' 
                                        ? `${coupon.discountValue}% de descuento`
                                        : `$${coupon.discountValue} de descuento`}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AccountLayout>
    );
}
