'use client';

import { ReactNode } from 'react';
import { User, hasPermission } from '@/lib/auth/rbac';

interface RoleGuardProps {
    user: User;
    resource: string;
    action: 'create' | 'read' | 'update' | 'delete';
    children: ReactNode;
    fallback?: ReactNode;
}

export default function RoleGuard({
    user,
    resource,
    action,
    children,
    fallback = null
}: RoleGuardProps) {
    const canAccess = hasPermission(user, resource, action);

    if (!canAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
