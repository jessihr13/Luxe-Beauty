'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useProductsStore } from '@/lib/products/productsStore';
import { useToast } from '@/lib/hooks/useToast';
import { Product } from '@/lib/data/products';
import { ArrowLeft, Save } from 'lucide-react';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function NewProductPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        description: '',
        price: 0,
        originalPrice: 0,
        cost: 0,
        category: 'skincare' as Product['category'],
        subcategory: '',
        stock: 0,
        image: '',
        sku: '',
    });

    const addProduct = useProductsStore(state => state.addProduct);
    const toast = useToast();

    useEffect(() => {
        useProductsStore.persist.rehydrate();
    }, []);

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            addProduct({
                name: formData.name,
                shortDescription: formData.shortDescription,
                description: formData.description,
                price: formData.price,
                originalPrice: formData.originalPrice || undefined,
                cost: formData.cost,
                category: formData.category,
                subcategory: formData.subcategory,
                images: [formData.image],
                image: formData.image,
                stock: formData.stock,
                rating: 5,
                reviewCount: 0,
                ingredients: [],
                benefits: [],
                skinTypes: ['Todos'],
                neuromarketing: {
                    scarcityLevel: 'none',
                    isBestseller: false,
                    isTrending: false,
                    isNew: true,
                    socialProof: {
                        purchaseCount: 0,
                        viewingNow: 0,
                    },
                },
            });

            setTimeout(() => {
                setSaving(false);
                toast.success(`✅ Producto "${formData.name}" creado exitosamente`);
                router.push('/admin/productos');
            }, 500);
        } catch (error) {
            setSaving(false);
            toast.error('❌ Error al crear el producto');
        }
    };

    return (
        <div className="min-h-screen bg-nude-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/productos"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-serif font-bold gradient-text">
                                Nuevo Producto
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Añade un nuevo producto a tu catálogo
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre del Producto *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />
                    </div>

                    {/* Descripción Corta */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción Corta *
                        </label>
                        <input
                            type="text"
                            value={formData.shortDescription}
                            onChange={(e) => handleChange('shortDescription', e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />
                    </div>

                    {/* Descripción Completa */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción Completa *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />
                    </div>

                    {/* Precios y Costo */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Precio de Venta ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Costo ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.cost}
                                onChange={(e) => handleChange('cost', parseFloat(e.target.value))}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Costo de producción/adquisición</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Precio Original ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.originalPrice}
                                onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Opcional (para descuentos)</p>
                        </div>
                    </div>

                    {/* Margen de Ganancia (Calculado) */}
                    {formData.price > 0 && formData.cost > 0 && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-semibold text-green-800">
                                Margen de Ganancia: ${(formData.price - formData.cost).toFixed(2)}
                                ({(((formData.price - formData.cost) / formData.price) * 100).toFixed(1)}%)
                            </p>
                        </div>
                    )}

                    {/* Categoría, SKU y Stock */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Categoría *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            >
                                <option value="skincare">Skincare</option>
                                <option value="makeup">Makeup</option>
                                <option value="fragrance">Fragrance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                SKU
                            </label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => handleChange('sku', e.target.value)}
                                placeholder="LB-001"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Stock Inicial *
                            </label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Subcategoría */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subcategoría *
                        </label>
                        <input
                            type="text"
                            value={formData.subcategory}
                            onChange={(e) => handleChange('subcategory', e.target.value)}
                            required
                            placeholder="Ej: Serums, Labiales, Perfumes"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />
                    </div>

                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            URL de Imagen *
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => handleChange('image', e.target.value)}
                                required
                                placeholder="https://..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                                />
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Guardando...' : 'Crear Producto'}
                        </button>
                        <Link
                            href="/admin/productos"
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
