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
    ChevronDown,
    Tag,
} from 'lucide-react';

interface SubMenuItem {
    name: string;
    href: string;
}

interface MenuItem {
    name: string;
    href: string;
    icon: any;
    children?: SubMenuItem[];
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
        icon: Tag,
        href: '/admin/descuentos',
        children: [
            { name: 'Ver Descuentos', href: '/admin/descuentos' },
            { name: 'Nuevo Descuento', href: '/admin/descuentos/nuevo' },
        ]
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

export default function AdminSidebarNav() {
    const pathname = usePathname();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const isActive = (href: string) => {
        if (href === '/admin/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-64 flex-shrink-0 hidden lg:block">
            <nav className="card-luxury p-4 sticky top-24">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        const hasChildren = item.children && item.children.length > 0;

                        return (
                            <li
                                key={item.name}
                                className="relative"
                                onMouseEnter={() => hasChildren && setHoveredItem(item.name)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                                            ? 'bg-rose-gold-50 text-rose-gold-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium flex-1">{item.name}</span>
                                    {hasChildren && (
                                        <ChevronDown className={`w-4 h-4 transition-transform ${hoveredItem === item.name ? 'rotate-180' : ''
                                            }`} />
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
        </aside>
    );
}
