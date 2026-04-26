// Role-Based Access Control System

export enum UserRole {
    ADMIN = 'admin',
    LOGISTICS = 'logistics',
    MARKETING = 'marketing',
    CUSTOMER = 'customer',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface Permission {
    resource: string;
    actions: ('create' | 'read' | 'update' | 'delete')[];
}

// Define permissions for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
        { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'orders', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'content', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'analytics', actions: ['read'] },
        { resource: 'settings', actions: ['read', 'update'] },
    ],
    [UserRole.LOGISTICS]: [
        { resource: 'orders', actions: ['read', 'update'] },
        { resource: 'products', actions: ['read'] }, // View only for stock info
    ],
    [UserRole.MARKETING]: [
        { resource: 'content', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'products', actions: ['read', 'update'] }, // Can edit descriptions, images
        { resource: 'analytics', actions: ['read'] },
    ],
    [UserRole.CUSTOMER]: [
        { resource: 'products', actions: ['read'] },
        { resource: 'orders', actions: ['create', 'read'] }, // Own orders only
    ],
};

// Check if user has permission
export function hasPermission(
    user: User,
    resource: string,
    action: 'create' | 'read' | 'update' | 'delete'
): boolean {
    const permissions = rolePermissions[user.role];
    const resourcePermission = permissions.find(p => p.resource === resource);

    if (!resourcePermission) return false;
    return resourcePermission.actions.includes(action);
}

// Check if user can access route
export function canAccessRoute(user: User, route: string): boolean {
    const routePermissions: Record<string, UserRole[]> = {
        '/admin/dashboard': [UserRole.ADMIN],
        '/admin/products': [UserRole.ADMIN, UserRole.MARKETING],
        '/admin/orders': [UserRole.ADMIN, UserRole.LOGISTICS],
        '/admin/content': [UserRole.ADMIN, UserRole.MARKETING],
        '/admin/analytics': [UserRole.ADMIN, UserRole.MARKETING],
        '/admin/users': [UserRole.ADMIN],
    };

    const allowedRoles = routePermissions[route];
    if (!allowedRoles) return false;

    return allowedRoles.includes(user.role);
}

// Mock user for demo (in production, this would come from auth)
export function getCurrentUser(): User {
    // This would normally come from session/JWT
    return {
        id: 'user_001',
        name: 'Admin User',
        email: 'admin@luxebeauty.com',
        role: UserRole.ADMIN,
    };
}

// Get user display name for role
export function getRoleDisplayName(role: UserRole): string {
    const displayNames: Record<UserRole, string> = {
        [UserRole.ADMIN]: 'Administrador',
        [UserRole.LOGISTICS]: 'Logística',
        [UserRole.MARKETING]: 'Marketing',
        [UserRole.CUSTOMER]: 'Cliente',
    };

    return displayNames[role];
}

// Get accessible menu items based on role
export function getAccessibleMenuItems(user: User) {
    const allMenuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '📊',
            route: '/admin/dashboard',
            roles: [UserRole.ADMIN],
        },
        {
            id: 'products',
            label: 'Productos',
            icon: '📦',
            route: '/admin/products',
            roles: [UserRole.ADMIN, UserRole.MARKETING],
        },
        {
            id: 'orders',
            label: 'Pedidos',
            icon: '🛍️',
            route: '/admin/orders',
            roles: [UserRole.ADMIN, UserRole.LOGISTICS],
        },
        {
            id: 'content',
            label: 'Contenido',
            icon: '✏️',
            route: '/admin/content',
            roles: [UserRole.ADMIN, UserRole.MARKETING],
        },
        {
            id: 'analytics',
            label: 'Analíticas',
            icon: '📈',
            route: '/admin/analytics',
            roles: [UserRole.ADMIN, UserRole.MARKETING],
        },
        {
            id: 'users',
            label: 'Usuarios',
            icon: '👥',
            route: '/admin/users',
            roles: [UserRole.ADMIN],
        },
    ];

    return allMenuItems.filter(item => item.roles.includes(user.role));
}
