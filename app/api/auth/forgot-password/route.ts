import { NextRequest, NextResponse } from 'next/server';
import { setResetToken } from '@/lib/data/users';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email es requerido' },
                { status: 400 }
            );
        }

        // Generate reset token
        const result = setResetToken(email);

        if (!result) {
            // Don't reveal if email exists or not (security)
            return NextResponse.json(
                { message: 'Si el email existe, recibirás instrucciones' },
                { status: 200 }
            );
        }

        const { token, user } = result;

        // In production, send email with reset link
        // For now, we'll log it to console
        const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        console.log('='.repeat(60));
        console.log('PASSWORD RESET REQUEST');
        console.log('='.repeat(60));
        console.log(`User: ${user.name} (${user.email})`);
        console.log(`Reset Link: ${resetLink}`);
        console.log(`Token expires in: 1 hour`);
        console.log('='.repeat(60));

        // TODO: Send email using nodemailer
        // await sendPasswordResetEmail(user.email, resetLink);

        return NextResponse.json(
            { message: 'Si el email existe, recibirás instrucciones' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in forgot-password:', error);
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        );
    }
}
