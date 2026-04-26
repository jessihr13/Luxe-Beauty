'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createOrder } from '@/lib/data/orders';
import { getAllCampaigns, attributionSources } from '@/lib/data/campaigns';
import { products } from '@/lib/data/products';
import { attributeSaleToCampaign } from '@/lib/data/campaigns';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function NewOrderPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [saving, setSaving] = useState(false);

    const campaigns = getAllCampaigns();

    const [formData, setFormData] = useState({
        // Customer info
        customerName: '',
        customerEmail: '',
        customerPhone: '',

        // Shipping address
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'México',

        // Items
        items: [{ productId: '', quantity: 1 }],

        // Shipping
        shippingCost: 150,

        // Attribution
        hasAttribution: false,
        attributionSource: '',
        attributionCampaignId: '',
        attributionMedium: '',
        attributionNotes: ''
    });

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { productId: '', quantity: 1 }]
        });
    };

    const handleRemoveItem = (index: number) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const calculateTotals = () => {
        let subtotal = 0;
        const orderItems = formData.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;

            const itemSubtotal = product.price * item.quantity;
            subtotal += itemSubtotal;

            return {
                productId: product.id,
                productName: product.name,
                quantity: item.quantity,
                price: product.price,
                subtotal: itemSubtotal
            };
        }).filter(item => item !== null);

        const total = subtotal + formData.shippingCost;

        return { subtotal, total, orderItems };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { subtotal, total, orderItems } = calculateTotals();

            if (orderItems.length === 0) {
                alert('Por favor agrega al menos un producto');
                setSaving(false);
                return;
            }

            const newOrder = createOrder({
                customer: {
                    name: formData.customerName,
                    email: formData.customerEmail,
                    phone: formData.customerPhone
                },
                items: orderItems as any,
                subtotal,
                shipping: formData.shippingCost,
                total,
                status: 'pending',
                shippingAddress: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country
                },
                attribution: formData.hasAttribution ? {
                    source: formData.attributionSource,
                    campaignId: formData.attributionCampaignId || undefined,
                    medium: formData.attributionMedium || undefined,
                    notes: formData.attributionNotes || undefined
                } : undefined,
                statusHistory: [
                    { status: 'pending', timestamp: new Date() }
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
                // Legacy fields
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone
            });

            // If has campaign attribution, create sale attribution
            if (formData.hasAttribution && formData.attributionCampaignId) {
                attributeSaleToCampaign(
                    newOrder.orderNumber,
                    newOrder.customerName,
                    newOrder.total,
                    formData.attributionCampaignId,
                    formData.attributionSource
                );
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            router.push(`/admin/pedidos/${newOrder.id}`);
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error al crear el pedido');
            setSaving(false);
        }
    };

    const { subtotal, total } = calculateTotals();

    return (
        <AdminPageLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href="/admin/pedidos"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-serif font-bold gradient-text">
                            Nuevo Pedido
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Registra un pedido manual de un cliente
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Info */}
                    <div className="card-luxury p-6">
                        <h3 className="text-xl font-semibold mb-4">Información del Cliente</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    placeholder="Ej: María García"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.customerEmail}
                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    placeholder="maria@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.customerPhone}
                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    placeholder="+52 55 1234 5678"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="card-luxury p-6">
                        <h3 className="text-xl font-semibold mb-4">Dirección de Envío</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Calle y Número *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.street}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    placeholder="Av. Reforma 123, Col. Centro"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ciudad *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    placeholder="Ciudad de México"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    placeholder="CDMX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Código Postal *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    placeholder="06000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    País *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Productos</h3>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Agregar Producto
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.items.map((item, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <div className="flex-1">
                                        <select
                                            required
                                            value={item.productId}
                                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        >
                                            <option value="">Seleccionar producto...</option>
                                            {products.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} - ${product.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-32">
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                            placeholder="Cant."
                                        />
                                    </div>
                                    {formData.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Cost */}
                    <div className="card-luxury p-6">
                        <h3 className="text-xl font-semibold mb-4">Costo de Envío</h3>
                        <div className="w-full md:w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Costo de Envío ($)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.shippingCost}
                                onChange={(e) => setFormData({ ...formData, shippingCost: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Attribution (NEW) */}
                    <div className="card-luxury p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <input
                                type="checkbox"
                                id="hasAttribution"
                                checked={formData.hasAttribution}
                                onChange={(e) => setFormData({ ...formData, hasAttribution: e.target.checked })}
                                className="w-4 h-4 text-rose-gold-600 border-gray-300 rounded focus:ring-rose-gold-500"
                            />
                            <label htmlFor="hasAttribution" className="text-xl font-semibold cursor-pointer">
                                Atribuir a Campaña de Marketing
                            </label>
                        </div>

                        {formData.hasAttribution && (
                            <div className="grid md:grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fuente *
                                    </label>
                                    <select
                                        required={formData.hasAttribution}
                                        value={formData.attributionSource}
                                        onChange={(e) => setFormData({ ...formData, attributionSource: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    >
                                        <option value="">Seleccionar fuente...</option>
                                        {attributionSources.map(source => (
                                            <option key={source.value} value={source.label}>
                                                {source.icon} {source.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Campaña Asociada
                                    </label>
                                    <select
                                        value={formData.attributionCampaignId}
                                        onChange={(e) => setFormData({ ...formData, attributionCampaignId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    >
                                        <option value="">Ninguna</option>
                                        {campaigns.filter(c => c.status === 'active' || c.status === 'completed').map(campaign => (
                                            <option key={campaign.id} value={campaign.id}>
                                                {campaign.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Medio (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.attributionMedium}
                                        onChange={(e) => setFormData({ ...formData, attributionMedium: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        placeholder="Ej: cpc, email, social"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notas (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.attributionNotes}
                                        onChange={(e) => setFormData({ ...formData, attributionNotes: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        placeholder="Información adicional"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Totals */}
                    <div className="card-luxury p-6">
                        <h3 className="text-xl font-semibold mb-4">Resumen</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal:</span>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Envío:</span>
                                <span className="font-semibold">${formData.shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total:</span>
                                <span className="text-green-600">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 btn-primary flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Creando...' : 'Crear Pedido'}
                        </button>
                        <Link
                            href="/admin/pedidos"
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AdminPageLayout>
    );
}
