'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { ShoppingCart, LogOut } from 'lucide-react';
import ThemeSelector from '@/components/dashboard/ThemeSelector';

export default function AdminHeader() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-20 transition-colors duration-300 border-b">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-serif font-bold gradient-text">
                            Luxe Beauty Admin
                        </h1>
                        <p className="text-sm text-gray-600">
                            Bienvenido, {user?.name}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeSelector />

                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden md:inline">Ver Tienda</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-gold-600 text-white rounded-full hover:opacity-90 transition-opacity"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden md:inline">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
