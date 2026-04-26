'use client';

import { Check } from 'lucide-react';
import { CheckoutStep } from '@/lib/checkout/types';

interface CheckoutProgressProps {
    currentStep: CheckoutStep;
}

const steps = [
    { number: 1, title: 'Envío', description: 'Información de entrega' },
    { number: 2, title: 'Pago', description: 'Método de pago' },
    { number: 3, title: 'Revisión', description: 'Confirmar pedido' }
];

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
    return (
        <div className="w-full py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                        <div
                            className="h-full bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 transition-all duration-500"
                            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                        />
                    </div>

                    {steps.map((step) => {
                        const isCompleted = currentStep > step.number;
                        const isCurrent = currentStep === step.number;
                        
                        return (
                            <div key={step.number} className="flex flex-col items-center relative">
                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                                        isCompleted
                                            ? 'bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white'
                                            : isCurrent
                                            ? 'bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white ring-4 ring-rose-gold-100'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        step.number
                                    )}
                                </div>

                                {/* Labels */}
                                <div className="mt-3 text-center">
                                    <p className={`text-sm font-semibold ${isCurrent ? 'text-rose-gold-700' : 'text-gray-600'}`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-500 hidden sm:block">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
