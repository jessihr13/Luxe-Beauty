'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cart/cartStore';
import { useEffect, useState } from 'react';

export default function CartButton() {
    const items = useCartStore(state => state.items);
    const toggleCart = useCartStore(state => state.toggleCart);
    const [itemCount, setItemCount] = useState(0);
    const [mounted, setMounted] = useState(false);
    
    // Handle hydration
    useEffect(() => {
        setMounted(true);
        // Rehydrate persisted state
        useCartStore.persist.rehydrate();
    }, []);

    // Force update when items change
    useEffect(() => {
        if (mounted) {
            const total = items.reduce((sum, item) => sum + item.quantity, 0);
            console.log('🔵 CartButton items changed - count:', items.length, 'total qty:', total);
            setItemCount(total);
        }
    }, [items, mounted]);

    console.log('🔵 CartButton render - badge showing:', itemCount);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <button className="relative p-2 rounded-full bg-rose-gold-100 text-rose-gold-700">
                <ShoppingCart className="w-6 h-6" />
            </button>
        );
    }

    return (
        <button
            onClick={() => {
                console.log('🖱️ Cart button clicked, items:', items.length);
                toggleCart();
            }}
            className="relative p-2 rounded-full bg-rose-gold-100 text-rose-gold-700 hover:bg-rose-gold-200 transition-colors"
            aria-label="Carrito de compras"
        >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                </span>
            )}
        </button>
    );
}
