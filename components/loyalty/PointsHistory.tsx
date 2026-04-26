'use client';

import { ArrowUp, ArrowDown, ShoppingBag, Gift, Star as StarIcon, Users } from 'lucide-react';
import type { PointTransaction } from '@/lib/loyalty/pointsSystem';

interface PointsHistoryProps {
    transactions: PointTransaction[];
    maxItems?: number;
}

export default function PointsHistory({ transactions, maxItems = 10 }: PointsHistoryProps) {
    const displayTransactions = transactions.slice(0, maxItems);

    const getIcon = (reason: string) => {
        if (reason.includes('Compra')) return ShoppingBag;
        if (reason.includes('Bonus') || reason.includes('cumpleaños')) return Gift;
        if (reason.includes('Reseña') || reason.includes('Referido')) return StarIcon;
        return Users;
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(date));
    };

    return (
        <div className="card-luxury p-6">
            <h3 className="text-xl font-semibold mb-4">Historial de Puntos</h3>

            <div className="space-y-3">
                {displayTransactions.map((transaction) => {
                    const Icon = getIcon(transaction.reason);
                    const isEarn = transaction.type === 'earn';

                    return (
                        <div
                            key={transaction.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {/* Icon */}
                            <div className={`p-2 rounded-full ${isEarn ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                <Icon className={`w-4 h-4 ${isEarn ? 'text-green-600' : 'text-red-600'
                                    }`} />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {transaction.reason}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(transaction.createdAt)}
                                </p>
                            </div>

                            {/* Points */}
                            <div className="flex items-center gap-1">
                                {isEarn ? (
                                    <ArrowUp className="w-4 h-4 text-green-600" />
                                ) : (
                                    <ArrowDown className="w-4 h-4 text-red-600" />
                                )}
                                <span className={`font-bold ${isEarn ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {isEarn ? '+' : '-'}{Math.abs(transaction.points)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {transactions.length > maxItems && (
                <button className="w-full mt-4 text-sm text-rose-gold-600 hover:text-rose-gold-700 font-medium">
                    Ver todo el historial →
                </button>
            )}
        </div>
    );
}
