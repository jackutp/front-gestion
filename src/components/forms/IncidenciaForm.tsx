"use client";

import { useState, useEffect, type FormEvent } from "react";
import { incidenteService } from "@/services/incidenteService";
import type { Incidente, TipoAreaAfectada, Urgencia, Impacto, Prioridad } from "@/types/incidente";

export default function IncidenciaForm() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [resumenProblema, setResumenProblema] = useState("");
  const [descripcionDetallada, setDescripcionDetallada] = useState("");
  const [tipoAreaAfectada, setTipoAreaAfectada] = useState<TipoAreaAfectada>("APLICACIONES");
  const [urgencia, setUrgencia] = useState<Urgencia>("MEDIO");
  const [impacto, setImpacto] = useState<Impacto>("MODERADO_LIMITADO");
  const [prioridad, setPrioridad] = useState<Prioridad>("MEDIO");
  const [list, setList] = useState<Incidente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    incidenteService.listarTodos().then(setList).catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await incidenteService.crearIncidente({
        nombreUsuario, resumenProblema, descripcionDetallada,
        tipoAreaAfectada, urgencia, impacto, prioridad,
      });
      setNombreUsuario(""); setResumenProblema(""); setDescripcionDetallada("");
      setTipoAreaAfectada("APLICACIONES"); setUrgencia("MEDIO");
      setImpacto("MODERADO_LIMITADO"); setPrioridad("MEDIO");
      setList(await incidenteService.listarTodos());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-semibold text-amber-500">Reportar Incidencia</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Nombre de Usuario</label>
            <input value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} required
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Tipo de Área Afectada</label>
            <select value={tipoAreaAfectada} onChange={(e) => setTipoAreaAfectada(e.target.value as TipoAreaAfectada)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
              <option value="INFRAESTRUCTURA">Infraestructura</option>
              <option value="APLICACIONES">Aplicaciones</option>
              <option value="BASE_DATOS">Base de Datos</option>
              <option value="REDES_COMUNICACIONES">Redes/Comunicaciones</option>
              <option value="SEGURIDAD">Seguridad</option>
              <option value="DOCUMENTACION">Documentación</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Resumen del Problema</label>
          <input value={resumenProblema} onChange={(e) => setResumenProblema(e.target.value)} required
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Descripción Detallada</label>
          <textarea value={descripcionDetallada} onChange={(e) => setDescripcionDetallada(e.target.value)} required rows={3}
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Urgencia</label>
            <select value={urgencia} onChange={(e) => setUrgencia(e.target.value as Urgencia)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
              <option value="CRITICO">Crítico</option>
              <option value="ALTO">Alto</option>
              <option value="MEDIO">Medio</option>
              <option value="BAJO">Bajo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Impacto</label>
            <select value={impacto} onChange={(e) => setImpacto(e.target.value as Impacto)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
              <option value="EXTENSO_GENERALIZADO">Extenso/Generalizado</option>
              <option value="SIGNIFICATIVO_GRANDE">Significativo/Grande</option>
              <option value="MODERADO_LIMITADO">Moderado/Limitado</option>
              <option value="MENOR_LOCALIZADO">Menor/Localizado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Prioridad</label>
            <select value={prioridad} onChange={(e) => setPrioridad(e.target.value as Prioridad)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
              <option value="CRITICO">Crítico</option>
              <option value="ALTO">Alto</option>
              <option value="MEDIO">Medio</option>
              <option value="BAJO">Bajo</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:shadow-amber-500/25">
          {loading ? "Enviando..." : "Reportar Incidencia"}
        </button>
      </form>

      <div className="bg-neutral-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-500 mb-4">Incidencias Reportadas</h3>
        {list.length === 0 ? (
          <p className="text-zinc-400 text-sm">No hay incidencias registradas.</p>
        ) : (
          <div className="space-y-3">
            {list.map((inc) => (
              <div key={inc.id} className="border border-zinc-800 rounded-lg p-4 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm text-zinc-100">{inc.resumenProblema}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    inc.urgencia === "CRITICO" ? "bg-red-900/50 text-red-400 border border-red-700/50" :
                    inc.urgencia === "ALTO" ? "bg-orange-900/50 text-orange-400 border border-orange-700/50" :
                    inc.urgencia === "MEDIO" ? "bg-yellow-900/50 text-yellow-400 border border-yellow-700/50" :
                    "bg-green-900/50 text-green-400 border border-green-700/50"
                  }`}>{inc.urgencia}</span>
                </div>
                <p className="text-xs text-zinc-500">
                  {inc.tipoAreaAfectada} · {inc.impacto} · {inc.prioridad} · {inc.estado}
                </p>
                <p className="text-xs text-zinc-600 mt-1">{inc.nombreUsuario}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
