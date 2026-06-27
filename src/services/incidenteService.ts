import { Incidente, CrearIncidenteDTO, ActualizarEstadoDTO } from '@/types/incidente';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api';

class IncidenteService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async crearIncidente(dto: CrearIncidenteDTO): Promise<Incidente> {
    const response = await fetch(`${API_URL}/incidentes/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al crear la incidencia');
    }
    return response.json();
  }

  async listarTodos(): Promise<Incidente[]> {
    const response = await fetch(`${API_URL}/incidentes/all`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al cargar las incidencias');
    }
    return response.json();
  }

  async obtenerPorId(id: number): Promise<Incidente> {
    const response = await fetch(`${API_URL}/incidentes/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al cargar la incidencia');
    }
    return response.json();
  }

  async actualizarEstado(id: number, dto: ActualizarEstadoDTO): Promise<Incidente> {
    const response = await fetch(`${API_URL}/incidentes/${id}/estado`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al actualizar el estado');
    }
    return response.json();
  }

  async listarPorEstado(estado: string): Promise<Incidente[]> {
    const response = await fetch(`${API_URL}/incidentes/estado/${encodeURIComponent(estado)}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al cargar las incidencias');
    }
    return response.json();
  }

  async listarPorUsuario(nombreUsuario: string): Promise<Incidente[]> {
    const response = await fetch(`${API_URL}/incidentes/usuario/${encodeURIComponent(nombreUsuario)}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al cargar las incidencias');
    }
    return response.json();
  }

  async eliminar(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/incidentes/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al eliminar la incidencia');
    }
  }
}

export const incidenteService = new IncidenteService();
