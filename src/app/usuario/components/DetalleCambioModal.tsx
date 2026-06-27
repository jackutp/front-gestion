// src/app/usuario/components/DetalleCambioModal.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Hash, Clock, CheckCircle, XCircle, PlayCircle, FileText, Award, Edit2, AlertTriangle, Shield, Server } from "lucide-react";
import { Cambio, EstadoCambio, estadoColorsCambio, estadoLabelsCambio, tipoLabelsCambio, categoriaLabels, riesgoLabels, riesgoColors } from "@/types/cambio";
import { useCambios } from "@/context/CambioContext";
import { useState } from "react";
import { Rol } from "@/types/solicitud";

interface DetalleCambioModalProps {
    isOpen: boolean;
    cambio: Cambio | null;
    onClose: () => void;
    onEstadoActualizado: () => void;
    puedeCambiarEstado: EstadoCambio[];
    rol: Rol;
}

interface Accion {
    estado: EstadoCambio;
    label: string;
    icon: React.ElementType;
    color: string;
}

const opcionesResponsable = [
    { value: "Gerente General", label: "Gerente General" },
    { value: "Jefe de Cocina", label: "Jefe de Cocina" },
    { value: "Jefe de Salón", label: "Jefe de Salón" },
    { value: "Soporte Técnico", label: "Soporte Técnico" },
    { value: "Atención al Cliente", label: "Atención al Cliente" },
    { value: "Mantenimiento", label: "Mantenimiento" },
    { value: "Recursos Humanos", label: "Recursos Humanos" },
];

export default function DetalleCambioModal({
    isOpen,
    cambio,
    onClose,
    onEstadoActualizado,
    puedeCambiarEstado,
    rol
}: DetalleCambioModalProps) {
    const { actualizarEstado, actualizarResponsable, isLoading } = useCambios();
    const [editandoResponsable, setEditandoResponsable] = useState(false);
    const [nuevoResponsable, setNuevoResponsable] = useState("");

    const esAdmin = rol === 'ADMINISTRADOR';

    const handleCambiarEstado = async (nuevoEstado: EstadoCambio) => {
        if (cambio && puedeCambiarEstado.includes(nuevoEstado)) {
            const result = await actualizarEstado(cambio.id, nuevoEstado);
            if (result) {
                onEstadoActualizado();
            }
        }
    };

    const handleGuardarResponsable = async () => {
        if (cambio && nuevoResponsable) {
            const result = await actualizarResponsable(cambio.id, nuevoResponsable);
            if (result) {
                setEditandoResponsable(false);
                onEstadoActualizado();
            }
        }
    };

    const getAccionesDisponibles = (): Accion[] => {
        if (!esAdmin || !cambio) return [];

        const acciones: Accion[] = [];

        switch (cambio.estado) {
            case "PENDIENTE":
                acciones.push({
                    estado: "EN_REVISION",
                    label: "Enviar a Revisión",
                    icon: PlayCircle,
                    color: "blue"
                });
                break;
            case "EN_REVISION":
                acciones.push({
                    estado: "APROBADO",
                    label: "Aprobar",
                    icon: CheckCircle,
                    color: "green"
                });
                acciones.push({
                    estado: "RECHAZADO",
                    label: "Rechazar",
                    icon: XCircle,
                    color: "red"
                });
                break;
            case "APROBADO":
                acciones.push({
                    estado: "EN_IMPLEMENTACION",
                    label: "Iniciar Implementación",
                    icon: PlayCircle,
                    color: "blue"
                });
                break;
            case "EN_IMPLEMENTACION":
                acciones.push({
                    estado: "IMPLEMENTADO",
                    label: "Marcar como Implementado",
                    icon: CheckCircle,
                    color: "green"
                });
                acciones.push({
                    estado: "ROLLBACK",
                    label: "Rollback",
                    icon: AlertTriangle,
                    color: "orange"
                });
                break;
            case "IMPLEMENTADO":
                acciones.push({
                    estado: "CERRADO",
                    label: "Cerrar",
                    icon: CheckCircle,
                    color: "green"
                });
                break;
            case "ROLLBACK":
                acciones.push({
                    estado: "CERRADO",
                    label: "Cerrar",
                    icon: CheckCircle,
                    color: "green"
                });
                break;
            case "RECHAZADO":
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

    if (!isOpen || !cambio) return null;

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
                    <div className="sticky top-0 bg-[#121214] border-b border-stone-800 px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 className="font-serif text-xl text-white">Detalle de Solicitud de Cambio</h2>
                            <span className={`px-2 py-0.5 rounded text-xs uppercase tracking-widest ${estadoColorsCambio[cambio.estado]}`}>
                                {estadoLabelsCambio[cambio.estado]}
                            </span>
                        </div>
                        <button onClick={onClose} className="p-1 rounded hover:bg-stone-800 transition-colors">
                            <X className="w-5 h-5 text-stone-500" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Código y tipo */}
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-widest mb-1">
                                    <Hash className="w-3 h-3" />
                                    Código de Ticket
                                </div>
                                <p className="text-white font-mono text-sm">{cambio.codigoTicket}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-stone-500 text-xs uppercase tracking-widest mb-1">Tipo</div>
                                <p className="text-white text-sm">{tipoLabelsCambio[cambio.tipoCambio]}</p>
                            </div>
                        </div>

                        {/* Título */}
                        <div>
                            <h3 className="text-white font-serif text-xl">{cambio.titulo}</h3>
                        </div>

                        {/* Descripción */}
                        <div>
                            <div className="text-stone-500 text-xs uppercase tracking-widest mb-2">Descripción</div>
                            <p className="text-stone-300 text-sm whitespace-pre-wrap">{cambio.descripcion}</p>
                        </div>

                        {/* Metadatos */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-stone-900/30 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-stone-500 mt-0.5" />
                                <div>
                                    <div className="text-stone-500 text-xs uppercase tracking-widest">Fecha de Creación</div>
                                    <p className="text-white text-sm">{new Date(cambio.fechaCreacion).toLocaleString("es-PE")}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Award className="w-4 h-4 text-stone-500 mt-0.5" />
                                <div>
                                    <div className="text-stone-500 text-xs uppercase tracking-widest">Categoría</div>
                                    <p className="text-white text-sm">{categoriaLabels[cambio.categoriaCambio]}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Shield className="w-4 h-4 text-stone-500 mt-0.5" />
                                <div>
                                    <div className="text-stone-500 text-xs uppercase tracking-widest">Riesgo</div>
                                    <p className={`text-sm ${riesgoColors[cambio.riesgo]}`}>{riesgoLabels[cambio.riesgo]}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Server className="w-4 h-4 text-stone-500 mt-0.5" />
                                <div>
                                    <div className="text-stone-500 text-xs uppercase tracking-widest">Sistema Afectado</div>
                                    <p className="text-white text-sm">{cambio.sistemaAfectado}</p>
                                </div>
                            </div>
                            {cambio.fechaImplementacion && (
                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Fecha Implementación</div>
                                        <p className="text-white text-sm">{new Date(cambio.fechaImplementacion).toLocaleDateString("es-PE")}</p>
                                    </div>
                                </div>
                            )}
                            {cambio.fechaVencimiento && (
                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Fecha de Vencimiento</div>
                                        <p className="text-white text-sm">{new Date(cambio.fechaVencimiento).toLocaleDateString("es-PE")}</p>
                                    </div>
                                </div>
                            )}
                            {cambio.usuarioSolicitante && (
                                <div className="flex items-start gap-2">
                                    <User className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Solicitante</div>
                                        <p className="text-white text-sm">{cambio.usuarioSolicitante}</p>
                                    </div>
                                </div>
                            )}
                            {cambio.areaSolicitante && (
                                <div className="flex items-start gap-2">
                                    <User className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Área</div>
                                        <p className="text-white text-sm">{cambio.areaSolicitante}</p>
                                    </div>
                                </div>
                            )}

                            {/* Responsable Asignado */}
                            <div className="flex items-start gap-2 col-span-2">
                                <User className="w-4 h-4 text-stone-500 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Responsable Asignado</div>
                                        {esAdmin && !editandoResponsable && cambio.estado !== "CERRADO" && (
                                            <button
                                                onClick={() => {
                                                    setNuevoResponsable(cambio.responsableAsignado || "");
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
                                        <p className="text-white text-sm">{cambio.responsableAsignado || "No asignado"}</p>
                                    )}
                                </div>
                            </div>

                            {cambio.fechaAprobacion && (
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Fecha de Aprobación</div>
                                        <p className="text-white text-sm">{new Date(cambio.fechaAprobacion).toLocaleString("es-PE")}</p>
                                    </div>
                                </div>
                            )}
                            {cambio.fechaCierre && (
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-stone-500 mt-0.5" />
                                    <div>
                                        <div className="text-stone-500 text-xs uppercase tracking-widest">Fecha de Cierre</div>
                                        <p className="text-white text-sm">{new Date(cambio.fechaCierre).toLocaleString("es-PE")}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Plan de Rollback */}
                        {cambio.planRollback && (
                            <div>
                                <div className="text-stone-500 text-xs uppercase tracking-widest mb-2">Plan de Rollback</div>
                                <p className="text-stone-300 text-sm whitespace-pre-wrap">{cambio.planRollback}</p>
                            </div>
                        )}

                        {/* Jira */}
                        {cambio.jiraTicketId && (
                            <div>
                                <div className="text-stone-500 text-xs uppercase tracking-widest mb-2">Ticket en Jira</div>
                                <a
                                    href={cambio.jiraUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#C6A96B] hover:underline"
                                >
                                    {cambio.jiraTicketId}
                                    <span className="text-xs">↗</span>
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
                                                            accion.color === "orange" ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30" :
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

                        {!esAdmin && (
                            <div className="pt-4 border-t border-stone-800">
                                <p className="text-xs text-stone-500 text-center">
                                    Solo los administradores pueden gestionar solicitudes de cambio.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}