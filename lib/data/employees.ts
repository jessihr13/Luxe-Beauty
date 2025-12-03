// Employee Types and Data Models

export type EmployeeRole = 'admin' | 'manager' | 'sales' | 'warehouse' | 'marketing';
export type EmployeeStatus = 'active' | 'inactive' | 'vacation';

export interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: EmployeeRole;
    status: EmployeeStatus;
    salary: number;
    hireDate: Date;
    department: string;
    permissions: {
        canManageProducts: boolean;
        canManageOrders: boolean;
        canViewFinances: boolean;
        canManageEmployees: boolean;
        canManageContent: boolean;
    };
    avatar?: string;
    address?: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
}

// Sample employees
export const employees: Employee[] = [
    {
        id: 'emp_001',
        name: 'María González',
        email: 'maria.gonzalez@luxebeauty.com',
        phone: '+52 55 1234 5678',
        role: 'admin',
        status: 'active',
        salary: 15000,
        hireDate: new Date('2023-01-15'),
        department: 'Administración',
        permissions: {
            canManageProducts: true,
            canManageOrders: true,
            canViewFinances: true,
            canManageEmployees: true,
            canManageContent: true,
        },
        avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
        id: 'emp_002',
        name: 'Carlos Ramírez',
        email: 'carlos.ramirez@luxebeauty.com',
        phone: '+52 55 2345 6789',
        role: 'sales',
        status: 'active',
        salary: 5000,
        hireDate: new Date('2023-03-20'),
        department: 'Ventas',
        permissions: {
            canManageProducts: false,
            canManageOrders: true,
            canViewFinances: false,
            canManageEmployees: false,
            canManageContent: false,
        },
        avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
        id: 'emp_003',
        name: 'Ana López',
        email: 'ana.lopez@luxebeauty.com',
        phone: '+52 55 3456 7890',
        role: 'sales',
        status: 'active',
        salary: 5000,
        hireDate: new Date('2023-04-10'),
        department: 'Ventas',
        permissions: {
            canManageProducts: false,
            canManageOrders: true,
            canViewFinances: false,
            canManageEmployees: false,
            canManageContent: false,
        },
        avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
        id: 'emp_004',
        name: 'Roberto Sánchez',
        email: 'roberto.sanchez@luxebeauty.com',
        phone: '+52 55 4567 8901',
        role: 'warehouse',
        status: 'active',
        salary: 5000,
        hireDate: new Date('2023-02-01'),
        department: 'Almacén',
        permissions: {
            canManageProducts: true,
            canManageOrders: false,
            canViewFinances: false,
            canManageEmployees: false,
            canManageContent: false,
        },
        avatar: 'https://i.pravatar.cc/150?img=13',
    },
    {
        id: 'emp_005',
        name: 'Laura Martínez',
        email: 'laura.martinez@luxebeauty.com',
        phone: '+52 55 5678 9012',
        role: 'marketing',
        status: 'vacation',
        salary: 7000,
        hireDate: new Date('2023-05-15'),
        department: 'Marketing',
        permissions: {
            canManageProducts: false,
            canManageOrders: false,
            canViewFinances: false,
            canManageEmployees: false,
            canManageContent: true,
        },
        avatar: 'https://i.pravatar.cc/150?img=9',
    },
];

// Helper functions
export function getAllEmployees(): Employee[] {
    return employees;
}

export function getEmployeeById(id: string): Employee | undefined {
    return employees.find(e => e.id === id);
}

export function getEmployeesByRole(role: EmployeeRole): Employee[] {
    return employees.filter(e => e.role === role);
}

export function getActiveEmployees(): Employee[] {
    return employees.filter(e => e.status === 'active');
}

export function getTotalSalaries(): number {
    return employees.reduce((sum, e) => sum + e.salary, 0);
}

export function createEmployee(employee: Omit<Employee, 'id'>): Employee {
    const newEmployee: Employee = {
        ...employee,
        id: `emp_${Date.now()}`,
    };
    employees.push(newEmployee);
    return newEmployee;
}

export function updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) return null;

    employees[index] = { ...employees[index], ...updates };
    return employees[index];
}

export function deleteEmployee(id: string): boolean {
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) return false;

    employees.splice(index, 1);
    return true;
}

// Role metadata
export const roleInfo: Record<EmployeeRole, { name: string; icon: string; color: string }> = {
    admin: { name: 'Administrador', icon: '👑', color: 'purple' },
    manager: { name: 'Gerente', icon: '💼', color: 'blue' },
    sales: { name: 'Vendedor', icon: '🛍️', color: 'green' },
    warehouse: { name: 'Almacén', icon: '📦', color: 'orange' },
    marketing: { name: 'Marketing', icon: '📢', color: 'pink' },
};
