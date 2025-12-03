'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // Pequeño delay para asegurar que localStorage se actualice
            setTimeout(() => {
                // Redirect basado en rol
                const storedUser = localStorage.getItem('luxe_user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    if (user.role === 'admin') {
                        // Usar window.location para forzar recarga completa
                        window.location.href = '/admin/dashboard';
                    } else {
                        window.location.href = '/';
                    }
                }
            }, 100);
        } else {
            setError(result.error || 'Error al iniciar sesión');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nude-50 via-rose-gold-50 to-nude-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8 relative">
                        <Link
                            href="/"
                            className="absolute left-0 top-0 text-gray-400 hover:text-rose-gold-600 transition-colors"
                            title="Volver a la tienda"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </Link>
                        <h1 className="text-3xl font-serif font-bold gradient-text mb-2">
                            Luxe Beauty
                        </h1>
                        <p className="text-gray-600">Inicia sesión en tu cuenta</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogIn className="w-5 h-5" />
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-rose-gold-600 hover:text-rose-gold-700 font-medium"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link href="/registro" className="text-rose-gold-600 hover:text-rose-gold-700 font-medium">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2 font-medium">Credenciales de prueba:</p>
                        <p className="text-xs text-gray-500">Admin: admin@luxebeauty.com / admin123</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
