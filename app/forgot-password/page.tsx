'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSent(true);
            } else {
                setError(data.error || 'Error al enviar el correo');
            }
        } catch (err) {
            setError('Error al enviar el correo');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nude-50 via-white to-rose-gold-50 p-4">
                <div className="card-luxury max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold mb-4">Correo Enviado</h2>
                    <p className="text-gray-600 mb-6">
                        Si existe una cuenta con el email <strong>{email}</strong>, recibirás un correo con instrucciones para restablecer tu contraseña.
                    </p>
                    <Link href="/login" className="btn-primary inline-block">
                        Volver al Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nude-50 via-white to-rose-gold-50 p-4">
            <div className="card-luxury max-w-md w-full p-8">
                {/* Header */}
                <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Link>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-rose-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-rose-gold-600" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold gradient-text mb-2">
                        ¿Olvidaste tu Contraseña?
                    </h1>
                    <p className="text-gray-600">
                        Ingresa tu email y te enviaremos instrucciones para restablecerla
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent transition-all"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                    </button>
                </form>
            </div>
        </div>
    );
}
