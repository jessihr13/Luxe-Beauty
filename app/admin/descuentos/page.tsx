// Admin Discounts List Page
// app/admin/descuentos/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Plus,
    ArrowLeft,
    Edit,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Search
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useDiscountsStore } from '@/lib/discounts/discountsStore';
import { discountTypeInfo } from '@/lib/discounts/discountTypes';
import { useToast } from '@/lib/hooks/useToast';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { SearchInput } from '@/components/ui/SearchInput';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { fadeIn, staggerContainer } from '@/lib/animations';

export default function DiscountsPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useToast();

    const getAllDiscounts = useDiscountsStore(state => state.getAllDiscounts);
    const toggleDiscountStatus = useDiscountsStore(state => state.toggleDiscountStatus);
    const deleteDiscount = useDiscountsStore(state => state.deleteDiscount);
    const discounts = getAllDiscounts();

    useEffect(() => {
        setMounted(true);
        useDiscountsStore.persist.rehydrate();
    }, []);

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    if (!mounted) {
        return (
            <AdminPageLayout>
                <SkeletonTable />
            </AdminPageLayout>
        );
    }

    const filteredDiscounts = discounts.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatus = (id: string) => {
        toggleDiscountStatus(id);
        toast.success('Estado actualizado');
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`¿Eliminar descuento "${name}"?`)) {
            deleteDiscount(id);
            toast.success('Descuento eliminado');
        }
    };

    return (
        <AdminPageLayout>
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
                                Descuentos
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Gestiona cupones y promociones
                            </p>
                        </div>
                    </div>

                    <Link href="/admin/descuentos/nuevo" className="btn-primary flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Nuevo Descuento
                    </Link>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar descuentos..."
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        variants={fadeIn}
                        className="card-luxury p-6"
                    >
                        <div className="text-sm text-gray-600 mb-1">Total</div>
                        <div className="text-3xl font-bold">{discounts.length}</div>
                    </motion.div>
                    <motion.div
                        variants={fadeIn}
                        className="card-luxury p-6"
                    >
                        <div className="text-sm text-gray-600 mb-1">Activos</div>
                        <div className="text-3xl font-bold text-green-600">
                            {discounts.filter(d => d.isActive).length}
                        </div>
                    </motion.div>
                    <motion.div
                        variants={fadeIn}
                        className="card-luxury p-6"
                    >
                        <div className="text-sm text-gray-600 mb-1">Cupones</div>
                        <div className="text-3xl font-bold text-blue-600">
                            {discounts.filter(d => d.type === 'coupon').length}
                        </div>
                    </motion.div>
                    <motion.div
                        variants={fadeIn}
                        className="card-luxury p-6"
                    >
                        <div className="text-sm text-gray-600 mb-1">Usos Totales</div>
                        <div className="text-3xl font-bold text-purple-600">
                            {discounts.reduce((sum, d) => sum + d.currentUses, 0)}
                        </div>
                    </motion.div>
                </div>

                {/* Table */}
                <div className="card-luxury overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Descuento
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Valor
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Usos
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredDiscounts.map((discount) => {
                                    const typeInfo = discountTypeInfo[discount.type];
                                    return (
                                        <tr key={discount.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        {discount.name}
                                                    </div>
                                                    {discount.code && (
                                                        <div className="text-sm text-gray-500">
                                                            Código: {discount.code}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="flex items-center gap-2">
                                                    <span>{typeInfo.icon}</span>
                                                    <span className="text-sm">{typeInfo.name}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {discount.valueType === 'percentage' ? (
                                                    <span className="font-semibold text-green-600">
                                                        {discount.value}%
                                                    </span>
                                                ) : discount.valueType === 'fixed' ? (
                                                    <span className="font-semibold text-green-600">
                                                        ${discount.value}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-600">
                                                        Envío gratis
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <div>{discount.currentUses}</div>
                                                    {discount.maxUses && (
                                                        <div className="text-gray-500">
                                                            de {discount.maxUses}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleStatus(discount.id)}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                        discount.isActive
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {discount.isActive ? (
                                                        <>
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                            <span>Activo</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                            <span>Inactivo</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/descuentos/${discount.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(discount.id, discount.name)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredDiscounts.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No se encontraron descuentos
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
}
