import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Product } from '../data/products';
import type { LegacyOrder } from '../data/orders';

// ==================== PDF CONFIGURATION ====================

const PDF_CONFIG = {
    primaryColor: [212, 129, 111] as [number, number, number], // Rose gold RGB
    secondaryColor: [232, 196, 184] as [number, number, number], // Nude RGB
    textColor: [51, 51, 51] as [number, number, number], // Dark gray
    headerColor: [255, 255, 255] as [number, number, number], // White
};

// ==================== HELPER FUNCTIONS ====================

function addHeader(doc: jsPDF, title: string) {
    // Background header
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

    // Company name
    doc.setTextColor(...PDF_CONFIG.headerColor);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Luxe Beauty', 20, 20);

    // Document title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(title, 20, 32);

    // Date
    doc.setFontSize(10);
    const date = new Date().toLocaleDateString('es-ES');
    doc.text(date, doc.internal.pageSize.width - 20, 32, { align: 'right' });

    // Reset text color
    doc.setTextColor(...PDF_CONFIG.textColor);
}

function addFooter(doc: jsPDF, pageNumber: number) {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
        `Página ${pageNumber} | Luxe Beauty © ${new Date().getFullYear()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
    );
}

// ==================== INVENTORY PDF ====================

export function exportInventoryToPDF(products: Product[], filename: string = 'inventario') {
    const doc = new jsPDF();

    // Header
    addHeader(doc, 'Reporte de Inventario');

    // Summary stats
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.stock * (p.cost || 0)), 0);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen:', 20, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total de productos: ${totalProducts}`, 20, 58);
    doc.text(`Unidades en stock: ${totalStock}`, 20, 64);
    doc.text(`Valor total: $${totalValue.toLocaleString()}`, 20, 70);

    // Products table
    const tableData = products.map(p => [
        p.name,
        p.category,
        `$${p.price.toFixed(2)}`,
        p.stock.toString(),
        p.stock === 0 ? 'Agotado' : p.stock < 10 ? 'Bajo' : 'Normal',
    ]);

    autoTable(doc, {
        startY: 80,
        head: [['Producto', 'Categoría', 'Precio', 'Stock', 'Estado']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: PDF_CONFIG.primaryColor,
            textColor: PDF_CONFIG.headerColor,
            fontStyle: 'bold',
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
    });

    // Footer
    addFooter(doc, 1);

    // Save
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ==================== ORDERS PDF ====================

export function exportOrdersToPDF(orders: LegacyOrder[], filename: string = 'pedidos') {
    const doc = new jsPDF();

    // Header
    addHeader(doc, 'Reporte de Pedidos');

    // Summary stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalRevenue / totalOrders;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen:', 20, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total de pedidos: ${totalOrders}`, 20, 58);
    doc.text(`Ingresos totales: $${totalRevenue.toLocaleString()}`, 20, 64);
    doc.text(`Valor promedio: $${avgOrderValue.toFixed(2)}`, 20, 70);

    // Orders table
    const tableData = orders.map(o => [
        o.orderNumber,
        o.createdAt.toLocaleDateString('es-ES'),
        o.customerName,
        `$${o.total.toFixed(2)}`,
        o.status === 'pending' ? 'Pendiente' :
            o.status === 'processing' ? 'Procesando' :
                o.status === 'shipped' ? 'Enviado' :
                    o.status === 'delivered' ? 'Entregado' : 'Cancelado',
    ]);

    autoTable(doc, {
        startY: 80,
        head: [['N° Pedido', 'Fecha', 'Cliente', 'Total', 'Estado']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: PDF_CONFIG.primaryColor,
            textColor: PDF_CONFIG.headerColor,
            fontStyle: 'bold',
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
    });

    // Footer
    addFooter(doc, 1);

    // Save
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ==================== FINANCIAL REPORT PDF ====================

export function exportFinancialReportToPDF(
    revenue: number,
    costs: number,
    expenses: number,
    filename: string = 'reporte-financiero'
) {
    const doc = new jsPDF();

    // Header
    addHeader(doc, 'Reporte Financiero');

    // Financial summary
    const grossProfit = revenue - costs;
    const netProfit = grossProfit - expenses;
    const grossMargin = (grossProfit / revenue) * 100;
    const netMargin = (netProfit / revenue) * 100;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Estado de Resultados', 20, 55);

    // Revenue section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Ingresos Totales:', 20, 70);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 128, 0);
    doc.text(`$${revenue.toLocaleString()}`, 150, 70, { align: 'right' });

    // Costs section
    doc.setTextColor(...PDF_CONFIG.textColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Costo de Productos:', 20, 80);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 0, 0);
    doc.text(`-$${costs.toLocaleString()}`, 150, 80, { align: 'right' });

    // Gross profit
    doc.setTextColor(...PDF_CONFIG.textColor);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 85, 140, 8, 'F');
    doc.text('Ganancia Bruta:', 20, 90);
    doc.setTextColor(0, 128, 0);
    doc.text(`$${grossProfit.toLocaleString()} (${grossMargin.toFixed(1)}%)`, 150, 90, { align: 'right' });

    // Expenses
    doc.setTextColor(...PDF_CONFIG.textColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Gastos Operativos:', 20, 100);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 0, 0);
    doc.text(`-$${expenses.toLocaleString()}`, 150, 100, { align: 'right' });

    // Net profit
    doc.setTextColor(...PDF_CONFIG.textColor);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(...PDF_CONFIG.secondaryColor);
    doc.rect(15, 105, 140, 10, 'F');
    doc.setFontSize(12);
    doc.text('Ganancia Neta:', 20, 112);
    const profitColor: [number, number, number] = netProfit >= 0 ? [0, 128, 0] : [255, 0, 0];
    doc.setTextColor(...profitColor);
    doc.text(`$${netProfit.toLocaleString()} (${netMargin.toFixed(1)}%)`, 150, 112, { align: 'right' });

    // Footer
    addFooter(doc, 1);

    // Save
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
}
