// Loyalty Points Page (Placeholder for future)
// app/account/loyalty/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useCustomerStore } from '@/lib/customer/customerStore';
import AccountLayout from '@/components/account/AccountLayout';
import { Award, TrendingUp, Gift, Star } from 'lucide-react';

export default function LoyaltyPage() {
    const { loyaltyPoints, loyaltyTier } = useCustomerStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        useCustomerStore.persist.rehydrate();
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const tierInfo = {
        bronze: { name: 'Bronce', color: 'bg-orange-100 text-orange-700', next: 1000 },
        silver: { name: 'Plata', color: 'bg-gray-100 text-gray-700', next: 5000 },
        gold: { name: 'Oro', color: 'bg-yellow-100 text-yellow-700', next: 10000 },
        platinum: { name: 'Platino', color: 'bg-purple-100 text-purple-700', next: null }
    };

    const currentTier = tierInfo[loyaltyTier];

    return (
        <AccountLayout title="Puntos de Lealtad">
            {/* Current Points */}
            <div className="card-luxury p-8 mb-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center">
                    <Award className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                    <h2 className="text-4xl font-bold mb-2">{loyaltyPoints}</h2>
                    <p className="text-gray-600">Puntos Disponibles</p>
                    <span className={`inline-block mt-4 px-4 py-2 rounded-full font-semibold ${currentTier.color}`}>
                        Nivel {currentTier.name}
                    </span>
                </div>
            </div>

            {/* Progress to Next Tier */}
            {currentTier.next && (
                <div className="card-luxury p-6 mb-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Progreso al Siguiente Nivel
                    </h3>
                    <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                            <span>{loyaltyPoints} puntos</span>
                            <span>{currentTier.next} puntos</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                                style={{ width: `${Math.min((loyaltyPoints / currentTier.next) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Te faltan {currentTier.next - loyaltyPoints} puntos para el siguiente nivel
                    </p>
                </div>
            )}

            {/* How to Earn Points */}
            <div className="card-luxury p-6 mb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Cómo Ganar Puntos
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Por cada $10 de compra</span>
                        <span className="font-bold text-purple-600">+10 puntos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Referir un amigo</span>
                        <span className="font-bold text-purple-600">+100 puntos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Cumpleaños</span>
                        <span className="font-bold text-purple-600">+50 puntos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Reseña de producto</span>
                        <span className="font-bold text-purple-600">+25 puntos</span>
                    </div>
                </div>
            </div>

            {/* Rewards Catalog (Coming Soon) */}
            <div className="card-luxury p-12 text-center bg-gradient-to-br from-rose-gold-50 to-nude-50">
                <Gift className="w-16 h-16 mx-auto mb-4 text-rose-gold-600" />
                <h3 className="text-xl font-semibold mb-2">Catálogo de Recompensas</h3>
                <p className="text-gray-600 mb-4">
                    Próximamente podrás canjear tus puntos por descuentos y productos exclusivos
                </p>
                <span className="inline-block px-6 py-2 bg-rose-gold-600 text-white rounded-lg font-semibold">
                    Próximamente
                </span>
            </div>
        </AccountLayout>
    );
}
