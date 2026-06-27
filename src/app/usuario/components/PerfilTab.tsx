// src/app/usuario/components/PerfilTab.tsx
"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, BadgeCheck, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Rol = "ADMINISTRADOR" | "MESERO" | "COCINERO" | "CLIENTE";

interface PerfilUsuario {
    idUsuario: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: Rol;
    fechaRegistro: string;
}

const rolLabels: Record<Rol, string> = {
    ADMINISTRADOR: "Administrador",
    MESERO: "Mesero",
    COCINERO: "Cocinero",
    CLIENTE: "Cliente",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3 py-3.5 border-b border-stone-800/70 last:border-0">
            <div className="mt-0.5 w-8 h-8 rounded bg-[#C6A96B]/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#C6A96B]" />
            </div>
            <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-0.5">{label}</p>
                <p className="text-sm text-white font-medium break-words">{value}</p>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface PerfilTabProps {
    perfil: PerfilUsuario | null;
}

export default function PerfilTab({ perfil }: PerfilTabProps) {
    return (
        <motion.div
            key="perfil"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="p-8"
        >
            <h2 className="font-serif text-xl text-white mb-1">Información de la Cuenta</h2>
            <p className="text-sm text-stone-500 mb-6">
                Aquí puedes consultar los datos asociados a tu cuenta.
            </p>

            {perfil ? (
                <>
                    {/* Versión detallada para escritorio */}
                    <dl className="hidden sm:grid sm:grid-cols-2 gap-x-8 gap-y-0">
                        <div className="py-3.5 border-b border-stone-800/60">
                            <dt className="text-xs uppercase tracking-widest text-stone-500 mb-0.5">Nombre</dt>
                            <dd className="text-sm text-white font-medium">{perfil.nombre}</dd>
                        </div>
                        <div className="py-3.5 border-b border-stone-800/60">
                            <dt className="text-xs uppercase tracking-widest text-stone-500 mb-0.5">Apellido</dt>
                            <dd className="text-sm text-white font-medium">{perfil.apellido}</dd>
                        </div>
                        <div className="py-3.5 border-b border-stone-800/60">
                            <dt className="text-xs uppercase tracking-widest text-stone-500 mb-0.5">Correo</dt>
                            <dd className="text-sm text-white font-medium">{perfil.email}</dd>
                        </div>
                        <div className="py-3.5 border-b border-stone-800/60">
                            <dt className="text-xs uppercase tracking-widest text-stone-500 mb-0.5">Rol</dt>
                            <dd className="text-sm text-white font-medium">{rolLabels[perfil.rol]}</dd>
                        </div>
                        <div className="py-3.5 border-b border-stone-800/60">
                            <dt className="text-xs uppercase tracking-widest text-stone-500 mb-0.5">Miembro desde</dt>
                            <dd className="text-sm text-white font-medium">
                                {perfil.fechaRegistro
                                    ? new Date(perfil.fechaRegistro).toLocaleDateString("es-PE", {
                                        year: "numeric",
                                        month: "long",
                                        day: "2-digit",
                                    })
                                    : "—"}
                            </dd>
                        </div>
                    </dl>

                    {/* Versión compacta para móvil */}
                    <div className="sm:hidden">
                        <InfoRow icon={User} label="Nombre completo" value={`${perfil.nombre} ${perfil.apellido}`} />
                        <InfoRow icon={Mail} label="Correo Electrónico" value={perfil.email} />
                        <InfoRow icon={BadgeCheck} label="Rol / Puesto" value={rolLabels[perfil.rol]} />
                        <InfoRow
                            icon={Calendar}
                            label="Miembro desde"
                            value={perfil.fechaRegistro
                                ? new Date(perfil.fechaRegistro).toLocaleDateString("es-PE", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                })
                                : "—"}
                        />
                    </div>
                </>
            ) : (
                <div className="space-y-3 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 bg-stone-800/50 rounded" />
                    ))}
                </div>
            )}
        </motion.div>
    );
}