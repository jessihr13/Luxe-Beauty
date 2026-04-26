'use client';

import Navigation from '@/components/customer/Navigation';
import ProductCard from '@/components/customer/ProductCard';
import PriceDisplay from '@/components/products/PriceDisplay';
import { featuredDeals } from '@/lib/data/productPricing';
import { Tag, TrendingDown, Clock } from 'lucide-react';

export default function OfertasPage() {
    return (
        <main className="min-h-screen bg-nude-50">
            <Navigation />

            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full mb-4">
                            <Clock className="w-5 h-5" />
                            <span className="font-semibold">Ofertas por tiempo limitado</span>
                        </div>
                        <h1 className="text-5xl font-serif font-bold gradient-text mb-4">
                            Ofertas Especiales
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Aprovecha descuentos increíbles en productos seleccionados
                        </p>
                    </div>

                    {/* Savings Banner */}
                    <div className="card-luxury p-8 mb-12 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
                        <div className="flex items-center justify-center gap-6 flex-wrap">
                            <div className="text-center">
                                <TrendingDown className="w-12 h-12 text-red-600 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-red-600">Hasta 30%</p>
                                <p className="text-sm text-gray-600">de descuento</p>
                            </div>
                            <div className="text-center">
                                <Tag className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-orange-600">+500 pts</p>
                                <p className="text-sm text-gray-600">en compras</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Anchoring Examples */}
                    <div className="card-luxury p-8 mb-12">
                        <h2 className="text-2xl font-semibold mb-6">Ejemplos de Anclaje de Precios</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">Descuento Pequeño</p>
                                <PriceDisplay
                                    originalPrice={599}
                                    currentPrice={549}
                                    size="lg"
                                />
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">Descuento Medio</p>
                                <PriceDisplay
                                    originalPrice={899}
                                    currentPrice={649}
                                    size="lg"
                                />
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">Descuento Grande</p>
                                <PriceDisplay
                                    originalPrice={1299}
                                    currentPrice={799}
                                    size="lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredDeals.map((product) => (
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
