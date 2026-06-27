export type TipoAreaAfectada =
  | "INFRAESTRUCTURA"
  | "APLICACIONES"
  | "BASE_DATOS"
  | "REDES_COMUNICACIONES"
  | "SEGURIDAD"
  | "DOCUMENTACION";

export type Urgencia = "CRITICO" | "ALTO" | "MEDIO" | "BAJO";

export type Impacto =
  | "EXTENSO_GENERALIZADO"
  | "SIGNIFICATIVO_GRANDE"
  | "MODERADO_LIMITADO"
  | "MENOR_LOCALIZADO";

export type Prioridad = "CRITICO" | "ALTO" | "MEDIO" | "BAJO";

export type EstadoIncidente =
  | "PENDIENTE"
  | "INVESTIGAR"
  | "CANCELAR"
  | "RESOLVER";

export interface Incidente {
  id: number;
  nombreUsuario: string;
  resumenProblema: string;
  descripcionDetallada: string;
  tipoAreaAfectada: TipoAreaAfectada;
  urgencia: Urgencia;
  impacto: Impacto;
  prioridad: Prioridad;
  estado: EstadoIncidente;
  jiraIssueKey?: string;
  jiraIssueUrl?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CrearIncidenteDTO {
  nombreUsuario: string;
  resumenProblema: string;
  descripcionDetallada: string;
  tipoAreaAfectada: TipoAreaAfectada;
  urgencia: Urgencia;
  impacto: Impacto;
  prioridad: Prioridad;
}

export interface ActualizarEstadoDTO {
  estado: EstadoIncidente;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const tipoAreaLabels: Record<TipoAreaAfectada, string> = {
  INFRAESTRUCTURA: "Infraestructura",
  APLICACIONES: "Aplicaciones",
  BASE_DATOS: "Base de Datos",
  REDES_COMUNICACIONES: "Redes y Comunicaciones",
  SEGURIDAD: "Seguridad",
  DOCUMENTACION: "Documentación",
};

export const tipoAreaColors: Record<TipoAreaAfectada, string> = {
  INFRAESTRUCTURA: "bg-slate-500/15 border-slate-500/30 text-slate-400",
  APLICACIONES: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  BASE_DATOS: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  REDES_COMUNICACIONES: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
  SEGURIDAD: "bg-red-500/15 border-red-500/30 text-red-400",
  DOCUMENTACION: "bg-amber-500/15 border-amber-500/30 text-amber-400",
};

export const urgenciaLabels: Record<Urgencia, string> = {
  CRITICO: "Crítico",
  ALTO: "Alto",
  MEDIO: "Medio",
  BAJO: "Bajo",
};

export const urgenciaColors: Record<Urgencia, string> = {
  CRITICO: "bg-red-500/15 border-red-500/30 text-red-400",
  ALTO: "bg-orange-500/15 border-orange-500/30 text-orange-400",
  MEDIO: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
  BAJO: "bg-green-500/15 border-green-500/30 text-green-400",
};

export const impactoLabels: Record<Impacto, string> = {
  EXTENSO_GENERALIZADO: "Extenso / Generalizado",
  SIGNIFICATIVO_GRANDE: "Significativo / Grande",
  MODERADO_LIMITADO: "Moderado / Limitado",
  MENOR_LOCALIZADO: "Menor / Localizado",
};

export const estadoLabels: Record<EstadoIncidente, string> = {
  PENDIENTE: "Pendiente",
  INVESTIGAR: "Investigar",
  CANCELAR: "Cancelar",
  RESOLVER: "Resolver",
};

export const estadoColors: Record<EstadoIncidente, string> = {
  PENDIENTE: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
  INVESTIGAR: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  CANCELAR: "bg-red-500/15 border-red-500/30 text-red-400",
  RESOLVER: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
};
