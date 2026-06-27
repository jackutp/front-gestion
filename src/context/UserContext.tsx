// src/context/UserContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService, User, CreateUserRequest, UpdateUserRequest } from '@/services/userService';
import { useAuth } from './AuthContext';

interface UserContextType {
    users: User[];
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    createUser: (data: CreateUserRequest, tipo: string) => Promise<User | null>;  // ← Agregar tipo
    updateUser: (id: number, data: UpdateUserRequest, tipo?: string) => Promise<User | null>;
    deleteUser: (id: number) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, hasRole } = useAuth();

    const fetchUsers = async () => {
        if (!isAuthenticated || !hasRole('ADMINISTRADOR')) return;

        setIsLoading(true);
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const createUser = async (data: CreateUserRequest, tipo: string): Promise<User | null> => {
        try {
            const newUser = await userService.createUser(data, tipo);
            await fetchUsers();
            return newUser;
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    };

    const updateUser = async (id: number, data: UpdateUserRequest, tipo?: string): Promise<User | null> => {
        try {
            const updatedUser = await userService.updateUser(id, data, tipo);
            await fetchUsers();
            return updatedUser;
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    };

    const deleteUser = async (id: number): Promise<boolean> => {
        try {
            await userService.deleteUser(id);
            await fetchUsers();
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        }
    };

    useEffect(() => {
        if (isAuthenticated && hasRole('ADMINISTRADOR')) {
            fetchUsers();
        }
    }, [isAuthenticated]);

    return (
        <UserContext.Provider
            value={{
                users,
                isLoading,
                error,
                fetchUsers,
                createUser,
                updateUser,
                deleteUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUsers() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUsers must be used within a UserProvider');
    }
    return context;
}