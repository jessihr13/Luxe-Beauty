'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Warehouse,
    ShoppingCart,
    Users,
    DollarSign,
    Megaphone,
    BarChart3,
    Settings,
    ChevronRight,
    Tag,
} from 'lucide-react';

interface MenuItem {
    name: string;
    href: string;
    icon: any;
    children?: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
    {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Productos',
        href: '/admin/productos',
        icon: Package,
        children: [
            { name: 'Lista de Productos', href: '/admin/productos' },
            { name: 'Nuevo Producto', href: '/admin/productos/nuevo' },
        ],
    },
    {
        name: 'Inventario',
        href: '/admin/inventario',
        icon: Warehouse,
        children: [
            { name: 'Stock Actual', href: '/admin/inventario' },
            { name: 'Movimientos', href: '/admin/inventario/movimientos' },
        ],
    },
    {
        name: 'Pedidos',
        href: '/admin/pedidos',
        icon: ShoppingCart,
        children: [
            { name: 'Todos los Pedidos', href: '/admin/pedidos' },
            { name: 'Nuevo Pedido', href: '/admin/pedidos/nuevo' },
        ],
    },
    {
        name: 'Empleados',
        href: '/admin/empleados',
        icon: Users,
        children: [
            { name: 'Lista de Empleados', href: '/admin/empleados' },
            { name: 'Nuevo Empleado', href: '/admin/empleados/nuevo' },
        ],
    },
    {
        name: 'Finanzas',
        href: '/admin/finanzas/gastos',
        icon: DollarSign,
        children: [
            { name: 'Gastos', href: '/admin/finanzas/gastos' },
            { name: 'Nuevo Gasto', href: '/admin/finanzas/gastos/nuevo' },
            { name: 'Reportes', href: '/admin/finanzas/reportes' },
        ],
    },
    {
        name: 'Marketing',
        href: '/admin/marketing',
        icon: Megaphone,
        children: [
            { name: 'Campañas', href: '/admin/marketing' },
            { name: 'Nueva Campaña', href: '/admin/marketing/nueva' },
        ],
    },
    {
        name: 'Descuentos',
        href: '/admin/descuentos',
        icon: Tag,
        children: [
            { name: 'Ver Descuentos', href: '/admin/descuentos' },
            { name: 'Nuevo Descuento', href: '/admin/descuentos/nuevo' },
        ],
    },
    {
        name: 'Reportes',
        href: '/admin/reportes',
        icon: BarChart3,
        children: [
            { name: 'Resumen', href: '/admin/reportes' },
            { name: 'Rentabilidad', href: '/admin/reportes/rentabilidad' },
            { name: 'Cohortes', href: '/admin/reportes/cohortes' },
            { name: 'Demanda', href: '/admin/reportes/demanda' },
            { name: 'Ejecutivo', href: '/admin/reportes/ejecutivo' },
        ],
    },
    {
        name: 'Configuración',
        href: '/admin/configuracion',
        icon: Settings,
        children: [
            { name: 'General', href: '/admin/configuracion' },
            { name: 'Notificaciones', href: '/admin/configuracion/notificaciones' },
            { name: 'Apariencia', href: '/admin/configuracion/apariencia' },
        ],
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const isActive = (href: string) => {
        if (href === '/admin/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 flex flex-col">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-serif font-bold gradient-text">
                    Luxe Beauty
                </h1>
                <p className="text-xs text-gray-500 mt-1">Panel de Administración</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        const hasChildren = item.children && item.children.length > 0;

                        return (
                            <li
                                key={item.name}
                                className="relative"
                                onMouseEnter={() => setHoveredItem(item.name)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                                            ? 'bg-gradient-to-r from-rose-gold-500 to-rose-gold-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium flex-1">{item.name}</span>
                                    {hasChildren && (
                                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                {hasChildren && hoveredItem === item.name && (
                                    <div className="absolute left-full top-0 ml-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                        {item.children!.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={`block px-4 py-2 text-sm transition-colors ${pathname === child.href
                                                        ? 'bg-rose-gold-50 text-rose-gold-700 font-medium'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                    v1.0.0 Beta
                </div>
            </div>
        </aside>
    );
}
