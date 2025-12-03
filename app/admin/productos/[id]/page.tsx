'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { getProductById, updateProduct } from '@/lib/data/productManager';
import { Product } from '@/lib/data/products';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const { isAdmin, isAuthenticated } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
            return;
        }

        const id = params.id as string;
        const foundProduct = getProductById(id);
        if (foundProduct) {
            setProduct(foundProduct);
            setFormData(foundProduct);
        } else {
            router.push('/admin/productos');
        }
    }, [params.id, isAuthenticated, isAdmin, router]);

    const handleChange = (field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!product) return;

        setSaving(true);
        const updated = updateProduct(product.id, formData);

        if (updated) {
            setTimeout(() => {
                setSaving(false);
                router.push('/admin/productos');
            }, 500);
        } else {
            setSaving(false);
            alert('Error al guardar');
        }
    };

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

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
                                Editar Producto
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {product.name}
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
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre del Producto
                        </label>
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />
                    </div>

                    {/* Descripción Corta */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción Corta
                        </label>
                        <input
                            type="text"
                            value={formData.shortDescription || ''}
                            onChange={(e) => handleChange('shortDescription', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />
                    </div>

                    {/* Descripción Larga */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción Completa
                        </label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />
                    </div>

                    {/* Precios y Costo */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Precio Actual ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price || 0}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Costo de Adquisición ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.cost || 0}
                                onChange={(e) => handleChange('cost', parseFloat(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Costo de producción/compra</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Precio Original ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.originalPrice || ''}
                                onChange={(e) => handleChange('originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Opcional (para descuentos)</p>
                        </div>
                    </div>

                    {/* Margen de Ganancia */}
                    {formData.price && formData.cost && formData.price > 0 && formData.cost > 0 && (
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
                                Categoría
                            </label>
                            <select
                                value={formData.category || 'skincare'}
                                onChange={(e) => handleChange('category', e.target.value as Product['category'])}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            >
                                <option value="skincare">Skincare</option>
                                <option value="makeup">Makeup</option>
                                <option value="fragrance">Fragrance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                SKU (Código)
                            </label>
                            <input
                                type="text"
                                value={formData.id || ''}
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                            />
                            <p className="text-xs text-gray-500 mt-1">Identificador único (no editable)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Stock (unidades)
                            </label>
                            <input
                                type="number"
                                value={formData.stock || 0}
                                onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Imagen Principal */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            URL de Imagen Principal
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={formData.image || ''}
                                onChange={(e) => {
                                    handleChange('image', e.target.value);
                                    handleChange('images', [e.target.value, ...(formData.images?.slice(1) || [])]);
                                }}
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

                    {/* Subcategoría */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subcategoría
                        </label>
                        <input
                            type="text"
                            value={formData.subcategory || ''}
                            onChange={(e) => handleChange('subcategory', e.target.value)}
                            placeholder="Ej: Serums, Labiales, Perfumes"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />
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
