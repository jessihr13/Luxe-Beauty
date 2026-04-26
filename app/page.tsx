import Navigation from '@/components/customer/Navigation';
import HeroSection from '@/components/customer/HeroSection';
import ProductCard from '@/components/customer/ProductCard';
import TestimonialSection from '@/components/customer/TestimonialSection';
import { getBestsellers, getTrendingProducts } from '@/lib/data/products';

export default function HomePage() {
    const bestsellers = getBestsellers();
    const trending = getTrendingProducts();

    return (
        <main className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <HeroSection />

            {/* Bestsellers Section */}
            <section id="productos" className="py-20 bg-white dark:bg-luxe-dark-900 transition-colors">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 dark:text-white">
                            Nuestros <span className="gradient-text">Bestsellers</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Los productos favoritos de nuestras clientas
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bestsellers.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gradient-to-br from-rose-gold-50 to-nude-100 dark:from-luxe-dark-800 dark:to-luxe-dark-900 transition-colors">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 dark:text-white">
                            ¿Por Qué <span className="gradient-text">Luxe Beauty</span>?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: '🌿',
                                title: 'Ingredientes Premium',
                                description: 'Formulados con los mejores ingredientes naturales y activos científicamente probados para resultados visibles.',
                            },
                            {
                                icon: '✨',
                                title: 'Resultados Comprobados',
                                description: 'El 98% de nuestras clientas reportan mejoras visibles en su piel en las primeras 2 semanas.',
                            },
                            {
                                icon: '💎',
                                title: 'Lujo Accesible',
                                description: 'Calidad de lujo a precios justos. Porque todas merecen sentirse radiantes sin comprometer su presupuesto.',
                            },
                        ].map((benefit, index) => (
                            <div key={index} className="text-center">
                                <div className="text-6xl mb-6">{benefit.icon}</div>
                                <h3 className="text-2xl font-serif font-semibold mb-4 dark:text-white">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Products */}
            <section className="py-20 bg-white dark:bg-luxe-dark-900 transition-colors">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 dark:text-white">
                            <span className="gradient-text">Tendencias</span> del Momento
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Lo más nuevo y popular en belleza
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trending.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <TestimonialSection />

            {/* Newsletter Section */}
            <section className="py-20 bg-gradient-to-br from-rose-gold-100 via-nude-100 to-terracotta-100 dark:from-luxe-dark-800 dark:via-luxe-dark-700 dark:to-luxe-dark-800 transition-colors">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 dark:text-white">
                            Únete al <span className="gradient-text">Club Exclusivo</span>
                        </h2>
                        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                            Recibe tips de belleza, ofertas exclusivas y 15% de descuento en tu primera compra
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="flex-1 px-6 py-4 rounded-full border-2 border-rose-gold-300 focus:outline-none focus:border-rose-gold-500 transition-colors"
                            />
                            <button className="btn-primary whitespace-nowrap">
                                Suscribirme ✨
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mt-4">
                            🔒 Tu privacidad es importante. No compartimos tu información.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-serif font-bold gradient-text mb-4">
                                Luxe Beauty
                            </h3>
                            <p className="text-gray-400">
                                Transformando tu radiancia natural desde 2024
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Comprar</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-rose-gold-300 transition-colors">Skincare</a></li>
                                <li><a href="#" className="hover:text-rose-gold-300 transition-colors">Makeup</a></li>
                                <li><a href="#" className="hover:text-rose-gold-300 transition-colors">Fragancias</a></li>
                                <li><a href="#" className="hover:text-rose-gold-300 transition-colors">Bestsellers</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Ayuda</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-rose-gold-300 transition-colors">Contacto</a></li>
                                <li><a href="#" className="hover:text-rose-gold-300 transition-colors">Envíos</a></li>
                                <li><a href="#" className="hover:text-rose-gold-300 transition-colors">Devoluciones</a></li>
                                <li><a href="#" className="hover:text-rose-gold-300 transition-colors">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Síguenos</h4>
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-400 hover:text-rose-gold-300 transition-colors">
                                    Instagram
                                </a>
                                <a href="#" className="text-gray-400 hover:text-rose-gold-300 transition-colors">
                                    TikTok
                                </a>
                                <a href="#" className="text-gray-400 hover:text-rose-gold-300 transition-colors">
                                    Pinterest
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Luxe Beauty. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
