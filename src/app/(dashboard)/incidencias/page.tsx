"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Plus, Search, Filter, Eye, X, User, FileText, Server, Activity, Gauge, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useIncidentes } from "@/context/IncidenteContext";
import { useAuth } from "@/context/AuthContext";
import type {
  Incidente, CrearIncidenteDTO, TipoAreaAfectada, Urgencia, Impacto, Prioridad, EstadoIncidente
} from "@/types/incidente";
import {
  tipoAreaLabels, tipoAreaColors, urgenciaLabels, urgenciaColors,
  impactoLabels, estadoLabels, estadoColors
} from "@/types/incidente";

const prioridadLabels: Record<Prioridad, string> = { CRITICO: "Crítico", ALTO: "Alto", MEDIO: "Medio", BAJO: "Bajo" };
const prioridadColors: Record<Prioridad, string> = {
  CRITICO: "bg-red-500/15 border-red-500/30 text-red-400",
  ALTO: "bg-orange-500/15 border-orange-500/30 text-orange-400",
  MEDIO: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
  BAJO: "bg-green-500/15 border-green-500/30 text-green-400",
};

function IncidenteCard({ incidente, onVerDetalle }: { incidente: Incidente; onVerDetalle: (i: Incidente) => void }) {
  return (
    <div className="border border-zinc-800 rounded-lg p-4 hover:bg-amber-500/5 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="text-zinc-100 font-medium text-base">{incidente.resumenProblema}</h3>
            <span className={`px-2 py-0.5 rounded border text-xs uppercase tracking-widest ${tipoAreaColors[incidente.tipoAreaAfectada]}`}>
              {tipoAreaLabels[incidente.tipoAreaAfectada]}
            </span>
            <span className={`px-2 py-0.5 rounded border text-xs uppercase tracking-widest ${estadoColors[incidente.estado]}`}>
              {estadoLabels[incidente.estado]}
            </span>
          </div>
          <p className="text-zinc-400 text-sm line-clamp-2">{incidente.descripcionDetallada}</p>
        </div>
        <button onClick={() => onVerDetalle(incidente)}
          className="ml-3 p-2 rounded border border-zinc-700 text-zinc-500 hover:text-amber-400 hover:border-amber-500/30 transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
        <span className="uppercase tracking-widest">{incidente.nombreUsuario}</span>
        <span className={`uppercase tracking-widest ${urgenciaColors[incidente.urgencia].split(" ")[2]}`}>{urgenciaLabels[incidente.urgencia]}</span>
        <span className={`uppercase tracking-widest ${prioridadColors[incidente.prioridad].split(" ")[2]}`}>{prioridadLabels[incidente.prioridad]}</span>
        <span className="uppercase tracking-widest">Creado: {new Date(incidente.fechaCreacion).toLocaleDateString("es-PE")}</span>
      </div>
    </div>
  );
}

function CrearIncidenteModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const { crearIncidente } = useIncidentes();
  const { user } = useAuth();
  const [form, setForm] = useState<CrearIncidenteDTO>({
    nombreUsuario: user?.nombre || "",
    resumenProblema: "",
    descripcionDetallada: "",
    tipoAreaAfectada: "APLICACIONES",
    urgencia: "MEDIO",
    impacto: "MODERADO_LIMITADO",
    prioridad: "MEDIO",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await crearIncidente(form);
    setLoading(false);
    if (result) {
      onSuccess();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-neutral-900 border border-zinc-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-amber-500">Reportar Incidencia</h3>
              <button onClick={onClose} className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Nombre de Usuario</label>
                <div className="flex items-center gap-2 bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2">
                  <User className="w-4 h-4 text-zinc-500" />
                  <input value={form.nombreUsuario} onChange={(e) => setForm({ ...form, nombreUsuario: e.target.value })} required
                    className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Área Afectada</label>
                  <select value={form.tipoAreaAfectada} onChange={(e) => setForm({ ...form, tipoAreaAfectada: e.target.value as TipoAreaAfectada })}
                    className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {Object.entries(tipoAreaLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Urgencia</label>
                  <select value={form.urgencia} onChange={(e) => setForm({ ...form, urgencia: e.target.value as Urgencia })}
                    className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {Object.entries(urgenciaLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Impacto</label>
                  <select value={form.impacto} onChange={(e) => setForm({ ...form, impacto: e.target.value as Impacto })}
                    className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {Object.entries(impactoLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Prioridad</label>
                  <select value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value as Prioridad })}
                    className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {Object.entries(prioridadLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Resumen del Problema</label>
                <div className="flex items-center gap-2 bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2">
                  <FileText className="w-4 h-4 text-zinc-500" />
                  <input value={form.resumenProblema} onChange={(e) => setForm({ ...form, resumenProblema: e.target.value })} required maxLength={200}
                    className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Descripción Detallada</label>
                <textarea value={form.descripcionDetallada} onChange={(e) => setForm({ ...form, descripcionDetallada: e.target.value })} required rows={4}
                  className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:shadow-amber-500/25">
                {loading ? "Enviando..." : "Reportar Incidencia"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetalleIncidenteModal({ incidente, onClose, onEstadoActualizado, puedeCambiarEstado }:
  { incidente: Incidente | null; onClose: () => void; onEstadoActualizado: () => void; puedeCambiarEstado: boolean }) {
  const { actualizarEstado, eliminarIncidente } = useIncidentes();
  const [loading, setLoading] = useState(false);

  if (!incidente) return null;

  const handleCambiarEstado = async (nuevoEstado: EstadoIncidente) => {
    setLoading(true);
    await actualizarEstado(incidente.id, nuevoEstado);
    setLoading(false);
    onEstadoActualizado();
  };

  const handleEliminar = async () => {
    if (!confirm("¿Eliminar esta incidencia?")) return;
    await eliminarIncidente(incidente.id);
    onEstadoActualizado();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="bg-neutral-900 border border-zinc-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <h3 className="text-lg font-semibold text-amber-500">Detalle de Incidencia</h3>
            <button onClick={onClose} className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <h4 className="text-zinc-100 font-medium text-base mb-1">{incidente.resumenProblema}</h4>
              <p className="text-zinc-400 text-sm">{incidente.descripcionDetallada}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-neutral-950 rounded-lg p-3 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <User className="w-3.5 h-3.5" /><span className="text-xs uppercase tracking-widest">Usuario</span>
                </div>
                <p className="text-zinc-100">{incidente.nombreUsuario}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-3 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <Server className="w-3.5 h-3.5" /><span className="text-xs uppercase tracking-widest">Área</span>
                </div>
                <p className="text-zinc-100">{tipoAreaLabels[incidente.tipoAreaAfectada]}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-3 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <Activity className="w-3.5 h-3.5" /><span className="text-xs uppercase tracking-widest">Urgencia</span>
                </div>
                <p className={`font-medium ${urgenciaColors[incidente.urgencia].split(" ")[2]}`}>{urgenciaLabels[incidente.urgencia]}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-3 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <Gauge className="w-3.5 h-3.5" /><span className="text-xs uppercase tracking-widest">Impacto</span>
                </div>
                <p className="text-zinc-100">{impactoLabels[incidente.impacto]}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-3 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" /><span className="text-xs uppercase tracking-widest">Prioridad</span>
                </div>
                <p className={`font-medium ${prioridadColors[incidente.prioridad].split(" ")[2]}`}>{prioridadLabels[incidente.prioridad]}</p>
              </div>
              <div className="bg-neutral-950 rounded-lg p-3 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /><span className="text-xs uppercase tracking-widest">Estado</span>
                </div>
                <p className={`font-medium ${estadoColors[incidente.estado].split(" ")[2]}`}>{estadoLabels[incidente.estado]}</p>
              </div>
            </div>

            {incidente.jiraIssueKey && (
              <div className="bg-blue-950/30 border border-blue-800/30 rounded-lg p-3">
                <p className="text-xs text-blue-400 uppercase tracking-widest mb-1">Ticket Jira</p>
                <a href={incidente.jiraIssueUrl || "#"} target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:underline">{incidente.jiraIssueKey}</a>
              </div>
            )}

            <div className="space-y-1 text-xs text-zinc-500">
              <p>Creado: {new Date(incidente.fechaCreacion).toLocaleString("es-PE")}</p>
              <p>Actualizado: {new Date(incidente.fechaActualizacion).toLocaleString("es-PE")}</p>
            </div>

            <div className="flex gap-2">
              {puedeCambiarEstado && (
                <div className="flex-1 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">Cambiar Estado</p>
                  <div className="flex gap-2">
                    {(["PENDIENTE", "INVESTIGAR", "RESOLVER", "CANCELAR"] as EstadoIncidente[]).map((est) => (
                      <button key={est} onClick={() => handleCambiarEstado(est)} disabled={loading || est === incidente.estado}
                        className={`px-3 py-1.5 rounded border text-xs uppercase tracking-widest transition-colors disabled:opacity-30 ${
                          est === incidente.estado
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-amber-500/30"
                        }`}>
                        {estadoLabels[est]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={handleEliminar}
                className="px-3 py-1.5 self-end rounded border border-red-800/50 bg-red-950/20 text-red-400 text-xs uppercase tracking-widest hover:bg-red-950/40 transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function IncidenciasPage() {
  const { incidentes, isLoading, listarIncidentes, listarPorEstado, listarPorUsuario } = useIncidentes();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("TODOS");
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [selectedIncidente, setSelectedIncidente] = useState<Incidente | null>(null);
  const [filteredIncidentes, setFilteredIncidentes] = useState<Incidente[]>([]);

  const puedeCambiarEstado = user?.tipo === "ADMINISTRADOR";

  useEffect(() => {
    const fetchData = async () => {
      let data: Incidente[] = [];
      if (filterEstado !== "TODOS") {
        data = await listarPorEstado(filterEstado as string);
      } else {
        data = incidentes;
      }
      setFilteredIncidentes(data);
    };
    fetchData();
  }, [filterEstado, incidentes, listarPorEstado]);

  const displayedIncidentes = (filteredIncidentes ?? []).filter(i =>
    i.resumenProblema.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.descripcionDetallada.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-zinc-100">Gestión de Incidencias</h2>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{displayedIncidentes.length}</span>
        </div>
        <button onClick={() => setShowCrearModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded text-amber-500 text-xs uppercase tracking-widest hover:bg-amber-500/20 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Nueva Incidencia
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" placeholder="Buscar por resumen, descripción o usuario..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-zinc-800 rounded text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}
            className="bg-neutral-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/50">
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="INVESTIGAR">Investigar</option>
            <option value="RESOLVER">Resueltos</option>
            <option value="CANCELAR">Cancelados</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : displayedIncidentes.length > 0 ? (
          displayedIncidentes.map(incidente => (
            <IncidenteCard key={incidente.id} incidente={incidente} onVerDetalle={setSelectedIncidente} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <AlertTriangle className="w-12 h-12 text-zinc-700" />
            <p className="text-sm text-zinc-500 uppercase tracking-widest">No hay incidencias registradas</p>
            <p className="text-xs text-zinc-600 max-w-xs">
              {searchTerm || filterEstado !== "TODOS"
                ? "No se encontraron incidencias con los filtros aplicados"
                : "Haz clic en 'Nueva Incidencia' para reportar una"}
            </p>
          </div>
        )}
      </div>

      <CrearIncidenteModal isOpen={showCrearModal} onClose={() => setShowCrearModal(false)} onSuccess={() => listarIncidentes()} />
      <DetalleIncidenteModal incidente={selectedIncidente} onClose={() => setSelectedIncidente(null)}
        onEstadoActualizado={() => { listarIncidentes(); setSelectedIncidente(null); }}
        puedeCambiarEstado={puedeCambiarEstado} />
    </div>
  );
}
