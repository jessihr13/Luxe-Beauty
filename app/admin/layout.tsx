import { ThemeProvider } from '@/components/providers/ThemeProvider';
import './theme.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider>
            <div className="admin-themed">
                {children}
            </div>
        </ThemeProvider>
    );
}
