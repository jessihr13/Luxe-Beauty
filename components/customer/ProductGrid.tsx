import { Product } from '@/lib/data/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
    title?: string;
    description?: string;
}

export default function ProductGrid({ products, title, description }: ProductGridProps) {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {title && (
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay productos disponibles en esta categoría</p>
                    </div>
                )}
            </div>
        </section>
    );
}
