'use client';

import AdminHeader from '@/components/admin/AdminHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default function AdminPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-nude-50">
            <AdminHeader />
            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-8">
                    <DashboardSidebar />
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
