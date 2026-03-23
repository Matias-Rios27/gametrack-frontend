import { PlusCircle, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

// Mock data
const games = [
  { id: 1, title: "The Legend of Zelda: Tears of the Kingdom", platform: "Nintendo Switch", genre: "Aventura", status: "jugando", progress: 60, hours: 45 },
  { id: 2, title: "Elden Ring", platform: "PC", genre: "RPG", status: "completado", progress: 100, hours: 120 },
  { id: 3, title: "Hollow Knight", platform: "PC", genre: "Metroidvania", status: "pausado", progress: 30, hours: 15 },
  { id: 4, title: "Cyberpunk 2077", platform: "PS5", genre: "RPG", status: "abandonado", progress: 10, hours: 5 },
  { id: 5, title: "Baldur's Gate 3", platform: "PC", genre: "RPG", status: "jugando", progress: 85, hours: 90 },
]

export default function GamesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Juegos</h1>
          <p className="text-slate-400">Gestiona tu colección y seguimiento de progreso.</p>
        </div>
        <Link href="/games/add">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Añadir Juego
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input placeholder="Buscar juegos..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2 shrink-0">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link href={`/games/${game.id}`} key={game.id} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl">
            <Card className="h-full overflow-hidden border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-violet-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="h-32 bg-slate-800 relative w-full overflow-hidden">
                {/* Placeholder cover pattern */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/60 to-slate-900/60 mix-blend-overlay"></div>
                <div className="absolute bottom-3 left-4 flex gap-2">
                  <Badge 
                    variant={
                      game.status === 'jugando' ? 'success' : 
                      game.status === 'completado' ? 'info' : 
                      game.status === 'pausado' ? 'warning' : 'danger'
                    }
                    className="capitalize shadow-sm backdrop-blur-md bg-opacity-90"
                  >
                    {game.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg text-slate-100 group-hover:text-violet-400 transition-colors line-clamp-1">{game.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <span>{game.platform}</span>
                  <span>•</span>
                  <span>{game.genre}</span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Progreso</span>
                    <span className="font-medium">{game.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 rounded-full" 
                      style={{ width: `${game.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="mt-4 text-xs font-medium text-slate-500 text-right">
                  {game.hours} hrs jugadas
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
