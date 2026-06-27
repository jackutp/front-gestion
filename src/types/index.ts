export type Prioridad = "Alta" | "Media" | "Baja";
export type Estado = "Pendiente" | "En Proceso" | "Resuelta" | "Rechazada";
export type Departamento = "Cocina" | "Sala" | "Administración";
export type TipoCambio = "Horario" | "Personal" | "Procedimiento" | "Menú";
export type TipoIncidencia = "Técnica" | "Operativa" | "Cliente" | "Proveedor";
export type Urgencia = "Crítica" | "Urgente" | "Normal";

export interface User {
  id: number;
  nombre: string;
  rol: string;
  email: string;
  foto?: string;
}

export interface Solicitud {
  id: number;
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  departamento: Departamento;
  fechaRequerida: string;
  estado: Estado;
  createdAt: string;
}

export interface Cambio {
  id: number;
  tipo: TipoCambio;
  descripcion: string;
  razon: string;
  fechaPropuesta: string;
  estado: Estado;
  createdAt: string;
}

export interface Incidencia {
  id: number;
  tipo: TipoIncidencia;
  descripcion: string;
  urgencia: Urgencia;
  ubicacion: string;
  estado: Estado;
  createdAt: string;
}

// AÑADIR NUEVA GESTIÓN AQUÍ - Agrega nuevas interfaces para futuras gestiones
