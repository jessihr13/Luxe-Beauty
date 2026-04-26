'use client';

import { useCartStore } from '@/lib/cart/cartStore';
import Image from 'next/image';

export default function OrderSummary() {
    const items = useCartStore(state => state.items);
    const getTotalPrice = useCartStore(state => state.getTotalPrice);
    
    const subtotal = getTotalPrice();
    const shipping = subtotal > 500 ? 0 : 99; // Free shipping over $500
    const total = subtotal + shipping;

    return (
        <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-serif font-bold mb-4">Resumen del Pedido</h2>

            {/* Items */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                            <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                            <p className="text-sm font-semibold text-rose-gold-700">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold">
                        {shipping === 0 ? (
                            <span className="text-green-600">¡Gratis!</span>
                        ) : (
                            `$${shipping.toFixed(2)}`
                        )}
                    </span>
                </div>
                {shipping > 0 && subtotal > 400 && (
                    <p className="text-xs text-rose-gold-600">
                        ¡Agrega ${(500 - subtotal).toFixed(2)} más para envío gratis!
                    </p>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-rose-gold-700">${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
