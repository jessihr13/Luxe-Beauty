import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rutas protegidas que requieren autenticación
    const protectedRoutes = ['/admin'];

    // Verificar si la ruta actual es protegida
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        // Verificar si hay usuario en localStorage (client-side)
        // Como el middleware es server-side, no podemos acceder a localStorage
        // Así que vamos a permitir el acceso y dejar que el componente maneje la auth
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
};
