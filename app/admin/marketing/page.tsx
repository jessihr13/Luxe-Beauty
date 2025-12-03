'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    TrendingUp,
    DollarSign,
    Target,
    BarChart3,
    Plus,
    ArrowLeft,
    Search,
    Filter,
    Eye,
    Edit,
    Pause,
    Play
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
    getAllCampaigns,
    calculateCampaignROI,
    calculateCampaignRevenue,
    campaignTypeInfo,
    campaignStatusInfo,
    type CampaignType,
    type CampaignStatus
} from '@/lib/data/campaigns';
import { staggerContainer } from '@/lib/animations';

export default function MarketingPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<CampaignType | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<CampaignStatus | 'all'>('all');

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    const campaigns = getAllCampaigns();

    // Filter campaigns
    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || campaign.type === filterType;
        const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    // Calculate metrics
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + calculateCampaignRevenue(c.id), 0);
    const avgROI = campaigns.length > 0
        ? campaigns.reduce((sum, c) => sum + calculateCampaignROI(c.id), 0) / campaigns.length
        : 0;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

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
                                Marketing y Campañas
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Gestión de campañas y análisis de ROI
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/marketing/nueva"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Nueva Campaña
                    </Link>
                </div>

                {/* Summary Cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid md:grid-cols-5 gap-6 mb-8"
                >
                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            ${totalBudget.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600">Presupuesto total</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            ${totalSpent.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600">Gastado</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <BarChart3 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            ${totalRevenue.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600">Ingresos generados</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {avgROI.toFixed(0)}%
                        </h3>
                        <p className="text-sm text-gray-600">ROI promedio</p>
                    </div>

                    <div className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <span className="text-2xl">🎯</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {activeCampaigns}
                        </h3>
                        <p className="text-sm text-gray-600">Campañas activas</p>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="card-luxury p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-700">Filtrar:</span>
                        </div>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as CampaignType | 'all')}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="social_media">📱 Redes Sociales</option>
                            <option value="email">📧 Email</option>
                            <option value="influencer">⭐ Influencers</option>
                            <option value="ads">🎯 Publicidad</option>
                            <option value="events">🎉 Eventos</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as CampaignStatus | 'all')}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="draft">📝 Borrador</option>
                            <option value="active">🟢 Activa</option>
                            <option value="paused">⏸️ Pausada</option>
                            <option value="completed">✅ Completada</option>
                        </select>

                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar campaña..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaigns Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map(campaign => {
                        const typeInfo = campaignTypeInfo[campaign.type];
                        const statusInfo = campaignStatusInfo[campaign.status];
                        const roi = calculateCampaignROI(campaign.id);
                        const revenue = calculateCampaignRevenue(campaign.id);
                        const budgetProgress = (campaign.spent / campaign.budget) * 100;

                        return (
                            <motion.div
                                key={campaign.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card-luxury p-6 hover:shadow-xl transition-shadow"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{typeInfo.icon}</span>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                                            <p className="text-xs text-gray-600">{typeInfo.name}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                                            campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                        }`}>
                                        {statusInfo.icon} {statusInfo.name}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {campaign.description}
                                </p>

                                {/* Budget Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Presupuesto</span>
                                        <span className="font-semibold text-gray-900">
                                            ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${budgetProgress > 90 ? 'bg-red-500' :
                                                    budgetProgress > 70 ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                }`}
                                            style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-600">ROI</p>
                                        <p className={`text-lg font-bold ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {roi.toFixed(0)}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Ingresos</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            ${revenue.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Conversiones</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {campaign.metrics.conversions}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Clicks</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {campaign.metrics.clicks.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/marketing/${campaign.id}`}
                                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium text-center flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Ver Detalle
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredCampaigns.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No se encontraron campañas
                    </div>
                )}
            </div>
        </div>
    );
}
