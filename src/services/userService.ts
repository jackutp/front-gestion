// src/services/userService.ts

export interface User {
    idUsuario: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    tipo: "CLIENTE" | "MESERO" | "COCINERO" | "ADMINISTRADOR";
    token?: string;
}

export interface CreateUserRequest {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    clave: string;
}

export interface UpdateUserRequest {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    clave?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api';

class UserService {
    private getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    }

    async getAllUsers(): Promise<User[]> {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Error al cargar los usuarios');
        }

        return response.json();
    }

    // ✅ Modificado: acepta tipo como parámetro
    async createUser(data: CreateUserRequest, tipo: string): Promise<User> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/admin/create?tipo=${tipo}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear usuario');
        }

        return response.json();
    }

    async updateUser(id: number, data: UpdateUserRequest, tipo?: string): Promise<User> {
        const token = localStorage.getItem('token');
        const url = tipo ? `${API_BASE_URL}/users/${id}?tipo=${tipo}` : `${API_BASE_URL}/users/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al actualizar usuario');
        }

        return response.json();
    }

    async deleteUser(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Error al eliminar usuario');
        }
    }
}

export const userService = new UserService();