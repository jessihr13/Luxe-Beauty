'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { staggerContainer, slideUp } from '@/lib/animations';

interface Testimonial {
    id: number;
    name: string;
    image: string;
    rating: number;
    text: string;
    product: string;
    verified: boolean;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'María González',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        rating: 5,
        text: 'El serum de vitamina C cambió completamente mi piel. En solo 2 semanas noté una diferencia increíble en luminosidad y textura. ¡Lo recomiendo 100%!',
        product: 'Radiance Renewal Serum',
        verified: true,
    },
    {
        id: 2,
        name: 'Ana Martínez',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
        rating: 5,
        text: 'Nunca había encontrado un labial que durara tanto y que además hidratara mis labios. El color es perfecto y la textura es increíble.',
        product: 'Velvet Matte Lipstick',
        verified: true,
    },
    {
        id: 3,
        name: 'Carmen López',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
        rating: 5,
        text: 'La crema con oro de 24k es un lujo que vale cada centavo. Mi piel se ve más firme y radiante. Mis amigas me preguntan qué me hice.',
        product: 'Golden Hour Face Cream',
        verified: true,
    },
];

export default function TestimonialSection() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-nude-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={slideUp}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        Lo Que Dicen Nuestras <span className="gradient-text">Clientas</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Miles de mujeres ya transformaron su rutina de belleza con Luxe Beauty
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {testimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial.id}
                            variants={slideUp}
                            className="card-luxury p-8"
                        >
                            {/* Rating Stars */}
                            <div className="flex text-yellow-500 text-xl mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>

                            {/* Product Reference */}
                            <p className="text-sm text-rose-gold-600 font-medium mb-6">
                                Producto: {testimonial.product}
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                    {testimonial.verified && (
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <span>✓</span> Compra Verificada
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trust Stats */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={slideUp}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                >
                    {[
                        { number: '50K+', label: 'Clientas Felices' },
                        { number: '4.9', label: 'Calificación Promedio' },
                        { number: '15K+', label: 'Reseñas 5 Estrellas' },
                        { number: '98%', label: 'Recomendarían' },
                    ].map((stat, index) => (
                        <div key={index}>
                            <p className="text-4xl font-bold text-rose-gold-600 mb-2">
                                {stat.number}
                            </p>
                            <p className="text-gray-600 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
