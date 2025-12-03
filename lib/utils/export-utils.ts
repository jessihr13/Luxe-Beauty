// Export Utilities for Excel, CSV, and PNG
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import type { Product } from '../data/products';
import type { LegacyOrder } from '../data/orders';
import type { Employee } from '../data/employees';
import type { Expense } from '../data/expenses';
import type { Campaign } from '../data/campaigns';

// ==================== EXCEL EXPORT ====================

/**
 * Export products to Excel
 */
export function exportProductsToExcel(products: Product[], filename: string = 'inventario') {
    // Prepare data for Excel
    const data = products.map(p => ({
        'SKU': p.id,
        'Nombre': p.name,
        'Categoría': p.category === 'skincare' ? 'Skincare' : p.category === 'makeup' ? 'Makeup' : 'Fragancia',
        'Precio': `$${p.price.toFixed(2)}`,
        'Costo': p.cost ? `$${p.cost.toFixed(2)}` : 'N/A',
        'Stock': p.stock || 0,
        'Margen (%)': p.cost ? (((p.price - p.cost) / p.price) * 100).toFixed(1) + '%' : 'N/A',
        'Ventas': p.neuromarketing.socialProof.purchaseCount,
        'Estado': (p.stock || 0) > 10 ? 'En Stock' : (p.stock || 0) > 0 ? 'Stock Bajo' : 'Agotado',
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
        { wch: 15 }, // SKU
        { wch: 30 }, // Nombre
        { wch: 12 }, // Categoría
        { wch: 10 }, // Precio
        { wch: 10 }, // Costo
        { wch: 8 },  // Stock
        { wch: 12 }, // Margen
        { wch: 8 },  // Ventas
        { wch: 12 }, // Estado
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    // Generate Excel file
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export orders to Excel
 */
export function exportOrdersToExcel(orders: LegacyOrder[], filename: string = 'pedidos') {
    const data = orders.map(o => ({
        'Número': o.orderNumber,
        'Fecha': o.createdAt.toLocaleDateString('es-ES'),
        'Cliente': o.customerName,
        'Email': o.customerEmail,
        'Productos': o.items.length,
        'Subtotal': `$${o.subtotal.toFixed(2)}`,
        'Envío': `$${o.shipping.toFixed(2)}`,
        'Total': `$${o.total.toFixed(2)}`,
        'Estado': o.status === 'pending' ? 'Pendiente' :
            o.status === 'processing' ? 'Procesando' :
                o.status === 'shipped' ? 'Enviado' :
                    o.status === 'delivered' ? 'Entregado' : 'Cancelado',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    ws['!cols'] = [
        { wch: 15 }, // Número
        { wch: 12 }, // Fecha
        { wch: 25 }, // Cliente
        { wch: 30 }, // Email
        { wch: 10 }, // Productos
        { wch: 12 }, // Subtotal
        { wch: 10 }, // Envío
        { wch: 12 }, // Total
        { wch: 12 }, // Estado
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export employees to Excel
 */
export function exportEmployeesToExcel(employees: Employee[], filename: string = 'empleados') {
    const data = employees.map(e => ({
        'ID': e.id,
        'Nombre': e.name,
        'Email': e.email,
        'Teléfono': e.phone,
        'Rol': e.role,
        'Departamento': e.department,
        'Salario': `$${e.salary.toLocaleString()}`,
        'Fecha Ingreso': e.hireDate.toLocaleDateString('es-ES'),
        'Estado': e.status === 'active' ? 'Activo' : 'Inactivo',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    ws['!cols'] = [
        { wch: 12 }, // ID
        { wch: 25 }, // Nombre
        { wch: 30 }, // Email
        { wch: 15 }, // Teléfono
        { wch: 20 }, // Rol
        { wch: 15 }, // Departamento
        { wch: 12 }, // Salario
        { wch: 15 }, // Fecha Ingreso
        { wch: 10 }, // Estado
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Empleados');
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export expenses to Excel
 */
export function exportExpensesToExcel(expenses: Expense[], filename: string = 'gastos') {
    const data = expenses.map(e => ({
        'ID': e.id,
        'Fecha': e.date.toLocaleDateString('es-ES'),
        'Categoría': e.category,
        'Descripción': e.description,
        'Monto': `$${e.amount.toFixed(2)}`,
        'Método Pago': e.paymentMethod === 'cash' ? 'Efectivo' :
            e.paymentMethod === 'card' ? 'Tarjeta' :
                e.paymentMethod === 'transfer' ? 'Transferencia' : 'Cheque',
        'Notas': e.notes || '',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    ws['!cols'] = [
        { wch: 12 }, // ID
        { wch: 12 }, // Fecha
        { wch: 15 }, // Categoría
        { wch: 40 }, // Descripción
        { wch: 12 }, // Monto
        { wch: 15 }, // Método Pago
        { wch: 30 }, // Notas
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Gastos');
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export campaigns to Excel
 */
export function exportCampaignsToExcel(campaigns: Campaign[], filename: string = 'campanas') {
    const data = campaigns.map(c => ({
        'ID': c.id,
        'Nombre': c.name,
        'Tipo': c.type,
        'Estado': c.status === 'active' ? 'Activa' :
            c.status === 'completed' ? 'Completada' :
                c.status === 'paused' ? 'Pausada' : 'Borrador',
        'Presupuesto': `$${c.budget.toLocaleString()}`,
        'Gastado': `$${c.spent.toLocaleString()}`,
        'Restante': `$${(c.budget - c.spent).toLocaleString()}`,
        'Impresiones': c.metrics.impressions.toLocaleString(),
        'Clicks': c.metrics.clicks.toLocaleString(),
        'Conversiones': c.metrics.conversions,
        'CTR (%)': ((c.metrics.clicks / c.metrics.impressions) * 100).toFixed(2) + '%',
        'Inicio': c.startDate.toLocaleDateString('es-ES'),
        'Fin': c.endDate.toLocaleDateString('es-ES'),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    ws['!cols'] = [
        { wch: 12 }, // ID
        { wch: 30 }, // Nombre
        { wch: 15 }, // Tipo
        { wch: 12 }, // Estado
        { wch: 12 }, // Presupuesto
        { wch: 12 }, // Gastado
        { wch: 12 }, // Restante
        { wch: 12 }, // Impresiones
        { wch: 10 }, // Clicks
        { wch: 12 }, // Conversiones
        { wch: 10 }, // CTR
        { wch: 12 }, // Inicio
        { wch: 12 }, // Fin
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Campañas');
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ==================== CSV EXPORT ====================

/**
 * Export any data to CSV
 */
export function exportToCSV<T extends Record<string, any>>(
    data: T[],
    filename: string = 'export'
) {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==================== PNG EXPORT (Charts) ====================

/**
 * Export a chart/element to PNG
 */
export async function exportChartToPNG(
    elementId: string,
    filename: string = 'chart'
): Promise<void> {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error(`Element with id "${elementId}" not found`);
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
            logging: false,
        });

        // Convert to blob and download
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}_${new Date().toISOString().split('T')[0]}.png`;
                link.click();
                URL.revokeObjectURL(url);
            }
        });
    } catch (error) {
        console.error('Error exporting chart:', error);
    }
}

/**
 * Export element to PNG with custom options
 */
export async function exportElementToPNG(
    element: HTMLElement,
    filename: string = 'export',
    options?: {
        backgroundColor?: string;
        scale?: number;
        width?: number;
        height?: number;
    }
): Promise<void> {
    try {
        const canvas = await html2canvas(element, {
            backgroundColor: options?.backgroundColor || '#ffffff',
            scale: options?.scale || 2,
            width: options?.width,
            height: options?.height,
            logging: false,
        });

        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}_${new Date().toISOString().split('T')[0]}.png`;
                link.click();
                URL.revokeObjectURL(url);
            }
        });
    } catch (error) {
        console.error('Error exporting to PNG:', error);
    }
}
