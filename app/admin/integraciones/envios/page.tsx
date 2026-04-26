// Admin Shipping Integrations Page
// app/admin/integraciones/envios/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, CheckCircle2, XCircle, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useIntegrationsStore } from '@/lib/integrations/integrationsStore';
import { integrationInfo, Integration } from '@/lib/integrations/integrationTypes';
import { useToast } from '@/lib/hooks/useToast';
import { SkeletonCard } from '@/components/ui/Skeleton';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import IntegrationConfigModal from '@/components/integrations/IntegrationConfigModal';

export default function ShippingIntegrationsPage() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
    const toast = useToast();

    const getIntegrationsByType = useIntegrationsStore(state => state.getIntegrationsByType);
    const toggleIntegration = useIntegrationsStore(state => state.toggleIntegration);
    const shippingIntegrations = getIntegrationsByType('shipping');

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

    const handleToggle = (provider: any) => {
        toggleIntegration(provider);
        toast.success('Estado actualizado');
    };

    return (
        <AdminPageLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/integraciones" className="text-gray-600 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-serif font-bold gradient-text">Integraciones de Envíos</h1>
                            <p className="text-gray-600 mt-2">Configura servicios de paquetería</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card-luxury p-6">
                        <div className="text-sm text-gray-600 mb-1">Total</div>
                        <div className="text-3xl font-bold">{shippingIntegrations.length}</div>
                    </div>
                    <div className="card-luxury p-6">
                        <div className="text-sm text-gray-600 mb-1">Activas</div>
                        <div className="text-3xl font-bold text-green-600">
                            {shippingIntegrations.filter(i => i.isEnabled).length}
                        </div>
                    </div>
                    <div className="card-luxury p-6">
                        <div className="text-sm text-gray-600 mb-1">Inactivas</div>
                        <div className="text-3xl font-bold text-gray-400">
                            {shippingIntegrations.filter(i => !i.isEnabled).length}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shippingIntegrations.map(integration => {
                        const info = integrationInfo[integration.provider];
                        return (
                            <div key={integration.id} className="card-luxury p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">{info.icon}</div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{info.name}</h3>
                                            <p className="text-sm text-gray-500">{info.region}</p>
                                        </div>
                                    </div>
                                    {integration.isEnabled ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mb-4">{info.description}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggle(integration.provider)}
                                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            integration.isEnabled
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {integration.isEnabled ? 'Activo' : 'Inactivo'}
                                    </button>
                                    <button
                                        onClick={() => setSelectedIntegration(integration)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Config Modal */}
                {selectedIntegration && (
                    <IntegrationConfigModal
                        integration={selectedIntegration}
                        onClose={() => setSelectedIntegration(null)}
                    />
                )}
            </div>
        </AdminPageLayout>
    );
}
