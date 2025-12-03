'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { getAllProductsEditable, deleteProduct } from '@/lib/data/productManager';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import AdvancedProductFilters from '@/components/admin/AdvancedProductFilters';
import { useProductFilters } from '@/lib/hooks/useProductFilters';

export default function AdminProductosPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [products, setProducts] = useState(getAllProductsEditable());
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Filtros avanzados
    const { filters, updateFilter, resetFilters, filteredProducts, totalResults, totalProducts, copyFilterURL } = useProductFilters(products);

    // Redirect si no es admin
    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    const handleDelete = (id: string) => {
        if (deleteProduct(id)) {
            setProducts(getAllProductsEditable());
            setDeleteConfirm(null);
        }
    };

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
                                Gestión de Productos
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Edita, añade o elimina productos de tu catálogo
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/productos/nuevo"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Producto
                    </Link>
                </div>

                {/* Layout con filtros y tabla */}
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Filtros - Sidebar */}
                    <div className="lg:col-span-1">
                        <AdvancedProductFilters
                            filters={filters}
                            onFilterChange={updateFilter}
                            onReset={resetFilters}
                            totalResults={totalResults}
                            totalProducts={totalProducts}
                            onShareFilters={copyFilterURL}
                        />
                    </div>

                    {/* Products Table */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Producto
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Categoría
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Precio
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Stock
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                No se encontraron productos con los filtros aplicados
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{product.name}</p>
                                                            <p className="text-sm text-gray-500">{product.shortDescription}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-rose-gold-100 text-rose-gold-700 rounded-full text-sm font-medium">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                                                    {product.originalPrice && (
                                                        <p className="text-sm text-gray-500 line-through">
                                                            ${product.originalPrice.toFixed(2)}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock === 0
                                                            ? 'bg-red-100 text-red-700'
                                                            : product.stock < 10
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-green-100 text-green-700'
                                                            }`}
                                                    >
                                                        {product.stock} unidades
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/productos/${product.id}`}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-5 h-5" />
                                                        </Link>

                                                        {deleteConfirm === product.id ? (
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleDelete(product.id)}
                                                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                                                >
                                                                    Confirmar
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(null)}
                                                                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                                                                >
                                                                    Cancelar
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setDeleteConfirm(product.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
