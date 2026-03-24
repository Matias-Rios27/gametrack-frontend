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
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeGames, setActiveGames] = useState<UsuarioJuego[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
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
          
          const playingGames = games.filter((g) => g.estado === "jugando");
          
          // Ordenar todos los juegos por updatedAt (o fecha_inicio, o fallback)
          const sortedGames = [...games].sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.fecha_inicio || 0).getTime();
            const timeB = new Date(b.updatedAt || b.fecha_inicio || 0).getTime();
            return timeB - timeA;
          });
          
          // Mostrar los 4 interactuados mas recientemente
          setActiveGames(sortedGames.slice(0, 4));
          setCompletedCount(games.filter((g) => g.estado === "completado").length);
          
          const hours = games.reduce((acc, curr) => acc + (curr.horas_jugadas || 0), 0);
          setTotalHours(hours);

          setWishlist(wList.filter(w => w.prioridad === "alta"));
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setDataLoading(false);
        }
      };

      fetchData();
    }
  }, [user]);

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
            <div className="text-3xl font-bold text-foreground">{totalHours}</div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">Registradas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">Racha Actual</CardTitle>
            <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">0 Días</div>
            <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">Sigue así!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recientes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Jugando Recientemente</CardTitle>
            <CardDescription>Tus títulos activos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGames.length === 0 ? (
              <div className="text-center py-8 text-muted text-sm">No estás jugando a nada actualmente.</div>
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
                    <div className="text-xs text-muted mt-1">{ag.progreso || 0}% Progreso</div>
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
    </div>
  );
}
