"use client";

import { useState, useEffect, type FormEvent } from "react";
import { postCambio, getCambios } from "@/services/api";
import type { Cambio, TipoCambio, CategoriaCambio, RiesgoCambio } from "@/types";

export default function CambioForm() {
  const [tipoCambio, setTipoCambio] = useState<TipoCambio>("NORMAL");
  const [categoriaCambio, setCategoriaCambio] = useState<CategoriaCambio>("INFRAESTRUCTURA");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [sistemaAfectado, setSistemaAfectado] = useState("");
  const [planRollback, setPlanRollback] = useState("");
  const [riesgo, setRiesgo] = useState<RiesgoCambio>("MEDIO");
  const [fechaImplementacion, setFechaImplementacion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [usuarioSolicitante, setUsuarioSolicitante] = useState("");
  const [areaSolicitante, setAreaSolicitante] = useState("");
  const [list, setList] = useState<Cambio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCambios().then(setList).catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postCambio({
        tipoCambio, categoriaCambio, titulo, descripcion,
        sistemaAfectado: sistemaAfectado || undefined,
        planRollback: planRollback || undefined,
        riesgo,
        fechaImplementacion: fechaImplementacion || undefined,
        fechaVencimiento: fechaVencimiento || undefined,
        usuarioSolicitante: usuarioSolicitante || undefined,
        areaSolicitante: areaSolicitante || undefined,
      });
      setTipoCambio("NORMAL"); setCategoriaCambio("INFRAESTRUCTURA");
      setTitulo(""); setDescripcion(""); setSistemaAfectado(""); setPlanRollback("");
      setRiesgo("MEDIO"); setFechaImplementacion(""); setFechaVencimiento("");
      setUsuarioSolicitante(""); setAreaSolicitante("");
      setList(await getCambios());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-semibold text-amber-500">Solicitar Cambio</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Tipo de Cambio</label>
            <select value={tipoCambio} onChange={(e) => setTipoCambio(e.target.value as TipoCambio)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
              <option value="NORMAL">Normal</option>
              <option value="EMERGENCIA">Emergencia</option>
              <option value="REPETITIVO">Repetitivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Categoría de Cambio</label>
            <select value={categoriaCambio} onChange={(e) => setCategoriaCambio(e.target.value as CategoriaCambio)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
              <option value="INFRAESTRUCTURA">Infraestructura</option>
              <option value="DATABASE">Base de Datos</option>
              <option value="DOCUMENTACION">Documentación</option>
              <option value="CRONOGRAMA">Cronograma</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Título</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Descripción del cambio</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows={3}
            className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Sistema Afectado</label>
            <input value={sistemaAfectado} onChange={(e) => setSistemaAfectado(e.target.value)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Riesgo</label>
            <select value={riesgo} onChange={(e) => setRiesgo(e.target.value as RiesgoCambio)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
              <option value="BAJO">Bajo</option>
              <option value="MEDIO">Medio</option>
              <option value="ALTO">Alto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Plan de Rollback</label>
            <input value={planRollback} onChange={(e) => setPlanRollback(e.target.value)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Usuario Solicitante</label>
            <input value={usuarioSolicitante} onChange={(e) => setUsuarioSolicitante(e.target.value)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Área Solicitante</label>
            <input value={areaSolicitante} onChange={(e) => setAreaSolicitante(e.target.value)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Fecha de Implementación</label>
            <input type="date" value={fechaImplementacion} onChange={(e) => setFechaImplementacion(e.target.value)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Fecha de Vencimiento</label>
            <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)}
              className="w-full bg-neutral-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
          </div>
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
                  <div>
                    <h4 className="font-medium text-sm text-zinc-100">{c.titulo}</h4>
                    <span className="text-xs text-zinc-500">{c.codigoTicket}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    c.estado === "IMPLEMENTADO" || c.estado === "CERRADO" ? "bg-green-900/50 text-green-400 border border-green-700/50" :
                    c.estado === "APROBADO" || c.estado === "EN_IMPLEMENTACION" ? "bg-blue-900/50 text-blue-400 border border-blue-700/50" :
                    c.estado === "RECHAZADO" || c.estado === "ROLLBACK" ? "bg-red-900/50 text-red-400 border border-red-700/50" :
                    "bg-yellow-900/50 text-yellow-400 border border-yellow-700/50"
                  }`}>{c.estado}</span>
                </div>
                <p className="text-xs text-zinc-500">
                  {c.tipoCambio} · {c.categoriaCambio} · Riesgo: {c.riesgo}{c.sistemaAfectado ? ` · ${c.sistemaAfectado}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
