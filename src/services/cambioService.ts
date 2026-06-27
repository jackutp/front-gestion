// src/services/cambioService.ts

import { Cambio, CrearCambioDTO, EstadoCambio, TipoCambio } from '@/types/cambio';

// ✅ CORREGIDO: API_URL ya incluye /api
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

class CambioService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        // ✅ CORREGIDO: Asegurar que no se duplique /api
        const url = `${API_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            console.log(`📡 Enviando solicitud a: ${url}`);
            const response = await fetch(url, { ...options, headers });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error(`Error en solicitud a ${endpoint}:`, error);
            throw error;
        }
    }

    async crearCambio(dto: CrearCambioDTO): Promise<Cambio> {
        // ✅ CORREGIDO: Ya no se necesita /api porque API_URL ya lo incluye
        const response = await this.request<Cambio>('/cambios/create', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
        return response.data;
    }

    async listarTodos(): Promise<Cambio[]> {
        const response = await this.request<Cambio[]>('/cambios/all');
        return response.data;
    }

    async obtenerPorId(id: number): Promise<Cambio> {
        const response = await this.request<Cambio>(`/cambios/${id}`);
        return response.data;
    }

    async obtenerPorCodigo(codigoTicket: string): Promise<Cambio> {
        const response = await this.request<Cambio>(`/cambios/codigo/${codigoTicket}`);
        return response.data;
    }

    async actualizarEstado(id: number, estado: EstadoCambio): Promise<Cambio> {
        const response = await this.request<Cambio>(
            `/cambios/${id}/estado?estado=${encodeURIComponent(estado)}`,
            { method: 'PUT' }
        );
        return response.data;
    }

    async actualizarResponsable(id: number, responsable: string): Promise<Cambio> {
        const response = await this.request<Cambio>(`/cambios/${id}/responsable`, {
            method: 'PUT',
            body: JSON.stringify({ responsable }),
        });
        return response.data;
    }

    async listarPorEstado(estado: EstadoCambio): Promise<Cambio[]> {
        const response = await this.request<Cambio[]>(`/cambios/estado/${estado}`);
        return response.data;
    }

    async listarPorTipo(tipo: TipoCambio): Promise<Cambio[]> {
        const response = await this.request<Cambio[]>(`/cambios/tipo/${tipo}`);
        return response.data;
    }

    async listarPorTipoYEstado(tipo: TipoCambio, estado: EstadoCambio): Promise<Cambio[]> {
        const response = await this.request<Cambio[]>(
            `/cambios/tipo/${tipo}/estado/${estado}`
        );
        return response.data;
    }

    async obtenerEstadisticas(): Promise<Record<string, any>> {
        const response = await this.request<Record<string, any>>('/cambios/estadisticas');
        return response.data;
    }

    async obtenerConfiguracion(): Promise<Record<string, any>> {
        const response = await this.request<Record<string, any>>('/cambios/configuracion');
        return response.data;
    }
}

const cambioService = new CambioService();
export default cambioService;
export { cambioService };