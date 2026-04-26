'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { slideUp, fadeIn, buttonPress } from '@/lib/animations';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-nude-50 via-rose-gold-50 to-nude-100">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80"
                    alt="Beautiful woman with natural makeup looking at camera"
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-nude-100/90 via-nude-100/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-3xl">
                    {/* Small Badge */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="inline-block mb-6"
                    >
                        <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-rose-gold-700 shadow-sm">
                            ✨ Cosmética de Lujo Natural
                        </span>
                    </motion.div>

                    {/* Main Headline - Benefit-Oriented */}
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={slideUp}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        Transforma Tu{' '}
                        <span className="gradient-text">
                            Radiancia Natural
                        </span>
                    </motion.h1>

                    {/* Subheadline - Emotional Connection */}
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={slideUp}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed"
                    >
                        Descubre cosméticos de lujo formulados con ingredientes premium que
                        realzan tu belleza única. Porque mereces sentirte radiante cada día.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={slideUp}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 mb-12"
                    >
                        <motion.button
                            variants={buttonPress}
                            whileHover="hover"
                            whileTap="tap"
                            className="btn-primary text-lg"
                        >
                            Descubre Tu Brillo ✨
                        </motion.button>

                        <motion.button
                            variants={buttonPress}
                            whileHover="hover"
                            whileTap="tap"
                            className="btn-outline text-lg"
                        >
                            Ver Colección
                        </motion.button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {[
                            { icon: '🚚', text: 'Envío Gratis +$50' },
                            { icon: '🌿', text: '100% Natural' },
                            { icon: '🐰', text: 'Cruelty-Free' },
                            { icon: '✨', text: 'Resultados en 7 días' },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-sm text-gray-600"
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="font-medium">{item.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
            >
                <div className="w-6 h-10 border-2 border-rose-gold-300 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-rose-gold-400 rounded-full mt-2" />
                </div>
            </motion.div>
        </section>
    );
}
