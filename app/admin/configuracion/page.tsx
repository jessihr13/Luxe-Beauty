'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Bell, Shield, Palette, Database, Settings } from 'lucide-react';

export default function ConfiguracionPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    const settingsOptions = [
        {
            title: 'Notificaciones',
            description: 'Configura alertas de email, stock bajo y metas de ventas',
            icon: Bell,
            href: '/admin/configuracion/notificaciones',
            color: 'rose-gold',
            bgColor: 'bg-rose-gold-50',
            iconColor: 'text-rose-gold-600',
            disabled: false,
        },
        {
            title: 'Seguridad',
            description: 'Gestiona contraseñas, 2FA y sesiones activas',
            icon: Shield,
            href: '/admin/configuracion/seguridad',
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            disabled: true,
        },
        {
            title: 'Apariencia',
            description: 'Personaliza el tema, colores y layout del dashboard',
            icon: Palette,
            href: '/admin/configuracion/apariencia',
            color: 'purple',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            disabled: true,
        },
        {
            title: 'Base de Datos',
            description: 'Copias de seguridad y mantenimiento del sistema',
            icon: Database,
            href: '/admin/configuracion/sistema',
            color: 'green',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            disabled: true,
        },
    ];

    return (
        <div className="min-h-screen bg-nude-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-serif font-bold gradient-text">
                                Configuración
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Administra las preferencias generales del sistema
                            </p>
                        </div>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {settingsOptions.map((option) => {
                        const Icon = option.icon;

                        if (option.disabled) {
                            return (
                                <div
                                    key={option.title}
                                    className="card-luxury p-6 opacity-50 cursor-not-allowed"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 ${option.bgColor} rounded-lg flex items-center justify-center`}>
                                            <Icon className={`w-6 h-6 ${option.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                                            <p className="text-gray-600 mb-4">{option.description}</p>
                                            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                                                Próximamente
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={option.title}
                                href={option.href}
                                className="card-luxury p-6 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 ${option.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-6 h-6 ${option.iconColor}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-rose-gold-600 transition-colors">
                                            {option.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">{option.description}</p>
                                        <span className="text-rose-gold-600 font-medium group-hover:underline">
                                            Configurar →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-8 card-luxury p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-600" />
                        Información del Sistema
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                        <div>
                            <p className="mb-2"><strong>Versión:</strong> 1.0.0 (Beta)</p>
                            <p className="mb-2"><strong>Entorno:</strong> {process.env.NODE_ENV === 'development' ? 'Desarrollo' : 'Producción'}</p>
                            <p className="mb-2"><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="mb-2"><strong>Estado del Sistema:</strong> <span className="text-green-600 font-semibold">Operativo</span></p>
                            <p className="mb-2"><strong>Base de Datos:</strong> Conectada</p>
                            <p className="mb-2"><strong>Servicio de Email:</strong> {process.env.NODE_ENV === 'development' ? 'Mock Mode' : 'Resend API'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
