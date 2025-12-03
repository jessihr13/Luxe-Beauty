'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import type { EmployeeRole } from '@/lib/data/employees';
import { ArrowLeft, Save, Upload } from 'lucide-react';

export default function NewEmployeePage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'sales' as EmployeeRole,
        salary: 5000,
        department: '',
        status: 'active',
        avatar: '',
        permissions: {
            canManageProducts: false,
            canManageOrders: false,
            canViewFinances: false,
            canManageEmployees: false,
            canManageContent: false,
        },
    });

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePermissionChange = (permission: string, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permission]: value,
            },
        }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.email) {
            alert('Por favor completa los campos obligatorios');
            return;
        }

        setSaving(true);
        // createEmployee(formData);

        setTimeout(() => {
            setSaving(false);
            alert('Empleado creado exitosamente (demo)');
            router.push('/admin/empleados');
        }, 500);
    };

    return (
        <div className="min-h-screen bg-nude-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/empleados"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-serif font-bold gradient-text">
                                Nuevo Empleado
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Agrega un nuevo miembro al equipo
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Guardando...' : 'Crear Empleado'}
                    </button>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Foto de Perfil */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Foto de Perfil
                        </label>
                        <div className="flex items-center gap-4">
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar}
                                    alt="Avatar"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={formData.avatar}
                                    onChange={(e) => handleChange('avatar', e.target.value)}
                                    placeholder="https://i.pravatar.cc/150?img=1"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Usa URLs de pravatar.cc o sube a un servicio como Cloudinary
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información Personal */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="María González"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="maria@luxebeauty.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    placeholder="+52 55 1234 5678"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Departamento
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => handleChange('department', e.target.value)}
                                    placeholder="Ventas"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Información Laboral */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Laboral</h3>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Rol
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => handleChange('role', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                >
                                    <option value="admin">👑 Administrador</option>
                                    <option value="manager">💼 Gerente</option>
                                    <option value="sales">🛍️ Vendedor</option>
                                    <option value="warehouse">📦 Almacén</option>
                                    <option value="marketing">📢 Marketing</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Salario Mensual ($)
                                </label>
                                <input
                                    type="number"
                                    value={formData.salary}
                                    onChange={(e) => handleChange('salary', parseFloat(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Estado
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                >
                                    <option value="active">Activo</option>
                                    <option value="vacation">Vacaciones</option>
                                    <option value="inactive">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Permisos */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permisos del Sistema</h3>

                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.canManageProducts}
                                    onChange={(e) => handlePermissionChange('canManageProducts', e.target.checked)}
                                    className="w-5 h-5 text-rose-gold-600 rounded focus:ring-rose-gold-500"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Gestionar Productos</p>
                                    <p className="text-sm text-gray-600">Crear, editar y eliminar productos</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.canManageOrders}
                                    onChange={(e) => handlePermissionChange('canManageOrders', e.target.checked)}
                                    className="w-5 h-5 text-rose-gold-600 rounded focus:ring-rose-gold-500"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Gestionar Pedidos</p>
                                    <p className="text-sm text-gray-600">Ver y procesar pedidos de clientes</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.canViewFinances}
                                    onChange={(e) => handlePermissionChange('canViewFinances', e.target.checked)}
                                    className="w-5 h-5 text-rose-gold-600 rounded focus:ring-rose-gold-500"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Ver Finanzas</p>
                                    <p className="text-sm text-gray-600">Acceso a reportes financieros y gastos</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.canManageEmployees}
                                    onChange={(e) => handlePermissionChange('canManageEmployees', e.target.checked)}
                                    className="w-5 h-5 text-rose-gold-600 rounded focus:ring-rose-gold-500"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Gestionar Empleados</p>
                                    <p className="text-sm text-gray-600">Crear, editar y eliminar empleados</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.canManageContent}
                                    onChange={(e) => handlePermissionChange('canManageContent', e.target.checked)}
                                    className="w-5 h-5 text-rose-gold-600 rounded focus:ring-rose-gold-500"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Gestionar Contenido</p>
                                    <p className="text-sm text-gray-600">Editar contenido del sitio web</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Nota Informativa */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Nota:</strong> Los datos se guardan en memoria. Para persistencia permanente, configura una base de datos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
