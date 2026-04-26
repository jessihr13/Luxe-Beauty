'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Palette, Type, Layout, Sparkles, Monitor, Sun, Moon, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useThemeStore, colorSchemes, fontFamilies, densityConfig, borderRadiusConfig } from '@/lib/store/useThemeStore';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function AparienciaPage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin } = useAuth();

    const {
        mode,
        colorScheme,
        fontFamily,
        fontSize,
        density,
        animations,
        borderRadius,
        setMode,
        setColorScheme,
        setFontFamily,
        setFontSize,
        setDensity,
        setAnimations,
        setBorderRadius,
        resetToDefaults,
    } = useThemeStore();

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
        }
    }, [isAuthenticated, isAdmin, router]);

    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return (
        <AdminPageLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/configuracion"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-serif font-bold gradient-text">
                                Apariencia
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Personaliza la experiencia visual de tu panel
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={resetToDefaults}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Restaurar Predeterminados
                    </button>
                </div>

                {/* Main Content - Two Columns */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Modo de Tema */}
                        <div className="card-luxury p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-gold-400 to-rose-gold-600 flex items-center justify-center">
                                    <Monitor className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Modo de Tema</h2>
                                    <p className="text-sm text-gray-600">Elige entre claro, oscuro o automático</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => setMode('light')}
                                    className={`p-4 rounded-lg border-2 transition-all ${mode === 'light'
                                        ? 'border-rose-gold-500 bg-rose-gold-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                                    <div className="text-center">
                                        <div className="font-semibold">Claro</div>
                                        <div className="text-xs text-gray-600">Modo día</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setMode('dark')}
                                    className={`p-4 rounded-lg border-2 transition-all ${mode === 'dark'
                                        ? 'border-rose-gold-500 bg-rose-gold-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                                    <div className="text-center">
                                        <div className="font-semibold">Oscuro</div>
                                        <div className="text-xs text-gray-600">Modo noche</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setMode('auto')}
                                    className={`p-4 rounded-lg border-2 transition-all ${mode === 'auto'
                                        ? 'border-rose-gold-500 bg-rose-gold-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                                    <div className="text-center">
                                        <div className="font-semibold">Auto</div>
                                        <div className="text-xs text-gray-600">Según sistema</div>
                                    </div>
                                </button>
                            </div>

                            {mode === 'dark' && (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        ⚠️ El modo oscuro está en desarrollo. Algunas secciones pueden no verse correctamente.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Esquema de Color */}
                        <div className="card-luxury p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
                                    <Palette className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Esquema de Color</h2>
                                    <p className="text-sm text-gray-600">Personaliza la paleta de colores</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(colorSchemes).map(([key, scheme]) => (
                                    <button
                                        key={key}
                                        onClick={() => setColorScheme(key as any)}
                                        className={`p-3 rounded-lg border-2 transition-all text-left ${colorScheme === key
                                            ? 'border-rose-gold-500 bg-rose-gold-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div
                                            className="w-full h-12 rounded-lg mb-2"
                                            style={{ background: scheme.preview }}
                                        />
                                        <div className="font-semibold text-sm">{scheme.name}</div>
                                        <div className="text-xs text-gray-600">{scheme.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tipografía */}
                        <div className="card-luxury p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                                    <Type className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Tipografía</h2>
                                    <p className="text-sm text-gray-600">Fuente y tamaño del texto</p>
                                </div>
                            </div>

                            {/* Font Family */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Familia de Fuente
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.entries(fontFamilies).map(([key, font]) => (
                                        <button
                                            key={key}
                                            onClick={() => setFontFamily(key as any)}
                                            className={`p-3 rounded-lg border-2 transition-all ${fontFamily === key
                                                ? 'border-rose-gold-500 bg-rose-gold-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            style={{ fontFamily: font.css }}
                                        >
                                            <div className="text-xl mb-1">Aa</div>
                                            <div className="font-semibold text-xs">{font.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Font Size */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Tamaño de Fuente: {fontSize}%
                                </label>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">90%</span>
                                    <input
                                        type="range"
                                        min="90"
                                        max="120"
                                        step="10"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value) as any)}
                                        className="flex-1"
                                    />
                                    <span className="text-sm text-gray-600">120%</span>
                                </div>
                            </div>
                        </div>

                        {/* Densidad y Animaciones */}
                        <div className="card-luxury p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                    <Layout className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Interfaz y Efectos</h2>
                                    <p className="text-sm text-gray-600">Espaciado y animaciones</p>
                                </div>
                            </div>

                            {/* Density */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Densidad de Interfaz
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.entries(densityConfig).map(([key, config]) => (
                                        <button
                                            key={key}
                                            onClick={() => setDensity(key as any)}
                                            className={`p-3 rounded-lg border-2 transition-all ${density === key
                                                ? 'border-rose-gold-500 bg-rose-gold-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="font-semibold text-sm mb-1">{config.name}</div>
                                            <div className="text-xs text-gray-600">{config.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Animations */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                                <div>
                                    <div className="font-medium">Animaciones</div>
                                    <div className="text-sm text-gray-600">
                                        Habilitar transiciones y efectos visuales
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={animations}
                                        onChange={(e) => setAnimations(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-gold-600"></div>
                                </label>
                            </div>

                            {/* Border Radius */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Estilo de Bordes
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.entries(borderRadiusConfig).map(([key, config]) => (
                                        <button
                                            key={key}
                                            onClick={() => setBorderRadius(key as any)}
                                            className={`p-3 border-2 transition-all ${borderRadius === key
                                                ? 'border-rose-gold-500 bg-rose-gold-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            style={{ borderRadius: config.value }}
                                        >
                                            <div className="font-semibold text-sm mb-1">{config.name}</div>
                                            <div className="text-xs text-gray-600">{config.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Live Preview (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className="card-luxury p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-rose-gold-600" />
                                    Vista Previa
                                </h3>
                                <div className="space-y-4">
                                    {/* Color Preview */}
                                    <div
                                        className="w-full h-24 rounded-lg"
                                        style={{ background: colorSchemes[colorScheme].preview }}
                                    />

                                    {/* Text Preview */}
                                    <div
                                        className="p-4 bg-gray-50 rounded-lg"
                                        style={{
                                            fontFamily: fontFamilies[fontFamily].css,
                                            fontSize: `${fontSize}%`,
                                        }}
                                    >
                                        <h4 className="text-xl font-bold mb-2">Luxe Beauty</h4>
                                        <p className="text-gray-600 mb-2">Sistema ERP de Gestión</p>
                                        <p className="text-sm text-gray-500">
                                            Este es un ejemplo de cómo se verá el texto con tus configuraciones.
                                        </p>
                                    </div>

                                    {/* Cards Preview */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-medium text-gray-600 mb-2">Tarjetas:</div>
                                        {['Tarjeta 1', 'Tarjeta 2', 'Tarjeta 3'].map((label, i) => (
                                            <div
                                                key={i}
                                                className="p-3 bg-white border border-gray-200 transition-all"
                                                style={{ borderRadius: borderRadiusConfig[borderRadius].value }}
                                            >
                                                <div className="text-sm font-medium">{label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Current Settings Summary */}
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <div className="text-xs font-medium text-gray-600 mb-3">Configuración Actual:</div>
                                        <div className="space-y-2 text-xs text-gray-700">
                                            <div>🎨 <strong>Color:</strong> {colorSchemes[colorScheme].name}</div>
                                            <div>🔤 <strong>Fuente:</strong> {fontFamilies[fontFamily].name} ({fontSize}%)</div>
                                            <div>📏 <strong>Densidad:</strong> {densityConfig[density].name}</div>
                                            <div>✨ <strong>Animaciones:</strong> {animations ? 'Activadas' : 'Desactivadas'}</div>
                                            <div>⬜ <strong>Bordes:</strong> {borderRadiusConfig[borderRadius].name}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Note */}
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-800">
                                    💡 <strong>Nota:</strong> Los cambios se guardan automáticamente y se aplicarán en futuras actualizaciones del sistema.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
}
