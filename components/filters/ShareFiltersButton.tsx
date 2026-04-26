'use client';

import { Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareFiltersButtonProps {
    onShare: () => Promise<{ success: boolean; message: string }>;
    className?: string;
}

export default function ShareFiltersButton({ onShare, className = '' }: ShareFiltersButtonProps) {
    const [copied, setCopied] = useState(false);
    const [message, setMessage] = useState('');

    const handleShare = async () => {
        const result = await onShare();
        setMessage(result.message);

        if (result.success) {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setMessage('');
            }, 3000);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
                title="Copiar enlace con filtros"
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">¡Copiado!</span>
                    </>
                ) : (
                    <>
                        <Link2 className="w-4 h-4" />
                        <span className="text-sm">Compartir filtros</span>
                    </>
                )}
            </button>

            {message && !copied && (
                <div className="absolute top-full mt-2 right-0 bg-red-100 text-red-700 text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    {message}
                </div>
            )}
        </div>
    );
}
