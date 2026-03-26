"use client";

import { useEffect, useState } from "react";
import { Gamepad2, Trophy, Clock, Flame, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getUserGames, UsuarioJuego } from "@/lib/services/games";
import { getUserWishlist, WishlistItem } from "@/lib/services/wishlist";

export default function Home() {
  const { user, loading, userData } = useAuth();
  const router = useRouter();

  const [activeGames, setActiveGames] = useState<UsuarioJuego[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [steamTotalHours, setSteamTotalHours] = useState(0);
  const [steamLibrary, setSteamLibrary] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const games = await getUserGames(user.uid);
          const wList = await getUserWishlist(user.uid);

          let steamRecentGames: any[] = [];
          let sHours = 0;

          // Fetch Steam Data if linked
          if (userData?.steamId) {
            try {
              const steamRes = await fetch(`/api/steam/games?steamid=${userData.steamId}`);
              const steamData = await steamRes.json();

              if (steamData.response?.games) {
                const allSteamGames = steamData.response.games;
                setSteamLibrary(allSteamGames);

                sHours = Math.floor(
                  allSteamGames.reduce((acc: number, curr: any) => acc + (curr.playtime_forever || 0), 0) / 60
                );

                steamRecentGames = allSteamGames
                  .filter((g: any) => g.playtime_2weeks && g.playtime_2weeks > 0)
                  .sort((a: any, b: any) => b.playtime_2weeks - a.playtime_2weeks)
                  .map((g: any) => ({
                    id: `steam-${g.appid}`,
                    estado: 'jugando (Steam)',
                    horas_jugadas: Math.floor(g.playtime_forever / 60),
                    progreso: null,
                    updatedAt: new Date().toISOString(),
                    juego: {
                      titulo: g.name,
                      plataforma: 'Steam',
                      portada_url: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.appid}/library_600x900_2x.jpg`
                    }
                  }));
              }
            } catch (err) {
              console.error("Error fetching steam games for dashboard", err);
            }
          }

          // Combine local active games (playing only)
          const sortedGames = [...games].sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.fecha_inicio || 0).getTime();
            const timeB = new Date(b.updatedAt || b.fecha_inicio || 0).getTime();
            return timeB - timeA;
          });

          const localActive = sortedGames.filter(g => g.estado === 'jugando');

          // Only show local active games (limit to 4)
          setActiveGames(localActive.slice(0, 4));
          setCompletedCount(games.filter((g) => g.estado === "completado").length);

          const hours = games.reduce((acc, curr) => acc + (curr.horas_jugadas || 0), 0);
          setTotalHours(hours);
          setSteamTotalHours(sHours);

          setWishlist(wList.filter(w => w.prioridad === "alta"));
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setDataLoading(false);
        }
      };

      fetchData();
    }
  }, [user, userData]);

  if (loading || dataLoading) {
    return <div className="p-8 text-center text-muted">Cargando...</div>;
  }

  if (!user) return null; // Wait for redirect

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted">Bienvenido de vuelta. Aquí está el resumen de tu backlog.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-electric-blue/10 to-transparent border-electric-blue/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-electric-blue opacity-80">Juegos Completados</CardTitle>
            <Trophy className="h-4 w-4 text-electric-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{completedCount}</div>
            <p className="text-xs text-electric-blue/70 mt-1">En total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Jugando Actualmente</CardTitle>
            <Gamepad2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activeGames.length}</div>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">Juegos activos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Horas Totales</CardTitle>
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalHours + steamTotalHours}</div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
              {userData?.steamId ? `${totalHours} locales + ${steamTotalHours} Steam` : 'Registradas'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">Total Gastado (Steam)</CardTitle>
            <div className="p-1 px-2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">ESTIMADO</div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ${userData?.spent_steam || (steamLibrary.length * 15).toLocaleString()}
            </div>
            <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
              Basado en {steamLibrary.length} juegos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recientes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Jugando Actualmente</CardTitle>
            <CardDescription>Tus títulos activos en tu backlog.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGames.length === 0 ? (
              <div className="text-center py-8 text-muted text-sm">No tienes juegos en estado "Jugando".</div>
            ) : (
              activeGames.map((ag) => (
                <Link href={`/games/${ag.id}`} key={ag.id} className="flex items-center gap-4 p-4 rounded-lg bg-card-bg border border-border-color hover:border-electric-blue hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
                  <div className="h-16 w-12 rounded bg-card-bg border border-border-color flex-shrink-0 relative overflow-hidden group-hover:ring-1 group-hover:ring-electric-blue transition-all">
                    {ag.juego?.portada_url ? (
                      <img src={ag.juego.portada_url} alt="Portada" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/40 to-transparent opacity-40"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-foreground truncate group-hover:text-electric-blue transition-colors">{ag.juego?.titulo || "Juego Desconocido"}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={ag.estado === 'jugando' ? 'success' : 'outline'} className={ag.estado !== 'jugando' ? 'text-muted border-border-color' : ''}>
                        {ag.estado.charAt(0).toUpperCase() + ag.estado.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted">{ag.juego?.plataforma || "PC"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{ag.horas_jugadas || 0} hrs</div>
                    {ag.progreso !== null && (
                      <div className="text-xs text-muted mt-1">{ag.progreso}% Progreso</div>
                    )}
                  </div>
                </Link>
              ))
            )}

            <Link href="/games">
              <Button variant="outline" className="w-full mt-2">Ir a Mis Juegos</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Wishlist Corta */}
        <Card>
          <CardHeader>
            <CardTitle>Wishlist Destacada</CardTitle>
            <CardDescription>Alta prioridad.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-8 text-muted text-sm">Wishlist vacía.</div>
            ) : (
              wishlist.map(w => (
                <div key={w.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-card-bg border border-border-color flex items-center justify-center">
                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{w.juego?.titulo || "Juego Desconocido"}</p>
                    <p className="text-xs text-muted">Alta Prioridad</p>
                  </div>
                </div>
              ))
            )}

            <Link href="/wishlist">
              <Button variant="ghost" className="w-full mt-4">Ir a Wishlist</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {steamLibrary.length > 0 && (
        <Card className="border-border-color bg-card-bg/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <img src="/steam-icon.svg" alt="Steam" className="w-5 h-5" onError={(e) => (e.target as any).style.display = 'none'} />
                Mi Biblioteca de Steam
              </CardTitle>
              <CardDescription>Tienes {steamLibrary.length} juegos en Steam.</CardDescription>
            </div>
            <Link href="/games/add">
              <Button variant="outline" size="sm" className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10">Importar juegos</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border-color scrollbar-track-transparent">
              {steamLibrary.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 15).map((game) => (
                <div key={game.appid} className="flex-shrink-0 w-32 group cursor-pointer">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border-color mb-2 group-hover:border-electric-blue/50 transition-all relative">
                    <img
                      src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/library_600x900_2x.jpg`}
                      alt={game.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                      onError={(e) => {
                        (e.target as any).src = "https://via.placeholder.com/600x900?text=" + encodeURIComponent(game.name);
                      }}
                    />
                    {game.playtime_forever > 0 && (
                      <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">
                        {Math.floor(game.playtime_forever / 60)}h
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] font-medium truncate text-foreground/80 text-center">{game.name}</p>
                </div>
              ))}
              {steamLibrary.length > 15 && (
                <div className="flex-shrink-0 w-32 flex flex-col items-center justify-center p-4 border border-dashed border-border-color rounded-lg bg-black/5 dark:bg-white/5">
                  <p className="text-xs text-muted text-center italic">...y {steamLibrary.length - 15} juegos más</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
