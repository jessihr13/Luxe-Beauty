/**
 * Employees Store - Manages employee data
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type EmployeeRole = 'admin' | 'manager' | 'sales' | 'support' | 'inventory';
export type EmployeeStatus = 'active' | 'inactive' | 'vacation';

export interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: EmployeeRole;
    status: EmployeeStatus;
    department: string;
    salary: number;
    hireDate: Date;
    avatar?: string;
    permissions: {
        canManageProducts: boolean;
        canManageOrders: boolean;
        canViewFinances: boolean;
        canManageEmployees: boolean;
        canManageContent: boolean;
    };
    createdAt: string;
}

interface EmployeesStore {
    employees: Employee[];
    addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;
    deleteEmployee: (id: string) => void;
    getEmployeeById: (id: string) => Employee | undefined;
    getAllEmployees: () => Employee[];
    getEmployeesByRole: (role: EmployeeRole) => Employee[];
    getActiveEmployees: () => Employee[];
}

export const roleInfo: Record<EmployeeRole, { name: string; icon: string }> = {
    admin: { name: 'Administrador', icon: '👑' },
    manager: { name: 'Gerente', icon: '👔' },
    sales: { name: 'Ventas', icon: '💼' },
    support: { name: 'Soporte', icon: '🎧' },
    inventory: { name: 'Inventario', icon: '📦' },
};

export const useEmployeesStore = create<EmployeesStore>()(
    persist(
        (set, get) => ({
            employees: [],

            addEmployee: (employeeData) => {
                const newEmployee: Employee = {
                    ...employeeData,
                    id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                };

                set({ employees: [...get().employees, newEmployee] });
                console.log('✅ Employee added:', newEmployee.name);
            },

            updateEmployee: (id, updates) => {
                set({
                    employees: get().employees.map(employee =>
                        employee.id === id
                            ? { ...employee, ...updates }
                            : employee
                    )
                });
            },

            deleteEmployee: (id) => {
                set({
                    employees: get().employees.filter(employee => employee.id !== id)
                });
            },

            getEmployeeById: (id) => {
                return get().employees.find(e => e.id === id);
            },

            getAllEmployees: () => {
                return get().employees;
            },

            getEmployeesByRole: (role) => {
                return get().employees.filter(e => e.role === role);
            },

            getActiveEmployees: () => {
                return get().employees.filter(e => e.status === 'active');
            }
        }),
        {
            name: 'luxe-employees-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
