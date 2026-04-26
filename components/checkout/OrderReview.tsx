'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/lib/checkout/checkoutStore';
import { useCartStore } from '@/lib/cart/cartStore';
import { useOrdersStore } from '@/lib/orders/ordersStore';
import Image from 'next/image';
import { Package, CreditCard, MapPin, Check } from 'lucide-react';

export default function OrderReview() {
    const router = useRouter();
    const shipping = useCheckoutStore(state => state.shipping);
    const payment = useCheckoutStore(state => state.payment);
    const previousStep = useCheckoutStore(state => state.previousStep);
    const acceptedTerms = useCheckoutStore(state => state.acceptedTerms);
    const setAcceptedTerms = useCheckoutStore(state => state.setAcceptedTerms);
    
    const items = useCartStore(state => state.items);
    const getTotalPrice = useCartStore(state => state.getTotalPrice);
    
    const addOrder = useOrdersStore(state => state.addOrder);

    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = getTotalPrice();
    const shippingCost = subtotal > 500 ? 0 : 99;
    const total = subtotal + shippingCost;

    const handlePlaceOrder = async () => {
        if (!acceptedTerms) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        if (!shipping || !payment) {
            alert('Información incompleta');
            return;
        }

        setIsProcessing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Save order to store
        const orderNumber = addOrder({
            items: items.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            customer: {
                name: shipping.fullName,
                email: shipping.email,
                phone: shipping.phone
            },
            shipping: {
                address: shipping.address.street,
                city: shipping.address.city,
                state: shipping.address.state,
                zipCode: shipping.address.zipCode,
                instructions: shipping.deliveryInstructions
            },
            payment: {
                method: payment.type,
                lastFourDigits: payment.type === 'card' && payment.cardDetails 
                    ? payment.cardDetails.cardNumber.slice(-4)
                    : undefined
            },
            subtotal,
            shippingCost,
            total,
            status: 'pending'
        });

        console.log('🎉 Order created:', orderNumber);

        // Navigate to success page with order number
        router.push(`/checkout/success?order=${orderNumber}`);
    };

    if (!shipping || !payment) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-rose-gold-600" />
                    <h3 className="text-lg font-semibold">Productos ({items.length})</h3>
                </div>

                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-3 border-b last:border-0">
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                <p className="text-sm font-semibold text-rose-gold-700">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-rose-gold-600" />
                    <h3 className="text-lg font-semibold">Información de Envío</h3>
                </div>

                <div className="space-y-2 text-sm">
                    <p><strong>Nombre:</strong> {shipping.fullName}</p>
                    <p><strong>Email:</strong> {shipping.email}</p>
                    <p><strong>Teléfono:</strong> {shipping.phone}</p>
                    <p><strong>Dirección:</strong> {shipping.address.street}</p>
                    <p>
                        {shipping.address.city}, {shipping.address.state} {shipping.address.zipCode}
                    </p>
                    {shipping.deliveryInstructions && (
                        <p className="text-gray-600">
                            <strong>Instrucciones:</strong> {shipping.deliveryInstructions}
                        </p>
                    )}
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-rose-gold-600" />
                    <h3 className="text-lg font-semibold">Método de Pago</h3>
                </div>

                <div className="text-sm">
                    {payment.type === 'card' && payment.cardDetails && (
                        <div>
                            <p><strong>Tarjeta:</strong> **** **** **** {payment.cardDetails.cardNumber.slice(-4)}</p>
                            <p><strong>Titular:</strong> {payment.cardDetails.cardHolder}</p>
                        </div>
                    )}
                    {payment.type === 'paypal' && <p><strong>PayPal</strong></p>}
                    {payment.type === 'bank_transfer' && <p><strong>Transferencia Bancaria</strong></p>}
                </div>
            </div>

            {/* Order Total */}
            <div className="bg-gradient-to-r from-rose-gold-50 to-nude-50 rounded-xl p-6">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Envío</span>
                        <span className="font-semibold">
                            {shippingCost === 0 ? (
                                <span className="text-green-600">¡Gratis!</span>
                            ) : (
                                `$${shippingCost.toFixed(2)}`
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                        <span>Total</span>
                        <span className="text-rose-gold-700">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 text-rose-gold-600 rounded focus:ring-rose-gold-500"
                    />
                    <span className="text-sm text-gray-700">
                        Acepto los{' '}
                        <a href="/terminos" className="text-rose-gold-600 hover:underline">
                            términos y condiciones
                        </a>{' '}
                        y la{' '}
                        <a href="/privacidad" className="text-rose-gold-600 hover:underline">
                            política de privacidad
                        </a>
                    </span>
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={previousStep}
                    disabled={isProcessing}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                    Volver
                </button>
                <button
                    onClick={handlePlaceOrder}
                    disabled={!acceptedTerms || isProcessing}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-rose-gold-400 via-rose-gold-500 to-terracotta-500 text-white font-semibold rounded-lg hover:from-rose-gold-500 hover:via-rose-gold-600 hover:to-terracotta-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            Confirmar Pedido
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
