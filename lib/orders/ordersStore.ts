/**
 * Enhanced Orders Store - Manages all orders with payment and shipping integration
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PaymentProvider, ShippingProvider } from '@/lib/integrations/integrationTypes';

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    id: string;
    
    // Customer Info
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    
    // Order Details
    items: OrderItem[];
    subtotal: number;
    discount: number;
    shipping: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        instructions?: string;
    };
    total: number;
    
    // Status
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    
    // Payment Integration
    paymentMethod?: PaymentProvider;
    paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentTransactionId?: string;
    
    // Shipping Integration
    shippingMethod?: ShippingProvider;
    shippingStatus?: 'pending' | 'label_created' | 'in_transit' | 'delivered';
    trackingNumber?: string;
    shippingLabelUrl?: string;
    
    // Accounting
    invoiceId?: string;
    invoiceUrl?: string;
    
    // Metadata
    notes?: string;
    createdAt: Date;
    updatedAt?: Date;
}

interface OrdersStore {
    orders: Order[];
    
    // Actions
    addOrder: (order: Omit<Order, 'id' | 'updatedAt'>) => string;
    updateOrder: (orderId: string, updates: Partial<Order>) => void;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
    
    // Getters
    getOrderById: (orderId: string) => Order | undefined;
    getAllOrders: () => Order[];
    getOrdersByStatus: (status: Order['status']) => Order[];
}

export const useOrdersStore = create<OrdersStore>()(
    persist(
        (set, get) => ({
            orders: [],

            addOrder: (orderData) => {
                const orderId = `ORD-${Date.now()}`;
                const newOrder: Order = {
                    ...orderData,
                    id: orderId,
                    updatedAt: new Date(),
                };

                set({ orders: [...get().orders, newOrder] });
                console.log('✅ Order created:', orderId);
                
                return orderId;
            },

            updateOrder: (orderId, updates) => {
                set({
                    orders: get().orders.map(order =>
                        order.id === orderId
                            ? { ...order, ...updates, updatedAt: new Date() }
                            : order
                    )
                });
                console.log('✅ Order updated:', orderId);
            },

            updateOrderStatus: (orderId, status) => {
                get().updateOrder(orderId, { status });
            },

            getOrderById: (orderId) => {
                return get().orders.find(order => order.id === orderId);
            },

            getAllOrders: () => {
                return get().orders.sort((a, b) => 
                    b.createdAt.getTime() - a.createdAt.getTime()
                );
            },

            getOrdersByStatus: (status) => {
                return get().orders
                    .filter(order => order.status === status)
                    .sort((a, b) => 
                        b.createdAt.getTime() - a.createdAt.getTime()
                    );
            }
        }),
        {
            name: 'luxe-orders-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
