// User Management
import { config } from '../config';
import bcrypt from 'bcryptjs';

export interface User {
    id: string;
    email: string;
    password: string; // Hashed with bcrypt
    role: 'admin' | 'customer';
    name: string;
    createdAt: Date;
    resetToken?: string;
    resetTokenExpiry?: Date;
}

// Hash the admin password
const adminPasswordHash = bcrypt.hashSync('admin123', 10);

// Base de datos simulada (en memoria)
export let users: User[] = [
    {
        id: 'user_001',
        email: config.adminEmail,
        password: adminPasswordHash,
        role: 'admin',
        name: 'Administrador',
        createdAt: new Date(),
    },
];

// Funciones de gestión de usuarios
export function getAllUsers(): User[] {
    return users;
}

export function getUserByEmail(email: string): User | undefined {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
    return users.find(u => u.id === id);
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'password'> & { password: string }): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser: User = {
        ...userData,
        password: hashedPassword,
        id: `user_${Date.now()}`,
        createdAt: new Date(),
    };

    users.push(newUser);
    return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    return users[index];
}

export function deleteUser(id: string): boolean {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
}

// Autenticación con bcrypt
export async function validateCredentials(email: string, password: string): Promise<User | null> {
    const user = getUserByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
        return user;
    }

    return null;
}

export function isAdmin(email: string): boolean {
    return email.toLowerCase() === config.adminEmail.toLowerCase();
}

// Password Reset Functions
export function generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function setResetToken(email: string): { token: string; user: User } | null {
    const user = getUserByEmail(email);
    if (!user) return null;

    const token = generateResetToken();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Token válido por 1 hora

    user.resetToken = token;
    user.resetTokenExpiry = expiry;

    return { token, user };
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = users.find(u => u.resetToken === token);

    if (!user || !user.resetTokenExpiry) {
        return false;
    }

    // Check if token is expired
    if (user.resetTokenExpiry < new Date()) {
        return false;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    return true;
}
