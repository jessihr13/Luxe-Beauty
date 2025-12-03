'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/lib/data/products';
import {
    getScarcityMessage,
    getUrgencyBadge,
    getBenefitCTA,
    calculateDiscount
} from '@/lib/neuromarketing/triggers';
import { cardHover, buttonPress } from '@/lib/animations';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const scarcityMsg = getScarcityMessage(product.stock, product.neuromarketing.scarcityLevel);
    const urgencyBadge = getUrgencyBadge(product);
    const benefitCTA = getBenefitCTA(product.category);
    const discount = product.originalPrice
        ? calculateDiscount(product.originalPrice, product.price)
        : null;

    return (
        <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="card-luxury group cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative h-80 overflow-hidden">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.neuromarketing.isBestseller && (
                        <span className="px-3 py-1 bg-rose-gold-500 text-white text-xs font-semibold rounded-full shadow-lg">
                            ⭐ Más Vendido
                        </span>
                    )}

                    {urgencyBadge && (
                        <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`px-3 py-1 text-white text-xs font-semibold rounded-full shadow-lg ${urgencyBadge.color === 'red' ? 'bg-red-500' :
                                urgencyBadge.color === 'orange' ? 'bg-orange-500' :
                                    'bg-yellow-500'
                                }`}
                        >
                            {urgencyBadge.text}
                        </motion.span>
                    )}

                    {discount && (
                        <span className="px-3 py-1 bg-terracotta-600 text-white text-xs font-semibold rounded-full shadow-lg">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Quick View Button (appears on hover) */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="opacity-0 group-hover:opacity-100 px-6 py-2 bg-white text-gray-900 font-medium rounded-full transition-all duration-300"
                    >
                        Vista Rápida
                    </motion.button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Category */}
                <p className="text-xs uppercase tracking-wider text-rose-gold-600 dark:text-rose-gold-400 font-semibold mb-2">
                    {product.subcategory}
                </p>

                {/* Product Name */}
                <h3 className="text-xl font-serif font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
                    {product.name}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {product.shortDescription}
                </p>

                {/* Rating & Reviews (Social Proof) */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <span key={i}>
                                {i < Math.floor(product.rating) ? '★' : '☆'}
                            </span>
                        ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({product.reviewCount} reseñas)
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                    {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                        </span>
                    )}
                    <span className="text-2xl font-bold text-rose-gold-700">
                        ${product.price.toFixed(2)}
                    </span>
                </div>

                {/* Scarcity Message */}
                {scarcityMsg && (
                    <p className="text-sm text-red-600 font-medium mb-4 flex items-center gap-1">
                        <span>⚠️</span>
                        {scarcityMsg}
                    </p>
                )}

                {/* Social Proof - Viewing Now */}
                {product.neuromarketing.socialProof.viewingNow > 10 && (
                    <p className="text-xs text-gray-500 mb-4">
                        🔥 {product.neuromarketing.socialProof.viewingNow} personas viendo esto ahora
                    </p>
                )}

                {/* CTA Button - Benefit Oriented */}
                <motion.button
                    variants={buttonPress}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => onAddToCart?.(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-3 rounded-full font-medium transition-all duration-300 ${product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-rose-gold-300 text-white hover:bg-rose-gold-400 hover:shadow-lg'
                        }`}
                >
                    {product.stock === 0 ? 'Agotado' : benefitCTA}
                </motion.button>
            </div>
        </motion.div>
    );
}
