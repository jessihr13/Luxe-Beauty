// Discounts Store
// lib/discounts/discountsStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Discount, UserDiscountUsage, DiscountType } from './discountTypes';

interface DiscountsState {
    discounts: Discount[];
    userUsages: UserDiscountUsage[];
    
    // Getters
    getAllDiscounts: () => Discount[];
    getActiveDiscounts: () => Discount[];
    getDiscountById: (id: string) => Discount | undefined;
    getDiscountByCode: (code: string) => Discount | undefined;
    getDiscountsByType: (type: DiscountType) => Discount[];
    getUserUsage: (userId: string, discountId: string) => UserDiscountUsage | undefined;
    
    // Actions
    addDiscount: (discount: Omit<Discount, 'id' | 'createdAt' | 'currentUses'>) => void;
    updateDiscount: (id: string, updates: Partial<Discount>) => void;
    deleteDiscount: (id: string) => void;
    toggleDiscountStatus: (id: string) => void;
    incrementUsage: (discountId: string, userId?: string) => void;
    
    // Bulk actions
    deactivateExpiredDiscounts: () => void;
}

export const useDiscountsStore = create<DiscountsState>()(
    persist(
        (set, get) => ({
            discounts: [
                // Sample discounts
                {
                    id: '1',
                    code: 'BIENVENIDA',
                    name: 'Bienvenida 10%',
                    description: '10% de descuento en tu primera compra',
                    type: 'first_purchase',
                    valueType: 'percentage',
                    value: 10,
                    minPurchaseAmount: 500,
                    maxUsesPerUser: 1,
                    currentUses: 0,
                    startDate: new Date('2024-01-01'),
                    isActive: true,
                    canStackWithOthers: true,
                    priority: 5,
                    createdAt: new Date(),
                    createdBy: 'system'
                },
                {
                    id: '2',
                    code: 'VERANO2024',
                    name: 'Verano 15%',
                    description: '15% de descuento en toda la tienda',
                    type: 'coupon',
                    valueType: 'percentage',
                    value: 15,
                    minPurchaseAmount: 1000,
                    maxUses: 100,
                    currentUses: 0,
                    startDate: new Date('2024-06-01'),
                    endDate: new Date('2024-08-31'),
                    isActive: true,
                    canStackWithOthers: true,
                    priority: 10,
                    createdAt: new Date(),
                    createdBy: 'admin'
                },
                {
                    id: '3',
                    name: '3x2 en Labiales',
                    description: 'Compra 3 labiales y paga solo 2',
                    type: 'volume',
                    valueType: 'percentage',
                    value: 0,
                    buyQuantity: 3,
                    payQuantity: 2,
                    applicableCategories: ['labiales'],
                    currentUses: 0,
                    startDate: new Date('2024-01-01'),
                    isActive: true,
                    canStackWithOthers: false,
                    priority: 8,
                    createdAt: new Date(),
                    createdBy: 'admin'
                },
                {
                    id: '4',
                    name: 'Envío Gratis',
                    description: 'Envío gratis en compras mayores a $1000',
                    type: 'free_shipping',
                    valueType: 'free_shipping',
                    value: 0,
                    minPurchaseAmount: 1000,
                    currentUses: 0,
                    startDate: new Date('2024-01-01'),
                    isActive: true,
                    canStackWithOthers: true,
                    priority: 3,
                    createdAt: new Date(),
                    createdBy: 'system'
                }
            ],
            userUsages: [],

            // Getters
            getAllDiscounts: () => get().discounts,
            
            getActiveDiscounts: () => {
                const now = new Date();
                return get().discounts.filter(d => 
                    d.isActive && 
                    d.startDate <= now &&
                    (!d.endDate || d.endDate >= now) &&
                    (!d.maxUses || d.currentUses < d.maxUses)
                );
            },
            
            getDiscountById: (id: string) => 
                get().discounts.find(d => d.id === id),
            
            getDiscountByCode: (code: string) =>
                get().discounts.find(d => 
                    d.code?.toLowerCase() === code.toLowerCase()
                ),
            
            getDiscountsByType: (type: DiscountType) =>
                get().discounts.filter(d => d.type === type),
            
            getUserUsage: (userId: string, discountId: string) =>
                get().userUsages.find(u => 
                    u.userId === userId && u.discountId === discountId
                ),

            // Actions
            addDiscount: (discountData) => {
                const newDiscount: Discount = {
                    ...discountData,
                    id: `discount_${Date.now()}`,
                    currentUses: 0,
                    createdAt: new Date()
                };
                
                set(state => ({
                    discounts: [...state.discounts, newDiscount]
                }));
            },
            
            updateDiscount: (id, updates) => {
                set(state => ({
                    discounts: state.discounts.map(d =>
                        d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
                    )
                }));
            },
            
            deleteDiscount: (id) => {
                set(state => ({
                    discounts: state.discounts.filter(d => d.id !== id)
                }));
            },
            
            toggleDiscountStatus: (id) => {
                set(state => ({
                    discounts: state.discounts.map(d =>
                        d.id === id ? { ...d, isActive: !d.isActive } : d
                    )
                }));
            },
            
            incrementUsage: (discountId, userId) => {
                set(state => {
                    // Increment discount usage
                    const updatedDiscounts = state.discounts.map(d =>
                        d.id === discountId ? { ...d, currentUses: d.currentUses + 1 } : d
                    );

                    // Track user usage if userId provided
                    let updatedUsages = state.userUsages;
                    if (userId) {
                        const existingUsage = state.userUsages.find(
                            u => u.userId === userId && u.discountId === discountId
                        );

                        if (existingUsage) {
                            updatedUsages = state.userUsages.map(u =>
                                u.userId === userId && u.discountId === discountId
                                    ? { ...u, usageCount: u.usageCount + 1, lastUsed: new Date() }
                                    : u
                            );
                        } else {
                            updatedUsages = [
                                ...state.userUsages,
                                {
                                    userId,
                                    discountId,
                                    usageCount: 1,
                                    firstUsed: new Date(),
                                    lastUsed: new Date()
                                }
                            ];
                        }
                    }

                    return {
                        discounts: updatedDiscounts,
                        userUsages: updatedUsages
                    };
                });
            },
            
            deactivateExpiredDiscounts: () => {
                const now = new Date();
                set(state => ({
                    discounts: state.discounts.map(d =>
                        d.endDate && d.endDate < now
                            ? { ...d, isActive: false }
                            : d
                    )
                }));
            }
        }),
        {
            name: 'discounts-storage'
        }
    )
);
