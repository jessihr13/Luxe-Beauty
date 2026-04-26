'use client';

import { useState } from 'react';
import { useCheckoutStore } from '@/lib/checkout/checkoutStore';
import { PaymentMethod, FormErrors } from '@/lib/checkout/types';
import { validatePaymentInfo, hasErrors } from '@/lib/checkout/validation';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';

export default function PaymentForm() {
    const payment = useCheckoutStore(state => state.payment);
    const setPayment = useCheckoutStore(state => state.setPayment);
    const nextStep = useCheckoutStore(state => state.nextStep);
    const previousStep = useCheckoutStore(state => state.previousStep);

    const [paymentType, setPaymentType] = useState<'card' | 'paypal' | 'bank_transfer'>(
        payment?.type || 'card'
    );
    
    const [cardData, setCardData] = useState({
        cardNumber: payment?.cardDetails?.cardNumber || '',
        cardHolder: payment?.cardDetails?.cardHolder || '',
        expiryDate: payment?.cardDetails?.expiryDate || '',
        cvv: payment?.cardDetails?.cvv || ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleCardChange = (field: string, value: string) => {
        setCardData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const paymentData: Partial<PaymentMethod> = {
            type: paymentType,
            ...(paymentType === 'card' && { cardDetails: cardData })
        };

        const validationErrors = validatePaymentInfo(paymentData);

        if (hasErrors(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        setPayment(paymentData as PaymentMethod);
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Método de Pago</h3>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setPaymentType('card')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                            paymentType === 'card'
                                ? 'border-rose-gold-500 bg-rose-gold-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <CreditCard className={`w-8 h-8 mx-auto mb-2 ${
                            paymentType === 'card' ? 'text-rose-gold-600' : 'text-gray-400'
                        }`} />
                        <p className="text-sm font-medium">Tarjeta</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setPaymentType('paypal')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                            paymentType === 'paypal'
                                ? 'border-rose-gold-500 bg-rose-gold-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <Smartphone className={`w-8 h-8 mx-auto mb-2 ${
                            paymentType === 'paypal' ? 'text-rose-gold-600' : 'text-gray-400'
                        }`} />
                        <p className="text-sm font-medium">PayPal</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setPaymentType('bank_transfer')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                            paymentType === 'bank_transfer'
                                ? 'border-rose-gold-500 bg-rose-gold-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <Building2 className={`w-8 h-8 mx-auto mb-2 ${
                            paymentType === 'bank_transfer' ? 'text-rose-gold-600' : 'text-gray-400'
                        }`} />
                        <p className="text-sm font-medium">Transferencia</p>
                    </button>
                </div>

                {/* Card Details Form */}
                {paymentType === 'card' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Número de Tarjeta <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={cardData.cardNumber}
                                onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                            />
                            {errors.cardNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Nombre del Titular <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={cardData.cardHolder}
                                onChange={(e) => handleCardChange('cardHolder', e.target.value.toUpperCase())}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                    errors.cardHolder ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="JUAN PEREZ"
                            />
                            {errors.cardHolder && (
                                <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Fecha de Expiración <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={cardData.expiryDate}
                                    onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                        errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                />
                                {errors.expiryDate && (
                                    <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    CVV <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={cardData.cvv}
                                    onChange={(e) => handleCardChange('cvv', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                        errors.cvv ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="123"
                                    maxLength={4}
                                />
                                {errors.cvv && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {paymentType === 'paypal' && (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                            Serás redirigido a PayPal para completar tu pago de forma segura.
                        </p>
                    </div>
                )}

                {paymentType === 'bank_transfer' && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Instrucciones de Transferencia:</strong>
                        </p>
                        <p className="text-sm text-gray-600">
                            Recibirás los datos bancarios por email para completar tu transferencia.
                            Tu pedido se procesará una vez confirmado el pago.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={previousStep}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                    Volver
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-rose-gold-400 via-rose-gold-500 to-terracotta-500 text-white font-semibold rounded-lg hover:from-rose-gold-500 hover:via-rose-gold-600 hover:to-terracotta-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    Revisar Pedido
                </button>
            </div>
        </form>
    );
}
