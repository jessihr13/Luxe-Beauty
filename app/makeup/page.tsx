import Navigation from '@/components/customer/Navigation';
import ProductGrid from '@/components/customer/ProductGrid';
import { getProductsByCategory } from '@/lib/data/products';

export default function MakeupPage() {
    const makeupProducts = getProductsByCategory('makeup');

    return (
        <main className="min-h-screen bg-nude-50">
            <Navigation />

            <div className="pt-24">
                <ProductGrid
                    products={makeupProducts}
                    title="Makeup"
                    description="Maquillaje de lujo para realzar tu belleza natural"
                />
            </div>
        </main>
    );
}
