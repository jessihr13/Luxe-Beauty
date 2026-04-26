// Saved Addresses Page
// app/account/addresses/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useCustomerStore } from '@/lib/customer/customerStore';
import AccountLayout from '@/components/account/AccountLayout';
import { MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useToast } from '@/lib/hooks/useToast';

export default function AddressesPage() {
    const toast = useToast();
    const { savedAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useCustomerStore();
    const [mounted, setMounted] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'México',
        isDefault: false
    });

    useEffect(() => {
        useCustomerStore.persist.rehydrate();
        setMounted(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            updateAddress(editingId, formData);
            toast.success('Dirección actualizada');
        } else {
            addAddress(formData);
            toast.success('Dirección agregada');
        }

        resetForm();
    };

    const handleEdit = (address: any) => {
        setFormData(address);
        setEditingId(address.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta dirección?')) {
            deleteAddress(id);
            toast.success('Dirección eliminada');
        }
    };

    const handleSetDefault = (id: string) => {
        setDefaultAddress(id);
        toast.success('Dirección predeterminada actualizada');
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'México',
            isDefault: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    if (!mounted) return null;

    return (
        <AccountLayout title="Mis Direcciones">
            {/* Add Address Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary mb-6 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Agregar Nueva Dirección
                </button>
            )}

            {/* Address Form */}
            {showForm && (
                <div className="card-luxury p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">
                        {editingId ? 'Editar Dirección' : 'Nueva Dirección'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de la Dirección
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                placeholder="Casa, Oficina, etc."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dirección Completa
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                placeholder="Calle, número, colonia"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado
                                </label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Código Postal
                            </label>
                            <input
                                type="text"
                                value={formData.zipCode}
                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="w-4 h-4 text-rose-gold-600 border-gray-300 rounded focus:ring-rose-gold-500"
                            />
                            <label htmlFor="isDefault" className="text-sm text-gray-700">
                                Establecer como dirección predeterminada
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Actualizar' : 'Guardar'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn-secondary"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Saved Addresses List */}
            {savedAddresses.length === 0 ? (
                <div className="card-luxury p-12 text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No tienes direcciones guardadas</h3>
                    <p className="text-gray-600 mb-4">Agrega una dirección para hacer tus compras más rápido</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedAddresses.map((address) => (
                        <div
                            key={address.id}
                            className={`card-luxury p-6 relative ${
                                address.isDefault ? 'border-2 border-rose-gold-500' : ''
                            }`}
                        >
                            {address.isDefault && (
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-rose-gold-100 text-rose-gold-700 text-xs font-semibold rounded-full">
                                        Predeterminada
                                    </span>
                                </div>
                            )}

                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="w-5 h-5 text-rose-gold-600 mt-1" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg mb-1">{address.name}</h4>
                                    <p className="text-gray-700">{address.address}</p>
                                    <p className="text-gray-600 text-sm">
                                        {address.city}, {address.state} {address.zipCode}
                                    </p>
                                    <p className="text-gray-600 text-sm">{address.country}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                                {!address.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(address.id)}
                                        className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Predeterminada
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(address.id)}
                                    className="flex-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AccountLayout>
    );
}
