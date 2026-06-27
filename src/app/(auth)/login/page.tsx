"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UtensilsCrossed } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login({ email, password });
    setLoading(false);
    if (ok) {
      router.push("/perfil");
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-amber-700 to-amber-500">
      <div className="bg-neutral-950/90 backdrop-blur-xl rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.15)] border border-amber-900/40 p-10 w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-amber-500 text-black p-3 rounded-full mb-4 shadow-lg shadow-amber-500/30">
            <UtensilsCrossed size={32} />
          </div>
          <h1 className="text-2xl font-bold text-amber-500">Le Bon Gout</h1>
          <p className="text-sm text-zinc-400 mt-1">Sistema de Gestión</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="Ingrese su correo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="Ingrese su contraseña"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:shadow-amber-500/25"
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
