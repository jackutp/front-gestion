"use client";

import { useState, useEffect, type FormEvent } from "react";
import { postCambio, getCambios } from "@/src/services/api";
import type { Cambio, TipoCambio } from "@/src/types";

export default function CambioForm() {
  const [tipo, setTipo] = useState<TipoCambio>("Horario");
  const [descripcion, setDescripcion] = useState("");
  const [razon, setRazon] = useState("");
  const [fechaPropuesta, setFechaPropuesta] = useState("");
  const [list, setList] = useState<Cambio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCambios().then(setList);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await postCambio({ tipo, descripcion, razon, fechaPropuesta });
    setTipo("Horario"); setDescripcion(""); setRazon(""); setFechaPropuesta("");
    setList(await getCambios());
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-semibold text-amber-500">Solicitar Cambio</h2>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Tipo de cambio</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoCambio)}
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
            <option>Horario</option><option>Personal</option><option>Procedimiento</option><option>Menú</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Descripción del cambio</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows={3}
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Razón</label>
          <textarea value={razon} onChange={(e) => setRazon(e.target.value)} required rows={3}
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Fecha propuesta</label>
          <input type="date" value={fechaPropuesta} onChange={(e) => setFechaPropuesta(e.target.value)} required
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:shadow-amber-500/25">
          {loading ? "Enviando..." : "Solicitar Cambio"}
        </button>
      </form>

      <div className="bg-neutral-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-500 mb-4">Cambios Solicitados</h3>
        {list.length === 0 ? (
          <p className="text-zinc-400 text-sm">No hay cambios registrados.</p>
        ) : (
          <div className="space-y-3">
            {list.map((c) => (
              <div key={c.id} className="border border-zinc-800 rounded-lg p-4 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm text-zinc-100">{c.tipo}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    c.estado === "Resuelta" ? "bg-green-900/50 text-green-400 border border-green-700/50" :
                    c.estado === "En Proceso" ? "bg-blue-900/50 text-blue-400 border border-blue-700/50" :
                    "bg-yellow-900/50 text-yellow-400 border border-yellow-700/50"
                  }`}>{c.estado}</span>
                </div>
                <p className="text-xs text-zinc-500">{c.descripcion.slice(0, 80)}... · {c.fechaPropuesta}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
