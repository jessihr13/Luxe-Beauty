// Orders and Shipping Management

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type CourierType = 'fedex' | 'dhl' | 'ups' | 'estafeta';
export type ShipmentStatus = 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered';

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface OrderStatusChange {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
}

export interface Order {
    id: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    status: OrderStatus;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    tracking?: {
        number: string;
        courier: string;
        url: string;
    };
    // Attribution for marketing campaigns
    attribution?: {
        source: string;           // "Facebook Ad", "Instagram", "Email", etc.
        campaignId?: string;      // ID de campaña asociada
        medium?: string;          // "cpc", "email", "social"
        notes?: string;           // Notas adicionales
    };
    statusHistory: OrderStatusChange[];
    createdAt: Date;
    updatedAt: Date;
}

export interface TrackingEvent {
    date: Date;
    status: string;
    location: string;
    description: string;
}

export interface Shipment {
    id: string;
    orderId: string;
    orderNumber: string;
    trackingNumber: string;
    courier: CourierType;
    status: ShipmentStatus;
    estimatedDelivery: Date;
    customerName: string;
    destination: string;
    events: TrackingEvent[];
}

// Legacy fields for backward compatibility
export interface LegacyOrder extends Order {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    trackingNumber?: string;
    courier?: CourierType;
    processedAt?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
}

// Sample orders
export const orders: LegacyOrder[] = [
    {
        id: 'ord_001',
        orderNumber: 'LB-2024-001',
        customerName: 'Ana Martínez',
        customerEmail: 'ana.martinez@email.com',
        customerPhone: '+52 55 1234 5678',
        customer: {
            name: 'Ana Martínez',
            email: 'ana.martinez@email.com',
            phone: '+52 55 1234 5678'
        },
        shippingAddress: {
            street: 'Av. Reforma 123, Col. Centro',
            city: 'Ciudad de México',
            state: 'CDMX',
            zipCode: '06000',
            country: 'México',
        },
        items: [
            {
                productId: 'prod_001',
                productName: 'Radiance Renewal Serum',
                quantity: 2,
                price: 89.99,
                subtotal: 179.98,
            },
            {
                productId: 'prod_005',
                productName: 'Luminous Glow Foundation',
                quantity: 1,
                price: 54.99,
                subtotal: 54.99,
            },
        ],
        subtotal: 234.97,
        shipping: 150,
        total: 384.97,
        status: 'delivered',
        trackingNumber: 'FDX123456789',
        courier: 'fedex',
        tracking: {
            number: 'FDX123456789',
            courier: 'fedex',
            url: 'https://www.fedex.com/fedextrack/?trknbr=FDX123456789'
        },
        attribution: {
            source: 'Facebook Ad',
            campaignId: 'camp_001',
            medium: 'cpc'
        },
        statusHistory: [
            { status: 'pending', timestamp: new Date('2024-11-20') },
            { status: 'processing', timestamp: new Date('2024-11-21') },
            { status: 'shipped', timestamp: new Date('2024-11-22') },
            { status: 'delivered', timestamp: new Date('2024-11-25') }
        ],
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date('2024-11-25'),
        processedAt: new Date('2024-11-21'),
        shippedAt: new Date('2024-11-22'),
        deliveredAt: new Date('2024-11-25'),
    },
    {
        id: 'ord_002',
        orderNumber: 'LB-2024-002',
        customerName: 'Carlos Rodríguez',
        customerEmail: 'carlos.r@email.com',
        customerPhone: '+52 55 2345 6789',
        customer: {
            name: 'Carlos Rodríguez',
            email: 'carlos.r@email.com',
            phone: '+52 55 2345 6789'
        },
        shippingAddress: {
            street: 'Calle Juárez 456',
            city: 'Guadalajara',
            state: 'Jalisco',
            zipCode: '44100',
            country: 'México',
        },
        items: [
            {
                productId: 'prod_004',
                productName: 'Bloom Eau de Parfum',
                quantity: 1,
                price: 149.99,
                subtotal: 149.99,
            },
        ],
        subtotal: 149.99,
        shipping: 180,
        total: 329.99,
        status: 'shipped',
        trackingNumber: 'DHL987654321',
        courier: 'dhl',
        tracking: {
            number: 'DHL987654321',
            courier: 'dhl',
            url: 'https://www.dhl.com/mx-es/home/tracking.html?tracking-id=DHL987654321'
        },
        attribution: {
            source: 'Instagram Ad',
            campaignId: 'camp_001',
            medium: 'cpc'
        },
        statusHistory: [
            { status: 'pending', timestamp: new Date('2024-11-28') },
            { status: 'processing', timestamp: new Date('2024-11-28') },
            { status: 'shipped', timestamp: new Date('2024-11-29') }
        ],
        createdAt: new Date('2024-11-28'),
        updatedAt: new Date('2024-11-29'),
        processedAt: new Date('2024-11-28'),
        shippedAt: new Date('2024-11-29'),
    },
    {
        id: 'ord_003',
        orderNumber: 'LB-2024-003',
        customerName: 'Laura Sánchez',
        customerEmail: 'laura.s@email.com',
        customerPhone: '+52 55 3456 7890',
        customer: {
            name: 'Laura Sánchez',
            email: 'laura.s@email.com',
            phone: '+52 55 3456 7890'
        },
        shippingAddress: {
            street: 'Blvd. Insurgentes 789',
            city: 'Monterrey',
            state: 'Nuevo León',
            zipCode: '64000',
            country: 'México',
        },
        items: [
            {
                productId: 'prod_002',
                productName: 'Velvet Matte Lipstick',
                quantity: 3,
                price: 34.99,
                subtotal: 104.97,
            },
            {
                productId: 'prod_003',
                productName: 'Golden Hour Face Cream',
                quantity: 1,
                price: 124.99,
                subtotal: 124.99,
            },
        ],
        subtotal: 229.96,
        shipping: 180,
        total: 409.96,
        status: 'processing',
        statusHistory: [
            { status: 'pending', timestamp: new Date('2024-11-30') },
            { status: 'processing', timestamp: new Date('2024-11-30') }
        ],
        createdAt: new Date('2024-11-30'),
        updatedAt: new Date('2024-11-30'),
        processedAt: new Date('2024-11-30'),
    },
    {
        id: 'ord_004',
        orderNumber: 'LB-2024-004',
        customerName: 'Roberto Gómez',
        customerEmail: 'roberto.g@email.com',
        customerPhone: '+52 55 4567 8901',
        customer: {
            name: 'Roberto Gómez',
            email: 'roberto.g@email.com',
            phone: '+52 55 4567 8901'
        },
        shippingAddress: {
            street: 'Av. Universidad 321',
            city: 'Puebla',
            state: 'Puebla',
            zipCode: '72000',
            country: 'México',
        },
        items: [
            {
                productId: 'prod_006',
                productName: 'Midnight Recovery Oil',
                quantity: 2,
                price: 78.99,
                subtotal: 157.98,
            },
        ],
        subtotal: 157.98,
        shipping: 150,
        total: 307.98,
        status: 'pending',
        statusHistory: [
            { status: 'pending', timestamp: new Date('2024-11-30') }
        ],
        createdAt: new Date('2024-11-30'),
        updatedAt: new Date('2024-11-30'),
    },
];

// Sample shipments
export const shipments: Shipment[] = [
    {
        id: 'ship_001',
        orderId: 'ord_002',
        orderNumber: 'LB-2024-002',
        trackingNumber: 'DHL987654321',
        courier: 'dhl',
        status: 'in_transit',
        estimatedDelivery: new Date('2024-12-02'),
        customerName: 'Carlos Rodríguez',
        destination: 'Guadalajara, Jalisco',
        events: [
            {
                date: new Date('2024-11-29T10:00:00'),
                status: 'Recogido',
                location: 'Ciudad de México, CDMX',
                description: 'Paquete recogido en centro de distribución',
            },
            {
                date: new Date('2024-11-29T18:30:00'),
                status: 'En tránsito',
                location: 'Querétaro, Qro',
                description: 'En ruta hacia destino',
            },
            {
                date: new Date('2024-11-30T08:15:00'),
                status: 'En tránsito',
                location: 'León, Gto',
                description: 'Paquete en movimiento',
            },
        ],
    },
];

// Helper functions
export function getAllOrders(): LegacyOrder[] {
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getOrderById(id: string): LegacyOrder | undefined {
    return orders.find(o => o.id === id);
}

export function getOrdersByStatus(status: OrderStatus): LegacyOrder[] {
    return orders.filter(o => o.status === status);
}

export function getAllShipments(): Shipment[] {
    return shipments;
}

export function getShipmentByTracking(trackingNumber: string): Shipment | undefined {
    return shipments.find(s => s.trackingNumber === trackingNumber);
}

export function createOrder(order: Omit<LegacyOrder, 'id' | 'orderNumber'>): LegacyOrder {
    const newOrder: LegacyOrder = {
        ...order,
        id: `ord_${Date.now()}`,
        orderNumber: `LB-2024-${String(orders.length + 1).padStart(3, '0')}`,
    };
    orders.push(newOrder);

    // Auto-attribute to campaign if attribution data exists
    if (newOrder.attribution?.campaignId) {
        // Import will be added when campaigns.ts is fixed
        // attributeSaleToCampaign(newOrder.orderNumber, newOrder.customerName, newOrder.total, newOrder.attribution.campaignId, newOrder.attribution.source);
    }

    return newOrder;
}

export function updateOrderStatus(id: string, status: OrderStatus): LegacyOrder | null {
    const order = orders.find(o => o.id === id);
    if (!order) return null;

    order.status = status;
    order.statusHistory.push({
        status,
        timestamp: new Date()
    });

    if (status === 'processing' && !order.processedAt) {
        order.processedAt = new Date();
    } else if (status === 'shipped' && !order.shippedAt) {
        order.shippedAt = new Date();
    } else if (status === 'delivered' && !order.deliveredAt) {
        order.deliveredAt = new Date();
    }

    order.updatedAt = new Date();
    return order;
}

export const orderStatusInfo: Record<OrderStatus, { name: string; icon: string; color: string }> = {
    pending: { name: 'Pendiente', icon: '⏳', color: 'gray' },
    processing: { name: 'Procesando', icon: '⚙️', color: 'blue' },
    shipped: { name: 'Enviado', icon: '📦', color: 'purple' },
    delivered: { name: 'Entregado', icon: '✅', color: 'green' },
    cancelled: { name: 'Cancelado', icon: '❌', color: 'red' },
};

export const courierInfo: Record<CourierType, { name: string; logo: string; trackingUrl: string }> = {
    fedex: { name: 'FedEx', logo: '🚚', trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=' },
    dhl: { name: 'DHL', logo: '📮', trackingUrl: 'https://www.dhl.com/mx-es/home/tracking.html?tracking-id=' },
    ups: { name: 'UPS', logo: '🚛', trackingUrl: 'https://www.ups.com/track?tracknum=' },
    estafeta: { name: 'Estafeta', logo: '📦', trackingUrl: 'https://www.estafeta.com/Rastreo/?numero=' },
};
