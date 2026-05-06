'use client';

import useOrdersStore from '@/lib/orders/ordersStore';
import type { Order } from '@/lib/orders/ordersStore';

type NewOrder = Omit<Order, 'id' | 'updatedAt'>;

export default function OrderReview({ items, shipping, payment, subtotal, total }: any) {
    const addOrder = useOrdersStore(state => state.addOrder);

    const handlePlaceOrder = async () => {

        const orderData: NewOrder = {
            items: items.map((item: any) => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            })),

            customerName: shipping.fullName,
            customerEmail: shipping.email,
            customerPhone: shipping.phone,
            shippingAddress: `${shipping.address.street}, ${shipping.address.city}, ${shipping.address.state}, ${shipping.address.zipCode}`,

            shipping: {
                address: shipping.address?.street ?? '',
                city: shipping.address?.city ?? '',
                state: shipping.address?.state ?? '',
                zipCode: shipping.address?.zipCode ?? '',
                instructions: shipping.deliveryInstructions ?? '',
            },

            paymentMethod: payment.type,

            subtotal,
            discount: 0,
            total,

            status: 'pending',

            createdAt: new Date(),
        };

        const orderNumber = addOrder(orderData);

        console.log('🎉 Order created:', orderNumber);
    };
}