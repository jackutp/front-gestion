"use client";

import { useAuth } from "@/context/AuthContext";
import { User, ClipboardList, Clock, CheckCircle } from "lucide-react";

const stats = [
  { label: "Total Gestiones", value: "24", icon: ClipboardList },
  { label: "Pendientes", value: "8", icon: Clock },
  { label: "Resueltas", value: "14", icon: CheckCircle },
];

export default function PerfilPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="bg-neutral-900 border border-zinc-800 rounded-xl p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
          <User size={36} className="text-amber-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">{user?.nombre} {user?.apellido}</h2>
          <p className="text-amber-500 font-medium">{user?.tipo}</p>
          <p className="text-zinc-400 text-sm">{user?.email}</p>
          <p className="text-zinc-500 text-xs">DNI: {user?.dni}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-neutral-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4 hover:border-amber-500/30 transition-colors">
            <div className="bg-amber-500/10 p-3 rounded-lg text-amber-500">
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{s.value}</p>
              <p className="text-sm text-zinc-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-500 mb-3">Actividad Reciente</h3>
        <p className="text-zinc-400 text-sm">No hay actividad reciente para mostrar.</p>
      </div>
    </div>
  );
}
