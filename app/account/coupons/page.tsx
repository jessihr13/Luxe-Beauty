// Coupons Page
// app/account/coupons/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useDiscountsStore } from '@/lib/discounts/discountsStore';
import AccountLayout from '@/components/account/AccountLayout';
import { Tag, Copy, Check } from 'lucide-react';
import { useToast } from '@/lib/hooks/useToast';

export default function CouponsPage() {
    const toast = useToast();
    const [mounted, setMounted] = useState(false);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [copiedCode, setCopiedCode] = useState('');

    useEffect(() => {
        useDiscountsStore.persist.rehydrate();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            const discountStore = useDiscountsStore.getState();
            const availableCoupons = discountStore.discounts.filter(d => 
                d.type === 'coupon' && d.isActive
            );
            setCoupons(availableCoupons);
        }
    }, [mounted]);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success('Código copiado');
        setTimeout(() => setCopiedCode(''), 2000);
    };

    if (!mounted) return null;

    return (
        <AccountLayout title="Mis Cupones">
            {coupons.length === 0 ? (
                <div className="card-luxury p-12 text-center">
                    <Tag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No hay cupones disponibles</h3>
                    <p className="text-gray-600">Los cupones aparecerán aquí cuando estén disponibles</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon.id} className="card-luxury p-6 border-2 border-dashed border-rose-gold-300 bg-gradient-to-br from-rose-gold-50 to-white">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-rose-gold-100 rounded-lg">
                                        <Tag className="w-6 h-6 text-rose-gold-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{coupon.name}</h3>
                                        <p className="text-sm text-gray-600">{coupon.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 mb-4">
                                <p className="text-xs text-gray-600 mb-1">Código</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono font-bold text-xl text-rose-gold-700">{coupon.code}</span>
                                    <button
                                        onClick={() => copyCode(coupon.code)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        {copiedCode === coupon.code ? (
                                            <Check className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Descuento</span>
                                    <span className="font-semibold text-rose-gold-600">
                                        {coupon.discountType === 'percentage' 
                                            ? `${coupon.discountValue}%`
                                            : `$${coupon.discountValue}`}
                                    </span>
                                </div>
                                {coupon.minPurchase && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Compra mínima</span>
                                        <span className="font-semibold">${coupon.minPurchase}</span>
                                    </div>
                                )}
                                {coupon.expirationDate && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Válido hasta</span>
                                        <span className="font-semibold">
                                            {new Date(coupon.expirationDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AccountLayout>
    );
}
