'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/cart/cartStore';
import { useCheckoutStore } from '@/lib/checkout/checkoutStore';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order');
    const clearCart = useCartStore(state => state.clearCart);
    const resetCheckout = useCheckoutStore(state => state.resetCheckout);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Clear cart and checkout data when success page loads
        clearCart();
        resetCheckout();
    }, [clearCart, resetCheckout]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-gold-50 via-nude-50 to-white flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle className="w-16 h-16 text-white" />
                    </motion.div>

                    {/* Success Message */}
                    <h1 className="text-3xl md:text-4xl font-serif font-bold gradient-text mb-4">
                        ¡Pedido Confirmado!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Gracias por tu compra. Hemos recibido tu pedido y lo procesaremos pronto.
                    </p>

                    {/* Order Details */}
                    <div className="bg-gradient-to-r from-rose-gold-50 to-nude-50 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-rose-gold-600" />
                            <h2 className="text-lg font-semibold">Detalles del Pedido</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            Número de pedido: <strong className="text-rose-gold-700">{orderNumber || 'N/A'}</strong>
                        </p>
                        <p className="text-sm text-gray-600">
                            Recibirás un email de confirmación con los detalles de tu pedido y el seguimiento de envío.
                        </p>
                    </div>

                    {/* What's Next */}
                    <div className="text-left mb-8">
                        <h3 className="font-semibold mb-3">¿Qué sigue?</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-rose-gold-600 mt-0.5">✓</span>
                                <span>Recibirás un email de confirmación en los próximos minutos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-gold-600 mt-0.5">✓</span>
                                <span>Procesaremos tu pedido en 24-48 horas</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-gold-600 mt-0.5">✓</span>
                                <span>Te enviaremos el número de seguimiento cuando tu pedido sea enviado</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-gold-600 mt-0.5">✓</span>
                                <span>Tiempo estimado de entrega: 3-5 días hábiles</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-rose-gold-400 via-rose-gold-500 to-terracotta-500 text-white font-semibold rounded-lg hover:from-rose-gold-500 hover:via-rose-gold-600 hover:to-terracotta-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Volver al Inicio
                        </Link>
                        <Link
                            href="/productos"
                            className="flex-1 py-3 px-6 border-2 border-rose-gold-500 text-rose-gold-700 font-semibold rounded-lg hover:bg-rose-gold-50 transition-all flex items-center justify-center gap-2"
                        >
                            Seguir Comprando
                        </Link>
                    </div>

                    {/* Support */}
                    <p className="text-sm text-gray-500 mt-8">
                        ¿Necesitas ayuda? Contáctanos en{' '}
                        <a href="mailto:soporte@luxebeauty.com" className="text-rose-gold-600 hover:underline">
                            soporte@luxebeauty.com
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
