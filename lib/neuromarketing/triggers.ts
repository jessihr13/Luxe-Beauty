// Neuromarketing Triggers and Utilities

import { Product } from '../data/products';

// Scarcity Messages
export function getScarcityMessage(stock: number, scarcityLevel: Product['neuromarketing']['scarcityLevel']): string | null {
    if (scarcityLevel === 'none') return null;

    if (stock === 0) return '¡Agotado! Regístrate para recibir notificación';
    if (stock <= 3) return `¡Solo quedan ${stock} unidades!`;
    if (stock <= 10 && scarcityLevel === 'high') return `Stock limitado - ${stock} disponibles`;

    return null;
}

// Social Proof Messages  
export function getSocialProofMessage(viewingNow: number, purchaseCount: number): string {
    const messages = [
        `${viewingNow} personas están viendo esto ahora`,
        `${purchaseCount} personas compraron este producto`,
        `Más de ${Math.floor(purchaseCount / 100) * 100} clientas satisfechas`,
    ];

    // Return first message to avoid hydration mismatch
    return messages[0];
}

// Urgency Indicators
export function getUrgencyBadge(product: Product): {
    text: string;
    color: 'red' | 'orange' | 'yellow' | 'none';
} | null {
    if (product.stock === 0) {
        return { text: 'Agotado', color: 'red' };
    }

    if (product.neuromarketing.scarcityLevel === 'high' && product.stock <= 5) {
        return { text: '¡Últimas unidades!', color: 'red' };
    }

    if (product.neuromarketing.isTrending) {
        return { text: 'Tendencia', color: 'orange' };
    }

    if (product.neuromarketing.isNew) {
        return { text: 'Nuevo', color: 'yellow' };
    }

    return null;
}

// Benefit-Oriented CTA Text
export const benefitCTAs = {
    skincare: [
        'Mejora tu piel hoy',
        'Transforma tu rutina',
        'Descubre tu mejor piel',
        'Añade a mi ritual',
    ],
    makeup: [
        'Realza tu belleza',
        'Añade a mi colección',
        'Completa tu look',
        'Descubre tu tono',
    ],
    fragrance: [
        'Encuentra tu esencia',
        'Añade a mi colección',
        'Descubre tu aroma',
        'Haz tuya esta fragancia',
    ],
};

export function getBenefitCTA(category: Product['category']): string {
    const ctas = benefitCTAs[category];
    // Always return first CTA to avoid hydration mismatch
    return ctas[0];
}

// Trust Signals
export const trustSignals = [
    {
        icon: '🚚',
        text: 'Envío gratis en pedidos +$50',
    },
    {
        icon: '🌿',
        text: '100% ingredientes naturales',
    },
    {
        icon: '🐰',
        text: 'Cruelty-free certificado',
    },
    {
        icon: '♻️',
        text: 'Packaging sostenible',
    },
    {
        icon: '✨',
        text: 'Resultados visibles en 7 días',
    },
    {
        icon: '🔒',
        text: 'Compra segura garantizada',
    },
];

// Micro-copy for different contexts
export const microcopy = {
    addToCart: {
        default: 'Añadir a mi rutina',
        outOfStock: 'Notificarme cuando esté disponible',
        lastUnits: 'Asegurar mi unidad',
    },
    checkout: {
        default: 'Completar mi pedido',
        withDiscount: 'Aprovechar mi descuento',
    },
    newsletter: {
        placeholder: 'tu@email.com',
        cta: 'Únete al club exclusivo',
        benefit: 'Recibe 15% de descuento en tu primera compra',
    },
    cart: {
        empty: 'Tu carrito está esperando ser llenado de belleza',
        continueShopping: 'Descubrir más productos',
        freeShippingProgress: (remaining: number) =>
            `¡Solo $${remaining.toFixed(2)} más para envío gratis!`,
        freeShippingAchieved: '¡Felicidades! Tienes envío gratis',
    },
};

// Cross-sell Recommendations
export function getCrossSellProducts(product: Product, allProducts: Product[]): Product[] {
    // Logic: Recommend products from same category or complementary categories
    const complementaryCategories: Record<string, Product['category'][]> = {
        skincare: ['skincare'],
        makeup: ['makeup', 'skincare'],
        fragrance: ['fragrance', 'skincare'],
    };

    const categories = complementaryCategories[product.category] || [product.category];

    return allProducts
        .filter(p =>
            p.id !== product.id &&
            categories.includes(p.category)
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
}

// Cart Abandonment Trigger
export function shouldShowAbandonmentPopup(
    cartItemCount: number,
    timeOnPage: number,
    hasShownBefore: boolean
): boolean {
    // Show popup if:
    // - User has items in cart
    // - Has been on page for at least 30 seconds
    // - Haven't shown popup before in this session
    return cartItemCount > 0 && timeOnPage > 30000 && !hasShownBefore;
}

// Discount Calculator
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

// Review Stars Generator
export function getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) +
        (hasHalfStar ? '½' : '') +
        '☆'.repeat(emptyStars);
}
