// src/app/usuario/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import UsuarioClient from "./UsuarioClient";

export const metadata: Metadata = {
  title: "Mi Perfil — Le Bon Gout",
  description: "Consulta tus datos personales e historial de solicitudes en Le Bon Gout.",
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-[#C6A96B]/30 border-t-[#C6A96B] rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-stone-600">Cargando perfil…</p>
      </div>
    </div>
  );
}

export default function UsuarioPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UsuarioClient />
    </Suspense>
  );
}