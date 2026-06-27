// src/types/cambio.ts

export type TipoCambio = "NORMAL" | "EMERGENCIA" | "REPETITIVO";

export type CategoriaCambio = "INFRAESTRUCTURA" | "DATABASE" | "DOCUMENTACION" | "CRONOGRAMA";

export type EstadoCambio =
    | "PENDIENTE"
    | "EN_REVISION"
    | "APROBADO"
    | "RECHAZADO"
    | "EN_IMPLEMENTACION"
    | "IMPLEMENTADO"
    | "ROLLBACK"
    | "CERRADO";

export type RiesgoCambio = "BAJO" | "MEDIO" | "ALTO";

export interface SubtareaCambio {
    titulo: string;
    descripcion: string;
    prioridad: string;
}

export interface Cambio {
    id: number;
    codigoTicket: string;
    titulo: string;
    descripcion: string;
    tipoCambio: TipoCambio;
    categoriaCambio: CategoriaCambio;
    estado: EstadoCambio;
    riesgo: RiesgoCambio;
    sistemaAfectado: string;
    planRollback?: string;
    usuarioSolicitante: string;
    areaSolicitante: string;
    responsableAsignado?: string;
    aprobadoPor?: string;
    jiraTicketId?: string;
    jiraUrl?: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    fechaAprobacion?: string;
    fechaImplementacion?: string;
    fechaCierre?: string;
    fechaVencimiento?: string;
}

export interface CrearCambioDTO {
    tipoCambio: TipoCambio;
    categoriaCambio: CategoriaCambio;
    titulo: string;
    descripcion: string;
    sistemaAfectado: string;
    planRollback?: string;
    riesgo?: RiesgoCambio;
    fechaImplementacion?: string;
    fechaVencimiento?: string;
    labels?: string[];
    assignee?: string;
    subtareas?: SubtareaCambio[];
    usuarioSolicitante: string;
    areaSolicitante: string;
    responsableAsignado?: string;
}

// Permisos por rol para cambios - SOLO ADMINISTRADOR
export const permisosCambios = {
    puedeVer: {
        ADMINISTRADOR: ['NORMAL', 'EMERGENCIA', 'REPETITIVO'] as TipoCambio[],
        MESERO: [] as TipoCambio[],
        COCINERO: [] as TipoCambio[],
        CLIENTE: [] as TipoCambio[],
    },
    puedeCrear: {
        ADMINISTRADOR: ['NORMAL', 'EMERGENCIA', 'REPETITIVO'] as TipoCambio[],
        MESERO: [] as TipoCambio[],
        COCINERO: [] as TipoCambio[],
        CLIENTE: [] as TipoCambio[],
    },
    puedeCambiarEstado: {
        ADMINISTRADOR: [
            'EN_REVISION',
            'APROBADO',
            'RECHAZADO',
            'EN_IMPLEMENTACION',
            'IMPLEMENTADO',
            'ROLLBACK',
            'CERRADO'
        ] as EstadoCambio[],
        MESERO: [] as EstadoCambio[],
        COCINERO: [] as EstadoCambio[],
        CLIENTE: [] as EstadoCambio[],
    },
};

export const estadoColorsCambio: Record<EstadoCambio, string> = {
    PENDIENTE: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
    EN_REVISION: "bg-blue-500/15 border-blue-500/30 text-blue-400",
    APROBADO: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    RECHAZADO: "bg-red-500/15 border-red-500/30 text-red-400",
    EN_IMPLEMENTACION: "bg-purple-500/15 border-purple-500/30 text-purple-400",
    IMPLEMENTADO: "bg-green-500/15 border-green-500/30 text-green-400",
    ROLLBACK: "bg-orange-500/15 border-orange-500/30 text-orange-400",
    CERRADO: "bg-gray-500/15 border-gray-500/30 text-gray-400",
};

export const estadoLabelsCambio: Record<EstadoCambio, string> = {
    PENDIENTE: "Pendiente",
    EN_REVISION: "En Revisión",
    APROBADO: "Aprobado",
    RECHAZADO: "Rechazado",
    EN_IMPLEMENTACION: "En Implementación",
    IMPLEMENTADO: "Implementado",
    ROLLBACK: "Rollback",
    CERRADO: "Cerrado",
};

export const tipoLabelsCambio: Record<TipoCambio, string> = {
    NORMAL: "Normal",
    EMERGENCIA: "Emergencia",
    REPETITIVO: "Repetitivo",
};

export const tipoColorsCambio: Record<TipoCambio, string> = {
    NORMAL: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
    EMERGENCIA: "bg-red-500/15 border-red-500/30 text-red-400",
    REPETITIVO: "bg-purple-500/15 border-purple-500/30 text-purple-400",
};

export const categoriaLabels: Record<CategoriaCambio, string> = {
    INFRAESTRUCTURA: "Infraestructura",
    DATABASE: "Base de Datos",
    DOCUMENTACION: "Documentación",
    CRONOGRAMA: "Cronograma",
};

export const riesgoLabels: Record<RiesgoCambio, string> = {
    BAJO: "Bajo",
    MEDIO: "Medio",
    ALTO: "Alto",
};

export const riesgoColors: Record<RiesgoCambio, string> = {
    BAJO: "bg-green-500/15 border-green-500/30 text-green-400",
    MEDIO: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
    ALTO: "bg-red-500/15 border-red-500/30 text-red-400",
};