'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import type { ExpenseCategory } from '@/lib/data/expenses';
import { ArrowLeft, Save } from 'lucide-react';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function NewExpensePage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        category: 'general' as ExpenseCategory,
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'card',
        status: 'paid',
        notes: '',
    });

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!formData.description || formData.amount <= 0) {
            alert('Por favor completa la descripción y el monto');
            return;
        }

        setSaving(true);
        // createExpense(formData);

        setTimeout(() => {
            setSaving(false);
            alert('Gasto registrado exitosamente (demo)');
            router.push('/admin/finanzas/gastos');
        }, 500);
    };

    return (
        <AdminPageLayout>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/finanzas/gastos"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-serif font-bold gradient-text">
                                Nuevo Gasto
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Registra un nuevo gasto operativo
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Guardando...' : 'Guardar Gasto'}
                    </button>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Categoría y Fecha */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Categoría *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            >
                                <option value="logistics">🚚 Logística</option>
                                <option value="marketing">📢 Marketing</option>
                                <option value="salaries">👥 Salarios</option>
                                <option value="general">🏢 Generales</option>
                                <option value="technology">💻 Tecnología</option>
                                <option value="inventory">📦 Inventario</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha *
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción *
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Ej: Envío de paquetes - Noviembre"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Monto */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Monto ($) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                            placeholder="0.00"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Método de Pago y Estado */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Método de Pago
                            </label>
                            <select
                                value={formData.paymentMethod}
                                onChange={(e) => handleChange('paymentMethod', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            >
                                <option value="cash">💵 Efectivo</option>
                                <option value="card">💳 Tarjeta</option>
                                <option value="transfer">🏦 Transferencia</option>
                                <option value="other">📝 Otro</option>
                            </select>
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
                                <option value="paid">✅ Pagado</option>
                                <option value="pending">⏳ Pendiente</option>
                                <option value="cancelled">❌ Cancelado</option>
                            </select>
                        </div>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Notas (Opcional)
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            rows={3}
                            placeholder="Información adicional sobre este gasto..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        />
                    </div>

                    {/* Preview */}
                    {formData.amount > 0 && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Vista Previa</h4>
                            <div className="space-y-1 text-sm">
                                <p><span className="text-gray-600">Categoría:</span> <span className="font-medium">{formData.category}</span></p>
                                <p><span className="text-gray-600">Descripción:</span> <span className="font-medium">{formData.description || 'Sin descripción'}</span></p>
                                <p><span className="text-gray-600">Monto:</span> <span className="font-bold text-red-600">${formData.amount.toLocaleString()}</span></p>
                                <p><span className="text-gray-600">Fecha:</span> <span className="font-medium">{new Date(formData.date).toLocaleDateString('es-ES')}</span></p>
                            </div>
                        </div>
                    )}

                    {/* Nota Informativa */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Nota:</strong> Los datos se guardan en memoria. Para persistencia permanente, configura una base de datos.
                        </p>
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
}
