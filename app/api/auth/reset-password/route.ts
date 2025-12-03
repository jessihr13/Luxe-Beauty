import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/lib/data/users';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token y contraseña son requeridos' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Reset password
        const success = await resetPassword(token, password);

        if (!success) {
            return NextResponse.json(
                { error: 'Token inválido o expirado' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Contraseña restablecida exitosamente' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in reset-password:', error);
        return NextResponse.json(
            { error: 'Error al restablecer la contraseña' },
            { status: 500 }
        );
    }
}
