// Orders List Page
// app/account/orders/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCustomerStore } from '@/lib/customer/customerStore';
import { useOrdersStore } from '@/lib/orders/ordersStore';
import AccountLayout from '@/components/account/AccountLayout';
import { Package, Search, Filter } from 'lucide-react';

export default function OrdersPage() {
    const { email } = useCustomerStore();
    const [mounted, setMounted] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        useCustomerStore.persist.rehydrate();
        useOrdersStore.persist.rehydrate();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && email) {
            const orderStore = useOrdersStore.getState();
            let customerOrders = orderStore.orders.filter(o => o.customerEmail === email);
            
            if (filter !== 'all') {
                customerOrders = customerOrders.filter(o => o.status === filter);
            }
            
            if (searchTerm) {
                customerOrders = customerOrders.filter(o => 
                    o.id.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            setOrders(customerOrders);
        }
    }, [mounted, email, filter, searchTerm]);

    if (!mounted) return null;

    return (
        <AccountLayout title="Mis Pedidos">
            {/* Filters */}
            <div className="card-luxury p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por número de orden..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === status
                                        ? 'bg-rose-gold-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="card-luxury p-12 text-center">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No se encontraron pedidos</h3>
                    <p className="text-gray-600 mb-4">
                        {filter !== 'all' ? 'Intenta con otro filtro' : 'Aún no has realizado ningún pedido'}
                    </p>
                    <Link href="/" className="btn-primary inline-block">
                        Comenzar a Comprar
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.id}`}
                            className="card-luxury p-6 hover:shadow-lg transition-shadow block"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{order.id}</h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString('es-MX', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 mt-4 md:mt-0">
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
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
                                    <span className="text-xl font-bold text-rose-gold-600">
                                        ${order.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {order.items.slice(0, 4).map((item: any, idx: number) => (
                                    <img
                                        key={idx}
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                    />
                                ))}
                                {order.items.length > 4 && (
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-medium text-gray-600">
                                            +{order.items.length - 4}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {order.trackingNumber && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        Tracking: <span className="font-mono font-semibold">{order.trackingNumber}</span>
                                    </p>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </AccountLayout>
    );
}
