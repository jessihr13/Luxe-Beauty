'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Users, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function ReportesPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    const reports = [
        {
            title: 'Análisis de Cohortes',
            description: 'Retención de clientes por fecha de primera compra',
            icon: Users,
            href: '/admin/reportes/cohortes',
            color: 'rose-gold',
            bgColor: 'bg-rose-gold-50',
            iconColor: 'text-rose-gold-600',
            disabled: false,
        },
        {
            title: 'Predicción de Demanda',
            description: 'Forecasting de ventas y alertas de stock',
            icon: TrendingUp,
            href: '/admin/reportes/demanda',
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            disabled: false,
        },
        {
            title: 'Rentabilidad por Producto',
            description: 'Análisis de márgenes y ROI',
            icon: DollarSign,
            href: '/admin/reportes/rentabilidad',
            color: 'green',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            disabled: false,
        },
        {
            title: 'Dashboard Ejecutivo',
            description: 'Vista consolidada de KPIs principales',
            icon: BarChart3,
            href: '/admin/reportes/ejecutivo',
            color: 'purple',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            disabled: false,
        },
    ];

    return (
        <AdminPageLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-serif font-bold gradient-text">
                            Reportes Avanzados
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Análisis y predicciones para toma de decisiones
                        </p>
                    </div>
                </div>

                {/* Reports Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {reports.map((report) => {
                        const Icon = report.icon;

                        if (report.disabled) {
                            return (
                                <div
                                    key={report.title}
                                    className="card-luxury p-6 opacity-50 cursor-not-allowed"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center`}>
                                            <Icon className={`w-6 h-6 ${report.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">{report.title}</h3>
                                            <p className="text-gray-600 mb-4">{report.description}</p>
                                            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                                                Próximamente
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={report.title}
                                href={report.href}
                                className="card-luxury p-6 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-6 h-6 ${report.iconColor}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-rose-gold-600 transition-colors">
                                            {report.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">{report.description}</p>
                                        <span className="text-rose-gold-600 font-medium group-hover:underline">
                                            Ver reporte →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-8 card-luxury p-6">
                    <h3 className="text-xl font-semibold mb-4">📊 Sobre los Reportes</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                        <div>
                            <h4 className="font-semibold mb-2">Análisis de Cohortes</h4>
                            <ul className="space-y-1 text-sm">
                                <li>• Retención de clientes por mes</li>
                                <li>• Cálculo de LTV (Lifetime Value)</li>
                                <li>• Tasa de churn</li>
                                <li>• Heatmap y gráficos de tendencias</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Predicción de Demanda</h4>
                            <ul className="space-y-1 text-sm">
                                <li>• Forecasting de ventas (3 meses)</li>
                                <li>• Detección de tendencias</li>
                                <li>• Alertas de desabastecimiento</li>
                                <li>• Recomendaciones de stock</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
}
