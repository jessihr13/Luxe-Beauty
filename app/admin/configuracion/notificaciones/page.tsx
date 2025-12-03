'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { ArrowLeft, Mail, Bell, Package, TrendingUp, Save } from 'lucide-react';
import Link from 'next/link';

export default function NotificationSettingsPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();

    const [settings, setSettings] = useState({
        orderNotifications: true,
        stockNotifications: true,
        goalNotifications: true,
        statusNotifications: true,
        adminEmail: 'admin@luxebeauty.com',
        stockThreshold: 10,
        dailySalesGoal: 5000,
        weeklySalesGoal: 30000,
        monthlySalesGoal: 120000,
    });

    const [saved, setSaved] = useState(false);

    // Hooks deben ir antes de cualquier return condicional
    useEffect(() => {
        // Cargar configuración guardada
        const saved = localStorage.getItem('notificationSettings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        // En producción, guardar en base de datos
        console.log('Guardando configuración:', settings);
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-nude-50 p-8">
            <div className="max-w-4xl mx-auto">
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
                                Configuración de Notificaciones
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Gestiona tus preferencias de notificaciones por email
                            </p>
                        </div>
                    </div>
                </div>

                {/* Email Configuration */}
                <div className="card-luxury p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Mail className="w-5 h-5 text-rose-gold-600" />
                        <h2 className="text-xl font-semibold">Configuración de Email</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email del Administrador
                            </label>
                            <input
                                type="email"
                                value={settings.adminEmail}
                                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                placeholder="admin@luxebeauty.com"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Este email recibirá todas las notificaciones administrativas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notification Types */}
                <div className="card-luxury p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-5 h-5 text-rose-gold-600" />
                        <h2 className="text-xl font-semibold">Tipos de Notificaciones</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Notificaciones de Pedidos</p>
                                <p className="text-sm text-gray-600">Recibir alertas cuando se creen nuevos pedidos</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.orderNotifications}
                                    onChange={(e) => setSettings({ ...settings, orderNotifications: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-gold-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Alertas de Stock Bajo</p>
                                <p className="text-sm text-gray-600">Notificar cuando el inventario esté bajo</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.stockNotifications}
                                    onChange={(e) => setSettings({ ...settings, stockNotifications: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-gold-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Metas Alcanzadas</p>
                                <p className="text-sm text-gray-600">Celebrar cuando se alcancen objetivos de ventas</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.goalNotifications}
                                    onChange={(e) => setSettings({ ...settings, goalNotifications: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-gold-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Actualizaciones de Estado</p>
                                <p className="text-sm text-gray-600">Notificar a clientes sobre cambios en sus pedidos</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.statusNotifications}
                                    onChange={(e) => setSettings({ ...settings, statusNotifications: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-gold-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Thresholds */}
                <div className="card-luxury p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Package className="w-5 h-5 text-rose-gold-600" />
                        <h2 className="text-xl font-semibold">Umbrales de Inventario</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Bajo (unidades)
                        </label>
                        <input
                            type="number"
                            value={settings.stockThreshold}
                            onChange={(e) => setSettings({ ...settings, stockThreshold: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            min="1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enviar alerta cuando el stock esté por debajo de este número
                        </p>
                    </div>
                </div>

                {/* Sales Goals */}
                <div className="card-luxury p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-5 h-5 text-rose-gold-600" />
                        <h2 className="text-xl font-semibold">Metas de Ventas</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Diaria ($)
                            </label>
                            <input
                                type="number"
                                value={settings.dailySalesGoal}
                                onChange={(e) => setSettings({ ...settings, dailySalesGoal: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Semanal ($)
                            </label>
                            <input
                                type="number"
                                value={settings.weeklySalesGoal}
                                onChange={(e) => setSettings({ ...settings, weeklySalesGoal: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Mensual ($)
                            </label>
                            <input
                                type="number"
                                value={settings.monthlySalesGoal}
                                onChange={(e) => setSettings({ ...settings, monthlySalesGoal: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Los cambios se guardarán en tu navegador
                    </p>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-rose-gold-600 text-white rounded-lg hover:bg-rose-gold-700 transition-colors font-semibold"
                    >
                        <Save className="w-5 h-5" />
                        {saved ? '✓ Guardado' : 'Guardar Cambios'}
                    </button>
                </div>

                {/* Info Box */}
                <div className="mt-6 card-luxury p-6 bg-blue-50 border-l-4 border-blue-500">
                    <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Modo Demo</h3>
                    <p className="text-sm text-blue-800">
                        Actualmente en modo demo. Los emails se simulan en la consola del navegador.
                        Para activar envío real, configura tu API key de Resend en las variables de entorno.
                    </p>
                </div>
            </div>
        </div>
    );
}
