'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fadeIn } from '@/lib/animations';

interface ContentBlock {
    id: string;
    type: 'hero' | 'banner' | 'text' | 'image';
    content: {
        title?: string;
        subtitle?: string;
        text?: string;
        imageUrl?: string;
        ctaText?: string;
        ctaLink?: string;
    };
}

export default function VisualCMSEditor() {
    const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
        {
            id: 'hero_1',
            type: 'hero',
            content: {
                title: 'Transforma Tu Radiancia Natural',
                subtitle: 'Descubre cosméticos de lujo formulados con ingredientes premium',
                imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=1920&q=80',
                ctaText: 'Descubre Tu Brillo',
                ctaLink: '#productos',
            },
        },
    ]);

    const [editingBlock, setEditingBlock] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false);

    const handleEdit = (blockId: string) => {
        setEditingBlock(blockId);
    };

    const handleSave = (blockId: string, newContent: ContentBlock['content']) => {
        setContentBlocks(blocks =>
            blocks.map(block =>
                block.id === blockId ? { ...block, content: newContent } : block
            )
        );
        setEditingBlock(null);
    };

    return (
        <div className="min-h-screen bg-nude-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/dashboard"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <h1 className="text-2xl font-serif font-bold gradient-text">
                                Editor de Contenido Visual
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setPreviewMode(!previewMode)}
                                className="px-4 py-2 border-2 border-rose-gold-300 text-rose-gold-700 rounded-full hover:bg-rose-gold-50 transition-colors"
                            >
                                {previewMode ? 'Editar' : 'Vista Previa'}
                            </button>

                            <button className="px-6 py-2 bg-rose-gold-300 text-white rounded-full hover:bg-rose-gold-400 transition-colors">
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Editor Panel */}
                    <div className="space-y-6">
                        <div className="card-luxury p-6">
                            <h2 className="text-xl font-semibold mb-4">Bloques de Contenido</h2>

                            {contentBlocks.map((block) => (
                                <motion.div
                                    key={block.id}
                                    variants={fadeIn}
                                    className="mb-6 p-4 border-2 border-gray-200 rounded-lg hover:border-rose-gold-300 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900">
                                            {block.type === 'hero' ? 'Hero Section' : 'Bloque de Contenido'}
                                        </h3>
                                        <button
                                            onClick={() => handleEdit(block.id)}
                                            className="px-3 py-1 bg-rose-gold-100 text-rose-gold-700 rounded-full text-sm hover:bg-rose-gold-200 transition-colors"
                                        >
                                            Editar
                                        </button>
                                    </div>

                                    {editingBlock === block.id ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Título Principal
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={block.content.title}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-gold-400"
                                                    placeholder="Título principal"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Subtítulo
                                                </label>
                                                <textarea
                                                    defaultValue={block.content.subtitle}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-gold-400"
                                                    rows={3}
                                                    placeholder="Subtítulo o descripción"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    URL de Imagen
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={block.content.imageUrl}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-gold-400"
                                                    placeholder="https://..."
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Tip: Arrastra y suelta una imagen o pega una URL
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Texto del Botón
                                                    </label>
                                                    <input
                                                        type="text"
                                                        defaultValue={block.content.ctaText}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-gold-400"
                                                        placeholder="Ej: Comprar Ahora"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Enlace del Botón
                                                    </label>
                                                    <input
                                                        type="text"
                                                        defaultValue={block.content.ctaLink}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-gold-400"
                                                        placeholder="#productos"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSave(block.id, block.content)}
                                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={() => setEditingBlock(null)}
                                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-600 space-y-2">
                                            <p><strong>Título:</strong> {block.content.title}</p>
                                            <p><strong>Subtítulo:</strong> {block.content.subtitle}</p>
                                            <p><strong>CTA:</strong> {block.content.ctaText}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-rose-gold-300 hover:text-rose-gold-700 transition-colors">
                                + Añadir Nuevo Bloque
                            </button>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="card-luxury p-6">
                            <h2 className="text-xl font-semibold mb-4">Vista Previa</h2>

                            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                                {contentBlocks.map((block) => (
                                    <div key={block.id} className="relative">
                                        {block.type === 'hero' && (
                                            <div className="relative h-96 bg-gradient-to-br from-nude-50 via-rose-gold-50 to-nude-100">
                                                {block.content.imageUrl && (
                                                    <Image
                                                        src={block.content.imageUrl}
                                                        alt="Hero"
                                                        fill
                                                        className="object-cover opacity-40"
                                                    />
                                                )}
                                                <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                                                    <h1 className="text-4xl font-bold mb-4">
                                                        {block.content.title}
                                                    </h1>
                                                    <p className="text-lg text-gray-700 mb-6">
                                                        {block.content.subtitle}
                                                    </p>
                                                    <button className="btn-primary w-fit">
                                                        {block.content.ctaText}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    Los cambios se mostrarán aquí en tiempo real. Haz clic en Guardar Cambios para publicar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
