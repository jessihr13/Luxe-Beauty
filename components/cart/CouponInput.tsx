// Coupon Input Component
// components/cart/CouponInput.tsx

'use client';

import { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';

interface CouponInputProps {
    onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
    appliedCoupons: string[];
    onRemoveCoupon: (code: string) => void;
}

export function CouponInput({ onApplyCoupon, appliedCoupons, onRemoveCoupon }: CouponInputProps) {
    const [code, setCode] = useState('');
    const [applying, setApplying] = useState(false);
    const toast = useToast();

    const handleApply = async () => {
        if (!code.trim()) return;

        setApplying(true);
        const result = await onApplyCoupon(code.trim().toUpperCase());
        
        if (result.success) {
            toast.success(result.message);
            setCode('');
        } else {
            toast.error(result.message);
        }
        
        setApplying(false);
    };

    return (
        <div className="space-y-3">
            {/* Input */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleApply()}
                        placeholder="Código de cupón"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent uppercase"
                        disabled={applying}
                    />
                </div>
                <LoadingButton
                    onClick={handleApply}
                    loading={applying}
                    disabled={!code.trim()}
                    className="btn-primary px-6"
                >
                    Aplicar
                </LoadingButton>
            </div>

            {/* Applied Coupons */}
            {appliedCoupons.length > 0 && (
                <div className="space-y-2">
                    {appliedCoupons.map((coupon) => (
                        <div
                            key={coupon}
                            className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-2"
                        >
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-900">
                                    {coupon}
                                </span>
                            </div>
                            <button
                                onClick={() => onRemoveCoupon(coupon)}
                                className="text-green-600 hover:text-green-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
