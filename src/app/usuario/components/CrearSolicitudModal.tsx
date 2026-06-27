// src/app/usuario/components/CrearSolicitudModal.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { useSolicitudes } from "@/context/SolicitudContext";
import { useAuth } from "@/context/AuthContext";
import {
    TipoSolicitud,
    Subtarea,
    PrioridadJira,
    areasRestaurante,
    rolAreaResponsable,
    rolResponsableNombre,
    Rol
} from "@/types/solicitud";

interface CrearSolicitudModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const todosTipos = [
    { value: "SERVICIO", label: "Servicio", desc: "Soporte técnico, atención, configuración" },
    { value: "INFORMACION", label: "Información", desc: "Datos, reportes, estado de servicios" },
    { value: "ACCESO", label: "Acceso", desc: "Permisos, usuarios, roles" },
];

const prioridades: { value: PrioridadJira; label: string }[] = [
    { value: "Highest", label: "Máxima" },
    { value: "High", label: "Alta" },
    { value: "Medium", label: "Media" },
    { value: "Low", label: "Baja" },
    { value: "Lowest", label: "Mínima" },
];

export default function CrearSolicitudModal({ isOpen, onClose, onSuccess }: CrearSolicitudModalProps) {
    const { crearSolicitud, isLoading } = useSolicitudes();
    const { user } = useAuth();

    const rol = (user?.tipo || 'CLIENTE') as Rol;
    const nombreCompleto = user ? `${user.nombre} ${user.apellido}` : 'Usuario';

    const tiposPermitidos = useMemo(() => {
        const permisos: Record<string, string[]> = {
            ADMINISTRADOR: ['SERVICIO', 'INFORMACION', 'ACCESO'],
            MESERO: ['SERVICIO', 'INFORMACION', 'ACCESO'],
            COCINERO: ['SERVICIO', 'INFORMACION'],
            CLIENTE: ['SERVICIO', 'INFORMACION'],
        };
        return permisos[rol] || ['SERVICIO', 'INFORMACION'];
    }, [rol]);

    const tiposDisponibles = todosTipos.filter(t => tiposPermitidos.includes(t.value));

    const [tipo, setTipo] = useState<TipoSolicitud>(tiposDisponibles[0]?.value as TipoSolicitud || "SERVICIO");
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [prioridad, setPrioridad] = useState<PrioridadJira>("Medium");
    const [fechaVencimiento, setFechaVencimiento] = useState("");
    const [labels, setLabels] = useState<string[]>([]);
    const [nuevoLabel, setNuevoLabel] = useState("");
    const [subtareas, setSubtareas] = useState<Subtarea[]>([]);
    const [nuevaSubtarea, setNuevaSubtarea] = useState({ titulo: "", descripcion: "", prioridad: "Medium" as PrioridadJira });
    const [areaSeleccionada, setAreaSeleccionada] = useState(rolAreaResponsable[rol]);
    const [error, setError] = useState("");

    // Responsable asignado según el rol
    const responsableAsignado = rolResponsableNombre[rol];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!titulo.trim()) {
            setError("El título es requerido");
            return;
        }
        if (!descripcion.trim()) {
            setError("La descripción es requerida");
            return;
        }

        const areaLabel = areasRestaurante.find(a => a.value === areaSeleccionada)?.label || areaSeleccionada;

        const result = await crearSolicitud({
            tipoSolicitud: tipo,
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            prioridad,
            fechaVencimiento: fechaVencimiento || undefined,
            labels: labels.length > 0 ? labels : undefined,
            assignee: responsableAsignado,
            subtareas: subtareas.length > 0 ? subtareas : undefined,
            usuarioSolicitante: nombreCompleto,
            areaSolicitante: areaLabel,
            responsableAsignado: responsableAsignado,
        });

        if (result) {
            onSuccess();
            resetForm();
        } else {
            setError("Error al crear la solicitud");
        }
    };

    const resetForm = () => {
        setTipo(tiposDisponibles[0]?.value as TipoSolicitud || "SERVICIO");
        setTitulo("");
        setDescripcion("");
        setPrioridad("Medium");
        setFechaVencimiento("");
        setLabels([]);
        setSubtareas([]);
        setNuevoLabel("");
        setNuevaSubtarea({ titulo: "", descripcion: "", prioridad: "Medium" });
        setAreaSeleccionada(rolAreaResponsable[rol]);
    };

    const agregarLabel = () => {
        if (nuevoLabel.trim() && !labels.includes(nuevoLabel.trim())) {
            setLabels([...labels, nuevoLabel.trim()]);
            setNuevoLabel("");
        }
    };

    const eliminarLabel = (label: string) => {
        setLabels(labels.filter(l => l !== label));
    };

    const agregarSubtarea = () => {
        if (nuevaSubtarea.titulo.trim()) {
            setSubtareas([...subtareas, { ...nuevaSubtarea }]);
            setNuevaSubtarea({ titulo: "", descripcion: "", prioridad: "Medium" });
        }
    };

    const eliminarSubtarea = (index: number) => {
        setSubtareas(subtareas.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    if (tiposDisponibles.length === 0) {
        return (
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#121214] border border-stone-800 rounded-lg w-full max-w-md p-6"
                    >
                        <div className="text-center">
                            <div className="text-red-400 mb-4">⚠️</div>
                            <h3 className="text-white font-medium mb-2">No tienes permisos para crear solicitudes</h3>
                            <p className="text-stone-400 text-sm mb-4">
                                Tu rol actual no te permite crear ningún tipo de solicitud.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-[#C6A96B]/20 border border-[#C6A96B]/30 rounded text-[#C6A96B] text-sm"
                            >
                                Cerrar
                            </button>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#121214] border border-stone-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-[#121214] border-b border-stone-800 px-6 py-4 flex justify-between items-center">
                        <h2 className="font-serif text-xl text-white">Nueva Solicitud</h2>
                        <button onClick={onClose} className="p-1 rounded hover:bg-stone-800 transition-colors">
                            <X className="w-5 h-5 text-stone-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {error && (
                            <div className="bg-red-500/15 border border-red-500/30 rounded p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Información del solicitante */}
                        <div className="grid grid-cols-2 gap-4 p-3 bg-stone-900/30 rounded-lg">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1">
                                    Solicitante
                                </label>
                                <p className="text-white text-sm font-medium">{nombreCompleto}</p>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1">
                                    Responsable Asignado
                                </label>
                                <p className="text-white text-sm font-medium">{responsableAsignado}</p>
                            </div>
                        </div>

                        {/* Área - Select */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                Área Solicitante *
                            </label>
                            <select
                                value={areaSeleccionada}
                                onChange={(e) => setAreaSeleccionada(e.target.value)}
                                className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                required
                            >
                                {areasRestaurante.map((area) => (
                                    <option key={area.value} value={area.value}>
                                        {area.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo de Solicitud */}
                        {tiposDisponibles.length > 1 && (
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                    Tipo de Solicitud *
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {tiposDisponibles.map((t) => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => setTipo(t.value as TipoSolicitud)}
                                            className={`p-3 rounded border text-left transition-colors ${tipo === t.value
                                                    ? "border-[#C6A96B] bg-[#C6A96B]/10 text-[#C6A96B]"
                                                    : "border-stone-800 text-stone-400 hover:border-stone-700"
                                                }`}
                                        >
                                            <p className="font-medium text-sm">{t.label}</p>
                                            <p className="text-xs opacity-70 mt-0.5">{t.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tiposDisponibles.length === 1 && (
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                    Tipo de Solicitud
                                </label>
                                <div className="p-3 bg-stone-900/50 border border-stone-800 rounded">
                                    <p className="font-medium text-white text-sm">{tiposDisponibles[0].label}</p>
                                    <p className="text-xs text-stone-500 mt-0.5">{tiposDisponibles[0].desc}</p>
                                </div>
                            </div>
                        )}

                        {/* Título */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Ej: Error en el sistema de pagos"
                                className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                required
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                Descripción *
                            </label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                rows={4}
                                placeholder="Describe detalladamente tu solicitud..."
                                className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50 resize-none"
                                required
                            />
                        </div>

                        {/* Prioridad y Fecha */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                    Prioridad
                                </label>
                                <select
                                    value={prioridad}
                                    onChange={(e) => setPrioridad(e.target.value as PrioridadJira)}
                                    className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                >
                                    {prioridades.map((p) => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                    Fecha de Vencimiento
                                </label>
                                <input
                                    type="date"
                                    value={fechaVencimiento}
                                    onChange={(e) => setFechaVencimiento(e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                />
                            </div>
                        </div>

                        {/* Labels/Etiquetas */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                Etiquetas
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={nuevoLabel}
                                    onChange={(e) => setNuevoLabel(e.target.value)}
                                    placeholder="Ej: urgente, frontend"
                                    className="flex-1 px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                    onKeyPress={(e) => e.key === 'Enter' && agregarLabel()}
                                />
                                <button
                                    type="button"
                                    onClick={agregarLabel}
                                    className="px-3 py-2 bg-stone-800 rounded text-white text-sm hover:bg-stone-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {labels.map((label) => (
                                    <span key={label} className="bg-[#C6A96B]/10 border border-[#C6A96B]/30 text-[#C6A96B] px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                        {label}
                                        <button type="button" onClick={() => eliminarLabel(label)} className="hover:text-white">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Subtareas */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                Subtareas
                            </label>
                            <div className="border border-stone-800 rounded-lg p-3 bg-stone-900/30">
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Título"
                                        value={nuevaSubtarea.titulo}
                                        onChange={(e) => setNuevaSubtarea({ ...nuevaSubtarea, titulo: e.target.value })}
                                        className="px-2 py-1.5 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Descripción"
                                        value={nuevaSubtarea.descripcion}
                                        onChange={(e) => setNuevaSubtarea({ ...nuevaSubtarea, descripcion: e.target.value })}
                                        className="px-2 py-1.5 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                    />
                                    <div className="flex gap-1">
                                        <select
                                            value={nuevaSubtarea.prioridad}
                                            onChange={(e) => setNuevaSubtarea({ ...nuevaSubtarea, prioridad: e.target.value as PrioridadJira })}
                                            className="flex-1 px-2 py-1.5 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                        >
                                            {prioridades.map((p) => (
                                                <option key={p.value} value={p.value}>{p.label}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={agregarSubtarea}
                                            className="px-2 py-1.5 bg-[#C6A96B]/20 rounded text-[#C6A96B] text-sm hover:bg-[#C6A96B]/30 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                {subtareas.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {subtareas.map((sub, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-2 bg-stone-900/50 rounded">
                                                <div className="flex-1">
                                                    <p className="text-white text-sm font-medium">{sub.titulo}</p>
                                                    <p className="text-stone-500 text-xs">{sub.descripcion}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarSubtarea(idx)}
                                                    className="p-1 text-stone-500 hover:text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-2 bg-[#C6A96B] text-black font-medium rounded text-sm uppercase tracking-widest hover:bg-[#B89A5A] transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Creando..." : "Crear Solicitud"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-stone-800 text-stone-400 rounded text-sm uppercase tracking-widest hover:bg-stone-900 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}