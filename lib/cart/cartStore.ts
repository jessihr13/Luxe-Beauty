/**
 * Shopping Cart Store with LocalStorage Persistence
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    categoryId?: string;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    appliedCoupons: string[];
    
    // Actions
    addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    
    // Discount actions
    applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
    removeCoupon: (code: string) => void;
    
    // Getters
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getSubtotal: () => number;
    getDiscountTotal: () => number;
    getFinalTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            appliedCoupons: [],

            addToCart: (item) => {
                console.log('🛒 addToCart called with:', item);
                const currentItems = get().items;
                const existingItem = currentItems.find(i => i.productId === item.productId);
                
                if (existingItem) {
                    console.log('📦 Updating existing item');
                    set({
                        items: currentItems.map(i =>
                            i.productId === item.productId
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    });
                } else {
                    console.log('✨ Adding new item');
                    set({
                        items: [...currentItems, {
                            ...item,
                            id: `cart_${Date.now()}_${Math.random()}`,
                            quantity: 1,
                        }],
                    });
                }
                
                // Auto-open cart
                set({ isOpen: true });
            },

            removeFromCart: (id) => {
                set({ items: get().items.filter(item => item.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(id);
                } else {
                    set({
                        items: get().items.map(item =>
                            item.id === id ? { ...item, quantity } : item
                        ),
                    });
                }
            },

            clearCart: () => {
                set({ items: [], appliedCoupons: [] });
            },

            toggleCart: () => {
                set({ isOpen: !get().isOpen });
            },

            openCart: () => {
                set({ isOpen: true });
            },

            closeCart: () => {
                set({ isOpen: false });
            },

            // Discount methods
            applyCoupon: async (code: string) => {
                const { useDiscountsStore } = await import('@/lib/discounts/discountsStore');
                const { DiscountEngine } = await import('@/lib/discounts/discountEngine');
                
                const discounts = useDiscountsStore.getState().getActiveDiscounts();
                const items = get().items;
                const subtotal = get().getSubtotal();
                
                const context = {
                    isFirstPurchase: false,
                    cartItems: items.map(item => ({
                        productId: item.productId,
                        categoryId: item.categoryId || '',
                        quantity: item.quantity,
                        price: item.price
                    })),
                    subtotal,
                    appliedCoupons: get().appliedCoupons
                };
                
                const result = DiscountEngine.applyCoupon(code, discounts, context);
                
                if (result.success && result.discount) {
                    set({ appliedCoupons: [...get().appliedCoupons, code] });
                }
                
                return result;
            },

            removeCoupon: (code: string) => {
                set({ appliedCoupons: get().appliedCoupons.filter(c => c !== code) });
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            getSubtotal: () => {
                return get().getTotalPrice();
            },

            getDiscountTotal: () => {
                return 0;
            },

            getFinalTotal: () => {
                const subtotal = get().getSubtotal();
                const discount = get().getDiscountTotal();
                return subtotal - discount;
            }
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
