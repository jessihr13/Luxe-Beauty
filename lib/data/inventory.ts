// Inventory Management Data Models

export type MovementType = 'in' | 'out' | 'adjustment';
export type AlertStatus = 'critical' | 'low' | 'ok';

export interface InventoryMovement {
    id: string;
    productId: string;
    productName: string;
    type: MovementType;
    quantity: number;
    previousStock: number;
    newStock: number;
    date: Date;
    reason: string;
    userId: string;
    userName: string;
    notes?: string;
}

export interface StockAlert {
    productId: string;
    productName: string;
    currentStock: number;
    minStock: number;
    status: AlertStatus;
    category: string;
}

// Sample inventory movements
export const inventoryMovements: InventoryMovement[] = [
    {
        id: 'mov_001',
        productId: 'prod_001',
        productName: 'Radiance Renewal Serum',
        type: 'in',
        quantity: 50,
        previousStock: 45,
        newStock: 95,
        date: new Date('2024-11-25'),
        reason: 'Reabastecimiento',
        userId: 'emp_001',
        userName: 'María González',
    },
    {
        id: 'mov_002',
        productId: 'prod_002',
        productName: 'Velvet Matte Lipstick',
        type: 'out',
        quantity: 15,
        previousStock: 28,
        newStock: 13,
        date: new Date('2024-11-26'),
        reason: 'Venta',
        userId: 'emp_002',
        userName: 'Carlos Ramírez',
    },
    {
        id: 'mov_003',
        productId: 'prod_003',
        productName: 'Golden Hour Face Cream',
        type: 'out',
        quantity: 8,
        previousStock: 15,
        newStock: 7,
        date: new Date('2024-11-27'),
        reason: 'Venta',
        userId: 'emp_002',
        userName: 'Carlos Ramírez',
    },
    {
        id: 'mov_004',
        productId: 'prod_004',
        productName: 'Bloom Eau de Parfum',
        type: 'in',
        quantity: 30,
        previousStock: 12,
        newStock: 42,
        date: new Date('2024-11-28'),
        reason: 'Reabastecimiento',
        userId: 'emp_004',
        userName: 'Roberto Sánchez',
    },
    {
        id: 'mov_005',
        productId: 'prod_005',
        productName: 'Luminous Glow Foundation',
        type: 'adjustment',
        quantity: -3,
        previousStock: 35,
        newStock: 32,
        date: new Date('2024-11-28'),
        reason: 'Productos dañados',
        userId: 'emp_004',
        userName: 'Roberto Sánchez',
        notes: 'Envases rotos durante transporte',
    },
    {
        id: 'mov_006',
        productId: 'prod_006',
        productName: 'Midnight Recovery Oil',
        type: 'out',
        quantity: 12,
        previousStock: 18,
        newStock: 6,
        date: new Date('2024-11-29'),
        reason: 'Venta',
        userId: 'emp_003',
        userName: 'Ana López',
    },
    {
        id: 'mov_007',
        productId: 'prod_001',
        productName: 'Radiance Renewal Serum',
        type: 'out',
        quantity: 20,
        previousStock: 95,
        newStock: 75,
        date: new Date('2024-11-29'),
        reason: 'Venta mayorista',
        userId: 'emp_002',
        userName: 'Carlos Ramírez',
    },
    {
        id: 'mov_008',
        productId: 'prod_002',
        productName: 'Velvet Matte Lipstick',
        type: 'in',
        quantity: 40,
        previousStock: 13,
        newStock: 53,
        date: new Date('2024-11-30'),
        reason: 'Reabastecimiento',
        userId: 'emp_004',
        userName: 'Roberto Sánchez',
    },
];

// Helper functions
export function getAllMovements(): InventoryMovement[] {
    return inventoryMovements.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getMovementsByProduct(productId: string): InventoryMovement[] {
    return inventoryMovements
        .filter(m => m.productId === productId)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getMovementsByType(type: MovementType): InventoryMovement[] {
    return inventoryMovements
        .filter(m => m.type === type)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function addInventoryMovement(movement: Omit<InventoryMovement, 'id'>): InventoryMovement {
    const newMovement: InventoryMovement = {
        ...movement,
        id: `mov_${Date.now()}`,
    };
    inventoryMovements.push(newMovement);
    return newMovement;
}

export function getStockAlerts(products: any[]): StockAlert[] {
    const alerts: StockAlert[] = [];

    products.forEach(product => {
        const minStock = 10; // Mínimo recomendado
        const criticalStock = 5; // Stock crítico

        let status: AlertStatus = 'ok';
        if (product.stock <= criticalStock) {
            status = 'critical';
        } else if (product.stock <= minStock) {
            status = 'low';
        }

        if (status !== 'ok') {
            alerts.push({
                productId: product.id,
                productName: product.name,
                currentStock: product.stock,
                minStock: minStock,
                status: status,
                category: product.category,
            });
        }
    });

    return alerts.sort((a, b) => {
        if (a.status === 'critical' && b.status !== 'critical') return -1;
        if (a.status !== 'critical' && b.status === 'critical') return 1;
        return a.currentStock - b.currentStock;
    });
}

export const movementTypeInfo: Record<MovementType, { name: string; icon: string; color: string }> = {
    in: { name: 'Entrada', icon: '📥', color: 'green' },
    out: { name: 'Salida', icon: '📤', color: 'red' },
    adjustment: { name: 'Ajuste', icon: '⚙️', color: 'yellow' },
};
