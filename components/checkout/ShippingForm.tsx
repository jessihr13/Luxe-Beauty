'use client';

import { useState } from 'react';
import { useCheckoutStore } from '@/lib/checkout/checkoutStore';
import { ShippingInfo, FormErrors } from '@/lib/checkout/types';
import { validateShippingInfo, hasErrors } from '@/lib/checkout/validation';

export default function ShippingForm() {
    const shipping = useCheckoutStore(state => state.shipping);
    const setShipping = useCheckoutStore(state => state.setShipping);
    const nextStep = useCheckoutStore(state => state.nextStep);

    const [formData, setFormData] = useState<Partial<ShippingInfo>>(shipping || {
        fullName: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'México'
        },
        deliveryInstructions: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (field: string, value: string) => {
        if (field.startsWith('address.')) {
            const addressField = field.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address!,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        // Clear error for this field
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationErrors = validateShippingInfo(formData);
        
        if (hasErrors(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        setShipping(formData as ShippingInfo);
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Nombre Completo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.fullName || ''}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                errors.fullName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Juan Pérez"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="juan@ejemplo.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="5512345678"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Dirección de Envío</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Calle y Número <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.address?.street || ''}
                            onChange={(e) => handleChange('address.street', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                errors.street ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Av. Reforma 123, Col. Centro"
                        />
                        {errors.street && (
                            <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Ciudad <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.address?.city || ''}
                                onChange={(e) => handleChange('address.city', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                    errors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Ciudad de México"
                            />
                            {errors.city && (
                                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Estado <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.address?.state || ''}
                                onChange={(e) => handleChange('address.state', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                    errors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="CDMX"
                            />
                            {errors.state && (
                                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Código Postal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.address?.zipCode || ''}
                                onChange={(e) => handleChange('address.zipCode', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent ${
                                    errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="06000"
                            />
                            {errors.zipCode && (
                                <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Instrucciones de Entrega (Opcional)
                        </label>
                        <textarea
                            value={formData.deliveryInstructions || ''}
                            onChange={(e) => handleChange('deliveryInstructions', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            rows={3}
                            placeholder="Ej: Tocar el timbre, dejar con el portero, etc."
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-rose-gold-400 via-rose-gold-500 to-terracotta-500 text-white font-semibold rounded-lg hover:from-rose-gold-500 hover:via-rose-gold-600 hover:to-terracotta-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
                Continuar al Pago
            </button>
        </form>
    );
}
