/**
 * Adapter to convert new Order format to legacy format for analytics
 */

import { Order } from '@/lib/orders/ordersStore';
import { LegacyOrder } from '@/lib/data/orders';

/**
 * Convert new Order format to legacy format for analytics compatibility
 */
export function convertToLegacyOrder(order: Order): LegacyOrder {
    return {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        customer: {
            name: order.customer.name,
            email: order.customer.email,
            phone: order.customer.phone
        },
        items: order.items.map(item => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        })),
        subtotal: order.subtotal,
        shipping: order.shippingCost,
        total: order.total,
        status: order.status,
        shippingAddress: {
            street: order.shipping.address,
            city: order.shipping.city,
            state: order.shipping.state,
            zipCode: order.shipping.zipCode,
            country: 'México' // Default
        },
        tracking: order.payment.method === 'card' && order.payment.lastFourDigits ? {
            number: `TRACK-${order.orderNumber}`,
            courier: 'fedex',
            url: `https://www.fedex.com/fedextrack/?trknbr=TRACK-${order.orderNumber}`
        } : undefined,
        attribution: undefined,
        statusHistory: [
            {
                status: order.status,
                timestamp: new Date(order.updatedAt)
            }
        ],
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
        trackingNumber: undefined,
        courier: undefined,
        processedAt: order.status !== 'pending' ? new Date(order.updatedAt) : undefined,
        shippedAt: order.status === 'shipped' || order.status === 'delivered' ? new Date(order.updatedAt) : undefined,
        deliveredAt: order.status === 'delivered' ? new Date(order.updatedAt) : undefined
    };
}

/**
 * Convert array of new Orders to legacy format
 */
export function convertToLegacyOrders(orders: Order[]): LegacyOrder[] {
    return orders.map(convertToLegacyOrder);
}
