'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { getEmployeeById } from '@/lib/data/employees';
import type { Employee, EmployeeRole } from '@/lib/data/employees';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditEmployeePage() {
    const router = useRouter();
    const params = useParams();
    const { isAdmin, isAuthenticated } = useAuth();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState<Partial<Employee>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
            return;
        }

        const id = params.id as string;
        const foundEmployee = getEmployeeById(id);
        if (foundEmployee) {
            setEmployee(foundEmployee);
            setFormData(foundEmployee);
        } else {
            router.push('/admin/empleados');
        }
    }, [params.id, isAuthenticated, isAdmin, router]);

    const handleChange = (field: keyof Employee, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePermissionChange = (permission: keyof Employee['permissions'], value: boolean) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions!,
                [permission]: value,
            },
        }));
    };

    const handleSave = () => {
        if (!employee) return;

        setSaving(true);
        // updateEmployee(employee.id, formData);

        setTimeout(() => {
            setSaving(false);
            alert('Empleado actualizado (demo)');
            router.push('/admin/empleados');
        }, 500);
    };

    if (!employee) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

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
                                Editar Empleado
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {employee.name}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
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
                                    <span className="text-2xl">👤</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={formData.avatar || ''}
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
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Departamento
                                </label>
                                <input
                                    type="text"
                                    value={formData.department || ''}
                                    onChange={(e) => handleChange('department', e.target.value)}
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
                                    value={formData.role || 'sales'}
                                    onChange={(e) => handleChange('role', e.target.value as EmployeeRole)}
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
                                    value={formData.salary || 0}
                                    onChange={(e) => handleChange('salary', parseFloat(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Estado
                                </label>
                                <select
                                    value={formData.status || 'active'}
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
                                    checked={formData.permissions?.canManageProducts || false}
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
                                    checked={formData.permissions?.canManageOrders || false}
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
                                    checked={formData.permissions?.canViewFinances || false}
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
                                    checked={formData.permissions?.canManageEmployees || false}
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
                                    checked={formData.permissions?.canManageContent || false}
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
                            <strong>Nota:</strong> Los cambios se guardan en memoria y se perderán al recargar el servidor.
                            Para persistencia permanente, necesitas configurar una base de datos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
