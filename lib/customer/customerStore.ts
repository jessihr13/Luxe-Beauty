// Customer Store - Manages customer data and preferences
// lib/customer/customerStore.ts

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Address {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

export interface CustomerState {
    // Basic Info
    email: string;
    name: string;
    phone: string;
    
    // Loyalty (prepared for future)
    loyaltyPoints: number;
    loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
    
    // Addresses
    savedAddresses: Address[];
    
    // Actions
    setCustomer: (email: string, name: string, phone: string) => void;
    updateProfile: (updates: Partial<CustomerState>) => void;
    addAddress: (address: Omit<Address, 'id'>) => void;
    updateAddress: (id: string, updates: Partial<Address>) => void;
    deleteAddress: (id: string) => void;
    setDefaultAddress: (id: string) => void;
    addLoyaltyPoints: (points: number) => void;
    isLoggedIn: () => boolean;
    logout: () => void;
}

export const useCustomerStore = create<CustomerState>()(
    persist(
        (set, get) => ({
            // Initial state
            email: '',
            name: '',
            phone: '',
            loyaltyPoints: 0,
            loyaltyTier: 'bronze',
            savedAddresses: [],

            // Actions
            setCustomer: (email, name, phone) => {
                set({ email, name, phone });
            },

            updateProfile: (updates) => {
                set(updates);
            },

            addAddress: (addressData) => {
                const newAddress: Address = {
                    ...addressData,
                    id: `addr_${Date.now()}`,
                };
                
                // If this is the first address, make it default
                if (get().savedAddresses.length === 0) {
                    newAddress.isDefault = true;
                }
                
                set(state => ({
                    savedAddresses: [...state.savedAddresses, newAddress]
                }));
            },

            updateAddress: (id, updates) => {
                set(state => ({
                    savedAddresses: state.savedAddresses.map(addr =>
                        addr.id === id ? { ...addr, ...updates } : addr
                    )
                }));
            },

            deleteAddress: (id) => {
                set(state => ({
                    savedAddresses: state.savedAddresses.filter(addr => addr.id !== id)
                }));
            },

            setDefaultAddress: (id) => {
                set(state => ({
                    savedAddresses: state.savedAddresses.map(addr => ({
                        ...addr,
                        isDefault: addr.id === id
                    }))
                }));
            },

            addLoyaltyPoints: (points) => {
                set(state => {
                    const newPoints = state.loyaltyPoints + points;
                    let newTier = state.loyaltyTier;
                    
                    // Auto-upgrade tier based on points
                    if (newPoints >= 10000) newTier = 'platinum';
                    else if (newPoints >= 5000) newTier = 'gold';
                    else if (newPoints >= 1000) newTier = 'silver';
                    else newTier = 'bronze';
                    
                    return {
                        loyaltyPoints: newPoints,
                        loyaltyTier: newTier
                    };
                });
            },

            isLoggedIn: () => {
                return get().email !== '';
            },

            logout: () => {
                set({
                    email: '',
                    name: '',
                    phone: '',
                    loyaltyPoints: 0,
                    loyaltyTier: 'bronze',
                    savedAddresses: []
                });
            }
        }),
        {
            name: 'customer-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
