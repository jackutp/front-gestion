// src/app/usuario/components/DetalleSolicitudModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, Tag, User, Hash, Clock, CheckCircle, XCircle, PlayCircle, Users, FileText, Award, Edit2 } from "lucide-react";
import { Solicitud, EstadoSolicitud, Rol } from "@/types/solicitud";
import { useSolicitudes } from "@/context/SolicitudContext";
import { useState } from "react";

interface DetalleSolicitudModalProps {
    isOpen: boolean;
    solicitud: Solicitud | null;
    onClose: () => void;
    onEstadoActualizado: () => void;
    puedeCambiarEstado: string[];
    rol: Rol;
}

interface Accion {
    estado: EstadoSolicitud;
    label: string;
    icon: React.ElementType;
    color: string;
}

const estadoColors: Record<EstadoSolicitud, string> = {
    PENDIENTE: "bg-yellow-500/15 text-yellow-400",
    EN_PROCESO: "bg-blue-500/15 text-blue-400",
    COMPLETADA: "bg-emerald-500/15 text-emerald-400",
    RECHAZADA: "bg-red-500/15 text-red-400",
};

const estadoLabels: Record<EstadoSolicitud, string> = {
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En Proceso",
    COMPLETADA: "Completada",
    RECHAZADA: "Rechazada",
};

const tipoLabels: Record<string, string> = {
    SERVICIO: "Servicio",
    INFORMACION: "Información",
    ACCESO: "Acceso",
};

const prioridadLabels: Record<string, string> = {
    ALTA: "Alta",
    MEDIA: "Media",
    BAJA: "Baja",
};

// Opciones para responsable asignado
const opcionesResponsable = [
    { value: "Gerente General", label: "Gerente General" },
    { value: "Jefe de Cocina", label: "Jefe de Cocina" },
    { value: "Jefe de Salón", label: "Jefe de Salón" },
    { value: "Soporte Técnico", label: "Soporte Técnico" },
    { value: "Atención al Cliente", label: "Atención al Cliente" },
    { value: "Mantenimiento", label: "Mantenimiento" },
    { value: "Recursos Humanos", label: "Recursos Humanos" },
];

export default function DetalleSolicitudModal({
    isOpen,
    solicitud,
    onClose,
    onEstadoActualizado,
    puedeCambiarEstado,
    rol
}: DetalleSolicitudModalProps) {
    // ✅ CORREGIDO: Agregar actualizarResponsable
    const { actualizarEstado, actualizarResponsable, actualizarResolucion, isLoading } = useSolicitudes();
    const [editandoResponsable, setEditandoResponsable] = useState(false);
    const [editandoResolucion, setEditandoResolucion] = useState(false);
    const [nuevoResponsable, setNuevoResponsable] = useState("");
    const [nuevaResolucion, setNuevaResolucion] = useState("");

    const esAdmin = rol === 'ADMINISTRADOR';

    const handleCambiarEstado = async (nuevoEstado: EstadoSolicitud) => {
        if (solicitud && puedeCambiarEstado.includes(nuevoEstado)) {
            const result = await actualizarEstado(solicitud.id, nuevoEstado);
            if (result) {
                onEstadoActualizado();
            }
        }
    };

    // ✅ CORREGIDO: Ahora usa actualizarResponsable correctamente
    const handleGuardarResponsable = async () => {
        if (solicitud && nuevoResponsable) {
            const result = await actualizarResponsable(solicitud.id, nuevoResponsable);
            if (result) {
                setEditandoResponsable(false);
                onEstadoActualizado();
            }
        }
    };

    // ✅ CORREGIDO: Ahora usa actualizarResolucion correctamente
    const handleGuardarResolucion = async () => {
        if (solicitud && nuevaResolucion) {
            const result = await actualizarResolucion(solicitud.id, nuevaResolucion);
            if (result) {
                setEditandoResolucion(false);
                onEstadoActualizado();
            }
        }
    };

    const getAccionesDisponibles = (): Accion[] => {
        if (!esAdmin) return [];

        const acciones: Accion[] = [];
        if (!solicitud) return acciones;

        switch (solicitud.estado) {
            case "PENDIENTE":
                acciones.push({
                    estado: "EN_PROCESO",
                    label: "Asignar y Iniciar",
                    icon: PlayCircle,
                    color: "blue"
                });
                acciones.push({
                    estado: "RECHAZADA",
                    label: "Rechazar",
                    icon: XCircle,
                    color: "red"
                });
                break;
            case "EN_PROCESO":
                acciones.push({
                    estado: "COMPLETADA",
                    label: "Completar",
                    icon: CheckCircle,
                    color: "green"
                });
                acciones.push({
                    estado: "RECHAZADA",
                    label: "Rechazar",
                    icon: XCircle,
                    color: "red"
                });
                break;
            case "RECHAZADA":
                acciones.push({
                    estado: "PENDIENTE",
                    label: "Reabrir",
                    icon: PlayCircle,
                    color: "yellow"
                });
                break;
            default:
                break;
        }
        return acciones;
    };

    if (!isOpen || !solicitud) return null;

    const accionesDisponibles = getAccionesDisponibles();

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#121214] border border-stone-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-[#121214] border-b border-stone-800 px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 className="font-serif text-xl text-white">Detalle de Solicitud</h2>
                            <span className={`px-2 py-0.5 rounded text-xs uppercase tracking-widest ${estadoColors[solicitud.estado]}`}>
                                {estadoLabels[solicitud.estado]}
                            </span>
                        </div>
                        <button onClick={onClose} className="p-1 rounded hover:bg-stone-800 transition-colors">
                            <X className="w-5 h-5 text-stone-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Código y tipo */}
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-widest mb-1">
                                    <Hash className="w-3 h-3" />
                                    Código de Ticket
                                </div>
                                <p className="text-white font-mono text-sm">{solicitud.codigoTicket}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-stone-500 text-xs uppercase tracking-widest mb-1">Tipo</div>
                                <p className="text-white text-sm">{tipoLabels[solicitud.tipoSolicitud]}</p>
                            </div>
                        </div>

                        {/* Título */}
                        <div>
                            <h3 className="text-white font-serif text-xl">{solicitud.titulo}</h3>
                        </div>

                        {/* Descripción */}
                        <div>
                            <div className="text-stone-500 text-xs uppercase tracking-widest mb-2">Descripción</div>
                            <p className="text-stone-300 text-sm whitespace-pre-wrap">{solicitud.descripcion}</p>
                        </div>

                        {/* Metadatos */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-stone-900/30 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-stone-500 mt-0.5" />
                                <div>
                                    <div className="text-stone-500 text-xs uppercase tracking-widest">Fecha de Creación</div>
                                    <p className="text-white text-sm">{new Date(solicitud.fechaCreacion).toLocaleString("es-PE")}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Award className="w-4 h-4 text-stone-500 mt-0.5" />
                                <div>
                                    <div className="text-stone-500 text-xs uppercase tracking-widest">Prioridad</div>
                                    <p className="text-white text-sm">{prioridadLabels[solicitud.prioridad] || solicitud.prioridad}</p>
                                </div>
                            </div>
                            {solicitud.fechaVencimiento && (
                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Fecha de Vencimiento</div>
                                        <p className="text-white text-sm">{new Date(solicitud.fechaVencimiento).toLocaleDateString("es-PE")}</p>
                                    </div>
                                </div>
                            )}
                            {solicitud.usuarioSolicitante && (
                                <div className="flex items-start gap-2">
                                    <User className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Solicitante</div>
                                        <p className="text-white text-sm">{solicitud.usuarioSolicitante}</p>
                                    </div>
                                </div>
                            )}
                            {solicitud.areaSolicitante && (
                                <div className="flex items-start gap-2">
                                    <Users className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Área</div>
                                        <p className="text-white text-sm">{solicitud.areaSolicitante}</p>
                                    </div>
                                </div>
                            )}

                            {/* RESPONSABLE ASIGNADO - EDITABLE POR ADMIN */}
                            <div className="flex items-start gap-2 col-span-2">
                                <User className="w-4 h-4 text-stone-500 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Responsable Asignado</div>
                                        {esAdmin && !editandoResponsable && solicitud.estado !== "COMPLETADA" && (
                                            <button
                                                onClick={() => {
                                                    setNuevoResponsable(solicitud.responsableAsignado || "");
                                                    setEditandoResponsable(true);
                                                }}
                                                className="text-stone-500 hover:text-[#C6A96B] transition-colors"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                    {editandoResponsable ? (
                                        <div className="flex gap-2 mt-1">
                                            <select
                                                value={nuevoResponsable}
                                                onChange={(e) => setNuevoResponsable(e.target.value)}
                                                className="flex-1 px-2 py-1 bg-stone-800 border border-stone-700 rounded text-white text-sm"
                                            >
                                                <option value="">Seleccionar responsable...</option>
                                                {opcionesResponsable.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleGuardarResponsable}
                                                className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => setEditandoResponsable(false)}
                                                className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-white text-sm">{solicitud.responsableAsignado || "No asignado"}</p>
                                    )}
                                </div>
                            </div>

                            {/* FECHA ASIGNACIÓN */}
                            {solicitud.fechaAsignacion && (
                                <div className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Fecha de Asignación</div>
                                        <p className="text-white text-sm">{new Date(solicitud.fechaAsignacion).toLocaleString("es-PE")}</p>
                                    </div>
                                </div>
                            )}

                            {/* RESOLUCIÓN - EDITABLE POR ADMIN */}
                            <div className="flex items-start gap-2 col-span-2">
                                <FileText className="w-4 h-4 text-stone-500 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Resolución</div>
                                        {esAdmin && !editandoResolucion && solicitud.estado !== "PENDIENTE" && (
                                            <button
                                                onClick={() => {
                                                    setNuevaResolucion(solicitud.resolucion || "");
                                                    setEditandoResolucion(true);
                                                }}
                                                className="text-stone-500 hover:text-[#C6A96B] transition-colors"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                    {editandoResolucion ? (
                                        <div className="flex flex-col gap-2 mt-1">
                                            <textarea
                                                value={nuevaResolucion}
                                                onChange={(e) => setNuevaResolucion(e.target.value)}
                                                rows={3}
                                                placeholder="Describe cómo se resolvió la solicitud..."
                                                className="w-full px-2 py-1 bg-stone-800 border border-stone-700 rounded text-white text-sm"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleGuardarResolucion}
                                                    className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={() => setEditandoResolucion(false)}
                                                    className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-stone-300 text-sm whitespace-pre-wrap">
                                            {solicitud.resolucion || "Sin resolución aún"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {solicitud.fechaResolucion && (
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Fecha de Resolución</div>
                                        <p className="text-white text-sm">{new Date(solicitud.fechaResolucion).toLocaleString("es-PE")}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Labels */}
                        {solicitud.labels && solicitud.labels.length > 0 && (
                            <div>
                                <div className="text-stone-500 text-xs uppercase tracking-widest mb-2">Etiquetas</div>
                                <div className="flex flex-wrap gap-2">
                                    {solicitud.labels.map((label, idx) => (
                                        <span key={idx} className="bg-stone-800/50 px-2 py-1 rounded text-stone-400 text-xs">
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Subtareas */}
                        {solicitud.subtareas && solicitud.subtareas.length > 0 && (
                            <div>
                                <div className="text-stone-500 text-xs uppercase tracking-widest mb-2">Subtareas</div>
                                <div className="space-y-2">
                                    {solicitud.subtareas.map((sub, idx) => (
                                        <div key={idx} className="p-3 bg-stone-900/30 rounded-lg">
                                            <p className="text-white text-sm font-medium">{sub.titulo}</p>
                                            <p className="text-stone-400 text-xs mt-1">{sub.descripcion}</p>
                                            {sub.prioridad && (
                                                <span className="inline-block mt-1 text-xs text-stone-500">Prioridad: {sub.prioridad}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Ticket Jira */}
                        {solicitud.jiraTicketId && (
                            <div>
                                <div className="text-stone-500 text-xs uppercase tracking-widest mb-2">Ticket en Jira</div>
                                <a
                                    href={solicitud.jiraUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#C6A96B] hover:underline"
                                >
                                    {solicitud.jiraTicketId}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        )}

                        {/* Acciones - SOLO ADMIN */}
                        {esAdmin && accionesDisponibles.length > 0 && (
                            <div className="pt-4 border-t border-stone-800">
                                <div className="text-stone-500 text-xs uppercase tracking-widest mb-3">Acciones (Administrador)</div>
                                <div className="flex gap-3 flex-wrap">
                                    {accionesDisponibles.map((accion) => (
                                        <button
                                            key={accion.estado}
                                            onClick={() => handleCambiarEstado(accion.estado)}
                                            disabled={isLoading}
                                            className={`flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors ${accion.color === "blue" ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" :
                                                accion.color === "green" ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" :
                                                    accion.color === "red" ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" :
                                                        "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                                }`}
                                        >
                                            <accion.icon className="w-4 h-4" />
                                            {accion.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mensaje para no-admin */}
                        {!esAdmin && (
                            <div className="pt-4 border-t border-stone-800">
                                <p className="text-xs text-stone-500 text-center">
                                    Solo los administradores pueden cambiar el estado y gestionar esta solicitud.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}