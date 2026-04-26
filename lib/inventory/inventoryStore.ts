/**
 * Inventory Store - Manages inventory movements and stock alerts
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type MovementType = 'in' | 'out' | 'adjustment';

export interface InventoryMovement {
    id: string;
    productId: string;
    productName: string;
    type: MovementType;
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string;
    createdBy: string;
    date: Date;
    createdAt: string;
}

export interface StockAlert {
    productId: string;
    productName: string;
    currentStock: number;
    threshold: number;
    severity: 'critical' | 'warning';
    status: 'critical' | 'low';
}

interface InventoryStore {
    movements: InventoryMovement[];
    addMovement: (movement: Omit<InventoryMovement, 'id' | 'createdAt'>) => void;
    getAllMovements: () => InventoryMovement[];
    getMovementsByProduct: (productId: string) => InventoryMovement[];
    getStockAlerts: (products: Array<{ id: string; name: string; stock: number }>) => StockAlert[];
}

export const movementTypeInfo: Record<MovementType, { name: string; icon: string; color: string }> = {
    in: { name: 'Entrada', icon: '📥', color: 'green' },
    out: { name: 'Salida', icon: '📤', color: 'red' },
    adjustment: { name: 'Ajuste', icon: '⚖️', color: 'yellow' },
};

export const useInventoryStore = create<InventoryStore>()(
    persist(
        (set, get) => ({
            movements: [],

            addMovement: (movementData) => {
                const newMovement: InventoryMovement = {
                    ...movementData,
                    id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    date: new Date(),
                    createdAt: new Date().toISOString(),
                };

                set({ movements: [newMovement, ...get().movements] });
                console.log('✅ Inventory movement added:', newMovement.type);
            },

            getAllMovements: () => {
                return get().movements.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            },

            getMovementsByProduct: (productId) => {
                return get().movements
                    .filter(m => m.productId === productId)
                    .sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
            },

            getStockAlerts: (products) => {
                const alerts: StockAlert[] = [];
                
                products.forEach(product => {
                    if (product.stock === 0) {
                        alerts.push({
                            productId: product.id,
                            productName: product.name,
                            currentStock: 0,
                            threshold: 5,
                            severity: 'critical',
                            status: 'critical'
                        });
                    } else if (product.stock <= 5) {
                        alerts.push({
                            productId: product.id,
                            productName: product.name,
                            currentStock: product.stock,
                            threshold: 5,
                            severity: 'critical',
                            status: 'critical'
                        });
                    } else if (product.stock <= 10) {
                        alerts.push({
                            productId: product.id,
                            productName: product.name,
                            currentStock: product.stock,
                            threshold: 10,
                            severity: 'warning',
                            status: 'low'
                        });
                    }
                });

                return alerts.sort((a, b) => a.currentStock - b.currentStock);
            }
        }),
        {
            name: 'luxe-inventory-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
