import { Gamepad2, Trophy, Clock, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-slate-400">Bienvenido de vuelta. Aquí está el resumen de tu backlog.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-violet-900/40 to-slate-900/40 border-violet-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-violet-200">Juegos Completados</CardTitle>
            <Trophy className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">12</div>
            <p className="text-xs text-violet-300/70 mt-1">+2 este mes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-200">Jugando Actualmente</CardTitle>
            <Gamepad2 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">3</div>
            <p className="text-xs text-emerald-300/70 mt-1">Activos esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Horas Totales</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">342</div>
            <p className="text-xs text-blue-300/70 mt-1">Registradas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900/40 to-slate-900/40 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-200">Racha Actual</CardTitle>
            <Flame className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">5 Días</div>
            <p className="text-xs text-amber-300/70 mt-1">Sigue así!</p>
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
            {/* Ejemplo Juego 1 */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800">
              <div className="h-16 w-12 rounded bg-slate-800 flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 opacity-20"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-slate-100 truncate">Hades II</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="success">Jugando</Badge>
                  <span className="text-xs text-slate-400">PC</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-200">12 hrs</div>
                <div className="text-xs text-slate-500 mt-1">75% Progreso</div>
              </div>
            </div>

            {/* Ejemplo Juego 2 */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800">
              <div className="h-16 w-12 rounded bg-slate-800 flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-600 opacity-20"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-slate-100 truncate">Hollow Knight: Silksong</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="success">Jugando</Badge>
                  <span className="text-xs text-slate-400">Nintendo Switch</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-200">5 hrs</div>
                <div className="text-xs text-slate-500 mt-1">20% Progreso</div>
              </div>
            </div>
            
            <Link href="/games">
              <Button variant="outline" className="w-full mt-2">Ver Todos</Button>
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
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                <Heart className="h-4 w-4 text-rose-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Elden Ring: Shadow of the Erdtree</p>
                <p className="text-xs text-slate-500">Alta Prioridad</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                <Heart className="h-4 w-4 text-rose-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Zelda: Echoes of Wisdom</p>
                <p className="text-xs text-slate-500">Alta Prioridad</p>
              </div>
            </div>
            
            <Link href="/wishlist">
              <Button variant="ghost" className="w-full mt-4">Ir a Wishlist</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Para usar iconos dentro del componente sin tener que importarlos todos arriba
import { Heart } from "lucide-react";
