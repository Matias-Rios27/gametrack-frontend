"use client"

import { use, useState, useEffect } from "react"
import { ArrowLeft, Edit, Clock, Trophy, Target, BookText, Edit2, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import EditGameModal from "@/components/games/EditGameModal"
import AddToWishlistButton from "@/components/wishlist/AddToWishlistButton"
import { useAuth } from "@/context/AuthContext"
import { getUserGame, UsuarioJuego } from "@/lib/services/games"
import { getGameDiary, DiarioEntry, deleteDiaryEntry } from "@/lib/services/diary"
import EditDiaryModal from "@/components/diary/EditDiaryModal"

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { user, userData } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDiaryEntry, setEditingDiaryEntry] = useState<DiarioEntry | null>(null);
  
  const [game, setGame] = useState<UsuarioJuego | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiarioEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (user && unwrappedParams.id) {
      const fetchData = async () => {
        try {
          const gameData = await getUserGame(unwrappedParams.id);
          if (gameData) {
            setGame(gameData);
            const entries = await getGameDiary(gameData.id!);
            setDiaryEntries(entries);
          }
        } catch (error) {
          console.error("Error fetching game detail:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (user === null) {
      setLoading(false);
    }
  }, [user, unwrappedParams.id]);

  const handleSyncSteam = async () => {
    if (!game?.steam_appid || !user) return;
    setSyncing(true);
    try {
      // Find steamId from userData if not in game
      const res = await fetch(`/api/steam/games?steamid=${userData?.steamId}`);
      const data = await res.json();
      const steamGame = data.response?.games?.find((g: any) => g.appid === game.steam_appid);
      
      if (steamGame) {
        const newHours = Math.floor(steamGame.playtime_forever / 60);
        const { updateDoc, doc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await updateDoc(doc(db, "usuario_juego", game.id!), {
            horas_jugadas: newHours,
            updatedAt: new Date().toISOString()
        });
        setGame({ ...game, horas_jugadas: newHours });
      }
    } catch (error) {
      console.error("Error syncing with steam:", error);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteDiary = async (entryId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta entrada?")) {
      try {
        await deleteDiaryEntry(entryId);
        // Refrescar las entradas localmente
        if (game?.id) {
          const entries = await getGameDiary(game.id);
          setDiaryEntries(entries);
        }
      } catch (error) {
        console.error("Error al eliminar la entrada:", error);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted">Cargando detalles del juego...</div>;
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center gap-4">
        <p className="text-muted text-lg">No se encontró este juego en tu colección.</p>
        <Link href="/games">
          <Button variant="outline">Volver a mis juegos</Button>
        </Link>
      </div>
    );
  }

  // Helper variables to prevent crashing if some fields are undefined
  const titulo = game.juego?.titulo || "Juego Sin Título"
  const descripcion = game.juego?.descripcion || "Sin descripción disponible."
  const plataforma = game.juego?.plataforma || "Todas"
  const genero = game.juego?.genero || "General"
  const portada = game.juego?.portada_url
  
  // @ts-ignore - Guardado flexible previo
  const fecha_inicio = game.fecha_inicio || "Desconocida"
  // @ts-ignore
  const hora_inicio = game.hora_inicio || "Desconocida"

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/games">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Badge variant="success" className="uppercase">{game.estado}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <AddToWishlistButton gameId={game.id_juego} />
          <Button variant="outline" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar/Cover Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="aspect-[3/4] w-full bg-card-bg rounded-xl relative overflow-hidden ring-1 ring-border-color">
             <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/20 to-transparent mix-blend-overlay z-10"></div>
             {portada ? (
               <img src={portada} alt="Portada" className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-20">
                 <span className="font-bold text-2xl text-foreground opacity-50">{titulo}</span>
               </div>
             )}
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-xs text-soft font-medium uppercase tracking-wider mb-1">Horas Jugadas</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-violet-400" />
                    <span className="text-2xl font-bold">{game.horas_jugadas || 0}</span>
                  </div>
                  {game.steam_appid && userData?.steamId && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-electric-blue hover:bg-electric-blue/10"
                      onClick={handleSyncSteam}
                      disabled={syncing}
                      title="Sincronizar horas con Steam"
                    >
                      <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-xs text-soft font-medium uppercase tracking-wider mb-1">Inicio de la Partida</p>
                <p className="text-sm font-medium text-foreground">{fecha_inicio} - {hora_inicio}</p>
              </div>
              
              <div>
                <p className="text-xs text-soft font-medium uppercase tracking-wider mb-1">Plataforma & Género</p>
                <p className="text-sm font-medium text-foreground">{plataforma}</p>
                <p className="text-sm text-muted">{genero}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-2">{titulo}</h1>
            <p className="text-lg text-muted leading-relaxed">{descripcion}</p>
          </div>

          {game.motivo_estado && (game.estado === 'pausado' || game.estado === 'abandonado') && (
            <div className={`p-4 rounded-xl border flex gap-4 items-start ${
              game.estado === 'pausado' 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-200'
            }`}>
              <div className={`mt-1 p-1.5 rounded-lg ${
                game.estado === 'pausado' ? 'bg-amber-500/20' : 'bg-rose-500/20'
              }`}>
                <Edit className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">
                  Motivo de {game.estado}
                </p>
                <p className="text-sm font-medium italic">"{game.motivo_estado}"</p>
              </div>
            </div>
          )}

          {/* Progreso */}
          <Card className="bg-card-bg border-border-color">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-electric-blue" /> Progreso General
                  </h3>
                  <span className="text-xl font-bold text-electric-blue">{game.progreso || 0}%</span>
               </div>
               <div className="h-2 w-full bg-card-bg rounded-full overflow-hidden mt-2 border border-border-color">
                  <div 
                    className="h-full bg-electric-blue rounded-full shadow-[0_0_10px_var(--color-electric-blue)]" 
                    style={{ width: `${game.progreso || 0}%` }}
                  />
               </div>
            </CardContent>
          </Card>

          {/* Pestañas */}
          <div className="flex gap-1 border-b border-border-color">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-electric-blue text-electric-blue' : 'border-transparent text-muted hover:text-foreground'}`}
            >
              Resumen
            </button>
            <button 
              onClick={() => setActiveTab('diary')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'diary' ? 'border-electric-blue text-electric-blue' : 'border-transparent text-muted hover:text-foreground'}`}
            >
              Diario ({diaryEntries.length})
            </button>
            <button 
              onClick={() => setActiveTab('review')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'review' ? 'border-electric-blue text-electric-blue' : 'border-transparent text-muted hover:text-foreground'}`}
            >
              Evaluación final
            </button>
          </div>

          <div className="py-2">
            {activeTab === 'overview' && (
               <div className="text-muted text-sm">
                 <p>Estás jugando actualmente a este título. Sigue actualizando el progreso y añadiendo entradas al diario para llevar un mejor registro de tu aventura.</p>
               </div>
            )}
            {activeTab === 'diary' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-foreground">Entradas del Diario</h4>
                  <Link href="/diary/new">
                    <Button size="sm" variant="outline" className="gap-2">
                      <BookText className="h-4 w-4" /> Añadir Entrada
                    </Button>
                  </Link>
                </div>
                {diaryEntries.length === 0 ? (
                  <div className="text-muted text-sm py-4">No hay entradas en el diario para este juego.</div>
                ) : (
                  diaryEntries.map((entry, i) => (
                    <Card key={entry.id || i} className="bg-card-bg group">
                      <CardContent className="p-4 relative">
                        <div className="flex justify-between items-start mb-2 border-b border-border-color pb-2">
                          <p className="text-xs text-muted font-medium bg-black/5 dark:bg-white/5 px-2 py-1 rounded w-fit">{entry.fecha}</p>
                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setEditingDiaryEntry(entry)} 
                              className="p-1.5 hover:bg-amber-500/20 text-muted hover:text-amber-400 rounded transition-colors"
                              title="Editar entrada"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => entry.id && handleDeleteDiary(entry.id)} 
                              className="p-1.5 hover:bg-rose-500/20 text-muted hover:text-rose-400 rounded transition-colors"
                              title="Eliminar entrada"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-foreground italic whitespace-pre-wrap mt-2">"{entry.contenido}"</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
            {activeTab === 'review' && (
              <div className="p-6 rounded-xl border border-dashed border-border-color text-center">
                 <Trophy className="h-10 w-10 text-muted mx-auto mb-3" />
                 <h4 className="text-foreground font-medium mb-1">Aún no has terminado este juego</h4>
                 <p className="text-sm text-muted">Termínalo para poder evaluarlo en sus diferentes apartados.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <EditGameModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        game={game} 
        onSaved={() => {
          // Recargar la pagina para ver los cambios
          window.location.reload()
        }}
      />
      {editingDiaryEntry && (
        <EditDiaryModal
          isOpen={true}
          entry={editingDiaryEntry}
          onClose={() => setEditingDiaryEntry(null)}
          onSaved={() => {
             // Refresh entries
             if (game?.id) {
               getGameDiary(game.id).then(setDiaryEntries);
             }
             setEditingDiaryEntry(null);
          }}
        />
      )}
    </div>
  )
}
