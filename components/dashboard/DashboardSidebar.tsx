'use client';

import { useState, useEffect } from 'react';
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
    Plug,
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
        href: '/admin/descuentos',
        icon: Tag,
        children: [
            { name: 'Ver Descuentos', href: '/admin/descuentos' },
            { name: 'Nuevo Descuento', href: '/admin/descuentos/nuevo' },
        ],
    },
    {
        name: 'Integraciones',
        href: '/admin/integraciones',
        icon: Plug,
        children: [
            { name: 'Todas', href: '/admin/integraciones' },
            { name: 'Pagos', href: '/admin/integraciones/pagos' },
            { name: 'Envíos', href: '/admin/integraciones/envios' },
            { name: 'Contabilidad', href: '/admin/integraciones/contabilidad' },
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

export default function DashboardSidebar() {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    // Auto-expand active section on mount
    useEffect(() => {
        const activeItem = menuItems.find(item =>
            item.children?.some(child => pathname === child.href || pathname.startsWith(child.href))
        );

        if (activeItem) {
            setExpandedItems([activeItem.name]);
        }
    }, [pathname]);

    const toggleExpand = (name: string) => {
        setExpandedItems(prev =>
            prev.includes(name)
                ? [] // Close if already open
                : [name] // Open only this one (close others)
        );
    };

    const isActive = (href: string) => {
        if (href === '/admin/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-64 flex-shrink-0 hidden lg:block">
            <nav className="card-luxury p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        const hasChildren = item.children && item.children.length > 0;
                        const isExpanded = expandedItems.includes(item.name);

                        return (
                            <li key={item.name}>
                                <div
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${active
                                        ? 'bg-rose-gold-50 text-rose-gold-600'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                    onClick={(e) => {
                                        if (hasChildren) {
                                            e.preventDefault();
                                            toggleExpand(item.name);
                                        }
                                    }}
                                >
                                    {hasChildren ? (
                                        <div className="flex items-center gap-3 w-full">
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium flex-1">{item.name}</span>
                                            <ChevronRight
                                                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''
                                                    }`}
                                            />
                                        </div>
                                    ) : (
                                        <Link href={item.href} className="flex items-center gap-3 w-full">
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium flex-1">{item.name}</span>
                                        </Link>
                                    )}
                                </div>

                                {/* Accordion Submenu */}
                                {hasChildren && (
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <ul className="pl-11 space-y-1">
                                            {item.children!.map((child) => (
                                                <li key={child.href}>
                                                    <Link
                                                        href={child.href}
                                                        className={`block px-4 py-2 text-sm rounded-md transition-colors ${pathname === child.href
                                                            ? 'text-rose-gold-600 font-medium bg-rose-gold-50/50'
                                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
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
