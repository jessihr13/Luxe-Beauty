// Admin Integrations Main Page
// app/admin/integraciones/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CreditCard,
    Package,
    FileText,
    Settings,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useIntegrationsStore } from '@/lib/integrations/integrationsStore';
import { integrationInfo } from '@/lib/integrations/integrationTypes';
import { SkeletonCard } from '@/components/ui/Skeleton';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function IntegrationsPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);

    const getAllIntegrations = useIntegrationsStore(state => state.getAllIntegrations);
    const getIntegrationsByType = useIntegrationsStore(state => state.getIntegrationsByType);
    const integrations = getAllIntegrations();

    useEffect(() => {
        setMounted(true);
        useIntegrationsStore.persist.rehydrate();
    }, []);

    if (!isAuthenticated || !isAdmin) {
        router.push('/login');
        return null;
    }

    if (!mounted) {
        return (
            <AdminPageLayout>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </AdminPageLayout>
        );
    }

    const paymentIntegrations = getIntegrationsByType('payment');
    const shippingIntegrations = getIntegrationsByType('shipping');
    const accountingIntegrations = getIntegrationsByType('accounting');

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'testing':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            default:
                return <XCircle className="w-5 h-5 text-gray-400" />;
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
                                Integraciones
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Conecta con proveedores de pagos, envíos y contabilidad
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card-luxury p-6">
                        <div className="text-sm text-gray-600 mb-1">Total</div>
                        <div className="text-3xl font-bold">{integrations.length}</div>
                    </div>
                    <div className="card-luxury p-6">
                        <div className="text-sm text-gray-600 mb-1">Activas</div>
                        <div className="text-3xl font-bold text-green-600">
                            {integrations.filter(i => i.isEnabled).length}
                        </div>
                    </div>
                    <div className="card-luxury p-6">
                        <div className="text-sm text-gray-600 mb-1">Pagos</div>
                        <div className="text-3xl font-bold text-blue-600">
                            {paymentIntegrations.filter(i => i.isEnabled).length}
                        </div>
                    </div>
                    <div className="card-luxury p-6">
                        <div className="text-sm text-gray-600 mb-1">Envíos</div>
                        <div className="text-3xl font-bold text-purple-600">
                            {shippingIntegrations.filter(i => i.isEnabled).length}
                        </div>
                    </div>
                </div>

                {/* Integration Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Payments */}
                    <Link
                        href="/admin/integraciones/pagos"
                        className="card-luxury p-6 hover:shadow-lg transition-shadow group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Pagos</h3>
                                <p className="text-sm text-gray-600">
                                    {paymentIntegrations.length} proveedores
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {paymentIntegrations.slice(0, 3).map(integration => {
                                const info = integrationInfo[integration.provider];
                                return (
                                    <div
                                        key={integration.id}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{info.icon}</span>
                                            <span>{info.name}</span>
                                        </div>
                                        {getStatusIcon(integration.status)}
                                    </div>
                                );
                            })}
                        </div>
                    </Link>

                    {/* Shipping */}
                    <Link
                        href="/admin/integraciones/envios"
                        className="card-luxury p-6 hover:shadow-lg transition-shadow group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Envíos</h3>
                                <p className="text-sm text-gray-600">
                                    {shippingIntegrations.length} proveedores
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {shippingIntegrations.slice(0, 3).map(integration => {
                                const info = integrationInfo[integration.provider];
                                return (
                                    <div
                                        key={integration.id}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{info.icon}</span>
                                            <span>{info.name}</span>
                                        </div>
                                        {getStatusIcon(integration.status)}
                                    </div>
                                );
                            })}
                        </div>
                    </Link>

                    {/* Accounting */}
                    <Link
                        href="/admin/integraciones/contabilidad"
                        className="card-luxury p-6 hover:shadow-lg transition-shadow group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Contabilidad</h3>
                                <p className="text-sm text-gray-600">
                                    {accountingIntegrations.length} proveedores
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {accountingIntegrations.slice(0, 3).map(integration => {
                                const info = integrationInfo[integration.provider];
                                return (
                                    <div
                                        key={integration.id}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{info.icon}</span>
                                            <span>{info.name}</span>
                                        </div>
                                        {getStatusIcon(integration.status)}
                                    </div>
                                );
                            })}
                        </div>
                    </Link>
                </div>
            </div>
        </AdminPageLayout>
    );
}
