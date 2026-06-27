// src/types/solicitud.ts

export type TipoSolicitud = 'SERVICIO' | 'INFORMACION' | 'ACCESO';
export type EstadoSolicitud = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'RECHAZADA';
export type PrioridadJira = 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
export type PrioridadLocal = 'ALTA' | 'MEDIA' | 'BAJA';
export type Rol = 'ADMINISTRADOR' | 'MESERO' | 'COCINERO' | 'CLIENTE';

// Áreas disponibles para el restaurante
export const areasRestaurante = [
    { value: "MARKETING_VENTAS", label: "Marketing y Ventas" },
    { value: "LOGISTICA_ALMACEN", label: "Logística y Almacén" },
    { value: "PRODUCCION_OPERACIONES", label: "Producción y Operaciones (Cocina)" },
    { value: "DIRECCION_GERENCIA", label: "Dirección o Gerencia General" },
    { value: "ATENCION_CLIENTE", label: "Atención al Cliente / Salón" },
    { value: "MANTENIMIENTO", label: "Mantenimiento" },
    { value: "RRHH", label: "Recursos Humanos" },
    { value: "OTROS", label: "Otros" },
];

// Mapeo de rol a área responsable por defecto
export const rolAreaResponsable: Record<Rol, string> = {
    ADMINISTRADOR: "DIRECCION_GERENCIA",
    MESERO: "ATENCION_CLIENTE",
    COCINERO: "PRODUCCION_OPERACIONES",
    CLIENTE: "ATENCION_CLIENTE",
};

// Mapeo de rol a responsable asignado
export const rolResponsableNombre: Record<Rol, string> = {
    ADMINISTRADOR: "Gerente General",
    MESERO: "Jefe de Salón",
    COCINERO: "Jefe de Cocina",
    CLIENTE: "Atención al Cliente",
};

export interface Subtarea {
    titulo: string;
    descripcion: string;
    prioridad?: PrioridadJira;
}

export interface Solicitud {
    id: number;
    codigoTicket: string;
    titulo: string;
    descripcion: string;
    tipoSolicitud: TipoSolicitud;
    estado: EstadoSolicitud;
    prioridad: PrioridadLocal;
    fechaVencimiento?: string;
    slaFechaLimite?: string;
    usuarioSolicitante?: string;
    areaSolicitante?: string;
    responsableAsignado?: string;
    fechaAsignacion?: string;
    fechaResolucion?: string;
    resolucion?: string;
    jiraTicketId?: string;
    jiraUrl?: string;
    labels?: string[];
    subtareas?: Subtarea[];
    fechaCreacion: string;
    fechaActualizacion: string;
}

export interface CrearSolicitudDTO {
    tipoSolicitud: TipoSolicitud;
    titulo: string;
    descripcion: string;
    prioridad?: PrioridadJira;
    fechaVencimiento?: string;
    labels?: string[];
    assignee?: string;
    subtareas?: Subtarea[];
    usuarioSolicitante?: string;
    areaSolicitante?: string;
    responsableAsignado?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface EstadisticasSolicitudes {
    total: number;
    pendientes: number;
    en_proceso: number;
    completadas: number;
    rechazadas: number;
    por_tipo: {
        servicio: number;
        informacion: number;
        acceso: number;
    };
}

// Permisos por rol
export const permisosSolicitudes = {
    puedeCrear: {
        ADMINISTRADOR: ['SERVICIO', 'INFORMACION', 'ACCESO'],
        MESERO: ['SERVICIO', 'INFORMACION', 'ACCESO'],
        COCINERO: ['SERVICIO', 'INFORMACION'],
        CLIENTE: ['SERVICIO', 'INFORMACION'],
    } as Record<string, string[]>,

    puedeVer: {
        ADMINISTRADOR: ['SERVICIO', 'INFORMACION', 'ACCESO'],
        MESERO: ['SERVICIO', 'INFORMACION', 'ACCESO'],
        COCINERO: ['SERVICIO', 'INFORMACION'],
        CLIENTE: ['SERVICIO', 'INFORMACION'],
    } as Record<string, string[]>,

    puedeCambiarEstado: {
        ADMINISTRADOR: ['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'RECHAZADA'],
        MESERO: [],
        COCINERO: [],
        CLIENTE: [],
    } as Record<string, string[]>,
};