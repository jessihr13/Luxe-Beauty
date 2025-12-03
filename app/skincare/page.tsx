import Navigation from '@/components/customer/Navigation';
import ProductGrid from '@/components/customer/ProductGrid';
import { getProductsByCategory } from '@/lib/data/products';

export default function SkincarePage() {
    const skincareProducts = getProductsByCategory('skincare');

    return (
        <main className="min-h-screen bg-nude-50">
            <Navigation />

            <div className="pt-24">
                <ProductGrid
                    products={skincareProducts}
                    title="Skincare"
                    description="Productos premium para el cuidado de tu piel"
                />
            </div>
        </main>
    );
}
