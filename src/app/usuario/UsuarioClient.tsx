// src/app/usuario/UsuarioClient.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ClipboardList, GitBranch } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PerfilTab from "./components/PerfilTab";
import SolicitudesTab from "./components/SolicitudesTab";
import CambiosTab from "./components/CambiosTab";
import { SolicitudProvider } from "@/context/SolicitudContext";
import { CambioProvider } from "@/context/CambioContext";

type Rol = "ADMINISTRADOR" | "MESERO" | "COCINERO" | "CLIENTE";

interface PerfilUsuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  fechaRegistro: string;
}

type Tab = "perfil" | "solicitudes" | "cambios";

const rolLabels: Record<Rol, string> = {
  ADMINISTRADOR: "Administrador",
  MESERO: "Mesero",
  COCINERO: "Cocinero",
  CLIENTE: "Cliente",
};

const rolColors: Record<Rol, string> = {
  ADMINISTRADOR: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  MESERO: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  COCINERO: "bg-orange-500/15 border-orange-500/30 text-orange-400",
  CLIENTE: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
};

function getInitials(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

function TabButton({
  id,
  active,
  icon: Icon,
  label,
  onClick,
  visible = true,
}: {
  id: string;
  active: boolean;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  visible?: boolean;
}) {
  if (!visible) return null;

  return (
    <button
      id={id}
      onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest transition-colors ${active ? "text-[#C6A96B]" : "text-stone-500 hover:text-stone-300"
        }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      {active && (
        <motion.span
          layoutId="tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-px bg-[#C6A96B]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );
}

function UsuarioContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const param = searchParams.get("tab");
    if (param === "solicitudes") return "solicitudes";
    if (param === "cambios") return "cambios";
    return "perfil";
  });

  useEffect(() => {
    const param = searchParams.get("tab");
    if (param === "solicitudes") setActiveTab("solicitudes");
    else if (param === "cambios") setActiveTab("cambios");
    else setActiveTab("perfil");
  }, [searchParams]);

  const rol = user?.tipo as Rol || 'CLIENTE';
  const esAdmin = rol === 'ADMINISTRADOR';

  const perfil: PerfilUsuario | null = user
    ? {
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.tipo as Rol,
      fechaRegistro: new Date().toISOString().split("T")[0],
    }
    : null;

  return (
    <CambioProvider>
      <SolicitudProvider>
        <div className="min-h-screen bg-[#0B0B0C]">
          <header className="border-b border-stone-800 bg-[#0B0B0C]/80 backdrop-blur-md sticky top-0 z-30">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link href="/" className="font-serif text-[#C6A96B] text-xl tracking-wider">
                Le Bon Goût
              </Link>
              <div className="flex items-center gap-3">
                {perfil && (
                  <span className="hidden sm:inline text-xs text-stone-500 uppercase tracking-widest">
                    {perfil.nombre} {perfil.apellido}
                  </span>
                )}
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="p-2 rounded border border-stone-800 text-stone-500 hover:text-red-400 hover:border-red-500/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs uppercase tracking-widest text-[#C6A96B] mb-1">
                Panel de Usuario
              </p>
              <h1 className="font-serif text-3xl text-white">
                Bienvenido
                {perfil && <>, <span className="text-[#C6A96B]">{perfil.nombre}</span></>}
              </h1>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="bg-[#121214] border border-stone-800 rounded p-6 space-y-5 sticky top-24">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C6A96B]" />
                    <h2 className="text-xs uppercase tracking-widest text-stone-400">
                      Datos Personales
                    </h2>
                  </div>

                  {perfil ? (
                    <>
                      <div className="flex flex-col items-center gap-3 py-4 border-y border-stone-800">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C6A96B]/30 to-[#C6A96B]/10 border border-[#C6A96B]/40 flex items-center justify-center">
                          <span className="font-serif text-2xl text-[#C6A96B]">
                            {getInitials(perfil.nombre, perfil.apellido)}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium text-lg font-serif">
                            {perfil.nombre} {perfil.apellido}
                          </p>
                          <span
                            className={`mt-1.5 inline-block px-3 py-0.5 rounded border text-xs uppercase tracking-widest ${rolColors[perfil.rol]}`}
                          >
                            {rolLabels[perfil.rol]}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-stone-500">Correo</p>
                          <p className="text-sm text-white break-words">{perfil.email}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3 py-4 animate-pulse">
                      <div className="w-20 h-20 rounded-full bg-stone-800 mx-auto" />
                      <div className="h-4 bg-stone-800 rounded w-3/4 mx-auto" />
                      <div className="h-3 bg-stone-800 rounded w-1/2 mx-auto" />
                    </div>
                  )}

                  <button
                    onClick={logout}
                    className="w-full border border-stone-800 text-stone-400 py-2.5 rounded text-sm uppercase tracking-widest hover:border-red-500/40 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </motion.aside>

              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="lg:col-span-2"
              >
                <div className="bg-[#121214] border border-stone-800 rounded overflow-hidden">
                  <div className="flex border-b border-stone-800">
                    <TabButton
                      id="tab-perfil"
                      active={activeTab === "perfil"}
                      icon={User}
                      label="Mi Perfil"
                      onClick={() => setActiveTab("perfil")}
                    />
                    <TabButton
                      id="tab-solicitudes"
                      active={activeTab === "solicitudes"}
                      icon={ClipboardList}
                      label="Solicitudes"
                      onClick={() => setActiveTab("solicitudes")}
                    />
                    <TabButton
                      id="tab-cambios"
                      active={activeTab === "cambios"}
                      icon={GitBranch}
                      label="Gestión de Cambios"
                      onClick={() => setActiveTab("cambios")}
                      visible={esAdmin}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === "perfil" && <PerfilTab perfil={perfil} />}
                    {activeTab === "solicitudes" && <SolicitudesTab userId={perfil?.idUsuario} />}
                    {activeTab === "cambios" && <CambiosTab userId={perfil?.idUsuario} />}
                  </AnimatePresence>
                </div>
              </motion.section>
            </div>
          </main>
        </div>
      </SolicitudProvider>
    </CambioProvider>
  );
}

export default function UsuarioClient() {
  return <UsuarioContent />;
}