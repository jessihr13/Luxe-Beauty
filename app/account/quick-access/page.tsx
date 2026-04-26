// Quick Access Page - For testing customer dashboard as admin
// app/account/quick-access/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerStore } from '@/lib/customer/customerStore';
import { useToast } from '@/lib/hooks/useToast';

export default function QuickAccessPage() {
    const router = useRouter();
    const toast = useToast();
    const { setCustomer } = useCustomerStore();
    const [email, setEmail] = useState('admin@test.com');
    const [name, setName] = useState('Admin Test');
    const [phone, setPhone] = useState('5512345678');

    const handleQuickLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        setCustomer(email, name, phone);
        toast.success('Sesión iniciada');
        
        setTimeout(() => {
            router.push('/account');
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-gold-50 via-nude-50 to-white flex items-center justify-center p-4">
            <div className="card-luxury p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-2 gradient-text">Acceso Rápido</h1>
                <p className="text-gray-600 mb-6 text-sm">
                    Para probar el panel de cliente (solo para desarrollo)
                </p>

                <form onSubmit={handleQuickLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full btn-primary">
                        Acceder al Panel
                    </button>
                </form>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                        <strong>Nota:</strong> Esta página es solo para desarrollo. 
                        En producción, los clientes accederán automáticamente después de hacer una compra.
                    </p>
                </div>
            </div>
        </div>
    );
}
