"use client";

import { useState, useEffect, type FormEvent } from "react";
import { postSolicitud, getSolicitudes } from "@/src/services/api";
import type { Solicitud, Prioridad, Departamento } from "@/src/types";

export default function SolicitudForm() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<Prioridad>("Media");
  const [departamento, setDepartamento] = useState<Departamento>("Cocina");
  const [fechaRequerida, setFechaRequerida] = useState("");
  const [list, setList] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSolicitudes().then(setList);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await postSolicitud({ titulo, descripcion, prioridad, departamento, fechaRequerida });
    setTitulo(""); setDescripcion(""); setPrioridad("Media"); setDepartamento("Cocina"); setFechaRequerida("");
    setList(await getSolicitudes());
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-semibold text-amber-500">Nueva Solicitud</h2>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Título</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows={3}
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Prioridad</label>
            <select value={prioridad} onChange={(e) => setPrioridad(e.target.value as Prioridad)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
              <option>Alta</option><option>Media</option><option>Baja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Departamento</label>
            <select value={departamento} onChange={(e) => setDepartamento(e.target.value as Departamento)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
              <option>Cocina</option><option>Sala</option><option>Administración</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Fecha requerida</label>
          <input type="date" value={fechaRequerida} onChange={(e) => setFechaRequerida(e.target.value)} required
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:shadow-amber-500/25">
          {loading ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      <div className="bg-neutral-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-500 mb-4">Solicitudes Enviadas</h3>
        {list.length === 0 ? (
          <p className="text-zinc-400 text-sm">No hay solicitudes.</p>
        ) : (
          <div className="space-y-3">
            {list.map((s) => (
              <div key={s.id} className="border border-zinc-800 rounded-lg p-4 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm text-zinc-100">{s.titulo}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    s.estado === "Resuelta" ? "bg-green-900/50 text-green-400 border border-green-700/50" :
                    s.estado === "En Proceso" ? "bg-blue-900/50 text-blue-400 border border-blue-700/50" :
                    s.estado === "Rechazada" ? "bg-red-900/50 text-red-400 border border-red-700/50" :
                    "bg-yellow-900/50 text-yellow-400 border border-yellow-700/50"
                  }`}>{s.estado}</span>
                </div>
                <p className="text-xs text-zinc-500">{s.departamento} · {s.prioridad} · {s.fechaRequerida}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
