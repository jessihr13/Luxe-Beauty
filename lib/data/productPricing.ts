/**
 * Actualizar datos de productos para incluir precios originales
 * Esto permite mostrar el anclaje de precios
 */

import { products } from './products';

// Agregar precios originales a productos seleccionados
export const productsWithPricing = products.map(product => {
    // Simular descuentos en algunos productos
    const hasDiscount = Math.random() > 0.5;

    if (hasDiscount) {
        const discountPercentage = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
        const originalPrice = Math.round(product.price / (1 - discountPercentage / 100));

        return {
            ...product,
            originalPrice,
        };
    }

    return product;
});

// Productos destacados con descuentos garantizados
export const featuredDeals = products.slice(0, 6).map(product => ({
    ...product,
    originalPrice: Math.round(product.price * 1.3), // 30% de descuento
}));
