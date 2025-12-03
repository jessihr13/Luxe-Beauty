import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    variable: '--font-cormorant',
});

export const metadata: Metadata = {
    title: 'Luxe Beauty - Transforma Tu Radiancia Natural',
    description: 'Cosmética de lujo con ingredientes premium naturales',
    manifest: '/manifest.json',
    themeColor: '#E8C4B8',
    icons: {
        icon: '/favicon.ico',
        apple: '/icon-192x192.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body className={`${inter.variable} ${cormorant.variable} transition-colors duration-300 dark:bg-luxe-dark-900 dark:text-gray-100`}>
                <AuthProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
