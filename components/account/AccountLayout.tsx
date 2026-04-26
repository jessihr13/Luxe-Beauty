// Account Layout Component
// components/account/AccountLayout.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCustomerStore } from '@/lib/customer/customerStore';
import {
    LayoutDashboard,
    Package,
    Tag,
    Award,
    MapPin,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';

interface AccountLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function AccountLayout({ children, title }: AccountLayoutProps) {
    const router = useRouter();
    const { email, name, isLoggedIn, logout } = useCustomerStore();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        useCustomerStore.persist.rehydrate();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isLoggedIn()) {
            router.push('/');
        }
    }, [mounted, isLoggedIn, router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!mounted || !isLoggedIn()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-rose-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/account' },
        { icon: Package, label: 'Mis Pedidos', href: '/account/orders' },
        { icon: Tag, label: 'Cupones', href: '/account/coupons' },
        { icon: Award, label: 'Puntos de Lealtad', href: '/account/loyalty' },
        { icon: MapPin, label: 'Direcciones', href: '/account/addresses' },
        { icon: Settings, label: 'Configuración', href: '/account/settings' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-gold-50 via-nude-50 to-white pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-full mb-4 p-4 bg-white rounded-lg shadow-sm flex items-center justify-between"
                        >
                            <span className="font-semibold">Menú</span>
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {/* Sidebar Content */}
                        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block card-luxury p-6 sticky top-24`}>
                            {/* User Info */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="w-16 h-16 bg-gradient-to-br from-rose-gold-400 to-rose-gold-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="font-semibold text-lg">{name}</h3>
                                <p className="text-sm text-gray-600">{email}</p>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-gold-50 transition-colors text-gray-700 hover:text-rose-gold-700"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-gray-700 hover:text-red-600"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="mb-6">
                            <h1 className="text-3xl font-serif font-bold gradient-text">{title}</h1>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
