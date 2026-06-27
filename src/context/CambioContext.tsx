// src/context/CambioContext.tsx

"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Cambio, CrearCambioDTO, EstadoCambio, TipoCambio } from '@/types/cambio';
import cambioService from '@/services/cambioService';

interface CambioContextType {
    cambios: Cambio[];
    isLoading: boolean;
    error: string | null;
    listarCambios: () => Promise<void>;
    listarPorEstado: (estado: EstadoCambio) => Promise<Cambio[]>;
    listarPorTipo: (tipo: TipoCambio) => Promise<Cambio[]>;
    crearCambio: (dto: CrearCambioDTO) => Promise<Cambio | null>;
    actualizarEstado: (id: number, estado: EstadoCambio) => Promise<Cambio | null>;
    actualizarResponsable: (id: number, responsable: string) => Promise<Cambio | null>;
    obtenerCambio: (id: number) => Promise<Cambio | null>;
    obtenerEstadisticas: () => Promise<Record<string, any> | null>;
    clearError: () => void;
}

const CambioContext = createContext<CambioContextType | undefined>(undefined);

export function CambioProvider({ children }: { children: ReactNode }) {
    const [cambios, setCambios] = useState<Cambio[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        console.error('CambioContext error:', err);
    };

    const clearError = () => setError(null);

    const listarCambios = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await cambioService.listarTodos();
            setCambios(data);
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const listarPorEstado = useCallback(async (estado: EstadoCambio) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await cambioService.listarPorEstado(estado);
            return data;
        } catch (err) {
            handleError(err);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const listarPorTipo = useCallback(async (tipo: TipoCambio) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await cambioService.listarPorTipo(tipo);
            return data;
        } catch (err) {
            handleError(err);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const crearCambio = useCallback(async (dto: CrearCambioDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const newCambio = await cambioService.crearCambio(dto);
            setCambios(prev => [newCambio, ...prev]);
            return newCambio;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const actualizarEstado = useCallback(async (id: number, estado: EstadoCambio) => {
        setIsLoading(true);
        setError(null);
        try {
            const updated = await cambioService.actualizarEstado(id, estado);
            setCambios(prev => prev.map(c => c.id === id ? updated : c));
            return updated;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const actualizarResponsable = useCallback(async (id: number, responsable: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const updated = await cambioService.actualizarResponsable(id, responsable);
            setCambios(prev => prev.map(c => c.id === id ? updated : c));
            return updated;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const obtenerCambio = useCallback(async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await cambioService.obtenerPorId(id);
            return data;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const obtenerEstadisticas = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await cambioService.obtenerEstadisticas();
            return data;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <CambioContext.Provider
            value={{
                cambios,
                isLoading,
                error,
                listarCambios,
                listarPorEstado,
                listarPorTipo,
                crearCambio,
                actualizarEstado,
                actualizarResponsable,
                obtenerCambio,
                obtenerEstadisticas,
                clearError,
            }}
        >
            {children}
        </CambioContext.Provider>
    );
}

export function useCambios() {
    const context = useContext(CambioContext);
    if (context === undefined) {
        throw new Error('useCambios must be used within a CambioProvider');
    }
    return context;
}