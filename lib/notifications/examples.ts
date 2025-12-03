/**
 * Ejemplo de uso del sistema de notificaciones
 * Este archivo muestra cómo integrar las notificaciones en tu aplicación
 */

import { notificationService } from '@/lib/notifications/notificationService';
import { products } from '@/lib/data/products';

/**
 * Ejemplo 1: Enviar confirmación de pedido
 */
export async function handleNewOrder(orderData: any) {
    // Enviar confirmación al cliente
    await notificationService.sendOrderConfirmation(
        orderData.customerEmail,
        {
            orderNumber: orderData.orderNumber,
            customerName: orderData.customerName,
            items: orderData.items,
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            total: orderData.total,
            shippingAddress: orderData.shippingAddress,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
        }
    );

    // Notificar al admin
    await notificationService.notifyAdminNewOrder({
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total,
        shippingAddress: orderData.shippingAddress,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
    });
}

/**
 * Ejemplo 2: Actualizar estado de pedido
 */
export async function handleStatusUpdate(orderNumber: string, newStatus: string) {
    await notificationService.sendStatusUpdate(
        'cliente@example.com',
        {
            orderNumber,
            customerName: 'María García',
            oldStatus: 'processing',
            newStatus,
            trackingNumber: newStatus === 'shipped' ? 'TRACK123456789' : undefined,
            estimatedDelivery: newStatus === 'shipped' ? '5 de Diciembre, 2024' : undefined,
            message: newStatus === 'shipped'
                ? 'Tu pedido ha sido enviado y está en camino.'
                : undefined,
        }
    );
}

/**
 * Ejemplo 3: Verificar stock y enviar alertas
 */
export async function checkInventoryLevels() {
    await notificationService.checkStockLevels(products);
}

/**
 * Ejemplo 4: Notificar meta alcanzada
 */
export async function checkSalesGoals(currentSales: number, goalType: 'daily' | 'weekly' | 'monthly') {
    const goals = {
        daily: 5000,
        weekly: 30000,
        monthly: 120000,
    };

    const goal = goals[goalType];
    const percentage = (currentSales / goal) * 100;

    if (percentage >= 100) {
        await notificationService.sendGoalAchieved({
            goalType,
            goalAmount: goal,
            actualAmount: currentSales,
            percentage,
            period: new Date().toLocaleDateString('es-ES'),
        });
    }
}

/**
 * Ejemplo 5: Configurar preferencias
 */
export function configureNotifications() {
    notificationService.updatePreferences({
        adminEmail: 'admin@luxebeauty.com',
        stockThreshold: 10,
        orderNotifications: true,
        stockNotifications: true,
        goalNotifications: true,
        statusNotifications: true,
    });
}

// Exportar para uso en otros archivos
export { notificationService };
