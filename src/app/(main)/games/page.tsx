"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getUserGames, UsuarioJuego } from "@/lib/services/games";

export default function GamesPage() {
  const { user, loading } = useAuth();
  const [games, setGames] = useState<UsuarioJuego[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      console.log("Fetching games for user:", user.uid);
      getUserGames(user.uid).then((data) => {
        console.log("Fetched games data:", data);
        setGames(data);
        setDataLoading(false);
      }).catch(err => {
        console.error("Error fetching games in page:", err);
        setDataLoading(false);
      });
    } else if (!loading) {
      setDataLoading(false);
    }
  }, [user, loading]);

  if (loading || dataLoading) {
    return <div className="p-8 text-center text-muted">Cargando tus juegos...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-slate-400">Inicia sesión para ver tus juegos.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Juegos</h1>
          <p className="text-muted">Gestiona tu colección y seguimiento de progreso.</p>
        </div>
        <Link href="/games/add">
          <Button className="gap-2 bg-electric-blue hover:bg-electric-blue/90 text-black shadow-lg shadow-electric-blue/20">
            <PlusCircle className="h-4 w-4" />
            Añadir Juego
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input placeholder="Buscar juegos..." className="pl-10 border-border-color bg-card-bg" />
        </div>
        <Button variant="outline" className="gap-2 shrink-0 border-border-color bg-card-bg hover:bg-black/5 dark:hover:bg-white/5">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-16 bg-card-bg rounded-xl border border-dashed border-border-color">
          <p className="text-muted mb-4">Aún no has añadido ningún juego a tu colección.</p>
          <Link href="/games/add">
            <Button variant="outline" className="border-electric-blue/50 text-electric-blue hover:bg-electric-blue/10">Añadir tu primer juego</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link href={`/games/${game.id}`} key={game.id} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue rounded-xl">
              <Card className="h-full overflow-hidden border-border-color bg-card-bg hover:bg-black/5 dark:hover:bg-white/5 hover:border-electric-blue transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="h-32 bg-card-bg relative w-full overflow-hidden border-b border-border-color">
                  {game.juego?.portada_url ? (
                    <img src={game.juego.portada_url} alt="Portada" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/20 to-transparent mix-blend-overlay"></div>
                  )}
                  <div className="absolute bottom-3 left-4 flex gap-2">
                    <Badge 
                      variant={
                        game.estado === 'jugando' ? 'success' : 
                        game.estado === 'completado' ? 'info' : 
                        game.estado === 'pausado' ? 'warning' : 'danger'
                      }
                      className="capitalize shadow-sm backdrop-blur-md bg-opacity-90"
                    >
                      {game.estado}
                    </Badge>
                    {game.steam_appid && (
                      <Badge variant="outline" className="bg-[#171a21]/80 backdrop-blur-md border-[#66c0f4]/30 text-[#66c0f4] text-[10px] h-5">
                        Steam
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-electric-blue transition-colors line-clamp-1">{game.juego?.titulo || "Juego Sin Título"}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                    <span>{game.juego?.plataforma || "Cualquier plataforma"}</span>
                    <span>•</span>
                    <span>{game.juego?.genero || "Sin género"}</span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-foreground">
                      <span>Progreso</span>
                      <span className="font-medium">{game.progreso || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-card-bg border border-border-color rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-electric-blue rounded-full shadow-[0_0_8px_var(--color-electric-blue)]" 
                        style={{ width: `${game.progreso || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs font-medium text-soft text-right">
                    {game.horas_jugadas || 0} hrs jugadas
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

