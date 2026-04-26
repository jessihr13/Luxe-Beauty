// Integration Configuration Modal Component
// components/integrations/IntegrationConfigModal.tsx

'use client';

import { useState } from 'react';
import { X, Save, TestTube } from 'lucide-react';
import { Integration, integrationInfo } from '@/lib/integrations/integrationTypes';
import { useIntegrationsStore } from '@/lib/integrations/integrationsStore';
import { useToast } from '@/lib/hooks/useToast';
import { LoadingButton } from '@/components/ui/LoadingSpinner';

interface IntegrationConfigModalProps {
    integration: Integration;
    onClose: () => void;
}

export default function IntegrationConfigModal({ integration, onClose }: IntegrationConfigModalProps) {
    const [config, setConfig] = useState(integration.config);
    const [isTesting, setIsTesting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const updateConfig = useIntegrationsStore(state => state.updateConfig);
    const toast = useToast();
    const info = integrationInfo[integration.provider];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            updateConfig(integration.provider, config);
            toast.success('Configuración guardada');
            setTimeout(() => {
                setIsSaving(false);
                onClose();
            }, 500);
        } catch (error) {
            toast.error('Error al guardar');
            setIsSaving(false);
        }
    };

    const handleTest = async () => {
        setIsTesting(true);
        // Simulate API test
        setTimeout(() => {
            setIsTesting(false);
            toast.success('Conexión exitosa');
        }, 1500);
    };

    const renderConfigFields = () => {
        switch (integration.type) {
            case 'payment':
                return (
                    <>
                        {integration.provider === 'stripe' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Public Key
                                    </label>
                                    <input
                                        type="text"
                                        value={config.publicKey || ''}
                                        onChange={(e) => setConfig({ ...config, publicKey: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        placeholder="pk_test_..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Secret Key
                                    </label>
                                    <input
                                        type="password"
                                        value={config.secretKey || ''}
                                        onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        placeholder="sk_test_..."
                                    />
                                </div>
                            </>
                        )}
                        {integration.provider === 'paypal' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Client ID
                                    </label>
                                    <input
                                        type="text"
                                        value={config.clientId || ''}
                                        onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Client Secret
                                    </label>
                                    <input
                                        type="password"
                                        value={config.clientSecret || ''}
                                        onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>
                            </>
                        )}
                        {(integration.provider === 'mercadopago' || integration.provider === 'conekta' || integration.provider === 'oxxo') && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {integration.provider === 'mercadopago' ? 'Access Token' : 'Private Key'}
                                    </label>
                                    <input
                                        type="password"
                                        value={config.privateKey || config.accessToken || ''}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            [integration.provider === 'mercadopago' ? 'accessToken' : 'privateKey']: e.target.value 
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>
                                {integration.provider !== 'oxxo' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Public Key
                                        </label>
                                        <input
                                            type="text"
                                            value={config.publicKey || ''}
                                            onChange={(e) => setConfig({ ...config, publicKey: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </>
                );

            case 'shipping':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                API Key
                            </label>
                            <input
                                type="password"
                                value={config.apiKey || ''}
                                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                            />
                        </div>
                        {integration.provider !== '99minutos' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    value={config.accountNumber || ''}
                                    onChange={(e) => setConfig({ ...config, accountNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>
                        )}
                    </>
                );

            case 'accounting':
                return (
                    <>
                        {integration.provider === 'sat' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        RFC
                                    </label>
                                    <input
                                        type="text"
                                        value={config.rfc || ''}
                                        onChange={(e) => setConfig({ ...config, rfc: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        placeholder="XAXX010101000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Certificate Path (.cer)
                                    </label>
                                    <input
                                        type="text"
                                        value={config.certificatePath || ''}
                                        onChange={(e) => setConfig({ ...config, certificatePath: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        placeholder="/path/to/certificate.cer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Key Path (.key)
                                    </label>
                                    <input
                                        type="text"
                                        value={config.keyPath || ''}
                                        onChange={(e) => setConfig({ ...config, keyPath: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                        placeholder="/path/to/key.key"
                                    />
                                </div>
                            </>
                        )}
                        {(integration.provider === 'quickbooks' || integration.provider === 'xero') && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Client ID
                                    </label>
                                    <input
                                        type="text"
                                        value={config.clientId || ''}
                                        onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Client Secret
                                    </label>
                                    <input
                                        type="password"
                                        value={config.clientSecret || ''}
                                        onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    />
                                </div>
                            </>
                        )}
                        {integration.provider === 'conta' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    API Key
                                </label>
                                <input
                                    type="password"
                                    value={config.apiKey || ''}
                                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                />
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{info.icon}</span>
                        <div>
                            <h2 className="text-2xl font-bold">{info.name}</h2>
                            <p className="text-sm text-gray-600">{info.description}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Environment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Environment
                        </label>
                        <select
                            value={config.environment || 'sandbox'}
                            onChange={(e) => setConfig({ ...config, environment: e.target.value as 'sandbox' | 'production' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                        >
                            <option value="sandbox">Sandbox (Testing)</option>
                            <option value="production">Production (Live)</option>
                        </select>
                    </div>

                    {/* Provider-specific fields */}
                    {renderConfigFields()}

                    {/* Webhook URL (for payments) */}
                    {integration.type === 'payment' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Webhook URL (opcional)
                            </label>
                            <input
                                type="text"
                                value={config.webhookUrl || ''}
                                onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                placeholder="https://yourdomain.com/api/webhooks/..."
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <LoadingButton
                        onClick={handleTest}
                        isLoading={isTesting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <TestTube className="w-4 h-4" />
                        Probar Conexión
                    </LoadingButton>
                    <LoadingButton
                        onClick={handleSave}
                        isLoading={isSaving}
                        className="px-4 py-2 bg-rose-gold-600 text-white rounded-lg hover:bg-rose-gold-700 transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Guardar
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
}
