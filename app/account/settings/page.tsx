// Account Settings Page
// app/account/settings/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useCustomerStore } from '@/lib/customer/customerStore';
import AccountLayout from '@/components/account/AccountLayout';
import { User, Mail, Phone, Lock, Bell, CreditCard } from 'lucide-react';
import { useToast } from '@/lib/hooks/useToast';
import { LoadingButton } from '@/components/ui/LoadingSpinner';

export default function SettingsPage() {
    const toast = useToast();
    const { email, name, phone, updateProfile } = useCustomerStore();
    const [mounted, setMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: true,
        newsletter: false
    });

    useEffect(() => {
        useCustomerStore.persist.rehydrate();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            setFormData({
                name: name || '',
                email: email || '',
                phone: phone || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [mounted, name, email, phone]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            updateProfile({
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            });

            toast.success('Perfil actualizado correctamente');
        } catch (error) {
            toast.error('Error al actualizar perfil');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // TODO: Implement password change when auth is added
        toast.info('Función de cambio de contraseña próximamente');
    };

    if (!mounted) return null;

    return (
        <AccountLayout title="Configuración">
            <div className="space-y-6">
                {/* Personal Information */}
                <div className="card-luxury p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="w-6 h-6 text-rose-gold-600" />
                        <h2 className="text-xl font-bold">Información Personal</h2>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <LoadingButton
                            type="submit"
                            loading={isSaving}
                            className="btn-primary"
                        >
                            Guardar Cambios
                        </LoadingButton>
                    </form>
                </div>

                {/* Security */}
                <div className="card-luxury p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-6 h-6 text-rose-gold-600" />
                        <h2 className="text-xl font-bold">Seguridad</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña Actual
                            </label>
                            <input
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="btn-secondary">
                            Cambiar Contraseña
                        </button>
                    </form>
                </div>

                {/* Notifications */}
                <div className="card-luxury p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-6 h-6 text-rose-gold-600" />
                        <h2 className="text-xl font-bold">Notificaciones</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-semibold">Actualizaciones de Pedidos</h4>
                                <p className="text-sm text-gray-600">Recibe emails sobre el estado de tus pedidos</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications.orderUpdates}
                                    onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-gold-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-semibold">Promociones y Ofertas</h4>
                                <p className="text-sm text-gray-600">Recibe cupones y descuentos exclusivos</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications.promotions}
                                    onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-gold-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-semibold">Newsletter</h4>
                                <p className="text-sm text-gray-600">Tips de belleza y novedades</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications.newsletter}
                                    onChange={(e) => setNotifications({ ...notifications, newsletter: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-gold-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Payment Methods (Placeholder) */}
                <div className="card-luxury p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="w-6 h-6 text-rose-gold-600" />
                        <h2 className="text-xl font-bold">Métodos de Pago Guardados</h2>
                    </div>

                    <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-600 mb-4">No tienes métodos de pago guardados</p>
                        <button
                            onClick={() => toast.info('Función próximamente')}
                            className="btn-secondary"
                        >
                            Agregar Tarjeta
                        </button>
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
}
