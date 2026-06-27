// src/app/usuario/components/SolicitudesTab.tsx
"use client";

import { motion } from "framer-motion";
import { ClipboardList, Plus, Search, Filter, ExternalLink, Eye } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSolicitudes } from "@/context/SolicitudContext";
import { useAuth } from "@/context/AuthContext";
import { Solicitud, EstadoSolicitud, TipoSolicitud, permisosSolicitudes, Rol } from "@/types/solicitud";
import CrearSolicitudModal from "./CrearSolicitudModal";
import DetalleSolicitudModal from "./DetalleSolicitudModal";

// ─── Constants ────────────────────────────────────────────────────────────────

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

const prioridadLabels: Record<string, string> = {
  ALTA: "Alta",
  MEDIA: "Media",
  BAJA: "Baja",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SolicitudCard({
  solicitud,
  onVerDetalle,
  rol,
}: {
  solicitud: Solicitud;
  onVerDetalle: (solicitud: Solicitud) => void;
  rol: Rol;
}) {
  // Verificar si el rol puede ver este tipo de solicitud
  const puedeVer = permisosSolicitudes.puedeVer[rol]?.includes(solicitud.tipoSolicitud) ?? true;

  if (!puedeVer) return null;

  return (
    <div className="border border-stone-800 rounded-lg p-4 hover:bg-stone-900/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="text-white font-medium text-base">{solicitud.titulo}</h3>
            <span className={`px-2 py-0.5 rounded border text-xs uppercase tracking-widest ${tipoColors[solicitud.tipoSolicitud]}`}>
              {tipoLabels[solicitud.tipoSolicitud]}
            </span>
            <span className={`px-2 py-0.5 rounded border text-xs uppercase tracking-widest ${estadoColors[solicitud.estado]}`}>
              {estadoLabels[solicitud.estado]}
            </span>
          </div>
          <p className="text-stone-400 text-sm line-clamp-2">{solicitud.descripcion}</p>
        </div>
        <button
          onClick={() => onVerDetalle(solicitud)}
          className="ml-3 p-2 rounded border border-stone-700 text-stone-500 hover:text-[#C6A96B] hover:border-[#C6A96B]/30 transition-colors"
          title="Ver detalle"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-4 text-xs text-stone-500 flex-wrap">
        <span className="uppercase tracking-widest">
          Código: {solicitud.codigoTicket}
        </span>
        <span className="uppercase tracking-widest">
          Prioridad: {prioridadLabels[solicitud.prioridad] || solicitud.prioridad}
        </span>
        <span className="uppercase tracking-widest">
          Creado: {new Date(solicitud.fechaCreacion).toLocaleDateString("es-PE")}
        </span>
        {solicitud.responsableAsignado && (
          <span className="uppercase tracking-widest">
            Responsable: {solicitud.responsableAsignado}
          </span>
        )}
        {solicitud.jiraTicketId && (
          <a
            href={solicitud.jiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#C6A96B] hover:underline"
          >
            Jira: {solicitud.jiraTicketId}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface SolicitudesTabProps {
  userId?: number;
}

export default function SolicitudesTab({ userId }: SolicitudesTabProps) {
  const { solicitudes, isLoading, listarSolicitudes, listarPorEstado, listarPorTipo } = useSolicitudes();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("TODOS");
  const [filterTipo, setFilterTipo] = useState<string>("TODOS");
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>([]);

  const rol = user?.tipo as Rol || 'CLIENTE';

  // Tipos que puede crear el usuario según su rol
  const tiposPermitidosCrear = useMemo(() => {
    return permisosSolicitudes.puedeCrear[rol] || [];
  }, [rol]);

  // Tipos que puede ver el usuario según su rol
  const tiposPermitidosVer = useMemo(() => {
    return permisosSolicitudes.puedeVer[rol] || [];
  }, [rol]);

  // Estados a los que puede cambiar el usuario
  const puedeCambiarEstado = useMemo(() => {
    return permisosSolicitudes.puedeCambiarEstado[rol] || [];
  }, [rol]);

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

      // Filtrar por tipos permitidos para el rol
      if (tiposPermitidosVer.length > 0) {
        data = data.filter(s => tiposPermitidosVer.includes(s.tipoSolicitud));
      }

      setFilteredSolicitudes(data);
    };

    fetchData();
  }, [filterEstado, filterTipo, solicitudes, listarPorEstado, listarPorTipo, tiposPermitidosVer]);

  // Filtro por búsqueda en cliente
  const displayedSolicitudes = filteredSolicitudes.filter((solicitud) => {
    const matchesSearch = solicitud.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.codigoTicket.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCrearSolicitud = () => {
    setShowCrearModal(false);
    listarSolicitudes();
  };

  // Opciones de filtro de tipo según el rol
  const tipoFilterOptions = [
    { value: "TODOS", label: "Todos los tipos" },
    ...(tiposPermitidosVer.includes('SERVICIO') ? [{ value: "SERVICIO", label: "Servicio" }] : []),
    ...(tiposPermitidosVer.includes('INFORMACION') ? [{ value: "INFORMACION", label: "Información" }] : []),
    ...(tiposPermitidosVer.includes('ACCESO') ? [{ value: "ACCESO", label: "Acceso" }] : []),
  ];

  return (
    <motion.div
      key="solicitudes"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
    >
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-5 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#C6A96B]" />
          <h2 className="text-xs uppercase tracking-widest text-stone-400">
            {rol === 'ADMINISTRADOR' ? 'Gestión de Solicitudes' : 'Mis Solicitudes'}
          </h2>
          <span className="text-xs text-stone-600 bg-stone-900 px-2 py-0.5 rounded-full">
            {displayedSolicitudes.length}
          </span>
        </div>

        {tiposPermitidosCrear.length > 0 && (
          <button
            onClick={() => setShowCrearModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#C6A96B]/10 border border-[#C6A96B]/30 rounded text-[#C6A96B] text-xs uppercase tracking-widest hover:bg-[#C6A96B]/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nueva Solicitud
          </button>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <div className="px-8 py-4 border-b border-stone-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar por título, descripción o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-900/50 border border-stone-800 rounded text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C6A96B]/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-500" />
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="bg-stone-900/50 border border-stone-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="COMPLETADA">Completadas</option>
            <option value="RECHAZADA">Rechazadas</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="bg-stone-900/50 border border-stone-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C6A96B]/50"
          >
            {tipoFilterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de solicitudes */}
      <div className="px-8 py-6 space-y-3 max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#C6A96B]/30 border-t-[#C6A96B] rounded-full animate-spin" />
          </div>
        ) : displayedSolicitudes.length > 0 ? (
          displayedSolicitudes.map((solicitud) => (
            <SolicitudCard
              key={solicitud.id}
              solicitud={solicitud}
              onVerDetalle={setSelectedSolicitud}
              rol={rol}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <ClipboardList className="w-12 h-12 text-stone-700" />
            <p className="text-sm text-stone-500 uppercase tracking-widest">
              No hay solicitudes disponibles
            </p>
            <p className="text-xs text-stone-600 max-w-xs">
              {searchTerm || filterEstado !== "TODOS" || filterTipo !== "TODOS"
                ? "No se encontraron solicitudes con los filtros aplicados"
                : tiposPermitidosCrear.length > 0
                  ? "Haz clic en 'Nueva Solicitud' para crear tu primera solicitud"
                  : "Tu rol no te permite crear solicitudes"}
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
      <CrearSolicitudModal
        isOpen={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onSuccess={handleCrearSolicitud}
      />

      <DetalleSolicitudModal
        isOpen={!!selectedSolicitud}
        solicitud={selectedSolicitud}
        onClose={() => setSelectedSolicitud(null)}
        onEstadoActualizado={() => {
          listarSolicitudes();
          setSelectedSolicitud(null);
        }}
        puedeCambiarEstado={puedeCambiarEstado}
        rol={rol}
      />
    </motion.div>
  );
}