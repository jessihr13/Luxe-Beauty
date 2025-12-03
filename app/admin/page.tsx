'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

export default function AdminPage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated || !isAdmin) {
                // Si no está autenticado o no es admin, redirect a login
                router.push('/login');
            } else {
                // Si está autenticado y es admin, redirect a dashboard
                router.push('/admin/dashboard');
            }
        }
    }, [isAuthenticated, isAdmin, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nude-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-nude-50">
            <p className="text-gray-600">Redirigiendo...</p>
        </div>
    );
}
