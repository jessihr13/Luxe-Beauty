'use client';

import Navigation from '@/components/customer/Navigation';
import ProductCard from '@/components/customer/ProductCard';
import { products } from '@/lib/data/products';
import { ShoppingCart, Star, Truck, Tag } from 'lucide-react';

export default function CartDemoPage() {
    const featuredProducts = products.slice(0, 6);

    return (
        <main className="min-h-screen bg-nude-50">
            <Navigation />

            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-gold-100 text-rose-gold-700 rounded-full mb-4">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="font-semibold">Sistema de Carrito Completo</span>
                        </div>
                        <h1 className="text-5xl font-serif font-bold gradient-text mb-4">
                            Carrito de Compras
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Agrega productos al carrito y disfruta de una experiencia de compra optimizada
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="card-luxury p-6 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Puntos de Lealtad</h3>
                            <p className="text-sm text-gray-600">
                                Gana y redime puntos en cada compra
                            </p>
                        </div>

                        <div className="card-luxury p-6 text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Envío Gratis</h3>
                            <p className="text-sm text-gray-600">
                                En compras mayores a $1,000 MXN
                            </p>
                        </div>

                        <div className="card-luxury p-6 text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Tag className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Descuentos Acumulativos</h3>
                            <p className="text-sm text-gray-600">
                                Productos + VIP + Cupones + Puntos
                            </p>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="card-luxury p-8 mb-12 bg-gradient-to-r from-blue-50 to-purple-50">
                        <h2 className="text-2xl font-semibold mb-4">¿Cómo Funciona?</h2>
                        <ol className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-rose-gold-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                <span>Haz clic en cualquier producto para agregarlo al carrito</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-rose-gold-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                <span>El carrito se abrirá automáticamente mostrando tus productos</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-rose-gold-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                <span>Modifica cantidades, aplica descuentos y procede al pago</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-rose-gold-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                <span>El carrito se guarda automáticamente (incluso si cierras el navegador)</span>
                            </li>
                        </ol>
                    </div>

                    {/* Products Grid */}
                    <h2 className="text-3xl font-serif font-bold mb-8">Productos Destacados</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
