"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";

function SteamLinkContent() {
  const { user, userData } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [steamInput, setSteamInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const steamIdLinked = userData?.steamId;
  const steamNameLinked = userData?.steamName;
  const steamAvatarLinked = userData?.steamAvatar;

  // Handle automatic linking from search params (OpenID return)
  useEffect(() => {
    const linkedSteamId = searchParams.get("linked_steam_id");
    const authError = searchParams.get("error");

    if (authError) {
      setError("La autenticación con Steam falló o fue cancelada.");
      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else if (linkedSteamId && user && !steamIdLinked && !loading) {
      autoLinkSteam(linkedSteamId);
    }
  }, [searchParams, user, steamIdLinked]);

  const autoLinkSteam = async (steamId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/steam/profile?identifier=${steamId}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error("Error al obtener perfil de Steam");

      await updateDoc(doc(db, "users", user!.uid), {
        steamId: data.steamid,
        steamName: data.personaname,
        steamAvatar: data.avatar
      });

      // Clear URL params
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenIDLink = () => {
    window.location.href = "/api/auth/steam";
  };

  const handleManualLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!steamInput.trim() || !user) return;
    autoLinkSteam(steamInput.trim());
  };

  const handleUnlinkSteam = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        steamId: null,
        steamName: null,
        steamAvatar: null
      });
      window.location.reload();
    } catch (err) {
      console.error("Error unlinking steam", err);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl bg-card-bg border border-border-color mt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <span className="w-2 h-8 bg-[#171a21] dark:bg-[#66c0f4] rounded-full shadow-[0_0_8px_rgba(102,192,244,0.6)]"></span>
        Conexión con Steam
      </h2>

      {steamIdLinked ? (
        <div className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border border-electric-blue/30 bg-electric-blue/5">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            {steamAvatarLinked ? (
              <img src={steamAvatarLinked} alt="Steam Avatar" className="w-12 h-12 rounded-full border border-border-color" />
            ) : (
              <div className="w-12 h-12 bg-gray-700 rounded-full" />
            )}
            <div>
              <p className="font-semibold text-foreground">{steamNameLinked || "Cuenta de Steam"}</p>
              <p className="text-xs text-muted">Conectada exitosamente</p>
            </div>
            <Check className="text-success h-5 w-5 ml-2" />
          </div>
          <Button variant="outline" onClick={handleUnlinkSteam} className="border-red-500/50 text-red-500 hover:bg-red-500/10">
            Desvincular Cuenta
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-color rounded-2xl bg-black/5 dark:bg-white/5 space-y-4">
             <p className="text-center text-muted text-sm max-w-sm">
                La forma más segura y rápida es autenticándote directamente en la página oficial de Steam.
             </p>
             <button 
                onClick={handleOpenIDLink}
                disabled={loading}
                className="flex items-center gap-3 px-8 py-3 bg-[#171a21] hover:bg-[#2a475e] text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/20"
             >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <img src="https://community.cloudflare.steamstatic.com/public/images/signinthroughsteam/sits_01.png" alt="Sign in through Steam" className="h-8" />
                )}
             </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-color"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card-bg px-2 text-muted">O de forma manual</span>
            </div>
          </div>

          <form onSubmit={handleManualLink} className="space-y-4">
            <p className="text-muted text-xs mb-2">
              Si el botón no funciona, ingresa tu SteamID64 o tu URL personalizada:
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                required
                value={steamInput}
                onChange={(e) => setSteamInput(e.target.value)}
                placeholder="Ej: 76561198000000000 o mi_usuario"
                className="flex-1 rounded-lg border border-border-color bg-background/50 px-4 py-2.5 text-foreground placeholder-muted focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all sm:text-sm"
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !steamInput.trim()} className="bg-gradient-to-r from-[#171a21] to-[#2a475e] text-white py-2.5 px-6 font-semibold md:w-auto w-full">
                Vincular
              </Button>
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20 flex items-center gap-2">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SteamLinkSection() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted">Cargando conexión...</div>}>
            <SteamLinkContent />
        </Suspense>
    );
}
