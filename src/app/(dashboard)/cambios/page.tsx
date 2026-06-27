"use client";

import { motion } from "framer-motion";
import { GitBranch, Plus, Search, Filter, Eye } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCambios } from "@/context/CambioContext";
import { useAuth } from "@/context/AuthContext";
import { Cambio, EstadoCambio, TipoCambio, permisosCambios, estadoColorsCambio, estadoLabelsCambio, tipoLabelsCambio, tipoColorsCambio, riesgoLabels, riesgoColors } from "@/types/cambio";
import { Rol } from "@/types/solicitud";
import CrearCambioModal from "@/app/usuario/components/CrearCambioModal";
import DetalleCambioModal from "@/app/usuario/components/DetalleCambioModal";

function CambioCard({ cambio, onVerDetalle }: { cambio: Cambio; onVerDetalle: (c: Cambio) => void }) {
  return (
    <div className="border border-zinc-800 rounded-lg p-4 hover:bg-amber-500/5 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="text-zinc-100 font-medium text-base">{cambio.titulo}</h3>
            <span className={`px-2 py-0.5 rounded border text-xs uppercase tracking-widest ${tipoColorsCambio[cambio.tipoCambio]}`}>
              {tipoLabelsCambio[cambio.tipoCambio]}
            </span>
            <span className={`px-2 py-0.5 rounded border text-xs uppercase tracking-widest ${estadoColorsCambio[cambio.estado]}`}>
              {estadoLabelsCambio[cambio.estado]}
            </span>
            <span className={`px-2 py-0.5 rounded border text-xs uppercase tracking-widest ${riesgoColors[cambio.riesgo]}`}>
              Riesgo: {riesgoLabels[cambio.riesgo]}
            </span>
          </div>
          <p className="text-zinc-400 text-sm line-clamp-2">{cambio.descripcion}</p>
        </div>
        <button onClick={() => onVerDetalle(cambio)}
          className="ml-3 p-2 rounded border border-zinc-700 text-zinc-500 hover:text-amber-400 hover:border-amber-500/30 transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
        <span className="uppercase tracking-widest">Código: {cambio.codigoTicket}</span>
        <span className="uppercase tracking-widest">Sistema: {cambio.sistemaAfectado}</span>
        <span className="uppercase tracking-widest">Creado: {new Date(cambio.fechaCreacion).toLocaleDateString("es-PE")}</span>
        {cambio.responsableAsignado && <span className="uppercase tracking-widest">Responsable: {cambio.responsableAsignado}</span>}
      </div>
    </div>
  );
}

export default function CambiosPage() {
  const { cambios, isLoading, listarCambios, listarPorEstado, listarPorTipo } = useCambios();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("TODOS");
  const [filterTipo, setFilterTipo] = useState<string>("TODOS");
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [selectedCambio, setSelectedCambio] = useState<Cambio | null>(null);
  const [filteredCambios, setFilteredCambios] = useState<Cambio[]>([]);

  const rol = user?.tipo as Rol || 'CLIENTE';

  const tiposPermitidosCrear = useMemo(() => permisosCambios.puedeCrear[rol] || [], [rol]);
  const tiposPermitidosVer = useMemo(() => permisosCambios.puedeVer[rol] || [], [rol]);
  const puedeCambiarEstado = useMemo(() => permisosCambios.puedeCambiarEstado[rol] || [], [rol]);

  if (rol !== 'ADMINISTRADOR') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <GitBranch className="w-16 h-16 text-zinc-700" />
        <p className="text-zinc-500 uppercase tracking-widest text-sm">Solo los administradores pueden gestionar cambios</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      let data: Cambio[] = [];
      if (filterEstado !== "TODOS" && filterTipo !== "TODOS") {
        const porEstado = await listarPorEstado(filterEstado as EstadoCambio);
        data = porEstado.filter(c => c.tipoCambio === filterTipo);
      } else if (filterEstado !== "TODOS") {
        data = await listarPorEstado(filterEstado as EstadoCambio);
      } else if (filterTipo !== "TODOS") {
        data = await listarPorTipo(filterTipo as TipoCambio);
      } else {
        data = cambios;
      }
      if (tiposPermitidosVer.length > 0) data = data.filter(c => tiposPermitidosVer.includes(c.tipoCambio));
      setFilteredCambios(data);
    };
    fetchData();
  }, [filterEstado, filterTipo, cambios, listarPorEstado, listarPorTipo, tiposPermitidosVer]);

  const displayedCambios = filteredCambios.filter(c =>
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.codigoTicket.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCrearCambio = () => {
    setShowCrearModal(false);
    listarCambios();
  };

  const tipoFilterOptions = [
    { value: "TODOS", label: "Todos los tipos" },
    ...(tiposPermitidosVer.includes('NORMAL') ? [{ value: "NORMAL", label: "Normal" }] : []),
    ...(tiposPermitidosVer.includes('EMERGENCIA') ? [{ value: "EMERGENCIA", label: "Emergencia" }] : []),
    ...(tiposPermitidosVer.includes('REPETITIVO') ? [{ value: "REPETITIVO", label: "Repetitivo" }] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-zinc-100">Gestión de Cambios</h2>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{displayedCambios.length}</span>
        </div>
        {tiposPermitidosCrear.length > 0 && (
          <button onClick={() => setShowCrearModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded text-amber-500 text-xs uppercase tracking-widest hover:bg-amber-500/20 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nueva Solicitud de Cambio
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" placeholder="Buscar por título, descripción o código..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-zinc-800 rounded text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}
            className="bg-neutral-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/50">
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="APROBADO">Aprobados</option>
            <option value="RECHAZADO">Rechazados</option>
            <option value="EN_IMPLEMENTACION">En Implementación</option>
            <option value="IMPLEMENTADO">Implementados</option>
            <option value="ROLLBACK">Rollback</option>
            <option value="CERRADO">Cerrados</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}
            className="bg-neutral-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/50">
            {tipoFilterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : displayedCambios.length > 0 ? (
          displayedCambios.map(cambio => (
            <CambioCard key={cambio.id} cambio={cambio} onVerDetalle={setSelectedCambio} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <GitBranch className="w-12 h-12 text-zinc-700" />
            <p className="text-sm text-zinc-500 uppercase tracking-widest">No hay solicitudes de cambio disponibles</p>
            <p className="text-xs text-zinc-600 max-w-xs">
              {searchTerm || filterEstado !== "TODOS" || filterTipo !== "TODOS"
                ? "No se encontraron cambios con los filtros aplicados"
                : tiposPermitidosCrear.length > 0
                  ? "Haz clic en 'Nueva Solicitud de Cambio' para crear tu primer cambio"
                  : "Tu rol no te permite crear solicitudes de cambio"}
            </p>
          </div>
        )}
      </div>

      <CrearCambioModal isOpen={showCrearModal} onClose={() => setShowCrearModal(false)} onSuccess={handleCrearCambio} />
      <DetalleCambioModal isOpen={!!selectedCambio} cambio={selectedCambio} onClose={() => setSelectedCambio(null)}
        onEstadoActualizado={() => { listarCambios(); setSelectedCambio(null); }}
        puedeCambiarEstado={puedeCambiarEstado} rol={rol} />
    </div>
  );
}
