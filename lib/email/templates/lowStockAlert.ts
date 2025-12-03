import { EmailLayout } from './base';

export interface LowStockAlertData {
    productName: string;
    productId: string;
    currentStock: number;
    recommendedStock: number;
    category: string;
}

export function lowStockAlertTemplate(data: LowStockAlertData): string {
    const urgencyLevel = data.currentStock === 0 ? 'crítico' : data.currentStock <= 5 ? 'alto' : 'medio';
    const urgencyColor = data.currentStock === 0 ? '#EF4444' : data.currentStock <= 5 ? '#F59E0B' : '#10B981';

    const content = `
        <h1 style="color: ${urgencyColor}; margin-top: 0;">⚠️ Alerta de Stock</h1>
        
        <div style="background-color: ${urgencyColor}20; border-left: 4px solid ${urgencyColor}; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px; font-weight: bold;">
                Nivel de urgencia: ${urgencyLevel.toUpperCase()}
            </p>
        </div>

        <p>Se ha detectado un nivel ${urgencyLevel} de stock para el siguiente producto:</p>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #374151;">${data.productName}</h2>
            <p style="margin: 5px 0;"><strong>ID:</strong> ${data.productId}</p>
            <p style="margin: 5px 0;"><strong>Categoría:</strong> ${data.category}</p>
            <p style="margin: 5px 0; color: ${urgencyColor}; font-size: 18px; font-weight: bold;">
                <strong>Stock actual:</strong> ${data.currentStock} unidades
            </p>
            <p style="margin: 5px 0;">
                <strong>Stock recomendado:</strong> ${data.recommendedStock} unidades
            </p>
        </div>

        ${data.currentStock === 0 ? `
            <div style="background-color: #FEE2E2; border: 2px solid #EF4444; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #991B1B; font-weight: bold;">
                    🚨 PRODUCTO AGOTADO - Se requiere reabastecimiento inmediato
                </p>
            </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://luxebeauty.com/admin/inventario" class="button">
                Gestionar Inventario
            </a>
        </div>

        <h3 style="color: #374151;">Acciones Recomendadas:</h3>
        <ul style="color: #6b7280;">
            <li>Revisar proveedores disponibles</li>
            <li>Generar orden de compra</li>
            <li>Actualizar tiempo de reabastecimiento estimado</li>
            ${data.currentStock === 0 ? '<li><strong>Considerar marcar producto como "Agotado" en la tienda</strong></li>' : ''}
        </ul>

        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Esta alerta se genera automáticamente cuando el stock alcanza niveles críticos.
        </p>
    `;

    return EmailLayout({
        children: content,
        preheader: `Alerta: ${data.productName} tiene stock ${urgencyLevel}`,
    });
}
