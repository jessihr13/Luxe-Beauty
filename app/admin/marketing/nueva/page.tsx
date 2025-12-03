'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createCampaign, type CampaignType, type CampaignStatus } from '@/lib/data/campaigns';

export default function NewCampaignPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'social_media' as CampaignType,
        status: 'draft' as CampaignStatus,
        budget: 0,
        spent: 0,
        startDate: '',
        endDate: '',
        targetAudience: '',
        goals: [''],
        impressions: 0,
        clicks: 0,
        conversions: 0
    });

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const newCampaign = createCampaign({
                name: formData.name,
                description: formData.description,
                type: formData.type,
                status: formData.status,
                budget: formData.budget,
                spent: formData.spent,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                targetAudience: formData.targetAudience,
                goals: formData.goals.filter(g => g.trim() !== ''),
                metrics: {
                    impressions: formData.impressions,
                    clicks: formData.clicks,
                    conversions: formData.conversions
                }
            });

            // Simulate save delay
            await new Promise(resolve => setTimeout(resolve, 500));

            router.push(`/admin/marketing/${newCampaign.id}`);
        } catch (error) {
            console.error('Error creating campaign:', error);
            setSaving(false);
        }
    };

    const handleGoalChange = (index: number, value: string) => {
        const newGoals = [...formData.goals];
        newGoals[index] = value;
        setFormData({ ...formData, goals: newGoals });
    };

    const addGoal = () => {
        setFormData({ ...formData, goals: [...formData.goals, ''] });
    };

    const removeGoal = (index: number) => {
        const newGoals = formData.goals.filter((_, i) => i !== index);
        setFormData({ ...formData, goals: newGoals });
    };

    return (
        <div className="min-h-screen bg-nude-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href="/admin/marketing"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-serif font-bold gradient-text">
                            Nueva Campaña de Marketing
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Crea una nueva campaña y comienza a rastrear su rendimiento
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="card-luxury p-8">
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Información Básica</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de la Campaña *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        placeholder="Ej: Black Friday 2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Campaña *
                                    </label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as CampaignType })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    >
                                        <option value="social_media">📱 Redes Sociales</option>
                                        <option value="email">📧 Email Marketing</option>
                                        <option value="influencer">⭐ Influencers</option>
                                        <option value="ads">🎯 Publicidad Digital</option>
                                        <option value="events">🎉 Eventos</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción *
                                    </label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        placeholder="Describe los objetivos y estrategia de la campaña..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estado
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    >
                                        <option value="draft">📝 Borrador</option>
                                        <option value="active">🟢 Activa</option>
                                        <option value="paused">⏸️ Pausada</option>
                                        <option value="completed">✅ Completada</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Audiencia Objetivo *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.targetAudience}
                                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        placeholder="Ej: Mujeres 25-45 años"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Budget & Dates */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Presupuesto y Fechas</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Presupuesto Total ($) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gastado ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.spent}
                                        onChange={(e) => setFormData({ ...formData, spent: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de Inicio *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de Fin *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Goals */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Objetivos</h3>
                            <div className="space-y-3">
                                {formData.goals.map((goal, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={goal}
                                            onChange={(e) => handleGoalChange(index, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                            placeholder="Ej: Aumentar ventas 50%"
                                        />
                                        {formData.goals.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeGoal(index)}
                                                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addGoal}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    + Agregar Objetivo
                                </button>
                            </div>
                        </div>

                        {/* Metrics (Optional) */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Métricas Iniciales (Opcional)</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Impresiones
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.impressions}
                                        onChange={(e) => setFormData({ ...formData, impressions: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Clicks
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.clicks}
                                        onChange={(e) => setFormData({ ...formData, clicks: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Conversiones
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.conversions}
                                        onChange={(e) => setFormData({ ...formData, conversions: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 btn-primary flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Guardando...' : 'Crear Campaña'}
                            </button>
                            <Link
                                href="/admin/marketing"
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
