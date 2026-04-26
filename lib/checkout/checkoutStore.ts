/**
 * Checkout Store - State Management for Checkout Process
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CheckoutData, CheckoutStep, ShippingInfo, PaymentMethod, BillingAddress } from './types';

interface CheckoutStore extends CheckoutData {
    currentStep: CheckoutStep;
    
    // Actions
    setCurrentStep: (step: CheckoutStep) => void;
    nextStep: () => void;
    previousStep: () => void;
    
    setShipping: (shipping: ShippingInfo) => void;
    setPayment: (payment: PaymentMethod) => void;
    setBilling: (billing: BillingAddress) => void;
    setAcceptedTerms: (accepted: boolean) => void;
    
    resetCheckout: () => void;
    canProceedToStep: (step: CheckoutStep) => boolean;
}

const initialState: CheckoutData = {
    shipping: null,
    payment: null,
    billing: {
        sameAsShipping: true,
        address: undefined
    },
    acceptedTerms: false
};

export const useCheckoutStore = create<CheckoutStore>()(
    persist(
        (set, get) => ({
            ...initialState,
            currentStep: 1,

            setCurrentStep: (step) => {
                if (get().canProceedToStep(step)) {
                    set({ currentStep: step });
                }
            },

            nextStep: () => {
                const current = get().currentStep;
                if (current < 3 && get().canProceedToStep((current + 1) as CheckoutStep)) {
                    set({ currentStep: (current + 1) as CheckoutStep });
                }
            },

            previousStep: () => {
                const current = get().currentStep;
                if (current > 1) {
                    set({ currentStep: (current - 1) as CheckoutStep });
                }
            },

            setShipping: (shipping) => {
                set({ shipping });
            },

            setPayment: (payment) => {
                set({ payment });
            },

            setBilling: (billing) => {
                set({ billing });
            },

            setAcceptedTerms: (accepted) => {
                set({ acceptedTerms: accepted });
            },

            resetCheckout: () => {
                set({
                    ...initialState,
                    currentStep: 1
                });
            },

            canProceedToStep: (step) => {
                const state = get();
                
                switch (step) {
                    case 1:
                        return true; // Can always go to step 1
                    case 2:
                        return state.shipping !== null; // Need shipping info
                    case 3:
                        return state.shipping !== null && state.payment !== null; // Need both
                    default:
                        return false;
                }
            }
        }),
        {
            name: 'luxe-checkout-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                shipping: state.shipping,
                payment: state.payment,
                billing: state.billing,
                currentStep: state.currentStep
            })
        }
    )
);
