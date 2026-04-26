'use client';

import Navigation from '@/components/customer/Navigation';
import PointsBalance from '@/components/loyalty/PointsBalance';
import TierProgress from '@/components/loyalty/TierProgress';
import PointsHistory from '@/components/loyalty/PointsHistory';
import { mockLoyaltyAccount } from '@/lib/loyalty/mockLoyaltyData';
import { Gift, Star, TrendingUp, Users } from 'lucide-react';

export default function LoyaltyDemoPage() {
    const account = mockLoyaltyAccount;

    return (
        <main className="min-h-screen bg-nude-50">
            <Navigation />

            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-serif font-bold gradient-text mb-4">
                            Programa de Lealtad
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Gana puntos con cada compra y disfruta de beneficios exclusivos
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Points Balance */}
                        <div className="lg:col-span-1">
                            <PointsBalance
                                availablePoints={account.availablePoints}
                                tier={account.tier}
                            />
                        </div>

                        {/* Tier Progress */}
                        <div className="lg:col-span-2 card-luxury p-6">
                            <h2 className="text-2xl font-semibold mb-6">Tu Progreso VIP</h2>
                            <TierProgress totalPoints={account.totalPoints} />
                        </div>
                    </div>

                    {/* How to Earn Points */}
                    <div className="card-luxury p-8 mb-12">
                        <h2 className="text-2xl font-semibold mb-6 text-center">
                            ¿Cómo Ganar Puntos?
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Gift className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Compras</h3>
                                <p className="text-sm text-gray-600">
                                    1 punto por cada $10 MXN
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Star className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Reseñas</h3>
                                <p className="text-sm text-gray-600">
                                    50 puntos por reseña con foto
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Referidos</h3>
                                <p className="text-sm text-gray-600">
                                    300 puntos por amigo referido
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-rose-gold-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <TrendingUp className="w-8 h-8 text-rose-gold-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Cumpleaños</h3>
                                <p className="text-sm text-gray-600">
                                    200 puntos de regalo
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Points History */}
                    <PointsHistory transactions={account.history} maxItems={8} />
                </div>
            </div>
        </main>
    );
}
