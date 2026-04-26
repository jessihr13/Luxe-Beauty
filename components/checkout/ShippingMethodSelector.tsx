// Shipping Method Selector Component
// components/checkout/ShippingMethodSelector.tsx

'use client';

import { useState, useEffect } from 'react';
import { Truck, Clock, Zap } from 'lucide-react';
import { ShippingService, ShippingRate } from '@/lib/services/shippingService';
import { ShippingProvider, integrationInfo } from '@/lib/integrations/integrationTypes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ShippingMethodSelectorProps {
    selectedMethod: ShippingProvider | null;
    onSelect: (method: ShippingProvider, cost: number) => void;
    destination: any;
}

export default function ShippingMethodSelector({ selectedMethod, onSelect, destination }: ShippingMethodSelectorProps) {
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadShippingRates();
    }, [destination]);

    const loadShippingRates = async () => {
        setLoading(true);
        try {
            const origin = { city: 'Ciudad de México', state: 'CDMX', zipCode: '01000' };
            const packageInfo = { weight: 1, dimensions: { length: 10, width: 10, height: 10 } };
            
            const calculatedRates = await ShippingService.calculateShippingRates(
                origin,
                destination,
                packageInfo
            );
            
            setRates(calculatedRates);
            
            // Auto-select cheapest if none selected
            if (!selectedMethod && calculatedRates.length > 0) {
                onSelect(calculatedRates[0].provider, calculatedRates[0].cost);
            }
        } catch (error) {
            console.error('Error loading shipping rates:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (estimatedDays: number) => {
        if (estimatedDays === 0) return <Zap className="w-6 h-6 text-orange-500" />;
        if (estimatedDays <= 2) return <Clock className="w-6 h-6 text-blue-500" />;
        return <Truck className="w-6 h-6 text-gray-500" />;
    };

    const getDeliveryText = (estimatedDays: number) => {
        if (estimatedDays === 0) return 'Entrega el mismo día';
        if (estimatedDays === 1) return 'Entrega mañana';
        return `Entrega en ${estimatedDays} días`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="large" />
                <span className="ml-3 text-gray-600">Calculando costos de envío...</span>
            </div>
        );
    }

    if (rates.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                    No hay métodos de envío disponibles para tu ubicación.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-3">Método de Envío</h3>
            
            {rates.map((rate) => {
                const info = integrationInfo[rate.provider];
                const isSelected = selectedMethod === rate.provider;

                return (
                    <button
                        key={rate.provider}
                        onClick={() => onSelect(rate.provider, rate.cost)}
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
                                {getIcon(rate.estimatedDays)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">{info.icon}</span>
                                    <h4 className="font-semibold">{rate.providerName}</h4>
                                </div>
                                <p className="text-sm text-gray-600">{getDeliveryText(rate.estimatedDays)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-rose-gold-600">
                                    ${rate.cost.toFixed(2)}
                                </p>
                                {rate === rates[0] && (
                                    <span className="text-xs text-green-600 font-medium">Más económico</span>
                                )}
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
