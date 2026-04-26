// Payment Method Selector Component
// components/checkout/PaymentMethodSelector.tsx

'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Building2, Store } from 'lucide-react';
import { PaymentService } from '@/lib/services/paymentService';
import { PaymentProvider, integrationInfo } from '@/lib/integrations/integrationTypes';

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentProvider | null;
    onSelect: (method: PaymentProvider) => void;
}

export default function PaymentMethodSelector({ selectedMethod, onSelect }: PaymentMethodSelectorProps) {
    const [availableMethods, setAvailableMethods] = useState<any[]>([]);

    useEffect(() => {
        const methods = PaymentService.getAvailablePaymentMethods();
        setAvailableMethods(methods);
    }, []);

    const getIcon = (provider: PaymentProvider) => {
        switch (provider) {
            case 'stripe':
            case 'conekta':
                return <CreditCard className="w-6 h-6" />;
            case 'paypal':
            case 'mercadopago':
                return <Wallet className="w-6 h-6" />;
            case 'oxxo':
                return <Store className="w-6 h-6" />;
            default:
                return <Building2 className="w-6 h-6" />;
        }
    };

    if (availableMethods.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                    No hay métodos de pago disponibles. Por favor contacta al administrador.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-3">Método de Pago</h3>
            
            {availableMethods.map((method) => {
                const info = integrationInfo[method.provider];
                const isSelected = selectedMethod === method.provider;

                return (
                    <button
                        key={method.id}
                        onClick={() => onSelect(method.provider as PaymentProvider)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected
                                ? 'border-rose-gold-500 bg-rose-gold-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${
                                isSelected ? 'bg-rose-gold-100' : 'bg-gray-100'
                            }`}>
                                {getIcon(method.provider as PaymentProvider)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{info.icon}</span>
                                    <h4 className="font-semibold">{info.name}</h4>
                                </div>
                                <p className="text-sm text-gray-600">{info.description}</p>
                            </div>
                            {isSelected && (
                                <div className="w-6 h-6 bg-rose-gold-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
