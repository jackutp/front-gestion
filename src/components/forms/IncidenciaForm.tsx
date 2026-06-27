"use client";

import { useState, useEffect, type FormEvent } from "react";
import { postIncidencia, getIncidencias } from "@/src/services/api";
import type { Incidencia, TipoIncidencia, Urgencia } from "@/src/types";

export default function IncidenciaForm() {
  const [tipo, setTipo] = useState<TipoIncidencia>("Técnica");
  const [descripcion, setDescripcion] = useState("");
  const [urgencia, setUrgencia] = useState<Urgencia>("Normal");
  const [ubicacion, setUbicacion] = useState("");
  const [list, setList] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getIncidencias().then(setList);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await postIncidencia({ tipo, descripcion, urgencia, ubicacion });
    setTipo("Técnica"); setDescripcion(""); setUrgencia("Normal"); setUbicacion("");
    setList(await getIncidencias());
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-semibold text-amber-500">Reportar Incidencia</h2>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoIncidencia)}
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
            <option>Técnica</option><option>Operativa</option><option>Cliente</option><option>Proveedor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows={3}
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Urgencia</label>
          <select value={urgencia} onChange={(e) => setUrgencia(e.target.value as Urgencia)}
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
            <option>Crítica</option><option>Urgente</option><option>Normal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Ubicación</label>
          <input value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
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
                  <h4 className="font-medium text-sm text-zinc-100">{inc.tipo}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    inc.urgencia === "Crítica" ? "bg-red-900/50 text-red-400 border border-red-700/50" :
                    inc.urgencia === "Urgente" ? "bg-orange-900/50 text-orange-400 border border-orange-700/50" :
                    "bg-green-900/50 text-green-400 border border-green-700/50"
                  }`}>{inc.urgencia}</span>
                </div>
                <p className="text-xs text-zinc-500">{inc.ubicacion} · {inc.estado}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
