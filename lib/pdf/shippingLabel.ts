// PDF Generation for Shipping Labels
import jsPDF from 'jspdf';
import type { LegacyOrder } from '../data/orders';

export function generateShippingLabel(order: LegacyOrder): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('LUXE BEAUTY', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Guía de Envío', 105, 28, { align: 'center' });

    // Order Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Orden: ${order.orderNumber}`, 20, 45);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${order.createdAt.toLocaleDateString('es-ES')}`, 20, 52);

    if (order.trackingNumber) {
        doc.text(`Tracking: ${order.trackingNumber}`, 20, 59);
    }

    // Sender Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('REMITENTE:', 20, 75);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Luxe Beauty', 20, 82);
    doc.text('Av. Reforma 500, Col. Juárez', 20, 89);
    doc.text('Ciudad de México, CDMX 06600', 20, 96);
    doc.text('Tel: +52 55 1234 5678', 20, 103);

    // Recipient Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DESTINATARIO:', 20, 120);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customerName, 20, 127);
    doc.text(order.shippingAddress.street, 20, 134);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 20, 141);
    doc.text(`Tel: ${order.customerPhone}`, 20, 148);

    // Package Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTENIDO DEL PAQUETE:', 20, 165);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    let yPos = 172;
    order.items.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.productName} x${item.quantity}`, 25, yPos);
        yPos += 7;
    });

    // Total
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total de artículos: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}`, 20, yPos + 5);
    doc.text(`Valor declarado: $${order.total.toFixed(2)} MXN`, 20, yPos + 12);

    // Barcode simulation (tracking number)
    if (order.trackingNumber) {
        doc.setFontSize(8);
        doc.setFont('courier', 'normal');
        const barcodeY = yPos + 25;
        doc.text('||||| |||| ||||| |||| ||||| |||| |||||', 105, barcodeY, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(order.trackingNumber, 105, barcodeY + 7, { align: 'center' });
    }

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Gracias por tu compra - www.luxebeauty.com', 105, 280, { align: 'center' });

    // Save PDF
    doc.save(`guia-envio-${order.orderNumber}.pdf`);
}

export function generatePackingSlip(order: LegacyOrder): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LISTA DE EMPAQUE', 105, 20, { align: 'center' });

    // Order Info
    doc.setFontSize(12);
    doc.text(`Orden: ${order.orderNumber}`, 20, 35);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${order.createdAt.toLocaleDateString('es-ES')}`, 20, 42);
    doc.text(`Cliente: ${order.customerName}`, 20, 49);

    // Table Header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Producto', 20, 65);
    doc.text('Cantidad', 130, 65);
    doc.text('Precio', 160, 65);
    doc.text('Subtotal', 180, 65);

    // Draw line
    doc.line(20, 68, 190, 68);

    // Items
    doc.setFont('helvetica', 'normal');
    let yPos = 75;

    order.items.forEach(item => {
        doc.text(item.productName, 20, yPos);
        doc.text(item.quantity.toString(), 130, yPos);
        doc.text(`$${item.price.toFixed(2)}`, 160, yPos);
        doc.text(`$${item.subtotal.toFixed(2)}`, 180, yPos);
        yPos += 7;
    });

    // Totals
    yPos += 5;
    doc.line(20, yPos, 190, yPos);
    yPos += 7;

    doc.text('Subtotal:', 130, yPos);
    doc.text(`$${order.subtotal.toFixed(2)}`, 180, yPos);
    yPos += 7;

    doc.text('Envío:', 130, yPos);
    doc.text(`$${order.shipping.toFixed(2)}`, 180, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 130, yPos);
    doc.text(`$${order.total.toFixed(2)}`, 180, yPos);

    // Save PDF
    doc.save(`lista-empaque-${order.orderNumber}.pdf`);
}
