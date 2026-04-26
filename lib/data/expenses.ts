// Expense Types and Data Models

export type ExpenseCategory = 'logistics' | 'marketing' | 'salaries' | 'general' | 'inventory' | 'technology';

export interface Expense {
    id: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
    date: Date;
    relatedTo?: string; // ID de producto, campaña, etc.
    paymentMethod?: 'cash' | 'card' | 'transfer' | 'other';
    status: 'pending' | 'paid' | 'cancelled';
    notes?: string;
}

// Sample expenses
export const expenses: Expense[] = [
    {
        id: 'exp_001',
        category: 'logistics',
        description: 'Envíos nacionales - Noviembre',
        amount: 8500,
        date: new Date('2024-11-15'),
        paymentMethod: 'transfer',
        status: 'paid',
        notes: 'Paquetería DHL',
    },
    {
        id: 'exp_002',
        category: 'logistics',
        description: 'Embalaje y materiales',
        amount: 3200,
        date: new Date('2024-11-10'),
        paymentMethod: 'card',
        status: 'paid',
    },
    {
        id: 'exp_003',
        category: 'logistics',
        description: 'Almacenamiento',
        amount: 3300,
        date: new Date('2024-11-01'),
        paymentMethod: 'transfer',
        status: 'paid',
    },
    {
        id: 'exp_004',
        category: 'marketing',
        description: 'Campaña Facebook Ads',
        amount: 12000,
        date: new Date('2024-11-20'),
        paymentMethod: 'card',
        status: 'paid',
        relatedTo: 'campaign_001',
    },
    {
        id: 'exp_005',
        category: 'marketing',
        description: 'Instagram Influencers',
        amount: 8000,
        date: new Date('2024-11-18'),
        paymentMethod: 'transfer',
        status: 'paid',
    },
    {
        id: 'exp_006',
        category: 'marketing',
        description: 'Google Ads',
        amount: 5000,
        date: new Date('2024-11-12'),
        paymentMethod: 'card',
        status: 'paid',
    },
    {
        id: 'exp_007',
        category: 'salaries',
        description: 'Nómina - Gerente',
        amount: 15000,
        date: new Date('2024-11-30'),
        paymentMethod: 'transfer',
        status: 'paid',
    },
    {
        id: 'exp_008',
        category: 'salaries',
        description: 'Nómina - Vendedores (2)',
        amount: 10000,
        date: new Date('2024-11-30'),
        paymentMethod: 'transfer',
        status: 'paid',
    },
    {
        id: 'exp_009',
        category: 'salaries',
        description: 'Nómina - Almacén',
        amount: 5000,
        date: new Date('2024-11-30'),
        paymentMethod: 'transfer',
        status: 'paid',
    },
    {
        id: 'exp_010',
        category: 'general',
        description: 'Servicios (Luz, Agua, Internet)',
        amount: 2500,
        date: new Date('2024-11-05'),
        paymentMethod: 'transfer',
        status: 'paid',
    },
    {
        id: 'exp_011',
        category: 'general',
        description: 'Papelería y suministros',
        amount: 1200,
        date: new Date('2024-11-08'),
        paymentMethod: 'cash',
        status: 'paid',
    },
    {
        id: 'exp_012',
        category: 'general',
        description: 'Mantenimiento oficina',
        amount: 4300,
        date: new Date('2024-11-22'),
        paymentMethod: 'card',
        status: 'paid',
    },
    {
        id: 'exp_013',
        category: 'technology',
        description: 'Hosting y dominio',
        amount: 1500,
        date: new Date('2024-11-01'),
        paymentMethod: 'card',
        status: 'paid',
    },
    {
        id: 'exp_014',
        category: 'technology',
        description: 'Software de gestión',
        amount: 2800,
        date: new Date('2024-11-15'),
        paymentMethod: 'card',
        status: 'paid',
    },
];

// Helper functions
export function getAllExpenses(): Expense[] {
    return expenses;
}

export function getExpenseById(id: string): Expense | undefined {
    return expenses.find(e => e.id === id);
}

export function getExpensesByCategory(category: ExpenseCategory): Expense[] {
    return expenses.filter(e => e.category === category);
}

export function getTotalExpenses(): number {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getTotalExpensesByCategory(category: ExpenseCategory): number {
    return expenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);
}

export function getExpensesByDateRange(startDate: Date, endDate: Date): Expense[] {
    return expenses.filter(e => e.date >= startDate && e.date <= endDate);
}

export function createExpense(expense: Omit<Expense, 'id'>): Expense {
    const newExpense: Expense = {
        ...expense,
        id: `exp_${Date.now()}`,
    };
    expenses.push(newExpense);
    return newExpense;
}

export function updateExpense(id: string, updates: Partial<Expense>): Expense | null {
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) return null;

    expenses[index] = { ...expenses[index], ...updates };
    return expenses[index];
}

export function deleteExpense(id: string): boolean {
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) return false;

    expenses.splice(index, 1);
    return true;
}

// Category metadata
export const categoryInfo: Record<ExpenseCategory, { name: string; icon: string; color: string }> = {
    logistics: { name: 'Logística', icon: '🚚', color: 'blue' },
    marketing: { name: 'Marketing', icon: '📢', color: 'purple' },
    salaries: { name: 'Salarios', icon: '👥', color: 'green' },
    general: { name: 'Generales', icon: '🏢', color: 'gray' },
    inventory: { name: 'Inventario', icon: '📦', color: 'orange' },
    technology: { name: 'Tecnología', icon: '💻', color: 'indigo' },
};
