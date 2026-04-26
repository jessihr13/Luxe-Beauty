'use client';

import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/lib/cart/types';
import { useCartStore } from '@/lib/cart/cartStore';
import { formatPrice } from '@/lib/utils/priceCalculations';
import { motion } from 'framer-motion';

interface CartItemProps {
    item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore();
    const { product, quantity } = item;

    const itemTotal = product.price * quantity;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-rose-gold-300 hover:shadow-sm transition-all duration-300"
        >
            {/* Product Image - Compact */}
            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Product Info - Compact */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-xs text-gray-900 line-clamp-2 leading-tight">
                            {product.name}
                        </h3>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                            aria-label="Eliminar del carrito"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Stock Warning - Compact */}
                    {product.stock <= 5 && product.stock > 0 && (
                        <p className="text-[10px] text-orange-600 mb-1">
                            ⚠️ Solo {product.stock}
                        </p>
                    )}
                </div>

                {/* Price and Quantity - Compact */}
                <div className="flex items-center justify-between">
                    {/* Quantity Controls - Smaller */}
                    <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
                        <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            disabled={quantity <= 1}
                            className="p-1 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Disminuir cantidad"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold min-w-[20px] text-center px-1.5">
                            {quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="p-1 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Aumentar cantidad"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Price - Compact */}
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                            {formatPrice(itemTotal)}
                        </p>
                        {product.originalPrice && (
                            <p className="text-[10px] text-gray-400 line-through">
                                {formatPrice(product.originalPrice * quantity)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
