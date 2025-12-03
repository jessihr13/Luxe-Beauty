import Navigation from '@/components/customer/Navigation';
import ProductGrid from '@/components/customer/ProductGrid';
import { getProductsByCategory } from '@/lib/data/products';

export default function FraganciasPage() {
    const fragranceProducts = getProductsByCategory('fragrance');

    return (
        <main className="min-h-screen bg-nude-50">
            <Navigation />

            <div className="pt-24">
                <ProductGrid
                    products={fragranceProducts}
                    title="Fragancias"
                    description="Aromas exclusivos que definen tu esencia"
                />
            </div>
        </main>
    );
}
