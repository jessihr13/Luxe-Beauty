'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Filter,
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    DollarSign
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useEmployeesStore, roleInfo, type EmployeeRole } from '@/lib/employees/employeesStore';
import { useToast } from '@/lib/hooks/useToast';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { SearchInput } from '@/components/ui/SearchInput';
import { fadeIn, staggerContainer } from '@/lib/animations';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function EmployeesPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [selectedRole, setSelectedRole] = useState<EmployeeRole | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const getAllEmployees = useEmployeesStore(state => state.getAllEmployees);
    const getActiveEmployees = useEmployeesStore(state => state.getActiveEmployees);
    const deleteEmployee = useEmployeesStore(state => state.deleteEmployee);

    const employees = getAllEmployees();
    const activeEmployees = getActiveEmployees();

    useEffect(() => {
        setMounted(true);
        useEmployeesStore.persist.rehydrate();
    }, []);

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    if (!mounted) {
        return (
            <AdminPageLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold-600"></div>
                </div>
            </AdminPageLayout>
        );
    }

    // Filter employees
    const filteredEmployees = employees.filter(employee => {
        const matchesRole = selectedRole === 'all' || employee.role === selectedRole;
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesSearch;
    });

    // Calculate metrics
    const totalSalaries = employees.reduce((sum, e) => sum + e.salary, 0);

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este empleado?')) {
            deleteEmployee(id);
        }
    };

    return (
        <AdminPageLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-serif font-bold gradient-text">
                            Gestión de Empleados
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Administra tu equipo de trabajo
                        </p>
                    </div>

                    <Link
                        href="/admin/empleados/nuevo"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Empleado
                    </Link>
                </div>

                {/* Summary Cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid md:grid-cols-4 gap-6 mb-8"
                >
                    {/* Total Employees */}
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-500">Total</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {employees.length}
                        </h3>
                        <p className="text-sm text-gray-600">Empleados</p>
                    </div>

                    {/* Active */}
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-500">Activos</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {activeEmployees.length}
                        </h3>
                        <p className="text-sm text-gray-600">En servicio</p>
                    </div>

                    {/* Total Salaries */}
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-sm text-gray-500">Nómina</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            ${totalSalaries.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600">Total mensual</p>
                    </div>

                    {/* Avg Salary */}
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-orange-600" />
                            </div>
                            <span className="text-sm text-gray-500">Promedio</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            ${(totalSalaries / employees.length).toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600">Salario promedio</p>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="card-luxury p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-700">Filtrar:</span>
                        </div>

                        {/* Role Filter */}
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as EmployeeRole | 'all')}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        >
                            <option value="all">Todos los roles</option>
                            {Object.entries(roleInfo).map(([key, info]) => (
                                <option key={key} value={key}>
                                    {info.icon} {info.name}
                                </option>
                            ))}
                        </select>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Employees Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployees.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No se encontraron empleados
                        </div>
                    ) : (
                        filteredEmployees.map((employee) => {
                            const info = roleInfo[employee.role];

                            return (
                                <motion.div
                                    key={employee.id}
                                    variants={fadeIn}
                                    className="card-luxury p-6 hover:shadow-xl transition-shadow"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {employee.avatar ? (
                                                <img
                                                    src={employee.avatar}
                                                    alt={employee.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-gray-500" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                                                    <span>{info.icon}</span>
                                                    <span>{info.name}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.status === 'active' ? 'bg-green-100 text-green-700' :
                                            employee.status === 'vacation' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {employee.status === 'active' ? 'Activo' :
                                                employee.status === 'vacation' ? 'Vacaciones' : 'Inactivo'}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{employee.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            <span>{employee.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>Desde {new Date(employee.hireDate).toLocaleDateString('es-ES')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                            <DollarSign className="w-4 h-4" />
                                            <span>${employee.salary.toLocaleString()}/mes</span>
                                        </div>
                                    </div>

                                    {/* Permissions */}
                                    <div className="mb-4 pb-4 border-t border-gray-100 pt-4">
                                        <p className="text-xs font-semibold text-gray-700 mb-2">Permisos:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {employee.permissions.canManageProducts && (
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">Productos</span>
                                            )}
                                            {employee.permissions.canManageOrders && (
                                                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">Pedidos</span>
                                            )}
                                            {employee.permissions.canViewFinances && (
                                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">Finanzas</span>
                                            )}
                                            {employee.permissions.canManageContent && (
                                                <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded">Contenido</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/empleados/${employee.id}`}
                                            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center text-sm flex items-center justify-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(employee.id)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </AdminPageLayout>
    );
}
