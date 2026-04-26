import { emailService } from '../email/emailService';
import { orderConfirmationTemplate, type OrderConfirmationData } from '../email/templates/orderConfirmation';
import { lowStockAlertTemplate, type LowStockAlertData } from '../email/templates/lowStockAlert';
import { goalAchievedTemplate, type GoalAchievedData } from '../email/templates/goalAchieved';
import { statusUpdateTemplate, type StatusUpdateData } from '../email/templates/statusUpdate';

/**
 * Servicio de Notificaciones
 * Maneja el envío de notificaciones por email basado en eventos del sistema
 */

export interface NotificationPreferences {
    orderNotifications: boolean;
    stockNotifications: boolean;
    goalNotifications: boolean;
    statusNotifications: boolean;
    adminEmail: string;
    stockThreshold: number;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
    orderNotifications: true,
    stockNotifications: true,
    goalNotifications: true,
    statusNotifications: true,
    adminEmail: process.env.ADMIN_EMAIL || 'admin@luxebeauty.com',
    stockThreshold: 10,
};

class NotificationService {
    private preferences: NotificationPreferences;

    constructor() {
        this.preferences = DEFAULT_PREFERENCES;
    }

    /**
     * Actualiza las preferencias de notificación
     */
    updatePreferences(newPreferences: Partial<NotificationPreferences>) {
        this.preferences = { ...this.preferences, ...newPreferences };
    }

    /**
     * Obtiene las preferencias actuales
     */
    getPreferences(): NotificationPreferences {
        return { ...this.preferences };
    }

    /**
     * Envía confirmación de pedido al cliente
     */
    async sendOrderConfirmation(
        customerEmail: string,
        data: OrderConfirmationData
    ): Promise<boolean> {
        if (!this.preferences.orderNotifications) {
            console.log('📧 Notificaciones de pedidos desactivadas');
            return false;
        }

        try {
            const html = orderConfirmationTemplate(data);
            const result = await emailService.sendEmail({
                to: customerEmail,
                subject: `Confirmación de Pedido #${data.orderNumber}`,
                html,
            });

            if (result.success) {
                console.log(`✅ Confirmación de pedido enviada a ${customerEmail}`);
            }

            return result.success;
        } catch (error) {
            console.error('Error enviando confirmación de pedido:', error);
            return false;
        }
    }

    /**
     * Notifica a admin sobre nuevo pedido
     */
    async notifyAdminNewOrder(data: OrderConfirmationData): Promise<boolean> {
        if (!this.preferences.orderNotifications) {
            return false;
        }

        try {
            const html = `
                <h2>Nuevo Pedido Recibido</h2>
                <p><strong>Número:</strong> ${data.orderNumber}</p>
                <p><strong>Cliente:</strong> ${data.customerName}</p>
                <p><strong>Total:</strong> $${data.total.toFixed(2)}</p>
                <p><strong>Productos:</strong> ${data.items.length}</p>
                <a href="https://luxebeauty.com/admin/pedidos/${data.orderNumber}">Ver Detalles</a>
            `;

            const result = await emailService.sendEmail({
                to: this.preferences.adminEmail,
                subject: `Nuevo Pedido #${data.orderNumber}`,
                html,
            });

            return result.success;
        } catch (error) {
            console.error('Error notificando admin sobre pedido:', error);
            return false;
        }
    }

    /**
     * Envía alerta de stock bajo
     */
    async sendLowStockAlert(data: LowStockAlertData): Promise<boolean> {
        if (!this.preferences.stockNotifications) {
            console.log('📧 Notificaciones de stock desactivadas');
            return false;
        }

        // Solo enviar si está por debajo del umbral
        if (data.currentStock > this.preferences.stockThreshold) {
            return false;
        }

        try {
            const html = lowStockAlertTemplate(data);
            const result = await emailService.sendEmail({
                to: this.preferences.adminEmail,
                subject: `⚠️ Alerta de Stock: ${data.productName}`,
                html,
            });

            if (result.success) {
                console.log(`✅ Alerta de stock enviada para ${data.productName}`);
            }

            return result.success;
        } catch (error) {
            console.error('Error enviando alerta de stock:', error);
            return false;
        }
    }

    /**
     * Notifica meta alcanzada
     */
    async sendGoalAchieved(data: GoalAchievedData): Promise<boolean> {
        if (!this.preferences.goalNotifications) {
            console.log('📧 Notificaciones de metas desactivadas');
            return false;
        }

        try {
            const html = goalAchievedTemplate(data);
            const result = await emailService.sendEmail({
                to: this.preferences.adminEmail,
                subject: `🎉 ¡Meta ${data.goalType === 'daily' ? 'Diaria' : data.goalType === 'weekly' ? 'Semanal' : 'Mensual'} Alcanzada!`,
                html,
            });

            if (result.success) {
                console.log(`✅ Notificación de meta enviada`);
            }

            return result.success;
        } catch (error) {
            console.error('Error enviando notificación de meta:', error);
            return false;
        }
    }

    /**
     * Envía actualización de estado al cliente
     */
    async sendStatusUpdate(
        customerEmail: string,
        data: StatusUpdateData
    ): Promise<boolean> {
        if (!this.preferences.statusNotifications) {
            console.log('📧 Notificaciones de estado desactivadas');
            return false;
        }

        try {
            const html = statusUpdateTemplate(data);
            const result = await emailService.sendEmail({
                to: customerEmail,
                subject: `Actualización de Pedido #${data.orderNumber}`,
                html,
            });

            if (result.success) {
                console.log(`✅ Actualización de estado enviada a ${customerEmail}`);
            }

            return result.success;
        } catch (error) {
            console.error('Error enviando actualización de estado:', error);
            return false;
        }
    }

    /**
     * Verifica stock de todos los productos y envía alertas si es necesario
     */
    async checkStockLevels(products: Array<{ id: string; name: string; stock: number; category: string }>): Promise<void> {
        const lowStockProducts = products.filter(p => p.stock <= this.preferences.stockThreshold);

        for (const product of lowStockProducts) {
            await this.sendLowStockAlert({
                productId: product.id,
                productName: product.name,
                currentStock: product.stock,
                recommendedStock: this.preferences.stockThreshold * 3,
                category: product.category,
            });
        }
    }
}

// Singleton instance
export const notificationService = new NotificationService();
