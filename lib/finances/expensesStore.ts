/**
 * Expenses Store - Manages business expenses
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ExpenseCategory = 'inventory' | 'marketing' | 'operations' | 'salaries' | 'rent' | 'utilities' | 'other' | 'logistics' | 'general' | 'technology';

export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    vendor?: string;
    notes?: string;
    paymentMethod?: 'cash' | 'card' | 'transfer' | 'other';
    status?: 'pending' | 'paid' | 'cancelled';
    createdAt: string;
}

interface ExpensesStore {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
    updateExpense: (id: string, updates: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;
    getAllExpenses: () => Expense[];
    getTotalExpenses: () => number;
    getTotalExpensesByCategory: () => Record<ExpenseCategory, number>;
    getExpensesByDateRange: (startDate: string, endDate: string) => Expense[];
}

export const categoryInfo: Record<ExpenseCategory, { name: string; icon: string; color: string }> = {
    inventory: { name: 'Inventario', icon: '📦', color: 'blue' },
    marketing: { name: 'Marketing', icon: '📢', color: 'purple' },
    operations: { name: 'Operaciones', icon: '⚙️', color: 'gray' },
    salaries: { name: 'Salarios', icon: '👥', color: 'green' },
    rent: { name: 'Renta', icon: '🏢', color: 'orange' },
    utilities: { name: 'Servicios', icon: '💡', color: 'yellow' },
    other: { name: 'Otros', icon: '📝', color: 'gray' },
    logistics: { name: 'Logística', icon: '🚚', color: 'blue' },
    general: { name: 'Generales', icon: '🏢', color: 'gray' },
    technology: { name: 'Tecnología', icon: '💻', color: 'indigo' },
};

export const useExpensesStore = create<ExpensesStore>()(
    persist(
        (set, get) => ({
            expenses: [],

            addExpense: (expenseData) => {
                const newExpense: Expense = {
                    ...expenseData,
                    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                };

                set({ expenses: [...get().expenses, newExpense] });
                console.log('✅ Expense added:', newExpense.description);
            },

            updateExpense: (id, updates) => {
                set({
                    expenses: get().expenses.map(expense =>
                        expense.id === id
                            ? { ...expense, ...updates }
                            : expense
                    )
                });
            },

            deleteExpense: (id) => {
                set({
                    expenses: get().expenses.filter(expense => expense.id !== id)
                });
            },

            getAllExpenses: () => {
                return get().expenses.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
            },

            getTotalExpenses: () => {
                return get().expenses.reduce((sum, expense) => sum + expense.amount, 0);
            },

            getTotalExpensesByCategory: () => {
                const totals: Record<ExpenseCategory, number> = {
                    inventory: 0,
                    marketing: 0,
                    operations: 0,
                    salaries: 0,
                    rent: 0,
                    utilities: 0,
                    other: 0,
                    logistics: 0,
                    general: 0,
                    technology: 0,
                };

                get().expenses.forEach(expense => {
                    totals[expense.category] += expense.amount;
                });

                return totals;
            },

            getExpensesByDateRange: (startDate, endDate) => {
                return get().expenses.filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
                });
            }
        }),
        {
            name: 'luxe-expenses-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
