'use client';

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tu carrito está vacío
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm">
                Descubre nuestra colección de productos de lujo y encuentra tus favoritos
            </p>
            <Link
                href="/productos"
                className="btn-primary"
            >
                Explorar Productos
            </Link>
        </div>
    );
}
