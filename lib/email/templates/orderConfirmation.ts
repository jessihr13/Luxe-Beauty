import { EmailLayout } from './base';

export interface OrderConfirmationData {
    orderNumber: string;
    customerName: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    shipping: number;
    total: number;
    shippingAddress: string;
    estimatedDelivery: string;
}

export function orderConfirmationTemplate(data: OrderConfirmationData): string {
    const itemsHtml = data.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
    `).join('');

    const content = `
        <h1 style="color: #D4816F; margin-top: 0;">¡Gracias por tu pedido!</h1>
        
        <p>Hola ${data.customerName},</p>
        
        <p>Hemos recibido tu pedido y lo estamos preparando con mucho cuidado. Te enviaremos una notificación cuando esté en camino.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #374151;">Detalles del Pedido</h2>
            <p style="margin: 5px 0;"><strong>Número de pedido:</strong> ${data.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Fecha estimada de entrega:</strong> ${data.estimatedDelivery}</p>
        </div>

        <h3 style="color: #374151;">Productos</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr style="background-color: #f9fafb;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Producto</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Cantidad</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Precio</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>

        <div style="text-align: right; margin: 20px 0;">
            <p style="margin: 5px 0;">Subtotal: $${data.subtotal.toFixed(2)}</p>
            <p style="margin: 5px 0;">Envío: $${data.shipping.toFixed(2)}</p>
            <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #D4816F;">Total: $${data.total.toFixed(2)}</p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Dirección de Envío</h3>
            <p style="margin: 0; white-space: pre-line;">${data.shippingAddress}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://luxebeauty.com/pedidos/${data.orderNumber}" class="button">
                Ver Estado del Pedido
            </a>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
            Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
        </p>
    `;

    return EmailLayout({
        children: content,
        preheader: `Tu pedido ${data.orderNumber} ha sido confirmado`,
    });
}
