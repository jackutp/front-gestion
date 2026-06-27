"use client";

import { motion } from "framer-motion";
import { ClipboardList, Plus, Search, Filter, Eye } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSolicitudes } from "@/context/SolicitudContext";
import { useAuth } from "@/context/AuthContext";
import { Solicitud, EstadoSolicitud, TipoSolicitud, permisosSolicitudes, Rol } from "@/types/solicitud";
import CrearSolicitudModal from "@/app/usuario/components/CrearSolicitudModal";
import DetalleSolicitudModal from "@/app/usuario/components/DetalleSolicitudModal";

const estadoColors: Record<EstadoSolicitud, string> = {
  PENDIENTE: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
  EN_PROCESO: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  COMPLETADA: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  RECHAZADA: "bg-red-500/15 border-red-500/30 text-red-400",
};

const estadoLabels: Record<EstadoSolicitud, string> = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En Proceso",
  COMPLETADA: "Completada",
  RECHAZADA: "Rechazada",
};

const tipoLabels: Record<TipoSolicitud, string> = {
  SERVICIO: "Servicio",
  INFORMACION: "Información",
  ACCESO: "Acceso",
};

const tipoColors: Record<TipoSolicitud, string> = {
  SERVICIO: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  INFORMACION: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
  ACCESO: "bg-orange-500/15 border-orange-500/30 text-orange-400",
};

function SolicitudCard({ solicitud, onVerDetalle, rol }: { solicitud: Solicitud; onVerDetalle: (s: Solicitud) => void; rol: Rol }) {
  const puedeVer = permisosSolicitudes.puedeVer[rol]?.includes(solicitud.tipoSolicitud) ?? true;
  if (!puedeVer) return null;

  return (
    <div className="border border-zinc-800 rounded-lg p-4 hover:bg-amber-500/5 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="text-zinc-100 font-medium text-base">{solicitud.titulo}</h3>
            <span className={`px-2 py-0.5 rounded border text-xs uppercase tracking-widest ${tipoColors[solicitud.tipoSolicitud]}`}>
              {tipoLabels[solicitud.tipoSolicitud]}
            </span>
            <span className={`px-2 py-0.5 rounded border text-xs uppercase tracking-widest ${estadoColors[solicitud.estado]}`}>
              {estadoLabels[solicitud.estado]}
            </span>
          </div>
          <p className="text-zinc-400 text-sm line-clamp-2">{solicitud.descripcion}</p>
        </div>
        <button onClick={() => onVerDetalle(solicitud)}
          className="ml-3 p-2 rounded border border-zinc-700 text-zinc-500 hover:text-amber-400 hover:border-amber-500/30 transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
        <span className="uppercase tracking-widest">Código: {solicitud.codigoTicket}</span>
        <span className="uppercase tracking-widest">Prioridad: {solicitud.prioridad}</span>
        <span className="uppercase tracking-widest">Creado: {new Date(solicitud.fechaCreacion).toLocaleDateString("es-PE")}</span>
        {solicitud.responsableAsignado && <span className="uppercase tracking-widest">Responsable: {solicitud.responsableAsignado}</span>}
      </div>
    </div>
  );
}

export default function SolicitudesPage() {
  const { solicitudes, isLoading, listarSolicitudes, listarPorEstado, listarPorTipo } = useSolicitudes();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("TODOS");
  const [filterTipo, setFilterTipo] = useState<string>("TODOS");
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>([]);

  const rol = user?.tipo as Rol || 'CLIENTE';

  const tiposPermitidosCrear = useMemo(() => permisosSolicitudes.puedeCrear[rol] || [], [rol]);
  const tiposPermitidosVer = useMemo(() => permisosSolicitudes.puedeVer[rol] || [], [rol]);
  const puedeCambiarEstado = useMemo(() => permisosSolicitudes.puedeCambiarEstado[rol] || [], [rol]);

  useEffect(() => {
    const fetchData = async () => {
      let data: Solicitud[] = [];
      if (filterEstado !== "TODOS" && filterTipo !== "TODOS") {
        const porEstado = await listarPorEstado(filterEstado);
        data = porEstado.filter(s => s.tipoSolicitud === filterTipo);
      } else if (filterEstado !== "TODOS") {
        data = await listarPorEstado(filterEstado);
      } else if (filterTipo !== "TODOS") {
        data = await listarPorTipo(filterTipo);
      } else {
        data = solicitudes;
      }
      if (tiposPermitidosVer.length > 0) data = data.filter(s => tiposPermitidosVer.includes(s.tipoSolicitud));
      setFilteredSolicitudes(data);
    };
    fetchData();
  }, [filterEstado, filterTipo, solicitudes, listarPorEstado, listarPorTipo, tiposPermitidosVer]);

  const displayedSolicitudes = filteredSolicitudes.filter(s =>
    s.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.codigoTicket.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCrearSolicitud = () => {
    setShowCrearModal(false);
    listarSolicitudes();
  };

  const tipoFilterOptions = [
    { value: "TODOS", label: "Todos los tipos" },
    ...(tiposPermitidosVer.includes('SERVICIO') ? [{ value: "SERVICIO", label: "Servicio" }] : []),
    ...(tiposPermitidosVer.includes('INFORMACION') ? [{ value: "INFORMACION", label: "Información" }] : []),
    ...(tiposPermitidosVer.includes('ACCESO') ? [{ value: "ACCESO", label: "Acceso" }] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-zinc-100">
            {rol === 'ADMINISTRADOR' ? 'Gestión de Solicitudes' : 'Mis Solicitudes'}
          </h2>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{displayedSolicitudes.length}</span>
        </div>
        {tiposPermitidosCrear.length > 0 && (
          <button onClick={() => setShowCrearModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded text-amber-500 text-xs uppercase tracking-widest hover:bg-amber-500/20 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nueva Solicitud
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
            <option value="EN_PROCESO">En Proceso</option>
            <option value="COMPLETADA">Completadas</option>
            <option value="RECHAZADA">Rechazadas</option>
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
        ) : displayedSolicitudes.length > 0 ? (
          displayedSolicitudes.map(solicitud => (
            <SolicitudCard key={solicitud.id} solicitud={solicitud} onVerDetalle={setSelectedSolicitud} rol={rol} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <ClipboardList className="w-12 h-12 text-zinc-700" />
            <p className="text-sm text-zinc-500 uppercase tracking-widest">No hay solicitudes disponibles</p>
            <p className="text-xs text-zinc-600 max-w-xs">
              {searchTerm || filterEstado !== "TODOS" || filterTipo !== "TODOS"
                ? "No se encontraron solicitudes con los filtros aplicados"
                : tiposPermitidosCrear.length > 0
                  ? "Haz clic en 'Nueva Solicitud' para crear tu primera solicitud"
                  : "Tu rol no te permite crear solicitudes"}
            </p>
          </div>
        )}
      </div>

      <CrearSolicitudModal isOpen={showCrearModal} onClose={() => setShowCrearModal(false)} onSuccess={handleCrearSolicitud} />
      <DetalleSolicitudModal isOpen={!!selectedSolicitud} solicitud={selectedSolicitud} onClose={() => setSelectedSolicitud(null)}
        onEstadoActualizado={() => { listarSolicitudes(); setSelectedSolicitud(null); }}
        puedeCambiarEstado={puedeCambiarEstado} rol={rol} />
    </div>
  );
}
