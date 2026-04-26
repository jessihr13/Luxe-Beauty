// Update OrderService to auto-set customer in store
// lib/services/orderService.ts (UPDATE)

import { useOrdersStore } from '@/lib/orders/ordersStore';
import { useCartStore } from '@/lib/cart/cartStore';
import { useCustomerStore } from '@/lib/customer/customerStore';
import { PaymentService } from './paymentService';
import { ShippingService } from './shippingService';
import { PaymentProvider, ShippingProvider } from '@/lib/integrations/integrationTypes';

export interface CreateOrderParams {
    customerInfo: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: PaymentProvider;
    shippingMethod: ShippingProvider;
    notes?: string;
}

export interface OrderResult {
    success: boolean;
    orderId?: string;
    error?: string;
}

export class OrderService {
    /**
     * Create and process complete order
     */
    static async createOrder(params: CreateOrderParams): Promise<OrderResult> {
        try {
            const cartStore = useCartStore.getState();
            const orderStore = useOrdersStore.getState();
            const customerStore = useCustomerStore.getState();

            // Auto-login customer (email-based)
            customerStore.setCustomer(
                params.customerInfo.email,
                params.customerInfo.name,
                params.customerInfo.phone
            );

            // 1. Get cart items
            const items = cartStore.items;
            if (items.length === 0) {
                return { success: false, error: 'Cart is empty' };
            }

            // 2. Calculate totals
            const subtotal = cartStore.getSubtotal();
            const discountTotal = 0;
            
            // 3. Calculate shipping cost
            const shippingRates = await ShippingService.calculateShippingRates(
                { city: 'Origin City' },
                {
                    city: params.customerInfo.city,
                    state: params.customerInfo.state,
                    zipCode: params.customerInfo.zipCode
                },
                { weight: 1, dimensions: { length: 10, width: 10, height: 10 } }
            );

            const selectedShipping = shippingRates.find(r => r.provider === params.shippingMethod);
            const shippingCost = selectedShipping?.cost || 0;

            const total = subtotal - discountTotal + shippingCost;

            // 4. Create order
            const orderId = `ORD-${Date.now()}`;
            orderStore.addOrder({
                id: orderId,
                customerName: params.customerInfo.name,
                customerEmail: params.customerInfo.email,
                customerPhone: params.customerInfo.phone,
                shippingAddress: `${params.customerInfo.address}, ${params.customerInfo.city}, ${params.customerInfo.state} ${params.customerInfo.zipCode}`,
                items: items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image
                })),
                subtotal,
                discount: discountTotal,
                shipping: shippingCost,
                total,
                status: 'pending',
                paymentStatus: 'pending',
                paymentMethod: params.paymentMethod,
                shippingStatus: 'pending',
                shippingMethod: params.shippingMethod,
                notes: params.notes,
                createdAt: new Date()
            });

            // 5. Process payment
            const paymentResult = await PaymentService.processPayment(
                params.paymentMethod,
                total,
                'MXN',
                { orderId, customerEmail: params.customerInfo.email }
            );

            if (!paymentResult.success) {
                orderStore.updateOrder(orderId, {
                    paymentStatus: 'failed',
                    status: 'cancelled'
                });
                return {
                    success: false,
                    error: `Payment failed: ${paymentResult.error}`
                };
            }

            // 6. Update order with payment info
            orderStore.updateOrder(orderId, {
                paymentStatus: 'paid',
                paymentTransactionId: paymentResult.transactionId,
                status: 'processing'
            });

            // 7. Generate shipping label automatically
            const labelResult = await this.generateShippingLabel(orderId);
            
            if (labelResult.success) {
                orderStore.updateOrder(orderId, {
                    shippingStatus: 'label_created',
                    trackingNumber: labelResult.trackingNumber,
                    shippingLabelUrl: labelResult.labelUrl
                });
            }

            // 8. Award loyalty points (10 points per $10)
            const pointsEarned = Math.floor(total / 10) * 10;
            customerStore.addLoyaltyPoints(pointsEarned);

            // 9. Clear cart
            cartStore.clearCart();

            return {
                success: true,
                orderId
            };

        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate shipping label for an order
     */
    static async generateShippingLabel(orderId: string): Promise<{
        success: boolean;
        trackingNumber?: string;
        labelUrl?: string;
        error?: string;
    }> {
        try {
            const orderStore = useOrdersStore.getState();
            const order = orderStore.orders.find(o => o.id === orderId);

            if (!order) {
                return { success: false, error: 'Order not found' };
            }

            if (!order.shippingMethod) {
                return { success: false, error: 'No shipping method selected' };
            }

            const shipmentData = {
                orderId: order.id,
                recipient: {
                    name: order.customerName,
                    address: order.shippingAddress,
                    phone: order.customerPhone
                },
                items: order.items,
                weight: 1,
                dimensions: { length: 10, width: 10, height: 10 }
            };

            const result = await ShippingService.createShippingLabel(
                order.shippingMethod,
                shipmentData
            );

            return result;

        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Refund an order
     */
    static async refundOrder(orderId: string, amount?: number): Promise<OrderResult> {
        try {
            const orderStore = useOrdersStore.getState();
            const order = orderStore.orders.find(o => o.id === orderId);

            if (!order) {
                return { success: false, error: 'Order not found' };
            }

            if (!order.paymentMethod || !order.paymentTransactionId) {
                return { success: false, error: 'No payment information found' };
            }

            const refundResult = await PaymentService.refundPayment(
                order.paymentMethod,
                order.paymentTransactionId,
                amount
            );

            if (refundResult.success) {
                orderStore.updateOrder(orderId, {
                    paymentStatus: 'refunded',
                    status: 'cancelled'
                });

                return { success: true, orderId };
            } else {
                return { success: false, error: refundResult.error };
            }

        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Track shipment for an order
     */
    static async trackOrder(orderId: string) {
        try {
            const orderStore = useOrdersStore.getState();
            const order = orderStore.orders.find(o => o.id === orderId);

            if (!order) {
                return { success: false, error: 'Order not found' };
            }

            if (!order.shippingMethod || !order.trackingNumber) {
                return { success: false, error: 'No tracking information found' };
            }

            const trackingResult = await ShippingService.trackShipment(
                order.shippingMethod,
                order.trackingNumber
            );

            return trackingResult;

        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
}
