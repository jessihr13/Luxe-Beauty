import Navigation from '@/components/customer/Navigation';
import ProductGrid from '@/components/customer/ProductGrid';
import { getAllProducts } from '@/lib/data/products';

export default function ProductosPage() {
    const allProducts = getAllProducts();

    return (
        <main className="min-h-screen bg-nude-50">
            <Navigation />

            <div className="pt-24">
                <ProductGrid
                    products={allProducts}
                    title="Todos los Productos"
                    description="Descubre nuestra colección completa de cosmética de lujo"
                />
            </div>
        </main>
    );
}
