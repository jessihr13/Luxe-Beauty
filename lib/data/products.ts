// Product Types and Data Models

export interface Product {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    cost?: number; // Costo de producción/adquisición
    originalPrice?: number;
    category: 'skincare' | 'makeup' | 'fragrance';
    subcategory: string;
    images: string[];
    image: string; // Primera imagen (para compatibilidad)
    stock: number;
    rating: number;
    reviewCount: number;
    ingredients: string[];
    benefits: string[];
    skinTypes: string[];
    neuromarketing: {
        scarcityLevel: 'high' | 'medium' | 'low' | 'none';
        isBestseller: boolean;
        isTrending: boolean;
        isNew: boolean;
        socialProof: {
            purchaseCount: number;
            viewingNow: number;
        };
    };
}

// Sample Luxury Products
export const products: Product[] = [
    {
        id: 'prod_001',
        name: 'Radiance Renewal Serum',
        shortDescription: 'Suero iluminador con vitamina C y ácido hialurónico',
        description: 'Transforma tu piel con nuestro suero de lujo formulado con vitamina C pura al 20% y ácido hialurónico de triple peso molecular. Reduce visiblemente las manchas oscuras mientras hidrata profundamente.',
        price: 89.99,
        cost: 35.00,
        originalPrice: 129.99,
        category: 'skincare',
        subcategory: 'Serums',
        images: [
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
            'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
        ],
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
        stock: 3,
        rating: 4.8,
        reviewCount: 342,
        ingredients: ['Vitamina C 20%', 'Ácido Hialurónico', 'Niacinamida', 'Péptidos'],
        benefits: ['Ilumina la piel', 'Reduce manchas', 'Hidratación profunda', 'Anti-edad'],
        skinTypes: ['Normal', 'Seca', 'Mixta'],
        neuromarketing: {
            scarcityLevel: 'high',
            isBestseller: true,
            isTrending: true,
            isNew: false,
            socialProof: {
                purchaseCount: 1247,
                viewingNow: 23,
            },
        },
    },
    {
        id: 'prod_002',
        name: 'Velvet Matte Lipstick - Rose Petal',
        shortDescription: 'Labial mate de larga duración con acabado aterciopelado',
        description: 'Labial de lujo con pigmentación intensa y acabado mate aterciopelado. Enriquecido con aceite de rosa mosqueta y vitamina E para labios suaves e hidratados todo el día.',
        price: 34.99,
        cost: 12.00,
        category: 'makeup',
        subcategory: 'Labiales',
        images: [
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
            'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&q=80',
        ],
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
        stock: 15,
        rating: 4.9,
        reviewCount: 589,
        ingredients: ['Aceite de Rosa Mosqueta', 'Vitamina E', 'Manteca de Karité'],
        benefits: ['Larga duración', 'Hidratante', 'Pigmentación intensa', 'No reseca'],
        skinTypes: ['Todos'],
        neuromarketing: {
            scarcityLevel: 'low',
            isBestseller: true,
            isTrending: false,
            isNew: false,
            socialProof: {
                purchaseCount: 2341,
                viewingNow: 45,
            },
        },
    },
    {
        id: 'prod_003',
        name: 'Golden Hour Face Cream',
        shortDescription: 'Crema facial nutritiva con oro de 24k',
        description: 'Crema facial de lujo infusionada con partículas de oro de 24k y extractos botánicos premium. Nutre, ilumina y rejuvenece la piel para un brillo radiante natural.',
        price: 124.99,
        cost: 48.00,
        originalPrice: 159.99,
        category: 'skincare',
        subcategory: 'Cremas',
        images: [
            'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
            'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80',
        ],
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
        stock: 7,
        rating: 4.7,
        reviewCount: 198,
        ingredients: ['Oro 24k', 'Ácido Hialurónico', 'Colágeno Marino', 'Extracto de Caviar'],
        benefits: ['Anti-edad', 'Iluminación', 'Firmeza', 'Hidratación intensa'],
        skinTypes: ['Madura', 'Seca', 'Normal'],
        neuromarketing: {
            scarcityLevel: 'medium',
            isBestseller: false,
            isTrending: true,
            isNew: true,
            socialProof: {
                purchaseCount: 456,
                viewingNow: 18,
            },
        },
    },
    {
        id: 'prod_004',
        name: 'Bloom Eau de Parfum',
        shortDescription: 'Fragancia floral con notas de jazmín y rosa',
        description: 'Perfume de lujo con una composición sofisticada de jazmín sambac, rosa de Bulgaria y notas de fondo de ámbar y vainilla. Una fragancia que evoca elegancia y feminidad.',
        price: 149.99,
        cost: 55.00,
        category: 'fragrance',
        subcategory: 'Perfumes',
        images: [
            'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
        ],
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        stock: 12,
        rating: 4.9,
        reviewCount: 421,
        ingredients: ['Jazmín Sambac', 'Rosa de Bulgaria', 'Ámbar', 'Vainilla'],
        benefits: ['Larga duración', 'Aroma sofisticado', 'Notas florales', 'Elegante'],
        skinTypes: ['Todos'],
        neuromarketing: {
            scarcityLevel: 'low',
            isBestseller: true,
            isTrending: false,
            isNew: false,
            socialProof: {
                purchaseCount: 1876,
                viewingNow: 31,
            },
        },
    },
    {
        id: 'prod_005',
        name: 'Luminous Glow Foundation',
        shortDescription: 'Base de maquillaje con acabado luminoso natural',
        description: 'Base de maquillaje de cobertura media a completa con acabado luminoso. Enriquecida con ácido hialurónico y vitaminas para cuidar tu piel mientras la embelleces.',
        price: 54.99,
        cost: 18.00,
        category: 'makeup',
        subcategory: 'Bases',
        images: [
            'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
            'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80',
        ],
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
        stock: 24,
        rating: 4.6,
        reviewCount: 756,
        ingredients: ['Ácido Hialurónico', 'Vitamina E', 'SPF 30'],
        benefits: ['Cobertura buildable', 'Acabado luminoso', 'Hidratante', 'Protección solar'],
        skinTypes: ['Todos'],
        neuromarketing: {
            scarcityLevel: 'none',
            isBestseller: false,
            isTrending: true,
            isNew: true,
            socialProof: {
                purchaseCount: 892,
                viewingNow: 52,
            },
        },
    },
    {
        id: 'prod_006',
        name: 'Midnight Recovery Oil',
        shortDescription: 'Aceite facial reparador nocturno',
        description: 'Aceite facial de lujo que trabaja mientras duermes. Formulado con aceites esenciales premium y extractos botánicos para reparar, nutrir y rejuvenecer la piel.',
        price: 78.99,
        cost: 28.00,
        category: 'skincare',
        subcategory: 'Aceites',
        images: [
            'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80',
            'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80',
        ],
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80',
        stock: 5,
        rating: 4.8,
        reviewCount: 312,
        ingredients: ['Aceite de Jojoba', 'Aceite de Rosa Mosqueta', 'Escualano', 'Lavanda'],
        benefits: ['Reparación nocturna', 'Anti-edad', 'Hidratación profunda', 'Calma la piel'],
        skinTypes: ['Todos'],
        neuromarketing: {
            scarcityLevel: 'high',
            isBestseller: false,
            isTrending: true,
            isNew: false,
            socialProof: {
                purchaseCount: 678,
                viewingNow: 15,
            },
        },
    },
];

// Helper functions
export function getAllProducts(): Product[] {
    return products;
}

export function getProductById(id: string): Product | undefined {
    return products.find(p => p.id === id);
}

export function getProductsByCategory(category: Product['category']): Product[] {
    return products.filter(p => p.category === category);
}

export function getBestsellers(): Product[] {
    return products.filter(p => p.neuromarketing.isBestseller);
}

export function getTrendingProducts(): Product[] {
    return products.filter(p => p.neuromarketing.isTrending);
}

export function getNewProducts(): Product[] {
    return products.filter(p => p.neuromarketing.isNew);
}
