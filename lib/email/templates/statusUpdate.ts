import { EmailLayout } from './base';

export interface StatusUpdateData {
    orderNumber: string;
    customerName: string;
    oldStatus: string;
    newStatus: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    message?: string;
}

export function statusUpdateTemplate(data: StatusUpdateData): string {
    const statusConfig = {
        pending: { icon: '⏳', color: '#F59E0B', text: 'Pendiente' },
        processing: { icon: '⚙️', color: '#3B82F6', text: 'Procesando' },
        shipped: { icon: '📦', color: '#8B5CF6', text: 'Enviado' },
        delivered: { icon: '✅', color: '#10B981', text: 'Entregado' },
        cancelled: { icon: '❌', color: '#EF4444', text: 'Cancelado' },
    };

    const status = statusConfig[data.newStatus as keyof typeof statusConfig] || statusConfig.pending;

    const content = `
        <h1 style="color: ${status.color}; margin-top: 0;">${status.icon} Actualización de Pedido</h1>
        
        <p>Hola ${data.customerName},</p>
        
        <p>Tu pedido <strong>${data.orderNumber}</strong> ha sido actualizado.</p>

        <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <div style="margin-bottom: 20px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Estado Anterior</p>
                <p style="margin: 5px 0; font-size: 18px; color: #9ca3af; text-decoration: line-through;">
                    ${statusConfig[data.oldStatus as keyof typeof statusConfig]?.text || data.oldStatus}
                </p>
            </div>

            <div style="margin: 20px 0;">
                <svg width="50" height="50" viewBox="0 0 50 50">
                    <path d="M25 5 L25 45 M15 35 L25 45 L35 35" stroke="${status.color}" stroke-width="3" fill="none"/>
                </svg>
            </div>

            <div style="margin-top: 20px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Estado Actual</p>
                <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: ${status.color};">
                    ${status.icon} ${status.text}
                </p>
            </div>
        </div>

        ${data.message ? `
            <div style="background-color: ${status.color}20; border-left: 4px solid ${status.color}; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;">${data.message}</p>
            </div>
        ` : ''}

        ${data.trackingNumber ? `
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #374151;">Información de Envío</h3>
                <p style="margin: 5px 0;"><strong>Número de rastreo:</strong></p>
                <p style="margin: 5px 0; font-family: monospace; font-size: 18px; color: #8B5CF6;">
                    ${data.trackingNumber}
                </p>
                ${data.estimatedDelivery ? `
                    <p style="margin: 15px 0 5px 0;"><strong>Fecha estimada de entrega:</strong></p>
                    <p style="margin: 5px 0; color: #10B981; font-weight: bold;">
                        ${data.estimatedDelivery}
                    </p>
                ` : ''}
            </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://luxebeauty.com/pedidos/${data.orderNumber}" class="button">
                Ver Detalles del Pedido
            </a>
        </div>

        ${data.newStatus === 'delivered' ? `
            <div style="background-color: #D1FAE5; border-left: 4px solid #10B981; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #065F46;">
                    🎉 <strong>¡Gracias por tu compra!</strong> Esperamos que disfrutes tus productos.
                </p>
            </div>
        ` : ''}

        <p style="color: #6b7280; font-size: 14px;">
            Si tienes alguna pregunta, no dudes en contactarnos.
        </p>
    `;

    return EmailLayout({
        children: content,
        preheader: `Tu pedido ${data.orderNumber} ahora está ${status.text}`,
    });
}
