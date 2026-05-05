// Complete Integrated Checkout Page
// app/checkout/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart/cartStore';
import { OrderService } from '@/lib/services/orderService';
import { PaymentProvider, ShippingProvider } from '@/lib/integrations/integrationTypes';
import { useToast } from '@/lib/hooks/useToast';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import ShippingMethodSelector from '@/components/checkout/ShippingMethodSelector';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const toast = useToast();
    const items = useCartStore(state => state.items);
    const subtotal = useCartStore(state => state.getSubtotal());
    
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Form state
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'México'
    });
    
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentProvider | null>(null);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingProvider | null>(null);
    const [shippingCost, setShippingCost] = useState(0);

    useEffect(() => {
        useCartStore.persist.rehydrate();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && items.length === 0) {
            router.push('/');
        }
    }, [mounted, items, router]);

    const handleShippingSelect = (method: ShippingProvider, cost: number) => {
        setSelectedShippingMethod(method);
        setShippingCost(cost);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedPaymentMethod) {
            toast.error('Por favor selecciona un método de pago');
            return;
        }
        
        if (!selectedShippingMethod) {
            toast.error('Por favor selecciona un método de envío');
            return;
        }

        setIsProcessing(true);

        try {
            const result = await OrderService.createOrder({
                customerInfo,
                paymentMethod: selectedPaymentMethod,
                shippingMethod: selectedShippingMethod
            });

            if (result.success) {
                toast.success('¡Orden creada exitosamente!');
                router.push(`/order-confirmation?orderId=${result.orderId}`);
            } else {
                toast.error(result.error || 'Error al procesar la orden');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error inesperado');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-gold-50 via-nude-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-rose-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando checkout...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    const total = subtotal + shippingCost;

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-gold-50 via-nude-50 to-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                        <ArrowLeft className="w-5 h-5" />
                        Volver al carrito
                    </Link>
                    <h1 className="text-4xl font-serif font-bold gradient-text">
                        Finalizar Compra
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Completa tu información para procesar el pedido
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Information */}
                            <div className="card-luxury p-6">
                                <h2 className="text-xl font-bold mb-4">Información de Contacto</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre Completo *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={customerInfo.name}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={customerInfo.email}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={customerInfo.phone}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="card-luxury p-6">
                                <h2 className="text-xl font-bold mb-4">Dirección de Envío</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dirección *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={customerInfo.address}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ciudad *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerInfo.city}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Estado *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerInfo.state}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Código Postal *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={customerInfo.zipCode}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, zipCode: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Method */}
                            <div className="card-luxury p-6">
                                <ShippingMethodSelector
                                    selectedMethod={selectedShippingMethod}
                                    onSelect={handleShippingSelect}
                                    destination={{
                                        city: customerInfo.city,
                                        state: customerInfo.state,
                                        zipCode: customerInfo.zipCode
                                    }}
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="card-luxury p-6">
                                <PaymentMethodSelector
                                    selectedMethod={selectedPaymentMethod}
                                    onSelect={setSelectedPaymentMethod}
                                />
                            </div>
                        </div>

                        {/* Right Column - Summary */}
                        <div className="lg:col-span-1">
                            <div className="card-luxury p-6 sticky top-24">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    Resumen
                                </h3>

                                {/* Items */}
                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.productId} className="flex gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm">{item.name}</h4>
                                                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Envío</span>
                                        <span>${shippingCost.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-rose-gold-600">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <LoadingButton
                                    type="submit"
                                    loading={isProcessing}
                                    className="w-full mt-6 bg-rose-gold-600 text-white py-3 rounded-lg hover:bg-rose-gold-700 transition-colors font-semibold"
                                >
                                    Finalizar Compra
                                </LoadingButton>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Al completar tu compra aceptas nuestros términos y condiciones
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
