"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, loginWithSteam } = useAuth();
  const router = useRouter();
  const [loadingSteam, setLoadingSteam] = useState(false);

  // Handle Steam Login if steamId is in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const steamId = urlParams.get("steamId");
    if (steamId) {
      handleSteamLogin(steamId);
    }
  }, []);

  const handleSteamLogin = async (steamId: string) => {
    setLoadingSteam(true);
    try {
      await loginWithSteam(steamId);
      router.push("/");
    } catch (err: any) {
      setError("Error al unirse con Steam: " + err.message);
    } finally {
      setLoadingSteam(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center p-4">
      <AuthBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md space-y-6 rounded-2xl bg-card-bg/80 backdrop-blur-xl border border-border-color p-8 shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)]"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-rose-600 shadow-lg shadow-rose-500/30">
            <UserPlus className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mt-2">Nuevo Jugador</h2>
          <p className="text-sm text-muted">Únete a GameTrack</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nombre de Usuario</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-border-color bg-background/50 px-4 py-2.5 text-foreground placeholder-muted focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all sm:text-sm"
                placeholder="Tu gamertag"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-border-color bg-background/50 px-4 py-2.5 text-foreground placeholder-muted focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all sm:text-sm"
                placeholder="tu@email.com"
              />
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-foreground">Contraseña</label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-border-color bg-background/50 px-4 py-2.5 pr-12 text-foreground placeholder-muted focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-rose-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white border-0 py-6 font-semibold text-md shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
            Crear cuenta
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-color"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card-bg px-2 text-muted">O continúa con</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => window.location.href = "/api/auth/steam"}
          disabled={loadingSteam}
          className="w-full border-border-color hover:border-rose-500 hover:bg-rose-500/5 transition-all flex items-center justify-center gap-3 py-6"
        >
          <img src="/steam-icon.svg" alt="Steam" className="w-5 h-5" onError={(e) => (e.target as any).style.display='none'} />
          {loadingSteam ? "Verificando..." : "Unirse con Steam"}
        </Button>

        <p className="text-center text-sm text-muted">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-semibold text-rose-500 hover:text-rose-400 transition-colors">
            Iniciar Sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
