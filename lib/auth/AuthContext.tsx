'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, validateCredentials, createUser, getUserByEmail } from '@/lib/data/users';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem('luxe_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('luxe_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const validatedUser = await validateCredentials(email, password);

        if (!validatedUser) {
            return { success: false, error: 'Email o contraseña incorrectos' };
        }

        // Guardar en estado y localStorage
        setUser(validatedUser);
        localStorage.setItem('luxe_user', JSON.stringify(validatedUser));

        return { success: true };
    };

    const register = async (name: string, email: string, password: string) => {
        // Verificar si el usuario ya existe
        const existingUser = getUserByEmail(email);
        if (existingUser) {
            return { success: false, error: 'Este email ya está registrado' };
        }

        // Crear nuevo usuario
        const newUser = await createUser({
            email,
            password,
            name,
            role: 'customer', // Por defecto es customer
        });

        // Auto-login después de registro
        setUser(newUser);
        localStorage.setItem('luxe_user', JSON.stringify(newUser));

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('luxe_user');
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
