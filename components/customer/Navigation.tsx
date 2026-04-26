'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { slideInFromLeft } from '@/lib/animations';
import CartButton from '@/components/cart/CartButton';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/productos', label: 'Productos' },
        { href: '/skincare', label: 'Skincare' },
        { href: '/makeup', label: 'Makeup' },
        { href: '/fragancias', label: 'Fragancias' },
    ];

    return (
        <motion.nav
            initial="hidden"
            animate="visible"
            variants={slideInFromLeft}
            className="fixed top-0 left-0 right-0 z-[100] glass-effect"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <h1 className="text-2xl font-serif font-bold gradient-text cursor-pointer">
                            Luxe Beauty
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 dark:text-gray-200 hover:text-rose-gold-600 dark:hover:text-rose-gold-400 transition-colors font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="text-gray-700 dark:text-gray-200 hover:text-rose-gold-600 dark:hover:text-rose-gold-400 transition-colors">
                            <Search className="w-6 h-6" />
                        </button>

                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="text-gray-700 dark:text-gray-200 hover:text-rose-gold-600 dark:hover:text-rose-gold-400 transition-colors text-sm font-medium"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{user?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-700 dark:text-gray-200 hover:text-rose-gold-600 dark:hover:text-rose-gold-400 transition-colors"
                                        title="Cerrar sesión"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="text-gray-700 dark:text-gray-200 hover:text-rose-gold-600 dark:hover:text-rose-gold-400 transition-colors"
                                title="Iniciar sesión"
                            >
                                <User className="w-6 h-6" />
                            </Link>
                        )}

                        <CartButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700 dark:text-gray-200"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden pb-4"
                    >
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-700 hover:text-rose-gold-600 transition-colors font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            href="/admin/dashboard"
                                            className="text-gray-700 hover:text-rose-gold-600 transition-colors font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Panel Admin
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-left text-gray-700 hover:text-rose-gold-600 transition-colors font-medium"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-rose-gold-600 transition-colors font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            <CartDrawer />
        </motion.nav>
    );
}
