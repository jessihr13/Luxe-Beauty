'use client';

import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart/cartStore';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
    const [mounted, setMounted] = useState(false);
    const isOpen = useCartStore(state => state.isOpen);
    const items = useCartStore(state => state.items);
    const closeCart = useCartStore(state => state.closeCart);
    const removeFromCart = useCartStore(state => state.removeFromCart);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const clearCart = useCartStore(state => state.clearCart);

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed top-20 left-0 right-0 bottom-0 bg-black/50 z-20 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-screen w-full sm:w-[450px] bg-white shadow-2xl z-[110] flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-r from-rose-gold-50 to-nude-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-serif font-bold gradient-text">
                                Tu Carrito
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {items.length} {items.length === 1 ? 'producto' : 'productos'}
                            </p>
                        </div>
                        <button
                            onClick={closeCart}
                            className="p-2 rounded-full hover:bg-white/50 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Items */}
                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-2">Tu carrito está vacío</p>
                        <p className="text-gray-400 text-sm mb-6">Agrega productos para comenzar</p>
                        <button
                            onClick={closeCart}
                            className="px-6 py-3 bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white rounded-lg hover:from-rose-gold-500 hover:to-rose-gold-600 transition-all"
                        >
                            Continuar Comprando
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    {/* Image */}
                                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-sm line-clamp-2">
                                                {item.name}
                                            </h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 p-1 ml-2"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 border">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-semibold min-w-[20px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <p className="font-bold text-rose-gold-700">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t bg-gray-50 space-y-4">
                            {/* Total */}
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total:</span>
                                <span className="text-2xl font-bold text-rose-gold-700">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>

                            {/* Buttons */}
                            <button
                                onClick={() => {
                                    closeCart();
                                    window.location.href = '/checkout';
                                }}
                                className="w-full py-3 px-6 bg-gradient-to-r from-rose-gold-400 via-rose-gold-500 to-terracotta-500 text-white font-semibold rounded-lg hover:from-rose-gold-500 hover:via-rose-gold-600 hover:to-terracotta-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Proceder al Pago
                            </button>

                            <button
                                onClick={closeCart}
                                className="w-full py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
