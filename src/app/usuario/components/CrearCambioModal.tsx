// src/app/usuario/components/CrearCambioModal.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { useCambios } from "@/context/CambioContext";
import { useAuth } from "@/context/AuthContext";
import {
    TipoCambio,
    CategoriaCambio,
    RiesgoCambio,
    tipoLabelsCambio,
    categoriaLabels,
    riesgoLabels,
} from "@/types/cambio";
import { areasRestaurante, rolAreaResponsable, rolResponsableNombre, Rol } from "@/types/solicitud";

interface CrearCambioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const tiposCambio = [
    { value: "NORMAL" as TipoCambio, label: "Normal", desc: "Cambio planificado con anticipación" },
    { value: "EMERGENCIA" as TipoCambio, label: "Emergencia", desc: "Cambio urgente que requiere acción inmediata" },
    { value: "REPETITIVO" as TipoCambio, label: "Repetitivo", desc: "Cambio que se realiza de forma periódica" },
];

const categorias = [
    { value: "INFRAESTRUCTURA" as CategoriaCambio, label: "Infraestructura" },
    { value: "DATABASE" as CategoriaCambio, label: "Base de Datos" },
    { value: "DOCUMENTACION" as CategoriaCambio, label: "Documentación" },
    { value: "CRONOGRAMA" as CategoriaCambio, label: "Cronograma" },
];

const riesgos = [
    { value: "BAJO" as RiesgoCambio, label: "Bajo" },
    { value: "MEDIO" as RiesgoCambio, label: "Medio" },
    { value: "ALTO" as RiesgoCambio, label: "Alto" },
];

const sistemasAfectados = [
    "Docker",
    "Microservicio-productos",
    "PostgreSQL",
    "GitHub Actions",
    "API Gateway",
    "Frontend Web",
    "Base de Datos Principal",
    "Sistema de Reservas",
    "Sistema de Pagos",
];

export default function CrearCambioModal({ isOpen, onClose, onSuccess }: CrearCambioModalProps) {
    const { crearCambio, isLoading } = useCambios();
    const { user } = useAuth();

    const rol = (user?.tipo || 'CLIENTE') as Rol;
    const nombreCompleto = user ? `${user.nombre} ${user.apellido}` : 'Usuario';
    const responsableAsignado = rolResponsableNombre[rol];

    const [tipo, setTipo] = useState<TipoCambio>("NORMAL");
    const [categoria, setCategoria] = useState<CategoriaCambio>("INFRAESTRUCTURA");
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [sistemaAfectado, setSistemaAfectado] = useState("");
    const [riesgo, setRiesgo] = useState<RiesgoCambio>("MEDIO");
    const [planRollback, setPlanRollback] = useState("");
    const [fechaImplementacion, setFechaImplementacion] = useState("");
    const [fechaVencimiento, setFechaVencimiento] = useState("");
    const [labels, setLabels] = useState<string[]>([]);
    const [nuevoLabel, setNuevoLabel] = useState("");
    const [areaSeleccionada, setAreaSeleccionada] = useState(rolAreaResponsable[rol]);
    const [subtareas, setSubtareas] = useState<{ titulo: string; descripcion: string; prioridad: string }[]>([]);
    const [nuevaSubtarea, setNuevaSubtarea] = useState({ titulo: "", descripcion: "", prioridad: "Medium" });
    const [error, setError] = useState("");

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
        if (!sistemaAfectado) {
            setError("El sistema afectado es requerido");
            return;
        }
        if (tipo === "EMERGENCIA" && !planRollback.trim()) {
            setError("El plan de rollback es requerido para cambios de emergencia");
            return;
        }

        const areaLabel = areasRestaurante.find(a => a.value === areaSeleccionada)?.label || areaSeleccionada;

        const result = await crearCambio({
            tipoCambio: tipo,
            categoriaCambio: categoria,
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            sistemaAfectado: sistemaAfectado,
            planRollback: planRollback.trim() || undefined,
            riesgo,
            fechaImplementacion: fechaImplementacion || undefined,
            fechaVencimiento: fechaVencimiento || undefined,
            labels: labels.length > 0 ? labels : undefined,
            responsableAsignado,
            subtareas: subtareas.length > 0 ? subtareas : undefined,
            usuarioSolicitante: nombreCompleto,
            areaSolicitante: areaLabel,
        });

        if (result) {
            onSuccess();
            resetForm();
        } else {
            setError("Error al crear la solicitud de cambio");
        }
    };

    const resetForm = () => {
        setTipo("NORMAL");
        setCategoria("INFRAESTRUCTURA");
        setTitulo("");
        setDescripcion("");
        setSistemaAfectado("");
        setRiesgo("MEDIO");
        setPlanRollback("");
        setFechaImplementacion("");
        setFechaVencimiento("");
        setLabels([]);
        setNuevoLabel("");
        setAreaSeleccionada(rolAreaResponsable[rol]);
        setSubtareas([]);
        setNuevaSubtarea({ titulo: "", descripcion: "", prioridad: "Medium" });
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

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#121214] border border-stone-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="sticky top-0 bg-[#121214] border-b border-stone-800 px-6 py-4 flex justify-between items-center">
                        <h2 className="font-serif text-xl text-white">Nueva Solicitud de Cambio</h2>
                        <button onClick={onClose} className="p-1 rounded hover:bg-stone-800 transition-colors">
                            <X className="w-5 h-5 text-stone-500" />
                        </button>
                    </div>

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

                        {/* Área */}
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

                        {/* Tipo de Cambio */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                Tipo de Cambio *
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {tiposCambio.map((t) => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => setTipo(t.value)}
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

                        {/* Categoría */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                Categoría *
                            </label>
                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value as CategoriaCambio)}
                                className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                            >
                                {categorias.map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Título */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Ej: Actualización del sistema de reservas"
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
                                placeholder="Describe detalladamente el cambio solicitado..."
                                className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50 resize-none"
                                required
                            />
                        </div>

                        {/* Sistema Afectado */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                Sistema Afectado *
                            </label>
                            <select
                                value={sistemaAfectado}
                                onChange={(e) => setSistemaAfectado(e.target.value)}
                                className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                required
                            >
                                <option value="">Seleccionar sistema...</option>
                                {sistemasAfectados.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Riesgo y Fechas */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                    Riesgo *
                                </label>
                                <select
                                    value={riesgo}
                                    onChange={(e) => setRiesgo(e.target.value as RiesgoCambio)}
                                    className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                >
                                    {riesgos.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                    Fecha Implementación
                                </label>
                                <input
                                    type="date"
                                    value={fechaImplementacion}
                                    onChange={(e) => setFechaImplementacion(e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                    Fecha Vencimiento
                                </label>
                                <input
                                    type="date"
                                    value={fechaVencimiento}
                                    onChange={(e) => setFechaVencimiento(e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                />
                            </div>
                        </div>

                        {/* Plan de Rollback */}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                Plan de Rollback {tipo === "EMERGENCIA" && "*"}
                            </label>
                            <textarea
                                value={planRollback}
                                onChange={(e) => setPlanRollback(e.target.value)}
                                rows={3}
                                placeholder="Describe cómo se revertirá el cambio si falla..."
                                className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50 resize-none"
                                required={tipo === "EMERGENCIA"}
                            />
                        </div>

                        {/* Labels */}
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
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarLabel())}
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
                                            onChange={(e) => setNuevaSubtarea({ ...nuevaSubtarea, prioridad: e.target.value })}
                                            className="flex-1 px-2 py-1.5 bg-stone-900/50 border border-stone-800 rounded text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
                                        >
                                            <option value="Highest">Máxima</option>
                                            <option value="High">Alta</option>
                                            <option value="Medium">Media</option>
                                            <option value="Low">Baja</option>
                                            <option value="Lowest">Mínima</option>
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
                                {isLoading ? "Creando..." : "Crear Solicitud de Cambio"}
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